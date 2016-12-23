myApp.controller('SessionController', ["$scope", "$state",
  "$http", "user", "statics",

  function($scope, $state, $http, user, statics) {

    $scope.statusButtonHandler = function(status) {

      // $scope.setStatus(status);
      // statics.status = status;
      console.log('statusButtonHandler in ' + statics.session.mode + ' mode')
      if (statics.session.mode == 'group') {
        $state.go('groupsession');
      } else if (statics.session.mode == 'normal') {
        $scope.setStatus(status);
        statics.status = status;
      }
    }

    $scope.setStatus = function(status) {

      parms = {
        task : 'setstatus',
        status : status,
        sessionid : statics.session.id
      }

      console.log('sessioncontroller : setting status ******************** ' + status);

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
            alert('Network error :-(');
          }
        );
    }

    deletesession = function(sessionid) {

      parms = {
        task : 'deletesession',
        sessionid : sessionid
      }

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
            alert('Network error :-(');
          }
        );
    }

    // $scope.cancelbuttonhandler = function() {
    //   $scope.setStatus('cancelled');
    //   statics.status = 'cancelled';
    //   deletesession(statics.sessionid);
    //   statics.showheader = true;
    //   $state.go('polls');
    // }

    $scope.closebuttonhandler = function() {
      $scope.setStatus('cancelled');
      statics.showheader = true;
      $state.go('sessionlist');
    }

    $scope.homebuttonhandler = function() {
      statics.showheader = true;
      $state.go('home');
    }

    console.log('sessioncontroller, poll ' + statics.pollid);
    //statics.showstatics();

    user.verifyuser();
    // will go to login

    statics.showheader = false;

    $scope.statics = statics;

    window.document.title = "MARS - session";

    $scope.setStatus('waiting');
    statics.status = 'waiting';

    console.log('sessioncontroller : mode : ' + statics.session.mode);
    //statics.showstatics();

  }

]);
