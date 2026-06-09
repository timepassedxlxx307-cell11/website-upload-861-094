(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    var search = document.querySelector('.header-search');

    if (menuButton && nav && search) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('is-open');
            search.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var prev = carousel.querySelector('.hero-prev');
        var next = carousel.querySelector('.hero-next');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function run() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                run();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                run();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                run();
            });
        });

        show(0);
        run();
    }

    var searchPage = document.querySelector('[data-search-page]');

    if (searchPage) {
        var input = document.getElementById('searchInput');
        var category = document.getElementById('categoryFilter');
        var type = document.getElementById('typeFilter');
        var clear = document.getElementById('clearSearch');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-results] .movie-card'));
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';

        if (input) {
            input.value = q;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function filter() {
            var term = normalize(input && input.value);
            var categoryValue = category ? category.value : '';
            var typeValue = type ? type.value : '';

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var cardCategory = card.getAttribute('data-category') || '';
                var cardType = card.getAttribute('data-type') || '';
                var visible = true;

                if (term && text.indexOf(term) === -1) {
                    visible = false;
                }

                if (categoryValue && cardCategory !== categoryValue) {
                    visible = false;
                }

                if (typeValue && cardType !== typeValue) {
                    visible = false;
                }

                card.classList.toggle('hidden-by-filter', !visible);
            });
        }

        [input, category, type].forEach(function (node) {
            if (node) {
                node.addEventListener('input', filter);
                node.addEventListener('change', filter);
            }
        });

        if (clear) {
            clear.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                if (category) {
                    category.value = '';
                }
                if (type) {
                    type.value = '';
                }
                filter();
            });
        }

        filter();
    }
}());
