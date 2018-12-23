function getPixel(x,y) {
  var index = 4*(y*img.width + x);
  var targetPixel = {
    values:[
      img.pixels[index],
      img.pixels[index + 1],
      img.pixels[index + 2],
      img.pixels[index + 3]
    ],
    x:x,
    y:y
  }
  return targetPixel;
}

function setPixel(x,y,col) {
  var index = 4*(y*img.width + x);
  img.pixels[index] = col.levels[0];
  img.pixels[index + 1] = col.levels[1];
  img.pixels[index + 2] = col.levels[2];
  img.pixels[index + 3] = col.levels[3];
}

function overImage(x,y) {
  return x >= 0 && x < img.width && y >= 0 && y < img.height;
}
