var streams = [];
var symbolWidth = 20;


function setup() {
  createCanvas(screen.width,screen.height);
  for (var i = 0; i < round(screen.width/symbolWidth); i++) {
    streams[i] = new Stream(i*symbolWidth,random(-1500,0),random(2,6));
    streams[i].createSymbols();
  }
}


function draw() {
  background(0,120);
  for (var i = 0; i < streams.length; i++) {
    streams[i].show();
  }
}
