# Genera la Matriz de imágenes de Promii / Studio BZ / ArchiKatz (xlsx con varias pestañas)
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
import sys, unicodedata
def _na(t): return unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode()

OUT = sys.argv[1]

# ---------- Bloques de estilo reutilizables (se pegan al final de cada prompt) ----------
S = {
 'GLASS': "Style: Apple-like Liquid Glass. Translucent glass forms with real light refraction, soft specular highlights on the upper-left, thin chromatic dispersion on the edges, continuous squircle corners. Deep near-black background (#08080C) with soft out-of-focus color glows in electric blue (#2F6BFF) and signal red (#FF3B30), a faint dot grid. Premium product-render look, studio lighting, razor sharp, minimal, lots of negative space.",
 'BLUEPRINT': "Style: architectural blueprint. Thin crisp white technical lines on a near-black background (#08080C), dimension lines with small tick marks and labels like A-01, faint 28px grid, a few lines in electric blue (#2F6BFF) and one accent in signal red (#FF3B30). Precise, elegant, minimal, like a premium architecture monograph.",
 'INK': "Style: Chinese ink (sumi-e) meets modern editorial. Warm off-white textured paper (#EFEBE2) with visible fiber grain, fluid black ink clouds and confident brush strokes, a single vermilion red accent (#E0261B) and nothing else in color, generous negative space, calm and elegant.",
 'OBSIDIAN': "Style: obsidian and gold. Polished black obsidian surfaces (#0B0B0F) with faceted gem reflections, thin gold linework (#E8B23A), small cyan neon accents (#22E0C8), a faint flower-of-life sacred geometry pattern in the background, luxurious low-key lighting, high-end jewelry photography feel.",
 'ARCHIKATZ': "Style: ArchiKatz universe — cyber-brutalist hyper-realistic architecture, raw board-formed concrete, holographic data, cinematic volumetric light. Palette: obsidian #15151F, gold #D4AF37, sapphire #4F9BFF, amethyst #9B6DFF, with a magenta neon accent. Cinematic, 8k, ultra-detailed.",
 'PHOTO': "Style: editorial portrait photography, Canon 85mm f/1.4, soft key light from the left, subtle rim light, dark architectural background with concrete texture, natural skin texture, true-to-life colors, no beauty filter.",
}
NEG_BASE = "No text, no letters, no numbers, no watermark, no signature, no logos, no UI elements, no frames or borders, no clutter, no distorted shapes."
NEG_PEOPLE = "No extra fingers, no deformed hands, no changes to the facial identity, no plastic skin, no exaggerated beauty retouching."

COLS = ["ID","Prioridad","Estado","Marca","Grupo","Plataforma","Pieza","Tamaño final (px)","Relación final","Relación para generar","Zona segura / recorte","Herramienta","Estilo","Descripción (qué es y para qué sirve)","PROMPT (copiar y pegar)","Evitar (prompt negativo)","Texto a poner después (Canva/Figma)","Referencia a subir","Paleta","Nombre de archivo","Carpeta en Drive","Notas"]

rows = []
def add(id_, pri, marca, grupo, plat, pieza, size, rel, gen, safe, tool, estilo, desc, prompt, texto="—", ref="—", paleta="", notas="", people=False, neg_extra=""):
    st = S.get(estilo.split('+')[0].strip().upper(), "")
    if '+' in estilo:
        st = st + " " + S.get(estilo.split('+')[1].strip().upper(), "")
    full = prompt.strip() + " " + st + f" Aspect ratio {gen}."
    neg = NEG_BASE + (" " + NEG_PEOPLE if people else "") + (" " + neg_extra if neg_extra else "")
    if texto != "—" and "wordmark" in prompt.lower():
        neg = neg.replace("No text, no letters, ", "No extra text besides the requested word, ")
    w, h = size.split('×')
    plat_slug = plat.split('/')[0].strip().lower().replace(' ', '').replace('.', '')
    fname = f"{id_}_{plat_slug}_{pieza.lower().replace(' ', '-').replace('/', '-').replace('·','').replace('—','')[:28].strip('-')}_{w}x{h}_v1.png".replace('--','-')
    folder = {'Identidad':'01_Logos','Perfiles':'02_Perfiles','LinkedIn':'03_LinkedIn','YouTube':'04_YouTube','Instagram':'05_Instagram','TikTok':'06_TikTok_Facebook_X','Facebook':'06_TikTok_Facebook_X','X':'06_TikTok_Facebook_X','Pinterest':'07_Pinterest_Behance','Behance':'07_Pinterest_Behance','Web':'08_Web','Email':'09_Email','Tienda':'10_ArchiKatz_Tienda','Editorial':'11_Editorial_Webtoon'}[grupo]
    fname = _na(fname)
    rows.append([id_, pri, "Por generar", marca, grupo, plat, pieza, size, rel, gen, safe, tool, estilo, desc, full, neg, texto, ref, paleta, fname, folder, notas])

NB = "Nano Banana Pro (Gemini)"
FL = "Google Flow (Imagen)"
P_PROMII = "#08080C · #F4F4F8 · #2F6BFF · #FF3B30 · #22E0C8"
P_GEM = "#0B0B0F · #E8B23A · #22E0C8 · #F4F4F8"
P_INK = "#EFEBE2 · #111110 · #E0261B"
P_AK = "#15151F · #D4AF37 · #4F9BFF · #9B6DFF · magenta"

# ================= 1. IDENTIDAD / LOGOS =================
LOGO_NOTE = "Los generadores de imágenes sirven para EXPLORAR el concepto del logo. El logo final debe redibujarse en vector (Illustrator, Figma o vectorizar con Vectorizer.ai) para que sea nítido en cualquier tamaño."
add("L-01","Alta","Promii","Identidad","Todas","Símbolo Promii · gota","2048×2048","1:1","1:1","Símbolo centrado, 15% de margen alrededor","%s"%NB,"Glass",
 "Símbolo principal de Promii: la gota de agua de Liquid Glass que vive en el sitio. Será favicon, foto de perfil de Promii, marca de agua y app icon.",
 "A single perfect water droplet made of clear liquid glass, seen from the front, centered on the canvas, slightly flattened like a lens, with a bright specular highlight on its upper-left and a thin red-to-blue chromatic rim. Inside the droplet, the dot grid behind it appears magnified. Iconic, symmetrical, simple enough to work as a 32px favicon.",
 ref="Captura de la gota del sitio (promii.co/home)",paleta=P_PROMII,notas=LOGO_NOTE)
