# Sistema de diseño y movimiento

Un solo sistema de **movimiento, proporciones y botones** con dos **materias** intercambiables.

## Estilos

| Estilo | Atributo | Materia | Fondo |
| --- | --- | --- | --- |
| **Liquid Glass** (principal) | `data-style="glass"` | Vidrio translúcido, borde de luz, color azul/rojo | Constelación de partículas + orbes |
| **Tinta china** | `data-style="ink"` | Papel (washi), bordes de tinta, tinta negra + **un color de contraste** | Nubes de tinta en WebGL (3 octavas, 30 fps) |
| **Obsidiana** | `data-style="gem"` | Obsidiana #0B0B0F + oro #E8B23A + neón cian #22E0C8 (SOP-001 Sistema de Color Promii); el acento es la gema | Geometría sagrada estática + destello cónico lento + orbes oro/cian |

Ambos funcionan en claro y oscuro (`data-theme`). En tinta oscura el papel es carbón y la tinta es hueso.

**Color de contraste:** variable `--accent` (por defecto `#ff3b30`). En Liquid Glass reemplaza a `--red`; en Tinta china reemplaza a `--blue` y `--red`. Presets del panel: Bermellón, Azul Prusia `#1d4e89`, Oro viejo `#b8860b`, Jade `#2f7d5b`, Amatista `#7a3e9d`.

## Tokens de movimiento (en `:root` de `index.html`)

| Token | Valor | Uso |
| --- | --- | --- |
| `--m-ease` | `cubic-bezier(.2,.7,.2,1)` | Entradas, revelados, hover, barras |
| `--m-draw` | `cubic-bezier(.4,.1,.2,1)` | Trazos (dibujos, cotas, rutas, pincel) |
| `--m-spring` | `linear(…)` muelle | Interacciones con rebote |
| Duraciones | .2 · .6 · .9 · 1.4 · 2.2 s | Rápida, base, lenta, relleno, trazo |

## Proporciones tipo Apple

- Esquinas continuas: `corner-shape: superellipse(1.6–1.8)` sobre `border-radius` (con respaldo normal en navegadores sin soporte).
- **Radios concéntricos:** radio interior = radio exterior − padding.
- Botones píldora (`border-radius: 999px`), íconos ≈ 22.4 % del lado.

## Registro de animaciones (`assets/promii-config.js`)

Cada animación tiene una **clave**. Si la clave está en `data-off` de `<html>`, se apaga por CSS.

`fx` · `orbs` · `inkbg` · `shine` · `marquee` · `reveal` · `prog` · `bars` · `projdraw` · `life` · `dims` · `whyicons` · `route` · `tl` · `projzoom` · `tilt` · `cursor` · `splash` · `toast`

### Cómo agregar una animación nueva

1. Usa los tokens (`var(--m-ease)`, `var(--m-draw)`, `var(--m-spring)`) y colores por variable (`--text`, `--blue`, `--red`, `--accent`).
2. Respeta `prefers-reduced-motion`.
3. Agrégala al `REGISTRY` en `assets/promii-config.js` (clave, grupo, nombre, dónde; `styles: ['ink']` si solo existe en un estilo).
4. Agrega su regla de apagado en `#style-system` de `index.html`: `html[data-off~="clave"] .selector{…}`.
5. Regístrala en `lab/inventario.html` (lista `MOTION`).

## Cómo se aplica la configuración

1. `assets/promii-config.js` se carga en `<head>` y aplica la caché local (`pm_cfg`) para no parpadear.
2. Lee `site_config` de Supabase (lectura pública) y actualiza.
3. Para previsualizar sin guardar: `?style=ink&accent=%231d4e89&off=toast,orbs`.
4. El panel guarda en `site_config` (solo el administrador, por RLS).

## Motion Lab

`lab/index.html` + `lab/demos/01…13`. Cada demo es un HTML independiente, sin dependencias, reutilizable. `lab/inventario.html` lista todas las animaciones y su revisión.

## Temas

En el panel → Diseño y movimiento → **Temas**:
- **Sugeridos** (8): Cristal nocturno, Presentación a cliente, Galería silenciosa, Amatista de lanzamiento, Sumi bermellón, Plano azul Prusia, Jade zen, Oro de obra.
- **🎲 Aleatorio:** estilo al azar, acento de una paleta curada de 12 colores y algunas animaciones decorativas apagadas (nunca apaga revelado, dibujo de proyectos, contacto, esquinas ni transición a detalle).
- **Mis temas:** se guardan en Supabase (tabla `design_presets`, solo admin).
- Cargar un tema no cambia la página: hay que tocar **Aplicar a la página**, que guarda y verifica.

## Física y forma (panel → Diseño y movimiento → Física y forma)

| Parámetro | Rango | Por defecto | Qué controla |
| --- | --- | --- | --- |
| Radio de esquinas | 8–40 px | 20 | `--card-r` en tarjetas y paneles |
| Suavizado continuo | 1–2.6 | 1.7 | `corner-shape: superellipse(--sq)` |
| Desenfoque del vidrio | 0–40 px | 24 | `--glass-blur` (máx. 12 px en celular) |
| Brillo especular | 0–1 | .5 | `--spec`: borde de luz y reflejo |
| Refracción | 0–120 | 46 | Lente SVG de la barra (Chrome/Edge) |
| Bisel | 4–40 px | 16 | Ancho del borde que refracta |
| Rigidez / Amortiguación | 80–900 / .3–1.2 | 300 / .72 | Genera `--m-spring` (linear()) y alimenta los muelles en JS |
| Gelatina | 0–1 | .5 | Aplastado al presionar y rebote al soltar (propiedad `scale`) |

## Rendimiento (noviembre 2026)

- Sin filtros SVG en vivo en Tinta china (eran la causa principal de lentitud); la gota de tinta es un degradado.
- WebGL de tinta: 3 octavas, 28–36 % de resolución, máximo 30 fps, se detiene fuera del estilo.
- Partículas del hero: color en caché, pausa fuera de pantalla y cuando están ocultas, menos puntos en celular.
- Animaciones de interacción (estela, inclinación 3D, barra de pestañas) se detienen en reposo.
- Vidrio a máx. 12 px de desenfoque en celular. (Se descartó `content-visibility` porque desajusta los saltos a cada sección.)
- Formulario Tally se carga solo al acercarse a esa sección.
