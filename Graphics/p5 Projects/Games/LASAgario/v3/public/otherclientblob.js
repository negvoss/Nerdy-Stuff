function OtherClientBlob(id,x,y,m,c,r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.m = m;
  this.col = c;
  this.r = r;

  this.show = function() {
    noStroke();
    fill(this.col);
    ellipse(this.x - xCenter + width/2,this.y - yCenter + height/2,this.r*2);
  }
}
