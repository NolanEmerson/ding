<?php
require_once 'mysqli_connect.php';

//Make PHP understand the Axios call
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

//Start the sessions
session_id($request_data['session_ID']);
session_start();

//Headers for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

//Data for Testing
// $_SESSION['user_id'] = 31;
// $request_data['completed'] = 1;
// $request_data['recipe_id'] = 13774;

//Check if user ID is a valid integer. This might be a $_SESSION['user_id'] later
if(!is_int($_SESSION['user_id'])){
    die('User ID is invalid');
}

//Check to see if diet is valid prior to checking if user is valid.
if($request_data['completed'] !== 0 && $request_data['completed'] !== 1){
    die('This is not a valid flag');
}
$flag = $request_data['completed'];
$recipe_id = $request_data['recipe_id'];

//Prepare statement for the UPDATE query
if(!($stmt = $myconn->prepare("UPDATE `user_choices` SET `complete` = ? WHERE `recipe_id` = ?"))){
    die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
}

//Bind statement for the UPDATE query
if(!$stmt->bind_param('ii', $flag, $recipe_id)){
    die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Execute the prepared statement
if(!$stmt->execute()){
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Check to see if there was an error with the update
if($stmt->affected_rows === -1) die('Error with updating row');
$stmt->close();
echo 'Success';

?>
