function Obstacle(x,y,type) {
  this.x = x;
  this.y = y;
  this.w = (width - xoff)/9.4;
  this.h = (width - xoff)/9.4;
  this.type = type;

  this.show = function() {
    noFill();
    strokeWeight((width - xoff)/54.83);
    if (this.type == "objective") {
      stroke(153,50,204,200);
      ellipse(this.x,this.y,this.w,this.h);
    } else if (this.type == "barrier") {
      stroke(200,10,10,200);
      rect(this.x,this.y,this.w,this.h);
    }
  }
}
