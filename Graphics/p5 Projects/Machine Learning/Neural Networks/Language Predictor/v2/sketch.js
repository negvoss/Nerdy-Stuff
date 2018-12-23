var p; // perceptron
var currentAverage = [];

var trainingData = [];
var currentlyTraining = false;



var maxCombos = 3;
var firstLanguage = "English";
var secondLanguage = "Japanese";

var txt;

var languageURLS = {
  English:"https://api.myjson.com/bins/1eksi5",
  Latin:"https://api.myjson.com/bins/8ihrl",
  Japanese:"https://api.myjson.com/bins/12wp1p",
  Swahili:"https://api.myjson.com/bins/ns2kd",
  Hebrew:"https://api.myjson.com/bins/6jklp"
}

function preload() {
  loadJSON(languageURLS[firstLanguage],function(words) {
    addTrainingData(words,1)
  });
  loadJSON(languageURLS[secondLanguage],function(words) {
    addTrainingData(words,-1)
  });
  txt = loadStrings("text_example.txt");
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

function evaluateText(txt) {
  var words = [];
  for (var i = 0; i < txt.length; i++) {
    words = words.concat(txt[i].split(" "));
  }
  var total = 0;
  for (var i = 0; i < words.length; i++) {
    var word = cleanWord(words[i]);
    var inputs = wordToInputArray(word);
    total += p.guess(inputs);
  }
  var language;
  if (total > 0) {
    language = firstLanguage
  } else {
    language = secondLanguage;
  }
  var confidence = round(map(abs(total),0,inputs.length*words.length,0,1000000));
  select("#sampleEvaluationResult").html("Result: " + language + " (Confidence: ~" + confidence + ").");
}


function draw() {
  if (currentlyTraining) {
    train();
  }
}

function setupControls() {
  select("#wordInput").changed(submitWord);
  select("#submit").mousePressed(submitWord);
  select("#randomWord").mousePressed(function() {
    loadStrings("http://setgetgo.com/randomword/get.php",function(word) {
      select("#wordInput").value(word);
      submitWord();
    });
  });
  select("#startTraining").mousePressed(function() {
    currentlyTraining = true;
  });
  select("#stopTraining").mousePressed(function() {
    currentlyTraining = false;
  });
  select("#evaluateText").mousePressed(function() {
    evaluateText(txt);
  });
}

function submitWord() {
  var word = select("#wordInput").value();
  word = cleanWord(word);
  var inputs = wordToInputArray(word);
  var result = p.activate(inputs);
  var language;
  if (result == 1) {
    language = firstLanguage;
  } else {
    language = secondLanguage;
  }
  var guess = p.guess(inputs);
  var confidence = round(map(abs(guess),0,inputs.length,0,1000000));
  select("#result").html("Result: " + language + " (Confidence: ~" + confidence + ").");
}

function cleanWord(word) {
  word = word.toLowerCase();
  word = word.replace(/[^a-z]/g,""); // take out non-alphabet characters
  return word;
}

function train() {
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
