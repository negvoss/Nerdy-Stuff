var socket;

function setup() {
  socket = io.connect("http://localhost:3000");
  socket.on("mouse",newDrawing);
  createCanvas(600,600);
  background(51);
}

function newDrawing(data) {
  noStroke();
  fill(200,100,150);
  ellipse(data.x,data.y,60);
}

function mouseDragged() {
  var data = {
    x:mouseX,
    y:mouseY
  }

  socket.emit("mouse",data);
  noStroke();
  fill(255);
  ellipse(mouseX,mouseY,60);
}
