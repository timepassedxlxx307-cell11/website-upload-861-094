(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

    shells.forEach(function (shell) {
      var video = shell.querySelector('.movie-video');
      var cover = shell.querySelector('.player-cover');
      var button = shell.querySelector('.player-start');
      var stream = video ? video.getAttribute('data-stream') : '';
      var hls = null;

      function bindStream() {
        if (!video || !stream) {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          if (!video.getAttribute('src')) {
            video.setAttribute('src', stream);
          }
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          if (!hls) {
            hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
          }
          return;
        }

        if (!video.getAttribute('src')) {
          video.setAttribute('src', stream);
        }
      }

      function startPlayback(event) {
        if (event) {
          event.preventDefault();
        }

        bindStream();
        shell.classList.add('is-playing');

        if (video) {
          var promise = video.play();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
          }
        }
      }

      bindStream();

      if (cover) {
        cover.addEventListener('click', startPlayback);
      }

      if (button) {
        button.addEventListener('click', startPlayback);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startPlayback();
          }
        });
        video.addEventListener('play', function () {
          shell.classList.add('is-playing');
        });
      }
    });
  });
})();
