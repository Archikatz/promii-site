/* Promii Arcade logos — animated badges with CSS fallback */
window.PromiiLogos = {
  map: {"01":"logo_01_duet_glass.svg","02":"logo_02_resonance_keys.svg","03":"logo_03_glass_collapse.svg","04":"logo_04_aether_drift.svg","05":"logo_05_archi_arcana.svg","06":"logo_06_monolith_relic.svg","07":"logo_07_liquid_harvest.svg","08":"logo_08_kinetic_kitchen.svg","09":"logo_09_the_archivist.svg","10":"logo_10_abyss_maze.svg","11":"logo_11_prism_racer.svg","12":"logo_12_void_flyer.svg","13":"logo_13_illusion_finder.svg","14":"logo_14_anomaly_hunt.svg","15":"logo_15_chronicle_delver.svg","16":"logo_16_slab_tower.svg","17":"logo_17_clash_detector.svg","18":"logo_18_droplet_orbit.svg","19":"logo_19_plinth_strider.svg","20":"logo_20_menagerie_runner.svg"},
  colors: {"01":"#22E0C8","02":"#2F6BFF","03":"#FF3B30","04":"#22E0C8","05":"#E8B23A","06":"#AFC6FF","07":"#22E0C8","08":"#FF3B30","09":"#E8B23A","10":"#22E0C8","11":"#2F6BFF","12":"#AFC6FF","13":"#E8B23A","14":"#FF3B30","15":"#22E0C8","16":"#2F6BFF","17":"#AFC6FF","18":"#22E0C8","19":"#22E0C8","20":"#E8B23A"},
  renderBadge(id) {
    const f = this.map[id];
    const c = this.colors[id] || '#22E0C8';
    const src = f ? ('assets/logos/' + f) : '';
    return '<div class="logo-stage" style="width:72px;height:72px;flex-shrink:0;perspective:520px">' +
      '<div class="logo-3d-wrap" style="width:100%;height:100%;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 30% 30%,'+c+'55, #0B0D16);border:1px solid rgba(244,244,248,.18);box-shadow:0 8px 18px rgba(0,0,0,.45);display:grid;place-items:center;font:700 14px Georgia,serif;color:#F4F4F8;letter-spacing:1px">' +
      (src ? '<img src="'+src+'" width="72" height="72" alt="" style="display:block;width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\';this.parentElement.textContent=\''+id+'\'">' : id) +
      '</div></div>';
  },
  getSvg(){ return ''; }
};
