const textToSpeech = document.createElement("script");
textToSpeech.src = "https://code.responsivevoice.org/responsivevoice.js";
textToSpeech.type = "text/javascript";
document.head.appendChild(textToSpeech);
window.onload = function() {
  responsiveVoice.speak("hello");
}
