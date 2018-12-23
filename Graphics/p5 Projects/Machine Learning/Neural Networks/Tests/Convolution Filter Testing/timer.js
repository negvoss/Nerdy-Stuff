let frmRt;
let timing;
let timer;
const resetTimer = function() {
  timing = false;
  timer = frmRt*2;
}
const startTimer = function() {
  timing = true;
}
resetTimer();

const updateTimer = function() {
  if (timing) {
    timer--;
    if (timer <= 0) {
      updateImage();
      convolve();
      resetTimer();
    }
  }
}
