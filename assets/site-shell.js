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
      menu: { es: 'Men\u00fa', en: 'Menu' },
      theme: { es: 'Tema claro/oscuro', en: 'Light/dark theme' },
      explore: { es: 'Explorar', en: 'Explore' },
      learn: { es: 'Aprender', en: 'Learn' },
      social: { es: 'Redes', en: 'Social' },
      map: { es: 'Mapa del sitio', en: 'Site map' },
      tag: { es: 'Arquitectura, BIM e IA \u00b7 LATAM \u00b7 Americas \u00b7 Europa', en: 'Architecture, BIM & AI \u00b7 LATAM \u00b7 Americas \u00b7 Europe' },
      privacy: { es: 'Privacidad y datos', en: 'Privacy & data' },
      cv: { es: 'Solicitar CV', en: 'Request r\u00e9sum\u00e9' }
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
        st.textContent = '.pm-bar{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:8px;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top,0px));backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);background:rgba(8,8,12,.78);border-bottom:1px solid rgba(244,244,248,.1)}html[data-theme=light] .pm-bar{background:rgba(255,255,255,.86);border-bottom-color:rgba(0,0,0,.08);color:#121218}.pm-brand{display:flex;align-items:center;gap:8px;color:inherit;text-decoration:none;font-weight:600;letter-spacing:.2px;font-size:14px;flex-shrink:0;max-width:46vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pm-logo{width:28px;height:28px;border-radius:8px;object-fit:cover;flex-shrink:0;display:block}.pm-nav{display:none}.pm-nav a{color:inherit;opacity:.85;text-decoration:none;font-size:14px;padding:8px 2px}.pm-tools{display:flex;align-items:center;gap:6px;margin-left:auto;flex-shrink:0}.pm-tools button,.pm-tools a.pm-lock,.pm-lang button{background:rgba(244,244,248,.06);border:1px solid rgba(244,244,248,.14);color:inherit;border-radius:999px;width:34px;height:34px;display:grid;place-items:center;cursor:pointer;text-decoration:none;padding:0}html[data-theme=light] .pm-tools button,html[data-theme=light] .pm-tools a.pm-lock,html[data-theme=light] .pm-lang button{background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.1)}.pm-lang{display:flex;gap:4px}.pm-lang button.on{border-color:#22E0C8;color:#22E0C8}.pm-menu{width:auto!important;padding:0 12px!important;font-size:12px;letter-spacing:.04em}.pm-bar.pm-open .pm-nav{display:flex;position:absolute;left:10px;right:10px;top:calc(100% + 6px);flex-direction:column;gap:4px;padding:12px 14px;background:rgba(12,12,18,.96);border:1px solid rgba(255,255,255,.12);border-radius:16px;backdrop-filter:blur(18px);box-shadow:0 20px 40px -16px rgba(0,0,0,.55);z-index:60}html[data-theme=light] .pm-bar.pm-open .pm-nav{background:rgba(255,255,255,.97);border-color:rgba(0,0,0,.08);box-shadow:0 16px 32px -12px rgba(0,0,0,.15)}@media(min-width:900px){.pm-nav{display:flex;position:static;margin-left:auto;flex-direction:row;gap:10px;background:none;border:0;padding:0;box-shadow:none}.pm-nav a{font-size:13px;padding:0;opacity:.75}.pm-tools{margin-left:10px}.pm-menu{display:none!important}.pm-bar.pm-open .pm-nav{position:static;margin:0;flex-direction:row;background:none;border:0;box-shadow:none;padding:0}}.pm-foot{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:22px;padding:36px 18px calc(48px + env(safe-area-inset-bottom,0px));max-width:1100px;margin:0 auto;border-top:1px solid rgba(244,244,248,.1)}.pm-foot h4{margin:0 0 8px;font-size:11px;letter-spacing:1.4px;opacity:.55}.pm-foot a{display:block;color:inherit;opacity:.8;text-decoration:none;font-size:13px;margin:4px 0}.pm-foot a:hover{opacity:1}.pm-foot p,.pm-foot small{opacity:.7;font-size:13px;line-height:1.45}';
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
      '<button type="button" class="pm-theme" title="' + esc(L(SITE.ui.theme)) + '">\u2600</button>' +
      '<button type="button" class="pm-menu">' + esc(L(SITE.ui.menu)) + '</button></div>';
    if (mode === 'nav') return;
    if (!foot) {
      foot = document.createElement('footer');
      foot.className = 'pm-foot';
      document.body.appendChild(foot);
    }
    foot.innerHTML =
      '<div><a class="pm-brand" href="/">' + LOGO + 'Brian Zuleta</a><p>' + esc(L(SITE.ui.tag)) + '</p>' +
      '<small>\u00a9 ' + new Date().getFullYear() + ' Brian Zuleta \u00b7 promii.co</small>' +
      '<p style="margin-top:10px"><a href="/privacy/">' + esc(L(SITE.ui.privacy)) + '</a> \u00b7 <a href="/#contacto">' + esc(L(SITE.ui.cv)) + '</a></p></div>' +
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
    if (t.closest('.pm-menu') || t.closest('.pm-drop')) {
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
  (function loadPrivacyCopy(){
    if (document.getElementById('home-privacy-copy')) return;
    var s = document.createElement('script');
    s.id = 'home-privacy-copy';
    s.src = '/assets/home-privacy-copy.js';
    s.defer = true;
    document.head.appendChild(s);
  })();
  (function loadEngageDiscoverPitch(){
    function add(src,id){if(document.getElementById(id))return;var s=document.createElement('script');s.id=id;s.src=src;s.defer=true;document.head.appendChild(s);}
    add('/assets/engagement.js','pm-engagement');
    add('/assets/home-discover.js','pm-discover-js');
    add('/assets/home-banners.js','pm-home-banners');
  })();
})();
