var t;

function setup() {
  createCanvas(600,600);
  stroke(255);

  t = new Tentacle();
  t.createPoints();
}

function draw() {
  //frameRate(3);
  background(51);
  t.show();
}
