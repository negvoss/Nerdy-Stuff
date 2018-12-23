
var circles = [];
var connections = [];


function setup() {
  createCanvas(600,600);
  createCircles();
}

function draw() {
  background(51);
  UpdateAndShow();
}


function mousePressed() {
  for (var i = 0; i < circles.length; i++) {
    connections.push(new Connection(mouseX,mouseY,circles[i]));
  }
}





function createCircles() {
  for (var i = 0; i < 18; i++) {
    circles.push(new Circle(i*20));
  }
}

function UpdateAndShow() {
  for (var i = 0; i < connections.length; i++) {
    connections[i].show();
  }

  for (var i = 0; i < circles.length; i++) {
    circles[i].update();
    circles[i].show();
  }
}
