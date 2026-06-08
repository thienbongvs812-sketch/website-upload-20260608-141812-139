(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

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
        showSlide(index);
      });
    });

    setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  var filterInput = document.querySelector('[data-card-filter]');

  if (filterInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    filterInput.addEventListener('input', function () {
      var keyword = filterInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();

        card.style.display = text.indexOf(keyword) === -1 ? 'none' : '';
      });
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchResults = document.querySelector('[data-search-results]');

  if (searchForm && searchResults && window.SEARCH_INDEX) {
    var searchInput = searchForm.querySelector('input[name="q"]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    function escapeHtml(text) {
      return String(text || '').replace(/[&<>"']/g, function (value) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[value];
      });
    }

    function cardTemplate(item) {
      var title = escapeHtml(item.title);
      var oneLine = escapeHtml(item.oneLine);
      var year = escapeHtml(item.year);
      var region = escapeHtml(item.region);
      var type = escapeHtml(item.type);
      var category = escapeHtml(item.category);
      var genre = escapeHtml(item.genre);
      var link = encodeURI(item.link);
      var cover = encodeURI(item.cover);

      return [
        '<article class="movie-card">',
        '  <a class="poster" href="' + link + '">',
        '    <img src="' + cover + '" alt="' + title + '" loading="lazy">',
        '    <span class="poster-play">▶</span>',
        '  </a>',
        '  <div class="card-body">',
        '    <a class="card-title" href="' + link + '">' + title + '</a>',
        '    <p>' + oneLine + '</p>',
        '    <div class="card-meta">',
        '      <span>' + year + '</span>',
        '      <span>' + region + '</span>',
        '      <span>' + type + '</span>',
        '    </div>',
        '    <div class="card-tags"><span>' + category + '</span><span>' + genre + '</span></div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function renderSearch(query) {
      var keyword = query.trim().toLowerCase();
      var items = window.SEARCH_INDEX;

      if (keyword) {
        items = items.filter(function (item) {
          return [
            item.title,
            item.region,
            item.type,
            item.year,
            item.genre,
            item.category,
            item.tags,
            item.oneLine
          ].join(' ').toLowerCase().indexOf(keyword) !== -1;
        });
      }

      searchResults.innerHTML = items.slice(0, 72).map(cardTemplate).join('');
    }

    searchInput.value = initialQuery;
    renderSearch(initialQuery);

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = searchInput.value.trim();
      var url = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
      window.history.replaceState(null, '', url);
      renderSearch(query);
    });
  }
}());
