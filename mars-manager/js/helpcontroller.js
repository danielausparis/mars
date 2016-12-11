myApp.controller('HelpController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {

    console.log('help');
    $scope.statics = statics;

    $scope.showit = true;
    window.document.title = "MARS - help";
     
    // var timestamp = Date.getTime();
    // $scope.url = 'doc/docmars.html?t=' + timestamp;

  }
]);