add("L-02","Alta","Promii","Identidad","Todas","Wordmark promii con gota","3200×1200","8:3","21:9","Palabra centrada; dejar 20% libre a los lados","%s"%NB,"Glass",
 "Logotipo horizontal: la palabra promii en minúsculas con la gota como punto de una de las íes. Para encabezados, firmas de correo y documentos.",
 "A minimal logotype: the lowercase wordmark \"promii\" in a bold geometric grotesk typeface (similar to Space Grotesk Bold), tight letter spacing, off-white (#F4F4F8). The dot of the last letter i is replaced by a small liquid glass droplet with a specular highlight. Centered, flat, vector-like, perfectly legible.",
 texto="promii (ya va en la imagen; verificar ortografía)",ref="Wordmark del sitio (captura de la portada)",paleta=P_PROMII,notas=LOGO_NOTE+" Nano Banana Pro escribe bien palabras cortas; revisa que diga exactamente 'promii'.")
add("L-03","Alta","Promii","Identidad","Web / iOS","App icon · favicon squircle","1024×1024","1:1","1:1","Fondo a sangre; el sistema recorta en squircle","%s"%NB,"Glass",
 "Ícono de app y favicon (apple-touch-icon 180, favicon 32 y 512). La gota dentro de un squircle oscuro.",
 "An app icon: a dark near-black squircle tile with subtle blue and red glow in two corners, and in the center a single liquid glass droplet with strong specular highlight and soft shadow beneath it. Bold, readable at tiny sizes, iOS-26 style.",
 paleta=P_PROMII,notas="Exportar en 1024, 512, 180 y 32 px. "+LOGO_NOTE)
add("L-04","Media","Promii","Identidad","Todas","Símbolo gota · versión tinta china","2048×2048","1:1","1:1","Centrado","%s"%NB,"Ink",
 "Versión del símbolo para el estilo Tinta china del sitio: la gota hecha de un solo trazo de pincel.",
 "A single water droplet drawn with one confident sumi-e brush stroke in black ink, with a tiny vermilion red seal-like dot beside it. Centered, iconic, lots of paper around it.",paleta=P_INK,notas=LOGO_NOTE)
add("L-05","Media","Promii","Identidad","Todas","Símbolo gota · versión obsidiana","2048×2048","1:1","1:1","Centrado","%s"%NB,"Obsidian",
 "Versión del símbolo para el estilo Obsidiana: gota de obsidiana pulida con filo de oro.",
 "A single droplet shape carved from polished black obsidian with a thin gold edge and one cyan neon reflection, floating centered above a faint gold flower-of-life pattern. Iconic and symmetrical.",paleta=P_GEM,notas=LOGO_NOTE)
add("L-06","Alta","Studio Brian Zuleta","Identidad","Todas","Monograma BZ","2048×2048","1:1","1:1","Centrado","%s"%NB,"Blueprint",
 "Monograma del estudio de arquitectura (Studio Brian Zuleta): letras B y Z construidas con líneas de plano.",
 "A monogram made of the letters B and Z, constructed from thin architectural drafting lines, construction guides and small dimension ticks, as if drawn on a drafting table. The final strokes are bold white, the construction lines faint blue. Centered, balanced, timeless.",
 texto="BZ (va en la imagen)",paleta=P_PROMII,notas=LOGO_NOTE)
add("L-07","Alta","ArchiKatz","Identidad","Todas","Emblema ArchiKatz","2048×2048","1:1","1:1","Centrado; que funcione en círculo","%s"%NB,"ArchiKatz",
 "Emblema de ArchiKatz para tienda, redes y libro: silueta de gata (Michi) integrada con una fachada brutalista y una gema.",
 "An emblem: the head silhouette of a fierce tabby cat (Michi, the guardian) formed by the negative space of a brutalist concrete facade, with a faceted gold gem as the eye that glows with sapphire light. Symmetrical, bold, works inside a circle, premium and mysterious.",
 paleta=P_AK,notas=LOGO_NOTE+" Universo ArchiKatz: no mezclar con Promii/Studio BZ.")
for i,(nm,ob,desc) in enumerate([
  ("Bitácora","a small open notebook whose pages are made of liquid glass","Sub-marca del blog"),
  ("Academy","a graduation cap whose top board is a liquid glass squircle","Sub-marca de las guías"),
  ("Games","a game controller d-pad formed by four liquid glass droplets","Sub-marca de los juegos"),
  ("Motion Lab","a laboratory flask filled with floating liquid glass droplets","Sub-marca del laboratorio de animación")]):
  add(f"L-{8+i:02d}","Media","Promii","Identidad","Web / redes",f"Ícono sub-marca · {nm}","1024×1024","1:1","1:1","Centrado","%s"%NB,"Glass",
   f"{desc}. Ícono para el sitio, portadas destacadas de Instagram y miniaturas. Misma familia visual que la gota.",
   f"A single minimal icon centered on the canvas: {ob}. Same family as a water droplet logo: glossy, refractive, specular highlight upper-left, thin chromatic rim, soft shadow.",paleta=P_PROMII,notas="Hacer las 4 en la misma sesión para que salgan consistentes.")

# ================= 2. PERFILES =================
add("P-01","Alta","Brian (personal)","Perfiles","LinkedIn / X / YouTube / Behance","Foto de perfil profesional","1080×1080","1:1","1:1","Cara centrada en el 60% central (se recorta en círculo)","%s"%NB,"Photo",
 "Foto de perfil personal profesional, a partir de una foto real tuya. Misma para LinkedIn, X, YouTube y Behance.",
 "Using the uploaded photo as the exact identity reference (keep the face, skin tone, hair and features identical), create a professional head-and-shoulders portrait of this Latin architect in his 30s, looking at the camera with calm confidence, wearing a minimalist black design shirt. Behind him, softly out of focus, a dark architectural space with a hint of blue and red light.",
 ref="2–4 fotos reales tuyas, de frente, buena luz",paleta=P_PROMII,people=True,notas="Sin foto de referencia el resultado NO serás tú. Revisa que la cara sea fiel antes de publicarla.")
add("P-02","Media","Brian (personal)","Perfiles","Instagram / TikTok personal","Foto de perfil con halo de vidrio","1080×1080","1:1","1:1","Cara centrada (recorte circular)","%s"%NB,"Photo+Glass",
 "Variante creativa del perfil: retrato con un aro de vidrio líquido detrás de la cabeza, más llamativo para redes visuales.",
 "Using the uploaded photo as the exact identity reference, a head-and-shoulders portrait of this architect, with a large ring of clear liquid glass floating behind his head like a halo, refracting blue and red light. Calm confident expression, black shirt.",
 ref="Las mismas fotos de P-01",paleta=P_PROMII,people=True)
