# angular-content-editable
angular directive for modify in real time any html tag you want

#####Directive attributes: 
  * single-line: if set to true make Enter Key save edit
  * focus-select: if set to true when element goes to focus the text inside will be selected all
  * render-html: if set to true allow the text passed as input to be compiled and rendered (__work in progress__)
  * edit-callback: a callback that is called wherever the ngModel is changed successfully through the directive

Note that, __edit-callback__ has two arguments: 
  * text: the new text inside the element
  * elem: the element that has been modified

Example basic:
```html
<h2 content-editable>Change me if you like.</h2>
```
Example single line:
```html
<div single-line="true" content-editable>Change me if you like.</div>
```
Example focus all text on click and after change run callback:
```html
<span focus-select="true" edit-callback="myFunc" content-editable>Change me if you like.</span>
```
```javascript
angular.module('myApp')
  .controller(function($scope) {
    $scope.myFunc = function(text, elem) {
      // do something magic
    }
  })
```

How to does it work more in details? Coming soon..
