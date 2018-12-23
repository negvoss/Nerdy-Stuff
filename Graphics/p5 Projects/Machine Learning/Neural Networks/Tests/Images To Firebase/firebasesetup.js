let refTraining;
const setupFirebase = function() {
  const config = {
    apiKey: "AIzaSyBQXMJXzni2ALbPU18r245SeemD5HVcC84",
    authDomain: "character-recognition-f5124.firebaseapp.com",
    databaseURL: "https://character-recognition-f5124.firebaseio.com",
    projectId: "character-recognition-f5124",
    storageBucket: "",
    messagingSenderId: "91030421727"
  };
  firebase.initializeApp(config);
  const database = firebase.database();
  refTraining = database.ref("training");
  refTraining.remove();
}