add("P-03","Alta","Promii","Perfiles","LinkedIn empresa / IG / TikTok / YouTube Promii","Foto de perfil Promii","1080×1080","1:1","1:1","Símbolo dentro del círculo central","%s"%NB,"Glass",
 "Foto de perfil de las cuentas de Promii: el símbolo de la gota sobre fondo oscuro con brillos de color.",
 "The liquid glass droplet symbol centered on a near-black background, with a soft blue glow at the top-left and a soft red glow at the bottom-right, the droplet magnifying a faint dot grid behind it.",
 ref="L-01 aprobado",paleta=P_PROMII,notas="Hacer después de aprobar L-01 y subirlo como referencia.")
add("P-04","Media","ArchiKatz","Perfiles","IG / TikTok / YouTube ArchiKatz","Foto de perfil ArchiKatz · Michi","1080×1080","1:1","1:1","Cara de la gata centrada","%s"%NB,"ArchiKatz",
 "Perfil de ArchiKatz con la mascota Michi, la guardiana.",
 "A fierce tabby cat with piercing green eyes, wearing a tactical collar, close-up portrait looking at the camera, perched on a brutalist concrete ledge, holographic screens glowing behind her, ultra-detailed fur.",
 paleta=P_AK,notas="Personaje canónico (story bible).")

# ================= 3. LINKEDIN =================
add("LI-01","Alta","Brian (personal)","LinkedIn","LinkedIn","Banner perfil personal · Liquid Glass","1584×396","4:1","21:9","Generar 21:9 y recortar la franja central a 4:1. Dejar libre el tercio izquierdo-inferior (ahí cae tu foto en computador). Contenido clave en el centro-derecha.","%s"%NB,"Glass+Blueprint",
 "Banner de tu perfil personal: plano arquitectónico que se dibuja y gotas de vidrio líquido. Comunica arquitecto + IA.",
 "A wide panoramic composition: on the right half, an elegant architectural blueprint of a building elevation drawn in thin white lines with dimension marks, partly covered by three liquid glass droplets of different sizes that magnify the lines beneath them; the left third is calm dark empty space with only a faint grid and a soft blue glow.",
 texto="Brian Zuleta · Arquitecto · BIM · Sistemas de IA — promii.co (lado derecho, pequeño)",paleta=P_PROMII)
add("LI-02","Media","Brian (personal)","LinkedIn","LinkedIn","Banner perfil personal · Obsidiana","1584×396","4:1","21:9","Igual que LI-01","%s"%NB,"Obsidian",
 "Variante del banner con el estilo Obsidiana (oro y neón) para rotar.",
 "A wide panoramic composition: a long horizontal slab of polished black obsidian with thin gold blueprint lines engraved on it, a faint flower-of-life pattern, one cyan neon line running horizontally, the left third darker and empty.",
 texto="Igual que LI-01",paleta=P_GEM)
add("LI-03","Alta","Promii","LinkedIn","LinkedIn (página de empresa)","Portada página Promii","1128×191","6:1","21:9","Generar 21:9 y recortar una franja 6:1. El logo de la página tapa la esquina inferior izquierda: dejarla vacía.","%s"%NB,"Glass",
 "Portada de la página de empresa de Promii en LinkedIn.",
 "An ultra-wide minimal banner: a row of liquid glass droplets of increasing size floating from left to right over a dark background, each one magnifying a thin architectural line drawing behind it, soft blue and red glows. Lots of breathing room.",
 texto="Arquitectura, BIM y sistemas de IA · promii.co",paleta=P_PROMII)
add("LI-04","Alta","Brian (personal)","LinkedIn","LinkedIn (post)","Post anuncio · rehice mi portafolio con IA","1200×627","1.91:1","16:9","Generar 16:9 y recortar arriba/abajo a 1.91:1. Mantener el centro limpio para un titular.","%s"%NB,"Glass",
 "Imagen principal del post del lanzamiento (ver documento maestro de LinkedIn).",
 "A smartphone floating at a slight angle on a dark background, its screen showing a dark website with a large liquid glass droplet that magnifies the word underneath; around the phone, small glass droplets orbit like planets with thin light trails. Premium product shot.",
 texto="Rehice mi portafolio con IA (y ahora tiene física)",paleta=P_PROMII)
add("LI-05","Alta","Brian (personal)","LinkedIn","LinkedIn (post)","Post cuadrado · la gota lupa","1080×1080","1:1","1:1","Centro libre para la gota","%s"%NB,"Glass",
 "Post cuadrado que explica la gota que funciona como lupa.",
 "Macro shot of a single liquid glass droplet resting on a dark surface printed with a fine architectural blueprint; through the droplet the lines appear clearly magnified and slightly bent at the edge with a thin red and blue fringe, like a real lens.",
 texto="Una gota que es lupa. Literal.",paleta=P_PROMII)
add("LI-06","Alta","Brian (personal)","LinkedIn","LinkedIn (post)","Post vertical · tres estilos, una física","1080×1350","4:5","4:5","Tres franjas verticales iguales","%s"%NB,"Glass",
 "Post vertical que muestra los 3 estilos del sitio (Liquid Glass, Tinta china, Obsidiana) con la misma gota.",
 "A vertical triptych split into three equal vertical panels, the same water droplet in each: left panel liquid glass on near-black with blue and red glow; middle panel the droplet as a black sumi-e ink stroke on warm off-white paper with a vermilion dot; right panel the droplet as polished black obsidian with gold edge and cyan reflection on a dark background with faint gold sacred geometry. Same position and size in all three.",
 texto="Liquid Glass · Tinta china · Obsidiana — 3 estilos, la misma física",paleta=P_PROMII+" / "+P_INK+" / "+P_GEM)
for i,(t,p,tx) in enumerate([
  ("portada","A large liquid glass droplet centered on a dark background, magnifying a blueprint grid, with generous empty space at the top for a title.","Cómo construí con IA un portafolio que se administra solo"),
  ("concepto","An architectural blueprint drawing that transitions from left to right into a liquid glass panel with rounded squircle corners, as if the drawing becomes glass.","Arquitectura que se mueve: planos + Liquid Glass"),
  ("la gota","A droplet of liquid glass bursting into many small droplets that fly outward in a circle, frozen in time, dark background.","La gota: lupa real, se arrastra y explota"),
  ("rendimiento","A minimal abstract visualization: on the left a dense blurred jittery tangle of lines, on the right the same lines calm, straight and sharp, separated by a thin vertical glass panel.","De 14 a 60 cuadros por segundo: medir antes de optimizar"),
  ("cierre","Five liquid glass droplets in orbit around a central larger droplet with faint orbital rings, dark background, centered, space at the bottom for a call to action.","Toca la gota → home.promii.co")]):
  add(f"LI-{7+i:02d}","Media","Brian (personal)","LinkedIn","LinkedIn (carrusel PDF)",f"Carrusel slide {i+1} · {t}","1080×1350","4:5","4:5","Tercio superior libre para el título","%s"%FL,"Glass",
   f"Fondo de la diapositiva {i+1} de 5 del carrusel de LinkedIn. El texto se pone después en Canva; exportar todo como PDF.",
   p,texto=tx,paleta=P_PROMII,notas="Hacer las 5 seguidas con la misma semilla/estilo para que se vean como serie.")
