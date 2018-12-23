function Square(col,row,shade) {
  this.col = col;
  this.row = row;
  this.shade = shade;
  this.x = this.col*squareWidth;
  this.y = this.row*squareWidth;

  this.show = function() {
    fill(this.shade);
    rect(this.x,this.y,squareWidth,squareWidth);
  }
}
