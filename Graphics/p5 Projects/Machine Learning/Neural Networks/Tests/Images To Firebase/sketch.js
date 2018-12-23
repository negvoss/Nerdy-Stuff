var fileExt = ".png";
function setup() {
  noCanvas();
  setupFirebase();
  for (let i = 0; i < 400; i++) {
    let char = "a";
    let img = loadImage("images/" + char + "_" + i + ".png",function() {
      console.log(img);
    });
  }

  let images = [];
  // loadImage("images/*.png",function(data) {
  //   console.log(data);
  // });

  // refTraining.push({
  //   id:userFeedback.value(),
  //   convolvedPixels:convolvedPixels
  // });
}
