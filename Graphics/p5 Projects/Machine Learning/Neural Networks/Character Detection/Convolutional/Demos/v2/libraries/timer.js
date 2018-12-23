let frmRt;
let timing;
let timer;
const startTimer = function() {
  timing = true;
}
const resetTimer = function() {
  timing = false;
  timer = frmRt*2;
}
resetTimer();

const updateTimer = function() {
  if (timing) {
    timer--;
    if (timer <= 0) {
      evaluate();
      resetTimer();
    }
  }
}
