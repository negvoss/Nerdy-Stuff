var p;
var learning_rate = 0.001;
var wordList;
var trainingData = []
var currentAverage = [];
var wordInput;
var submit;
var result;
var trainingSpace;
var startTraining;
var stopTraining;
var averageText;
var currentlyTraining = false;

function preload() {
  loadJSON("https://api.myjson.com/bins/vo975",function(words) {
    for (var i = 0; i < words.length; i++) {
      trainingData.push({
        word:words[i].word,
        inputs:[],
        answer:1
      });
    }
  });
  loadJSON("https://api.myjson.com/bins/8ihrl",function(words) {
    for (var i = 0; i < words.length; i++) {
      trainingData.push({
        word:words[i].word,
        inputs:[],
        answer:-1
      });
    }
  });
}

function setup() {
  noCanvas();
  for (var i = 0; i < trainingData.length; i++) {
    trainingData[i].inputs = wordToInputArray(trainingData[i].word);
  }
  p = new Perceptron(379);
  wordInput = select("#wordInput");
  resultText = select("#result");
  submit = select("#submit").mousePressed(function() {
    var inputs = wordToInputArray(wordInput.value());
    var result = p.activate(inputs);
    var language;
    if (result == 1) {
      language = "English";
    } else {
      language = "Latin";
    }
    resultText.html("result: " + language);
  });
  trainingSpace = select("#trainingSpace");
  startTraining = select("#startTraining").mousePressed(function() {
    currentlyTraining = true;
  });
  stopTraining = select("#stopTraining").mousePressed(function() {
    currentlyTraining = false;
  });
  averageText = select("#averageText");
}

function wordToInputArray(word) {
  word = word.toLowerCase();
  var inputs = [];
  for (var i = 0; i < 27; i++) {
    if (word.charCodeAt(i)) {
      var letterID = word.charCodeAt(i) - 97;
      inputs[letterID] = 1
    } else {
      for (var i = 0; i < 27; i++) {
        if (inputs[i] == undefined) {
          inputs[i] = -1;
        }
      }
    }
  }
  inputs.push(1); // bias
  return inputs;
}

function draw() {
  if (currentlyTraining) {
    for (var i = 0; i < 50; i++) {
      var trnPt = random(trainingData); // current training datapoint
      var result;
      var language;
      var languageText;
      language = p.activate(trnPt.inputs);
      if (language == 1) {
        languageText = "English";
      } else {
        languageText = "Latin";
      }
      if (language != trnPt.answer) {
        p.train(trnPt.inputs,trnPt.answer);
        result = "Incorrect";
        currentAverage.push(0);
      } else {
        result = "Correct";
        currentAverage.push(1);
      }
      trainingSpace.html(
        "Training: " + "word: " + trnPt.word + ";   result: " + languageText + " (" + result + ")."
      );
      if (currentAverage.length > 50) {
        currentAverage.splice(0,1);
      }
      var sum = 0;
      for (var i = 0; i < currentAverage.length; i++) {
        sum += currentAverage[i];
      }
      averageText.html("Current average success: " + round(100*(sum/currentAverage.length)) + "%.");
    }
  }
}
