var textlist;
var index = 0;
var t;
var backgroundColor;
var wordColor;

function preload() {
  textlist = loadStrings("text.txt");
}

function setup() {
  backgroundColor = color(0,150,200);
  wordColor = color(255,153,100);
  createCanvas(window.displayWidth,window.innerHeight);
  fill(wordColor);
  textSize(70);
  textAlign(CENTER);
  shortenText();
}

function draw() {
  if (frameCount%6 == 0) {
    index++;
  }
  noStroke();
  displayText();

  stroke(0);
  strokeWeight(8);
  line(width/2,0,width/2,height/2 - 100);
  line(width/2,height,width/2,height/2 + 50);
}



function displayText() {
  background(backgroundColor);
  if (index == textlist.length) {
    background(backgroundColor);
    fill(255,0,0);
    text("FINISHED",width/2,height/2);
    noLoop();
    return;
  }
  t = textlist[index];
  text(t,width/2,height/2);
  if (t.includes('.') || t.includes('!') || t.includes('?')) {
    frameRate(30);
  } else {
    if (t.includes(',') || t.includes(';') || t.includes('-')) {
      frameRate(45);
    } else {
      frameRate(60);
    }
  }
}


function shortenText() {
  while(textlist.length > 1) {
    textlist[0] = textlist[0].concat(textlist[1]);
    textlist.splice(1,1);
  }
  textlist = textlist[0].replace("\n"," ").replace("\r"," ").replace(".",". ").replace("  "," ").split(" ");
}


function keyPressed() {
  if (key == " ") {
    noLoop();
  }
  if (keyCode == RETURN) {
    loop();
  }
  if (keyCode == LEFT_ARROW) {
    index--;
    displayText();
  }
  if (keyCode == RIGHT_ARROW) {
    index++;
    displayText();
  }
}
