myApp.controller('TimeController', ["$rootScope", "$scope", "$state", "$http",
  "$sanitize", "$sce", "user", "statics", "html",

  function($rootScope, $scope, $state, $http, $sanitize, $sce, user, statics, html) {

    var questions = [];
    $scope.questiontext = '';
    var countdownArray = ['5', '4', '3', '2', '1', '0'];

    setStatus = function(status) {

      parms = {
        task : 'setstatus',
        status : status,
        sessionid : statics.session.id
      }

      console.log('timecontroller : setstatus ******************** ' + status);

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
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }


    getResults = function() {

      parms = {
        task : 'getresults',
        sessionid: statics.session.id,
        pollid : statics.session.poll.id
      }

      return new Promise(function(resolve, reject) {

        $http.get(statics.apiUrl, {params : parms})
          .then(
            function(response) {
              if (response.data.error) {

                alert('Erreur getResults: ' + response.data.text);
              }
              else {

                statics.ranktable = response.data.ranktable;
                resolve();

              }
            },
            function(response) {
              alert('erreur réseau : ' + JSON.stringify(response, null, 4));
            }
          );
      });
    }



    getQuestions = function() {

      parms = {
        task : 'getquestions',
        sessionid : statics.session.id
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur getquestions: ' + response.data.text);
            }
            else {
              questions = response.data.data;

              one_by_one(countdownArray, oneCountdown).then(function(result) {

                setStatus('running');
                statics.status = 'running';

                one_by_one(questions, oneQuestion).then(function(result) {
                  console.log('finished!!!!');
                  // signal end of session to clients
                  setQuestionNumber(-1);

                  setStatus('finished');

                  $scope.questiontext =
                    $sce.trustAsHtml('<div class="mars-bigtitle vertical-centered">Poll finished !</div>');
                  delay(3000)().then(function() {
                    statics.showheader = true;
                    $state.go('groupsessionresults');
                  });
                });
              });
            }
          },
          function(response) {
            alert('Network error :-(');
          }
        );
    }


    setQuestionNumber = function(number) {

      parms = {
        task : 'setquestionnumber',
        number : number,
        sessionid : statics.session.id
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error in setquestionnumber: ' + response.data.text);
            }
            else {
            }
          },
          function(response) {
            alert('Network error :-(');
          }
        );
    }


    // http://stackoverflow.com/questions/24586110/resolve-promises-one-after-another-i-e-in-sequence
    function one_by_one(objects_array, iterator, callback) {
      var start_promise = objects_array.reduce(function (prom, object) {
          return prom.then(function () {
              return iterator(object);
          });
      }, Promise.resolve()); // initial
      if(callback){
          start_promise.then(callback);
      }else{
          return start_promise;
      }
    }

    // https://www.stephanboyer.com/post/107/fun-with-promises-in-javascript
    function delay(milliseconds) {
      return function(result) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(result);
          }, milliseconds);
        });
      };
    }

    function oneCountdown(elt) {
      return new Promise(function(resolve, reject) {
         $scope.questiontext =
           $sce.trustAsHtml('<div class="mars-bigtitle vertical-centered">' + elt + '</div>');
        delay(2000)().then(function() {
          resolve();
        });
      });
    }

    function oneQuestion (question) {

      return new Promise(function(resolve, reject) {

        var countdown = question.text.duration -1;
        var diff = 100/question.text.duration;
        var steps = 0;
        var width = 0;
        $scope.enablebuttons = true;

        var ticker = function() {

          if(! getpausevalue()) {
            steps++;
          }
          width = Math.round(diff * steps);
          // ng-style broken :-(
          document.getElementById("progbar").style.width = width + '%';

          if (countdown > 0) {
            if(! getpausevalue()) {
              countdown--;
            }
            delay(1000)().then(function(){
              //console.log('tick');
              ticker();
            });
          } else {

            //console.log('question done');
            $scope.enablebuttons = false;
            getResults().then(function() {

              // time to actuate avatars !
              console.log('EMITTING EVENT');
              $rootScope.$broadcast('displayavatars');

              resolve();
            });
          }
        }

        // send question number notification
        //console.log('question ' + question.number);
        setQuestionNumber(question.number);

        $scope.questionnumber = question.number;

        $scope.questiontext =
          $sce.trustAsHtml('<div class="mars-bigtitle vertical-centered">Question '
          + question.number + '</div>');
        delay(3000)().then(function(){
          $scope.questiontext = $sce.trustAsHtml(html.genHtmlfromJson(question.text));
          delay(2000)().then(function(){
            ticker();
          });
        });

      });
    };

    var getpausevalue = function() {
      return $scope.paused;
    }

    $scope.pausebuttonhandler = function() {
      $scope.paused = true;
      document.getElementById('pausemodal').style.display='block';
      console.log('paused');
    }

    $scope.startbuttonhandler = function() {
      $scope.paused = false;
      document.getElementById('pausemodal').style.display='none';
      console.log('started');
    }

    $scope.stopbuttonhandler = function() {
      $state.go('session-start');
      console.log('stopped');
    }



    console.log('timecontroller');

    user.verifyuser();

    statics.showheader = false;

    $scope.statics = statics;

    //statics.showstatics();

    if (statics.session.poll.type=='quiz') {
      console.log('THIS IS A QUIZ');
    }

    $scope.paused = false;
    $scope.enablebuttons = false;
    $scope.questionnumber = '';

    delay(1000)().then(function(){
      getQuestions();
    });



  }

]);
