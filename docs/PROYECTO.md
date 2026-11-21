# Proyecto promii.co: historia, decisiones y lo que sigue

Respaldo de la sesión de trabajo del **20 de noviembre de 2026** (Claude Code, rama `claude/happy-franklin-y53vk6`). Sirve para retomar desde cualquier cuenta de Claude u otra IA.

## 1. Quién y qué

- **Dueño:** Brian Zuleta, arquitecto matriculado (CPNAA), especialista BIM, Bogotá. Inglés C1. Contacto público: hi@promii.co.
- **Marcas:** Promii (empresa-producto: servicios productizados de arquitectura, BIM e IA) · Studio Brian Zuleta (práctica de arquitectura) · ArchiKatz (IP creativa: arte, editorial, tienda).
- **Regla de Notion:** Promii es independiente de MSI. No mezclar assets ni mencionar MSI en la web de Promii.
- **Sitio:** promii.co (GitHub Pages desde `Archikatz/promii-site`, archivo único `index.html`, ES/EN, claro/oscuro).

## 2. Lo que pidió Brian (en sus palabras, resumido)

1. Una página **híper fluida**, con animaciones, que deje de ser estática. **Liquid Glass** como estilo principal, con **proporciones redondas tipo Apple**.
2. Investigar qué se puede hacer y ver **demos**, guardadas como **colección reutilizable**.
3. **No reemplazar** lo que ya le gusta (los dibujos animados de proyectos y los efectos actuales): **agregar** animaciones en otros lugares.
4. Un **inventario de animaciones** dentro del sitio para clasificarlas, editarlas a la vez y verificar que tengan el mismo estilo.
5. Actualizar la experiencia en **KBM Realty** (terminó en noviembre de 2026) y modernizar los textos (marketing).
6. Publicar más proyectos y un briefing de lo reciente, usando Notion y Drive.
7. Redes de arte (Behance, LinkedIn, Instagram), newsletter, tienda ArchiKatz (Shopify), ArchiKatz Magazine, Academy, Comunidad Promii.
8. **Contador de visitas, SEO y captura de correos** (estilo GoHighLevel).
9. **Panel de administrador privado** con correo y contraseña: visitas, tiempo de navegación, dónde hacen clic. Mismo diseño. Idealmente en `admin.promii.co`.
10. Desde el panel, **encender y apagar cada animación** y cambiar entre **dos estilos gráficos**: Liquid Glass (principal) y **Tinta china híper fluida** negra con **un color de contraste personalizable**. Mismo sistema de movimiento, botones y proporciones.
11. Usar una **carpeta de Google Drive** como repositorio del proyecto y dejar **READMEs de respaldo**.

## 3. Decisiones tomadas

| Tema | Decisión | Por qué |
| --- | --- | --- |
| Panel y datos | **Supabase** (Auth + Postgres con RLS) | GitHub Pages no protege páginas ni guarda datos. Con RLS los datos quedan protegidos aunque el HTML del panel sea público. |
| Hosting del panel | `promii.co/admin` funciona ya; `admin.promii.co` vía **Vercel** | Vercel permite el subdominio con una regla por host (`vercel.json`). |
| Correos | **MailerLite** (elegido por Brian sobre GHL) | Grupo "Web promii.co", campos `interests` y `signup_source`. |
| Enfoque de textos | **Ambos públicos**: "Contratar a Brian" (reclutadores) y "Trabajar con Promii" (clientes) | Dos caminos desde el hero. |
| Animaciones | Capa aditiva ("Motion+") sobre lo existente | Brian quiere conservar lo actual. |
| Estilos | `data-style="glass"` o `"ink"` en `<html>`, mismos tokens de movimiento | Un sistema, dos materias. |
| Privacidad | Sin cookies ni datos personales; id aleatorio; respeta Do Not Track | Analítica respetuosa sin banner. |

## 4. Lo que se construyó (en orden de commits)

