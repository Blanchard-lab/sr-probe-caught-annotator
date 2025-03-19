let video = document.getElementById("video");
let popup = document.getElementById("popup");
let surveyForm = document.getElementById("surveyForm");
let reportData = [];
let lastPauseTime = 0;
let videoLoaded = false;
let playButton = document.createElement("button");
playButton.textContent = "Start Video";
playButton.style.display = "none";
playButton.className = "download-btn";

document.addEventListener("DOMContentLoaded", function() {
    const videoPath = localStorage.getItem("currentVideo") || "part 1.mp4";
    video.src = videoPath;
    video.style.display = "none";
    
    let loadingMessage = document.createElement("div");
    loadingMessage.innerHTML = "<h2>Loading video...</h2><p>Please wait while the video fully downloads.</p>";
    document.body.insertBefore(loadingMessage, video);
    
    document.body.insertBefore(playButton, video.nextSibling);
    
    video.addEventListener('loadeddata', onVideoLoaded);
});

function onVideoLoaded() {
    video.removeEventListener('loadeddata', onVideoLoaded);
    
    let loadingMessage = document.querySelector("div h2");
    if (loadingMessage) {
        let parentDiv = loadingMessage.parentElement;
        if (parentDiv) {
            document.body.removeChild(parentDiv);
        }
    }
    
    video.style.display = "block";
    playButton.style.display = "block";
    
    playButton.onclick = function() {
        video.play();
        this.style.display = "none";
    };
    
    videoLoaded = true;
}

video.addEventListener('error', function() {
    alert('Error loading video. Please refresh the page.');
});

video.addEventListener("timeupdate", function() {
    if (!videoLoaded) return;
    
    const probeFrequency = parseInt(localStorage.getItem("probeFrequency") || 60);
    
    if (!video.paused && 
        video.currentTime > 1 && 
        Math.floor(video.currentTime) % probeFrequency === 0 && 
        Math.floor(video.currentTime) !== lastPauseTime) {
        
        lastPauseTime = Math.floor(video.currentTime);
        
        video.pause();
        popup.style.display = "flex";
    }
});

function submitSurvey() {
    let responses = [];
    let checkboxes = surveyForm.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) responses.push(checkbox.value);
        checkbox.checked = false;
    });
    
    const resumeTime = lastPauseTime + 1;
    
    reportData.push(`Time: ${lastPauseTime}s, Responses: ${responses.join(", ")}`);
    
    popup.style.display = "none";
    
    try {
        video.currentTime = resumeTime;
        
        setTimeout(() => {
            video.play();
        }, 200);
    } catch (err) {
        video.play();
    }
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && popup.style.display === "flex") {
        event.preventDefault();
        submitSurvey();
    }
});

function downloadReport() {
    if (reportData.length === 0) {
        alert("No report data to download yet.");
        return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `video-feedback-report-${timestamp}.txt`;
    
    let blob = new Blob([reportData.join("\n")], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}