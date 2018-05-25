<?php
require_once 'mysqli_connect.php';

//Make PHP understand the Axios call
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

//Start the sessions
session_id($request_data['session_ID']);
session_start();

//Headers used for local development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

//Constant used for updating users meal plan status to true after meal plan has been generated
$truthy = 1;

//This is test filler data. It needs to be commented out when using the code.
// $_SESSION['user_id'] = 31;
// $request_data['recipe_ids'] = [36725, 13774];

$recipe_count = count($request_data['recipe_ids']);

//Test to see if the $user_id is an integer
if(!is_int($_SESSION['user_id'])){
    die('User ID is invalid');
}

//First we will do a SELECT query to see if the user exists in our user table
$user_id = $_SESSION['user_id'];

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

        //Prepare statement to delete any possible meal rows currently in the table. We will rebuild after.
        if(!($stmt = $myconn->prepare("DELETE FROM `user_choices` WHERE `user_id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }

        //Bind statement for the DELETE query
        if(!$stmt->bind_param('i', $user_id)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Execute the delete statement
        if(!$stmt->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        } 
        
        $stmt->close();

        if(!($stmt = $myconn->prepare("DELETE FROM `grocery_list` WHERE `user_id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }

        //Bind statement for the DELETE query
        if(!$stmt->bind_param('i', $user_id)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Execute the delete statement
        if(!$stmt->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        } 
        
        $stmt->close();

        //Test the recipes to be added to see if they exist in our database, if they do add them to the meal plan.
        //Prepare statement for the SELECT statement that will happen in the loop.
        if(!($stmt = $myconn->prepare("SELECT `recipe_id` FROM `recipe-allergy` WHERE `recipe_id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }

        //Bind statement for the SELECT query
        if(!$stmt->bind_param('i', $testRecipeID)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        //Prepare statement for the INSERT query into recipes
        if(!($stmtAdd = $myconn->prepare("INSERT INTO `user_choices`(`user_id`, `choice_num`, `recipe_id`) VALUES (?, ?, ?)"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }
        
        //Bind statement for the INSERT query
        if(!$stmtAdd->bind_param('iii', $user_id, $loop_count, $testRecipeID)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        for ($loop_count = 0; $loop_count < $recipe_count; $loop_count++){
            $testRecipeID = $request_data['recipe_ids'][$loop_count];
        
            //Execute the SELECT statement
            if(!$stmt->execute()){
                die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
            }
            
            $stmt->store_result();
            
            //If the recipe was found in our recipe database, we want to now add it into the meal plan database
            if($stmt->num_rows > 0){
                //Execute the INSERT statement
                $stmtAdd->execute();
                if($stmtAdd->affected_rows === 0) die('Meal plan row failed to add');
            } else {
                die('Recipe ID is not in the database');
            }                   
        }
        if(!($stmtUpdate = $myconn->prepare("UPDATE `users` SET `meal_plan` = ? WHERE `id` = ?"))){
            die("Prepared failed: (" . $myconn->errno . ") " . $myconn->error);
        }

        if(!$stmtUpdate->bind_param('ii', $truthy, $user_id)){
            die("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
        }

        if(!$stmtUpdate->execute()){
            die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        }
        echo 'Success';
    }
} else {
    die('Not a valid user');
}

?>