# promii.co — Documento maestro para LinkedIn

*Todo lo que construimos en el sitio, con datos verificables, para escribir un post o un artículo. Actualizado: 20 de noviembre de 2026.*

---

## 1. La historia en una frase

Convertí un portafolio estático en una **plataforma viva que se administra sola**. Tiene tres estilos visuales con la misma física, una gota de agua que funciona como lupa y un panel para cambiar el diseño sin tocar código. A su alrededor hay un blog, una academia, juegos y una página de bienvenida con gravedad entre gotas. Lo construí conversando con un agente de IA, sobre todo desde el celular.

**Otras formas de decirlo (para el gancho):**
- "Soy arquitecto, no programador. Este mes construí con IA un sitio que mide, se verifica y se rediseña solo."
- "Mi portafolio ahora tiene física: gravedad, inercia, choques y una gota que es lupa."
- "El trabajo que más me enseñó este mes no fue en Revit. Fue rehacer mi portafolio con un agente de IA."

---

## 2. Contexto: por qué lo hice

- **Quién:** Brian Zuleta, arquitecto, especialista BIM y constructor de sistemas con IA. Trabaja entre Nueva York y Bogotá. Su marca es Promii / Studio Brian Zuleta, y su universo de arte es ArchiKatz.
- **Punto de partida:** el portafolio era una página bonita pero quieta:
  - mostraba proyectos, experiencia y un formulario;
  - no sabía quién lo visitaba ni capturaba correos;
  - cada cambio de diseño significaba tocar código.
- **Objetivo:** que la página se sintiera viva y cambiara de "piel" sin rehacerla, que dijera qué funciona y que fuera la puerta de entrada a todo su ecosistema: servicios, blog, academia, arte y juegos.

---

## 3. Cronología (cómo creció)

1. **Laboratorio primero.** Antes de tocar la página: un **Motion Lab** con 13 demos independientes. Hoy son 14:
   - vidrio con refracción real, esquinas squircle y barra de pestañas líquida;
   - botones que se dividen en gotas, física de muelles y planos que se dibujan solos;
   - scroll animado, fondo WebGL, tarjetas 3D, tipografía cinética y transiciones fluidas;
   - un edificio BIM que se separa por niveles;
   - la más nueva: gravedad entre gotas.
2. **Animación sin reemplazar lo que funcionaba.** Se mantuvieron los dibujos de proyectos que se trazan solos, y el lenguaje de plano se extendió a todo: cotas A-01, A-02…, una línea de tiempo que se llena y la ruta Nueva York–Bogotá.
3. **Contenido y negocio.** Dos caminos claros ("Contratar a Brian" y "Trabajar con Promii"), casos contados como productos, ecosistema y lista de espera.
4. **Medición.** Analítica propia sin cookies, contador de visitas y captura de correos con MailerLite.
5. **Panel privado.** admin.promii.co, con inicio de sesión, analítica, mapa de calor y control total del diseño.
6. **Tres estilos, un sistema.** Liquid Glass, Tinta china y Obsidiana comparten la misma física.
7. **Ronda de rendimiento.** Se midió en lugar de adivinar y se llegó a 60 cuadros por segundo con la página quieta.
8. **La gota.** Una gota de agua que viaja con el scroll y funciona como lupa real. Se arrastra y explota en gotitas.
9. **Plataforma.** Llegaron la Bitácora (blog), la Academy, Promii Games y la página de bienvenida con física de N cuerpos, en 7 subdominios.
10. **Calidad automática.** Un verificador revisa 48 combinaciones de página y dispositivo antes de cada publicación.

---

## 4. Concepto y diseño

- **Arquitectura que se mueve.** El punto de partida son los dibujos técnicos, el lenguaje de un arquitecto: los planos se dibujan solos y cada título tiene su cota.
- **Liquid Glass**, el lenguaje de vidrio de iOS 26:
  - vidrio que refracta lo que tiene detrás;
  - esquinas continuas (squircles) en lugar de esquinas redondeadas comunes;
  - movimiento con **muelles**: nada dura "0,3 segundos", todo tiene rigidez y amortiguación, como un objeto físico.
- **Separar movimiento de materia.** Esta es la decisión clave. Todas las curvas, duraciones y muelles viven en unos pocos *tokens*, y los colores y texturas cambian según el estilo. Así nacieron tres estilos con los mismos botones, proporciones y física:
  - **Liquid Glass:** vidrio, luz y color sobre fondo oscuro.
  - **Tinta china:** papel con grano, nubes de tinta en WebGL, bordes de tinta y un solo color de contraste elegible.
  - **Obsidiana:** obsidiana, oro y neón cian con geometría sagrada de fondo. Sale del sistema de color de sus marcas: una gema por marca.
