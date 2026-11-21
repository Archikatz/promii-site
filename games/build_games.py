# Genera los juegos Ducto, Órbita y Ruta de obra (ES/EN) a partir de una plantilla común.
# Uso: python3 games/build_games.py
import pathlib, json
ROOT = pathlib.Path(__file__).resolve().parent

HEAD = '''<!doctype html>
<html lang="es" data-title-en="{ten} · Promii Games">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{tes} · Promii Games</title>
<meta name="description" content="{des}">
<link rel="canonical" href="https://promii.co/games/{file}">
<meta property="og:title" content="{tes} · Promii Games"><meta property="og:description" content="{des}"><meta property="og:image" content="https://promii.co/assets/og.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="games.css">
</head>
<body>
<main class="wrap">
  <div class="stage glass" id="stage">
    <canvas id="cv"></canvas>
    <div class="hud">{hud}</div>
    <div class="over" id="over"><div><div class="pg-chal" id="chal" hidden></div><h2 id="ot" data-en="{ten}">{tes}</h2><p id="op" data-en="{pen}">{pes}</p><button class="btn" id="go" data-en="Start">Empezar</button><p class="pg-stats" id="pst"></p><div id="soc"></div></div></div>
  </div>
  <p class="help" data-en="{hen}">{hes}</p>
</main>
<script>
var GAME={game},TITLE={title};
(function(){{
 var cv=document.getElementById('cv'),x=cv.getContext('2d'),st=document.getElementById('stage'),over=document.getElementById('over');
 var W,H,D=Math.min(devicePixelRatio||1,2),EN=function(){{return document.documentElement.lang==='en';}};
 function size(){{var r=st.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);}}
 size();
 function grid(c,step){{x.strokeStyle=c||'rgba(255,255,255,.045)';x.lineWidth=1;x.beginPath();for(var i=0;i<W;i+=step||24){{x.moveTo(i+.5,0);x.lineTo(i+.5,H);}}for(var j=0;j<H;j+=step||24){{x.moveTo(0,j+.5);x.lineTo(W,j+.5);}}x.stroke();}}
 function hud(id,v){{var e=document.getElementById(id);if(e)e.textContent=v;}}
 function finish(score,head,line){{PG.gameOver({{game:GAME,score:score,title:TITLE,head:head,line:line}});}}
{js}
}})();
</script>
<script src="/assets/site-shell.js" data-mode="full"></script>
<script src="/analytics/config.js"></script>
<script src="social.js"></script>
<script>PG.intro({game});PG.helpButton({game},{steps});</script>
<script src="/analytics/track.js" defer></script>
</body>
</html>
'''

def svg(inner):
    return '<svg viewBox="0 0 120 90" fill="none" stroke="#f4f4f8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>'

GAMES = []

