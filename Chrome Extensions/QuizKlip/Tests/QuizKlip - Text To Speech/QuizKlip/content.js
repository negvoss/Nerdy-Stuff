let languageInfo;

// get various data from background page
let enabled = true;
let msg = {
  messageType:"enable"
};
chrome.runtime.sendMessage(msg);
let activationKeys = [];
msg = {
  messageType:"hotkey_selection"
};
chrome.runtime.sendMessage(msg);
let selectedLanguage;
msg = {
  messageType:"selectedLanguage"
};
chrome.runtime.sendMessage(msg);
chrome.runtime.onMessage.addListener(function(msg) {
  switch(msg.messageType) {
    case "enable":
    enabled = msg.state;
    if (!enabled) {
      const definitionBox = document.getElementById("definitionBox");
      if (definitionBox) {
        definitionBox.parentNode.removeChild(definitionBox);
      }
    }
    break;
    case "hotkey_selection":
    activationKeys = msg.keys;
    break;
    case "language_selection":
    selectedLanguage = msg.language;
    break;
    case "selectedLanguage":
    selectedLanguage = msg.selectedLanguage;
    break;
    case "searchResults":
    createDefinitionBox(msg.originalTerm,msg.terms);
    break;
    case "removeTerm":
    if (msg.term) {
      // if term exists, remove it from definition box
      for (row of document.getElementsByClassName("definitionBoxRow")) {
        const term = row.children[1].textContent;
        const definition = row.children[2].textContent;
        if (msg.term.term == term && msg.term.definition == definition) {
          row.children[0].checked = false;
        }
      }
    }
    sendUpdateNumTermsMsg();
    break;
    case "clear":
    for (row of document.getElementsByClassName("definitionBoxRow")) {
      row.children[0].checked = false;
    }
    sendUpdateNumTermsMsg();
    break;
    // ask bakcground page for current number of terms on terms list
    case "numberOfTerms":
    updateNumTermsMsg(msg);
  }
});

// prevent default action on link clicking
for (link of document.getElementsByTagName("a")) {
  link.onclick = function(e) {
    if (activate()) e.preventDefault();
  }
}

// search for word
window.addEventListener("mouseup",function(e) {
  if (e.button == 0 && activate() && !clickedOnDefinitionBox(e)) {
    const s = window.getSelection();
    s.modify("extend","backward","word");
    const b = s.toString();
    s.modify("extend","forward","word");
    const a = s.toString();
    s.modify("move","forward","character");
    const term = trim(b + a);
    if (term.length > 0) {
      const msg = {
        messageType:"search",
        term:term
      }
      chrome.runtime.sendMessage(msg);
      createSearchingMsg();
    }
  }
  if (!clickedOnDefinitionBox(e)) {
    clearDefinitionBox();
  }
});
// On tab switch:
// clear cursor
// clear current keys pressed (prevent keys from "locking")
// remove definition box + searching msg
document.addEventListener("visibilitychange",function() {
  document.body.style.cursor = "";
  keys = [];
  const definitionBox = document.getElementById("definitionBox");
  const searchingMsg = document.getElementById("searchingMsg");
  if (definitionBox) {
    definitionBox.parentNode.removeChild(definitionBox);
  }
  if (searchingMsg) {
    searchingMsg.parentNode.removeChild(searchingMsg);
  }
});

// keep track of mouse position and scrolling for definition box placement
let mouseX = 0;
let mouseY = 0;
let verticalScroll = 0;
let horizontalScroll = 0;

window.addEventListener("mousemove",function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  verticalScroll = e.pageY - e.clientY;
  horizontalScroll = e.pageX - e.clientX;
  keys = [];
});

// keep track of keys pressed for activation
let keys = [];
window.addEventListener("keydown",function(e) {
  if (!keys.includes(e.keyCode)) {
    keys.push(e.keyCode);
  }
  if (activate()) {
    // show QuizKlip logo on activation
    document.body.style.cursor = "url(" + chrome.extension.getURL("cursors/cursor_activate.cur") + "),auto";
    // prevent default action when alt key pressed
    if (e.altKey) {
      e.preventDefault();
    }
  }
});

window.addEventListener("keyup",function(e) {
  if (keys.includes(e.keyCode)) {
    keys.splice(keys.indexOf(e.keyCode),1);
  }
  if (!activate()) {
    // reset cursor if it shouldn't be on
    document.body.style.cursor = "";
  }
});

const getCodesPressed = function(arr) {
  const keyCodesPressed = [];
  arr.forEach(function(code) {
    if (typeof code == "number") {
      keyCodesPressed[keyCodesPressed.length] = code;
    }
  });
  return keyCodesPressed;
}

const keyIsDown = function(code) {
  return getCodesPressed(keys).includes(code) || code == null;
}