add("LI-12","Media","Brian (personal)","LinkedIn","LinkedIn (artículo)","Portada de artículo","1920×1080","16:9","16:9","Centro libre","%s"%NB,"Glass+Blueprint",
 "Portada del artículo largo en LinkedIn.",
 "A cinematic wide shot: an architect's desk at night seen from above, a large blueprint sheet, a smartphone and a few liquid glass droplets resting on the paper and magnifying the lines, cool blue ambient light and one warm red reflection.",
 texto="Cómo construí con IA un portafolio que se administra solo",paleta=P_PROMII)
add("LI-13","Media","Promii","LinkedIn","LinkedIn (newsletter)","Portada newsletter Bitácora","1920×1080","16:9","16:9","Centro libre","%s"%NB,"Glass",
 "Portada del newsletter 'Bitácora Promii' en LinkedIn (si lo abres).",
 "An open notebook on a dark surface whose pages are thin sheets of liquid glass, with faint architectural sketches visible through them and one droplet resting on the page.",
 texto="Bitácora Promii · casos, sistemas y lo que aprendo construyéndolos",paleta=P_PROMII)

# ================= 4. YOUTUBE =================
add("YT-01","Alta","Promii","YouTube","YouTube","Banner del canal","2560×1440","16:9","16:9","ZONA SEGURA 1546×423 en el centro (lo único que se ve en celular). Todo lo importante ahí.","%s"%NB,"Glass+Blueprint",
 "Banner del canal de YouTube de Promii.",
 "A wide composition where the important content sits in a central horizontal band: a row of liquid glass droplets magnifying a thin architectural elevation drawing; above and below that band only dark empty space with faint grid and soft blue and red glows.",
 texto="Arquitectura · BIM · IA — nuevos videos cada semana (dentro de la zona segura)",paleta=P_PROMII)
for i,(t,p,tx) in enumerate([
  ("Construí mi web con IA","Using the uploaded photo as the exact identity reference, the architect on the right third of the frame looking at the camera with a surprised half smile, holding a smartphone; on the left a large liquid glass droplet magnifying a website; high contrast, bold, clean.","CONSTRUÍ MI WEB CON IA"),
  ("Claude dentro de Revit","Using the uploaded photo as the exact identity reference, the architect on the left third pointing at a large floating 3D building model in blue wireframe with a glowing red dot connected by a dashed line to a chat bubble shape; dark background.","IA DENTRO DE REVIT"),
  ("Física de gotas / tres cuerpos","Three liquid glass droplets in a figure-eight orbit with glowing light trails in blue, red and cyan on a black background, dynamic and hypnotic.","EL MENÚ CON GRAVEDAD")]):
  add(f"YT-{2+i:02d}","Media","Promii","YouTube","YouTube (miniatura)",f"Miniatura · {t}","1280×720","16:9","16:9","Evitar la esquina inferior derecha (duración del video). Texto grande en un lado.","%s"%NB,"Glass",
   "Miniatura de video. El texto (máx. 4 palabras) se pone después, grande y con mucho contraste.",p,texto=tx,ref="Fotos de P-01" if "uploaded photo" in p else "—",paleta=P_PROMII,people="uploaded photo" in p)
add("YT-05","Media","Promii","YouTube","YouTube (miniatura)","Plantilla miniatura serie Academy","1280×720","16:9","16:9","Mitad izquierda libre para texto","%s"%FL,"Glass",
 "Fondo reutilizable para todas las miniaturas de la serie Academy (cambias el texto en cada video).",
 "Dark background with a graduation cap made of liquid glass on the right half, softly lit, glowing amber (#E8B23A) rim, left half empty dark space with faint grid.",
 texto="ACADEMY · [tema del video]",paleta=P_PROMII+" · #E8B23A")
add("YT-06","Media","Promii","YouTube","YouTube Shorts / Reels / TikTok","Portada vertical de video","1080×1920","9:16","9:16","Centro 1080×1350 seguro (lo que se ve en la cuadrícula). Evitar el 15% inferior (botones).","%s"%NB,"Glass",
 "Portada para Shorts, Reels y TikTok de Promii.",
 "Vertical composition: a single large liquid glass droplet in the upper-middle magnifying a blueprint, small droplets falling below it, dark background, space in the middle for a headline.",
 texto="[Titular del video, 3–5 palabras]",paleta=P_PROMII)
add("YT-07","Baja","ArchiKatz","YouTube","YouTube ArchiKatz","Banner canal ArchiKatz","2560×1440","16:9","16:9","Zona segura central 1546×423","%s"%NB,"ArchiKatz",
 "Banner del canal de ArchiKatz (si se maneja separado de Promii).",
 "A wide cinematic panorama of a cyber-brutalist city at dusk: monumental raw concrete towers with gold and sapphire neon seams, holographic data streams, and in the center band a tabby cat with green eyes and a tactical collar silhouetted on a ledge looking over the city.",
 texto="ArchiKatz · Habitando lo no construido",paleta=P_AK,notas="Universo ArchiKatz. Personaje Michi (story bible).")

# ================= 5. INSTAGRAM =================
add("IG-01","Alta","Promii","Instagram","Instagram (feed)","Post · la gota sobre promii","1080×1350","4:5","4:5","Lo importante dentro del 3:4 central (cuadrícula del perfil)","%s"%NB,"Glass",
 "Post de presentación del sitio: la gota sobre la palabra promii.",
 "The lowercase word \"promii\" in huge bold off-white geometric letters on a near-black background, and a large liquid glass droplet floating over the letter o, visibly magnifying it with a slight chromatic edge.",
 texto="promii (va en la imagen) · pie: toca la gota en home.promii.co",paleta=P_PROMII)
add("IG-02","Media","Promii","Instagram","Instagram (carrusel)","Carrusel · 3 estilos (portada)","1080×1350","4:5","4:5","3:4 central","%s"%NB,"Glass",
 "Portada del carrusel de los tres estilos; las siguientes láminas pueden ser capturas reales del sitio.",
 "A single water droplet split vertically into three slices: one slice liquid glass, one slice black sumi-e ink on paper, one slice black obsidian with gold edge, perfectly aligned as one droplet, dark background.",
 texto="1 gota · 3 materias",paleta=P_PROMII)
add("IG-03","Alta","Promii","Instagram","Instagram / Facebook (historia)","Historia · anuncio home.promii.co","1080×1920","9:16","9:16","Evitar el 14% superior e inferior (barras de la app)","%s"%NB,"Glass",
 "Historia para anunciar la página de bienvenida (con enlace).",
 "Vertical: a central large liquid glass droplet with four medium droplets orbiting around it on faint circular orbits, each a different subtle tint (blue, red, amber, cyan), dark background, empty space below the orbits for a link sticker.",
 texto="Toca la gota → home.promii.co",paleta=P_PROMII)
