/* Home discovery rails: Editorial, Arcade, Lab, Servicios + newsletter placeholder */
(function(){
  if (window.__promiiDiscover) return;
  window.__promiiDiscover = true;
  var path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;

  function mount(){
    if (document.getElementById('pm-discover')) return;
    var rail = document.createElement('section');
    rail.id = 'pm-discover';
    rail.setAttribute('aria-label', 'Explorar el ecosistema');
    rail.innerHTML =
      '<div class="pm-disc-inner">'+
        '<p class="pm-disc-kicker">Explorar</p>'+
        '<h2>Destacados del ecosistema</h2>'+
        '<div class="pm-disc-grid">'+
          '<a class="pm-disc-card" href="/editorial/"><strong>Editorial</strong><span>Fractalia \u00b7 Sicodelia \u00b7 toons</span></a>'+
          '<a class="pm-disc-card" href="/arcade/"><strong>Arcade</strong><span>20 protocolos \u00b7 pide un juego</span></a>'+
          '<a class="pm-disc-card" href="/lab/"><strong>Lab</strong><span>Prototipos \u00b7 motion \u00b7 sistemas</span></a>'+
          '<a class="pm-disc-card" href="/servicios/"><strong>Servicios</strong><span>Hub modular \u00b7 Growth \u00b7 Cotizador</span></a>'+
          '<a class="pm-disc-card" href="/academy/"><strong>Academy</strong><span>IA-01 \u00b7 5 escuelas</span></a>'+
          '<a class="pm-disc-card" href="/about/"><strong>About</strong><span>PM remoto \u00b7 BIM \u00b7 AI Ops</span></a>'+
        '</div>'+
      '</div>';
    var css = document.createElement('style');
    css.textContent =
      '#pm-discover{margin:28px auto;padding:0 16px;max-width:1100px}'+
      '#pm-discover .pm-disc-inner{padding:22px 18px;border-radius:20px;border:1px solid rgba(127,127,127,.18);background:rgba(127,127,127,.05)}'+
      '#pm-discover .pm-disc-kicker{margin:0;font:600 11px Inter,system-ui;letter-spacing:.14em;text-transform:uppercase;opacity:.55}'+
      '#pm-discover h2{margin:6px 0 14px;font:700 clamp(20px,3vw,28px)/1.15 Space Grotesk,system-ui}'+
      '#pm-discover .pm-disc-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}'+
      '#pm-discover .pm-disc-card{display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:16px;text-decoration:none;color:inherit;border:1px solid rgba(127,127,127,.16);background:rgba(255,255,255,.03);transition:transform .2s,border-color .2s}'+
      '#pm-discover .pm-disc-card:hover{transform:translateY(-2px);border-color:rgba(34,224,200,.45)}'+
      '#pm-discover .pm-disc-card strong{font:700 15px Space Grotesk,system-ui}'+
      '#pm-discover .pm-disc-card span{font:500 12px Inter,system-ui;opacity:.7}'+
      '#pm-discover .pm-nl{margin-top:16px;padding-top:14px;border-top:1px solid rgba(127,127,127,.15);display:flex;flex-wrap:wrap;gap:10px;align-items:center}'+
      '#pm-discover .pm-nl-k{margin:0;font:600 11px Inter,system-ui;letter-spacing:.12em;text-transform:uppercase;opacity:.55;width:100%}'+
      '#pm-discover .pm-nl-t{margin:0;font:500 13px Inter,system-ui;opacity:.8;flex:1;min-width:180px}'+
      '#pm-discover .pm-nl-btn{display:inline-flex;padding:8px 14px;border-radius:999px;background:#22E0C8;color:#081018;text-decoration:none;font:700 12px Inter,system-ui}'+
      '#pm-discover .pm-nl-note{margin:0;width:100%;font-size:11px;opacity:.45}';
    document.head.appendChild(css);
    var nl = document.createElement('div');
    nl.className = 'pm-nl';
    nl.innerHTML = '<p class="pm-nl-k">Newsletter</p><p class="pm-nl-t">Se\u00f1ales del ecosistema \u00b7 Editorial, Arcade, Lab, Servicios</p><a class="pm-nl-btn" href="mailto:hi@promii.co?subject=Newsletter%20Promii">Unirme \u00b7 hi@promii.co</a><p class="pm-nl-note">MailerLite embeds: ver docs/MAILERLITE.md</p>';
    rail.querySelector('.pm-disc-inner').appendChild(nl);

    var anchor = document.querySelector('#contacto, footer, .pm-foot, #servicios, .services');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(rail, anchor);
    else document.body.appendChild(rail);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  setTimeout(mount, 900);
})();
