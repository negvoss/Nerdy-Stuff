function Tentacle() {
  this.points = [];

  this.createPoints = function() {
    for (var i = 0; i < 10; i++) {
      if (i == 0) {
        this.points.push(new Point(width/2,height - 20,null));
      }
      else {
        var prev = this.points[i - 1];
        this.points.push(new Point(width/2,prev.y - 20,prev));
        prev.child = this.points[i];
      }
    }
  }

  this.show = function() {
    for (var i = 0; i < this.points.length; i++) {
      var current = this.points[i];
      current.show();
      if (i == this.points.length - 1) {
        current.x = mouseX;
        current.y = mouseY;
      }

      if (current.parent != undefined) {
        push();
        var x = current.parent.x;
        var y = current.parent.y;
        translate(x,y);
        var connection = createVector(current.x,current.y);
        if (connection.mag() > 20) {
          console.log(connection.mag());
          current.parent.x = connection.x*0.97;
          current.parent.y = connection.y*0.97;
        }
        pop();
      }
    }
  }
}
