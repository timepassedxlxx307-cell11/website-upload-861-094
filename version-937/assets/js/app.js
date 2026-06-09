(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.site-menu');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = './search.html';

      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var active = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === active);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === active);
    });
  }

  function startHero() {
    if (timer) {
      window.clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startHero();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(active - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(active + 1);
      startHero();
    });
  }

  startHero();

  var filterInput = document.querySelector('[data-page-filter]');
  var filterList = document.querySelector('[data-filter-list]');
  var emptyState = document.querySelector('[data-empty-state]');
  var localForm = document.querySelector('[data-local-search-form]');

  function applyFilter() {
    if (!filterInput || !filterList) {
      return;
    }

    var query = filterInput.value.trim().toLowerCase();
    var visible = 0;
    var cards = filterList.querySelectorAll('[data-movie-card]');

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var matched = !query || text.indexOf(query) !== -1;
      card.style.display = matched ? '' : 'none';

      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      filterInput.value = q;
    }

    filterInput.addEventListener('input', applyFilter);
    applyFilter();
  }

  if (localForm) {
    localForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });
  }
})();
