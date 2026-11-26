/* Promii Arcade v3 Core - PeakStore + Synth (HypnoSynth) + Share + HiDPI */
(() => {
  const STORAGE_PEAKS = 'promii_arcade_peaks_v3';
  const STORAGE_BOARD = 'promii_arcade_board_v3';
  const STORAGE_SAVES = 'promii_arcade_saves_v3';
  const STORAGE_ALIAS = 'promii_curator_alias';

  function safeRead(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (_) { return fallback; }
  }
  function safeWrite(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (_) { return false; }
  }

  window.PromiiToast = (msg) => {
    let el = document.getElementById('promiiToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'promiiToast';
      el.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 16px;border-radius:999px;background:rgba(8,8,12,.92);border:1px solid rgba(255,255,255,.18);color:#f4f4f8;font:600 12px Inter,system-ui;opacity:0;transition:opacity .25s;pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = msg; el.style.opacity = '1';
    clearTimeout(el._t); el._t = setTimeout(() => { el.style.opacity = '0'; }, 2200);
  };

  window.PeakStore = {
    getAlias() { try { return localStorage.getItem(STORAGE_ALIAS) || 'CURATOR-01'; } catch (_) { return 'CURATOR-01'; } },
    setAlias(name) {
      const clean = String(name || 'CURATOR-01').trim().slice(0, 16).toUpperCase() || 'CURATOR-01';
      try { localStorage.setItem(STORAGE_ALIAS, clean); } catch (_) {}
      return clean;
    },
    getPeak(id) { return this.get(id); },
    get(id) {
      const peaks = safeRead(STORAGE_PEAKS, {});
      const legacy = safeRead('promii_arcade_peaks', {});
      return Math.max(Number(peaks[id] || 0), Number(legacy[id] || 0));
    },
    set(id, val) {
      const score = Math.floor(Number(val) || 0);
      if (score <= 0) return false;
      const peaks = safeRead(STORAGE_PEAKS, {});
      const prev = this.get(id);
      let isNew = false;
      if (score > prev) { peaks[id] = score; safeWrite(STORAGE_PEAKS, peaks); isNew = true; }
      this.recordRun(id, score);
      try { if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'PROMII_PEAK_UPDATE', id, score }, '*'); } catch (_) {}
      try { if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'promii-peak', id, score }, '*'); } catch (_) {}
      return isNew;
    },
    recordRun(id, score) {
      const board = safeRead(STORAGE_BOARD, {});
      if (!board[id]) board[id] = [];
      board[id].push({ score, alias: this.getAlias(), ts: Date.now() });
      board[id] = board[id].sort((a,b) => b.score - a.score).slice(0, 20);
      safeWrite(STORAGE_BOARD, board);
    },
    board(id) { return safeRead(STORAGE_BOARD, {})[id] || []; },
    allPeaks() { return safeRead(STORAGE_PEAKS, {}); }
  };

  window.Synth = (() => {
    let ctx = null, master = null, muted = false;
    function init() {
      if (ctx) return ctx;
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = 0.32;
        master.connect(ctx.destination);
      } catch (_) { ctx = null; }
      return ctx;
    }
    function note(freq, dur, type, vol) {
      if (muted) return;
      const c = init(); if (!c) return;
      try {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.connect(g); g.connect(master);
        const now = c.currentTime;
        const v = (vol == null ? 0.08 : vol);
        g.gain.exponentialRampToValueAtTime(v, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + (dur || 0.12));
        o.start(now); o.stop(now + (dur || 0.12) + 0.02);
      } catch (_) {}
    }
    function chime() { note(880, 0.12, 'triangle', 0.06); note(1320, 0.16, 'sine', 0.04); }
    function noise(dur, vol) {
      if (muted) return;
      const c = init(); if (!c) return;
      const len = Math.floor(c.sampleRate * (dur || 0.2));
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
      const src = c.createBufferSource(); const g = c.createGain();
      src.buffer = buf; g.gain.value = vol == null ? 0.15 : vol; src.connect(g); g.connect(master); src.start();
    }
    function shatter(dur, vol) { noise(dur || 0.25, vol == null ? 0.18 : vol); }
    function fracture(vol) { noise(0.18, vol == null ? 0.14 : vol); }
    function toggleMute(btn) {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.32;
      if (btn) btn.textContent = muted ? 'AUDIO: OFF' : 'AUDIO: ON';
      return muted;
    }
    function setVolume() {}
    return { init, note, chime, noise, shatter, fracture, toggleMute, setVolume, unlock: init, get muted() { return muted; } };
  })();
  window.HypnoSynth = window.Synth;

  window.setupRetinaCanvas = (canvas, ctx) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth; const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { dpr, w, h };
  };

  window.drawGlowOrb = (ctx, x, y, radius, hexColor, glowAlpha) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.2);
    g.addColorStop(0, hexColor); g.addColorStop(0.35, hexColor); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha = glowAlpha == null ? 0.26 : glowAlpha; ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = hexColor; ctx.fill();
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('.btn-back-hub');
    if (a && window.parent && window.parent !== window) {
      e.preventDefault();
      try { window.parent.postMessage({ type: 'PROMII_CLOSE_MODAL' }, '*'); } catch (_) {}
    }
  }, true);

  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => {
    window.addEventListener(ev, () => { try { Synth.init(); } catch (_) {} }, { once: true, passive: true });
  });
})();
;(function(){var s=document.createElement('script');s.src='/assets/game-pitch.js';s.defer=true;document.head.appendChild(s);})();
/* site-shell auto-inject removed: arcade keeps its own chrome */
