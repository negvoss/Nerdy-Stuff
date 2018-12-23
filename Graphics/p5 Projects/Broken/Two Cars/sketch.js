var lanes = [];

var xoff = 2;
var ww = window.innerWidth + xoff;
var hh = window.innerHeight;

var rectCount = 3;

var player1;
var player2;

var score = 0;

function setup() {
  rectMode(CENTER);
  if (ww*2 > hh) {
    createCanvas(hh/2,hh);
  } else {
    createCanvas(ww,ww*2);
  }
  createLanes();

  player1 = new Player("left");
  player2 = new Player("right");
}

function draw() {
  displayBackground();
  updateAndShowLanes();
  player1.update();
  player2.update();
  player1.show();
  player2.show();

  textAlign(CENTER);
  textSize((width - xoff)/15);
  noStroke();
  fill(200);
  text("Score: " + score,(width - xoff)/2,height/16);
}





function displayBackground() {
  background(51);
  stroke(200,100);
  strokeWeight((width - xoff)/109.66);
  line(0,                   0,  0,                   height);
  line((width - xoff)/4,    0,  (width - xoff)/4,    height);
  strokeWeight((width - xoff)/54.83);
  line((width - xoff)/2,    0,  (width - xoff)/2,    height);
  strokeWeight((width - xoff)/109.66);
  line((width - xoff)*3/4,  0,  (width - xoff)*3/4,  height);
  line((width - xoff),      0,  (width - xoff),      height);
}


function createLanes() {
  for (var i = 0; i < 4; i++) {
    lanes.push(new Lane(i));
  }
  for (var i = 0; i < 4; i++) {
    lanes[i].createObsticles(1);
  }
}

function updateAndShowLanes() {
  for (var i = 0; i < lanes.length; i++) {
    lanes[i].update();
    lanes[i].show();
  }
}

function gameOver() {
  noLoop();
  textAlign(CENTER);
  textSize((width - xoff)/7);
  noStroke();
  fill(153,50,204,200);
  text("GAME OVER",(width - xoff)/2,height/4);
}
