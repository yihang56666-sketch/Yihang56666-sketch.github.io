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
