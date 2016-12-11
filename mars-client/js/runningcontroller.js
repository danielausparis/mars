myApp.controller('RunningController', ["$scope", "$state", "$http",
  "$sanitize", "$sce", "html", "statics",

  function($scope, $state, $http, $sanitize, $sce, html, statics) {

    $scope.questions = [];
    var answers = [];
    var finished = false;
    var questionnumber = 0;
    $scope.status = '';


    $scope.buttonLabel = 'Send';


    function delay(milliseconds) {
      return function(result) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(result);
          }, milliseconds);
        });
      };
    }

    getStatus = function() {

      parms = {
        task : 'getstatus',
        sessionid : statics.sessionid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur getstatus: ' + response.data.text + ' ' + response.data.data);
            }
            else {

              $scope.status = response.data.data;
              console.log('client : status : ' + $scope.status);

            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }



    getQuestions = function() {

      parms = {
        task : 'getquestions',
        sessionid : statics.sessionid
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur getquestions: ' + response.data.text);
            }
            else {
              //console.log('client: got ' + response.data.text);
              //console.log('client: got ' + JSON.stringify(response, null, 4));
              if ((response.data.text != 'finished')
              && (response.data.data[0].number != questionnumber)) {
                $scope.questions = response.data.data;
                //console.log(JSON.stringify($scope.questions));
                for(i = 0; i < $scope.questions.length; i++) {
                  max = $scope.questions[i].nbchoices;
                  //console.log('q' + i + ' max ' + max);
                  $scope.questions[i].options = [];
                  $scope.questions[i].checkboxes = [];
                  for (j = 1; j <= max; j++) {
                    $scope.questions[i].options.push(j);
                    $scope.questions[i].checkboxes.push(false);
                  }
                  //console.log($scope.questions[i].options);
                  questionnumber = $scope.questions[0].number;
                  $scope.buttonLabel = 'Send';
                }
              } else if (response.data.text == 'finished'){
                //console.log('client : got finished !');
                finished = true;
              }
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }


    $scope.answerButtonHandler = function() {

      //console.log('in handler');
      $scope.buttonLabel = $sce.trustAsHtml("<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>");

      answers = [];

      for (var i = 0; i < $scope.questions.length; i++) {
        answers.push($scope.questions[i].checkboxes);
      }

      parms = {
        task : 'setanswer',
        sessionid : statics.sessionid,
        participantid : statics.participantid,
        answers : JSON.stringify(answers),
        questionnumber : questionnumber
      }

      //console.log(JSON.stringify(parms, null, 4));

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error setAnswer: ' + response.data.text);
            }
            else {
              // success
              $scope.buttonLabel = 'Sent';
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }


    var questionCycle = function() {
      return new Promise(function(resolve, reject) {

        function cycle() {
          getStatus();
          if (! isfinished()) {
            delay(1000)().then(function() {
              if (! isfinished()) {
                getQuestions();
                cycle();
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        }

        cycle();

      });
    }

    var normalModeCycle = function() {
      return new Promise(function(resolve, reject) {

        function loop() {
          getStatus();
          delay(1000)().then(function() {
            if (!isfinished()) {
              loop();
            } else {
              resolve();
            }
          });
        }

        loop();

      });
    }

    var isfinished = function() {
      if ($scope.status == 'finished' || $scope.status == 'cancelled') {
        return true;
      }
      return false;
    }


    $scope.html = function(json) {
      //console.log('client: got json ' + JSON.stringify(json, null, 4));
      return $sce.trustAsHtml(html.genHtmlfromJson(json, false));
    }

    $scope.closefinishedmodal = function() {
      document.getElementById('finishedmodal').style.display='none';
      statics.displaystatus = '';
      statics.loggedin = false;
      statics.participantid = 0;
      statics.mode = '';
      statics.sessionid = 0;
      console.log('going home');
      $state.go('home', $state.params, {reload: true, inherit: false});
    }


    document.getElementById('runningmodal').style.display='block';
    console.log('client: running !!');

    setTimeout(function() {
      document.getElementById('runningmodal').style.display='none';
    }, 1000);

    $scope.statics = statics;

    $scope.mode = statics.mode;

    console.log('client: mode : ' + statics.mode);

    if (statics.mode == 'normal') {

      getQuestions();

      normalModeCycle().then(function() {
        console.log('client: NORMAL MODE FINISHED');
        document.getElementById('finishedmodal').style.display='block';
      });

    } else {

      questionCycle().then(function() {
        console.log('client: GROUP MODE FINISHED');
        document.getElementById('finishedmodal').style.display='block';
      });
    }

  }

]);
