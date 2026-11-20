Mi portafolio era una página bonita pero quieta. Tenía mis proyectos, mi experiencia y un formulario, pero no sabía quién la visitaba, no capturaba correos y cada cambio de diseño significaba tocar código. Quería algo distinto: una página que se sintiera viva, que pudiera cambiar de piel sin rehacerla y que me dijera qué funciona. Esta es la historia de cómo la construí.

## El concepto: arquitectura que se mueve

Soy arquitecto, así que empecé por lo que conozco: los dibujos técnicos. Mis proyectos ya se mostraban como planos de línea que se dibujaban solos al aparecer, y eso era lo que más me gustaba. En lugar de reemplazarlo, decidí extender ese lenguaje a toda la página: cotas de plano bajo cada título (A-01, A-02…), una línea de tiempo que se llena al bajar, íconos que se trazan y una ruta entre Nueva York y Bogotá, las dos ciudades entre las que trabajo.

Sobre esa base puse una segunda capa: **Liquid Glass**, el vidrio líquido que Apple presentó en iOS 26. Vidrio que refracta lo que tiene detrás, esquinas continuas (squircles) en lugar de esquinas redondeadas comunes, y movimiento basado en **muelles**: nada dura "0,3 segundos", todo tiene rigidez y amortiguación, como un objeto físico.

![Liquid Glass: la portada con la gota sobre el fondo](img/glass.jpg)

## Primero un laboratorio, después la página

Antes de tocar la página construí un **Motion Lab**: 13 demos independientes para probar cada idea por separado. Vidrio con refracción real, esquinas squircle, una barra de pestañas con indicador líquido, botones que se dividen en gotas, física de muelles, un plano que se dibuja, animaciones ligadas al scroll, un fondo WebGL, tarjetas 3D, tipografía cinética, transiciones fluidas y un edificio que se separa por niveles.

Ver cada efecto aislado me permitió escoger sin miedo. Al final me gustaron todos, así que los llevé a la página uno por uno, cada uno con un interruptor para apagarlo.

## Tres materias, un mismo sistema

La decisión más importante fue separar el **movimiento** de la **materia**. Todas las curvas, duraciones y muelles viven en unos pocos tokens; los colores y texturas cambian según el estilo. Así nacieron tres estilos que comparten los mismos botones, proporciones y física:

- **Liquid Glass**: vidrio, luz y color sobre fondo oscuro.
- **Tinta china**: papel con grano, nubes de tinta que se mueven en WebGL, bordes de tinta y un único color de contraste que yo escojo.
- **Obsidiana**: obsidiana, oro y neón cian, con geometría sagrada de fondo. Viene del sistema de color que definí para Promii y ArchiKatz: una gema por marca (oro para Promii, magenta para ArchiKatz, zafiro, ámbar).

![Tinta china: papel, tinta y un trazo de pincel bajo el titular](img/ink.jpg)

![Obsidiana: oro y neón sobre obsidiana](img/gem.jpg)

## La gota: física óptica en el navegador

El elemento que más me gusta es la **gota de agua**. Flota sobre la palabra *promii* en la portada y luego viaja por la página mientras haces scroll, estirándose según la velocidad, como una gota real.

Funciona como una **lupa**. En Chrome y Edge usa un mapa de desplazamiento: una imagen invisible donde cada píxel le dice al navegador de qué punto debe tomar el color. Para ampliar, cada punto dentro de la gota toma el color de un punto más cercano al centro; en el borde, la luz se dobla con más fuerza y los colores se separan un poco, como en un lente de verdad.

![La gota como lupa: amplía la "o" de promii](img/lupa.jpg)

En iPhone, Safari no permite deformar el fondo de una página web. En vez de rendirme, la gota usa una copia de la palabra *promii*, ampliada y recortada en forma de círculo, que se alinea con la palabra real mientras la mueves. Sobre el resto de la página se ve como una gota transparente con borde de luz.

