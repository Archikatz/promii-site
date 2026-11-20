/* Configuración de Promii Analytics.
   1) Crea un proyecto en supabase.com y ejecuta analytics/schema.sql en el SQL Editor.
   2) Copia aquí "Project URL" y la clave "anon public" (Settings → API). Esa clave es pública por diseño:
      las reglas del esquema solo le permiten AGREGAR eventos, nunca leerlos.
   Mientras queden los valores __POR_CONFIGURAR__, no se registra nada y el panel abre en modo de ejemplo. */
window.PROMII_ANALYTICS = {
  url: '__POR_CONFIGURAR__',
  key: '__POR_CONFIGURAR__'
};

/* Correos (lista de espera y newsletter) → MailerLite.
   En MailerLite: Forms → Embedded forms → crea un formulario → "HTML code". En la URL de "action"
   (https://assets.mailerlite.com/jsonp/NUMERO_CUENTA/forms/NUMERO_FORM/subscribe) están los dos números.
   Crea también un campo personalizado "interests" y otro "source" (Subscribers → Fields).
   Mientras no se configure, los correos siguen llegando a hi@promii.co como hoy. */
window.PROMII_FORMS = {
  mailerlite: { account: '__POR_CONFIGURAR__', form: '__POR_CONFIGURAR__' }
};
