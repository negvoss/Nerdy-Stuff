function Circle(angle) {
  this.x;
  this.y;
  this.r = 20;
  this.angle = angle;

  this.update = function() {
    this.angle += 2;
    this.x = width/2 + 10*(this.r*cos(radians(this.angle)));
    this.y = height/2 + 10*(this.r*sin(radians(this.angle)));
  }

  this.show = function() {
    fill(255,255,0);
    noStroke();
    ellipse(this.x,this.y,this.r);
  }
}
