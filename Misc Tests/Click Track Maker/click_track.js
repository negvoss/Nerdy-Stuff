let small_beat = new Audio("sound/small_beat.wav");
let big_beat = new Audio("sound/big_beat.wav");


let beatNumber = 0;
let beatList = [];


let timeSignatureInput;
let bigSubdivision;
let smallSubdivision;
let tempoInput;
let relativeTempo;
let playButton;
let tempoMultiplier;
let stopButton;
let measureStart;
let measureMaker;
let addMeasure;
let numToAdd;
let measureTable;
let saveTrack;
let uploadZone;

window.onload = function() {
  timeSignatureInput = document.getElementById("timeSignature");
  timeSignatureInput.onchange = function() {
    const numberOfBeats = Number(timeSignatureInput.value.split("/")[0]);
    createMeasureMaker(numberOfBeats);

    bigSubdivision.value = 1;
    smallSubdivision.value = numberOfBeats;
  }

  bigSubdivision = document.getElementById("bigSubdivision");
  smallSubdivision = document.getElementById("smallSubdivision");

  bigSubdivision.onchange = function() {
    for (let i = 1; i < measureMaker.children[0].children.length; i++) {
      if ((i - 1)%(Number(timeSignatureInput.value.split("/")[0])/Number(bigSubdivision.value)) == 0) {
        let bigChecked = false;
        for (const option of document.getElementsByName("beat" + i)) {
          if (option.value == "big") {
            option.checked = true;
          } else {
            option.checked = false;
          }
        }
      } else {
        let smallChecked = false;
        for (const option of document.getElementsByName("beat" + i)) {
          if (option.value == "small" && option.checked) {
            smallChecked = true;
          }
          if (option.value == "none" && !smallChecked) {
            option.checked = true;
          }
        }
      }
    }
  }

  smallSubdivision.onchange = function() {
    for (let i = 1; i < measureMaker.children[0].children.length; i++) {
      if ((i - 1)%(Number(timeSignatureInput.value.split("/")[0])/Number(smallSubdivision.value)) == 0) {
        let bigChecked = false;
        for (const option of document.getElementsByName("beat" + i)) {
          if (option.value == "big" && option.checked) {
            bigChecked = true;
          }
          if (option.value == "small" && !bigChecked) {
            option.checked = true;
          }
        }
      } else {
        let bigChecked = false;
        for (const option of document.getElementsByName("beat" + i)) {
          if (option.value == "big" && option.checked) {
            bigChecked = true;
          }
          if (option.value == "none" && !bigChecked) {
            option.checked = true;
          }
        }
      }
    }
  }

  measureMaker = document.getElementById("measureMaker");
  addMeasure = document.getElementById("addButton");

  addMeasure.onclick = function() {
    for (let x = 0; x < Number(numToAdd.value); x++) {
      updateMeasureTable();

      for (let i = 0; i < Number(timeSignatureInput.value.split("/")[0]); i++) {
        let beatType;
        const beatOptions = document.getElementsByName("beat" + (i + 1));
        for (let j = 0; j < beatOptions.length; j++) {
          if (beatOptions[j].checked) {
            beatType = beatOptions[j].value;
          }
        }
        beatList.push({
          beatType:beatType,
          delay:(1/Number(relativeTempo.value.split("/")[0])/Number(tempoInput.value))*60000*Number(relativeTempo.value.split("/")[1])/Number(timeSignatureInput.value.split("/")[1])
        });
      }
    }
  }

  numToAdd = document.getElementById("numToAdd");

  measureTable = document.getElementById("measures");
  saveTrack = document.getElementById("saveTrack");

  saveTrack.onclick = function() {
    const clickTrack = [];
    let beatIndex = 0;
    for (let i = 0; i < measureTable.children[0].children[1].children.length; i++) {
      const tempo = measureTable.children[0].children[1].children[i].textContent;
      const timeSignature = measureTable.children[0].children[2].children[i].textContent;
      const count = measureTable.children[0].children[3].children[i].textContent;

      const beatTypes = [];
      for (let j = beatIndex; j < beatIndex + count*Number(timeSignature.split("/")[0]); j++) {
        beatTypes[j - beatIndex] = beatList[j].beatType;
      }

      beatIndex += count*Number(timeSignature.split("/")[0]);

      clickTrack.push({
        tempo:tempo,
        timeSignature:timeSignature,
        count:count,
        beatTypes:beatTypes
      });
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clickTrack));
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href",dataStr);
    downloadLink.setAttribute("download","track.json");
    downloadLink.click();
  }

  uploadZone = document.getElementById("uploadZone");

  uploadZone.ondragover = function(e) {
    uploadZone.style.backgroundColor = "gray";
    e.preventDefault();
    e.stopPropagation();
  }
  uploadZone.ondragleave = function(e) {
    uploadZone.style.backgroundColor = "initial";
    e.preventDefault();
    e.stopPropagation();
  }
  uploadZone.ondrop = function(e) {
    uploadZone.ondragleave(e);
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsText(file);
    }
    reader.onload = function() {
      const uploadedClickTrack = JSON.parse(reader.result);
      createmeasureTable(uploadedClickTrack);
    }
  }


  tempoInput = document.getElementById("tempo");
  relativeTempo = document.getElementById("relativeTempo");

  measureStart = document.getElementById("measureStart");
  playButton = document.getElementById("playButton");
  playButton.onclick = function() {
    const measureNumber = Number(measureStart.value);
    beatNumber = 0;

    let measureCount = 0;
    let i = 0;
    while (measureCount < measureNumber - 1) {
      const numMeasures = Number(measureTable.children[0].children[3].children[i].textContent);
      const beatsPerMeasure = Number(measureTable.children[0].children[2].children[i].textContent.split("/")[0]);
      for (let j = 0; j < numMeasures && measureCount < measureNumber - 1; j++) {
        beatNumber += beatsPerMeasure;
        measureCount++;
      }
      i++;
    }
    beat();
  }

  tempoMultiplier = document.getElementById("tempoMultiplier");

  stopButton = document.getElementById("stopButton");
  stopButton.onclick = function() {
    clearTimeout(nextBeat);
    beatNumber = 0;
  }
}

