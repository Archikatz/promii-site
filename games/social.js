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
  PG.submit = function (g, name, score) { return api('game_scores', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ game: g, name: name.trim().slice(0, 20), score: Math.max(1, Math.min(500, Math.round(score))) }) }); };
  PG.invite = function (g, score, title) {
    var name = PG.name(), url = location.origin + location.pathname + '?reto=' + score + (name ? '&de=' + encodeURIComponent(name) : '');
    var text = t('Te reto en ' + title + ': supera ' + score + '.', 'I challenge you at ' + title + ': beat ' + score + '.');
    if (navigator.share) return navigator.share({ title: title + ' · Promii Games', text: text, url: url }).catch(function () {});
    var done = function () { PG.toast(t('Enlace copiado. Pégalo donde quieras.', 'Link copied. Paste it anywhere.')); };
    if (navigator.clipboard) navigator.clipboard.writeText(text + ' ' + url).then(done, function () { prompt('', url); });
    else prompt('', url);
  };
  PG.toast = function (m) { var d = document.createElement('div'); d.className = 'pg-toast'; d.textContent = m; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600); };

  /* Bloque social dentro de la pantalla final: nombre, guardar en ranking, retar, top 10 */
  PG.renderOver = function (box, g, score, title) {
    var sent = false;
    box.innerHTML = '<div class="pg-row"><input class="pg-name" maxlength="20" placeholder="' + t('Tu nombre', 'Your name') + '" value="' + esc(PG.name()) + '">' +
      '<button class="pg-btn" data-a="save">' + t('Guardar en el ranking', 'Save to leaderboard') + '</button></div>' +
      '<div class="pg-row"><button class="pg-btn ghost" data-a="invite">' + t('Retar a alguien ↗', 'Challenge someone ↗') + '</button></div>' +
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
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