1. **Motion Lab** (`lab/`): 13 demos independientes con catálogo, vista en vivo, ver/copiar código y selección. Liquid Glass (refracción real con SVG en Chromium; vidrio esmerilado en Safari/Firefox), squircles, barra de vidrio, gooey, muelles, plano que se dibuja, scroll-driven, shader WebGL, tarjetas 3D, tipografía cinética, View Transitions, microinteracciones, niveles BIM en 3D.
2. **Motion+** en la página: los dibujos de proyecto siguen vivos después de dibujarse (pulsos IA, ventanas NYC, radar urbano, destello en curva), cotas A-01… bajo cada título, línea de tiempo que se llena con el scroll, íconos que se dibujan, ruta Nueva York ↔ Bogotá.
3. **KBM** actualizado a *Ago – Nov 2026* con el logro de 10+ proyectos multifamiliares (de la hoja de vida 2026). "9+" pasó a "10+" años.
4. **Tokens de movimiento** (`--m-ease`, `--m-draw`, `--m-spring`) e **inventario** (`lab/inventario.html`, 35 animaciones, marca las que se salen del sistema).
5. **Analítica propia**: `analytics/track.js`, `analytics/schema.sql`, `admin/` con KPIs, visitantes por día, tiempo por sección, clics, scroll, origen, dispositivo/idioma, **mapa de calor sobre la página real** y actividad reciente.
6. **Contenido nuevo**: hero con dos caminos, sección **Ahora** (KBM, Claude ↔ Revit, ArchiKatz Editorial, Promii Academy), sección **Ecosistema** (Promii, Studio BZ activos; tienda, magazine, academy, comunidad "próximamente" con **lista de espera**), redes agrupadas, aviso único de redes de arte, contador de visitas, proyecto **Casa Vértice**.
7. **Supabase** (`promii-analytics`) creado y probado; **MailerLite** configurado; **SEO** (canonical, hreflang, Open Graph, JSON-LD, robots, sitemap, `?lang=en`).
8. **Sistema de estilos**: `assets/promii-config.js` + estilo **Tinta china** (papel, bordes a pincel, nubes de tinta WebGL, trazo de pincel en el titular, estela de tinta del cursor, gota al hacer clic) + interruptores por animación.
9. **Panel → Diseño y movimiento**: elegir estilo, color de contraste, apagar/encender cada animación, vista previa en vivo y "Guardar y publicar" (solo admin).

10. **Ronda de cierre:** las 4 alertas del inventario corregidas (0 pendientes). Del Lab al sitio: esquinas continuas, refracción Liquid Glass en la barra de navegación (Chrome/Edge), contacto líquido flotante, inclinación 3D con brillo en proyectos y transición fluida a detalle. Nueva sección **Casos** con 6 sistemas contados como productos y suscripción a la **Bitácora Promii**. Imagen Open Graph (`assets/og.jpg`). Documento de créditos para CV/LinkedIn y calendario editorial (`docs/CREDITOS.md`). Carpeta de Drive "promii.co · Sitio web (repositorio)" con estos documentos.

