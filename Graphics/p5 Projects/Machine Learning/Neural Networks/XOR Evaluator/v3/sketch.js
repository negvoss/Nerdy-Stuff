const numI = 2; // number of inputs
const numO = 2; // number of outputs
const lR = 0.001; // learning rate

let currentlyTraining = false;
const currentAverage = [];

let nn;
const trainingData = [];
function preload() {
  setupTrainingData();
}

function setup() {
  nn = new NeuralNetwork(numI,10,10,numO,lR);
  select("#evaluate").mousePressed(function() {
    const input = new Matrix(numI,1);
    input.matrix[0][0] = Number(select("#inp1").value());
    input.matrix[1][0] = Number(select("#inp2").value());
    const o = nn.feedForward(input);
    const result = String(o.matrix[0][0] < o.matrix[1][0]).toUpperCase();
    select("#result").html("Result: " + result);
  });
  const toggleTraining = select("#toggleTraining");
  toggleTraining.mousePressed(function() {
    currentlyTraining = !currentlyTraining;
    if (toggleTraining.html() == "Start Training") {
      toggleTraining.html("Stop Training");
    } else {
      toggleTraining.html("Start Training");
    }
  });
}

const feedBackRate = 2;
const repsPerFrame = 400;
function draw() {
  if (currentlyTraining) {
    for (let i = 0; i < repsPerFrame; i++) {
      nn.train();
      currentAverage.push(abs(nn.outputError.matrix[0][0]) + abs(nn.outputError.matrix[1][0]));
      if (currentAverage.length > repsPerFrame/feedBackRate) {
        currentAverage.splice(0,1);
      }
    }
    if (frameCount % round(60/feedBackRate) == 0) {
      let sum = 0;
      for (let j = 0; j < currentAverage.length; j++) {
        sum += currentAverage[j];
      }
      const roundedSum = round((10000*sum)/currentAverage.length)/100;
      select("#trainingError").html("Current Training Error: " + roundedSum + "%");
    }
  }
}

function setupTrainingData() {
  loadJSON("training.json",function(data) {
    // prepare training data
    for (let i = 0; i < data.length; i++) {
      const input = new Matrix(numI,1);
      for (let j = 0; j < data[i].input.length; j++) {
        input.matrix[j][0] = data[i].input[j];
      }
      const output = new Matrix(numO,1);
      output.matrix[data[i].output][0] = 1;
      trainingData.push({
        input:input,
        output:output
      });
    }
  });
}
