myApp.controller('IndexController', ["$scope", "$state", "$http", "statics",

  function($scope, $state, $http, statics) {


    $scope.logindata = {
      nickname : '',
      sessionid : '',
      secret : ''
    }

    $scope.displaysidenav = false;

    //$scope.status = "<i class='fa fa-minus-circle w3-xlarge' aria-hidden='true'></i>";
    $scope.spinner = "";
    statics.status = '';


    $scope.sidepanelopen = function() {
      $scope.displaysidenav = true;
      document.getElementById("myOverlay").style.display = "block";
    }

    $scope.sidepanelclose = function() {
      $scope.displaysidenav = false;
      document.getElementById("myOverlay").style.display = "none";
    }

    $scope.gotologin = function() {
      $scope.sidepanelclose();
      document.getElementById("loginmodal").style.display = "block";
    }

    $scope.gotoabout = function() {
      $scope.sidepanelclose();
      document.getElementById("aboutmodal").style.display = "block";
    }

    $scope.closeaboutmodal = function() {
      document.getElementById("aboutmodal").style.display = "none";
    }

    $scope.closeloginmodal = function() {
      document.getElementById("loginmodal").style.display = "none";
    }

    $scope.loginButtonHandler = function() {

      $scope.spinner = "<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>";

      parms = {
        task : 'login',
        nickname : $scope.logindata.nickname,
        sessionid : $scope.logindata.sessionid,
        secret : $scope.logindata.secret
      }

      $http.get(statics.apiUrl, {params : parms})
        .then(
          function(response) {
            if (response.data.error) {
              alert('Erreur login: ' + response.data.text + ' ' + response.data.data);
            }
            else {
              $scope.spinner = "";
              document.getElementById('loginmodal').style.display='none';
              statics.displaystatus = "registered";
              statics.loggedin = true;
              statics.participantid = response.data.data;
              statics.mode = $scope.mode = response.data.mode;
              console.log('client: got mode : ' + statics.mode);
              statics.sessionid = parms.sessionid;
              //console.log(JSON.stringify(response, null, 4));
              //console.log('id: ' + statics.participantid);
              //console.log('sessionid: ' + statics.sessionid);
              $state.go('waiting');
            }
          },
          function(response) {
            alert('erreur réseau : ' + JSON.stringify(response, null, 4));
          }
        );
    }

    console.log('homecontroller');

    $scope.statics = statics;

    document.getElementById('splashmodal').style.display='block';

    setTimeout(function() {
      document.getElementById('splashmodal').style.display='none';
    }, 3000);

    setTimeout(function() {
      $scope.displaylogin = true;
      document.getElementById("loginmodal").style.display = "block";
    }, 3000);

    // find API url
    //console.log ('pathname ' + window.location.pathname);
    var pathname = window.location.pathname;
    if (pathname.charAt(0) === '/')
      pathname = pathname.substring(1);

    var pathArray = pathname.split( '/' );

    var newPathname = "";
    for (i = 0; i < (pathArray.length) - 2; i++) {
      newPathname += "/";
      newPathname += pathArray[i];
    }
    statics.apiUrl = window.location.protocol + "//" + window.location.host
      + newPathname + "/mars-server/clientapi.php";
    console.log('host:' + window.location.host);
    console.log('url:' + statics.apiUrl);

  }
]);