add("IG-04","Media","Promii","Instagram","Instagram (reel)","Portada de reel","1080×1920","9:16","9:16","Cuadrícula muestra el 3:4 central (1080×1440)","%s"%NB,"Glass",
 "Portada para el reel que muestre la gota explotando (grabación de pantalla del sitio).",
 "Vertical: a liquid glass droplet exploding into dozens of tiny droplets frozen mid-air in a radial burst, dark background, crisp highlights.",
 texto="La gota explota (y se vuelve a juntar)",paleta=P_PROMII)
for i,(nm,ob) in enumerate([("Bitácora","an open notebook made of liquid glass"),("Academy","a graduation cap made of liquid glass"),("Lab","a flask with floating glass droplets"),("Juegos","a d-pad made of four glass droplets"),("Proyectos","a small house elevation drawn in white lines inside a glass droplet")]):
  add(f"IG-{5+i:02d}","Baja","Promii","Instagram","Instagram (destacadas)",f"Portada destacada · {nm}","1080×1920","9:16","9:16","Ícono dentro del círculo central de 600 px","%s"%FL,"Glass",
   f"Portada de historia destacada '{nm}'. Fondo oscuro igual en todas.",f"Vertical canvas, plain near-black background with a very soft blue glow in the center, and exactly in the center a small icon: {ob}. Nothing else.",paleta=P_PROMII,notas="Usar L-08..L-11 como referencia.")
add("IG-10","Media","Studio Brian Zuleta","Instagram","Instagram Studio BZ (feed)","Post · render + plano","1080×1350","4:5","4:5","3:4 central","%s"%NB,"Blueprint",
 "Post para @studiobrianzuleta: la mitad es plano técnico y la otra mitad la arquitectura terminada.",
 "A modern residential building facade split diagonally: the upper-left half is a precise white-line technical drawing on black, the lower-right half is the same facade as a photorealistic render at dusk with warm interior lights, perfectly aligned.",
 texto="Del plano a la obra",ref="Opcional: un render real tuyo como referencia",paleta=P_PROMII)
add("IG-11","Media","ArchiKatz","Instagram","Instagram ArchiKatz (feed)","Post · Michi la guardiana","1080×1350","4:5","4:5","3:4 central","%s"%NB,"ArchiKatz",
 "Post de marca de ArchiKatz con la mascota.",
 "A fierce tabby cat with piercing green eyes, wearing a tactical collar, perched on a brutalist concrete ledge, surrounded by holographic screens and data streams in sapphire and amethyst, intense gaze, ultra-detailed fur texture.",
 paleta=P_AK,notas="Prompt base canónico de la story bible.")

# ================= 6. TIKTOK / FACEBOOK / X =================
add("TT-01","Media","Promii","TikTok","TikTok","Portada de video","1080×1920","9:16","9:16","Evitar el 20% inferior y la franja derecha (botones)","%s"%NB,"Glass",
 "Portada para los TikTok de Promii (física de gotas, IA, arquitectura).",
 "Vertical: three liquid glass droplets colliding and bouncing off each other with small splash deformation, motion trails, dark background, space at the top for a headline.",
 texto="[Titular]",paleta=P_PROMII)
add("FB-01","Media","Promii","Facebook","Facebook","Portada de página","1640×624","2.63:1","21:9","En celular se recorta al centro (aprox. 1640×856 visible al 4:3 central). Contenido clave centrado.","%s"%NB,"Glass+Blueprint",
 "Portada de la página de Facebook de Promii.",
 "A wide composition with the key content centered: three liquid glass droplets magnifying a thin architectural drawing, dark background with blue and red glows at the far edges.",
 texto="Promii · Arquitectura, BIM y sistemas de IA",paleta=P_PROMII)
add("FB-02","Baja","Promii","Facebook","Facebook (post)","Post enlace","1200×630","1.91:1","16:9","Recortar a 1.91:1","%s"%FL,"Glass",
 "Imagen genérica para compartir enlaces del sitio en Facebook.",
 "A liquid glass droplet magnifying the center of a dark architectural blueprint, minimal, centered.",texto="—",paleta=P_PROMII)
add("X-01","Media","Brian (personal)","X","X (Twitter)","Encabezado","1500×500","3:1","21:9","Recortar a 3:1; tu foto tapa la parte inferior izquierda","%s"%NB,"Glass+Blueprint",
 "Encabezado del perfil de X.",
 "Wide composition: on the right two thirds, an architectural blueprint with dimension lines and two liquid glass droplets magnifying it; the lower-left area dark and empty.",
 texto="Arquitecto · BIM · IA — promii.co",paleta=P_PROMII)
add("X-02","Baja","Brian (personal)","X","X (post)","Imagen de post","1600×900","16:9","16:9","—","%s"%FL,"Glass",
 "Imagen genérica para hilos en X.","Five liquid glass droplets orbiting a central droplet with faint light trails, dark background.",paleta=P_PROMII)

# ================= 7. PINTEREST / BEHANCE =================
add("PI-01","Baja","ArchiKatz","Pinterest","Pinterest","Pin · arte ArchiKatz","1000×1500","2:3","2:3","—","%s"%NB,"ArchiKatz",
 "Pin vertical de arte ArchiKatz que lleva a la tienda.",
 "A luminous sapphire mermaid, her form ethereal and radiant, gracefully weaving intricate glowing water ribbons beneath deep moonlit ocean waves, underwater cinematic lighting, bioluminescent flora, crystal clarity, vibrant blue tones, hyperrealistic detail.",
 paleta=P_AK,notas="Prompt literal de Elemental Guardians (Vol. 1).")
add("PI-02","Baja","Promii","Pinterest","Pinterest","Pin · guía Academy","1000×1500","2:3","2:3","Mitad superior libre para el título","%s"%FL,"Glass",
 "Pin para promocionar guías de Academy (tráfico de Pinterest).",
 "Vertical: a clean desk flat-lay seen from above on dark surface: an architectural plan, a ruler, a smartphone and a liquid glass droplet magnifying a detail of the plan; upper half calm and dark for a title.",
 texto="[Título de la guía] · academy.promii.co",paleta=P_PROMII)
add("BE-01","Media","Studio Brian Zuleta","Behance","Behance","Portada de proyecto · promii.co","1616×1264","1.28:1","4:3","Recortar 4:3 a 1.28:1","%s"%NB,"Glass",
 "Portada del proyecto 'promii.co' en Behance (caso de diseño web).",
 "A laptop and a smartphone side by side at a slight angle on a dark surface, both screens showing a dark website with a large liquid glass droplet, a few droplets floating between the devices, premium device mockup photography.",
 texto="—",paleta=P_PROMII)
