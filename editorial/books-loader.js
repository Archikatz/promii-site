(function(){
  var books = ['fractalia','psicodelia'];
  window.ARCHIKATZ_LIBROS = window.ARCHIKATZ_LIBROS || {};
  window.ARCHIKATZ_BOOKS_READY = Promise.all(books.map(function(b){
    return fetch('books/'+b+'/meta.json').then(function(r){return r.json();}).then(function(meta){
      var ch = [];
      var chain = Promise.resolve();
      for (var i=1;i<=8;i++){
        (function(n){
          chain = chain.then(function(){
            return fetch('books/'+b+'/'+(n<10?'0':'')+n+'.json').then(function(r){return r.json();}).then(function(c){ ch.push(c); });
          });
        })(i);
      }
      return chain.then(function(){
        window.ARCHIKATZ_LIBROS[b] = { title: meta.title, subtitle: meta.subtitle, tagline: meta.tagline, chapters: ch };
      });
    });
  }));
})();