// whether QuizKlip should activate
const activate = function() {
  for (key of activationKeys) {
    if (!keyIsDown(key)) return false;
  }
  return enabled;
}

// create box with search results
const createDefinitionBox = function(originalTerm,terms) {
  clearDefinitionBox();
  const definitionBox = document.createElement("div");
  definitionBox.removeAttribute("style");
  const searchingMsg = document.getElementById("searchingMsg");
  definitionBox.id = "definitionBox";
  definitionBox.style.zIndex = "10000";
  definitionBox.style.border = "solid";
  definitionBox.style.backgroundColor = "orange";
  definitionBox.style.padding = "5px";
  definitionBox.style.paddingRight = "15px";
  definitionBox.style.width = "475px";
  definitionBox.style.position = "absolute";
  if (searchingMsg) {
    definitionBox.style.left = searchingMsg.style.left;
    definitionBox.style.top = searchingMsg.style.top;
  } else {
    definitionBox.style.left = mouseX + "px";
    definitionBox.style.top = mouseY + 25 + "px";
  }
  document.body.appendChild(definitionBox);
  const topRow = document.createElement("div");
  topRow.removeAttribute("style");
  topRow.style.direction = "ltr";
  // text with searched word
  const header = document.createElement("span");
  header.removeAttribute("style");
  header.style.position = "relative";
  header.style.left = "45px";
  header.style.direction = "ltr";
  header.style.fontFamily = "Arial";
  header.style.fontStyle = "Italic";
  header.style.fontSize = "20px";
  header.textContent = originalTerm;
  topRow.appendChild(header);
  // Text that says Results from... and the online dictionary used to find the results
  const resultsFrom = document.createElement("span");
  resultsFrom.removeAttribute("style");
  resultsFrom.style.float = "right";
  resultsFrom.style.fontFamily = "Arial";
  resultsFrom.style.fontSize = "12px";
  resultsFrom.textContent = "Results from ";
  const dictionaryFrom = document.createElement("a");
  dictionaryFrom.removeAttribute("style");
  dictionaryFrom.target = "_blank";
  dictionaryFrom.style.fontFamily = "Arial";
  dictionaryFrom.style.fontSize = "12px";
  if (selectedLanguage.url == "http://www.morfix.co.il/") {
    dictionaryFrom.textContent = "www.morfix.co.il";
  } else {
    dictionaryFrom.textContent = "www.wordreference.com";
  }
  dictionaryFrom.href = selectedLanguage.url + trim(originalTerm);
  resultsFrom.appendChild(dictionaryFrom);
  resultsFrom.innerHTML += ".";
  topRow.appendChild(resultsFrom);
  definitionBox.appendChild(topRow);
  // text that says "Select the terms you wish to add to yout list"
  const selectTerms = document.createElement("p");
  selectTerms.removeAttribute("style");
  selectTerms.style.direction = "ltr";
  selectTerms.style.fontFamily = "Arial";
  selectTerms.style.position = "relative";
  selectTerms.style.left = "45px";
  selectTerms.style.fontSize = "12px";
  selectTerms.textContent = "Select the terms you wish to add to your list.";
  definitionBox.appendChild(selectTerms);
  definitionBox.appendChild(createLineBreak(15));
  const languageHeaders = document.createElement("div");
  languageHeaders.removeAttribute("style");
  const fromLanguage = document.createElement("span");
  fromLanguage.removeAttribute("style");
  fromLanguage.style.position = "relative";
  fromLanguage.style.left = "45px";
  fromLanguage.style.float = "left";
  fromLanguage.style.fontFamily = "Arial";
  fromLanguage.style.textDecoration = "underline";
  fromLanguage.style.fontSize = "10px";
  fromLanguage.textContent = selectedLanguage.from;
  languageHeaders.appendChild(fromLanguage);
  const toLanguage = document.createElement("span");
  toLanguage.removeAttribute("style");
  toLanguage.style.float = "right";
  toLanguage.style.fontFamily = "Arial";
  toLanguage.style.textDecoration = "underline";
  toLanguage.style.fontSize = "10px";
  toLanguage.textContent = selectedLanguage.to;
  languageHeaders.appendChild(toLanguage);
  definitionBox.appendChild(languageHeaders);
  definitionBox.appendChild(createLineBreak(25));
  // create rows in definition box with checkcboxes to add terms, fromWords, and toWords
  if (terms.length > 0) {
    for (term of terms) {
      const row = document.createElement("div");
      row.removeAttribute("style");
      row.className = "definitionBoxRow";
      row.style.direction = "ltr";
      row.style.fontFamily = "Arial";
      row.style.fontSize = "12px";
      if (selectedLanguage.from != "Hebrew") {
        const speak = document.createElement("button");
        speak.removeAttribute("style");
        speak.style.width = "15px";
        speak.style.height = "15px";
        speak.style.backgroundImage = "url(" + chrome.extension.getURL("images/speaker.png") + ")";
        speak.style.backgroundSize = "100%";
        speak.onclick = function() {
          const msg = {
            messageType:"speak",
            voice:languageInfo.voices[selectedLanguage.from],
            text:speak.parentNode.children[2].textContent
          };
          chrome.runtime.sendMessage(msg);
        }
        row.appendChild(speak);
      }
      const checkBox = document.createElement("input");
      checkBox.removeAttribute("style");
      checkBox.type = "checkbox";
      checkBox.className = "termCheckbox";
      checkBox.checked = term.alreadyAdded;
      checkBox.addEventListener("change",function() {
        const term = checkBox.parentNode.children[1].textContent;
        const definition = checkBox.parentNode.children[2].textContent;
        let msg;
        if (checkBox.checked) {
          msg = {
            messageType:"term",
            term:term,
            definition:definition
          };
        } else {
          msg = {
            messageType:"removeTerm",
            term: {
              term:term,
              definition:definition
            }
          };
        }
        chrome.runtime.sendMessage(msg);
        sendUpdateNumTermsMsg();
      });
      const from = document.createElement("span");
      from.removeAttribute("style");
      from.style.position = "absolute";
      from.style.left = "50px";
      from.textContent = term.term;
      const to = document.createElement("span");
      to.removeAttribute("style");
      if (selectedLanguage.to == "Hebrew") {
        to.style.direction = "rtl";
      }
      to.textContent = term.definition;
      to.style.float = "right";
      row.appendChild(checkBox);
      row.appendChild(from);
      if (selectedLanguage.from != "Hebrew") {
        const speak = document.createElement("button");
        speak.removeAttribute("style");
        speak.style.width = "15px";
        speak.style.height = "15px";
        speak.style.float = "right";
        speak.style.backgroundImage = "url(" + chrome.extension.getURL("images/speaker.png") + ")";
        speak.style.backgroundSize = "100%";
        speak.onclick = function() {
          const msg = {
            messageType:"speak",
            voice:languageInfo.voices[selectedLanguage.to],
            text:speak.parentNode.children[speak.parentNode.children.length - 1].textContent
          };
          chrome.runtime.sendMessage(msg);
        }
        row.appendChild(speak);
      }
      row.appendChild(to);
      definitionBox.appendChild(row);
    }
  } else {
    // if no terms, create text that says "No Results"
    const noResultsMsg = document.createElement("p");
    noResultsMsg.removeAttribute("style");
    noResultsMsg.style.fontFamily = "Arial";
    noResultsMsg.style.fontSize = "12px";
    noResultsMsg.textContent = "No Results";
    noResultsMsg.align = "center";
    definitionBox.appendChild(noResultsMsg);
  }
  definitionBox.appendChild(createLineBreak());
  const bottomRow = document.createElement("p");
  bottomRow.removeAttribute("style");
  bottomRow.style.direction = "ltr";
  // text that says how many terms are in the list, + instructions on how to view them
  const numTermsMsg = document.createElement("span");
  numTermsMsg.removeAttribute("style");
  numTermsMsg.id = "numTermsMsg";
  numTermsMsg.style.position = "relative";
  numTermsMsg.style.left = "45px";
  numTermsMsg.style.float = "left";
  numTermsMsg.style.fontFamily = "Arial";
  numTermsMsg.style.fontSize = "12px";
  sendUpdateNumTermsMsg();
  bottomRow.appendChild(numTermsMsg);
  const logo = document.createElement("img");
  logo.removeAttribute("style");
  logo.style.width = "40px";
  logo.style.height =  "40px";
  logo.style.float = "right";
  logo.src = chrome.extension.getURL("logos/logo128x128.png");
  bottomRow.appendChild(logo);
  definitionBox.appendChild(bottomRow);
  // reposition box if out of view
  if (!inViewVertical(definitionBox)) {
    const top = Number(definitionBox.style.top.split("px")[0]);
    definitionBox.style.top = top - definitionBox.clientHeight - 50 + "px";
    if (!inViewVertical(definitionBox)) {
      definitionBox.style.top = top - (definitionBox.clientHeight + 50)/2 + "px";
    }
  }
  if (!inViewHorizontal(definitionBox)) {
    const left = Number(definitionBox.style.left.split("px")[0]);
    definitionBox.style.left = left - definitionBox.clientWidth + "px";
    if (!inViewHorizontal(definitionBox)) {
      definitionBox.style.left = left + definitionBox.clientWidth/2 + "px";
    }
  }
  if (searchingMsg) {
    clearSearchingMsg();
  }
}

