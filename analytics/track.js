/* Promii Analytics · seguimiento ligero (≈2 KB), sin cookies ni datos personales.
   Registra: vistas, tiempo por sección, profundidad de scroll, clics (con posición para el mapa de calor)
   y envíos de formularios. Si no hay configuración, no hace nada. */
(function () {
  var C = window.PROMII_ANALYTICS || {};
  if (!C.url || !C.key || /^__/.test(C.key)) return;
  if (navigator.doNotTrack === '1' || /bot|crawl|spider|lighthouse|headless/i.test(navigator.userAgent)) return;
  if (location.hostname === 'localhost' && !C.dev) return;
  try { if (window.top !== window.self) return; } catch (e) { return; }  // vistas previas del panel: no cuentan

  function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function store(k, s) { try { var v = s.getItem(k); if (!v) { v = rid(); s.setItem(k, v); } return v; } catch (e) { return rid(); } }
  var vid = store('pm_vid', localStorage), sid = store('pm_sid', sessionStorage);
  var w = innerWidth, device = w < 700 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop';
  var qs = new URLSearchParams(location.search), utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(function (k) { return qs.get(k); }).filter(Boolean).join(' / ');
  var ref = ''; try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; if (ref === location.hostname) ref = ''; } catch (e) {}
  var q = [];

  function ev(type, extra) {
    var o = { vid: vid, sid: sid, type: type, path: location.pathname, lang: document.documentElement.lang || '', device: device,
      vw: innerWidth, vh: innerHeight, dh: document.documentElement.scrollHeight, ts: new Date().toISOString() };
    for (var k in extra) o[k] = extra[k];
    q.push(o); if (q.length >= 20) flush();
  }
  function flush() {
    if (!q.length) return;
    var body = JSON.stringify(q); q = [];
    try { fetch(C.url + '/rest/v1/events', { method: 'POST', keepalive: true, headers: { apikey: C.key, Authorization: 'Bearer ' + C.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: body }).catch(function () {}); } catch (e) {}
  }
  function sectionOf(el) { var s = el && el.closest && el.closest('section[id],header[id],footer'); return s ? (s.id || s.tagName.toLowerCase()) : null; }

  ev('pageview', { ref: ref, utm: utm || null });

  // clics: etiqueta legible del elemento y posición relativa al documento
  addEventListener('click', function (e) {
    var t = e.target.closest('a,button,[role=button],input[type=submit],summary,.proj,.svc') || e.target;
    var label = (t.getAttribute('aria-label') || t.getAttribute('data-i') || (t.textContent || '').trim() || t.getAttribute('href') || t.tagName).replace(/\s+/g, ' ').slice(0, 80);
    if (t.tagName === 'A' && t.hostname && t.hostname !== location.hostname) label = '↗ ' + t.hostname.replace(/^www\./, '') + ' · ' + label.slice(0, 50);
    ev('click', { x: +(e.pageX / document.documentElement.scrollWidth * 100).toFixed(2), y: Math.round(e.pageY), label: label, section: sectionOf(t) });
  }, { capture: true, passive: true });

  // formularios
  addEventListener('submit', function (e) { ev('form', { label: e.target.id || 'form', section: sectionOf(e.target) }); }, true);

  // profundidad máxima de scroll
  var maxS = 0, lastSent = 0;
  addEventListener('scroll', function () {
    var d = document.documentElement, p = Math.min(100, Math.round((scrollY + innerHeight) / d.scrollHeight * 100));
    if (p > maxS) maxS = p;
    if (maxS - lastSent >= 25) { lastSent = maxS - maxS % 25; ev('scroll', { value: lastSent }); }
  }, { passive: true });

  // tiempo visible por sección
  var vis = {}, acc = {};
  var io = new IntersectionObserver(function (es) {
    var now = performance.now();
    es.forEach(function (x) { var id = x.target.id || 'top'; if (x.isIntersecting) vis[id] = now; else if (vis[id]) { acc[id] = (acc[id] || 0) + (now - vis[id]) / 1000; delete vis[id]; } });
  }, { threshold: .4 });
  function observe() { document.querySelectorAll('section[id],header[id]').forEach(function (s) { io.observe(s); }); }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', observe); else observe();
  function dumpSections() {
    var now = performance.now();
    Object.keys(vis).forEach(function (id) { acc[id] = (acc[id] || 0) + (now - vis[id]) / 1000; vis[id] = now; });
    Object.keys(acc).forEach(function (id) { if (acc[id] >= 1) ev('section', { section: id, value: Math.round(acc[id]) }); });
    acc = {};
  }

  // latido cada 15 s mientras la pestaña está visible (tiempo en página)
  setInterval(function () { if (!document.hidden) ev('heartbeat', { value: 15 }); }, 15000);
  setInterval(flush, 10000);
  addEventListener('visibilitychange', function () { if (document.hidden) { dumpSections(); ev('leave', { value: maxS }); flush(); } });
  addEventListener('pagehide', function () { dumpSections(); flush(); });

  // eventos propios (juegos): promiiEvent('game', {label:'torre', value: 12})
  window.promiiEvent = function (type, extra) { ev(type, extra || {}); if (type === 'game') flush(); };

  // contador público: <span data-visit-count></span>
  window.promiiVisitCount = function () {
    return fetch(C.url + '/rest/v1/rpc/visit_count', { method: 'POST', headers: { apikey: C.key, Authorization: 'Bearer ' + C.key, 'Content-Type': 'application/json' }, body: '{}' }).then(function (r) { return r.json(); });
  };
})();
