const ninjaWidth = 50;
const ninjaHeight = 70;
const swordLength = 100;
const gravity = 0.4;

function Ninja(id) {
  this.id = id;
  this.alive = true;
  this.score = 0;
  if (this.id == 0) {
    this.direction = 1;
    this.x = 0;
  } else {
    this.direction = -1;
    this.x = width - ninjaWidth;
  }
  this.y = height - ninjaHeight;
  this.velocity = 0;
  this.swordAngle;
  this.handX;
  this.handY;
  this.swordX;
  this.swordY;
  this.swordLife;
  this.attacking = false;
  this.secondJump = true;

  this.update = function() {
    this.y += this.velocity;
    let correctHeight = height - ninjaHeight;
    if (this.onPlatform()) {
      correctHeight = this.onPlatform();
    }
    if (this.y + ninjaHeight > height || this.onPlatform()) {
      this.velocity = 0;
      this.y = correctHeight;
      this.swordLife = 0;
      this.secondJump = true;
    } else {
      this.velocity += gravity;
    }
    if (this.alive) {
      this.x += 3*this.direction;
      if ((this.x <= 0 && this.direction == -1) || (this.x + ninjaWidth >= width && this.direction == 1)) {
        this.direction *= -1;
      }
      if (this.attacking) {
        this.swordAngle += this.direction*0.3;
        this.swordX = this.handX + swordLength*cos(this.swordAngle);
        this.swordY = this.handY + swordLength*sin(this.swordAngle);
        if (this.other.alive) {
          let intersected = false;
          for (let i = 0; i < 4; i++) {
            if (intersect(this.handX,this.handY,this.swordX,this.swordY,this.other.x + ninjaWidth*min(i%3,1),this.other.y + ninjaHeight*floor(i/2),this.other.x + ninjaWidth*floor((4-i)/2),this.other.y + ninjaHeight**min(i%3,1))) {
              intersected = true;
            }
          }
          if (intersected) {
            this.other.die();
          }
        }
        this.swordLife--;
        if (this.swordLife <= 0) {
          this.attacking = false;
        }
      }
    } else {
      this.swordLife = 0;
      this.resTimer--;
      if (this.resTimer <= 0) {
        this.alive = true;
      }
    }
    this.handX = this.x + ninjaWidth/2 + this.direction*ninjaWidth/2;
    this.handY = this.y + ninjaHeight/2;
    if (this.direction == this.other.direction*-1 && this.other.x - this.x > 0 && this.other.x - this.x < 5 && this.y + ninjaHeight > this.other.y && this.y < this.other.y + ninjaHeight) {
      this.direction *= -1;
      this.other.direction *= -1;
    }
  }

  this.act = function() {
    if (this.alive) {
      if (this.y + ninjaHeight >= height || this.onPlatform()) {
        this.velocity = -12;
      } else {
        if (this.attacking == false) {
          this.attacking = true;
          this.swordAngle = PI/2 + this.direction*PI/2;
          this.swordLife = 20;
        }
        if (this.secondJump) {
          this.velocity = -8;
          this.secondJump = false;
        }
      }
    }
  }

  this.onPlatform = function() {
    let collision_platform = undefined;
    for (platform of platforms) {
      if (((this.x + ninjaWidth/2 + this.direction*ninjaWidth/2 >= platform.x && this.x + ninjaWidth/2 + this.direction*ninjaWidth/2 <= platform.x + platformWidth) || this.x + ninjaWidth/2 - this.direction*ninjaWidth/2 >= platform.x && this.x + ninjaWidth/2 - this.direction*ninjaWidth/2 <= platform.x + platformWidth) && ((this.y + ninjaHeight > platform.y && this.velocity > gravity && this.y + ninjaHeight < platform.y + 15) || (this.y <= platform.y && this.velocity == 0))) {
        collision_platform = platform.y - ninjaHeight;
      }
    }
    return collision_platform;
  }

  this.die = function() {
    this.alive = false;
    this.resTimer = 120;
  }

  this.show = function() {
    if (this.alive || this.resTimer%30 > 15) {
      if (this.id == 0) {
        fill(255,0,0);
      } else {
        fill(0,255,0);
      }
      noStroke();
      rect(this.x,this.y,ninjaWidth,ninjaHeight);
      stroke(0);
      strokeWeight(5);

      if (this.attacking && this.alive) {
        line(this.handX,this.handY,this.swordX,this.swordY);
      } else {
        line(this.handX,this.handY,this.handX + swordLength*cos(PI/2 + this.direction*PI/2 - 0.3),this.handY + swordLength*sin(PI - 0.3));
      }
    }
  }
}
