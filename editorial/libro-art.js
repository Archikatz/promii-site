/* Chapter art: narrative-aware SVG for Fractalia / Psicodelia */
window.AK_BOOK_ART = function(book, n, accent){
  var a = accent || (book==='psicodelia' ? '#c9a0ff' : '#d4af37');
  var W=800, H=500, id='b'+book+n;
  var defs =
    '<defs>'+
    '<linearGradient id="bg'+id+'" x1="0" y1="0" x2="0" y2="1">'+
      '<stop offset="0" stop-color="#0c0c14"/><stop offset="1" stop-color="#030306"/>'+
    '</linearGradient>'+
    '<radialGradient id="glow'+id+'" cx=".5" cy=".4" r=".65">'+
      '<stop offset="0" stop-color="'+a+'" stop-opacity=".45"/>'+
      '<stop offset="1" stop-color="'+a+'" stop-opacity="0"/>'+
    '</radialGradient>'+
    '<radialGradient id="drop'+id+'" cx=".35" cy=".3" r=".7">'+
      '<stop offset="0" stop-color="#fff" stop-opacity=".55"/>'+
      '<stop offset=".4" stop-color="'+a+'" stop-opacity=".35"/>'+
      '<stop offset="1" stop-color="'+a+'" stop-opacity=".05"/>'+
    '</radialGradient>'+
    '<filter id="soft'+id+'"><feGaussianBlur stdDeviation="8"/></filter>'+
    '<filter id="glass'+id+'"><feGaussianBlur stdDeviation="2"/></filter>'+
    '</defs>';
  var g = '';
  g += '<rect width="'+W+'" height="'+H+'" fill="url(#bg'+id+')"/>';
  g += '<ellipse cx="400" cy="220" rx="280" ry="160" fill="url(#glow'+id+')" filter="url(#soft'+id+')"/>';
  var isP = book === 'psicodelia';
  if (!isP && n===1) {
    g += '<rect width="'+W+'" height="'+H+'" fill="#020208"/>';
    g += '<polygon points="400,-20 420,520 380,520" fill="url(#glow'+id+')" opacity=".9"/>';
    g += '<polygon points="400,-20 408,520 392,520" fill="#fff" opacity=".35"/>';
    for(var i=0;i<12;i++){ var y=40+i*38; g += '<line x1="0" y1="'+y+'" x2="'+W+'" y2="'+y+'" stroke="rgba(255,255,255,.04)"/>'; }
    g += '<circle cx="400" cy="80" r="18" fill="#fff" opacity=".8"/><circle cx="400" cy="80" r="40" fill="'+a+'" opacity=".2" filter="url(#soft'+id+')"/>';
  } else if (!isP && n===2) {
    for(var i=0;i<16;i++) g += '<line x1="'+(i*50)+'" y1="0" x2="'+(i*50)+'" y2="'+H+'" stroke="rgba(255,255,255,.05)"/>';
    for(var j=0;j<10;j++) g += '<line x1="0" y1="'+(j*50)+'" x2="'+W+'" y2="'+(j*50)+'" stroke="rgba(255,255,255,.05)"/>';
    g += '<circle cx="400" cy="250" r="120" fill="#0a0a12" stroke="'+a+'" stroke-width="2" opacity=".9"/>';
    g += '<circle cx="400" cy="250" r="90" fill="url(#drop'+id+')" opacity=".5"/>';
    g += '<circle cx="360" cy="210" r="28" fill="rgba(255,255,255,.12)"/>';
  } else if (!isP && n===3) {
    g += '<path d="M400 80 L560 160 L560 340 L400 420 L240 340 L240 160 Z" fill="none" stroke="'+a+'" stroke-width="2"/>';
    g += '<path d="M400 80 L400 420 M240 160 L560 160 M240 340 L560 340" stroke="'+a+'" stroke-width="1" opacity=".45"/>';
    g += '<path d="M400 80 L560 160 L400 240 L240 160 Z" fill="'+a+'" opacity=".12"/>';
  } else if (!isP && n===4) {
    var cx=400,cy=250;
    g += '<circle cx="'+cx+'" cy="'+cy+'" r="100" fill="none" stroke="'+a+'" stroke-width="3"/>';
    g += '<circle cx="'+cx+'" cy="'+cy+'" r="40" fill="none" stroke="'+a+'" stroke-width="2"/>';
    for(var k=0;k<12;k++){ var ang=k*Math.PI/6; g += '<line x1="'+(cx+Math.cos(ang)*100)+'" y1="'+(cy+Math.sin(ang)*100)+'" x2="'+(cx+Math.cos(ang)*130)+'" y2="'+(cy+Math.sin(ang)*130)+'" stroke="'+a+'" stroke-width="8" stroke-linecap="round"/>'; }
    g += '<circle cx="'+cx+'" cy="'+cy+'" r="12" fill="'+a+'"/>';
  } else if (!isP && n===5) {
    for(var i=0;i<20;i++) for(var j=0;j<12;j++){ var x=40+i*38, y=40+j*38; g += '<rect x="'+x+'" y="'+y+'" width="28" height="28" fill="none" stroke="'+a+'" stroke-width=".8" opacity=".35"/>'; }
    g += '<rect x="344" y="230" width="28" height="28" fill="'+a+'" opacity=".55"/>';
    g += '<circle cx="358" cy="244" r="40" fill="none" stroke="#ff3b30" stroke-width="2" opacity=".7"/>';
  } else if (!isP && n===6) {
    g += '<rect x="120" y="100" width="560" height="300" fill="none" stroke="'+a+'" stroke-width="1.5" opacity=".4"/>';
    for(var i=0;i<8;i++) g += '<line x1="'+(150+i*70)+'" y1="100" x2="'+(150+i*70)+'" y2="400" stroke="'+a+'" opacity=".15"/>';
    g += '<ellipse cx="480" cy="260" rx="50" ry="70" fill="#000" opacity=".7" filter="url(#soft'+id+')"/>';
  } else if (!isP && n===7) {
    g += '<path d="M200 120 L600 120 L600 380 L200 380 Z" fill="none" stroke="'+a+'" stroke-width="2"/>';
    g += '<path d="M300 120 L350 250 L280 380 M450 120 L420 240 L500 380 M200 220 L600 280" stroke="#ff3b30" stroke-width="2" opacity=".8"/>';
    g += '<circle cx="400" cy="250" r="8" fill="#ff3b30"/>';
  } else if (!isP && n===8) {
    g += '<circle cx="400" cy="250" r="180" fill="none" stroke="'+a+'" stroke-width="1" opacity=".2"/>';
    g += '<circle cx="400" cy="250" r="120" fill="none" stroke="'+a+'" stroke-width="1.5" opacity=".35"/>';
    g += '<circle cx="400" cy="250" r="60" fill="none" stroke="'+a+'" stroke-width="2" opacity=".5"/>';
    for(var i=0;i<16;i++){ var ang=i*Math.PI/8; g += '<line x1="400" y1="250" x2="'+(400+Math.cos(ang)*200)+'" y2="'+(250+Math.sin(ang)*200)+'" stroke="'+a+'" opacity=".25"/>'; }
    g += '<circle cx="400" cy="250" r="14" fill="#fff" opacity=".9"/>';
  } else if (isP && n===1) {
    for(var i=0;i<8;i++){ var cy=80+i*50, rx=180+i*20, op=.08+i*.03; g += '<ellipse cx="400" cy="'+cy+'" rx="'+rx+'" ry="40" fill="'+a+'" opacity="'+op+'" filter="url(#soft'+id+')"/>'; }
    g += '<circle cx="400" cy="250" r="60" fill="url(#drop'+id+')"/>';
    g += '<circle cx="380" cy="230" r="18" fill="rgba(255,255,255,.25)"/>';
  } else if (isP && n===2) {
    g += '<ellipse cx="400" cy="160" rx="90" ry="70" fill="url(#drop'+id+')" opacity=".85"/>';
    g += '<ellipse cx="380" cy="140" rx="25" ry="18" fill="rgba(255,255,255,.2)"/>';
    g += '<path d="M400 230 Q410 320 400 420" stroke="'+a+'" stroke-width="2" fill="none" opacity=".5" stroke-dasharray="6 8"/>';
    g += '<ellipse cx="400" cy="430" rx="70" ry="16" fill="'+a+'" opacity=".2" filter="url(#soft'+id+')"/>';
  } else if (isP && n===3) {
    g += '<circle cx="400" cy="250" r="140" fill="'+a+'" opacity=".15"/>';
    g += '<circle cx="400" cy="250" r="100" fill="'+a+'" opacity=".2"/>';
    g += '<circle cx="400" cy="250" r="60" fill="#1a1020" opacity=".7"/>';
  } else if (isP && n===4) {
    for(var i=0;i<5;i++){ var r=40+i*35; g += '<rect x="'+(400-r)+'" y="'+(250-r)+'" width="'+(r*2)+'" height="'+(r*2)+'" fill="none" stroke="'+a+'" stroke-width="1.5" opacity="'+(0.5-i*.07)+'" transform="rotate('+(i*8)+' 400 250)"/>'; }
  } else if (isP && n===5) {
    g += '<path d="M400 40 Q380 150 400 250 Q420 350 400 480" fill="none" stroke="'+a+'" stroke-width="3" opacity=".6"/>';
    for(var i=0;i<7;i++){ var y=60+i*55, w=30+i*25; g += '<ellipse cx="400" cy="'+y+'" rx="'+w+'" ry="8" fill="none" stroke="'+a+'" opacity="'+(0.5-i*.05)+'"/>'; }
  } else if (isP && n===6) {
    g += '<rect x="80" y="60" width="40" height="380" fill="'+a+'" opacity=".15"/>';
    g += '<rect x="680" y="60" width="40" height="380" fill="'+a+'" opacity=".15"/>';
    g += '<rect x="120" y="60" width="560" height="20" fill="'+a+'" opacity=".12"/>';
    g += '<rect x="120" y="420" width="560" height="20" fill="'+a+'" opacity=".12"/>';
    g += '<circle cx="400" cy="250" r="50" fill="url(#drop'+id+')" opacity=".6"/>';
  } else if (isP && n===7) {
    g += '<circle cx="400" cy="250" r="100" fill="#1a0810" stroke="'+a+'" stroke-width="2"/>';
    g += '<path d="M400 200 C360 200 340 230 340 255 C340 290 400 330 400 330 C400 330 460 290 460 255 C460 230 440 200 400 200" fill="'+a+'" opacity=".35"/>';
    g += '<circle cx="400" cy="250" r="130" fill="none" stroke="'+a+'" opacity=".2"/>';
  } else {
    g += '<polygon points="400,40 430,250 400,460 370,250" fill="url(#glow'+id+')"/>';
    g += '<line x1="400" y1="20" x2="400" y2="480" stroke="#fff" stroke-width="2" opacity=".4"/>';
    g += '<circle cx="400" cy="120" r="20" fill="#fff" opacity=".85"/>';
  }
  g += '<ellipse cx="120" cy="400" rx="50" ry="55" fill="url(#drop'+id+')" opacity=".45" filter="url(#glass'+id+')"/>';
  g += '<ellipse cx="105" cy="385" rx="14" ry="10" fill="rgba(255,255,255,.25)"/>';
  return '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">'+defs+g+'</svg>';
};
