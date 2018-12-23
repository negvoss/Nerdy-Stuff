function Marker(lon,lat,mag,x,y,d) {
  this.lon = lon;
  this.lat = lat;
  this.mag = mag;
  this.currency = currency*1;
  this.x = x + (width - 10) / 2;
  this.y = y + (height - buffer) / 2;
  this.d = d;

  this.show = function() {
    noStroke();
    fill(50,150,170);
    rect(0,512,1024,buffer);
    stroke(0);
    strokeWeight(4);
    noFill();
    rect(5,517,1014,buffer - 10);
    fill(0);
    noStroke();
    textSize(40);
    text("Longitude:" + this.lon,10,567);
    text("Latitude:" + this.lat,10,607);
    text("Magnitude:" + this.mag,10,647);
    text("Occured " + this.currency + " days ago.",10,687);
  }
}
