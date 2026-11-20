# Calidad · estándares y proceso de verificación

Todo cambio al sitio se verifica **antes** de publicarse, para que lo nuevo nazca optimizado y no haya que volver a optimizarlo después.

## Proceso (cada publicación)

1. Hacer el cambio en la rama de trabajo.
2. Correr el verificador:
   ```bash
   python3 -m http.server 8765 &
   node qa/check.js
   ```
   Revisa cada página del `sitemap.xml`, el panel, el inventario y las 13 demos, en **celular (iPhone)** y **computador**. Escribe `qa/REPORTE.md`.
3. Si algo sale ✗, se corrige y se vuelve a correr. Solo se publica con todo en ✓ (o con la excepción anotada abajo).
4. Publicar (merge/push a `main`) y comprobar en vivo que promii.co y los subdominios responden.
5. Actualizar `docs/PROYECTO.md` y la copia en Drive.

## Qué revisa el verificador

| Revisión | Estándar |
| --- | --- |
| Errores de JavaScript | 0 |
| Recursos rotos (404) del propio sitio | 0 |
| Desbordamiento horizontal | 0 px (nada se sale de la pantalla en celular) |
| Encabezado/navegación y pie | Presentes en todas las páginas (barra común `assets/site-shell.js`, o la propia del portafolio/bienvenida; píldora "← Lab" en las demos) |
| Título y descripción | Presentes (SEO y al compartir) |
| Imágenes | Todas con texto alternativo (`alt`) |
| Enlaces internos | Ninguno roto |
| Peso de la página | ≤ 1,6 MB transferidos |
| Fluidez | ≥ 50 cuadros por segundo al recorrer la página con el procesador 4× más lento (simula un celular medio) |

## Reglas de diseño y movimiento (para que todo nazca fluido)

1. **Nada se mueve detrás del vidrio** fuera de la portada. Los fondos animados se pausan al salir del hero.
2. Las animaciones de interacción **se duermen** cuando no hay movimiento (rAF que se apaga en reposo).
3. Solo se animan `transform` y `opacity`. Nada de filtros SVG ni `blur` animado en vivo.
4. Todo respeta `prefers-reduced-motion`.
5. Squircles, radios, muelles y gelatina salen de los tokens (`assets/promii-config.js`), no de valores sueltos.
6. Toda página nueva carga `assets/site-shell.js` y se agrega a `PROMII_SITE` (aparece sola en la barra, el pie y el mapa de home.promii.co) y a `sitemap.xml`.
7. Toda página nueva usa rutas que funcionen en promii.co y en los subdominios.
8. Textos sin nombres de empleadores o clientes en Bitácora y Academy.

## Pendiente conocido

- **Portafolio (`/`) y Lab (`/lab/`) en celular:** 34–41 fps y 45 fps al recorrerlo entero con el procesador 4× más lento (meta 50). En reposo va a 60 fps. Hay que perfilar qué sección baja el promedio al hacer scroll.
