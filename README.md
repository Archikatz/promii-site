# promii.co

Sitio de **Brian Zuleta · Promii / Studio Brian Zuleta**: portafolio de arquitectura y BIM, servicios de Promii, ecosistema (ArchiKatz, Academy, Comunidad) y un panel privado de analítica y diseño.

> **¿Eres una IA o una persona retomando el proyecto?** Lee primero [`docs/PROYECTO.md`](docs/PROYECTO.md) (historia, decisiones y lo que sigue) y después [`docs/SISTEMA-DE-DISENO.md`](docs/SISTEMA-DE-DISENO.md) y [`docs/OPERACION.md`](docs/OPERACION.md).

## Estructura

```
index.html                 La página completa (HTML + CSS + JS en un solo archivo, ES/EN)
assets/promii-config.js    Sistema de estilos y movimiento: registro de animaciones, estilo, color de contraste
analytics/track.js         Rastreador ligero (visitas, tiempo por sección, scroll, clics, formularios)
analytics/config.js        Claves públicas de Supabase y MailerLite
analytics/schema.sql       Esquema de la base de datos (Supabase)
admin/index.html           Panel privado: analítica + Diseño y movimiento (login con correo y contraseña)
lab/                       Motion Lab: 13 demos reutilizables + inventario de animaciones
lab/demos/*.html           Cada demo es un archivo independiente
lab/inventario.html        Inventario de las 35 animaciones y revisión de consistencia
docs/                      Documentación del proyecto (este es el respaldo de la conversación)
robots.txt, sitemap.xml    SEO
vercel.json                Reglas para Vercel (admin.promii.co)
CNAME                      Dominio para GitHub Pages
```

## Servicios conectados

| Servicio | Para qué | Identificador |
| --- | --- | --- |
| GitHub `Archikatz/promii-site` | Código y hosting actual (GitHub Pages, rama `main`) | — |
| Supabase `promii-analytics` | Analítica, configuración del sitio, login del panel | proyecto `lcahlrunxtgbghxauwoy` (us-east-1) |
| MailerLite | Newsletter y listas de espera | cuenta `2812008`, formulario `204666721303266364`, grupo "Web promii.co" |
| Vercel | Opcional: `admin.promii.co` y despliegues | equipo `hi-2630s-projects` |
| Notion / Google Drive | Fuentes de contenido (CV, portafolio, ecosistema) | ver `docs/PROYECTO.md` |

## Ver y probar en local

```bash
python3 -m http.server 8765
# Página:               http://localhost:8765/
# Estilo tinta china:   http://localhost:8765/?style=ink&accent=%23e0261b
# Panel (ejemplo):      http://localhost:8765/admin/#demo
# Motion Lab:           http://localhost:8765/lab/
```

El rastreador no envía nada desde `localhost` ni desde navegadores automatizados.

## Publicar

Los cambios se trabajan en una rama y se publican al fusionar en `main` (GitHub Pages lo sirve en promii.co).
