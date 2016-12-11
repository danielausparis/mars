<?php

  // GET parameters : pollid, questionid, direction

  require("utils.php");

  global $requestResult;

  //error_log('movequestion : ' . print_r($_GET, true));

  extract($_GET);

  $req = "SELECT number FROM questions WHERE pollid = '$pollid' ORDER BY number DESC LIMIT 1";
  $res = DO_REQUEST($req);
  $max = $res[0]['number'];

  if ($direction == '-') {

    // read question and the one before
    $req = "SELECT * FROM questions WHERE id = '$questionid'";
    $question = DO_REQUEST($req);
    $question = $question[0];

    $number = $question['number'];
    if ($number < 2)
      goto wayout;

    $numberbefore = $number - 1;

    $req = "SELECT * FROM questions WHERE number = '$numberbefore' AND pollid = '$pollid'";
    $questionbefore = DO_REQUEST($req);
    $questionbefore = $questionbefore[0];
    $idbefore = $questionbefore['id'];

    // swap numbers
    $req = "UPDATE questions SET number='$numberbefore' WHERE id='$questionid'";
    DO_REQUEST($req);
    $req = "UPDATE questions SET number='$number' WHERE id='$idbefore'";
    DO_REQUEST($req);

    goto wayout;

  }

  if ($direction == '+') {

    // read question and the one after
    $req = "SELECT * FROM questions WHERE id = '$questionid'";
    $question = DO_REQUEST($req);
    $question = $question[0];

    $number = $question['number'];
    if ($number > $max - 1)
      goto wayout;

    $numberafter = $number + 1;

    $req = "SELECT * FROM questions WHERE number = '$numberafter' AND pollid = '$pollid'";
    $questionafter = DO_REQUEST($req);
    $questionafter = $questionafter[0];
    $idafter = $questionafter['id'];

    // swap numbers
    $req = "UPDATE questions SET number='$numberafter' WHERE id='$questionid'";
    DO_REQUEST($req);
    $req = "UPDATE questions SET number='$number' WHERE id='$idafter'";
    DO_REQUEST($req);

    goto wayout;

  }

  if ($direction == 'X') {

    // delete question and renumber
    $req = "SELECT * FROM questions WHERE id = '$questionid'";
    $question = DO_REQUEST($req);

    if (count($question) < 1) {
      // illogic
      goto wayout;
    }

    $question = $question[0];

    $number = $question['number'];

    $req = "DELETE FROM questions WHERE number = '$number' AND pollid = '$pollid'";
    DO_REQUEST($req);

    $req = "SELECT * FROM questions WHERE number > '$number' AND pollid = '$pollid'";
    $quests = DO_REQUEST($req);

    foreach ($quests as $quest) {
      // update
      $id = $quest['id'];
      $n = $quest['number'];
      $n--;
      $req = "UPDATE questions SET number='$n' WHERE id='$id'";
      DO_REQUEST($req);
    }

  }


  wayout:
  //header('location: editquestions.php?pollid=' . $pollid);
  $result = array('error' => false, 'text' => "ok");

?>
