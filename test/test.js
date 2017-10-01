var response = '{"foods":[{"food_name":"coke","brand_name":null,"serving_qty":1,"serving_unit":"can","serving_weight_grams":355,"nf_calories":140,"nf_total_fat":0,"nf_saturated_fat":null,"nf_cholesterol":null,"nf_sodium":45,"nf_total_carbohydrate":39,"nf_dietary_fiber":null,"nf_sugars":39,"nf_protein":0,"nf_potassium":null,"nf_p":null,"full_nutrients":[{"attr_id":203,"value":0},{"attr_id":204,"value":0},{"attr_id":205,"value":39},{"attr_id":208,"value":140},{"attr_id":269,"value":39},{"attr_id":307,"value":45}],"nix_brand_name":"Coca-Cola","nix_brand_id":"51db37df176fe9790a89a29d","nix_item_name":"Cola","nix_item_id":"51d3002ecc9bff111580fc47","upc":null,"consumed_at":"2017-10-01T16:33:33+00:00","metadata":{"is_raw_food":false},"source":1,"ndb_no":14148,"tags":{"item":"coca cola","measure":null,"quantity":"1.0","tag_id":484},"alt_measures":[{"serving_weight":30.7,"measure":"fl oz","seq":1,"qty":1}],"lat":null,"lng":null,"meal_type":3,"photo":{"thumb":"https://d1r9wva3zcpswd.cloudfront.net/5858d96f9792533032170f87.jpeg","highres":null},"sub_recipe":null}]}'


        var foodResult = JSON.parse(response).foods[0];        
        var totalGrams = findTotalGrams(foodResult);

        var nutrientValues = {  
                                 "nf_total_fat": parseInt(foodResult.nf_total_fat),
                                 "nf_saturated_fat": parseInt(foodResult.nf_saturated_fat),
                                 "nf_cholesterol": parseInt(foodResult.nf_cholesterol),
                                 "nf_total_carbohydrate": parseInt(foodResult.nf_total_carbohydrate),
                                 "nf_dietary_fiber": parseInt(foodResult.nf_dietary_fiber),
                                 "nf_sugars": parseInt(foodResult.nf_sugars),
                                 "nf_protein": parseInt(foodResult.nf_protein),
                                 "nf_sodium": parseInt(foodResult.nf_sodium)/1000,
                                 "nf_potassium": parseInt(foodResult.nf_potassium)/1000
                                }
        Object.keys(foodResult.full_nutrients).forEach(function(key) {
             switch(foodResult.full_nutrients[key].attr_id) {
                case 221:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value); 
                     nutrientValues.alcohol = parseInt(foodResult.full_nutrients[key].value);
                     break;
                 case 255:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value);
                     nutrientValues.water = parseInt(foodResult.full_nutrients[key].value);
                     break;
                 case 262:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value)/1000;
                     nutrientValues.caffeine = parseInt(foodResult.full_nutrients[key].value/1000);
                     break;
                 case 301:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value);
                     nutrientValues.calcium = parseInt(foodResult.full_nutrients[key].value);
                     break;
                 case 303:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value);
                     nutrientValues.iron = parseInt(foodResult.full_nutrients[key].value);
                     break;
                 case 328:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value)/1000000;
                     nutrientValues.vitamind = parseInt(foodResult.full_nutrients[key].value)/1000000;
                     break;
                 case 401:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value)/1000;
                     nutrientValues.vitaminc = parseInt(foodResult.full_nutrients[key].value)/1000;
                     break;
                 case 415:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value)/1000;
                     nutrientValues.vitaminb6 = parseInt(foodResult.full_nutrients[key].value)/1000;
                     break;                     
                 case 418:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value)/1000000;
                     nutrientValues.vitaminb12 = parseInt(foodResult.full_nutrients[key].value)/1000000;
                     break;
                 case 430:
                     totalGrams = totalGrams + parseInt(foodResult.full_nutrients[key].value)/1000000;
                     nutrientValues.vitamink = parseInt(foodResult.full_nutrients[key].value)/1000000;
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
                                 "vitamink": calcPercent(nutrientValues.vitamink,totalGrams)         
     }
     
      console.log(nutrientValues);
      console.log(totalGrams);
      console.log(paramPercent);

function calcPercent(paramValue, totalOfParams){    
    return ((paramValue/totalOfParams) * 100).toFixed(8);
}

function findTotalGrams(foodResult){   
    var totalGrams = calcParam(foodResult.nf_total_fat, 'grams') + calcParam(foodResult.nf_saturated_fat, 'grams') + calcParam(foodResult.nf_cholesterol, 'grams') + calcParam(foodResult.nf_total_carbohydrate, 'grams') + calcParam(foodResult.nf_dietary_fiber, 'grams') + calcParam(foodResult.nf_sugars, 'grams') + calcParam(foodResult.nf_protein, 'grams') + calcParam(foodResult.nf_sodium, 'milligrams') + calcParam(foodResult.nf_potassium, 'milligrams');
    
    return totalGrams;
}


function calcParam(param, paramUnit){        
    if(isNaN(param) || param == null || param == 0){        
         return 0;
    }
    else if(paramUnit == 'grams'){
        return parseInt(param);
    }
    else if(paramUnit == 'milligrams'){
        return parseInt(param)/1000;
    }
    else if(paramUnit == 'micrograms'){
        return parseInt(param)/1000000;        
    }
    else{
        return 0;
    }
    
}