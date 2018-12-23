function drawOnImage(mode) {
  var coords = getImageCoordsFromMouse(mouseX,mouseY);
  var x = round(coords.x);
  var y = round(coords.y);
  var min = round(-brushSize.value()/2);
  var max = round(brushSize.value()/2);
  for (var i = min; i <= max; i++) {
    for (var j = min; j <= max; j++) {
      var currentX = x + i;
      var currentY = y + j;
      if (overImage(currentX,currentY) && dist(currentX,currentY,x,y) <= max) {
        if (mode == "erase") {
          setPixel(currentX,currentY,color(0,0,0,0));
        }
        if (mode == "draw") {
          setPixel(currentX,currentY,color(colorPicker.value()));
        }
      }
    }
  }
  img.updatePixels();
}
