// get various data from background page
let enabled = true;
let activate = false;
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
      clearDefinitionBox(true);
    }
    break;
    case "hotkey_selection":
    activationKeys = msg.keys;
    break;
    case "language_selection":
    if (selectedLanguage != undefined) {
      if (!(selectedLanguage.to == msg.language.to && selectedLanguage.from == msg.language.from)) {
        window.location.reload();
      }
    }
    // selectedLanguage = msg.language;
    break;
    case "selectedLanguage":
    selectedLanguage = msg.selectedLanguage;
    setupArticleWords();
    break;
    case "searchResults":
    createDefinitionBox(msg.originalTerm,msg.terms,msg.wrongLanguage);
    break;
    case "removeTerm":
    if (msg.term) {
      // if term exists, remove it from definition box
      if (definitionBox) {
        for (row of definitionBox.getElementsByClassName("definitionBoxRow")) {
          const term = row.children[1].textContent;
          const definition = row.children[2].textContent;
          if (msg.term.term == term && msg.term.definition == definition) {
            row.children[0].checked = false;
            row.children[0].disabled = false;
            row.children[0].title = "Select Term";
          }
        }
      }
    }
    sendUpdateNumTermsMsg();
    break;
    // ask bakcground page for current number of terms on terms list
    case "numberOfTerms":
    updateNumTermsMsg(msg);
  }
});

const textNodesUnder = function(el) {
  let n;
  const allNodes = [];
  const walker = document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while (n = walker.nextNode()) {
    allNodes.push(n);
  }
  return allNodes;
}

