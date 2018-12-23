function Connection(x,y,circle) {
  this.x = x;
  this.y = y;
  this.circle = circle;

  this.show = function() {
    stroke(255,0,255);
    strokeWeight(3);
    line(this.x,this.y,this.circle.x,this.circle.y);
  }
}
