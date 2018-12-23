function Bubble(x,y,radius) {
  this.increment;
  this.radius = radius;
  this.x = x;
  this.y = y;
  this.display = function() {
    stroke(255);
    noFill();
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }
  this.move = function() {
    this.increment = map(mouseX,0,xwid,2,7);
    this.x = this.x + random(-this.increment,this.increment);
    this.y = this.y + random(-this.increment,this.increment);
  }
}
