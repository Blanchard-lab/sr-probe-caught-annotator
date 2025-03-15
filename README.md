To run this tool, run the following in your workspace:

`git clone https://github.com/Blanchard-lab/sr-probe-caught-annotator.git`

`python -m http.server 8000`

`start http://0.0.0.0:8000/` (Windows)

`open http://0.0.0.0:8000/` (MacOS)

`xdg-open http://0.0.0.0:8000/` (Linux)

Overview:

Simple annotation tool for probe-caught video using a retrospective approach. Upload your video using the `Choose file` option. 
The default setting for pop-up surveys is every 60s since start of the video (and one at the end). This can be customized in `script.js`.

A cumulative report of the survey responses and associated timestamps is generated and can be downloaded using `Download Report`.
