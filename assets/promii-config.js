/* Promii · sistema de estilos y movimiento (compartido por la página y el panel).
   - REGISTRY: todas las animaciones que se pueden encender o apagar desde el panel.
   - Estilos: "glass" (Liquid Glass, principal) e "ink" (Tinta china). Mismo movimiento, proporciones y botones.
   - La configuración vive en Supabase (tabla site_config); se guarda en caché local para que no parpadee.
   - Para previsualizar sin guardar: ?style=ink&accent=%23e0261b&off=orbs,fx */
(function () {
  var REGISTRY = [
    { key: 'fx',       group: 'Fondo',      name: 'Constelación de partículas', where: 'Hero', styles: ['glass'] },
    { key: 'orbs',     group: 'Fondo',      name: 'Orbes de color',              where: 'Toda la página', styles: ['glass'] },
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
    { key: 'toast',    group: 'Avisos',     name: 'Aviso de redes de arte',      where: 'Abajo a la izquierda' }
  ];
  var STYLES = { glass: 'Liquid Glass', ink: 'Tinta china' };
  var DEFAULT = { style: 'glass', accent: '#e0261b', off: [] };
  var C = window.PROMII_ANALYTICS_BOOT || { url: 'https://lcahlrunxtgbghxauwoy.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYWhscnVueHRnYmdoeGF1d295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxODAzOTYsImV4cCI6MjExMDc1NjM5Nn0.gJ3wl9R9BjIpafbxJco2Wcl4kM24_s36liSy5t-M1A4' };

  function norm(c) {
    c = c || {};
    return { style: STYLES[c.style] ? c.style : DEFAULT.style, accent: /^#[0-9a-f]{6}$/i.test(c.accent || '') ? c.accent : DEFAULT.accent, off: Array.isArray(c.off) ? c.off.filter(function (k) { return typeof k === 'string'; }) : [] };
  }
  function apply(c) {
    c = norm(c); var h = document.documentElement;
    h.setAttribute('data-style', c.style);
    h.setAttribute('data-off', c.off.join(' '));
    h.style.setProperty('--accent', c.accent);
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
  window.PromiiConfig = { REGISTRY: REGISTRY, STYLES: STYLES, DEFAULT: DEFAULT, apply: apply, norm: norm, load: load, isOn: function (k) { return (window.PROMII_CFG.off || []).indexOf(k) < 0; } };
  load();
})();
