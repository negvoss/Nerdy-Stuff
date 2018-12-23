const sendMessage = function(headers_obj, message, callback) {
  let email = "";
  for (header in headers_obj) {
    email += header += ": " + headers_obj[header] + "\r\n";
  }
  email += "\r\n" + message;
  return gapi.client.gmail.users.messages.send({
    "userId":"me",
    "resource": {
      "raw":btoa(email).replace(/\+/g,"-").replace(/\//g,"_")
    }
  }).execute(callback);
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

const loadText = function(url,callback) {
   const xobj = new XMLHttpRequest();
   xobj.open("GET", url, true);
   xobj.onreadystatechange = function() {
     if (xobj.readyState == 4 && xobj.status == "200") {
       callback(xobj.responseText);
     }
   }
   xobj.send(null);
}

window.onload = function() {
  loadJSON("emails.json",function(emails) {
    loadText("message.txt",function(message) {
      gapi.client.setApiKey("AIzaSyA1Krca8Q6GI4oO1lcqKww_jKyGuPgePRM");
      gapi.client.load("gmail", "v1", function(data) {
        gapi.auth.authorize({
          client_id:"757804318569-4tjgpdq8s4696kaaggfi9bk4i14gi8do.apps.googleusercontent.com",
          scope:"https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send",
          immediate:false
        },function() {
          for (let i = 0; i < emails.length; i++) {
            let headers = {
              To:emails[i].to,
              Subject:"You are being spammed by my fun automatic email sender. LOL!"
            };
            let msg = message.replace("____ class",emails[i].class + " class");
            for (let i = 0; i < 20; i++) {
              sendMessage(headers,msg,function(data) {
                console.log({
                  To:headers.To,
                  Subject:headers.Subject,
                  msg:msg
                });
              });
            }
          }
        });
      });
    });
  });
}