add("BE-02","Baja","Studio Brian Zuleta","Behance","Behance","Banner de perfil","3200×410","7.8:1","21:9","Recortar una franja muy delgada del centro","%s"%NB,"Blueprint",
 "Banner superior del perfil de Behance.",
 "Ultra-wide thin band of an architectural city skyline drawn in thin white lines with dimension marks, faint blue grid, on black.",paleta=P_PROMII)

# ================= 8. WEB (promii.co) =================
for i,(sl,t,p,tx) in enumerate([
  ("general","Imagen para compartir · promii.co","The lowercase word \"promii\" in large bold off-white letters on near-black, with a liquid glass droplet magnifying the letter o, small blue and red glows at the corners.","promii (en la imagen) + 'Brian Zuleta · Arquitecto BIM y sistemas de IA'"),
  ("home","Imagen para compartir · home.promii.co","A central liquid glass droplet with four smaller droplets orbiting it on faint circular orbits with thin light trails, dark background.","Toca la gota y escoge tu camino"),
  ("academy","Imagen para compartir · Academy","A graduation cap made of liquid glass with an amber rim light, floating above a dark architectural plan.","Promii Academy · guías paso a paso"),
  ("games","Imagen para compartir · Games","A stack of floor slabs drawn in thin white lines like a tower, one slab in cyan neon sliding in from the side, next to a red pipe crossing a grey beam with a cyan circle marking the clash, dark grid background.","Promii Games · juegos de arquitectura"),
  ("lab","Imagen para compartir · Motion Lab","A grid of small glowing experiments: a glass droplet, a squircle, springs, a blueprint, a 3D building exploding by levels, arranged neatly on a dark background like a specimen board.","Motion Lab · 14 demos de animación"),
  ("bitacora","Imagen para compartir · Bitácora","An open notebook of liquid glass pages with faint sketches, a droplet resting on it, dark background.","Bitácora · casos y procesos")]):
  add(f"W-{1+i:02d}","Alta" if i<2 else "Media","Promii","Web","promii.co (Open Graph)",t,"1200×630","1.91:1","16:9","Recortar 16:9 a 1.91:1. Texto centrado, márgenes de 60 px.","%s"%NB,"Glass",
   "Imagen que aparece al compartir el enlace en WhatsApp, LinkedIn, X, etc. Me la pasas y la instalo en el sitio.",p,texto=tx,paleta=P_PROMII,notas=f"Va en /assets/og-{sl}.jpg")
add("W-07","Media","Promii","Web","promii.co","Fondo hero alterno (estático)","2560×1440","16:9","16:9","Centro oscuro para el titular","%s"%NB,"Glass",
 "Fondo opcional para la portada del sitio (estático, sin animación, para no afectar el rendimiento).",
 "Abstract dark background: large soft out-of-focus color fields in deep blue and red at the edges, a faint dot grid, and three tiny liquid glass droplets catching light near the corners; the center calm and dark.",paleta=P_PROMII,notas="Exportar en WebP < 250 KB.")
add("W-08","Media","Promii","Web","academy.promii.co","Set de 7 íconos de temas Academy","1024×1024","1:1","1:1","Centrado","%s"%NB,"Glass",
 "Íconos para los 7 temas de Academy. Repite el prompt cambiando el objeto: 1) Revit con IA: a small 3D building with a glowing chip; 2) Nueva York: a stamped permit document with a tiny skyline; 3) Obra: a hard hat; 4) Sistemas: three connected nodes; 5) Ventas B2B: a handshake made of two glass shapes; 6) Marketing: a megaphone; 7) Diseño web: a browser window with a droplet.",
 "A single minimal icon centered on a near-black background: [OBJETO]. Made of liquid glass with a specular highlight, thin chromatic rim and soft shadow. Same family as a droplet logo.",
 texto="—",paleta=P_PROMII,notas="Reemplaza [OBJETO] por cada uno de los 7 de la descripción. Generar en la misma sesión.")
add("W-09","Media","Promii","Web","games.promii.co","Miniatura · Torre de niveles","1200×675","16:9","16:9","—","%s"%NB,"Blueprint",
 "Portada del juego Torre de niveles.",
 "A tall tower of concrete floor slabs drawn in thin white lines on a dark grid, slightly narrowing as it rises, with the top slab in cyan neon sliding in from the left and a cut-off piece falling in red dashed lines, level labels N+1, N+5 on the side.",paleta=P_PROMII)
add("W-10","Media","Promii","Web","games.promii.co","Miniatura · Detección de choques","1200×675","16:9","16:9","—","%s"%NB,"Blueprint",
 "Portada del juego Detección de choques.",
 "Top-down technical plan: grey steel beams crossing horizontally, red pipes running vertically, blue ducts passing below, and three glowing cyan circles marking where red pipes clash with beams, dark grid background, crisp and clean.",paleta=P_PROMII)
for i,(bt,t,p) in enumerate([
  ("BT-006","Claude + Revit #1: control de calidad del modelo","A 3D building model in white wireframe with a few elements highlighted in red and a checklist panel of liquid glass floating beside it, dark background."),
  ("BT-010","El patrón bandeja de entrada → salida → registro","Three liquid glass trays connected left to right by thin glowing lines: the first with scattered documents, the second with neatly stacked documents, the third with a thin log strip, dark background."),
  ("BT-013","Orden documental para varias obras a la vez","A dark wall of neatly labeled glass folders arranged in a precise grid of 15 categories, one folder glowing blue, architectural precision."),
  ("BT-017","Rabbit Holes: prospección B2B","A rabbit hole in the ground drawn as a spiral of thin white lines descending into depth, with small glowing contact cards orbiting along the spiral, dark background."),
  ("BT-030","Liquid Glass en la web","Close-up of a liquid glass panel with squircle corners bending a grid of lines behind it, showing refraction and chromatic fringes at the edge, dark background.")]):
  add(f"W-{11+i:02d}","Media","Promii","Web","Bitácora (portada de entrada)",f"Portada · {t}","1200×675","16:9","16:9","Tercio izquierdo libre para el titular","%s"%NB,"Glass",
   f"Portada para la próxima entrada {bt} de la Bitácora (matriz editorial).",p,texto=t,paleta=P_PROMII,notas="Sin nombres de clientes o empleadores.")

# ================= 9. EMAIL =================
add("EM-01","Media","Promii","Email","MailerLite","Encabezado newsletter Bitácora","1200×400","3:1","21:9","Recortar a 3:1; se ve a 600 px de ancho","%s"%NB,"Glass",
 "Encabezado de los correos de la Bitácora.",
 "A wide calm banner: a single liquid glass droplet on the right magnifying fine blueprint lines, the rest dark with a faint grid.",
 texto="Bitácora Promii",paleta=P_PROMII)
