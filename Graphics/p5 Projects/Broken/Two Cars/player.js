function Player(id) {
  this.id = id;
  this.w = (width - xoff)/16.45;
  this.h = (width - xoff)/9.4;

  if (this.id == "left") {
    this.x = (width - xoff)*3/8;
  } else if (this.id == "right") {
    this.x = (width - xoff)*5/8;
  }
  this.y = height/2;
  this.start = this.x;

  this.dir = 0;

  this.show = function() {
    noStroke();
    fill(100,100,255);
    rect(this.x,this.y,this.w,this.h);
  }

  this.update = function() {
    this.x += this.dir;
    if (this.id == "left") {
      if (this.x < this.start - (width - xoff)/4 || this.x > this.start) {
        this.dir = 0;
      }
    } else {
      if (this.x < this.start || this.x > this.start + (width - xoff)/4 ) {
        this.dir = 0;
      }
    }

    for (var i = 0; i < lanes.length; i++) {
      for (var j = 0; j < lanes[i].objectives.length; j++) {
        var obj = lanes[i].objectives[j];
        if (this.y + this.h/2 < obj.y - obj.h/2) {
          gameOver();
        }
        if (this.x >= obj.x - obj.w/2 && this.x + this.w/2 <= obj.x + obj.w/2 && this.y - this.h/2 >= obj.y - obj.h/2 && this.y - this.h/2 <= obj.y + obj.h/2) {
          lanes[i].objectives.splice(j,1);
          lanes[i].createObsticles(1);
          score++;
        }
      }
    }

    for (var i = 0; i < lanes.length; i++) {
      for (var j = 0; j < lanes[i].barriers.length; j++) {
        var obj = lanes[i].barriers[j];
        if (this.x >= obj.x - obj.w/2 && this.x + this.w/2 <= obj.x + obj.w/2 && this.y - this.h/2 >= obj.y - obj.h/2 && this.y - this.h/2 <= obj.y + obj.h/2) {
          gameOver();
        }
      }
    }
  }

  this.move = function() {
    if (this.id == "left") {
      if (this.x < this.start) {
        this.dir = (width - xoff)/45.8;
      } else {
        this.dir = (width - xoff)/-45.8;
      }
    } else {
      if (this.x <= this.start) {
        this.dir = (width - xoff)/45.8;
      } else {
        this.dir = (width - xoff)/-45.8;
      }
    }
  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    player1.move();
  }

  if (keyCode == RIGHT_ARROW) {
    player2.move();
  }
}
