var req = require('request');

var APP_ID = undefined;
var WATER_FLAG = false; 

var AlexaSkill = require('./AlexaSkill');

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Trition = function () {
    AlexaSkill.call(this, APP_ID);
};


Trition.prototype = Object.create(AlexaSkill.prototype);
Trition.prototype.constructor = Trition;

Trition.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

Trition.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = pickRandomFrom('welcometext'); 
    response.ask(speechOutput);    
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Trition.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    // any cleanup logic goes here
};

Trition.prototype.intentHandlers = {
    
    "nutritionIntent": function (intent, session, response) {
     console.log(intent);
     pluckNewTreeFruit(response, intent.slots);
    },
    
    "factFruitIntent": function (intent, session, response) {
     console.log(intent);
     var pickedFactFruit = pickRandomFrom('factfruits');
     response.tellWithCard(pickedFactFruit, "Fact Fruit", "Try another New Tree Fact Fruit.");
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Help yourself by asking me about your food item. I can help you eat healthy.");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = pickRandomFrom('cancelspeech');
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye, stay healthy";
        response.tell(speechOutput);
    }
};

/**
 * plucks fruit from New Tree.
 */
function pluckNewTreeFruit(response, item) {
    var foodDrinkItem = item.food.value ? item.food.value : item.drink.value;
    foodDrinkItem = foodDrinkItem ? foodDrinkItem : item.Other_Food.value;
    var cardTitle = foodDrinkItem ? foodDrinkItem.charAt(0).toUpperCase() + foodDrinkItem.slice(1) + " : your New Tree Fruit" : "Can you try that again ?";
        req.post({
           url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
           headers: {
              'Content-Type': 'application/x-www-form-urlencoded', 
              'x-app-id': 'b3d1c4f0',
              'x-app-key' : '9d6e27138ae5ffd22c070edb3cd8975a' 
           },
           'body': "query="+foodDrinkItem,
           method: 'POST'
          },
    
          function (e, r, body){
              var speechOutput = constructSpeechOutput(body);
              var speechOnCard = constructSpeechOutput(body) + "\n Try this for a health fact: Ask New Tree to pick a Fact Fruit."; 
              response.tellWithCard(speechOutput, cardTitle, speechOnCard);
          });
}

function constructSpeechOutput(body){
    if(JSON.parse(body).foods){        
        var foodResult = JSON.parse(body).foods[0];
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
   //further making of nutrientValues interating through attr_id's
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
                     totalGrams = totalGrams + calcParam(foodResult.full_nutrients[key].value, 'milligrams');
                     nutrientValues.vitaminc = calcParam(foodResult.full_nutrients[key].value, 'milligrams');
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
                                 "nf_total_fat": calcPercent(nutrientValues.nf_total_fat, totalGrams),
                                 "nf_saturated_fat": calcPercent(nutrientValues.nf_saturated_fat, totalGrams),
                                 "nf_cholesterol": calcPercent(nutrientValues.nf_cholesterol, totalGrams),
                                 "nf_total_carbohydrate": calcPercent(nutrientValues.nf_total_carbohydrate, totalGrams),
                                 "nf_dietary_fiber": calcPercent(nutrientValues.nf_dietary_fiber, totalGrams),
                                 "nf_sugars": calcPercent(nutrientValues.nf_sugars, totalGrams),
                                 "nf_protein": calcPercent(nutrientValues.nf_protein, totalGrams),
                                 "nf_sodium": calcPercent(nutrientValues.nf_sodium, totalGrams),
                                 "nf_potassium": calcPercent(nutrientValues.nf_potassium,totalGrams),
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
        
        
        
        var sortedNutrientKeys = Object.keys(paramPercent).sort(function(a, b) {return -(paramPercent[a] - paramPercent[b])});
        var nutriNames = {
                                 "nf_total_fat": "Total Fat",
                                 "nf_saturated_fat": "Saturated Fat",
                                 "nf_cholesterol": "Cholestrol!",
                                 "nf_total_carbohydrate": "Total Carbs",
                                 "nf_dietary_fiber": "Dietry Fiber",
                                 "nf_sugars": "Sugar",
                                 "nf_protein": "Protein",
                                 "nf_sodium": "Sodium",
                                 "nf_potassium": "Potassium",
                                 "water": "Water",
                                 "alcohol": "Alcohol! Which will kill you! ",
                                 "caffeine": "Caffeine",
                                 "calcium": "Calcium",
                                 "iron": "Iron",
                                 "vitamind": "Vitamin D",
                                 "vitaminc": "Vitamin C",
                                 "vitaminb6": "Vitamin B6",
                                 "vitaminb12": "Vitamin B 12",
                                 "vitamink": "Vitamin K",
                                 "selenium": "Selenium",
                                 "vitamine": "Vitamin E",
                                 "carotene": "Vitamin Carotine",
                                 "folicacid": "Folic Acid",
                                 "lycopene": "Lycopene"
        }
    
        
        
        return foodResult.serving_qty + " " + foodResult.serving_unit.split(' ')[0] + " of " + foodResult.food_name + pickRandomFrom('connector') + parseInt(foodResult.nf_calories) + " Kilo calories. " + paramPercent[sortedNutrientKeys[0]] + " Per cent " + nutriNames[sortedNutrientKeys[0]] + " and, " + paramPercent[sortedNutrientKeys[1]] + " Percentage of " + nutriNames[sortedNutrientKeys[1]] + ". " + addOnSpeech(nutrientValues, totalGrams);
    }
    else{
        return pickRandomFrom('noitemfound');
    }

}

