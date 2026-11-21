/* PROMII liquid-glass wordmark.
   Reuses the existing .core drop (same physics, same burst, same menus).
   Letters = crystal glass. O slot = the real physics bubble.
   Reversible: remove this script tag. */
(function () {
  if (!/\/home\/?$/.test(location.pathname)) return;

  var css = [
    ".hello{top:calc(50% + min(16vw,80px))!important;z-index:6;pointer-events:none}",
    ".hello h1{",
    "  display:inline-flex!important;align-items:center;justify-content:center;",
    "  gap:clamp(2px,.4vw,6px);margin:0;padding:0;",
    "  font:700 clamp(48px,11.5vw,120px)/1 var(--display,sans-serif)!important;",
    "  letter-spacing:-.02em!important;user-select:none}",
    ".wm-letter{",
    "  position:relative;display:inline-grid;place-items:center;",
    "  width:clamp(42px,9.2vw,96px);height:clamp(52px,11vw,112px);",
    "  border-radius:22% / 28%;",
    "  font-size:clamp(28px,6.5vw,68px);font-weight:700;line-height:1;",
    "  color:rgba(255,255,255,.92);",
    "  background:",
    "    radial-gradient(32% 22% at 34% 22%,rgba(255,255,255,.95),rgba(255,255,255,.25) 48%,transparent 72%),",
    "    radial-gradient(80% 55% at 50% 100%,rgba(47,107,255,.35),transparent 70%),",
    "    radial-gradient(120% 120% at 28% 18%,rgba(255,255,255,.12),rgba(0,0,0,.2));",
    "  box-shadow:",
    "    inset 0 0 0 1px rgba(255,255,255,.55),",
    "    inset 0 1.5px 1px rgba(255,255,255,.8),",
    "    inset 3px 2px 5px -2px rgba(255,90,130,.25),",
    "    inset -3px -2px 5px -2px rgba(70,180,255,.35),",
    "    0 18px 32px -16px rgba(0,0,0,.75),",
    "    0 4px 24px -8px rgba(47,107,255,.4);",
    "  backdrop-filter:saturate(1.8) brightness(1.12);",
    "  -webkit-backdrop-filter:saturate(1.8) brightness(1.12);",
    "  text-shadow:0 1px 2px rgba(0,0,0,.35);",
    "  animation:wmBreath 6s ease-in-out infinite}",
    ".wm-letter:nth-child(1){animation-delay:0s}",
    ".wm-letter:nth-child(2){animation-delay:-.7s}",
    ".wm-letter:nth-child(4){animation-delay:-1.4s}",
    ".wm-letter:nth-child(5){animation-delay:-2.1s}",
    ".wm-letter:nth-child(6){animation-delay:-2.8s}",
    ".wm-letter::before{",
    "  content:\"\";position:absolute;left:18%;right:18%;top:10%;height:28%;",
    "  border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.7),transparent 70%);",
    "  pointer-events:none;opacity:.9}",
    ".wm-o-slot{",
    "  position:relative;display:inline-block;",
    "  width:clamp(52px,11vw,112px);height:clamp(52px,11vw,112px);",
    "  flex:none;vertical-align:middle}",
    "body:not(.open) .core{",
    "  position:absolute!important;",
    "  width:clamp(52px,11vw,112px)!important;",
    "  height:clamp(52px,11vw,112px)!important;",
    "  z-index:8!important;cursor:pointer;",
    "  animation:breath 5.5s ease-in-out infinite!important}",
    "body:not(.open) .core::after{inset:-12px!important;border-color:rgba(255,255,255,.2)!important}",
    "body:not(.open) .core span{",
    "  font:700 clamp(18px,3.5vw,28px)/1 var(--display,sans-serif)!important;",
    "  letter-spacing:0!important;color:#fff!important;",
    "  text-shadow:0 1px 3px rgba(0,0,0,.45)!important}",
    ".dock{",
    "  position:absolute;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));",
    "  translate:-50% 0;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;",
    "  padding:6px;z-index:20;border-radius:999px;",
    "  background:rgba(14,14,20,.55);",
    "  backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);",
    "  border:1px solid rgba(255,255,255,.14);",
    "  box-shadow:0 16px 40px -18px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.12)}",
    ".dock .pill{padding:10px 15px;border-color:transparent;background:rgba(255,255,255,.06)}",
    ".bottom{display:none!important}",
    "body.open .hello{opacity:0;transform:translateY(18px) scale(.97);pointer-events:none;transition:opacity .55s,transform .7s cubic-bezier(.2,.7,.2,1)}",
    "@keyframes wmBreath{0%,100%{border-radius:22% 28% 24% 26%/28% 22% 30% 24%}40%{border-radius:26% 22% 28% 24%/24% 28% 22% 30%}70%{border-radius:24% 26% 22% 28%/30% 24% 28% 22%}}",
    "@media (prefers-reduced-motion:reduce){.wm-letter,body:not(.open) .core{animation:none!important}}"
  ].join("");

  var st = document.createElement("style");
  st.id = "promii-wm-css";
  st.textContent = css;
  document.head.appendChild(st);

  function heroRect() {
    var hero = document.getElementById("hero");
    return hero ? hero.getBoundingClientRect() : null;
  }

  function placeCoreAsO() {
    if (document.body.classList.contains("open")) return;
    var core = document.querySelector(".core");
    var slot = document.getElementById("wmOSlot");
    var hr = heroRect();
    if (!core || !slot || !hr) return;

    var sr = slot.getBoundingClientRect();
    var size = Math.min(sr.width, sr.height);
    var cx = sr.left + sr.width / 2 - hr.left;
    var cy = sr.top + sr.height / 2 - hr.top;
    var r = size / 2;

    core.style.width = size + "px";
    core.style.height = size + "px";
    core.style.transform = "translate3d(" + (cx - r).toFixed(1) + "px," + (cy - r).toFixed(1) + "px,0)";

    var body = window.__promiiCore;
    if (body) {
      body.x = cx;
      body.y = cy;
      body.r = r;
    }

    var span = core.querySelector("span");
    if (span && span.textContent !== "O") {
      span.textContent = "O";
      try { core.setAttribute("aria-label", "PROMII — abrir caminos"); } catch (e) {}
    }
  }

  function stickLoop() {
    placeCoreAsO();
    if (!document.body.classList.contains("open")) {
      requestAnimationFrame(stickLoop);
    }
  }

  function buildWordmark() {
    var h1 = document.querySelector(".hello h1");
    if (!h1 || h1.dataset.wm === "3") return;
    h1.dataset.wm = "3";
    h1.setAttribute("aria-label", "PROMII");
    h1.innerHTML =
      '<span class="wm-letter" aria-hidden="true">P</span>' +
      '<span class="wm-letter" aria-hidden="true">R</span>' +
      '<span class="wm-o-slot" id="wmOSlot" aria-hidden="true"></span>' +
      '<span class="wm-letter" aria-hidden="true">M</span>' +
      '<span class="wm-letter" aria-hidden="true">I</span>' +
      '<span class="wm-letter" aria-hidden="true">I</span>';

    var p = document.querySelector(".hello p");
    if (p) {
      p.setAttribute("data-en", "Tap the O — liquid glass paths");
      p.textContent =
        document.documentElement.lang === "en"
          ? "Tap the O — liquid glass paths"
          : "Toca la O — caminos en liquid glass";
    }

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
      if (link) {
        link.textContent =
          document.documentElement.lang === "en" ? "Portfolio \u2192" : "Portafolio \u2192";
      }
      if (map) {
        map.textContent =
          document.documentElement.lang === "en" ? "Map" : "Mapa";
      }
    }
  }

  function boot() {
    buildWordmark();
    stickLoop();
    addEventListener("resize", placeCoreAsO);

    var mo = new MutationObserver(function () {
      if (!document.body.classList.contains("open")) stickLoop();
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 0);
    });
  } else {
    setTimeout(boot, 0);
  }
})();
