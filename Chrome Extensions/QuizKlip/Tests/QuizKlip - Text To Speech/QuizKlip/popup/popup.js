// language selection setup
const languageCombos = {};
// information about each language
let languageInfo;
window.onload = function() {
  const body = document.getElementsByTagName("body")[0];
  const h1 = document.getElementsByTagName("h1")[0];
  const terms = document.getElementById("terms");
  const termControls = document.getElementById("termControls");
  const backgroundPage = chrome.extension.getBackgroundPage();

  // add rows to table with buttons to remove, and fromWord + toWord from background page
  for (let i = 0; i < backgroundPage.terms.length; i++) {
    const term = backgroundPage.terms[i];
    const row = document.createElement("tr");
    const removeButtonTd = document.createElement("td");
    removeButtonTd.style.width = "50px";
    const removeButton = document.createElement("button");
    removeButton.style.width = "20px";
    removeButton.style.height = "20px";
    removeButton.style.backgroundImage = "url(" + chrome.extension.getURL("popup/images/delete_term.png") + ")";
    removeButton.style.backgroundSize = "100%";
    removeButton.onclick = function() {
      const currentRow = removeButton.parentNode.parentNode;
      const msg = {
        messageType:"removeTerm",
        term: {
          term:currentRow.children[1].textContent.replace(/\t/,"").replace(/\n/,""),
          definition:currentRow.children[2].textContent.replace(/\t/,"").replace(/\n/,"")
        }
      };
      chrome.runtime.sendMessage(msg);
      currentRow.parentNode.removeChild(currentRow);
      if (terms.getElementsByTagName("tr").length == 0) clearButton.onclick();
      if (terms.getElementsByTagName("tr").length <= 1) {
        createSetButton.disabled = true;
      }
    }
    removeButtonTd.appendChild(removeButton);
    const fromWord = document.createElement("td");
    fromWord.textContent = term.term + "\t";
    const toWord = document.createElement("td");
    toWord.style.float = "right";
    if (backgroundPage.selectedLanguage.to == "Hebrew") {
      toWord.style.direction = "rtl";
    }
    toWord.textContent = term.definition + "\n";
    row.appendChild(removeButtonTd);
    row.appendChild(fromWord);
    row.appendChild(toWord);
    terms.appendChild(row);
  }

  // controls for using and manipulating terms
  document.getElementById("buttonAndLogo").insertBefore(createDivider(5),document.getElementById("logo"));

  const clearButton = document.createElement("button");
  clearButton.style.height = "30px";
  const copyButton = document.createElement("button");
  copyButton.style.height = "30px";
  const createSetButton = document.createElement("button");
  createSetButton.style.height = "30px";
  termControls.appendChild(clearButton);
  termControls.appendChild(createDivider(5));
  termControls.appendChild(copyButton);
  termControls.appendChild(createDivider(5));
  termControls.appendChild(createSetButton);
  clearButton.title = "Clear Terms List";
  clearButton.textContent = "Clear List";
  clearButton.onclick = function() {
    const msg = {
      messageType:"clear"
    };
    chrome.runtime.sendMessage(msg);
    for (row of document.getElementsByTagName("tr")) {
      row.hidden = true;
    }
    clearButton.disabled = true;
    copyButton.disabled = true;
    createSetButton.disabled = true;
    createNoTermsMsg();
  }
  copyButton.title = "Copy Terms List To Clipboard";
  copyButton.textContent = "Copy To Clipboard";
  copyButton.onclick = function() {
    // create table offscreen with text to copy inside, then select and copy
    const copyText = document.createElement("table");
    copyText.style.position = "absolute";
    copyText.style.top = "10000px";
    for (row of terms.getElementsByTagName("tr")) {
      const newRow = document.createElement("tr");
      const fromWord = document.createElement("td");
      const toWord = document.createElement("td");
      fromWord.textContent = row.children[1].textContent.trim();
      toWord.textContent = row.children[2].textContent.trim();
      newRow.appendChild(fromWord);
      newRow.appendChild(toWord);
      copyText.appendChild(newRow);
    }
    document.body.appendChild(copyText);
    selectElementContents(copyText);
    document.execCommand("Copy");
    selectElementContents(terms);
  }
  createSetButton.id = "createSetButton";
  createSetButton.title = "Post Terms List To New Quizlet Set";
  createSetButton.textContent = "Create Quizlet Set";
  createSetButton.onclick = function() {
    // get authorization code by logging in to quizlet
    const state = randomString(15);
    const msg = {
      messageType:"state",
      state:state
    };
    chrome.runtime.sendMessage(msg);
    window.open("https://quizlet.com/authorize?response_type=code&client_id=XznwJH3w5h&scope=write_set&redirect_uri=" + chrome.extension.getURL("create-set-redirect/create-set-redirect.html") + "&state=" + state);
    window.close();
  }
  if (backgroundPage.terms.length > 0) {
    document.getElementById("noTermsMsg").parentNode.removeChild(document.getElementById("noTermsMsg"));
    clearButton.disabled = false;
    copyButton.disabled = false;
  } else {
    clearButton.disabled = true;
    copyButton.disabled = true;
  }
  if (backgroundPage.terms.length > 1) {
    createSetButton.disabled = false;
  } else {
    createSetButton.disabled = true;
  }
  // language selection setup
  const fromSelector = document.getElementById("from");
  fromSelector.addEventListener("change",function() {
    removeToOptions();
    createToOptions();
    sendLanguageSelection();
  });
  const toSelector = document.getElementById("to");
  toSelector.addEventListener("change",function() {
    sendLanguageSelection();
  });
  // hotkey selection setup
  for (let i = 0; i < document.getElementsByClassName("hotkeySelector").length; i++) {
    const selector = document.getElementsByClassName("hotkeySelector")[i];
    selector.value = backgroundPage.hotkeys[i];
    selector.addEventListener("change",function() {
      checkDuplicateAltKey();
      const keys = [];
      for (sel of document.getElementsByClassName("hotkeySelector")) {
        keys.push(Number(sel.value));
      }
      const msg = {
        messageType:"hotkey_selection",
        keys:keys
      };
      chrome.runtime.sendMessage(msg);
    });
  }
  checkDuplicateAltKey();
  // enable extension checkbox setup
  const enable = document.getElementById("enable");
  enable.checked = backgroundPage.enabled;
  enable.addEventListener("change",function() {
    const msg = {
      messageType:"enable",
      state:enable.checked
    };
    chrome.runtime.sendMessage(msg);
  });
  // language selection setup
  loadJSON(chrome.extension.getURL("languageInfo.json"),function(data) {
    // setup list of to languages for each from language
    languageInfo = data;
    const defaultFrom = backgroundPage.selectedLanguage.from;
    const defaultTo = backgroundPage.selectedLanguage.to;
    for (packet of languageInfo.dictInfo) {
      if (!languageCombos[packet.from]) languageCombos[packet.from] = [];
      languageCombos[packet.from].push(packet.to);
    }
    // create to options
    for (key of Object.keys(languageCombos)) {
      const selected = (key == defaultFrom);
      fromSelector.options.add(new Option(key,null,null,selected));
    }
    createToOptions(defaultTo);
    sendLanguageSelection();
  });
  document.getElementById("instructions").onclick = function() {
    window.open(chrome.extension.getURL("instructions/instructions.html"));
  }
  const createNoTermsMsg = function() {
    const noTermsMsg = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = "Term List Empty";
    td.style.fontSize = "20px";
    noTermsMsg.appendChild(td);
    terms.appendChild(noTermsMsg);
  }
}

