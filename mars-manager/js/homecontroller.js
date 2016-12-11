myApp.controller('HomeController', ["$scope", "$state", "$http", "$cookies", "user", "statics",

  function($scope, $state, $http, $cookies, user, statics) {

    // DO NOT MODIFY THIS
    var hascookie = function() {

      if ($cookies.get('mars-cookie') && user.isuserset()) {
        return true;
      }
      else {
        $state.go('login');
      }
    }

    console.log('home');

    if (! statics.hasdonesplash) {

      $scope.showsplash = true;

      setTimeout(function() {
          $scope.showsplash = false;
          $scope.$apply();
      }, 3000);

      statics.hasdonesplash = true;
    }


    // find API url
    var pathname = window.location.pathname;
    if (pathname.charAt(0) === '/')
      pathname = pathname.substring(1);

    var pathArray = pathname.split( '/' );

    var newPathname = "";
    for (i = 0; i < (pathArray.length) - 2; i++) {
      newPathname += "/";
      newPathname += pathArray[i];
    }

    statics.apiUrl = window.location.protocol + "//" + window.location.host
      + newPathname + "/mars-server/serverapi.php";
    // special URLs
    statics.rootUrl = window.location.protocol + "//" + window.location.host
      + newPathname + "/mars-server/";
    statics.quizUrl = window.location.protocol + "//" + window.location.host
        + newPathname + "/mars-client";


    console.log('host:' + window.location.host);
    console.log('url:' + statics.apiUrl);

    // DO NOT MODIFY THIS
    hascookie();

    window.document.title = "MARS - home";


  }
]);
