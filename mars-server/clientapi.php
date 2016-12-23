<?php

  require("utils.php");

  session_start();

  extract($_GET);


  if ($_GET['task'] === 'login')
  {
    if (!is_numeric($sessionid)) {
      $result = array('error' => true, 'text' => "no such session", 'data' => $sessionid);
      goto wayout;
    }

    if (!is_numeric($secret)) {
      $result = array('error' => true, 'text' => "incorrect secret code");
      goto wayout;
    }

    $req = "SELECT * FROM sessions WHERE id = '$sessionid'";
    $session = DO_REQUEST($req);

    error_log('$session=' . print_r($session, true));

    if (count($session) != 1) {
      $result = array('error' => true, 'text' => "no such session id", 'data' => $sessionid);
      goto wayout;
    }

    $session = $session[0];

    if ($session['status'] != 'waiting') {
      $result = array('error' => true, 'text' => "session is not in waiting status", 'data' => $sessionid);
      goto wayout;
    }

    if (strcmp($session['secret'], $secret) != 0) {
      $result = array('error' => true, 'text' => "wrong secret", 'data' => $secret);
      goto wayout;
    }

    $mode = $session['mode'];

    error_log('login de nickname=' . $nickname . ', mode : ' . $mode);

    $req = "SELECT * FROM participants WHERE nickname = '$nickname' AND sessionid = '$sessionid'";
    $result = DO_REQUEST($req);

    //error_log('pgnumrows=' . pg_num_rows($requestResult));
    if (pg_num_rows($requestResult) > 0) {
      $lastid = $result[0]['id'];
      $result = array('error' => false, 'text' => "already registered", 'data' => $lastid, 'mode' => $mode);
      goto wayout;
    }

    $req = "INSERT INTO participants (nickname, sessionid) VALUES ('$nickname', '$sessionid') RETURNING id";
    DO_REQUEST($req);
    $request = "SELECT id FROM participants ORDER BY id DESC LIMIT 1";
    $result = DO_REQUEST($request);
    $lastid = $result[0]['id'];

    $result = array('error' => false, 'text' => "ok", 'data' => $lastid, 'mode' => $mode);
    goto wayout;

  }
  else if ($_GET['task'] === 'getstatus') {

    if (!is_numeric($sessionid)) {
      $result = array('error' => true, 'text' => "no such session");
      goto wayout;
    }

    $req = "SELECT * FROM sessions WHERE id = '$sessionid'";
    $session = DO_REQUEST($req);
    $session = $session[0];

    if (pg_num_rows($requestResult) != 1) {
      $result = array('error' => true, 'text' => "no such session id", 'data' => $sessionid);
      goto wayout;
    }

    $result = array('error' => false, 'text' => "status", 'data' => $session['status']);
    goto wayout;

  }
  else if ($_GET['task'] === 'getquestions') {

    if (!is_numeric($sessionid)) {
      $result = array('error' => true, 'text' => "no such session");
      goto wayout;
    }

    $req = "SELECT * FROM sessions WHERE id = '$sessionid'";
    $session = DO_REQUEST($req);

    if (pg_num_rows($requestResult) != 1) {
      $result = array('error' => true, 'text' => "no such session id", 'data' => $sessionid);
      goto wayout;
    }

    $session = $session[0];
    $mode = $session['mode'];

    // get poll
    $pollid = $session['pollid'];

    // two modes

    if ($mode === 'normal') {
      // get all questions
      $req = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER by number";
      $questions = DO_REQUEST($req);

      // decode question text (json) to avoid double json_encode !
      for ($i=0; $i < count($questions); $i++) {
        $questions[$i]['text'] = json_decode($questions[$i]['text'], true);
      }

      $result = array('error' => false, 'text' => "questions", 'data' => $questions);
      goto wayout;

    } else {
      // get just the current question
      $number = $session['questionnumber'];
      //error_log('client api: current question: ' . $number);

      // if questionnumber == -1, it is finished!
      if ($number == -1) {
        $result = array('error' => false, 'text' => "finished");
        goto wayout;
      } else {
        $req = "SELECT * FROM questions WHERE pollid = '$pollid' AND number = '$number'";
        $questions = DO_REQUEST($req);

        $result = array('error' => false, 'text' => "questions", 'data' => $questions);
        goto wayout;
      }

    }

  }
  else if ($_GET['task'] === 'setanswer') {

    if (!is_numeric($sessionid)) {
      $result = array('error' => true, 'text' => "no such session");
      goto wayout;
    }

    $req = "SELECT * FROM sessions WHERE id = '$sessionid'";
    $session = DO_REQUEST($req);
    $session = $session[0];
    $mode = $session['mode'];

    if (pg_num_rows($requestResult) != 1) {
      $result = array('error' => true, 'text' => "no such session id", 'data' => $sessionid);
      goto wayout;
    }

    $req = "SELECT * FROM participants WHERE id = '$participantid'";
    $participant = DO_REQUEST($req);
    $participant = $participant[0];

    if (pg_num_rows($requestResult) != 1) {
      $result = array('error' => true, 'text' => "no such participant id", 'data' => $participantid);
      goto wayout;
    }

    //error_log('********setanswer*********');
    //error_log(print_r($_GET, true));

    $answers = (array)json_decode($answers, true);
    //error_log('answers : ' . print_r($answers, true));

    if ($mode == 'normal') {

      $number = 1;
      foreach ($answers as $answer) {

        $decanswerval = boolarray2int($answer);
        //error_log('value : ' . decbin($decanswerval));

        // already answer ?
        $req = "SELECT * FROM answers WHERE sessionid = '$sessionid' AND participantid = '$participantid' AND questionnumber = '$number'";
        $dbanswer = DO_REQUEST($req);

        // yes
        if (pg_num_rows($requestResult) == 1) {
          // update
          $req = "UPDATE answers SET answer='$decanswerval' WHERE sessionid = '$sessionid' AND participantid = '$participantid' AND questionnumber = '$number'";
          $dbanswer = DO_REQUEST($req);
        }
        else {
          // no, create
          $req = "INSERT INTO answers (sessionid, participantid, questionnumber, answer) VALUES ('$sessionid', '$participantid', '$number', '$decanswerval')";
          $dbanswer = DO_REQUEST($req);
        }

        $number++;
      }
    } else {

      // in group mode, only 1 answer.
      // the questionnumber is given by the client

      $answer = $answers[0];

      $decanswerval = boolarray2int($answer);
      //error_log('value : ' . decbin($decanswerval));

      // already answer ?
      $req = "SELECT * FROM answers WHERE sessionid = '$sessionid' AND participantid = '$participantid' AND questionnumber = '$questionnumber'";
      $dbanswer = DO_REQUEST($req);

      // yes
      if (pg_num_rows($requestResult) == 1) {
        // update
        $req = "UPDATE answers SET answer='$decanswerval' WHERE sessionid = '$sessionid' AND participantid = '$participantid' AND questionnumber = '$questionnumber'";
        $dbanswer = DO_REQUEST($req);
      }
      else {
        // no, create
        $req = "INSERT INTO answers (sessionid, participantid, questionnumber, answer) VALUES ('$sessionid', '$participantid', '$questionnumber', '$decanswerval')";
        $dbanswer = DO_REQUEST($req);
      }

    }

    $result = array('error' => false, 'text' => "");
    goto wayout;
  }
  else {
    $result = array('error' => true, 'text' => "no such API call");
    goto wayout;
  }


  wayout:

  echo json_encode($result);

?>
