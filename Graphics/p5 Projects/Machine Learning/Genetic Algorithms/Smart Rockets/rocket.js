function Rocket(dna) {
  this.pos = createVector(width/2,height);
  this.acc = createVector();
  this.vel = createVector();
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = [];
    for (var i = 0; i < lifeSpan; i++) {
      this.dna[i] = p5.Vector.random2D().setMag(0.3);
    }
  }
  this.fitness;
  this.success = false;
  this.crashed = false;

  this.evaluateFitness = function() {
    this.fitness = 50*(1000 - dist(this.pos.x,this.pos.y,target.x,target.y));
    if (this.fitness <= 0) {
      this.fitness = 0.001;
    }
    if (this.success) {
      this.fitness *= 10;
    } else if (this.crashed) {
      this.fitness /= 10;
    }
  }

  this.update = function() {
    if (!this.success && !this.crashed) {
      this.acc = this.dna[count];
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      if (dist(this.pos.x,this.pos.y,target.x,target.y) < 25) {
        this.success = true;
        this.pos.x = target.x;
        this.pos.y = target.y;
      }
      if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
        this.crashed = true;
      }
      if (
        this.pos.x > barrierX &&
        this.pos.x < barrierX + barrierW &&
        this.pos.y > barrierY &&
        this.pos.y < barrierY + barrierH
      ) {
        this.crashed = true;
      }
    }
  }

  this.show = function() {
    if (!this.crashed) {
      var len = 50;
      var dir = createVector(
        cos(this.vel.heading())*len/2,
        sin(this.vel.heading())*len/2
      );
      stroke(255);
      strokeWeight(5);
      line(this.pos.x - dir.x,this.pos.y - dir.y,this.pos.x + dir.x,this.pos.y + dir.y);
      noStroke();
      fill(0,0,255);
      ellipse(this.pos.x + dir.x,this.pos.y + dir.y,8);
    }
  }
}
