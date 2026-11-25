// FX engine (v5): realistic globe, procedural noise, physics particles, smoke, fire, water,
// building collapse, and a post pass (bloom + grade). Deterministic: everything is a pure
// function of time t, so any frame can be rendered independently.

// ---------------------------------------------------------------- noise (improved Perlin)
const _perm = (() => { const p = [...Array(256).keys()], r = rng(1337);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  return new Uint8Array([...p, ...p]); })();
function _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function _grad(h, x, y, z) { const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z; return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }
function noise3(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = _fade(x), v = _fade(y), w = _fade(z), P = _perm;
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
  const L = (a, b, t) => a + t * (b - a);
  return L(L(L(_grad(P[AA] & 15, x, y, z), _grad(P[BA] & 15, x - 1, y, z), u), L(_grad(P[AB] & 15, x, y - 1, z), _grad(P[BB] & 15, x - 1, y - 1, z), u), v),
           L(L(_grad(P[AA + 1] & 15, x, y, z - 1), _grad(P[BA + 1] & 15, x - 1, y, z - 1), u), L(_grad(P[AB + 1] & 15, x, y - 1, z - 1), _grad(P[BB + 1] & 15, x - 1, y - 1, z - 1), u), v), w);
}
function fbm(x, y, z, oct = 4) { let a = 0, f = 1, amp = 0.5; for (let i = 0; i < oct; i++) { a += amp * noise3(x * f, y * f, z * f); f *= 2.03; amp *= 0.5; } return a; }

function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const _fxBufs = {};
function fxBuf(name, w = W, h = H) { const k = name + w + 'x' + h; if (!_fxBufs[k]) _fxBufs[k] = makeCanvas(w, h); return _fxBufs[k]; }

// ---------------------------------------------------------------- globe
// opts: lon0/lat0 view centre (degrees), sun (unit vector in view space, z toward viewer),
// clouds (0..1), t (for cloud drift), tint for land, night lights.
const _texCache = {};
function texFor(name, R, cap = 820) { const n = Math.max(64, Math.min(cap, Math.round(2 * R))); const k = name + n;
  if (!_texCache[k]) _texCache[k] = makeCanvas(n, n); return _texCache[k]; }
