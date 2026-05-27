(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var bar = document.createElement('div');
    bar.className = 'beid-reading-progress';
    document.body.appendChild(bar);

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(100, Math.max(0, scrollTop / max * 100)) : 0;
      bar.style.width = progress + '%';
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.beid-reveal').forEach(function (node, index) {
      node.style.transitionDelay = reduceMotion ? '0ms' : Math.min(index * 70, 280) + 'ms';
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.beid-reveal').forEach(function (node) {
        observer.observe(node);
      });
    } else {
      document.querySelectorAll('.beid-reveal').forEach(function (node) {
        node.classList.add('is-visible');
      });
    }

    if (!reduceMotion && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      var light = document.createElement('div');
      light.className = 'beid-cursor-light';
      document.body.appendChild(light);

      window.addEventListener('pointermove', function (event) {
        light.classList.add('is-visible');
        light.style.transform = 'translate3d(' + event.clientX + 'px, ' + event.clientY + 'px, 0) translate3d(-50%, -50%, 0)';
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        light.classList.remove('is-visible');
      });
    }

    document.querySelectorAll('#article-container img').forEach(function (img) {
      img.loading = img.loading || 'lazy';
      img.decoding = img.decoding || 'async';
      if (!img.closest('a')) {
        img.classList.add('beid-zoomable');
        img.addEventListener('click', function () {
          var overlay = document.createElement('div');
          overlay.className = 'beid-image-viewer';
          overlay.innerHTML = '<img src="' + img.currentSrc + '" alt="">';
          overlay.addEventListener('click', function () {
            overlay.remove();
          });
          document.body.appendChild(overlay);
        });
      }
    });

    document.querySelectorAll('#article-container a[href^="http"]').forEach(function (link) {
      link.rel = 'noopener noreferrer';
      link.target = '_blank';
    });
  });
}());
