var floodFillPoints = [];
var performingFloodFill = false;

function floodFill(x,y,colors) {
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
        floodFill(x,y - 1,colors);
        floodFill(x,y + 1,colors);
      }
      x += i;
    }
  }

  for (var i = -1; i <= 1; i += 2) {
    var x = pixelToCheck.x;
    var y = pixelToCheck.y + i;
    if (overImage(x,y)) {
      floodFill(x,y,colors);
    }
  }

  function inRange(x,y) {
    if (!overImage(x,y)) return false;
    var p = getPixel(x,y);
    var buffer = tolerance.value;
    var inArray = false;
    for (var i = 0; i < colors.length; i++) {
      if (
        abs(colors[i][0] - p.values[0]) <= buffer &&
        abs(colors[i][1] - p.values[1]) <= buffer &&
        abs(colors[i][2] - p.values[2]) <= buffer
      ) {
        return true;
      }
    }
    return false;
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

function floodFillStart() {
  performingFloodFill = true;
}

function floodFillEnd() {
  var colors = getColorsFromPoints(floodFillPoints);
  for (var i = 0; i < floodFillPoints.length; i++) {
    if (getPixel(floodFillPoints[i].x,floodFillPoints[i].y).values[3] != 0) {
      floodFill(floodFillPoints[i].x,floodFillPoints[i].y,colors);
      break;
    }
  }
  floodFillPoints = [];
  performingFloodFill = false;
}

function getMinMaxes(points) {
  var rMin = 255;
  var rMax = 0;
  var gMin = 255;
  var gMax = 0;
  var bMin = 255;
  var bMax = 0;
  for (var i = 0; i < points.length; i++) {
    var currentPoint = getPixel(points[i].x,points[i].y).values;
    if (currentPoint[3] != 0) {
      if (currentPoint[0] < rMin) rMin = currentPoint[0];
      if (currentPoint[0] > rMax) rMax = currentPoint[0];
      if (currentPoint[1] < gMin) gMin = currentPoint[1];
      if (currentPoint[1] > gMax) gMax = currentPoint[1];
      if (currentPoint[2] < bMin) bMin = currentPoint[2];
      if (currentPoint[2] > bMax) bMax = currentPoint[2];
    }
  }
  return({rMin:rMin,rMax:rMax,gMin:gMin,gMax:gMax,bMin:bMin,bMax:bMax});
}

function getColorsFromPoints(points) {
  var colors = [];
  for (var i = 0; i < points.length; i++) {
    colors.push(getPixel(points[i].x,points[i].y).values);
  }
  return colors;
}