function globe(ctx, cx, cy, R, o = {}) {
  const { lon0 = 0, lat0 = 15, sun = [-0.55, -0.35, 0.76], clouds = 0.55, t = 0, atmo = '120,180,255', lights = true, ice = true, toon = false, ink = true } = o;
  const l0 = lon0 * Math.PI / 180, p0 = lat0 * Math.PI / 180, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
  // atmosphere halo
  const halo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.22);
  halo.addColorStop(0, `rgba(${atmo},0.55)`); halo.addColorStop(0.35, `rgba(${atmo},0.18)`); halo.addColorStop(1, `rgba(${atmo},0)`);
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  // ocean
  const oc = ctx.createRadialGradient(cx + sun[0] * R * 0.5, cy + sun[1] * R * 0.5, R * 0.1, cx, cy, R);
  if (toon) { oc.addColorStop(0, '#3d9bf0'); oc.addColorStop(1, '#2878cf'); }
  else { oc.addColorStop(0, '#2f7fd8'); oc.addColorStop(0.7, '#14508f'); oc.addColorStop(1, '#0b2f5c'); }
  ctx.fillStyle = oc; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  // land
  const v3 = (lon, lat) => {                       // view-space unit vector
    const l = lon * Math.PI / 180 - l0, p = lat * Math.PI / 180, cp = Math.cos(p);
    return [cp * Math.sin(l), -(cp0 * Math.sin(p) - sp0 * cp * Math.cos(l)), sp0 * Math.sin(p) + cp0 * cp * Math.cos(l)];
  };
  const proj = (lon, lat) => { const [x, y, z] = v3(lon, lat); return [cx + x * R, cy + y * R, z]; };
  // Trace a polygon clipped to the visible hemisphere: edges that cross the horizon are cut at z = 0
  // and joined along the limb, so continents wrapping round the edge never smear across the ocean.
  const trace = (c, poly, X, Y, S) => {
    const pts = poly.map(([lo, la]) => v3(lo, la));
    if (!pts.some(q => q[2] > 0)) return false;
    let start = pts.findIndex(q => q[2] > 0), started = false, exitA = null;
    const n = pts.length, px = q => X + q[0] * S, py = q => Y + q[1] * S;
    for (let k = 0; k <= n; k++) {
      const a = pts[(start + k) % n], b = pts[(start + k + 1) % n];
      if (!started) { c.moveTo(px(a), py(a)); started = true; }
      if (k === n) break;
      if (a[2] > 0 && b[2] > 0) c.lineTo(px(b), py(b));
      else if (a[2] > 0 && b[2] <= 0) { const u = a[2] / (a[2] - b[2]); const h = [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; const m = Math.hypot(h[0], h[1]) || 1;
        c.lineTo(X + h[0] / m * S, Y + h[1] / m * S); exitA = Math.atan2(h[1], h[0]); }
      else if (a[2] <= 0 && b[2] > 0) { const u = a[2] / (a[2] - b[2]); const h = [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
        const enA = Math.atan2(h[1], h[0]);
        if (exitA !== null) { let d = enA - exitA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; c.arc(X, Y, S, exitA, exitA + d, d < 0); }
        c.lineTo(px(b), py(b)); exitA = null; }
    }
    c.closePath(); return true;
  };
  const _globeTex = texFor('g', R), N = _globeTex.width;
  const LM = landMap();
  // texture pass: biomes + clouds + night side + city lights, computed per pixel
  const tc = _globeTex.getContext('2d'), img = tc.createImageData(N, N), d = img.data;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = (i + 0.5) / N * 2 - 1, y = (j + 0.5) / N * 2 - 1, rr = x * x + y * y, k = (j * N + i) * 4;
    if (rr > 1) { d[k + 3] = 0; continue; }
    const z = Math.sqrt(1 - rr);
    // view -> world (undo lat0 tilt, then lon0 spin)
    const wy = -y * cp0 + z * sp0, wz = y * sp0 + z * cp0;
    const lat = Math.asin(Math.max(-1, Math.min(1, wy))), lon = Math.atan2(x, wz) + l0;
    const px = Math.cos(lat) * Math.sin(lon), py = Math.sin(lat), pz = Math.cos(lat) * Math.cos(lon);
    const light = x * sun[0] + y * sun[1] + z * sun[2];
    // land coverage from the equirectangular map (bilinear, so coastlines are smooth)
    let lonw = lon * 57.29578; lonw = ((lonw + 180) % 360 + 360) % 360;
    const fx_ = lonw / 360 * LM.w - 0.5, fy_ = (90 - lat * 57.29578) / 180 * LM.h - 0.5;
    const ix = Math.floor(fx_), iy = Math.max(0, Math.min(LM.h - 2, Math.floor(fy_))), ax_ = fx_ - ix, ay_ = fy_ - iy;
    const i0 = ((ix % LM.w) + LM.w) % LM.w, i1 = (i0 + 1) % LM.w;
    const cov = (LM.m[iy * LM.w + i0] * (1 - ax_) + LM.m[iy * LM.w + i1] * ax_) * (1 - ay_) + (LM.m[(iy + 1) * LM.w + i0] * (1 - ax_) + LM.m[(iy + 1) * LM.w + i1] * ax_) * ay_;
    const onLand = cov > 0.5;
    // biome colour for land pixels (latitude bands + noise), written under the clouds
    let br = 0, bg = 0, bb = 0, ba = 0;
    if (onLand) {
      const al = Math.abs(lat) * 57.3, n = fbm(px * 6, py * 6, pz * 6, 3);
      const lond = lon * 57.29578, latd = lat * 57.29578, lonn = ((lond + 180) % 360 + 360) % 360 - 180;
      const greenland = latd > 59 && lonn > -75 && lonn < -10;
      const desert = Math.max(0, 1 - Math.abs(al - 24) / 9 + n * 1.6), polar = (ice && (latd < -60 || greenland || latd > 78)) ? 1 : (latd > 64 ? 0.25 : 0);
      br = lerp(lerp(52 + n * 60, 196 + n * 40, Math.min(1, desert)), 236, polar);
      bg = lerp(lerp(118 + n * 60, 170 + n * 30, Math.min(1, desert)), 242, polar);
      bb = lerp(lerp(48 + n * 30, 110 + n * 20, Math.min(1, desert)), 250, polar);
      ba = 1;
    }
    if (cov > 0 && !onLand) { const lt = lat * 57.3, pi = ice && (lt < -60 || lt > 78); br = pi ? 236 : 70; bg = pi ? 242 : 120; bb = pi ? 250 : 60; ba = cov * 2; }
    if (onLand) { ba = Math.min(1, cov * 2 - 0.0);
    }
    let cl = clouds > 0 ? fbm(px * 2.2 + t * 0.03, py * 2.6, pz * 2.2 - t * 0.02, 4) : -1;
    cl = Math.max(0, Math.min(1, (cl + 0.08) * 2.4)) * clouds;
    const day = Math.max(0, Math.min(1, light * 3 + 0.35));
    const night = 1 - day;
    // city lights on the night side (noise-gated speckle)
    let city = 0;
    if (lights && onLand && night > 0.45) { const n = noise3(px * 60, py * 60, pz * 60); city = n > 0.5 ? (n - 0.5) * 5 : 0; }
    if (toon) {                                   // flat illustrated palette + cel bands
      if (onLand) { const al2 = Math.abs(lat) * 57.3, nn = fbm(px * 5, py * 5, pz * 5, 2);
        const pol = ice && (lat * 57.3 < -60 || lat * 57.3 > 78 || (lat * 57.3 > 59 && (((lon * 57.3 + 180) % 360 + 360) % 360 - 180) > -75 && (((lon * 57.3 + 180) % 360 + 360) % 360 - 180) < -10));
        const des = Math.abs(al2 - 24) < 9 && nn > -0.15;
        [br, bg, bb] = pol ? [242, 247, 255] : des ? [232, 196, 122] : nn > 0.05 ? [52, 160, 78] : [74, 182, 92]; }
      const band = light > 0.25 ? 1 : light > -0.05 ? 0.7 : 0.42;
      const cl2 = cl > 0.55 ? 0.85 : 0;
      let r0 = br, g0 = bg, b0 = bb, a0 = ba;
      if (cl2) { r0 = 255; g0 = 255; b0 = 255; a0 = cl2; }
      const sh = 1 - band;
      if (sh > 0) { const k2 = sh; r0 = lerp(r0, 22, k2); g0 = lerp(g0, 30, k2); b0 = lerp(b0, 80, k2); a0 = Math.max(a0, sh); }
      d[k] = r0; d[k + 1] = g0; d[k + 2] = b0; d[k + 3] = Math.min(255, a0 * 255);
      continue;
    }
    // composite: biome (lit) -> clouds -> night darkening -> city lights
    const lit = 0.35 + 0.65 * day;
    let r0 = br * lit, g0 = bg * lit, b0 = bb * lit, a0 = ba;
    r0 = lerp(r0, 255 * lit, cl); g0 = lerp(g0, 250 * lit, cl); b0 = lerp(b0, 245 * lit, cl); a0 = Math.max(a0, cl);
    const shade = 0.82 * night;
    r0 = lerp(r0, 4, shade); g0 = lerp(g0, 8, shade); b0 = lerp(b0, 26, shade); a0 = Math.max(a0, shade);
    r0 += city * 255; g0 += city * 190; b0 += city * 110; a0 = Math.min(1, a0 + city);
    d[k] = Math.min(255, r0); d[k + 1] = Math.min(255, g0); d[k + 2] = Math.min(255, b0); d[k + 3] = Math.min(255, a0 * 255);
  }
  tc.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(_globeTex, cx - R, cy - R, 2 * R, 2 * R);
  // specular glint
  const gx = cx + sun[0] * R * 0.55, gy = cy + sun[1] * R * 0.55;
  const sg = ctx.createRadialGradient(gx, gy, 0, gx, gy, R * 0.35);
  sg.addColorStop(0, 'rgba(255,255,240,0.35)'); sg.addColorStop(1, 'rgba(255,255,240,0)');
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = sg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.globalCompositeOperation = 'source-over';
  // inner rim light
  const rim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
  rim.addColorStop(0, `rgba(${atmo},0)`); rim.addColorStop(1, `rgba(${atmo},0.45)`);
  ctx.fillStyle = rim; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.restore();
  if (toon && ink) { ctx.lineWidth = Math.max(5, R * 0.022); ctx.strokeStyle = '#1b1640'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke(); }
}

