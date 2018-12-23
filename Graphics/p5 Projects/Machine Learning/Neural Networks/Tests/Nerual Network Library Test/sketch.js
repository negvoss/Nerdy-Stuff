var numI = 2;
var numH = 2;
var numO = 1;

var nn;
var trainingData = [
  {
    input:new Matrix(numI,1),
    output:new Matrix(numO,1)
  }
]

trainingData[0].input.matrix = [
  [0.22],
  [0.56]
];
trainingData[0].output.matrix = [
  [0.88],
  [0.71]
];

function setup() {
  nn = new NeuralNetwork(numI,numH,numO,0.01);
}

function draw() {
  for (var i = 0; i < 1000; i++) {
    nn.train();
  }
  if (frameCount % 300 == 0) {
    nn.outputError.print();
  }
}
