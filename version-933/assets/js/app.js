(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });

    show(0);
    play();
  }

  function initHomeSearch() {
    var input = document.querySelector('.js-card-search');
    var grid = document.querySelector('.js-home-grid');
    if (!input || !grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var keyword = normalize(input.value);
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-card-title') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-type'));
        card.style.display = !keyword || haystack.indexOf(keyword) !== -1 ? '' : 'none';
      });
    });
  }

  function initListFilter() {
    var list = document.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }
    var keywordInput = document.querySelector('.js-list-search');
    var yearSelect = document.querySelector('.js-year-filter');
    var regionSelect = document.querySelector('.js-region-filter');
    var empty = document.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    function apply() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var year = yearSelect ? yearSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-card-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type')
        ].join(' '));
        var matched = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && card.getAttribute('data-year') !== year) {
          matched = false;
        }
        if (region && card.getAttribute('data-region') !== region) {
          matched = false;
        }
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [keywordInput, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  }

  function initSearchPage() {
    var root = document.querySelector('.search-page');
    var movies = window.SEARCH_MOVIES;
    if (!root || !Array.isArray(movies)) {
      return;
    }
    var input = document.getElementById('searchInput');
    var year = document.getElementById('searchYear');
    var region = document.getElementById('searchRegion');
    var type = document.getElementById('searchType');
    var results = document.getElementById('searchResults');
    var status = document.getElementById('searchStatus');

    function card(movie) {
      return [
        '<a class="movie-card" href="movie/' + encodeURIComponent(movie.file) + '">',
        '<span class="movie-card__poster">',
        '<img src="./' + encodeURIComponent(movie.cover) + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '<em>' + escapeHtml(movie.score) + '</em>',
        '</span>',
        '<strong>' + escapeHtml(movie.title) + '</strong>',
        '<small>' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</small>',
        '<p>' + escapeHtml(movie.oneLine) + '</p>',
        '<span class="tag-row"><span>' + escapeHtml(movie.genre) + '</span><span>' + escapeHtml(movie.category) + '</span></span>',
        '</a>'
      ].join('');
    }

    function render() {
      var keyword = normalize(input.value);
      var selectedYear = year.value;
      var selectedRegion = region.value;
      var selectedType = type.value;
      var filtered = movies.filter(function (movie) {
        var haystack = normalize([movie.title, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine, movie.year].join(' '));
        if (keyword && haystack.indexOf(keyword) === -1) {
          return false;
        }
        if (selectedYear && movie.year !== selectedYear) {
          return false;
        }
        if (selectedRegion && movie.region !== selectedRegion) {
          return false;
        }
        if (selectedType && movie.type !== selectedType) {
          return false;
        }
        return true;
      }).slice(0, 96);

      results.innerHTML = filtered.map(card).join('');
      if (status) {
        status.textContent = filtered.length ? '已更新匹配影片，点击卡片可进入详情页。' : '没有匹配的影片，换个关键词试试。';
      }
    }

    [input, year, region, type].forEach(function (control) {
      control.addEventListener('input', render);
      control.addEventListener('change', render);
    });

    render();
  }

  ready(function () {
    initMenu();
    initHero();
    initHomeSearch();
    initListFilter();
    initSearchPage();
  });
}());
