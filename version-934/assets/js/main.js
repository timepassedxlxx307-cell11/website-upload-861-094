(function () {
  "use strict";

  function selectAll(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector),
    );
  }

  function setupNavigation() {
    var button = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
      return;
    }

    var slides = selectAll("[data-hero-slide]", hero);
    var dots = selectAll("[data-hero-dot]", hero);
    var index = 0;

    if (slides.length < 2) {
      return;
    }

    function show(nextIndex) {
      slides[index].classList.remove("active");
      dots[index].classList.remove("active");
      index = nextIndex;
      slides[index].classList.add("active");
      dots[index].classList.add("active");
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });

    window.setInterval(function () {
      show((index + 1) % slides.length);
    }, 5200);
  }

  function setupFilters() {
    var form = document.querySelector("[data-filter-form]");
    var cards = selectAll("[data-movie-card]");

    if (!form || !cards.length) {
      return;
    }

    var search = form.querySelector("[data-filter-search]");
    var region = form.querySelector("[data-filter-region]");
    var type = form.querySelector("[data-filter-type]");
    var category = form.querySelector("[data-filter-category]");
    var params = new URLSearchParams(window.location.search);

    if (search && params.get("q")) {
      search.value = params.get("q");
    }

    function valueOf(input) {
      return input ? input.value.trim().toLowerCase() : "";
    }

    function apply() {
      var query = valueOf(search);
      var regionValue = valueOf(region);
      var typeValue = valueOf(type);
      var categoryValue = valueOf(category);

      cards.forEach(function (card) {
        var text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.category,
          card.dataset.year,
          card.textContent,
        ]
          .join(" ")
          .toLowerCase();
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchRegion =
          !regionValue ||
          (card.dataset.region || "").toLowerCase() === regionValue;
        var matchType =
          !typeValue || (card.dataset.type || "").toLowerCase() === typeValue;
        var matchCategory =
          !categoryValue ||
          (card.dataset.category || "").toLowerCase() === categoryValue;
        card.classList.toggle(
          "is-hidden",
          !(matchQuery && matchRegion && matchType && matchCategory),
        );
      });
    }

    [search, region, type, category].forEach(function (input) {
      if (input) {
        input.addEventListener("input", apply);
        input.addEventListener("change", apply);
      }
    });

    form.addEventListener("reset", function () {
      window.setTimeout(apply, 0);
    });

    apply();
  }

  function setupPlayer() {
    var player = document.querySelector("[data-player]");

    if (!player) {
      return;
    }

    var video = player.querySelector("video");
    var startButton = player.querySelector("[data-play]");
    var stream = player.getAttribute("data-stream");
    var ready = false;
    var hlsInstance = null;

    if (!video || !stream) {
      return;
    }

    function bindStream() {
      if (ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        ready = true;
        return;
      }

      video.src = stream;
      ready = true;
    }

    function play() {
      bindStream();
      player.classList.add("is-playing");
      video.controls = true;
      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (startButton) {
      startButton.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupNavigation();
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
