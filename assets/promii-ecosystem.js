/* PROMII ECOSYSTEM CORE ENGINE v3.5 */
(() => {
  const STORAGE_LANG = 'promii_lang_v3';
  const STORAGE_CURR = 'promii_curr_v3';
  const GLOBAL_NODES = [
    { id: 'bogota', nameES: 'Bogot\u00e1 \u00b7 Studio HQ', nameEN: 'Bogot\u00e1 \u00b7 Studio HQ', tz: 'GMT-5', roleES: 'Direcci\u00f3n creativa, BIM/IA', roleEN: 'Creative direction, BIM/AI', x: 282, y: 248, hub: true, color: '#0F9D84' },
    { id: 'denver', nameES: 'Denver / Americas', nameEN: 'Denver / Americas', tz: 'GMT-7', roleES: 'Ejecuci\u00f3n residencial', roleEN: 'On-site residential', x: 195, y: 148, hub: true, color: '#E0533C' },
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
  function ensureAsset(tag, attrs, id) {
    if (id && document.getElementById(id)) return;
    const el = document.createElement(tag);
    if (id) el.id = id;
    Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
    document.head.appendChild(el);
  }
  function killDualDock() {
    const dock = document.getElementById('prmDropletsDock');
    if (dock && dock.parentNode) dock.parentNode.removeChild(dock);
    document.querySelectorAll('.prm-droplets-dock').forEach((n) => n.remove());
  }
  function mountFooter(container) {
    if (container) container.innerHTML = '';
  }
  function mountDroplets() {
    killDualDock();
  }
  function ensureSiteChrome() {
    ensureAsset('link', { rel: 'stylesheet', href: '/assets/promii-palette-lock.css' }, 'promii-palette-lock');
    if (!document.getElementById('promii-site-shell')) {
      const s = document.createElement('script');
      s.id = 'promii-site-shell';
      s.src = '/assets/site-shell.js?v=chrome2';
      s.setAttribute('data-mode', 'full');
      document.head.appendChild(s);
    }
    if (!document.getElementById('promii-restore-chrome')) {
      const s = document.createElement('script');
      s.id = 'promii-restore-chrome';
      s.src = '/assets/promii-restore-chrome.js?v=1';
      document.head.appendChild(s);
    }
    if (!document.getElementById('home-ui-fix-js')) {
      const s = document.createElement('script');
      s.id = 'home-ui-fix-js';
      s.src = '/assets/home-ui-fix.js?v=chrome1';
      s.defer = true;
      document.head.appendChild(s);
    }
    if (!document.getElementById('home-ui-fix-css')) {
      const l = document.createElement('link');
      l.id = 'home-ui-fix-css';
      l.rel = 'stylesheet';
      l.href = '/assets/home-ui-fix.css?v=chrome1';
      document.head.appendChild(l);
    }
  }
  function initShell(options) {
    ensureSiteChrome();
    killDualDock();
    document.querySelectorAll('[data-lang-btn]').forEach(btn => btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-btn'))));
    document.querySelectorAll('[data-curr-btn]').forEach(btn => btn.addEventListener('click', () => setCurr(btn.getAttribute('data-curr-btn'))));
    mountFooter(document.querySelector('[data-promii-footer]'));
    mountDroplets();
    notify();
    setTimeout(killDualDock, 200);
    setTimeout(killDualDock, 1000);
  }
  window.PromiiOS = { getState: () => ({ ...state }), setLang, setCurr, formatMoney, makeTicket, openWhatsApp, openMail, onChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }, initShell };
})();
