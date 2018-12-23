function Point(x,y,parent) {
  this.x = x;
  this.y = y;
  this.parent = parent;
  this.child;

  this.show = function() {
    strokeWeight(4);
    if (this.child != null) {
      line(this.x,this.y,this.child.x,this.child.y);
    }
    strokeWeight(8);
    point(this.x,this.y);
  }
}
