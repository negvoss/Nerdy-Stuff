 // Number of input, hidden, and output nodes - 3 layered network by definition, learning rate passed
const NeuralNetwork = function(numI,numH,numO,lR) {
  this.layers = new Array(arguments.length - 1);
  this.weights = new Array(this.layers.length - 1);
  this.weights[0] = new Matrix(numH,numI).randomize(); // Random weights from input to hidden
  this.weights[1] = new Matrix(numO,numH).randomize(); // Random weights from hidden to output

  this.feedForward = function(input) { // calculate nodes
    let currentLayer = input;
    for (let i = 0; i < this.weights.length; i++) {
      currentLayer = this.weights[i].dot(currentLayer).sigmoid();
    }
    return currentLayer // output
  }

  this.train = function() {
    const trn = random(trainingData);
    const trnI = trn.input;
    const trnO = trn.output;

    this.layers[0] = trnI;
    for (let i = 1; i < this.weights.length + 1; i++) {
      this.layers[i] = this.weights[i - 1].dot(this.layers[i - 1]).sigmoid();
    }
    this.outputError = trnO.sub(this.layers[this.layers.length - 1]);
    let errors = [];
    errors[this.layers.length - 1] = this.outputError;
    for (let i = this.layers.length - 2; i >= 0; i--) {
      errors[i] = this.weights[i].transpose().dot(errors[i + 1]);
    }
    // formula for updating weights
    for (let i = this.weights.length - 1; i >= 0; i--) {
      this.weights[i] = this.weights[i].add(
        (errors[i + 1].mult(
          this.layers[i + 1].mult(this.layers[i + 1].mult(-1).add(1)))
        ).dot(this.layers[i].transpose()
      ).mult(lR));
    }
  }
}
