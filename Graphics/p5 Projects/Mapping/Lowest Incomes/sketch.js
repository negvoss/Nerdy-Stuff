let mapimg;
const markers = [];
const markersToShow = [];

function preload() {
  mapimg = loadImage(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/" + "0,0,1/1024x512?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw"
  );
}




function setup() {
  createCanvas(1024,512);
  image(mapimg,0,0);
  loadXML("http://api.worldbank.org/v2/incomeLevels/LIC/countries",map);
}

const map = function(incomeLevels) {
  for (country of incomeLevels.children) {
    noStroke();
    fill(255);
    ellipse(mercX(Number(country.children[7].content)),mercY(Number(country.children[8].content)),5);
  }
}

const mercX = function(lon) {
  return ((256/Math.PI)*2)*(rads(lon) + Math.PI);
}
const mercY = function(lat) {
  return ((256/Math.PI)*2)*(Math.PI - Math.log(Math.tan(Math.PI/4 + rads(lat)/2))) - 256;
}
const rads = function(angle) {
  return Math.PI*angle/180;
}
