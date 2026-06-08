(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var streamUrl = shell.getAttribute('data-stream-url');
    var started = false;
    var hlsInstance = null;

    function playVideo() {
      if (!video || !streamUrl) {
        return;
      }

      shell.classList.add('is-playing');

      if (!started) {
        started = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.load();
          video.play().catch(function () {});
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);

          if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
          } else {
            video.play().catch(function () {});
          }

          return;
        }

        video.src = streamUrl;
        video.load();
      }

      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          playVideo();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
}());
