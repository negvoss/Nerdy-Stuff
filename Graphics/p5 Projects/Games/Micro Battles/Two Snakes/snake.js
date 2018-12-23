function Snake(id) {
  this.id = id;
  this.angle = this.id*PI;
  this.direction = 1;
  this.centerX = width/2 + 120*(this.id - 0.5);
  this.centerY = height/2;
  this.prevLocations = [];

  this.update = function() {
    this.angle += this.direction*0.1*(this.id - 0.5);
    this.x = this.centerX + 40*cos(this.angle);
    this.y = this.centerY + 40*sin(this.angle);
    if (this.x < 0) {
      this.x += width;
      this.centerX += width;
    }
    if (this.x > width) {
      this.x -= width;
      this.centerX -= width;
    }
    if (this.y < 0) {
      this.y += height;
      this.centerY += height;
    }
    if (this.y > height) {
      this.y -= height;
      this.centerY -= height;
    }
    textSize(60);
    textAlign(CENTER);
    if (this.id == 0) {
      let arrToSearch = snake1.prevLocations;
      if (this.prevLocations.length > 10) arrToSearch = arrToSearch.concat(this.prevLocations.slice(this.prevLocations.length - 11,10));
      for (let i = 0; i < arrToSearch.length; i++) {
        if (dist(this.x,this.y,arrToSearch[i].x,arrToSearch[i].y) < 3) {
          text("Green Wins!",width/2,200);
          noLoop();
        }
      }
    } else {
      let arrToSearch = snake0.prevLocations;
      if (this.prevLocations.length > 10) arrToSearch = arrToSearch.concat(this.prevLocations.slice(this.prevLocations.length - 11,10));
      for (let i = 0; i < arrToSearch.length; i++) {
        if (dist(this.x,this.y,arrToSearch[i].x,arrToSearch[i].y) < 3) {
          text("Red Wins!",width/2,200);
          noLoop();
        }
      }
    }
    this.prevLocations.push({
      x:this.x,
      y:this.y
    });
    if (this.prevLocations.length > 100) {
      this.prevLocations.splice(0,1);
    }
  }

  this.show = function() {
    noStroke();
    if (this.id == 0) {
      fill(255,0,0);
    } else {
      fill(0,255,0);
    }
    ellipse(this.x,this.y,20);
    for (let i = 0; i < this.prevLocations.length; i++) {
      ellipse(this.prevLocations[i].x,this.prevLocations[i].y,20);
    }
  }
}
