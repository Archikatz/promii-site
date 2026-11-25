/* Calm liquid float for home path drops — soft ring, legible, no wild orbit */
(function () {
  var p = (location.pathname || '/').replace(/\/+$/, '') || '/';
  if (p !== '/home' && p !== '/home/index.html') return;
  if (window.__promiiCalm) return;
  window.__promiiCalm = true;

  function calmBodies() {
    /* Soften velocities on any body list we can reach */
    try {
      var core = window.__promiiCore;
      if (!core) return;
    } catch (e) {}
  }

  function freezeOpen() {
    var body = document.body;
    var hero = document.getElementById('hero');
    if (!body.classList.contains('open') || !hero) return;
    var drops = document.querySelectorAll('#world .drop:not(.core)');
    var W = hero.clientWidth, H = hero.clientHeight, cx = W / 2, cy = H / 2 + 20;
    var n = Math.max(drops.length, 1);
    var R0 = Math.max(120, Math.min(W, H) * 0.34);
    drops.forEach(function (el, i) {
      el.dataset.calm = '1';
      var ang = (i / n) * Math.PI * 2 - Math.PI / 4;
      var rad = i < Math.ceil(n * 0.55) ? R0 * 0.78 : R0 * 1.18;
      var hx = cx + Math.cos(ang) * rad;
      var hy = cy + Math.sin(ang) * rad;
      var phase = i * 0.85;
      el.style.pointerEvents = 'auto';
      el.style.zIndex = '12';
      function floatTick() {
        if (!body.classList.contains('open') || !el.isConnected) {
          delete el.dataset.calm;
          return;
        }
        var bob = Math.sin(performance.now() * 0.0013 + phase) * 3.2;
        var r = (el.offsetWidth || 80) / 2;
        el.style.transform = 'translate3d(' + (hx - r).toFixed(1) + 'px,' + (hy + bob - r).toFixed(1) + 'px,0)';
        requestAnimationFrame(floatTick);
      }
      requestAnimationFrame(floatTick);
    });
    calmBodies();
  }

  var body = document.body;
  var mo = new MutationObserver(function () {
    if (body.classList.contains('open')) setTimeout(freezeOpen, 40);
  });
  mo.observe(body, { attributes: true, attributeFilter: ['class'] });

  /* After burst event */
  addEventListener('promii:burst', function () { setTimeout(freezeOpen, 50); });

  function boot() {
    if (document.body.classList.contains('open')) freezeOpen();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 500);
})();
