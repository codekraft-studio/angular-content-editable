angular.module('angular-content-editable')

.directive('contentEditable', function ($log, $sce, $parse, $window, contentEditable) {

  var directive = {
    restrict: 'A',
    require: 'ngModel',
    scope: { editCallback: '&?', isEditing: '=?', stripReplace: '=?' },
    link: _link
  };

  return directive;

  function _link(scope, elem, attrs, ngModel) {

    // return if ng model not specified
    if(!ngModel) {
      $log.warn('Error: ngModel is required in elem: ', elem);
      return;
    }

    var noEscape = true, originalElement = elem[0], callback, stripReplace;

    // get default usage options
    var options = angular.copy(contentEditable);

    // update options with attributes
    angular.forEach(options, function (val, key) {
      if( key in attrs ) {
        options[key] = $parse(attrs[key])(scope);
      }
    });

    // Get the callback from item scope or global defined
    callback = scope.editCallback || options.editCallback;

    // Get the strip tags option from item scope or global defined
    stripReplace = scope.stripReplace || options.stripReplace;

    // add editable class
    attrs.$addClass(options.editableClass);

    scope.$watch('isEditing', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue) {
          originalElement.click();
        } else {
          originalElement.blur();
        }
      }
    });

    // render always with model value
    ngModel.$render = function() {
      elem.html( ngModel.$modelValue || elem.html() );
    };

    // handle click on element
    function onClick(e) {
      e.preventDefault();
      attrs.$set('contenteditable', 'true');
      attrs.$addClass('active');
      originalElement.focus();
    }

    // check some option extra
    // conditions during focus
    function onFocus(e) {

      scope.isEditing = true;

      // evalAsync in case a digest is already in progress (e.g. changing isEditing to true)
      scope.$evalAsync(function() {

        // Ensure editing is still enabled before proceeding (prevents hang in IE11)
        if (!scope.isEditing) {
          return;
        }

        // turn on the flag
        noEscape = true;

        // select all on focus
        if( options.focusSelect ) {
          var range = $window.document.createRange();
          var selection = $window.getSelection();
          range.selectNodeContents( originalElement );
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // if render-html is enabled convert
        // all text content to plaintext
        // in order to modify html tags
        if( options.renderHtml ) {
          originalElement.textContent = elem.html();
        }

      });

    }

    function onBlur(e) {

      scope.isEditing = false;

      scope.$apply(function() {

        // the text
        var html;

        // Ensure editing is still disabled before proceeding (prevents hang in IE11)
        if (scope.isEditing) {
          return;
        }

        // remove active class when editing is over
        attrs.$removeClass('active');

        // disable editability
        attrs.$set('contenteditable', 'false');

        // if text needs to be rendered as html
        if( options.renderHtml && noEscape ) {
          // get plain text html (with html tags)
          // replace all blank spaces
          html = originalElement.textContent.replace(/\u00a0/g, " ");
          // update elem html value
          elem.html(html);

        } else {
          // get element content replacing html tag
          html = elem.html().replace(/&nbsp;/g, ' ');
        }

        // if element value is different from model value
        if( html != ngModel.$modelValue ) {

          // if user defined strip-replace variable
          if( stripReplace ){
            if( angular.isString(stripReplace) ) {
              // if stripReplace is a string create new RegExp with gi (global, ignore case)
              html = html.replace( new RegExp( stripReplace, 'g' ), '' );
            }else if( angular.isArray(stripReplace) ){
              // if stripReplace is an array create new RegExp from array values
              // get values from array or set default
              var e = stripReplace[0] || '', r = stripReplace[1] || '', f = stripReplace[2] || 'g';
              html = html.replace( new RegExp( e, f ), r );
            }else{
              // if stripReplace is set to "true", remove all html tags and new line breaks
              html = html.replace(/(<([^>]+)>)/ig, '').replace(/\r?\n|\r/g, '');
            }
            // update elem html value
            elem.html(html);
          }

          /**
          * This method should be called
          * when a controller wants to
          * change the view value
          */
          ngModel.$setViewValue(html);

          // if user passed a variable
          // and is a function
          if( callback && angular.isFunction(callback) ) {

            // run the callback with arguments: current text and element
            return callback({
              text: html,
              elem: elem
            });

          }

        }

      });

    }

    function onKeyDown(e) {

      // on tab key blur and
      // TODO: focus to next
      if( e.which == 9 ) {
        originalElement.blur();
        return;
      }

      // on esc key roll back value and blur
      if( e.which == 27 ) {
        ngModel.$rollbackViewValue();
        noEscape = false;
        return originalElement.blur();
      }

      // if single line or ctrl key is
      // pressed trigger the blur event
      if( e.which == 13 && (options.singleLine || e.ctrlKey) ) {
        return originalElement.blur();
      }

    }

    /**
    * On click turn the element
    * to editable and focus it
    */
    elem.on('click', onClick);

    /**
    * On element focus
    */
    elem.on('focus', onFocus);

    /**
    * On element blur turn off
    * editable mode, if HTML, render
    * update model value and run callback
    * if specified
    */
    elem.on('blur', onBlur);

    /**
    * Bind the keydown event for many functions
    */
    elem.on('keydown', onKeyDown);

    /**
    * On element destroy, remove all event
    * listeners related to the directive
    * (helps to prevent memory leaks)
    */
    scope.$on('$destroy', function () {
      elem.off('click', onClick);
      elem.off('focus', onFocus);
      elem.off('blur', onBlur);
      elem.off('keydown', onKeyDown);
    });

  }

});
