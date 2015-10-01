angular.module('app')

.directive('contentEditable', contentEditable)

contentEditable.$inject = ['$log','$sce','$window']

function contentEditable($log,$sce,$window) {

  var directive = {
    restrict: 'A',
    require: '?ngModel',
    scope: { editCallback: '=', ngModel: '=' },
    link: _link
  }

  return directive;

  function _link(scope, elem, attrs, ngModel) {

    // return if ng model not specified
    if(!ngModel) {
      $log.warn('Error: ngModel is required in elem: ', elem)
      return
    }

    // if model is invalid or null
    if( !scope.ngModel ) {
      ngModel.$setViewValue(elem.html())
    }

    // render with:
    // model value or elem value
    ngModel.$render = function() {
      elem.html(ngModel.$viewValue || elem.html() )
    }

    // make editable and focus
    elem.bind('click', function(e) {
      e.preventDefault()
      elem.attr('contenteditable', 'true')
      elem[0].focus()
    })

    // focus function
    elem.bind('focus', function(e) {
      // select all on focus
      if( attrs.focusSelect ) {
        var range = $window.document.createRange()
        range.selectNodeContents(elem[0])
        $window.getSelection().addRange(range)
      }
    })

    // make not editable and lose focus
    elem.bind('blur', function() {
      // remove attribute
      elem.attr('contenteditable', 'false')
      // get text content
      var html = elem.html().replace(/<div>/g, '').replace(/&nbsp;/g, ' ').replace(/<\/div>/g, '');
      // if modified and callback is defined
      if( html != ngModel.$modelValue && scope.editCallback ) {
        // pass to callback: current text and element
        scope.editCallback(html, elem)
      }
      ngModel.$setViewValue(html)
    })

    // bind esc and enter keys
    elem.bind('keydown', function(e) {
      // esc key: rollback and blur
      if(e.which == 27) {
        ngModel.$rollbackViewValue()
        return elem[0].blur()
      }
      // enter key: simple blur
      if(e.which == 13 && attrs.singleLine) { return elem[0].blur() }
    })

  }

}
