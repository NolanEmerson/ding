<?php
//Headers for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

//Start the sessions
session_start();

require_once 'mysqli_connect.php';
require_once 'helper_functions.php';
require_once 'passwordHelper.php';

//Make PHP understand the Axios call
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

//Test Data
// $request_data['email'] = 'mjk@email.com';
// $request_data['password'] = 'password';
// $request_data['diet'] = 'none';
// $request_data['allergies'] = ['soy', 'sesame', 'strawberries', 'dandylions', 'dairy'];

//Validate Email
if (!($email = filter_var($request_data['email'], FILTER_VALIDATE_EMAIL))){
    die('Your email is invalid');
}

//Validate Password
if (!preg_match('/^[a-zA-Z0-9]{8,32}$/', $request_data['password'])){
    die('Password is not corect');
}

$password = $request_data['password'];
$password = changeMe($password);
//use dietCheck function from helper_functions.php to ensure the diet is correct.
if (!dietCheck($request_data['diet'])){
    die('We do not support that diet');
}

//Prepared statement for INSERT query
$diet = $request_data['diet'];
if(!($stmt = $myconn->prepare("INSERT INTO `users`(`email`, `password`, `diet`) VALUES (?, ?, ?)"))){
    die("Prepare failed: (" . $myconn->errno . ") " . $myconn->error);
} 

//Binding parameters for INSERT query
if(!$stmt->bind_param('sss', $email, $password, $diet)){
    die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Execute the INSERT query statement
if(!$stmt->execute()){
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}

//Test to see if we succesfully added the user
if($stmt->affected_rows === 0) die('User was not successfully added');
//Grab users id
$user_id = $stmt->insert_id;
$stmt->close();

//Checks to see if has allergies and if they do uses allergyCheck function to build a new array out of verified allergies.
if(isset($request_data['allergies'])){
    $userAllergies = allergyCheck($request_data['allergies']);
    $acceptedAllergyCount = count($userAllergies);

        
    
    //Prepare statement to insert allergy rows into user-allergy table
    if(!($stmt = $myconn->prepare("INSERT INTO `user-allergy`(`allergy_name`,`user_id`) VALUES (?, ?)"))){
        die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
    }
    //Bind parameters for allergy and user id to be added to user-allergy table
    if(!$stmt->bind_param('si', $currentAllergy, $user_id)){
        die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
    }
    //Loop through the array of possible allergies to create a row for each allergy the user has
    for($countAccepted = 0; $countAccepted < $acceptedAllergyCount; $countAccepted++){  
        $currentAllergy =  $userAllergies[$countAccepted];
        //Execute the statement
        if(!$stmt->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        }
        //Test to see if we succesfully added allergy table. Exit otherwise.
        if($stmt->affected_rows === 0) die('No rows updated');
    }
    $stmt->close();
    $_SESSION['logged'] = 1;
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $email;
    $_SESSION['meal_plan'] = 0;
    $output['success'] = true;
    $output['session_id'] = session_id();
    $encoded = json_encode($output);
    print($encoded);
}

?>