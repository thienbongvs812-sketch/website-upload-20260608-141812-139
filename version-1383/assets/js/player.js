(function () {
    window.initMoviePlayer = function (sourceUrl) {
        var video = document.getElementById("movie-video");
        var shell = document.querySelector("[data-player-shell]");
        var cover = document.querySelector("[data-player-cover]");
        var button = document.querySelector("[data-player-button]");
        var hls = null;
        var attached = false;

        function attach() {
            if (!video || attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
                return;
            }
            video.src = sourceUrl;
        }

        function start() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            if (video) {
                var playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                start();
            });
        }
        if (cover) {
            cover.addEventListener("click", function (event) {
                event.preventDefault();
                start();
            });
        }
        if (video) {
            video.addEventListener("click", function () {
                if (!attached) {
                    start();
                }
            });
        }
        if (shell) {
            shell.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    start();
                }
            });
        }
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
