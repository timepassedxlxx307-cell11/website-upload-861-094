(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initPlayer(stage) {
    var video = stage.querySelector('video');
    var overlay = stage.querySelector('.play-overlay');
    var videoUrl = stage.getAttribute('data-video');
    var poster = stage.getAttribute('data-poster');
    var hls = null;
    var initialized = false;

    if (!video || !videoUrl) {
      return;
    }

    if (poster && !video.getAttribute('poster')) {
      video.setAttribute('poster', poster);
    }

    function attach() {
      if (initialized) {
        return;
      }
      initialized = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (_event, data) {
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
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      } else {
        video.src = videoUrl;
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.remove('is-visible');
        overlay.classList.add('is-hidden');
      }
    }

    function play() {
      attach();
      hideOverlay();
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          video.muted = true;
          video.play().catch(function () {});
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', hideOverlay);
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(initPlayer);
  });
}());
