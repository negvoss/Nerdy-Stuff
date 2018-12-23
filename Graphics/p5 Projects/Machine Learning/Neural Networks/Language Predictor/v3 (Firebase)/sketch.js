var config; // for firebase
var database;
var ref;

var p; // perceptron
var currentAverage = [];

var wordInput; // input box

var trainingData = [];
var currentlyTraining = false;



var maxCombos = 3;
var firstLanguage = "English";
var secondLanguage = "Japanese";




var languageURLS = {
  English:"https://api.myjson.com/bins/1eksi5"/*English*/,
  Latin:"https://api.myjson.com/bins/8ihrl"/*Latin*/,
  Japanese:"https://api.myjson.com/bins/12wp1p"/*Japanese*/,
  Swahili:"https://api.myjson.com/bins/ns2kd"/*Swahili*/
}

function preload() {
  loadJSON(languageURLS[firstLanguage],function(words) {
    addTrainingData(words,1)
  });
  loadJSON(languageURLS[secondLanguage],function(words) {
    addTrainingData(words,-1)
  });
}

function addTrainingData(words,answer) {
  for (var i = 0; i < words.length; i++) {
    trainingData.push({
      word:words[i].word.toLowerCase(),
      answer:answer
    });
  }
  for (var i = 0; i < trainingData.length; i++) {
    trainingData[i].inputs = wordToInputArray(trainingData[i].word);
  }
}

function setup() {
  initFireBase();


  maxCombos = min(maxCombos,4);
  noCanvas();
  var totalSlots = 0;
  for (var i = 1; i <= maxCombos; i++) {
    totalSlots += pow(26,i);
  }
  totalSlots++;
  p = new Perceptron(totalSlots,0.001);
  setupControls();
}

function wordToInputArray(word) {
  var inputs = [];
  for (var i = 1; i <= maxCombos; i++) {
    inputs = inputs.concat(findCombos(word,i));
  }
  inputs.push(1); // bias
  return inputs;
}

function findCombos(word,numCombos) {
  var combos = new Array(pow(26,numCombos));
  for (var i = 0; i < combos.length; i++) {
    combos[i] = 0;
  }
  for (var i = 0; i < word.length - (numCombos - 1); i++) {
    var letterIDs = [];
    var index = 0;
    for (var j = 0; j < numCombos; j++) {
      letterIDs[j] = word.charCodeAt(i + j) - 97;
      index += letterIDs[j]*pow(26,numCombos - j - 1);
    }
    combos[index]++;
  }
  return combos;
}



function draw() {
  if (currentlyTraining) {
    showTraining();
  }
}

function setupControls() {
  wordInput = select("#wordInput");
  select("#submit").mousePressed(function() {
    var word = wordInput.value().toLowerCase();
    var inputs = wordToInputArray(word);
    var result = p.activate(inputs);
    var language;
    if (result == 1) {
      language = firstLanguage;
    } else {
      language = secondLanguage;
    }
    select("#result").html("result: " + language);
  });
  select("#startTraining").mousePressed(function() {
    currentlyTraining = true;
  });
  select("#stopTraining").mousePressed(function() {
    currentlyTraining = false;
  });
  select("#saveWeights").mousePressed(function() {
    ref.remove();
    var data = p.weights;
    ref.push(data);
  });
  select("#clearDatabase").mousePressed(function() {
    ref.remove();
  });
}

function showTraining() {
  for (var i = 0; i < 50; i++) {
    var trnPt = random(trainingData); // current training datapoint
    var feedback = "Training: " + "word: " + trnPt.word + ";   result: ";

    var language = p.activate(trnPt.inputs);
    if (language == 1) {
      feedback += firstLanguage;
    } else {
      feedback += secondLanguage;
    }
    feedback += " (";

    if (language != trnPt.answer) {
      p.train(trnPt.inputs,trnPt.answer);
      feedback += "Incorrect";
      currentAverage.push(0);
    } else {
      feedback += "Correct";
      currentAverage.push(1);
    }
    feedback += ").";

    select("#trainingText").html(feedback);

    if (currentAverage.length > 50) {
      currentAverage.splice(0,1);
    }
    var sum = 0;
    for (var i = 0; i < currentAverage.length; i++) {
      sum += currentAverage[i];
    }
    var pct = round(100*(sum/currentAverage.length));

    select("#averageText").html("Current average success: " + pct + "%.");
  }
}

function initFireBase() {
  config = {
    apiKey: "AIzaSyAI7ji8D_myiQS-79UgH1ld0XdP1vVmnHo",
    authDomain: "language-predictor.firebaseapp.com",
    databaseURL: "https://language-predictor.firebaseio.com",
    projectId: "language-predictor",
    storageBucket: "language-predictor.appspot.com",
    messagingSenderId: "728275426485"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  ref = database.ref("weights");
  ref.on("value",gotData,errData);
}

function gotData(data) {
  var key = Object.keys(data.val())[0];
  var weights = data.val()[key];
  p.weights = weights;
}

function errData(err) {
  console.log(err);
}
