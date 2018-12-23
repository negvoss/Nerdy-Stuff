function Particle(x,y) {
  this.pos = createVector(x,y);
  this.vel = createVector(0,0);

  this.show = function() {
    stroke(100);
    strokeWeight(1);
    point(this.pos.x,this.pos.y);
  }

  this.update = function() {
    this.host = this.findCell();
    this.vel.add(this.host.line.dir);
    this.pos.add(this.vel.mult(0.75));
  }

  this.findCell = function() {
    var cellCol = floor(this.pos.x/cellWidth)%cols;
    var cellRow = floor(this.pos.y/cellWidth)%rows;
    return grid[cellCol][cellRow];
  }
}