11. **Publicación y ajustes (20-nov-2026, tarde):** publicado en promii.co (PR #1–#5). brianzuleta.co → promii.co en la página (el dominio se perdió; recordatorio para recomprarlo el 20-dic-2026). Adaptación por dispositivo: barra superior en píldora flotante y barra de pestañas tipo iOS en celular; vidrio reforzado en Safari/iPhone. Panel: **Aplicar a la página** con verificación en la página real, vista previa Computador/Celular, **Temas** (sugeridos, 🎲 aleatorio, Mis temas en Supabase `design_presets`).
12. **Ronda de rendimiento y física:** Tinta china sin filtros SVG en vivo; nubes de tinta, orbes y destello solo se animan en la portada (detrás del vidrio nada se mueve al bajar → 60 fps medidos en mitad y final de página, antes 14–22). Animaciones de interacción duermen en reposo; Tally diferido; barra de pestañas medida con offsetLeft y muelles más rápidos. **Física y forma** en el panel (radio, squircle, desenfoque, brillo, refracción, bisel, rigidez, amortiguación, gelatina, tamaño de la gota) con **banco de pruebas** (palabra promii + gota arrastrable). **Botones gelatinosos.** **Tercer estilo Obsidiana** (SOP-001: obsidiana + oro #E8B23A + neón #22E0C8, gemas por marca) con temas Obsidiana Promii, ArchiKatz magenta, Michi zafiro, Lumen ámbar. **Palabra promii gigante** en el hero y **gota de agua viva** que viaja con el scroll.

13. **Gota lupa interactiva:** la gota es una lupa transparente (sin desenfoque) en los tres estilos. En Chrome/Edge amplía lo que hay debajo con refracción real (mapa de desplazamiento de aumento + borde); en iPhone/Safari amplía la palabra promii con una copia recortada y en el resto es una gota transparente con borde de luz. Se arrastra (se queda donde la dejas hasta que haces scroll ~60 % de pantalla), un toque rápido o un lanzamiento fuerte la explota en gotitas que se vuelven a juntar con muelles. Nuevo parámetro **Aumento de la lupa** (1–2.2×) en el panel y en el banco de pruebas.

14. **Bitácora (blog):** `promii.co/bitacora` con lista de entradas y lector Markdown propio (sin librerías externas). Primera entrada: "Cómo construí un portafolio que se administra solo" (concepto, tres estilos, la gota y su óptica, rendimiento medido, panel, proceso con Claude Code) con 6 capturas reales. Enlaces desde el menú, la sección Casos y el caso "Un portafolio que se administra solo". Suscripción a MailerLite al final de cada entrada. Cómo escribir nuevas entradas: ver README.

15. **Catálogo editorial y 4 entradas nuevas (20-nov-2026, noche):** revisión de fuentes en Notion (Trinity HQ, ArchiKatz Editorial, Promii Academy, Estudio BIM Agéntico) y Drive. Matriz de 33 entradas en 7 pilares (`docs/bitacora-matriz.csv`, `docs/BITACORA-CATALOGO.md`; copia en Drive carpeta **Bitácora** como hoja de cálculo). Publicadas: "Claude trabajando dentro de Revit", "La Trinidad: el sistema operativo con el que trabajo", "De enciclopedia a sello editorial" y "Cómo convierto lo que aprendo en estrategias reutilizables", con portadas propias y en el sitemap.

16. **"Ahora" con la Bitácora y lupa real en iPhone:** la sección "En qué estoy trabajando" muestra las entradas con portada (carrusel deslizable en celular) más la tarjeta de KBM y un enlace a la Bitácora. En Safari/iPhone la gota ahora amplía cualquier parte de la página: copia las secciones que tiene debajo, las amplía y las alinea en cada cuadro (sin costo extra medido). En Chrome/Edge sigue la refracción real.

17. **Subdominios conectados (20-nov-2026):** CNAME en GoDaddy → Vercel para admin, bitacora, lab, academy, comunidad y games (Vercel: los 6 verificados, sin conflictos). `admin` abre el panel; `bitacora` y `lab` redirigen a promii.co/bitacora y promii.co/lab; `academy`, `comunidad` y `games` redirigen a promii.co/#ecosistema hasta que tengan página propia (cambiar en `vercel.json`).

18. **Academy y mapa de contenido:** página `promii.co/academy` (academy.promii.co redirige ahí) con 26 guías en 7 temas (3 disponibles, enlazadas a la Bitácora) y suscripción a MailerLite (interests=academy). Mapa de tres capas Bitácora / Academy / Experiencia en `docs/MAPA-CONTENIDO.md`. La tarjeta Academy del Ecosistema ahora está activa.

19. **Juegos, bienvenida, barra común y control de calidad:** Promii Games (`/games/`, games.promii.co) con Torre de niveles y Detección de choques (eventos `game` en analítica). Bienvenida en `/home/` (home.promii.co): gota central que se abre en gotas-camino con física de N cuerpos (gravedad central y entre gotas, antigravedad, giro/centrífuga, choques con rebote, inercia al lanzar), controles de física y modo tres cuerpos (órbita en ocho); es también el mapa del sitio. Encabezado, menú y pie comunes (`assets/site-shell.js`, fuente única `PROMII_SITE`) en Bitácora, Academy, Lab, Juegos; píldora de regreso en las demos. Verificador `qa/check.js` + estándares en `docs/CALIDAD.md`.

20. **Matriz de imágenes (Nano Banana Pro / Google Flow):** 75 piezas (logos, perfiles, LinkedIn, YouTube, Instagram, TikTok, Facebook, X, Pinterest, Behance, web, correo, tienda ArchiKatz) con tamaño, proporción para generar, zona segura, prompt completo con bloque de estilo, negativo, texto a superponer, referencia, paleta, nombre de archivo y carpeta. Basada en las skills brand-character-director, archikatz-story-bible e higgsfield-content-factory. Hoja en Drive "Imágenes · Matriz de generación" (con subcarpetas 01_Logos…10_ArchiKatz_Tienda en "Imágenes · Generadas"); copia en `docs/imagenes/` (se regenera con `python3 docs/imagenes/generar_matriz.py salida.xlsx`). Cuando Brian suba las imágenes web (W-xx, L-03), instalarlas en el sitio.

21. **Sitio bilingüe y encabezado completo en todas las páginas:** `assets/site-shell.js` v2 con idioma ES/EN (guardado en `promii-lang`, compartido con el portafolio), modo claro/oscuro, botón de mapa (gota) y menú con secciones del portafolio; traducción por atributos `data-en`. Blog (antes "Log" en inglés) con los 5 artículos traducidos (`bitacora/posts/en/`), Academy (generador `academy/build.py`), Juegos y Home en ES/EN. La home ahora tiene encabezado y un mapa completo visible bajo las gotas; las gotas se pausan al salir de pantalla. Lupa del iPhone nítida (CSS `zoom` en vez de escalar un bitmap) y la gota sigue el scroll más rápido. El Lab conserva su contenido solo en español (barra y pie bilingües).

22. **Menú único, home más cuidada y juegos sociales:** el portafolio usa el mismo menú que todas las páginas (`site-shell.js` en modo `nav` sobre `<nav data-shell>`): Portafolio · Blog · Academy · Lab · Juegos · Contacto, con panel al pasar el mouse que describe cada opción (Portafolio y Juegos con sus secciones), botón de mapa (gota), botón de panel admin (candado → admin.promii.co), ES/EN y tema. Home: palabra promii con brillo metálico animado, eco en línea, cota de plano y gotas de vidrio como puntos de las íes; gotas más nítidas (sin desenfoque, brillo especular y sombra de color). Juegos: progreso local (partidas y récord), ranking Top 10 en Supabase (`game_scores`), retos por enlace (`?reto=&de=`) que se comparten con el menú del teléfono.

## 5. Fuentes de contenido usadas

- Drive: `Brian_Zuleta_CV_Arquitecto_de_Diseno_BIM_2026.pdf` (18-nov-2026) para KBM, años y proyectos.
- Drive: `[Gemini_Lab] Portafolio_Maestro_Unificado_Promii_OS` (29 activos en 5 verticales: productos ArchiKatz, academy, servicios).
- Notion: "Arquitectura Web del Ecosistema — brianzuleta.co + promii.co (v1)" (marcas → dominios, comunidad en Discord primero, ArchiKatz en /ecosistema).
- Notion: "ArchiKatz OS — Headquarters", "ArchiKatz Editorial" (7 volúmenes, primer libro en preparación), "Promii Academy", "Vértice 2026".

## 6. Pendiente / lo que sigue

**Brian (manual, minutos):**
- [ ] Supabase → Authentication → Users → **Add user** `hi@promii.co` con contraseña. Luego desactivar "Allow new users to sign up".
- [ ] Aprobar el acceso de Vercel al equipo `hi-2630s-projects` para crear `admin.promii.co`. Después, en GoDaddy, un **CNAME** `admin` → `cname.vercel-dns.com`.
- [ ] Decir "publícalo" para fusionar la rama en `main`.
- [ ] Después de publicar: inscribirse en la lista de espera para probar MailerLite y revisar el panel.

**Dominio brianzuleta.co (perdido por no renovar, disponible al 20-nov-2026):**
- [ ] Recomprarlo cuando haya presupuesto (≈25–35 USD/año). Recordatorio programado para el 20-dic-2026.
- [ ] Recrear el correo en ese dominio y pasar Vercel y cualquier otra cuenta a `hi@promii.co` o Gmail.
- [ ] Mientras tanto, todo enlace a brianzuleta.co se cambió por promii.co.
- [ ] Cuenta de Vercel: entrar con GitHub y cambiar el correo principal; si no se puede, cuenta nueva y recrear el proyecto (todo está en el repo).

**Pendiente inmediato (siguiente sesión):**
- [ ] Brian prueba en iPhone 17 Pro Max y en PC: fluidez de Tinta china, barra de pestañas, gota, botones gelatinosos.
- [ ] Promii Games (`games.promii.co`): portal + 2 juegos (Torre de niveles, Detección de interferencias); evento `game` en analítica (falta migración del check de `events.type`).
- [x] DNS en GoDaddy: 6 subdominios conectados a Vercel.

**Siguiente trabajo sugerido:**
- [x] Corregir las alertas del inventario.
- [x] Llevar efectos del Lab al sitio (squircles, Liquid Glass en nav, contacto líquido, tilt 3D, morph a detalle).
- [x] Sección Casos + Bitácora + créditos de CV + imagen Open Graph.
- [ ] Colección de arte ArchiKatz desde Drive (Brian escoge imágenes) y usuarios de redes de ArchiKatz.
- [ ] Comunidad: enlace de invitación a Discord tras la lista de espera.
- [ ] Tienda ArchiKatz en Shopify: enlazar cuando abra.
- [x] Número 1 de la Bitácora publicado en la web.
- [ ] Siguientes entradas de la matriz (prioridad Alta: BT-006, BT-010, BT-013, BT-017, BT-030). BT-006 necesita capturas reales de Revit.
- [ ] Enviar el número 1 por MailerLite y crear la automatización de bienvenida.
- [ ] Llevar los créditos de `docs/CREDITOS.md` a la hoja de vida y a LinkedIn.

## 7. Prompt para retomar con cualquier IA

> Estoy trabajando en promii.co (repo `Archikatz/promii-site`). Lee `README.md`, `docs/PROYECTO.md`, `docs/SISTEMA-DE-DISENO.md` y `docs/OPERACION.md`. Respeta: no reemplazar animaciones existentes, Liquid Glass es el estilo principal y Tinta china el alterno con el mismo sistema de movimiento; todo texto en ES y EN; Promii es independiente de MSI. Continúa con la sección "Pendiente" del documento.
