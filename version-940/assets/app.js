(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var index = 0;

    function activateHero(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activateHero(Number(dot.getAttribute('data-hero-target') || 0));
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activateHero(index + 1);
      }, 5600);
    }

    var searchInput = document.getElementById('search-input');
    var typeFilter = document.getElementById('type-filter');
    var localSearch = document.querySelector('.local-search');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-list .movie-card, .searchable-list .horizontal-card'));

    function applyFilter() {
      var keyword = normalize(searchInput ? searchInput.value : localSearch ? localSearch.value : '');
      var type = normalize(typeFilter ? typeFilter.value : '');

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchedType = !type || cardType === type;
        card.hidden = !(matchedKeyword && matchedType);
      });
    }

    if (searchInput) {
      var query = new URLSearchParams(window.location.search).get('q') || '';
      searchInput.value = query;
      searchInput.addEventListener('input', applyFilter);
      applyFilter();
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilter);
    }

    if (localSearch) {
      localSearch.addEventListener('input', applyFilter);
    }
  });
})();
