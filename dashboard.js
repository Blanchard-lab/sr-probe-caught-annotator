document.addEventListener("DOMContentLoaded", function() {
    const videoPath = "part 1.mp4";
    const videoElement = document.getElementById("currentVideo");
    const videoStats = document.getElementById("video-stats");

    videoElement.src = videoPath;

    videoElement.addEventListener("loadedmetadata", function() {
        const duration = Math.floor(videoElement.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        
        videoStats.innerHTML = `
            <p><strong>Filename:</strong> ${videoPath}</p>
            <p><strong>Duration:</strong> ${minutes}m ${seconds}s</p>
        `;
    });
 
    localStorage.setItem("currentVideo", videoPath);
    let labels = JSON.parse(localStorage.getItem("labels")) || [
        "Engaged", "Disengaged", "Optimistic", "Satisfied", "Confused",
        "Frustrated", "Disappointed", "Anxious", "Conflicted", "Surprised",
        "Reserved", "Confident"
    ];

    
    function renderLabels() {
        let labelList = document.getElementById("labelList");
        labelList.innerHTML = "";
        labels.forEach((label, index) => {
            let li = document.createElement("li");
            li.innerHTML = `${label} <span style="float: right;"><button onclick="editLabel(${index})">Edit</button> <button onclick="deleteLabel(${index})">Delete</button></span>`;
            labelList.appendChild(li);
        });
        localStorage.setItem("labels", JSON.stringify(labels));
    }
    
    window.editLabel = function(index) {
        let newLabel = prompt("Edit label:", labels[index]);
        if (newLabel) {
            labels[index] = newLabel;
            renderLabels();
        }
    };
    
    window.deleteLabel = function(index) {
        labels.splice(index, 1);
        renderLabels();
    };
    
    document.getElementById("addLabel").addEventListener("click", function() {
        let newLabel = prompt("Enter new label:");
        if (newLabel) {
            labels.push(newLabel);
            renderLabels();
        }
    });
    
    renderLabels();
    
    let probeInput = document.getElementById("probeFrequency");
    probeInput.value = localStorage.getItem("probeFrequency") || 60;
    probeInput.addEventListener("input", function() {
        if (probeInput.value < 1) {
            probeInput.value = 1;
        }
        localStorage.setItem("probeFrequency", probeInput.value);
    });
    
    document.getElementById("start").addEventListener("click", function() {
        window.location.href = "feedback.html";
    });
});
