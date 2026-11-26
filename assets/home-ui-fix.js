/* Promii · fluid soft-body brand drop + map */
(function(){
  if (window.__promiiHomeUiFix) return;
  window.__promiiHomeUiFix = true;

  function installMap(){
    var old = document.querySelector('.mp-route');
    if (old) {
      var wrap = old.closest('.mp-wrap') || old;
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }
    var ct = document.querySelector('#contacto .contact');
    if (!ct || document.querySelector('.mp-wrap')) return;
    var GLOBAL_NODES = [
      {id:'bog',label:'Bogot\u00e1',sub:'Studio Hub \u00b7 GMT-5',x:320,y:148,hub:1},
      {id:'nyc',label:'New York',sub:'EST Aligned',x:265,y:78},
      {id:'mex',label:'Ciudad de M\u00e9xico',sub:'CST Overlap',x:230,y:118},
      {id:'mad',label:'Madrid',sub:'CET Overlap',x:470,y:72},
      {id:'lon',label:'Londres',sub:'GMT Overlap',x:455,y:55},
      {id:'rem',label:'Remoto Global',sub:'Worldwide Collaboration',x:560,y:100}
    ];
    var arcs = GLOBAL_NODES.filter(function(n){return !n.hub;}).map(function(n,i){
      var hx=320,hy=148,mx=(hx+n.x)/2,my=Math.min(hy,n.y)-28+i*3;
      return '<path class="arc" d="M'+hx+' '+hy+' Q '+mx+' '+my+' '+n.x+' '+n.y+'"/>';
    }).join('');
    var nodes = GLOBAL_NODES.map(function(n){
      var r = n.hub ? 7 : 4.5;
      var fill = n.hub ? '#10A37F' : '#E85A4F';
      return '<g class="node'+(n.hub?' hub':'')+'" data-id="'+n.id+'">'+ 
        (n.hub?'<circle class="pulse" cx="'+n.x+'" cy="'+n.y+'" r="14" fill="none" stroke="#10A37F" stroke-width="1.2"/>':'')+ 
        '<circle cx="'+n.x+'" cy="'+n.y+'" r="'+r+'" fill="'+fill+'"/>'+ 
        '<text class="lb" x="'+n.x+'" y="'+(n.y+(n.hub?22:-12))+'" text-anchor="middle">'+n.label.toUpperCase()+'</text></g>';
    }).join('');
    var grid='';
    for(var gx=40;gx<760;gx+=28)for(var gy=30;gy<170;gy+=28)grid+='<circle cx="'+gx+'" cy="'+gy+'" r="0.7" fill="currentColor" opacity=".2"/>';
    var lands='<path class="land" d="M180 70 C210 40 280 35 310 55 C340 75 300 110 260 120 C220 130 170 100 180 70Z"/>'+ 
      '<path class="land" d="M430 50 C480 35 530 40 560 65 C580 90 540 110 500 105 C460 100 420 75 430 50Z"/>';
    var metrics='<div class="mp-metrics" role="list"><span>BOGOT\u00c1 HQ (GMT-5)</span><span>AMERICAS & EUROPE OVERLAP</span><span>AVAILABLE WORLDWIDE (EN C1 / ES)</span></div>';
    var s='<div class="mp-wrap reveal"><svg class="mp-route" viewBox="0 0 800 190" role="img" aria-label="International presence from Bogot\u00e1 studio"><rect width="800" height="190" fill="transparent"/>'+grid+lands+arcs+nodes+'</svg>'+metrics+'</div>';
    ct.insertAdjacentHTML('beforebegin', s);
  }

  function FluidBlob(n){
    this.n = n || 16;
    this.r0 = 28;
    this.pts = [];
    this.vx = 0; this.vy = 0;
    this.sx = 1; this.sy = 1;
    for(var i=0;i<this.n;i++){
      var a = (i/this.n)*Math.PI*2;
      this.pts.push({a:a, r:this.r0, vr:0});
    }
  }
  FluidBlob.prototype.impulse = function(ix, iy){
    this.vx += ix; this.vy += iy;
    var mag = Math.min(12, Math.hypot(ix,iy));
    for(var i=0;i<this.n;i++){
      var p=this.pts[i];
      var ca=Math.cos(p.a), sa=Math.sin(p.a);
      p.vr -= (ca*ix + sa*iy) * 0.08;
      p.vr += (Math.random()-0.5)*mag*0.15;
    }
  };
  FluidBlob.prototype.step = function(dt){
    dt = Math.min(dt, 0.033);
    var i, p, tension=28, damp=4.2, pressure=18, visc=0.22;
    this.vx *= (1 - 2.4*dt);
    this.vy *= (1 - 2.4*dt);
    var speed = Math.hypot(this.vx, this.vy);
    var targetSx = 1 + Math.min(0.28, speed*0.004);
    var targetSy = 1 - Math.min(0.22, speed*0.0032);
    this.sx += (targetSx - this.sx) * Math.min(1, 8*dt);
    this.sy += (targetSy - this.sy) * Math.min(1, 8*dt);
    var mean=0;
    for(i=0;i<this.n;i++) mean += this.pts[i].r;
    mean /= this.n;
    for(i=0;i<this.n;i++){
      p=this.pts[i];
      var prev=this.pts[(i-1+this.n)%this.n];
      var next=this.pts[(i+1)%this.n];
      var force = 0;
      force += (this.r0 - p.r) * pressure;
      force += (mean - p.r) * tension * 0.35;
      force += ((prev.r+next.r)*0.5 - p.r) * tension;
      p.vr = (p.vr + force*dt) * (1 - damp*dt);
      p.r += p.vr * dt;
      p.r = Math.max(this.r0*0.62, Math.min(this.r0*1.45, p.r));
    }
    var nr=[];
    for(i=0;i<this.n;i++){
      var a=this.pts[(i-1+this.n)%this.n].r;
      var b=this.pts[i].r;
      var c=this.pts[(i+1)%this.n].r;
      nr[i]=b*(1-visc)+ (a+c)*0.5*visc;
    }
    for(i=0;i<this.n;i++) this.pts[i].r = nr[i];
  };
  FluidBlob.prototype.borderRadius = function(){
    var s=[], i, k=8;
    for(i=0;i<k;i++){
      var idx = Math.floor(i/k*this.n);
      var t = this.pts[idx].r / this.r0;
      s.push((45 + t*12).toFixed(1)+'%');
    }
    return s[0]+' '+s[1]+' '+s[2]+' '+s[3]+' / '+s[4]+' '+s[5]+' '+s[6]+' '+s[7];
  };

  function installBrandDrop(){
    ['fab-dock','fab-loupe','prmDropletsDock','prm-droplets-dock'].forEach(function(id){
      var n=document.getElementById(id); if(n) n.remove();
    });
    document.querySelectorAll('.fab-dock,.fab-loupe,.prm-droplets-dock').forEach(function(n){ n.remove(); });
    if (document.getElementById('pm-brand-drop')) return;

    var el = document.createElement('div');
    el.id = 'pm-brand-drop';
    el.className = 'pm-brand-drop';
    el.innerHTML =
      '<div class="pm-drop-menu" role="menu">'+ 
        '<a href="/home/">Home</a>'+ 
        '<a href="/servicios/">Servicios</a>'+ 
        '<a href="/arcade/">Arcade</a>'+ 
        '<a href="/editorial/">Editorial</a>'+ 
        '<a href="/academy/">Academy</a>'+ 
        '<a href="/about/">About</a>'+ 
        '<a href="/#contacto">Contacto</a>'+ 
        '<a class="pm-sep" href="https://wa.me/573160570258" target="_blank" rel="noopener">WhatsApp</a>'+ 
        '<a href="mailto:hi@promii.co">Email</a>'+ 
      '</div>'+ 
      '<button type="button" class="pm-drop-core" aria-label="Men\u00fa Promii" aria-expanded="false">'+ 
        '<span class="shine"></span><span class="tail"></span>'+ 
        '<span class="ripple"></span>'+ 
      '</button>';
    document.body.appendChild(el);

    var core = el.querySelector('.pm-drop-core');
    var ripple = el.querySelector('.ripple');
    var fluid = new FluidBlob(18);
    var y=0, targetY=0, prevScroll=scrollY, lastT=performance.now();

    function close(){ el.classList.remove('is-open'); core.setAttribute('aria-expanded','false'); }
    function open(){ el.classList.add('is-open'); core.setAttribute('aria-expanded','true'); fluid.impulse(0,-18); }

    core.addEventListener('click', function(e){
      e.stopPropagation();
      if (el.classList.contains('is-open')) { close(); fluid.impulse(0, 10); }
      else { open(); }
      if (ripple) {
        ripple.classList.remove('go');
        void ripple.offsetWidth;
        ripple.classList.add('go');
      }
    });
    document.addEventListener('click', function(e){ if (!el.contains(e.target)) close(); });
    document.addEventListener('keydown', function(e){ if (e.key==='Escape') close(); });

    var lastCloseY = scrollY;
    addEventListener('scroll', function(){
      if (Math.abs(scrollY - lastCloseY) > 48) { close(); lastCloseY = scrollY; }
      var dy = scrollY - prevScroll;
      prevScroll = scrollY;
      fluid.impulse(0, dy * 0.35);
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var p = Math.min(1, Math.max(0, scrollY / max));
      targetY = innerHeight * (0.16 + p * 0.58);
    }, {passive:true});
    addEventListener('resize', function(){
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var p = Math.min(1, Math.max(0, scrollY / max));
      targetY = innerHeight * (0.16 + p * 0.58);
    }, {passive:true});

    function frame(now){
      var dt = Math.min(0.04, (now - lastT)/1000);
      lastT = now;
      fluid.step(dt);
      y += (targetY - y) * Math.min(1, 6*dt);
      y += fluid.vy * 0.02;
      el.style.transform = 'translate3d(0,' + Math.round(y) + 'px,0)';
      core.style.borderRadius = fluid.borderRadius();
      core.style.transform = 'scale(' + fluid.sx.toFixed(3) + ',' + fluid.sy.toFixed(3) + ')';
      requestAnimationFrame(frame);
    }
    targetY = innerHeight * 0.16;
    requestAnimationFrame(frame);
  }

  function boot(){
    try{ installMap(); }catch(e){}
    try{ installBrandDrop(); }catch(e){}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();
