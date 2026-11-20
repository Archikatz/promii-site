/* Promii · encabezado, navegación y pie comunes para las páginas internas.
   Uso: <script src="/assets/site-shell.js" data-mode="full"></script> al final del <body>.
   data-mode: "full" (barra + pie), "mini" (píldora flotante para volver, en demos a pantalla completa), "foot" (solo pie).
   PROMII_SITE es la fuente única del mapa del sitio: la usan esta barra, el pie y la página /home/.
   Para agregar una sección nueva al sitio, agrégala aquí y aparece en todas partes. */
(function () {
  var SITE = window.PROMII_SITE = {
    nav: [
      { k: 'inicio', t: 'Inicio', href: '/' },
      { k: 'bitacora', t: 'Bitácora', href: '/bitacora/' },
      { k: 'academy', t: 'Academy', href: '/academy/' },
      { k: 'lab', t: 'Lab', href: '/lab/' },
      { k: 'games', t: 'Juegos', href: '/games/' },
      { k: 'contacto', t: 'Contacto', href: '/#contacto' }
    ],
    /* Mapa completo: grupos → destinos. st: "live" (activo) o "soon" (próximamente). */
    map: [
      { g: 'Contratar a Brian', c: '#2f6bff', items: [
        { t: 'Sobre mí', d: 'Arquitecto, BIM e IA entre Nueva York y Bogotá', href: '/#sobre', st: 'live' },
        { t: 'Experiencia', d: 'Cargos, obras y resultados', href: '/#experiencia', st: 'live' },
        { t: 'Proyectos', d: 'Planos que se dibujan solos', href: '/#proyectos', st: 'live' },
        { t: 'Casos', d: 'Sistemas contados como productos', href: '/#casos', st: 'live' },
        { t: 'Hoja de vida', d: 'CV en español e inglés', href: '/#sobre', st: 'live' }
      ] },
      { g: 'Trabajar con Promii', c: '#ff3b30', items: [
        { t: 'Servicios', d: 'Arquitectura, BIM e IA productizados', href: '/#servicios', st: 'live' },
        { t: 'Cotizar', d: 'Arma tu paquete', href: '/#cotizar', st: 'live' },
        { t: 'Contacto', d: 'Escríbeme', href: '/#contacto', st: 'live' }
      ] },
      { g: 'Aprender', c: '#e8b23a', items: [
        { t: 'Bitácora', d: 'Cómo lo hice: casos y procesos', href: '/bitacora/', st: 'live' },
        { t: 'Academy', d: 'Guías y playbooks paso a paso', href: '/academy/', st: 'live' },
        { t: 'Motion Lab', d: '13 demos de animación', href: '/lab/', st: 'live' }
      ] },
      { g: 'Jugar y crear', c: '#22e0c8', items: [
        { t: 'Promii Games', d: 'Juegos web de arquitectura', href: '/games/', st: 'live' },
        { t: 'Torre de niveles', d: 'Apila losas sin perder el aplomo', href: '/games/torre.html', st: 'live' },
        { t: 'Detección de choques', d: 'Encuentra las interferencias', href: '/games/choques.html', st: 'live' },
        { t: 'ArchiKatz', d: 'Arte, tienda y editorial', href: '/#ecosistema', st: 'soon' },
        { t: 'Comunidad', d: 'Arquitectos y creadores con IA', href: '/#ecosistema', st: 'soon' }
      ] }
    ],
    social: [
      ['LinkedIn', 'https://www.linkedin.com/in/bczuleta'],
      ['Instagram', 'https://www.instagram.com/promii.co'],
      ['Behance', 'https://www.behance.net/brianzuleta'],
      ['YouTube', 'https://www.youtube.com/@promii']
    ]
  };

  var me = document.currentScript, mode = (me && me.dataset.mode) || 'full';
  if (mode === 'data') return;
  var path = location.pathname.replace(/index\.html$/, '');
  function cur(h) { if (h === '/' || h.charAt(1) === '#') return path === '/'; return path.indexOf(h) === 0; }

  var css = '' +
    '.pm-nav{position:sticky;top:calc(10px + env(safe-area-inset-top,0px));z-index:50;margin:10px auto 0;width:min(1080px,calc(100% - 24px));display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 8px 8px 18px;border-radius:999px;' +
    'background:linear-gradient(140deg,var(--glass2,rgba(255,255,255,.07)),var(--glass,rgba(255,255,255,.04)));backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);border:1px solid var(--brd,var(--glass-brd,rgba(255,255,255,.13)));box-shadow:0 18px 40px -20px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.14);font-family:"Inter",ui-sans-serif,system-ui,sans-serif}' +
    '.pm-brand{display:flex;align-items:center;gap:10px;font:700 13px "Space Grotesk",ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;color:var(--text,#f4f4f8);white-space:nowrap}' +
    '.pm-brand i{width:10px;height:10px;border-radius:50%;background:var(--accent,#ff3b30);box-shadow:0 0 12px var(--accent,#ff3b30)}' +
    '.pm-links{display:flex;gap:4px}.pm-links a{text-decoration:none;font:500 13px "Inter",system-ui,sans-serif;color:var(--muted,#a6a6bc);padding:8px 12px;border-radius:999px}' +
    '.pm-links a:hover,.pm-links a[aria-current]{color:var(--text,#f4f4f8);background:var(--glass2,rgba(255,255,255,.08))}' +
    '.pm-menu{display:none;align-items:center;gap:8px;border:0;cursor:pointer;font:600 13px "Inter",system-ui,sans-serif;color:var(--text,#f4f4f8);background:var(--glass2,rgba(255,255,255,.08));padding:9px 14px;border-radius:999px}' +
    '.pm-menu b{display:grid;gap:3px}.pm-menu b i{display:block;width:14px;height:1.6px;border-radius:2px;background:currentColor;transition:transform .35s cubic-bezier(.2,.7,.2,1)}' +
    '.pm-nav.open .pm-menu b i:first-child{transform:translateY(2.3px) rotate(45deg)}.pm-nav.open .pm-menu b i:last-child{transform:translateY(-2.3px) rotate(-45deg)}' +
    '.pm-drop{position:absolute;left:0;right:0;top:calc(100% + 8px);display:grid;gap:4px;padding:10px;border-radius:24px;background:color-mix(in srgb,var(--bg,#08080c) 82%,transparent);backdrop-filter:blur(22px) saturate(1.6);-webkit-backdrop-filter:blur(22px) saturate(1.6);border:1px solid var(--brd,var(--glass-brd,rgba(255,255,255,.13)));box-shadow:0 24px 50px -20px rgba(0,0,0,.7);opacity:0;transform:translateY(-8px) scale(.98);transform-origin:top right;pointer-events:none;transition:opacity .3s,transform .45s cubic-bezier(.2,.7,.2,1)}' +
    '.pm-nav.open .pm-drop{opacity:1;transform:none;pointer-events:auto}' +
    '.pm-drop a{display:flex;justify-content:space-between;align-items:center;text-decoration:none;color:var(--text,#f4f4f8);font:600 17px "Space Grotesk",system-ui,sans-serif;padding:12px 14px;border-radius:16px}' +
    '.pm-drop a[aria-current]{background:var(--glass2,rgba(255,255,255,.08))}.pm-drop a span{font:500 12px "Inter",system-ui,sans-serif;color:var(--dim,#6e6e86)}' +
    '@media (max-width:760px){.pm-links{display:none}.pm-menu{display:flex}}' +
    '.pm-foot{margin:56px auto 0;width:min(1080px,calc(100% - 32px));padding:28px 0 calc(34px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line,rgba(255,255,255,.1));display:grid;grid-template-columns:1.3fr repeat(3,1fr);gap:24px;font:14px/1.6 "Inter",system-ui,sans-serif;color:var(--muted,#a6a6bc)}' +
    '.pm-foot h4{margin:0 0 8px;font:600 11px "Inter",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--dim,#6e6e86)}' +
    '.pm-foot a{display:block;color:var(--muted,#a6a6bc);text-decoration:none;padding:3px 0}.pm-foot a:hover{color:var(--text,#f4f4f8)}' +
    '.pm-foot .pm-brand{margin-bottom:10px}.pm-foot p{margin:0;max-width:34ch}.pm-foot small{display:block;margin-top:14px;color:var(--dim,#6e6e86);font-size:12px}' +
    '@media (max-width:760px){.pm-foot{grid-template-columns:1fr 1fr}.pm-foot>div:first-child{grid-column:1/-1}}' +
    '.pm-mini{position:fixed;left:max(12px,env(safe-area-inset-left));top:max(12px,env(safe-area-inset-top));z-index:9999;display:flex;gap:2px;padding:4px;border-radius:999px;background:rgba(10,10,14,.55);backdrop-filter:blur(16px) saturate(1.6);-webkit-backdrop-filter:blur(16px) saturate(1.6);border:1px solid rgba(255,255,255,.16);font:600 12.5px "Inter",system-ui,sans-serif}' +
    '.pm-mini a{color:#f4f4f8;text-decoration:none;padding:7px 12px;border-radius:999px}.pm-mini a:hover{background:rgba(255,255,255,.12)}' +
    '@media print{.pm-nav,.pm-mini{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function link(n) { return '<a href="' + n.href + '"' + (cur(n.href) ? ' aria-current="page"' : '') + '>' + esc(n.t) + '</a>'; }

  if (mode === 'mini') {
    var m = document.createElement('div'); m.className = 'pm-mini';
    m.innerHTML = '<a href="/lab/">← Lab</a><a href="/">promii.co</a><a href="/home/">Mapa</a>';
    document.body.appendChild(m); return;
  }
  if (mode === 'full') {
    var nav = document.createElement('nav'); nav.className = 'pm-nav'; nav.setAttribute('aria-label', 'Navegación del sitio');
    nav.innerHTML = '<a class="pm-brand" href="/"><i></i>Brian Zuleta</a><div class="pm-links">' + SITE.nav.map(link).join('') + '</div>' +
      '<button class="pm-menu" type="button" aria-expanded="false" aria-controls="pm-drop">Menú<b><i></i><i></i></b></button>' +
      '<div class="pm-drop" id="pm-drop">' + SITE.nav.concat([{ t: 'Mapa del sitio', href: '/home/' }]).map(function (n) { return '<a href="' + n.href + '"' + (cur(n.href) ? ' aria-current="page"' : '') + '>' + esc(n.t) + '<span>→</span></a>'; }).join('') + '</div>';
    document.body.insertBefore(nav, document.body.firstChild);
    var btn = nav.querySelector('.pm-menu');
    function toggle(o) { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(!nav.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) toggle(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
  }
  var f = document.createElement('footer'); f.className = 'pm-foot';
  var cols = [
    ['Explorar', SITE.nav.concat([{ t: 'Mapa del sitio', href: '/home/' }])],
    ['Aprender', [{ t: 'Bitácora', href: '/bitacora/' }, { t: 'Academy', href: '/academy/' }, { t: 'Motion Lab', href: '/lab/' }, { t: 'Promii Games', href: '/games/' }]],
    ['Redes', SITE.social.map(function (s) { return { t: s[0], href: s[1], ext: 1 }; })]
  ];
  f.innerHTML = '<div><a class="pm-brand" href="/"><i></i>Brian Zuleta</a><p>Arquitectura, BIM y sistemas de IA. Promii / Studio Brian Zuleta.</p><small>© ' + new Date().getFullYear() + ' Brian Zuleta · promii.co</small></div>' +
    cols.map(function (c) { return '<div><h4>' + c[0] + '</h4>' + c[1].map(function (n) { return '<a href="' + n.href + '"' + (n.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(n.t) + '</a>'; }).join('') + '</div>'; }).join('');
  document.body.appendChild(f);
})();
