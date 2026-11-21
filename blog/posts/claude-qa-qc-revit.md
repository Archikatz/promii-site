# Claude dentro de Revit: Automatizando el Control de Calidad (QA/QC) del Modelo

El Control de Calidad [[QA/QC]] es el cuello de botella más costoso en la producción de documentos constructivos. Revisar manualmente que todas las familias tengan los parámetros correctos, que no haya elementos huérfanos o que las nomenclaturas de planos cumplan los estándares de la firma consume horas facturables críticas.

En lugar de depender del ojo humano, construí un flujo de trabajo que inyecta la capacidad analítica de Claude (vía API o Model Context Protocol) directamente en el ecosistema de Revit.

## El Flujo de Trabajo Técnico

1. **Extracción de Datos Espaciales:** Utilizo [[Dynamo]] y Python para extraer la metadata del modelo (Schedule Data, Room Boundaries, Family Parameters) y exportarla a un formato JSON limpio.
2. **Inyección del Prompt ([[Prompt Chaining]]):** Se envía el JSON a Claude junto con el "Libro de Reglas" de la firma (ej. reglas de nomenclatura, alturas mínimas libres, códigos de incendio).
3. **Auditoría Automatizada:** La IA devuelve un reporte estructurado señalando exactamente qué IDs de elementos en Revit están violando las reglas, generando una lista de tareas (To-Do list) para el modelador.

Este flujo no reemplaza al BIM Manager; le otorga un "co-piloto" que audita la data invisible del modelo en segundos, permitiendo que el equipo se enfoque en la coordinación constructiva real, no en corregir letras minúsculas en un cajetín.
