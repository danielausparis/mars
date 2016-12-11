myApp.factory('user', function($state, $cookies, $timeout, statics) {

  var user = {};
  var isset = false;

  var setuser = function(userparm) {

    console.log('setuser ' + userparm.nickname);
    user = userparm;
    isset = true;

    refreshcookie();

  }

  var refreshcookie = function() {
    // set cookie
    var now = Date.now();
    // 10mn = 60 * 1000 * 10 milliseconds = 600000
    // 20mn = 1200000
    var d = new Date();
    var expiration = now + 1200000;
    d.setTime(expiration);
    var expobj = { 'expires': d };
    $cookies.put('mars-cookie', 'pouet', expobj);
  }


  var unsetuser = function() {

    user = {};
    isset = false;
    $cookies.remove('mars-cookie');
    statics.hasdonesplash = false;

  }

  var getid = function() {
    if (isuserset) return user.id; else return null;
  }

  var getnick = function() {
    // cookies asynchronous !
    // http://stackoverflow.com/questions/20952074/cookies-update-from-response-delayed-in-future
    //$timeout(function() {
      if (isuserset) return user.nickname; else return null;
    //}, 200);
}

  var isuserset = function() {
    if (! $cookies.get('mars-cookie') || !isset) {
       unsetuser();
    }
    return isset;
  }

  var verifyuser = function() {

    if (isuserset()) {
      refreshcookie();
      return true;
    }
    else {
      // force reload
      // http://stackoverflow.com/questions/21714655/reloading-current-state-refresh-data
      $state.go('home', $state.params, {reload: true, inherit: false});
    }
  }


  return {
    setuser : setuser,
    unsetuser : unsetuser,
    getid : getid,
    getnick : getnick,
    isuserset : isuserset,
    refreshcookie : refreshcookie,
    verifyuser : verifyuser
  }

});