// create small dividers to go between elements
const createDivider = function(spacing) {
  const divider = document.createElement("span");
  divider.style.padding = spacing + "px";
  return divider;
}

// If alt selected, make alt disabled on second hotkey selector (alt + alt doesn't work)
const checkDuplicateAltKey = function() {
  const selector0 = document.getElementsByClassName("hotkeySelector")[0];
  const selector1 = document.getElementsByClassName("hotkeySelector")[1];
  if (selector0.value == 18) {
    selector1.options[0].disabled = true;
    if (selector1.value == 18) {
      selector1.options.selectedIndex++;
    }
  } else {
    selector1.options[0].disabled = false;
  }
}

// send language selection to background page
const sendLanguageSelection = function() {
  const fromSelector = document.getElementById("from");
  const toSelector = document.getElementById("to");
  const msg = {
    messageType:"language_selection",
    from:fromSelector.options[fromSelector.options.selectedIndex].textContent,
    to:toSelector.options[toSelector.options.selectedIndex].textContent
  }
  chrome.runtime.sendMessage(msg);
}

const createToOptions = function(selectedOption) {
  const fromSelector = document.getElementById("from");
  const toSelector = document.getElementById("to");
  for (toOption of languageCombos[fromSelector.options[fromSelector.options.selectedIndex].textContent]) {
    let to = toOption;
    let selected = (to == selectedOption);
    toSelector.options.add(new Option(to,null,null,selected));
  }
}

const removeToOptions = function() {
  const toSelector = document.getElementById("to");
  while (toSelector.options.length > 0) {
    toSelector.remove(0);
  }
}

// select contents of element (used for copying terms)
const selectElementContents = function(elt) {
  const range = document.createRange();
  range.selectNodeContents(elt);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

const loadJSON = function(url,callback) {
   const xobj = new XMLHttpRequest();
   xobj.overrideMimeType("application/json");
   xobj.open("GET", url, true);
   xobj.onreadystatechange = function() {
     if (xobj.readyState == 4 && xobj.status == "200") {
       callback(JSON.parse(xobj.responseText));
     }
   }
   xobj.send(null);
}

// random string for Quizlet Security
const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const randomString = function(len) {
  let text = "";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random()*possible.length));
  }
  return text;
}
