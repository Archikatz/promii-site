/* Promii Arcade v3 - Shared Core Engine
 * HypnoSynth + PeakStore + Share + HiDPI helper
 */
(() => {
  const STORAGE_PEAKS = 'promii_arcade_peaks_v3';
  const STORAGE_BOARD = 'promii_arcade_board_v3';
  const STORAGE_SAVES = 'promii_arcade_saves_v3';
  const STORAGE_ALIAS = 'promii_curator_alias';

  function safeRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function safeWrite(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (_) {
      return false;
    }
  }

  window.PromiiToast = (msg) => {
    let el = document.getElementById('promii-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'promii-toast';
      el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 16px;border-radius:999px;background:rgba(8,8,12,.92);border:1px solid rgba(255,255,255,.18);color:#f4f4f8;font:600 12px Inter,system-ui;pointer-events:none;opacity:0;transition:opacity .25s';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 1800);
  };

  window.PeakStore = {
    getAll() { return safeRead(STORAGE_PEAKS, {}); },
    get(id) { return Number(this.getAll()[id] || 0); },
    set(id, score) {
      const all = this.getAll();
      const n = Number(score) || 0;
      if (n > (Number(all[id]) || 0)) {
        all[id] = n;
        safeWrite(STORAGE_PEAKS, all);
        try { window.parent && window.parent.postMessage({ type: 'promii-peak', id, score: n }, '*'); } catch (_) {}
        return true;
      }
      return false;
    },
    board(id, limit = 5) {
      const b = safeRead(STORAGE_BOARD, {});
      return (b[id] || []).slice(0, limit);
    },
    pushBoard(id, entry) {
      const b = safeRead(STORAGE_BOARD, {});
      const list = b[id] || [];
      list.push(entry);
      list.sort((a, c) => (c.score || 0) - (a.score || 0));
      b[id] = list.slice(0, 10);
      safeWrite(STORAGE_BOARD, b);
    }
  };

  window.SaveState = {
    get(id) { return safeRead(STORAGE_SAVES, {})[id] || null; },
    set(id, data) {
      const all = safeRead(STORAGE_SAVES, {});
      all[id] = data;
      safeWrite(STORAGE_SAVES, all);
    }
  };

  // HypnoSynth v3 — single AudioContext
  let ctx = null, master = null, muted = false, padNodes = [];
  const DORIAN = [293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33];

  function ensureAudio() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    return ctx;
  }

  function tone(freq, dur = 0.12, type = 'sine', gain = 0.2) {
    if (muted) return;
    const c = ensureAudio();
    if (!c || c.state === 'closed') return;
    if (c.state === 'suspended') c.resume();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g); g.connect(master);
    o.start();
    o.stop(c.currentTime + dur + 0.02);
  }

  window.HypnoSynth = {
    unlock() { const c = ensureAudio(); if (c && c.state === 'suspended') c.resume(); },
    mute(v) {
      muted = !!v;
      if (master) master.gain.value = muted ? 0 : 0.35;
    },
    isMuted() { return muted; },
    blip(i = 0) { tone(DORIAN[i % DORIAN.length], 0.1, 'triangle', 0.18); },
    success() { tone(523.25, 0.15, 'sine', 0.2); setTimeout(() => tone(659.25, 0.18, 'sine', 0.16), 80); },
    fail() { tone(110, 0.25, 'sawtooth', 0.12); },
    shatter() {
      if (muted) return;
      const c = ensureAudio();
      if (!c) return;
      if (c.state === 'suspended') c.resume();
      const len = c.sampleRate * 0.18;
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      const src = c.createBufferSource();
      const g = c.createGain();
      src.buffer = buf;
      g.gain.value = 0.22;
      src.connect(g); g.connect(master);
      src.start();
    },
    padStart() {
      if (muted) return;
      const c = ensureAudio();
      if (!c || padNodes.length) return;
      if (c.state === 'suspended') c.resume();
      [146.83, 220].forEach((f) => {
        const o = c.createOscillator();
        const g = c.createGain();
        const ftr = c.createBiquadFilter();
        o.type = 'sine'; o.frequency.value = f;
        ftr.type = 'lowpass'; ftr.frequency.value = 260;
        g.gain.value = 0.04;
        o.connect(ftr); ftr.connect(g); g.connect(master);
        o.start();
        padNodes.push({ o, g });
      });
    },
    padStop() {
      padNodes.forEach(({ o, g }) => {
        try { g.gain.exponentialRampToValueAtTime(0.001, (ctx || ensureAudio()).currentTime + 0.3); o.stop((ctx || ensureAudio()).currentTime + 0.35); } catch (_) {}
      });
      padNodes = [];
    }
  };

  window.PromiiShare = {
    challenge(protocol, score) {
      const url = `${location.origin}${location.pathname.replace(/\/games\/.*$/, '/games/')}?protocol=${protocol}&challenge=${score}`;
      const text = `Promii Arcade · Protocol ${protocol} · PEAK ${score}`;
      if (navigator.share) {
        navigator.share({ title: text, text, url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(`${text}\n${url}`).then(() => PromiiToast('Link copied'));
      }
    }
  };

  window.PromiiHiDPI = function (canvas, cssW, cssH) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, dpr, w: cssW, h: cssH };
  };

  // Auto-unlock audio on first gesture
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => {
    window.addEventListener(ev, () => { try { HypnoSynth.unlock(); } catch (_) {} }, { once: true, passive: true });
  });
})();
