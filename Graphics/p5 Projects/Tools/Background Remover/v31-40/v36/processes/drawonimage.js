function eraseImage() {
  var coords = getImageCoordsFromMouse(mouseX,mouseY);
  coords.x = floor(coords.x);
  coords.y = floor(coords.y);
  var r = floor(eraserSize.value()/2);
  var minX = coords.x - r;
  var maxX = coords.x + r;
  for (var x = minX; x <= maxX; x++) {
    var minY = floor(coords.y - sqrt(pow(r,2) - pow((x - coords.x),2)));
    var maxY = ceil(coords.y + sqrt(pow(r,2) - pow((x - coords.x),2)));
    for (var y = minY; y <= maxY; y++) {
      if (overImage(x,y)) {
        setPixel(x,y,color(0,0,0,0));
      }
    }
  }
  img.updatePixels();
}
