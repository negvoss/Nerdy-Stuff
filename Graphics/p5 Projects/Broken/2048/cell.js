function Cell(col,row) {
  this.col = col;
  this.row = row;
  this.occupant;

  this.show = function() {
    stroke(0);
    strokeWeight(5);
    noFill();
    rect(this.col*cellWidth,this.row*cellWidth,cellWidth,cellWidth);
    if (this.occupant != undefined) {
      fill(233,150 - this.occupant.value*10,122 - this.occupant.value*10);
      rect(this.col*cellWidth,this.row*cellWidth,cellWidth,cellWidth);
      textSize(50);
      textAlign(CENTER);
      fill(0);
      text(this.occupant.value,this.col*cellWidth + cellWidth/2,this.row*cellWidth + cellWidth/2 + 20);
    } else {
      fill(200);
      rect(this.col*cellWidth,this.row*cellWidth,cellWidth,cellWidth);
    }
  }
}