// Equirectangular land coverage map (built once from LAND): 0..1 per cell.
let _LM = null;
function landMap() {
  if (_LM) return _LM;
  const w = 4096, h = 2048, c = makeCanvas(w, h), g = c.getContext('2d');
  g.fillStyle = '#fff';
  for (const poly of LAND) { g.beginPath(); poly.forEach(([lo, la], i) => { const x = (lo + 180) / 360 * w, y = (90 - la) / 180 * h; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.fill(); }
  const d = g.getImageData(0, 0, w, h).data, m = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) m[i] = d[i * 4 + 3] / 255;
  _LM = { w, h, m }; return _LM;
}

// Realistic-ish Moon with noise-shaded maria and terminator.
// (moon texture is allocated per size by texFor)
const _CRATERS = (() => { const r = rng(808), out = [];
  for (let i = 0; i < 46; i++) { const u = r() * 2 - 1, a = r() * 6.283, q = Math.sqrt(1 - u * u);
    out.push([q * Math.cos(a), q * Math.sin(a), Math.abs(u) * (r() > 0.25 ? 1 : -1), 0.03 + Math.pow(r(), 3) * 0.16]); }
  return out; })();
function moonFx(ctx, cx, cy, R, o = {}) {
  const { sun = [-0.5, -0.3, 0.8], crack = 0 } = o;
  const _moonTex = texFor('m', R, 760);
  const N = _moonTex.width, tc = _moonTex.getContext('2d'), img = tc.createImageData(N, N), d = img.data;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = (i + 0.5) / N * 2 - 1, y = (j + 0.5) / N * 2 - 1, rr = x * x + y * y, k = (j * N + i) * 4;
    if (rr > 1) { d[k + 3] = 0; continue; }
    const z = Math.sqrt(1 - rr);
    const mar = fbm(x * 1.4 + 7, y * 1.4, z * 1.4, 4), fine = fbm(x * 8, y * 8, z * 8, 2);
    let v = 200 - Math.max(0, mar + 0.05) * 190 + fine * 26;
    for (const [qx, qy, qz, qr] of _CRATERS) {
      const dd = Math.acos(Math.max(-1, Math.min(1, x * qx + y * qy + z * qz))) / qr;
      if (dd < 1.25) v += dd < 0.85 ? -28 * (1 - dd * dd * 0.6) : dd < 1.0 ? 34 : 34 * (1.25 - dd) * 4;
    }
    const lit = Math.max(0.05, x * sun[0] + y * sun[1] + z * sun[2]);
    v *= Math.min(1, lit * 1.25);
    if (crack > 0) { const c = Math.abs(noise3(x * 5, y * 5, 3.3)); if (c < 0.03 * crack) { d[k] = 255; d[k + 1] = 120; d[k + 2] = 40; d[k + 3] = 255; continue; } }
    d[k] = v; d[k + 1] = v * 0.99; d[k + 2] = v * 0.96; d[k + 3] = 255;
  }
  tc.putImageData(img, 0, 0);
  ctx.save(); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(_moonTex, cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
}

// ---------------------------------------------------------------- smoke / dust / ash
// A billowing plume made of shaded puffs driven by noise. base (x,y), height growth 0..1.
function plume(ctx, t, x, y, o = {}) {
  const { height = 900, width = 260, grow = 1, seed = 1, col = [70, 66, 72], light = [200, 190, 180], count = 160, alpha = 0.5, drift = 0.2, blur = 5 } = o;
  const b = fxBuf('plume'), c = b.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const s = r(), life = (s + t * 0.05) % 1;
    const h = life * height * grow;
    const nx = fbm(i * 0.21, t * 0.15, seed, 3) * width * 1.1 + drift * h;
    const px = x + nx + (r() - 0.5) * width * (0.25 + life * 1.1), py = y - h;
    const pr = (70 + r() * 80) * (0.45 + life * 1.8) * (width / 260);
    const g = c.createRadialGradient(px - pr * 0.3, py - pr * 0.4, pr * 0.05, px, py, pr);
    g.addColorStop(0, `rgba(${light[0]},${light[1]},${light[2]},${alpha})`);
    g.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},${alpha * 0.8})`);
    g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
    c.fillStyle = g; c.beginPath(); c.arc(px, py, pr, 0, 6.283); c.fill();
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${blur}px)`; ctx.drawImage(b, 0, 0); ctx.filter = 'none'; ctx.restore();
}
// One-shot dust burst (e.g. building collapse) starting at `at`.
function dustBurst(ctx, t, x, y, at, o = {}) {
  const { size = 1, seed = 2, col = [150, 140, 128], dur = 3.5 } = o;
  const k = prog(t, at, at + dur); if (k <= 0 || k >= 1) return;
  const r = rng(seed);
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI - Math.PI, sp = 200 + r() * 500;
    const px = x + Math.cos(a) * sp * easeOut(k) * size, py = y + Math.sin(a) * sp * 0.35 * easeOut(k) * size - k * 80 * size;
    const pr = (60 + r() * 90) * size * (0.5 + k);
    const al = 0.85 * (1 - k);
    const g = ctx.createRadialGradient(px, py - pr * 0.3, pr * 0.1, px, py, pr);
    g.addColorStop(0, `rgba(${col[0] + 40},${col[1] + 40},${col[2] + 40},${al})`); g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.283); ctx.fill();
  }
}

