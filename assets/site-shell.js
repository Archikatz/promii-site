/* Promii chrome · nav, ES/EN, theme, footer, drop FAB + BZ logo */
(function () {
  var SITE = window.PROMII_SITE = {
    nav: [
      { k: 'portfolio', t: { es: 'Portafolio', en: 'Portfolio' }, href: '/' },
      { k: 'about', t: { es: 'About', en: 'About' }, href: '/about/' },
      { k: 'blog', t: { es: 'Blog', en: 'Blog' }, href: '/blog/' },
      { k: 'editorial', t: { es: 'Editorial', en: 'Editorial' }, href: '/editorial/' },
      { k: 'academy', t: { es: 'Academy', en: 'Academy' }, href: '/academy/' },
      { k: 'lab', t: { es: 'Lab', en: 'Lab' }, href: '/lab/' },
      { k: 'arcade', t: { es: 'Arcade', en: 'Arcade' }, href: '/arcade/' },
      { k: 'contact', t: { es: 'Contacto', en: 'Contact' }, href: '/#contacto' }
    ],
    social: [
      ['LinkedIn', 'https://www.linkedin.com/in/bczuleta/'],
      ['Instagram · Architecture', 'https://www.instagram.com/bz.promii/'],
      ['Instagram · ArchiKatz', 'https://www.instagram.com/archikatz/'],
      ['Behance', 'https://www.behance.net/brianzuleta'],
      ['X', 'https://x.com/Archikatz'],
      ['GitHub', 'https://github.com/Archikatz']
    ],
    ui: {
      menu: { es: 'Menú', en: 'Menu' },
      theme: { es: 'Tema claro/oscuro', en: 'Light/dark theme' },
      explore: { es: 'Explorar', en: 'Explore' },
      learn: { es: 'Aprender', en: 'Learn' },
      social: { es: 'Redes', en: 'Social' },
      map: { es: 'Mapa del sitio', en: 'Site map' },
      tag: { es: 'Arquitectura, BIM e IA · LATAM · Americas · Europa', en: 'Architecture, BIM & AI · LATAM · Americas · Europe' },
      privacy: { es: 'Privacidad y datos', en: 'Privacy & data' },
      cv: { es: 'Solicitar CV', en: 'Request résumé' }
    }
  };
  var mode = (document.currentScript && document.currentScript.getAttribute('data-mode')) || 'full';
  var lang = (function () {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'en' || q === 'es') { localStorage.setItem('promii-lang', q); return q; }
    } catch (e) {}
    try { return localStorage.getItem('promii-lang') === 'en' ? 'en' : 'es'; } catch (e) { return 'es'; }
  })();
  function theme() {
    try {
      var t = localStorage.getItem('promii-theme');
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {}
    return 'dark';
  }
  function L(o) {
    if (!o) return '';
    if (typeof o === 'string') return o;
    return (lang === 'en' ? (o.en || o.es) : (o.es || o.en)) || '';
  }
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('promii-theme', t); } catch (e) {}
  }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    try { localStorage.setItem('promii-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    drawChrome();
  }
  function toggleTheme() {
    applyTheme(theme() === 'light' ? 'dark' : 'light');
    drawChrome();
  }
  var nav, foot;
  var DROP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/></svg>';
  var LOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  var LOGO = '<img class="pm-logo" src="/assets/logo/bz-mark-glass.svg" width="28" height="28" alt="Brian Zuleta" decoding="async">';
  function drawChrome() {
    if (mode === 'data') return;
    if (!nav) {
      nav = document.createElement('header');
      nav.className = 'pm-bar';
      document.body.insertBefore(nav, document.body.firstChild);
      if (!document.getElementById('pm-css')) {
        var st = document.createElement('style');
        st.id = 'pm-css';
        st.textContent = '.pm-bar{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:10px;padding:10px 14px;backdrop-filter:blur(14px);background:rgba(8,8,12,.72);border-bottom:1px solid rgba(244,244,248,.1)}.pm-brand{display:flex;align-items:center;gap:8px;color:inherit;text-decoration:none;font-weight:600;letter-spacing:.3px}.pm-logo{border-radius:8px}.pm-nav{display:flex;flex-wrap:wrap;gap:8px;margin-left:auto}.pm-nav a{color:inherit;opacity:.75;text-decoration:none;font-size:13px}.pm-nav a:hover{opacity:1}.pm-tools{display:flex;align-items:center;gap:6px;margin-left:8px}.pm-tools button,.pm-lang button{background:rgba(244,244,248,.06);border:1px solid rgba(244,244,248,.14);color:inherit;border-radius:999px;width:34px;height:34px;display:grid;place-items:center;cursor:pointer}.pm-lang button.on{border-color:#22E0C8;color:#22E0C8}.pm-foot{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:22px;padding:36px 18px 48px;max-width:1100px;margin:0 auto;border-top:1px solid rgba(244,244,248,.1)}.pm-foot h4{margin:0 0 8px;font-size:11px;letter-spacing:1.4px;opacity:.55}.pm-foot a{display:block;color:inherit;opacity:.8;text-decoration:none;font-size:13px;margin:4px 0}.pm-foot a:hover{opacity:1}.pm-foot p,.pm-foot small{opacity:.7;font-size:13px;line-height:1.45}';
        document.head.appendChild(st);
      }
    }
    var links = SITE.nav.map(function (n) { return '<a href="' + n.href + '">' + esc(L(n.t)) + '</a>'; }).join('');
    nav.innerHTML =
      '<a class="pm-brand" href="/">' + LOGO + 'Brian Zuleta</a><nav class="pm-nav">' + links + '</nav>' +
      '<div class="pm-tools">' +
      '<button type="button" class="pm-drop" title="Menu" aria-label="Menu">' + DROP + '</button>' +
      '<a class="pm-lock" href="/privacy/" title="Privacy" aria-label="Privacy">' + LOCK + '</a>' +
      '<div class="pm-lang" role="group">' +
      '<button type="button" data-l="es" class="' + (lang === 'es' ? 'on' : '') + '">ES</button>' +
      '<button type="button" data-l="en" class="' + (lang === 'en' ? 'on' : '') + '">EN</button></div>' +
      '<button type="button" class="pm-theme" title="' + esc(L(SITE.ui.theme)) + '">☀</button>' +
      '<button type="button" class="pm-menu">' + esc(L(SITE.ui.menu)) + '</button></div>';
    if (mode === 'nav') return;
    if (!foot) {
      foot = document.createElement('footer');
      foot.className = 'pm-foot';
      document.body.appendChild(foot);
    }
    foot.innerHTML =
      '<div><a class="pm-brand" href="/">' + LOGO + 'Brian Zuleta</a><p>' + esc(L(SITE.ui.tag)) + '</p>' +
      '<small>© ' + new Date().getFullYear() + ' Brian Zuleta · promii.co</small>' +
      '<p style="margin-top:10px"><a href="/privacy/">' + esc(L(SITE.ui.privacy)) + '</a> · <a href="/#contacto">' + esc(L(SITE.ui.cv)) + '</a></p></div>' +
      '<div><h4>' + esc(L(SITE.ui.explore)) + '</h4>' +
      SITE.nav.map(function (n) { return '<a href="' + n.href + '">' + esc(L(n.t)) + '</a>'; }).join('') + '</div>' +
      '<div><h4>' + esc(L(SITE.ui.learn)) + '</h4>' +
      '<a href="/about/">About</a><a href="/blog/">Blog</a><a href="/editorial/">Editorial</a>' +
      '<a href="/academy/">Academy</a><a href="/lab/">Lab</a><a href="/arcade/">Arcade</a><a href="/acoi/">ACOI</a></div>' +
      '<div><h4>' + esc(L(SITE.ui.social)) + '</h4>' +
      SITE.social.map(function (s) {
        return '<a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + '</a>';
      }).join('') + '</div>';
  }
  document.documentElement.lang = lang;
  applyTheme(theme());
  drawChrome();
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!nav || !t.closest) return;
    var lb = t.closest('.pm-lang button');
    if (lb) { setLang(lb.getAttribute('data-l')); return; }
    if (t.closest('.pm-theme')) { toggleTheme(); return; }
    if (t.closest('.pm-menu')) {
      e.stopPropagation();
      nav.classList.toggle('pm-open');
      return;
    }
    if (!nav.contains(t)) nav.classList.remove('pm-open');
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav) nav.classList.remove('pm-open');
  });
  window.PROMII_SET_LANG = setLang;
  window.PROMII_SET_THEME = applyTheme;
  (function dropMenu(){ if (true) return; })();
  (function loadHomeUiFix(){
    if (document.getElementById('home-ui-fix-css')) return;
    var l = document.createElement('link');
    l.id = 'home-ui-fix-css';
    l.rel = 'stylesheet';
    l.href = '/assets/home-ui-fix.css';
    document.head.appendChild(l);
    var s = document.createElement('script');
    s.src = '/assets/home-ui-fix.js';
    s.defer = true;
    document.head.appendChild(s);
  })();
})();
