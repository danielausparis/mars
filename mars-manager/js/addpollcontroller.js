myApp.controller('AddPollController', ["$scope", "$state", "$http", "$cookies", "user","statics",

  function($scope, $state, $http, $cookies, user, statics) {

    //$scope.status = "<i class='fa fa-minus-circle w3-xlarge' aria-hidden='true'></i>";

    //$scope.spinner = "";

    $scope.addpollbuttonhandler = function() {

      //$scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'addpoll',
        title : $scope.title,
        type : gettype(),
        authorid : $scope.userid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error addpoll: ' + response.data.text);
            }
            else {

              $state.go('polls');

            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    var gettype = function() {

      console.log('quiz: ' + $scope.radioquiz);
      console.log('poll: ' + $scope.radiopoll);
      if ($scope.radioquiz == 'quiz') {
        return 'quiz';
      }
      else if ($scope.radiopoll == 'poll') {
        return 'poll';
      } else {
        return 'notset';
      }
    }

    $scope.cancelbuttonhandler = function() {

      $state.go('polls');

    }


    console.log('addpoll');
    $scope.statics = statics;

    if (user.verifyuser()) {

      $scope.userid = user.getid();

    }

  }
]);
