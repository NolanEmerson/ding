<?php
//Constant for Allergy choices that will be used in the allergyCheck function.
define('ALLERGIES', array(
    'dairy',
    'egg',
    'gluten',
    'peanut',
    'seafood',
    'sesame',
    'shellfish',
    'soy',
    'tree nut',
    'wheat'
));

//Constant for Diety choices that will be used in the dietCheck function.
define('DIETS', array(
    'vegan',
    'none',
    'vegetarian',
    'ketogenic'
));

//Function to see if allergies are viable.
function allergyCheck($allergies){
    $verified_allergies = [];
    $count = count($allergies);
    for($i = 0; $i < $count; $i++){
        $key = array_search($allergies[$i], ALLERGIES);
        if($key !== false){
            //Make sure that the item isn't already in the list. Checking for duplicates.
            $testCurrentList = array_search($allergies[$i], $verified_allergies);
            if($testCurrentList === false){
                $verified_allergies[] = ALLERGIES[$key];
            }
        }
    }
    return $verified_allergies;
}

//Function to see if diets are viable.
function dietCheck($diet){
    $key = array_search($diet, DIETS);
    if($key === false){
        return false;
    } else {
        return true;
    }
}
?>
