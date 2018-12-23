var walkers = [];


function setup() {
  createCanvas(1200,600);
  stroke(255,0,255);

  for (var i = 0; i < 50; i++) {
    walkers.push(new Walker(random(width),random(height)));
  }
}


function draw() {
  //frameRate(1);
  background(51);
  for (var i = 0; i < walkers.length; i++) {
    walkers[i].show();
    walkers[i].move();
    walkers[i].connect();
  }
}


function findClosest(distances) {
  for (var i = 0; i < distances.length; i++) {
    for (var j = 0; j < distances.length; j++) {
      if (distances[i].distance < distances[j].distance && i != j) {
        var temp = distances[i];
        distances[i] = distances[j];
        distances[j] = temp;
      }
    }
  }
  console.log(distances);
  return distances;
}
