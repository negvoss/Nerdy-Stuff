var brushCol;
var brushSize;
var swatches = [];
var swatchWidth = 30;
var initColors;
var addSwatch;
var rInput;
var gInput;
var bInput;
var maxHeight = swatchWidth + 10;



function setup() {
  createCanvas(window.displayWidth,window.innerHeight - 29);

  brushCol = color(0,0,0);
  brushSize = createSlider(1,70,30);

  rInput = createInput();
  gInput = createInput();
  bInput = createInput();


  addSwatch = createButton("ADD SWATCH");
  addSwatch.mousePressed(newSwatch);
  initColors = [color(255,255,255),color(0,0,0),color(255,0,0),color(255,120,30),color(255,255,0),color(0,255,0),color(0,0,255),color(190,30,150)];

  for (var i = 0; i < initColors.length; i++) {
    if (swatches.length > 0) {
      swatches.push(new Swatch(swatches[swatches.length - 1].x + swatchWidth,swatches[swatches.length - 1].y,initColors[i]));
    } else {
      swatches.push(new Swatch(swatches.length*swatchWidth,0,initColors[i]));
    }
  }


}

function draw() {
  noStroke();
  fill(brushCol);


  if (mouseIsPressed && mouseOnCanvas()) {
    ellipse(mouseX,mouseY,brushSize.value());
  }

  for (var i = 0; i < swatches.length; i++) {
    swatches[i].show();
  }

}


function mouseOnCanvas() {
  return (mouseX > 0 && mouseX < width && mouseY > maxHeight && mouseY < height);
}



function mousePressed() {
  for (var i = 0; i < swatches.length; i++) {
    swatches[i].clicked();
  }
}

function newSwatch() {
  if (swatches.length > 0) {
    swatches.push(new Swatch(swatches[swatches.length - 1].x + swatchWidth,swatches[swatches.length - 1].y,color(rInput.value(),gInput.value(),bInput.value())));
  } else {
    swatches.push(new Swatch(swatches.length*swatchWidth,0,color(rInput.value(),gInput.value(),bInput.value())));
  }
}
