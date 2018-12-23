let aaronImg;
let heartImg;
let pompomImg;
let scaleFactor;
let currentX;
let currentY;

const items = [];
const itemList = ["heart","pompom"];
let itemCounter = 0;
let gravity;
let timer = 0;

const stars = [];

function preload() {
  aaronImg = loadImage("images/aaron.png");
  heartImg = loadImage("images/heart.png");
  pompomImg = loadImage("images/pompom.png");
  scaleFactor = aaronImg.width*6;
  gravity = createVector(0,0.2);
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  createStars(70);
}

function draw() {
  for (star of stars) {
    star.update();
    star.show();
  }
  if (frameCount % 90 == 0 || frameCount == 1) {
    currentX = random(width - aaronImg.width/scaleFactor);
    currentY = random(height/3,height - aaronImg.height/scaleFactor);
    createItems(10,currentX,currentY,itemList[itemCounter%itemList.length]);
    itemCounter++;
  }
  image(aaronImg,currentX,currentY,aaronImg.width/scaleFactor,aaronImg.height/scaleFactor);
  showAndUpdate();
  timer += 0.1;
}

const createItems = function(count,x,y,type) {
  for (let i = 0; i < count; i++) {
    const item = new Item(x,y,type);
    items.push(item);
  }
}

const createStars = function(count) {
  for (let i = 0; i < count; i++) {
    const star = new Star();
    stars.push(star);
  }
}

const showAndUpdate = function() {
  for (let i = items.length - 1; i > 0; i--) {
    const item = items[i];
    item.show();
    item.update();
    if (item.pos.y > height) {
      items.splice(i,1);
    }
  }
}

const Item = function(x,y,type) {
  this.pos = createVector(x,y);
  this.vel = createVector(random(-1.5,1.5),random(-1,-3)).mult(5);
  switch (type) {
    case "heart":
    this.img = heartImg;
    break;
    case "pompom":
    this.img = pompomImg;
  }
  this.show = function() {
    image(this.img,this.pos.x,this.pos.y);
  }
  this.update = function() {
    this.vel.add(gravity);
    this.pos.add(this.vel);
  }
}

const Star = function() {
  this.x = random(width);
  this.y = random(height*3/4);
  this.r;
  this.phase = random(0,TWO_PI);
  this.period = random(0.1,4);
  this.show = function() {
    noStroke();
    fill(255);
    ellipse(this.x,this.y,this.r);
  }
  this.update = function() {
    this.r = this.period*sin(timer + this.phase) + 2;
  }
}
