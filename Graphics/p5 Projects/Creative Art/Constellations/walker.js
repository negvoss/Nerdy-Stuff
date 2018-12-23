function Walker(x,y) {
  this.x = x;
  this.y = y;
  this.xspeed = random(-1,1);
  this.yspeed = random(-1,1);

  this.show = function() {
    strokeWeight(8);
    point(this.x,this.y);
  }

  this.move = function() {
    this.x += this.xspeed/3 + 4*(mouseX - width/2)/width;
    this.y += this.yspeed/3 + 4*(mouseY - height/2)/height;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  this.connect = function() {
    this.distances = [];
    for (var i = 0; i < walkers.length; i++) {
      if (walkers[i] != this) {
        this.distances.push({
          distance:dist(this.x,this.y,walkers[i].x,walkers[i].y),
          walker:walkers[i]
        });
      }
    }
    this.distances = findClosest(this.distances);
    strokeWeight(2);
    line(this.distances[0].walker.x,this.distances[0].walker.y,this.x,this.y);
    //line(this.distances[1].walker.x,this.distances[1].walker.y,this.x,this.y);
  }
}
