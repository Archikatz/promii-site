# Genera academy/index.html (ES + EN). Uso: python3 academy/build.py
# Para publicar una guía: cambia su enlace de None a la URL y vuelve a correr el script.
import html, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
old = (ROOT / 'academy/index.html').read_text()
CSS = old[old.index('<style>') + 7:old.index('</style>')]  # se conserva el CSS actual

# (clave, eyebrow ES/EN, título ES/EN, descripción ES/EN, guías[(título ES, título EN, desc ES, desc EN, url)])
T = [
 ("bim", ("IA + BIM", "AI + BIM"), ("Revit con IA", "Revit with AI"),
  ("Cómo conecto Claude con Revit para revisar modelos, documentar y escribir rutinas.", "How I connect Claude to Revit to review models, document and write routines."),
  [("Claude trabajando dentro de Revit", "Claude working inside Revit", "Diario del estudio: MCP, C#, Python/Dynamo y cinco flujos.", "Study log: MCP, C#, Python/Dynamo and five flows.", "../bitacora/?p=claude-dentro-de-revit"),
   ("Control de calidad del modelo con IA", "Model quality control with AI", "Parámetros vacíos, nombres, vistas sin plano: una lista de correcciones automática.", "Empty parameters, names, views off sheets: an automatic list of fixes.", None),
   ("Detección de choques resumida por prioridad", "Clash detection summarized by priority", "De cientos de interferencias a una lista que se puede atender.", "From hundreds of clashes to a list you can act on.", None),
   ("Python y Dynamo escritos por IA", "Python and Dynamo written by AI", "Qué rutinas funcionan bien y cómo revisarlas antes de usarlas.", "Which routines work well and how to review them before use.", None)]),
 ("nyc", ("Permisos", "Permits"), ("Nueva York: códigos y permisos", "New York: codes and permits"),
  ("Documentación BIM para permisos en Nueva York: DOB, código de energía y niveles de detalle.", "BIM documentation for New York permits: DOB, energy code and levels of detail."),
  [("Permisos con el DOB: lo que aprendí", "DOB permits: what I learned", "El recorrido de un proyecto desde los planos hasta la aprobación.", "A project's path from drawings to approval.", None),
   ("Cumplimiento energético (NYCECC 2020) en el modelo", "Energy compliance (NYCECC 2020) in the model", "Cómo dejar el modelo listo para la revisión de energía.", "How to get the model ready for the energy review.", None),
   ("LOD 300–350 sin dolor", "LOD 300–350 without the pain", "Qué se modela, qué se dibuja y qué se deja en notas.", "What gets modeled, what gets drafted and what stays in notes.", None)]),
 ("obra", ("Construcción", "Construction"), ("Administración de obra", "Construction administration"),
  ("Orden documental y seguimiento para varias obras multifamiliares al mismo tiempo.", "Document control and tracking for several multifamily projects at once."),
  [("Orden documental para varias obras", "Document control across several projects", "15 categorías de documentos y una estructura de carpetas que se mantiene sola.", "15 document categories and a folder structure that keeps itself in order.", None),
   ("El ciclo de un proyecto multifamiliar en 18 etapas", "A multifamily project's life cycle in 18 stages", "Del terreno a la entrega, con los documentos de cada etapa.", "From land to handover, with the documents of each stage.", None),
   ("RFIs, submittals y permisos en un tablero", "RFIs, submittals and permits on one board", "Un seguimiento semanal que el equipo sí usa.", "A weekly tracker the team actually uses.", None)]),
 ("sis", ("Sistemas", "Systems"), ("Sistemas y automatización", "Systems and automation"),
  ("Notion, n8n y Claude trabajando juntos para que lo repetitivo se haga solo.", "Notion, n8n and Claude working together so repetitive work does itself."),
  [("La Trinidad: el sistema operativo con el que trabajo", "The Trinity: the operating system I work with", "Memoria, sistema nervioso y criterio.", "Memory, nervous system and judgment.", "../bitacora/?p=la-trinidad-sistema-operativo"),
   ("Bandeja de entrada, salida y registro", "Inbox, outbox and log", "El patrón que uso en todas mis automatizaciones, con plantilla.", "The pattern I use in every automation, with a template.", None),
   ("13 automatizaciones base", "13 base automations", "El paquete con el que empiezo cualquier operación.", "The pack I start any operation with.", None),
   ("Antes de automatizar: Workflow Intake", "Before automating: Workflow Intake", "Describir el proceso en una página antes de construirlo.", "Describe the process on one page before building it.", None)]),
 ("kam", ("Ventas B2B", "B2B sales"), ("Ventas B2B y cuentas clave", "B2B sales and key accounts"),
  ("Prospección con contactos reales, seguimiento y cierre para servicios profesionales.", "Prospecting real contacts, follow-up and closing for professional services."),
  [("Rabbit Holes: prospección con contactos reales", "Rabbit Holes: prospecting real contacts", "Encontrar a las personas correctas y escribirles con contexto.", "Find the right people and write to them with context.", None),
   ("Mensajes que sí se responden (OIQP)", "Messages that get answered (OIQP)", "Una estructura simple para el primer mensaje.", "A simple structure for the first message.", None),
   ("Despertar contactos dormidos en LinkedIn", "Wake up dormant LinkedIn contacts", "Una secuencia para reactivar tu red.", "A sequence to reactivate your network.", None),
   ("Agendador de citas con IA conectado al CRM", "AI appointment setter connected to the CRM", "Responder y agendar sin perder prospectos.", "Reply and book without losing leads.", None),
   ("Puntuación de prospectos sin software caro", "Lead scoring without expensive software", "Priorizar a quién llamar primero.", "Prioritize who to call first.", None)]),
 ("mkt", ("Marketing", "Marketing"), ("Marketing para servicios", "Marketing for services"),
  ("Estrategias para que un estudio o un profesional independiente consiga clientes.", "Strategies for a studio or an independent professional to win clients."),
  [("Website-first: la web como centro de todo", "Website-first: the site at the center of everything", "Este sitio como caso de estudio.", "This site as a case study.", None),
   ("Copywriting B2B", "B2B copywriting", "Escribir para quien decide y para quien recomienda.", "Write for the one who decides and the one who recommends.", None),
   ("Webinar con lead magnet", "Webinar with a lead magnet", "Un embudo simple para servicios B2B.", "A simple funnel for B2B services.", None),
   ("Posicionamiento", "Positioning", "Decir en una frase por qué tú.", "Say in one sentence why you.", None)]),
 ("web", ("Diseño web", "Web design"), ("Diseño web con IA", "Web design with AI"),
  ("Cómo construir un sitio vivo, medido y administrable, trabajando con un agente de IA.", "How to build a living, measured, self-managed site working with an AI agent."),
  [("Cómo construí un portafolio que se administra solo", "How I built a portfolio that runs itself", "El caso completo de promii.co.", "The full promii.co case.", "../bitacora/?p=como-construi-promii"),
   ("Liquid Glass en la web", "Liquid Glass on the web", "Refracción real con SVG y su versión para iPhone.", "Real refraction with SVG and its iPhone version.", None),
   ("De 14 a 60 fps: medir antes de optimizar", "From 14 to 60 fps: measure before you optimize", "Encontrar qué hace lenta una página.", "Find what makes a page slow.", None)])]

