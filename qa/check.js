/* Promii · verificador de calidad. Correr antes de cada publicación:
     python3 -m http.server 8765 &   (desde la raíz del repo)
     node qa/check.js                (o: node qa/check.js http://localhost:8765)
   Revisa cada página de sitemap.xml + las privadas/demos, en celular (iPhone) y computador:
     errores de JavaScript, recursos rotos (404), desbordamiento horizontal, encabezado/navegación y pie,
     título y descripción, imágenes sin texto alternativo, enlaces internos rotos, peso de la página y
     fluidez (cuadros por segundo al hacer scroll con el procesador 4× más lento).
   Escribe qa/REPORTE.md y termina con código 1 si algo falla. Estándares en docs/CALIDAD.md. */
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8765';
const ROOT = path.join(__dirname, '..');

// Presupuestos (ver docs/CALIDAD.md)
const BUDGET = { fps: 50, worstFrame: 120, weightKB: 1600, overflowPx: 1 };

const fromSitemap = [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/promii\.co([^<]*)<\/loc>/g)]
  .map(m => m[1] || '/').filter(u => !u.includes('?') && !u.includes('#'));
const extra = ['/lab/', '/admin/', '/lab/inventario.html', ...fs.readdirSync(path.join(ROOT, 'lab/demos')).filter(f => f.endsWith('.html') && !f.startsWith('14')).map(f => '/lab/demos/' + f), '/bitacora/?p=como-construi-promii'];
const PAGES = [...new Set([...fromSitemap, ...extra])];
// Páginas con un diseño propio sin la barra común (se revisa que tengan su propia navegación)
const OWN_SHELL = { '/': 'nav', '/admin/': null, '/lab/demos/': '.pm-mini' };
const shellFor = u => Object.keys(OWN_SHELL).filter(k => k !== '/' ? u.startsWith(k) : u === '/').map(k => OWN_SHELL[k])[0];

(async () => {
  const browser = await chromium.launch();
  const rows = [], links = new Set();
  for (const [dev, ctxOpt] of [['celular', { ...devices['iPhone 15 Pro'], deviceScaleFactor: 1 }], ['computador', { viewport: { width: 1366, height: 860 } }]]) {
    const ctx = await browser.newContext(ctxOpt);
    for (const u of PAGES) {
      const p = await ctx.newPage(), errs = [], broken = []; let bytes = 0;
      p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
      p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR|ERR_TUNNEL|ERR_CERT|status of 40[13]/.test(m.text())) errs.push(m.text().slice(0, 120)); });
      p.on('response', async r => { const url = r.url(); if (url.startsWith(BASE)) { if (r.status() >= 400) broken.push(r.status() + ' ' + url.replace(BASE, '')); try { const b = await r.body(); bytes += b.length; } catch (e) {} } });
      const fails = [], notes = [];
      try { await p.goto(BASE + u, { waitUntil: 'load', timeout: 20000 }); } catch (e) { fails.push('no carga'); }
      await p.waitForTimeout(900);
      const info = await p.evaluate(sel => {
        const d = document.documentElement;
        const nav = sel === undefined ? document.querySelector('.pm-nav') : sel ? document.querySelector(sel) : true;
        const foot = sel === undefined ? document.querySelector('.pm-foot') : true;
        return {
          overflow: d.scrollWidth - innerWidth, title: document.title, desc: (document.querySelector('meta[name=description]') || {}).content || '',
          nav: !!nav, foot: !!foot, noAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
          links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !/^(https?:|mailto:|tel:|#|javascript:)/.test(h)).map(h => new URL(h, location.href).pathname),
          h: d.scrollHeight
        };
      }, shellFor(u)).catch(() => null);
      if (info) {
        info.links.forEach(l => links.add(l));
        if (info.overflow > BUDGET.overflowPx) fails.push('desborda ' + info.overflow + 'px a lo ancho');
        if (!info.title) fails.push('sin título');
        if (!info.desc && !u.startsWith('/lab/demos/') && u !== '/admin/') fails.push('sin descripción');
        if (!info.nav) fails.push('sin encabezado/navegación');
        if (!info.foot) fails.push('sin pie de página');
        if (info.noAlt) fails.push(info.noAlt + ' imágenes sin alt');
      }
      if (errs.length) fails.push('errores JS: ' + errs.slice(0, 2).join(' | '));
      if (broken.length) fails.push('recursos rotos: ' + broken.slice(0, 3).join(', '));
      const kb = Math.round(bytes / 1024); if (kb > BUDGET.weightKB) fails.push('pesa ' + kb + ' KB');
      // fluidez: solo en celular, recorriendo la página con el procesador 4× más lento
      let fps = '';
      if (dev === 'celular' && info && !u.startsWith('/lab/demos/') && u !== '/admin/') {
        const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        const r = await p.evaluate(async () => {
          let f = 0, worst = 0, last = performance.now(), go = true;
          const tick = t => { f++; worst = Math.max(worst, t - last); last = t; if (go) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
          const H = document.documentElement.scrollHeight - innerHeight, t0 = performance.now();
          if (H > 50) for (let y = 0; y < H; y += 60) { scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); }
          else await new Promise(r => setTimeout(r, 2000));
          go = false; return { fps: f / ((performance.now() - t0) / 1000), worst };
        });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
        fps = r.fps.toFixed(0);
        if (r.fps < BUDGET.fps) fails.push('fluidez ' + fps + ' fps (mín. ' + BUDGET.fps + ')');
        if (r.worst > BUDGET.worstFrame) notes.push('cuadro más lento ' + Math.round(r.worst) + ' ms');
      }
      rows.push({ u, dev, ok: !fails.length, fails, notes, kb, fps });
      process.stdout.write((fails.length ? '✗ ' : '✓ ') + dev.padEnd(11) + u + (fails.length ? '  → ' + fails.join('; ') : '') + '\n');
      await p.close();
    }
    await ctx.close();
  }
  // enlaces internos
  const ctx = await browser.newContext(), p = await ctx.newPage(), dead = [];
  for (const l of links) { const r = await p.request.get(BASE + l).catch(() => null); if (!r || r.status() >= 400) dead.push(l); }
  await browser.close();
  const bad = rows.filter(r => !r.ok);
  const md = ['# Reporte de calidad', '', 'Generado: ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' · base ' + BASE, '',
    `**${rows.length - bad.length}/${rows.length} revisiones OK** · enlaces internos rotos: ${dead.length}`, '',
    '| Estado | Dispositivo | Página | Peso | FPS (4× lento) | Problemas |', '| --- | --- | --- | --- | --- | --- |',
    ...rows.map(r => `| ${r.ok ? '✓' : '✗'} | ${r.dev} | \`${r.u}\` | ${r.kb} KB | ${r.fps} | ${[...r.fails, ...r.notes].join('; ')} |`),
    '', dead.length ? '## Enlaces internos rotos\n\n' + dead.map(d => '- `' + d + '`').join('\n') : ''].join('\n');
  fs.writeFileSync(path.join(__dirname, 'REPORTE.md'), md + '\n');
  console.log(`\n${rows.length - bad.length}/${rows.length} OK · enlaces rotos: ${dead.length} → qa/REPORTE.md`);
  process.exit(bad.length || dead.length ? 1 : 0);
})();
