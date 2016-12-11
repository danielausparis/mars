myApp.controller('EditPollController', ["$scope", "$state", "$http",
  "$cookies", "user", "html", "$sanitize", "$sce", "statics",


  function($scope, $state, $http, $cookies, user, html, $sanitize, $sce, statics) {

    getpoll = function() {

      parms = {
        task : 'getonepoll',
        pollid : $scope.pollid,
        mode : 'internal'
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error getonepoll: ' + response.data.text);
            }
            else {
              $scope.poll = response.data.data;
              // set checkboxes stuff
              for (question of $scope.poll.questions) {
                setcheckboxesmodel(question);
              }
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    var setcheckboxesmodel = function(question) {

      correctanswer = question.correctanswer;
      question.checkboxesmodel = [];

      for (i = 1; i <= question.nbchoices; i++) {
        checked = false;
        j = 8 - i;
        binval = 1 << j;
        if ((correctanswer & binval) == binval) {
          checked = true;
        }
        question.checkboxesmodel.push(checked);
      }
    }

    $scope.movequestion = function(pollid, questionid, direction) {

      parms = {
        pollid: pollid,
        questionid : questionid,
        direction : direction
      }

      $http.get(statics.rootUrl + 'movequestion.php', {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error movequestion: ' + response.data.text);
            }
            else {
              // reload
              $state.go('editpoll',
                { pollid: $scope.pollid, polltitle : $scope.polltitle,
                  canwrite: $scope.canwrite },
                {reload: true, inherit: false});
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );

    }

    $scope.html = function(json) {
      return $sce.trustAsHtml(html.genHtmlfromJson(json));
    }

    $scope.gotoeditquestion = function(pollid, question) {
      $state.go('editquestion',
        { new: false, pollid: $scope.pollid,
          question : question,
          polltitle: $scope.polltitle, canwrite: $scope.canwrite  });
    }

    $scope.gotoeditnewquestion = function(pollid) {
      $state.go('editquestion',
        { new: true, pollid: $scope.pollid,
          polltitle: $scope.polltitle, canwrite: $scope.canwrite });
    }

    $scope.gobacktopolls = function() {
      $state.go('polls');
    }



    console.log('editpoll');
    $scope.statics = statics;

    if (user.verifyuser()) {
      $scope.userid = user.getid();
      $scope.pollid = $state.params.pollid;
      $scope.polltitle = $state.params.polltitle;
      $scope.canwrite = $state.params.canwrite;
      window.document.title = "MARS - edit poll";

      getpoll();

    } else {
      //alert('no user!');
    }




  }
]);
