var c;
var img; // current image
var transparent_background;
var tol;
var brushSize;
var toolSwapper;
var colorPicker;
var tool = "Magic Wand";// starting tool
var clicked_pixel;

function preload() {
  transparent_background = loadImage("images/transparent_background.jpg");
  img = loadImage("images/example.png");
}

function setup() {
  saveHistory(img);
  setupCanvas();
  setupZoomJS();
  setupFileJS();
  setupHistoryJS();
  setupControls();
}

function setupCanvas() {
  c = createCanvas(img.width,img.height).parent("canvasContainer");
  c.elt.style.border = "solid";
  c.elt.style.borderWidth = "3px";
  c.elt.style.cursor = 'url("cursors/magic_wand.cur"), auto';
  c.elt.addEventListener(
    'mousedown', function(e) {
      e.preventDefault();
    },
    false
  );
  drawImage(true);
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
    zoom = 1;
    xoff = width/2;
    yoff = height/2;
  }
  background(transparent_background); // todo: use createImage with rectangles to create a custom size.
  image(
    img,0,0,img.width,img.height,
    round(-img.width*zoom/2 + xoff),
    round(-img.height*zoom/2 + yoff),
    round(img.width*zoom),
    round(img.height*zoom)
  );
}

function swapTool() {
  tool = toolSwapper.value();
  switch(toolSwapper.value()) {
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
      if (tool == "Magic Wand" || tool == "Eraser" || tool == "Brush") {
        saveHistory(img);
      }
    }
  }
}
