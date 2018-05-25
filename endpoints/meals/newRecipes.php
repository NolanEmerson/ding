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

/**Get the allergy and dietary restrictions for the user */

$restrictions=[];

/**query for gathering all the allergies, diet and query offset for a the logged in user*/
if (!($stmt = $myconn->prepare("SELECT ua.allergy_name, u.diet, u.offset FROM `users` AS u LEFT JOIN `user-allergy` AS ua ON u.ID = ua.user_id WHERE u.ID= ? "))) {
    echo "Prepare failed: (" . $myconn->errno . ") " . $myconn->error;
}

/**binds the paramater for the SELECT query*/
if (!$stmt->bind_param("i", $userID)) {
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**executes the query */
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**store the results of the query*/
$result = $stmt -> get_result();

while($row = mysqli_fetch_assoc($result)){
    $restrictions[]=$row;
}

/**Preparing the array for the next query */
$allergens = ['dairy' => '0', 'egg'=>'0', 'gluten'=>'0', 
            'peanut'=>'0', 'seafood'=>'0', 'sesame'=> '0', 
            'shellfish'=>'0', 'soy'=>'0', 'tree_nut'=>'0', 'wheat'=>'0' ];

$count=count($restrictions);
/**accounting for people that have no allergy restrictions*/
$hasAllergy = false;

/**Changing the array to reflect the allergies of the user */
for($i=0;$i<$count;$i++){
    $allergy=$restrictions[$i]['allergy_name'];
    if (array_key_exists($allergy, $allergens)){
        $allergens[$allergy] = '1';
        $hasAllergy = true;
    }
}
$offset = $restrictions[0]['offset'];
$diet = $restrictions[0]['diet'];

/**Get recipes from database that meet the dietary restrictions found in the previous section*/
if($hasAllergy){
    $recipeQuery = "SELECT ra.recipe_id, rd.title, rd.image, rd.readyInMinutes  FROM `recipe-allergy` AS ra JOIN `recipe-diet` AS rd ON ra.recipe_id = rd.recipe_id WHERE ";

    forEach($allergens as $key => $value){
        if($value === '1'){
            $recipeQuery .= "ra.$key" .'='. $value .' AND ';
        };
    };
    $recipeQuery = substr($recipeQuery, 0, -4);
    if($diet !== 'none'){
        $recipeQuery .= " AND rd.$diet".'=1';
    }
} else {
    $recipeQuery = "SELECT ra.recipe_id, rd.title, rd.image, rd.readyInMinutes  FROM `recipe-allergy` AS ra JOIN `recipe-diet` AS rd ON ra.recipe_id = rd.recipe_id ";
    if($diet !== 'none'){
        $recipeQuery .= "WHERE rd.$diet".'=1';
    }
}

$recipeQuery .= " LIMIT 21 OFFSET $offset";
$recipeOutput=[];
$result = mysqli_query($myconn, $recipeQuery);
while($row = mysqli_fetch_assoc($result)){
    $row['title']=addslashes($row['title']);
    $row['image']=addslashes($row['image']);
    if(!is_numeric($row['readyInMinutes'])){
        print 'Invalid readyInMinutes from database';
        exit();
    };
    if(!is_numeric($row['recipe_id'])){
        print 'Invalid recipe ID from database';
        exit();
    };
    $recipeOutput[]=$row;
}


/**If the query returns fewer than 21 results, re-query for more */
$recipeCount = count($recipeOutput);
if($recipeCount<21){
    $newOffset = 21 - $recipeCount;
    $changeOffsetQ = "UPDATE `users` SET offset=$newOffset WHERE ID = $userID";
    mysqli_query($myconn,$changeOffsetQ);

    $recipeQuery = "SELECT ra.recipe_id, rd.title, rd.image, rd.readyInMinutes  FROM `recipe-allergy` AS ra JOIN `recipe-diet` AS rd ON ra.recipe_id = rd.recipe_id WHERE ";

    forEach($allergens as $key => $value){
        if($value === '1'){
            $recipeQuery .= "ra.$key" .'='. $value .' AND ';
        };
    };
    $recipeQuery = substr($recipeQuery, 0, -4);
    if($diet !== 'none'){
        $recipeQuery .= " AND rd.$diet".'=1';
    }
    $randomOffset = rand(0,5);
    $recipeQuery .= " LIMIT $newOffset OFFSET $randomOffset";
    
    $result = mysqli_query($myconn, $recipeQuery);
    while($row = mysqli_fetch_assoc($result)){
        $row['title']=addslashes($row['title']);
        $row['image']=addslashes($row['image']);
        if(!is_numeric($row['readyInMinutes'])){
            print 'Invalid readyInMinutes from database';
            exit();
        };
        if(!is_numeric($row['recipe_id'])){
            print 'Invalid recipe ID from database';
            exit();
        };
        $recipeOutput[]=$row;
    }
};

/**Change the offset of the user for the next time they request a meal plan */
$incrementOffsetQ = "UPDATE `users` SET offset=offset+7 WHERE ID = $userID";
mysqli_query($myconn, $incrementOffsetQ);

/**return JSON object to front end */
$encodedRecipes= json_encode($recipeOutput);
print_r($encodedRecipes);

?>