// ---------------------------------------------------------------- particles
// Ballistic debris: chunks launched from (x,y) at `at`, tumbling under gravity.
function debrisBurst(ctx, t, x, y, at, o = {}) {
  const { n = 40, speed = 900, g = 1600, spread = Math.PI, dir = -Math.PI / 2, seed = 5, col = '#3a3340', size = 14, dur = 3 } = o;
  const dt = t - at; if (dt < 0 || dt > dur) return;
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const a = dir + (r() - 0.5) * spread, v = speed * (0.4 + r() * 0.8), s = size * (0.4 + r());
    const px = x + Math.cos(a) * v * dt, py = y + Math.sin(a) * v * dt + 0.5 * g * dt * dt;
    ctx.save(); ctx.translate(px, py); ctx.rotate(dt * (r() - 0.5) * 14); ctx.globalAlpha = 1 - dt / dur;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s, -s * 0.6); ctx.lineTo(s * 0.8, -s); ctx.lineTo(s, s * 0.7); ctx.lineTo(-s * 0.7, s); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}
// Glowing embers / sparks (additive).
function embers(ctx, t, x, y, o = {}) {
  const { n = 60, w = 400, h = 900, seed = 9, col = '255,160,60' } = o;
  const r = rng(seed);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const life = (r() + t * (0.15 + r() * 0.2)) % 1;
    const px = x + (r() - 0.5) * w + Math.sin(t * 2 + i) * 30, py = y - life * h;
    ctx.fillStyle = `rgba(${col},${(1 - life) * 0.9})`; ctx.beginPath(); ctx.arc(px, py, 2 + r() * 4, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}
// Fireball streaking down through the sky with a glowing trail (additive).
function fireball(ctx, t, x0, y0, x1, y1, at, dur = 1.6, size = 1) {
  const k = prog(t, at, at + dur); if (k <= 0 || k >= 1) return;
  const e = k * k;
  const x = lerp(x0, x1, e), y = lerp(y0, y1, e);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { const q = Math.max(0, e - i * 0.018), tx = lerp(x0, x1, q), ty = lerp(y0, y1, q);
    ctx.fillStyle = `rgba(255,${150 + i * 6},${60 + i * 8},${0.5 * (1 - i / 14)})`; ctx.beginPath(); ctx.arc(tx, ty, (26 - i * 1.5) * size, 0, 6.283); ctx.fill(); }
  glow(ctx, x, y, 90 * size, '255,200,120', 0.9);
  ctx.restore();
}
// Expanding shockwave ring.
function shockwave(ctx, t, x, y, at, o = {}) {
  const { maxR = 900, dur = 1.4, col = '255,255,255', flat = 0.35 } = o;
  const k = prog(t, at, at + dur); if (k <= 0 || k >= 1) return;
  ctx.save(); ctx.strokeStyle = `rgba(${col},${0.8 * (1 - k)})`; ctx.lineWidth = 30 * (1 - k) + 4;
  ctx.beginPath(); ctx.ellipse(x, y, maxR * easeOut(k), maxR * easeOut(k) * flat, 0, 0, 6.283); ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- city & destruction
// A building that can topple: fall = 0..1 (rotation about its base corner), crumble = 0..1.
function tower(ctx, t, x, base, w, h, o = {}) {
  const { col = '#5b6680', win = 'rgba(255,224,160,0.85)', fall = 0, dir = 1, crumble = 0, seed = 1 } = o;
  const r = rng(seed);
  ctx.save();
  ctx.translate(x + (dir > 0 ? w : 0), base); ctx.rotate(dir * easeIn2(fall) * 1.35); ctx.translate(-(dir > 0 ? w : 0), 0);
  const slices = 8;
  for (let s = 0; s < slices; s++) {
    const sy = -h * (s + 1) / slices, sh = h / slices;
    const off = crumble * (s / slices) * (r() - 0.5) * 260, drop = crumble * crumble * (s / slices) * 380, rot = crumble * (r() - 0.5) * 0.8;
    ctx.save(); ctx.translate(off, drop); ctx.rotate(rot);
    const g = ctx.createLinearGradient(0, sy, w, sy); g.addColorStop(0, shadeHex(col, 0.12)); g.addColorStop(1, shadeHex(col, -0.25));
    ctx.fillStyle = g; ctx.fillRect(0, sy, w, sh + 1);
    for (let wy = sy + 14; wy < sy + sh - 18; wy += 34) for (let wx = 14; wx < w - 22; wx += 30) {
      ctx.fillStyle = r() > 0.4 ? win : 'rgba(20,24,40,0.5)'; ctx.fillRect(wx, wy, 16, 20); }
    ctx.restore();
  }
  ctx.restore();
}
function easeIn2(p) { return p * p; }
function shadeHex(hex, k) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).map(v => Math.round(Math.max(0, Math.min(255, v * (1 + k)))));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

// Wall of water advancing from the left; front = x position of the face, height in px.
function waterWall(ctx, t, front, ground, height, o = {}) {
  const { seed = 4 } = o;
  ctx.save();
  const top = ground - height;
  const body = ctx.createLinearGradient(0, top, 0, ground);
  body.addColorStop(0, '#9fe3ff'); body.addColorStop(0.25, '#2a8fd0'); body.addColorStop(1, '#0b3e6e');
  ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-50, ground + 400);
  ctx.lineTo(-50, top);
  for (let x = -50; x <= front; x += 16) { const n = fbm(x * 0.004, t * 0.6, seed, 3); ctx.lineTo(x, top + n * 120 + Math.sin(x * 0.02 + t * 3) * 14); }
  // curling face
  ctx.quadraticCurveTo(front + height * 0.35, top - 40, front + height * 0.18, top + height * 0.35);
  ctx.quadraticCurveTo(front + height * 0.05, ground - height * 0.2, front + 40, ground);
  ctx.lineTo(front + 40, ground + 400); ctx.closePath(); ctx.fill();
  // translucent face highlight
  const face = ctx.createLinearGradient(front - 200, 0, front + 200, 0);
  face.addColorStop(0, 'rgba(160,230,255,0)'); face.addColorStop(1, 'rgba(160,230,255,0.35)');
  ctx.fillStyle = face; ctx.fillRect(front - 200, top, 400, height);
  // foam + spray
  ctx.strokeStyle = 'rgba(235,250,255,0.9)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath();
  for (let x = -50; x <= front; x += 16) { const n = fbm(x * 0.004, t * 0.6, seed, 3); const y = top + n * 120 + Math.sin(x * 0.02 + t * 3) * 14; x === -50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  const r = rng(seed);
  for (let i = 0; i < 70; i++) {
    const u = 0.7 + r() * 0.3, px = lerp(-50, front + height * 0.25, u) + (r() - 0.5) * 40, py = top + fbm(px * 0.004, t * 0.6, seed, 3) * 120 - r() * 40 - ((t * 300 * (0.5 + r())) % 180);
    ctx.fillStyle = `rgba(245,252,255,${0.5 + r() * 0.4})`; ctx.beginPath(); ctx.arc(px, py, 3 + r() * 8, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}

// A cargo ship silhouette (for being carried inland).
function ship(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(-220, 0); ctx.lineTo(220, 0); ctx.lineTo(180, 60); ctx.lineTo(-200, 60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#20232f'; ctx.fillRect(-220, -10, 440, 14);
  const cols = ['#2e86de', '#f39c12', '#27ae60', '#8e44ad', '#e67e22'];
  for (let i = 0; i < 10; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = cols[(i + j) % 5]; ctx.fillRect(-180 + i * 30, -50 - j * 36, 28, 34); }
  ctx.fillStyle = '#ecf0f1'; ctx.fillRect(150, -110, 50, 100);
  ctx.restore();
}

// ---------------------------------------------------------------- post-processing
// Bloom + colour grade + soft vignette. Call once at the end of render().
function post(ctx, o = {}) {
  const { bloom = 0.22, contrast = 1.05, saturate = 1.08, vignette = 0.28, chromaPx = 0 } = o;
  const src = ctx.canvas;
  const small = fxBuf('bloom', W / 4, H / 4), sc = small.getContext('2d');
  sc.filter = 'brightness(0.62) contrast(3.4)'; sc.clearRect(0, 0, small.width, small.height); sc.drawImage(src, 0, 0, small.width, small.height); sc.filter = 'none';
  const blurred = fxBuf('bloom2', W / 4, H / 4), bc = blurred.getContext('2d');
  bc.filter = 'blur(7px)'; bc.clearRect(0, 0, blurred.width, blurred.height); bc.drawImage(small, 0, 0); bc.filter = 'none';
  const copy = fxBuf('grade'), cc = copy.getContext('2d');
  cc.filter = `contrast(${contrast}) saturate(${saturate})`; cc.clearRect(0, 0, W, H); cc.drawImage(src, 0, 0); cc.filter = 'none';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(copy, 0, 0);
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = bloom; ctx.drawImage(blurred, 0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.78);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${vignette})`);
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  chroma(ctx, chromaPx);
}

// Draw something blurred (depth of field) via an offscreen buffer.
function dof(ctx, px, fn) {
  const b = fxBuf('dof'), bc = b.getContext('2d');
  bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(0, 0, W, H); bc.save(); fn(bc); bc.restore();
  ctx.save(); ctx.filter = `blur(${px}px)`; ctx.drawImage(b, 0, 0); ctx.filter = 'none'; ctx.restore();
}

// Count-up number in clean type (e.g. a death toll). Formats with commas; optional prefix/suffix.
function tally(ctx, t, value, x, y, at, o = {}) {
  const { size = 120, color = '#ffffff', dur = 2.2, prefix = '', suffix = '', out = 1e9, label = '', labelSize = 40, align = 'center' } = o;
  if (t < at || t > out + 0.4) return;
  const v = Math.round(value * easeOut(prog(t, at, at + dur)));
  ctx.save(); ctx.globalAlpha = Math.min(1, prog(t, at, at + 0.3)) * (1 - prog(t, out, out + 0.35));
  ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6;
  ctx.font = `900 ${size}px ${FONT}`; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${-size * 0.03}px`;
  ctx.fillStyle = color; ctx.fillText(prefix + v.toLocaleString('en-US') + suffix, x, y);
  if (label) { if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px'; ctx.font = `800 ${labelSize}px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillText(label, x, y + labelSize * 1.5); }
  ctx.restore();
}

// ================================================================ v6: impact & lighting kit
// Camera punch-in: a quick zoom pulse after each hit time, decaying fast.
function punch(ctx, t, hits, amount = 0.07, cx = W / 2, cy = H / 2) {
  let s = 1;
  for (const h of hits) if (t >= h) s += amount * Math.exp(-(t - h) * 7) * (1 - Math.exp(-(t - h) * 60));
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
}
// Strength (0..1) of an impact effect at time t for a list of hit times.
function hitAmount(t, hits, decay = 6) { let a = 0; for (const h of hits) if (t >= h) a = Math.max(a, Math.exp(-(t - h) * decay)); return a; }

// Chromatic aberration (RGB split), applied to the whole frame. Used on impact frames.
function chroma(ctx, px) {
  if (px < 0.5) return;
  const src = ctx.canvas, mk = (n, col) => { const b = fxBuf(n), c = b.getContext('2d');
    c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H); c.drawImage(src, 0, 0);
    c.globalCompositeOperation = 'multiply'; c.fillStyle = col; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; return b; };
  const r = mk('chR', '#ff0000'), g = mk('chG', '#00ff00'), b = mk('chB', '#0000ff');
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(r, -px, 0); ctx.drawImage(g, 0, 0); ctx.drawImage(b, px, 0);
  ctx.restore();
}

// Anamorphic lens flare: horizontal streak, glow, starburst and ghosts toward the frame centre.
function lensFlare(ctx, x, y, k = 1, tint = '190,215,255') {
  if (k <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const sg = ctx.createLinearGradient(x - 700, 0, x + 700, 0);
  sg.addColorStop(0, `rgba(${tint},0)`); sg.addColorStop(0.5, `rgba(${tint},${0.55 * k})`); sg.addColorStop(1, `rgba(${tint},0)`);
  ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(x, y, 700, 7, 0, 0, 6.283); ctx.fill();
  glow(ctx, x, y, 160, tint, 0.35 * k);
  ctx.strokeStyle = `rgba(${tint},${0.18 * k})`; ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + 0.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 260, y + Math.sin(a) * 260); ctx.stroke(); }
  const dx = W / 2 - x, dy = H / 2 - y;
  for (const [f, r, a, c] of [[0.6, 40, 0.18, '255,200,150'], [1.1, 90, 0.10, '150,200,255'], [1.5, 26, 0.22, '255,255,255'], [1.9, 140, 0.06, '200,150,255']]) {
    const gx = x + dx * f, gy = y + dy * f, g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    g.addColorStop(0, `rgba(${c},${a * k})`); g.addColorStop(0.7, `rgba(${c},${a * 0.6 * k})`); g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, gy, r, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}

// Volumetric light rays streaming from a source, slowly rotating.
function godRays(ctx, t, x, y, o = {}) {
  const { n = 18, len = 1500, alpha = 0.10, tint = '210,225,255', seed = 3 } = o;
  const r = rng(seed);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2 + t * 0.03 * (r() - 0.5), w = 0.02 + r() * 0.05, l = len * (0.5 + r() * 0.5);
    const g = ctx.createRadialGradient(x, y, 0, x, y, l);
    g.addColorStop(0, `rgba(${tint},${alpha * (0.5 + r())})`); g.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, l, a - w, a + w); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// Physically simulated debris: gravity, drag, and bounces on a ground line (deterministic re-sim).
function debrisPhys(ctx, t, x, y, at, o = {}) {
  const { n = 40, speed = 900, g = 1800, spread = Math.PI, dir = -Math.PI / 2, seed = 5, col = '#3a3340', size = 14, ground = 1e9, dur = 4, restitution = 0.35 } = o;
  const T = t - at; if (T < 0 || T > dur) return;
  const r = rng(seed), dt = 1 / 120, steps = Math.floor(T / dt);
  for (let i = 0; i < n; i++) {
    const a = dir + (r() - 0.5) * spread, v = speed * (0.35 + r() * 0.85), s = size * (0.4 + r()); let spin = (r() - 0.5) * 16;
    let px = x, py = y, vx = Math.cos(a) * v, vy = Math.sin(a) * v, rot = 0;
    for (let k = 0; k < steps; k++) {
      vy += g * dt; vx *= 0.999; px += vx * dt; py += vy * dt; rot += spin * dt;
      if (py > ground - s * 0.5) { py = ground - s * 0.5; vy = -vy * restitution; vx *= 0.7; spin *= 0.6; }
    }
    ctx.save(); ctx.translate(px, py); ctx.rotate(rot); ctx.globalAlpha = Math.min(1, (dur - T) * 2);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s, -s * 0.6); ctx.lineTo(s * 0.8, -s); ctx.lineTo(s, s * 0.7); ctx.lineTo(-s * 0.7, s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(-s * 0.6, -s * 0.7, s * 0.8, s * 0.25);
    ctx.restore();
  }
}

// Streaking water droplets (spray) thrown from a point along a direction.
function spray(ctx, t, x, y, o = {}) {
  const { n = 80, speed = 1100, dir = -1.2, spread = 0.9, g = 1600, seed = 8, period = 1.1 } = o;
  const r = rng(seed);
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const ph = (t / period + r()) % 1, T = ph * period;
    const a = dir + (r() - 0.5) * spread, v = speed * (0.5 + r() * 0.7);
    const vx = Math.cos(a) * v, vy = Math.sin(a) * v + g * T;
    const px = x + Math.cos(a) * v * T, py = y + Math.sin(a) * v * T + 0.5 * g * T * T;
    ctx.strokeStyle = `rgba(240,250,255,${0.75 * (1 - ph)})`; ctx.lineWidth = 2 + r() * 4;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - vx * 0.02, py - vy * 0.02); ctx.stroke();
  }
  ctx.restore();
}

// Elegant human silhouette (no face): pose 'stand' | 'read' | 'point'.
function silhouette(ctx, x, y, h, o = {}) {
  const { col = '#0d1326', pose = 'stand', flip = false } = o;
  const u = h / 8;
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, -7.4 * u, 0.48 * u, 0.58 * u, 0, 0, 6.283); ctx.fill();            // head
  ctx.fillRect(-0.18 * u, -6.9 * u, 0.36 * u, 0.5 * u);                                                  // neck
  ctx.beginPath(); ctx.moveTo(-1.05 * u, -6.3 * u); ctx.quadraticCurveTo(0, -6.6 * u, 1.05 * u, -6.3 * u);  // torso
  ctx.lineTo(0.75 * u, -3.6 * u); ctx.lineTo(-0.75 * u, -3.6 * u); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 0.62 * u;
  ctx.beginPath(); ctx.moveTo(-0.38 * u, -3.8 * u); ctx.lineTo(-0.45 * u, -0.2 * u); ctx.moveTo(0.38 * u, -3.8 * u); ctx.lineTo(0.48 * u, -0.2 * u); ctx.stroke();  // legs
  ctx.lineWidth = 0.42 * u;
  if (pose === 'read') {
    ctx.beginPath(); ctx.moveTo(-0.9 * u, -6.0 * u); ctx.lineTo(-0.7 * u, -4.6 * u); ctx.lineTo(0.3 * u, -5.0 * u); ctx.moveTo(0.9 * u, -6.0 * u); ctx.lineTo(1.0 * u, -4.7 * u); ctx.lineTo(0.5 * u, -5.0 * u); ctx.stroke();
    ctx.fillStyle = '#f4efe2'; ctx.save(); ctx.translate(0.4 * u, -5.2 * u); ctx.rotate(-0.25); ctx.fillRect(-0.55 * u, -0.4 * u, 1.1 * u, 0.75 * u); ctx.restore();   // lit book pages
  } else if (pose === 'point') {
    ctx.beginPath(); ctx.moveTo(-0.9 * u, -6.0 * u); ctx.lineTo(-1.1 * u, -3.9 * u); ctx.moveTo(0.9 * u, -6.0 * u); ctx.lineTo(2.2 * u, -7.6 * u); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-0.9 * u, -6.0 * u); ctx.lineTo(-1.15 * u, -3.8 * u); ctx.moveTo(0.9 * u, -6.0 * u); ctx.lineTo(1.15 * u, -3.8 * u); ctx.stroke();
  }
  ctx.restore();
}

