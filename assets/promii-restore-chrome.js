/* Restores Promii chrome on Hyperfluid flagship pages without wiping the stage */
(function () {
  function ensureCss(href, id) {
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id;
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
  function ensureScript(src, id, attrs) {
    if (document.getElementById(id)) return;
    var s = document.createElement('script');
    s.id = id;
    s.src = src;
    if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
  }
  function injectLogo(sel) {
    var el = document.querySelector(sel);
    if (!el || el.querySelector('img.pm-bz-logo')) return;
    var img = document.createElement('img');
    img.className = 'pm-bz-logo';
    img.src = '/assets/logo/bz-mark-glass.svg';
    img.width = 28; img.height = 28;
    img.alt = 'Brian Zuleta';
    img.decoding = 'async';
    img.style.cssText = 'width:28px;height:28px;border-radius:8px;flex-shrink:0;display:block';
    el.insertBefore(img, el.firstChild);
    var pulse = el.querySelector('.hf-pulse, .os-dot');
    if (pulse) pulse.style.display = 'none';
  }
  ensureCss('/assets/promii-palette-lock.css', 'promii-palette-lock');
  ensureScript('/assets/site-shell.js', 'promii-site-shell', { 'data-mode': 'full' });
  function boot() {
    injectLogo('a.hf-logo');
    injectLogo('a.os-brand');
    injectLogo('.pm-brand');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})();
