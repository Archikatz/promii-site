/* Promii engagement: views + likes (local, social-proof) */
(function(){
  if (window.__promiiEngage) return;
  window.__promiiEngage = true;

  function idFor(){
    var c = document.querySelector('link[rel=canonical]');
    var path = (c && c.href) ? c.href : (location.origin + location.pathname);
    return path.replace(/\/+$/, '') || location.pathname;
  }
  function store(){
    try { return JSON.parse(localStorage.getItem('promii-engage') || '{}'); }
    catch(e){ return {}; }
  }
  function save(data){
    try { localStorage.setItem('promii-engage', JSON.stringify(data)); } catch(e){}
  }
  function seed(id){
    var h=0; for(var i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) >>> 0;
    return { views: 40 + (h % 180), likes: 3 + (h % 24) };
  }

  function mount(){
    var article = document.querySelector('article, .post, .chapter, .entry, main.wrap, .shell');
    if (!article) article = document.body;
    var path = location.pathname;
    var ok = /\/(blog|editorial|bitacora|academy)\//.test(path) || document.body.dataset.engage === '1';
    if (!ok) return;

    var id = idFor();
    var data = store();
    if (!data[id]) data[id] = seed(id);
    data[id].views = (data[id].views || 0) + 1;
    var liked = false;
    try { liked = localStorage.getItem('promii-liked:'+id) === '1'; } catch(e){}
    save(data);

    if (document.getElementById('pm-engage')) return;
    var bar = document.createElement('div');
    bar.id = 'pm-engage';
    bar.innerHTML =
      '<span class="pm-eng-views" title="Lecturas en este dispositivo + base">'+data[id].views+' lecturas</span>'+
      '<button type="button" class="pm-eng-like'+(liked?' on':'')+'" aria-pressed="'+(liked?'true':'false')+'">\u2665 <span>'+data[id].likes+'</span></button>'+
      '<button type="button" class="pm-eng-feedback">Feedback</button>';
    var style = document.createElement('style');
    style.textContent =
      '#pm-engage{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:18px 0;padding:12px 14px;border-radius:14px;border:1px solid rgba(127,127,127,.2);background:rgba(127,127,127,.06);font:500 13px Inter,system-ui}'+
      '#pm-engage button{border:1px solid rgba(127,127,127,.25);background:rgba(255,255,255,.04);color:inherit;border-radius:999px;padding:6px 12px;cursor:pointer}'+
      '#pm-engage .pm-eng-like.on{border-color:#e85a4f;color:#e85a4f}'+
      '#pm-engage .pm-eng-views{opacity:.75}';
    document.head.appendChild(style);

    var host = document.querySelector('article h1, .post h1, main h1, header h1');
    if (host && host.parentNode) host.parentNode.insertBefore(bar, host.nextSibling);
    else article.insertBefore(bar, article.firstChild);

    bar.querySelector('.pm-eng-like').addEventListener('click', function(){
      var d = store(); if (!d[id]) d[id] = seed(id);
      var on = this.classList.toggle('on');
      this.setAttribute('aria-pressed', on ? 'true' : 'false');
      d[id].likes = Math.max(0, (d[id].likes || 0) + (on ? 1 : -1));
      try { localStorage.setItem('promii-liked:'+id, on ? '1' : '0'); } catch(e){}
      save(d);
      this.querySelector('span').textContent = d[id].likes;
    });
    bar.querySelector('.pm-eng-feedback').addEventListener('click', function(){
      var msg = prompt('Feedback (opcional, se guarda en este dispositivo):', '');
      if (msg == null) return;
      msg = String(msg).trim(); if (!msg) return;
      try {
        var key = 'promii-feedback';
        var list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push({ id: id, msg: msg.slice(0, 500), at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list.slice(-100)));
      } catch(e){}
      alert('Gracias \u2014 feedback registrado.');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
