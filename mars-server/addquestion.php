<?php
  // POST or GET parameters : pollid, questionid, json <- object as served by editorpopup.php

  // cbox1-8 : exact choice(s)
  // bit  8 7 6 5 4 3 2 1
  // cbox 1 2 3 4 5 6 7 8

  // if questionid is not defined, add question else rewrite it

  require("utils.php");

  extract($_POST);
  if (!isset($text)) {
    extract($_GET);
  }

  //error_log('GET : ' . print_r($_GET, true));

  $jsonobject = json_decode($json, true);

  //error_log('jsonobject : ' . print_r($jsonobject, true));

  $correctanswer = $jsonobject['correctanswer'];
  $nbchoices = count($jsonobject['choices']);
  $text = pg_escape_string($json);

  if(isset($questionid)) {
    // rewrite existing question

    $req = "UPDATE questions SET correctanswer='$correctanswer', nbchoices='$nbchoices', text='$text' WHERE id='$questionid'";
    DO_REQUEST($req);

  }
  else {
    // new question

    // find max number
    $req = "SELECT number FROM questions WHERE pollid = '$pollid' ORDER BY number DESC LIMIT 1";
    $res = DO_REQUEST($req);
    if (count($res) == 0) {
      $max = 0;
    } else {
      $max = $res[0]['number'];
    }

    $max = $max + 1;

    $req = "INSERT INTO questions (text, pollid, correctanswer, nbchoices, number) VALUES ('$text', '$pollid', '$correctanswer', '$nbchoices', '$max')";
    DO_REQUEST($req);
  }


?>
