/* Configuración de Promii Analytics.
   1) Crea un proyecto en supabase.com y ejecuta analytics/schema.sql en el SQL Editor.
   2) Copia aquí "Project URL" y la clave "anon public" (Settings → API). Esa clave es pública por diseño:
      las reglas del esquema solo le permiten AGREGAR eventos, nunca leerlos.
   Mientras queden los valores __POR_CONFIGURAR__, no se registra nada y el panel abre en modo de ejemplo. */
window.PROMII_ANALYTICS = {
  url: 'https://lcahlrunxtgbghxauwoy.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYWhscnVueHRnYmdoeGF1d295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxODAzOTYsImV4cCI6MjExMDc1NjM5Nn0.gJ3wl9R9BjIpafbxJco2Wcl4kM24_s36liSy5t-M1A4'
};

/* Correos (lista de espera y newsletter) → MailerLite.
   En MailerLite: Forms → Embedded forms → crea un formulario → "HTML code". En la URL de "action"
   (https://assets.mailerlite.com/jsonp/NUMERO_CUENTA/forms/NUMERO_FORM/subscribe) están los dos números.
   Campos personalizados usados: "interests" y "signup_source".
   Mientras no se configure, los correos siguen llegando a hi@promii.co como hoy. */
window.PROMII_FORMS = {
  mailerlite: { account: '2812008', form: '204666721303266364' }  // grupo "Web promii.co"
};
