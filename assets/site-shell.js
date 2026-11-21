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
      { k: 'blog', t: { es: 'Blog', en: 'Blog' }, href: '/bitacora/', d: { es: 'Casos y procesos contados de principio a fin: cómo lo hice.', en: 'Cases and processes told start to finish: how I did it.' } },
      { k: 'academy', t: { es: 'Academy', en: 'Academy' }, href: '/academy/', d: { es: '26 guías paso a paso: Revit con IA, permisos NYC, obra, ventas B2B.', en: '26 step-by-step guides: Revit with AI, NYC permits, construction, B2B sales.' } },
      { k: 'lab', t: { es: 'Lab', en: 'Lab' }, href: '/lab/', d: { es: 'Motion Lab: 14 demos de animación y física que usa este sitio.', en: 'Motion Lab: 14 animation and physics demos used on this site.' } },
      { k: 'games', t: { es: 'Juegos', en: 'Games' }, href: '/games/', d: { es: '5 juegos de arquitectura con tutorial, ranking y retos.', en: '5 architecture games with tutorial, leaderboard and challenges.' }, sub: 'games' },
      { k: 'contact', t: { es: 'Contacto', en: 'Contact' }, href: '/#contacto', d: { es: 'Escríbeme o arma una cotización. hi@promii.co', en: 'Write to me or build a quote. hi@promii.co' } }
    ],
    /* Mapa completo: grupos → destinos. st: "live" (activo) o "soon" (próximamente). */
    map: [
      { g: { es: 'Contratar a Brian', en: 'Hire Brian' }, c: '#2f6bff', items: [
        { t: { es: 'Sobre mí', en: 'About' }, d: { es: 'Arquitecto, BIM e IA entre Nueva York y Bogotá', en: 'Architect, BIM and AI between New York and Bogotá' }, href: '/#sobre', st: 'live' },
        { t: { es: 'Experiencia', en: 'Experience' }, d: { es: 'Cargos, obras y resultados', en: 'Roles, projects and results' }, href: '/#experiencia', st: 'live' },
        { t: { es: 'Proyectos', en: 'Projects' }, d: { es: 'Planos que se dibujan solos', en: 'Drawings that draw themselves' }, href: '/#proyectos', st: 'live', sat: 1 },
        { t: { es: 'Casos', en: 'Case studies' }, d: { es: 'Sistemas contados como productos', en: 'Systems told as products' }, href: '/#casos', st: 'live' },
        { t: { es: 'Hoja de vida', en: 'Résumé' }, d: { es: 'CV en español e inglés', en: 'CV in English and Spanish' }, href: '/#sobre', st: 'live' }
      ] },
      { g: { es: 'Trabajar con Promii', en: 'Work with Promii' }, c: '#ff3b30', items: [
        { t: { es: 'Servicios', en: 'Services' }, d: { es: 'Arquitectura, BIM e IA productizados', en: 'Productized architecture, BIM and AI' }, href: '/#servicios', st: 'live', sat: 1 },
        { t: { es: 'Cotizar', en: 'Get a quote' }, d: { es: 'Arma tu paquete', en: 'Build your package' }, href: '/#cotizar', st: 'live' },
        { t: { es: 'Contacto', en: 'Contact' }, d: { es: 'Escríbeme', en: 'Write to me' }, href: '/#contacto', st: 'live' },
        { t: { es: 'Comunidad', en: 'Community' }, d: { es: 'Arquitectos y creadores con IA', en: 'Architects and creators using AI' }, href: '/#ecosistema', st: 'soon' }
      ] },
      { g: { es: 'Aprender', en: 'Learn' }, c: '#e8b23a', items: [
        { t: { es: 'Blog', en: 'Blog' }, d: { es: 'Bitácora: cómo lo hice, casos y procesos', en: 'How I built it: cases and processes' }, href: '/bitacora/', st: 'live', sat: 1 },
        { t: { es: 'Academy', en: 'Academy' }, d: { es: 'Guías y playbooks paso a paso', en: 'Step-by-step guides and playbooks' }, href: '/academy/', st: 'live' },
        { t: { es: 'Motion Lab', en: 'Motion Lab' }, d: { es: '14 demos de animación', en: '14 animation demos' }, href: '/lab/', st: 'live' }
      ] },
      { g: { es: 'Jugar', en: 'Play' }, c: '#22e0c8', items: [
        { t: { es: 'Juegos', en: 'Games' }, d: { es: '5 juegos de arquitectura con ranking y retos', en: '5 architecture games with leaderboards and challenges' }, href: '/games/', st: 'live' },
        { t: { es: 'Torre de niveles', en: 'Level Tower' }, d: { es: 'Apila losas sin perder el aplomo', en: 'Stack slabs and keep it plumb' }, href: '/games/torre.html', st: 'live' },
        { t: { es: 'Detección de choques', en: 'Clash Detection' }, d: { es: 'Encuentra las interferencias', en: 'Find the clashes' }, href: '/games/choques.html', st: 'live' },
        { t: { es: 'Ducto', en: 'Duct Run' }, d: { es: 'La serpiente de los constructores', en: 'The builders\' snake game' }, href: '/games/ducto.html', st: 'live' },
        { t: { es: 'Órbita', en: 'Orbit' }, d: { es: 'Naves contra drones de plano', en: 'Ships against blueprint drones' }, href: '/games/orbita.html', st: 'live', sat: 1 },
        { t: { es: 'Ruta de obra', en: 'Site Run' }, d: { es: 'Camión mezclador en la ciudad', en: 'Mixer truck through the city' }, href: '/games/ruta.html', st: 'live' }
      ] },
      { g: { es: 'Universo ArchiKatz', en: 'ArchiKatz Universe' }, c: '#9b6dff', items: [
        { t: { es: 'Universo editorial', en: 'Editorial universe' }, d: { es: 'Historia, personajes y sello editorial', en: 'Story, characters and imprint' }, href: '/editorial/', st: 'live' },
        { t: { es: 'Webtoon', en: 'Webtoon' }, d: { es: 'Episodio 0 · La Guardiana del Umbral', en: 'Episode 0 · The Guardian of the Threshold' }, href: '/editorial/toon.html?ep=ep00-la-guardiana-del-umbral', st: 'live', sat: 1 },
        { t: { es: 'ArchiKatz Studio', en: 'ArchiKatz Studio' }, d: { es: 'Crea personajes, escenas y prompts', en: 'Create characters, scenes and prompts' }, href: '/studio/', st: 'live' },
        { t: { es: 'Tienda ArchiKatz', en: 'ArchiKatz shop' }, d: { es: 'Prints, desk mats y techwear', en: 'Prints, desk mats and techwear' }, href: '/#ecosistema', st: 'soon' }
      ] }
    ],
    social: [
      ['LinkedIn', 'https://www.linkedin.com/in/bczuleta'],
      ['Instagram', 'https://www.instagram.com/promii.co'],
      ['Behance', 'https://www.behance.net/brianzuleta'],
      ['YouTube', 'https://www.youtube.com/@promii']
    ],
    ui: {
      menu: { es: 'Menú', en: 'Menu' }, map: { es: 'Mapa del sitio', en: 'Site map' }, explore: { es: 'Explorar', en: 'Explore' },
      learn: { es: 'Aprender', en: 'Learn' }, social: { es: 'Redes', en: 'Social' },
      tag: { es: 'Arquitectura, BIM y sistemas de IA. Promii / Studio Brian Zuleta.', en: 'Architecture, BIM and AI systems. Promii / Studio Brian Zuleta.' },
      theme: { es: 'Modo claro / oscuro', en: 'Light / dark mode' }, back: { es: '← Lab', en: '← Lab' },
      admin: { es: 'Panel de administración', en: 'Admin console' }, lang: { es: 'Idioma', en: 'Language' }
    }
  };

  /* ---------- idioma ---------- */
  var me = document.currentScript, mode = (me && me.dataset.mode) || 'full', darkOnly = me && me.hasAttribute('data-dark-only');
  var lang = 'es';
  try { var q = new URLSearchParams(location.search).get('lang'); if (q === 'en' || q === 'es') { lang = q; localStorage.setItem('promii-lang', q); } else lang = localStorage.getItem('promii-lang') || 'es'; } catch (e) {}
  function L(o) { return o && typeof o === 'object' ? (o[lang] || o.es) : o; }
  SITE.L = L; SITE.lang = function () { return lang; };
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-es')) el.setAttribute('data-es', el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
    });
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      if (!el.hasAttribute('data-es-ph')) el.setAttribute('data-es-ph', el.placeholder);
      el.placeholder = lang === 'en' ? el.getAttribute('data-en-ph') : el.getAttribute('data-es-ph');
    });
    document.querySelectorAll('[data-en-label]').forEach(function (el) {
      if (!el.hasAttribute('data-es-label')) el.setAttribute('data-es-label', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-en-label') : el.getAttribute('data-es-label'));
    });
    var h = document.documentElement;
    if (h.dataset.titleEn) { if (!h.dataset.titleEs) h.dataset.titleEs = document.title; document.title = lang === 'en' ? h.dataset.titleEn : h.dataset.titleEs; }
  }
  SITE.applyLang = applyLang;
  function setLang(l) { lang = l; try { localStorage.setItem('promii-lang', l); } catch (e) {} applyLang(); drawChrome(); dispatchEvent(new CustomEvent('promii:lang', { detail: l })); }
  SITE.setLang = setLang;

  /* ---------- tema ---------- */
  function theme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }
  try { var th = localStorage.getItem('promii-theme'); if (th && !darkOnly) document.documentElement.setAttribute('data-theme', th); } catch (e) {}
  if (darkOnly || !document.documentElement.getAttribute('data-theme')) document.documentElement.setAttribute('data-theme', 'dark');
  function toggleTheme() { var t = theme() === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('promii-theme', t); } catch (e) {} drawChrome(); }

  applyLang();
  if (mode === 'data') { window.addEventListener('DOMContentLoaded', applyLang); return; }

  var path = location.pathname.replace(/index\.html$/, '');
  var adopt = mode === 'nav' ? document.querySelector('nav[data-shell]') : null;
  function cur(h) { if (h.indexOf('#') >= 0) return false; if (h === '/') return path === '/'; return path.indexOf(h) === 0; }

  var css = '' +
    '.pm-nav{position:sticky;top:calc(10px + env(safe-area-inset-top,0px));z-index:50;margin:10px auto 0;width:min(1120px,calc(100% - 24px));display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 7px 7px 16px;border-radius:999px;' +
    'background:linear-gradient(140deg,var(--glass2,rgba(255,255,255,.07)),var(--glass,rgba(255,255,255,.04)));backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);border:1px solid var(--brd,var(--glass-brd,rgba(255,255,255,.13)));box-shadow:0 18px 40px -20px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.14);font-family:"Inter",ui-sans-serif,system-ui,sans-serif}' +
    'html[data-theme="light"] .pm-nav{background:rgba(255,255,255,.72)}' +
    '.pm-brand{display:flex;align-items:center;gap:10px;font:700 13px "Space Grotesk",ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;color:var(--text,#f4f4f8);white-space:nowrap}' +
    '.pm-brand i{width:10px;height:10px;border-radius:50%;background:var(--accent,#ff3b30);box-shadow:0 0 12px var(--accent,#ff3b30)}' +
    '.pm-links{display:flex;gap:2px}.pm-links a{text-decoration:none;font:500 13px "Inter",system-ui,sans-serif;color:var(--muted,#a6a6bc);padding:8px 11px;border-radius:999px;white-space:nowrap}' +
    '.pm-links a:hover,.pm-links a[aria-current]{color:var(--text,#f4f4f8);background:var(--glass2,rgba(255,255,255,.08))}' +
    '.pm-ctl{display:flex;align-items:center;gap:6px}' +
    '.pm-lang{display:flex;padding:3px;border-radius:999px;border:1px solid var(--line,rgba(255,255,255,.14))}.pm-lang button{border:0;background:none;color:var(--muted,#a6a6bc);font:600 11.5px "Inter",system-ui,sans-serif;padding:5px 9px;border-radius:999px;cursor:pointer}' +
    '.pm-lang button.on{background:var(--text,#f4f4f8);color:var(--bg,#08080c)}' +
    '.pm-ic{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;border:1px solid var(--line,rgba(255,255,255,.14));background:none;color:var(--text,#f4f4f8);font-size:15px;cursor:pointer;text-decoration:none;padding:0}' +
    '.pm-ic:hover{background:var(--glass2,rgba(255,255,255,.08))}' +
    '.pm-ic svg{width:16px;height:16px}' +
    '.pm-menu{display:none;align-items:center;gap:8px;border:0;cursor:pointer;font:600 13px "Inter",system-ui,sans-serif;color:var(--text,#f4f4f8);background:var(--glass2,rgba(255,255,255,.08));padding:9px 13px;border-radius:999px}' +
    '.pm-menu b{display:grid;gap:3px}.pm-menu b i{display:block;width:14px;height:1.6px;border-radius:2px;background:currentColor;transition:transform .35s cubic-bezier(.2,.7,.2,1)}' +
    '.pm-open .pm-menu b i:first-child{transform:translateY(2.3px) rotate(45deg)}.pm-open .pm-menu b i:last-child{transform:translateY(-2.3px) rotate(-45deg)}' +
    '.pm-inner{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%}' +
    '.pm-item{position:relative}' +
    '.pm-pop{position:absolute;left:50%;top:calc(100% + 12px);translate:-50% 0;width:290px;padding:14px;border-radius:20px;background:color-mix(in srgb,var(--bg,#08080c) 97%,transparent);backdrop-filter:blur(22px) saturate(1.6);-webkit-backdrop-filter:blur(22px) saturate(1.6);border:1px solid var(--brd,var(--glass-brd,rgba(255,255,255,.14)));box-shadow:0 24px 50px -20px rgba(0,0,0,.6);opacity:0;transform:translateY(-6px) scale(.98);pointer-events:none;transition:opacity .22s,transform .35s cubic-bezier(.2,.7,.2,1);z-index:60;text-align:left}' +
    '.pm-pop::before{content:"";position:absolute;left:0;right:0;top:-14px;height:14px}' +
    '.pm-item:hover .pm-pop,.pm-item:focus-within .pm-pop{opacity:1;transform:none;pointer-events:auto;transition-delay:.08s}' +
    '.pm-pop p{margin:0 0 6px;font:500 13px/1.45 "Inter",system-ui,sans-serif;color:var(--muted,#a6a6bc);white-space:normal}' +
    '.pm-pop a{display:block;padding:7px 10px;border-radius:12px;text-decoration:none;color:var(--text,#f4f4f8);font:600 13.5px "Inter",system-ui,sans-serif;white-space:normal}' +
    '.pm-pop a small{display:block;font:500 12px/1.35 "Inter",system-ui,sans-serif;color:var(--dim,#6e6e86);margin-top:1px}' +
    '.pm-pop a:hover{background:var(--glass2,rgba(255,255,255,.08))}' +
    '.pm-pop.wide{width:420px;display:grid;grid-template-columns:1fr 1fr;gap:2px}.pm-pop.wide p{grid-column:1/-1}' +
    '.pm-pop.right{left:auto;right:-10px;translate:none}' +
    '.pm-drop{position:absolute;left:0;right:0;top:calc(100% + 8px);display:grid;gap:2px;padding:10px;border-radius:24px;max-height:calc(100svh - 90px);overflow:auto;background:color-mix(in srgb,var(--bg,#08080c) 97%,transparent);backdrop-filter:blur(22px) saturate(1.6);-webkit-backdrop-filter:blur(22px) saturate(1.6);border:1px solid var(--brd,var(--glass-brd,rgba(255,255,255,.13)));box-shadow:0 24px 50px -20px rgba(0,0,0,.6);opacity:0;transform:translateY(-8px) scale(.98);transform-origin:top right;pointer-events:none;transition:opacity .3s,transform .45s cubic-bezier(.2,.7,.2,1)}' +
    '.pm-open .pm-drop{opacity:1;transform:none;pointer-events:auto}' +
    '.pm-drop a{display:flex;justify-content:space-between;align-items:center;text-decoration:none;color:var(--text,#f4f4f8);font:600 17px "Space Grotesk",system-ui,sans-serif;padding:11px 14px;border-radius:16px}' +
    '.pm-drop a[aria-current]{background:var(--glass2,rgba(255,255,255,.08))}.pm-drop a span{font:500 12px "Inter",system-ui,sans-serif;color:var(--dim,#6e6e86)}' +
    '.pm-drop .pm-sub{font:600 10.5px "Inter",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--dim,#6e6e86);padding:10px 14px 2px}' +
    '.pm-drop .pm-small{font:500 14.5px "Inter",system-ui,sans-serif;padding:8px 14px}' +
    '@media (max-width:1060px){.pm-links{display:none}.pm-menu{display:flex}}' +
    '@media (max-width:520px){.pm-ctl .pm-hide-s{display:none}}' +
    'nav[data-shell] .pm-brand{font-size:13px}nav[data-shell] .pm-inner{padding:0 8px 0 20px;height:56px}@media (max-width:760px){nav[data-shell] .pm-inner{padding-left:16px;height:52px}}' +
    '@media (max-width:440px){.pm-brand span{display:none}.pm-nav{padding-left:12px}}' +
    '.pm-foot{margin:56px auto 0;width:min(1120px,calc(100% - 32px));padding:28px 0 calc(34px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line,rgba(255,255,255,.1));display:grid;grid-template-columns:1.3fr repeat(3,1fr);gap:24px;font:14px/1.6 "Inter",system-ui,sans-serif;color:var(--muted,#a6a6bc)}' +
    '.pm-foot h4{margin:0 0 8px;font:600 11px "Inter",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--dim,#6e6e86)}' +
    '.pm-foot a{display:block;color:var(--muted,#a6a6bc);text-decoration:none;padding:3px 0}.pm-foot a:hover{color:var(--text,#f4f4f8)}' +
    '.pm-foot .pm-brand{margin-bottom:10px}.pm-foot p{margin:0;max-width:34ch}.pm-foot small{display:block;margin-top:14px;color:var(--dim,#6e6e86);font-size:12px}' +
    '@media (max-width:760px){.pm-foot{grid-template-columns:1fr 1fr}.pm-foot>div:first-child{grid-column:1/-1}}' +
    '.pm-mini{position:fixed;left:max(12px,env(safe-area-inset-left));top:max(12px,env(safe-area-inset-top));z-index:9999;display:flex;gap:2px;padding:4px;border-radius:999px;background:rgba(10,10,14,.55);backdrop-filter:blur(16px) saturate(1.6);-webkit-backdrop-filter:blur(16px) saturate(1.6);border:1px solid rgba(255,255,255,.16);font:600 12.5px "Inter",system-ui,sans-serif}' +
    '.pm-mini a{color:#f4f4f8;text-decoration:none;padding:7px 12px;border-radius:999px}.pm-mini a:hover{background:rgba(255,255,255,.12)}' +
    '@media print{.pm-nav,.pm-mini{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  var DROP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c3.4 4.2 6 7.4 6 10.6A6 6 0 0 1 6 13.6C6 10.4 8.6 7.2 12 3z"/><circle cx="9.8" cy="12.6" r="1.2" fill="currentColor" stroke="none"/></svg>';

  var nav, foot, mini;
  var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  function pop(n, i) {
    var right = i >= SITE.nav.length - 2 ? ' right' : '';
    if (n.sub === 'portfolio') {
      var its = SITE.map[0].items.slice(0, 4).concat(SITE.map[1].items);
      return '<div class="pm-pop wide' + right + '"><p>' + esc(L(n.d)) + '</p>' + its.map(function (x) { return '<a href="' + x.href + '">' + esc(L(x.t)) + '<small>' + esc(L(x.d)) + '</small></a>'; }).join('') + '</div>';
    }
    if (n.sub === 'games') {
      return '<div class="pm-pop' + right + '"><p>' + esc(L(n.d)) + '</p>' + SITE.map[3].items.slice(1, 6).map(function (x) { return '<a href="' + x.href + '">' + esc(L(x.t)) + '<small>' + esc(L(x.d)) + '</small></a>'; }).join('') + '</div>';
    }
    return '<div class="pm-pop' + right + '"><p>' + esc(L(n.d)) + '</p></div>';
  }
  function drawChrome() {
    if (mode === 'mini') {
      if (!mini) { mini = document.createElement('div'); mini.className = 'pm-mini'; document.body.appendChild(mini); }
      var bk = me && me.dataset.back; mini.innerHTML = bk ? '<a href="' + bk + '">' + (lang === 'en' ? me.dataset.backEn : me.dataset.backEs) + '</a><a href="/">promii.co</a>' : '<a href="/lab/">' + L(SITE.ui.back) + '</a><a href="/">promii.co</a><a href="/home/">' + (lang === 'en' ? 'Map' : 'Mapa') + '</a>';
      return;
    }
    if (mode === 'full' || mode === 'nav') {
      var open = nav && nav.classList.contains('pm-open');
      if (!nav) { if (adopt) nav = adopt; else { nav = document.createElement('nav'); nav.className = 'pm-nav'; document.body.insertBefore(nav, document.body.firstChild); } }
      nav.setAttribute('aria-label', lang === 'en' ? 'Site navigation' : 'Navegación del sitio');
      var links = SITE.nav.map(function (n, i) { return '<div class="pm-item"><a href="' + n.href + '"' + (cur(n.href) ? ' aria-current="page"' : '') + '>' + esc(L(n.t)) + '</a>' + pop(n, i) + '</div>'; }).join('');
      var drop = SITE.nav.map(function (n) { return '<a href="' + n.href + '"' + (cur(n.href) ? ' aria-current="page"' : '') + '>' + esc(L(n.t)) + '<span>→</span></a>'; }).join('') +
        '<a href="/home/"' + (cur('/home/') ? ' aria-current="page"' : '') + '>' + esc(L(SITE.ui.map)) + '<span>→</span></a>' +
        '<div class="pm-sub">' + (lang === 'en' ? 'Portfolio sections' : 'Secciones del portafolio') + '</div>' +
        SITE.map[0].items.slice(0, 4).concat(SITE.map[1].items.slice(0, 2)).map(function (i) { return '<a class="pm-small" href="' + i.href + '">' + esc(L(i.t)) + '</a>'; }).join('') +
        '<a class="pm-small" href="https://admin.promii.co">' + esc(L(SITE.ui.admin)) + ' ↗</a>';
      nav.innerHTML = (adopt ? '<div class="pm-inner">' : '') + '<a class="pm-brand" href="/"><i></i><span>Brian Zuleta</span></a><div class="pm-links">' + links + '</div>' +
        '<div class="pm-ctl"><a class="pm-ic" href="/home/" title="' + esc(L(SITE.ui.map)) + '" aria-label="' + esc(L(SITE.ui.map)) + '">' + DROP + '</a>' +
        '<a class="pm-ic pm-hide-s" href="https://admin.promii.co" title="' + esc(L(SITE.ui.admin)) + '" aria-label="' + esc(L(SITE.ui.admin)) + '">' + LOCK + '</a>' +
        '<div class="pm-lang" role="group" aria-label="Idioma / Language"><button type="button" data-l="es"' + (lang === 'es' ? ' class="on"' : '') + '>ES</button><button type="button" data-l="en"' + (lang === 'en' ? ' class="on"' : '') + '>EN</button></div>' +
        (darkOnly ? '' : '<button class="pm-ic pm-theme" type="button" title="' + esc(L(SITE.ui.theme)) + '" aria-label="' + esc(L(SITE.ui.theme)) + '">' + (theme() === 'light' ? '☀️' : '🌙') + '</button>') +
        '<button class="pm-menu" type="button" aria-expanded="false" aria-controls="pm-drop">' + esc(L(SITE.ui.menu)) + '<b><i></i><i></i></b></button></div>' +
        '<div class="pm-drop" id="pm-drop">' + drop + '</div>' + (adopt ? '</div>' : '');
      if (open) toggle(true);
    }
    if (mode === 'nav') return;
    if (!foot) { foot = document.createElement('footer'); foot.className = 'pm-foot'; document.body.appendChild(foot); }
    var cols = [
      [L(SITE.ui.explore), SITE.nav.concat([{ t: SITE.ui.map, href: '/home/' }])],
      [L(SITE.ui.learn), [SITE.map[2].items[0], SITE.map[2].items[1], SITE.map[2].items[2], SITE.map[3].items[0], SITE.map[4].items[0], SITE.map[4].items[2]]],
      [L(SITE.ui.social), SITE.social.map(function (s) { return { t: s[0], href: s[1], ext: 1 }; })]
    ];
    foot.innerHTML = '<div><a class="pm-brand" href="/"><i></i>Brian Zuleta</a><p>' + esc(L(SITE.ui.tag)) + '</p><small>© ' + new Date().getFullYear() + ' Brian Zuleta · promii.co</small></div>' +
      cols.map(function (c) { return '<div><h4>' + c[0] + '</h4>' + c[1].map(function (n) { return '<a href="' + n.href + '"' + (n.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(L(n.t)) + '</a>'; }).join('') + '</div>'; }).join('');
  }
  function toggle(o) { if (!nav) return; nav.classList.toggle('pm-open', o); var b = nav.querySelector('.pm-menu'); if (b) b.setAttribute('aria-expanded', o ? 'true' : 'false'); }
  drawChrome();
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!nav || !t.closest) return;
    var lb = t.closest('.pm-lang button'); if (lb) { setLang(lb.getAttribute('data-l')); return; }
    if (t.closest('.pm-theme')) { toggleTheme(); return; }
    if (t.closest('.pm-menu')) { e.stopPropagation(); toggle(!nav.classList.contains('pm-open')); return; }
    if (!nav.contains(t)) toggle(false);
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
})();
