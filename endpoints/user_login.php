<?php
//Headers for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

//Sessions initialization
session_start();

//Require database connection
require_once 'mysqli_connect.php';
require_once 'passwordHelper.php';

//Make PHP understand the Axios call
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

//Test Data
// $request_data['email'] = "jeff@jeff.jeff";
// $request_data['password'] = "jeffrocks";

//Validate Email
if (!($email = filter_var($request_data['email'], FILTER_VALIDATE_EMAIL))){
    die('Your email is invalid');
}

//Validate Password
if (!preg_match('/^[a-zA-Z0-9]{8,32}$/', $request_data['password'])){
    die('Password is not correct');
}

$password = $request_data['password']; 
$password = changeMe($password);
//Prepared statement to SELECT user with matching email and password
if(!($stmt = $myconn->prepare("SELECT `id`, `email`, `status`, `meal_plan` FROM `users` WHERE `email` = ? AND `password` = ? LIMIT 1"))){
    die("Prepare failed: (" . $myconn->errno . ") " . $myconn->error);
}

//Binding parameters for the SELECT statement
if(!$stmt->bind_param('ss', $email, $password)){
    die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Execute the prepared SELECT query
if(!$stmt->execute()){
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}
$stmt->store_result();

//Bind results to variables
$stmt->bind_result($user_id, $username, $status, $meal_plan);
if($stmt->num_rows > 0) {
    if($stmt->fetch()){
        if($status === 'banned'){
            echo "You have been banned";
        } else {
            $_SESSION['logged'] = 1;
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $username;
            $output['meal_plan'] = $meal_plan;
            $output['success'] = true;
            $output['session_id'] = session_id();
            $encoded = json_encode($output);
            print($encoded);
        }
    }
} else {
    echo 'Invalid username/password combination';
}

$stmt->close();
$myconn->close();