const createLineBreak = function(spacing) {
  const br = document.createElement("br");
  br.removeAttribute("style");
  if (spacing) {
    br.style.lineHeight = spacing + "px";
  }
  return br;
}

const clearDefinitionBox = function() {
  const box = document.getElementById("definitionBox");
  if (box) {
    box.parentNode.removeChild(box);
  }
}

// check if clicked on definitionbox
const clickedOnDefinitionBox = function(e) {
  const box = document.getElementById("definitionBox");
  if (box) {
    let target = e.target;
    while (target.parentNode) {
      if (target == box) return true;
      target = target.parentNode;
    }
    return false;
  }
}

// create message that says "Searching" in between start of search and search results
const createSearchingMsg = function() {
  clearSearchingMsg();
  const searchingMsg = document.createElement("div");
  searchingMsg.removeAttribute("style");
  searchingMsg.id = "searchingMsg";
  searchingMsg.style.fontFamily = "Arial";
  searchingMsg.style.fontSize = "20px";
  searchingMsg.style.direction = "ltr";
  searchingMsg.style.zIndex = "10000";
  searchingMsg.style.border = "solid";
  searchingMsg.style.backgroundColor = "orange";
  searchingMsg.style.padding = "15px";
  searchingMsg.style.width = "350px";
  searchingMsg.style.position = "absolute";
  searchingMsg.style.left = mouseX + "px";
  searchingMsg.style.top = mouseY + 25 + "px";
  searchingMsg.textContent = "Searching...";
  document.body.appendChild(searchingMsg);
  if (!inViewVertical(searchingMsg)) {
    const top = Number(searchingMsg.style.top.split("px")[0]);
    searchingMsg.style.top = top - searchingMsg.clientHeight - 50 + "px";
    if (!inViewVertical(searchingMsg)) {
      searchingMsg.style.top = top - (searchingMsg.clientHeight + 50)/2 + "px";
    }
  }
  if (!inViewHorizontal(searchingMsg)) {
    const left = Number(searchingMsg.style.left.split("px")[0]);
    searchingMsg.style.left = left - searchingMsg.clientWidth + "px";
    if (!inViewHorizontal(searchingMsg)) {
      searchingMsg.style.left = left + searchingMsg.clientWidth/2 + "px";
    }
  }
}

