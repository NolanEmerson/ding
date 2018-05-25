<?php
/**Make PHP understand Axios Calls*/
$entityBody = file_get_contents('php://input');
$request_data = json_decode($entityBody, true);

/**Header files for local development*/
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

require('../mysqli_connect.php');
$recipeID = $request_data['recipe_id'];

/**Get the cooking instructions for the user's meals */
/**query for gathering all the ingredients for a the specific recipe*/
if (!($stmt = $myconn->prepare("SELECT inst.step_num, inst.step, inst.recipe_id FROM instructions AS inst WHERE inst.recipe_id = ?"))) {
    echo "Prepare failed: (" . $myconn->errno . ") " . $myconn->error;
}

/**Bind parameter for SELECT query */
if (!$stmt->bind_param("i", $recipeID)) {
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**execute the query */
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**store results of the query */
$instructionsResult =$stmt -> get_result();
$instructions = [];

/**format results into an array */
while($row = mysqli_fetch_assoc($instructionsResult)){
    $row['step_num']=addslashes($row['step_num']);
    $row['step']=addslashes($row['step']);
    if(!is_numeric($row['recipe_id'])){
        print 'Invalid recipe ID from database';
        exit();
    };
    $instructions[]=$row;
}

/**return JSON object to front end */
$encodedInstructions = json_encode($instructions);
print_r($encodedInstructions);
?>