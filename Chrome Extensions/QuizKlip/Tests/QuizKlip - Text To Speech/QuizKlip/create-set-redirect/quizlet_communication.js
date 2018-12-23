const quizletTerms = [];
const quizletDefinitions = [];
const getAuthCode = function() {
  const postData = {
    grant_type:"authorization_code",
    code:params.code,
    redirect_uri:chrome.extension.getURL("create-set-redirect/create-set-redirect.html")
  };
  post("https://api.quizlet.com/oauth/token","Basic",basicCode,postData,function(data) {
    const date = new Date();
    const year = String(date.getFullYear());
    let month = String(date.getMonth() + 1);
    if (month.length < 2) month = "0" + month;
    let day = String(date.getDate());
    if (day.length < 2) day = "0" + day;
    let hours = String(date.getHours());
    if (hours.length < 2) hours = "0" + hours;
    let minutes = String(date.getMinutes());
    if (minutes.length < 2) minutes = "0" + minutes;
    let seconds = String(date.getSeconds());
    if (seconds.length < 2) seconds = "0" + seconds;
    const title = "QuizKlip Set " + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    createSet(
      data.access_token,
      title,
      quizletTerms,
      quizletDefinitions,
      getFromCode(backgroundPage.selectedLanguage),
      getToCode(backgroundPage.selectedLanguage)
    );
  });
}

const createSet = function(token,title,terms,definitions,lang_terms,lang_definitions) {
  const postData = {
    title:title,
    terms:terms,
    definitions:definitions,
    lang_terms:lang_terms,
    lang_definitions:lang_definitions
  };
  post("https://api.quizlet.com/2.0/sets/","Bearer",token,postData,function(data) {
    const feedback1 = document.getElementById("feedback1");
    const feedback2 = document.getElementById("feedback2");
    if (!data.error) {
      success = true;
    }
    updateTimer(3,data);
  });
}

let success = false;
const updateTimer = function(timeLeft,data) {
  if (timeLeft > 0) {
    if (!success) {
      const redirectMsg = " (Closing this page in " + timeLeft + ")";
      feedback1.textContent = "Unable to post to Quizlet. Please try again in a moment." + redirectMsg;
      feedback2.textContent = "Error " + data.http_code + ": " + data.error_description;
    } else {
      const redirectMsg = " (Redirecting to new set in " + timeLeft + ")";
      feedback1.textContent = "Success: " + data.title + " created!" + redirectMsg;
    }
    setTimeout(function() {
      updateTimer(timeLeft - 1,data);
    },1000);
  } else {
    if (success) {
      window.location.replace("https://quizlet.com" + data.url);
    } else {
      window.close();
    }
  }
}

const post = function(url,authType,authCode,postData,callback) {
  let request = new XMLHttpRequest();
  request.onload = function() {
    callback(JSON.parse(request.responseText));
  }
  request.open("POST",url,true);
  request.setRequestHeader("Authorization",authType + " " + authCode);
  request.setRequestHeader("Content-Type","application/json");
  request.send(JSON.stringify(postData));
}

const getURLParams = function() {
  let urlParams = {};
  location.href.replace(
    new RegExp("([^?=&]+)(=([^&]*))?","g"),
    function($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );
  return urlParams;
}
const params = getURLParams();
