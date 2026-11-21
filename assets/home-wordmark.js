/* PROMII home wordmark upgrade. Loaded only from /home/.
   Does not replace physics. Reversible by removing the script tag. */
(function () {
  if (!/\/home\/?$/.test(location.pathname)) return;
  var css = [
    ".hello{top:calc(50% + min(22vw,100px));z-index:5}",
    ".hello h1{display:inline-flex;align-items:center;justify-content:center;gap:.02em;font-size:clamp(56px,13.5vw,132px);letter-spacing:-.04em}",
    ".wm-letter{position:relative;display:inline-block;background:linear-gradient(125deg,#c8d0ff 0%,#fff 28%,#eef1ff 45%,#fff 55%,#a8b4f5 78%,#dce2ff 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 12px 28px rgba(47,107,255,.32));animation:sheen 8s ease-in-out infinite}",
    ".wm-o-wrap{position:relative;display:inline-grid;place-items:center;width:1.05em;height:1.05em;pointer-events:auto;cursor:pointer;z-index:6}",
    ".wm-o-glass{width:78%;height:78%;border-radius:50%;background:radial-gradient(32% 22% at 34% 22%,#fff,rgba(255,255,255,.35) 48%,transparent 72%),radial-gradient(80% 65% at 50% 100%,rgba(255,59,48,.45),transparent 70%),radial-gradient(120% 120% at 28% 18%,rgba(255,255,255,.12),rgba(0,0,0,.22));box-shadow:inset 0 0 0 1px rgba(255,255,255,.55),inset 0 1.5px 1px rgba(255,255,255,.85),0 18px 32px -16px rgba(0,0,0,.75);animation:breath 5.5s ease-in-out infinite}",
    ".wm-o-letter{position:absolute;font:700 .42em/1 var(--display,sans-serif);background:linear-gradient(160deg,#fff,#b8c2f0);-webkit-background-clip:text;background-clip:text;color:transparent;pointer-events:none}",
    ".dock{position:absolute;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));translate:-50% 0;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:6px;z-index:20;border-radius:999px;background:rgba(14,14,20,.55);backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);border:1px solid rgba(255,255,255,.14);box-shadow:0 16px 40px -18px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.12)}",
    ".dock .pill{padding:10px 15px;border-color:transparent;background:rgba(255,255,255,.06)}",
    ".bottom{display:none}",
    "body.open .hello{opacity:0;transform:translateY(18px) scale(.97);pointer-events:none}"
  ].join("");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function upgrade() {
    var h1 = document.querySelector(".hello h1");
    if (!h1 || h1.dataset.wm === "1") return;
    h1.dataset.wm = "1";
    h1.setAttribute("aria-label", "PROMII");
    h1.innerHTML = '<span class="wm-letter">P</span><span class="wm-letter">R</span><span class="wm-o-wrap" id="wmO" role="button" tabindex="0" aria-label="Abrir los caminos"><span class="wm-o-glass" aria-hidden="true"></span><span class="wm-o-letter">O</span></span><span class="wm-letter">M</span><span class="wm-letter">I</span><span class="wm-letter">I</span>';
    var p = document.querySelector(".hello p");
    if (p) p.textContent = document.documentElement.lang === "en" ? "Tap the O and choose your path" : "Toca la O y escoge tu camino";
    var bottom = document.querySelector(".bottom");
    if (bottom && !document.querySelector(".dock")) {
      var dock = document.createElement("div");
      dock.className = "dock";
      dock.setAttribute("role", "navigation");
      dock.setAttribute("aria-label", "Accesos rápidos");
      while (bottom.firstChild) dock.appendChild(bottom.firstChild);
      bottom.parentNode.insertBefore(dock, bottom);
      var link = dock.querySelector("a.pill");
      var map = dock.querySelector("#mapBtn");
      if (link) link.textContent = document.documentElement.lang === "en" ? "Portfolio →" : "Portafolio →";
      if (map) map.textContent = document.documentElement.lang === "en" ? "Map" : "Mapa";
    }
    var o = document.getElementById("wmO");
    if (o) o.addEventListener("click", function (e) {
      e.preventDefault();
      var core = document.querySelector(".core");
      if (core) core.click();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", upgrade);
  else upgrade();
})();
