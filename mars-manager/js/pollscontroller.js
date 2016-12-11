myApp.controller('PollsController',
  ["$scope", "$state", "$http", "$cookies", "user", "statics",

  function($scope, $state, $http, $cookies, user, statics) {

    var getpolls = function() {

      // $scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'getpolls'
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('getpolls error : ' + response.data.text);
            }
            else {
              //$scope.spinner = "";
              if (response.data.error == false) {

                $scope.polls = response.data.data;

              } else {
                alert('Network error : ' + response.data.text);
              }
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    var deletepoll = function(pollid) {

      // $scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'deletepoll',
        pollid : pollid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('deletepoll error : ' + response.data.text);
            }
            else {
              //$scope.spinner = "";
              if (response.data.error == false) {

                console.log('poll deleted');
                $state.go('polls', $state.params, {reload: true, inherit: false});

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

    $scope.createsession = function(poll, mode) {

      parms = {
        task : 'createsession',
        pollid : poll.id,
        mode : mode,
        launcherid : user.getid(),
        authorid : poll.authorid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('createsession error : ' + response.data.text);
            }
            else {
              if (response.data.error == false) {

                console.log('session created');

                // statics.pollid = poll.id;
                // statics.sessionid = response.data.sessionid;
                // statics.mode = mode;
                // statics.polltype = poll.type;
                // statics.secret = response.data.secret;
                // statics.polltitle = poll.name;
                
                statics.participantnumber = 0;
                statics.replay = false;

                statics.session = response.data.session;
                statics.session.poll = poll;

                $state.go('session-start');

              } else {
                alert('createsession error : ' + response.data.text);
              }
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    $scope.forkpollbuttonhandler = function(pollid) {
      parms = {
        task : 'forkpoll',
        pollid : pollid,
        newauthorid : user.getid()
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('forkpoll error : ' + response.data.text);
            }
            else {
              if (response.data.error == false) {

                console.log('poll forked');
                $state.go('polls', $state.params, {reload: true, inherit: false});

              } else {
                alert('forkpoll error : ' + response.data.text);
              }
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );

    }


    $scope.msds_update = function() {

      var f = document.getElementById('msds').files[0],
          r = new FileReader();

      r.onloadend = function(e) {

        // r.result contains the data
        //console.log('got : ' + JSON.stringify(r.result, null, 4));

        var result = JSON.parse(r.result);
        //console.log('got now : ' + JSON.stringify(result, null, 4));

        // create poll
        var parms = {
          task : 'addpoll',
          title : result.name,
          type : result.type,
          authorid : user.getid()
        }

        $http.get(statics.apiUrl, {params : parms})
          .then(
            function(response) {
              if (response.data.error) {
                alert('Error upload poll : ' + response.data.text);
              }
              else {
                var pollid = response.data.pollid;

                // ok, now create all questions
                for (question of result.questions) {

                  parms = {
                    pollid : pollid,
                    json : question.text
                  }
                  //console.log('sending : ' + JSON.stringify(parms, null, 4));

                  $http.get(statics.rootUrl + 'addquestion.php', {params : parms})
                    .then(
                      function(response) {
                        if (response.data.error) {
                          alert('Error create question: ' + response.data.text);
                        }
                        else {
                          console.log('success');
                          document.getElementById('importmodal').style.display='none';
                          notify('Success : created new poll ' + pollid + '.',
                            function() {
                              $state.go('polls', $state.params, {reload: true, inherit: false});
                            });
                        }
                      },
                      function(response) {
                        alert('Network error : ' + JSON.stringify(response, null, 4));
                      }
                    );
                }
              }
            },
            function(response) {
              alert('Network error : ' + JSON.stringify(response, null, 4));
            }
          );
      };

      r.readAsText(f);

    }

    var notify = function(text, buttonhandler) {
      $scope.notificationstring = text;
      notificationbuttonaction = buttonhandler;
      document.getElementById('shownotification').style.display='block';
    }

    $scope.notificationbuttonhandler = function() {
      document.getElementById('shownotification').style.display='none';
      if (notificationbuttonaction) {
        notificationbuttonaction();
        notificationbuttonaction = null;
      }
    }


    $scope.isdiffauthor = function(index) {
      var poll = $scope.polls[index];
      if (poll.authorid != $scope.userid) {
        return true;
      }
      return false;
    }

    $scope.importpollbuttonhandler = function() {
      document.getElementById('importmodal').style.display='block';
    }

    $scope.importcancelbuttonhandler = function() {
      document.getElementById('importmodal').style.display='none';
    }


    $scope.addpollbuttonhandler = function() {
      $state.go('addpoll');
    }

    $scope.editpollbuttonhandler = function(pollid, polltitle, canwrite) {
      $state.go('editpoll', {pollid: pollid, polltitle : polltitle, canwrite : canwrite});
    }

    $scope.deletepollbuttonhandler = function(pollid) {
      $scope.polltodelete = pollid;
      document.getElementById('alertmodal').style.display='block';
    }

    $scope.alertcancelbuttonhandler = function() {
      document.getElementById('alertmodal').style.display='none';
    }

    $scope.alertproceedbuttonhandler = function() {
      if (user.verifyuser()) {
        deletepoll($scope.polltodelete);
      }
    }



    console.log('polls');
    statics.showheader = true;
    $scope.statics = statics;

    document.getElementById('shownotification').style.display='none';

    if (user.verifyuser()) {
      $scope.userid = user.getid();
      window.document.title = "MARS - polls";
      getpolls();

    } else {
      //alert('no user!');
    }

    // control back button :
    // http://stackoverflow.com/questions/34354502/angular-ui-router-stop-controller-from-reloading-on-press-of-back-button-in-the


  }
]);
