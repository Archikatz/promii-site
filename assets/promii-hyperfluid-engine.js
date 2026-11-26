/* ==========================================================================
   PROMII HYPERFLUID ENGINE v4.0 ("Zero-Bloat Awwwards Stack")
   Ambient mode: opts.ambient=true skips Lenis/ScrollTrigger/Admin for verticals
   ========================================================================== */
(() => {
  const STORAGE_ADMIN_KEY = 'promii_hf_stage_override_v4';
  const DEFAULT_CFG = Object.assign({
    defaultAtmosphere: 'ARCHITECTURAL_LIGHT',
    ior: 1.45,
    liquidDistortion: 0.34,
    chromaticDispersion: 0.28,
    scrollVelocitySkew: 0.55,
    lenisLerp: 0.085,
    magneticStrength: 0.34,
    audioEnabledDefault: false,
    audioVolume: 0.14
  }, window.PROMII_STAGE_CONFIG || {});
  let savedOverride = null;
  try { savedOverride = JSON.parse(localStorage.getItem(STORAGE_ADMIN_KEY) || 'null'); } catch (_) {}
  const cfg = Object.assign({}, DEFAULT_CFG, savedOverride || {});

  const D_DORIAN = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99];
  let audioCtx = null;
  let audioEnabled = Boolean(cfg.audioEnabledDefault);

  const GlassAudio = {
    unlock() {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    },
    toggle(btnEl) {
      audioEnabled = !audioEnabled;
      if (audioEnabled) { this.unlock(); this.chime(4, 0.28); }
      document.querySelectorAll('[data-hf-audio-toggle]').forEach(el => {
        el.textContent = audioEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
        el.classList.toggle('active', audioEnabled);
      });
      if (btnEl) btnEl.blur();
      return audioEnabled;
    },
    chime(noteIdx = 0, duration = 0.22) {
      if (!audioEnabled) return;
      this.unlock();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const freq = D_DORIAN[Math.abs(Math.floor(noteIdx)) % D_DORIAN.length];
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc1.type = 'sine'; osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.5, now);
      const vol = Math.max(0.01, Math.min(0.35, cfg.audioVolume));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
      osc1.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination);
      osc1.start(now); osc2.start(now); osc1.stop(now + duration); osc2.stop(now + duration);
    }
  };

  const LIQUID_VERTEX_SHADER = `
    uniform float uTime; uniform float uDistortion; uniform float uVelocity; uniform vec2 uPointer;
    varying vec3 vNormalW; varying vec3 vViewDir; varying vec3 vLocalPos; varying float vDisplacement;
    float fluidWave(vec3 p, float t) {
      float w1 = sin(p.x * 2.4 + t * 1.35) * cos(p.y * 2.2 - t * 1.15) * sin(p.z * 2.5 + t * 0.95);
      float w2 = sin(p.y * 4.6 + t * 2.10) * cos(p.z * 4.1 + t * 1.70) * 0.42;
      float w3 = cos((p.x + p.y) * 6.2 - t * 2.6) * 0.16;
      return w1 + w2 + w3;
    }
    void main() {
      vLocalPos = position;
      vec3 norm = normalize(normal);
      vec2 pointerDelta = position.xy - uPointer * 1.45;
      float pointerInfluence = exp(-dot(pointerDelta, pointerDelta) * 1.35) * 0.24;
      float wave = fluidWave(position, uTime);
      float disp = wave * uDistortion + pointerInfluence;
      vec3 displaced = position + norm * disp;
      displaced.y += position.y * clamp(uVelocity * 0.00045, -0.28, 0.28);
      displaced.x -= position.x * clamp(abs(uVelocity) * 0.00018, 0.0, 0.14);
      float eps = 0.04;
      float dx = fluidWave(position + vec3(eps, 0.0, 0.0), uTime) - wave;
      float dy = fluidWave(position + vec3(0.0, eps, 0.0), uTime) - wave;
      float dz = fluidWave(position + vec3(0.0, 0.0, eps), uTime) - wave;
      vec3 perturbedNormal = normalize(norm - vec3(dx, dy, dz) * (uDistortion * 2.8));
      vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
      vNormalW = normalize(mat3(modelMatrix) * perturbedNormal);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      vDisplacement = disp;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const LIQUID_FRAGMENT_SHADER = `
    uniform float uTime; uniform float uIor; uniform float uDispersion; uniform float uDarkMix;
    uniform vec3 uAccent; uniform vec3 uSecondary;
    varying vec3 vNormalW; varying vec3 vViewDir; varying vec3 vLocalPos; varying float vDisplacement;
    vec3 sampleStudioEnv(vec3 dir, float darkMode) {
      float up = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
      vec3 lightSky = mix(vec3(0.89, 0.93, 0.93), vec3(1.0, 1.0, 1.0), smoothstep(0.2, 0.95, up));
      vec3 darkSky  = mix(vec3(0.03, 0.05, 0.09), vec3(0.11, 0.20, 0.28), smoothstep(0.15, 0.92, up));
      vec3 baseEnv  = mix(lightSky, darkSky, darkMode);
      float softbox1 = pow(max(0.0, dot(dir, normalize(vec3(0.55, 0.78, 0.35)))), 14.0);
      float softbox2 = pow(max(0.0, dot(dir, normalize(vec3(-0.65, 0.45, 0.58)))), 10.0);
      float rimBand  = pow(max(0.0, sin(dir.x * 9.0 + dir.y * 5.0 + uTime * 0.5)), 8.0) * 0.16;
      return baseEnv + vec3(1.0) * (softbox1 * 0.95) + uAccent * (softbox2 * 0.58 + rimBand);
    }
    void main() {
      vec3 N = normalize(vNormalW); vec3 V = normalize(vViewDir);
      float f0 = pow((1.0 - uIor) / (1.0 + uIor), 2.0);
      float cosTheta = clamp(dot(N, V), 0.0, 1.0);
      float fresnel = f0 + (1.0 - f0) * pow(1.0 - cosTheta, 4.2);
      float shift = uDispersion * 0.09;
      vec3 refrR = refract(-V, N, (1.0 / uIor) - shift);
      vec3 refrG = refract(-V, N, (1.0 / uIor));
      vec3 refrB = refract(-V, N, (1.0 / uIor) + shift);
      vec3 refractedColor = vec3(sampleStudioEnv(refrR, uDarkMix).r, sampleStudioEnv(refrG, uDarkMix).g, sampleStudioEnv(refrB, uDarkMix).b);
      vec3 reflDir = reflect(-V, N);
      vec3 reflectedColor = sampleStudioEnv(reflDir, uDarkMix);
      vec3 coreTint = mix(uAccent, uSecondary, clamp(vLocalPos.y * 0.5 + 0.5, 0.0, 1.0));
      float causticGlow = smoothstep(-0.15, 0.28, vDisplacement) * 0.25;
      vec3 glassColor = mix(refractedColor, reflectedColor, clamp(fresnel * 1.25, 0.08, 0.96));
      glassColor += coreTint * (causticGlow + fresnel * 0.32);
      float spec = pow(max(0.0, dot(reflDir, normalize(vec3(0.35, 0.72, 0.62)))), 36.0);
      glassColor += vec3(1.0) * spec * 0.78;
      gl_FragColor = vec4(glassColor, mix(0.84, 0.94, fresnel));
    }
  `;

  let scene, camera, renderer, dropletMesh, sat1, sat2;
  let groupDroplet, groupBim, groupTrinity, groupGlobe;
  let bimSlabs = [], trinityOrbs = [], liquidUniforms;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollProgress = 0, scrollVelocity = 0, activeAct = 'droplet';
  let darkAtmosphereTarget = 0, darkAtmosphereCurrent = 0, lenisInstance = null;

  function resolveInitialDarkTarget() {
    if (cfg.defaultAtmosphere === 'OBSIDIAN_LUXURY') return 1;
    if (cfg.defaultAtmosphere === 'AUTO_ADAPTIVE') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
    }
    return 0;
  }
  function applyDocumentThemeClass(isDark) {
    document.body.classList.toggle('hf-obsidian', isDark);
    document.body.classList.toggle('hf-light', !isDark);
  }
  function hexToThreeVec3(hex) {
    const c = new THREE.Color(hex || '#0F9D84');
    return new THREE.Vector3(c.r, c.g, c.b);
  }

  function buildScene(canvas) {
    if (!window.THREE || !canvas) return;
    const isMobile = window.innerWidth < 768;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 6.8 : 5.4);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.35); dirLight1.position.set(4, 6, 5);
    const dirLight2 = new THREE.PointLight(0x22e0c8, 1.4, 18); dirLight2.position.set(-4, -3, 3);
    scene.add(ambLight, dirLight1, dirLight2);
    liquidUniforms = {
      uTime: { value: 0 }, uDistortion: { value: cfg.liquidDistortion }, uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) }, uIor: { value: cfg.ior },
      uDispersion: { value: cfg.chromaticDispersion }, uDarkMix: { value: resolveInitialDarkTarget() },
      uAccent: { value: hexToThreeVec3('#0F9D84') }, uSecondary: { value: hexToThreeVec3('#E0533C') }
    };
    const liquidMat = new THREE.ShaderMaterial({
      vertexShader: LIQUID_VERTEX_SHADER, fragmentShader: LIQUID_FRAGMENT_SHADER,
      uniforms: liquidUniforms, transparent: true
    });
    groupDroplet = new THREE.Group();
    const detail = isMobile ? 44 : 96;
    dropletMesh = new THREE.Mesh(new THREE.SphereGeometry(1.22, detail, detail), liquidMat);
    groupDroplet.add(dropletMesh);
    const satGeo = new THREE.SphereGeometry(0.16, 28, 28);
    sat1 = new THREE.Mesh(satGeo, liquidMat);
    sat2 = new THREE.Mesh(satGeo, new THREE.MeshPhysicalMaterial({ color: 0xe0533c, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.88 }));
    const orbitRing = new THREE.Mesh(new THREE.RingGeometry(1.78, 1.80, 96), new THREE.MeshBasicMaterial({ color: 0x0f9d84, side: THREE.DoubleSide, transparent: true, opacity: 0.25 }));
    orbitRing.rotation.x = Math.PI * 0.36; orbitRing.rotation.y = Math.PI * 0.12;
    groupDroplet.add(sat1, sat2, orbitRing); scene.add(groupDroplet);

    groupBim = new THREE.Group(); groupBim.visible = false;
    const slabColors = [0x0f9d84, 0x2563eb, 0x22e0c8, 0xe8b23a];
    for (let i = 0; i < 4; i++) {
      const slabGroup = new THREE.Group();
      const boxGeo = new THREE.BoxGeometry(2.15 - i * 0.12, 0.12, 1.55 - i * 0.08);
      const boxMat = new THREE.MeshPhysicalMaterial({ color: slabColors[i], roughness: 0.14, metalness: 0.08, transparent: true, opacity: 0.46 });
      slabGroup.add(new THREE.Mesh(boxGeo, boxMat), new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: slabColors[i], transparent: true, opacity: 0.92 })));
      slabGroup.userData.baseY = (i - 1.5) * 0.22; slabGroup.position.y = slabGroup.userData.baseY;
      bimSlabs.push(slabGroup); groupBim.add(slabGroup);
    }
    groupBim.rotation.set(0.46, -0.62, 0.12); scene.add(groupBim);

    groupTrinity = new THREE.Group(); groupTrinity.visible = false;
    const tColors = [0x2563eb, 0xc88a1e, 0x0f9d84];
    for (let i = 0; i < 3; i++) {
      const wrap = new THREE.Group();
      wrap.add(
        new THREE.Mesh(new THREE.SphereGeometry(0.52, isMobile ? 32 : 56, isMobile ? 32 : 56), liquidMat),
        new THREE.Mesh(new THREE.RingGeometry(0.68, 0.71, 48), new THREE.MeshBasicMaterial({ color: tColors[i], side: THREE.DoubleSide, transparent: true, opacity: 0.55 }))
      );
      trinityOrbs.push(wrap); groupTrinity.add(wrap);
    }
    scene.add(groupTrinity);

    groupGlobe = new THREE.Group(); groupGlobe.visible = false;
    groupGlobe.add(
      new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, isMobile ? 2 : 3), new THREE.MeshPhysicalMaterial({ color: 0x0f9d84, roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0.35 })),
      new THREE.Mesh(new THREE.IcosahedronGeometry(1.36, isMobile ? 1 : 2), new THREE.MeshBasicMaterial({ color: 0x22e0c8, wireframe: true, transparent: true, opacity: 0.35 }))
    );
    const hubBog = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: 0x10A37F }));
    hubBog.position.set(-0.35, -0.15, 1.15);
    const hubDen = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xE85A4F }));
    hubDen.position.set(-0.55, 0.35, 1.05);
    groupGlobe.add(hubBog, hubDen); scene.add(groupGlobe);

    darkAtmosphereTarget = resolveInitialDarkTarget();
    darkAtmosphereCurrent = darkAtmosphereTarget;
    applyDocumentThemeClass(darkAtmosphereTarget > 0.5);
  }

  function setStageAct(actName, accentHex) {
    activeAct = actName || 'droplet';
    if (accentHex && liquidUniforms) liquidUniforms.uAccent.value = hexToThreeVec3(accentHex);
    if (groupDroplet) groupDroplet.visible = activeAct === 'droplet' || activeAct === 'obsidian-vault' || activeAct === 'finale';
    if (groupBim) groupBim.visible = activeAct === 'bim-slabs';
    if (groupTrinity) groupTrinity.visible = activeAct === 'trinity-nodes';
    if (groupGlobe) groupGlobe.visible = activeAct === 'globe';
    const label = document.getElementById('hfActiveActLabel');
    if (label) label.textContent = 'STAGE · ' + String(activeAct).toUpperCase();
    try { GlassAudio.chime(2, 0.12); } catch (_) {}
  }

  function updateActFromScroll(p) {
    let act = 'droplet', accent = '#0F9D84';
    if (p >= 0.92) { act = 'finale'; }
    else if (p >= 0.78) { act = 'globe'; }
    else if (p >= 0.58) { act = 'obsidian-vault'; accent = '#E8B23A'; }
    else if (p >= 0.38) { act = 'trinity-nodes'; accent = '#2563EB'; }
    else if (p >= 0.18) { act = 'bim-slabs'; }
    if (act !== activeAct) setStageAct(act, accent);
    if (cfg.defaultAtmosphere === 'ARCHITECTURAL_LIGHT') {
      darkAtmosphereTarget = (p >= 0.58 && p < 0.78) ? 1 : 0;
    }
  }

  function animate(t) {
    if (!renderer || !scene || !camera) return;
    if (document.hidden) { requestAnimationFrame(animate); return; }
    const time = (t || 0) * 0.001;
    if (liquidUniforms) {
      liquidUniforms.uTime.value = time;
      liquidUniforms.uVelocity.value = scrollVelocity;
      liquidUniforms.uPointer.value.set(pointer.x, pointer.y);
      liquidUniforms.uDistortion.value = cfg.liquidDistortion;
      liquidUniforms.uIor.value = cfg.ior;
      liquidUniforms.uDispersion.value = cfg.chromaticDispersion;
      darkAtmosphereCurrent += (darkAtmosphereTarget - darkAtmosphereCurrent) * 0.04;
      liquidUniforms.uDarkMix.value = darkAtmosphereCurrent;
      applyDocumentThemeClass(darkAtmosphereCurrent > 0.5);
    }
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;
    if (groupDroplet && groupDroplet.visible) {
      groupDroplet.rotation.y = time * 0.25;
      groupDroplet.rotation.x = Math.sin(time * 0.4) * 0.08;
      if (sat1) sat1.position.set(Math.cos(time * 1.2) * 1.9, Math.sin(time * 0.9) * 0.4, Math.sin(time * 1.2) * 1.9);
      if (sat2) sat2.position.set(Math.cos(time * 1.5 + 2.1) * 2.15, Math.cos(time * 0.7) * 0.5, Math.sin(time * 1.5 + 2.1) * 2.15);
    }
    if (groupBim && groupBim.visible) {
      groupBim.rotation.y = -0.62 + Math.sin(time * 0.2) * 0.05;
      bimSlabs.forEach((slab, i) => {
        const explode = Math.min(1, Math.max(0, (scrollProgress - 0.18) / 0.2));
        slab.position.y = slab.userData.baseY + explode * (i - 1.5) * 0.55;
      });
    }
    if (groupTrinity && groupTrinity.visible) {
      trinityOrbs.forEach((wrap, i) => {
        const a = time * 0.6 + (i * Math.PI * 2) / 3;
        wrap.position.set(Math.cos(a) * 1.4, Math.sin(a * 1.3) * 0.35, Math.sin(a) * 1.4);
        wrap.rotation.y = time * 0.5;
      });
    }
    if (groupGlobe && groupGlobe.visible) {
      groupGlobe.rotation.y = time * 0.35;
      groupGlobe.rotation.x = 0.25 + Math.sin(time * 0.2) * 0.05;
    }
    renderer.render(scene, camera);
    const coords = document.getElementById('hfCadCoords');
    if (coords) coords.textContent = 'XY(' + pointer.x.toFixed(2) + ', ' + pointer.y.toFixed(2) + ') · V:' + scrollVelocity.toFixed(1) + ' · ' + Math.round(scrollProgress * 100) + '%';
    requestAnimationFrame(animate);
  }

  function setupScroll() {
    if (window.Lenis) {
      lenisInstance = new Lenis({ lerp: cfg.lenisLerp });
      function raf(time) { lenisInstance.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      lenisInstance.on('scroll', ({ scroll, velocity, limit }) => {
        scrollVelocity = velocity || 0;
        const max = limit || (document.documentElement.scrollHeight - window.innerHeight) || 1;
        scrollProgress = Math.min(1, Math.max(0, scroll / max));
        updateActFromScroll(scrollProgress);
      });
    } else {
      window.addEventListener('scroll', () => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollProgress = Math.min(1, Math.max(0, window.scrollY / max));
        scrollVelocity = 0;
        updateActFromScroll(scrollProgress);
      }, { passive: true });
    }
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll('[data-hf-act]').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 70%', end: 'bottom 30%',
          onEnter: () => setStageAct(sec.getAttribute('data-hf-act'), sec.getAttribute('data-hf-accent') || '#0F9D84'),
          onEnterBack: () => setStageAct(sec.getAttribute('data-hf-act'), sec.getAttribute('data-hf-accent') || '#0F9D84')
        });
      });
    }
  }

  function setupMagnetic() {
    document.querySelectorAll('[data-hf-magnetic]').forEach((btn) => {
      const strength = parseFloat(btn.getAttribute('data-hf-magnetic') || '0.3');
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + (dx * strength * 0.15) + 'px,' + (dy * strength * 0.15) + 'px)';
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
      btn.addEventListener('click', () => { try { GlassAudio.chime(5, 0.18); } catch (_) {} });
    });
  }

  function setupTilt() {
    document.querySelectorAll('[data-hf-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg)';
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  function setupAdminPanel() {
    let drawer = document.getElementById('hf-admin-drawer');
    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.id = 'hf-admin-drawer';
      drawer.innerHTML = '<div class="hf-admin-inner"><header><strong>⚙ STAGE ADMIN</strong><button type="button" data-hf-admin-close>×</button></header>' +
        '<label>Atmosphere<select data-hf-atm><option value="ARCHITECTURAL_LIGHT">Architectural Light</option><option value="OBSIDIAN_LUXURY">Obsidian Luxury</option><option value="AUTO_ADAPTIVE">Auto Adaptive</option></select></label>' +
        '<label>IOR <input type="range" min="1.33" max="1.52" step="0.01" data-hf-ior></label>' +
        '<label>Liquid Distortion <input type="range" min="0" max="0.8" step="0.01" data-hf-dist></label>' +
        '<label>Chromatic Dispersion <input type="range" min="0" max="0.6" step="0.01" data-hf-disp></label>' +
        '<label>Lenis Lerp <input type="range" min="0.04" max="0.2" step="0.005" data-hf-lenis></label>' +
        '<button type="button" data-hf-export>Copiar Config JSON para Producción</button>' +
        '<p style="font-size:11px;opacity:.7">Shift+A · ?admin=1</p></div>';
      document.body.appendChild(drawer);
      const style = document.createElement('style');
      style.textContent = '#hf-admin-drawer{position:fixed;top:0;right:0;width:min(340px,100vw);height:100vh;z-index:200;background:rgba(12,14,20,.94);color:#F4F4F8;transform:translateX(110%);transition:transform .3s ease;backdrop-filter:blur(18px);border-left:1px solid rgba(255,255,255,.12);font:13px Inter,system-ui}#hf-admin-drawer.open{transform:none}#hf-admin-drawer .hf-admin-inner{padding:18px;display:flex;flex-direction:column;gap:12px}#hf-admin-drawer header{display:flex;justify-content:space-between;align-items:center}#hf-admin-drawer label{display:flex;flex-direction:column;gap:6px;font-size:12px}#hf-admin-drawer input,#hf-admin-drawer select{width:100%}#hf-admin-drawer button[data-hf-export]{padding:10px;border-radius:10px;border:1px solid rgba(34,224,200,.4);background:rgba(34,224,200,.12);color:#22E0C8;cursor:pointer;font-weight:700}';
      document.head.appendChild(style);
    }
    function openAdmin() {
      drawer.classList.add('open');
      drawer.querySelector('[data-hf-atm]').value = cfg.defaultAtmosphere;
      drawer.querySelector('[data-hf-ior]').value = cfg.ior;
      drawer.querySelector('[data-hf-dist]').value = cfg.liquidDistortion;
      drawer.querySelector('[data-hf-disp]').value = cfg.chromaticDispersion;
      drawer.querySelector('[data-hf-lenis]').value = cfg.lenisLerp;
    }
    function closeAdmin() { drawer.classList.remove('open'); }
    document.querySelectorAll('[data-hf-admin-btn]').forEach(b => b.addEventListener('click', openAdmin));
    drawer.querySelector('[data-hf-admin-close]').addEventListener('click', closeAdmin);
    drawer.querySelector('[data-hf-atm]').addEventListener('change', (e) => {
      cfg.defaultAtmosphere = e.target.value; darkAtmosphereTarget = resolveInitialDarkTarget();
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(cfg));
    });
    drawer.querySelector('[data-hf-ior]').addEventListener('input', (e) => {
      cfg.ior = parseFloat(e.target.value); if (liquidUniforms) liquidUniforms.uIor.value = cfg.ior;
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(cfg));
    });
    drawer.querySelector('[data-hf-dist]').addEventListener('input', (e) => {
      cfg.liquidDistortion = parseFloat(e.target.value); if (liquidUniforms) liquidUniforms.uDistortion.value = cfg.liquidDistortion;
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(cfg));
    });
    drawer.querySelector('[data-hf-disp]').addEventListener('input', (e) => {
      cfg.chromaticDispersion = parseFloat(e.target.value); if (liquidUniforms) liquidUniforms.uDispersion.value = cfg.chromaticDispersion;
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(cfg));
    });
    drawer.querySelector('[data-hf-lenis]').addEventListener('input', (e) => {
      cfg.lenisLerp = parseFloat(e.target.value); localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(cfg));
    });
    drawer.querySelector('[data-hf-export]').addEventListener('click', () => {
      const payload = 'window.PROMII_STAGE_CONFIG = ' + JSON.stringify({
        defaultAtmosphere: cfg.defaultAtmosphere, ior: cfg.ior, liquidDistortion: cfg.liquidDistortion,
        chromaticDispersion: cfg.chromaticDispersion, scrollVelocitySkew: cfg.scrollVelocitySkew,
        lenisLerp: cfg.lenisLerp, magneticStrength: cfg.magneticStrength, audioEnabledDefault: false, audioVolume: cfg.audioVolume
      }, null, 2) + ';\n';
      navigator.clipboard.writeText(payload).then(() => alert('Config copiada')).catch(() => prompt('Copia:', payload));
    });
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (drawer.classList.contains('open')) closeAdmin(); else openAdmin();
      }
    });
    if (/[?&]admin=1/.test(location.search)) openAdmin();
  }

  function initHyperfluidStage(opts) {
    opts = opts || {};
    const canvasId = opts.canvasId || 'promii-webgl-canvas';
    const ambient = !!opts.ambient;
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.THREE) {
      console.warn('[PromiiHyperfluid] canvas or THREE missing');
      return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cfg.liquidDistortion = Math.min(cfg.liquidDistortion, 0.08);
      cfg.scrollVelocitySkew = 0;
    }
    if (ambient) {
      cfg.liquidDistortion = Math.min(cfg.liquidDistortion, 0.22);
      canvas.style.opacity = opts.canvasOpacity != null ? String(opts.canvasOpacity) : '0.42';
    }
    buildScene(canvas);
    if (!ambient) setupScroll();
    setupMagnetic();
    setupTilt();
    if (!ambient) setupAdminPanel();
    if (opts.act) setStageAct(opts.act, opts.accent || '#0F9D84');
    document.querySelectorAll('[data-hf-audio-toggle]').forEach(btn => {
      btn.addEventListener('click', () => GlassAudio.toggle(btn));
    });
    window.addEventListener('pointermove', (e) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      const isMobile = window.innerWidth < 768;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    if (!opts.act) setStageAct('droplet', '#0F9D84');
    requestAnimationFrame(animate);
  }

  window.PromiiHyperfluid = {
    init: initHyperfluidStage,
    setAct: setStageAct,
    audio: GlassAudio,
    getConfig: () => Object.assign({}, cfg)
  };
})();
