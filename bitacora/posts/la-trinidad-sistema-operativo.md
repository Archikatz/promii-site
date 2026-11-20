Trabajo en arquitectura, construcción, ventas B2B y proyectos propios al mismo tiempo. Durante años eso significó tener la información repartida entre correos, carpetas, notas y la memoria. La Trinidad es el sistema con el que ordené todo eso: tres piezas que se hablan entre sí para que el trabajo repetitivo se haga solo y el resto quede registrado.

## Las tres piezas

- **Notion es la memoria.** Ahí viven los proyectos, las bases de datos, los procedimientos (SOP) y las decisiones. Si algo no está en Notion, para el sistema no existe.
- **n8n es el sistema nervioso.** Los flujos de automatización mueven datos entre herramientas: algo entra, se clasifica, se transforma y llega a donde tiene que llegar.
- **Claude es el criterio.** Lee, resume, redacta y decide en los pasos donde una regla fija no alcanza: clasificar un documento, preparar un borrador, revisar si falta algo.

A esa capa de orquestación la llamo **Trinity**: el agente que conecta las tres piezas y vigila que los flujos corran.

## Un patrón que se repite: bandeja de entrada, salida y registro

Casi todas las automatizaciones siguen el mismo patrón, y es lo que más me ha servido copiar de un flujo a otro:

1. **Dropzone (bandeja de entrada).** Una carpeta o formulario donde dejo lo que hay que procesar: un PDF, una lista de contactos, una exportación.
2. **Processed (bandeja de salida).** Lo procesado sale en otra carpeta, ya renombrado, clasificado o convertido.
3. **Run logs (registro).** Cada ejecución deja un registro: qué entró, qué salió, qué falló.

Con ese patrón cualquier flujo se puede auditar. Si algo sale mal, sé exactamente en qué paso y con qué archivo.

## Lo que construí encima

- **Un paquete base de automatizaciones** (13 flujos) que cubre lo que repito cada semana: captura, clasificación, seguimientos y reportes.
- **Un formulario de entrada de flujos (Workflow Intake).** Antes de automatizar algo, lo describo: qué dispara el flujo, qué datos usa, quién recibe el resultado. Si no lo puedo describir en una página, todavía no está listo para automatizarse.
- **Un registro de flujos (Registry).** Una lista viva de qué automatizaciones existen, qué hacen y en qué estado están.
- **Un asistente de credenciales.** Una pequeña aplicación local que guía la conexión de cada servicio paso a paso, para no dejar claves regadas en notas.

## Lo que aprendí

- **Documentar primero, automatizar después.** Automatizar un proceso confuso solo lo vuelve confuso más rápido.
- **Un patrón, muchos flujos.** Repetir la misma estructura de entrada, salida y registro hace que cada flujo nuevo sea más fácil que el anterior.
- **La IA va en el paso del criterio, no en todos.** Donde una regla sirve, uso una regla. Claude entra donde hay que leer o decidir.

Este mismo sitio es un ejemplo: la analítica, la configuración del diseño y los correos de la Bitácora están conectados para que yo no tenga que tocar código.

En próximas entradas voy a abrir flujos concretos, con el diagrama y los pasos. Si te interesa, suscríbete a la Bitácora al final de la página.
