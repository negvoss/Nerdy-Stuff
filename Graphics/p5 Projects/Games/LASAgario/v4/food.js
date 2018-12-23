function Food(x,y) {
  this.x = x;
  this.y = y;
  this.m = 60;
  this.r = sqrt(this.m/PI);

  this.color = color(random(255),random(255),random(255));

  this.show = function() {
    this.displayX = this.x - xCenter + width/2;
    this.displayY = this.y - yCenter + height/2;

    if (this.displayX >= 0 && this.displayX <= width && this.displayY >= 0 && this.displayY <= height) {
      noStroke();
      fill(this.color);
      ellipse(this.displayX,this.displayY,this.r*2);
      // fill(0);
      // text((this.x,"     ",this.y),this.displayX,this.displayY);
    }
  }
}
