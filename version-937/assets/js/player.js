function setupMoviePlayer(url) {
  var holder = document.querySelector('[data-movie-player]');

  if (!holder) {
    return;
  }

  var video = holder.querySelector('video');
  var cover = holder.querySelector('.player-cover');
  var loading = holder.querySelector('.player-loading');
  var error = holder.querySelector('.player-error');
  var hlsInstance = null;
  var ready = false;

  function hideLoading() {
    if (loading) {
      loading.classList.add('is-hidden');
    }
  }

  function showError() {
    hideLoading();

    if (error) {
      error.classList.add('is-visible');
    }
  }

  function markReady() {
    ready = true;
    hideLoading();
  }

  function playVideo() {
    if (cover) {
      cover.classList.add('is-hidden');
    }

    if (!ready) {
      hideLoading();
    }

    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  if (!video || !url) {
    showError();
    return;
  }

  if (window.Hls && window.Hls.isSupported()) {
    hlsInstance = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(video);
    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, markReady);
    hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
          return;
        }

        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
          return;
        }

        showError();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', markReady, { once: true });
    video.addEventListener('error', showError);
  } else {
    showError();
  }

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
