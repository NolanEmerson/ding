<?php
//Make PHP understand the Axios call
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

//Start the sessions
session_id($request_data['session_ID']);
session_start();

require_once 'mysqli_connect.php';
require_once 'helper_functions.php';

//Header files for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

//Test variables for grocery list complete toggle
//  $_SESSION['user_id'] = 13;
//  $request_data['complete'] = 0;
//  $request_data['id'] = 1;

//Check if user ID is a valid integer. This might be a $_SESSION['user_id'] later
if(!is_int($_SESSION['user_id'])){
    die('User ID is invalid');
}

if(!($request_data['complete'] === 1 || $request_data['complete'] === 0)){
    die('Complete value invalid');
}

$user_id = $_SESSION['user_id'];
$id = $request_data['id'];
$complete = $request_data['complete'];

//Prepare statement for the SELECT query
if(!($stmt = $myconn->prepare("SELECT `status` FROM `users` WHERE `id` = ?"))){
    die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
}

//Bind statement for the SELECT query
if(!$stmt->bind_param('i', $user_id)){
    die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Execute the prepared statement
if(!$stmt->execute()){
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}

$stmt->store_result();
$stmt->bind_result($status);
if($stmt->num_rows > 0) {
    if($stmt->fetch()){
        //Test to see if the user has a banned status
        if($status === 'banned'){
            die("You have been banned");
        }

        //Prepare statement for the UPDATE query
        if(!($stmt = $myconn->prepare("UPDATE `grocery_list` SET `complete` = ? WHERE `grocery_list`.`id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }
        
        //Bind statement for the UPDATE query
        if(!$stmt->bind_param('ii', $complete, $id)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Execute the prepared statement
        if(!$stmt->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Check to see if there was an error with the update
        if($stmt->affected_rows === -1) die('Update error');
        $stmt->close();
    }
    echo 'Success';
} else {
    print_r($stmt);
    echo 'Not a valid user';
}

?>