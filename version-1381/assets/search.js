(function () {
  var form = document.querySelector('[data-search-form]');
  var input = form ? form.querySelector('input[name="q"]') : null;
  var results = document.querySelector('[data-search-results]');
  var title = document.querySelector('[data-search-title]');

  if (!form || !input || !results || !Array.isArray(window.FILM_INDEX) && typeof FILM_INDEX === 'undefined') {
    return;
  }

  var films = typeof FILM_INDEX !== 'undefined' ? FILM_INDEX : window.FILM_INDEX;

  function escapeText(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function card(film) {
    var tags = (film.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeText(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '<a class="movie-cover" href="' + escapeText(film.url) + '">',
      '<img src="' + escapeText(film.cover) + '" alt="' + escapeText(film.title) + '" loading="lazy">',
      '<span class="movie-badge">' + escapeText(film.category || film.region) + '</span>',
      '<span class="movie-play">▶</span>',
      '</a>',
      '<div class="movie-body">',
      '<h3><a href="' + escapeText(film.url) + '">' + escapeText(film.title) + '</a></h3>',
      '<p>' + escapeText(film.oneLine) + '</p>',
      '<div class="movie-meta">',
      '<span>' + escapeText(film.region) + '</span>',
      '<span>' + escapeText(film.type) + '</span>',
      '<span>' + escapeText(film.year) + '</span>',
      '</div>',
      '<div class="tag-row">' + tags + '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function runSearch(query) {
    var q = query.trim().toLowerCase();
    var matched = films.filter(function (film) {
      var text = [film.title, film.region, film.type, film.year, film.genre, film.oneLine, (film.tags || []).join(' ')].join(' ').toLowerCase();
      return !q || text.indexOf(q) !== -1;
    }).slice(0, 120);

    title.textContent = q ? '搜索结果' : '精选热播';
    results.innerHTML = matched.map(card).join('');
  }

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  if (initial) {
    runSearch(initial);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var q = input.value.trim();
    var url = q ? 'search.html?q=' + encodeURIComponent(q) : 'search.html';
    history.replaceState(null, '', url);
    runSearch(q);
  });
})();
