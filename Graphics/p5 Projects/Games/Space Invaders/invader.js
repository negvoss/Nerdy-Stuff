function Invader(x,y) {
  this.x = x;
  this.y = y;
  this.direction = 1;
  this.oscillations = 0;

  this.show = function() {
    noStroke();
    fill(255);
    rect(this.x,this.y + shipHeight/2,shipWidth,shipHeight);
  }

  this.move = function() {
    if (this.x + shipWidth/2 < width) {
      if (this.direction == 1) {
        this.x += moveSpeed*this.direction;
      }
    } else if (this.x + shipWidth/2 >= width) {
        this.direction *= -1;
        this.oscillations++;
        if (this.oscillations == oscillations) {
         this.y += 30;
         this.oscillations = 0;
        }
      }
    if (this.x - shipWidth/2 > 0) {
      if (this.direction == -1) {
        this.x += moveSpeed*this.direction;
      }
    }
    else if (this.x - shipWidth/2 <= 0) {
      this.direction *= -1;
      this.oscillations++;
      if (this.oscillations == oscillations) {
       this.y += 30;
       this.oscillations = 0;
      }
    }
  }

  this.update = function() {
    if (random(1) > 0.9995) {
      this.shoot();
    }
  }

  this.shoot = function() {
    bullets.push(new Bullet(this.x,this.y + shipHeight,"invader"));
  }
}
