<?php
require_once 'mysqli_connect.php';

//Header files for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

//Make PHP understand the Axios call
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

//Test email
//$request_data['email'] = 'jeff2@jeff.jeff';

//Validate Email
if (!($email = filter_var($request_data['email'], FILTER_VALIDATE_EMAIL))){
    die('Your email is invalid');
}

//Prepared statement to SELECT user with matching email and password
if(!($stmt = $myconn->prepare("SELECT `email` FROM `users` WHERE `email` = ? LIMIT 1"))){
    die("Prepare failed: (" . $myconn->errno . ") " . $myconn->error);
}

//Binding parameters for the SELECT statement
if(!$stmt->bind_param('s', $email)){
    die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Execute the prepared SELECT query
if(!$stmt->execute()){
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}
$stmt->store_result();
if($stmt->num_rows > 0){
    echo "email taken";
} else {
    echo "email available";
}