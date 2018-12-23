var socket;
var idCounter = 0;

var blobs = [];
var otherClientBlobs = [];
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

  socket = io.connect("http://localhost:3000/");
  socket.on("connect",setupAfterConnect);
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
  socket.emit("getOtherBlobs");
  blobs.push(new Blob(leftBound,topBound,3000,col));
  textAlign(CENTER);
}

function draw() {
  background(51);

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
}


function keyPressed() {
  if (key == " ") {
    for (var i = blobs.length - 1; i >= 0; i--) {
      blobs[i].split();
    }
  }
}


function addOtherBlobs(data) {
  for (var i = 0; i < data.otherBlobs.length; i++) {
    var current = data.otherBlobs[i];

    // var alreadyExists = false;
    // for (var i = 0; i < otherClientBlobs.length; i++) {
    //   if (otherClientBlobs[i].id == current.id) {
    //     alreadyExists = true;
    //   }
    // }
    otherClientBlobs.push(new OtherClientBlob(
      current.id,
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
    otherClientBlobs[index].x = data.x;
    otherClientBlobs[index].y = data.y;
    otherClientBlobs[index].m = data.m;
    otherClientBlobs[index].r = data.r;
  }
}

function blobDestroy(data) { // Todo: Problem Here.
  var index;
  for (var i = 0; i < otherClientBlobs.length; i++) {
    if (otherClientBlobs[i].id == data.id) {
      index = i;
      break;
    }
  }
  if (index) {
    otherClientBlobs.splice(index,1);
  }

  var index2;
  for (var i = 0; i < blobs.length; i++) {
    if (blobs[i].id == data.id) {
      index2 = i;
      break;
    }
  }
  if (index2) {
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
