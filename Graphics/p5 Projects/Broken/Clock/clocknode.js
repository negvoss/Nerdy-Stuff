function ClockNode(r,angle) {
  this.r = r;
  this.angle = angle;
  this.x;
  this.y;

  this.show = function() {
    this.x = this.r*cos(this.angle) + width/2;
    this.y = this.r*sin(this.angle) + height/2;
    strokeWeight(5);
    point(this.x,this.y);
  }
}
