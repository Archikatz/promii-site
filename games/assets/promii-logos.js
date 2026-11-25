/* Promii Arcade · 20 animated glass logos (SMIL) */
window.PromiiLogos = {
  L: Object.assign({}, window.__promiiLogosA || {}, window.__promiiLogosB || {}),
  renderBadge(id){
    const s=this.L[id]||'';
    return `<div class="logo-stage" style="width:72px;height:72px;flex-shrink:0;perspective:520px"><div class="logo-3d-wrap" style="width:100%;height:100%;border-radius:16px;overflow:hidden;filter:drop-shadow(0 8px 18px rgba(0,0,0,.55));transition:transform .28s cubic-bezier(.22,1,.36,1)">${s}</div></div>`;
  },
  getSvg(id){return this.L[id]||'';}
};
