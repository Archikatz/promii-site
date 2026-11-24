/* Promii Arcade v3 Core — PeakStore + Synth (HypnoSynth) + Share + HiDPI */
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
      const list = Array.isArray(board[id]) ? board[id] : [];
      list.push({ alias: this.getAlias(), score: Math.floor(score), ts: new Date().toISOString().slice(0, 10) });
      list.sort((a, b) => b.score - a.score);
      board[id] = list.slice(0, 5);
      safeWrite(STORAGE_BOARD, board);
    },
    getTop(id) { const board = safeRead(STORAGE_BOARD, {}); return Array.isArray(board[id]) ? board[id] : []; },
    getAll() { return this.getAllPeaks(); },
    getAllPeaks() {
      const peaks = safeRead(STORAGE_PEAKS, {});
      const legacy = safeRead('promii_arcade_peaks', {});
      return { ...legacy, ...peaks };
    },
    saveState(id, stateObj) { const saves = safeRead(STORAGE_SAVES, {}); saves[id] = { data: stateObj, updatedAt: Date.now() }; safeWrite(STORAGE_SAVES, saves); },
    loadState(id) { const saves = safeRead(STORAGE_SAVES, {}); return saves[id] ? saves[id].data : null; },
    clearState(id) { const saves = safeRead(STORAGE_SAVES, {}); delete saves[id]; safeWrite(STORAGE_SAVES, saves); }
  };

  window.PromiiShare = {
    challenge(protocolId, protocolTitle, score, metricLabel = 'RESONANCE') {
      const peak = Math.max(Number(score) || 0, window.PeakStore.get(protocolId));
      const shareUrl = `https://promii.co/games/?protocol=${encodeURIComponent(protocolId)}&challenge=${peak}`;
      const text = `I reached ${peak} ${metricLabel} in ${protocolTitle} [Promii Arcade].`;
      if (navigator.share) { navigator.share({ title: protocolTitle, text, url: shareUrl }).catch(() => {}); return; }
      const full = `${text} ${shareUrl}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(() => PromiiToast('CHALLENGE LINK COPIED')).catch(() => prompt('Copy:', full));
      } else prompt('Copy:', full);
    }
  };

  window.Synth = (() => {
    let ctx = null, master = null, muted = false, noiseBuf = null;
    const scale = [293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33];
    function init() {
      if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
      return ctx;
    }
    function note(idx = 0, dur = 0.26, typeOrVol = 'sine', maybeVol = 0.13) {
      if (muted) return;
      const c = init(); if (!c) return;
      let type = 'sine', vol = 0.13;
      if (typeof typeOrVol === 'number') vol = typeOrVol; else { type = typeOrVol || 'sine'; vol = maybeVol; }
      const o = c.createOscillator(); const g = c.createGain();
      o.type = type; o.frequency.value = scale[((idx % scale.length) + scale.length) % scale.length];
      g.gain.value = vol; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g); g.connect(master); o.start(); o.stop(c.currentTime + dur + 0.03);
    }
    function chime(idx = 0, dur = 0.32, vol = 0.14) { note(idx, dur, 'triangle', vol); }
    function noise(dur = 0.2, vol = 0.15) {
      if (muted) return;
      const c = init(); if (!c) return;
      const len = Math.floor(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
      const src = c.createBufferSource(); const g = c.createGain();
      src.buffer = buf; g.gain.value = vol; src.connect(g); g.connect(master); src.start();
    }
    function shatter(dur = 0.25, vol = 0.18) { noise(dur, vol); }
    function fracture(vol = 0.14) { noise(0.18, vol); }
    function toggleMute(btn) {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.32;
      if (btn) btn.textContent = muted ? 'AUDIO: OFF' : 'AUDIO: ON';
      return muted;
    }
    return { init, note, chime, noise, shatter, fracture, toggleMute, unlock: init };
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

  window.drawGlowOrb = (ctx, x, y, radius, hexColor, glowAlpha = 0.26) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.2);
    g.addColorStop(0, hexColor); g.addColorStop(0.35, hexColor); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha = glowAlpha; ctx.fillStyle = g;
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
