const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const volumeRange = document.getElementById("jsVolume");

// const registerView = () => {
//   const videoId = window.location.href.split("/videos/")[1];
//   fetch(`/api/${videoId}/view`, {
//     method: "POST"
//   });
// };

function getVolumeIconString(volumeValue) {
  if (volumeValue >= 0.8) return '<i class="fas fa-volume-up"></i>';
  if (volumeValue >= 0.4) return '<i class="fas fa-volume-down"></i>';
  if (volumeValue > 0) return '<i class="fas fa-volume-off"></i>';
  return '<i class="fas fa-volume-mute"></i>';
}

function handleVolumeClick() {
  if (videoPlayer.volume === 0) {
    videoPlayer.volume = 0.5;
    volumeBtn.innerHTML = getVolumeIconString(videoPlayer.volume);
    volumeRange.value = `${videoPlayer.volume}`;
  } else if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = getVolumeIconString(videoPlayer.volume);
    volumeRange.value = `${videoPlayer.volume}`;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
}

function exitFullScreen() {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

// let playTimer = null;
function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
  //   if (currentTime.innerHTML === totalTime.innerHTML) clearInterval(playTimer);
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  //   playTimer = setInterval(getCurrentTime, 100);
}

let playTimer = null;
function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playTimer = setInterval(getCurrentTime, 100);
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    clearInterval(playTimer);
    console.log(playTimer);
  }
}

function handleEnded() {
  // registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  clearInterval(playTimer);
}

function handleDrag(e) {
  const {
    target: { value }
  } = e;
  videoPlayer.muted = false;
  videoPlayer.volume = value;
  volumeBtn.innerHTML = getVolumeIconString(value);
  console.log(videoPlayer.volume);
}

async function setVideoSize(event) {
  const width = event.target.videoWidth;
  const height = event.target.videoHeight;
  console.log(event);
  let ratio;
  if (width < height) {
    ratio = (width / height).toFixed(2);
  } else {
    ratio = (height / width).toFixed(2);
  }
  const videoResolution = ratio * 100;
  videoContainer.style.paddingBottom = await `${videoResolution}%`;
}

function init() {
  videoPlayer.volume = 0.5;
  videoPlayer.addEventListener("loadedmetadata", setVideoSize);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScrnBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
  init();
}
