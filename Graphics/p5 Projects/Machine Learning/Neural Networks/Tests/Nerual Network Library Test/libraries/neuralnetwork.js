function NeuralNetwork(numI,numH,numO,learningRate) { // Number of input, hidden, and output nodes - 3 layered networ
  //Node values (vectors)
  this.input = new Matrix(numI,1);
  this.hidden = new Matrix(numH,1);
  this.output = new Matrix(numO,1);
  //Weights (matrices)
  this.inputToHidden = new Matrix(numH,numI); // Weights from input to hidden
  this.hiddenToOutput = new Matrix(numO,numH); // Weights from hidden to output
  this.inputToHidden.randomize(); // randomize weights
  this.hiddenToOutput.randomize(); // randomize weights
  //Node errors (vectors)
  this.inputError = new Matrix(numI,1);
  this.hiddenError = new Matrix(numH,1);
  this.outputError = new Matrix(numO,1);

  // Learning Rate
  this.inputToHiddenLR = new Matrix(numH,numI);
  for (var i = 0; i < this.inputToHiddenLR.rows; i++) {
    this.inputToHiddenLR.matrix[i][0] = learningRate;
  }
  this.hiddenToOutputLR = new Matrix(numO,numH);
  // Constant Ones
  this.outputOnes = new Matrix(this.output.rows,1);
  for (var i = 0; i < this.outputOnes.rows; i++) {
    this.outputOnes.matrix[i][0] = 1;
  }
  this.hiddenOnes = new Matrix(this.hidden.rows,1);
  for (var i = 0; i < this.hiddenOnes.rows; i++) {
    this.hiddenOnes.matrix[i][0] = 1;
  }

  this.feedForward = function() {
    var training = random(trainingData);
    this.input = training.input;
    this.hidden = sigmoid(this.inputToHidden.mult(this.input));
    this.output = sigmoid(this.hiddenToOutput.mult(this.hidden));

    this.outputError = training.output.sub(this.output);
    this.hiddenError = this.hiddenToOutput.transpose().mult(this.outputError);
  }
  this.feedForward(); // once at creation to initialize node values

  this.train = function() {
    this.feedForward();
    var lR = this.hiddenToOutputLR;
    var o = this.output;
    var oE = this.outputError;
    var oOnes = this.outputOnes;
    var hT = this.hidden.transpose();
    this.hiddenToOutput = this.hiddenToOutput.add(lR.multEW((oE.multEW(o.multEW(oOnes.sub(o)))).mult(hT)));

    this.inputError = this.inputToHidden.transpose().mult(this.hiddenError);
    var lR = this.inputToHiddenLR;
    var h = this.hidden;
    var hE = this.hiddenError;
    var hOnes = this.hiddenOnes;
    var iT = this.input.transpose();
    this.inputToHidden = this.inputToHidden.add(lR.multEW((hE.multEW(h.multEW(hOnes.sub(h)))).mult(iT)));
  }
}

var e = 2.718281828;
function sigmoid(vector) {
  var newVector = new Matrix(vector.rows,1);
  for (var i = 0; i < vector.rows; i++) {
    newVector.matrix[i][0] = 1/(1 + pow(e,-vector.matrix[i][0]));
  }
  return newVector;
}
