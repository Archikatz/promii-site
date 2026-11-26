# PROMII HYPERFLUID DESIGN & ENGINEERING STANDARD (v4.0)

* **Repositorio:** `promii.co` · Studio Brian Zuleta / Promii Ecosystem
* **Clasificación:** Estándar Oficial de Arquitectura Frontend, WebGL, Scrollytelling y Audio Procedural
* **Objetivo:** Sistema gráfico de nivel Awwwards (60–120 FPS, motor < 180 KB) modular y gobernable desde Panel de Administración.

## Filosofía
1. **Refracción óptica real y Fresnel (WebGL/GLSL)** — IOR ∈ [1.33, 1.52]
2. **Tensión superficial y deformación por velocidad** — masa-resorte-amortiguador
3. **Scrollytelling determinista** — progreso normalizado p ∈ [0,1]

## Stack
| Capa | Tecnología |
|---|---|
| 3D & Shaders | Three.js + Custom GLSL |
| Inercia | Lenis |
| Orquestación | GSAP 3 + ScrollTrigger |
| Audio | Web Audio API (Re Dórico, mute por defecto) |

## Portadas
- `/` — Flagship 6 actos (droplet → bim-slabs → trinity → obsidian vault → globe → finale)
- `/home/` — Spatial Command Deck & Studio OS

## Admin
- `Shift+A` o `?admin=1` o botón ⚙ STAGE
- Atmósferas: ARCHITECTURAL_LIGHT | OBSIDIAN_LUXURY | AUTO_ADAPTIVE
- Exportar JSON → `assets/promii-hyperfluid-config.js`

## Archivos
```
assets/promii-hyperfluid-config.js
assets/promii-hyperfluid-engine.js
index.html
home/index.html
docs/PROMII_HYPERFLUID_DESIGN_STANDARD.md
```

## Replicación en otras páginas
1. Incluir config + engine
2. Canvas `#promii-webgl-canvas` + secciones `data-hf-act`
3. `data-hf-magnetic` / `data-hf-sound` en CTAs