const clearSearchingMsg = function() {
  const msg = document.getElementById("searchingMsg");
  if (msg) {
    msg.parentNode.removeChild(msg);
  }
}

// ask background page for number of terms
const sendUpdateNumTermsMsg = function() {
  const msg = {
    messageType:"numberOfTerms",
  }
  chrome.runtime.sendMessage(msg);
}

// update message in top-right of definition box with new number of terms
const updateNumTermsMsg = function(msg) {
  const numTermsMsg = document.getElementById("numTermsMsg");
  if (numTermsMsg) {
    if (msg.numTerms > 0) {
      const popupImg = document.createElement("img");
      popupImg.style.width = "15px";
      popupImg.style.height =  "15px";
      popupImg.style.display = "inline-block";
      popupImg.src = chrome.extension.getURL("logos/logo128x128.png");
      if (msg.numTerms > 1) {
        numTermsMsg.textContent = "To view your " + msg.numTerms + " terms, click on the ";
      } else {
        numTermsMsg.textContent = "To view your " + msg.numTerms + " term, click on the ";
      }
      numTermsMsg.appendChild(popupImg);
      numTermsMsg.appendChild(createLineBreak());
      numTermsMsg.innerHTML += "icon in the top-right corner of Chrome.";
    } else {
      numTermsMsg.textContent = "Your list has 0 terms.";
    }
  }
}

// check if element is in view of the screen
const inViewVertical = function(elt) {
  const docViewTop = verticalScroll;
  const docViewBottom = docViewTop + window.innerHeight;
  const eltTop = Number(elt.style.top.split("px")[0]);
  const eltBottom = eltTop + elt.clientHeight;
  return eltBottom <= docViewBottom && eltTop >= docViewTop;
}

const inViewHorizontal = function(elt) {
  const docViewLeft = horizontalScroll;
  const docViewRight = docViewLeft + window.innerWidth;
  const eltLeft = Number(elt.style.left.split("px")[0]);
  const eltRight = eltLeft + elt.clientWidth;
  return eltRight <= docViewRight && eltLeft >= docViewLeft;
}

const trim = function(word) {
  if (word.split(" ").length > 4) return "";
  return word.split(",")[0].split(";")[0].split("'")[0].replace(/\t/,"").trim();
}

const loadJSON = function(url,callback) {
   const xobj = new XMLHttpRequest();
   xobj.overrideMimeType("application/json");
   xobj.open('GET', url, true);
   xobj.onreadystatechange = function() {
     if (xobj.readyState == 4 && xobj.status == "200") {
       callback(JSON.parse(xobj.responseText));
     }
   }
   xobj.send(null);
}

loadJSON(chrome.extension.getURL("languageInfo.json"),function(data) {
  if (data) {
    languageInfo = data;
  }
});
