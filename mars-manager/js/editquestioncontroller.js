myApp.controller('EditQuestionController', ["$scope", "$state", "$http",
  "$cookies", "user", "html", "$sanitize", "$sce", "statics",

  function($scope, $state, $http, $cookies, user,
    html, $sanitize, $sce, statics) {

    var n = 3;
    var inputstring = '';
    var smallfontoption = false;
    var onecoloption = true;
    var twocolsoption = false;

    var sampleobj =  {
        "preamble": {
            "pollid": $scope.pollid,
            "questionid": $scope.questionid,
            "layout": "2cols",
            "smallfont": "false"
        },
        "phrase": "Is this a sample question ?",
        "choices": [
            "yes",
            "no",
            "perhaps"
        ],
        "labels": [
            "yes",
            "no",
            "perhaps"
        ],
        "correctanswer": 128,
        "comments": "may the force be with you.",
        "imagelink": "https://abload.de/img/chevalcosk6.jpg",
        "imagescale": 55, //  <--- fits the above image
        "textcolor" : "#D2CCF4",
        "backgroundcolor" : "#460328"
    }


    $scope.gobacktopoll = function() {
      $state.go('editpoll',
        { pollid: $scope.pollid, polltitle: $scope.polltitle,
          canwrite:$scope.canwrite });
    }

    function init() {
      document.getElementById('questionform').addEventListener("keyup", dealWithKeyboard, true);
      document.getElementById('rightcolform').addEventListener("keyup", dealWithKeyboard, true);

      var elts = document.getElementsByClassName("choicecbx");
      for (elt of elts) {
        elt.addEventListener("click", dealWithMouse, true);
      }

      disablesavebuttons();

      if ($scope.isnewquestion) {
        initFromJson(sampleobj);
      } else {
        initFromJson($scope.question.text);
      }
    }


    $scope.clickradioonecol = function() {
      onecoloption = true;
      twocolsoption = false;
      document.getElementById('radioonecol').checked = true;
      document.getElementById('radiotwocols').checked = false;
      document.getElementById("comments").disabled=true;
      document.getElementById("imagelink").disabled=true;
      var elts = document.getElementsByClassName("rightcolumnlabel");
      for (elt of elts) {
        elt.style.opacity=0.4;
      }
      updatePreview();
    }

    $scope.clickradiotwocols = function() {
      onecoloption = false;
      twocolsoption = true;
      document.getElementById('radioonecol').checked = false;
      document.getElementById('radiotwocols').checked = true;
      document.getElementById("comments").disabled=false;
      document.getElementById("imagelink").disabled=false;
      var elts = document.getElementsByClassName("rightcolumnlabel");
      for (elt of elts) {
        elt.style.opacity=0.8;
      }
      updatePreview();
    }

    function disablesavebuttons() {
      document.getElementById("savebutton").disabled = true;
      document.getElementById("saveandclosebutton").disabled = true;
    }

    function enablesavebuttons() {
      document.getElementById("savebutton").disabled = false;
      document.getElementById("saveandclosebutton").disabled = false;
    }

    $scope.smallfonthandler = function() {
      smallfontoption = !smallfontoption;
      updatePreview();
    }

    function getChar(event) {
      if (event.which == null) {
        return String.fromCharCode(event.keyCode) // IE
      } else if (event.which!=0 && event.charCode!=0) {
        return String.fromCharCode(event.which)   // the rest
      } else {
        return null // special key
      }
    }


    function dealWithKeyboard(event) {
      updatePreview();
    }

    function dealWithMouse(event) {
      enablesavebuttons();
    }

    $scope.addinput = function() {
      if (n < 9) {
        inputstring = '<span class="inputline" id="inputelt' + n +
          '">answer ' + n + ' : <input type="text" class="choiceinput inputline" size="40"></input>';
        inputstring += '&nbsp;&nbsp;&nbsp; label : <input type="text" class="choicelabel" size="15"></input>';
        inputstring += '&nbsp;&nbsp;&nbsp; true : <input type="checkbox" class="choicecbx"><br></span>';
        document.getElementById('answerzone').insertAdjacentHTML('beforeEnd',inputstring);
        n++;
        updatePreview();
      }
    }

    $scope.removeinput = function () {
      if (n > 3) {
        var eltid = 'inputelt' + (n - 1);
        var elt = document.getElementById(eltid);
        //elt.remove();
        elt.outerHTML = "";
        n--;
        updatePreview();
      }
    }

    function genJson() {

      var obj = {};

      var preamble = {
        pollid : $scope.pollid,
        questionid : $scope.question.id,
      }

      if (onecoloption) {
        preamble.layout='1col';
      } else if (twocolsoption) {
        preamble.layout='2cols';
      }

      if (smallfontoption) {
        preamble.smallfont = 'true';
      } else {
        preamble.smallfont = 'false';
      }

      obj.preamble = preamble;

      obj.phrase = document.getElementById('questionphrase').value;

      obj.choices = [];
      for (field of document.querySelectorAll('.choiceinput')) {
        obj.choices.push(field.value);
      }

      obj.labels = [];
      for (field of document.querySelectorAll('.choicelabel')) {
        obj.labels.push(field.value);
      }

      var correctanswer = 0;
      var p2 = 7;
      for (field of document.querySelectorAll('.choicecbx')) {
        if (field.checked) {
          correctanswer += Math.pow(2, p2);
        }
        p2--;
      }
      obj.correctanswer = correctanswer;

      if (twocolsoption) {
        obj.comments = document.getElementById('comments').value;
        obj.imagelink = document.getElementById('imagelink').value;
      }

      obj.duration = $scope.duration;

      obj.imagescale = $scope.imagescale;

      obj.textcolor = $scope.textcolor;
      obj.backgroundcolor = $scope.backgroundcolor;

      //console.log('genJson : ' + JSON.stringify(obj, null, 4));
      return obj;

    }

    function initFromJson(json) {

      //console.log('initFromJson ' + json);

      if (json.preamble.layout == '1col') {
        $scope.clickradioonecol();
      } else if (json.preamble.layout == '2cols') {
        $scope.clickradiotwocols();
      }

      if (json.preamble.smallfont == 'true') {
        smallfontoption = true;
        document.getElementById('fontcheckbox').checked = true;
      } else {
        smallfontoption = false;
        document.getElementById('fontcheckbox').checked = false;
      }

      $scope.duration = json.duration;

      document.getElementById('questionphrase').value = json.phrase;

      var l = document.querySelectorAll('.choiceinput').length;
      for (var i = 2; i < l; i++) {
        removeinput();
      }

      var diff = json.choices.length - 2;
      for (var i = 0; i < diff; i++) {
        $scope.addinput();
      }

      var i = 0;
      for (field of document.querySelectorAll('.choiceinput')) {
        field.value = json.choices[i];
        i++;
      }

      i = 0;
      for (field of document.querySelectorAll('.choicelabel')) {
        field.value = json.labels[i];
        i++;
      }

      i = 1;
      var j = 0;
      var binval = 0;
      for (field of document.querySelectorAll('.choicecbx')) {
        j = 8 - i;
        binval = 1 << j;
        if ((json.correctanswer & binval) == binval) {
          field.checked = true;
        } else {
          field.checked = false;
        }
        i++;
      }

      if (twocolsoption) {
        document.getElementById('comments').innerHTML = json.comments;
        document.getElementById('imagelink').value = json.imagelink;
      }

      $scope.imagescale = json.imagescale;

      $scope.textcolor = json.textcolor;
      $scope.backgroundcolor = json.backgroundcolor;

      disablesavebuttons();
      updatePreview();

    }


    function updatePreview() {
      document.getElementById('preview').innerHTML = (html.genHtmlfromJson(genJson()));
      enablesavebuttons();
    }
    $scope.updatePreview = updatePreview;



    $scope.save = function(close) {

      parms = {
        pollid : $scope.pollid,
        json : JSON.stringify(genJson())
      }
      if (!$scope.isnewquestion) {
        parms.questionid = $scope.question.id;
      }

      //console.log('sending : ' + JSON.stringify(parms));

      $http.get(statics.rootUrl + 'addquestion.php', {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error save question: ' + response.data.text);
            }
            else {
              disablesavebuttons();
              if (close) {
                $state.go('editpoll',
                   { pollid: $scope.pollid,
                     polltitle : $scope.polltitle, canwrite: $scope.canwrite },
                   {reload: true, inherit: false});
              }
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    $scope.propagatecolors = function() {

      parms = {
        task :'propagatecolors',
        pollid : $scope.pollid,
        textcolor: $scope.textcolor,
        backgroundcolor : $scope.backgroundcolor
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Error propagatecolors: ' + response.data.text);
            }
            else {
            }
          },
          function(response) {
            alert('Network error : ' + JSON.stringify(response, null, 4));
          }
        );
    }


    $scope.scaleuphandler = function() {
      $scope.imagescale++;
      updatePreview();
    }

    $scope.scaledownhandler = function() {
      $scope.imagescale--;
      updatePreview();
    }



    console.log('editquestion');

    if (user.verifyuser()) {

      $scope.pollid = $state.params.pollid;
      $scope.polltitle = $state.params.polltitle;
      $scope.isnewquestion = $state.params.new;
      $scope.canwrite = $state.params.canwrite;

      if (!$scope.isnewquestion) {
        $scope.question = $state.params.question;
        //console.log(JSON.stringify($scope.question, null, 4));
      } else {
        $scope.question = {
          "id": "29",
          "text": sampleobj,
          "nbchoices": "3",
          "correctanswer": "128",
          "pollid": $state.params.pollid,
          "number": "0",
          "duration": "20",
          "imagescale": "100"
        }
      }

      $scope.durations = [
        10, 15, 20, 25, 30, 40, 60, 90, 120, 180, 240, 300, 360
      ];

      for (var i = 0; i < $scope.durations.length; i++) {
        if($scope.durations[i] == $scope.question.duration) {
          break;
        }
      }
      $scope.duration = $scope.durations[i];

      $scope.textcolor = '#EEDFE5';
      $scope.backgroundcolor = '#30071E';

      window.document.title = "MARS - edit question";

      $scope.imagescale = 100;

      init();

    } else {
      //alert('no user!');
    }

  }
]);
