/* Calm liquid float — path drops sit on a soft ring, legible, crystalline */
(function () {
  var p = (location.pathname || '/').replace(/\/+$/, '') || '/';
  if (p !== '/home' && p !== '/home/index.html' && p !== '/home/') return;
  if (window.__promiiCalm) return;
  window.__promiiCalm = true;

  if (!document.getElementById('pm-calm-css')) {
    var st = document.createElement('style');
    st.id = 'pm-calm-css';
    st.textContent =
      'body.open #world .drop:not(.core){' +
      '  transform:none!important;' +
      '  will-change:top,left;' +
      '  transition:left .7s cubic-bezier(.22,1,.36,1),top .7s cubic-bezier(.22,1,.36,1);' +
      '}' +
      'body.open #world .drop:not(.core) span{' +
      '  font-weight:700!important;font-size:clamp(12px,1.6vw,15px)!important;' +
      '  letter-spacing:.02em!important;' +
      '}';
    document.head.appendChild(st);
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
      if (el.dataset.calm === '1') return;
      var ang = (i / n) * Math.PI * 2 - Math.PI / 4;
      var rad = i < Math.ceil(n * 0.55) ? R0 * 0.78 : R0 * 1.18;
      var hx = cx + Math.cos(ang) * rad;
      var hy = cy + Math.sin(ang) * rad;
      var phase = i * 0.85;
      el.dataset.calm = '1';
      el.style.pointerEvents = 'auto';
      el.style.zIndex = '12';
      el.style.left = '0';
      el.style.top = '0';

      function floatTick() {
        if (!body.classList.contains('open') || !el.isConnected) {
          delete el.dataset.calm;
          return;
        }
        var bob = Math.sin(performance.now() * 0.0012 + phase) * 3.5;
        var rr = (el.offsetWidth || 80) / 2;
        el.style.left = (hx - rr).toFixed(1) + 'px';
        el.style.top = (hy + bob - rr).toFixed(1) + 'px';
        el.style.transform = 'none';
        requestAnimationFrame(floatTick);
      }
      requestAnimationFrame(floatTick);
    });
  }

  var body = document.body;
  var mo = new MutationObserver(function () {
    if (body.classList.contains('open')) setTimeout(freezeOpen, 30);
  });
  mo.observe(body, { attributes: true, attributeFilter: ['class'] });
  addEventListener('promii:burst', function () { setTimeout(freezeOpen, 40); });

  function boot() {
    if (document.body.classList.contains('open')) freezeOpen();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1000);
})();
