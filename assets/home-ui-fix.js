/* Promii home UI · map + dual glass drops + scroll loupe */
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
      return '<g class="node'+(n.hub?' hub':'')+'" data-id="'+n.id+'" tabindex="0" role="button" aria-label="'+n.label+' \u2014 '+n.sub+'">'+ (n.hub?'<circle class="pulse" cx="'+n.x+'" cy="'+n.y+'" r="14" fill="none" stroke="#10A37F" stroke-width="1.2"/>':'')+ '<circle cx="'+n.x+'" cy="'+n.y+'" r="'+r+'" fill="'+fill+'" style="filter:drop-shadow(0 0 6px '+fill+')"/>'+ '<text class="lb" x="'+n.x+'" y="'+(n.y+(n.hub?22:-12))+'" text-anchor="middle">'+n.label.toUpperCase()+'</text>'+ '<g class="tip" opacity="0"><rect x="'+(n.x-70)+'" y="'+(n.y-42)+'" width="140" height="28" rx="8" fill="rgba(20,20,28,.92)" stroke="rgba(255,255,255,.18)"/>'+ '<text x="'+n.x+'" y="'+(n.y-24)+'" text-anchor="middle" class="tip-t">'+n.sub+'</text></g></g>';
    }).join('');
    var grid='';
    for(var gx=40;gx<760;gx+=28)for(var gy=30;gy<170;gy+=28)grid+='<circle cx="'+gx+'" cy="'+gy+'" r="0.7" fill="currentColor" opacity=".2"/>';
    var lands='<path class="land" d="M180 70 C210 40 280 35 310 55 C340 75 300 110 260 120 C220 130 170 100 180 70Z"/>'+ '<path class="land" d="M430 50 C480 35 530 40 560 65 C580 90 540 110 500 105 C460 100 420 75 430 50Z"/>'+ '<path class="land" d="M250 130 C280 125 310 135 320 155 C300 165 260 160 250 130Z"/>';
    var metrics='<div class="mp-metrics" role="list"><span>BOGOT\u00c1 HQ (GMT-5)</span><span>AMERICAS & EUROPE OVERLAP</span><span>AVAILABLE WORLDWIDE (EN C1 / ES)</span></div>';
    var s='<div class="mp-wrap reveal"><svg class="mp-route" viewBox="0 0 800 190" role="img" aria-label="International presence from Bogot\u00e1 studio"><rect width="800" height="190" fill="transparent"/>'+grid+lands+arcs+nodes+'</svg>'+metrics+'</div>';
    ct.insertAdjacentHTML('beforebegin', s);
    document.querySelectorAll('.mp-route .node').forEach(function(g){
      function show(on){var tip=g.querySelector('.tip');if(tip)tip.setAttribute('opacity',on?'1':'0');}
      g.addEventListener('mouseenter',function(){show(1)});
      g.addEventListener('mouseleave',function(){show(0)});
      g.addEventListener('focus',function(){show(1)});
      g.addEventListener('blur',function(){show(0)});
    });
  }

  function installFabs(){
    if (document.getElementById('fab-dock')) return;
    var NAV=[
      ['Portafolio','/'],['Editorial','/editorial/'],['Arcade','/arcade/'],
      ['About','/about/'],['Lab','/lab/'],['Contacto','/#contacto']
    ];
    var CONTACT=[
      ['Behance','https://www.behance.net/brianzuleta'],
      ['Email','mailto:hi@promii.co'],
      ['LinkedIn','https://www.linkedin.com/in/bczuleta'],
      ['WhatsApp','https://wa.me/573160570258']
    ];
    var dock=document.createElement('div');
    dock.className='fab-dock'; dock.id='fab-dock';
    function dropHtml(id, label, links, kind){
      var opts=links.map(function(l){
        var ext=/^(https?:|mailto:)/.test(l[1]);
        return '<a href="'+l[1]+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+l[0]+'</a>';
      }).join('');
      return '<div class="fab-drop" id="'+id+'" data-kind="'+kind+'">'+ 
        '<div class="fab-opts" role="menu">'+opts+'</div>'+ 
        '<button type="button" class="fab-core" aria-expanded="false" aria-label="'+label+'">'+ 
        '<span class="shine"></span><span class="fab-label">'+label+'</span></button></div>';
    }
    dock.innerHTML = dropHtml('fab-nav','Nav',NAV,'nav') + dropHtml('fab-contact','Contacto',CONTACT,'contact');
    document.body.appendChild(dock);

    function closeAll(){
      dock.querySelectorAll('.fab-drop').forEach(function(d){
        d.classList.remove('is-open');
        var b=d.querySelector('.fab-core'); if(b) b.setAttribute('aria-expanded','false');
      });
    }
    dock.querySelectorAll('.fab-core').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var drop=btn.closest('.fab-drop');
        var open=drop.classList.contains('is-open');
        closeAll();
        if(!open){ drop.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
      });
    });
    document.addEventListener('click', function(e){ if(!dock.contains(e.target)) closeAll(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeAll(); });
  }

  function installLoupe(){
    if (document.getElementById('fab-loupe')) return;
    var el=document.createElement('div');
    el.id='fab-loupe';
    el.className='fab-loupe';
    el.innerHTML=
      '<div class="loupe-opts">'+ 
        '<a href="/arcade/">Arcade</a>'+ 
        '<a href="/editorial/">Editorial</a>'+ 
        '<a href="/about/">About</a>'+ 
        '<a href="/#contacto">Contacto</a>'+ 
      '</div>'+ 
      '<button type="button" class="loupe-core" aria-label="Explorar" aria-expanded="false">'+ 
        '<span class="shine"></span>'+ 
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>'+ 
      '</button>';
    document.body.appendChild(el);

    var core=el.querySelector('.loupe-core');
    var open=false;
    core.addEventListener('click', function(e){
      e.stopPropagation();
      open=!open;
      el.classList.toggle('is-open', open);
      core.setAttribute('aria-expanded', open?'true':'false');
    });
    document.addEventListener('click', function(e){
      if(!el.contains(e.target) && open){ open=false; el.classList.remove('is-open'); core.setAttribute('aria-expanded','false'); }
    });

    var y=0, target=0, raf=0;
    function onScroll(){
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var p = scrollY / max;
      target = innerHeight * (0.18 + p * 0.54);
      if(!raf) raf=requestAnimationFrame(tick);
    }
    function tick(){
      y += (target - y) * 0.12;
      el.style.transform = 'translate3d(0,' + Math.round(y) + 'px,0)';
      raf=0;
      if(Math.abs(target-y)>0.4) raf=requestAnimationFrame(tick);
    }
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize', onScroll, {passive:true});
    onScroll();
  }

  function boot(){
    try{installMap();}catch(e){}
    try{installFabs();}catch(e){}
    try{installLoupe();}catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})();
