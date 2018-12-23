function Stream(x,y,speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.stream = [];
  this.streamLength = round(random(7,20));

  this.createSymbols = function() {
    for (var i = 0; i < this.streamLength; i++) {
      this.stream[i] = new Symbol(this.x,this.y,this.speed);
      this.stream[i].randomSymbol();
      this.y -= symbolWidth;
    }
  }

  this.show = function() {
    for (var i = 0; i < this.stream.length; i++) {
      var c = color(0,255,70);
      if (i == 0) {
        c = color(170,255,220);
      }
      if (i > this.stream.length - 4) {
        c = color(0,128,35);
      }
      this.stream[i].show(c);
    }
  }
}
