(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initYear() {
    $all('[data-year]').forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  function initMobileMenu() {
    var button = $('[data-mobile-toggle]');
    var menu = $('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = $('[data-hero]');
    if (!root) {
      return;
    }
    var slides = $all('[data-hero-slide]', root);
    var dots = $all('[data-hero-dot]', root);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initSearch() {
    var scopes = $all('[data-search-scope]');
    if (!scopes.length) {
      scopes = [document];
    }
    var panel = $('[data-search-panel]');
    if (!panel) {
      return;
    }
    var input = $('[data-search-input]', panel);
    var clear = $('[data-search-clear]', panel);
    var filterButtons = $all('[data-filter-value]', panel);
    var activeCategory = 'all';

    function cards() {
      var result = [];
      scopes.forEach(function (scope) {
        result = result.concat($all('[data-movie-card]', scope));
      });
      return result;
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      cards().forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var category = card.getAttribute('data-category') || '';
        var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
        var categoryMatched = activeCategory === 'all' || category === activeCategory;
        card.classList.toggle('hidden-by-filter', !(keywordMatched && categoryMatched));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }
    if (clear) {
      clear.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        apply();
        if (input) {
          input.focus();
        }
      });
    }
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeCategory = button.getAttribute('data-filter-value') || 'all';
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        apply();
      });
    });
    apply();
  }

  function initPlayers() {
    $all('.movie-player').forEach(function (player) {
      var video = $('.player-video', player);
      var overlay = $('.player-overlay', player);
      var errorBox = $('.player-error', player);
      var src = player.getAttribute('data-video-src');
      var hlsInstance = null;
      var initialized = false;

      function showError(text) {
        if (!errorBox) {
          return;
        }
        errorBox.textContent = text;
        errorBox.classList.add('is-visible');
      }

      function hideError() {
        if (!errorBox) {
          return;
        }
        errorBox.textContent = '';
        errorBox.classList.remove('is-visible');
      }

      function attach() {
        if (!video || !src || initialized) {
          return;
        }
        initialized = true;
        hideError();
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
              return;
            }
            if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
              return;
            }
            showError('播放暂时不可用，请稍后再试');
          });
          return;
        }
        video.src = src;
      }

      function play() {
        if (!video) {
          return;
        }
        attach();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            showError('点击视频区域可继续播放');
          });
        }
      }

      if (overlay) {
        overlay.addEventListener('click', play);
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
          if (overlay) {
            overlay.classList.add('is-hidden');
          }
          hideError();
        });
      }
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });

    $all('[data-player-jump]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var player = $('.movie-player');
        if (player) {
          player.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var overlay = $('.player-overlay', player);
          if (overlay) {
            overlay.click();
          }
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initMobileMenu();
    initHero();
    initSearch();
    initPlayers();
  });
})();