add("EM-02","Media","Promii","Email","MailerLite","Imagen correo de bienvenida","1200×600","2:1","16:9","Recortar a 2:1","%s"%NB,"Glass",
 "Imagen principal del correo de bienvenida (automatización pendiente).",
 "A liquid glass droplet opening like a door of light in the center of a dark background, soft warm light coming out, welcoming.",
 texto="Bienvenido a la Bitácora",paleta=P_PROMII)
add("EM-03","Baja","Brian (personal)","Email","Firma de correo","Banner de firma","1200×300","4:1","21:9","Se muestra a 600×150","%s"%FL,"Blueprint",
 "Banner pequeño para la firma de correo.",
 "A thin dark band with a minimal architectural line drawing on the right and a tiny liquid glass droplet, lots of empty space on the left.",
 texto="Brian Zuleta · promii.co · hi@promii.co",paleta=P_PROMII)

# ================= 10. TIENDA ARCHIKATZ =================
add("AK-01","Media","ArchiKatz","Tienda","Shopify ArchiKatz","Hero de la tienda","2400×1000","2.4:1","21:9","Contenido central; el texto va a la izquierda","%s"%NB,"ArchiKatz",
 "Imagen principal de la tienda ArchiKatz (prints en metal y acrílico, desk mats, techwear).",
 "A gallery wall inside a brutalist concrete space with three large glowing metal art prints (a fire ruby goddess, a sapphire mermaid, an emerald golem), cinematic volumetric light, sapphire and gold neon accents, a tabby cat with green eyes sitting on the floor looking at the art.",
 texto="ArchiKatz · Habitando lo no construido — Ver colección",paleta=P_AK)
add("AK-02","Baja","ArchiKatz","Tienda","Shopify ArchiKatz","Banner colección Elemental Guardians","2400×800","3:1","21:9","Recortar a 3:1","%s"%NB,"ArchiKatz",
 "Banner de la colección Elemental Guardians (Vol. 1).",
 "A panoramic lineup of four elemental guardians side by side: a volcanic fire goddess in ruby flames, a luminous sapphire mermaid with glowing water ribbons, a colossal emerald golem, and a translucent quartz air elemental, epic fantasy concept art, cinematic lighting.",
 texto="Elemental Guardians",paleta=P_AK,notas="Basado en los prompts literales del Vol. 1.")

# ================= 11. EDITORIAL / WEBTOON (desde editorial/episodes.json) =================
import json as _json, pathlib as _pl
_ep = _pl.Path(__file__).resolve().parent.parent.parent / 'editorial' / 'episodes.json'
if _ep.exists():
    for e in _json.loads(_ep.read_text()):
        for k, pnl in enumerate(e['panels']):
            if not pnl.get('prompt'): continue
            add(f"WT-{e['n']:02d}-{k+1:02d}", "Media", "ArchiKatz", "Editorial", "promii.co/editorial (webtoon)", f"Episodio {e['n']} · viñeta {k+1}", "1200×1560", "10:13", "3:4", "Dejar libre el tercio superior (texto de narración) o el inferior (globo de diálogo)", NB, "ArchiKatz",
                f"Viñeta {k+1} del episodio '{e['title']['es']}'. Al generarla, guárdala en editorial/img/ y pon su ruta en \"img\" del panel en editorial/episodes.json.",
                pnl['prompt'], texto=(pnl.get('speaker','') + ': ' if pnl.get('speaker') else '') + pnl['es'], paleta=P_AK, notas="Mismo estilo en todas las viñetas del episodio; Michi siempre gata atigrada de ojos verdes y collar táctico.")

# ---------- Libro ----------
wb = Workbook()
ws = wb.active; ws.title = "Matriz"
H = Font(bold=True, color="FFFFFF"); HF = PatternFill("solid", fgColor="15151F")
thin = Side(style="thin", color="DDDDDD")
ws.append(COLS)
for c in range(1, len(COLS)+1):
    cell = ws.cell(1, c); cell.font = H; cell.fill = HF; cell.alignment = Alignment(wrap_text=True, vertical="center")
for r in rows: ws.append(r)
widths = {"ID":8,"Prioridad":9,"Estado":13,"Marca":16,"Grupo":11,"Plataforma":20,"Pieza":30,"Tamaño final (px)":13,"Relación final":9,"Relación para generar":10,"Zona segura / recorte":34,"Herramienta":18,"Estilo":14,"Descripción (qué es y para qué sirve)":44,"PROMPT (copiar y pegar)":90,"Evitar (prompt negativo)":46,"Texto a poner después (Canva/Figma)":36,"Referencia a subir":24,"Paleta":26,"Nombre de archivo":40,"Carpeta en Drive":18,"Notas":40}
for i, c in enumerate(COLS, 1):
    ws.column_dimensions[get_column_letter(i)].width = widths.get(c, 14)
for row in ws.iter_rows(min_row=2):
    for cell in row:
        cell.alignment = Alignment(wrap_text=True, vertical="top"); cell.border = Border(bottom=thin)
ws.freeze_panes = "C2"; ws.auto_filter.ref = ws.dimensions
dv = DataValidation(type="list", formula1='"Por generar,Generando,Por revisar,Aprobada,Publicada,Descartada"', allow_blank=True)
ws.add_data_validation(dv); dv.add(f"C2:C{len(rows)+1}")
dp = DataValidation(type="list", formula1='"Alta,Media,Baja"', allow_blank=True)
ws.add_data_validation(dp); dp.add(f"B2:B{len(rows)+1}")

