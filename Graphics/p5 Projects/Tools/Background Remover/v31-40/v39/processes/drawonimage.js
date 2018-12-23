function eraseImage() {
  var coords = getImageCoordsFromMouse(mouseX,mouseY);
  coords.x = floor(coords.x);
  coords.y = floor(coords.y);
  var r = floor(eraserSize.value()/2);
  var y1 = r;
  var maxX = abs(round(r/sqrt(2)));
  for (var x1 = 0; x1 <= maxX; x1++) {
    //x,y 1-8 are coordinates for 8 octants around the circle
    // reflections for other 7 octants based on x,y 1
    var x2  =  y1;
    var y2  =  x1;
    var x3  =  x2;
    var y3  = -y2;
    var x4  =  x1;
    var y4  = -y1;
    var x5  = -x4;
    var y5  =  y4;
    var x6  = -x3;
    var y6  =  y3;
    var x7  = -x2;
    var y7  =  y2;
    var x8  = -x1;
    var y8  =  y1;
    for (var i = y1; i >= y4; i--) {
      if (overImage(coords.x + x1,coords.y + i)) {
        setPixel(coords.x + x1,coords.y + i,color(0,0,0,0));
      }
    }
    for (var i = y2; i >= y3; i--) {
      if (overImage(coords.x + x2,coords.y + i)) {
        setPixel(coords.x + x2,coords.y + i,color(0,0,0,0));
      }
    }
    for (var i = y8; i >= y5; i--) {
      if (overImage(coords.x + x8,coords.y + i)) {
        setPixel(coords.x + x8,coords.y + i,color(0,0,0,0));
      }
    }
    for (var i = y7; i >= y6; i--) {
      if (overImage(coords.x + x7,coords.y + i)) {
        setPixel(coords.x + x7,coords.y + i,color(0,0,0,0));
      }
    }

    var d0 = abs(pow(x1,2) + pow(y1,2) - pow(r,2));
    var d1 = abs(pow(x1,2) + pow(y1 - 1,2) - pow(r,2));
    if (d1 < d0) y1--;
  }
  img.updatePixels();
}
