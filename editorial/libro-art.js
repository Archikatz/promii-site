/* ArchiKatz Editorial — WebGL chapter scenes (Three.js) */
window.AK_BOOK_ART = function (book, n, accent) {
  var a = accent || (book === 'psicodelia' ? '#c9a0ff' : '#d4af37');
  return '<div class="art-live" data-book="' + book + '" data-n="' + n + '" data-accent="' + a + '"></div>';
};

window.AK_MOUNT_ART = function (root) {
  if (!root) root = document;
  if (typeof THREE === 'undefined') {
    console.warn('[AK] THREE.js missing — no WebGL scenes');
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

function mountGL(el) {
  var book = el.getAttribute('data-book');
  var n = +el.getAttribute('data-n');
  var accent = el.getAttribute('data-accent') || '#d4af37';
  var color = hexInt(accent);
  var isP = book === 'psicodelia';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.045);

  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 6.5);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x050508, 1);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.domElement.className = 'art-canvas';
  el.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x404050, 0.55));
  var key = new THREE.PointLight(color, 1.4, 20);
  key.position.set(2, 3, 4);
  scene.add(key);
  var rim = new THREE.PointLight(0xffffff, 0.35, 16);
  rim.position.set(-3, -1, 2);
  scene.add(rim);

  var group = new THREE.Group();
  scene.add(group);
  var particles, pGeo, pVel;
  var clock = new THREE.Clock();
  var running = false, raf = 0;

  function makeParticles(count, spread, size) {
    pGeo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    pVel = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i*3] = (Math.random()-0.5) * spread;
      pos[i*3+1] = (Math.random()-0.5) * spread;
      pos[i*3+2] = (Math.random()-0.5) * spread;
      pVel[i*3] = (Math.random()-0.5) * 0.01;
      pVel[i*3+1] = (Math.random()-0.5) * 0.01;
      pVel[i*3+2] = (Math.random()-0.5) * 0.01;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      color: color, size: size, transparent: true, opacity: 0.75,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    particles = new THREE.Points(pGeo, mat);
    scene.add(particles);
  }

  function glassSphere(r, y) {
    var geo = new THREE.SphereGeometry(r, 48, 48);
    var mat = new THREE.MeshPhysicalMaterial({
      color: color, metalness: 0.1, roughness: 0.12,
      transmission: 0.72, thickness: 1.2, transparent: true,
      opacity: 0.9, clearcoat: 1, clearcoatRoughness: 0.1
    });
    var m = new THREE.Mesh(geo, mat);
    m.position.y = y || 0;
    group.add(m);
    var shell = new THREE.Mesh(
      new THREE.SphereGeometry(r * 1.08, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 })
    );
    shell.position.copy(m.position);
    group.add(shell);
    return m;
  }

  if (!isP && n === 1) {
    makeParticles(400, 10, 0.04);
    var beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.45, 12, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    group.add(beam);
    var core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })
    );
    group.add(core);
    glassSphere(0.35, 3.2);
    camera.position.set(0, 0, 8);
  } else if (!isP && n === 2) {
    makeParticles(250, 8, 0.03);
    glassSphere(1.1, 0);
    var grid = new THREE.GridHelper(10, 20, color, 0x222233);
    grid.position.y = -1.4;
    scene.add(grid);
  } else if (!isP && n === 3) {
    makeParticles(180, 7, 0.03);
    var box = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 2.2, 2.2)),
      new THREE.LineBasicMaterial({ color: color })
    );
    group.add(box);
    var box2 = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.2, 2.2),
      new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.12, metalness: 0.4, roughness: 0.3 })
    );
    group.add(box2);
  } else if (!isP && n === 4) {
    makeParticles(200, 8, 0.03);
    var torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.28, 16, 48),
      new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.25 })
    );
    group.add(torus);
    for (var i = 0; i < 12; i++) {
      var ang = (i / 12) * Math.PI * 2;
      var tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.5, 0.35),
        new THREE.MeshStandardMaterial({ color: color, metalness: 0.6, roughness: 0.3 })
      );
      tooth.position.set(Math.cos(ang) * 1.45, Math.sin(ang) * 1.45, 0);
      tooth.rotation.z = ang;
      group.add(tooth);
    }
    glassSphere(0.35, 0);
  } else if (!isP && n === 5) {
    makeParticles(120, 6, 0.025);
    for (var i = 0; i < 6; i++) for (var j = 0; j < 4; j++) {
      var cell = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.55, 0.08),
        new THREE.MeshStandardMaterial({
          color: (i === 3 && j === 2) ? 0xff3b30 : color,
          metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.55
        })
      );
      cell.position.set((i - 2.5) * 0.7, (j - 1.5) * 0.7, 0);
      group.add(cell);
    }
  } else if (!isP && n === 6) {
    makeParticles(220, 8, 0.03);
    var frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(6, 4)),
      new THREE.LineBasicMaterial({ color: color })
    );
    group.add(frame);
    glassSphere(0.7, 0);
  } else if (!isP && n === 7) {
    makeParticles(160, 7, 0.03);
    var shell = new THREE.Mesh(
      new THREE.BoxGeometry(3, 2.2, 1.5),
      new THREE.MeshStandardMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.5 })
    );
    group.add(shell);
    var crack = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.5 })
    );
    group.add(crack);
  } else if (!isP && n === 8) {
    makeParticles(500, 12, 0.035);
    glassSphere(0.5, 0);
    for (var k = 1; k <= 4; k++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(k * 0.7, 0.02, 8, 64),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.45 - k * 0.07 })
      );
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
  } else if (isP && n === 1) {
    makeParticles(600, 14, 0.045);
    glassSphere(1.0, 0);
    scene.fog.density = 0.03;
  } else if (isP && n === 2) {
    makeParticles(300, 9, 0.03);
    glassSphere(0.9, 1.2);
    var ground = new THREE.Mesh(
      new THREE.CircleGeometry(3, 48),
      new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.2, metalness: 0.2, roughness: 0.8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    scene.add(ground);
  } else if (isP && n === 3) {
    makeParticles(350, 8, 0.03);
    glassSphere(1.0, 0);
    var fogBall = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x1a1020, transparent: true, opacity: 0.35 })
    );
    group.add(fogBall);
  } else if (isP && n === 4) {
    makeParticles(200, 8, 0.03);
    for (var i = 0; i < 5; i++) {
      var sq = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.2 + i * 0.55, 1.2 + i * 0.55)),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.55 - i * 0.08 })
      );
      sq.position.z = -i * 0.3;
      group.add(sq);
    }
  } else if (isP && n === 5) {
    makeParticles(280, 10, 0.03);
    for (var i = 0; i < 8; i++) {
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.3 + i * 0.35, 0.015, 8, 48),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 - i * 0.04 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 2 - i * 0.55;
      group.add(ring);
    }
    camera.position.set(0, 0.5, 7);
  } else if (isP && n === 6) {
    makeParticles(180, 6, 0.03);
    glassSphere(0.8, 0);
    var wallL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 4), new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.25 }));
    wallL.position.x = -2.2;
    var wallR = wallL.clone(); wallR.position.x = 2.2;
    group.add(wallL); group.add(wallR);
  } else if (isP && n === 7) {
    makeParticles(240, 7, 0.03);
    var h1 = glassSphere(0.7, 0.3); h1.position.x = -0.4;
    var h2 = glassSphere(0.7, 0.3); h2.position.x = 0.4;
    var tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.4, 24),
      new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.7, transmission: 0.5 })
    );
    tip.position.y = -0.7; tip.rotation.z = Math.PI;
    group.add(tip);
  } else {
    makeParticles(450, 11, 0.04);
    glassSphere(0.45, 1.5);
    var beam2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.3, 10, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    group.add(beam2);
  }

  function resize() {
    var r = el.getBoundingClientRect();
    var w = Math.max(320, Math.floor(r.width));
    var h = Math.max(180, Math.floor(r.height));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function tickParticles() {
    if (!particles) return;
    var pos = particles.geometry.attributes.position.array;
    for (var i = 0; i < pos.length; i += 3) {
      pos[i] += pVel[i]; pos[i+1] += pVel[i+1]; pos[i+2] += pVel[i+2];
      if (Math.abs(pos[i]) > 6) pVel[i] *= -1;
      if (Math.abs(pos[i+1]) > 6) pVel[i+1] *= -1;
      if (Math.abs(pos[i+2]) > 6) pVel[i+2] *= -1;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  function frame() {
    if (!running) return;
    var t = clock.getElapsedTime();
    if (!reduced) {
      group.rotation.y = t * 0.25;
      group.rotation.x = Math.sin(t * 0.35) * 0.15;
      key.intensity = 1.2 + Math.sin(t * 2) * 0.25;
      tickParticles();
      if (particles) particles.rotation.y = t * 0.05;
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        if (!running) {
          running = true;
          resize();
          clock.start();
          raf = requestAnimationFrame(frame);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0.12 });
  io.observe(el);
  resize();
  renderer.render(scene, camera);
  addEventListener('resize', function () {
    resize();
    if (!running) renderer.render(scene, camera);
  });
}
