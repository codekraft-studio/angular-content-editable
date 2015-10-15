angular.module('app')

.directive('contentEditable', contentEditable)

contentEditable.$inject = ['$log','$sce','$compile','$window']

function contentEditable($log,$sce,$compile,$window) {

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
    // set his value to elem content
    if( !scope.ngModel ) {
      ngModel.$setViewValue(elem.html())
    }

    // render with:
    // model view value or elem value
    ngModel.$render = function() {
      elem.html( ngModel.$viewValue || elem.html() )
    }

    // make editable and focus
    elem.bind('click', function(e) {
      e.preventDefault()
      elem.attr('contenteditable', 'true')
      elem[0].focus()
    })

    // focus function
    elem.bind('focus', function(e) {

      // set validity to true
      // this is for custom behaviours
      ngModel.$valid = true

      // select all on focus
      if( attrs.focusSelect ) {
        var range = $window.document.createRange()
        range.selectNodeContents(elem[0])
        $window.getSelection().addRange(range)
      }

      // if render-html is enabled convert to plaintext
      // in order to modify html tags
      if( attrs.renderHtml ) {
        var content = elem.html()
        elem[0].textContent = content
      }

    })

    // make not editable and lose focus
    elem.bind('blur', function() {

      var html;

      // remove attribute
      elem.attr('contenteditable', 'false')

      // if render html attribute is enabled
      if( attrs.renderHtml && ngModel.$valid ) {
        // get plain text html (with html tags)
        // (replace blank spaces)
        html = elem[0].textContent.replace(/\u00a0/g, " ")
        // update elem html value
        elem.html(html)

      } else {
        // clear text content
        html = elem.html().replace(/<div>/g, '').replace(/&nbsp;/g, ' ').replace(/<\/div>/g, '');
      }

      // if element is different from his model
      // and a callback isdefined run it
      if( html != ngModel.$modelValue && scope.editCallback ) {
        // pass to callback values: current text and element
        scope.editCallback(html, elem)
      }

      // set ngModel view value
      ngModel.$setViewValue(html)
    })

    // bind esc and enter keys
    elem.bind('keydown', function(e) {

      // tab key: trigger blur event
      if(e.which == 9) {
        return elem[0].blur()
      }

      // esc key: rollback and blur
      if(e.which == 27) {
        ngModel.$rollbackViewValue()
        // set pristine state
        // (alter renderHtml behaviours)
        ngModel.$valid = false
        return elem[0].blur()
      }

      // enter key: simple blur
      if(e.which == 13 && attrs.singleLine) {
        return elem[0].blur()
      }

    })

  }

}
