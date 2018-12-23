function Food(x,y,c) {
  this.x = x;
  this.y = y;
  this.col = c;
  this.m = 60;
  this.r = sqrt(this.m/PI);

  this.show = function() {
    this.displayX = this.x - xCenter + width/2;
    this.displayY = this.y - yCenter + height/2;

    if (this.displayX >= 0 && this.displayX <= width && this.displayY >= 0 && this.displayY <= height) {
      noStroke();
      fill(this.col);
      ellipse(this.displayX,this.displayY,this.r*2);
      // fill(0);
      // text((this.x,"     ",this.y),this.displayX,this.displayY);
    }
  }
}
