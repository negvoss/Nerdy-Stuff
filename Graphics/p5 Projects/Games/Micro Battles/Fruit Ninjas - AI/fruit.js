const fruitR = 20;

function Fruit(x,stoppingY) {
  this.x = x;
  this.y = -fruitR - 5;
  this.stoppingY = stoppingY;
  this.recoilTimer = random(240,300);
  this.bomb = floor(random(4));

  this.update = function() {
    this.recoilTimer--;
    if (this.recoilTimer <= 0) {
      if (this.bomb == 0) {
        if (dist(ninja0.x + ninjaWidth/2,ninja0.y + ninjaHeight/2,this.x,this.y) < 120) {
          ninja0.die();
        }
        if (dist(ninja1.x + ninjaWidth/2,ninja1.y + ninjaHeight/2,this.x,this.y) < 120) {
          ninja1.die();
        }
        this.y = -20;
      } else {
        this.y -= (height - this.y)*0.015;
      }
    } else if (this.y < this.stoppingY) {
      this.y += 4;
    }
  }

  this.show = function() {
    stroke(0);
    strokeWeight(4);
    line(this.x, this.y - fruitR,this.x,-10);
    fill(0,0,255);
    if (this.bomb == 0) {
      fill(0);
      if (this.recoilTimer%30 > 15) {
        fill(255,0,0);
      }
    }
    strokeWeight(2);
    ellipse(this.x,this.y,fruitR*2);
  }
}
