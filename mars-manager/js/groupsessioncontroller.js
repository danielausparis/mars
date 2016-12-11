myApp.controller('GroupSessionController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {

    $scope.participants = 0;

    $scope.setStatus = function(status) {

      parms = {
        task : 'setstatus',
        status : status
      }

      console.log('groupsessioncontroller : setstatus ******************** ' + status);

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur setStatus : ' + response.data.text);
            }
            else {
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }


    getPollenv = function() {

      parms = {
        task : 'getpollenv'
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            // this callback will be called asynchronously
            // when the response is available
            //alert(JSON.stringify(response, null, 4));
            if (response.data.error) {
              alert('Erreur getpollenv: ' + response.data.text);
            }
            else {
              statics.pollid = response.data.pollid;
              statics.polltitle = response.data.polltitle;
              $scope.polltitle = response.data.polltitle;
              statics.sessionid = response.data.sessionid;
              $scope.sessionid = response.data.sessionid;
              statics.secret = response.data.secret;
              $scope.secret = response.data.secret;
            }
          },
          function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    console.log('groupsessioncontroller, session, poll ' + statics.pollid);

    user.verifyuser();

    $scope.statics = statics;

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
    console.log('host:' + window.location.host);
    console.log('url:' + statics.apiUrl);

    $scope.quizUrl = window.location.protocol + "//" + window.location.host
      + newPathname + "/mars-client";

    getPollenv();

  }

]);
