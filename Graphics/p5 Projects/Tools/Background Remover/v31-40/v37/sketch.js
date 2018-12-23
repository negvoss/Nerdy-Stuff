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
var canvasDimension;
var canvasTop;
var canvasLeft;
var heightBuffer = 210;

function preload() {
  transparent_background = loadImage("images/transparent_background.png");
  img = loadImage("images/example.png");
}

function setup() {
  setupCanvas();
  saveHistory(img);
  setupZoomJS();
  setupFileJS();
  setupHistoryJS();
  setupControls();
}

function draw() {
  drawImage();
  if (tool == "Eraser") {
    var coords = getImageCoordsFromMouse(mouseX,mouseY);
    coords.x = floor(coords.x);
    coords.y = floor(coords.y);
    var r = floor(eraserSize.value()/2);
    var y1 = r;
    var maxX = abs(round(r/sqrt(2)));
    for (var x1 = 0; x1 <= maxX; x1++) {
      //x,y 1-8 are coordinates for 8 octants around the circle
      // reflections for other 7 octants based on x,y 1
      var x2  =  y1;
      var y2  =  x1;
      var x3  =  x2;
      var y3  = -y2;
      var x4  =  x1;
      var y4  = -y1;
      var x5  = -x4;
      var y5  =  y4;
      var x6  = -x3;
      var y6  =  y3;
      var x7  = -x2;
      var y7  =  y2;
      var x8  = -x1;
      var y8  =  y1;
      stroke(0);
      strokeWeight(0.8);
      fill(200,150);
      for (var i = y1; i >= y4; i--) {
        rect(
          (coords.x + x1 - imageXToCenter)*zoom + width/2,
          (coords.y + i - imageYToCenter)*zoom + height/2,
          zoom*1, // 1 pixel wide
          zoom*1
        );
      }
      for (var i = y2; i >= y3; i--) {
        rect(
          (coords.x + x2 - imageXToCenter)*zoom + width/2,
          (coords.y + i - imageYToCenter)*zoom + height/2,
          zoom*1, // 1 pixel wide
          zoom*1
        );
      }
      for (var i = y8; i >= y5; i--) {
        rect(
          (coords.x + x8 - imageXToCenter)*zoom + width/2,
          (coords.y + i - imageYToCenter)*zoom + height/2,
          zoom*1, // 1 pixel wide
          zoom*1
        );
      }
      for (var i = y7; i >= y6; i--) {
        rect(
          (coords.x + x7 - imageXToCenter)*zoom + width/2,
          (coords.y + i - imageYToCenter)*zoom + height/2,
          zoom*1, // 1 pixel wide
          zoom*1
        );
      }

      var d0 = abs(pow(x1,2) + pow(y1,2) - pow(r,2));
      var d1 = abs(pow(x1,2) + pow(y1 - 1,2) - pow(r,2));
      if (d1 < d0) y1--;
    }
  }
}

function setupCanvas() {
  canvasLeft = 5;
  canvasDimension = min(windowHeight - heightBuffer,windowWidth - canvasLeft - 10);
  c = createCanvas(canvasDimension,canvasDimension).parent("canvasContainer");
  select("#canvasContainer").elt.style.left = canvasLeft + "px";
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
  var toolbar = select("#toolbar");
  toolbar.elt.style.top = canvasDimension + 5 + "px";
  toolbar.elt.style.left = canvasLeft + "px";
  var fileSelectionPanel = select("#fileSelectionPanel");
  fileSelectionPanel.elt.style.top = canvasDimension + 55 + "px";
  select("#logo").elt.style.top = canvasDimension + 120 + "px";
  tol = select("#tolerance").changed(function() {
    if (Number(tol.value()) > Number(tol.elt.max)) {
      tol.value(tol.elt.max);
    }
    if (Number(tol.value()) < Number(tol.elt.min)) {
      tol.value(tol.elt.min);
    }
  });
  eraserSize = select("#eraserSize").changed(function() {
    if (Number(eraserSize.value()) > Number(eraserSize.elt.max)) {
      eraserSize.value(eraserSize.elt.max);
    }
    if (Number(eraserSize.value()) < Number(eraserSize.elt.min)) {
      eraserSize.value(eraserSize.elt.min);
    }
  });
  var zoomValue = 1.08;
  zoomIn = select("#zoomIn").mousePressed(function() {
    adjustZoom(zoomValue);
  });
  zoomOut = select("#zoomOut").mousePressed(function() {
    adjustZoom(1/zoomValue);
  });
  move = select("#move").mousePressed(function() {
    tool = "Move";
    cursor("cursors/move.cur");
  });
  zoomHome = select("#zoomHome").mousePressed(function() {
    setupZoomJS();
  });
  magicWand = select("#magicWand").mousePressed(function() {
    tool = "Magic Wand";
    cursor("cursors/magic_wand.cur");
  });
  eraser = select("#eraser").mousePressed(function() {
    tool = "Eraser";
    noCursor();
  });
}

function keyPressed() {
  var allowDefault = true;
  if (keyIsDown(17)) { // 17 = CTRL
    if (key == "Z") {
      undo();
      allowDefault = false;
    } else if (key == "Y") {
      redo();
      allowDefault = false;
    } else if (key == "S") {
      saveImage();
      allowDefault = false;
    }
    if (!allowDefault) {
      return false;
    }
  }
}

function drawImage() { // Whether to reset zoom variables or not
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

function windowResized() {
  canvasDimension = min(windowHeight - heightBuffer,windowWidth - canvasLeft - 10);
  resizeCanvas(canvasDimension,canvasDimension);
  select("#canvasContainer").elt.style.left = canvasLeft + "px";
  select("#toolbar").elt.style.top = canvasDimension + 5 + "px";
  select("#fileSelectionPanel").elt.style.top = canvasDimension + 55 + "px";
  setupZoomJS();
}
