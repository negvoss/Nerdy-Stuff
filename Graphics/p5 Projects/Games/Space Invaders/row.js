function Row(x,y) {
  this.x = x;
  this.y = y;

  this.invaders = [];


  this.createInvaders = function() {
    for (var i = 0; i < invaderCount; i++) {
      this.invaders.push(new Invader(this.x + i*width/(invaderCount + 1),this.y));
    }
  }

  this.show = function() {
    for (var i = 0; i < this.invaders.length; i++) {
      this.invaders[i].show();
    }
  }

  this.move = function() {
    for (var i = 0; i < this.invaders.length; i++) {
      this.invaders[i].move();
    }
  }

  this.update = function() {
    for (var i = 0; i < this.invaders.length; i++) {
      this.invaders[i].update();
    }
  }
}
