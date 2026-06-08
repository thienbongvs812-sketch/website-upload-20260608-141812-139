(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');

  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterSelect = document.querySelector('[data-filter-select="type"]');
  var filterReset = document.querySelector('[data-filter-reset]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-grid article'));

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var type = filterSelect ? filterSelect.value.trim() : '';

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesType = !type || (card.getAttribute('data-type') || '').indexOf(type) !== -1;
      card.classList.toggle('is-hidden-card', !(matchesQuery && matchesType));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', filterCards);
  }

  if (filterReset) {
    filterReset.addEventListener('click', function () {
      if (filterInput) {
        filterInput.value = '';
      }
      if (filterSelect) {
        filterSelect.value = '';
      }
      filterCards();
    });
  }
})();
