<?php


// These parameters are exactly corresponding to the PHPMailer API

  function getMailParams() {

    return array(
      "Host" => "yoursmtphostFDQN",   // SMTP host
      "SMTPAuth" => true,             // true or false
      "Username" => "xxx",            // user
      "Password" => "yyy",            // password
      "SMTPSecure" => "tls",          // Enable TLS encryption, `ssl` also accepted
      "Port" => "587",                // port
      "setFrom" => "admin@itsmars.org"
    );

  }

?>
