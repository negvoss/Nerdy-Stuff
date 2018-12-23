// Number of input, hidden, and output nodes
let trnIndex = 0;
const NeuralNetwork = function() {
  this.layers = new Array(arguments.length - 1);
  this.weights = new Array(this.layers.length - 1);
  for (let i = 0; i < this.weights.length; i++) {
    this.weights[i] = new Matrix(arguments[i + 1],arguments[i]).randomize();
  }
  this.lR = arguments[arguments.length - 1];

  this.feedForward = function(input) {
    // calculate nodes
    let currentLayer = input;
    for (let i = 0; i < this.weights.length; i++) {
      currentLayer = this.weights[i].dot(currentLayer).sigmoid();
    }
    return currentLayer // output at the end
  }

  this.train = function() {
    // set up training
    const trn = trainingData[trnIndex%trainingData.length];

    // calculate nodes
    this.layers[0] = trn.input;
    for (let i = 1; i < this.weights.length + 1; i++) {
      this.layers[i] = this.weights[i - 1].dot(this.layers[i - 1]).sigmoid();
    }
    this.outputError = trn.output.sub(this.layers[this.layers.length - 1]);
    // calculating errors
    const errors = [];
    errors[this.layers.length - 1] = this.outputError;
    for (let i = this.layers.length - 2; i >= 0; i--) {
      errors[i] = this.weights[i].transpose().dot(errors[i + 1]);
    }
    // formula for updating weights (calculus involved to find slope of error function)
    for (let i = this.weights.length - 1; i >= 0; i--) {
      this.weights[i] = this.weights[i].add(
        (errors[i + 1].mult(
          this.layers[i + 1].mult(this.layers[i + 1].mult(-1).add(1)))
        ).dot(this.layers[i].transpose()
      ).mult(this.lR));
    }
    trnIndex++;
  }
}
