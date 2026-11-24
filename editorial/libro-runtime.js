/* Ambient particle field + floating drop + book render */
(function(){
  var c = document.getElementById('ak-field');
  if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = c.getContext('2d');
  var dpr = Math.min(2, window.devicePixelRatio||1);
  var pts = [];
  function resize(){
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function init(){
    pts = [];
    var n = Math.min(48, Math.floor(innerWidth/30));
    for (var i=0;i<n;i++) pts.push({
      x: Math.random()*innerWidth, y: Math.random()*innerHeight,
      r: 1+Math.random()*2.5, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
      a: .08+Math.random()*.2
    });
  }
  function tick(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    pts.forEach(function(p){
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>innerWidth) p.vx*=-1;
      if (p.y<0||p.y>innerHeight) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(212,175,55,'+p.a+')'; ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  resize(); init(); tick();
  addEventListener('resize', function(){ resize(); init(); });
})();

(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var el = document.getElementById('ak-drop');
  var menu = document.getElementById('ak-drop-menu');
  if (!el) return;
  var x = innerWidth - 80, y = innerHeight - 100;
  var vx = 0.35, vy = 0.22;
  var dragging = false, open = false, ox=0, oy=0;
  function place(){
    el.style.transform = 'translate('+x+'px,'+y+'px)';
    if (open) {
      menu.style.left = Math.min(innerWidth-160, x-100)+'px';
      menu.style.top = Math.max(12, y-160)+'px';
    }
  }
  function loop(){
    if (!dragging && !open) {
      x += vx; y += vy;
      if (x < 12 || x > innerWidth-68) vx *= -1;
      if (y < 12 || y > innerHeight-68) vy *= -1;
      x = Math.max(12, Math.min(innerWidth-68, x));
      y = Math.max(12, Math.min(innerHeight-68, y));
      vx += (Math.random()-.5)*0.02;
      vy += (Math.random()-.5)*0.02;
      var sp = Math.sqrt(vx*vx+vy*vy);
      if (sp > 0.9) { vx*=0.9/sp; vy*=0.9/sp; }
      if (sp < 0.2) { vx*=1.05; vy*=1.05; }
    }
    place();
    requestAnimationFrame(loop);
  }
  function setOpen(v){
    open = !!v;
    el.classList.toggle('open', open);
    menu.classList.toggle('show', open);
    place();
  }
  el.addEventListener('pointerdown', function(e){
    dragging = true; el.setPointerCapture(e.pointerId);
    ox = e.clientX - x; oy = e.clientY - y;
    vx = 0; vy = 0;
  });
  el.addEventListener('pointermove', function(e){
    if (!dragging) return;
    x = e.clientX - ox; y = e.clientY - oy;
    place();
  });
  el.addEventListener('pointerup', function(){
    if (!dragging) return;
    dragging = false;
    setOpen(!open);
    vx = (Math.random()-.5)*0.6;
    vy = (Math.random()-.5)*0.6;
  });
  document.addEventListener('click', function(e){
    if (open && !el.contains(e.target) && !menu.contains(e.target)) setOpen(false);
  });
  addEventListener('scroll', function(){ if (open) setOpen(false); }, {passive:true});
  place(); loop();
})();

(function(){
  var q = (location.search.match(/[?&]libro=([^&]+)/)||[])[1] || 'fractalia';
  q = q.toLowerCase();
  if (q!=='fractalia' && q!=='psicodelia') q='fractalia';
  function esc(s){ return String(s).replace(/&/g,'&').replace(/</g,'<'); }
  function draw(){
    var pack = (window.ARCHIKATZ_LIBROS||{})[q];
    if (!pack || !pack.chapters || !pack.chapters.length) {
      document.getElementById('chapters').innerHTML = '<p class="sub">Cargando el manuscrito…</p>';
      return;
    }
    document.title = pack.title + ' · ArchiKatz Editorial';
    document.getElementById('title').textContent = pack.title;
    document.getElementById('subtitle').textContent = pack.subtitle;
    document.getElementById('tagline').textContent = pack.tagline;
    document.getElementById('kicker').textContent = 'ArchiKatz Editorial · Tomo I · ' + pack.title;
    document.getElementById('switch').innerHTML =
      '<a class="chip'+(q==='fractalia'?' on':'')+'" href="libro.html?libro=fractalia">Fractalia</a>'+
      '<a class="chip'+(q==='psicodelia'?' on':'')+'" href="libro.html?libro=psicodelia">Psicodelia</a>'+
      '<a class="chip" href="./">← Editorial</a>'+
      '<a class="chip" href="proceso-creador.html">Making-of</a>';
    document.getElementById('toc').innerHTML = pack.chapters.map(function(c){
      return '<li><a href="#cap'+c.n+'"><span>'+c.n+'</span> '+esc(c.title)+'</a></li>';
    }).join('');
    document.getElementById('chapters').innerHTML = pack.chapters.map(function(c){
      var art = (typeof AK_BOOK_ART==='function') ? AK_BOOK_ART(q, c.n) : '';
      return '<article class="ch" id="cap'+c.n+'"><p class="kicker">Capítulo '+c.roman+'</p><div class="art" aria-hidden="true">'+art+'</div><h2>'+esc(c.title)+'</h2><div class="body">'+esc(c.body)+'</div></article>';
    }).join('');
  }
  if (window.ARCHIKATZ_BOOKS_READY) ARCHIKATZ_BOOKS_READY.then(draw).catch(draw);
  else draw();
  setTimeout(function(){
    var pack = (window.ARCHIKATZ_LIBROS||{})[q];
    if (pack && pack.chapters && pack.chapters.length) draw();
  }, 1200);
})();
