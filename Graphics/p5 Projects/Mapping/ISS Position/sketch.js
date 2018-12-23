var mapimg;

var clat = 0;
var clon = 0;
var zoom = 1;
var ww = 1024;
var hh = 512;

var cx;
var cy;


var lat = 0;
var lon = 0;




function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat + ',' + clon + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');
  }




function setup() {
  createCanvas(ww,hh);
  background(31);
  fill(215);
  noStroke();
  textAlign(CENTER);
  textSize(80);
  text("LOADING",width/2,height/2);

  cx = mercX(clon);
  cy = mercY(clat);
}

function draw() {
  var updateTime = 5;

  if (frameCount % (updateTime*60) == 0) {
    loadJSON("http://api.open-notify.org/iss-now.json",gotData,"jsonp");
  }

  if (frameCount > 60*updateTime + 20) {
    translate(width/2,height/2);
    imageMode(CENTER);
    image(mapimg,0,0);

    fill(255,0,0);
    noStroke();
    ellipse(mercX(lon) - cx,mercY(lat) - cy,30);
  }
}


function gotData(data) {
  lat = data.iss_position.latitude;
  lon = data.iss_position.longitude;
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
