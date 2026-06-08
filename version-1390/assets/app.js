(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const previous = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let activeIndex = 0;
    let timer = null;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => showSlide(activeIndex + 1), 5200);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        showSlide(dotIndex);
        start();
      });
    });

    if (previous) {
      previous.addEventListener('click', () => {
        showSlide(activeIndex - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        showSlide(activeIndex + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  const queryParams = new URLSearchParams(window.location.search);
  const queryValue = queryParams.get('q') || '';
  const searchInput = document.getElementById('movieSearchInput') || document.querySelector('[data-local-filter]');
  const typeFilter = document.getElementById('movieTypeFilter');
  const grid = document.querySelector('[data-search-grid]');

  if (searchInput && queryValue) {
    searchInput.value = queryValue;
  }

  const applyFilter = () => {
    if (!grid || !searchInput) {
      return;
    }

    const keyword = searchInput.value.trim().toLowerCase();
    const typeValue = typeFilter ? typeFilter.value.trim().toLowerCase() : '';
    const cards = Array.from(grid.querySelectorAll('.movie-card'));

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const typeText = (card.getAttribute('data-type') || '').toLowerCase();
      const keywordMatch = !keyword || text.includes(keyword);
      const typeMatch = !typeValue || typeText.includes(typeValue) || text.includes(typeValue);
      card.classList.toggle('is-filtered-out', !(keywordMatch && typeMatch));
    });
  };

  if (searchInput && grid) {
    searchInput.addEventListener('input', applyFilter);
    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilter);
    }
    applyFilter();
  }
})();
