angular.module('app', [])

  .controller('mainCtrl', function($scope) {

    $scope.exitCallback = function(text, elem) {
      console.log(text, elem);
      alert('callback dude!');
    }

  })
