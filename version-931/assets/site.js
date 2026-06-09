(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');

    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    if (!slides.length) {
      return;
    }

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setupSearchForms() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var target = form.getAttribute('action') || './search.html';
        var url = query ? target + '?q=' + encodeURIComponent(query) : target;
        window.location.href = url;
      });
    });
  }

  function setupFilters() {
    var panel = document.querySelector('[data-filter-panel]');

    if (!panel) {
      return;
    }

    var queryInput = document.getElementById('siteSearch');
    var regionInput = document.getElementById('filterRegion');
    var typeInput = document.getElementById('filterType');
    var yearInput = document.getElementById('filterYear');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var noResults = document.querySelector('[data-no-results]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (queryInput && initialQuery) {
      queryInput.value = initialQuery;
    }

    function matches(card) {
      var query = normalize(queryInput && queryInput.value);
      var region = normalize(regionInput && regionInput.value);
      var type = normalize(typeInput && typeInput.value);
      var year = normalize(yearInput && yearInput.value);
      var haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags
      ].join(' '));

      if (query && haystack.indexOf(query) === -1) {
        return false;
      }

      if (region && normalize(card.dataset.region) !== region) {
        return false;
      }

      if (type && normalize(card.dataset.type) !== type) {
        return false;
      }

      if (year && normalize(card.dataset.year) !== year) {
        return false;
      }

      return true;
    }

    function apply() {
      var visible = 0;

      cards.forEach(function (card) {
        var ok = matches(card);
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (noResults) {
        noResults.hidden = visible > 0;
      }
    }

    [queryInput, regionInput, typeInput, yearInput].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupSearchForms();
    setupFilters();
  });
}());
