(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get("q") || "";
    var field = document.querySelector("[data-filter-keyword]");
    if (field && keyword) {
      field.value = keyword;
      field.dispatchEvent(new Event("input"));
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    function start() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    function reset() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      start();
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        reset();
      });
    });
    start();
  }

  function initImages() {
    document.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("is-missing");
      }, { once: true });
    });
  }

  function initSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = form.getAttribute("action") || "./videos.html";
        }
      });
    });
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var scope = panel.parentElement || document;
      var keywordInput = panel.querySelector("[data-filter-keyword]");
      var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-row"));
      var empty = scope.querySelector("[data-empty-state]");
      function readCard(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-category")
        ].map(normalize).join(" ");
      }
      function apply() {
        var keyword = normalize(keywordInput ? keywordInput.value : "");
        var activeFilters = selects.map(function (select) {
          return {
            key: select.getAttribute("data-filter"),
            value: normalize(select.value)
          };
        }).filter(function (item) {
          return item.value;
        });
        var shown = 0;
        cards.forEach(function (card) {
          var text = readCard(card);
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedFilters = activeFilters.every(function (item) {
            return normalize(card.getAttribute("data-" + item.key)).indexOf(item.value) !== -1;
          });
          var visible = matchedKeyword && matchedFilters;
          card.classList.toggle("is-hidden", !visible);
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      }
      if (keywordInput) {
        keywordInput.addEventListener("input", apply);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", apply);
      });
      apply();
    });
    setQueryFromUrl();
  }

  ready(function () {
    initMenu();
    initHero();
    initImages();
    initSearchForms();
    initFilters();
  });
})();
