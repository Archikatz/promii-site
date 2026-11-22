/* Promii · encabezado, navegación, idioma, tema y pie comunes para las páginas internas.
   Uso: <script src="/assets/site-shell.js" data-mode="full"></script> al final del <body>.
   data-mode: "full" (barra + pie), "mini" (píldora flotante en demos), "data" (solo datos e idioma, sin barra ni pie).
   Atributo opcional en el <script>: data-dark-only (sin botón de tema; la página es siempre oscura).
   PROMII_SITE es la fuente única del mapa del sitio: la usan esta barra, el pie y la página /home/.
   Para agregar una sección nueva, agrégala aquí (en ES y EN) y aparece en todas partes.

   Idioma: se guarda en localStorage "promii-lang" (el mismo que usa el portafolio). ?lang=en lo cambia.
   Traducción de páginas estáticas: cualquier elemento con data-en="texto en inglés" cambia al pasar a EN
   (data-en-ph para placeholders, data-en-label para aria-label, <html data-title-en> para el título).
   Las páginas dinámicas escuchan el evento "promii:lang" (detail = "es" | "en") y se vuelven a dibujar. */
(function () {
  var SITE = window.PROMII_SITE = {
    nav: [
      { k: 'portfolio', t: { es: 'Portafolio', en: 'Portfolio' }, href: '/', d: { es: 'Mi trabajo como arquitecto BIM y los servicios de Promii.', en: 'My work as a BIM architect and Promii services.' }, sub: 'portfolio' },
      { k: 'blog', t: { es: 'Blog', en: 'Blog' }, href: '/blog/', d: { es: 'Hub AEC Tech: BIM, IA, normativa y sistemas. Bitácora & Insights.', en: 'AEC Tech hub: BIM, AI, code compliance and systems. Bitácora & Insights.' } },
      { k: 'academy', t: { es: 'Academy', en: 'Academy' }, href: '/academy/', d: { es: '26 guías paso a paso: Revit con IA, permisos NYC, obra, ventas B2B.', en: '26 step-by-step guides: Revit with AI, NYC permits, construction, B2B sales.' } },
      { k: 'lab', t: { es: 'Lab', en: 'Lab' }, href: '/lab/', d: { es: 'Motion Lab: 14 demos de animación y física que usa este sitio.', en: 'Motion Lab: 14 animation and physics demos used on this site.' } },
      { k: 'games', t: { es: 'Juegos', en: 'Games' }, href: '/games/', d: { es: '5 juegos de arquitectura con tutorial, ranking y retos.', en: '5 architecture games with tutorial, leaderboard and challenges.' }, sub: 'games' },
      { k: 'contact', t: { es: 'Contacto', en: 'Contact' }, href: '/#contacto', d: { es: 'Escríbeme o arma una cotización. hi@promii.co', en: 'Write to me or build a quote. hi@promii.co' } }
    ],
    map: [
      { g: { es: 'Contratar a Brian', en: 'Hire Brian' }, c: '#2f6bff', items: [
        { t: { es: 'Sobre mí', en: 'About' }, d: { es: 'Arquitecto, BIM e IA entre Nueva York y Bogotá', en: 'Architect, BIM and AI between New York and Bogotá' }, href: '/#sobre', st: 'live' },
        { t: { es: 'Experiencia', en: 'Experience' }, d: { es: 'Cargos, obras y resultados', en: 'Roles, projects and results' }, href: '/#experiencia', st: 'live' },
        { t: { es: 'Proyectos', en: 'Projects' }, d: { es: 'Planos que se dibujan solos', en: 'Drawings that draw themselves' }, href: '/#proyectos', st: 'live' },
        { t: { es: 'Casos', en: 'Cases' }, d: { es: 'Historias de proyectos', en: 'Project stories' }, href: '/#casos', st: 'live' },
        { t: { es: 'Servicios', en: 'Services' }, d: { es: 'Qué puedo hacer por tu firma', en: 'What I can do for your firm' }, href: '/#servicios', st: 'live' },
        { t: { es: 'Cotizar', en: 'Quote' }, d: { es: 'Arma una cotización', en: 'Build a quote' }, href: '/#cotizar', st: 'live' },
        { t: { es: 'Contacto', en: 'Contact' }, d: { es: 'hi@promii.co', en: 'hi@promii.co' }, href: '/#contacto', st: 'live' }
      ]},
      { g: { es: 'Leer y aprender', en: 'Read and learn' }, c: '#ff3b30', items: [
        { t: { es: 'Blog', en: 'Blog' }, d: { es: 'Hub AEC Tech: BIM, IA, normativa y sistemas', en: 'AEC Tech hub: BIM, AI, code compliance and systems' }, href: '/blog/', st: 'live', sat: 1 },
        { t: { es: 'Academy', en: 'Academy' }, d: { es: 'Guías paso a paso', en: 'Step-by-step guides' }, href: '/academy/', st: 'live' },
        { t: { es: 'Lab', en: 'Lab' }, d: { es: 'Motion y física del sitio', en: 'Site motion and physics' }, href: '/lab/', st: 'live' },
        { t: { es: 'Editorial', en: 'Editorial' }, d: { es: 'ArchiKatz universo', en: 'ArchiKatz universe' }, href: '/editorial/', st: 'live' }
      ]},
      { g: { es: 'Jugar y crear', en: 'Play and create' }, c: '#34c759', items: [
        { t: { es: 'Juegos', en: 'Games' }, d: { es: '5 juegos de arquitectura', en: '5 architecture games' }, href: '/games/', st: 'live' },
        { t: { es: 'Studio', en: 'Studio' }, d: { es: 'ArchiKatz Studio', en: 'ArchiKatz Studio' }, href: '/studio/', st: 'live' },
        { t: { es: 'Home', en: 'Home' }, d: { es: 'Mapa y física', en: 'Map and physics' }, href: '/home/', st: 'live' }
      ]},
      { g: { es: 'Clientes', en: 'Clients' }, c: '#95C35D', items: [
        { t: { es: 'ACOI 2027', en: 'ACOI 2027' }, d: { es: 'Propuesta liquid glass', en: 'Liquid glass proposal' }, href: '/acoi/', st: 'live' }
      ]}
    ],
    social: [
      ['LinkedIn', 'https://www.linkedin.com/in/brianzuleta/'],
      ['X', 'https://x.com/Archikatz'],
      ['GitHub', 'https://github.com/Archikatz']
    ],
    ui: {
      menu: { es: 'Menú', en: 'Menu' },
      theme: { es: 'Tema', en: 'Theme' },
      admin: { es: 'Admin', en: 'Admin' },
      explore: { es: 'Explorar', en: 'Explore' },
      learn: { es: 'Aprender', en: 'Learn' },
      social: { es: 'Redes', en: 'Social' },
      map: { es: 'Mapa del sitio', en: 'Site map' },
      tag: { es: 'Arquitectura, BIM e IA · Nueva York y Bogotá', en: 'Architecture, BIM and AI · New York and Bogotá' }
    }
  };

  var mode = (document.currentScript && document.currentScript.getAttribute('data-mode')) || 'full';
  var darkOnly = document.currentScript && document.currentScript.hasAttribute('data-dark-only');
  var lang = (function () {
    try { var q = new URLSearchParams(location.search).get('lang'); if (q === 'en' || q === 'es') { localStorage.setItem('promii-lang', q); return q; } } catch (e) {}
    try { return localStorage.getItem('promii-lang') === 'en' ? 'en' : 'es'; } catch (e) { return 'es'; }
  })();
  function theme() { try { return localStorage.getItem('promii-theme') || 'dark'; } catch (e) { return 'dark'; } }
  function L(o) { if (!o) return ''; if (typeof o === 'string') return o; return (lang === 'en' ? (o.en || o.es) : (o.es || o.en)) || ''; }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    try { localStorage.setItem('promii-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el._es) el._es = el.textContent;
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el._es;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      if (!el._ph) el._ph = el.getAttribute('placeholder');
      el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-ph') : el._ph);
    });
    var te = document.documentElement.getAttribute('data-title-en');
    if (te) document.title = lang === 'en' ? te : (document.documentElement.getAttribute('data-title-es') || document.title);
    drawChrome();
    try { document.dispatchEvent(new CustomEvent('promii:lang', { detail: lang })); } catch (e) {}
  }
  function toggleTheme() {
    if (darkOnly) return;
    var t = theme() === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('promii-theme', t); } catch (e) {}
    document.documentElement.setAttribute('data-theme', t);
    drawChrome();
  }
  var nav, foot;
  var LOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  function drawChrome() {
    if (mode === 'data') return;
    if (mode === 'mini') {
      if (!nav) { nav = document.createElement('div'); nav.className = 'pm-mini'; document.body.appendChild(nav); }
      nav.innerHTML = '<a href="/">Promii</a><a href="/blog/">Blog</a><a href="/home/">Map</a>';
      return;
    }
    if (!nav) {
      nav = document.createElement('header');
      nav.className = 'pm-bar';
      document.body.insertBefore(nav, document.body.firstChild);
      if (!document.getElementById('pm-css')) {
        var st = document.createElement('style'); st.id = 'pm-css';
        st.textContent = '.pm-bar{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:rgba(8,8,12,.72);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.08);font:600 13px Inter,system-ui,sans-serif}.pm-bar a{color:inherit;text-decoration:none}.pm-brand{display:flex;align-items:center;gap:8px;font-weight:700}.pm-brand i{width:10px;height:10px;border-radius:50%;background:#2f6bff;box-shadow:0 0 12px #2f6bff}.pm-nav{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.pm-nav a{padding:6px 10px;border-radius:999px;color:#a6a6bc}.pm-nav a:hover,.pm-nav a.on{color:#f4f4f8;background:rgba(255,255,255,.06)}.pm-tools{display:flex;gap:6px;align-items:center}.pm-lang button{border:0;background:transparent;color:#a6a6bc;font:600 12px Inter,system-ui;padding:4px 8px;border-radius:999px;cursor:pointer}.pm-lang button.on{color:#f4f4f8;background:rgba(47,107,255,.2)}.pm-ic,.pm-menu{border:0;background:rgba(255,255,255,.06);color:#f4f4f8;border-radius:999px;padding:6px 10px;cursor:pointer}.pm-drop{display:none;position:absolute;right:12px;top:52px;min-width:220px;padding:10px;border-radius:16px;background:rgba(14,14,20,.95);border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 40px -20px #000}.pm-bar.pm-open .pm-drop{display:block}.pm-drop a{display:block;padding:8px 10px;border-radius:10px;color:#a6a6bc}.pm-drop a:hover{background:rgba(255,255,255,.06);color:#fff}.pm-foot{margin-top:48px;padding:28px 16px 40px;border-top:1px solid rgba(255,255,255,.08);display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:16px;font:14px Inter,system-ui;color:#6e6e86}.pm-foot a{color:#a6a6bc;text-decoration:none;display:block;margin:4px 0}.pm-foot h4{margin:0 0 8px;color:#f4f4f8;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.pm-foot .pm-brand{color:#f4f4f8;margin-bottom:8px}@media(max-width:800px){.pm-nav{display:none}.pm-foot{grid-template-columns:1fr 1fr}}';
        document.head.appendChild(st);
      }
    }
    var path = location.pathname;
    var links = SITE.nav.map(function (n) {
      var on = path === n.href || (n.href.length > 1 && path.indexOf(n.href) === 0);
      return '<a href="' + n.href + '" class="' + (on ? 'on' : '') + '">' + esc(L(n.t)) + '</a>';
    }).join('');
    var drop = SITE.nav.map(function (n) {
      return '<a href="' + n.href + '">' + esc(L(n.t)) + '</a>';
    }).join('') + '<a href="/acoi/">ACOI</a><a href="/home/">' + esc(L(SITE.ui.map)) + '</a>';
    nav.innerHTML = '<a class="pm-brand" href="/"><i></i>Brian Zuleta</a><nav class="pm-nav">' + links + '</nav>' +
      '<div class="pm-tools"><a class="pm-ic" href="/admin/" aria-label="Admin">' + LOCK + '</a>' +
      '<div class="pm-lang" role="group"><button type="button" data-l="es"' + (lang === 'es' ? ' class="on"' : '') + '>ES</button><button type="button" data-l="en"' + (lang === 'en' ? ' class="on"' : '') + '>EN</button></div>' +
      (darkOnly ? '' : '<button class="pm-ic pm-theme" type="button">' + (theme() === 'light' ? '☀️' : '🌙') + '</button>') +
      '<button class="pm-menu" type="button" aria-expanded="false">' + esc(L(SITE.ui.menu)) + '</button></div>' +
      '<div class="pm-drop" id="pm-drop">' + drop + '</div>';
    if (mode === 'nav') return;
    if (!foot) { foot = document.createElement('footer'); foot.className = 'pm-foot'; document.body.appendChild(foot); }
    foot.innerHTML = '<div><a class="pm-brand" href="/"><i></i>Brian Zuleta</a><p>' + esc(L(SITE.ui.tag)) + '</p><small>© ' + new Date().getFullYear() + ' Brian Zuleta · promii.co</small></div>' +
      '<div><h4>' + esc(L(SITE.ui.explore)) + '</h4>' + SITE.nav.map(function (n) { return '<a href="' + n.href + '">' + esc(L(n.t)) + '</a>'; }).join('') + '</div>' +
      '<div><h4>' + esc(L(SITE.ui.learn)) + '</h4><a href="/blog/">Blog</a><a href="/academy/">Academy</a><a href="/lab/">Lab</a><a href="/acoi/">ACOI</a></div>' +
      '<div><h4>' + esc(L(SITE.ui.social)) + '</h4>' + SITE.social.map(function (s) { return '<a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + '</a>'; }).join('') + '</div>';
  }
  function toggle(o) { if (!nav) return; nav.classList.toggle('pm-open', o); }
  document.documentElement.lang = lang;
  if (!darkOnly) document.documentElement.setAttribute('data-theme', theme());
  drawChrome();
  document.addEventListener('click', function (e) {
    var t = e.target; if (!nav || !t.closest) return;
    var lb = t.closest('.pm-lang button'); if (lb) { setLang(lb.getAttribute('data-l')); return; }
    if (t.closest('.pm-theme')) { toggleTheme(); return; }
    if (t.closest('.pm-menu')) { e.stopPropagation(); toggle(!nav.classList.contains('pm-open')); return; }
    if (!nav.contains(t)) toggle(false);
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
  window.PROMII_SET_LANG = setLang;
})();
