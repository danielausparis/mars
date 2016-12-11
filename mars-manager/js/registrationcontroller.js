myApp.controller('RegistrationController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {

    $scope.cancelbuttonhandler = function() {

      $state.go('home');

    }

    $scope.registrationbuttonhandler = function() {

      // $scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'registeruser',
        name : $scope.logindata.name,
        firstname : $scope.logindata.firstname,
        nickname : $scope.logindata.nickname,
        email : $scope.logindata.email,
        encpassword : sha256($scope.logindata.password)
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Registration error : ' + response.data.text);
            }
            else {
              //$scope.spinner = "";
              if (response.data.error == false) {
                alert('Registration succeeded : now please wait for admin processing');
                $state.go('login');
              } else {
                alert('Error : ' + response.data.text);
              }
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
            //$scope.showPopup();
          }
        );
    }


    console.log('registration');
    $scope.statics = statics;

    $scope.logindata = {};
    window.document.title = "MARS - registration";


  }
]);
