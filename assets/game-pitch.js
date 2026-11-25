/* Arcade: inject "describe your game" pitch panel */
(function(){
  if (window.__promiiGamePitch) return;
  window.__promiiGamePitch = true;
  function css(){
    if (document.getElementById('pm-pitch-css')) return;
    var s=document.createElement('style'); s.id='pm-pitch-css';
    s.textContent =
      '.request-panel{margin:28px 0 12px;padding:22px 20px;border-radius:22px;border:1px solid rgba(34,224,200,.28);background:linear-gradient(145deg,rgba(34,224,200,.08),rgba(47,107,255,.06));backdrop-filter:blur(12px)}'+
      '.request-panel h2{margin:0 0 8px;font:700 22px Georgia,serif;color:#22E0C8}'+
      '.request-panel p{margin:0 0 14px;opacity:.78;font-size:14px;line-height:1.45;max-width:56ch}'+
      '.request-panel form{display:grid;gap:10px;max-width:520px}'+
      '.request-panel input,.request-panel textarea,.request-panel select{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(8,8,12,.55);color:#f4f4f8;font:14px Inter,system-ui}'+
      '.request-panel textarea{min-height:88px;resize:vertical}'+
      '.request-panel button[type=submit]{justify-self:start;padding:10px 16px;border-radius:999px;border:0;background:#22E0C8;color:#081018;font:700 13px Inter,system-ui;cursor:pointer}'+
      '.request-panel .ok{display:none;margin-top:10px;color:#22E0C8;font-size:13px}'+
      '.request-panel.is-sent .ok{display:block}'+
      '.request-panel.is-sent form{opacity:.45;pointer-events:none}';
    document.head.appendChild(s);
  }
  function mount(){
    if (document.getElementById('requestGame')) return;
    if (location.pathname.indexOf('/games') === -1) return;
    css();
    var panel=document.createElement('div');
    panel.className='request-panel'; panel.id='requestGame';
    panel.innerHTML =
      '<h2>Describe tu juego \u00b7 lo hacemos realidad</h2>'+
      '<p>Mec\u00e1nica, est\u00e9tica o referencia. Nombre y correo obligatorios para contactarte si desarrollamos el pitch.</p>'+
      '<form id="gamePitchForm">'+
        '<input name="name" maxlength="80" required placeholder="Nombre completo *" autocomplete="name">'+
        '<input name="title" maxlength="80" required placeholder="Nombre tentativo del juego">'+
        '<select name="kind" required>'+
          '<option value="">Tipo</option>'+
          '<option>Skill & Physics</option><option>Strategy & Sims</option>'+
          '<option>Arcade & Party</option><option>Originals & BIM</option><option>Otro / h\u00edbrido</option>'+
        '</select>'+
        '<textarea name="pitch" required maxlength="1200" placeholder="C\u00f3mo se juega, qu\u00e9 se siente, referencias\u2026"></textarea>'+
        '<input name="email" type="email" maxlength="120" required placeholder="Correo electr\u00f3nico *" autocomplete="email">'+
        '<button type="submit">Enviar pitch al Lab</button>'+
      '</form>'+
      '<p class="ok">Pitch guardado. Gracias \u2014 lo revisamos en el Lab / Arcade.</p>';
    var grid=document.getElementById('grid');
    if (grid && grid.parentNode) grid.parentNode.insertBefore(panel, grid.nextSibling);
    else {
      var shell=document.querySelector('.shell');
      if (shell) shell.appendChild(panel); else document.body.appendChild(panel);
    }
    var form=document.getElementById('gamePitchForm');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var fd=new FormData(form);
      var name=String(fd.get('name')||'').trim();
      var email=String(fd.get('email')||'').trim();
      if(!name||!email){alert('Nombre y correo son obligatorios.');return;}
      var payload={
        name:name,
        email:email,
        title:String(fd.get('title')||'').trim(),
        kind:String(fd.get('kind')||''),
        pitch:String(fd.get('pitch')||'').trim(),
        at:new Date().toISOString()
      };
      try{
        var list=JSON.parse(localStorage.getItem('promii-game-pitches')||'[]');
        list.push(payload);
        localStorage.setItem('promii-game-pitches', JSON.stringify(list.slice(-50)));
        localStorage.setItem('promii-last-game-pitch', JSON.stringify(payload));
      }catch(err){}
      panel.classList.add('is-sent');
      form.reset();
    });
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  setTimeout(mount, 600);
})();
