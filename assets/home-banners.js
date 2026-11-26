/* Promii home featured banners — Editorial · Arcade · Lab · Servicios · Academy */
(function () {
  if (window.__promiiBanners) return;
  window.__promiiBanners = true;
  var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;

  function mount() {
    if (document.getElementById('pm-banners')) return;

    var sec = document.createElement('section');
    sec.id = 'pm-banners';
    sec.setAttribute('aria-label', 'Destacados');
    sec.innerHTML =
      '<div class="pm-ban-inner">' +
        '<p class="pm-ban-kicker">En portada</p>' +
        '<div class="pm-ban-grid">' +
          '<a class="pm-ban card-ed" href="/editorial/">' +
            '<span class="pm-ban-tag">Editorial</span>' +
            '<strong>Fractalia & Sicodelia</strong>' +
            '<span class="pm-ban-sub">Manuscritos vivos \u00b7 toons \u00b7 universo ArchiKatz</span>' +
            '<span class="pm-ban-cta">Leer ahora \u2192</span>' +
          '</a>' +
          '<a class="pm-ban card-ar" href="/arcade/">' +
            '<span class="pm-ban-tag">Arcade</span>' +
            '<strong>20 protocolos cin\u00e9ticos</strong>' +
            '<span class="pm-ban-sub">Skill, f\u00edsica, BIM originals \u00b7 pide tu juego</span>' +
            '<span class="pm-ban-cta">Jugar \u2192</span>' +
          '</a>' +
          '<a class="pm-ban card-lab" href="/lab/">' +
            '<span class="pm-ban-tag">Lab</span>' +
            '<strong>Prototipos & sistemas</strong>' +
            '<span class="pm-ban-sub">Motion, automatizaci\u00f3n, asesor\u00eda idea \u2192 producto</span>' +
            '<span class="pm-ban-cta">Explorar Lab \u2192</span>' +
          '</a>' +
          '<a class="pm-ban card-sv" href="/servicios/">' +
            '<span class="pm-ban-tag">Servicios</span>' +
            '<strong>Hub modular \u00b7 Growth \u00b7 Cotizador</strong>' +
            '<span class="pm-ban-sub">Remodeling Denver/Bogot\u00e1 \u00b7 BIM \u00b7 Academy</span>' +
            '<span class="pm-ban-cta">Abrir hub \u2192</span>' +
          '</a>' +
          '<a class="pm-ban card-ac" href="/academy/">' +
            '<span class="pm-ban-tag">Academy</span>' +
            '<strong>IA-01 & 5 escuelas</strong>' +
            '<span class="pm-ban-sub">Campus \u00b7 prompts \u00b7 progreso local</span>' +
            '<span class="pm-ban-cta">Entrar \u2192</span>' +
          '</a>' +
          '<a class="pm-ban card-ct" href="/cotizador/">' +
            '<span class="pm-ban-tag">Cotizador</span>' +
            '<strong>12 servicios productizados</strong>' +
            '<span class="pm-ban-sub">SOW en vivo \u00b7 USD \u2194 COP \u00b7 bundle</span>' +
            '<span class="pm-ban-cta">Estimar \u2192</span>' +
          '</a>' +
        '</div>' +
      '</div>';

    var css = document.createElement('style');
    css.textContent =
      '#pm-banners{margin:32px auto 8px;padding:0 16px;max-width:1100px}' +
      '#pm-banners .pm-ban-inner{padding:20px 18px;border-radius:22px;border:1px solid rgba(127,127,127,.16);background:rgba(127,127,127,.04);backdrop-filter:blur(10px)}' +
      '#pm-banners .pm-ban-kicker{margin:0 0 12px;font:600 11px Inter,system-ui;letter-spacing:.14em;text-transform:uppercase;opacity:.55}' +
      '#pm-banners .pm-ban-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}' +
      '#pm-banners .pm-ban{display:flex;flex-direction:column;gap:6px;padding:18px 16px;border-radius:16px;text-decoration:none;color:inherit;border:1px solid rgba(127,127,127,.14);background:rgba(255,255,255,.03);min-height:132px;transition:transform .2s,border-color .2s,box-shadow .2s}' +
      '#pm-banners .pm-ban:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,0,0,.18)}' +
      '#pm-banners .pm-ban-tag{font:600 10px Inter,system-ui;letter-spacing:.12em;text-transform:uppercase;opacity:.7}' +
      '#pm-banners .pm-ban strong{font:700 16px Space Grotesk,system-ui;line-height:1.2}' +
      '#pm-banners .pm-ban-sub{font:500 12px Inter,system-ui;opacity:.72;line-height:1.4;flex:1}' +
      '#pm-banners .pm-ban-cta{font:700 12px Inter,system-ui;margin-top:4px}' +
      '#pm-banners .card-ed{border-color:rgba(232,178,58,.35)} #pm-banners .card-ed .pm-ban-tag,#pm-banners .card-ed .pm-ban-cta{color:#E8B23A}' +
      '#pm-banners .card-ar{border-color:rgba(34,224,200,.35)} #pm-banners .card-ar .pm-ban-tag,#pm-banners .card-ar .pm-ban-cta{color:#22E0C8}' +
      '#pm-banners .card-lab{border-color:rgba(47,107,255,.35)} #pm-banners .card-lab .pm-ban-tag,#pm-banners .card-lab .pm-ban-cta{color:#6E9BFF}' +
      '#pm-banners .card-sv{border-color:rgba(16,163,127,.35)} #pm-banners .card-sv .pm-ban-tag,#pm-banners .card-sv .pm-ban-cta{color:#10A37F}' +
      '#pm-banners .card-ac{border-color:rgba(8,145,178,.4)} #pm-banners .card-ac .pm-ban-tag,#pm-banners .card-ac .pm-ban-cta{color:#22D3EE}' +
      '#pm-banners .card-ct{border-color:rgba(37,99,235,.4)} #pm-banners .card-ct .pm-ban-tag,#pm-banners .card-ct .pm-ban-cta{color:#60A5FA}' +
      'html[data-theme=light] #pm-banners .pm-ban{background:rgba(0,0,0,.02)}';
    document.head.appendChild(css);

    var anchor = document.querySelector('#pm-discover, #contacto, footer, .pm-foot, main, .shell');
    if (anchor && anchor.parentNode) {
      if (anchor.id === 'pm-discover') anchor.parentNode.insertBefore(sec, anchor);
      else if (anchor.matches('footer, .pm-foot')) anchor.parentNode.insertBefore(sec, anchor);
      else anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    } else {
      document.body.appendChild(sec);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  setTimeout(mount, 700);
  setTimeout(mount, 1600);
})();
