# angular-content-editable
angular directive for modify in real time any html tag you want

##### Directive attributes:
  * __single-line__: if set to true makes the enter key save and blur
  * __focus-select__: if set to true when element goes to focus, all the text inside will be selected
  * __render-html__: if set to true allow the text passed as input to be compiled and rendered
  * __edit-callback__: a callback that is called wherever the model value is changed

Note that, __edit-callback__ has two arguments:
  * text: the new text inside the element
  * elem: the element that has been modified

## Example basic:
Simply adding the directive makes the element fully editable.
```html
<h2 content-editable>Change me if you like.</h2>
```
With __single-line__ attribute, when enter key is pressed the editing will finish (no line-breaks):
```html
<div single-line="true" content-editable>Change me anyway.</div>
```

With __focus-select__ all text content will be selected on element click or focus.
```html
<span focus-select="true" content-editable>Change me!</span>
```
With __edit-callback__ attribute if you passed a valid function it will run every time the model value is changed.
```html
<span focus-select="true" edit-callback="myFunc" content-editable>Change me!</span>
```
```javascript
angular.module('myApp')
  .controller(function($scope) {

    $scope.myFunc = function(text, elem) {
      // do something magic
    }

  })
```
