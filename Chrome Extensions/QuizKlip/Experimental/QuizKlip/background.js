// credentials
window.basicCode = "OW1IS213NnBWNDo3WVZWYnBtQVlKeFJSNXo0UXZicFZD";
window.clientId = "9mHKmw6pV4";
// information about each language
let languageInfo;
// original term selected for search (to go in definition box header in content script)
let originalTerm;
// dictionary page loaded from online dictionary with get request
const dictPage = document.createElement("html");
document.body.appendChild(dictPage);

// redirect to instructions when extension first installed or when updated
chrome.runtime.onInstalled.addListener(function(details) {
  // switch(details.reason) {
  //   case "install":
  //   window.open(chrome.extension.getURL("instructions/instructions.html?reason=" + details.reason));
  //   break;
  //   case "update":
  //   window.open(chrome.extension.getURL("instructions/instructions.html?reason=" + details.reason));
  // }
});

const recieveMessage = function(msg) {
  switch(msg.messageType) {
    // add term
    case "term":
    const term = {
      term:msg.term,
      definition:msg.definition
    };
    if (!termExists(term)) {
      window.terms.push(term);
      chrome.browserAction.setBadgeText({text:String(window.terms.length)});
    }
    break;
    case "removeTerm":
    for (let i = 0; i < window.terms.length; i++) {
      const term = window.terms[i];
      if (term.term == msg.term.term && term.definition == msg.term.definition) {
        const removeTermMsg = {
          messageType:"removeTerm",
          term:window.terms[i]
        };
        window.terms.splice(i,1);
        chrome.tabs.query({},function(tabs) {
          for (tab of tabs) {
            chrome.tabs.sendMessage(tab.id,removeTermMsg);
          }
        });
        chrome.browserAction.setBadgeText({text:String(window.terms.length)});
        break;
      }
    }
    break;
    case "selectedTerms":
    window.selectedTerms = msg.terms;
    break;
    // send current number of terms
    case "numberOfTerms":
    const numberOfTermsMsg = {
      messageType:"numberOfTerms",
      numTerms:window.terms.length
    };
    chrome.tabs.query({},function(tabs) {
      for (tab of tabs) {
        chrome.tabs.sendMessage(tab.id,numberOfTermsMsg);
      }
    });
    break;
    // get dictionary page with word to search
    case "search":
    originalTerm = msg.term;
    get(window.selectedLanguage.url + trim(msg.term),function(data) {
      dictPage.innerHTML = data;
      const requestedCodes = window.selectedLanguage.url.split("/")[3];
      let actualCodes = requestedCodes;
      let morfixLanguagesMatch = true;
      if (window.selectedLanguage.url == "http://www.morfix.co.il/") {
        // hebrew
        if (dictPage.getElementsByClassName("title_ph")[0]) {
          if (dictPage.getElementsByClassName("title_ph")[0].children[0].className == "word_ph translation_en") {
            if (window.selectedLanguage.from == "Hebrew") {
              morfixLanguagesMatch = false;
            }
          } else {
            if (window.selectedLanguage.from == "English") {
              morfixLanguagesMatch = false;
            }
          }
        }
      } else if (window.selectedLanguage.url.includes("www.wordreference.com")) {
        // wordreference
        actualCodes = dictPage.children[0].children[4].href.split("dict=")[1];
      } else {
        // latin
        console.log(dictPage.getElementsByClassName("banner")[0].textContent.replace(/\s/g,"").split(","));
      }
      let wrongLanguage = false;
      let terms = [];
      if (actualCodes == requestedCodes && morfixLanguagesMatch) {
        if (window.selectedLanguage.url == "http://www.morfix.co.il/") {
          if (document.getElementsByClassName("title_ph").length > 0) {
            for (row of document.getElementsByClassName("title_ph")) {
              const fromWord = trim(row.children[0].children[0].textContent);
              let toWord;
              if (row.children[1].children[0]) {
                toWord = trim(row.children[1].children[0].textContent);
              } else {
                toWord = trim(row.children[1].textContent);
              }
              if (fromWord != "" && toWord != "") {
                const term = {
                  term:fromWord,
                  definition:toWord,
                };
                if (termExists(term)) {
                  term.alreadyAdded = true;
                }
                if (!includes(terms,term)) {
                  terms.push(term);
                  if (terms.length == 5) break;
                }
              }
            }
          }
        } else {
          if (document.getElementsByClassName("WRD").length > 0) {
            for (row of document.getElementsByClassName("WRD")[0].children[0].children) {
              if (row.className == "even" || row.className == "odd") {
                if (row.id) {
                  const fromWord = trim(row.children[0].children[0].textContent);
                  const toWord = trim(row.children[2].childNodes[0].textContent);
                  if (fromWord != "" && toWord != "") {
                    const term = {
                      term:fromWord,
                      definition:toWord
                    };
                    if (termExists(term)) {
                      term.alreadyAdded = true;
                    }
                    if (!includes(terms,term)) {
                      terms.push(term);
                      if (terms.length == 5) break;
                    }
                  }
                }
              }
            }
            // flip term/definitions if wordreference did.
            if (document.querySelectorAll("[data-ph]")[0]) {
              if (document.querySelectorAll("[data-ph]")[0].attributes[1].textContent == "sFromOtherSide") {
                terms = flipTerms(terms);
              }
            }
          }
        }
      } else {
        wrongLanguage = true;
      }

      const msg = {
        messageType:"searchResults",
        originalTerm:originalTerm.substring(0,40),
        terms:terms,
        wrongLanguage:wrongLanguage
      };
      chrome.tabs.query({},function(tabs) {
        for (tab of tabs) {
          chrome.tabs.sendMessage(tab.id,msg);
        }
      });
    });
    break;
    case "language_selection":
    for (packet of languageInfo.dictInfo) {
      if (packet.from == msg.from && packet.to == msg.to) {
        window.selectedLanguage = packet;
      }
    }
    const languageSelectionMsg = {
      messageType:"language_selection",
      language:window.selectedLanguage
    }
    chrome.tabs.query({},function(tabs) {
      for (tab of tabs) {
        chrome.tabs.sendMessage(tab.id,languageSelectionMsg);
      }
    });
    break;
    // send whether extension is enabled
    case "enable":
    if (msg.state != undefined) {
      window.enabled = msg.state;
      chrome.contextMenus.removeAll();
      if (window.enabled) {
        createMenus();
      }
    }
    const enableMsg = {
      messageType:"enable",
      state:window.enabled
    }
    chrome.tabs.query({},function(tabs) {
      for (tab of tabs) {
        chrome.tabs.sendMessage(tab.id,enableMsg);
      }
    });
    break;
    // send Quizlet random string
    case "state":
    window.state = msg.state;
    break;
    case "selectedLanguage":
    const selectedLanguageMsg = {
      messageType:"selectedLanguage",
      selectedLanguage:window.selectedLanguage
    }
    chrome.tabs.query({},function(tabs) {
      for (tab of tabs) {
        chrome.tabs.sendMessage(tab.id,selectedLanguageMsg);
      }
    });
  }
  // save current state in cache
  const data = {
    terms:window.terms,
    enabled:window.enabled,
    selectedLanguage:window.selectedLanguage
  };
  storeData(data);
}

