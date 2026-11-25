// 3D drone-shot of a giant surge destroying a city (Three.js / WebGL), composited into the 2D frame.
// Deterministic: drone3d(ctx, t, o) renders the scene for local time t (seconds since the shot began).
// Units are metres. Style: cel-shaded (MeshToonMaterial) to match the illustrated 2D look.
const City3D = (() => {
  let S = null;
  const rand = seed => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

  function toonRamp() {
    const d = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
    const tx = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); tx.minFilter = tx.magFilter = THREE.NearestFilter; tx.needsUpdate = true; return tx;
  }

  // Building material: toon shading + procedural lit windows in world space (no per-building UVs needed).
  function buildingMaterial(ramp) {
    const m = new THREE.MeshToonMaterial({ gradientMap: ramp });
    m.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvec4 wp4 = vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwp4 = instanceMatrix * wp4;\n#endif\nwp4 = modelMatrix * wp4; vWP = wp4.xyz;\nvWN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * objectNormal);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          if (abs(vWN.y) < 0.5) {
            float along = abs(vWN.x) > 0.5 ? vWP.z : vWP.x;
            vec2 cell = vec2(fract(along / 7.0), fract(vWP.y / 6.0));
            float win = step(0.22, cell.x) * step(cell.x, 0.78) * step(0.25, cell.y) * step(cell.y, 0.75);
            win *= smoothstep(1900.0, 750.0, length(vWP - cameraPosition));   // fade fine detail with distance (no shimmer)
            float on = step(0.45, fract(sin(dot(floor(vec2(along / 7.0, vWP.y / 6.0)), vec2(12.9898, 78.233))) * 43758.5453));
            diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.16,0.18,0.30), vec3(1.0,0.86,0.58), on), win * 0.85);
            totalEmissiveRadiance += vec3(1.0, 0.8, 0.5) * win * on * 0.35;
          }`);
    };
    return m;
  }

  function init() {
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const ren = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    ren.setPixelRatio(1); ren.setSize(W, H, false); ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap;
    ren.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb9cdee, 1400, 6500);
    const cam = new THREE.PerspectiveCamera(48, W / H, 5, 12000);
    const ramp = toonRamp();

    const sun = new THREE.DirectionalLight(0xfff0d6, 2.6); sun.position.set(-1500, 1400, 1200);
    sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
    Object.assign(sun.shadow.camera, { left: -2600, right: 2600, top: 2600, bottom: -2600, near: 100, far: 6000 }); sun.shadow.bias = -0.0004;
    scene.add(sun, new THREE.HemisphereLight(0xcfe0ff, 0x6a7a5a, 1.1));

    // ground with a street grid
    const gtex = (() => { const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
      g.fillStyle = '#7d8a6a'; g.fillRect(0, 0, 1024, 1024); g.fillStyle = '#4c5260';
      for (let i = 0; i <= 32; i++) { g.fillRect(i * 32 - 4, 0, 8, 1024); g.fillRect(0, i * 32 - 4, 1024, 8); }
      const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(2560, 2560), new THREE.MeshToonMaterial({ map: gtex, gradientMap: ramp }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, -1080); ground.receiveShadow = true; scene.add(ground);
    const far = new THREE.Mesh(new THREE.PlaneGeometry(20000, 12000), new THREE.MeshToonMaterial({ color: 0x8a9670, gradientMap: ramp }));
    far.rotation.x = -Math.PI / 2; far.position.set(0, -1, -7000); scene.add(far);

    // calm ocean in front of the city
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(20000, 8000, 1, 1), new THREE.MeshToonMaterial({ color: 0x2f86d9, gradientMap: ramp }));
    ocean.rotation.x = -Math.PI / 2; ocean.position.set(0, -2, 4200); scene.add(ocean);

    // buildings
    const r = rand(7), list = [];
    for (let gx = -15; gx <= 15; gx++) for (let gz = 0; gz < 30; gz++) {
      const x = gx * 80 + 40, z = 160 - gz * 80 - 40;
      if (r() < 0.12) continue;
      const centre = Math.exp(-((x / 700) ** 2 + ((z + 900) / 800) ** 2));
      const h = 20 + r() * 70 + centre * (160 + r() * 260), w = 34 + r() * 28, d = 34 + r() * 28;
      list.push({ x, z, w, d, h, col: new THREE.Color(['#5d6fb0', '#7466ad', '#4f80b0', '#8a78a8', '#6b88c4', '#9aa6cf', '#c28f86'][Math.floor(r() * 7)]), lean: (r() - 0.5) * 0.6, delay: r() * 0.5 });
    }
    const bmat = buildingMaterial(ramp);
    const bgeo = new THREE.BoxGeometry(1, 1, 1); bgeo.translate(0, 0.5, 0);
    const bmesh = new THREE.InstancedMesh(bgeo, bmat, list.length);
    bmesh.castShadow = bmesh.receiveShadow = true;
    list.forEach((b, i) => bmesh.setColorAt(i, b.col));
    scene.add(bmesh);

    // the surge: a curling wall (extruded profile in the y-z plane), its foam lip, and the flood behind it
    const prof = new THREE.Shape();
    prof.moveTo(0, -60); prof.lineTo(0, 300); prof.bezierCurveTo(-30, 380, -170, 400, -230, 330);
    prof.bezierCurveTo(-260, 290, -200, 250, -150, 280); prof.bezierCurveTo(-120, 200, -60, 60, -40, -60); prof.lineTo(0, -60);
    const wgeo = new THREE.ExtrudeGeometry(prof, { depth: 5200, bevelEnabled: false, curveSegments: 24 });
    wgeo.rotateY(Math.PI / 2); wgeo.translate(-2600, 0, 0);          // profile now faces -z (inland), spans x
    { const pa = wgeo.attributes.position, cols = new Float32Array(pa.count * 3), top = new THREE.Color(0x7fe0ff), bot = new THREE.Color(0x1556a8), c = new THREE.Color();
      for (let i = 0; i < pa.count; i++) { const k = Math.max(0, Math.min(1, (pa.getY(i) + 60) / 460)); c.copy(bot).lerp(top, k * k); cols.set([c.r, c.g, c.b], i * 3); }
      wgeo.setAttribute('color', new THREE.BufferAttribute(cols, 3)); }
    const wave = new THREE.Mesh(wgeo, new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp, emissive: 0x0a2a55, emissiveIntensity: 0.2 }));
    wave.castShadow = true; scene.add(wave);
    const NF = 900, lip = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: ramp }), NF);
    lip.castShadow = true; scene.add(lip);
    const foamSeed = [...Array(NF)].map(() => [r(), r(), r(), r()]);
    const floodGeo = new THREE.PlaneGeometry(9000, 9000, 140, 140);
    const flood = new THREE.Mesh(floodGeo, new THREE.MeshToonMaterial({ color: 0x3a96e8, gradientMap: ramp, flatShading: true }));
    flood.rotation.x = -Math.PI / 2; scene.add(flood);
    const floodBase = floodGeo.attributes.position.array.slice();

    // spray particles and debris
    const NSP = 2200, spGeo = new THREE.BufferGeometry(), spPos = new Float32Array(NSP * 3);
    spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
    const sprite = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const spray = new THREE.Points(spGeo, new THREE.PointsMaterial({ size: 11, map: sprite, transparent: true, depthWrite: false, color: 0xffffff, fog: true }));
    scene.add(spray);
    const spSeed = [...Array(NSP)].map(() => [r(), r(), r(), r()]);
    const NDB = 700, dbMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshToonMaterial({ gradientMap: ramp }), NDB);
    dbMesh.castShadow = true; scene.add(dbMesh);
    const dbSeed = [...Array(NDB)].map(() => [Math.floor(r() * list.length), r(), r(), r(), r()]);
    for (let i = 0; i < NDB; i++) dbMesh.setColorAt(i, list[dbSeed[i][0]].col);

    S = { canvas, ren, scene, cam, list, bmesh, wave, lip, foamSeed, NF, flood, floodGeo, floodBase, spray, spPos, spSeed, dbMesh, dbSeed, NSP, NDB };
  }

  // wave front position (z, metres) over local time
  const frontAt = (lt, o) => o.z0 + (o.z1 - o.z0) * Math.min(1, Math.max(0, lt / o.dur));
  const easeIO = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

  function update(lt, o) {
    const { list, bmesh, wave, lip, flood, floodGeo, floodBase } = S;
    const H0 = o.height;
    const front = frontAt(lt, o);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
    // buildings: struck when the front passes; topple inland (towards -z) about their base and sink
    list.forEach((b, i) => {
      const hitT = (b.z + 20 - o.z0) / (o.z1 - o.z0) * o.dur + b.delay * 0.4;
      const k = Math.max(0, Math.min(1, (lt - hitT) / 2.4));
      const fall = easeIO(k) * (1.25 + b.lean * 0.3);
      const sink = k * k * b.h * 0.35;
      e.set(-fall, 0, b.lean * k * 0.5); q.setFromEuler(e);
      p.set(b.x, -sink, b.z - b.d / 2 * Math.sin(fall)); sc.set(b.w, b.h, b.d);
      m.compose(p, q, sc); bmesh.setMatrixAt(i, m);
    });
    bmesh.instanceMatrix.needsUpdate = true;
    // the wall
    wave.position.set(0, 0, front); wave.scale.set(1, H0 / 300, H0 / 300);
    { const fm = new THREE.Matrix4(), fq = new THREE.Quaternion(), fp = new THREE.Vector3(), fs = new THREE.Vector3(), k3 = H0 / 300;
      for (let i = 0; i < S.NF; i++) { const [a, b2, c, d] = S.foamSeed[i];
        const x = (a - 0.5) * 5200, roll = (lt * (0.8 + c) + d) % 1;
        fp.set(x, (330 + Math.sin(roll * Math.PI * 2) * 40 + b2 * 50) * k3, front + (-170 - Math.cos(roll * Math.PI * 2) * 60 - c * 40) * k3);
        const sz = (14 + b2 * 26) * k3 * (0.8 + 0.4 * Math.sin(lt * 3 + i)); fs.set(sz, sz * 0.8, sz);
        fm.compose(fp, fq, fs); lip.setMatrixAt(i, fm); }
      lip.instanceMatrix.needsUpdate = true; }
    // flood surface behind the front: high near the wall, churning
    const pos = floodGeo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      const lx = floodBase[i], ly = floodBase[i + 1];            // plane local: y maps to -z after rotation
      // plane rotated -90° about x: world z = position.z - local y, so the ocean side (z > front) is ly < 0
      const behind = -ly;                                         // metres behind the front, on the ocean side
      const hgt = behind > 0 ? H0 * (0.3 + 0.55 * Math.exp(-behind / 350)) : -400;
      pos[i + 2] = hgt + Math.sin(lx * 0.01 + lt * 2.1) * 14 + Math.sin(ly * 0.013 - lt * 1.7) * 18 + Math.sin((lx + ly) * 0.004 + lt) * 26;
    }
    floodGeo.attributes.position.needsUpdate = true; floodGeo.computeVertexNormals();
    flood.position.set(0, 0, front);
    // spray: thrown up and inland off the lip, recycled
    for (let i = 0; i < S.NSP; i++) {
      const [a, b2, c, d] = S.spSeed[i], life = (lt * (0.6 + c * 0.6) + a) % 1, T = life * 1.5;
      S.spPos[i * 3] = (b2 - 0.5) * 4200;
      S.spPos[i * 3 + 1] = H0 * 1.08 + (90 + d * 200) * T - 0.5 * 260 * T * T;
      S.spPos[i * 3 + 2] = front - 0.62 * H0 - (20 + c * 110) * T;
    }
    S.spray.geometry.attributes.position.needsUpdate = true;
    // debris: launched from struck buildings, ballistic, tumbling
    for (let i = 0; i < S.NDB; i++) {
      const [bi, a, b2, c, d] = S.dbSeed[i], b = list[bi];
      const hitT = (b.z + 20 - o.z0) / (o.z1 - o.z0) * o.dur + b.delay * 0.4, T = lt - hitT;
      if (T < 0 || T > 6) { m.makeScale(0, 0, 0); S.dbMesh.setMatrixAt(i, m); continue; }
      const vx = (a - 0.5) * 160, vy = 60 + b2 * 140, vz = -(80 + c * 220);
      p.set(b.x + vx * T, Math.max(H0 * 0.6, b.h * d + vy * T - 0.5 * 98 * T * T), b.z + vz * T);
      e.set(T * (a * 6), T * (b2 * 5), T * (c * 4)); q.setFromEuler(e); const s2 = 4 + d * 12; sc.set(s2, s2 * 0.6, s2 * 0.8);
      m.compose(p, q, sc); S.dbMesh.setMatrixAt(i, m);
    }
    S.dbMesh.instanceMatrix.needsUpdate = true;
  }

  // Draw the 3D shot into the 2D context. o: { height, z0, z1, dur, path: [[t, [x,y,z], [lx,ly,lz]], ...] }
  function draw(ctx, lt, o) {
    if (!S) init();
    update(lt, o);
    // camera along keyframes (Catmull-Rom on position and look target)
    const P = o.path; let i = 0; while (i < P.length - 2 && lt > P[i + 1][0]) i++;
    const a = P[i], b = P[i + 1], k = easeIO(Math.max(0, Math.min(1, (lt - a[0]) / (b[0] - a[0]))));
    const lerp3 = (u, v) => u.map((x, j) => x + (v[j] - x) * k);
    const cp = lerp3(a[1], b[1]), lk = lerp3(a[2], b[2]);
    const shake = o.shake ? o.shake(lt) : 0;
    S.cam.position.set(cp[0] + Math.sin(lt * 23) * shake, cp[1] + Math.cos(lt * 19) * shake, cp[2]);
    S.cam.lookAt(lk[0], lk[1], lk[2]);
    S.ren.render(S.scene, S.cam);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(S.canvas, 0, 0); ctx.restore();
  }
  return { draw };
})();

// ================================================================ 3D quake: a city torn open, falling into the earth
const Quake3D = (() => {
  let S = null;
  const rand = seed => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const easeIO = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

  function ramp() { const d = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
    const tx = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); tx.minFilter = tx.magFilter = THREE.NearestFilter; tx.needsUpdate = true; return tx; }
  function bMat(rp) {   // same procedural-window toon material as the surge shot
    const m = new THREE.MeshToonMaterial({ gradientMap: rp });
    m.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvec4 wp4 = vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwp4 = instanceMatrix * wp4;\n#endif\nwp4 = modelMatrix * wp4; vWP = wp4.xyz;\nvWN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * objectNormal);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          if (abs(vWN.y) < 0.5) {
            float along = abs(vWN.x) > 0.5 ? vWP.z : vWP.x;
            vec2 cell = vec2(fract(along / 7.0), fract(vWP.y / 6.0));
            float win = step(0.22, cell.x) * step(cell.x, 0.78) * step(0.25, cell.y) * step(cell.y, 0.75);
            win *= smoothstep(1900.0, 750.0, length(vWP - cameraPosition));
            float on = step(0.45, fract(sin(dot(floor(vec2(along / 7.0, vWP.y / 6.0)), vec2(12.9898, 78.233))) * 43758.5453));
            diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.16,0.18,0.30), vec3(1.0,0.86,0.58), on), win * 0.85);
            totalEmissiveRadiance += vec3(1.0, 0.8, 0.5) * win * on * 0.35;
          }`);
    };
    return m;
  }

  function init() {
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const ren = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    ren.setPixelRatio(1); ren.setSize(W, H, false); ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap; ren.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xc98a6a, 2800, 13000);
    const cam = new THREE.PerspectiveCamera(50, W / H, 5, 15000);
    const rp = ramp();
    const sun = new THREE.DirectionalLight(0xffd2a8, 2.3); sun.position.set(1200, 1300, 900); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
    Object.assign(sun.shadow.camera, { left: -2400, right: 2400, top: 2400, bottom: -2400, near: 100, far: 6000 }); sun.shadow.bias = -0.0004;
    const magma = new THREE.PointLight(0xff6a20, 4, 2600, 1.4); magma.position.set(0, -150, 0);
    scene.add(sun, magma, new THREE.HemisphereLight(0xffd0b0, 0x5a4030, 1.0));

    // two ground slabs either side of the fault line (z = 0), each a thick box with a dirt-coloured side
    const slabMat = [new THREE.MeshToonMaterial({ color: 0x6b4a34, gradientMap: rp }), new THREE.MeshToonMaterial({ color: 0x6b4a34, gradientMap: rp }),
      new THREE.MeshToonMaterial({ color: 0x7a8a62, gradientMap: rp }), new THREE.MeshToonMaterial({ color: 0x4a3324, gradientMap: rp }),
      new THREE.MeshToonMaterial({ color: 0x5a3c28, gradientMap: rp }), new THREE.MeshToonMaterial({ color: 0x5a3c28, gradientMap: rp })];
    const mkSlab = () => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(5000, 600, 2600), slabMat);
      m.position.y = -300; m.receiveShadow = true; m.castShadow = true; g.add(m); scene.add(g); return g; };
    const north = mkSlab(), south = mkSlab();
    // the glowing rift floor
    const lava = new THREE.Mesh(new THREE.PlaneGeometry(5000, 900), new THREE.MeshBasicMaterial({ color: 0xff5a14 }));
    lava.rotation.x = -Math.PI / 2; lava.position.y = -520; scene.add(lava);

    // buildings: each belongs to a slab; those near the fault fall in
    const r = rand(11), list = [];
    for (let gx = -14; gx <= 14; gx++) for (let gz = -14; gz <= 14; gz++) {
      if (r() < 0.15 || Math.abs(gz) < 1) continue;
      const x = gx * 80 + 40 * (r() - 0.5), z = gz * 80 + 20 * (r() - 0.5);
      const centre = Math.exp(-((x / 800) ** 2 + (z / 800) ** 2));
      const h = 20 + r() * 60 + centre * (120 + r() * 220), w = 32 + r() * 26, d = 32 + r() * 26;
      list.push({ x, z, w, d, h, side: z > 0 ? 1 : -1, near: Math.abs(z) < 320, col: new THREE.Color(['#5d6fb0', '#7466ad', '#4f80b0', '#8a78a8', '#6b88c4', '#9aa6cf', '#c28f86'][Math.floor(r() * 7)]),
        delay: r(), wob: r() * 6.28, crumbleAt: r() < 0.35 ? 1.5 + r() * 3 : 99 });
    }
    const bgeo = new THREE.BoxGeometry(1, 1, 1); bgeo.translate(0, 0.5, 0);
    const bmesh = new THREE.InstancedMesh(bgeo, bMat(rp), list.length); bmesh.castShadow = bmesh.receiveShadow = true;
    list.forEach((b, i) => bmesh.setColorAt(i, b.col)); scene.add(bmesh);

    // volcano on the horizon, with an ash column of instanced puffs and lava bombs
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1100, 900, 48, 1, true), new THREE.MeshToonMaterial({ color: 0x3e2620, gradientMap: rp }));
    cone.position.set(-600, 450, -4200); scene.add(cone);
    const crater = new THREE.Mesh(new THREE.SphereGeometry(160, 24, 12), new THREE.MeshBasicMaterial({ color: 0xff7a24 })); crater.position.set(-600, 880, -4200); scene.add(crater);
    const NP = 260, puffs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshToonMaterial({ color: 0x6d6268, gradientMap: rp }), NP); scene.add(puffs);
    const puffSeed = [...Array(NP)].map(() => [r(), r(), r(), r()]);
    const NB = 200, bombs = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffa040 }), NB); scene.add(bombs);
    const bombSeed = [...Array(NB)].map(() => [r(), r(), r(), r()]);
    // dust from collapsing buildings
    const ND = 260, dust = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshToonMaterial({ color: 0xb59c86, gradientMap: rp, transparent: true, opacity: 0.7 }), ND); scene.add(dust);
    const dustSeed = [...Array(ND)].map(() => [Math.floor(r() * list.length), r(), r(), r()]);
    S = { canvas, ren, scene, cam, north, south, lava, magma, list, bmesh, puffs, puffSeed, NP, bombs, bombSeed, NB, dust, dustSeed, ND };
  }

  function update(lt, o) {
    const { north, south, list, bmesh } = S;
    const open = easeIO(cl((lt - o.splitAt) / o.splitDur));          // 0..1 rift opening
    const gap = open * o.gap, tilt = open * 0.12, sink = open * 90;
    north.position.set(0, -sink, gap / 2 + 1300); north.rotation.x = tilt;
    south.position.set(0, -sink, -gap / 2 - 1300); south.rotation.x = -tilt;
    S.lava.scale.set(1, Math.max(0.01, gap / 900), 1); S.magma.intensity = 1 + open * 7;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3(), slab = new THREE.Matrix4();
    list.forEach((b, i) => {
      const g = b.side > 0 ? north : south;
      g.updateMatrix(); slab.copy(g.matrix);
      // local placement on the slab (slab origin is at z = ±1300)
      const lz = b.z - b.side * 1300;
      const shake = cl((lt - o.splitAt + 0.6) / 0.5) * (1 - cl((lt - o.splitAt - o.splitDur - 1.5) / 2)) * 0.05;
      let fall = 0, drop = 0, crumble = 0;
      if (b.near) { const k = cl((open - 0.15 - (Math.abs(b.z) / 320) * 0.5 - b.delay * 0.15) / 0.5); fall = easeIO(k) * 1.4; drop = k * k * 700; }
      else crumble = cl((lt - o.splitAt - b.crumbleAt) / 1.4);
      e.set(-b.side * fall + Math.sin(lt * 17 + b.wob) * shake, 0, Math.cos(lt * 13 + b.wob) * shake + crumble * 0.25 * Math.sin(b.wob));
      q.setFromEuler(e);
      p.set(b.x, -drop - crumble * crumble * b.h * 0.55, lz - b.side * Math.sin(fall) * b.d * 0.5); sc.set(b.w, b.h * (1 - crumble * 0.45), b.d);
      m.compose(p, q, sc).premultiply(slab); bmesh.setMatrixAt(i, m);
    });
    bmesh.instanceMatrix.needsUpdate = true;
    // eruption
    const er = cl((lt - o.eruptAt) / 1.2);
    for (let i = 0; i < S.NP; i++) { const [a, b2, c, d] = S.puffSeed[i]; const life = (lt * 0.12 + a) % 1;
      const hgt = 900 + life * 2600 * er, sz = er > 0 ? (120 + b2 * 160) * (0.5 + life * 1.6) : 0;
      p.set(-600 + (b2 - 0.5) * 500 * (0.4 + life) + Math.sin(lt * 0.5 + i) * 60, hgt, -4200 + (c - 0.5) * 400 + life * 600); sc.set(sz, sz * 0.9, sz);
      m.compose(p, q.identity(), sc); S.puffs.setMatrixAt(i, m); }
    S.puffs.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < S.NB; i++) { const [a, b2, c, d] = S.bombSeed[i]; const T = ((lt - o.eruptAt) * (0.5 + d * 0.5) + a * 3) % 3;
      const ok = lt > o.eruptAt; const vx = (b2 - 0.5) * 700, vy = 500 + c * 600, vz = (d - 0.5) * 700;
      p.set(-600 + vx * T, 900 + vy * T - 0.5 * 300 * T * T, -4200 + vz * T); const sz = ok ? 18 + c * 22 : 0; sc.set(sz, sz, sz);
      m.compose(p, q.identity(), sc); S.bombs.setMatrixAt(i, m); }
    S.bombs.instanceMatrix.needsUpdate = true;
    // dust boiling up where buildings fall or crumble
    for (let i = 0; i < S.ND; i++) { const [bi, a, b2, c] = S.dustSeed[i], b = list[bi];
      const start = b.near ? o.splitAt + 0.4 + b.delay * 0.6 : o.splitAt + b.crumbleAt; const T = lt - start;
      if (T < 0 || T > 3.5) { m.makeScale(0, 0, 0); S.dust.setMatrixAt(i, m); continue; }
      const sz = (18 + a * 30) * (0.5 + T * 0.4) * (1 - T / 3.5);
      p.set(b.x + (b2 - 0.5) * 160 * (1 + T), 20 + T * (40 + c * 60), b.z + (a - 0.5) * 160 * (1 + T) - (b.near ? b.side * 80 : 0));
      sc.set(sz, sz * 0.8, sz); m.compose(p, q.identity(), sc); S.dust.setMatrixAt(i, m); }
    S.dust.instanceMatrix.needsUpdate = true;
  }

  // o: { splitAt, splitDur, gap, eruptAt, path: [[t, pos, look], ...], shake(lt) }
  function draw(ctx, lt, o) {
    if (!S) init();
    update(lt, o);
    const P = o.path; let i = 0; while (i < P.length - 2 && lt > P[i + 1][0]) i++;
    const a = P[i], b = P[i + 1], k = easeIO(cl((lt - a[0]) / (b[0] - a[0])));
    const L = (u, v) => u.map((x, j) => x + (v[j] - x) * k), cp = L(a[1], b[1]), lk = L(a[2], b[2]);
    const sh = o.shake ? o.shake(lt) : 0;
    S.cam.position.set(cp[0] + Math.sin(lt * 31) * sh, cp[1] + Math.cos(lt * 27) * sh, cp[2] + Math.sin(lt * 23) * sh * 0.5);
    S.cam.lookAt(lk[0], lk[1], lk[2]);
    S.ren.render(S.scene, S.cam);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(S.canvas, 0, 0); ctx.restore();
  }
  return { draw };
})();
