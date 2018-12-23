var express = require("express");
var app = express();

var port = 3000;
var server = app.listen(port);

app.use(express.static("public"));

var socket = require("socket.io");
var io = socket(server);

io.sockets.on("connection",newConnection);



var clients = [];

function newConnection(socket) {
  clients.push(socket);
  socket.on("disconnect",disconnect);
  console.log("New connection:",socket.id);

  socket.on("mouse",mouseMsg);

  function mouseMsg(data) {
    socket.broadcast.emit("mouse",data);
  }
}

function disconnect(socket) {
  console.log("disconnected");
  var index = clients.indexOf(socket);
  clients.splice(index,1);
}




console.log("Server running on port",port);
