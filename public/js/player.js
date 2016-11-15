document.addEventListener("DOMContentLoaded", function() {
    var videoPlayer = videojs("video1");
    console.log("BINGBING", getVideoChapters())

    // $("#chapterMaker").submit(function(event) {
    //     getVideoChapters();
    // });

    // videoPlayer.markers();
    var videoElement = document.getElementById("video1_html5_api");
    var canvas

    // add in screencap tool canvas
    canvas = document.createElement("canvas");
    canvas.id = "screencapCanvas"
    canvas.resize = true
    var div = document.getElementById('video1');
    div.appendChild(canvas)
    $('#screencapCanvas').css('left', '-200%')

    // paper.setup()

    videoPlayer.ready(function() {

        // button.onclick(snap())


        // add in playback speed adjuster
        var playbackSpeed = document.createElement("div");
        playbackSpeed.id = "playbackSpeed"
        playbackSpeed.innerHTML = "1x"
        var div = document.getElementById('video1');
        div.appendChild(playbackSpeed)
            // handle logic for changing playback speed with keys

        window.addEventListener('keydown', function(e) {
            //if the user isn't typing in an input...
            if ($('input:focus').length === 0) {
                // pause and play video
                if (e.keyCode == 32) { // spacebar
                    if (videoPlayer.paused()) {
                        videoPlayer.play()
                    } else {
                        videoPlayer.pause()
                    }
                }
                // change playback speed only if video is currently playing.
                if (e.keyCode >= 49 && e.keyCode <= 53) {
                    var playbackSpeed = 1
                    switch (e.keyCode) {
                        case 49: // number 1 key
                            playbackSpeed = 1
                            showPlaybackSpeed("1x")
                            break;
                        case 50: // number 2 key
                            playbackSpeed = 2
                            showPlaybackSpeed("2x")
                            break;
                        case 51: // number 3 key
                            playbackSpeed = 3
                            showPlaybackSpeed("3x")
                            break;
                        case 52: // number 4 key
                            playbackSpeed = 4
                            showPlaybackSpeed("4x")
                            break;
                        case 53: // number 5 key
                            playbackSpeed = 5
                            showPlaybackSpeed("5x")
                            break;
                    }
                    videoPlayer.playbackRate(playbackSpeed)
                }
                frameRate = 1 / 25; // needs to be set correctly based on the framerate of the videos we're given
                if (e.keyCode === 37 || e.keyCode === 39) {
                    videoPlayer.pause()
                    if (e.keyCode === 37) { //left arrow
                        if (videoPlayer.currentTime() > 0) {
                            //one "frame" back
                            videoPlayer.currentTime(videoPlayer.currentTime() - frameRate);
                        }
                    } else if (e.keyCode === 39) { //right arrow
                        if (videoPlayer.currentTime() < videoPlayer.duration()) {
                            //one "frame" forward
                            videoPlayer.currentTime(Math.min(videoPlayer.duration(), videoPlayer.currentTime() + frameRate)) //don't go past the end
                        }
                    }
                }
            }

        });

    });
});


function showPlaybackSpeed(multiplier) {;
    document.getElementById("playbackSpeed").innerHTML = multiplier;
}