const setupArticleWords = function() {
  const supportedTags = ["H1","H2","H3","H4","H5","H6","P","DIV","SPAN","B","I","EM","SMALL","LI","TD","FONT"];
  for (const textBlock of textNodesUnder(document)) {
    if (textBlock.parentNode) {
      if (supportedTags.includes(textBlock.parentNode.tagName)) {
        if (textBlock.parentNode.className != "articleWord") {
          const newTextBlock = document.createElement("span");
          if (supportedTags.includes(textBlock.parentNode.tagName)) {
            const newTextBlock = document.createElement("span");
            if (selectedLanguage.from != "Chinese") {
              newTextBlock.innerHTML = textBlock.textContent.replace(/([^ -@[-`{-¿ʹ-΢ֈ-֐，\n\s]+)/g,"<span class = 'articleWord' style = 'border-radius:5px'>$1</span>");
            } else {
              newTextBlock.innerHTML = textBlock.textContent.replace(/([^ -@[-`{-¿ʹ-΢ֈ-֐，\n\s])/g,"<span class = 'articleWord'>$1</span>");
            }
            if (newTextBlock.getElementsByClassName("articleWord").length > 0) {
              textBlock.parentNode.replaceChild(newTextBlock,textBlock);
            }
          }
        }
      }
    }
  }

  for (const word of document.getElementsByClassName("articleWord")) {
    const originalColor = word.style.backgroundColor;
    word.onmousemove = function() {
      if (enabled && selectionLength == 0) {
        word.style.backgroundColor = "rgb(207,202,148)";
        activate = true;
        document.body.style.cursor = "url(" + chrome.extension.getURL("cursors/cursor_activate.cur") + "),auto";
      }
    }
    word.onmouseout = function() {
      word.style.backgroundColor = originalColor;
      activate = false;
      document.body.style.cursor = "auto";
    }

    let clickCount = 0;
    word.addEventListener("click",function(e) {
      if (activate) {
        clickCount++;
        switch(clickCount) {
          case 1:
          clickTimer = setTimeout(function() {
            clickCount = 0;
            if (activate) {
              if (e.button == 0) {
                const msg = {
                  messageType:"search",
                  term:word.textContent
                };
                chrome.runtime.sendMessage(msg);
              }
            }
          },250);
          break;
          case 2:
          clickCount = 0;
          clearTimeout(clickTimer);
        }
      }
    });
  }
}

let selectionLength = 0;
document.addEventListener("selectionchange",function(e) {
  selectionLength = window.getSelection().toString().length;
  if (selectionLength > 0) {
    activate = false;
    document.body.style.cursor = "";
    for (const word of document.getElementsByClassName("articleWord")) {
      word.onmouseout();
    }
  }
});


// search for word
document.addEventListener("mouseup",function(e) {
  if (!clickedOnDefinitionBox(e)) {
    if (definitionBoxWrapper) {
      if (definitionBoxWrapper.parentNode) {
        if (definitionBox) {
          const addTerms = definitionBoxWrapper.contentDocument.getElementById("addTerms");
          addTerms.onclick();
          clearDefinitionBox(false);
        }
      }
    }
  }
});

// On tab switch:
// clear cursor
// clear current keys pressed (prevent keys from "locking")
// remove definition box
document.addEventListener("visibilitychange",function() {
  document.body.style.cursor = "";
  keys = [];
  const definitionBoxWrapper = document.getElementById("definitionBoxWrapper");
  if (definitionBoxWrapper) {
    definitionBoxWrapper.parentNode.removeChild(definitionBoxWrapper);
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
  if (!activate) {
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

let definitionBoxWrapper;
let definitionBox;

// create box with search results
const createDefinitionBox = function(originalTerm,terms,wrongLanguage) {
  clearDefinitionBox(false);
  definitionBoxWrapper = document.createElement("iframe");
  definitionBoxWrapper.id = "definitionBoxWrapper";
  definitionBoxWrapper.frameBorder = "0";
  definitionBoxWrapper.style.zIndex = "1000000000000";
  definitionBoxWrapper.style.width = "550px";
  definitionBoxWrapper.style.height = "380px";
  definitionBoxWrapper.style.maxWidth = "610px";
  definitionBoxWrapper.style.maxHeight = "440px";
  definitionBoxWrapper.style.position = "absolute";
  definitionBoxWrapper.scrolling = "no";
  definitionBoxWrapper.style.left = mouseX - 45 + "px";
  definitionBoxWrapper.style.top = mouseY + 25 + "px";
  document.body.appendChild(definitionBoxWrapper);

  const definitionBoxHtml = `
    <head>
      <style>
        #definitionBox {
          height:78%;
          border:solid;
          border-width:2px;
          border-radius:10px;
          background-color:honeydew;
          padding:3%;
        }

        #topRow {
          direction:ltr;
        }

        #resultsFrom {
          font-family:Arial;
          font-size:12px;
          color:black;
        }

        #dictionaryFrom {
          font-family:Arial;
          font-size:12px;
          color:dark-blue;
        }

        #results {
          margin-top:2.4%;
          padding:2.2%;
          padding-right:4%;
          height:70%;
          background-color:palegoldenrod;
          background-repeat:no-repeat;
          background-size:20%;
          background-position:center center;
        }

        #header {
          position:relative;
          left:2%;
          text-align:center;
          direction:ltr;
          font-family:Arial;
          font-style:Italic;
          font-size:20px;
          color:black;
        }

        #languageHeaders {
          margin-bottom:2%;
        }

        #fromLanguage {
          position:relative;
          left:5.6%;
          float:left;
          font-family:Arial;
          font-size:20px;
          color:black;
          text-decoration:underline;
        }

        #toLanguage {
          float:right;
          position:relative;
          right:1%;
          font-family:Arial;
          font-size:20px;
          color:black;
          text-decoration:underline;
        }

        .definitionBoxRow {
          position:relative;
          left:-1%;
          height:12%;
          direction:ltr;
          font-family:Arial;
          font-size:17px;
        }

        .termCheckbox {
          position:relative;
          top:-15%;
          width:20px;
          height:20px;
        }

        .fromWord {
          position:absolute;
          left:6.7%;
          color:black;
        }

        .toWord {
          float:right;
          color:black;
        }

        #noResultsMsg {
          position:relative;
          margin-bottom:10%;
          left:12%;
          font-family:Arial;
          font-size:12px;
          color:black;
        }

        #popupImg {
          width:15px;
          height:15px;
          display:inline-block;
        }

        #wrongLanguageMsg {
          position:relative;
          left:12%;
          width:90%;
          font-family:Arial;
          font-size:12px;
          color:black;
        }

        #addTermsContainer {
          position:absolute;
          bottom:16.5%;
          left:4.8%;
          text-align:center;
        }

        #addTerms {
          font-family:Arial;
          font-size:15px;
          font-weight:bold;
          color:white;
          border:solid;
          border-width:1px;
          border-radius:3px;
          border-color:Transparent;
          background-color:#2196F3;
          width:15vw;
          height:6vw;
        }

        #addTerms:disabled {
          opacity:0.5;
          cursor:default;
        }

        #cancelButtonContainer {
          position:absolute;
          bottom:16.5%;
          left:22%;
          text-align:center;
        }

        #cancelButton {
          font-family:Arial;
          font-size:15px;
          font-weight:bold;
          color:black;
          border:solid;
          border-width:1px;
          border-radius:3px;
          border-color:Transparent;
          background-color:#CCC;
          width:15vw;
          height:6vw;
        }

        #numTermsMsg {
          position:absolute;
          top:3.5%;
          text-align:right;
          right:5%;
          height:7%;
          width:35%;
          line-height:13px;
          font-family:Arial;
          font-size:12px;
          direction:ltr;
          color:black;
        }

        button:focus {
          outline:none
        }

        button:hover {
          cursor:pointer;
        }

        #quizKlipEnabled {
          position:absolute;
          width:30%;
          left:39%;
          bottom:19%;
          font-family:Arial;
          font-size:15px;
          color:black;
        }

        .switch {
          position:absolute;
          left:62%;
          bottom:19%;
          display:inline-block;
          width:5.5%;
          height:4.3%;
        }

        .switch input {
          display:none;
        }

        .slider {
          position:absolute;
          cursor:pointer;
          top:0px;
          left:0px;
          right:0px;
          bottom:0px;
          background-color:#CCC;
          -webkit-transition:0.4s;
          transition:0.4s;
        }

        .slider:before {
          position:absolute;
          content:"";
          height:13px;
          width:13px;
          left:2px;
          bottom:13%;
          background-color:white;
          -webkit-transition:0.4s;
          transition:0.4s;
        }

        input:checked + .slider {
          background-color:#2196F3;
        }

        input:focus + .slider {
          box-shadow: 0px 0px 1px #2196F3;
        }

        input:checked + .slider:before {
          -webkit-transform:translateX(13px);
          -ms-transform:translateX(13px);
          transform:translateX(13px);
        }

        .slider.round {
          border-radius:34px;
        }

        .slider.round:before {
          border-radius:50%;
        }
      </style>
    </head>
    <body>
      <div id = "definitionBox">
        <div id = "topRow">
          <span id = "resultsFrom">Results from <a id = "dictionaryFrom" target = _blank></a></span>
        </div>
        <div id = "results">
          <div id = "header"></div>
          <div id = "languageHeaders">
            <span id = "fromLanguage"></span>
            <span id = "toLanguage"></span>
          </div>
          <br style = "line-height:25px">
          <p id = "noResultsMsg" align = left></p>
          <p id = "wrongLanguageMsg" align = left></p>
          <span id = "quizKlipEnabled">QuizKlip Enabled: </span>
          <label id = "toggleExtension" class = "switch">
            <input type = "checkbox" checked></input>
            <span class = "slider round"></span>
          </label>
        </div>
        <div id = "addTermsContainer">
          <button id = "addTerms" title = "Add Selected Terms To List" disabled>Add</button>
        </div>
        <div id = "cancelButtonContainer">
          <button id = "cancelButton" title = "Cancel">Cancel</button>
        </div>
        <div id = "numTermsMsg"></div>
      </div>
    </body>
  `;
  definitionBoxWrapper.contentDocument.documentElement.innerHTML = definitionBoxHtml;
  definitionBox = definitionBoxWrapper.contentDocument.getElementById("definitionBox");

  const dictionaryFrom = definitionBoxWrapper.contentDocument.getElementById("dictionaryFrom");
  if (selectedLanguage.url == "http://www.morfix.co.il/") {
    dictionaryFrom.textContent = "morfix.co.il";
  } else {
    dictionaryFrom.textContent = "wordreference.com";
  }
  dictionaryFrom.href = selectedLanguage.url + trim(originalTerm);

  const results = definitionBoxWrapper.contentDocument.getElementById("results");
  results.style.backgroundImage = "url(" + chrome.extension.getURL("images/background_logo.png") + ")";

  const header = definitionBoxWrapper.contentDocument.getElementById("header");
  header.textContent = originalTerm;


  const languageHeaders = definitionBoxWrapper.contentDocument.getElementById("languageHeaders");
  const noResultsMsg = definitionBoxWrapper.contentDocument.getElementById("noResultsMsg");
  const wrongLanguageMsg = definitionBoxWrapper.contentDocument.getElementById("wrongLanguageMsg");

  if (terms.length > 0) {
    noResultsMsg.parentNode.removeChild(noResultsMsg);
    wrongLanguageMsg.parentNode.removeChild(wrongLanguageMsg);
    const fromLanguage = definitionBoxWrapper.contentDocument.getElementById("fromLanguage");
    fromLanguage.textContent = selectedLanguage.from;
    const toLanguage = definitionBoxWrapper.contentDocument.getElementById("toLanguage");
    toLanguage.textContent = selectedLanguage.to;
    // create rows in definition box with checkcboxes to add terms, fromWords, and toWords
    for (term of terms) {
      const row = document.createElement("div");
      row.className = "definitionBoxRow";
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.checked = term.alreadyAdded;
      checkBox.disabled = term.alreadyAdded;
      checkBox.className = "termCheckbox";
      if (term.alreadyAdded) {
        checkBox.title = "Term Already Added";
      } else {
        checkBox.title = "Select Term";
      }
      checkBox.onchange = function() {
        if (checkBox.checked) {
          addTerms.disabled = false;
        } else {
          let anyChecked = false;
          for (const box of definitionBoxWrapper.contentDocument.getElementsByClassName("termCheckbox")) {
            if (box.checked && !box.disabled) {
              anyChecked = true;
            }
          }
          addTerms.disabled = !anyChecked;
        }
      }
      const from = document.createElement("span");
      from.className = "fromWord";
      from.textContent = term.term;

      const to = document.createElement("span");
      to.className = "toWord";
      if (selectedLanguage.to == "Hebrew") {
        to.style.direction = "rtl";
      }
      to.textContent = term.definition;

      row.onclick = function(e) {
        if (!checkBox.disabled && !clickedOnCheckbox(e)) {
          checkBox.checked = !checkBox.checked;
          checkBox.onchange();
        }
      }

      row.appendChild(checkBox);
      row.appendChild(from);
      row.appendChild(to);
      results.appendChild(row);
    }
  } else {
    languageHeaders.parentNode.removeChild(languageHeaders);
    let dictionaryName;
    if (selectedLanguage.url == "http://www.morfix.co.il/") {
      dictionaryName = "Morfix";
    } else {
      dictionaryName = "Wordreference";
    }
    noResultsMsg.textContent = dictionaryName + "'s " + selectedLanguage.from + " to " + selectedLanguage.to + " dictionary did not include " + "'" + originalTerm + ".'";
    // if no terms, and user suspected of having wrong language settings, create notification
    if (wrongLanguage) {
      wrongLanguageMsg.textContent = "Did you mean to translate from " + selectedLanguage.to + " to " + selectedLanguage.from + "?";
      wrongLanguageMsg.appendChild(createLineBreak());
      wrongLanguageMsg.innerHTML += "Adjust translation settings from ";
      const popupImg = document.createElement("img");
      popupImg.id = "popupImg";
      popupImg.src = chrome.extension.getURL("logos/logo128x128.png");
      wrongLanguageMsg.appendChild(popupImg);
      wrongLanguageMsg.innerHTML += " in the top-right corner of Chrome";
      results.appendChild(wrongLanguageMsg);
    } else {
      wrongLanguageMsg.parentNode.removeChild(wrongLanguageMsg);
    }
  }
  definitionBox.appendChild(results);
  const addTerms = definitionBoxWrapper.contentDocument.getElementById("addTerms");
  addTerms.onclick = function() {
    for (row of definitionBox.getElementsByClassName("definitionBoxRow")) {
      if (row.children[0].checked && !row.children[0].disabled) {
        row.children[0].disabled = true;
        row.children[0].title = "Term Already Added";
        let msg = {
          messageType:"term",
          term:row.children[1].textContent,
          definition:row.children[2].textContent
        };
        chrome.runtime.sendMessage(msg);
        flyUp(row);
      }
    }
    clearDefinitionBox(true);
    sendUpdateNumTermsMsg();
  }
  sendUpdateNumTermsMsg();
  const cancelButton = definitionBoxWrapper.contentDocument.getElementById("cancelButton");
  cancelButton.onclick = function() {
    clearDefinitionBox(true);
  }

  const toggleExtension = definitionBoxWrapper.contentDocument.getElementById("toggleExtension");
  toggleExtension.onclick = function() {
    const msg = {
      messageType:"enable",
      state:false
    };
    chrome.runtime.sendMessage(msg);
  }

  // reposition box if out of view
  const top = Number(definitionBoxWrapper.style.top.split("px")[0]);
  definitionBoxWrapper.style.top = top + shiftVertical(definitionBoxWrapper) + "px";
  const left = Number(definitionBoxWrapper.style.left.split("px")[0]);
  definitionBoxWrapper.style.left = left + shiftHorizontal(definitionBoxWrapper) + "px";
}

const createLineBreak = function(spacing) {
  const br = document.createElement("br");
  if (spacing) {
    br.style.lineHeight = spacing + "px";
  }
  return br;
}

const clearDefinitionBox = function(fade) {
  const box = document.getElementById("definitionBoxWrapper");
  if (box) {
    // make box unclickable
    box.style.pointerEvents = "none";
    // turn off slider as box fades
    box.contentDocument.getElementById("toggleExtension").children[0].checked = false;
    if (fade) {
      fadeOut(box,function() {
        if (box.parentNode) {
          box.parentNode.removeChild(box);
        }
      });
    } else {
      box.parentNode.removeChild(box);
    }
  }
}

// check if clicked on definitionbox
const clickedOnDefinitionBox = function(e) {
  const box = document.getElementById("definitionBox");
  if (box) {
    let target = e.target;
    while (target.parentNode) {
      if (target == box) {
        return true;
      }
      target = target.parentNode;
    }
    return false;
  }
}

const clickedOnCheckbox = function(e) {
  const boxes = document.getElementById("definitionBoxWrapper").contentDocument.getElementsByClassName("termCheckbox");
  for (const box of boxes) {
    let target = e.target;
    while (target.parentNode) {
      if (target == box) {
        return true;
      }
      target = target.parentNode;
    }
  }
  return false;
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
  if (definitionBoxWrapper.contentDocument) {
    const numTermsMsg = definitionBoxWrapper.contentDocument.getElementById("numTermsMsg");
    if (numTermsMsg) {
      if (msg.numTerms > 0) {
        const popupImg = document.createElement("img");
        popupImg.id = "popupImg";
        popupImg.src = chrome.extension.getURL("logos/logo128x128.png");
        if (msg.numTerms > 1) {
          numTermsMsg.textContent = "To view your " + msg.numTerms + " terms, click ";
        } else {
          numTermsMsg.textContent = "To view your " + msg.numTerms + " term, click ";
        }
        numTermsMsg.appendChild(popupImg);
        numTermsMsg.innerHTML += " in the top-right corner of Chrome";
      } else {
        numTermsMsg.textContent = "Your list has 0 terms.";
      }
    }
  }
}

// check if element is in view of the screen
const shiftBuffer = 50;
const shiftVertical = function(elt) {
  const docViewTop = verticalScroll + shiftBuffer;
  const docViewBottom = docViewTop + window.innerHeight;
  const eltTop = Number(elt.style.top.split("px")[0]);
  const eltBottom = eltTop + elt.clientHeight;
  if (eltBottom > docViewBottom) return docViewBottom - eltBottom;
  if (eltTop < docViewTop) return docViewTop - eltTop;
  return 0;
}

const shiftHorizontal = function(elt) {
  const docViewLeft = horizontalScroll + shiftBuffer;
  const docViewRight = docViewLeft + window.innerWidth - 2*shiftBuffer;
  const eltLeft = Number(elt.style.left.split("px")[0]);
  const eltRight = eltLeft + elt.clientWidth;
  if (eltRight > docViewRight) return docViewRight - eltRight;
  if (eltLeft < docViewLeft) return docViewLeft - eltLeft;
  return 0;
}

const trim = function(word) {
  if (word.split(" ").length > 4) return "";
  return word.split(",")[0].split(";")[0].split("'")[0].replace(/\t/,"").trim();
}

const fadeOut = function(elt,callback,speed) {
  if (elt.style.opacity == "") {
    elt.style.opacity = 1;
  }
  if (!speed) {
    speed = 0.2;
  }
  if (elt.style.opacity > 0) {
    elt.style.opacity -= speed;
    setTimeout(function() {
      fadeOut(elt,callback,speed);
    },80);
  } else {
    elt.style.opacity = 0;
    elt.hidden = true;
    if (callback) {
      callback();
    }
  }
}

const flyUp = function(row) {
  const rowToAnimate = document.createElement(row.tagName);
  rowToAnimate.innerHTML = row.innerHTML;
  rowToAnimate.removeChild(rowToAnimate.children[2]);
  rowToAnimate.removeChild(rowToAnimate.children[0]);
  document.body.appendChild(rowToAnimate);
  const definitionBoxWrapper = document.getElementById("definitionBoxWrapper");
  rowToAnimate.style.position = "absolute";
  rowToAnimate.style.top = row.getBoundingClientRect().top + Number(definitionBoxWrapper.style.top.split("px")[0]) + "px";
  rowToAnimate.style.left = row.children[1].getBoundingClientRect().right + Number(definitionBoxWrapper.style.left.split("px")[0]) + "px";
  rowToAnimate.style.zIndex = "1000000000000";
  rowToAnimate.style.fontSize = "25px";
  const topChange = (Number(rowToAnimate.style.top.split("px")[0]) - verticalScroll + 50);
  const leftChange = screen.width - Number(rowToAnimate.style.left.split("px")[0]) - horizontalScroll - 150;
  let repetitions = 0;
  const moveUp = function(rowToAnimate) {
    repetitions++;
    if (Number(rowToAnimate.style.top.split("px")[0]) > verticalScroll - 20) {
      rowToAnimate.style.top = Number(rowToAnimate.style.top.split("px")[0]) + -Math.pow(topChange,repetitions/200) + "px";
      rowToAnimate.style.left = Number(rowToAnimate.style.left.split("px")[0]) + (leftChange/topChange)*Math.pow(leftChange,repetitions/200) + "px";
      setTimeout(function() {
        moveUp(rowToAnimate);
      },3);
    } else {
      rowToAnimate.parentNode.removeChild(rowToAnimate);
    }
  }
  moveUp(rowToAnimate);
  fadeOut(rowToAnimate,null,0.08);
}
