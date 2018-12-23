function Particle(x,y) {
  this.x = x;
  this.y = y;
  this.pos = createVector(this.x,this.y);
  this.col = color(random(0,255),random(0,255),random(0,255));

  this.show = function() {
    stroke(this.col);
    strokeWeight(10);
    point(this.x,this.y);
  }

  this.move = function() {
    this.pos = createVector(this.x,this.y);
    this.pos.mult(-1);
    this.x += this.pos.x/70/s.value();
    this.y += this.pos.y/70/s.value();
  }
}
