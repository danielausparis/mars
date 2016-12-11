myApp.controller('LoginController', ["$scope", "$state", "$http", "$cookies", "user", "statics",

  function($scope, $state, $http, $cookies, user, statics) {

    $scope.logindata = {
      nicknameoremail : '',
      password : ''
    }

    //$scope.status = "<i class='fa fa-minus-circle w3-xlarge' aria-hidden='true'></i>";

    //$scope.spinner = "";

    $scope.loginbuttonhandler = function() {

      //$scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'checkuser',
        nicknameoremail : $scope.logindata.nicknameoremail,
        encpassword : sha256($scope.logindata.password)
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Login error: ' + response.data.text);
            }
            else {
              // set user info
              console.log('got user info ' + response.data.user);
              user.setuser(response.data.user);

              $state.go('home');

            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
            //$scope.showPopup();
          }
        );
    }

    $scope.registrationbuttonhandler = function() {

      $state.go('registration');

    }

    console.log('login');
    $scope.statics = statics;


  }
]);
