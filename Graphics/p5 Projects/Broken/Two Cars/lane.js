
function Lane(id) {
  this.id = id;
  this.pair;

  if (this.id == 0) {
    this.pair = 1;
  }
  if (this.id == 1) {
    this.pair = 0;
  }
  if (this.id == 2) {
    this.pair = 3;
  }
  if (this.id == 3) {
    this.pair = 2;
  }

  this.objectives = [];
  this.barriers = [];

  this.createObsticles = function(count) {
    var created = 0;
    while(created < count) {
      if (random(1) < 0.5) {
        if (lanes[this.pair].objectives[0]) {   //Todo: Fix this: Make it so that obstacles are not generated next to each other.
          this.objectives.push(new Obstacle((width - xoff)*(this.id*2 + 1)/8,random(-height,lanes[this.pair].objectives[0].y - 100),"objective"));
          created++;
          console.log("hello");
        } else {
          this.objectives.push(new Obstacle((width - xoff)*(this.id*2 + 1)/8,random(-height,0),"objective"));
          created++;
        }
      } else {
        if (lanes[this.pair].barriers[0]) {
          this.barriers.push(new Obstacle((width - xoff)*(this.id*2 + 1)/8,random(-height,lanes[this.pair].barriers[0].y - 100),"barrier"));
          created++;
          console.log("hello");
        } else {
          this.barriers.push(new Obstacle((width - xoff)*(this.id*2 + 1)/8,random(-height,0),"barrier"));
          created++;
        }
      }
    }
  }

  this.update = function() {
    for (var i = this.objectives.length - 1; i >= 0; i--) {
      this.objectives[i].y += (width - xoff)/65.8;
      if (this.objectives[i].y > height) {
        this.objectives.splice(i,1);
        this.createObsticles(1);
      }
    }
    for (var i = this.barriers.length - 1; i >= 0; i--) {
      this.barriers[i].y += (width - xoff)/65.8;
      if (this.barriers[i].y > height) {
        this.barriers.splice(i,1);
        this.createObsticles(1);
      }
    }
  }

  this.show = function() {
    for (var i = 0; i < this.objectives.length; i++) {
      this.objectives[i].show();
    }
    for (var i = 0; i < this.barriers.length; i++) {
      this.barriers[i].show();
    }
  }
}
