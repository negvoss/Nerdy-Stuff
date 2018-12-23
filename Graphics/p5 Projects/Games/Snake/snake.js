function Snake(x,y) {
  this.x = x;
  this.y = y;
  this.maxlength = 5;
  this.tail = []
  this.tail[0] = grid[this.x][this.y];
  this.head = this.tail[0];
  this.dir = [1,0];




  this.show = function() {
    for (var i = 0; i < this.tail.length; i++) {
      this.tail[i].col = color(255,0,255);
      if (this.head.x == this.tail[i].x && this.head.y == this.tail[i].y && i != this.tail.length - 1) {
        this.death();
      }
    }
    if (this.tail.length > this.maxlength) {
      this.removeTail();
    }
  }
  this.move = function() {
    if (this.x + this.dir[0] < dimension && this.y + this.dir[1] < dimension && this.x + this.dir[0] >= 0 && this.y + this.dir[1] >= 0) {
      this.x = this.x + this.dir[0];
      this.y = this.y + this.dir[1];
      var newtale = grid[this.x][this.y]
      this.tail.push(newtale);
      this.head = newtale;
      this.show();
    }
    else {
      this.death();
    }
  }
  this.removeTail = function() {
    this.tail[0].col = color(51);
    this.tail.splice(0,1);
  }
  this.eat = function() {
    this.maxlength += 1;
    this.head.col = color(255);
    createFood();
  }
  this.death = function() {
    fill(255);
    textSize(32);
    text('YOU DIED!',dimension*width*0.5 - 80,dimension*width*0.5);
    noLoop();
  }
}
