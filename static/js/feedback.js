document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('feedback-video');
    const loadingIndicator = document.getElementById('loading-indicator');
    const startPlaybackBtn = document.getElementById('start-playback');
    const feedbackPopup = document.getElementById('feedback-popup');
    const feedbackOptions = document.getElementById('feedback-options');
    const submitFeedbackBtn = document.getElementById('submit-feedback');
    const downloadReportBtn = document.getElementById('download-report');
    const endSessionBtn = document.getElementById('end-session');
    const probeTimeDisplay = document.getElementById('probe-time');
    
    let videoLoaded = false;
    let lastPauseTime = 0;
    let reportData = [];
    let sessionData = {
        video: '',
        startTime: new Date().toISOString(),
        endTime: '',
        probeFrequency: 0,
        responses: []
    };

    const currentVideo = localStorage.getItem('current_video');
    const probeFrequency = parseInt(localStorage.getItem('probe_frequency') || 60);
    const labels = JSON.parse(localStorage.getItem('feedback_labels')) || [];
    
    probeTimeDisplay.textContent = probeFrequency;
    
    sessionData.video = currentVideo;
    sessionData.probeFrequency = probeFrequency;
    
    if (currentVideo) {
        video.src = `/video/${currentVideo}`;
        video.preload = 'metadata';
    } else {
        alert('No video selected. Redirecting to dashboard.');
        window.location.href = '/dashboard';
    }
    
    video.addEventListener('loadeddata', function() {
        videoLoaded = true;
        loadingIndicator.style.display = 'none';
        startPlaybackBtn.style.display = 'block';
        
        renderFeedbackOptions();
    });
    
    video.addEventListener('error', function() {
        alert('Error loading video. Please try again.');
        console.error('Video error:', video.error);
    });
    
    video.addEventListener('timeupdate', function() {
        if (!videoLoaded || video.paused) return;
        
        if (video.currentTime > 1 && 
            Math.floor(video.currentTime) % probeFrequency === 0 && 
            Math.floor(video.currentTime) !== lastPauseTime) {
            
            lastPauseTime = Math.floor(video.currentTime);
            // print out the current time for debugging
            console.log('Current time for feedback:', lastPauseTime);
            // probeTimeDisplay.textContent = currentTime - lastPauseTime;
            showFeedbackPopup();
        }
    });
    
    startPlaybackBtn.addEventListener('click', function() {
        this.style.display = 'none';
        video.play().catch(err => {
            console.error('Error starting playback:', err);
            alert('Could not start playback. Please try again.');
            this.style.display = 'block';
        });
    });

    function renderFeedbackOptions() {
        feedbackOptions.innerHTML = '';
        
        labels.forEach(label => {
            const option = document.createElement('div');
            option.className = 'feedback-option';
            option.dataset.label = label;
            option.innerHTML = `
                <input type="checkbox" id="option-${label.toLowerCase().replace(/\s+/g, '-')}" 
                       value="${label}">
                <label for="option-${label.toLowerCase().replace(/\s+/g, '-')}">${label}</label>
            `;
            feedbackOptions.appendChild(option);
        });
        
        document.querySelectorAll('.feedback-option').forEach(option => {
            option.addEventListener('click', function(e) {
                if (e.target.tagName !== 'INPUT') {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
            
                this.classList.toggle('selected', this.querySelector('input[type="checkbox"]').checked);
            });
        });
    }

    function showFeedbackPopup() {
        video.pause();
        
        document.querySelectorAll('.feedback-option').forEach(option => {
            option.classList.remove('selected');
            option.querySelector('input[type="checkbox"]').checked = false;
        });
        
        feedbackPopup.style.display = 'block';
    }
    
    submitFeedbackBtn.addEventListener('click', function() {
        const selectedOptions = [];
        document.querySelectorAll('.feedback-option input:checked').forEach(checkbox => {
            selectedOptions.push(checkbox.value);
        });
        
        const responseData = {
            timestamp: new Date().toISOString(),
            videoTime: lastPauseTime,
            responses: selectedOptions
        };
        
        sessionData.responses.push(responseData);
        reportData.push(`Time: ${lastPauseTime}s, Responses: ${selectedOptions.join(', ')}`);
        
        feedbackPopup.style.display = 'none';
        
        try {
            video.currentTime = lastPauseTime + 1;
            setTimeout(() => {
                video.play().catch(err => console.error('Error resuming playback:', err));
            }, 200);
        } catch (err) {
            console.error('Error setting video time:', err);
            video.play().catch(err => console.error('Error resuming playback:', err));
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && feedbackPopup.style.display === 'block') {
            e.preventDefault();
            submitFeedbackBtn.click();
        }
    });

    downloadReportBtn.addEventListener('click', function() {
        if (sessionData.responses.length === 0) {
            alert('No feedback data collected yet.');
            return;
        }
        
        sessionData.endTime = new Date().toISOString();
        
        fetch('/api/save_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const textReport = reportData.join('\n');
                const blob = new Blob([textReport], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'video-feedback-report.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                alert('Report saved successfully.');
            } else {
                throw new Error('Failed to save report');
            }
        })
        .catch(error => {
            console.error('Error saving report:', error);
            alert('There was an error saving the report to the server. Downloading local copy instead.');
            
            const textReport = reportData.join('\n');
            const blob = new Blob([textReport], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'video-feedback-report.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
    
    endSessionBtn.addEventListener('click', function() {
        if (sessionData.responses.length > 0 && 
            !confirm('You have collected feedback data. Are you sure you want to end the session?')) {
            return;
        }
        
        window.location.href = '/dashboard';
    });
});