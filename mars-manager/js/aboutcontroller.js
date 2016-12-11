myApp.controller('AboutController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {

    $scope.buttonhandler = function() {

      $scope.showit = false;
      $state.go('home');

    }

    console.log('about');
    $scope.statics = statics;

    $scope.showit = true;
    window.document.title = "MARS - about";



  }
]);
