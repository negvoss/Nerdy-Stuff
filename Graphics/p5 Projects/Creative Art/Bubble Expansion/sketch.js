var bubbles = [];

var xwid = 1000;
var ywid = 600;
var song;



var bubblecount = 35;


function preload() {
  song = loadSound("blop.mp3");
}

function setup() {

  createCanvas(xwid, ywid);



  for (var i = 0; i < bubblecount; i++) {
    bubbles.push(new Bubble(random(0,xwid),random(0,ywid),30));
  }

/*
  for (var i = 0; i < bubblecount; i++) {
    bubbles.push(new Bubble(xwid/2,ywid/2,30));
  }
*/

}




function draw() {
  //sleep(200);

  background(0,0,150,100);

  var createBubble = false;
  for (var i = 0; i < bubbles.length; i++) {
    for (var j = 0; j < bubbles.length; j++) {
      if (dist(bubbles[i].x,bubbles[i].y,bubbles[j].x,bubbles[j].y) < bubbles[i].radius*0.90 + bubbles[j].radius*0.90 && bubbles[i] != bubbles[j]) {
        var newbubble = new Bubble((bubbles[i].x + bubbles[j].x)/2,(bubbles[i].y + bubbles[j].y)/2, Math.sqrt(pow(bubbles[i].radius,2) + pow(bubbles[j].radius,2)));
        createBubble = true;
        var removeIndex_1 = i;
        var removeIndex_2 = j;
      }
    }
  }
  if (createBubble) {
    if (removeIndex_1 > removeIndex_2) {
      //console.log('hi');
      bubbles.splice(removeIndex_1,1);
      bubbles.splice(removeIndex_2,1);
    }
    else {
      bubbles.splice(removeIndex_2,1);
      bubbles.splice(removeIndex_1,1);
      //console.log('hi');
    }
    bubbles.push(newbubble);
    song.setVolume(pow(newbubble.radius,2)/(10000*PI));
    song.play();
  }

  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display();
  }
}














function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
