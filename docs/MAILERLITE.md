# MailerLite · capa de suscripciones y campañas — PROMII

**Estado:** documentado · **pendiente de configurar en MailerLite + pegar embeds**  
**Fecha:** 2026-11-25  
**Owner:** Brian Zuleta · promii.co  
**Nota operativa:** No hay conector nativo MailerLite desde Grok. Configurar cuenta, grupos, forms y automations en MailerLite (o con ChatGPT/Claude). Luego pegar los snippets en el repo. SEO se deja para otra herramienta.

---

## 1. Objetivo

Capturar leads sin fricción y nutrirlos hacia:

1. Solicitud de CV / conversación profesional  
2. Asesoría Lab / PMaaS / BIM-AI  
3. Editorial (Fractalia · Sicodelia · toons)  
4. Arcade (pitch de juego / community)  
5. Newsletter de ecosistema Promii  

**Principio de privacidad:** no pedir datos sensibles. Email (+ nombre opcional + interés). Double opt-in recomendado.

---

## 2. Grupos (lists) sugeridos

| Grupo | Slug / nombre | Uso |
|-------|---------------|-----|
| Newsletter general | `promii-newsletter` | Home + footer |
| Editorial | `promii-editorial` | /editorial/ · libros · toons |
| Arcade Lab | `promii-arcade` | Pitches + updates de juegos |
| Servicios / B2B | `promii-services` | About · Lab · contacto profesional |
| ACOI demo | `acoi-updates` | Solo si se activa la maqueta ACOI |

Campos custom recomendados en MailerLite:

- `name`  
- `interest` (editorial | arcade | services | general)  
- `source_page` (path de origen)  
- `lang` (es | en)  

---

## 3. Formularios a crear en MailerLite

### A. Embedded — Newsletter home
- Tipo: **Embedded form**
- Grupo: `promii-newsletter`
- Campos: email (req), name (opt)
- Idioma: ES primario; duplicar EN si hace falta
- Estilo: minimal, fondo transparente si posible (luego CSS liquid-glass en el sitio)

### B. Embedded — Footer global
- Mismo grupo o grupo + tag `source=footer`
- Una sola línea: email + botón

### C. Embedded — Editorial CTA
- Grupo: `promii-editorial`
- Copy: “¿Quieres tu historia aquí? / Get updates on Fractalia & Sicodelia”
- Opcional: checkbox interest

### D. Embedded — Servicios / solicitar conversación
- Grupo: `promii-services`
- Campos: email, name, interest (select)
- No pedir teléfono obligatorio (WhatsApp se ofrece en contacto, no como campo forzado del form)

### E. Popup (opcional, después del día 1)
- Exit-intent o 45s en home
- Mismo grupo newsletter
- No agresivo; 1 vez / sesión

---

## 4. Cómo instalar en promii.co (cuando tengas los snippets)

MailerLite entrega **dos piezas**:

1. **Universal tracking snippet** → una vez, cerca de `</head>` (o vía `site-shell.js` / loader global).  
2. **Form snippet** (JS corto o HTML) → donde debe aparecer el form.

### 4.1 Archivos del repo previstos

```
assets/mailerlite-loader.js   ← universal snippet + init (cuando lo pegues)
assets/mailerlite-forms.css   ← overrides liquid-glass
docs/MAILERLITE.md            ← este archivo
```

### 4.2 Slots de UI ya alineados con el sitio

| Página | Slot sugerido |
|--------|----------------|
| `/` home | Bloque “Newsletter” antes del footer / junto discovery rail |
| Footer global | Una línea email (site-shell) |
| `/editorial/` | CTA bajo catálogo / tras libro |
| `/about/` | CTA servicios |
| `/games/` | Opcional: “avísame de nuevos protocolos” junto al pitch form |

### 4.3 Placeholder actual (sin cuenta)

Hasta tener Account ID / Form ID de MailerLite, **no** hardcodear keys en el front público.  
Los pitches de Arcade y el feedback local siguen en `localStorage` (`promii-game-pitches`, `promii-feedback`) como buffer offline.

---

## 5. Automations mínimas (configurar en MailerLite UI)

### 5.1 Bienvenida (obligatoria)
**Trigger:** subscriber added to `promii-newsletter`  
**Email 1 (inmediato):**

