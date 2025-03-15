let video = document.getElementById("video");
let videoInput = document.getElementById("videoInput");
let popup = document.getElementById("popup");
let surveyForm = document.getElementById("surveyForm");
let reportData = [];
let lastPauseTime = 0;

videoInput.addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let url = URL.createObjectURL(file);
        video.src = url;
        video.style.display = "block";
        video.currentTime = 0;
        reportData = [];
        lastPauseTime = 0;
    }
});

video.addEventListener("timeupdate", function() {
    if (!video.paused && video.currentTime > 1 && (Math.floor(video.currentTime) % 60 === 0) && Math.floor(video.currentTime) !== lastPauseTime) {
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