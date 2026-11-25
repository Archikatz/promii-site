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
      tag: { es: 'Arquitectura, BIM e IA · Nueva York y Bogotá', en: 'Architecture, BIM and AI · New York and Bogotá' },
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
    return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
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
  var LOGO = '<img class="pm-logo" src="/assets/logo/bz-mark.svg" width="28" height="28" alt="" decoding="async">';
  function drawChrome() {
    if (mode === 'data') return;
    if (!nav) {
      nav = document.createElement('header');
      nav.className = 'pm-bar';
      document.body.insertBefore(nav, document.body.firstChild);
      if (!document.getElementById('pm-css')) {
        var st = document.createElement('style');
        st.id = 'pm-css';
        st.textContent = '.pm-bar{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:linear-gradient(180deg,rgba(6,6,10,.95) 0%,rgba(6,6,10,.62) 55%,rgba(6,6,10,.28) 100%);backdrop-filter:blur(20px) saturate(170%);-webkit-backdrop-filter:blur(20px) saturate(170%);border-bottom:1px solid rgba(255,255,255,.12);color:#f4f4f8;font:600 13px Inter,system-ui,sans-serif}.pm-bar a{color:#f4f4f8;text-decoration:none}.pm-brand{display:flex;align-items:center;gap:8px;font-weight:700;color:#fff}.pm-brand .pm-logo{width:28px;height:28px;border-radius:50%;object-fit:contain;display:block;flex-shrink:0}.pm-nav{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.pm-nav a{padding:6px 10px;border-radius:999px;color:rgba(244,244,248,.75)}.pm-nav a:hover,.pm-nav a.on{color:#fff;background:rgba(255,255,255,.12)}.pm-tools{display:flex;gap:6px;align-items:center}.pm-lang button{border:0;background:transparent;color:rgba(244,244,248,.7);font:600 12px Inter,system-ui;padding:4px 8px;border-radius:999px;cursor:pointer}.pm-lang button.on{color:#fff;background:rgba(47,107,255,.4)}.pm-ic,.pm-menu{border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:999px;padding:6px 10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}.pm-drop{display:none;position:absolute;right:12px;top:52px;min-width:220px;padding:10px;border-radius:16px;z-index:50;background:rgba(8,8,14,.94);border:1px solid rgba(255,255,255,.12);box-shadow:0 20px 40px -16px #000;backdrop-filter:blur(18px)}.pm-bar.pm-open .pm-drop{display:block}.pm-drop a{display:block;padding:8px 10px;border-radius:10px;color:rgba(244,244,248,.85)}.pm-drop a:hover{background:rgba(255,255,255,.08);color:#fff}.pm-foot{margin-top:48px;padding:28px 16px 40px;border-top:1px solid rgba(127,127,127,.25);display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:16px;font:14px Inter,system-ui;color:inherit;opacity:.92}.pm-foot a{color:inherit;text-decoration:none;display:block;margin:4px 0;opacity:.8}.pm-foot a:hover{opacity:1}.pm-foot h4{margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.pm-foot .pm-brand{margin-bottom:8px;color:inherit}@media(max-width:800px){.pm-nav{display:none}.pm-foot{grid-template-columns:1fr 1fr}}';
        document.head.appendChild(st);
      }
    }
    var path = location.pathname;
    var links = SITE.nav.map(function (n) {
      var on = path === n.href || (n.href.length > 1 && path.indexOf(n.href) === 0);
      return '<a href="' + n.href + '" class="' + (on ? 'on' : '') + '">' + esc(L(n.t)) + '</a>';
    }).join('');
    var dropMenu = SITE.nav.map(function (n) {
      return '<a href="' + n.href + '">' + esc(L(n.t)) + '</a>';
    }).join('') + '<a href="/acoi/">ACOI</a><a href="/home/">' + esc(L(SITE.ui.map)) + '</a><a href="/privacy/">' + esc(L(SITE.ui.privacy)) + '</a>';
    nav.innerHTML =
      '<a class="pm-brand" href="/">' + LOGO + 'Brian Zuleta</a><nav class="pm-nav">' + links + '</nav>' +
      '<div class="pm-tools">' +
      '<a class="pm-ic" href="/home/" aria-label="' + esc(L(SITE.ui.map)) + '">' + DROP + '</a>' +
      '<a class="pm-ic" href="/admin/" aria-label="Admin">' + LOCK + '</a>' +
      '<div class="pm-lang" role="group">' +
      '<button type="button" data-l="es"' + (lang === 'es' ? ' class="on"' : '') + '>ES</button>' +
      '<button type="button" data-l="en"' + (lang === 'en' ? ' class="on"' : '') + '>EN</button></div>' +
      '<button class="pm-ic pm-theme" type="button" title="' + esc(L(SITE.ui.theme)) + '">' +
      (theme() === 'light' ? '☀️' : '🌙') + '</button>' +
      '<button class="pm-menu" type="button">' + esc(L(SITE.ui.menu)) + '</button></div>' +
      '<div class="pm-drop" id="pm-drop">' + dropMenu + '</div>';
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

  /* Legacy pm-drop-fab disabled — dual glass droplets live in home-ui-fix.js */
  (function dropMenu(){ if (true) return; })();

  /* Load home UI fixes: presence map, dual glass FABs, centered footer */
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
