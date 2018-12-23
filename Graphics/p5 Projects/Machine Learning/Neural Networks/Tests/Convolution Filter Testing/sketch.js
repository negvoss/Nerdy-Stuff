let img;
let ref;
const resolution = 28;
const penWidth = 3;

let w = 200;
let h = 200;
function setup() {
  setupFirebase();
  (createCanvas(w*2,h).parent("#canvasContainer")).elt.style.border = "solid";
  background(0);
  setupControls();
  noSmooth();
}

const updateImage = function() {
  background(0);
  drawLines(lines);
  img = get(0,0,w,h);
  img.resize(resolution,resolution);
  img.loadPixels();
  image(img,0,0,w,h);
}

const convolve = function() {
  let filter = [];
  if (select("#normalize").checked()) {
    filter = normalize(rawFilter);
  } else {
    filter = rawFilter;
  }
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
    // convolved.pixels[i] = round(255*sigmoid(sum - 128));
    convolved.pixels[i] = min(max(sum,0),255);
    convolved.pixels[i + 1] = convolved.pixels[i]; // copies for grayscale
    convolved.pixels[i + 2] = convolved.pixels[i];
    convolved.pixels[i + 3] = 255; // transparency value (no transparency)
  }
  convolved.updatePixels();
  showConvolved(convolved);
}

const e = 2.718281;
const sigmoid = function(x) {
  return(1/(1 + pow(e,-x)));
}

const showConvolved = function(convolved) {
  //const resizedConvolved = resizeConvolved(convolved);
  image(convolved,w + 1,0,w,h);
  //image(resizedConvolved,w*2 + 1,0,w,h);
  currentlyDrawing = false;
}

// const resizeConvolved = function(convolved) {
//   const resizedConvolved = createImage(7,7); // must be resolution divded by integer
//   resizedConvolved.loadPixels();
//   const reductionFactor = floor(convolved.width/resizedConvolved.width);
//   for (let x = 0; x < convolved.width; x++) {
//     for (let y = 0; y < convolved.height; y++) {
//       const resizedX = floor(x/reductionFactor);
//       const resizedY = floor(y/reductionFactor);
//       const convolvedIndex = (x + y*convolved.width)*4;
//       const resizedIndex = (resizedX + resizedY*resizedConvolved.width)*4;
//       const convolvedPixel = convolved.pixels[convolvedIndex];
//       const resizedPixel = resizedConvolved.pixels[resizedIndex];
//       resizedConvolved.pixels[resizedIndex] += round(convolvedPixel);
//     }
//   }
//   for (let i = 0; i < resizedConvolved.pixels.length; i += 4) {
//     let adjustedBrightness = round(255*sigmoid(resizedConvolved.pixels[i] - 128));
//     resizedConvolved.pixels[i] = adjustedBrightness;
//     resizedConvolved.pixels[i + 1] = adjustedBrightness;
//     resizedConvolved.pixels[i + 2] = adjustedBrightness;
//     resizedConvolved.pixels[i + 3] = 255;
//   }
//   resizedConvolved.updatePixels();
//   return resizedConvolved;
// }

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
    const x1 = xOffset + (lines[i][0] - minX)*scaleFactor;
    const y1 = yOffset + (lines[i][1] - minY)*scaleFactor;
    const x2 = xOffset + (lines[i][2] - minX)*scaleFactor;
    const y2 = yOffset + (lines[i][3] - minY)*scaleFactor;
    stroke(255);
    strokeWeight(3*w/resolution);
    line(x1,y1,x2,y2);
  }
}




const setupControls = function() {
  createFilterInputs();
  select("#convolve").mousePressed(function() {
    updateImage();
    convolve();
  });
  filterSelect = createSelect().parent("#filterSelectContainer");
  select("#saveFilter").mousePressed(function() {
    ref.push({
      name:select("#filterName").value(),
      filter:rawFilter
    });
  });
}
