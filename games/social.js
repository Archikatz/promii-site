/* Promii Games · progreso, ranking en línea y retos.
   - Progreso local (localStorage "pg-stats-<juego>"): récord, partidas y último puntaje.
   - Ranking: tabla Supabase public.game_scores (cualquiera agrega y lee; puntaje 1–500, nombre ≤ 20).
   - Retos: enlace ?reto=<puntaje>&de=<nombre> que se comparte con el menú del teléfono o se copia. */
(function () {
  var C = window.PROMII_ANALYTICS || {}, EN = function () { return document.documentElement.lang === 'en'; };
  function t(es, en) { return EN() ? en : es; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  var PG = window.PG = {};
  PG.stats = function (g) { try { return JSON.parse(localStorage.getItem('pg-stats-' + g)) || { best: +localStorage.getItem('pg-best-' + g) || 0, plays: 0, last: 0 }; } catch (e) { return { best: 0, plays: 0, last: 0 }; } };
  PG.record = function (g, score) {
    var s = PG.stats(g); s.plays++; s.last = score; var nb = score > s.best; if (nb) s.best = score;
    try { localStorage.setItem('pg-stats-' + g, JSON.stringify(s)); localStorage.setItem('pg-best-' + g, s.best); } catch (e) {}
    return { stats: s, newBest: nb };
  };
  PG.name = function (v) { try { if (v != null) localStorage.setItem('pg-name', v); return localStorage.getItem('pg-name') || ''; } catch (e) { return v || ''; } };
  PG.challenge = function () { var q = new URLSearchParams(location.search), r = +q.get('reto'); return r > 0 ? { score: r, from: (q.get('de') || '').slice(0, 20) } : null; };
  function api(path, opt) {
    if (!C.url || !C.key) return Promise.reject();
    opt = opt || {}; opt.headers = Object.assign({ apikey: C.key, Authorization: 'Bearer ' + C.key, 'Content-Type': 'application/json' }, opt.headers || {});
    return fetch(C.url + '/rest/v1/' + path, opt).then(function (r) { if (!r.ok) throw r; return r.status === 201 || r.status === 204 ? null : r.json(); });
  }
  PG.top = function (g) { return api('game_scores?select=name,score,created_at&game=eq.' + g + '&order=score.desc,created_at.asc&limit=10'); };
  PG.submit = function (g, name, score) { return api('game_scores', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ game: g, name: name.trim().slice(0, 20), score: Math.max(1, Math.min(100000, Math.round(score))) }) }); };
  PG.invite = function (g, score, title) {
    var name = PG.name(), url = location.origin + location.pathname + '?reto=' + score + (name ? '&de=' + encodeURIComponent(name) : '');
    var text = t('Te reto en ' + title + ': supera ' + score + '.', 'I challenge you at ' + title + ': beat ' + score + '.');
    if (navigator.share) return navigator.share({ title: title + ' · Promii Games', text: text, url: url }).catch(function () {});
    var done = function () { PG.toast(t('Enlace copiado. Pégalo donde quieras.', 'Link copied. Paste it anywhere.')); };
    if (navigator.clipboard) navigator.clipboard.writeText(text + ' ' + url).then(done, function () { prompt('', url); });
    else prompt('', url);
  };
  /* Publicar el puntaje en redes: cada red abre su ventana de compartir con el texto y el enlace del reto */
  var SN = { x: 'X', linkedin: 'LinkedIn', facebook: 'Facebook', whatsapp: 'WhatsApp', more: 'Instagram, TikTok…' };
  var SI = {
    x: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 1.2.2.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>'
  };
  PG.post = function (net, g, score, title) {
    var name = PG.name(), url = location.origin + location.pathname + '?reto=' + score + (name ? '&de=' + encodeURIComponent(name) : '');
    var text = t('Hice ' + score + ' en ' + title + ' (Promii Games). ¿Me superas?', 'I scored ' + score + ' at ' + title + ' (Promii Games). Can you beat me?');
    var u = encodeURIComponent(url), tx = encodeURIComponent(text), w = null;
    if (net === 'x') w = 'https://twitter.com/intent/tweet?text=' + tx + '&url=' + u;
    else if (net === 'linkedin') w = 'https://www.linkedin.com/sharing/share-offsite/?url=' + u;
    else if (net === 'facebook') w = 'https://www.facebook.com/sharer/sharer.php?u=' + u;
    else if (net === 'whatsapp') w = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url);
    if (w) { window.open(w, '_blank', 'noopener,width=620,height=560'); return; }
    if (navigator.share) navigator.share({ title: title + ' · Promii Games', text: text, url: url }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text + ' ' + url).then(function () { PG.toast(t('Texto copiado: pégalo en Instagram o TikTok.', 'Text copied: paste it on Instagram or TikTok.')); });
  };

  /* Tutorial corto: se muestra la primera vez y con el botón "?" */
  PG.tutorial = function (g, steps, force) {
    var key = 'pg-tut-' + g, seen = false; try { seen = localStorage.getItem(key) === '1'; } catch (e) {}
    if (seen && !force) return;
    var stage = document.getElementById('stage'), i = 0, el = document.createElement('div'); el.className = 'pg-tut';
    function draw() {
      var st = steps[i];
      el.innerHTML = '<div class="pg-tut-card"><div class="pg-tut-ic">' + st.ic + '</div><small>' + t('Cómo se juega', 'How to play') + ' · ' + (i + 1) + '/' + steps.length + '</small><p>' + (EN() ? st.en : st.es) + '</p>' +
        '<div class="pg-dots">' + steps.map(function (_, k) { return '<i' + (k === i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
        '<div class="pg-row">' + (i > 0 ? '<button class="pg-btn ghost" data-t="prev">' + t('Atrás', 'Back') + '</button>' : '') + '<button class="pg-btn" data-t="next">' + (i < steps.length - 1 ? t('Siguiente', 'Next') : t('¡A jugar!', 'Let\'s play!')) + '</button></div></div>';
    }
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    el.addEventListener('click', function (e) {
      e.stopPropagation(); var b = e.target.closest('[data-t]'); if (!b) return;
      if (b.getAttribute('data-t') === 'prev') i--; else if (i < steps.length - 1) i++; else { el.remove(); try { localStorage.setItem(key, '1'); } catch (x) {} return; }
      draw();
    });
    draw(); stage.appendChild(el);
  };
  PG.helpButton = function (g, steps) {
    var b = document.createElement('button'); b.className = 'pg-help'; b.type = 'button'; b.textContent = '?'; b.title = t('Cómo se juega', 'How to play');
    b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    b.onclick = function (e) { e.stopPropagation(); PG.tutorial(g, steps, true); };
    document.getElementById('stage').appendChild(b);
    PG.tutorial(g, steps);
  };

  /* Fin de partida estándar: título, línea, estadísticas, reto y bloque social */
  PG.gameOver = function (o) {
    var E = EN(), R = PG.record(o.game, o.score), ot = document.getElementById('ot'), op = document.getElementById('op'), go = document.getElementById('go'), ps = document.getElementById('pst');
    [ot, op, go].forEach(function (n) { n.removeAttribute('data-en'); n.removeAttribute('data-es'); });
    ot.textContent = (E ? o.head.en : o.head.es);
    op.textContent = R.newBest && o.score > 0 ? t('¡Nuevo récord! ', 'New record! ') + (E ? o.line.en : o.line.es) : (E ? o.line.en : o.line.es);
    go.textContent = t('Otra vez', 'Again');
    ps.textContent = t('Partidas: ', 'Games played: ') + R.stats.plays + t(' · Récord: ', ' · Best: ') + R.stats.best;
    var c = PG.challenge(); if (c) { var ch = document.getElementById('chal'); ch.hidden = false; ch.textContent = o.score > c.score ? t('¡Superaste el reto! ✓', 'You beat the challenge! ✓') : t('Reto: supera ', 'Challenge: beat ') + c.score; }
    if (o.score > 0) PG.renderOver(document.getElementById('soc'), o.game, o.score, E ? o.title.en : o.title.es); else document.getElementById('soc').innerHTML = '';
    try { window.promiiEvent && promiiEvent('game', { label: o.game, value: o.score }); } catch (e) {}
    document.getElementById('over').classList.remove('hide');
    return R;
  };
  PG.intro = function (g) {
    var E = EN(), c = PG.challenge(), s = PG.stats(g), el = document.getElementById('chal'), ps = document.getElementById('pst');
    if (c) { el.hidden = false; el.textContent = (c.from || t('Alguien', 'Someone')) + t(' te reta: supera ', ' challenges you: beat ') + c.score; }
    if (s.plays) ps.textContent = t('Partidas: ', 'Games played: ') + s.plays + t(' · Récord: ', ' · Best: ') + s.best;
  };
  PG.toast = function (m) { var d = document.createElement('div'); d.className = 'pg-toast'; d.textContent = m; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600); };

  /* Bloque social dentro de la pantalla final: nombre, guardar en ranking, retar, top 10 */
  PG.renderOver = function (box, g, score, title) {
    var sent = false;
    box.innerHTML = '<div class="pg-row"><input class="pg-name" maxlength="20" placeholder="' + t('Tu nombre', 'Your name') + '" value="' + esc(PG.name()) + '">' +
      '<button class="pg-btn" data-a="save">' + t('Guardar en el ranking', 'Save to leaderboard') + '</button></div>' +
      '<div class="pg-row"><button class="pg-btn ghost" data-a="invite">' + t('Retar a alguien ↗', 'Challenge someone ↗') + '</button></div>' +
      '<div class="pg-share" aria-label="' + t('Publicar mi puntaje', 'Post my score') + '"><span>' + t('Publicar en', 'Post on') + '</span>' +
        ['x', 'linkedin', 'facebook', 'whatsapp', 'more'].map(function (k) { return '<button data-s="' + k + '" title="' + SN[k] + '">' + SI[k] + '</button>'; }).join('') + '</div>' +
      '<div class="pg-board" aria-live="polite"><b>' + t('Top 10', 'Top 10') + '</b><ol><li class="pg-dim">' + t('Cargando…', 'Loading…') + '</li></ol></div>';
    var inp = box.querySelector('.pg-name');
    box.querySelector('[data-a=save]').onclick = function (e) {
      e.stopPropagation(); var n = inp.value.trim();
      if (!n) { inp.focus(); return; } if (sent || score < 1) return;
      PG.name(n); sent = true; this.textContent = t('Guardando…', 'Saving…');
      var b = this;
      PG.submit(g, n, score).then(function () { b.textContent = t('Guardado ✓', 'Saved ✓'); load(); }, function () { sent = false; b.textContent = t('No se pudo guardar', 'Could not save'); });
    };
    box.querySelector('[data-a=invite]').onclick = function (e) { e.stopPropagation(); PG.invite(g, score, title); };
    box.querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); PG.post(b.getAttribute('data-s'), g, score, title); }; });
    box.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    function load() {
      PG.top(g).then(function (rows) {
        var me = PG.name();
        box.querySelector('ol').innerHTML = rows && rows.length ? rows.map(function (r) { return '<li' + (r.name === me ? ' class="me"' : '') + '><span>' + esc(r.name) + '</span><b>' + r.score + '</b></li>'; }).join('') : '<li class="pg-dim">' + t('Sé el primero.', 'Be the first.') + '</li>';
      }, function () { box.querySelector('ol').innerHTML = '<li class="pg-dim">' + t('Ranking no disponible.', 'Leaderboard unavailable.') + '</li>'; });
    }
    load();
  };
  var css = '.pg-row{display:flex;gap:6px;justify-content:center;margin-top:10px;flex-wrap:wrap}' +
    '.pg-name{font:500 14px Inter,system-ui,sans-serif;color:#f4f4f8;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:9px 14px;width:150px}' +
    '.pg-btn{font:600 13px Inter,system-ui,sans-serif;border:0;border-radius:999px;padding:10px 14px;background:#22e0c8;color:#06060a;cursor:pointer}.pg-btn.ghost{background:rgba(255,255,255,.1);color:#f4f4f8;border:1px solid rgba(255,255,255,.18)}' +
    '.pg-board{margin:14px auto 0;max-width:260px;text-align:left;font:13px Inter,system-ui,sans-serif;color:#c9c9d3}.pg-board b{font-family:"Space Grotesk",sans-serif}' +
    '.pg-board ol{margin:6px 0 0;padding-left:20px;max-height:150px;overflow:auto}.pg-board li{display:flex;justify-content:space-between;gap:10px;padding:2px 0}.pg-board li.me{color:#22e0c8}.pg-dim{color:#8a8c9e;list-style:none;margin-left:-20px}' +
    '.pg-chal{display:inline-block;margin:0 0 12px;padding:6px 12px;border-radius:999px;background:rgba(255,59,48,.15);border:1px solid rgba(255,59,48,.4);color:#ffb3ad;font:600 12.5px Inter,system-ui,sans-serif}' +
    '.pg-stats{font:500 12.5px Inter,system-ui,sans-serif;color:#8a8c9e;margin:10px 0 0}' +
    '.pg-toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));translate:-50% 0;z-index:99;padding:10px 16px;border-radius:999px;background:#f4f4f8;color:#08080c;font:600 13px Inter,system-ui,sans-serif;box-shadow:0 12px 30px -10px rgba(0,0,0,.6)}';
  css += '.pg-share{display:flex;gap:6px;justify-content:center;align-items:center;margin-top:12px;flex-wrap:wrap;font:600 12px Inter,system-ui,sans-serif;color:#8a8c9e}' +
    '.pg-share button{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#f4f4f8;display:grid;place-items:center;cursor:pointer;padding:0}.pg-share button:hover{background:rgba(255,255,255,.16)}.pg-share svg{width:16px;height:16px}' +
    '.pg-tut{position:absolute;inset:0;z-index:30;display:grid;place-items:center;padding:20px;background:rgba(6,6,10,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
    '.pg-tut-card{max-width:320px;text-align:center;padding:22px 20px;border-radius:24px;background:linear-gradient(150deg,rgba(255,255,255,.1),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.16);color:#f4f4f8;box-shadow:0 24px 50px -20px rgba(0,0,0,.7)}' +
    '.pg-tut-card small{display:block;font:600 10.5px Inter,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8a8c9e;margin:10px 0 6px}.pg-tut-card p{margin:0;font:500 15px/1.5 Inter,system-ui,sans-serif}' +
    '.pg-tut-ic{display:grid;place-items:center;margin:0 auto;width:120px;height:90px}.pg-tut-ic svg{width:120px;height:90px}' +
    '.pg-dots{display:flex;gap:6px;justify-content:center;margin-top:12px}.pg-dots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25)}.pg-dots i.on{background:#22e0c8;width:16px;border-radius:3px}' +
    '.pg-help{position:absolute;right:12px;bottom:12px;z-index:25;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(10,10,14,.6);color:#f4f4f8;font:700 15px Inter,system-ui,sans-serif;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
