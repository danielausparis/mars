<?php

require("utils.php");

session_start();

extract($_GET);

// params : code

$req = "SELECT * FROM users WHERE passwordsha256 = '$code'";
$dbanswer = DO_REQUEST($req);
$people = count($dbanswer);
if ($people < 1) {
  $say = "no such requester found !!";
  goto wayout;
}

$user = $dbanswer[0];

if($user['isapproved'] == 't') {
  $say = "This user had been approved earlier. No action !";
  goto wayout;
}

$req = "DELETE FROM users WHERE passwordsha256 = '$code'";
$dbanswer = DO_REQUEST($req);

$say = "user " . $people[0]['name'] . " deleted !!";

wayout:

?>

<h1>MARS user dis-approval</h1>

<p>
  <?php echo $say ?>
</p>
