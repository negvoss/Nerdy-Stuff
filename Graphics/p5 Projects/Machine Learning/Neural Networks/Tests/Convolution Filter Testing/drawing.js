let prevX = null;
let prevY = null;
let lines = [];
let currentlyDrawing;

function draw() {
  frmRt = frameRate();
  updateTimer();
  stroke(255,0,0); // border between left and right screens
  strokeWeight(3);
  line(w,0,w,h);
  //line(w*2,0,w*2,h);
}

function mousePressed() {
  if (mouseOnCanvas()) {
    if (!timing) {
      background(0);
      lines = [];
    }
    currentlyDrawing = true;
    resetTimer();
    fill(255);
    noStroke();
    ellipse(mouseX,mouseY,penWidth*w/resolution);
    lines.push([mouseX,mouseY,mouseX,mouseY]);
    prevX = mouseX;
    prevY = mouseY;
  }
}

function mouseDragged() {
  if (currentlyDrawing) {
    if (mouseOnCanvas()) {
      resetTimer();
      stroke(255);
      strokeWeight(penWidth*w/resolution);
      line(mouseX,mouseY,prevX,prevY);
      lines.push([mouseX,mouseY,prevX,prevY]);
      prevX = mouseX;
      prevY = mouseY;
    }
  }
}

function mouseReleased() {
  if (currentlyDrawing) startTimer();
}

const mouseOnCanvas = function() {
  return mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= height;
}
