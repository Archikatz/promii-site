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
    return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('promii-theme', t); } catch (e) {}
  }
  function toggleTheme() {
    applyTheme(theme() === 'dark' ? 'light' : 'dark');
  }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    try { localStorage.setItem('promii-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    drawChrome();
    try {
      document.querySelectorAll('[data-en]').forEach(function (el) {
        var en = el.getAttribute('data-en');
        var es = el.getAttribute('data-es') || el.getAttribute('data-es-html');
        if (lang === 'en' && en) el.textContent = en;
        else if (lang === 'es' && es) el.textContent = es;
      });
    } catch (e) {}
  }
  var LOGO = '<span class="pm-logo" aria-hidden="true"></span>';
  var nav;
  function drawChrome() {
    var existing = document.getElementById('pm-nav');
    if (existing) existing.remove();
    nav = document.createElement('header');
    nav.id = 'pm-nav';
    nav.className = 'pm-nav';
    nav.innerHTML =
      '<a class="pm-brand" href="/">' + LOGO + 'Brian Zuleta</a>' +
      '<div class="pm-tools">' +
      '<button type="button" class="pm-theme" title="' + esc(L(SITE.ui.theme)) + '" aria-label="' + esc(L(SITE.ui.theme)) + '">☀</button>' +
      '<div class="pm-lang" role="group">' +
      '<button type="button" data-l="es" class="' + (lang==='es'?'on':'') + '">ES</button>' +
      '<button type="button" data-l="en" class="' + (lang==='en'?'on':'') + '">EN</button>' +
      '</div>' +
      '<button type="button" class="pm-menu" aria-label="' + esc(L(SITE.ui.menu)) + '">' + esc(L(SITE.ui.menu)) + '</button>' +
      '</div>' +
      '<nav class="pm-links">' +
      SITE.nav.map(function (n) {
        return '<a href="' + n.href + '">' + esc(L(n.t)) + '</a>';
      }).join('') +
      '</nav>';
    document.body.insertBefore(nav, document.body.firstChild);
    if (mode === 'nav') return;
    var foot = document.querySelector('footer.pm-foot');
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
