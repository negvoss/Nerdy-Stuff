var zoom = 1;
var imageXToCenter;
var imageYToCenter;
var graphImageUpperLeftX = 0;
var graphImageUpperLeftY = 0;

function setupZoomJS() {
  imageXToCenter = img.width/2;
  imageYToCenter = img.height/2;
  zoom = canvasDimension/max(img.width,img.height);
}

function adjustZoom(amount) {
  zoom += amount;
  if (zoom <= 0.000001) {
    zoom = 0.000001;
  }
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
  graphImageUpperLeftX = width/2-imageXToCenter*zoom;
  graphImageUpperLeftY = height/2-imageYToCenter*zoom;
}

function getImageCoordsFromMouse(mX,mY) {
  var imageX = (mX - width/2)/zoom + imageXToCenter;
  var imageY = (mY - height/2)/zoom + imageYToCenter;
  return({x:imageX,y:imageY});
}
