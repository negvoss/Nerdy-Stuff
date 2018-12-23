var c;
var img; // current image
var transparent_background;
var tol;
var eraserSize;
var zoomIn;
var zoomOut;
var move;
var zoomHome;
var magicWand;
var eraser;
var tool = "Magic Wand"; // starting tool
var clicked_pixel;
var canvasDimension = 400;

function preload() {
  transparent_background = loadImage("images/transparent_background.png");
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
  select("#tolValue").html("Tolerance:" + tol.value());
  tol.input(function() {
    select("#tolValue").html("Tolerance:" + tol.value());
  });
  eraserSize = select("#eraserSize");
  select("#eraserSizeValue").html("Eraser Size:" + eraserSize.value() + "px");
  eraserSize.input(function() {
    select("#eraserSizeValue").html("Eraser Size:" + eraserSize.value() + "px");
  });
  var zoomValue = 1.08;
  zoomIn = select("#zoomIn").mousePressed(function() {
    adjustZoom(zoomValue);
    drawImage(false);
  });
  zoomOut = select("#zoomOut").mousePressed(function() {
    adjustZoom(1/zoomValue);
    drawImage(false);
  });
  move = select("#move").mousePressed(function() {
    tool = "Move";
    cursor("cursors/move.cur");
  });
  zoomHome = select("#zoomHome").mousePressed(function() {
    drawImage(true);
  });
  magicWand = select("#magicWand").mousePressed(function() {
    tool = "Magic Wand";
    cursor("cursors/magic_wand.cur");
  });
  eraser = select("#eraser").mousePressed(function() {
    tool = "Eraser";
    cursor("cursors/eraser.cur");
  });
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
  canvasImageUpperLeftX = width/2-imageXToCenter*zoom;
  canvasImageUpperLeftY = height/2-imageYToCenter*zoom;
  image(
    img,
    canvasImageUpperLeftX,
    canvasImageUpperLeftY,
    img.width*zoom,
    img.height*zoom
  );
  stroke(0,255,0);
  strokeWeight(4);
  noFill();
  rect(
    canvasImageUpperLeftX,
    canvasImageUpperLeftY,
    img.width*zoom,
    img.height*zoom
  );
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
        eraseImage();
      }
      drawImage(false);
    }
  }
}

function mouseDragged() {
  var canvasCoords = {x:mouseX,y:mouseY};
  var imageCoords = getImageCoordsFromMouse(canvasCoords.x,canvasCoords.y);
  var x = round(imageCoords.x);
  var y = round(imageCoords.y);
  if (overCanvas(canvasCoords.x,canvasCoords.y)) {
    if (overImage(x,y)) {
      if (tool == "Eraser") {
        eraseImage();
      }
    }
    if (tool == "Move") {
      imageXToCenter += (pmouseX - mouseX)/zoom;
      imageYToCenter += (pmouseY - mouseY)/zoom;
    }
    drawImage(false);
  }
}

function mouseReleased() {
  var canvasCoords = {x:mouseX,y:mouseY};
  var imageCoords = getImageCoordsFromMouse(canvasCoords.x,canvasCoords.y);
  var x = round(imageCoords.x);
  var y = round(imageCoords.y);
  if (overImage(x,y) && overCanvas(canvasCoords.x,canvasCoords.y)) {
    if (tool == "Magic Wand" || tool == "Eraser") {
      saveHistory(img);
    }
  }
}
