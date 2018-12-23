var video;
var button;
var snaps = [];
var maxSnaps = 40;


function setup() {
  createCanvas(800,240);
  background(51);
  video = createCapture(VIDEO);
  video.size(320,240);
  button = createButton("Save and download selection");
  button.mousePressed(showPics);
}

function takeSnap() {
  snaps.unshift(video.get());
  //console.log(video.get());
}

function showPics() {
  snaps[0].save("photo_booth_image")
}




function draw() {
  takeSnap();
  var x = 0;
  var y = 0;
  var w = 80;
  var h = 60;
  for (var i = 0; i < snaps.length; i++) {
    image(snaps[i], x, y, w, h);
    x = x + w;
    if (x > width - w) {
      y = y + h;
      x = 0;
    }
    if (snaps.length > maxSnaps) {
      snaps.splice(snaps.length - 1,1);
      y = 0;
    }
  }
}
