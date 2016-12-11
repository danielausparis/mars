myApp.factory('statics', function() {

  var status = '';
  var displaystatus = '';
  var loggedin = false;
  var participantid = 0;
  var sessionid = 0;
  var apiUrl = '';
  var mode = '';

  return {
    status : status,
    displaystatus: displaystatus,
    loggedin: loggedin,
    participantid: participantid,
    sessionid: sessionid,
    apiUrl: apiUrl,
    mode: mode
  };

});
