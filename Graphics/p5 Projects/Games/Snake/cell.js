function Cell(x,y,width) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.col = 51;
  this.food = false;


  this.show = function() {
    noStroke();
    if (this == s.head) {
      this.col = color(255,0,0);
    }
    if (this.food) {
      if (this == s.head) {
        s.eat();
        this.food = false;
      }
      this.col = color(0,0,255);
    }
    fill(this.col);

    rect(this.x*this.width,this.y*this.width,this.width,this.width);
  }
}
