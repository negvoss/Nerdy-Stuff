var mapimg;

var clat = 0;
var clon = 0;

var cx;
var cy;

var zoom = 1;

var lat = 0;
var lon = 0;

var ww = 1024;
var hh = 512;

var earthquakes;

var markers = [];
var markersToShow = [];

var buffer = window.innerHeight - hh;



function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat + ',' + clon + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');
    earthquakes = loadStrings("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv");
  }




function setup() {
  gatherData();
  createCanvas(ww + 10, hh + buffer);


  cx = mercX(clon);
  cy = mercY(clat);

  mapEarthquakes();
}

function mousePressed() {
  for (var i = 0; i < markers.length; i++) {
    if (dist(mouseX,mouseY,markers[i].x,markers[i].y) <= markers[i].d/2) {
      var index = markersToShow.indexOf(markers[i])
      if (index != -1) {
        markersToShow.splice(index,1);
      } else {
        markersToShow.push(markers[i]);
      }
    }
  }
  for (var i = 0; i < markersToShow.length; i++) {
    markersToShow[i].show();
  }
}


function draw() {
  fill(255);
  noStroke();
  rect(ww,0,window.displayWidth - ww,height);
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

function determineTime(index) {
  var i = index;
  var date = earthquakes[i][0];

  date = date.split("-");
  var year = date[0];
  date = date[1] + date[2];
  date = date.split("T");
  date = date[0] + date[1];
  date = date.split(".")[0];

  var month = date.slice(0,2);
  var day = date.slice(2,4);
  var hours = date.slice(4,6);
  var minutes = date.slice(7,9);
  var seconds = date.slice(10,12);

  var yearS = 3.154*pow(10,7);
  var monthS = 2.628*pow(10,6);
  var dayS = 86400;
  var hourS = 3600;
  var minuteS = 60;
  var secondS = 1;

  var secondTotal = 0;

  secondTotal += yearS*year;
  secondTotal += monthS*month;
  secondTotal += dayS*day;
  secondTotal += hourS*hours;
  secondTotal += minuteS*minutes;
  secondTotal += secondS*seconds;

  var today = 0;
  var d = new Date();

  today += yearS  *  d.getFullYear();
  today += monthS * (d.getMonth() + 1);
  today += dayS   *  d.getDate();
  today += (hourS * (d.getHours() + d.getTimezoneOffset()/60));
  today += minuteS*  d.getMinutes();
  today += secondS*  d.getSeconds();

  return [map(secondTotal,today - monthS,today,0,255),round((today - secondTotal)/dayS)];
}

function gatherData() {
  for (var i = 1; i < earthquakes.length; i++) {
    earthquakes[i] = earthquakes[i].split(",");
  }

  earthquakes.splice(0,1);
}

function mapEarthquakes() {
    noStroke();
    fill(50,150,170);
    rect(0,512,1024,buffer);

    translate((width - 10) / 2, (height - buffer) / 2);
    imageMode(CENTER);
    image(mapimg, 0, 0);

    for (var i = 0; i < earthquakes.length; i++) {
      var currency = determineTime(i)[0];
      var days = determineTime(i)[1];

      var lat = earthquakes[i][1];
      var lon = earthquakes[i][2];
      var mag = earthquakes[i][4];

      var d = pow(mag,10);
      d = sqrt(d);

      var magmax = sqrt(pow(10,8));

      d = map(d,0,magmax,0,60);

      var x = mercX(lon) - cx;
      var y = mercY(lat) - cy;

      noStroke();
      fill(currency, 255 - currency, 50, 200);
      ellipse(x, y, d);

      markers.push(new Marker(lon,lat,mag,days,x,y,d))
    }
}











//
