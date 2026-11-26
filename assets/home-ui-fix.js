/* Promii · single brand liquid-glass drop · scroll + expand menu */
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
      '</button>';
    document.body.appendChild(el);

    var core = el.querySelector('.pm-drop-core');
    function close(){ el.classList.remove('is-open'); core.setAttribute('aria-expanded','false'); }
    function open(){ el.classList.add('is-open'); core.setAttribute('aria-expanded','true'); }

    core.addEventListener('click', function(e){
      e.stopPropagation();
      if (el.classList.contains('is-open')) close(); else open();
    });
    document.addEventListener('click', function(e){
      if (!el.contains(e.target)) close();
    });
    document.addEventListener('keydown', function(e){ if (e.key==='Escape') close(); });
    var lastY = scrollY;
    addEventListener('scroll', function(){
      if (Math.abs(scrollY - lastY) > 40) { close(); lastY = scrollY; }
    }, {passive:true});

    var y=0, target=0, raf=0;
    function onScroll(){
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var p = Math.min(1, Math.max(0, scrollY / max));
      target = innerHeight * (0.16 + p * 0.58);
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function tick(){
      y += (target - y) * 0.11;
      el.style.transform = 'translate3d(0,' + Math.round(y) + 'px,0)';
      raf = 0;
      if (Math.abs(target - y) > 0.35) raf = requestAnimationFrame(tick);
    }
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize', onScroll, {passive:true});
    onScroll();
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