# ---------------------------------------------------------------- DUCTO (serpiente)
GAMES.append(dict(file='ducto.html', game='ducto',
 tes='Ducto', ten='Duct Run',
 des='Lleva el ducto por la planta: conecta salidas de aire, esquiva columnas y no te cruces contigo mismo.',
 pes='Guía el ducto de aire por la planta. Cada salida que conectas lo alarga. Las columnas y tu propio ducto te detienen.',
 pen='Guide the air duct across the floor plan. Every outlet you connect makes it longer. Columns and your own duct stop you.',
 hes='Desliza el dedo o usa las flechas · Toca ? para el tutorial', hen='Swipe or use the arrow keys · Tap ? for the tutorial',
 hud='<span><span data-en="Outlets">Salidas</span> <b id="sc">0</b></span><span><span data-en="Speed">Velocidad</span> <b id="sp">1</b></span>',
 steps=[
  dict(ic=svg('<path d="M20 70V40h40v-20h40" stroke="#2f6bff" stroke-width="7"/><path d="M20 70V40h40v-20h40" stroke="#9db8ff" stroke-width="2"/><rect x="92" y="12" width="16" height="16" stroke="#22e0c8"/>'), es='Eres un <b>ducto de aire</b> que avanza solo por la planta. Desliza el dedo (o usa las flechas) para girar.', en='You are an <b>air duct</b> moving on its own across the plan. Swipe (or use the arrow keys) to turn.'),
  dict(ic=svg('<rect x="44" y="30" width="32" height="32" stroke="#22e0c8"/><path d="M52 38h16M52 46h16M52 54h16" stroke="#22e0c8"/><rect x="90" y="56" width="14" height="14" stroke="#e8b23a"/>'), es='Conecta las <b>salidas de aire</b> (cian) para crecer. Las <b>doradas</b> valen 3 y desaparecen rápido.', en='Connect the <b>air outlets</b> (cyan) to grow. The <b>gold</b> ones are worth 3 and vanish fast.'),
  dict(ic=svg('<rect x="40" y="28" width="34" height="34" fill="rgba(185,188,203,.25)" stroke="#b9bccb"/><path d="M40 28l34 34M74 28L40 62" stroke="#b9bccb"/><path d="M14 45h20" stroke="#ff3b30"/>'), es='No choques con las <b>columnas</b>, los bordes ni tu propio ducto. Cada 4 salidas aparece una columna nueva y vas más rápido.', en='Don\'t hit <b>columns</b>, the edges or your own duct. Every 4 outlets a new column appears and you speed up.')],
 js=r'''
 var CS,COLS=16,ROWS,TOP=44,snake,dir,queue,food,gold,cols,score,state='menu',acc=0,tick=140,last=0;
 function layout(){CS=Math.floor(W/COLS);ROWS=Math.floor((H-TOP-8)/CS);}
 layout();addEventListener('resize',function(){size();layout();});
 function free(){for(var t=0;t<500;t++){var c={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(!snake.some(function(s){return s.x===c.x&&s.y===c.y;})&&!cols.some(function(s){return s.x===c.x&&s.y===c.y;})&&!(food&&food.x===c.x&&food.y===c.y))return c;}return {x:0,y:0};}
 function reset(){var cy=Math.floor(ROWS/2);snake=[{x:5,y:cy},{x:4,y:cy},{x:3,y:cy}];dir={x:1,y:0};queue=[];cols=[];food=null;food=free();gold=null;score=0;tick=140;hud('sc',0);hud('sp',1);}
 function turn(dx,dy){var l=queue.length?queue[queue.length-1]:dir;if(l.x===-dx&&l.y===-dy||l.x===dx&&l.y===dy)return;if(queue.length<3)queue.push({x:dx,y:dy});}
 addEventListener('keydown',function(e){if(e.target&&e.target.tagName==='INPUT')return;var k={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],KeyW:[0,-1],KeyS:[0,1],KeyA:[-1,0],KeyD:[1,0]}[e.code];if(k){e.preventDefault();if(state!=='play')start();turn(k[0],k[1]);}});
 var sx,sy;st.addEventListener('pointerdown',function(e){if(e.target.closest('.over,.pg-tut,.pg-help'))return;sx=e.clientX;sy=e.clientY;});
 st.addEventListener('pointerup',function(e){if(sx==null)return;var dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;if(Math.abs(dx)>Math.abs(dy))turn(dx>0?1:-1,0);else turn(0,dy>0?1:-1);});
 st.addEventListener('touchmove',function(e){if(state==='play')e.preventDefault();},{passive:false});
 function start(){reset();state='play';over.classList.add('hide');}
 document.getElementById('go').addEventListener('click',function(e){e.stopPropagation();start();});
 function step(){if(queue.length)dir=queue.shift();var h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(h.x<0||h.y<0||h.x>=COLS||h.y>=ROWS||cols.some(function(c){return c.x===h.x&&c.y===h.y;})||snake.some(function(s,i){return i<snake.length-1&&s.x===h.x&&s.y===h.y;})){end();return;}
  snake.unshift(h);var grow=0;
  if(h.x===food.x&&h.y===food.y){grow=1;score++;food=free();if(score%4===0){cols.push(free());tick=Math.max(70,tick-9);hud('sp',Math.round((140-tick)/9)+1);}if(!gold&&Math.random()<.25)gold={c:free(),t:5};}
  else if(gold&&h.x===gold.c.x&&h.y===gold.c.y){grow=3;score+=3;gold=null;}
  if(!grow)snake.pop();else for(var g=1;g<grow;g++)snake.push(snake[snake.length-1]);
  hud('sc',score);if(navigator.vibrate&&grow)navigator.vibrate(8);}
 function end(){state='over';if(navigator.vibrate)navigator.vibrate([20,40,20]);setTimeout(function(){finish(score,{es:score+(score===1?' salida':' salidas'),en:score+(score===1?' outlet':' outlets')},{es:'El ducto midió '+snake.length+' tramos. En obra, cada metro de ducto bien trazado es un cielo raso que no se rompe.',en:'Your duct was '+snake.length+' segments long. On site, every well-routed meter of duct is a ceiling nobody has to tear open.'});},500);}
 function cell(c){return [c.x*CS+(W-COLS*CS)/2,TOP+c.y*CS];}
 function draw(t){x.clearRect(0,0,W,H);x.fillStyle='#0b0b12';x.fillRect(0,0,W,H);
  var ox=(W-COLS*CS)/2;x.strokeStyle='rgba(255,255,255,.05)';x.lineWidth=1;x.beginPath();for(var i=0;i<=COLS;i++){x.moveTo(ox+i*CS+.5,TOP);x.lineTo(ox+i*CS+.5,TOP+ROWS*CS);}for(var j=0;j<=ROWS;j++){x.moveTo(ox,TOP+j*CS+.5);x.lineTo(ox+COLS*CS,TOP+j*CS+.5);}x.stroke();
  x.strokeStyle='rgba(244,244,248,.55)';x.lineWidth=2;x.strokeRect(ox+1,TOP+1,COLS*CS-2,ROWS*CS-2);
  if(!snake)return;
  cols.forEach(function(c){var p=cell(c);x.fillStyle='rgba(185,188,203,.18)';x.fillRect(p[0]+3,p[1]+3,CS-6,CS-6);x.strokeStyle='#b9bccb';x.lineWidth=1.4;x.strokeRect(p[0]+3.5,p[1]+3.5,CS-7,CS-7);x.beginPath();x.moveTo(p[0]+3,p[1]+3);x.lineTo(p[0]+CS-3,p[1]+CS-3);x.moveTo(p[0]+CS-3,p[1]+3);x.lineTo(p[0]+3,p[1]+CS-3);x.stroke();});
  var fp=cell(food),pu=1+Math.sin(t/220)*.08;x.save();x.translate(fp[0]+CS/2,fp[1]+CS/2);x.scale(pu,pu);x.strokeStyle='#22e0c8';x.lineWidth=1.6;x.shadowColor='#22e0c8';x.shadowBlur=10;x.strokeRect(-CS*.32,-CS*.32,CS*.64,CS*.64);x.shadowBlur=0;x.beginPath();for(var k=-1;k<=1;k++){x.moveTo(-CS*.2,k*CS*.12);x.lineTo(CS*.2,k*CS*.12);}x.stroke();x.restore();
  if(gold){var gp=cell(gold.c);x.strokeStyle='rgba(232,178,58,'+Math.min(1,gold.t)+')';x.lineWidth=2;x.shadowColor='#e8b23a';x.shadowBlur=12;x.strokeRect(gp[0]+5,gp[1]+5,CS-10,CS-10);x.shadowBlur=0;}
  x.lineCap='round';x.lineJoin='round';
  [['#2f6bff',CS*.62],['#5b8cff',CS*.36],['rgba(255,255,255,.55)',CS*.08]].forEach(function(s){x.strokeStyle=s[0];x.lineWidth=s[1];x.beginPath();snake.forEach(function(c,i){var p=cell(c);i?x.lineTo(p[0]+CS/2,p[1]+CS/2):x.moveTo(p[0]+CS/2,p[1]+CS/2);});x.stroke();});
  var hp=cell(snake[0]);x.fillStyle='#22e0c8';x.beginPath();x.arc(hp[0]+CS/2+dir.x*CS*.18,hp[1]+CS/2+dir.y*CS*.18,CS*.16,0,7);x.fill();}
 function loop(t){var dt=Math.min(t-(last||t),100);last=t;if(state==='play'){acc+=dt;while(acc>=tick&&state==='play'){acc-=tick;step();}if(gold){gold.t-=dt/1000;if(gold.t<=0)gold=null;}}else acc=0;draw(t);requestAnimationFrame(loop);}
 reset();requestAnimationFrame(loop);
'''))

