# Rabbit Hole: El Pivot hacia AEC Tech — Construyendo 'El Arquitecto Algorítmico'

Durante mis primeros años modelando en Revit, viví el mismo dolor que sufren el 90% de las firmas de arquitectura: proyectos estancados en el "Infierno del LOD 300". Ajustar un plano para cumplir con los estrictos códigos de zonificación del [[NYC DOB]] significaba horas de revisión manual, corrección de polígonos, extracción de datos tediosa y detección visual de choques.

La arquitectura es una disciplina creativa, pero la producción de documentos constructivos es, en su núcleo, un problema de gestión de datos espaciales. Y los humanos somos terribles procesando datos repetitivos. La tecnología no.

Mi transición comenzó integrando [[Dynamo]] para automatizar extracciones geométricas. Pasé de contar áreas manualmente a diseñar scripts que recalculaban índices de ocupación y retiros en tiempo real. Pero el verdadero cambio de paradigma ocurrió este último año. Me hice una pregunta: *¿Qué pasa si conectamos el rigor geométrico del modelo BIM con la capacidad de razonamiento de un modelo de lenguaje (LLM)?*

Así nació lo que llamo mi "Trinidad" operativa: sistemas donde utilizo IA no para escribir textos, sino para orquestar y generar scripts de validación dentro de Revit. Mediante [[Prompt Chaining]], la IA escribe el código que audita el modelo por mí. Esto transforma un [[QA/QC]] manual de 10 horas en un script de 10 minutos.

Startups de PropTech y ConTech están levantando millones para resolver el problema del cumplimiento normativo. Sin embargo, muchas fallan en la implementación porque los ingenieros de software no entienden cómo piensa un arquitecto, y los arquitectos no saben cómo estructurar datos.

Si diriges un equipo de producto en una startup ConTech, o lideras el CORE Studio en una firma buscando cerrar la brecha entre la producción BIM y la IA, la automatización del código de construcción no es el futuro; es un script que ya podemos empezar a correr hoy.
