/* Living chapter art — canvas generative */
window.AK_BOOK_ART = function (book, n, accent) {
  var a = accent || (book === 'psicodelia' ? '#c9a0ff' : '#d4af37');
  var id = 'art-' + book + '-' + n;
  return '<div class="art-live" id="' + id + '" data-book="' + book + '" data-n="' + n + '" data-accent="' + a + '"></div>';
};

window.AK_MOUNT_ART = function (root) {
  if (!root) root = document;
  var nodes = root.querySelectorAll('.art-live:not([data-mounted])');
  nodes.forEach(function (el) {
    el.setAttribute('data-mounted', '1');
    mountScene(el);
  });
};

function mountScene(el) {
  var book = el.getAttribute('data-book');
  var n = +el.getAttribute('data-n');
  var accent = el.getAttribute('data-accent') || '#d4af37';
  var canvas = document.createElement('canvas');
  canvas.className = 'art-canvas';
  el.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  var W = 0, H = 0, t0 = performance.now(), running = false, raf = 0;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    var r = el.getBoundingClientRect();
    W = Math.max(320, Math.floor(r.width));
    H = Math.max(180, Math.floor(r.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function hexRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
  }
  var rgb = hexRgb(accent);
  function glow(x, y, r, alpha) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + alpha + ')');
    g.addColorStop(1, 'rgba(' + rgb.join(',') + ',0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  function glassOrb(x, y, r, phase) {
    var g = ctx.createRadialGradient(x - r*0.3, y - r*0.35, r*0.05, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.35, 'rgba(' + rgb.join(',') + ',0.35)');
    g.addColorStop(0.75, 'rgba(' + rgb.join(',') + ',0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.beginPath(); ctx.arc(x, y, r * (1 + Math.sin(phase)*0.03), 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x - r*0.28, y - r*0.32, r*0.28, r*0.18, -0.4, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fill();
  }

  function draw(time) {
    var t = (time - t0) / 1000;
    if (reduced) t = 0;
    ctx.clearRect(0, 0, W, H);
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0c0c14'); bg.addColorStop(1, '#030306');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    var cx = W/2, cy = H/2, isP = book === 'psicodelia';

    if (!isP && n === 1) {
      ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, W, H);
      glow(cx, H*0.15, W*0.5, 0.35 + Math.sin(t*1.2)*0.08);
      ctx.save(); ctx.translate(cx, 0);
      var beam = ctx.createLinearGradient(0, 0, 0, H);
      beam.addColorStop(0, 'rgba(255,255,255,0.85)');
      beam.addColorStop(0.2, 'rgba(' + rgb.join(',') + ',0.55)');
      beam.addColorStop(1, 'rgba(' + rgb.join(',') + ',0)');
      ctx.fillStyle = beam;
      ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(6,0); ctx.lineTo(28+Math.sin(t*0.7)*6,H); ctx.lineTo(-28-Math.sin(t*0.7)*6,H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(-2,0,4,H); ctx.restore();
      for (var i=0;i<24;i++){ var py=((t*40+i*37)%(H+20))-10; var px=cx+Math.sin(t+i)*12*(py/H);
        ctx.beginPath(); ctx.arc(px,py,1.2,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,'+(0.15+Math.sin(t*3+i)*0.1)+')'; ctx.fill(); }
      glassOrb(cx, H*0.18, 18+Math.sin(t*2)*2, t);
    } else if (!isP && n === 2) {
      ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
      for(var i=0;i<16;i++){ctx.beginPath();ctx.moveTo(i*(W/15),0);ctx.lineTo(i*(W/15),H);ctx.stroke();}
      for(var j=0;j<10;j++){ctx.beginPath();ctx.moveTo(0,j*(H/9));ctx.lineTo(W,j*(H/9));ctx.stroke();}
      var pulse=1+Math.sin(t*1.5)*0.04; glow(cx,cy,140*pulse,0.25); glassOrb(cx,cy,70*pulse,t);
      for(var k=0;k<3;k++){ctx.beginPath();ctx.arc(cx,cy,(90+k*28)*pulse,0,Math.PI*2);ctx.strokeStyle='rgba('+rgb.join(',')+','+(0.2-k*0.05)+')';ctx.lineWidth=1.5;ctx.stroke();}
    } else if (!isP && n === 3) {
      var size=Math.min(W,H)*0.28, rot=t*0.6, verts=[];
      for(var i=0;i<8;i++){var x=((i&1)?1:-1),y=((i&2)?1:-1),z=((i&4)?1:-1);
        var x1=x*Math.cos(rot)-z*Math.sin(rot), z1=x*Math.sin(rot)+z*Math.cos(rot);
        var y1=y*Math.cos(rot*0.7)-z1*Math.sin(rot*0.7), z2=y*Math.sin(rot*0.7)+z1*Math.cos(rot*0.7);
        verts.push([cx+x1*size,cy+y1*size,z2]);}
      var edges=[[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]];
      glow(cx,cy,size*1.6,0.2);
      edges.forEach(function(e){var a=verts[e[0]],b=verts[e[1]];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle='rgba('+rgb.join(',')+',0.7)';ctx.lineWidth=1.8;ctx.stroke();});
    } else if (!isP && n === 4) {
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*0.5); glow(0,0,120,0.25);
      ctx.strokeStyle='rgba('+rgb.join(',')+',0.85)'; ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(0,0,70,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.stroke();
      for(var k=0;k<12;k++){var ang=k*Math.PI/6;ctx.beginPath();ctx.moveTo(Math.cos(ang)*70,Math.sin(ang)*70);ctx.lineTo(Math.cos(ang)*95,Math.sin(ang)*95);ctx.lineWidth=10;ctx.lineCap='round';ctx.stroke();}
      ctx.fillStyle='rgba('+rgb.join(',')+',0.9)';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.restore();
    } else if (!isP && n === 5) {
      for(var i=0;i<14;i++)for(var j=0;j<8;j++){var x=30+i*((W-60)/13),y=24+j*((H-48)/7);ctx.strokeStyle='rgba('+rgb.join(',')+',0.28)';ctx.strokeRect(x,y,(W-60)/14-4,(H-48)/8-4);}
      var px=W*0.45,py=H*0.5,pr=18+Math.sin(t*3)*4;
      ctx.fillStyle='rgba('+rgb.join(',')+',0.5)';ctx.fillRect(px-12,py-12,24,24);
      ctx.beginPath();ctx.arc(px,py,pr*2,0,Math.PI*2);ctx.strokeStyle='rgba(255,59,48,'+(0.5+Math.sin(t*3)*0.3)+')';ctx.lineWidth=2;ctx.stroke();
    } else if (!isP && n === 6) {
      ctx.strokeStyle='rgba('+rgb.join(',')+',0.35)';ctx.strokeRect(W*0.12,H*0.15,W*0.76,H*0.7);
      var ax=cx+Math.sin(t*0.8)*40, ay=cy+Math.cos(t*0.6)*20; glow(ax,ay,80,0.2);
      var sg=ctx.createRadialGradient(ax,ay,5,ax,ay,55);sg.addColorStop(0,'rgba(0,0,0,0.85)');sg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(ax,ay,40,55,0,0,Math.PI*2);ctx.fill();
    } else if (!isP && n === 7) {
      ctx.strokeStyle='rgba('+rgb.join(',')+',0.7)';ctx.lineWidth=2;ctx.strokeRect(W*0.2,H*0.18,W*0.6,H*0.64);
      ctx.strokeStyle='rgba(255,59,48,'+(0.55+Math.sin(t*4)*0.25)+')';
      ctx.beginPath();ctx.moveTo(W*0.3,H*0.18);ctx.lineTo(W*0.4,H*0.5);ctx.lineTo(W*0.28,H*0.82);ctx.stroke();
      ctx.beginPath();ctx.moveTo(W*0.55,H*0.18);ctx.lineTo(W*0.5,H*0.45);ctx.lineTo(W*0.62,H*0.82);ctx.stroke();
      glow(cx,cy,60,0.15+Math.sin(t*4)*0.1);
    } else if (!isP && n === 8) {
      for(var k=0;k<5;k++){var rr=40+k*35+Math.sin(t+k)*6;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle='rgba('+rgb.join(',')+','+(0.4-k*0.06)+')';ctx.lineWidth=1.5;ctx.stroke();}
      for(var i=0;i<16;i++){var ang=i*Math.PI/8+t*0.15;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*W*0.4,cy+Math.sin(ang)*H*0.4);ctx.strokeStyle='rgba('+rgb.join(',')+',0.2)';ctx.stroke();}
      glassOrb(cx,cy,16+Math.sin(t*2)*3,t);
    } else if (isP && n === 1) {
      for(var i=0;i<7;i++){ctx.beginPath();var y0=H*0.15+i*H*0.12;ctx.moveTo(0,y0);
        for(var x=0;x<=W;x+=8){ctx.lineTo(x,y0+Math.sin(x*0.02+t*1.2+i)*12+Math.sin(x*0.01-t+i)*8);}
        ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle='rgba('+rgb.join(',')+','+(0.06+i*0.03)+')';ctx.fill();}
      glassOrb(cx,cy+Math.sin(t)*10,50,t);
    } else if (isP && n === 2) {
      var fy=cy-40+Math.sin(t)*8; glassOrb(cx,fy,55,t);
      ctx.beginPath();ctx.setLineDash([6,8]);ctx.moveTo(cx,fy+55);ctx.quadraticCurveTo(cx+Math.sin(t)*15,cy+40,cx,H*0.85);
      ctx.strokeStyle='rgba('+rgb.join(',')+',0.45)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);glow(cx,H*0.88,70,0.2);
    } else if (isP && n === 3) {
      glow(cx,cy,160,0.2); var fog=0.15+(Math.sin(t*0.7)*0.5+0.5)*0.25;
      ctx.fillStyle='rgba(20,12,28,'+fog+')';ctx.beginPath();ctx.arc(cx,cy,90,0,Math.PI*2);ctx.fill();glassOrb(cx,cy,40,t);
    } else if (isP && n === 4) {
      for(var i=0;i<6;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(t*0.2*(i%2?1:-1)+i*0.2);var s=30+i*28;
        ctx.strokeStyle='rgba('+rgb.join(',')+','+(0.45-i*0.05)+')';ctx.lineWidth=1.6;ctx.strokeRect(-s,-s,s*2,s*2);ctx.restore();}
    } else if (isP && n === 5) {
      for(var i=0;i<10;i++){var p=((t*0.3+i/10)%1);var s=10+p*Math.min(W,H)*0.55;var alpha=1-p;
        ctx.beginPath();ctx.ellipse(cx,cy,s,s*0.35,0,0,Math.PI*2);ctx.strokeStyle='rgba('+rgb.join(',')+','+(alpha*0.5)+')';ctx.lineWidth=2;ctx.stroke();}
      ctx.beginPath();ctx.moveTo(cx,20);ctx.quadraticCurveTo(cx+Math.sin(t)*20,cy,cx,H-20);ctx.strokeStyle='rgba('+rgb.join(',')+',0.5)';ctx.lineWidth=2;ctx.stroke();
    } else if (isP && n === 6) {
      var close=20+Math.sin(t)*6;ctx.fillStyle='rgba('+rgb.join(',')+',0.12)';
      ctx.fillRect(0,0,close+30,H);ctx.fillRect(W-close-30,0,close+30,H);ctx.fillRect(0,0,W,18);ctx.fillRect(0,H-18,W,18);glassOrb(cx,cy,42,t);
    } else if (isP && n === 7) {
      var pulse=1+Math.sin(t*2.5)*0.08;glow(cx,cy,120*pulse,0.25);ctx.save();ctx.translate(cx,cy);ctx.scale(pulse,pulse);
      ctx.beginPath();ctx.moveTo(0,25);ctx.bezierCurveTo(-50,-10,-30,-45,0,-20);ctx.bezierCurveTo(30,-45,50,-10,0,25);
      ctx.fillStyle='rgba('+rgb.join(',')+',0.4)';ctx.fill();ctx.strokeStyle='rgba('+rgb.join(',')+',0.8)';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    } else {
      for(var k=0;k<4;k++){var rr=30+k*40+Math.sin(t+k)*8;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle='rgba('+rgb.join(',')+','+(0.35-k*0.06)+')';ctx.stroke();}
      var beam=ctx.createLinearGradient(cx,0,cx,H);beam.addColorStop(0,'rgba(255,255,255,0.7)');beam.addColorStop(1,'rgba('+rgb.join(',')+',0)');
      ctx.fillStyle=beam;ctx.fillRect(cx-4,0,8,H);glassOrb(cx,H*0.22,18,t);
    }
    var vig=ctx.createRadialGradient(cx,cy,H*0.2,cx,cy,H*0.75);
    vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,0.45)');
    ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
  }

  function loop(now){ if(!running) return; draw(now); raf=requestAnimationFrame(loop); }
  var io=new IntersectionObserver(function(entries){entries.forEach(function(en){
    if(en.isIntersecting){ if(!running){ running=true; resize(); raf=requestAnimationFrame(loop);} }
    else { running=false; cancelAnimationFrame(raf); }
  });},{threshold:0.15});
  io.observe(el); resize(); draw(performance.now());
  addEventListener('resize', function(){ resize(); if(!running) draw(performance.now()); });
}
