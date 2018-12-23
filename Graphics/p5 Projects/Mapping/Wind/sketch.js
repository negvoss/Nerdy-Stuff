var mapimg;

var clat = 0;
var clon = 0;
var zoom = 1;
var ww = 1024;
var hh = 512;

var cx;
var cy;

var citySelect;
var submitCity;


function preload() {
  mapimg = loadImage(
    'https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat + ',' + clon + ',' + zoom + '/' + ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY' +
    '2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw'
  );
}




function setup() {
  cx = mercX(clon);
  cy = mercY(clat);
  createCanvas(ww,hh);
  translate(width/2,height/2);
  imageMode(CENTER);
  image(mapimg,0,0);

  citySelect = select("#citySelect");
  submitCity = select("#submitCity");
  submitCity.mousePressed(requestData);
}

function requestData() {
  var api = 'http://api.openweathermap.org/data/2.5/weather?q=';
  var city = citySelect.value();
  var apiKey = '&APPID=001b0f58045147663b1ea518d34d88b4';
  var units = '&units=metric';
  var url = api + city + apiKey + units;
  loadJSON(url,gotData);
}

function gotData(data) {
  image(mapimg,width/2,height/2);
  var x = mercX(data.coord.lon) - cx + width/2;
  var y = mercY(data.coord.lat) - cy + height/2;
  ellipse(x,y,5);
  push();
  translate(x,y);
  rotate(data.wind.deg);
  stroke(255);
  line(0,0,20,0);
  pop();
}


function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}
