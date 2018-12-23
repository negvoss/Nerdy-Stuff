var zoom = 1;
var xoff;
var yoff;

function setupZoomJS() {
  xoff = width/2;
  yoff = height/2;
}

function adjustZoom(amount) {
  zoom += amount;
  if (zoom >= 1) {
    zoom = 1;
  }
  if (zoom <= 0.1) {
    zoom = 0.1;
  }
  xoff = getMouseImageX();
  yoff = getMouseImageY();
  if (xoff > img.width*(1 - (zoom/2))) xoff = img.width*(1 - (zoom/2));
  if (yoff > img.height*(1 - (zoom/2))) yoff = img.height*(1 - (zoom/2));
  if (xoff < img.width*(zoom/2)) xoff = img.width*(zoom/2);
  if (yoff < img.height*(zoom/2)) yoff = img.height*(zoom/2);
  drawImage(false);
}

function getMouseImageX() {
  return floor(xoff + ((mouseX - width/2)/width)*img.width*zoom);
}

function getMouseImageY() {
  return floor(yoff + ((mouseY - height/2)/height)*img.height*zoom);
}
