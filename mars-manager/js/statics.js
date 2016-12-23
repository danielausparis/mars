
myApp.factory('statics', function() {

  var showheader = true;
  var pollid = "";
  var apiUrl = "";
  var quizUrl = "";
  var participantnumber = 0;
  var sessionid = 0;
  var status = 'unknown';
  var mode = ""; // 'normal' or 'group'
  var polltype = '';  // 'quiz' or 'poll'
  var sessionfunction = ""; // 'replay' or 'results'
  var hasdonesplash = false;
  var replay = false;
  var showresults = false;
  var poll = null;
  var session;
  var ranktable = null;


  var showstatics = function() {
    console.log(
      'showheader:' + showheader + '\n' +
      'pollid:' + pollid + '\n' +
      'apiUrl:' + apiUrl + '\n' +
      'quizUrl:' + quizUrl + '\n' +
      'participantnumber:' + participantnumber + '\n' +
      'sessionid:' + sessionid + '\n' +
      'status:' + status + '\n' +
      'polltype:' + polltype + '\n' +
      'sessionfunction:' + sessionfunction + '\n' +
      'hasdonesplash:' + hasdonesplash + '\n' +
      'showresults:' + showresults + '\n' +
      'replay:' + replay + '\n' +
      'session:' + JSON.stringify(this.session, null, 4) + '\n' +
      'ranktable:' + JSON.stringify(this.ranktable, null, 4)
    );
  }

  return {
    showstatics: showstatics,
    showheader : showheader,
    pollid : pollid,
    apiUrl : apiUrl,
    quizUrl : quizUrl,
    participantnumber : participantnumber,
    sessionid : sessionid,
    status : status,
    mode : mode,
    polltype : polltype,
    sessionfunction : sessionfunction,
    hasdonesplash : hasdonesplash,
    replay: replay,
    showresults: showresults,
    poll : poll,
    session: session,
    ranktable: ranktable
  };

});
