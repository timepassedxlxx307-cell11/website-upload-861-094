(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(
      root.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      root.querySelectorAll("[data-hero-dot]"),
    );
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        startTimer();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        startTimer();
      });
    }
    root.addEventListener("mouseenter", stopTimer);
    root.addEventListener("mouseleave", startTimer);
    show(0);
    startTimer();
  }

  function initLocalFilters() {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-movie-card]"),
    );
    var input = document.querySelector("[data-filter-input]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var yearFilter = document.querySelector("[data-year-filter]");
    if (!cards.length || !input || !typeFilter || !yearFilter) {
      return;
    }

    var types = [];
    var years = [];
    cards.forEach(function (card) {
      var type = card.getAttribute("data-type") || "";
      var year = card.getAttribute("data-year") || "";
      if (type && types.indexOf(type) === -1) {
        types.push(type);
      }
      if (year && years.indexOf(year) === -1) {
        years.push(year);
      }
    });
    types.sort();
    years.sort().reverse();
    types.forEach(function (type) {
      var option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      typeFilter.appendChild(option);
    });
    years.forEach(function (year) {
      var option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });

    function applyFilter() {
      var keyword = input.value.trim().toLowerCase();
      var typeValue = typeFilter.value;
      var yearValue = yearFilter.value;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var typeMatch =
          !typeValue || card.getAttribute("data-type") === typeValue;
        var yearMatch =
          !yearValue || card.getAttribute("data-year") === yearValue;
        var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle(
          "is-hidden",
          !(typeMatch && yearMatch && keywordMatch),
        );
      });
    }

    input.addEventListener("input", applyFilter);
    typeFilter.addEventListener("change", applyFilter);
    yearFilter.addEventListener("change", applyFilter);
  }

  function initGlobalSearch() {
    var input = document.querySelector("[data-global-search]");
    var button = document.querySelector("[data-global-search-button]");
    var output = document.querySelector("[data-global-search-results]");
    var data = window.SITE_SEARCH_DATA || [];
    if (!input || !output || !data.length) {
      return;
    }

    function render() {
      var keyword = input.value.trim().toLowerCase();
      output.innerHTML = "";
      if (!keyword) {
        return;
      }
      var results = data
        .filter(function (item) {
          return item.search.indexOf(keyword) !== -1;
        })
        .slice(0, 16);
      results.forEach(function (item) {
        var link = document.createElement("a");
        link.className = "search-result-card";
        link.href = item.href;
        link.innerHTML =
          '<img src="' +
          item.image +
          '" alt="' +
          item.title +
          '"><span><strong>' +
          item.title +
          "</strong><span>" +
          item.year +
          " · " +
          item.region +
          " · " +
          item.type +
          "</span></span>";
        output.appendChild(link);
      });
    }

    input.addEventListener("input", render);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        render();
      }
    });
    if (button) {
      button.addEventListener("click", render);
    }
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(
      document.querySelectorAll("[data-player]"),
    );
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var cover = player.querySelector("[data-play-layer]");
      var stream = player.getAttribute("data-stream") || "";
      var started = false;
      var hlsInstance = null;
      if (!video || !cover || !stream) {
        return;
      }

      function playVideo() {
        if (started) {
          video.play().catch(function () {});
          return;
        }
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
        video.setAttribute("controls", "controls");
        cover.classList.add("is-hidden");
        video.play().catch(function () {});
      }

      cover.addEventListener("click", playVideo);
      video.addEventListener("click", function () {
        if (!started) {
          playVideo();
        }
      });
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    });

    var scrollButton = document.querySelector("[data-scroll-player]");
    if (scrollButton) {
      scrollButton.addEventListener("click", function (event) {
        event.preventDefault();
        var player = document.querySelector("[data-player]");
        if (player) {
          player.scrollIntoView({ behavior: "smooth", block: "center" });
          var cover = player.querySelector("[data-play-layer]");
          if (cover) {
            cover.click();
          }
        }
      });
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initLocalFilters();
    initGlobalSearch();
    initPlayers();
  });
})();
