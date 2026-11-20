/* Configuración de Promii Analytics.
   1) Crea un proyecto en supabase.com y ejecuta analytics/schema.sql en el SQL Editor.
   2) Copia aquí "Project URL" y la clave "anon public" (Settings → API). Esa clave es pública por diseño:
      las reglas del esquema solo le permiten AGREGAR eventos, nunca leerlos.
   Mientras queden los valores __POR_CONFIGURAR__, no se registra nada y el panel abre en modo de ejemplo. */
window.PROMII_ANALYTICS = {
  url: '__POR_CONFIGURAR__',
  key: '__POR_CONFIGURAR__'
};
