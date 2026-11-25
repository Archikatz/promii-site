/* Promii Arcade logos — SVG assets */
window.PromiiLogos = {
  map: {"01": "logo_01_duet_glass.svg", "02": "logo_02_resonance_keys.svg", "03": "logo_03_glass_collapse.svg", "04": "logo_04_aether_drift.svg", "05": "logo_05_archi_arcana.svg", "06": "logo_06_monolith_relic.svg", "07": "logo_07_liquid_harvest.svg", "08": "logo_08_kinetic_kitchen.svg", "09": "logo_09_the_archivist.svg", "10": "logo_10_abyss_maze.svg", "11": "logo_11_prism_racer.svg", "12": "logo_12_void_flyer.svg", "13": "logo_13_illusion_finder.svg", "14": "logo_14_anomaly_hunt.svg", "15": "logo_15_chronicle_delver.svg", "16": "logo_16_slab_tower.svg", "17": "logo_17_clash_detector.svg", "18": "logo_18_droplet_orbit.svg", "19": "logo_19_plinth_strider.svg", "20": "logo_20_menagerie_runner.svg"},
  renderBadge(id) {
    const f = this.map[id];
    if (!f) return '';
    return '<div class="logo-stage" style="width:72px;height:72px;flex-shrink:0;perspective:520px">' +
      '<div class="logo-3d-wrap" style="width:100%;height:100%;border-radius:16px;overflow:hidden;transition:transform .28s cubic-bezier(.22,1,.36,1);filter:drop-shadow(0 8px 18px rgba(0,0,0,.55))">' +
      '<img src="assets/logos/' + f + '" width="72" height="72" alt="" style="display:block;width:100%;height:100%">' +
      '</div></div>';
  },
  getSvg() { return ''; }
};
