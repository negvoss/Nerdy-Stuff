function Circle(x,y) {
  this.radius = 0;
  this.x = x;
  this.y = y;
  this.col = color(255,0,255);
  this.display = function() {
    stroke(0);
    fill(this.col);
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }
  this.grow = function() {
    this.radius++;
  }
  this.clicked = function() {
    var d = dist(mouseX,mouseY,this.x,this.y);
    if (d < this.radius) {
      this.col = color(0,255,0);
    }
  }
}
