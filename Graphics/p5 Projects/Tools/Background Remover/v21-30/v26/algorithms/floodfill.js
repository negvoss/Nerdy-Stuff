function floodFill(x,y) {
  if (!overImage(x,y)) return;
  if (!inRange(x,y)) return;
  var pixelToCheck = getPixel(x,y);
  if (pixelToCheck.values[3] == 0) return;
  setPixel(x,y,color(0,0,0,0));

  for (var i = -1; i <= 1; i += 2) {
    var x = pixelToCheck.x + i;
    var y = pixelToCheck.y;
    while (inRange(x,y)) {
      setPixel(x,y,color(0,0,0,0));
      if (!scanAhead(x,y,i)) {
        floodFill(x,y - 1);
        floodFill(x,y + 1);
      }
      x += i;
    }
  }

  for (var i = -1; i <= 1; i += 2) {
    var x = pixelToCheck.x;
    var y = pixelToCheck.y + i;
    if (overImage(x,y)) {
      floodFill(x,y);
    }
  }

  function inRange(x,y) {
    if (!overImage(x,y)) return false;
    var p = getPixel(x,y);

    var tolerance = tol.value();
    return (
      abs(p.values[0] - clicked_pixel.values[0]) <= tolerance &&
      abs(p.values[1] - clicked_pixel.values[1]) <= tolerance &&
      abs(p.values[2] - clicked_pixel.values[2]) <= tolerance
    );
  }

  function scanAhead(x,y,dir) {
    return (
      inRange(x + dir,y    ) &&
      inRange(x + dir,y - 1) &&
      inRange(x + dir,y + 1) &&
      overImage(x,y - 1) &&
      overImage(x,y + 1)
    );
  }
}
