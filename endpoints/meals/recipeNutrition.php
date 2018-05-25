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

/**Get the nutrition information for the user's meals */
/**query for gathering all the nutritional info for a the specific recipe*/
if (!($stmt = $myconn->prepare("SELECT n.calories, n.protein, n.sugar, n.carbs, n.fat, n.sodium, n.recipe_id FROM nutrition AS n WHERE n.recipe_id = ?"))) {
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
$nutritionResult =$stmt -> get_result();
$nutrition = [];

/**format results into an array */
while($row = mysqli_fetch_assoc($nutritionResult)){
    $row['calories']=addslashes($row['calories']);
    $row['protein']=addslashes($row['protein']);
    $row['sugar']=addslashes($row['sugar']);
    $row['carbs']=addslashes($row['carbs']);
    $row['fat']=addslashes($row['fat']);
    $row['sodium']=addslashes($row['sodium']);
    if(!is_numeric($row['recipe_id'])){
        print 'Invalid recipe ID from database';
        exit();
    };
    $nutrition[]=$row;
}

/**return JSON object to front end */
$encodedNutrition = json_encode($nutrition);
print_r($encodedNutrition);

?>