- Asunto ES: `Bienvenido a Promii · el ecosistema ya está abierto`  
- Asunto EN: `Welcome to Promii · the ecosystem is open`  
- Cuerpo: 3 links — Editorial · Arcade · About/Services  
- CTA secundario: responder o escribir a `hi@promii.co`  
- Footer legal: unsubscribe nativo de MailerLite + link privacy `/privacy/`

### 5.2 Bienvenida Editorial
**Trigger:** `promii-editorial`  
- Link directo a Fractalia / Sicodelia  
- CTA “¿tu historia en la editorial?”

### 5.3 Bienvenida Servicios
**Trigger:** `promii-services`  
- Qué ofreces (PMaaS, BIM, AI Ops, Lab) **sin** datos sensibles de clientes  
- CTA: agendar / responder email  

### 5.4 (Opcional) Nurture 7 días
Día 3: un post / caso de estudio  
Día 7: invitación suave a Lab o Arcade pitch  

---

## 6. Campañas de arranque (manual)

1. **Launch Dec 2026** — anuncio ecosistema (home viva, editorial, arcade)  
2. **Fractalia & Sicodelia** — spotlight libros  
3. **Arcade Protocols** — 20 juegos + “describe tu juego”  
4. **Servicios / Rockrei-ready messaging** — PMaaS filtrado (sin datos sensibles)

Frecuencia sugerida post-lanzamiento: 1–2 / mes, no diario.

---

## 7. Copy base (ES / EN) para forms

### Newsletter home
- ES título: `Señales del ecosistema`  
- ES sub: `Editorial, Arcade, Lab y sistemas. Sin spam.`  
- ES CTA: `Unirme`  
- EN título: `Ecosystem signals`  
- EN sub: `Editorial, Arcade, Lab & systems. No spam.`  
- EN CTA: `Join`

### Editorial
- ES: `Nuevos capítulos y toons · avísame`  
- EN: `New chapters & toons · notify me`

### Servicios
- ES: `Conversación profesional · sin compromiso`  
- EN: `Professional conversation · no obligation`

---

## 8. Checklist de configuración (para ChatGPT / tú en MailerLite)

- [ ] Cuenta MailerLite activa; dominio `promii.co` autenticado (SPF/DKIM/DMARC)  
- [ ] Grupos creados (tabla §2)  
- [ ] Campos custom: interest, source_page, lang  
- [ ] Forms A–D creados; double opt-in ON  
- [ ] Automation bienvenida general activa y probada con email propio  
- [ ] Snippets copiados a un doc seguro (no commitear API token en el repo)  
- [ ] Pegar universal snippet en loader global del sitio  
- [ ] Pegar form embeds en slots §4.2  
- [ ] Test desde móvil + desktop; confirmar llegada a grupo  
- [ ] Link privacy en todos los emails  

**API (solo backend o script privado, nunca en front público):**  
`https://connect.mailerlite.com/api/` · token en Integrations → API.  
Docs: https://developers.mailerlite.com/

---

## 9. Qué NO hacer desde el front de promii.co

- No guardar API token en GitHub Pages / JS público  
- No pedir dirección, documento, empleadores actuales en el form  
- No mezclar lista B2B con newsletter editorial sin tags  
- No lanzar popup agresivo el día 1  

---

## 10. Handoff a ChatGPT (prompt listo)

```
Configura MailerLite para promii.co según docs/MAILERLITE.md del repo Archikatz/promii-site.
Crea grupos, forms embedded, automation de bienvenida ES/EN, y devuélveme:
1) lista de grupos creados
2) IDs de forms
3) universal snippet
4) form snippets por slot (home, footer, editorial, services)
5) asunto + body del email de bienvenida ES y EN
No expongas el API token en texto que vaya al repo público.
```

---

## 11. Relación con el resto del sitio

| Feature vivo en web | MailerLite |
|---------------------|------------|
| Pitch “describe tu juego” | Buffer local → opcional webhook/automation futura |
| Feedback artículos | Buffer local |
| Solicitar CV (copy About/Home) | Preferir email `hi@promii.co` o form services |
| Discovery rail home | Alimenta tráfico a slots con form |

---

## 12. SEO

**Aplazado a propósito** — se trabaja en otra herramienta. No bloquea MailerLite.

---

*Última actualización: 2026-11-25 · Promii / Studio Brian Zuleta*