# ---------------------------------------------------------------- ÓRBITA (naves)
GAMES.append(dict(file='orbita.html', game='orbita',
 tes='Órbita', ten='Orbit',
 des='Pilota una nave de vidrio y defiende la ciudad de los drones de plano en oleadas cada vez más rápidas.',
 pes='Pilota la nave de vidrio y defiende la ciudad de los drones de plano. Disparas solo: tú te mueves y esquivas.',
 pen='Pilot the glass ship and defend the city from blueprint drones. You fire automatically: you move and dodge.',
 hes='Arrastra el dedo o usa las flechas · Toca ? para el tutorial', hen='Drag your finger or use the arrow keys · Tap ? for the tutorial',
 hud='<span><span data-en="Score">Puntos</span> <b id="sc">0</b></span><span><span data-en="Wave">Oleada</span> <b id="wv">1</b></span><span><span data-en="Lives">Vidas</span> <b id="lv">3</b></span>',
 steps=[
  dict(ic=svg('<path d="M60 20c8 14 14 26 14 38a14 14 0 0 1-28 0c0-12 6-24 14-38z" stroke="#22e0c8"/><path d="M30 70h60" stroke-dasharray="3 5"/><path d="M40 58l-14 0M80 58l14 0" stroke="#8a8c9e"/>'), es='Tu nave es una <b>gota de vidrio</b>. Arrastra el dedo (o usa las flechas) para moverla. Dispara sola.', en='Your ship is a <b>glass drop</b>. Drag your finger (or use the arrow keys) to move it. It fires on its own.'),
  dict(ic=svg('<path d="M60 14l18 10v20L60 54 42 44V24z" stroke="#ff3b30"/><path d="M42 24l18 10 18-10M60 34v20" stroke="#ff3b30"/><path d="M60 62v14" stroke="#ff8a80" stroke-dasharray="3 3"/>'), es='Derriba los <b>drones de plano</b>. Los grandes resisten dos disparos. Esquiva sus rayos rojos.', en='Shoot down the <b>blueprint drones</b>. Big ones take two hits. Dodge their red bolts.'),
  dict(ic=svg('<path d="M60 22l14 14-14 14-14-14z" stroke="#e8b23a"/><path d="M40 66l20-8 20 8" stroke="#22e0c8"/><path d="M48 62v-8M60 58v-10M72 62v-8" stroke="#22e0c8"/>'), es='Toma los <b>diamantes dorados</b> para disparo triple. Tienes 3 vidas y cada oleada es más rápida.', en='Grab the <b>gold diamonds</b> for triple shot. You have 3 lives and every wave is faster.')],
 js=r'''
 var ship,bul,ens,bolts,parts,pows,stars,score,lives,wave,killed,state='menu',last=0,fireT=0,spawnT=0,inv=0,triple=0,keys={},tx=null;
 function reset(){ship={x:W/2,y:H-70};bul=[];ens=[];bolts=[];parts=[];pows=[];score=0;lives=3;wave=1;killed=0;inv=0;triple=0;hud('sc',0);hud('wv',1);hud('lv',3);}
 stars=[];for(var i=0;i<70;i++)stars.push({x:Math.random(),y:Math.random(),z:Math.random()});
 addEventListener('resize',function(){size();});
 addEventListener('keydown',function(e){if(e.target&&e.target.tagName==='INPUT')return;keys[e.code]=1;if(/Arrow|Space/.test(e.code)){e.preventDefault();if(state!=='play'&&e.code==='Space')start();}});
 addEventListener('keyup',function(e){keys[e.code]=0;});
 st.addEventListener('pointerdown',function(e){if(e.target.closest('.over,.pg-tut,.pg-help'))return;var r=st.getBoundingClientRect();tx=e.clientX-r.left;});
 st.addEventListener('pointermove',function(e){if(tx==null&&e.pointerType!=='mouse')return;var r=st.getBoundingClientRect();tx=e.clientX-r.left;});
 st.addEventListener('pointerup',function(e){if(e.pointerType!=='mouse')tx=null;});
 st.addEventListener('touchmove',function(e){if(state==='play')e.preventDefault();},{passive:false});
 function start(){reset();state='play';over.classList.add('hide');}
 document.getElementById('go').addEventListener('click',function(e){e.stopPropagation();start();});
 function boom(px,py,c,n){for(var i=0;i<n;i++){var a=Math.random()*7,v=60+Math.random()*220;parts.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:.6+Math.random()*.4,c:c});}}
 function spawn(){var big=wave>1&&Math.random()<.22,r=big?22:15;ens.push({x:r+Math.random()*(W-2*r),y:-30,r:r,hp:big?2:1,big:big,ph:Math.random()*6,vy:45+wave*9+Math.random()*25,amp:20+Math.random()*40,fire:1+Math.random()*3});}
 function hit(){if(inv>0)return;lives--;hud('lv',lives);inv=1.6;boom(ship.x,ship.y,'#22e0c8',26);if(navigator.vibrate)navigator.vibrate(40);if(lives<=0)end();}
 function end(){state='over';setTimeout(function(){finish(score,{es:score+' puntos',en:score+' points'},{es:'Llegaste a la oleada '+wave+' y derribaste '+killed+' drones.',en:'You reached wave '+wave+' and shot down '+killed+' drones.'});},600);}
 function update(dt){
  stars.forEach(function(s){s.y+=dt*(.02+s.z*.06);if(s.y>1){s.y=0;s.x=Math.random();}});
  if(state!=='play')return;
  var sp=380;if(keys.ArrowLeft||keys.KeyA)ship.x-=sp*dt;if(keys.ArrowRight||keys.KeyD)ship.x+=sp*dt;if(keys.ArrowUp||keys.KeyW)ship.y-=sp*dt;if(keys.ArrowDown||keys.KeyS)ship.y+=sp*dt;
  if(tx!=null)ship.x+=(tx-ship.x)*Math.min(1,dt*12);
  ship.x=Math.max(18,Math.min(W-18,ship.x));ship.y=Math.max(H*.45,Math.min(H-30,ship.y));
  fireT-=dt;if(fireT<=0){fireT=.2;bul.push({x:ship.x,y:ship.y-22,vx:0});if(triple>0){bul.push({x:ship.x-8,y:ship.y-16,vx:-90});bul.push({x:ship.x+8,y:ship.y-16,vx:90});}}
  triple=Math.max(0,triple-dt);inv=Math.max(0,inv-dt);
  spawnT-=dt;if(spawnT<=0){spawn();spawnT=Math.max(.32,1.25-wave*.09)*(0.7+Math.random()*.6);}
  bul.forEach(function(b){b.y-=640*dt;b.x+=b.vx*dt;});bul=bul.filter(function(b){return b.y>-20;});
  ens.forEach(function(e){e.ph+=dt*2;e.y+=e.vy*dt;e.x+=Math.cos(e.ph)*e.amp*dt;e.fire-=dt;if(wave>1&&e.fire<=0&&e.y>0&&e.y<H*.6){e.fire=2.2+Math.random()*2.5;var a=Math.atan2(ship.y-e.y,ship.x-e.x);bolts.push({x:e.x,y:e.y,vx:Math.cos(a)*170,vy:Math.sin(a)*170});}});
  bolts.forEach(function(b){b.x+=b.vx*dt;b.y+=b.vy*dt;});bolts=bolts.filter(function(b){return b.y<H+20&&b.y>-20&&b.x>-20&&b.x<W+20;});
  ens.forEach(function(e){bul.forEach(function(b){if(!b.d&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+4){b.d=1;e.hp--;boom(b.x,b.y,'#ff8a80',4);if(e.hp<=0){e.d=1;killed++;score+=e.big?25:10;hud('sc',score);boom(e.x,e.y,'#ff3b30',e.big?22:14);if(Math.random()<.07)pows.push({x:e.x,y:e.y});if(killed%15===0){wave++;hud('wv',wave);}}}});
   if(!e.d&&Math.hypot(ship.x-e.x,ship.y-e.y)<e.r+12){e.d=1;boom(e.x,e.y,'#ff3b30',14);hit();}
   if(!e.d&&e.y>H+30){e.d=1;}});
  bul=bul.filter(function(b){return !b.d;});ens=ens.filter(function(e){return !e.d;});
  bolts.forEach(function(b){if(Math.hypot(b.x-ship.x,b.y-ship.y)<12){b.d=1;hit();}});bolts=bolts.filter(function(b){return !b.d;});
  pows.forEach(function(p){p.y+=90*dt;if(Math.hypot(p.x-ship.x,p.y-ship.y)<22){p.d=1;triple=8;}});pows=pows.filter(function(p){return !p.d&&p.y<H+20;});
  parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;p.t-=dt;});parts=parts.filter(function(p){return p.t>0;});}
 function drone(e){x.save();x.translate(e.x,e.y);x.rotate(Math.sin(e.ph)*.2);var r=e.r;x.strokeStyle='#ff3b30';x.lineWidth=1.6;x.shadowColor='#ff3b30';x.shadowBlur=8;x.beginPath();for(var i=0;i<6;i++){var a=i/6*Math.PI*2-Math.PI/2;x.lineTo(Math.cos(a)*r,Math.sin(a)*r);}x.closePath();x.stroke();x.shadowBlur=0;x.strokeStyle='rgba(255,138,128,.7)';x.lineWidth=1;x.beginPath();x.moveTo(-r*.87,-r*.5);x.lineTo(0,0);x.lineTo(r*.87,-r*.5);x.moveTo(0,0);x.lineTo(0,r);x.stroke();if(e.big){x.strokeRect(-r*.35,-r*.35,r*.7,r*.7);}x.restore();}
 function shipDraw(){if(inv>0&&Math.floor(inv*12)%2)return;x.save();x.translate(ship.x,ship.y);var g=x.createRadialGradient(-4,-8,1,0,0,22);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,'rgba(160,220,255,.35)');g.addColorStop(1,'rgba(34,224,200,.12)');x.fillStyle=g;x.strokeStyle='#22e0c8';x.lineWidth=1.6;x.shadowColor='#22e0c8';x.shadowBlur=14;x.beginPath();x.moveTo(0,-24);x.bezierCurveTo(9,-10,15,0,15,8);x.arc(0,8,15,0,Math.PI);x.bezierCurveTo(-15,0,-9,-10,0,-24);x.fill();x.stroke();x.shadowBlur=0;x.fillStyle='rgba(34,224,200,'+(0.4+Math.random()*.4)+')';x.beginPath();x.moveTo(-6,22);x.lineTo(0,32+Math.random()*8);x.lineTo(6,22);x.fill();x.restore();}
 function draw(){x.fillStyle='#07070c';x.fillRect(0,0,W,H);
  stars.forEach(function(s){x.fillStyle='rgba(255,255,255,'+(0.2+s.z*.6)+')';x.fillRect(s.x*W,s.y*H,1+s.z,1+s.z);});
  x.strokeStyle='rgba(47,107,255,.25)';x.lineWidth=1;x.beginPath();var bx=0;while(bx<W){var bw=24+((bx*7)%40),bh=20+((bx*13)%60);x.rect(bx,H-bh,bw-4,bh);bx+=bw;}x.stroke();
  if(!ship)return;
  bul.forEach(function(b){x.strokeStyle='#9ffcf0';x.lineWidth=2.4;x.shadowColor='#22e0c8';x.shadowBlur=8;x.beginPath();x.moveTo(b.x,b.y);x.lineTo(b.x-b.vx*.02,b.y+12);x.stroke();});x.shadowBlur=0;
  bolts.forEach(function(b){x.fillStyle='#ff8a80';x.beginPath();x.arc(b.x,b.y,3.2,0,7);x.fill();});
  ens.forEach(drone);
  pows.forEach(function(p){x.save();x.translate(p.x,p.y);x.rotate(performance.now()/400);x.strokeStyle='#e8b23a';x.lineWidth=2;x.shadowColor='#e8b23a';x.shadowBlur=10;x.strokeRect(-7,-7,14,14);x.restore();});x.shadowBlur=0;
  parts.forEach(function(p){x.globalAlpha=Math.max(0,p.t);x.fillStyle=p.c;x.fillRect(p.x,p.y,2.4,2.4);});x.globalAlpha=1;
  if(state==='play'||state==='over')shipDraw();
  if(triple>0){x.fillStyle='#e8b23a';x.font='600 11px Inter,sans-serif';x.fillText('×3 '+Math.ceil(triple)+'s',12,H-12);}}
 function loop(t){var dt=Math.min((t-(last||t))/1000,1/30);last=t;update(dt);draw();requestAnimationFrame(loop);}
 reset();requestAnimationFrame(loop);
'''))