let last;
let nextBeat;
const beat = function() {
  if (beatList[beatNumber]) {
    switch(beatList[beatNumber].beatType) {
      case "big":
        big_beat.play();
      break;
      case "small":
        small_beat.play();
      break;
    }
    if (beatNumber < beatList.length) {
      nextBeat = setTimeout(beat, (1/(Number(tempoMultiplier.value)/100))*beatList[beatNumber].delay);
      beatNumber++;
    }
  } else {
    // reset beat index and play big beat on downbeat after track
    beatNumber = 0;
    big_beat.play();
  }
}


const createMeasureMaker = function(numberOfBeats) {
  measureMaker.innerHTML = "";
  measureMaker.id = "measureMaker";

  const measureMakerBody = document.createElement("tbody");
  const headerRow = document.createElement("tr");
  const header1 = document.createElement("td");
  const header2 = document.createElement("td");
  header1.textContent = "Beat";
  header2.textContent = "Big/Small/No Beat";
  headerRow.appendChild(header1);
  headerRow.appendChild(header2);
  measureMakerBody.appendChild(headerRow);

  for (let i = 0; i < numberOfBeats; i++) {
    const beatRow = document.createElement("tr");
    const beatNumber = document.createElement("td");
    const beatType = document.createElement("td");
    beatNumber.textContent = i + 1;


    const bigBeatOption = document.createElement("input");
    bigBeatOption.type = "radio";
    bigBeatOption.value = "big";
    if (i == 0) {
      bigBeatOption.checked = true;
    }
    bigBeatOption.name = "beat" + (i + 1);

    const smallBeatOption = document.createElement("input");
    smallBeatOption.type = "radio";
    smallBeatOption.value = "small";
    if (i != 0) {
      smallBeatOption.checked = true;
    }
    smallBeatOption.name = "beat" + (i + 1);

    const noBeatOption = document.createElement("input");
    noBeatOption.type = "radio";
    noBeatOption.value = "none";
    noBeatOption.name = "beat" + (i + 1);


    beatType.appendChild(bigBeatOption);
    beatType.appendChild(smallBeatOption);
    beatType.appendChild(noBeatOption);

    beatRow.appendChild(beatNumber);
    beatRow.appendChild(beatType);
    measureMakerBody.appendChild(beatRow);
  }
  measureMaker.appendChild(measureMakerBody);
}



