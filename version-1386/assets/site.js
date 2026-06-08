
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMobileNavigation() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    document.querySelectorAll('[data-movie-filter]').forEach(function (section) {
      var query = section.querySelector('[data-filter-query]');
      var type = section.querySelector('[data-filter-type]');
      var region = section.querySelector('[data-filter-region]');
      var year = section.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(section.querySelectorAll('[data-movie-card]'));
      var empty = section.querySelector('[data-filter-empty]');

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function apply() {
        var q = normalize(query && query.value);
        var selectedType = normalize(type && type.value);
        var selectedRegion = normalize(region && region.value);
        var selectedYear = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var keywords = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.keywords
          ].join(' '));
          var matchesQuery = !q || keywords.indexOf(q) !== -1;
          var matchesType = !selectedType || normalize(card.dataset.type) === selectedType;
          var matchesRegion = !selectedRegion || normalize(card.dataset.region) === selectedRegion;
          var matchesYear = !selectedYear || normalize(card.dataset.year) === selectedYear;
          var matched = matchesQuery && matchesType && matchesRegion && matchesYear;
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [query, type, region, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  function attachImageFallback() {
    document.querySelectorAll('img[data-cover]').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-missing');
      });
    });
  }

  function initPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (panel) {
      var video = panel.querySelector('video');
      var button = panel.querySelector('[data-player-button]');
      var status = panel.querySelector('[data-player-status]');
      var hls = null;
      var loaded = false;

      if (!video || !button) {
        return;
      }

      function setStatus(text) {
        if (status) {
          status.textContent = text;
        }
      }

      function loadAndPlay() {
        var source = button.getAttribute('data-source');
        if (!source) {
          setStatus('播放遇到问题，请稍后重试');
          return;
        }

        button.classList.add('is-hidden');
        setStatus('正在加载');

        if (!loaded) {
          if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              setStatus('正在播放');
              video.play().catch(function () {
                button.classList.remove('is-hidden');
                setStatus('点击继续播放');
              });
            });
            hls.on(window.Hls.Events.ERROR, function () {
              setStatus('播放遇到问题，请稍后重试');
            });
          } else {
            video.src = source;
            video.addEventListener('loadedmetadata', function () {
              setStatus('正在播放');
              video.play().catch(function () {
                button.classList.remove('is-hidden');
                setStatus('点击继续播放');
              });
            }, { once: true });
          }
          loaded = true;
        } else {
          video.play().then(function () {
            setStatus('正在播放');
          }).catch(function () {
            button.classList.remove('is-hidden');
            setStatus('点击继续播放');
          });
        }
      }

      button.addEventListener('click', loadAndPlay);
      video.addEventListener('click', function () {
        if (video.paused) {
          loadAndPlay();
        }
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          setStatus('已暂停');
        }
      });
      video.addEventListener('play', function () {
        setStatus('正在播放');
      });
      video.addEventListener('ended', function () {
        button.classList.remove('is-hidden');
        setStatus('播放结束');
      });
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    initMobileNavigation();
    initHero();
    initFilters();
    attachImageFallback();
    initPlayers();
  });
})();
