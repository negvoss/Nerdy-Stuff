function eraseImage() {
  var coords = getImageCoordsFromMouse(mouseX,mouseY);
  var x = floor(coords.x);
  var y = floor(coords.y);
  var min = floor(-eraserSize.value()/(2*zoom));
  var max = floor(eraserSize.value()/(2*zoom));
  for (var i = min; i <= max; i++) {
    for (var j = min; j <= max; j++) {
      var currentX = x + i;
      var currentY = y + j;
      if (overImage(currentX,currentY) && dist(currentX,currentY,x,y) <= max) {
        setPixel(currentX,currentY,color(0,0,0,0));
      }
    }
  }
  img.updatePixels();
}
