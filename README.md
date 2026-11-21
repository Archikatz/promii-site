# promii.co

Sitio de **Brian Zuleta · Promii / Studio Brian Zuleta**: portafolio de arquitectura y BIM, servicios de Promii, ecosistema (ArchiKatz, Academy, Comunidad) y un panel privado de analítica y diseño.

> **¿Eres una IA o una persona retomando el proyecto?** Lee primero [`docs/PROYECTO.md`](docs/PROYECTO.md) (historia, decisiones y lo que sigue) y después [`docs/SISTEMA-DE-DISENO.md`](docs/SISTEMA-DE-DISENO.md) y [`docs/OPERACION.md`](docs/OPERACION.md).

## Estructura

```
index.html                 Portafolio (HTML + CSS + JS en un solo archivo, ES/EN). Menú común en <nav data-shell>
home/                      Bienvenida con gotas y física (home.promii.co) + mapa del sitio
bitacora/                  Blog: index.html + posts.json + posts/*.md (ES) + posts/en/*.md (EN) + img/
academy/                   Academy: index.html generado por academy/build.py (ES/EN)
games/                     Promii Games: torre, choques, ducto, orbita, ruta + social.js (ranking, retos, tutorial, redes)
                           build_games.py genera ducto/orbita/ruta
studio/                    ArchiKatz Studio v2.0 (claves propias del usuario; modo B próximamente)
editorial/                 Universo ArchiKatz + webtoon (toon.html, episodes.json, gallery.json, img/)
lab/                       Motion Lab: 14 demos + inventario de animaciones
admin/index.html           Panel privado: analítica por áreas + Diseño y movimiento
assets/site-shell.js       Encabezado, menú, idioma, tema y pie comunes + mapa del sitio (PROMII_SITE)
assets/promii-config.js    Sistema de estilos y movimiento
analytics/                 track.js (rastreador), config.js (claves públicas), schema.sql (Supabase)
qa/check.js                Verificador de calidad (correr antes de publicar) → qa/REPORTE.md
docs/                      PROYECTO (registro y pasos siguientes), SISTEMA-DE-DISENO, OPERACION, CALIDAD,
                           CREDITOS, MAPA-CONTENIDO, BITACORA-CATALOGO, LINKEDIN-DOCUMENTO-MAESTRO, imagenes/
vercel.json                Subdominios (admin, home, bitacora, academy, lab, games, comunidad)
robots.txt, sitemap.xml    SEO
```

## Servicios conectados

| Servicio | Para qué | Identificador |
| --- | --- | --- |
| GitHub `Archikatz/promii-site` | Código y hosting actual (GitHub Pages, rama `main`) | — |
| Supabase `promii-analytics` | Analítica, configuración del sitio, login del panel | proyecto `lcahlrunxtgbghxauwoy` (us-east-1) |
| MailerLite | Newsletter y listas de espera | cuenta `2812008`, formulario `204666721303266364`, grupo "Web promii.co" |
| Vercel | Opcional: `admin.promii.co` y despliegues | equipo `hi-2630s-projects` |
| Notion / Google Drive | Fuentes de contenido (CV, portafolio, ecosistema) | ver `docs/PROYECTO.md` |

## Ver y probar en local

```bash
python3 -m http.server 8765
# Página:               http://localhost:8765/
# Estilo tinta china:   http://localhost:8765/?style=ink&accent=%23e0261b
# Panel (ejemplo):      http://localhost:8765/admin/#demo
# Motion Lab:           http://localhost:8765/lab/
```

El rastreador no envía nada desde `localhost` ni desde navegadores automatizados.

## Publicar

Los cambios se trabajan en una rama y se publican al fusionar en `main` (GitHub Pages lo sirve en promii.co).

## Escribir en la Bitácora

1. Crea `bitacora/posts/mi-entrada.md` en Markdown (títulos con `##`, listas, **negrita**, *cursiva*, `![pie de foto](img/foto.jpg)`).
2. Pon las imágenes en `bitacora/img/` (JPG de ~1200 px de ancho).
3. Agrega la entrada al inicio de `bitacora/posts.json` con `slug` (igual al nombre del archivo), `title`, `summary`, `date` (AAAA-MM-DD), `tags`, `cover` y `minutes`.
4. Publica. La entrada queda en `promii.co/bitacora/?p=mi-entrada`. Añádela también a `sitemap.xml`.

El plan editorial (33 ideas con fuente, prioridad, CTA y recursos) está en `docs/BITACORA-CATALOGO.md` y `docs/bitacora-matriz.csv`.
