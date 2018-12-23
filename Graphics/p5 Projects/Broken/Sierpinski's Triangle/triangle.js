function Triangle(x,y,radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;

  this.show = function() {
    this.x1 = this.x
    this.y1 = this.y
    this.x2 = this.x + sqrt(3/4)*this.radius
    this.y2 = this.y+1.5*this.radius
    this.x3 = this.x - sqrt(3/4)*this.radius
    this.y3 = this.y+1.5*this.radius

    triangle(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
  }

  this.findMidPoints = function() {
    this.m1 = {
      x:(this.x1+this.x2)/2,
      y:(this.y1+this.y2)/2
    }
  }
}
