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
    element = $compile('<h1 ng-model="myModel" edit-callback="onEdit" content-editable></h1>')(scope);
    scope.$digest();
  });

  it('should init the viewValue with ngModel', function() {
    expect(element.html()).toContain("Text to be modified.");
  });

  it("should set contenteditable on click", function () {
    element.triggerHandler('click');
    scope.$digest();
    expect(element.attr('contenteditable')).toBe('true');
  });

  it("should fire a edit callback", function () {
    element.triggerHandler('click');
    element.html('Some random text.');
    element.triggerHandler('blur');
    scope.$digest();
    expect(scope.onEdit).toHaveBeenCalled();
  });

});
