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

if(!is_numeric($userID)){
    print 'Invalid user ID';
    exit();
};

/**creates array for storing the ingredients*/
$allIngredientsOutput=[];

/**query for gathering all the ingredients for a the logged in user*/
if (!($stmt = $myconn->prepare("SELECT ing.ingredient, ing.amount, ing.unit_type, ing.recipe_id FROM `user_choices` AS uc JOIN `ingredients` AS ing ON uc.recipe_id = ing.recipe_id WHERE `user_id`= ? "))) {
    echo "Prepare failed: (" . $myconn->errno . ") " . $myconn->error;
}

/**binds the paramater for the SELECT query*/
if (!$stmt->bind_param("i", $userID)) {
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**executes the query for the ingredients*/
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

/**store the results of the query*/
$allIngredientsResult = $stmt -> get_result();
while($row = mysqli_fetch_assoc($allIngredientsResult)){
    $row['ingredient']=addslashes($row['ingredient']);
    $row['amount']=addslashes($row['amount']);
    $row['unit_type']=addslashes($row['unit_type']);
    if(!is_numeric($row['recipe_id'])){
        print 'Invalid recipe ID from database';
        exit();
    };
    $allIngredientsOutput[]=$row;
}
// $allIngredientsEncoded = json_encode($allIngredientsOutput);

convertUnit($allIngredientsOutput);

/**convert units to create an object that represents a sum total of ingredients for a grocery list*/
function convertUnit($meals){
    $ingredientArr=[];
    $quantityArr=[];
    $unitArr=[];

/**seperate the ingredient, unit, and amount of each in separate arrays*/
$mealCount = count($meals);
    for($i=0; $i<$mealCount; $i++){
        $ingredientArr[]=$meals[$i]['ingredient'];
        $quantityArr[]=floatval($meals[$i]['amount']);
        $unitArr[]=$meals[$i]['unit_type'];
    }

/**converts all regular units into either teaspoons or ounces*/
$quantityArrLen=count($quantityArr);
    for($i = 0; $i<$quantityArrLen; $i++){
        $currentQuantity=$quantityArr[$i];
        $currentUnit=$unitArr[$i];
        switch($currentUnit){
            case 't':
            case 'tsp':
            case 'teaspoon':
            case 'Teaspoon':
            case 'teaspoons':
            case 'Teaspoons':
                $unitArr[$i]='teaspoons';
                break;
            case 'T':
            case 'Tbsp':
            case 'Tbs':
            case 'tbs':
            case 'tbsp':
            case 'Tablespoon':
            case 'tablespoon':
            case 'Tablespoons':
            case 'tablespoons':
                $quantityArr[$i]=convertToTsp($currentQuantity,'tablespoon');
                $unitArr[$i]='teaspoons';
                break;
            case 'c':
            case 'C':
            case 'Cup':
            case 'cup':
            case 'cups':
            case 'Cups':
                $quantityArr[$i]=convertToTsp($currentQuantity,'cup');
                $unitArr[$i]='teaspoons';
                break;
            case 'pt':
            case 'pint':
            case 'Pint':
            case 'pints':
            case 'Pints':
                $quantityArr[$i]=convertToTsp($currentQuantity,'pint');
                $unitArr[$i]='teaspoons';
                break;
            case 'qt':
            case 'quart':
            case 'Quart':
            case 'quarts':
            case 'Quarts':
                $quantityArr[$i]=convertToTsp($currentQuantity,'quart');
                $unitArr[$i]='teaspoons';
                break;
            case 'gal':
            case 'Gal':
            case 'gallon':
            case 'Gallon':
            case 'gallons':
            case 'Gallons':
                $quantityArr[$i]=convertToTsp($currentQuantity,'gallon');
                $unitArr[$i]='teaspoons';
                break;
            case 'ozs':
            case 'Ozs':
            case 'OZS':
            case 'oz':
            case 'Oz':
            case 'OZ':
            case 'ounce':
            case 'Ounce':
            case 'ounces':
            case 'Ounces':
                $unitArr[$i]='oz';
                break;
            case 'lbs':
            case 'Lbs':
            case 'LBS':
            case 'LB':
            case 'lb':
            case 'Lb':
            case 'pound':
            case 'Pound':
            case 'POUND':
            case 'pounds':
            case 'Pounds':
            case 'POUNDS':
                $quantityArr[$i]=convertToOz($currentQuantity);
                $unitArr[$i]='oz';
                break;
            default:
                break;
        }
    }

    /**combine all similar ingredient-quantities so that each ingredient has its own, singular total*/
    function addLikeUnits($ingredients, $quantities, $unitOfMeasurement){
        $sumOfTsp = [];
        $sumOfOz = [];
        $miscSums = [];
        $quantitiesLen = count($quantities);
        for($q = 0; $q<$quantitiesLen; $q++){
            if($unitOfMeasurement[$q]==='teaspoons'){
                if(isset($sumOfTsp[$ingredients[$q]])){
                    $sumOfTsp[$ingredients[$q]]['total']+=$quantities[$q];
                } else {
                    $sumOfTsp[$ingredients[$q]]=[];
                    $sumOfTsp[$ingredients[$q]]['name']=$ingredients[$q];
                    $sumOfTsp[$ingredients[$q]]['total']=$quantities[$q];
                }
            }else if($unitOfMeasurement[$q]==='oz'){
                if(isset($sumOfOz[$ingredients[$q]])){
                    $sumOfOz[$ingredients[$q]]['total']+=$quantities[$q];
                } else {
                    $sumOfOz[$ingredients[$q]]=[];
                    $sumOfOz[$ingredients[$q]]['name']=$ingredients[$q];
                    $sumOfOz[$ingredients[$q]]['total']=$quantities[$q];
                }
            } else {
                if(isset($miscSums[$ingredients[$q]])){
                    $miscSums[$ingredients[$q]]['total']+=$quantities[$q];
                } else {
                    $miscSums[$ingredients[$q]]=[];
                    $miscSums[$ingredients[$q]]['name']=$ingredients[$q];
                    $miscSums[$ingredients[$q]]['total']=$quantities[$q];
                    $miscSums[$ingredients[$q]]['unit']=$unitOfMeasurement[$q];
                }
            }
            
        }
        /**creating arrays to store the ingredients by unit measurement type*/
        $ingredientsObj=[];
        $ingredientsOzBase=[];
        $ingredientsTspBase=[];
        $ingredientsMiscBase=[];

        /**converting teaspoon-based ingredient totals into their highest common unit*/
        forEach($sumOfTsp as $key => $value){
            $numOfTsp = $value['total'];
            if($numOfTsp>=768){
                $numOfTsp = $numOfTsp / 768;
                $numOfTsp = ceil($numOfTsp);
                if($numOfTsp>1){
                    $ingredientsTspBase[$key]= $numOfTsp . ' gallons';
                } else {
                    $ingredientsTspBase[$key]= $numOfTsp . ' gallon';
                }
            }else if($numOfTsp>=192){
                $numOfTsp = $numOfTsp / 192;
                $numOfTsp = ceil($numOfTsp);
                if($numOfTsp>1){
                    $ingredientsTspBase[$key]= $numOfTsp . ' quarts';
                } else {
                    $ingredientsTspBase[$key]= $numOfTsp . ' quart';
                }
            } else if($numOfTsp>=96){
                $numOfTsp = $numOfTsp / 96;
                $numOfTsp = ceil($numOfTsp);
                if($numOfTsp>1){
                    $ingredientsTspBase[$key]= $numOfTsp . ' pints';
                } else {
                    $ingredientsTspBase[$key]= $numOfTsp . ' pint';
                }
            } else if($numOfTsp>=48){
                $numOfTsp = $numOfTsp / 48;
                $numOfTsp = ceil($numOfTsp);
                if($numOfTsp>1){
                    $ingredientsTspBase[$key]= $numOfTsp . ' cups';
                } else {
                    $ingredientsTspBase[$key]= $numOfTsp . ' cup';
                }
            } else if($numOfTsp>=3){
                $numOfTsp = $numOfTsp / 3;
                $numOfTsp = ceil($numOfTsp);
                if($numOfTsp>1){
                    $ingredientsTspBase[$key]= $numOfTsp . ' tablespoons';
                } else {
                    $ingredientsTspBase[$key]= $numOfTsp . ' tablespoon';
                }
            }else{
                if($numOfTsp>1){
                    $ingredientsTspBase[$key]= $numOfTsp . ' teaspoons';
                } else if($numOfTsp==0){
                    $ingredientsTspBase[$key]= '< 1 teaspoon';
                } 
            }
        }

        /**converting ounce-based ingredient totals into their highest common unit*/
        forEach($sumOfOz as $key => $value){
            $numOfOz = $value['total'];

            if($numOfOz>=16){
                $numOfOz = $numOfOz / 16;
                $numOfOz = ceil($numOfOz);

                if($numOfOz>1){
                    $ingredientsOzBase[$key]= $numOfOz . ' pounds';
                } else{
                    $ingredientsOzBase[$key]= $numOfOz . ' pound';
                }
                
            }else{
                if($numOfOz>1){
                    $ingredientsOzBase[$key]= $numOfOz . ' ounces';
                } else if($numOfOz==0){
                    $ingredientsOzBase[$key]= '< 1 ounce';
                }
            }
        }

        /**formating misc ingredient totals*/
        forEach($miscSums as $key => $value){
            $total = $value['total'];
            $unit = $value['unit'];
            if(!$total==0){
                $ingredientsMiscBase[$key]= $total . ' ' . $unit;
            } else {
                $ingredientsMiscBase[$key]= '<1 ' . $unit;
            }
            
        }
        $ingredientsObj['ounces']=$ingredientsOzBase;
        $ingredientsObj['teaspoons']=$ingredientsTspBase;
        $ingredientsObj['misc']=$ingredientsMiscBase;
        $encodedIngredients = json_encode($ingredientsObj);

        addToGroceryTable($ingredientsObj);
    }
    addLikeUnits($ingredientArr, $quantityArr, $unitArr);
}

/**helper function to convert inputed unit into teaspoons*/
function convertToTsp($num, $unit){
    switch ($unit){
        case 'tablespoon':
            return $num * 3;
        case 'cup':
            return $num * 48;
        case 'pint':
            return $num * 96;
        case 'quart':
            return $num * 192;
        case 'gallon':
            return $num * 768;
    }
}

/**helper function to convert inputed unit into ounces*/
function convertToOz($num){
    return $num * 16; 
}

/**Fills the grocery list table with the ingredients of the users' meals */
function addToGroceryTable($ingredients){
    global $userID;
    require('../mysqli_connect.php');
    $parsedIngredients = [];
    /**adding all the parsed ingredients into one array */
    if(isset($ingredients['ounces'])){
        forEach($ingredients['ounces'] as $key => $value){
            $parsedIngredients[] = $value . ' ' . $key;
        }
    }
    if(isset($ingredients['teaspoons'])){
        forEach($ingredients['teaspoons'] as $key => $value){
            $parsedIngredients[] = $value . ' ' . $key;
        }
    }
    if(isset($ingredients['misc'])){
        forEach($ingredients['misc'] as $key => $value){
            $parsedIngredients[] = $value . ' ' . $key;
        }
    }
    
    $ingrCount = count($parsedIngredients);

    /**query for adding all the ingredients into the table as individual rows */
    if (!($stmt = $myconn->prepare("INSERT INTO `grocery_list` (`ingredient`, `user_id`) VALUES (?, ?)"))) {
        echo "Prepare failed: (" . $myconn->errno . ") " . $myconn->error;
    }
    
    /**binds the paramater for the INSERT INTO query*/
    if (!$stmt->bind_param("si", $currentIngredient, $userID)) {
        echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    
    /**executes the query for the ingredients in a loop to create a new row for each*/
    for($ingrIndex=0; $ingrIndex < $ingrCount; $ingrIndex++ ){
        $currentIngredient = $parsedIngredients[$ingrIndex];
        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }
    }
    
}

?>