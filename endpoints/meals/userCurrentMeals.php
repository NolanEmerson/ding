<?php
/**Make PHP understand Axios Calls*/
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

session_id($request_data['session_ID']);
session_start();
require('../mysqli_connect.php');

/**Header files for local development*/
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

$userID=$_SESSION['user_id'];
// $userID=3;

if(!is_numeric($userID)){
    print 'Invalid user ID';
    exit();
};

$recipeIDList=[];
$currentMealsOutput=[];

/**query for gathering all the current, active meals of the logged in user*/
if (!($stmt = $myconn->prepare("SELECT uc.recipe_id, rd.title, rd.image, rd.readyInMinutes, uc.complete FROM `user_choices` AS uc JOIN `recipe-diet` AS rd ON uc.recipe_id = rd.recipe_id WHERE `user_id`= ? ORDER BY uc.complete"))) {
    echo "Prepare failed: (" . $myconn->errno . ") " . $myconn->error;
}

/**Bind parameter for SELECT query */
if (!$stmt->bind_param("i", $userID)) {
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**execute the query */
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**store results of the query */
$currentMealsResult = $stmt -> get_result();

/**format results into an array */
while($row = mysqli_fetch_assoc($currentMealsResult)){
    $row['title']=addslashes($row['title']);
    $row['image']=addslashes($row['image']);
    if(!is_numeric($row['complete'])){
        print 'Invalid completed flag from database';
        exit();
    };
    if(!is_numeric($row['recipe_id'])){
        print 'Invalid recipe ID from database';
        exit();
    };
    $currentMealsOutput[]=$row;
}

/**return JSON object to front end */
$currentMealsEncoded = json_encode($currentMealsOutput);
print_r($currentMealsEncoded);

?>
