var hist = []; // history of images
var histIndex = -1; // index of history (starts at -1 because there are no images to start)
var img; // current image
var imgToDisplay;
var zoom = 1;
var xoff;
var yoff;

var magic_wand;
var eraser;
var brush;
var zoomIn;
var zoomOut;

var fileSelect;
var dropZone;

var tol;
var brushSize;

var sav;
var undoButton;
var redoButton;

var toolSwapper;

var colorPicker;

var tool = "Magic Wand";// starting tool
var clicked_pixel;
var rectScale = 10;

function preload() {
  img = loadImage("images/example.png");
  magic_wand = loadImage("images/magic_wand.png");
  eraser = loadImage("images/eraser.png");
  brush = loadImage("images/brush.png");
  zoomIn = loadImage("images/zoom_in.png");
  zoomOut = loadImage("images/zoom_out.png");
}

function setup() {
  saveHistory(img);
  createCanvas(img.width,img.height).parent("canvasContainer")
  document.getElementById('defaultCanvas0').style.cursor = 'none';
  xoff = width/2;
  yoff = height/2;

  fileSelect = createFileInput(handleFile).parent("fileInput");
  dropZone = select("#dropZone");
  dropZone.dragOver(highlight);
  dropZone.dragLeave(unhighlight);
  dropZone.drop(dropFile);

  tol = select("#tolerance");
  brushSize = select("#brushSize");

  sav = select("#sav");
  undoButton = select("#undoButton");
  redoButton = select("#redoButton");
  sav.mousePressed(saveImage);
  undoButton.mousePressed(undo);
  redoButton.mousePressed(redo);

  toolSwapper = select("#toolSwapper");
  toolSwapper.changed(swapTool);

  colorPicker = select("#colorPicker");
}

function draw() {
  showBackground();
  imageMode(CORNER);

  imgToDisplay = img.get(
    round(-img.width*zoom/2 + xoff),
    round(-img.height*zoom/2 + yoff),
    round(img.width*zoom),
    round(img.height*zoom)
  );

  if (imgToDisplay) {
    image(imgToDisplay,0,0,img.width,img.height);
  } else {
    image(img,0,0);
  }
  showMouse();
  showFrame();
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

function showMouse() {
  if (overImage(mouseX,mouseY)) {
    imageMode(CENTER);
    if (tool == "Magic Wand") image(magic_wand,mouseX,mouseY,25,25);
    if (tool == "Eraser") image(eraser,mouseX,mouseY,30,30);
    if (tool == "Brush") image(brush,mouseX,mouseY,50,50);
    if (tool == "Zoom In") image(zoomIn,mouseX,mouseY,30,30);
    if (tool == "Zoom Out") image(zoomOut,mouseX,mouseY,30,30);
  }
}

function showFrame() {
  stroke(0);
  noFill();
  rect(0,0,width - 1,height - 1);
}

function keyPressed() {
  if (keyIsDown(17)) { // 17 = CTRL
    if (key == "Z") {
      undo();
    } else if (key == "Y"){
      redo();
    }
  }
}

function undo() {
  if (histIndex > 0) {
    histIndex--;
    img = hist[histIndex].get();
    img.loadPixels();
    if (img.width != width || img.height != height) {
      resizeCanvas(img.width, img.height);
    }
  }
}

function redo() {
  if (histIndex < hist.length - 1) {
    histIndex++;
    img = hist[histIndex].get();
    img.loadPixels();
    if (img.width != width || img.height != height) {
      resizeCanvas(img.width, img.height);
    }
  }
}


function saveImage() {
  img.save("crop","png");
}

function highlight() {
  dropZone.elt.style.backgroundColor = "#666666";
}

function unhighlight() {
  dropZone.elt.style.backgroundColor = "";
}

function dropFile(file) {
  handleFile(file);
  unhighlight();
}

function handleFile(file) {
  img = loadImage(file.data,"Image failed to load properly",function() {
    img.loadPixels();
    resizeCanvas(img.width,img.height);
    saveHistory(img);
  });
}

function swapTool() {
  tool = toolSwapper.value();
}

function mousePressed() {
  if (img) {
    x = getMouseImageX();
    y = getMouseImageY();
    if (overImage(mouseX,mouseY)) {
      clicked_pixel = getPixel(x,y);
      if (tool == "Magic Wand") {
        floodFill(x,y);
        img.updatePixels();
      }
      if (tool == "Eraser") {
        drawOnImage("erase");
      }
      if (tool == "Brush") {
        drawOnImage("draw");
      }
      if (tool == "Zoom In") {
        adjustZoom(-0.1);
      }
      if (tool == "Zoom Out") {
        adjustZoom(0.1);
      }
    }
  }
}

function getMouseImageX() {
  return floor(xoff + ((mouseX - width/2)/width)*img.width*zoom);
}

function getMouseImageY() {
  return floor(yoff + ((mouseY - height/2)/height)*img.height*zoom);
}

function adjustZoom(amount) {
  zoom += amount;
  if (zoom >= 1) {
    zoom = 1;
  }
  if (zoom <= 0.1) {
    zoom = 0.1;
  }
  xoff = getMouseImageX();
  yoff = getMouseImageY();
  if (xoff > img.width*(1 - (zoom/2))) xoff = img.width*(1 - (zoom/2));
  if (yoff > img.height*(1 - (zoom/2))) yoff = img.height*(1 - (zoom/2));
  if (xoff < img.width*(zoom/2)) xoff = img.width*(zoom/2);
  if (yoff < img.height*(zoom/2)) yoff = img.height*(zoom/2);
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

function mouseReleased() {
  if (img) {
    if (overImage(mouseX,mouseY)) {
      saveHistory(img);
    }
  }
}

function saveHistory(img) {
  if (hist.length >= 50) { // max slots in history array
    hist.splice(0,1);
  } else {
    histIndex++;
  }
  hist[histIndex] = img.get();
  hist[histIndex].loadPixels();
  if (histIndex < hist.length) {
    for (var i = histIndex + 1; i < hist.length; i++) {
      hist.splice(i,1);
    }
  }
}

function floodFill(x,y) {
  if (!overImage(x,y)) return;
  if (!inRange(x,y)) return;
  var pixelToCheck = getPixel(x,y);
  if (pixelToCheck.values[3] == 0) return;
  setPixel(x,y,color(0,0,0,0));

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
    if (!overImage(x,y)) return false;
    var p = getPixel(x,y);

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
      x = getMouseImageX() + i;
      y = getMouseImageY() + j;
      if (overImage(x,y) && dist(x,y,getMouseImageX(),getMouseImageY()) <= max) {
        if (mode == "erase") {
          setPixel(x,y,color(0,0,0,0));
        }
        if (mode == "draw") {
          setPixel(x,y,color(colorPicker.value()));
        }
      }
    }
  }
  img.updatePixels();
}

function getPixel(x,y) {
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
  var index = 4*(y*img.width + x);
  img.pixels[index] = col.levels[0];
  img.pixels[index + 1] = col.levels[1];
  img.pixels[index + 2] = col.levels[2];
  img.pixels[index + 3] = col.levels[3];
}

function overImage(x,y) {
  return x >= 0 && x < img.width && y >= 0 && y < img.height;
}
