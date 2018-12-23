var blobs = [];
var food = [];

var col;

var leftBound  = -3000;
var rightBound =  3000;
var topBound   = -3000;
var botBound   =  3000;

var xCenter = 0;
var yCenter = 0;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);

  col = color(random(255),random(255),random(255));

  blobs.push(new Blob(-200,0,1000));
  blobs.push(new Blob(-100,0,2000));
  blobs.push(new Blob(0,0,3000));
  blobs.push(new Blob(100,0,4000));


  for (var i = 0; i < 1500; i++) {
    food.push(new Food(random(leftBound,rightBound),random(topBound,botBound)));
  }

  textAlign(CENTER);
}

function draw() {
  background(51);

  for (var i = 0; i < food.length; i++) {
    var current = food[i];
    current.show();
  }

  var xTotal = 0;
  var yTotal = 0;

  for (var i = 0; i < blobs.length; i++) {
    var current = blobs[i];

    xTotal += current.x;
    yTotal += current.y;

    if (current.x < leftBound)  current.x = leftBound;
    if (current.y < topBound)   current.y = topBound;
    if (current.x > rightBound) current.x = rightBound;
    if (current.y > botBound)   current.y = botBound;

    current.update();
    current.eat();
    current.grow();
    current.show();
    current.move();
  }

  xCenter = xTotal/blobs.length;
  yCenter = yTotal/blobs.length;

  // strokeWeight(8);
  // stroke(255,0,0);
  // noFill();
  // rect(
  //   leftBound - blob.x + width/2,
  //   topBound - blob.y + height/2,
  //   rightBound - leftBound,
  //   botBound - topBound
  // );
}


function keyPressed() {
  if (key == " ") {
    for (var i = blobs.length - 1; i >= 0; i--) {
      blobs[i].split();
    }
  }
}
