myApp.controller('WaitingController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {

    var status = '';

    getStatus = function() {

      parms = {
        task : 'getstatus',
        sessionid : statics.sessionid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            // this callback will be called asynchronously
            // when the response is available
            //alert(JSON.stringify(response, null, 4));
            if (response.data.error) {
              alert('Erreur getstatus: ' + response.data.text + ' ' + response.data.data);
            }
            else {
              if(response.data.data == "running") {
                status = 'running';
              }
              else {
                console.log('not running !');
              }
            }
          },
          function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    function loop() {

      getStatus();

      if (status !== 'running') {
        setTimeout(loop, 3000);
      }
      else {
        document.getElementById('waitingmodal').style.display='none';
        $state.go('running');
      }
    }

    document.getElementById('waitingmodal').style.display='block';

    loop();

  }

]);
