(function () {
  var root = document.querySelector('[data-player-root]');

  if (!root) {
    return;
  }

  var video = root.querySelector('video');
  var cover = root.querySelector('.video-cover');
  var trigger = root.querySelector('.play-trigger');
  var stream = root.getAttribute('data-stream-url');
  var hlsInstance = null;
  var prepared = false;

  function prepare() {
    if (prepared || !video || !stream) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.play();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      return;
    }

    video.src = stream;
    video.play();
  }

  function start() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
    prepare();
    if (video) {
      video.play();
    }
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  if (trigger) {
    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      start();
    });
  }

  if (video) {
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