- **Botones gelatinosos** y una barra de pestañas tipo iOS en el celular.

---

## 5. La gota: física óptica en el navegador

- Flota sobre la palabra *promii* en la portada y viaja por la página con el scroll, estirándose según la velocidad.
- **Es una lupa de verdad:**
  - En Chrome y Edge usa un mapa de desplazamiento: una imagen invisible donde cada píxel le dice al navegador de qué punto tomar el color. En el borde, la luz se dobla más y los colores se separan un poco, como en un lente.
  - En iPhone, Safari no permite deformar el fondo de una página. La solución fue copiar en vivo lo que hay debajo de la gota, ampliarlo y alinearlo en cada cuadro. Ahora amplía cualquier parte de la página.
- **Se juega con ella:** se arrastra, se deja donde uno quiera como lupa y, si se toca rápido o se lanza con fuerza, **explota en gotitas** que se vuelven a juntar con física de muelles.
- Se ajusta desde el panel: tamaño y aumento de 1× a 2,2×.

---

## 6. Rendimiento: lo que se aprendió midiendo

- **Problema:** en el iPhone, el estilo Tinta china iba lento.
- **Método:** se simuló un celular con el procesador **4 veces más lento** y se contaron los cuadros por segundo recorriendo toda la página.
- **Dos culpables:**
  1. **Filtros recalculados en vivo.** Los bordes "a pincel" usaban un filtro de ruido en cada tarjeta. Al quitarlo, los tirones bajaron casi a la mitad.
  2. **Cosas moviéndose detrás del vidrio.** Cada tarjeta de vidrio difumina lo que tiene detrás; si el fondo se mueve, el navegador recalcula todo el vidrio en cada cuadro. Con la página quieta a mitad del scroll se pasó de **14 a 60 cuadros por segundo** solo con dejar quieto el fondo al bajar. Tinta china pasó de 22 a 60.
- **Regla que quedó:** lo que está detrás del vidrio solo se mueve en la portada. Además:
  - las animaciones se duermen en reposo;
  - el formulario de cotización se carga solo cuando el visitante se acerca;
  - solo se animan transformaciones y opacidad.

---

## 7. El panel: cambiar la página sin tocar código

En **admin.promii.co**, con inicio de sesión por correo y contraseña.

- **Analítica propia:** visitas, tiempo por sección, profundidad de scroll y mapa de calor de clics sobre la página real. Sin cookies y sin datos personales: cada visitante es un número aleatorio. Además ignora bots, vistas previas y pruebas.
- **Diseño y movimiento:**
  - cambiar entre los 3 estilos y escoger el color de contraste;
  - **11 parámetros de física y forma:** radio, suavizado squircle, desenfoque, brillo, refracción, bisel, rigidez y amortiguación de los muelles, gelatina, tamaño de la gota y aumento de la lupa;
  - un **banco de pruebas** con la palabra *promii* y la gota, que reacciona en vivo a cada control;
  - un **interruptor para cada animación**;
  - **temas:** 14 sugeridos, uno al azar y "Guardar como tema".
- **Aplicar con verificación:** el panel guarda, abre la página real por dentro y comprueba punto por punto que todo quedó como se dejó.
- **Vista previa** en computador y en celular.

---

## 8. El ecosistema que nació alrededor

| Pieza | Qué es | Dónde |
| --- | --- | --- |
| Portafolio | Experiencia, proyectos, casos, servicios, cotizador | promii.co |
| Bienvenida | Gota central que se abre en "gotas-camino" con física de N cuerpos; también es el mapa del sitio | home.promii.co |
| Bitácora | Blog con 5 entradas publicadas y una matriz de 33 ideas en 7 temas | bitacora.promii.co |
| Academy | 26 guías en 7 temas: Revit con IA, permisos en Nueva York, obra, automatización, ventas B2B, marketing y diseño web | academy.promii.co |
| Motion Lab | 14 demos de animación reutilizables | lab.promii.co |
| Promii Games | Juegos web de arquitectura: Torre de niveles y Detección de choques | games.promii.co |
| Panel | Analítica + diseño | admin.promii.co |

**La bienvenida con física.** Se toca la gota y se abre en gotas de vidrio, cada una un camino del sitio: Contratar a Brian, Trabajar con Promii, Aprender, Jugar y crear. Las gotas orbitan con:
- gravedad central y gravedad entre ellas;
- antigravedad de corto alcance, para que no se fusionen;
- giro, con su fuerza centrífuga;
- choques con rebote y deformación al impacto;
- inercia cuando se lanzan con el dedo.

Hay un panel para mover cada fuerza y un **modo tres cuerpos** que reproduce la famosa órbita en ocho (solución de Chenciner y Montgomery) con estelas de luz.

