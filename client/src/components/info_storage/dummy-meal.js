export default [
    [
        {"recipe_id":"123","title":"pizza","image":"http:\/\/img.com"},
        {"calories":"4000","protein":"30g","sugar":"23g","carbs":"55g","fat":"60g","sodium":"230mg","servingSize":"1 half","servingPrice":"$4","recipe_id":"123"},
        [
            {"ingredient":"cheese","amount":"2","unit_type":"cups","recipe_id":"123"},
            {"ingredient":"sauce","amount":"2","unit_type":"tbs","recipe_id":"123"}
        ],
        [
            {"step_num":"1","step":"roll dough","recipe_id":"123"},
            {"step_num":"2","step":"cover with cheese","recipe_id":"123"},
            {"step_num":"3","step":"make pizza","recipe_id":"123"}
        ]
    ],
    [
        {"recipe_id":"124","title":"salad","image":"http:\/\/img2.com"},
        {"calories":"100","protein":"3g","sugar":"10g","carbs":"3g","fat":"3g","sodium":"0mg","servingSize":"1","servingPrice":"","recipe_id":"124"},
        [
            {"ingredient":"lettuce","amount":"1","unit_type":"head","recipe_id":"124"},
            {"ingredient":"croutons","amount":"4","unit_type":"lbs","recipe_id":"124"}
        ],
        [
            {"step_num":"1","step":"put ingredients in bowl","recipe_id":"124"},
            {"step_num":"2","step":"eat ingredients from bowl","recipe_id":"124"}
        ]
    ]
]