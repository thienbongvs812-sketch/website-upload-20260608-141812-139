(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function bindMobileMenu() {
        var button = qs(".mobile-menu-button");
        var nav = qs(".mobile-nav");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function bindHero() {
        var hero = qs("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = qsa("[data-hero-slide]", hero);
        var dots = qsa("[data-hero-dot]", hero);
        if (!slides.length) {
            return;
        }
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5600);
    }

    function bindFilters() {
        var tools = qs(".catalog-tools");
        if (!tools) {
            return;
        }
        var cards = qsa(".movie-card");
        var input = qs("[data-search-input]", tools);
        var year = qs("[data-filter-year]", tools);
        var type = qs("[data-filter-type]", tools);
        var region = qs("[data-filter-region]", tools);
        var category = qs("[data-filter-category]", tools);
        var empty = qs(".no-results");
        var params = new URLSearchParams(window.location.search);
        if (input && params.get("q")) {
            input.value = params.get("q");
        }
        function valueOf(node) {
            return node ? node.value.trim().toLowerCase() : "";
        }
        function apply() {
            var q = valueOf(input);
            var y = valueOf(year);
            var t = valueOf(type);
            var r = valueOf(region);
            var c = valueOf(category);
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.dataset.search || "").toLowerCase();
                var ok = true;
                if (q && text.indexOf(q) === -1) {
                    ok = false;
                }
                if (y && (card.dataset.year || "").toLowerCase().indexOf(y) === -1) {
                    ok = false;
                }
                if (t && (card.dataset.type || "").toLowerCase().indexOf(t) === -1) {
                    ok = false;
                }
                if (r && (card.dataset.region || "").toLowerCase().indexOf(r) === -1) {
                    ok = false;
                }
                if (c && (card.dataset.category || "").toLowerCase().indexOf(c) === -1) {
                    ok = false;
                }
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }
        [input, year, type, region, category].forEach(function (node) {
            if (!node) {
                return;
            }
            node.addEventListener("input", apply);
            node.addEventListener("change", apply);
        });
        tools.addEventListener("submit", function (event) {
            event.preventDefault();
            apply();
        });
        apply();
    }

    function bindImageFallback() {
        qsa("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.classList.add("is-missing");
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        bindMobileMenu();
        bindHero();
        bindFilters();
        bindImageFallback();
    });
})();