# ---------------------------------------------------------------- RUTA DE OBRA (carros)
GAMES.append(dict(file='ruta.html', game='ruta',
 tes='Ruta de obra', ten='Site Run',
 des='Maneja el camión mezclador por la ciudad: cambia de carril, esquiva conos y barreras y recoge cascos.',
 pes='Lleva el camión mezclador a la obra. Cambia de carril para esquivar conos, barreras y carros, y recoge cascos.',
 pen='Drive the mixer truck to the site. Switch lanes to dodge cones, barriers and cars, and pick up hard hats.',
 hes='Toca a la izquierda o derecha, desliza, o usa las flechas · Toca ? para el tutorial', hen='Tap left or right, swipe, or use the arrow keys · Tap ? for the tutorial',
 hud='<span><span data-en="Score">Puntos</span> <b id="sc">0</b></span><span><span data-en="Hats">Cascos</span> <b id="ht">0</b></span><span><span data-en="Speed">Vel.</span> <b id="sp">40</b></span>',
 steps=[
  dict(ic=svg('<rect x="44" y="26" width="32" height="50" rx="6" stroke="#22e0c8"/><circle cx="60" cy="58" r="11" stroke="#22e0c8"/><path d="M30 20v60M90 20v60" stroke="#8a8c9e" stroke-dasharray="6 6"/>'), es='Manejas un <b>camión mezclador</b> en una vía de 3 carriles. Toca el lado izquierdo o derecho (o desliza) para cambiar de carril.', en='You drive a <b>mixer truck</b> on a 3-lane road. Tap the left or right side (or swipe) to switch lanes.'),
  dict(ic=svg('<path d="M30 70l10-26 10 26z" stroke="#ff8a3d"/><rect x="58" y="50" width="34" height="14" stroke="#ff3b30"/><path d="M62 64l8-14M72 64l8-14M82 64l8-14" stroke="#ff3b30"/>'), es='Esquiva <b>conos</b>, <b>barreras</b> y otros <b>carros</b>. Un choque termina el viaje.', en='Dodge <b>cones</b>, <b>barriers</b> and other <b>cars</b>. One crash ends the run.'),
  dict(ic=svg('<path d="M40 56a20 20 0 0 1 40 0z" stroke="#e8b23a"/><path d="M36 56h48" stroke="#e8b23a"/><path d="M60 36v-8" stroke="#e8b23a"/>'), es='Recoge <b>cascos</b> para sumar 50 puntos. La velocidad sube con la distancia.', en='Pick up <b>hard hats</b> for 50 points. Speed goes up with distance.')],
 js=r'''
 var lane,lx,obs,hats,score,dist,hatN,speed,state='menu',last=0,spawnT=0,roadOff=0,side=[],crash=0;
 function LW(){return Math.min(110,(W-40)/3);}
 function laneX(i){return W/2+(i-1)*LW();}
 function reset(){lane=1;lx=laneX(1);obs=[];hats=[];score=0;dist=0;hatN=0;speed=260;crash=0;hud('sc',0);hud('ht',0);hud('sp',40);}
 for(var i=0;i<16;i++)side.push({y:i*90,l:Math.random(),r:Math.random()});
 addEventListener('resize',function(){size();});
 function move(d){if(state!=='play')return;lane=Math.max(0,Math.min(2,lane+d));if(navigator.vibrate)navigator.vibrate(6);}
 addEventListener('keydown',function(e){if(e.target&&e.target.tagName==='INPUT')return;if(e.code==='ArrowLeft'||e.code==='KeyA'){e.preventDefault();move(-1);}if(e.code==='ArrowRight'||e.code==='KeyD'){e.preventDefault();move(1);}if(e.code==='Space'&&state!=='play'){e.preventDefault();start();}});
 var sx;st.addEventListener('pointerdown',function(e){if(e.target.closest('.over,.pg-tut,.pg-help'))return;sx=e.clientX;});
 st.addEventListener('pointerup',function(e){if(sx==null)return;var dx=e.clientX-sx,r=st.getBoundingClientRect();if(Math.abs(dx)>24)move(dx>0?1:-1);else move(e.clientX-r.left<W/2?-1:1);sx=null;});
 function start(){reset();state='play';over.classList.add('hide');}
 document.getElementById('go').addEventListener('click',function(e){e.stopPropagation();start();});
 function spawn(){var kinds=['cone','barrier','car','car'],k=kinds[Math.floor(Math.random()*kinds.length)],l=Math.floor(Math.random()*3);
  if(obs.some(function(o){return o.y<80;}))return;
  var o={k:k,l:l,y:-60,h:k==='car'?64:k==='barrier'?22:26,v:k==='car'?.35:0,col:['#2f6bff','#b9bccb','#ff3b30','#22e0c8'][Math.floor(Math.random()*4)]};obs.push(o);
  if(Math.random()<.5){var hl=(l+1+Math.floor(Math.random()*2))%3;hats.push({l:hl,y:-90});}
  if(dist>400&&Math.random()<.3){var l2=(l+1+Math.floor(Math.random()*2))%3;obs.push({k:'cone',l:l2,y:-60,h:26,v:0});}}
 function end(){state='over';crash=.6;if(navigator.vibrate)navigator.vibrate([30,30,60]);setTimeout(function(){finish(score,{es:score+' puntos',en:score+' points'},{es:'Recorriste '+Math.round(dist)+' m y recogiste '+hatN+' cascos.',en:'You drove '+Math.round(dist)+' m and picked up '+hatN+' hard hats.'});},700);}
 function update(dt){var v=state==='play'?speed:speed*.3;roadOff=(roadOff+v*dt)%60;side.forEach(function(s){s.y+=v*dt;if(s.y>H+60){s.y-=16*90;s.l=Math.random();s.r=Math.random();}});
  if(state!=='play')return;
  speed=Math.min(620,speed+dt*7);dist+=speed*dt/10;score=Math.round(dist)+hatN*50;hud('sc',score);hud('sp',Math.round(speed/6.5));
  lx+=(laneX(lane)-lx)*Math.min(1,dt*14);
  spawnT-=dt;if(spawnT<=0){spawn();spawnT=Math.max(.45,1.1-speed/1400)+Math.random()*.4;}
  var ty=H-110,tw=LW()*.42,th=78;
  obs.forEach(function(o){o.y+=speed*(1-o.v)*dt;if(o.k==='car'&&!o.sw&&o.y>H*.2&&Math.random()<.004){o.sw=1;o.l=Math.max(0,Math.min(2,o.l+(Math.random()<.5?-1:1)));}o.x=o.x==null?laneX(o.l):o.x+(laneX(o.l)-o.x)*Math.min(1,dt*4);
   var ow=o.k==='barrier'?LW()*.7:o.k==='car'?LW()*.42:LW()*.3;if(Math.abs(o.x-lx)<(ow+tw)/2-4&&o.y+o.h/2>ty-th/2+6&&o.y-o.h/2<ty+th/2-6)end();});
  obs=obs.filter(function(o){return o.y<H+80;});
  hats.forEach(function(h){h.y+=speed*dt;if(!h.d&&Math.abs(laneX(h.l)-lx)<tw&&Math.abs(h.y-ty)<th/2){h.d=1;hatN++;hud('ht',hatN);if(navigator.vibrate)navigator.vibrate(10);}});hats=hats.filter(function(h){return !h.d&&h.y<H+40;});}
 function truck(px,py){var w=LW()*.42,h=78;x.save();x.translate(px,py);if(crash>0)x.rotate(Math.sin(performance.now()/40)*.08);
  x.fillStyle='rgba(34,224,200,.1)';x.strokeStyle='#22e0c8';x.lineWidth=1.8;x.shadowColor='#22e0c8';x.shadowBlur=10;x.beginPath();x.roundRect(-w/2,-h/2,w,h,6);x.fill();x.stroke();x.shadowBlur=0;
  x.strokeStyle='#f4f4f8';x.lineWidth=1.3;x.strokeRect(-w/2+4,-h/2+4,w-8,h*.22);x.beginPath();x.ellipse(0,h*.12,w*.38,h*.3,0,0,7);x.stroke();
  var a=performance.now()/300;x.beginPath();for(var i=0;i<3;i++){var t=a+i*2.1;x.moveTo(Math.cos(t)*w*.32,h*.12+Math.sin(t)*h*.24);x.lineTo(-Math.cos(t)*w*.32,h*.12-Math.sin(t)*h*.24);}x.stroke();x.restore();}
 function draw(){x.fillStyle='#0b0b12';x.fillRect(0,0,W,H);var rw=LW()*3,rl=W/2-rw/2;
  x.strokeStyle='rgba(47,107,255,.35)';x.lineWidth=1;side.forEach(function(s){var w1=20+s.l*(rl-34),h1=40+s.l*40;x.strokeRect(rl-14-w1,s.y,w1,h1);x.strokeRect(rl-14-w1+6,s.y+6,w1-12,h1-12);var w2=20+s.r*(W-rl-rw-34),h2=40+s.r*40;x.strokeRect(rl+rw+14,s.y+30,w2,h2);});
  x.fillStyle='rgba(255,255,255,.03)';x.fillRect(rl,0,rw,H);x.strokeStyle='rgba(244,244,248,.7)';x.lineWidth=2;x.beginPath();x.moveTo(rl,0);x.lineTo(rl,H);x.moveTo(rl+rw,0);x.lineTo(rl+rw,H);x.stroke();
  x.strokeStyle='rgba(244,244,248,.35)';x.lineWidth=2;x.setLineDash([26,34]);x.lineDashOffset=-roadOff;x.beginPath();x.moveTo(rl+rw/3,0);x.lineTo(rl+rw/3,H);x.moveTo(rl+2*rw/3,0);x.lineTo(rl+2*rw/3,H);x.stroke();x.setLineDash([]);
  if(lane==null)return;
  hats.forEach(function(h){var hx=laneX(h.l);x.strokeStyle='#e8b23a';x.lineWidth=2;x.shadowColor='#e8b23a';x.shadowBlur=10;x.beginPath();x.arc(hx,h.y,12,Math.PI,0);x.lineTo(hx+16,h.y);x.lineTo(hx-16,h.y);x.closePath();x.stroke();x.shadowBlur=0;});
  obs.forEach(function(o){var ox=o.x==null?laneX(o.l):o.x;x.lineWidth=1.8;
   if(o.k==='cone'){x.strokeStyle='#ff8a3d';x.beginPath();x.moveTo(ox,o.y-13);x.lineTo(ox+11,o.y+12);x.lineTo(ox-11,o.y+12);x.closePath();x.stroke();x.beginPath();x.moveTo(ox-6,o.y+2);x.lineTo(ox+6,o.y+2);x.stroke();}
   else if(o.k==='barrier'){var bw=LW()*.7;x.strokeStyle='#ff3b30';x.strokeRect(ox-bw/2,o.y-11,bw,22);x.save();x.beginPath();x.rect(ox-bw/2,o.y-11,bw,22);x.clip();x.lineWidth=5;x.strokeStyle='rgba(255,59,48,.55)';for(var i=-bw;i<bw;i+=16){x.beginPath();x.moveTo(ox+i,o.y+11);x.lineTo(ox+i+22,o.y-11);x.stroke();}x.restore();}
   else {var cw=LW()*.42;x.strokeStyle=o.col;x.beginPath();x.roundRect(ox-cw/2,o.y-32,cw,64,9);x.stroke();x.strokeRect(ox-cw/2+5,o.y-18,cw-10,14);x.strokeRect(ox-cw/2+5,o.y+8,cw-10,10);}});
  truck(lx,H-110);}
 function loop(t){var dt=Math.min((t-(last||t))/1000,1/30);last=t;crash=Math.max(0,crash-dt);update(dt);draw();requestAnimationFrame(loop);}
 reset();lane=null;requestAnimationFrame(loop);
'''))

for g in GAMES:
    html = HEAD.format(file=g['file'], tes=g['tes'], ten=g['ten'], des=g['des'], pes=g['pes'], pen=g['pen'], hes=g['hes'], hen=g['hen'], hud=g['hud'],
                       game=json.dumps(g['game']), title=json.dumps({'es': g['tes'], 'en': g['ten']}, ensure_ascii=False),
                       steps=json.dumps(g['steps'], ensure_ascii=False), js=g['js'])
    (ROOT / g['file']).write_text(html)
    print('ok', g['file'])
