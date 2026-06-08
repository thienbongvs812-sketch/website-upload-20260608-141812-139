(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function startPlayer(root) {
    var video = root.querySelector("video");
    var button = root.querySelector("[data-play-overlay]");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-hls") || "";
    var hls = null;
    var attached = false;

    function begin() {
      if (!source) {
        return;
      }
      root.classList.add("is-playing");
      if (button) {
        button.hidden = true;
      }
      if (!attached) {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          var parsedEvent = window.Hls.Events && window.Hls.Events.MANIFEST_PARSED ? window.Hls.Events.MANIFEST_PARSED : "hlsManifestParsed";
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(parsedEvent, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = source;
        }
        attached = true;
      }
      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener("click", begin);
    }
    video.addEventListener("click", function () {
      if (!attached || video.paused) {
        begin();
      }
    });
  }

  ready(function () {
    document.querySelectorAll(".js-player").forEach(startPlayer);
  });
})();