// A hand held up at arm's length (silhouette), fingers up, viewed from behind.
function hand(ctx, x, y, s, col = '#0b1020') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  roundRect(ctx, -170, -40, 340, 420, 120); ctx.fill();                                 // palm + wrist
  [[-150, -330, 70, 330], [-72, -400, 72, 400], [6, -380, 72, 380], [84, -320, 66, 320]].forEach(([fx, fy, fw, fh]) => { roundRect(ctx, fx, fy, fw, fh, 34); ctx.fill(); });
  ctx.save(); ctx.translate(150, 60); ctx.rotate(-0.75); roundRect(ctx, -40, -230, 78, 250, 38); ctx.fill(); ctx.restore();   // thumb
  ctx.restore();
}

// ================================================================ v7: illustrated-3D kit (original style, with depth)
const INK = '#1b1640';

// Cel-shaded stylized Moon with ink outline.
function moonToon(ctx, x, y, r, o = {}) {
  const { sun = [-0.6, -0.35, 0.72], crack = 0, t = 0 } = o;
  ctx.save();
  ctx.fillStyle = '#e4e7ef'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.clip();
  const cr = rng(12);
  for (let i = 0; i < 14; i++) { const a = cr() * 6.283, d = Math.sqrt(cr()) * r * 0.85, s2 = r * (0.06 + cr() * 0.14);
    ctx.fillStyle = '#c3c8d4'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s2, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d - s2 * 0.2, y + Math.sin(a) * d - s2 * 0.2, s2 * 0.55, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#b8bfcc'; ctx.beginPath(); ctx.ellipse(x - r * 0.25, y + r * 0.1, r * 0.35, r * 0.25, 0.4, 0, 6.283); ctx.fill();
  // cel shadow: the lit side faces the Sun
  ctx.fillStyle = 'rgba(40,44,90,0.55)'; ctx.beginPath(); ctx.arc(x - sun[0] * r * 0.55, y - sun[1] * r * 0.55, r * 1.05, 0, 6.283); ctx.fill();
  if (crack > 0) { ctx.strokeStyle = `rgba(255,120,40,${Math.min(1, crack)})`; ctx.lineWidth = r * 0.05; ctx.lineCap = 'round';
    const rr = rng(4); for (let i = 0; i < 5; i++) { let px = x + (rr() - 0.5) * r, py = y - r; ctx.beginPath(); ctx.moveTo(px, py);
      for (let k = 0; k < 6; k++) { px += (rr() - 0.5) * r * 0.5; py += r * 0.35; ctx.lineTo(px, py); } ctx.stroke(); } }
  ctx.restore();
  ctx.lineWidth = Math.max(4, r * 0.04); ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
  ctx.restore();
}

// A 3D building block: lit front, shaded side, roof, windows, ink edges. fall = topple angle 0..1,
// crumble = break into drifting floors 0..1. depth gives the 3D side face.
function block3d(ctx, t, x, base, w, h, o = {}) {
  const { col = '#5c6fa6', depth = 60, fall = 0, dir = 1, crumble = 0, seed = 1, lit = 'rgba(255,230,160,0.95)', dark = 'rgba(30,36,70,0.85)' } = o;
  const r = rng(seed), dx = depth * 0.7, dy = -depth * 0.45;
  const front = col, side = shadeHex(col, -0.32), roof = shadeHex(col, 0.22);
  ctx.save();
  const pivotX = dir > 0 ? x + w + dx : x;
  ctx.translate(pivotX, base); ctx.rotate(dir * fall * fall * 1.4); ctx.translate(-pivotX, -base);
  const floors = Math.max(4, Math.round(h / 70)), fh = h / floors;
  for (let f = 0; f < floors; f++) {
    const y0 = base - fh * (f + 1);
    const ox = crumble * (r() - 0.5) * 220 * (f / floors), oy = crumble * crumble * 300 * (f / floors), rot = crumble * (r() - 0.5) * 0.7 * (f / floors);
    ctx.save(); ctx.translate(x + w / 2 + ox, y0 + fh / 2 + oy); ctx.rotate(rot); ctx.translate(-(x + w / 2), -(y0 + fh / 2));
    ctx.fillStyle = front; ctx.fillRect(x, y0, w, fh + 0.5);
    ctx.fillStyle = side; ctx.beginPath(); ctx.moveTo(x + w, y0); ctx.lineTo(x + w + dx, y0 + dy); ctx.lineTo(x + w + dx, y0 + fh + dy); ctx.lineTo(x + w, y0 + fh); ctx.closePath(); ctx.fill();
    for (let wx = x + 14; wx < x + w - 24; wx += 30) { ctx.fillStyle = r() > 0.35 ? lit : dark; ctx.fillRect(wx, y0 + fh * 0.25, 16, fh * 0.45); }
    ctx.fillStyle = 'rgba(255,230,160,0.55)';
    for (let k = 0; k < 2; k++) { const sx = x + w + dx * (0.3 + k * 0.4); ctx.beginPath(); ctx.moveTo(sx, y0 + fh * 0.25 + dy * (0.3 + k * 0.4)); ctx.lineTo(sx + 10, y0 + fh * 0.25 + dy * (0.3 + k * 0.4) - 6); ctx.lineTo(sx + 10, y0 + fh * 0.7 + dy * (0.3 + k * 0.4) - 6); ctx.lineTo(sx, y0 + fh * 0.7 + dy * (0.3 + k * 0.4)); ctx.fill(); }
    if (f === floors - 1) { ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + dx, y0 + dy); ctx.lineTo(x + w + dx, y0 + dy); ctx.lineTo(x + w, y0); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  if (crumble < 0.05) { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(x, base); ctx.lineTo(x, base - h); ctx.lineTo(x + dx, base - h + dy); ctx.lineTo(x + w + dx, base - h + dy); ctx.lineTo(x + w + dx, base + dy); ctx.lineTo(x + w, base);
    ctx.moveTo(x + w, base); ctx.lineTo(x + w, base - h); ctx.lineTo(x, base - h); ctx.moveTo(x + w, base - h); ctx.lineTo(x + w + dx, base - h + dy); ctx.stroke(); }
  ctx.restore();
}

// Illustrated wall of water: flat bands, scalloped white foam crest, curl, ink edge.
function toonWave(ctx, t, front, ground, height, seed = 4) {
  const top = ground - height;
  const crestY = x => top + Math.sin(x * 0.012 + t * 2.2) * 18 + fbm(x * 0.004, t * 0.5, seed, 2) * 60;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(-80, ground + 600); ctx.lineTo(-80, crestY(-80));
  for (let x = -80; x <= front; x += 14) ctx.lineTo(x, crestY(x));
  ctx.quadraticCurveTo(front + height * 0.38, top - 50, front + height * 0.2, top + height * 0.32);
  ctx.quadraticCurveTo(front + height * 0.04, ground - height * 0.2, front + 50, ground);
  ctx.lineTo(front + 50, ground + 600); ctx.closePath();
  const g = ctx.createLinearGradient(0, top, 0, ground); g.addColorStop(0, '#5ec2ff'); g.addColorStop(0.35, '#2f8ee0'); g.addColorStop(1, '#1d5fae');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 10;                 // flow bands
  for (let k = 1; k < 6; k++) { ctx.beginPath(); for (let x = -80; x <= front + 40; x += 20) { const y = crestY(x) + k * height * 0.15 + Math.sin(x * 0.02 - t * 3 + k) * 10; x === -80 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.restore();
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 4;              // scalloped foam
  const r = rng(seed);
  for (let x = -60; x <= front + 30; x += 46) { const rr = 26 + r() * 22, y = crestY(x) - 6 + Math.sin(t * 6 + x) * 4;
    ctx.beginPath(); ctx.arc(x, y, rr, Math.PI, 0); ctx.fill(); }
  for (let i = 0; i < 26; i++) {                                                      // spray blobs off the curl
    const ph = (t * 0.9 + r()) % 1, a = -1.3 + r() * 0.9, v = 500 + r() * 500;
    const x = front + height * 0.2 + Math.cos(a) * v * ph, y = top + Math.sin(a) * v * ph + 900 * ph * ph;
    ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.arc(x, y, 8 + r() * 14, 0, 6.283); ctx.fill(); }
  ctx.globalAlpha = 1;
}

// Illustrated eruption column: two-tone puffs with ink rim (stylized, not photographic).
function toonPlume(ctx, t, x, y, o = {}) {
  const { height = 900, width = 260, grow = 1, seed = 1, light = '#9a8f94', dark = '#5e5560' } = o;
  const r = rng(seed), puffs = [];
  for (let i = 0; i < 46; i++) { const life = (r() + t * 0.06) % 1, h = life * height * grow;
    puffs.push([x + fbm(i * 0.3, t * 0.12, seed, 2) * width + (r() - 0.5) * width * (0.3 + life), y - h, (50 + r() * 50) * (0.5 + life * 1.5) * (width / 260)]); }
  puffs.sort((a, b) => a[1] - b[1]);
  ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = INK;
  for (const [px, py, pr] of puffs) { ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.283); ctx.fill(); ctx.stroke(); }
  for (const [px, py, pr] of puffs) { ctx.fillStyle = light; ctx.beginPath(); ctx.arc(px - pr * 0.18, py - pr * 0.22, pr * 0.72, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

// 3D-shaded volcano cone with glowing lava channels.
function volcano3d(ctx, t, cx, base, w, h, heat = 1) {
  ctx.save();
  ctx.fillStyle = '#6b4a3c'; ctx.beginPath(); ctx.moveTo(cx - w / 2, base); ctx.lineTo(cx - w * 0.1, base - h); ctx.lineTo(cx + w * 0.1, base - h); ctx.lineTo(cx + w / 2, base); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a3129'; ctx.beginPath(); ctx.moveTo(cx + w * 0.02, base - h); ctx.lineTo(cx + w * 0.1, base - h); ctx.lineTo(cx + w / 2, base); ctx.lineTo(cx + w * 0.08, base); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(cx - w / 2, base); ctx.lineTo(cx - w * 0.1, base - h); ctx.lineTo(cx + w * 0.1, base - h); ctx.lineTo(cx + w / 2, base); ctx.stroke();
  if (heat > 0) {
    ctx.strokeStyle = `rgba(255,${120 + Math.sin(t * 8) * 30},40,${heat})`; ctx.lineWidth = 14; ctx.lineCap = 'round';
    for (const [dx2, k] of [[-0.06, -0.35], [0.03, 0.15], [0.07, 0.4]]) { ctx.beginPath(); ctx.moveTo(cx + w * dx2, base - h);
      ctx.quadraticCurveTo(cx + w * (dx2 + k * 0.2), base - h * 0.5, cx + w * (dx2 + k * 0.45), base - h * 0.05 * heat); ctx.stroke(); }
    glow(ctx, cx, base - h, w * 0.35, '255,130,40', 0.8 * heat);
  }
  ctx.restore();
}
