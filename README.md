# Overview

This is a repository for a web application for collecting real-time feedback from users as they watch videos,
currently configured as a simple annotation tool for probe-caught experiments using a retrospective approach. 

## Features

- Video playback with timed feedback prompts
- Customizable feedback labels
- Adjustable prompt frequency
- Report generation and download

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Nginx (for production deployment)

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create necessary directories:
   ```
   mkdir -p static/videos reports
   ```
5. Place your video files in the `static/videos` directory

### Development Server

Run the Flask development server:
```
python app.py
```

The application will be available at http://localhost:8000

To add multiple clients, you can use your internal IP address and access the application from other devices on the same network. To find your internal IP address, run:
```
ip addr show
```
or
``` 
ifconfig
```
and look for the `inet` address under your network interface (usually `eth0` or `wlan0`).

If you want to reduce the video size, run

```
ffmpeg -i static/videos/input.mp4 -vf "scale=1280:720" -preset fast static/videos/output.mp4
```

### Production Deployment with Nginx (optional)

1. Edit the nginx.conf file to update the paths to your application directory
2. Install the Nginx configuration:
   ```
   sudo cp nginx.conf /etc/nginx/sites-available/video-feedback
   sudo ln -s /etc/nginx/sites-available/video-feedback /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
3. Run the Flask application with Gunicorn:
   ```
    gunicorn --bind 127.0.0.1:8000 app:app
    ```

## Bugs and Issues
Currently, the feedback page sometimes needs to be refreshed after clicking `Start Feedback Session` to display the video and feedback prompts correctly. To make sure the video is loaded correctly, check if video seek works. If it does not, refresh the page and try again.
