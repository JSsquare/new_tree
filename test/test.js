var response;
$.ajax({
    url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    type: 'post',
    headers: {
              'Content-Type': 'application/x-www-form-urlencoded', 
              'x-app-id': 'b3d1c4f0',
              'x-app-key' : '9d6e27138ae5ffd22c070edb3cd8975a' 
    },
    data: { query:"goji berries" },
    dataType: 'json',
    success: function (data) {
        var foodResult = data.foods[0];        
        var totalGrams = findTotalGrams(foodResult);

        var nutrientValues = {  
                                 "nf_total_fat": calcParam(foodResult.nf_total_fat, 'grams'),
                                 "nf_saturated_fat": calcParam(foodResult.nf_saturated_fat, 'grams'),
                                 "nf_cholesterol": calcParam(foodResult.nf_cholesterol, 'grams'),
                                 "nf_total_carbohydrate": calcParam(foodResult.nf_total_carbohydrate, 'grams'),
                                 "nf_dietary_fiber": calcParam(foodResult.nf_dietary_fiber, 'grams'),
                                 "nf_sugars": calcParam(foodResult.nf_sugars, 'grams'),
                                 "nf_protein": calcParam(foodResult.nf_protein, 'grams'),
                                 "nf_sodium": calcParam(foodResult.nf_sodium, 'milligrams'),
                                 "nf_potassium": calcParam(foodResult.nf_potassium, 'milligrams')

                                }
        Object.keys(foodResult.full_nutrients).forEach(function(key) {            
             switch(foodResult.full_nutrients[key].attr_id) {
                case 221:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'grams'); 
                     nutrientValues.alcohol = calcParam(foodResult.full_nutrients[key].value, 'grams');
                     break;
                 case 255:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'grams');
                     nutrientValues.water = calcParam(foodResult.full_nutrients[key].value, 'grams');                     
                     break;
                 case 262:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     nutrientValues.caffeine = calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     break;
                 case 301:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     nutrientValues.calcium = calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     break;
                 case 303:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'grams');
                     nutrientValues.iron = calcParam(foodResult.full_nutrients[key].value, 'grams');
                     break;
                 case 328:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.vitamind = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;
                 case 401:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'grams');
                     nutrientValues.vitaminc = calcParam(foodResult.full_nutrients[key].value, 'grams');
                     break;
                 case 415:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     nutrientValues.vitaminb6 = calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     break;                     
                 case 418:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.vitaminb12 = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;
                 case 430:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.vitamink = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;                     
                 case 317:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.selenium = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;
                 case 323:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     nutrientValues.vitamine = calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     break;
                 case 321:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.carotene = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;
                 case 431:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.folicacid = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;
                case 337:
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     nutrientValues.lycopene = calcParam(foodResult.full_nutrients[key].value, 'micrograms');
                     break;                     
                     
            }            
        });
     var paramPercent = {
                                 "nf_total_fat": calcPercent(parseInt(foodResult.nf_total_fat), totalGrams),
                                 "nf_saturated_fat": calcPercent(parseInt(foodResult.nf_saturated_fat), totalGrams),
                                 "nf_cholesterol": calcPercent(parseInt(foodResult.nf_cholesterol), totalGrams),
                                 "nf_total_carbohydrate": calcPercent(parseInt(foodResult.nf_total_carbohydrate), totalGrams),
                                 "nf_dietary_fiber": calcPercent(parseInt(foodResult.nf_dietary_fiber), totalGrams),
                                 "nf_sugars": calcPercent(parseInt(foodResult.nf_sugars), totalGrams),
                                 "nf_protein": calcPercent(parseInt(foodResult.nf_protein), totalGrams),
                                 "nf_sodium": calcPercent(parseInt(foodResult.nf_sodium)/1000, totalGrams),
                                 "nf_potassium": calcPercent(parseInt(foodResult.nf_potassium)/1000,totalGrams),
                                 "water": calcPercent(nutrientValues.water,totalGrams),
                                 "alcohol": calcPercent(nutrientValues.alcohol,totalGrams),
                                 "caffeine": calcPercent(nutrientValues.caffeine,totalGrams),
                                 "calcium": calcPercent(nutrientValues.calcium,totalGrams),
                                 "iron": calcPercent(nutrientValues.iron,totalGrams),
                                 "vitamind": calcPercent(nutrientValues.vitamind,totalGrams),
                                 "vitaminc": calcPercent(nutrientValues.vitaminc,totalGrams),
                                 "vitaminb6": calcPercent(nutrientValues.vitaminb6,totalGrams),
                                 "vitaminb12": calcPercent(nutrientValues.vitaminb12,totalGrams),
                                 "vitamink": calcPercent(nutrientValues.vitamink,totalGrams),
                                 "selenium": calcPercent(nutrientValues.selenium,totalGrams),
                                 "vitamine": calcPercent(nutrientValues.vitamine,totalGrams),
                                 "carotene": calcPercent(nutrientValues.carotene,totalGrams),
                                 "folicacid": calcPercent(nutrientValues.folicacid,totalGrams),
                                 "lycopene": calcPercent(nutrientValues.lycopene,totalGrams)
     }
     
      //console.log(nutrientValues);
      //console.log(totalGrams);
      //console.log(paramPercent);
      antiOxidant(foodResult, paramPercent, totalGrams);        
    }
}); 





