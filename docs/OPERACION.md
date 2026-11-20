# Operación: servicios, accesos y mantenimiento

No hay contraseñas ni claves secretas en este repositorio. La clave de Supabase incluida es la **anon/pública** y las reglas RLS solo le permiten insertar eventos y leer la configuración pública.

## Supabase · `promii-analytics`

- Proyecto `lcahlrunxtgbghxauwoy` (us-east-1, organización "Archikatz's Org").
- Tablas:
  - `events`: eventos de analítica. Los visitantes solo **insertan**; solo los administradores leen.
  - `admins`: correos con acceso al panel (`hi@promii.co`).
  - `site_config`: estilo, color de contraste y animaciones apagadas. Lectura pública; solo admin escribe.
- Funciones: `visit_count()` (pública, contador), `admin_summary(days)` (solo admin), `is_admin()`.
- Esquema completo, incluida `site_config`: `analytics/schema.sql`.
- **Pendiente:** crear el usuario `hi@promii.co` en Authentication → Users y desactivar los registros públicos.
- Para dar acceso a otra persona: `insert into public.admins (email) values ('correo@…');` y crearle usuario.

## MailerLite

- Cuenta `2812008`; formulario incrustado `204666721303266364` ("promii.co · Newsletter y lista de espera"); grupo **"Web promii.co"**.
- Campos personalizados: `interests` (newsletter, shop, magazine, academy, community) y `signup_source` (`promii.co/ecosistema` o `promii.co/newsletter`).
- Si MailerLite falla o no está configurado, los formularios caen al buzón de FormSubmit (`hi@promii.co`).
- Idea siguiente: segmentos por interés y automatización de bienvenida.

## Panel privado

- `promii.co/admin/` (funciona en GitHub Pages) y `admin.promii.co` (cuando esté en Vercel).
- Pestañas: **Analítica** y **Diseño y movimiento**.
- `#demo` al final de la URL abre el modo de ejemplo sin login.

## admin.promii.co (Vercel)

1. Aprobar el acceso de Vercel al equipo `hi-2630s-projects`.
2. Crear el proyecto desde `Archikatz/promii-site` (sin build; sitio estático). `vercel.json` ya reescribe `admin.promii.co/` → `/admin/index.html`.
3. Agregar el dominio `admin.promii.co` al proyecto.
4. En GoDaddy: registro **CNAME** `admin` → `cname.vercel-dns.com`.
5. Opcional, más adelante: mover también `promii.co` a Vercel (cambiar el A/ALIAS del dominio raíz).

## Publicar cambios

- Trabajar en una rama, revisar la vista previa y fusionar en `main` → GitHub Pages publica en promii.co.
- Después de publicar: probar la lista de espera (MailerLite) y ver la visita en el panel.

## Rendimiento y accesibilidad

- Todo respeta `prefers-reduced-motion`.
- El WebGL de tinta corre a media resolución y se pausa en pestañas ocultas.
- El rastreador pesa ≈2 KB, se carga con `defer` e ignora bots y navegadores automatizados.
