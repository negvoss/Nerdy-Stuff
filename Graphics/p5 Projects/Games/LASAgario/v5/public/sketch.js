var socket;
var idCounter = 0;

var blobs = [];
var otherClientBlobs = [];
var food = [];

var col;

var leftBound;
var rightBound;
var topBound;
var botBound;

var zoom = 1;

var xCenter = 0;
var yCenter = 0;

var name = "";
var mr_loewenstern;

function setup() {
  mr_loewenstern = loadImage("/photos/mr_loewenstern.png");
  createCanvas(windowWidth,windowHeight);

  col = color(random(255),random(255),random(255));

  //socket = io.connect("https://lasa-io.herokuapp.com/");
  socket = io.connect("http://localhost:3000");

  socket.on("connect",setupAfterConnect);
  socket.on("boundaries",setupBoundaries);
  socket.on("givingOtherBlobs",addOtherBlobs);
  socket.on("initFood",initFood);
  socket.on("delFood",delFood);
  socket.on("createFood",createFood);
  socket.on("addBlob",addBlob);
  socket.on("blobUpdates",updateBlob);
  socket.on("blobDestroy",blobDestroy);
  socket.on("removeDisconnectedBlobs",removeDisconnectedBlobs);
}

function setupAfterConnect() {
  socket.emit("getBounds");
  socket.emit("getOtherBlobs");
  //name = prompt("Enter your username!");
}

function setupAfterBoundaries() {
  blobs.push(new Blob(random(leftBound,rightBound),random(topBound,botBound),2000,col));
}

function draw() {
  background(25,60,100);

  for (var i = 0; i < food.length; i++) {
    var current = food[i];
    current.show();
  }

  for (var i = 0; i < otherClientBlobs.length; i++) {
    var current = otherClientBlobs[i];
    current.show();
  }


  var xTotal = 0;
  var yTotal = 0;
  var rTotal = 0;

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

    rTotal += current.r;
  }

  if (blobs.length > 0) {
    xCenter = xTotal/blobs.length;
    yCenter = yTotal/blobs.length;
  }

  if (rTotal > 0) {
    var h = 0.35;
    zoom = pow(18,h)/pow(rTotal,h); // https://www.desmos.com/calculator/fajop8ov2h
  }
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
}


function displayX(x) {
  return ((x - xCenter)*zoom + width/2);
}

function displayY(y) {
  return ((y - yCenter)*zoom + height/2);
}

function displayR(r) {
  return (r*zoom);
}


function onScreen(x,y) {
  return (displayX(x) >= 0 && displayX(x) <= width && displayY(y) >= 0 && displayY(y) <= height);
}


function keyPressed() {
  if (key == " ") {
    for (var i = blobs.length - 1; i >= 0; i--) {
      blobs[i].split();
    }
  }
}

function setupBoundaries(data) {
  leftBound = data.bounds[0];
  rightBound = data.bounds[1];
  topBound = data.bounds[2];
  botBound = data.bounds[3];

  setupAfterBoundaries();
}


function addOtherBlobs(data) {
  for (var i = 0; i < data.otherBlobs.length; i++) {
    var current = data.otherBlobs[i];

    otherClientBlobs.push(new OtherClientBlob(
      current.id,
      current.name,
      current.x,
      current.y,
      current.m,
      color(current.rValue,current.gValue,current.bValue),
      current.r
    ));
  }
}


function initFood(data) {
  for (var i = 0; i < data.food.length; i++) {
    food.push(new Food(
      data.food[i].x,
      data.food[i].y,
      color(
        data.food[i].r,
        data.food[i].g,
        data.food[i].b
      )
    ));
  }
}

function delFood(data) {
  food.splice(data.index,1);
}

function createFood(data) {
  food.push(new Food(data.x,data.y,color(data.r,data.g,data.b)));
}


function addBlob(data) {
  otherClientBlobs.push(new OtherClientBlob(
    data.id,
    data.name,
    data.x,
    data.y,
    data.m,
    color(data.rValue,data.gValue,data.bValue),
    data.r
  ));
}

function updateBlob(data) {
  var index;
  for (var i = 0; i < otherClientBlobs.length; i++) {
    if (otherClientBlobs[i].id == data.id) {
      index = i;
      break;
    }
  }
  if (otherClientBlobs[index]) {
    otherClientBlobs[index].name = data.name;
    otherClientBlobs[index].x = data.x;
    otherClientBlobs[index].y = data.y;
    otherClientBlobs[index].m = data.m;
    otherClientBlobs[index].r = data.r;
  }
}

function blobDestroy(data) {
  var index = -1;
  for (var i = 0; i < otherClientBlobs.length; i++) {
    if (otherClientBlobs[i].id == data.id) {
      index = i;
      break;
    }
  }

  if (index != -1) {
    otherClientBlobs.splice(index,1);
  }

  var index2 = -1;
  for (var i = 0; i < blobs.length; i++) {
    if (blobs[i].id == data.id) {
      index2 = i;
      break;
    }
  }
  if (index2 != -1) {
    blobs.splice(index2,1);
  }
}

function removeDisconnectedBlobs(data) {
  for (var i = otherClientBlobs.length - 1; i >= 0; i--) {
    var current = otherClientBlobs[i];
    if (current.id.startsWith(data.id)) {
      otherClientBlobs.splice(i,1);
    }
  }
}
