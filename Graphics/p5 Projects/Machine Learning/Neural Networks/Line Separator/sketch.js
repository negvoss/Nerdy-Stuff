var p;
var learning_rate = 0.001;
var points = [];

var xmin = -1;
var ymin = -1;
var xmax = 1;
var ymax = 1;

function f(x) {
  var m = -20;
  var b = 1;
  var y = m*x + b;
  return y;
}

function setup() {
  createCanvas(600,600);
  p = new Perceptron(3);
  p.randomizeWeights();
  for (var i = 0; i < 100; i++) {
    createPoint(random(xmin,xmax),random(ymin,ymax));
  }
}


function draw() {
  drawBackground();
  showPoints();
}

function drawBackground() {
  background(51);
  stroke(255,0,0);
  strokeWeight(3);
  var x1 = map(xmin, xmin, xmax, 0, width);
  var y1 = map(f(xmin), ymin, ymax, height, 0);
  var x2 = map(xmax, xmin, xmax, 0, width);
  var y2 = map(f(xmax), ymin, ymax, height, 0);
  line(x1, y1, x2, y2);

  //network's line:
  stroke(0,0,255);
  var w = p.weights;
  var x1 = xmin;
  var y1 = (-w[2] - w[0]*x1)/w[1];
  var x2 = xmax;
  var y2 = (-w[2] - w[0]*x2)/w[1];

  var x1 = map(x1, xmin, xmax, 0, width);
  var y1 = map(y1, ymin, ymax, height, 0);
  var x2 = map(x2, xmin, xmax, 0, width);
  var y2 = map(y2, ymin, ymax, height, 0);
  line(x1, y1, x2, y2);
}

function showPoints() {
  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    if (p.activate(pt.inputs) != pt.answer) {
      p.train(pt.inputs,pt.answer);
    }
    if (pt.answer == 1) {
      stroke(0,255,0);
    } else {
      stroke(255,0,0);
    }
    strokeWeight(5);
    var x = map(pt.inputs[0],xmin,xmax,0,width);
    var y = map(pt.inputs[1],ymin,ymax,height,0);
    point(x,y);
  }
}

function createPoint(x,y) {
  var answer;
  if (y > f(x)) {
    answer = 1;
  } else {
    answer = -1;
  }
  var pt = {
    inputs:[x,y,1],
    answer:answer
  }
  points.push(pt);
}

function mousePressed() {
  createPoint(map(mouseX,0,width,xmin,xmax),map(mouseY,height,0,ymin,ymax));
}
