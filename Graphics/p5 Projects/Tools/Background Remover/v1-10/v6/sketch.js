var img;
var magic_wand;
var eraser;
var brush;

var tol;
var brushSize;

var sav;
var toolSwapper;

var colorPicker;

var tool = "Magic Wand";
var clicked_pixel;
var rectScale = 10;

function preload() {
  img = loadImage("images/img.png");
  magic_wand = loadImage("images/magic_wand.png");
  eraser = loadImage("images/eraser.png");
  brush = loadImage("images/brush.png");
}

function setup() {
  img.loadPixels();
  createCanvas(img.width,img.height).parent("canvasContainer")
  document.getElementById('defaultCanvas0').style.cursor = 'none';

  tol = select("#tolerance");
  brushSize = select("#brushSize");

  toolSwapper = select("#toolSwapper");
  sav = select("#sav");
  toolSwapper.mousePressed(swapTool);
  sav.mousePressed(saveImage);

  colorPicker = select("#colorPicker");
}

function draw() {
  showBackground();
  imageMode(CORNER);
  image(img,0,0);

  if (overImage(mouseX,mouseY)) {
    imageMode(CENTER);
    if (tool == "Magic Wand") image(magic_wand,mouseX,mouseY,25,25);
    if (tool == "Eraser") image(eraser,mouseX,mouseY,30,30);
    if (tool == "Brush") image(brush,mouseX,mouseY,50,50);
  }

  stroke(0);
  noFill();
  rect(0,0,width - 1,height - 1);
}


function saveImage() {
  img.save("crop","png");
}

function swapTool() {
  if (toolSwapper.elt.innerHTML == "Magic Wand") {
    toolSwapper.html("Eraser");
    tool = "Eraser";
  }
   else if (toolSwapper.elt.innerHTML == "Eraser") {
    toolSwapper.html("Brush");
    tool = "Brush";
  }
  else if (toolSwapper.elt.innerHTML == "Brush") {
   toolSwapper.html("Magic Wand");
   tool = "Magic Wand";
 }
}

function showBackground() {
  noStroke();
  for (var i = 0; i < width/rectScale; i++) {
    for (var j = 0; j < height/rectScale; j++) {
      if ((i + j) % 2 == 0) {
        fill(200);
      } else {
        fill(40);
      }
      rect(i*rectScale,j*rectScale,rectScale,rectScale);
    }
  }
}

function mousePressed() {
  if (img) {
    if (overImage(mouseX,mouseY)) {
      clicked_pixel = getPixel(mouseX,mouseY);
      if (tool == "Magic Wand") {
        floodFill(mouseX,mouseY);
      }
      if (tool == "Eraser") {
        drawOnImage("erase");
      }
      if (tool == "Brush") {
        drawOnImage("draw");
      }
    }
  }
}

function mouseDragged() {
  if (img) {
    if (overImage(mouseX,mouseY)) {
      if (tool == "Eraser") {
        drawOnImage("erase");
      }
      if (tool == "Brush") {
        drawOnImage("draw");
      }
    }
  }
}

function floodFill(x,y) {
  var pixelToCheck = getPixel(x,y);

  if (pixelToCheck == null) return;
  if (!overImage(pixelToCheck.x,pixelToCheck.y)) return;
  if (pixelToCheck.values[3] == 0) return;
  if (!inRange(pixelToCheck.x,pixelToCheck.y)) return;
  setPixel(pixelToCheck.x,pixelToCheck.y,color(0,0,0,0));

  for (var i = -1; i <= 1; i += 2) {
    var x = pixelToCheck.x + i;
    var y = pixelToCheck.y;
    while (inRange(x,y)) {
      setPixel(x,y,color(0,0,0,0));
      if (!scanAhead(x,y,i)) {
        floodFill(x,y - 1);
        floodFill(x,y + 1);
      }
      x += i;
    }
  }

  for (var i = -1; i <= 1; i += 2) {
    var x = pixelToCheck.x;
    var y = pixelToCheck.y + i;
    if (overImage(x,y)) {
      floodFill(x,y);
    }
  }

  function inRange(x,y) {
    var p = getPixel(x,y);
    if (p == null) return false;

    var tolerance = tol.value();
    return (
      abs(p.values[0] - clicked_pixel.values[0]) <= tolerance &&
      abs(p.values[1] - clicked_pixel.values[1]) <= tolerance &&
      abs(p.values[2] - clicked_pixel.values[2]) <= tolerance
    );
  }

  function scanAhead(x,y,dir) {
    return (
      inRange(x + dir,y    ) &&
      inRange(x + dir,y - 1) &&
      inRange(x + dir,y + 1) &&
      overImage(x,y - 1) &&
      overImage(x,y + 1)
    );
  }
}

function drawOnImage(mode) {
  var x;
  var y;
  var min = round(-brushSize.value()/2);
  var max = round(brushSize.value()/2);
  for (var i = min; i <= max; i++) {
    for (var j = min; j <= max; j++) {
      x = mouseX + i;
      y = mouseY + j;
      if (overImage(x,y) && dist(x,y,mouseX,mouseY) <= max) {
        if (mode == "erase") {
          setPixel(x,y,color(0,0,0,0));
        }
        if (mode == "draw") {
          setPixel(x,y,color(colorPicker.value()));
        }
      }
    }
  }
}

function getPixel(x,y) {
  if (!overImage(x,y)) return null;
  var index = 4*(y*img.width + x);
  var targetPixel = {
    values:[
      img.pixels[index],
      img.pixels[index + 1],
      img.pixels[index + 2],
      img.pixels[index + 3]
    ],
    x:x,
    y:y
  }
  return targetPixel;
}

function setPixel(x,y,col) {
  if (!overImage(x,y)) return null;
  var index = 4*(y*img.width + x);
  img.pixels[index] = col._getRed();
  img.pixels[index + 1] = col._getGreen();
  img.pixels[index + 2] = col._getBlue();
  img.pixels[index + 3] = col._getAlpha();
  img.updatePixels();
}

function overImage(x,y) {
  return x >= 0 && x < img.width && y >= 0 && y < img.height;
}
