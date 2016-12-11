myApp.controller('StatusController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {

    getParticipantNumber = function() {

      parms = {
        task : 'getparticipantnumber',
        sessionid : statics.session.id
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur getparticipantnumber: ' + response.data.text);
            }
            else {
              statics.participantnumber = response.data.participantnumber;
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    getStatus = function() {

      parms = {
        task : 'getstatus',
        sessionid : statics.session.id
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur getstatus: ' + response.data.text);
            }
            else {
              statics.status = response.data.status;
              console.log('status: ' + statics.status);
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }


    function loop() {

      if (statics.status =='waiting') {
        getParticipantNumber();
      }

      getStatus();

      console.log('loop status: ' + statics.status);
      console.log('*statics.session.mode=' + statics.session.mode);

      if (statics.status == 'cancelled'
       || statics.status == 'finished' || statics.status == null) {

        console.log('statuscontroller: loop finished');

      } else {
        setTimeout(loop, 2000);
      }
    }

    console.log('statuscontroller');
    console.log('statuscontroller : statics.session.mode=' + statics.session.mode);

    $scope.statics = statics;

    loop();


  }

]);
