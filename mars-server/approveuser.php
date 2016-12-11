<?php

require("utils.php");

require("lib/PHPMailer-master/PHPMailerAutoload.php");

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

$guy = $dbanswer[0];

if ($guy['isapproved'] == 't') {
  $say = "user " . $guy['name'] . " already approved !!";
  goto wayout;
}

$req = "UPDATE users SET isapproved='true' WHERE passwordsha256 = '$code'";
$dbanswer = DO_REQUEST($req);

$say = "user " . $guy['name'] . " approved !!";


// send good news to user
// prepare email
$message = "\r\n";
$message .= "Dear " . $guy['firstname'] . ",\r\n";
$message .= "\r\n";
$message .= "You are now invited to use the MARS system.\r\n";
$message .= "\r\n";
$message .= "Please login with the credentials you provided.\r\n";
$message .= "\r\n";
$message .= "Kind regards,\r\n";
$message .= "Your MARS system.\r\n";

// send email to guy

$mail = new PHPMailer;

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->CharSet = 'UTF-8';
$mail->Host = 'z.mines-telecom.fr';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'daniel.ranc@telecom-sudparis.eu';                 // SMTP username
$mail->Password = 'lapin_00';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->setFrom('from@mars.com', 'Mailer');
$mail->addAddress($guy['email']);     // Add a recipient
$mail->Subject = 'MARS approval';
$mail->Body = $message;

if(!$mail->send()) {
  $say .= "<br>Mail error :-( " . $mail->ErrorInfo;
} else {
  $say .= "<br>Mail has been sent out.";
}

wayout:

?>

<h1>MARS user approval</h1>

<p>
  <?php echo $say ?>
</p>
