const resolution = 11;
const possibleOutputStr = "0123456789☺";
let possibleOutputs = [];
for (let i = 0; i < possibleOutputStr.length; i++) {
  possibleOutputs.push(possibleOutputStr[i]);
}

const filterNames = ["Vertical Line |","Horizontal Line –","Diagonal Line \\","Diagonal Line /","Dot"]; // filters to use
const numI = filterNames.length*Math.pow(resolution,2); // number of inputs
const numO = possibleOutputs.length; // number of outputs
const lR = 0.05; // learning rate

function setup() {
  setupDrawingJS();
  setupFirebase();
  nn = new NeuralNetwork(numI,15,10,numO,lR);
  reportError();
}

let currentlyTraining = false;
const currentAverage = [];

let nn;
let trainingImages = [];
let trainingData = [];

const train = function() {
  //train and record error
  for (let i = 0; i < 10*trainingData.length; i++) {
    nn.train();
    let sum = 0;
    for (let j = 0; j < nn.outputError.rows; j++) {
      sum += abs(nn.outputError.matrix[j][0]);
    }
    currentAverage.push(sum);
    if (currentAverage.length > trainingData.length) {
      currentAverage.splice(0,currentAverage.length - trainingData.length);
    }
  }
}

const reportError = function() {
  if (currentlyTraining) {
    let sum = 0;
    for (let j = 0; j < currentAverage.length; j++) {
      sum += currentAverage[j];
    }
    const roundedSum = min(100,round((10000*sum)/currentAverage.length)/100);
    select("#trainingError").html("Current Training Error: " + roundedSum + "%");
  }
  setTimeout(reportError,1000);
}

const setupTrainingData = function() {
  for (let i = 0; i < trainingImages.length; i++) {
    const input = new Matrix(numI,1);
    const output = new Matrix(numO,1);
    if (possibleOutputs.indexOf(trainingImages[i].id) != -1) {
      output.matrix[possibleOutputs.indexOf(trainingImages[i].id)][0] = 1;
      for (let j = 0; j < trainingImages[i].convolvedPixels.length; j++) {
        if (filterNames.indexOf(trainingImages[i].convolvedPixels[j].filterName) == -1) {
          trainingImages[i].convolvedPixels.splice(j,1);
        }
        for (let k = 0; k < trainingImages[i].convolvedPixels[j].pixels.length; k++) {
          input.matrix[j*pow(resolution,2) + k][0] = trainingImages[i].convolvedPixels[j].pixels[k];
        }
      }
      trainingData.push({
        input:input,
        output:output
      });
    }
  }
  trainingData = shuffle(trainingData);
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
