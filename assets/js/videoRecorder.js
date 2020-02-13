const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");
const cameraBtn = document.getElementById("jsCameraBtn");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", startRecording);
  recordBtn.innerHTML = "Start Recording";
  recordBtn.classList.remove("stop-record-btn");
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  recordBtn.removeEventListener("click", startRecording);
  recordBtn.addEventListener("click", stopRecording);
  recordBtn.innerHTML = "Stop Recording";
  recordBtn.classList.add("stop-record-btn");
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 }
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    streamObject = stream;
    // videoPreview.classList.add("show");
    videoPreview.style.display = "inline";
    cameraBtn.style.display = "none";
    recordBtn.style.display = "inline-block";

    recordBtn.addEventListener("click", startRecording);
    // startRecording();
  } catch (error) {
    recordBtn.innerHTML = "😥Can't Record";
  } finally {
    cameraBtn.removeEventListener("click", getVideo);
  }
};

function init() {
  cameraBtn.addEventListener("click", getVideo);
  // recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
