window.mode = 0;

chrome.tabs.onCreated.addListener(function(tab) {
  if (tab.url == "chrome://newtab/") {
    chrome.tabs.update(tab.id,{
      url:chrome.extension.getURL("newtab.html")
    });
  }
});

chrome.runtime.onMessage.addListener(function(data) {
  window.mode = data.mode;
});
