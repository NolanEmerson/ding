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
// $_SESSION['user_id'] = 31;
// $request_data['diet'] = "ketogenic";
// $request_data['allergies'] = ['peanut', 'tree nut', 'ninjas', 'shellfish'];

//Check if user ID is a valid integer. This might be a $_SESSION['user_id'] later
if(!is_int($_SESSION['user_id'])){
    die('User ID is invalid');
}

//Check to see if diet is valid prior to checking if user is valid.
if (!dietCheck($request_data['diet'])){
    die('We do not support that diet');
}

//First we will do a SELECT query to see if the user exists in our user table
$user_id = $_SESSION['user_id'];
$diet = $request_data['diet'];

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
        if(!($stmt = $myconn->prepare("UPDATE `users` SET `diet` = ? WHERE `id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }
        
        //Bind statement for the UPDATE query
        if(!$stmt->bind_param('si', $diet, $user_id)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Execute the prepared statement
        if(!$stmt->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Check to see if there was an error with the update
        if($stmt->affected_rows === -1) die('Diet update error');
        $stmt->close();


        //Delete old allergy list
        //Prepare statement for the DELETE query
        if(!($stmt = $myconn->prepare("DELETE FROM `user-allergy` WHERE `user_id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }

        //Bind statement for the DELETE query
        if(!$stmt->bind_param('i', $user_id)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Execute the prepared DELETE query
        if(!$stmt->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        }
        $stmt->close();

        //Check to see if allergies are set and call our allergyCheck function from helper_functions.
        if(isset($request_data['allergies'])){
            $userAllergies = allergyCheck($request_data['allergies']);
            $acceptedAllergyCount = count($userAllergies);

            //Prepare and bind the INSERT query outside of the for loop
            //Prepare statement for the INSERT query
            if(!($stmt = $myconn->prepare("INSERT INTO `user-allergy`(`allergy_name`,`user_id`) VALUES (?, ?)"))){
                die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
            }
            //Bind statement for the INSERT query
            if(!$stmt->bind_param('si', $currentAllergy, $user_id)){
                die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
            }
            //Loop over all allergies to add a row for each one.
            for($countAccepted = 0; $countAccepted < $acceptedAllergyCount; $countAccepted++){
                $currentAllergy = $userAllergies[$countAccepted];

                //Execute the prepared INSERT query
                if(!$stmt->execute()){
                    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
                }
                
                //Check to see if any rows updated and exit otherwise
                if($stmt->affected_rows === 0) die('Allergy row did not get added');
            }
            echo 'Success';
        }
    }
} else {
    echo 'Not a valid user';
}

?>