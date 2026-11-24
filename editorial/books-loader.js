/* Load Fractalia + Psicodelia chapter JSON (verbatim from PDF) */
(function () {
  var books = ['fractalia', 'psicodelia'];
  window.ARCHIKATZ_LIBROS = window.ARCHIKATZ_LIBROS || {};
  function base() {
    try {
      var s = document.currentScript && document.currentScript.src;
      if (s) return s.replace(/[^/]+$/, '');
    } catch (e) {}
    return './';
  }
  var root = base();
  window.ARCHIKATZ_BOOKS_READY = Promise.all(books.map(function (b) {
    return fetch(root + 'books/' + b + '/meta.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('meta ' + b + ' ' + r.status);
        return r.json();
      })
      .then(function (meta) {
        var ch = [];
        var chain = Promise.resolve();
        for (var i = 1; i <= 8; i++) {
          (function (n) {
            chain = chain.then(function () {
              var file = root + 'books/' + b + '/' + (n < 10 ? '0' : '') + n + '.json';
              return fetch(file, { cache: 'no-store' }).then(function (r) {
                if (!r.ok) throw new Error(file + ' ' + r.status);
                return r.json();
              }).then(function (c) { ch.push(c); });
            });
          })(i);
        }
        return chain.then(function () {
          window.ARCHIKATZ_LIBROS[b] = {
            title: meta.title,
            subtitle: meta.subtitle,
            tagline: meta.tagline,
            chapters: ch
          };
        });
      });
  })).catch(function (err) {
    console.error('[ArchiKatz books]', err);
  });
})();
