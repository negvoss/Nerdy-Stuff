var img;
var imgCopy;

var s;
var b;

function preload() {
  img = loadImage("img.jpg");
  imgCopy = loadImage("img.jpg");
}

function setup() {
  s = createSlider(5,40,25);
  b = createButton("Save Image");
  b.mousePressed(saveImg);
  img.loadPixels();
  createCanvas(windowWidth,windowHeight);
}

function draw() {
  background(255);
  image(imgCopy,0,0);
  image(img,img.width,0);
}

function saveImg() {
  noLoop();
  img.save("crop","png");
}

function mouseDragged() {
  removeBackground();
}

function mousePressed() {
  removeBackground();
}


function removeBackground() {
  if (mouseX >= 0 && mouseX <= img.width && mouseY >= 0 && mouseY <= img.height) {
    var c = get(mouseX,mouseY);

    var r_min = c[0] - s.value();
    var r_max = c[0] + s.value();

    var g_min = c[1] - s.value();
    var g_max = c[1] + s.value();

    var b_min = c[2] - s.value();
    var b_max = c[2] + s.value();


    for (var i = 0; i < img.pixels.length; i += 4) {
      if (img.pixels[i] >= r_min && img.pixels[i] <= r_max) {
        if (img.pixels[i + 1] >= g_min && img.pixels[i + 1] <= g_max) {
          if (img.pixels[i + 2] >= b_min && img.pixels[i + 2] <= b_max) {
            img.pixels[i + 3] = 0;
          }
        }
      }
    }
    img.updatePixels();
    background(255);
    image(imgCopy,0,0);
    image(img,img.width,0);

    fill(255,50,0);
    ellipse(mouseX,mouseY,20);
    ellipse(mouseX + img.width,mouseY,20);
  }
}
