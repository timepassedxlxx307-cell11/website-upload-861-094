(function () {
  var shell = document.querySelector('[data-player]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-player-toggle]');
  var source = shell.getAttribute('data-src');
  var hls = null;
  var attached = false;

  var attach = function () {
    if (!video || !source || attached) {
      return;
    }

    attached = true;

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }
  };

  var play = function () {
    attach();
    var request = video.play();

    if (request && typeof request.catch === 'function') {
      request.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  };

  if (button) {
    button.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });

    video.addEventListener('ended', function () {
      shell.classList.remove('is-playing');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
