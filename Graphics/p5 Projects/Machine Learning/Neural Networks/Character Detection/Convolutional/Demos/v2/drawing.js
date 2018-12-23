const penWidth = 1;
let lines = [];
let currentlyDrawing;

const setupDrawingJS = function() {
  let c = createCanvas(windowHeight - 6,windowHeight - 6);
  c.elt.hidden = true;
  c.position(0,0);
  c.parent("#canvasContainer");
  c.elt.style.border = "solid";
  c.elt.style.borderColor = "red";
  let result = select("#result");
  result.position(width - 110 + (windowWidth - width)/2,0);
  background(0);
  noSmooth();
  let resultText = select("#resultText");
  resultText.position(width - 110 + (windowWidth - width)/2,windowHeight/2 - 250);
}

function draw() {
  frmRt = frameRate();
  updateTimer();
  if (currentlyTraining) {
    train();
  }
}

function mousePressed() {
  if (mouseOnCanvas()) {
    if (!timing) {
      background(0);
      lines = [];
      select("#resultText").html("");
    }
    currentlyDrawing = true;
    resetTimer();
    fill(255);
    noStroke();
    ellipse(mouseX,mouseY,penWidth*width/resolution);
    lines.push([mouseX,mouseY,mouseX,mouseY]);
  }
}

function mouseDragged() {
  if (currentlyDrawing) {
    if (mouseOnCanvas()) {
      resetTimer();
      stroke(255);
      strokeWeight(penWidth*width/resolution);
      line(mouseX,mouseY,pmouseX,pmouseY);
      lines.push([mouseX,mouseY,pmouseX,pmouseY]);
    }
  }
}

function mouseReleased() {
  if (currentlyDrawing) startTimer();
}

const mouseOnCanvas = function() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}
