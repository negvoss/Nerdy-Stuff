function Tile(col,row,value) {
  this.col = col;
  this.row = row;
  this.value = value;
  this.host = grid[this.col][this.row];
  this.host.occupant = this;

  this.move = function(x,y) {
    for (var i = 0; i < 4; i++) {
      if (grid[this.col + x] != undefined) {
        if (grid[this.col + x][this.row + y] != undefined) {
          console.log(x,y);
          var dest = grid[this.col + x][this.row + y];
          if (dest.occupant != undefined) {
            if (dest.occupant.value == this.value) {
              dest.occupant.value += this.value;
              this.host.occupant = undefined;
            }
          } else {
            this.col = dest.col;
            this.row = dest.row;
            dest.occupant = this;
            this.host.occupant = undefined;
            this.host = dest;
            this.host.occupant = this;
          }
        }
      }
    }
  }
}
