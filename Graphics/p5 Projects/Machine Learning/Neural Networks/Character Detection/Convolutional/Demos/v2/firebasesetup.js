let refFilters;
let refTraining;
let refWeights;
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
  refFilters = database.ref("filters");
  refTraining = database.ref("training");
  refWeights = database.ref("weights");

  refFilters.on("value",function(data) {
    filters = [];
    data = data.val();
    if (data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        const key = Object.keys(data)[i];
        let newFilter = {
          name:data[key].name,
          filter:data[key].filter
        };
        filters.push(newFilter);
      }
      rawFilter = filters[0].filter;
    }
  },function(err) {
    console.error(err);
  });
  refTraining.on("value",function(data) {
    trainingImages = [];
    trainingData = [];
    data = data.val();
    if (data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        const key = Object.keys(data)[i];
        trainingImages.push(data[key]);
      }
    }
    setupTrainingData();
  },function(err) {
    console.error(err);
  });
  refWeights.on("value",function(data) {
    data = data.val();
    console.log(data);
    if (data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        const key = Object.keys(data)[i];
        nn.weights[i].matrix = data[key].weights;
      }
      select("#defaultCanvas0").elt.hidden = false;
    }
  },function(err) {
    console.error(err);
  });
}
