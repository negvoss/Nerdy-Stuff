var img;
var s;
var b;

var rectScale = 10;

function preload() {
  img = loadImage("img.png");
}

function setup() {
  img.loadPixels();
  createCanvas(img.width,img.height);
  s = createSlider(0,100,50);
  b = createButton("Save Image");
  b.mousePressed(saveImage);
}

function draw() {
  showBackground();
  image(img,0,0);
}


function saveImage() {
  img.save("crop","png");
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
      floodFill(getPixel(mouseX,mouseY),getPixel(mouseX,mouseY));
    }
  }
}

function floodFill(clicked_pixel,pixelToCheck) {
  if (pixelToCheck == null) return;
  if (!overImage(pixelToCheck.x,pixelToCheck.y)) return;
  if (pixelToCheck.values[3] == 0) return;
  if (!inRange(clicked_pixel,pixelToCheck)) return;
  setPixel(pixelToCheck.x,pixelToCheck.y,color(0,0,0,0));

  for (var i = -1; i <= 1; i += 2) {
    var looped = false;
    var x = pixelToCheck.x + i;
    var y = pixelToCheck.y;
    while (inRange(clicked_pixel,getPixel(x,y))) {
     setPixel(x,y,color(0,0,0,0));
     x += i;
     looped = true;
    }
    if (looped) {
      floodFill(clicked_pixel,getPixel(x - i,y - 1));
      floodFill(clicked_pixel,getPixel(x - i,y + 1));
    }
  }

  for (var i = -1; i <= 1; i += 2) {
    var x = pixelToCheck.x; // Todo: Instead of pixelToCheck, use pixel in vertical line of clicked pixel
    var y = pixelToCheck.y + i;
    if (overImage(x,y)) {
      floodFill(clicked_pixel,getPixel(x,y));
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

function inRange(pixel1,pixel2) {
  if (pixel1 == null) return false;
  if (pixel2 == null) return false;

  var tolerance = s.value();
  return (
    abs(pixel2.values[0] - pixel1.values[0]) <= tolerance &&
    abs(pixel2.values[1] - pixel1.values[1]) <= tolerance &&
    abs(pixel2.values[2] - pixel1.values[2]) <= tolerance
  );
}

function overImage(x,y) {
  return x >= 0 && x < img.width && y >= 0 && y < img.height;
}
