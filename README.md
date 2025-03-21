# Overview

This is a repository for a web application for collecting real-time feedback from users as they watch videos,
currently configured as a simple annotation tool for probe-caught experiments using a retrospective approach. 

## Features

- Video playback with timed feedback prompts
- Customizable feedback labels
- Adjustable prompt frequency
- Report generation and download

## Setup Instructions

To use the tool, set it up by running setup.sh and following the instructions:
```
bash setup.sh
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