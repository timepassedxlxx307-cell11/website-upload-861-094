(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    var reset = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        reset();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        reset();
      });
    });

    start();
  }

  var searchForm = document.querySelector('[data-site-search]');
  var searchInput = document.getElementById('movieSearch');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-grid] [data-search]'));
  var noResults = document.querySelector('[data-no-results]');
  var activeFilter = 'all';

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  var normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  var applyFilters = function () {
    var query = normalize(searchInput ? searchInput.value : '');
    var matched = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var queryMatch = !query || haystack.indexOf(query) !== -1;
      var filterMatch = activeFilter === 'all' || haystack.indexOf(normalize(activeFilter)) !== -1;
      var visible = queryMatch && filterMatch;
      card.classList.toggle('is-hidden', !visible);
      if (visible) {
        matched += 1;
      }
    });

    if (noResults) {
      noResults.classList.toggle('is-visible', cards.length > 0 && matched === 0);
    }
  };

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', applyFilters);
    applyFilters();
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (cards.length) {
        applyFilters();
      } else if (searchInput && searchInput.value.trim()) {
        window.location.href = searchForm.getAttribute('data-target') || './categories.html?q=' + encodeURIComponent(searchInput.value.trim());
      }
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      applyFilters();
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('img')).forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.opacity = '0';
    }, { once: true });
  });
})();
