var img;
var zoom = 1;
var imageXToCenter;
var imageYToCenter;
var graphImageUpperLeftX = 0;
var graphImageUpperLeftY = 0;

var canvasDimension = 400;

function preload() {
  img = loadImage("explosion.jpg");
}

function setup() {
  var c = createCanvas(canvasDimension,canvasDimension);
  c.elt.style.border = "solid";
  zoom = canvasDimension/max(img.width,img.height);
  imageXToCenter = img.width/2;
  imageYToCenter = img.height/2;
}

function draw() {
  background(255);
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

function constrainImageCenter() {
  if (img.width*zoom < width) {
    imageXToCenter = img.width/2;
  } else {
    imageXToCenter = max(imageXToCenter,(width/2)/zoom);
    imageXToCenter = min(imageXToCenter,img.width-(width/2)/zoom);
  }
  if (img.height*zoom < height) {
    imageYToCenter = img.height/2;
  } else {
    imageYToCenter = max(imageYToCenter,(height/2)/zoom);
    imageYToCenter = min(imageYToCenter,img.height-(height/2)/zoom);
  }
}

function getImageCoordsFromMouse(mX,mY) {
  var imageX = (mX - width/2)/zoom + imageXToCenter;
  var imageY = (mY - height/2)/zoom + imageYToCenter;
  return({x:imageX,y:imageY});
}

function mousePressed() {
  if (mouseButton == LEFT) {
    console.log(getImageCoordsFromMouse(mouseX,mouseY));
    // if (keyIsDown(17)) {
    //   zoom -= 0.1;
    // } else {
    //   zoom += 0.1;
    // }
    // xoff += ((mouseX-width/2)/width)*img.width*zoom;
    // yoff += ((mouseY-height/2)/height)*img.height*zoom;
  }
}
