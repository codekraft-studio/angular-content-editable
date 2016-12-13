# angular-content-editable
angular directive for modify in real time any html tag you want

### [DEMO](http://www.codekraft.it/demos/angular-content-editable/)

## Getting started:
Download the package using npm:
```bash
npm install angular-content-editable
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
<a href="!#" ng-model="myModel" content-editable>edit my text</a>
```

---

### Directive attributes:
  * __single-line__: if set to true makes the enter key save and blur
  * __focus-select__: if set to true when element goes to focus, all the text inside will be selected
  * __render-html__: if set to true allow the text passed as input to be compiled and rendered
  * __edit-callback__: a callback that is called wherever the model value is changed

Note that, __edit-callback__ has two arguments:
 * __text__: the new text inside the element
 * __elem__: the element that has been modified

---

### Customizations:
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

### Example basic:
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
With __edit-callback__ attribute if you passed a valid function it will run every time the model value is changed.
```html
<span focus-select="true" edit-callback="myFunc" ng-model="myModel" content-editable>Change me!</span>
```
```javascript
angular.module('myApp')
  .controller(function($scope) {

    $scope.myFunc = function(text, elem) {
      // do something magic
    }

  })
```

### Development:
If you want to fork you copy of the project and modify it:
```bash
npm install angular-content-editable // install module files
npm install // install dependencies
```
Than a Gruntfile is ready with this actions:
```bash
grunt   // build the package
grunt watch   // watch to /src folder and rebuild the package
```
