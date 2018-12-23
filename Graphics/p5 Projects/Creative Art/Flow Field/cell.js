function Cell(col,row,radius,angle) {
  this.col = col;
  this.row = row;
  this.angle = angle;
  this.radius = radius;
  this.dir;

  this.x = this.col*cellWidth;
  this.y = this.row*cellWidth;


  this.line = {
    x:this.x + cellWidth/2,
    y:this.y + cellWidth/2,

    angle:this.angle,
    radius:this.radius,
    dir:this.dir,


    show:function() {
      line(
        this.x,
        this.y,
        this.x + this.dir.x*cellWidth/2,
        this.y + this.dir.y*cellWidth/2
      );
    },

    update:function() {
      this.angle += PI/70 + random(-PI/150,PI/150);
      this.dir = p5.Vector.fromAngle(this.angle).mult(this.radius);
    }
  };


  this.show = function() {
    noFill();
    stroke(0);
    strokeWeight(1);

    rect(this.x,this.y,cellWidth,cellWidth);
    this.line.show();
  }

  this.update = function() {
    this.line.update();
  }
}
