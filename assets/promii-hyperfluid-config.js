/* ==========================================================================
   PROMII HYPERFLUID STAGE CONFIGURATION (v4.0)
   Editable manually or exported in 1 click from the Live Admin Panel (Shift+A)
   ========================================================================== */
window.PROMII_STAGE_CONFIG = {
  // 'ARCHITECTURAL_LIGHT' | 'OBSIDIAN_LUXURY' | 'AUTO_ADAPTIVE'
  defaultAtmosphere: 'ARCHITECTURAL_LIGHT',

  // Optical & Fluid Shader Parameters
  ior: 1.45,                // Index of refraction (1.33 water -> 1.52 crown glass)
  liquidDistortion: 0.34,   // Surface tension & harmonic wave amplitude
  chromaticDispersion: 0.28,// Subtle RGB lens edge dispersion
  scrollVelocitySkew: 0.55, // Elastic stretch when scrolling fast

  // Motion & Acoustics
  lenisLerp: 0.085,         // Smooth scroll inertia (lower = silkier)
  magneticStrength: 0.34,   // Cursor pull on [data-hf-magnetic] buttons
  audioEnabledDefault: false,
  audioVolume: 0.14
};
