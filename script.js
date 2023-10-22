// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/9xC9BlkOh/";

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

async function init() {
  document.querySelector("button").disabled = true;
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  const labelContainer = document.getElementById("label-container");

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(
    (result) => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      const maxScore = Math.max.apply(null, scores);
      labelContainer.innerHTML =
        classLabels[scores.indexOf(maxScore)] +
        " : " +
        maxScore.toFixed(3) * 100 +
        "%";
      switch (classLabels[scores.indexOf(maxScore)]) {
        case "어쿠스틱 기타":
          console.log("어쿠스틱 기타");
          document.querySelector("body").style.backgroundImage =
            "url('" + "/images/acoustic.jpg" + "')";
          break;
        case "일렉기타":
          console.log("일렉기타");
          document.querySelector("body").style.backgroundImage =
            "url('" + "/images/electric.jpg" + "')";
          break;
        case "베이스":
          console.log("베이스");
          document.querySelector("body").style.backgroundImage =
            "url('" + "/images/bass.jpg" + "')";
          break;
        case "드럼":
          console.log("드럼");
          document.querySelector("body").style.backgroundImage =
            "url('" + "/images/drum.jpg" + "')";
          break;
        case "피아노":
          console.log("피아노");
          document.querySelector("body").style.backgroundImage =
            "url('" + "/images/piano.jpg" + "')";
          break;
        default:
          console.log("default");
          document.querySelector("body").style.backgroundImage =
            "url('" + "/images/default.jpg" + "')";
          break;
      }
    },
    {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
    }
  );

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}
