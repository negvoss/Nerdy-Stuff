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
    var minX = coords.x - r;
    var maxX = coords.x + r;
    fill(200,100);
    stroke(50,200);
    for (var x = minX; x <= maxX; x++) {
      var minY = floor(coords.y - sqrt(pow(r,2) - pow((x - coords.x),2)));
      var maxY = ceil(coords.y + sqrt(pow(r,2) - pow((x - coords.x),2)));
      for (var y = minY; y <= maxY; y++) {
        if (overImage(x,y)) {
          rect(
            floor((x - imageXToCenter)*zoom + width/2),
            floor((y - imageYToCenter)*zoom + height/2),
            floor(1*zoom), // 1 image pixel wide
            floor(1*zoom)
          );
        }
      }
    }
  }
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
  eraserSize = select("#eraserSize");
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
