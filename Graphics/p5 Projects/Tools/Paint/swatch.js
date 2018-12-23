function Swatch(x,y,col) {
  this.x = x;
  this.y = y;

  if (this.x + swatchWidth > width) {
    maxHeight += swatchWidth + 4;
    this.y += swatchWidth + 4;
    this.x = 0;
  }

  this.col = col;

  this.show = function() {
    fill(this.col);
    stroke(70);
    strokeWeight(4);
    rect(this.x,this.y,swatchWidth,swatchWidth);
  }

  this.clicked = function() {
    if (mouseX > this.x && mouseX < this.x + swatchWidth && mouseY > this.y && mouseY < this.y + swatchWidth) {
      brushCol = this.col;
    }
  }
}
