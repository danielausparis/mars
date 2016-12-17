<?php

  require("utils.php");
  require("mailparams.php");

  require("lib/PHPMailer-master/PHPMailerAutoload.php");

  session_start();

  extract($_GET);

  if ($_GET['task'] === 'createsession') {

    $pollid = $_GET['pollid'];
    $launcherid = $_GET['launcherid'];
    $authorid = $_GET['authorid'];

    $unixdate = time();

    $printdate = strftime('%Y-%b-%d %k:%M',$unixdate);
    error_log('createsession date : ' . $printdate);

    // création d'un PIN
    $codestr = "";
    for($i = 1; $i <= 4; $i++) {
      while (($n = rand(0,9)) == 0);
      $codestr .= $n;
    }

    $code = intval($codestr);

    if ($_GET['mode'] == 'group') {
      $mode = 'group';
    }
    else {
      $mode = 'normal';
    }

    // création d'un enregistrement de la table session
    $request = "INSERT INTO sessions (pollid, datestart, secret, mode, launcherid, authorid) VALUES ('$pollid', '$unixdate', '$code', '$mode', '$launcherid', '$authorid') RETURNING id";
    DO_REQUEST($request);
    $request = "SELECT id FROM sessions ORDER BY id DESC LIMIT 1";
    $result = DO_REQUEST($request);
    $lastid = $result[0]['id'];

    $sessionid = $lastid;

    // return session
    $request = "SELECT * FROM sessions WHERE id = '$sessionid'";
    $result = DO_REQUEST($request);
    $session = $result[0];

    // $session['userdate'] = date('D j M H:i', strtotime($session['datestart']));

    $result = array('error' => false, 'text' => "ok",
      'pollid' => $pollid, 'sessionid' => $sessionid,
      'secret' => $code, 'session' => $session);
    goto wayout;

  }

  else if ($_GET['task'] === 'addpoll') {

    //error_log('addpoll : ' . print_r($_GET, true));

    $request = "INSERT INTO polls (name, type, authorid) VALUES ('$title', '$type', '$authorid')";
    $polls = DO_REQUEST($request);
    $request = "SELECT id FROM polls ORDER BY id DESC LIMIT 1";
    $result = DO_REQUEST($request);
    $lastpollid = $result[0]['id'];

    $result = array('error' => false, 'text' => "ok", 'pollid' => $lastpollid);

    goto wayout;

  }

  else if ($task === 'deletepoll') {

    //error_log('deletepoll : ' . print_r($_GET, true));

    $req = "DELETE FROM polls WHERE id = '$pollid'";
    DO_REQUEST($req);

    $req = "DELETE FROM questions WHERE pollid = '$pollid'";
    DO_REQUEST($req);

    // delete sessions and their participants
    $req = "SELECT * FROM sessions WHERE pollid = '$pollid'";
    $sessions = DO_REQUEST($req);
    foreach ($sessions as $session) {
      $sessionid = $session['sessionid'];
      $req = "DELETE FROM participants WHERE sessionid = '$sessionid'";
      DO_REQUEST($req);
    }

    $req = "DELETE FROM sessions WHERE pollid = '$pollid'";
    DO_REQUEST($req);

    $result = array('error' => false, 'text' => "ok");

    goto wayout;

  }

  else if ($task === 'deletesession') {

    //error_log('deletesession : ' . print_r($_GET, true));

    // delete session and their participants
    $req = "DELETE FROM participants WHERE sessionid = '$sessionid'";
    DO_REQUEST($req);

    $req = "DELETE FROM sessions WHERE id = '$sessionid'";
    DO_REQUEST($req);

    $result = array('error' => false, 'text' => "ok");

    goto wayout;

  }

  else if ($_GET['task'] === 'getonepoll') {

    //error_log('getonepoll : ' . print_r($_GET, true));

    // parms = {
    //   pollid
    //   mode : 'internal' or 'export' !
    // }

    // verify mode parameter
    if ($mode != 'internal' && $mode != 'export') {
      $result = array('error' => true, 'text' => "wrong mode parameter");
      goto wayout;
    }

    $req = "SELECT * FROM polls WHERE id = '$pollid'";
    $poll = DO_REQUEST($req);
    if (count($poll) == 1) {
      $poll = $poll[0];

      // get author
      $authorid = $poll['authorid'];
      $req = "SELECT * FROM users WHERE id = '$authorid'";
      $author = DO_REQUEST($req);
      if (count($author) == 1) {
        $author = $author[0];
        $poll['author'] = $author;

        // get questions
        $req = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER BY number";
        $questions = DO_REQUEST($req);
        $poll['questions'] = $questions;
        // decode the json text !!! else twice encoding...
        $max = count($poll['questions']);
        for ($i=0; $i < $max; $i++) {
          $poll['questions'][$i]['text'] = json_decode($poll['questions'][$i]['text'], true);
        }

        // done. now return differently depending on mode parameter
        if ($mode == 'internal') {
          $result = array('error' => false, 'text' => "ok", 'data' => $poll);
          goto wayout;
        }
        elseif ($mode == 'export') {

          //write stuff in temporary file
          $tempfile = tmpfile();
          fwrite($tempfile, json_encode($poll));
          fseek($tempfile, 0);

          // file size: http://stackoverflow.com/questions/11212569/retrieve-path-of-tmpfile
          $metadatas = stream_get_meta_data($tempfile);
          $fullpath = $metadatas['uri'];
          $fsize = filesize($fullpath);

          // file name
          $filename = 'poll-' . $pollid . '-mars.json';

          // http://www.web-development-blog.com/archives/php-download-file-script/
          header("Content-type: application/json");
          header('Content-Disposition: attachment; filename="'.$filename.'"');
          header('x-filename: "'.$filename.'"');
          header('Expires: 0');
          header('Cache-Control: must-revalidate');
          header('Pragma: public');
          header("Content-Length: " . $fsize);
          readfile($fullpath);

          // forget the temporary file
          fclose($tempfile);
          exit;
        }

      } else {
        $result = array('error' => true, 'text' => "DB inconsistency");
        goto wayout;
      }
    } else {
      $result = array('error' => true, 'text' => "no poll or DB inconsistency");
      goto wayout;
    }

  }


  else if ($_GET['task'] === 'propagatecolors') {

    //error_log('propagatecolors : ' . print_r($_GET, true));

    // parms = {
    //   pollid
    //   textcolor
    //   backgroundcolor
    // }

    $req = "SELECT * FROM polls WHERE id = '$pollid'";
    $poll = DO_REQUEST($req);
    if (count($poll) == 1) {
      $poll = $poll[0];

      // get questions
      $req = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER BY number";
      $questions = DO_REQUEST($req);
      // decode the json text
      $max = count($questions);
      for ($i = 0; $i < $max; $i++) {
        $questions[$i]['text'] = json_decode($questions[$i]['text'], true);
        // new colors
        $questions[$i]['text']['textcolor'] = $textcolor;
        $questions[$i]['text']['backgroundcolor'] = $backgroundcolor;

        // re-encode
        $jsontext = pg_escape_string(json_encode($questions[$i]['text']));

        //error_log('propagatecolors : ' . print_r($jsontext, true));

        // update question
        $questionid = $questions[$i]['id'];
        $request = "UPDATE questions SET text='$jsontext' WHERE id = '$questionid'";
        DO_REQUEST($request);
      }
      $result = array('error' => false, 'text' => "ok");
      goto wayout;

    } else {
      $result = array('error' => true, 'text' => "no poll or DB inconsistency");
      goto wayout;
    }

  }


  else if ($_GET['task'] === 'forkpoll') {

    //error_log('forkpolls : ' . print_r($_GET, true));
    // parms = {
    //   task : 'forkpoll',
    //   pollid : pollid,
    //   newauthorid : user.getid()
    // }

    $req = "SELECT * FROM polls WHERE id = '$pollid'";
    $poll = DO_REQUEST($req);
    if (count($poll) == 1) {
      $poll = $poll[0];
      $title = $poll['name'];
      $type = $poll['type'];

      // verify author exists
      $authorid = $poll['authorid'];
      $req = "SELECT * FROM users WHERE id = '$authorid'";
      $author = DO_REQUEST($req);
      if (count($author) == 1) {

        // verify  new author exists
        $req = "SELECT * FROM users WHERE id = '$newauthorid'";
        $author = DO_REQUEST($req);
        if (count($author) == 1) {

          // create new poll with new author
          $request = "INSERT INTO polls (name, type, authorid) VALUES ('$title', '$type', '$newauthorid') RETURNING id";
          $polls = DO_REQUEST($request);
          $request = "SELECT id FROM polls ORDER BY id DESC LIMIT 1";
          $result = DO_REQUEST($request);
          $newpollid = $result[0]['id'];

          // get questions
          $request = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER BY number";
          $questions = DO_REQUEST($request);

          foreach ($questions as $question) {
            //error_log('forkpolls : ' . print_r($question, true));
            $text = pg_escape_string($question['text']);
            $correctanswer = $question['correctanswer'];
            $nbchoices = $question['nbchoices'];
            $number = $question['number'];
            $request = "INSERT INTO questions (text, pollid, correctanswer, nbchoices, number) VALUES ('$text', '$newpollid', '$correctanswer', '$nbchoices', '$number')";
            DO_REQUEST($request);
          }

          $result = array('error' => false, 'text' => "ok");
          goto wayout;
        } else {
          $result = array('error' => true, 'text' => "new author not found");
          goto wayout;
        }
      } else {
        $result = array('error' => true, 'text' => "author not found");
        goto wayout;
      }
    } else {
      $result = array('error' => true, 'text' => "poll not found");
      goto wayout;
    }

  }



  else if ($_GET['task'] === 'getpolls') {

    //error_log('getpolls : ' . print_r($_GET, true));

    $req = "SELECT * FROM polls";
    $polls = DO_REQUEST($req);
    $cpolls = count($polls);

    // associate author names and sort on them ;
    // in parallel, associate question count
    for ($i=0; $i < $cpolls; $i++) {
      $authorid = $polls[$i]['authorid'];
      $req = "SELECT * FROM users WHERE id = '$authorid'";
      $author = DO_REQUEST($req);
      if (count($author) == 1) {
        $author = $author[0];
        $polls[$i]['authorname'] = $author['name'];
        $polls[$i]['authorfirstname'] = $author['firstname'];
      } else {
        $polls[$i]['authorname'] = "unknown";
        $polls[$i]['authorfirstname'] = "unknown";
      }
      $pollid = $polls[$i]['id'];
      $req="SELECT * FROM questions WHERE pollid = '$pollid'";
      $questions = DO_REQUEST($req);
      $polls[$i]['questioncount'] = count($questions);
    }

    // Define the custom sort function
    function custom_sort($a, $b) {
      return $a['authorname'] > $b['authorname'];
    }
    usort($polls, "custom_sort");

    //error_log('getpolls : ' . print_r($polls, true));

    $result = array('error' => false, 'text' => "ok", 'data' => $polls);
    goto wayout;

  }

  else if ($_GET['task'] === 'getsessions') {

    //error_log('getsessions : ' . print_r($_GET, true));
    if ($userid == 0) {
      $req = "SELECT * FROM sessions ORDER BY datestart";
    } else {
      $req = "SELECT * FROM sessions WHERE launcherid = '$userid' ORDER BY datestart";
    }

    $sessions = DO_REQUEST($req);
    $csessions = count($sessions);

    // associate author names and sort on them
    for ($i=0; $i < $csessions; $i++) {

      // authors
      $authorid = $sessions[$i]['authorid'];
      $req = "SELECT * FROM users WHERE id = '$authorid'";
      $author = DO_REQUEST($req);
      if (count($author) == 1) {
        $author = $author[0];
        $sessions[$i]['authorname'] = $author['name'];
        $sessions[$i]['authorfirstname'] = $author['firstname'];
      } else {
        $sessions[$i]['authorname'] = "unknown";
        $sessions[$i]['authorfirstname'] = "unknown";
      }
    }

    // Define the custom sort function
    function custom_sort($a, $b) {
      return $a['authorname'] > $b['authorname'];
    }
    usort($sessions, "custom_sort");

    // associate poll
    for ($i=0; $i < $csessions; $i++) {
      $pollid = $sessions[$i]['pollid'];
      $req = "SELECT * FROM polls WHERE id = '$pollid'";
      $poll = DO_REQUEST($req);
      if (count($poll) == 1) {
        $poll = $poll[0];
        $sessions[$i]['title'] = $poll['name'];
        $sessions[$i]['poll'] = $poll;
      } else {
        $sessions[$i]['title'] = "unknown";
      }
    }

    //error_log('getsessions : ' . print_r($sessions, true));

    $result = array('error' => false, 'text' => "ok", 'data' => $sessions);
    goto wayout;

  }


  else if ($_GET['task'] === 'getparticipantnumber') {

    $req = "SELECT * FROM participants WHERE sessionid = '$sessionid'";
    $result = DO_REQUEST($req);
    $participantnumber = count($result);
    $result = array('error' => false, 'text' => "ok", 'participantnumber' => $participantnumber);
    goto wayout;

  }

  else if ($_GET['task'] === 'setstatus') {

    $status = $_GET['status'];
    $req = "UPDATE sessions SET status='$status' WHERE id = '$sessionid'";
    $dbanswer = DO_REQUEST($req);

    $result = array('error' => false, 'text' => "ok", 'status' => $status);
    goto wayout;

  }

  else if ($_GET['task'] === 'checkuser') {

    //error_log('checkuser : ' . print_r($_GET, true));

    $encpassword = $_GET['encpassword'];
    $nicknameoremail = $_GET['nicknameoremail'];

    if (strlen($nicknameoremail) > 0) {
      // try with email
      $req = "SELECT * FROM users WHERE email = '$nicknameoremail'";
      $dbanswer = DO_REQUEST($req);
      $people = count($dbanswer);
      if ($people != 1) {
        // try with nickname
        $req = "SELECT * FROM users WHERE nickname = '$nicknameoremail'";
        $dbanswer = DO_REQUEST($req);
        $people = count($dbanswer);
        if ($people != 1) {
          $result = array('error' => true, 'text' => "unknown user");
          goto wayout;
        }
      }
    } else {
      $result = array('error' => true, 'text' => "empty user credentials");
      goto wayout;
    }

    $dbuser = $dbanswer[0];

    if ($dbuser['passwordsha256'] == $encpassword) {

      //error_log('checkuser : ' . print_r($dbuser['isapproved'], true));
      $isapproved = ($dbuser['isapproved'] == 't') ? 1 : 0;
      if ($isapproved) {
        // success, setup $_SESSION
        $_SESSION['user'] = $dbuser;

        // eliminate password
        $user = array('name' => $dbuser['name'], 'firstname' => $dbuser['firstname'],
          'id' => $dbuser['id'], 'email' => $dbuser['email'],
          'nickname' => $dbuser['nickname'],);

        $result = array('error' => false, 'text' => "ok", 'user' => $user);
        //error_log('checkuser : ' . print_r($result, true));
        goto wayout;

      } else {
        // not approved
        $result = array('error' => true, 'text' => "not approved yet");
        goto wayout;
      }
    } else {
      $result = array('error' => true, 'text' => "wrong password");
      goto wayout;
    }

  }


  else if ($_GET['task'] === 'getemail') {
    // parms = {
    //   task : 'getemail',
    //   userid : user.getid()
    // }
    $userid = $_GET['userid'];

    $req = "SELECT * FROM users WHERE id = '$userid'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);

    if ($people == 0) {
      $result = array('error' => true, 'text' => "unknown user");
      goto wayout;
    }

    $email = $dbanswer[0]['email'];

    $result = array('error' => false, 'text' => "ok", 'data' => $email);
    goto wayout;

  }


  else if ($_GET['task'] === 'changeemail') {
    // parms = {
    //   task : 'changeemail',
    //   userid : user.getid(),
    //   email : $scope.email
    // }
    $userid = $_GET['userid'];
    $email = $_GET['email'];

    error_log('changeemail : ' . $email);

    $req = "SELECT * FROM users WHERE id = '$userid'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);

    if ($people == 0) {
      $result = array('error' => true, 'text' => "unknown user");
      goto wayout;
    }

    $req = "UPDATE users SET email='$email' WHERE id = '$userid'";
    $dbanswer = DO_REQUEST($req);

    $result = array('error' => false, 'text' => "ok");
    goto wayout;

  }


  else if ($_GET['task'] === 'changepassword') {
    // parms = {
    //   task : 'changepassword',
    //   userid : user.getid(),
    //   oldpassword : sha256($scope.oldpassword),
    //   newpassword : sha256($scope.newpassword)
    // }

    $userid = $_GET['userid'];
    $oldpassword = $_GET['oldpassword'];
    $newpassword = $_GET['newpassword'];

    error_log('changepassword ');

    $req = "SELECT * FROM users WHERE id = '$userid'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);

    if ($people == 0) {
      $result = array('error' => true, 'text' => "unknown user");
      goto wayout;
    }

    if ($oldpassword != $dbanswer[0]['passwordsha256']) {
      $result = array('error' => true, 'text' => "wrong password");
      goto wayout;
    }

    $req = "UPDATE users SET passwordsha256='$newpassword' WHERE id = '$userid'";
    $dbanswer = DO_REQUEST($req);

    $result = array('error' => false, 'text' => "ok");
    goto wayout;

  }



  else if ($_GET['task'] === 'registeruser') {

    //error_log('registeruser : ' . print_r($_GET, true));

    $email = $_GET['email'];
    $nickname = $_GET['nickname'];
    $name = $_GET['name'];
    $firstname = $_GET['firstname'];
    $encpassword = $_GET['encpassword'];

    if ((strlen($email) == 0) || (strlen($nickname) == 0)
      || (strlen($name) == 0) || (strlen($firstname) == 0)
      || (strlen($encpassword) == 0))
    {
      $result = array('error' => true, 'text' => "empty credentials");
      goto wayout;
    }

    $req = "SELECT * FROM users WHERE email = '$email'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);
    if ($people > 0) {
      $result = array('error' => true, 'text' => "user already registered");
      goto wayout;
    }

    $req = "SELECT * FROM users WHERE nickname = '$nickname'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);
    if ($people > 0) {
      $result = array('error' => true, 'text' => "user already registered");
      goto wayout;
    }

    $req = "SELECT * FROM users WHERE name = '$name'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);
    if ($people > 0) {
      $result = array('error' => true, 'text' => "user already registered");
      goto wayout;
    }

    $req = "SELECT * FROM users WHERE email = '$email'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);
    if ($people > 0) {
      $result = array('error' => true, 'text' => "user already registered");
      goto wayout;
    }

    $req = "INSERT INTO users (name, firstname, nickname, email, passwordsha256) VALUES ('$name', '$firstname', '$nickname', '$email', '$encpassword')";
    $dbanswer = DO_REQUEST($req);

    $link = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') .
    '://' . "{$_SERVER['HTTP_HOST']}";
    $link .= dirname($_SERVER['REQUEST_URI']) . '/';
    $approvelink = $link . "approveuser.php?code=" . $encpassword;
    $disapprovelink = $link . "disapproveuser.php?code=" . $encpassword;

    // prepare email
    $message = "\r\n";
    $message .= "Dear MARS admin, a new user has requested admission to our system.\r\n";
    $message .= "\r\n";
    $message .= $firstname . " " . $name . ", email: " . $email . "\r\n";
    $message .= "\r\n";
    $message .= "If you AGREE, clic HERE: " . $approvelink . "\r\n";
    $message .= "\r\n";
    $message .= "If you DISAGREE, clic HERE: " . $disapprovelink . "\r\n";
    $message .= "\r\n";
    $message .= "Kind regards,\r\n";
    $message .= "Your MARS system.\r\n";

    // send email to admin
    $req = "SELECT * FROM users WHERE isadmin = 'true'";
    $dbanswer = DO_REQUEST($req);
    $people = count($dbanswer);
    if ($people < 1) {
      $result = array('error' => true, 'text' => "no admin found !!");
      goto wayout;
    }
    $adminemail = $dbanswer['0']['email'];

    $mail = new PHPMailer;

    $mailparams = getMailParams();

    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->CharSet = 'UTF-8';
    $mail->Host = $mailparams['Host'];  // Specify main and backup SMTP servers
    $mail->SMTPAuth = $mailparams['SMTPAuth'];                               // Enable SMTP authentication
    $mail->Username = $mailparams['Username'];         // SMTP username
    $mail->Password = $mailparams['Password'];       // SMTP password
    $mail->SMTPSecure = $mailparams['SMTPSecure'];   // Enable TLS encryption, `ssl` also accepted
    $mail->Port = $mailparams['Port'];                               // TCP port to connect to

    $mail->setFrom($mailparams['setFrom'] , 'Mailer');
    $mail->addAddress($adminemail);     // Add a recipient
    $mail->Subject = 'MARS new user request';
    $mail->Body = $message;

    if(!$mail->send()) {
      $result = array('error' => true,
        'text' => "could not send email to admin." . $mail->ErrorInfo);
      goto wayout;
    } else {
      $result = array('error' => false, 'text' => "ok");
      goto wayout;
    }

  }


  else if ($_GET['task'] === 'getstatus') {

    $req = "SELECT * FROM sessions WHERE id = '$sessionid'";
    $dbanswer = DO_REQUEST($req);

    //error_log('getstatus : ' . print_r($dbanswer, true));

    $status = $dbanswer[0]['status'];
    $result = array('error' => false, 'text' => "ok", 'status' => $status);
    goto wayout;

  }

  else if ($_GET['task'] === 'getrawanswers') {
    // params :
    //          sessionid
    //          pollid

    $req = "SELECT * FROM participants WHERE sessionid = '$sessionid' ORDER BY nickname";
    $persons = DO_REQUEST($req);
    //error_log('persons before : ' . print_r($persons, true));

    $req = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER BY number";
    $questions = DO_REQUEST($req);

    $countquestions = count($questions);
    //error_log('getanswers : ' . $countquestions);

    $countpersons = count($persons);

    for ($i = 0; $i < $countpersons; $i++) {

      $personid = $persons[$i]['id'];
      $req = "SELECT * FROM answers WHERE sessionid = '$sessionid' AND participantid = '$personid' ORDER BY questionnumber";
      $answers = DO_REQUEST($req);
      //error_log('************************ answers : ' . print_r($answers, true));

      $persons[$i]['answers'] = array();

      for ($k=0; $k < $countquestions; $k++) {
        //error_log('k : ' . $k);
        $persons[$i]['answers'][$k]['count'] = $questions[$k]['nbchoices'];
        $persons[$i]['answers'][$k]['booltable'] = array();

        for ($j=0; $j < $questions[$k]['nbchoices']; $j++) {
          //error_log('answers[k] : ' . print_r($answers[$k], true));
          if(isset($answers[$k])) {
            if ($answers[$k]['answer'] & pow(2, 7-$j)) {
              $persons[$i]['answers'][$k]['booltable'][$j] = true;
            }
            else {
              $persons[$i]['answers'][$k]['booltable'][$j] = false;
            }
          } else {
            $persons[$i]['answers'][$k]['booltable'][$j] = false;
          }
        }
      }
    }

    //error_log('persons after : ' . print_r($persons, true));


    $result = array('error' => false, 'text' => "ok", 'data' => $persons);
    goto wayout;

  }


  else if ($_GET['task'] === 'getresults') {

    $req = "SELECT * FROM participants WHERE sessionid = '$sessionid' ORDER BY nickname";
    $persons = DO_REQUEST($req);

    $countpersons = count($persons);

    $req = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER BY number";
    $questions = DO_REQUEST($req);

    $countquestions = count($questions);
    //error_log('getresults : ' . $countquestions);

    // qstats : pourcentage de bonnes réponses à une question donnée
    $qstats = array();
    for ($i=0; $i < $countquestions; $i++) {
      $qstats[$i] = 0.00;
    }

    // calcul de la fréquence des choix pour chaque question
    $choicestats = array();
    for ($i=0; $i < $countquestions; $i++) {
      $choicestats[$i] = array();
      for ($j=0; $j < $questions[$i]['nbchoices']; $j++) {
        $choicestats[$i][$j] = 0;
      }
    }

    for ($i=0; $i < $countquestions; $i++) {

      $number = $questions[$i]['number'];
      $req = "SELECT * FROM answers WHERE questionnumber = '$number' AND sessionid = '$sessionid'";
      $answers = DO_REQUEST($req);

      foreach ($answers as $answer) {
        for ($j=0; $j < $questions[$i]['nbchoices']; $j++) {
          if ($answer['answer'] & pow(2, 7-$j)) {
            $choicestats[$i][$j]++;
          }
        }
      }
      //error_log('choicestats before for question ' . $number . ': ' . print_r($choicestats, true));
    }


    // recalculer avec normalisation en fonction du nombre de votes, par question.
    for ($i=0; $i < $countquestions; $i++) {
      $totalvotes = 0;
      for ($j=0; $j < $questions[$i]['nbchoices']; $j++) {
        $totalvotes += $choicestats[$i][$j];
      }
      //error_log('totalvotes for question ' . $i . ': ' . $totalvotes);
      normalisation :
      for ($j=0; $j < $questions[$i]['nbchoices']; $j++) {
        if ($totalvotes > 0) {
          $choicestats[$i][$j] = round($choicestats[$i][$j] / $totalvotes * 100);
          //$choicestats[$i][$j] = round($choicestats[$i][$j] / $countpersons * 100);
        }
        else {
          $choicestats[$i][$j] = 0;
        }
      }
    }

    //error_log('choicestats after : ' . print_r($choicestats, true));


    $countpersons = count($persons);
    if ($countpersons != 0) {
      $diff = 100 / $countpersons;
    } else {
      $diff = 100;
    }

    for ($i = 0; $i < $countpersons; $i++) {

      $personid = $persons[$i]['id'];
      $req = "SELECT * FROM answers WHERE sessionid = '$sessionid' AND participantid = '$personid' ORDER BY questionnumber";
      $answers = DO_REQUEST($req);
      //error_log('answers : ' . print_r($answers, true));

      $persons[$i]['answers'] = array();

      // fill the boolean array with false, to facilitate display on manager
      $persons[$i]['answers'] =
        array_pad($persons[$i]['answers'], $countquestions , false);

      $goodones = 0;
      $j = 0;

      foreach ($answers as $answer) {

        $questnumber = $answer['questionnumber'];
        //error_log('number : ' . $questnumber);
        //error_log('correct : ' . $questions[$questnumber - 1]['correctanswer'] . ' & given : ' . $answer['answer']);
        if ($questions[$questnumber - 1]['correctanswer'] == $answer['answer']) {
          $goodones++;
          //$persons[$i]['answers'][$questnumber] = true;
          // the above line is incorrect: it mutates the array into an associative object :-(
          // this HAS to be coded like this :
          $persons[$i]['answers'][$j] = true;
          $qstats[$questnumber - 1] += $diff;
        }
        else {
          //$persons[$i]['answers'][$questnumber] = false;
          $persons[$i]['answers'][$j] = false;
        }

        $j++;

      }

      $persons[$i]['score'] = $goodones / $countquestions;

    }

    for ($i=0; $i < $countquestions; $i++) {
      $qstats[$i] = round($qstats[$i]);
    }

    //error_log('qstats : ' . print_r($qstats, true));

    $result = array('error' => false, 'text' => "ok", 'data' => $persons, 'qstats' => $qstats, 'choicestats' => $choicestats);
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

    // dates, see localization in utils.php
    $userdate = date('D j M H:i', strtotime($session['datestart']));

    // get poll
    $pollid = $session['pollid'];

    // get questions
    $req = "SELECT * FROM questions WHERE pollid = '$pollid' ORDER by number";
    $questions = DO_REQUEST($req);
    $nbQuestions = count($questions);

    // decode question text (json) to avoid double json_encode !
    for ($i=0; $i < count($questions); $i++) {
      $questions[$i]['text'] = json_decode($questions[$i]['text'], true);
    }

    $result = array('error' => false, 'text' => "questions",
      'data' => $questions, 'date' => $userdate);
    goto wayout;

  }
  else if ($_GET['task'] === 'setquestionnumber') {

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

    if (!is_numeric($number)) {
      $result = array('error' => true, 'text' => "bad parameter : number");
      goto wayout;
    }

    //error_log('set questionnumber: ' . $number);

    $req = "UPDATE sessions SET questionnumber='$number' WHERE id = '$sessionid'";
    $dbanswer = DO_REQUEST($req);

    $result = array('error' => false, 'text' => "ok");
    goto wayout;

  }

  else {
    $result = array('error' => true, 'text' => "no such API call");
    goto wayout;
  }


  wayout:

  echo json_encode($result);

?>
