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

function getImageCoordsFromMouse(mX,mY) {
  var imageX = (mX - width/2)/zoom + imageXToCenter;
  var imageY = (mY - height/2)/zoom + imageYToCenter;
  return({x:imageX,y:imageY});
}
