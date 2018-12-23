function drawOnImage(mode) {
  var x;
  var y;
  var min = round(-brushSize.value()/2);
  var max = round(brushSize.value()/2);
  for (var i = min; i <= max; i++) {
    for (var j = min; j <= max; j++) {
      x = getMouseImageX() + i;
      y = getMouseImageY() + j;
      if (overImage(x,y) && dist(x,y,getMouseImageX(),getMouseImageY()) <= max) {
        if (mode == "erase") {
          setPixel(x,y,color(0,0,0,0));
        }
        if (mode == "draw") {
          setPixel(x,y,color(colorPicker.value()));
        }
      }
    }
  }
  img.updatePixels();
  drawImage(false);
}