**Los juegos:**
- **Torre de niveles:** soltar cada losa en el momento justo. Lo que sobresale se cae.
- **Detección de choques:** encontrar dónde la tubería atraviesa una viga antes de que se acabe el tiempo. Es la coordinación BIM convertida en juego.

**Un sistema de tres capas para el contenido:**
- **Bitácora:** cómo lo hice.
- **Academy:** cómo lo haces tú.
- **Experiencia:** dónde lo he hecho.

Las tres comparten los mismos 7 temas.

---

## 9. Infraestructura (stack)

- **Código:** HTML, CSS y JavaScript sin frameworks; SVG y WebGL para los efectos.
- **Hosting:** GitHub Pages para promii.co y Vercel para los subdominios y el panel.
- **Base de datos y login:** Supabase, con reglas de seguridad por fila probadas: el público solo puede *agregar* eventos y solo el administrador puede leer.
- **Correo:** MailerLite, para la newsletter, las listas de espera y los avisos de Academy.
- **Dominio:** GoDaddy, con 7 subdominios por CNAME hacia Vercel.
- **Contenido:** Notion y Google Drive como fuentes. Toda la documentación tiene respaldo en Drive para retomar con cualquier IA.
- **Construido con:** Claude Code, el agente de programación de Anthropic.

---

## 10. Cómo se trabajó con IA (el ángulo más interesante para LinkedIn)

- **El rol de Brian fue de director de arte y cliente:**
  - decidir el concepto;
  - probar en su iPhone;
  - decir qué se sentía lento, qué faltaba y qué le encantaba.
- **El agente** investigaba, construía, medía, tomaba capturas y publicaba.
- **Casi todo desde el celular**, en una conversación larga y continua.
- **Iteración guiada por el teléfono.** Varios momentos reales:
  - "no veo el Liquid Glass en el iPhone" llevó al vidrio reforzado para Safari y a la barra de pestañas tipo iOS;
  - "la tinta va lenta" llevó a la medición y a la regla de nada se mueve detrás del vidrio;
  - "la gota se ve opaca" la convirtió en lupa transparente;
  - "en el iPhone no amplía" llevó a la lupa por copia en vivo;
  - "la sección se ve vacía" llevó a encontrar un fallo de Safari con las animaciones de entrada y a ponerle una red de seguridad.
- **Calidad como proceso, no como corrección.** El verificador automático revisa 48 combinaciones de página y dispositivo antes de publicar:
  - errores, recursos rotos y desbordes en celular;
  - navegación, SEO, enlaces y peso;
  - fluidez con el procesador 4× más lento.

  En su primera corrida encontró 3 problemas reales que se corrigieron antes de publicar.
- **Todo documentado** en GitHub y en Google Drive, para poder retomarlo con cualquier IA o persona.

---

## 11. Números clave (verificables)

| Dato | Valor |
| --- | --- |
| Estilos visuales con la misma física | 3 |
| Parámetros de física y forma editables | 11 |
| Temas sugeridos en el panel | 14 |
| Demos en el Motion Lab | 14 |
| Fluidez con la página quieta, antes → después | 14 → 60 cuadros por segundo |
| Tinta china, antes → después | 22 → 60 cuadros por segundo |
| Aumento de la lupa | 1× a 2,2× |
| Entradas publicadas en la Bitácora | 5 |
| Ideas en la matriz editorial | 33 en 7 temas |
| Guías en la Academy | 26 en 7 temas |
| Juegos | 2 |
| Subdominios | 7 (admin, home, bitacora, academy, lab, games, comunidad) |
| Revisiones automáticas antes de publicar | 48 |
| Cookies usadas por la analítica | 0 |

---

## 12. Lecciones (para cerrar el artículo)

1. **Primero un laboratorio, después el producto.** Ver cada efecto aislado permitió escoger sin miedo.
2. **Separa movimiento de materia.** Un mismo sistema da para varios estilos.
3. **Mide antes de optimizar.** El culpable casi nunca es el que uno cree.
4. **Lo bonito que se traba no sirve.** La regla de nada se mueve detrás del vidrio salió de medir.
5. **Prueba en tu teléfono, no en tu computador.** Los mejores ajustes salieron de capturas del iPhone.
6. **La IA rinde cuando tú diriges.** El agente construye rápido; el criterio, el gusto y el "esto se siente lento" siguen siendo humanos.
7. **Calidad como proceso.** Si todo pasa por un verificador antes de publicar, no hay que volver a optimizar después.

---

## 13. Ángulos para el post

