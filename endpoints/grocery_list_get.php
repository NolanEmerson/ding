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

//Test variables for diet update
// $_SESSION['user_id'] = 23;

//Check if user ID is a valid integer. This might be a $_SESSION['user_id'] later
if(!is_int($_SESSION['user_id'])){
    die('User ID is invalid');
} 
$user_id = $_SESSION['user_id'];

//Prepared statement to SELECT user with matching email and password
if(!($stmt = $myconn->prepare("SELECT `ingredient`, `id`, `complete` FROM `grocery_list` WHERE `user_id` = ?"))){
    die("Prepare failed: (" . $myconn->errno . ") " . $myconn->error);
}

//Binding parameters for the SELECT statement
if(!$stmt->bind_param('i', $user_id)){
    die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Execute the prepared SELECT query
if(!$stmt->execute()){
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}

$result = $stmt->get_result();
if($result->num_rows === 0) die('No ingredients');

$row = $result->fetch_all(MYSQLI_ASSOC);

//Send results to front end
$user_grocery_list = json_encode($row);
print_r($user_grocery_list);