angular.module('content-editable', [])

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
      $log.warn('Error: ngModel is required in elem: ', elem);
      return;
    }

    var noEscape = true;

    // add default class
    elem.addClass('content-editable');

    // if model is invalid or null
    // fill his value with elem html content
    if( !scope.ngModel ) {
      ngModel.$setViewValue( elem.html() );
    }

    ngModel.$render = function() {
      // render always with model value
      elem.html( ngModel.$modelValue )
    }

    /**
     * On click turn the element
     * to editable and focus it
     */
    elem.bind('click', function(e) {
      e.preventDefault();
      elem.attr('contenteditable', 'true');
      return elem[0].focus();
    })

    /**
     * On element focus
     */
    elem.bind('focus', function(e) {

      noEscape = true;

      // select all on focus
      if( attrs.focusSelect ) {
        var range = $window.document.createRange()
        range.selectNodeContents(elem[0])
        $window.getSelection().addRange(range)
      }

      // if render-html is enabled convert
      // all text content to plaintext
      // in order to modify html tags
      if( attrs.renderHtml ) {
        elem[0].textContent = elem.html();
      }

    })

    /**
     * On element blur turn off
     * editable mode, if HTML, render
     * update model value and run callback
     * if specified
     */
    elem.bind('blur', function() {

      var html;

      elem.attr('contenteditable', 'false')

      // if text needs to be rendered as html
      if( attrs.renderHtml && noEscape ) {

        console.log(noEscape);
        // get plain text html (with html tags)
        // replace all blank spaces
        html = elem[0].textContent.replace(/\u00a0/g, " ")
        // update elem html value
        elem.html(html)

      } else {

        // get element content replacing html tag
        html = elem.html().replace(/<div>/g, '').replace(/&nbsp;/g, ' ').replace(/<\/div>/g, '');
      }

      // if element value is
      // different from model value
      if( html != ngModel.$modelValue ) {

        /**
         * This method should be called
         * when a control wants to
         * change the view value
         */
        ngModel.$setViewValue(html)

        // if user passed a valid callback
        if( scope.editCallback && angular.isFunction(scope.editCallback) ) {
          // apply the callback
          // passing: current text and element
          return scope.$apply( scope.editCallback(html, elem) );
        }

      }

    })

    // bind esc and enter keys
    elem.bind('keydown', function(e) {

      // on tab key blur and
      // TODO: focus to next
      if(e.which == 9) {
        return elem[0].blur();
      }

      // on esc key roll back value and blur
      if(e.which == 27) {
        ngModel.$rollbackViewValue();
        noEscape = false;
        return elem[0].blur();
      }

      // if single line blur or enter key
      if(e.which == 13 && attrs.singleLine) {
        return elem[0].blur();
      }

    })

  }

}
