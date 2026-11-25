/* Promii Arcade v3 Core — PeakStore + Synth (HypnoSynth) + Share + HiDPI + pitch loader */
(() => {
  const STORAGE_PEAKS = 'promii_arcade_peaks_v3';
  const STORAGE_BOARD = 'promii_arcade_board_v3';
  const STORAGE_SAVES = 'promii_arcade_saves_v3';

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  const PeakStore = {
    get(id) {
      const all = readJSON(STORAGE_PEAKS, {});
      return Number(all[id] || 0);
    },
    set(id, score) {
      const all = readJSON(STORAGE_PEAKS, {});
      const next = Math.max(Number(all[id] || 0), Number(score) || 0);
      all[id] = next;
      writeJSON(STORAGE_PEAKS, all);
      return next;
    },
    all() { return readJSON(STORAGE_PEAKS, {}); },
    getAlias() {
      try { return localStorage.getItem('promii_curator_alias') || ''; } catch (_) { return ''; }
    },
    setAlias(v) {
      const clean = String(v || '').trim().slice(0, 16);
      try { localStorage.setItem('promii_curator_alias', clean); } catch (_) {}
      return clean;
    }
  };

  const Synth = (() => {
    let ctx = null;
    let muted = false;
    let volume = 0.85;
    function init() {
      if (ctx) return ctx;
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) { ctx = null; }
      return ctx;
    }
    function setVolume(v) { volume = Math.max(0, Math.min(1, Number(v) || 0)); }
    function toggleMute(btn) {
      muted = !muted;
      if (btn) btn.textContent = muted ? 'AUDIO: OFF' : 'AUDIO: ON';
      return muted;
    }
    function beep(freq, dur, type) {
      if (muted) return;
      const c = init(); if (!c) return;
      try {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.connect(g); g.connect(c.destination);
        const now = c.currentTime;
        g.gain.exponentialRampToValueAtTime(0.03 * volume, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + (dur || 0.12));
        o.start(now); o.stop(now + (dur || 0.12) + 0.02);
      } catch (_) {}
    }
    return { init, setVolume, toggleMute, beep, get muted() { return muted; } };
  })();

  function PromiiToast(msg) {
    let el = document.getElementById('promii-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'promii-toast';
      el.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 14px;border-radius:999px;background:rgba(8,8,12,.9);border:1px solid rgba(34,224,200,.35);color:#e8e8f0;font:600 12px Inter,system-ui;opacity:0;transition:opacity .2s;pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(PromiiToast._t);
    PromiiToast._t = setTimeout(() => { el.style.opacity = '0'; }, 1600);
  }

  window.PeakStore = PeakStore;
  window.Synth = Synth;
  window.PromiiToast = PromiiToast;

  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => {
    window.addEventListener(ev, () => { try { Synth.init(); } catch (_) {} }, { once: true, passive: true });
  });
})();
;(function(){var s=document.createElement('script');s.src='/assets/game-pitch.js';s.defer=true;document.head.appendChild(s);})();
