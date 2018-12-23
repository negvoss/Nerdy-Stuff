function eraseImage() {
  var coords = getImageCoordsFromMouse(mouseX,mouseY);
  var r = eraserSize.value()/(2*zoom)
  var minX = floor(coords.x - r);
  var maxX = floor(coords.x + r);
  for (var x = minX; x <= maxX; x++) {

    var minY = floor(coords.y - sqrt(pow(r,2) - pow((x - coords.x),2)));
    var maxY = floor(coords.y + sqrt(pow(r,2) - pow((x - coords.x),2)));
    for (var y = minY; y <= maxY; y++) {
      if (overImage(x,y)) {
        setPixel(x,y,color(0,0,0,0));
      }
    }
  }
  img.updatePixels();
}
