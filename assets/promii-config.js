/* Promii · sistema de estilos y movimiento (compartido por la página y el panel).
   - REGISTRY: todas las animaciones que se pueden encender o apagar desde el panel.
   - Estilos: "glass" (Liquid Glass, principal) e "ink" (Tinta china). Mismo movimiento, proporciones y botones.
   - La configuración vive en Supabase (tabla site_config); se guarda en caché local para que no parpadee.
   - Para previsualizar sin guardar: ?style=ink&accent=%23e0261b&off=orbs,fx */
(function () {
  var REGISTRY = [
    { key: 'fx',       group: 'Fondo',      name: 'Constelación de partículas', where: 'Hero', styles: ['glass', 'gem'] },
    { key: 'orbs',     group: 'Fondo',      name: 'Orbes de color',              where: 'Toda la página', styles: ['glass', 'gem'] },
    { key: 'inkbg',    group: 'Fondo',      name: 'Nubes de tinta',              where: 'Toda la página', styles: ['ink'] },
    { key: 'shine',    group: 'Tipografía', name: 'Brillo / trazo del titular',  where: 'Hero' },
    { key: 'marquee',  group: 'Tipografía', name: 'Cinta de herramientas',       where: 'Hero' },
    { key: 'reveal',   group: 'Entradas',   name: 'Revelado al hacer scroll',    where: 'Todas las secciones' },
    { key: 'prog',     group: 'Entradas',   name: 'Barra de progreso',           where: 'Arriba' },
    { key: 'bars',     group: 'Entradas',   name: 'Barras de años',              where: 'Habilidades' },
    { key: 'projdraw', group: 'Dibujos',    name: 'Dibujo de proyectos',         where: 'Proyectos' },
    { key: 'life',     group: 'Dibujos',    name: 'Vida de los dibujos',         where: 'Proyectos' },
    { key: 'dims',     group: 'Dibujos',    name: 'Cotas de títulos',            where: 'Títulos' },
    { key: 'whyicons', group: 'Dibujos',    name: 'Íconos que se dibujan',       where: 'Por qué Studio BZ' },
    { key: 'route',    group: 'Dibujos',    name: 'Ruta Nueva York ↔ Bogotá',    where: 'Contacto' },
    { key: 'tl',       group: 'Scroll',     name: 'Línea de tiempo viva',        where: 'Experiencia' },
    { key: 'projzoom', group: 'Interacción',name: 'Zoom de proyectos',           where: 'Proyectos' },
    { key: 'tilt',     group: 'Interacción',name: 'Inclinación 3D de servicios', where: 'Servicios' },
    { key: 'cursor',   group: 'Interacción',name: 'Estela de tinta del cursor',  where: 'Escritorio', styles: ['ink'] },
    { key: 'splash',   group: 'Interacción',name: 'Gota de tinta al hacer clic', where: 'Toda la página', styles: ['ink'] },
    { key: 'squircle', group: 'Forma',      name: 'Esquinas continuas tipo Apple', where: 'Tarjetas y paneles' },
    { key: 'lg',       group: 'Forma',      name: 'Refracción Liquid Glass',     where: 'Barra de navegación (Chrome/Edge)', styles: ['glass'] },
    { key: 'projtilt', group: 'Interacción',name: 'Inclinación 3D de proyectos', where: 'Proyectos (escritorio)' },
    { key: 'morph',    group: 'Interacción',name: 'Transición fluida a detalle', where: 'Casos' },
    { key: 'fab',      group: 'Interacción',name: 'Contacto líquido flotante',   where: 'Abajo a la derecha' },
    { key: 'jelly',    group: 'Interacción',name: 'Botones gelatinosos',         where: 'Botones, pestañas y tarjetas' },
    { key: 'facets',   group: 'Fondo',      name: 'Geometría sagrada',           where: 'Toda la página', styles: ['gem'] },
    { key: 'wordmark', group: 'Tipografía', name: 'Palabra promii gigante',      where: 'Hero' },
    { key: 'drop',     group: 'Fondo',      name: 'Gota de agua viva',           where: 'Viaja por toda la página' },
    { key: 'toast',    group: 'Avisos',     name: 'Aviso de redes de arte',      where: 'Abajo a la izquierda' }
  ];
  var STYLES = { glass: 'Liquid Glass', ink: 'Tinta china', gem: 'Obsidiana' };
  /* Física y forma: [min, max, paso, valor por defecto, nombre, unidad, grupo] */
  var PARAMS = {
    radius:     [8, 40, 1, 20, 'Radio de esquinas', 'px', 'Forma'],
    smooth:     [1, 2.6, .1, 1.7, 'Suavizado continuo (squircle)', '', 'Forma'],
    blur:       [0, 40, 1, 24, 'Desenfoque del vidrio', 'px', 'Vidrio'],
    shine:      [0, 1, .05, .5, 'Brillo especular', '', 'Vidrio'],
    refraction: [0, 120, 2, 46, 'Refracción (Chrome/Edge)', '', 'Vidrio'],
    bezel:      [4, 40, 1, 16, 'Bisel de la lente', 'px', 'Vidrio'],
    springK:    [80, 900, 10, 300, 'Rigidez de los muelles', '', 'Movimiento'],
    springZ:    [.3, 1.2, .02, .72, 'Amortiguación', '', 'Movimiento'],
    jelly:      [0, 1, .05, .5, 'Gelatina de los botones', '', 'Movimiento'],
    drop:       [70, 260, 5, 150, 'Tamaño de la gota', 'px', 'Vidrio'],
    zoom:       [1, 2.2, .05, 1.45, 'Aumento de la lupa', '×', 'Vidrio']
  };
  var PDEF = {}; Object.keys(PARAMS).forEach(function (k) { PDEF[k] = PARAMS[k][3]; });
  var DEFAULT = { style: 'glass', accent: '#ff3b30', off: [], p: PDEF };
  /* Curva CSS linear() a partir de un muelle (rigidez k, amortiguación z) */
  function springLinear(k, z) {
    var x = 0, v = 0, dt = 1 / 240, pts = [0], t = 0, rest = 0, c = 2 * Math.sqrt(k) * z;
    while (t < 3) { v += (k * (1 - x) - c * v) * dt; x += v * dt; t += dt; pts.push(x); if (Math.abs(1 - x) < .001 && Math.abs(v) < .01) { if (++rest > 30) break; } else rest = 0; }
    var out = []; for (var i = 0; i <= 40; i++) out.push(+pts[Math.round(i / 40 * (pts.length - 1))].toFixed(3)); out[40] = 1;
    return { css: 'linear(' + out.join(',') + ')', dur: Math.max(.35, Math.min(1.6, t)) };
  }
  var C = window.PROMII_ANALYTICS_BOOT || { url: 'https://lcahlrunxtgbghxauwoy.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYWhscnVueHRnYmdoeGF1d295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxODAzOTYsImV4cCI6MjExMDc1NjM5Nn0.gJ3wl9R9BjIpafbxJco2Wcl4kM24_s36liSy5t-M1A4' };

  function norm(c) {
    c = c || {};
    var p = {}, cp = c.p || {};
    Object.keys(PARAMS).forEach(function (k) { var d = PARAMS[k], v = +cp[k]; p[k] = isFinite(v) && cp[k] !== null && cp[k] !== '' ? Math.min(d[1], Math.max(d[0], v)) : d[3]; });
    return { style: STYLES[c.style] ? c.style : DEFAULT.style, accent: /^#[0-9a-f]{6}$/i.test(c.accent || '') ? c.accent : DEFAULT.accent, off: Array.isArray(c.off) ? c.off.filter(function (k) { return typeof k === 'string'; }) : [], p: p };
  }
  function apply(c) {
    c = norm(c); var h = document.documentElement;
    h.setAttribute('data-style', c.style);
    h.setAttribute('data-off', c.off.join(' '));
    h.style.setProperty('--accent', c.accent);
    var P = c.p, sp = springLinear(P.springK, P.springZ);
    h.style.setProperty('--card-r', P.radius + 'px'); h.style.setProperty('--sq', P.smooth);
    h.style.setProperty('--glass-blur', P.blur + 'px'); h.style.setProperty('--spec', P.shine);
    h.style.setProperty('--m-spring', sp.css); h.style.setProperty('--spring-dur', sp.dur.toFixed(2) + 's');
    h.style.setProperty('--jelly', P.jelly);
    window.PROMII_P = P;
    window.PROMII_CFG = c;
    try { window.dispatchEvent(new CustomEvent('promii:config', { detail: c })); } catch (e) {}
    return c;
  }
  function urlOverrides(c) {
    try {
      var q = new URLSearchParams(location.search), o = {};
      if (q.get('style')) o.style = q.get('style');
      if (q.get('accent')) o.accent = q.get('accent');
      if (q.get('off') !== null) o.off = q.get('off') ? q.get('off').split(',') : [];
      if (q.get('p')) { try { o.p = JSON.parse(q.get('p')); } catch (e) {} }
      return Object.keys(o).length ? norm(Object.assign({}, c, o)) : null;
    } catch (e) { return null; }
  }
  var cached = null; try { cached = JSON.parse(localStorage.getItem('pm_cfg') || 'null'); } catch (e) {}
  var forced = urlOverrides(cached || DEFAULT);
  apply(forced || cached || DEFAULT);

  function load() {
    if (forced || !C.url || !window.fetch) return Promise.resolve(window.PROMII_CFG);
    return fetch(C.url + '/rest/v1/site_config?select=data&id=eq.1', { headers: { apikey: C.key, Authorization: 'Bearer ' + C.key } })
      .then(function (r) { return r.json(); })
      .then(function (rows) { if (rows && rows[0]) { var c = apply(rows[0].data); try { localStorage.setItem('pm_cfg', JSON.stringify(c)); } catch (e) {} } return window.PROMII_CFG; })
      .catch(function () { return window.PROMII_CFG; });
  }
  window.PromiiConfig = { REGISTRY: REGISTRY, STYLES: STYLES, PARAMS: PARAMS, springLinear: springLinear, DEFAULT: DEFAULT, apply: apply, norm: norm, load: load, isOn: function (k) { return (window.PROMII_CFG.off || []).indexOf(k) < 0; } };
  load();
})();
