myApp.controller('HeaderController',
   ["$scope", "$state", "$http", "$cookies", "user", "statics",

  function($scope, $state, $http, $cookies, user, statics) {

    $scope.logoutbuttonhandler = function() {

      user.unsetuser();

      // force reload
      // http://stackoverflow.com/questions/21714655/reloading-current-state-refresh-data
      $state.go('home', $state.params, {reload: true, inherit: false});

    }

    $scope.useradminbuttonhandler = function() {

      $state.go('useradmin');
      
    }

    $scope.isuserset = function() {
      return user.isuserset();
    }

    $scope.getnick = function() {
      return user.getnick();
    }

    $scope.statics = statics;

    console.log('header ' + statics.showheader);

  }
]);
