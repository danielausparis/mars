<?php

require('utils.php');

    $req = "SELECT * FROM users WHERE nickname='admin'";
    $dbanswer = DO_REQUEST($req);
    print_r($dbanswer);

?>
