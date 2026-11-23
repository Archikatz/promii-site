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
    for (var yy = y + 10; yy < 520; yy += 14) {
      for (var xx = x + 6; xx < x + w - 6; xx += 10)
        o += '<rect x="' + xx + '" y="' + yy + '" width="5" height="7" fill="' + (lit && r() > .55 ? a : 'rgba(255,255,255,.08)') + '" opacity=".7"/>';
    }
    return o;
  }
  function inkStroke(x1, y1, x2, y2, w) {
    return '<path d="M' + x1 + ' ' + y1 + ' Q' + ((x1+x2)/2 + (r()-.5)*40) + ' ' + ((y1+y2)/2 + (r()-.5)*40) +
      ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + a + '" stroke-width="' + w + '" stroke-linecap="round" opacity=".55" filter="url(#ink' + id + ')"/>';
  }
  function glassBlob(cx, cy, rx, ry) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
      '" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.28)" stroke-width="1.2"/>' +
      '<ellipse cx="' + (cx - rx*0.25) + '" cy="' + (cy - ry*0.3) + '" rx="' + (rx*0.35) + '" ry="' + (ry*0.25) +
      '" fill="rgba(255,255,255,.15)"/>';
  }
  function fractalBranch(x, y, ang, len, depth) {
    if (depth <= 0 || len < 4) return '';
    var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    var o = '<line x1="' + x + '" y1="' + y + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + a + '" stroke-width="' + Math.max(.4, depth * .45) + '" opacity="' + (.25 + depth * .08) + '"/>';
    o += fractalBranch(x2, y2, ang - 0.5 - r()*0.3, len * 0.72, depth - 1);
    o += fractalBranch(x2, y2, ang + 0.5 + r()*0.3, len * 0.72, depth - 1);
    return o;
  }
  function fibDots() {
    var o = '', phi = 1.618, ang = 0, rad = 8;
    for (var i = 0; i < 48; i++) {
      ang += Math.PI * 2 / (phi * phi); rad += 2.2;
      o += '<circle cx="' + (200 + Math.cos(ang)*rad) + '" cy="' + (260 + Math.sin(ang)*rad) +
        '" r="' + (1 + (i%5===0?2:0)) + '" fill="' + a + '" opacity=".35"/>';
    }
    return o;
  }

  if (kind === 'blueprint') {
    for (var i = 0; i < 12; i++) g += '<path d="M0 ' + (40+i*40) + 'h400" stroke="rgba(255,255,255,.06)"/>';
    for (var j = 0; j < 10; j++) g += '<path d="M' + (40+j*40) + ' 0v520" stroke="rgba(255,255,255,.06)"/>';
    g += '<rect x="80" y="120" width="240" height="280" fill="none" stroke="' + a + '" stroke-width="1.4"/>';
    g += '<path d="M80 200h240M160 120v280" stroke="' + a + '" opacity=".5"/>';
  } else if (kind === 'city' || kind === 'figure' || kind === 'end' || kind === 'neon') {
    for (var u = 0; u < 7; u++) g += tower(20 + u * 52, 36 + r() * 20, 80 + r() * 200, u === 3);
    g += '<path d="M0 500 Q200 460 400 500" fill="none" stroke="' + a + '" opacity=".3"/>';
    if (kind === 'figure') {
      g += '<circle cx="200" cy="220" r="28" fill="none" stroke="' + a + '" stroke-width="1.5"/>';
      g += '<path d="M200 250v80M170 290h60M180 330l20 60M220 330l-20 60" stroke="' + a + '" stroke-width="1.5" fill="none"/>';
    }
    if (kind === 'end') {
      g += '<text x="200" y="250" text-anchor="middle" fill="' + a + '" font-family="serif" font-size="18" opacity=".8">· · ·</text>';
    }
    if (kind === 'neon') {
      g += '<path d="M40 180 H360" stroke="' + a + '" stroke-width="3" opacity=".6"/>';
      g += '<path d="M60 220 H340" stroke="' + a + '" stroke-width="1.5" opacity=".35"/>';
    }
  } else if (kind === 'eyes') {
    g += glassBlob(140, 240, 50, 28);
    g += glassBlob(260, 240, 50, 28);
    g += '<circle cx="140" cy="240" r="12" fill="' + a + '"/><circle cx="260" cy="240" r="12" fill="' + a + '"/>';
    g += '<circle cx="144" cy="236" r="4" fill="#fff" opacity=".7"/><circle cx="264" cy="236" r="4" fill="#fff" opacity=".7"/>';
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
  } else {
    for (var u2 = 0; u2 < 7; u2++) g += tower(20 + u2 * 52, 36 + r() * 20, 80 + r() * 200, u2 === 3);
  }

  return '<svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + bg + g + '</svg>';
};