Y se puede jugar con ella: la arrastras y la dejas donde quieras para usarla como lupa. Si la tocas rápido o la lanzas con fuerza, **explota en gotitas** que salen volando y se vuelven a juntar con física de muelles.

![La gota explota en gotitas que se vuelven a unir](img/explota.jpg)

## Que sea fluido: lo que aprendí midiendo

Un efecto bonito que se traba no sirve. Cuando probé la página en mi iPhone, el estilo Tinta china iba lento, así que medí en lugar de adivinar: simulé un celular con el procesador cuatro veces más lento y recorrí toda la página contando cuadros por segundo.

Encontré dos culpables:

1. **Filtros que se recalculan en vivo.** Los bordes "a pincel" de Tinta china usaban un filtro de ruido en cada tarjeta, y el navegador lo recalculaba al hacer scroll. Lo quité: los tirones bajaron casi a la mitad.
2. **Cosas que se mueven detrás del vidrio.** Cada tarjeta de vidrio difumina lo que tiene detrás. Si el fondo se mueve, aunque sea despacio, el navegador tiene que recalcular el vidrio de todas las tarjetas en cada cuadro. Con la página quieta a mitad del scroll, pasaba de 14 cuadros por segundo a **60** solo con dejar el fondo quieto al bajar.

La regla que me quedó: **lo que está detrás del vidrio solo se mueve en la portada**, donde luce. Al bajar, todo se queda quieto y la página va a 60 cuadros por segundo en los tres estilos. Además, cada animación de interacción se duerme cuando no hay movimiento y el formulario de cotización solo se carga cuando te acercas.

## Un panel para jugar con la página

La segunda mitad del proyecto no se ve: es un **panel privado** donde controlo la página sin tocar código.

![El panel: banco de pruebas, física y vista previa](img/panel.jpg)

Desde ahí:

- Cambio entre los tres estilos y escojo el color de contraste.
- Muevo la **física**: radio de las esquinas, suavizado squircle, desenfoque y brillo del vidrio, refracción, rigidez y amortiguación de los muelles, cuán gelatinosos se sienten los botones, tamaño y aumento de la gota. Un banco de pruebas con la palabra *promii* y la gota reacciona en vivo a cada control.
- Enciendo o apago cada una de las animaciones.
- Guardo combinaciones como **temas**, genero combinaciones al azar o uso temas sugeridos.
- Toco **Aplicar** y el panel guarda, abre la página real por dentro y **verifica** punto por punto que todo quedó como lo dejé.

También veo la **analítica**: visitas, tiempo por sección, hasta dónde baja la gente y un mapa de calor de clics sobre la página real. Sin cookies y sin datos personales: cada visitante es un número aleatorio.

## Cómo lo hice

Lo construí conversando con **Claude Code**, el agente de programación de Anthropic, en una sola sesión larga desde mi celular. Mi papel fue el de director de arte y cliente: decidir el concepto, probar en mi iPhone, decir qué se sentía lento o qué faltaba. El agente investigaba, construía, medía y me mostraba capturas antes de publicar.

El proceso fue iterativo: primero el laboratorio de demos, luego la capa de animaciones nuevas sobre lo que ya existía, después el contenido, la analítica y el panel, y al final rondas de ajustes guiadas por lo que veía en el teléfono. Cada cambio quedó registrado en GitHub y documentado para poder retomarlo con cualquier IA.

**Herramientas:** HTML, CSS y JavaScript sin frameworks, SVG y WebGL para los efectos, Supabase para la base de datos y el inicio de sesión, MailerLite para los correos, GitHub Pages y Vercel para publicar, y Claude Code para construirlo todo.

## Lo que sigue

La página ahora es una plataforma: este blog, una academia, una comunidad y una tienda de arte ArchiKatz en camino. Y un rincón de juegos web ligeros, también hechos con IA.

Si quieres recibir el próximo caso cuando lo publique, suscríbete a la Bitácora al final de esta página.
