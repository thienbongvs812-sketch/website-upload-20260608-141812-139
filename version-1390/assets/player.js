function initializePlayer(videoUrl) {
  const video = document.getElementById('movieVideo');
  const overlay = document.getElementById('playOverlay');

  if (!video || !overlay || !videoUrl) {
    return;
  }

  let prepared = false;

  const prepareVideo = () => {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else {
      video.src = videoUrl;
    }
  };

  const startPlayback = () => {
    prepareVideo();
    overlay.classList.add('is-hidden');
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        overlay.classList.remove('is-hidden');
      });
    }
  };

  overlay.addEventListener('click', startPlayback);
  video.addEventListener('click', () => {
    if (video.paused) {
      startPlayback();
    }
  });
  video.addEventListener('play', () => {
    overlay.classList.add('is-hidden');
  });
}
