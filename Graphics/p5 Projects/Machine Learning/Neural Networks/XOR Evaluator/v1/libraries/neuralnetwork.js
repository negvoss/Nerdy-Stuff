 // Number of input, hidden, and output nodes - 3 layered network by definition, learning rate passed
const NeuralNetwork = function(numI,numH,numO,lR) {
  this.inputToHidden = new Matrix(numH,numI).randomize(); // Random weights from input to hidden
  this.hiddenToOutput = new Matrix(numO,numH).randomize(); // Random weights from hidden to output

  this.feedForward = function(input) { // calculate nodes
    const i = input;
    const h = this.inputToHidden.dot(i).sigmoid();
    return this.hiddenToOutput.dot(h).sigmoid(); // output
  }

  this.train = function() {
    const trn = random(trainingData);
    const trnI = trn.input;
    const trnO = trn.output;

    const i = trnI;
    const h = this.inputToHidden.dot(i).sigmoid();
    const o = this.hiddenToOutput.dot(h).sigmoid();
    this.outputError = trnO.sub(o);
    // formula for updating weights below
    this.hiddenToOutput = this.hiddenToOutput.add(
      (this.outputError.mult(
        o.mult(o.mult(-1).add(1)))
      ).dot(h.transpose()
    ).mult(lR));
    this.inputToHidden = this.inputToHidden.add(
      (this.hiddenToOutput.transpose().dot(this.outputError).mult(
        h.mult(h.mult(-1).add(1)))
      ).dot(i.transpose()
    ).mult(lR));
  }
}
