/* Escenas de respaldo para paneles sin imagen (SVG). Cuando el panel tiene "img", se usa la imagen. */
window.AK_SCENE = function (kind, accent, seed) {
  var a = accent || '#d4af37', s = seed || 1, r = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  var bg = '<defs><linearGradient id="g' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151f"/><stop offset="1" stop-color="#07070c"/></linearGradient>' +
    '<radialGradient id="h' + seed + '" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="' + a + '" stop-opacity=".35"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="400" height="520" fill="url(#g' + seed + ')"/><rect width="400" height="520" fill="url(#h' + seed + ')"/>';
  var g = '';
  function tower(x, w, h, lit) { var y = 520 - h, o = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#0d0d16" stroke="' + (lit ? a : 'rgba(255,255,255,.18)') + '" stroke-width="1.2"/>';
    for (var yy = y + 10; yy < 510; yy += 16) for (var xx = x + 6; xx < x + w - 6; xx += 12) if (r() < .32) o += '<rect x="' + xx + '" y="' + yy + '" width="5" height="7" fill="' + (r() < .5 ? a : '#f2efe6') + '" opacity="' + (.25 + r() * .55) + '"/>';
    return o; }
  if (kind === 'blueprint') {
    for (var i = 0; i < 400; i += 25) g += '<path d="M' + i + ' 0V520" stroke="rgba(79,155,255,.12)"/>';
    for (var j = 0; j < 520; j += 25) g += '<path d="M0 ' + j + 'H400" stroke="rgba(79,155,255,.12)"/>';
    g += '<g stroke="#f2efe6" stroke-width="1.4" fill="none"><rect x="70" y="160" width="90" height="300"/><rect x="180" y="100" width="70" height="360"/><rect x="270" y="220" width="70" height="240"/><path d="M70 470h270M70 478v-16M340 478v-16"/></g>' +
      '<text x="200" y="500" fill="#f2efe6" font-family="Inter" font-size="11" text-anchor="middle" letter-spacing="3">A-00 · CIUDAD</text>' +
      '<path d="M180 100h70" stroke="' + a + '" stroke-width="3"/>';
  } else if (kind === 'city' || kind === 'figure' || kind === 'end') {
    var x = -10; while (x < 400) { var w = 30 + r() * 50; g += tower(x, w, 120 + r() * 260, r() < .25); x += w + 4; }
    g += '<rect x="150" y="80" width="100" height="440" fill="#0d0d16" stroke="' + a + '" stroke-width="1.6"/>';
    for (var k = 0; k < 6; k++) g += '<path d="M150 ' + (80 + k * 14) + 'h100" stroke="' + a + '" opacity="' + (.9 - k * .13) + '"/>';
    for (var d = 0; d < 60; d++) g += '<path d="M' + (r() * 400) + ' ' + (r() * 520) + 'l-3 12" stroke="rgba(255,255,255,.18)"/>';
    if (kind === 'figure') g += '<g fill="#050508" stroke="' + a + '" stroke-width="1.2"><path d="M200 330c-14 0-22 12-22 26v70h44v-70c0-14-8-26-22-26z"/><circle cx="200" cy="312" r="16"/></g><path d="M214 350l60-40 40 10" stroke="' + a + '" stroke-width="2.4" fill="none" opacity=".9"/><path d="M274 310v-30h50" stroke="' + a + '" stroke-width="1.4" fill="none" stroke-dasharray="4 4"/>';
    if (kind === 'end') g += '<circle cx="200" cy="200" r="70" fill="none" stroke="' + a + '" stroke-width="1"/><circle cx="200" cy="200" r="100" fill="none" stroke="' + a + '" stroke-width=".6" opacity=".5"/>';
  } else if (kind === 'eyes') {
    g += '<path d="M60 520c0-120 40-190 140-190s140 70 140 190z" fill="#0d0d16" stroke="rgba(255,255,255,.15)"/>' +
      '<path d="M120 350l-20-70 60 40M280 350l20-70-60 40" fill="#0d0d16" stroke="rgba(255,255,255,.2)"/>' +
      '<g fill="' + a + '"><ellipse cx="160" cy="400" rx="22" ry="14"/><ellipse cx="240" cy="400" rx="22" ry="14"/></g><g fill="#050508"><ellipse cx="160" cy="400" rx="5" ry="13"/><ellipse cx="240" cy="400" rx="5" ry="13"/></g>' +
      '<path d="M130 470h140" stroke="#22e0c8" stroke-width="5" stroke-linecap="round"/><circle cx="200" cy="476" r="6" fill="#22e0c8"/>' +
      '<rect x="30" y="60" width="120" height="80" fill="none" stroke="' + a + '" opacity=".5"/><rect x="250" y="40" width="120" height="90" fill="none" stroke="' + a + '" opacity=".4"/>';
  } else if (kind === 'screens') {
    for (var m = 0; m < 5; m++) { var sx = 30 + r() * 250, sy = 40 + m * 90; g += '<rect x="' + sx + '" y="' + sy + '" width="' + (90 + r() * 60) + '" height="64" fill="rgba(79,155,255,.06)" stroke="' + (m === 2 ? '#ff3b30' : a) + '" stroke-width="1.2"/>'; for (var l = 0; l < 4; l++) g += '<path d="M' + (sx + 8) + ' ' + (sy + 14 + l * 12) + 'h' + (30 + r() * 60) + '" stroke="' + (m === 2 ? '#ff3b30' : a) + '" opacity=".6"/>'; }
  }
  return '<svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + bg + g + '</svg>';
};
