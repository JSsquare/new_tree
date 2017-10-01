var req = require('request');

var APP_ID = undefined;

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
    // any initialization logic goes here
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
     response.tell(pickRandomFrom('factfruits'));
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
    var cardTitle = "New Tree Fruits";
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
              response.tellWithCard(speechOutput, cardTitle, speechOutput);
          });
}

function constructSpeechOutput(body){
    if(JSON.parse(body).foods){
        var foodResult = JSON.parse(body).foods[0];
        var nutrientValues = {   "nf_total_fat": parseInt(foodResult.nf_total_fat),
                                 "nf_saturated_fat": parseInt(foodResult.nf_saturated_fat),
                                 "nf_cholesterol": parseInt(foodResult.nf_cholesterol)/1000,
                                 "nf_total_carbohydrate": parseInt(foodResult.nf_total_carbohydrate),
                                 "nf_dietary_fiber": parseInt(foodResult.nf_dietary_fiber),
                                 "nf_sugars": parseInt(foodResult.nf_sugars),
                                 "nf_protein": parseInt(foodResult.nf_protein),
                                 "nf_sodium": parseInt(foodResult.nf_sodium)/1000
                                }
        var sortedNutrientKeys = Object.keys(nutrientValues).sort(function(a, b) {return -(Number(nutrientValues[a]) - Number(nutrientValues[b]))});
        var nutriNames = {
                                 "nf_total_fat": "Total Fat",
                                 "nf_saturated_fat": "Saturated Fat",
                                 "nf_cholesterol": "Cholestrol",
                                 "nf_total_carbohydrate": "Total Carbs",
                                 "nf_dietary_fiber": "Dietry Fiber",
                                 "nf_sugars": "Sugar",
                                 "nf_protein": "Protein",
                                 "nf_sodium": "Sodium"                                 
        }
    
        var nutriUnits = {
                                 "nf_total_fat": "grams",
                                 "nf_saturated_fat": "grams",
                                 "nf_cholesterol": "milligrams",
                                 "nf_total_carbohydrate": "grams",
                                 "nf_dietary_fiber": "grams",
                                 "nf_sugars": "grams",
                                 "nf_protein": "grams",
                                 "nf_sodium": "grams"
        }
        return foodResult.serving_qty + " " + foodResult.serving_unit.split(' ')[0] + " of " + foodResult.food_name + pickRandomFrom('connector')  + parseInt(foodResult.nf_calories) + "Kilo calories and " +  nutrientValues[sortedNutrientKeys[0]] + nutriUnits[sortedNutrientKeys[0]] + " of " + nutriNames[sortedNutrientKeys[0]];
    }
    else{
        return pickRandomFrom('noitemfound');
    }

}

function pickRandomFrom(randomText){
    var welcomeText = ["Hey! Welcome to The New Tree. I can help you eat healthy. Ask me how healthy your food item is",
                        "Hola! Welcome to The New Tree. You can ask me how healthy your food item is",
                        "Hello from New Tree. Feel free to ask me food questions"];
    var noItemFound = ["Oh! I am not sure if that is edible",
                       "Oh! Is that edible?",
                       "hmmm, I have not tasted that item. Is that edible?",
                       "I am sorry, I feel exhausted today. Meanwhile, can you ask me to pick a fact fruit"];
    var nutritionSpeechConnector = [" contains approximately ", " has more or less ", " has roughly ", " consist of "];
    
    var factFruits = ["Did you know? Avacado has more than twice as much potassium as banana. Make yourself a good toast today", 
                      "Do you know? Broccoli has twice the vitamin C of an Orange. And a good amount of calcium? Add this to your daily salad",
                      "Here is your Fact Fruit: Calories are not always bad for you. Protein and carbohydrates both contain 4 calories per gram! You should consume roughly, 2000 calories per day",
                      "Here is an interesting fact. Apples can keep you awake. Stop Coffee!",
                      "This is interesting. Seattle and San Francisco are USA's top 2 vegetarian cities. New Yorkers! catch up!!",
                      "Alert! To all daily Coffee drinkers. One cup of Star Bucks coffee contains as much caffeine as 4 cans of Red Bull"];
    
    var cancelSpeech = ["Remember. A good diet, is not about eating less. It is eating right. Goodbye!",
                        "Take a healthy bite! Eat right! Sleep tight! Goodbye!"];
    
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



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var trition = new Trition();
    trition.execute(event, context);
};