# Pestaña: Cómo usar
g = wb.create_sheet("Cómo usar")
guide = [
 ["CÓMO USAR ESTA MATRIZ"],
 [""],
 ["1. Filtra por Prioridad = Alta y empieza por la pestaña Identidad (L-01, L-02, L-03): el resto se apoya en el símbolo aprobado."],
 ["2. Abre Nano Banana Pro (app Gemini → Crear imagen, o AI Studio) o Google Flow. Si la herramienta tiene selector de proporción, usa la columna 'Relación para generar'."],
 ["3. Copia la celda PROMPT completa (ya trae el bloque de estilo y la proporción). Si la herramienta tiene campo negativo, pega 'Evitar'; si no, agrega al final: 'Avoid: ' + el texto de Evitar."],
 ["4. Si la fila pide 'Referencia a subir', adjunta esa imagen ANTES de enviar el prompt (fotos tuyas para P-01/P-02/YT; el símbolo aprobado para P-03 y los íconos)."],
 ["5. Genera 4 variantes, escoge 1, y si hace falta pide ajustes en lenguaje natural ('más espacio a la izquierda', 'la gota más grande')."],
 ["6. Recorta al 'Tamaño final' respetando la 'Zona segura' (Canva → Redimensionar, o Figma). Agrega el texto de la columna 'Texto a poner después' en Canva/Figma: la IA no es confiable con frases largas."],
 ["7. Guarda con el 'Nombre de archivo' exacto en la 'Carpeta en Drive' indicada (carpeta 'Imágenes · Generadas' junto a esta hoja) y cambia el Estado a 'Por revisar' o 'Aprobada'."],
 ["8. Avísame y yo instalo en el sitio las imágenes web (Open Graph, portadas de Bitácora, juegos, íconos de Academy, favicon)."],
 [""],
 ["CONSEJOS"],
 ["• Consistencia: haz las series (carrusel, íconos, destacadas) en la misma conversación y pide 'same style as the previous image'."],
 ["• Logos: la IA sirve para explorar; el logo final se redibuja en vector (Figma/Illustrator o Vectorizer.ai)."],
 ["• Tu cara: sin fotos de referencia el retrato no serás tú. Revisa siempre que la identidad sea fiel."],
 ["• Marcas separadas: ArchiKatz (Michi, Milo, personajes del Vol. 2) nunca aparece en piezas de Promii o Studio BZ, y viceversa."],
 ["• Texto en imagen: Nano Banana Pro escribe bien palabras cortas (promii, BZ). Frases y titulares, mejor en Canva."],
 ["• Formatos que no existen en el generador (4:1, 6:1, 1.91:1…): genera en la proporción indicada y recorta."],
 ["• Peso: imágenes web en JPG/WebP de 80% de calidad, menos de 300 KB."],
]
for r in guide: g.append(r)
g.column_dimensions["A"].width = 150
g["A1"].font = Font(bold=True, size=14); g["A12"].font = Font(bold=True)
for row in g.iter_rows():
    for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")

# Pestaña: Estilos
s2 = wb.create_sheet("Bloques de estilo")
s2.append(["Bloque","Úsalo para","Texto (ya incluido en cada prompt de la Matriz)"])
uses = {'GLASS':"Promii: estilo principal (Liquid Glass)",'BLUEPRINT':"Studio BZ / piezas técnicas, planos",'INK':"Variante Tinta china",'OBSIDIAN':"Variante Obsidiana (oro y neón)",'ARCHIKATZ':"Todo lo de ArchiKatz",'PHOTO':"Retratos con tu foto de referencia"}
for k,v in S.items(): s2.append([k, uses[k], v])
s2.append([]); s2.append(["NEGATIVO BASE","Todas las piezas",NEG_BASE]); s2.append(["NEGATIVO PERSONAS","Retratos",NEG_PEOPLE])
s2.append([]); s2.append(["PALETAS"])
for n,p in [("Promii · Liquid Glass",P_PROMII),("Obsidiana",P_GEM),("Tinta china",P_INK),("ArchiKatz",P_AK),("Gemas por marca","Promii oro #E8B23A · ArchiKatz magenta · Michi zafiro #4F9BFF · Lumen ámbar")]: s2.append([n,"",p])
s2.append([]); s2.append(["TIPOGRAFÍA","Para el texto que agregas en Canva/Figma","Títulos: Space Grotesk Bold (tracking -2%) · Texto: Inter · Datos/código: JetBrains Mono"])
for col,w in zip("ABC",(18,40,120)): s2.column_dimensions[col].width = w
for c in s2[1]: c.font = H; c.fill = HF
for row in s2.iter_rows():
    for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")

# Pestaña: Formatos
f = wb.create_sheet("Formatos de referencia")
f.append(["Plataforma","Pieza","Tamaño recomendado (px)","Proporción","Zona segura / notas"])
for r in [
 ["LinkedIn","Banner perfil personal","1584×396","4:1","Foto tapa abajo-izquierda en computador; en celular se centra"],
 ["LinkedIn","Portada página empresa","1128×191","~6:1","Logo tapa abajo-izquierda"],
 ["LinkedIn","Logo / foto de perfil","400×400 (subir 1080)","1:1","Recorte circular"],
 ["LinkedIn","Post horizontal","1200×627","1.91:1","—"],
 ["LinkedIn","Post cuadrado / vertical","1080×1080 / 1080×1350","1:1 / 4:5","Vertical ocupa más pantalla"],
 ["LinkedIn","Carrusel (PDF)","1080×1350","4:5","Subir como documento PDF"],
 ["LinkedIn","Portada artículo / newsletter","1920×1080","16:9","—"],
 ["YouTube","Banner del canal","2560×1440","16:9","Zona segura 1546×423 central"],
 ["YouTube","Miniatura","1280×720","16:9","Duración tapa abajo-derecha"],
 ["YouTube","Foto de perfil","800×800","1:1","Circular"],
 ["YouTube","Marca de agua","150×150","1:1","PNG transparente"],
 ["YouTube Shorts / Reels / TikTok","Portada vertical","1080×1920","9:16","Evitar 15–20% inferior y lateral derecho"],
 ["Instagram","Post feed","1080×1350 (o 1080×1080)","4:5","La cuadrícula del perfil muestra 3:4"],
 ["Instagram","Historia / Reel","1080×1920","9:16","Evitar 250 px arriba y abajo"],
 ["Instagram","Foto de perfil","320×320 (subir 1080)","1:1","Circular"],
 ["Facebook","Portada de página","1640×624","2.63:1","En celular se recorta a los lados"],
 ["Facebook","Post enlace","1200×630","1.91:1","—"],
 ["X","Encabezado","1500×500","3:1","Foto tapa abajo-izquierda"],
 ["X","Imagen de post","1600×900","16:9","—"],
 ["Pinterest","Pin","1000×1500","2:3","—"],
 ["Behance","Portada de proyecto","1616×1264 (mín. 808×632)","~1.28:1","—"],
 ["Behance","Banner de perfil","3200×410","~7.8:1","—"],
 ["Web","Open Graph (compartir enlaces)","1200×630","1.91:1","Texto con márgenes de 60 px"],
 ["Web","Favicon / app icon","512×512 y 180×180","1:1","—"],
 ["Email (MailerLite)","Encabezado","1200×400 (se ve a 600)","3:1","—"],
 ["Shopify","Hero de tienda","2400×1000","2.4:1","—"],
 ["WhatsApp Business","Foto de perfil","640×640","1:1","Circular"],
 ["Nano Banana Pro / Flow","Proporciones nativas","—","1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9","Las demás se generan en la más cercana y se recortan"],
]: f.append(r)
for col,w in zip("ABCDE",(26,32,26,18,60)): f.column_dimensions[col].width = w
for c in f[1]: c.font = H; c.fill = HF
for row in f.iter_rows():
    for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")

wb.save(OUT)
print(len(rows), "filas")
