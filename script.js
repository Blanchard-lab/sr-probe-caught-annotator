let video = document.getElementById("video");
let popup = document.getElementById("popup");
let surveyForm = document.getElementById("surveyForm");
let reportData = [];
let lastPauseTime = 0;

document.addEventListener("DOMContentLoaded", function() {
    const videoPath = localStorage.getItem("currentVideo") || "part 1.mp4";
    video.src = videoPath;
    video.style.display = "block";
});

video.addEventListener("timeupdate", function() {
    const probeFrequency = parseInt(localStorage.getItem("probeFrequency") || 60);
    
    if (!video.paused && video.currentTime > 1 && 
        (Math.floor(video.currentTime) % probeFrequency === 0) && 
        Math.floor(video.currentTime) !== lastPauseTime) {
        video.pause();
        popup.style.display = "flex";
        lastPauseTime = Math.floor(video.currentTime);
    }
});

function submitSurvey() {
    let responses = [];
    let checkboxes = surveyForm.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) responses.push(checkbox.value);
        checkbox.checked = false;
    });
    reportData.push(`Time: ${Math.floor(video.currentTime)}s, Responses: ${responses.join(", ")}`);
    popup.style.display = "none";
    video.currentTime += 1;
    video.play();
}

function downloadReport() {
    let blob = new Blob([reportData.join("\n")], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reports.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}