e = html.escape
def bi(es, en, tag='span', cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<{tag}{c} data-en="{e(en, quote=True)}">{e(es)}</{tag}>'
def card(g):
    tes, ten, des, den, u = g
    stt = (bi('Disponible', 'Available', 'span', 'badge on') if u else bi('Próximamente', 'Coming soon', 'span', 'badge'))
    inner = f'<div class="pt">{stt}{bi(tes, ten, "b")}{bi(des, den)}</div>'
    return f'<a class="pb glass" href="{u}">{inner}{bi("Leer →", "Read →", "em")}</a>' if u else f'<div class="pb glass soon">{inner}</div>'
tracks = ''.join(f'<section class="track" id="{k}"><div class="th">{bi(ey[0], ey[1], "span", "eyebrow")}{bi(h[0], h[1], "h2")}{bi(p[0], p[1], "p")}</div><div class="pbs">{"".join(card(x) for x in L)}</div></section>' for k, ey, h, p, L in T)
chips = ''.join(f'<a href="#{k}" data-en="{e(h[1], quote=True)}">{e(h[0])}</a>' for k, ey, h, p, L in T)
n = sum(len(L) for *_, L in T); av = sum(1 for *_, L in T for x in L if x[4])

page = f'''<!doctype html>
<html lang="es" data-theme="dark" data-title-en="Promii Academy · Guides on BIM, AI, construction and B2B sales">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Promii Academy · Guías de BIM, IA, construcción y ventas B2B</title>
<meta name="description" content="Guías y playbooks de Brian Zuleta: Revit con IA, permisos en Nueva York, administración de obra, automatización, ventas B2B, marketing y diseño web.">
<link rel="canonical" href="https://promii.co/academy/">
<link rel="alternate" hreflang="en" href="https://promii.co/academy/?lang=en">
<meta property="og:type" content="website">
<meta property="og:title" content="Promii Academy">
<meta property="og:description" content="Lo que hago todos los días, convertido en guías paso a paso.">
<meta property="og:image" content="https://promii.co/bitacora/img/academy.jpg">
<meta name="twitter:card" content="summary_large_image">
<script>try{{var t=localStorage.getItem('promii-theme');if(t)document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}</script>
<script src="../assets/promii-config.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<main class="wrap">
<header class="top">
  {bi("Promii Academy", "Promii Academy", "span", "eyebrow")}
  {bi("Lo que hago todos los días, en guías paso a paso", "What I do every day, in step-by-step guides", "h1")}
  {bi("Revit con IA, permisos en Nueva York, administración de obra, automatización, ventas B2B, marketing y diseño web. Cada guía sale de proyectos reales y dice qué hacer, con qué herramientas y cómo saber si funcionó.", "Revit with AI, New York permits, construction administration, automation, B2B sales, marketing and web design. Every guide comes from real projects and says what to do, with which tools and how to tell if it worked.", "p", "lead")}
  {bi(f"{n} guías en {len(T)} temas · {av} disponibles · las demás se publican una a una", f"{n} guides in {len(T)} topics · {av} available · the rest are published one by one", "p", "stat")}
  <div class="layers">
    <a class="layer glass" href="../bitacora/">{bi("Historias", "Stories", "small")}<b>Blog</b>{bi("Cómo lo hice: casos y procesos contados de principio a fin.", "How I did it: cases and processes told start to finish.")}</a>
    <div class="layer glass here">{bi("Estás aquí", "You are here", "small")}<b>Academy</b>{bi("Cómo lo haces tú: guías, plantillas y playbooks.", "How you do it: guides, templates and playbooks.")}</div>
    <a class="layer glass" href="../#experiencia">{bi("Prueba", "Proof", "small")}{bi("Experiencia", "Experience", "b")}{bi("Dónde lo he hecho: proyectos, cargos y resultados.", "Where I have done it: projects, roles and results.")}</a>
  </div>
</header>
<div class="chips" aria-label="Temas" data-en-label="Topics">{chips}</div>
{tracks}
<section class="how glass">{bi("Cómo está hecha cada guía", "How every guide is built", "h2")}<ol>
  <li>{bi("<b>Objetivo:</b> qué resuelve y para quién.", "<b>Goal:</b> what it solves and for whom.")}</li>
  <li>{bi("<b>Pasos:</b> el proceso en orden, con capturas.", "<b>Steps:</b> the process in order, with screenshots.")}</li>
  <li>{bi("<b>Herramientas y plantillas:</b> lo que necesitas para hacerlo hoy.", "<b>Tools and templates:</b> what you need to do it today.")}</li>
  <li>{bi("<b>Cómo medirlo:</b> la señal de que funcionó.", "<b>How to measure it:</b> the sign that it worked.")}</li></ol></section>
<section class="sub glass" id="suscribirse">{bi("Avísame cuando salga cada guía", "Tell me when each guide is out", "b")}{bi("Una guía nueva cada pocas semanas. Sin spam.", "A new guide every few weeks. No spam.")}
  <form id="subForm" novalidate><label class="hp" for="hp">No llenar</label><input class="hp" id="hp" name="_honey" tabindex="-1" autocomplete="off"><label for="subEmail" style="position:absolute;left:-9999px">Email</label><input id="subEmail" name="email" type="email" required autocomplete="email" placeholder="tu@correo.com" data-en-ph="you@email.com">{bi("Avisarme", "Notify me", "button")}</form><p class="st" id="subSt" role="status"></p></section>
</main>
<script src="../analytics/config.js"></script>
<script src="../analytics/track.js" defer></script>
<script>
(function () {{
  const f = document.getElementById('subForm'), EN = () => document.documentElement.lang === 'en';
  f.querySelector('button').type = 'submit';
  f.addEventListener('submit', async e => {{
    e.preventDefault(); const st = document.getElementById('subSt'), m = f.email.value.trim();
    if (f._honey.value) return;
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(m)) {{ st.className = 'st err'; st.textContent = EN() ? 'Enter a valid email.' : 'Escribe un correo válido.'; return; }}
    st.className = 'st'; st.textContent = EN() ? 'Sending…' : 'Enviando…';
    const M = (window.PROMII_FORMS || {{}}).mailerlite || {{}};
    try {{
      const fd = new FormData(); fd.append('fields[email]', m); fd.append('fields[signup_source]', 'promii.co/academy' + (EN() ? ' (en)' : '')); fd.append('fields[interests]', 'academy'); fd.append('ml-submit', '1'); fd.append('anticsrf', 'true');
      const r = await fetch('https://assets.mailerlite.com/jsonp/' + M.account + '/forms/' + M.form + '/subscribe', {{ method: 'POST', body: fd }});
      const j = await r.json(); if (!j.success) throw 0;
      st.className = 'st ok'; st.textContent = EN() ? 'Done! I will let you know when each guide is out.' : '¡Listo! Te aviso cuando salga cada guía.'; f.reset();
    }} catch (x) {{ st.className = 'st err'; st.textContent = EN() ? 'Could not send. Write to hi@promii.co.' : 'No se pudo enviar. Escríbeme a hi@promii.co.'; }}
  }});
}})();
</script>
<script src="/assets/site-shell.js" data-mode="full"></script>
</body>
</html>
'''
(ROOT / 'academy/index.html').write_text(page)
print(n, 'guías,', av, 'disponibles')