| Ángulo | Para quién | Gancho |
| --- | --- | --- |
| Arquitecto + IA construye producto | Red general, reclutadores | "No soy programador. Este mes construí con IA un sitio que se mide, se verifica y se rediseña solo." |
| Rendimiento | Diseñadores, desarrolladores | "Mi página iba a 14 cuadros por segundo. El culpable era un fondo que casi no se movía." |
| Física en la web | Creativos, diseño | "Mi menú tiene gravedad: gotas de vidrio que orbitan, chocan y obedecen al problema de los tres cuerpos." |
| BIM convertido en juego | AEC, BIM managers | "Convertí la detección de choques de BIM en un juego de 30 segundos." |
| Dirigir a un agente de IA | Líderes, gerentes | "Mi rol fue director de arte. Estos son los 5 mensajes que más cambiaron el resultado." |

---

## 14. Borradores listos para adaptar

### Post corto (≈1.300 caracteres)

> Mi portafolio era bonito pero quieto. No sabía quién lo visitaba y cada cambio era tocar código.
>
> Este mes lo rehice con un agente de IA (Claude Code), casi todo desde mi celular. Mi rol: director de arte. Su rol: construir, medir y publicar.
>
> Lo que salió:
> • 3 estilos visuales (Liquid Glass, Tinta china, Obsidiana) con la misma física
> • Una gota de agua que funciona como lupa real y explota en gotitas si la lanzas
> • Un panel donde cambio el diseño, la física y las animaciones sin tocar código, y que verifica solo que todo quedó bien
> • Analítica sin cookies con mapa de calor
> • Blog, academia con 26 guías, juegos de arquitectura y una bienvenida donde el menú son gotas con gravedad
>
> La lección que más me sirvió: medir antes de optimizar. La página iba a 14 cuadros por segundo. El culpable no era lo que yo creía: era un fondo que se movía detrás del vidrio. Lo dejé quieto al bajar y pasó a 60.
>
> Soy arquitecto, no programador. La IA construye rápido; el criterio sigue siendo nuestro.
>
> → promii.co (toca la gota en home.promii.co)
>
> #Arquitectura #BIM #IA #DiseñoWeb #ClaudeCode #LiquidGlass

### Esqueleto de artículo largo

1. **Título:** "Cómo construí con IA un portafolio que se administra solo (y lo que aprendí midiendo)"
2. **Apertura:** el portafolio quieto y las tres preguntas que no podía responder.
3. **El concepto:** arquitectura que se mueve, Liquid Glass y separar movimiento de materia. *Imagen: los 3 estilos.*
4. **La gota:** óptica en el navegador y la solución para iPhone. *Imagen: la lupa sobre la "o".*
5. **Medir:** de 14 a 60 cuadros por segundo. *Imagen o gráfica: antes y después.*
6. **El panel:** física, temas y "Aplicar y verificar". *Imagen: el panel.*
7. **La plataforma:** Bitácora, Academy, juegos y la bienvenida con gravedad. *Video corto: las gotas orbitando.*
8. **Trabajar con un agente:** el rol de director y los mensajes que cambiaron el resultado.
9. **Calidad como proceso:** el verificador.
10. **Lecciones** (sección 12) y **CTA**: visita, suscríbete a la Bitácora o escríbeme si tu estudio quiere algo así.

---

## 15. Material visual disponible

En el repositorio y publicado en la web:

- Portada Liquid Glass: https://promii.co/bitacora/img/glass.jpg
- Tinta china: https://promii.co/bitacora/img/ink.jpg
- Obsidiana: https://promii.co/bitacora/img/gem.jpg
- La gota como lupa: https://promii.co/bitacora/img/lupa.jpg
- La gota explotando: https://promii.co/bitacora/img/explota.jpg
- El panel: https://promii.co/bitacora/img/panel.jpg
- Órbita de tres cuerpos: https://promii.co/lab/posters/14-gravedad.jpg
- Imagen para compartir: https://promii.co/assets/og.jpg

**Sugerencias de video** (grabar desde el iPhone): tocar la gota en home.promii.co y lanzar una gota; arrastrar la lupa sobre la palabra promii; cambiar de estilo desde el panel y tocar "Aplicar".

---

## 16. Enlaces

- Sitio: https://promii.co
- Bienvenida (gotas con física): https://home.promii.co
- Modo tres cuerpos: https://promii.co/home/?tres=1
- Bitácora: https://bitacora.promii.co
- Artículo completo del proceso: https://promii.co/bitacora/?p=como-construi-promii
- Academy: https://academy.promii.co
- Motion Lab: https://lab.promii.co
- Juegos: https://games.promii.co

---

## 17. Cuidados al publicar

- No mencionar empleadores ni clientes por nombre. Los casos van como "10+ obras multifamiliares", etc.
- No mostrar el panel con datos reales de visitantes. La captura del panel es de ejemplo.
- La herramienta se llama **Claude Code**, de Anthropic.
- Las cifras de esta página son las medidas en el proyecto; no redondearlas hacia arriba.
