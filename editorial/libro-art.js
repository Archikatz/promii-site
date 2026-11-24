/* ArchiKatz Editorial — WebGL: UNIQUE hero per chapter (gear, cube, ray…) */
window.AK_BOOK_ART = function (book, n, accent) {
  var a = accent || (book === 'psicodelia' ? '#c9a0ff' : '#d4af37');
  return '<div class="art-live" data-book="' + book + '" data-n="' + n + '" data-accent="' + a + '"></div>';
};

window.AK_MOUNT_ART = function (root) {
  if (!root) root = document;
  if (typeof THREE === 'undefined') {
    console.warn('[AK] THREE.js missing');
    return;
  }
  root.querySelectorAll('.art-live:not([data-mounted])').forEach(function (el) {
    el.setAttribute('data-mounted', '1');
    try { mountGL(el); } catch (e) { console.warn('[AK] scene fail', e); }
  });
};

function hexInt(h) {
  return parseInt(String(h).replace('#', ''), 16);
}
function isMobile() {
  return window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
}
function isLightTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

function mountGL(el) {
  var book = el.getAttribute('data-book');
  var n = +el.getAttribute('data-n');
  var accent = el.getAttribute('data-accent') || '#d4af37';
  var color = hexInt(accent);
  var isP = book === 'psicodelia';
  var mobile = isMobile();
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var segs = mobile ? 20 : 40;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  camera.position.set(0, 0.2, 7);

  var renderer = new THREE.WebGLRenderer({
    antialias: !mobile,
    alpha: true,
    powerPreference: mobile ? 'low-power' : 'high-performance'
  });
  renderer.setPixelRatio(Math.min(mobile ? 1.5 : 2, window.devicePixelRatio || 1));
  renderer.domElement.className = 'art-canvas';
  renderer.domElement.style.touchAction = 'none';
  el.appendChild(renderer.domElement);

  var amb = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(amb);
  var key = new THREE.PointLight(color, 1.8, 30);
  key.position.set(3, 4, 5);
  scene.add(key);
  var fill = new THREE.PointLight(0xffffff, 0.5, 20);
  fill.position.set(-4, 0, 3);
  scene.add(fill);

  var particles = null, pVel = null;
  var group = new THREE.Group();
  scene.add(group);
  var clock = new THREE.Clock();
  var running = false, raf = 0;
  var ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  var spinSpeed = 0.35;

  function applyThemeColors() {
    var light = isLightTheme();
    var bg = light ? 0xe8e2d6 : 0x07070c;
    scene.fog = new THREE.FogExp2(bg, light ? 0.02 : 0.035);
    renderer.setClearColor(bg, 1);
    amb.intensity = light ? 0.75 : 0.4;
    key.intensity = light ? 2.2 : 1.8;
  }

  function makeParticles(count, spread, size) {
    if (mobile) { count = Math.floor(count * 0.4); size *= 1.3; }
    count = Math.min(count, mobile ? 120 : 280);
    var pGeo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    pVel = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i*3] = (Math.random()-0.5) * spread;
      pos[i*3+1] = (Math.random()-0.5) * spread;
      pos[i*3+2] = (Math.random()-0.5) * spread;
      pVel[i*3] = (Math.random()-0.5) * 0.008;
      pVel[i*3+1] = (Math.random()-0.5) * 0.008;
      pVel[i*3+2] = (Math.random()-0.5) * 0.008;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: color, size: size, transparent: true, opacity: 0.7,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    }));
    scene.add(particles);
  }

  function matStd(opts) {
    return new THREE.MeshStandardMaterial(Object.assign({
      color: color, metalness: 0.55, roughness: 0.28
    }, opts || {}));
  }
  function matLine() {
    return new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
  }

  /* ========== FRACTALIA: order, gold geometry ========== */
  if (!isP && n === 1) {
    /* RAYO DE LUZ — vertical beam, not a sphere */
    makeParticles(180, 8, 0.035);
    var beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.55, 14, 20, 1, true),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.45, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
    );
    group.add(beam);
    group.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 14, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    ));
    /* small lens at top only */
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.28, segs, segs),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.05, transmission: 0.8, transparent: true, opacity: 0.95 })
    )).position.y = 3.4;
    camera.position.set(2.2, 0.5, 8);
    spinSpeed = 0.12;
  } else if (!isP && n === 2) {
    /* PRIMERA DENSIDAD — big solid sphere on GRID (hero = sphere+grid, gold) */
    makeParticles(100, 6, 0.03);
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.6, segs, segs),
      new THREE.MeshStandardMaterial({ color: color, metalness: 0.35, roughness: 0.2, emissive: color, emissiveIntensity: 0.15 })
    ));
    var grid = new THREE.GridHelper(12, 24, color, isLightTheme() ? 0xc4bba8 : 0x1a1a28);
    grid.position.y = -1.7;
    scene.add(grid);
    camera.position.set(3, 2.5, 7);
    spinSpeed = 0.2;
  } else if (!isP && n === 3) {
    /* GEOMETRÍA — large rotating CUBE (no sphere) */
    makeParticles(80, 5, 0.025);
    group.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.8, 2.8, 2.8)),
      new THREE.LineBasicMaterial({ color: color, linewidth: 2 })
    ));
    group.add(new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 2.8, 2.8),
      new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.18, metalness: 0.5, roughness: 0.25 })
    ));
    /* inner smaller cube */
    group.add(new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      matStd({ metalness: 0.7, roughness: 0.2 })
    ));
    camera.position.set(4, 2.5, 6);
    spinSpeed = 0.45;
  } else if (!isP && n === 4) {
    /* ENGRANAJE DORADO 3D — hero gear, fills view */
    makeParticles(90, 6, 0.028);
    var gear = new THREE.Group();
    gear.add(new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.38, 18, 48),
      matStd({ metalness: 0.85, roughness: 0.22 })
    ));
    gear.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.5, 24),
      matStd({ metalness: 0.8, roughness: 0.25 })
    ));
    for (var i = 0; i < 14; i++) {
      var ang = (i / 14) * Math.PI * 2;
      var tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.7, 0.45),
        matStd({ metalness: 0.8, roughness: 0.25 })
      );
      tooth.position.set(Math.cos(ang) * 1.85, Math.sin(ang) * 1.85, 0);
      tooth.rotation.z = ang;
      gear.add(tooth);
    }
    group.add(gear);
    camera.position.set(0, 0, 7.5);
    spinSpeed = 0.55;
  } else if (!isP && n === 5) {
    /* FALSA PERFECCIÓN — grid of tiles, ONE red anomaly */
    makeParticles(60, 4, 0.02);
    for (var i = 0; i < 7; i++) for (var j = 0; j < 5; j++) {
      var bad = (i === 4 && j === 2);
      var cell = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.62, 0.12),
        new THREE.MeshStandardMaterial({
          color: bad ? 0xff3b30 : color,
          metalness: 0.4, roughness: 0.35,
          emissive: bad ? 0xff3b30 : 0x000000,
          emissiveIntensity: bad ? 0.7 : 0
        })
      );
      cell.position.set((i - 3) * 0.78, (j - 2) * 0.78, 0);
      group.add(cell);
    }
    camera.position.set(0, 0, 8);
    spinSpeed = 0.15;
  } else if (!isP && n === 6) {
    /* VARIABLE OCULTA — frame + dark anomaly blob (not glass orb) */
    makeParticles(120, 7, 0.03);
    group.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(7, 4.5)),
      matLine()
    ));
    for (var i = 0; i < 6; i++) {
      group.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-3.2 + i * 1.1, -2.2, 0),
          new THREE.Vector3(-3.2 + i * 1.1, 2.2, 0)
        ]),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.25 })
      ));
    }
    var shadow = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x050508, metalness: 0.1, roughness: 0.9, emissive: 0x111118, emissiveIntensity: 0.3 })
    );
    shadow.position.set(1.4, 0.2, 0.5);
    group.add(shadow);
    camera.position.set(0, 0.5, 8);
    spinSpeed = 0.18;
  } else if (!isP && n === 7) {
    /* FALLA CRÍTICA — cracked wireframe box + red tetra */
    makeParticles(100, 6, 0.03);
    group.add(new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.4, 1.8),
      new THREE.MeshStandardMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.7 })
    ));
    group.add(new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.85, metalness: 0.3, roughness: 0.4 })
    ));
    camera.position.set(3, 1.5, 7);
    spinSpeed = 0.4;
  } else if (!isP && n === 8) {
    /* COLAPSO — concentric GOLD RINGS + center spark (discos dorados) */
    makeParticles(200, 9, 0.035);
    for (var k = 1; k <= 6; k++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.45 * k, 0.04, 10, 64),
        new THREE.MeshStandardMaterial({
          color: color, metalness: 0.7, roughness: 0.25,
          emissive: color, emissiveIntensity: 0.12,
          transparent: true, opacity: 0.95 - k * 0.08
        })
      );
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    ));
    camera.position.set(0, 4, 6);
    camera.lookAt(0, 0, 0);
    spinSpeed = 0.3;
  }

  /* ========== PSICODELIA: fluid, violet, emotion ========== */
  else if (isP && n === 1) {
    /* INMENSIDAD — particle cloud + soft layered discs (not one orb) */
    makeParticles(320, 12, 0.05);
    for (var i = 0; i < 5; i++) {
      var disc = new THREE.Mesh(
        new THREE.TorusGeometry(1.2 + i * 0.45, 0.06, 8, 48),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.35 - i * 0.04, blending: THREE.AdditiveBlending })
      );
      disc.rotation.x = Math.PI / 2 + i * 0.08;
      disc.position.y = (i - 2) * 0.35;
      group.add(disc);
    }
    camera.position.set(0, 1, 8);
    spinSpeed = 0.25;
  } else if (isP && n === 2) {
    /* GRAVEDAD — floating form + ground disc + tether feel */
    makeParticles(140, 7, 0.03);
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.1, segs, segs),
      new THREE.MeshPhysicalMaterial({
        color: color, metalness: 0.1, roughness: 0.15,
        transmission: 0.55, transparent: true, opacity: 0.9, thickness: 1
      })
    )).position.y = 1.4;
    var ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.3, metalness: 0.2, roughness: 0.7 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    scene.add(ground);
    camera.position.set(2.5, 1.2, 7);
    spinSpeed = 0.2;
  } else if (isP && n === 3) {
    /* TRANSPARENCIA — nested shells */
    makeParticles(160, 6, 0.03);
    for (var i = 0; i < 4; i++) {
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.7 + i * 0.45, segs, segs),
        new THREE.MeshPhysicalMaterial({
          color: color, metalness: 0.05, roughness: 0.2,
          transparent: true, opacity: 0.22 - i * 0.03,
          transmission: 0.4, side: THREE.DoubleSide
        })
      ));
    }
    camera.position.set(0, 0, 7);
    spinSpeed = 0.28;
  } else if (isP && n === 4) {
    /* LABERINTO — rotating square frames */
    makeParticles(100, 6, 0.025);
    for (var i = 0; i < 6; i++) {
      var sq = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.0 + i * 0.55, 1.0 + i * 0.55)),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.75 - i * 0.08 })
      );
      sq.position.z = -i * 0.35;
      group.add(sq);
    }
    camera.position.set(0, 0, 8);
    spinSpeed = 0.35;
  } else if (isP && n === 5) {
    /* CAÍDA — tunnel of rings stacked on Y */
    makeParticles(150, 5, 0.03);
    for (var i = 0; i < 10; i++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.35 + i * 0.28, 0.03, 8, 40),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.65 - i * 0.05 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 2.4 - i * 0.5;
      group.add(ring);
    }
    camera.position.set(0, 0, 7);
    spinSpeed = 0.22;
  } else if (isP && n === 6) {
    /* LÍMITES — two walls + center form */
    makeParticles(90, 5, 0.025);
    var wallMat = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.35, metalness: 0.3, roughness: 0.5 });
    var wL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.5, 4), wallMat);
    wL.position.x = -2.4;
    var wR = wL.clone(); wR.position.x = 2.4;
    group.add(wL); group.add(wR);
    group.add(new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 0),
      matStd({ metalness: 0.4, roughness: 0.3 })
    ));
    camera.position.set(0, 0.5, 8);
    spinSpeed = 0.2;
  } else if (isP && n === 7) {
    /* OBSTÁCULO — heart-like dual spheres + cone */
    makeParticles(120, 6, 0.03);
    var s1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, segs, segs),
      new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.85, transmission: 0.4 })
    );
    s1.position.set(-0.55, 0.45, 0);
    var s2 = s1.clone(); s2.position.set(0.55, 0.45, 0);
    group.add(s1); group.add(s2);
    var tip = new THREE.Mesh(
      new THREE.ConeGeometry(1.1, 1.6, 24),
      new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.1, roughness: 0.25, transparent: true, opacity: 0.8, transmission: 0.35 })
    );
    tip.position.y = -0.85;
    tip.rotation.z = Math.PI;
    group.add(tip);
    camera.position.set(0, 0.3, 7);
    spinSpeed = 0.25;
  } else {
    /* COLAPSO PSICO / fallback — ray return */
    makeParticles(200, 8, 0.035);
    group.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.4, 12, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
    ));
    for (var k = 1; k <= 4; k++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(k * 0.55, 0.03, 8, 48),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 - k * 0.08 })
      );
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
    camera.position.set(2, 1, 8);
    spinSpeed = 0.28;
  }

  function onPtr(e) {
    var r = el.getBoundingClientRect();
    var cx = (e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX)) - r.left;
    var cy = (e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY)) - r.top;
    ptr.tx = (cx / r.width) * 2 - 1;
    ptr.ty = -((cy / r.height) * 2 - 1);
  }
  el.addEventListener('pointermove', onPtr, { passive: true });
  el.addEventListener('touchmove', onPtr, { passive: true });

  function resize() {
    var r = el.getBoundingClientRect();
    var w = Math.max(280, Math.floor(r.width));
    var h = Math.max(160, Math.floor(r.height));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function tickParticles() {
    if (!particles || !pVel) return;
    var pos = particles.geometry.attributes.position.array;
    for (var i = 0; i < pos.length; i += 3) {
      pos[i] += pVel[i]; pos[i+1] += pVel[i+1]; pos[i+2] += pVel[i+2];
      if (Math.abs(pos[i]) > 7) pVel[i] *= -1;
      if (Math.abs(pos[i+1]) > 7) pVel[i+1] *= -1;
      if (Math.abs(pos[i+2]) > 7) pVel[i+2] *= -1;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  function frame() {
    if (!running) return;
    var t = clock.getElapsedTime();
    if (!reduced) {
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      group.rotation.y = t * spinSpeed + ptr.x * 0.5;
      group.rotation.x = Math.sin(t * 0.3) * 0.12 + ptr.y * 0.25;
      camera.position.x = (camera.position.x * 0.9) + (ptr.x * 0.4) * 0.1 + camera.position.x * 0;
      /* gentle camera parallax without killing per-scene framing */
      camera.position.x = ptr.x * 0.45;
      camera.position.y = (n === 8 && !isP ? 4 : 0.3) + ptr.y * 0.2;
      camera.lookAt(0, 0, 0);
      key.intensity = (isLightTheme() ? 2.0 : 1.6) + Math.sin(t * 2) * 0.25;
      tickParticles();
      if (particles) particles.rotation.y = t * 0.04;
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  applyThemeColors();
  try {
    document.addEventListener('promii:theme', function () { applyThemeColors(); if (!running) renderer.render(scene, camera); });
    new MutationObserver(function () { applyThemeColors(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        if (!running) { running = true; resize(); clock.start(); raf = requestAnimationFrame(frame); }
      } else {
        running = false; cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0.1 });
  io.observe(el);
  resize();
  renderer.render(scene, camera);
  addEventListener('resize', function () { resize(); if (!running) renderer.render(scene, camera); });
}
