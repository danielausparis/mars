myApp.controller('SessionListController', ["$scope", "$state",
  "$http", "user", "statics",

  function($scope, $state, $http, user, statics) {


    var getsessions = function(userid) {

      parms = {
        task : 'getsessions',
        userid : userid || 0
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('getsession error : ' + response.data.text);
            }
            else {
              $scope.sessions = response.data.data;
            }
          },
          function(response) {
            alert('Network error :-(');
          }
        );
    }

    $scope.deletesession = function(sessionid) {

      // $scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'deletesession',
        sessionid : sessionid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('deletesession error : ' + response.data.text);
            }
            else {
              //$scope.spinner = "";
              if (response.data.error == false) {

                console.log('session deleted');
                $state.go('sessionlist', $state.params, {reload: true, inherit: false});

              } else {
                alert('Error : ' + response.data.text);
              }
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    $scope.isdifflauncher = function(index) {
      var session = $scope.sessions[index];
      if (session.launcherid != user.getid()) {
        return true;
      }
      return false;
    }

    $scope.deletesessionbuttonhandler = function(sessionid) {
      $scope.sessiontodelete = sessionid;
      document.getElementById('alertmodal').style.display='block';
    }

    $scope.alertcancelbuttonhandler = function() {
      document.getElementById('alertmodal').style.display='none';
    }

    $scope.viewsession = function(session) {
      statics.session = session;
      statics.showresults = true;
      $state.go('groupsessionresults');
    }

    $scope.replaysession = function(session) {
      statics.session = session;
      statics.showresults = false;
      statics.replay = true;
      console.log('going to session-start, session mode=' + session.mode);
      //console.log(JSON.stringify(session, null, 4));
      $state.go('session-start');
    }

    $scope.tolocaldate = function(unixdate) {
      date = new Date(unixdate * 1000);
      return date.toLocaleString();
    }


    $scope.closebuttonhandler = function() {
      statics.showheader = true;
      $state.go('polls');
    }


    console.log('sessionlist');
    window.document.title = "MARS - sessions";


    if (user.verifyuser()) {

      $scope.statics = statics;
      getsessions();

      window.document.title = "MARS - sessions";

    }

  }

]);
