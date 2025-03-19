# Overview

Simple annotation tool for probe-caught experiments using a retrospective approach. Add your video to the root directory as `part 1.mp4` and host it locally. 
The probe-caught frequency and labels can be customized in the dashboard. Click `Start` after configuring these settings.

A cumulative report of the survey responses and associated timestamps is generated after labeling and can be downloaded using `Download Report`.

To run this tool, run the following in your workspace:

`git clone https://github.com/Blanchard-lab/sr-probe-caught-annotator.git`

`python -m http.server 8000`

`start http://0.0.0.0:8000/` (Windows)

`open http://0.0.0.0:8000/` (MacOS)

`xdg-open http://0.0.0.0:8000/` (Linux)

Do not deploy on a public server. If multiple participants are annotating, connect to the same network and use local server.
