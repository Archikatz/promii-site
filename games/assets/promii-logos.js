/* Promii Arcade · 20 animated SMIL logos */
window.PromiiLogos = {
  L: Object.assign({},
    window.__promiiLogosA1||{}, window.__promiiLogosA2||{},
    window.__promiiLogosB1||{}, window.__promiiLogosB2||{}
  ),
  renderBadge(id){
    const s=this.L[id]||'';
    return `<div class="logo-stage" style="width:72px;height:72px;flex-shrink:0;perspective:520px"><div class="logo-3d-wrap" style="width:100%;height:100%;border-radius:16px;overflow:hidden;filter:drop-shadow(0 8px 18px rgba(0,0,0,.55))">${s}</div></div>`;
  },
  getSvg(id){return this.L[id]||'';}
};
