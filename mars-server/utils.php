<?php
  require_once("dbparams.php");


  // LOCALIZATION
  date_default_timezone_set('CET');
  setlocale (LC_ALL, "fr_FR");

  /*
    convert array of boolean to integer

    normalize to internal answer format:
    integer bit format      8 7 6 5 4 3 2 1
    array of bool format    0 1 2 3 4 5 6 7
    power of 2              7 6 5 4 3 2 1 0

    array may be partial (less than 8 elements)

  */
  function boolarray2int($boolarray) {

    $length = count($boolarray);
    $result = 0;

    for ($i = 0; $i < $length; $i++) {
      if ($boolarray[$i]) {
        $result += pow(2, (7 - $i));
      }
    }

    return $result;
  }

  function dbconnect() {

    global $dbconn;

    $dbconn = pg_connect(getDbParams())
    or die('Connexion impossible : ' . pg_last_error($dbconn));
    pg_set_client_encoding ($dbconn, 'UNICODE');

  }

  function DO_REQUEST($query) {

    global $dbconn;
    global $requestResult;

    if (! $dbconn) dbconnect();

    $requestResult = pg_query($dbconn, $query) or die('Échec de la requête : ' . pg_last_error($dbconn));

    $rows = array();
    $i = 0;
    while ($line = pg_fetch_array($requestResult, null, PGSQL_ASSOC)) {
      $rows[$i] = $line;
      $i++;
    }

    return $rows;

  }

?>
