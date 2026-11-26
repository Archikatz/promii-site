/* PROMII ECOSYSTEM CORE ENGINE v3.5 */
(() => {
  const STORAGE_LANG = 'promii_lang_v3';
  const STORAGE_CURR = 'promii_curr_v3';
  const GLOBAL_NODES = [
    { id: 'bogota', nameES: 'Bogot\u00e1 \u00b7 Studio HQ', nameEN: 'Bogot\u00e1 \u00b7 Studio HQ', tz: 'GMT-5', roleES: 'Direcci\u00f3n creativa, BIM/IA', roleEN: 'Creative direction, BIM/AI', x: 282, y: 248, hub: true, color: '#0F9D84' },
    { id: 'denver', nameES: 'Denver \u00b7 BAAC Remodeling', nameEN: 'Denver \u00b7 BAAC Remodeling', tz: 'GMT-7', roleES: 'Ejecuci\u00f3n residencial', roleEN: 'On-site residential', x: 195, y: 148, hub: true, color: '#E0533C' },
    { id: 'newyork', nameES: 'New York \u00b7 NYC DOB', nameEN: 'New York \u00b7 NYC DOB', tz: 'GMT-5', roleES: 'Documentaci\u00f3n AEC', roleEN: 'AEC documentation', x: 274, y: 140, hub: false, color: '#0F9D84' },
    { id: 'florida', nameES: 'Miami & Florida', nameEN: 'Miami & Florida', tz: 'GMT-5', roleES: 'FBC / B2B', roleEN: 'FBC / B2B', x: 262, y: 178, hub: false, color: '#2563EB' },
    { id: 'mexico', nameES: 'Ciudad de M\u00e9xico', nameEN: 'Mexico City', tz: 'GMT-6', roleES: 'Growth LATAM', roleEN: 'LATAM Growth', x: 214, y: 196, hub: false, color: '#C88A1E' },
    { id: 'madrid', nameES: 'Madrid', nameEN: 'Madrid', tz: 'GMT+1', roleES: 'Europa', roleEN: 'Europe', x: 472, y: 146, hub: false, color: '#0F9D84' },
    { id: 'london', nameES: 'Londres', nameEN: 'London', tz: 'GMT+0', roleES: 'Sistemas IA', roleEN: 'AI systems', x: 468, y: 118, hub: false, color: '#2563EB' }
  ];
  const state = { lang: localStorage.getItem(STORAGE_LANG) || 'es', curr: localStorage.getItem(STORAGE_CURR) || 'USD', fxCopPerUsd: 4200 };
  const listeners = new Set();
  function notify() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n-es]').forEach(el => {
      const txt = state.lang === 'es' ? el.getAttribute('data-i18n-es') : el.getAttribute('data-i18n-en');
      if (txt !== null) el.textContent = txt;
    });
    document.querySelectorAll('[data-usd]').forEach(el => {
      const usdVal = Number(el.getAttribute('data-usd') || 0);
      const copVal = el.getAttribute('data-cop') ? Number(el.getAttribute('data-cop')) : Math.round((usdVal * state.fxCopPerUsd) / 10000) * 10000;
      el.textContent = formatMoney(usdVal, copVal);
    });
    document.querySelectorAll('[data-lang-btn]').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === state.lang));
    document.querySelectorAll('[data-curr-btn]').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-curr-btn') === state.curr));
    listeners.forEach(fn => fn({ ...state }));
  }
  function formatMoney(usdAmount, explicitCopAmount) {
    if (state.curr === 'USD') return 'US$' + Number(usdAmount).toLocaleString('en-US', { maximumFractionDigits: 0 });
    const cop = explicitCopAmount !== undefined ? explicitCopAmount : Math.round((Number(usdAmount) * state.fxCopPerUsd) / 10000) * 10000;
    return '$' + Number(cop).toLocaleString('es-CO', { maximumFractionDigits: 0 }) + ' COP';
  }
  function setLang(lang) { state.lang = lang === 'en' ? 'en' : 'es'; localStorage.setItem(STORAGE_LANG, state.lang); notify(); }
  function setCurr(curr) { state.curr = curr === 'COP' ? 'COP' : 'USD'; localStorage.setItem(STORAGE_CURR, state.curr); notify(); }
  function makeTicket(prefix = 'PRM') {
    const now = new Date(); return prefix + '-' + now.getFullYear() + '-' + String(Math.floor(100 + Math.random() * 900));
  }
  function openWhatsApp(messageText, phone = '573160570258') {
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(messageText), '_blank', 'noopener');
  }
  function openMail(subject, bodyText, email = 'hi@promii.co') {
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
  }
  function mountFooter(container) {
    if (!container) return;
    container.innerHTML = '<footer class="prm-footer"><div><strong>PROMII / STUDIO BRIAN ZULETA</strong></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">' +
      '<a href="https://www.linkedin.com/in/bczuleta" target="_blank" rel="noopener">LinkedIn</a>' +
      '<a href="https://www.behance.net/brianzuleta" target="_blank" rel="noopener">Behance</a>' +
      '<a href="/servicios/">Servicios</a><a href="/arcade/">Arcade</a><a href="/academy/">Academy</a></div>' +
      '<div>hi@promii.co \u00b7 WhatsApp +57 316 057 0258</div>' +
      '<div>Bogot\u00e1 HQ & Denver Hub \u00b7 Zero-risk offer</div></footer>';
  }
  function mountDroplets() {
    if (document.getElementById('prmDropletsDock')) return;
    const dock = document.createElement('div');
    dock.id = 'prmDropletsDock'; dock.className = 'prm-droplets-dock';
    dock.innerHTML = '<div class="prm-droplet-group" id="prmDropNav">' +
      '<div class="prm-droplet-menu">' +
      '<a class="prm-subdroplet" href="/servicios/">Hub Servicios</a>' +
      '<a class="prm-subdroplet" href="/remodeling/">Remodeling</a>' +
      '<a class="prm-subdroplet" href="/servicios/growth.html">Growth</a>' +
      '<a class="prm-subdroplet" href="/cotizador/">Cotizador</a>' +
      '<a class="prm-subdroplet" href="/academy/">Academy</a>' +
      '<a class="prm-subdroplet" href="/arcade/">Arcade</a></div>' +
      '<button class="prm-droplet-trigger" type="button" aria-label="Nav">\u25c9</button></div>' +
      '<div class="prm-droplet-group" id="prmDropContact">' +
      '<div class="prm-droplet-menu">' +
      '<a class="prm-subdroplet" href="https://wa.me/573160570258" target="_blank" rel="noopener">WhatsApp</a>' +
      '<a class="prm-subdroplet" href="mailto:hi@promii.co">Email</a>' +
      '<a class="prm-subdroplet" href="https://www.linkedin.com/in/bczuleta" target="_blank" rel="noopener">LinkedIn</a></div>' +
      '<button class="prm-droplet-trigger" type="button" aria-label="Contact">\u25cf</button></div>';
    document.body.appendChild(dock);
    const groups = dock.querySelectorAll('.prm-droplet-group');
    groups.forEach(group => {
      group.querySelector('.prm-droplet-trigger').addEventListener('click', e => {
        e.stopPropagation();
        const willOpen = !group.classList.contains('open');
        groups.forEach(g => g.classList.remove('open'));
        if (willOpen) group.classList.add('open');
      });
    });
    document.addEventListener('click', e => { if (!dock.contains(e.target)) groups.forEach(g => g.classList.remove('open')); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') groups.forEach(g => g.classList.remove('open')); });
  }
  function initShell(options) {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-btn'))));
    document.querySelectorAll('[data-curr-btn]').forEach(btn => btn.addEventListener('click', () => setCurr(btn.getAttribute('data-curr-btn'))));
    mountFooter(document.querySelector('[data-promii-footer]'));
    mountDroplets();
    notify();
  }
  window.PromiiOS = { getState: () => ({ ...state }), setLang, setCurr, formatMoney, makeTicket, openWhatsApp, openMail, onChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }, initShell };
})();