function addOnSpeech(nutrientValues, totalGrams){
    if(calcPercent(nutrientValues.caffeine, totalGrams) >= 0.03){
       return ". Make sure you watch the Caffeine";
    }       
    else if(calcPercent(nutrientValues.water, totalGrams) > 60){
        return " And a lot of water. ";
    }
    else{
        return " ";
    }
}

function pickRandomFrom(randomText){
    var welcomeText = ["Hey! Welcome to The New Tree. I can help you eat healthy. Ask me how healthy your food item is. Just say what are you eating.",
                        "Hola! Welcome to The New Tree. I know how healthy your food item is. Tell me what are you having?",
                        "Hello from New Tree. Ask me for a Fact Fruit.",
                      "Hey! Welcome to The New Tree. What are you eating now."];
    var noItemFound = ["Oh! I dint know that was edible. Please feed me, by sending an email of that food item to. Googling. Johnny. at Gmail dot com",
                       "I am sorry. I had trouble understanding that. If you are interested, ask me, to pick a Fact Fruit.",
                       "hmmm, I have not tasted that item. Is that edible? Please feed me, by sending an email to Googling. Johnny. at Gmail dot com"];
    var nutritionSpeechConnector = [" contains approximately ", " has more or less ", " has roughly ", " has close to "];
    
    var factFruits = ["Did you know? Avacado has more than twice as much potassium as banana. Make yourself a good toast today", 
                      "Do you know? Broccoli has twice the vitamin C of an Orange? Add this to your daily salad",
                      "Here is your Fact Fruit: Calories are not always bad for you. Protein and carbohydrates both contain 4 calories per gram! You should consume roughly, 2000 calories per day",
                      "Here is an interesting fact. Apples can keep you awake. Stop Coffee!",
                      "This is interesting. Seattle and San Francisco are USA's top 2 vegetarian cities. New Yorkers! catch up!!",
                      "Alert! To all daily Coffee drinkers. One cup of Star Bucks coffee contains as much caffeine as 4 cans of, Red Bull",
                     "Alert! To all Soda drinkers. Drinking Soda will corrode your teeth. As bad as drinking battery acid. Yes. Battery Acid!",
                     "73% of Americans agree, they would eat more healthy food. If was cheaper. Do you?",
                     "A fastfood Ham Burger can contain. Meat from more than hundreds, or even thousands of different cattle.",
                     "Shellac is a substance used, to improve shine of furniture. It is also used in candies and jellys. Oh. My. God!",
                     "The fact is, 73% of Americans would eat healthy, if the food cost less.",
                     "Water! Water! It can help you, prevent headache, increase blood volume, fight fever, curb apetite, eliminate body waste, keep your cool, boost your mind, relieve fatigue, absorb nutrients, flush toxins, keep skin glowing, prevent sprains, save money and many many many more. So keep drinking",
                     "Junk Food Fact. It takes about 524 Burps, to burn off 1 large fries."];

    //var factFruits = ["Water! Water! It can help you, prevent headache, increase blood volume, fight fever, curb apetite, eliminate body waste, keep your cool, boost your mind, relieve fatigue, flush toxins, keep skin glowing, prevent sprains, save money and many many many more."];
    var cancelSpeech = ["Remember. A good diet, is not about eating less. It is eating right. Have a nice day!",
                        "Take a healthy bite. Eat right. Sleep tight. Goodbye!"];
    
    switch(randomText) {
        case 'welcometext':
            return welcomeText[Math.floor(Math.random() * welcomeText.length)];

        case 'noitemfound':
            return noItemFound[Math.floor(Math.random() * noItemFound.length)];

         case 'connector':
            return nutritionSpeechConnector[Math.floor(Math.random() * nutritionSpeechConnector.length)];
         
         case 'cancelspeech':
            return cancelSpeech[Math.floor(Math.random() * cancelSpeech.length)];
            
         case 'factfruits':
            return factFruits[Math.floor(Math.random() * factFruits.length)];
            
        default:
            return "I am having some internal trouble. I need some energy"
    }
    
}


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

function antiOxidant(paramPercent){
    
}


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var trition = new Trition();
    trition.execute(event, context);
};