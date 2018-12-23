var date;
var clocknodes = [];
var clockOrigin;

function setup() {
  createCanvas(600,600);
  textAlign(LEFT);
  textSize(30);
  createClock();
}

function draw() {
  background(51);
  showClock();
  displayTime();
}





function createClock() {
  clockOrigin = new ClockNode(0,0);
  var r = 200;
  for (var i = 0; i < TWO_PI; i += TWO_PI/12) {
    clocknodes.push(new ClockNode(r,i));
  }
}


function displayTime() {
  date = new Date();
  strokeWeight(2);
  stroke(0);
  fill(0);
  text(date.getHours()%12 + ":" + date.getMinutes(),0,30);
  showHours();
  showMinutes();
  showSeconds();
}


function showClock() {
  stroke(255);
  noFill();
  ellipse(width/2,height/2,400);
  stroke(0);
  for (var i = 0; i < clocknodes.length; i++) {
    clocknodes[i].show();
  }
  clockOrigin.show();
}


function showHours() {
  strokeWeight(8);
  stroke(0);
  var hourNode = clocknodes[(date.getHours() - 3)%12];
  line(
    clockOrigin.x,
    clockOrigin.y,
    (hourNode.r - 70)*cos(hourNode.angle + 6.28*(date.getMinutes()/720)) + width/2,
    (hourNode.r - 70)*sin(hourNode.angle + 6.28*(date.getMinutes()/720)) + height/2
  );
}

function showMinutes() {
  strokeWeight(8);
  stroke(0);
  var minuteNode = clocknodes[(floor(date.getMinutes()/5) - 3)%12];
  line(
    clockOrigin.x,
    clockOrigin.y,
    minuteNode.r*cos(minuteNode.angle + 6.28*((date.getMinutes()%5)/60)) + width/2,
    minuteNode.r*sin(minuteNode.angle + 6.28*((date.getMinutes()%5)/60)) + height/2
  );
}

function showSeconds() {
  strokeWeight(8);
  stroke(255,0,0);
  var secondNode = clocknodes[(floor(date.getSeconds()/5) - 3)%12];
  line(
    clockOrigin.x,
    clockOrigin.y,
    secondNode.r*cos(secondNode.angle + 6.28*((date.getSeconds()%5)/60)) + width/2,
    secondNode.r*sin(secondNode.angle + 6.28*((date.getSeconds()%5)/60)) + height/2
  );
}
