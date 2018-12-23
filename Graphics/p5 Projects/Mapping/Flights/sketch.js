var mapimg;

var clat = 0;
var clon = 0;
var zoom = 1;
var ww = 1024;
var hh = 512;

var cx;
var cy;

var flights = [];




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
  var updateTime = 1;

  if (frameCount % (updateTime*60) == 0) {
    loadStrings("https://opensky-network.org/api/states/all",gotData,"jsonp");
  }

  if (frameCount > 60*updateTime + 20) {
    translate(width/2,height/2);
    imageMode(CENTER);
    image(mapimg,0,0);


    for (var i = 0; i < flights.length; i++) {
      var lon = flights[i][5];
      var lat = flights[i][6];
      var heading = flights[i][10];
      var x = mercX(lon) - cx
      var y = mercY(lat) - cy
      noFill();
      stroke(255);
      line(x,y,x - 3*cos(heading),y - 3*sin(heading));
      fill(0,255,0);
      noStroke();
      ellipse(x,y,1.5);
    }
  }
}


function gotData(data) {
  // lat = data.iss_position.latitude;
  // lon = data.iss_position.longitude;
  data = data[0];
  data = data.split("[");
  for (var i = 0; i < data.length; i++) {
    data[i] = data[i].slice(0,data[i].length - 2);
    data[i] = data[i].split(",");
  }
  data.splice(0,2);
  flights = data;
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
