(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('.player-start');
    var playUrl = root.getAttribute('data-play');
    var poster = root.getAttribute('data-poster');
    var hlsInstance = null;
    var attached = false;

    if (!video || !playUrl) {
      return;
    }

    if (poster) {
      video.setAttribute('poster', poster);
    }

    function attach() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(playUrl);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = playUrl;
    }

    function play() {
      attach();
      root.classList.add('is-playing');
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          root.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      root.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.currentTime) {
        root.classList.remove('is-playing');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
}());
