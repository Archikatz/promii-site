# Promii Ecosystem Layer (Servicios · Growth · Cotizador · Remodeling · Press · Eventos · Academy)

Deployed 2026-11-25 from Entregas 1–5 production packages.

## Routes
| Path | Blueprint |
|------|-----------|
| `/servicios/` | Hub maestro de servicios |
| `/servicios/growth.html` | Auditoría digital 0–100 + 4 etapas |
| `/cotizador/` | Estimador 12 servicios + SOW |
| `/remodeling/` | Dual-hub Denver (BAAC) & Bogotá |
| `/denver/` | Redirect → remodeling?hub=denver |
| `/bogota/` | Redirect → remodeling?hub=bogota |
| `/editorial/tu-libro.html` | ArchiKatz Press configurator |
| `/eventos/` | Moments (video-invites) + Webinars |
| `/academy/` | Campus 22 cursos + IA-01 + sign-up gate |

## Shared assets
- `assets/promii-ecosystem.css` — design system CAD + liquid glass (90/10 vertical accents)
- `assets/promii-ecosystem.js` — ES/EN, USD/COP, world map, dual droplets, footer

## Integration notes
- Existing site shell (`site-shell.js`), home physics, arcade, editorial books **unchanged**.
- Ecosystem pages use their own topbar + PromiiOS droplets.
- Dark/light on legacy pages remains via `site-shell`; ecosystem pages ship light CAD canvas by default.
- MailerLite / SEO: handoff in `docs/MAILERLITE.md` and this log.

## Smoke checklist
1. `/servicios/` — intent filters, concierge, world map, droplets.
2. `/servicios/growth.html` — radar updates with answers.
3. `/cotizador/?preset=bim` — preset selection.
4. `/remodeling/?hub=denver` and `?hub=bogota` — currency/unit switch.
5. `/editorial/tu-libro.html` — 3D mockup title updates.
6. `/eventos/#webinars` — simulator.
7. `/academy/` — sign-up gate before classroom.
8. ES/EN and USD/COP toggles on each ecosystem page.
