myApp.controller('ResultController', ["$scope", "$state", "$http", "statics", "user",

  function($scope, $state, $http, statics, user) {

    $scope.qstats = [];
    var questions = [];

    // chart colors, 1 per choice (8 max)
    // var colors = [
    //   "#ff8000",
    //   "#80ff00",
    //   "#00bfff",
    //   "#0000ff",
    //   "#bf00ff",
    //   "#86797e",
    //   "#00ff80",
    //   "#ff0000"
    // ];

    // http://paletton.com/#uid=74H0D0kt2eviMoEnRjCAi9EMQ5f
    var colors = [
      "#82B24A",  // light green
      "#220233",  // dark purple
      "#872249",  // dark red
      "#C4C451",  // sable
      "#264600",  // dark green
      "#86797e",  // light purple
      "#AA466D",  // light red
      "#4D4D00"   // dark sable
    ];

    var labels = [
      "Choice 1",
      "Choice 2",
      "Choice 3",
      "Choice 4",
      "Choice 5",
      "Choice 6",
      "Choice 7",
      "Choice 8"
    ];

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
              $scope.sessiondate = response.data.date;
              // if (statics.session.mode == 'group' || !statics.replay) {
              //   setupCharts();
              // }
              setupCharts();
            }
          },
          function(response) {
            alert('Network error :-(');
          }
        );
    }


    getAnswers = function() {

      parms = {
        task : 'getrawanswers',
        sessionid: statics.session.id,
        pollid : statics.session.poll.id
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {

              alert('Error getAnswers: ' + response.data.text);
            }
            else {

              $scope.rawanswers = response.data.data;
              //console.log(JSON.stringify($scope.rawanswers, null, 4));

              //console.log(JSON.stringify($scope.rawanswers[0].answers[0].booltable, null, 4));
              //console.log($scope.results[0].answers);
              //console.log(JSON.stringify($scope.results, null, 4));
              //console.log($scope.cstats[0]);
            }
          },
          function(response) {
            alert('network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }



    getResults = function() {

      parms = {
        task : 'getresults',
        sessionid: statics.session.id,
        pollid : statics.session.poll.id
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {

              alert('Erreur getResults: ' + response.data.text);
            }
            else {

              //console.log('getresults ' + JSON.stringify(response.data, null, 4));
              $scope.results = response.data.data;
              $scope.qstats = response.data.qstats;
              $scope.questioncount = $scope.qstats.length;
              $scope.cstats = response.data.choicestats;

              getQuestions();

              //console.log($scope.results[0].answers);
              //console.log(JSON.stringify($scope.results, null, 4));
              //console.log($scope.cstats[0]);
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    $scope.tolocaldate = function(unixdate) {
      date = new Date(unixdate * 1000);
      return date.toLocaleString();
    }


    function setupCharts() {

      var i = 1;
      var domelt = document.getElementById('charts');

      Chart.defaults.global.defaultFontColor = '#FAEDFC';

      for (cstat of $scope.cstats) {

        var canvasTag = angular.element('<canvas class="flex-item" id="chart'
          + i + '" width="300" height="300"></canvas>');
        angular.element(domelt).append(canvasTag);

        var ctx = document.getElementById("chart" + i).getContext("2d");

        // default labels
        var locallabels = [];
        var j = 0;

        for (elt of cstat) {
          locallabels.push(labels[j]);
          j++;
        }

        // get the question labels, superpose to default labels
        var databaselabels = questions[i - 1].text.labels;
        //console.log(questions[i - 1].text.labels);
        j = 0;
        for (elt of cstat) {
          if (databaselabels[j].length > 0) {
            locallabels[j] = databaselabels[j];
          }
          j++;
        }


        var data = {
          labels: locallabels,
          datasets: [
          {
            data: cstat,
            backgroundColor: colors
          }]
        };

        var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: data,
          options: {
            title: {
                display: true,
                text: 'Q' + i + ': ' + questions[i - 1].text.phrase.substr(0,30)
            },
            // the following allows chart dimensioning:
            responsive:false,
            maintainAspectRatio: false
          }
        });

        i++;

      }

    }

    $scope.isquiz = function() {
      if (statics.session.poll.type=='quiz') {
        return true;
      }
      return false;
    }

    $scope.ispoll = function() {
      if (statics.session.poll.type=='poll') {
        return true;
      }
      return false;
    }



    function loop() {

      console.log('statics.status=' + statics.status);
      if (statics.status =='running') {
        getResults();
      }

      getStatus();

      if (statics.status != 'cancelled' && statics.status !='finished') {
        setTimeout(loop, 3000);
      }
  }


    user.verifyuser();
    // will go to login

    console.log('resultcontroller');
    //statics.showstatics();

    $scope.statics = statics;

    $scope.showresulttable = true;
    $scope.showchoicestable = false;

    getResults();
    getAnswers();

    if (!statics.showresults) {
      loop();
    }
  }

]);