function calcPercent(paramValue, totalOfParams){ 
    if(paramValue && paramValue <= 3){
        return ((paramValue/totalOfParams) * 100).toFixed(2);
    }
    else if(paramValue > 3){
        return ((paramValue/totalOfParams) * 100).toFixed(0);
    }
    else{
        return 0;
    }
}

function calcParam(param, paramUnit){       
    if(isNaN(param) || param == null || param == 0){        
         return 0;
    }
    else if(paramUnit == 'grams'){
        return param;
    }
    else if(paramUnit == 'milligrams'){
        return param/1000;
    }
    else if(paramUnit == 'micrograms'){
        return param/1000000;        
    }
    else{
        return 0;
    }    
}

function findTotalGrams(foodResult){   
    var totalGrams = calcParam(foodResult.nf_total_fat, 'grams') + calcParam(foodResult.nf_saturated_fat, 'grams') + calcParam(foodResult.nf_cholesterol, 'grams') + calcParam(foodResult.nf_total_carbohydrate, 'grams') + calcParam(foodResult.nf_dietary_fiber, 'grams') + calcParam(foodResult.nf_sugars, 'grams') + calcParam(foodResult.nf_protein, 'grams') + calcParam(foodResult.nf_sodium, 'milligrams') + calcParam(foodResult.nf_potassium, 'milligrams');
    
    return totalGrams;
}

var CAROTENE_VALUE = 321;
var VITAMIN_C_VALUE = 401;
var SELENIUM_VALUE = 317;
var LYCOPENE_VALUE = 337;
var VITAMIN_E_VALUE = 323;
function antiOxidant(foodResult, paramPercent, totalGrams){
    var rawValueCarotene = "";
    var rawValueVitC = "";
    var rawValueSelenium = "";
    var rawValueLycopene = "";
    var rawValueVitE = "";    
    
            Object.keys(foodResult.full_nutrients).forEach(function(key) {  
             switch(foodResult.full_nutrients[key].attr_id) {
                 case CAROTENE_VALUE: 
                     rawValueCarotene = calcParam(foodResult.full_nutrients[key].value, 'micrograms') * 10000; 
                     break;
                 case VITAMIN_C_VALUE:
                     rawValueVitC = calcParam(foodResult.full_nutrients[key].value, 'micrograms') * 10000;  
                     break;
                 case SELENIUM_VALUE:
                     rawValueSelenium = calcParam(foodResult.full_nutrients[key].value, 'micrograms') * 10000;
                     break;
                 case LYCOPENE_VALUE:
                     rawValueLycopene = calcParam(foodResult.full_nutrients[key].value, 'micrograms') * 10000;
                     break; 
                 case VITAMIN_E_VALUE:
                     rawValueVitE = calcParam(foodResult.full_nutrients[key].value, 'micrograms') * 10000;
                     break;                     
            }
                
            });
        
        console.log(foodResult.food_name , rawValueCarotene, rawValueVitC, rawValueSelenium, rawValueLycopene, rawValueVitE);
        console.log(foodResult.food_name, paramPercent.carotene, paramPercent.vitaminc, paramPercent.selenium, paramPercent.lycopene, paramPercent.vitamine, paramPercent.water, totalGrams);
    
}