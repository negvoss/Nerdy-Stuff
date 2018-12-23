let img; // current original image
let convolvedImages = []; // array of current convolved images

const updateImage = function() {
  background(0);
  drawLines(lines);
  img = get(0,0,w,h);
  img.resize(resolution,resolution);
  img.loadPixels();
  image(img,0,0,w,h);
}

const convolve = function(filter) {
  const filterSize = sqrt(filter.length);
  const convolved = createImage(resolution,resolution);
  convolved.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) { // sliding filter
    let sum = 0;
    const xCenter = (i/4)%resolution; // coordinates of current center of filter
    const yCenter = (i/4 - xCenter)/resolution;
    for (let j = 0; j < filter.length; j++) {
      const xOff = j%filterSize - floor(filterSize/2); // current offsets in filter
      const yOff = floor(j/filterSize) - floor(filterSize/2);
      const xCurrent = xCenter + xOff; // coordinates of pixel to multiply by filter
      const yCurrent = yCenter + yOff;
      const pixelIndex = (xCurrent + yCurrent*resolution)*4; // index of pixels array to multiply by filter
      if (xCurrent >= 0 && xCurrent < resolution && yCurrent >= 0 && yCurrent < resolution) {
        sum += (img.pixels[pixelIndex])*filter[j];
      } // otherwise, add nothing
    }
    convolved.pixels[i] = min(max(sum,0),255);
    convolved.pixels[i + 1] = convolved.pixels[i]; // copies for grayscale
    convolved.pixels[i + 2] = convolved.pixels[i];
    convolved.pixels[i + 3] = 255; // transparency value (no transparency)
  }
  convolved.updatePixels();
  return convolved;
}

const evaluate = function() {
  currentlyDrawing = false;
  updateImage();
  const filtersToUse = [];
  convolvedImages = [];
  for (let i = 0; i < filters.length; i++) {
    if (filterNames.indexOf(filters[i].name) != -1) {
      filtersToUse[filterNames.indexOf(filters[i].name)] = filters[i].filter;
    }
  }
  for (let i = 0; i < filtersToUse.length; i++) {
    let convolved = convolve(filtersToUse[i]);
    convolvedImages.push(convolved);
    image(convolved,w*(i + 1) + 1,0,w,h);
  }
  const input = new Matrix(numI,1);
  for (let i = 0; i < convolvedImages.length; i++) {
    for (let j = 0; j < convolvedImages[i].pixels.length; j += 4) {
      input.matrix[pow(resolution,2)*i + j/4][0] = round(convolvedImages[i].pixels[j]/255);
    }
  }
  const o = nn.feedForward(input);
  o.print();
  let result;
  let max = 0;
  let id;
  for (let i = 0; i < o.rows; i++) {
    if (o.matrix[i][0] > max) {
      max = o.matrix[i][0];
      id = i;
    }
  }
  result = possibleOutputs[id];
  select("#result").html("Result: " + result);
}

const getMinMaxes = function(lines) {
  let minX = w; // resizing to fill full resolution
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i][0] > maxX) maxX = lines[i][0];
    if (lines[i][1] > maxY) maxY = lines[i][1];
    if (lines[i][2] > maxX) maxX = lines[i][2];
    if (lines[i][3] > maxY) maxY = lines[i][3];
    if (lines[i][0] < minX) minX = lines[i][0];
    if (lines[i][1] < minY) minY = lines[i][1];
    if (lines[i][2] < minX) minX = lines[i][2];
    if (lines[i][3] < minY) minY = lines[i][3];
  }
  return [minX,maxX,minY,maxY];
}

const drawLines = function(lines) {
  let [minX,maxX,minY,maxY] = getMinMaxes(lines);
  let scaleFactor;
  let xOffset;
  let yOffset;
  if (maxX - minX == 0 && maxY - minY == 0) {
    scaleFactor = 1;
    xOffset = w/2;
    yOffset = h/2;
  } else if (maxX - minX > maxY - minY) {
    scaleFactor = 0.9*w/(maxX - minX);
    xOffset = w*0.05;
    yOffset = (h - scaleFactor*(maxY - minY))/2;
  } else {
    scaleFactor = 0.9*h/(maxY - minY);
    xOffset = (w - scaleFactor*(maxX - minX))/2;
    yOffset = h*0.05;
  }
  for (let i = 0; i < lines.length; i++) {
    const x1 = w/2 + 0.9*((xOffset + (lines[i][0] - minX)*scaleFactor) - w/2);
    const y1 = h/2 + 0.9*((yOffset + (lines[i][1] - minY)*scaleFactor) - h/2);
    const x2 = w/2 + 0.9*((xOffset + (lines[i][2] - minX)*scaleFactor) - w/2);
    const y2 = w/2 + 0.9*((yOffset + (lines[i][3] - minY)*scaleFactor) - h/2);
    stroke(255);
    strokeWeight(w/resolution);
    line(x1,y1,x2,y2);
  }
}
