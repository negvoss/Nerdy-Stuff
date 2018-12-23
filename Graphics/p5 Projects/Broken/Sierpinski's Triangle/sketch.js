var radius = 150;
var triangles = [];


function setup() {
  createCanvas(radius*1.5 + 50,radius*1.5 + 50);
  background(51);
  stroke(255,0,255);
  noFill();
  strokeWeight(3);
  triangles.push(new Triangle(width/2,25,radius));
  for (var i = 0; i < triangles.length; i++) {
    triangles[i].show();
  }
}
