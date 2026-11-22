/* ArchiKatz · motor de escenas SVG (sin imágenes externas).
   Estilos: cyber-neón, liquid glass, tinta china, fractal Fibonacci, manhua-line. */
window.AK_SCENE = function (kind, accent, seed) {
  var a = accent || '#d4af37';
  var s = (seed || 1) * 9973 % 233280;
  function r() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
  var id = 's' + (seed || 0) + kind;
  var bg =
    '<defs>' +
    '<linearGradient id="g' + id + '" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#12121a"/><stop offset="1" stop-color="#050508"/>' +
    '</linearGradient>' +
    '<radialGradient id="h' + id + '" cx=".5" cy=".3" r=".7">' +
    '<stop offset="0" stop-color="' + a + '" stop-opacity=".32"/>' +
    '<stop offset="1" stop-color="' + a + '" stop-opacity="0"/>' +
    '</radialGradient>' +
    '<filter id="blur' + id + '"><feGaussianBlur stdDeviation="6"/></filter>' +
    '<filter id="ink' + id + '"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/></filter>' +
    '</defs>' +
    '<rect width="400" height="520" fill="url(#g' + id + ')"/>' +
    '<rect width="400" height="520" fill="url(#h' + id + ')"/>';

  var g = '';

  function tower(x, w, h, lit) {
    var y = 520 - h, o = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" fill="#0c0c14" stroke="' + (lit ? a : 'rgba(255,255,255,.16)') + '" stroke-width="1.1"/>';
    for (var yy = y + 10; yy < 510; yy += 15)
      for (var xx = x + 5; xx < x + w - 5; xx += 11)
        if (r() < .3) o += '<rect x="' + xx + '" y="' + yy + '" width="4" height="6" fill="' +
          (r() < .5 ? a : '#efe9dc') + '" opacity="' + (.2 + r() * .55) + '"/>';
    return o;
  }

  function inkStroke(x1, y1, x2, y2, w) {
    var mx = (x1 + x2) / 2 + (r() - .5) * 40, my = (y1 + y2) / 2 + (r() - .5) * 30;
    return '<path d="M' + x1 + ' ' + y1 + 'Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 +
      '" fill="none" stroke="' + a + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + (.35 + r() * .5) +
      '" filter="url(#ink' + id + ')"/>';
  }

  function glassBlob(cx, cy, rx, ry) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
      '" fill="' + a + '" opacity=".12" filter="url(#blur' + id + ')"/>' +
      '<ellipse cx="' + (cx - rx * .25) + '" cy="' + (cy - ry * .3) + '" rx="' + (rx * .35) + '" ry="' + (ry * .25) +
      '" fill="#fff" opacity=".18"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
      '" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/>';
  }

  function fractalBranch(x, y, ang, len, depth) {
    if (depth <= 0 || len < 4) return '';
    var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    var o = '<path d="M' + x + ' ' + y + 'L' + x2 + ' ' + y2 + '" stroke="' + a +
      '" stroke-width="' + Math.max(.4, depth * .45) + '" opacity="' + (.25 + depth * .08) + '" fill="none"/>';
    var spread = 0.45 + r() * 0.25;
    o += fractalBranch(x2, y2, ang - spread, len * 0.68, depth - 1);
    o += fractalBranch(x2, y2, ang + spread, len * 0.68, depth - 1);
    if (r() < .35) o += fractalBranch(x2, y2, ang, len * 0.55, depth - 1);
    return o;
  }

  function fibDots() {
    var fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55], o = '';
    for (var i = 0; i < fib.length; i++) {
      var ang = i * 2.399963, rad = 12 + fib[i] * 3.2;
      var x = 200 + Math.cos(ang) * rad, y = 260 + Math.sin(ang) * rad;
      o += '<circle cx="' + x + '" cy="' + y + '" r="' + (1.2 + i * .35) + '" fill="' + a + '" opacity="' + (.3 + i * .05) + '"/>';
    }
    return o;
  }

  if (kind === 'blueprint') {
    for (var i = 0; i < 400; i += 25) g += '<path d="M' + i + ' 0V520" stroke="rgba(79,155,255,.1)"/>';
    for (var j = 0; j < 520; j += 25) g += '<path d="M0 ' + j + 'H400" stroke="rgba(79,155,255,.1)"/>';
    g += '<g stroke="#f2efe6" stroke-width="1.3" fill="none"><rect x="70" y="160" width="90" height="300"/><rect x="180" y="100" width="70" height="360"/><rect x="270" y="220" width="70" height="240"/><path d="M70 470h270"/></g>';
    g += '<path d="M180 100h70" stroke="' + a + '" stroke-width="3"/>';
    g += glassBlob(200, 90, 40, 18);
  } else if (kind === 'city' || kind === 'figure' || kind === 'end') {
    var x = -10; while (x < 400) { var w = 28 + r() * 52; g += tower(x, w, 110 + r() * 270, r() < .22); x += w + 4; }
    g += '<rect x="150" y="80" width="100" height="440" fill="#0c0c14" stroke="' + a + '" stroke-width="1.5"/>';
    for (var k = 0; k < 6; k++) g += '<path d="M150 ' + (80 + k * 14) + 'h100" stroke="' + a + '" opacity="' + (.85 - k * .12) + '"/>';
    for (var d = 0; d < 50; d++) g += '<path d="M' + (r() * 400) + ' ' + (r() * 520) + 'l-2 10" stroke="rgba(255,255,255,.15)"/>';
    if (kind === 'figure') {
      g += '<g fill="#050508" stroke="' + a + '" stroke-width="1.2"><path d="M200 330c-14 0-22 12-22 26v70h44v-70c0-14-8-26-22-26z"/><circle cx="200" cy="312" r="16"/></g>';
      g += '<path d="M214 350l60-40 40 10" stroke="' + a + '" stroke-width="2.2" fill="none"/>';
    }
    if (kind === 'end') {
      g += '<circle cx="200" cy="200" r="70" fill="none" stroke="' + a + '"/><circle cx="200" cy="200" r="100" fill="none" stroke="' + a + '" opacity=".45"/>';
      g += fibDots();
    }
  } else if (kind === 'eyes') {
    g += '<path d="M60 520c0-120 40-190 140-190s140 70 140 190z" fill="#0c0c14" stroke="rgba(255,255,255,.14)"/>';
    g += '<g fill="' + a + '"><ellipse cx="160" cy="400" rx="22" ry="14"/><ellipse cx="240" cy="400" rx="22" ry="14"/></g>';
    g += '<g fill="#050508"><ellipse cx="160" cy="400" rx="5" ry="13"/><ellipse cx="240" cy="400" rx="5" ry="13"/></g>';
    g += '<path d="M130 470h140" stroke="#22e0c8" stroke-width="5" stroke-linecap="round"/>';
    g += glassBlob(200, 120, 55, 28);
  } else if (kind === 'screens') {
    for (var m = 0; m < 5; m++) {
      var sx = 30 + r() * 250, sy = 40 + m * 90;
      g += '<rect x="' + sx + '" y="' + sy + '" width="' + (90 + r() * 60) + '" height="64" fill="rgba(79,155,255,.06)" stroke="' + (m === 2 ? '#ff3b30' : a) + '" stroke-width="1.1"/>';
      for (var l = 0; l < 4; l++) g += '<path d="M' + (sx + 8) + ' ' + (sy + 14 + l * 12) + 'h' + (30 + r() * 60) + '" stroke="' + (m === 2 ? '#ff3b30' : a) + '" opacity=".55"/>';
    }
  } else if (kind === 'fractal') {
    g += fractalBranch(200, 480, -Math.PI / 2, 95, 7);
    g += fibDots();
    g += glassBlob(200, 160, 50, 30);
  } else if (kind === 'ink') {
    for (var n = 0; n < 14; n++) {
      g += inkStroke(20 + r() * 100, 40 + r() * 440, 280 + r() * 100, 40 + r() * 440, 1.5 + r() * 8);
    }
    g += '<circle cx="200" cy="260" r="70" fill="none" stroke="' + a + '" stroke-width="1.5" opacity=".5"/>';
    g += '<text x="200" y="268" text-anchor="middle" fill="' + a + '" font-family="serif" font-size="22" opacity=".7">墨</text>';
  } else if (kind === 'glass') {
    for (var b = 0; b < 8; b++) {
      g += glassBlob(40 + r() * 320, 60 + r() * 400, 20 + r() * 50, 12 + r() * 30);
    }
    g += '<path d="M40 400 Q200 300 360 420" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>';
  } else if (kind === 'psyche') {
    for (var p = 0; p < 12; p++) {
      var rr = 20 + p * 18;
      g += '<circle cx="200" cy="260" r="' + rr + '" fill="none" stroke="' + a + '" opacity="' + (.15 + p * .04) + '" stroke-width="1.2"/>';
    }
    g += fractalBranch(200, 260, 0, 60, 5);
    g += fractalBranch(200, 260, Math.PI / 2, 60, 5);
    g += fractalBranch(200, 260, Math.PI, 60, 5);
    g += fractalBranch(200, 260, -Math.PI / 2, 60, 5);
    g += fibDots();
  } else if (kind === 'canvas') {
    g += '<rect x="40" y="60" width="320" height="400" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>';
    g += '<rect x="55" y="75" width="290" height="370" fill="#0a0a10" stroke="' + a + '" stroke-width=".8" opacity=".8"/>';
    for (var c = 0; c < 20; c++) g += '<circle cx="' + (70 + r() * 260) + '" cy="' + (90 + r() * 340) + '" r="' + (1 + r() * 3) + '" fill="' + a + '" opacity=".4"/>';
    g += glassBlob(200, 200, 60, 35);
  }

  return '<svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + bg + g + '</svg>';
};
