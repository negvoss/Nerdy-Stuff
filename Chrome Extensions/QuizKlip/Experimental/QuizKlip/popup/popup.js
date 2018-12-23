// language selection setup
const languageCombos = {};
// information about each language
let languageInfo;

let selectedTerms = [];
let lastRowClicked = -1;

window.onload = function() {
  const body = document.getElementsByTagName("body")[0];
  const h1 = document.getElementsByTagName("h1")[0];
  const terms = document.getElementById("terms");
  const termControls = document.getElementById("termControls");
  const backgroundPage = chrome.extension.getBackgroundPage();

  // display current version number of QuizKlip
  document.getElementById("version").textContent = "QuizKlip Version " + chrome.runtime.getManifest().version;

  const selectAll = document.getElementById("selectAll");
  const termsDeleted = document.getElementById("termsDeleted");
  const termsCopied = document.getElementById("termsCopied");

  selectAll.onclick = function() {
    for (row of terms.getElementsByClassName("tableRow")) {
      if (selectAll.checked) {
        select(row);
      } else {
        unSelect(row);
      }
    }
  }

  // add rows to table with buttons to remove, and fromWord + toWord from background page
  for (let i = 0; i < backgroundPage.terms.length; i++) {
    const term = backgroundPage.terms[i];
    const row = document.createElement("div");
    row.className = "tableRow";
    row.rowNumber = i;
    const selectCheckboxTd = document.createElement("td");
    selectCheckboxTd.className = "selectCheckboxTd";
    const selectCheckboxContainer = document.createElement("label");
    selectCheckboxContainer.className = "selectCheckboxContainer";
    const selectCheckbox = document.createElement("input");
    selectCheckbox.type = "checkbox";
    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    selectCheckbox.className = "selectCheckbox";
    selectCheckbox.onclick = function(e) {
      if (!selectCheckbox.checked) {
        unSelect(row);
      } else {
        if (e.shiftKey && lastRowClicked != -1 && lastRowClicked != row.rowNumber) {
          const direction = Math.sign(row.rowNumber - lastRowClicked);
          for (let j = lastRowClicked; j != row.rowNumber + direction; j += direction) {
            const currentRow = terms.getElementsByClassName("tableRow")[j];
            select(currentRow);
          }
        } else {
          select(row);
        }
      }
      for (let k = 0; k < terms.getElementsByClassName("checkmark").length; k++) {
        const mark = terms.getElementsByClassName("checkmark")[k];
        if (k == row.rowNumber) {
          mark.style.borderColor = "#dd856c";
        } else {
          mark.style.borderColor = "Transparent";
        }
      }
      lastRowClicked = row.rowNumber;
    }
    selectCheckboxContainer.appendChild(selectCheckbox);
    selectCheckboxContainer.appendChild(checkmark);
    selectCheckboxTd.appendChild(selectCheckboxContainer);
    const fromWord = document.createElement("td");
    fromWord.className = "fromWord";
    fromWord.textContent = term.term + "\t";
    const toWord = document.createElement("td");
    toWord.className = "toWord";
    if (backgroundPage.selectedLanguage.to == "Hebrew") {
      toWord.style.direction = "rtl";
    }
    toWord.textContent = term.definition + "\n";
    row.appendChild(selectCheckboxTd);
    row.appendChild(fromWord);
    row.appendChild(toWord);
    terms.appendChild(row);
  }

  // controls for using and manipulating terms
  const deleteButton = document.createElement("button");
  deleteButton.id = "deleteButton";
  deleteButton.className = "controlButton";
  deleteButton.disabled = true;
  const copyButton = document.createElement("button");
  copyButton.id = "copyButton";
  copyButton.className = "controlButton";
  copyButton.disabled = true;
  const createSetButton = document.createElement("button");
  createSetButton.id = "createSetButton";
  createSetButton.className = "controlButton";
  createSetButton.disabled = true;
  termControls.appendChild(deleteButton);
  termControls.appendChild(createDivider(5));
  termControls.appendChild(copyButton);
  termControls.appendChild(createDivider(5));
  termControls.appendChild(createSetButton);
  deleteButton.title = "Delete Selected Terms";
  deleteButton.onclick = function() {
    if (confirm("Are you sure you would like to delete the selected terms?")) {
      const termsToDelete = [];
      for (term of selectedTerms) {
        const msg = {
          messageType:"removeTerm",
          term: {
            term:term.term.replace(/\t/,"").replace(/\n/,""),
            definition:term.definition.replace(/\t/,"").replace(/\n/,""),
          }
        };
        chrome.runtime.sendMessage(msg);
        const currentRow = terms.getElementsByClassName("tableRow")[term.rowNumber];
        termsToDelete.push(currentRow);
      }
      for (row of termsToDelete) {
        terms.removeChild(row);
      }
      if (terms.getElementsByClassName("tableRow").length == 0) {
        createNoTermsMsg();
        deleteButton.disabled = true;
        copyButton.disabled = true;
        createSetButton.disabled = true;
      }
      if (terms.getElementsByClassName("tableRow").length <= 1) {
          createSetButton.disabled = true;
      }
      selectedTerms = [];
      lastRowClicked = -1;
      for (let i = 0; i < terms.getElementsByClassName("tableRow").length; i++) {
        const row = terms.getElementsByClassName("tableRow")[i];
        row.rowNumber = i;
      }
      if (termsToDelete.length == 1) {
        termsDeleted.textContent = "1 Term Deleted";
      } else {
        termsDeleted.textContent = termsToDelete.length + " Terms Deleted";
      }
      termsDeleted.style.opacity = 1;
      termsDeleted.hidden = false;
      setTimeout(function() {
        fadeOut(termsDeleted);
      },1000);
      selectAll.checked = false;
    }
  }
  copyButton.title = "Copy Selected Terms To Clipboard";
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
      let selected = false;
      for (term of selectedTerms) {
        if (term.term == fromWord.textContent && term.definition == toWord.textContent) {
          selected = true;
          break;
        }
      }
      if (selected) {
        copyText.appendChild(newRow);
      }
    }
    document.body.appendChild(copyText);
    selectElementContents(copyText);
    document.execCommand("Copy");
    termsCopied.style.opacity = 1;
    termsCopied.hidden = false;
    setTimeout(function() {
      fadeOut(termsCopied);
    },1000);
  }
  createSetButton.id = "createSetButton";
  createSetButton.title = "Export Selected Terms To Quizlet";
  createSetButton.onclick = function() {
    let msg = {
      messageType:"selectedTerms",
      terms:selectedTerms
    };
    chrome.runtime.sendMessage(msg);
    // get authorization code by logging in to quizlet
    const state = randomString(15);
    msg = {
      messageType:"state",
      state:state
    };
    chrome.runtime.sendMessage(msg);
    window.open("https://quizlet.com/authorize?response_type=code&client_id=" + chrome.extension.getBackgroundPage().clientId + "&scope=write_set&redirect_uri=" + chrome.extension.getURL("create-set-redirect/create-set-redirect.html") + "&state=" + state);
    window.close();
  }
  if (backgroundPage.terms.length > 0) {
    document.getElementById("noTermsMsg").parentNode.removeChild(document.getElementById("noTermsMsg"));
  }
  enableButtons();
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

  // enable extension checkbox setup
  const enableSlider = document.getElementById("toggleExtension").children[0];
  enableSlider.checked = backgroundPage.enabled;
  enableSlider.addEventListener("change",function() {
    const msg = {
      messageType:"enable",
      state:enableSlider.checked
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
    noTermsMsg.id = "noTermsMsg";
    const td = document.createElement("td");
    td.textContent = "Terms List Empty";
    noTermsMsg.appendChild(td);
    terms.appendChild(noTermsMsg);
  }
}

const select = function(row) {
  if (row) {
    const fromWord = row.getElementsByClassName("fromWord")[0].textContent.trim();
    const toWord = row.getElementsByClassName("toWord")[0].textContent.trim();
    const box = row.getElementsByClassName("selectCheckbox")[0];
    let rowNumber;
    const rows = terms.getElementsByClassName("tableRow");
    for (let i = 0; i < rows.length; i++) {
      const currentFrom = rows[i].getElementsByClassName("fromWord")[0].textContent.trim();
      const currentTo = rows[i].getElementsByClassName("toWord")[0].textContent.trim();
      if (currentFrom == fromWord && currentTo == toWord) {
        rowNumber = i;
        break;
      }
    }
    const termToAdd = {
      term:fromWord,
      definition:toWord,
      rowNumber:rowNumber
    };
    let alreadySelected = false;
    for (term of selectedTerms) {
      if (term.term == termToAdd.term && term.definition == termToAdd.definition) {
        alreadySelected = true;
      }
    }
    if (!alreadySelected) {
      selectedTerms.push(termToAdd);
      box.checked = true;
      row.style.backgroundColor = "rgba(249,133,99,0.5)";
    }
    enableButtons();
  }
}

const unSelect = function(row) {
  const fromWord = row.getElementsByClassName("fromWord")[0].textContent.trim();
  const toWord = row.getElementsByClassName("toWord")[0].textContent.trim();
  const box = row.getElementsByClassName("selectCheckbox")[0];
  for (let i = 0; i < selectedTerms.length; i++) {
    const term = selectedTerms[i];
    if (term.term == fromWord && term.definition == toWord) {
      selectedTerms.splice(i,1);
      box.checked = false;
      row.style.backgroundColor = "initial";
      selectAll.checked = false;
    }
  }
  enableButtons();
}

const fadeOut = function(elt) {
  if (elt.style.opacity > 0) {
    elt.style.opacity -= 0.03;
    setTimeout(function() {
      fadeOut(elt);
    },80);
  } else {
    elt.style.opacity = 0;
    elt.hidden = true;
  }
}

// create small dividers to go between elements
const createDivider = function(spacing) {
  const divider = document.createElement("span");
  divider.style.padding = spacing + "px";
  return divider;
}

const enableButtons = function() {
  if (selectedTerms.length == 0) {
    deleteButton.disabled = true;
    copyButton.disabled = true;
    createSetButton.disabled = true;
  } else if (selectedTerms.length == 1) {
    deleteButton.disabled = false;
    copyButton.disabled = false;
    createSetButton.disabled = true;
  } else {
    deleteButton.disabled = false;
    copyButton.disabled = false;
    createSetButton.disabled = false;
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
