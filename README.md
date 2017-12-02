# angular-content-editable
angular directive for modify in real time any html tag you want

### [DEMO](http://codekraft-studio.github.io/angular-content-editable/)

## Getting started:
Download the package using npm:
```bash
npm install angular-content-editable
```

Download the package using bower:
```bash
bower install angular-content-editable
```

or directly from github.

Add the script to your page dependencies:
```html
<script type="text/javascript" src="angular-content-editable.min.js"></script>
```
And finally add __content-editable__ to your module dependencies:
```javascript
angular.module('app', ['angular-content-editable'])
```
and you are ready to go, add the directive to any element you want:
```html
<a href="#!" ng-model="myModel" content-editable>edit my text</a>
```

---

## Directive attributes:
  * __single-line__: if set to true makes the enter key save and blur
  * __focus-select__: if set to true when element goes to focus, all the text inside will be selected
  * __render-html__: if set to true allow the text passed as input to be compiled and rendered
  * __edit-callback__: a callback that is called wherever the model value is changed
  * __is-editing__: optional argument that can be used to programatically enable/disable the editor
  * __strip-replace__: optional argument that can be `true` to remove all HTML tags and line breaks, `string` to remove or custom regular `expression`, or array with `expression` to match with `replacement` to and `flags` use: `['expression','replacement','flags']`

Note that, __edit-callback__ has two arguments, that you must specify in your template to use them:
 * __text__: the new text inside the element
 * __elem__: the element that has been modified

#### Example:
```html
<div ng-model="myModel" edit-callback="myFunc(text, elem)" content-editable>
  Some content
</div>
```

---

## Customizations:
You can use the __contentEditableProvider__ to set the default settings for the directive, but you can always pass directly to the directive as attributes to override the defaults for that element.
```javascript
angular.module('app')
  .config(function(contentEditableProvider) {

    contentEditableProvider.configure({
      singleLine: true // single line for all elements
    })

  })
```

---

## Example basic:
Simply adding the directive makes the element fully editable.
```html
<h2 ng-model="myModel" content-editable>Change me if you like.</h2>
```
With __single-line__ attribute, when enter key is pressed the editing will finish (no line-breaks):
```html
<div single-line="true" ng-model="myModel" content-editable>Change me anyway.</div>
```

With __focus-select__ all text content will be selected on element click or focus.
```html
<span focus-select="true" ng-model="myModel" content-editable>Change me!</span>
```

With __strip-replace__ attribute set as `boolean`:
```html
<!-- boolean: removes all HTML tags and line breaks -->
<span focus-select="true" ng-model="myModel" strip-replace="true" content-editable>Change me!<br><b>I will become clear text without formating</b></span>
```

With __strip-replace__ attribute set as `array`:
```html
<!-- array: creates new RegExp() from array ['string / regular expression','replace with','expression flags'] -->
<span focus-select="true" ng-model="myModel" strip-replace="[' ','-','gi']" content-editable>Change me!</span>
```

If you want to run a callback you must use __edit-callback__ attribute with a valid function and it will run every time the model value is __changed__.

Since version __1.2.0__, after issue [#13](https://github.com/codekraft-studio/angular-content-editable/issues/13) you __MUST__ specify the arguments `text, elem` if you want to use them in your callback, like in this example.
```html
<span focus-select="true" edit-callback="myFunc(text, elem)" ng-model="myModel" content-editable>Change me!</span>
```
```javascript
angular.module('myApp')
  .controller(function($scope) {

    $scope.myFunc = function(text, elem) {
      // do something magic
    }

  })
```

---

This gives the ability to __pass additional arguments__ to the callback, because is executed with the parent scope.

## Development:
If you want to fork you copy of the project and modify it:
```text
npm install angular-content-editable // install module files
npm install // install dependencies
```
Than a Gruntfile is ready with this actions:
```text
grunt         // watch to /src folder and rebuild the package
grunt build   // build the package for distribution
```

---

## Contributing

1. Create an issue and describe your idea
2. Fork the project (https://github.com/codekraft-studio/angular-content-editable/fork)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Get the development environment set up (`npm install`)
5. Commit your changes (`git commit -am 'Add some feature'`)
6. Add some test for your new feature (`npm test`)
7. Build the directive with the new changes (`grunt build`)
8. Publish the branch (`git push origin my-new-feature`)
9. Create a new Pull Request
