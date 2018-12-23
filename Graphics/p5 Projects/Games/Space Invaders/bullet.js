function Bullet(x,y,type) {
  this.x = x;
  this.y = y;
  this.type = type;


  this.show = function() {
    stroke(0);
    if (this.type == "player") {
      fill(0,255,0);
    } else if (this.type = "invader") {
      fill(255);
    }
    ellipse(this.x,this.y,bulletWidth);
  }

  this.move = function() {
    if (this.type == "player") {
      this.y -= bulletSpeed;
    } else if (this.type = "invader") {
      this.y += bulletSpeed;
    }
  }
}
