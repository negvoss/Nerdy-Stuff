const filterSize = 5;
let rawFilter = new Array(Math.pow(filterSize,2));
let filters = [];
for (let i = 0; i < rawFilter.length; i++) {
  rawFilter[i] = 0;
}
const filterRange = 10;
const createFilterInputs = function() { // set-up filter grid interface
  for (let i = 0; i < rawFilter.length; i++) {
    if (i%filterSize == 0) {
      createDiv("");
    }
    const inp = createInput();
    inp.elt.id = String(i);
    inp.value(String(rawFilter[i]));
    inp.elt.style.width = "80px";
    inp.elt.style.height = "80px";
    inp.elt.style.textAlign = "center";
    updateFilterBoxColor(inp);
    inp.elt.style.cursor = "url(cursors/red.cur),auto";
    inp.changed(function() {
      if (Number(inp.value()) || inp.value() == "0") {
        inp.value(round(Number(inp.value()))); // format numbers
        if (inp.value() > filterRange) inp.value(filterRange);
        if (inp.value() < -filterRange) inp.value(-filterRange);
        rawFilter[i] = Number(inp.value());
        updateFilterBoxColor(inp);
      } else {
        inp.value("0");
        rawFilter[i] = Number(inp.value());
        updateFilterBoxColor(inp);
      }
    });
  }
}

const updateFilterBoxes = function() {
  for (let i = 0; i < rawFilter.length; i++) {
    let inp = select("#" + String(i));
    inp.value(String(rawFilter[i]));
    updateFilterBoxColor(inp);
  }
}

const updateFilterBoxColor = function(inp) {
  const backCol = round(map(Number(inp.value()),-filterRange,filterRange,0,255)); // for color contrast
  let textCol = 255 - backCol;
  if (textCol > 100 && textCol < 150) textCol = 0;
  inp.elt.style.backgroundColor = "rgb(" + backCol + "," + backCol + "," + backCol + ")";
  inp.elt.style.color = "rgb(" + textCol + "," + textCol + "," + textCol + ")";
}

const normalize = function(f) { // normalize filter
  let sum = 0;
  for (let i = 0; i < f.length; i++) {
    sum += f[i];
  }
  if (sum == 0) {
    select("#normalize").checked(false);
    return f;
  }
  const normalizedFilter = new Array(f.length);
  for (let i = 0; i < f.length; i++) {
    normalizedFilter[i] = f[i]/sum;
  }
  return normalizedFilter;
}

function setFilter(x,y,val) { // set filter values programatically
  rawFilter[(x - 1) + (y - 1)*filterSize] = val;
}
