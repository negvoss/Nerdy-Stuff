var c;
var img; // current image
var transparent_background;
var tol;
var brushSize;
var toolSwapper;
var colorPicker;
var tool = "Magic Wand";// starting tool
var clicked_pixel;

var canvasDimension = 400;

function preload() {
  transparent_background = loadImage("images/transparent_background.jpg");
  img = loadImage("images/example.png");
}

function setup() {
  setupCanvas();
  saveHistory(img);
  drawImage(true);
  setupFileJS();
  setupHistoryJS();
  setupControls();
}

function setupCanvas() {
  c = createCanvas(canvasDimension,canvasDimension).parent("canvasContainer");
  c.elt.style.border = "solid";
  c.elt.style.borderWidth = "3px";
  c.elt.style.cursor = 'url("cursors/magic_wand.cur"), auto';
  c.elt.addEventListener(
    'mousedown', function(e) {
      e.preventDefault();
    },
    false
  );
}

function setupControls() {
  tol = select("#tolerance");
  brushSize = select("#brushSize");
  toolSwapper = select("#toolSwapper");
  toolSwapper.changed(swapTool);
  colorPicker = select("#colorPicker");
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

function drawImage(reset) { // Whether to reset zoom variables or not
  if (reset) {
    setupZoomJS();
  }
  background(transparent_background);
  graphImageUpperLeftX = width/2-imageXToCenter*zoom;
  graphImageUpperLeftY = height/2-imageYToCenter*zoom;
  constrainImageCenter();
  image(
    img,
    graphImageUpperLeftX,
    graphImageUpperLeftY,
    img.width*zoom,
    img.height*zoom
  );
}

function swapTool() {
  tool = toolSwapper.value();
  switch(tool) {
    case "Magic Wand":
      c.elt.style.cursor = 'url("cursors/magic_wand.cur"), auto';
      break;
    case "Eraser":
      c.elt.style.cursor = 'url("cursors/eraser.cur"), auto';
      break;
    case "Brush":
      c.elt.style.cursor = 'url("cursors/brush.cur"), auto';
      break;
    case "Zoom In":
      c.elt.style.cursor = 'url("cursors/zoom_in.cur"), auto';
      break;
    case "Zoom Out":
      c.elt.style.cursor = 'url("cursors/zoom_out.cur"), auto';
      break;
  }
}

function mousePressed() {
  if (img) {
    var canvasCoords = {x:mouseX,y:mouseY};
    var imageCoords = getImageCoordsFromMouse(canvasCoords.x,canvasCoords.y);
    var x = round(imageCoords.x);
    var y = round(imageCoords.y);
    if (overImage(x,y) && overCanvas(canvasCoords.x,canvasCoords.y)) {
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
        resetImageCenter(x,y);
        adjustZoom(+0.1);
      }
      if (tool == "Zoom Out") {
        resetImageCenter(x,y);
        adjustZoom(-0.1);
      }
      drawImage(false);
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
      drawImage(false);
    }
  }
}

function mouseReleased() {
  if (img) {
    if (overImage(mouseX,mouseY)) {
      if (tool == "Magic Wand" || tool == "Eraser" || tool == "Brush") {
        saveHistory(img);
      }
    }
  }
}
