function Perceptron(num_inputs) {
  this.weights = [];
  this.randomizeWeights = function() {
    for (var i = 0; i < num_inputs; i++) {
      this.weights[i] = random(-1,1);
    }
  }
  this.guess = function(inputs) {
    var sum = 0;
    for (var i = 0; i < inputs.length; i++) {
      sum += inputs[i]*this.weights[i];
    }
    return sum
  }
  this.activate = function(inputs) {
    var guess = this.guess(inputs);
    if (guess > 0) {
      return 1;
    } else {
      return -1;
    }
  }
  this.train = function(inputs,expected_output) {
    var output = this.activate(inputs);
    var error = expected_output - output;
    for (var i = 0; i < inputs.length; i++) {
      this.weights[i] += error*inputs[i]*learning_rate;
    }
  }
}
