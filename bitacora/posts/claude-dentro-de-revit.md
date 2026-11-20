*Esta entrada documenta un estudio en progreso. La iré actualizando a medida que avance.*

Uso Revit todos los días y gran parte del trabajo es repetitivo: revisar modelos, preparar planos, buscar choques entre disciplinas. Desde enero de 2025 estoy probando algo distinto: **conectar a Claude directamente con Revit** para que pueda leer el modelo, revisarlo y ejecutar tareas dentro de él.

## Cómo se conecta

La pieza clave es **MCP** (Model Context Protocol), un estándar abierto que permite a un modelo de IA usar herramientas externas. Hay servidores MCP para Revit que exponen el modelo: elementos, parámetros, vistas y planos. Con eso, Claude deja de ser un chat al lado y pasa a trabajar *dentro* del archivo.

Alrededor de esa conexión uso:

- **C# (Roslyn)** para scripts que se compilan y ejecutan dentro de Revit.
- **Python y Dynamo** para automatizaciones visuales y rutinas que ya tenía.
- **Veras AI** para explorar renders y variaciones de diseño desde el modelo.

## Cinco flujos que estoy probando

1. **Control de calidad (QA/QC).** Revisar parámetros vacíos, nombres inconsistentes, vistas sin plano y elementos mal clasificados, y devolver una lista de correcciones.
2. **Documentos de construcción.** Preparar planos, vistas y tablas a partir de reglas, para que el dibujante revise en lugar de armar desde cero.
3. **Detección de choques.** Encontrar interferencias entre disciplinas y resumirlas por prioridad.
4. **Diseño generativo.** Explorar opciones de distribución o volumetría a partir de restricciones.
5. **Rutinas de Python y Dynamo.** Dejar que Claude escriba o ajuste los scripts que antes hacía a mano.

## Lo que he visto hasta ahora

- **Revisar es donde más rinde.** Leer un modelo completo y decir qué está mal es justo lo que un agente hace bien y una persona hace con cansancio.
- **Hay que dar contexto.** Sin estándares claros (nombres, plantillas, parámetros) el agente adivina. Con ellos, acierta.
- **El arquitecto sigue decidiendo.** El agente propone cambios; yo los reviso antes de aplicarlos al modelo.

## Lo que sigue

Voy a publicar cada flujo por separado, con capturas y lo que funcionó y lo que no. La meta es un método replicable para oficinas pequeñas que quieren usar IA en su flujo BIM sin un equipo de desarrollo.

Si quieres recibir los próximos avances, suscríbete al final de la página.
