var img;
var s;
var b;

var rectScale = 10;

function preload() {
  img = loadImage("img.jpg");
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
    if (mouseX >= 0 && mouseX <= img.width && mouseY >= 0 && mouseY <= img.height) {
      var index = 4*(mouseY*img.width + mouseX);
      var clicked_pixel = {
        values:[
          img.pixels[index],
          img.pixels[index + 1],
          img.pixels[index + 2],
          img.pixels[index + 3]
        ],
        x:mouseX,
        y:mouseY
      }
      floodFill(clicked_pixel,clicked_pixel);
    }
  }
}

function floodFill(clicked_pixel,pixelToCheck) {
  if (!(pixelToCheck.x >= 0 && pixelToCheck.x <= img.width && pixelToCheck.y >= 0 && pixelToCheck.y <= img.height)) return;
  if (pixelToCheck.values[3] == 0) return;
  if (!inRange(clicked_pixel,pixelToCheck)) return;
  var index = 4*(pixelToCheck.y*img.width + pixelToCheck.x) + 3;
  img.pixels[index] = 0;
  img.updatePixels();

  var counter = 0;
  var x;
  var y;
  while (counter < 4) {
    switch(counter) {
      case 0:
        x = pixelToCheck.x;
        y = pixelToCheck.y - 1;
        break;
      case 1:
        x = pixelToCheck.x + 1;
        y = pixelToCheck.y;
        break;
      case 2:
        x = pixelToCheck.x;
        y = pixelToCheck.y + 1;
        break;
      case 3:
        x = pixelToCheck.x - 1;
        y = pixelToCheck.y;
        break;
    }
    if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
      var index = 4*(y*img.width + x);
      var newPixel = {
        values:[
          img.pixels[index],
          img.pixels[index + 1],
          img.pixels[index + 2],
          img.pixels[index + 3]
        ],
        x:x,
        y:y
      }
      floodFill(clicked_pixel,newPixel);
    }
    counter++;
  }
}

function inRange(pixel1,pixel2) {
  var tolerance = s.value();
  return (
    abs(pixel2.values[0] - pixel1.values[0]) <= tolerance
    &&
    abs(pixel2.values[1] - pixel1.values[1]) <= tolerance
    &&
    abs(pixel2.values[2] - pixel1.values[2]) <= tolerance
  );
}



// For fireFox

/*

var f;
in setup:
f = createFileInput(loadImg);

function setupAfterLoad() {
  resizeCanvas(img.width,img.height);
  img.loadPixels();
}

function loadImg(file) {
  img = loadImage(f.value(),setupAfterLoad);
}

Note: Remember to check if image is undefined when using it.

*/
