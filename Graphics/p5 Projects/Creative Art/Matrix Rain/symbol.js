function Symbol(x,y,speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.symbol;
  this.first;

  this.randomSymbol = function() {
    this.symbol = String.fromCharCode(round(random(12448,12543)));
  }

  this.show = function(c) {
    if (random(0,10) > 9.95) {
      this.randomSymbol();
    }
    noStroke();
    fill(c);
    textSize(symbolWidth);
    text(this.symbol,this.x,this.y)
    this.y += this.speed;
    if (this.y > screen.height) {
      this.y = 0;
    }
  }
}
