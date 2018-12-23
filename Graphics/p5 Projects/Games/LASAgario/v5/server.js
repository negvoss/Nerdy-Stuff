var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;


server.listen(process.env.PORT || port);
console.log("Server Running");


app.use(express.static("public"));

io.sockets.on("connection",newConnection);

var clients = [];

var w = 4000;
var h = 4000;

var leftBound  = -w/2;
var rightBound =  w/2;
var topBound   = -h/2;
var botBound   =  h/2;

var food = [];
var blobs = [];

var area = (rightBound - leftBound)*(botBound - topBound);
var foodRatio = 0.000075;

for (var i = 0; i < foodRatio*area; i++) {
  food.push({
    x:Math.random() * (rightBound - leftBound) + leftBound,
    y:Math.random() * (botBound - topBound) + topBound,
    r:Math.random() * 255,
    g:Math.random() * 255,
    b:Math.random() * 255
  });
}




function newConnection(socket) {
  socket.on("disconnect",disconnect);
  clients.push(socket);
  console.log("New connection:",socket.id);

  if (clients.length > 50) {
    socket.disconnect();
  }

  var data = {
    food:food
  }

  socket.emit("initFood",data);

  socket.on("getBounds",giveBounds);
  socket.on("getOtherBlobs",giveOtherBlobs);
  socket.on("blobInfo",relayUpdates);
  socket.on("delFood",delFood);
  socket.on("createFood",createFood);
  socket.on("addBlob",addBlob);
  socket.on("blobDestroy",blobDestroy);


  function giveBounds() {
    var data = {
      bounds:[leftBound,rightBound,topBound,botBound]
    }

    io.emit("boundaries",data);
  }

  function giveOtherBlobs() {
    var data = {
      otherBlobs:blobs
    }
    socket.emit("givingOtherBlobs",data);
  }

  function relayUpdates(data) {
    var index;
    for (var i = 0; i < blobs.length; i++) {
      if (blobs[i].id == data.id) {
        index = i;
        break;
      }
    }
    if (blobs[index]) {
      blobs[index].name = data.name;
      blobs[index].x = data.x;
      blobs[index].y = data.y;
      blobs[index].m = data.m;
      blobs[index].r = data.r;
    }

    socket.broadcast.emit("blobUpdates",data);
  }


  function delFood(data) {
    food.splice(data.index,1);
    socket.broadcast.emit("delFood",data);
  }

  function createFood(data) {
    food.push([
      data.x,
      data.y,
      data.r,
      data.g,
      data.b
    ])
    io.emit("createFood",data);
  }

  function addBlob(data) {
    blobs.push(data);
    socket.broadcast.emit("addBlob",data);
  }

  function blobDestroy(data) {
    var index;
    for (var i = 0; i < blobs.length; i++) {
      if (blobs[i].id == data.id) {
        index = i;
        break;
      }
    }
    blobs.splice(index,1);
    socket.broadcast.emit("blobDestroy",data);
  }


  function disconnect() {
    console.log(socket.id + " disconnected.");


    var data = {
      id:socket.id
    }
    for (var i = blobs.length - 1; i >= 0; i--) {
      if (blobs[i].id.startsWith(socket.id)) {
        blobs.splice(i,1);
      }
    }
    socket.broadcast.emit("removeDisconnectedBlobs",data);


    var index = clients.indexOf(socket);
    clients.splice(index,1);
  }
}