chrome.runtime.onMessage.addListener(recieveMessage);

// see if window.terms already includes a term
const termExists = function(term) {
  for (let i = 0; i < window.terms.length; i++) {
    if (window.terms[i].term.toLowerCase() == term.term.toLowerCase() && window.terms[i].definition.toLowerCase() == term.definition.toLowerCase()) return true;
  }
  return false
}

const trim = function(word) {
  word = word.split(",")[0].split(";")[0].split("'")[0].replace(/\[sth]/g,"something").replace(/\[sb]/g,"somebody").replace(/\[sb\/sth]/,"somebody/something").replace(/\[sth\/sb]/,"something/somebody").replace("⇒","").replace(/\t/,"").trim();
  if (word.split(" ").length > 10) return "";
  return word;
}

// see if current terms list from dictionary page already includes a specific term already
const includes = function(terms,termToCheck) {
  for (term of terms) {
    if (term.term.toLowerCase() == termToCheck.term.toLowerCase() && term.definition.toLowerCase() == termToCheck.definition.toLowerCase()) return true;
  }
  return false;
}

// flip term/definitions
const flipTerms = function(terms) {
  for (term of terms) {
    const temp = term.definition;
    term.definition = term.term;
    term.term = temp;
  }
  return terms;
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

// get request to dictionary pages
const get = function(url,callback) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    callback(request.responseText);
  }
  request.open("GET",url,true);
  request.send();
}

// store/retrieve data in cache
const storeData = function(data,callback) {
  chrome.storage.local.set({cache:data,cacheTime:Date.now()});
}

const retrieveData = function(callback) {
  chrome.storage.local.get(["cache","cacheTime"],function(items) {
    if (items.cache && items.cacheTime && items.cacheTime) {
      if (items.cacheTime > Date.now() - 3600000) {
        return callback(items.cache);
      }
    }
  });
}

loadJSON(chrome.extension.getURL("languageInfo.json"),function(data) {
  if (data) {
    languageInfo = data;
    window.terms = [];
    window.selectedLanguage = {
      from:"Spanish",
      to:"English",
      url:"http://www.wordreference.com/esen/"
    };
    window.enabled = true;
    chrome.browserAction.setBadgeText({text:String(window.terms.length)});
  }
});

retrieveData(function(data) {
  if (data.terms != undefined) window.terms = data.terms;
  if (data.enabled != undefined) window.enabled = data.enabled;
  if (data.selectedLanguage != undefined) window.selectedLanguage = data.selectedLanguage;
  chrome.browserAction.setBadgeText({text:String(window.terms.length)});
});

const createMenus = function() {
  let contextItemProperties = {
    title:"Find translations",
    contexts:["selection"],
    onclick:function(info) {
      const msg = {
        messageType:"search",
        term:info.selectionText
      }
      recieveMessage(msg);
    }
  };
  chrome.contextMenus.create(contextItemProperties);
}
createMenus();
