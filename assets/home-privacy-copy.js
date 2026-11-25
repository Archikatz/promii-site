/* Soften public CV copy on home without rewriting 200KB index */
(function(){
  if (window.__promiiPrivacyCopy) return;
  window.__promiiPrivacyCopy = true;

  var pairs = [
    [
      /Soy Brian Zuleta, arquitecto matriculado y especialista BIM con 10\+ a\u00f1os de experiencia\. Produzco planos constructivos para Nueva York, administro proyectos de construcci\u00f3n y construyo sistemas de IA y automatizaci\u00f3n que hacen que los equipos rindan m\u00e1s\./g,
      'Soy Brian Zuleta: arquitectura y BIM, Project Management remoto de obra y sistemas de IA. Dise\u00f1o planos constructivos, coordino entregas y armo flujos que hacen que los equipos rindan m\u00e1s \u2014 sin regalar una l\u00ednea de tiempo completa aqu\u00ed.'
    ],
    [
      /I'm Brian Zuleta, a licensed architect and BIM specialist with 10\+ years of experience\. I produce construction documents for New York, administer construction projects, and build AI and automation systems that help teams do more\./g,
      "I'm Brian Zuleta: architecture & BIM, remote construction project management, and AI systems. I deliver construction documents, coordinate delivery, and design workflows that help teams perform \u2014 without publishing a full timeline here."
    ],
    [/Ver experiencia y hoja de vida \u2192/g, 'Ver perfil y solicitar CV \u2192'],
    [/See experience and r\u00e9sum\u00e9 \u2192/g, 'View profile & request CV \u2192'],
    [/Universidad de La Salle/g, 'Arquitecto'],
    [/CPNAA \u00b7 2022/g, 'CPNAA']
  ];

  function soft(root){
    var walk = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walk.nextNode())) {
      var t = n.nodeValue;
      if (!t || !t.trim()) continue;
      var next = t;
      pairs.forEach(function(p){ next = next.replace(p[0], p[1]); });
      if (next !== t) n.nodeValue = next;
    }
  }

  function boot(){
    try { soft(document.body); } catch(e) {}
    try {
      var mo = new MutationObserver(function(){ soft(document.body); });
      mo.observe(document.body, {childList:true, subtree:true, characterData:true});
      setTimeout(function(){ try{mo.disconnect();}catch(e){} }, 8000);
    } catch(e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
