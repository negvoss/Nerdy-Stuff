const penWidth = 1;
let lines = [];
let currentlyDrawing;

const setupDrawingJS = function() {
  (createCanvas(w*screens,h).parent("#canvasContainer")).elt.style.border = "solid";
  background(0);
  noSmooth();
}

function draw() {
  frmRt = frameRate();
  updateTimer();
  if (currentlyTraining) {
    train();
  }
  for (let i = 1; i < screens; i++) {
    stroke(255,0,0); // border between left and right screens
    strokeWeight(3);
    line(w*i,0,w*i,h);
    noStroke();
    fill(0,255,0);
    textSize(15);
    textAlign(CENTER);
    text(filterNames[i - 1],i*w + w/2,h*0.98);
    text("Original",w/2,h*0.98);
  }
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
  }
}

function mouseDragged() {
  if (currentlyDrawing) {
    if (mouseOnCanvas()) {
      resetTimer();
      stroke(255);
      strokeWeight(penWidth*w/resolution);
      line(mouseX,mouseY,pmouseX,pmouseY);
      lines.push([mouseX,mouseY,pmouseX,pmouseY]);
    }
  }
}

function mouseReleased() {
  if (currentlyDrawing) startTimer();
}

const mouseOnCanvas = function() {
  return mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= height;
}