const createmeasureTable = function(clickTrack) {
  measureTable.innerHTML = "";
  measureTable.appendChild(document.createElement("tbody"));

  for (let i = 0; i < 4; i++) {
    measureTable.children[0].appendChild(document.createElement("tr"));
  }

  beatList = [];


  for (const section of clickTrack) {
    const measureNumber = document.createElement("td");
    let measureCount = 1;
    for (let i = 0; i < measureTable.children[0].children[3].children.length; i++) {
      measureCount += Number(measureTable.children[0].children[3].children[i].textContent);
    }
    measureNumber.textContent = measureCount;
    measureTable.children[0].children[0].appendChild(measureNumber);
    const tempo = document.createElement("td");
    tempo.textContent = section.tempo;
    measureTable.children[0].children[1].appendChild(tempo);
    const timeSignature = document.createElement("td");
    timeSignature.textContent = section.timeSignature;
    measureTable.children[0].children[2].appendChild(timeSignature);
    const count = document.createElement("td");
    count.textContent = section.count;
    measureTable.children[0].children[3].appendChild(count);

    let lastTempo;
    for (let i = measureTable.children[0].children[1].children.length - 1; i >= 0; i--) {
      if (measureTable.children[0].children[1].children[i].textContent != "") {
        lastTempo = measureTable.children[0].children[1].children[i].textContent;
        break;
      }
    }

    for (let i = 0; i < Number(section.count)*Number(section.timeSignature.split("/")[0]); i++) {
      beatList.push({
        beatType:section.beatTypes[i],
        delay:(1/Number(lastTempo.split("/")[0])/Number(lastTempo.split("= ")[1]))*60000*Number(lastTempo.split("/")[1].split(" note")[0])/Number(section.timeSignature.split("/")[1])
      })
    }
  }
}



const updateMeasureTable = function() {
  let lastTempo;
  for (let i = measureTable.children[0].children[1].children.length - 1; i >= 0; i--) {
    if (measureTable.children[0].children[1].children[i].textContent != "") {
      lastTempo = measureTable.children[0].children[1].children[i].textContent;
      break;
    }
  }
  let lastTimeSignature;
  for (let i = measureTable.children[0].children[2].children.length - 1; i >= 0; i--) {
    if (measureTable.children[0].children[2].children[i].textContent != "") {
      lastTimeSignature = measureTable.children[0].children[2].children[i].textContent;
      break;
    }
  }

  if (lastTempo && relativeTempo.value + " note = " + tempoInput.value == lastTempo && timeSignatureInput.value == lastTimeSignature) {
    measureTable.children[0].children[3].children[measureTable.children[0].children[3].children.length - 1].textContent = Number(measureTable.children[0].children[3].children[measureTable.children[0].children[3].children.length - 1].textContent) + 1;
  } else {

    const measureNumber = document.createElement("td");
    let measureCount = 1;
    for (let i = 0; i < measureTable.children[0].children[3].children.length; i++) {
      measureCount += Number(measureTable.children[0].children[3].children[i].textContent);
    }
    measureNumber.textContent = measureCount;

    const tempo = document.createElement("td");
    if (relativeTempo.value + " note = " + tempoInput.value != lastTempo) {
      tempo.textContent = relativeTempo.value + " note = " + tempoInput.value;
    }

    const timeSignature = document.createElement("td");
    timeSignature.textContent = timeSignatureInput.value;
    const count = document.createElement("td");
    count.textContent = "1";


    measureTable.children[0].children[0].appendChild(measureNumber);
    measureTable.children[0].children[1].appendChild(tempo);
    measureTable.children[0].children[2].appendChild(timeSignature);
    measureTable.children[0].children[3].appendChild(count);
  }
}
