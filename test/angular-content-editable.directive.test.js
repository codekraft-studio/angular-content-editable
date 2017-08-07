describe("Angular Content Editable: Directive", function () {

  var $log;
  var $compile;
  var $rootScope;
  var scope;
  var element;

  beforeEach(module('angular-content-editable'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$log_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $log = _$log_;
  }));

  beforeEach(function () {
    scope = $rootScope.$new();
    scope.myModel = 'Text to be modified.';
    scope.onEdit = jasmine.createSpy('onEdit');
    scope.isEditing = false;
    element = angular.element('<h1 ng-model="myModel" edit-callback="onEdit(\'extraArg\', text, elem)" is-editing="isEditing" content-editable></h1>');
    $compile(element)(scope);
    scope.$digest();
  });

  it('should init the viewValue with ngModel', function() {
    expect(element.html()).toContain("Text to be modified.");
  });

  it('should set contenteditable on click', function () {
    expect(element.attr('contenteditable')).toBeUndefined();
    element.triggerHandler('click');
    scope.$digest();
    expect(element.attr('contenteditable')).toBe('true');
  });

  it('should fire an edit callback with the correct arguments', function () {
    element.triggerHandler('click');
    element.html('Some random text.');
    element.triggerHandler('blur');
    scope.$digest();
    expect(scope.onEdit).toHaveBeenCalledWith('extraArg', 'Some random text.', element);
  });

  it('should enable editing programatically using isEditing', function () {
    expect(element.attr('contenteditable')).toBeUndefined();
    scope.isEditing = true;
    scope.$digest();
    expect(element.attr('contenteditable')).toBe('true');
    element.triggerHandler('blur');
    scope.$digest();
    expect(scope.isEditing).toBe(false);
  });
});
