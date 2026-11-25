// What if a planet the size of Mars hit Earth?   (v4: mass scale; crowds of thousands, cities, continents)
//
// v4: no cartoon characters. Human toll shown at scale: plazas of thousands, fleeing crowds, skylines flattened,
// a molten front sweeping real continents (Natural Earth coastlines) and wiping out named megacities.
// No explicit gore (YouTube age-restricts it, which removes a Short from the Shorts feed).
//
// PHYSICS / NUMBERS (checked; working in archive/planet-impact-v1.js):
//  - Mars radius = 0.53 Earth radii (drawn to scale). Mass 6.42e23 kg.
//  - Arrives at >= 11.2 km/s (~40,000 km/h). Energy ≈ 4e31 J ≈ 1e8 × Chicxulub (~4e23 J).
//  - Final hour: tidal pull of a Mars-mass body a few Earth radii away dwarfs the Moon's -> oceans heave upward.
//  - Ejecta re-enter worldwide at near-orbital ("meteor") speeds within about an hour (antipodal ballistic
//    flight ~45 min); a supersonic blast wave and rock-vapour atmosphere (thousands of degrees) follow; within
//    hours every continent is buried in molten rock; crust melts hundreds of km deep (magma ocean).
//  - Boiling all oceans ≈ 3.6e27 J < 0.01% of the impact energy.
//  - Death toll (est.): all 8.2 billion within about a day.
//  - Debris disk -> new moon (2022 simulation: possibly within hours). Millions of years to cool; oceans return.
//  - Twist: Theia, a Mars-sized planet, hit the young Earth ~4.5 billion years ago; the Moon formed from it.
// PLOT HOLES: deflect it? a planet is ~10^12 × anything we've ever moved. Bunkers? the crust itself melts
//  (toll scene). Leave Earth? at most a handful of people could reach orbit, and nothing up there survives the debris.
// City populations: UN World Urbanization Prospects metro estimates (rounded).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['crowd', 4.0, [[0.1, 'swell:3.5']]],
  ['tide', 4.0, [[0.1, 'roar:3.8'], [0.2, 'rumble:3.5']]],
  ['impact', 4.5, [[0.9, 'impact'], [1.0, 'boom'], [1.05, 'rumble:3.4'], [2.8, 'boom']]],
  ['globe', 5.0, [[0.1, 'rumble:4.8'], [1.2, 'boom'], [3.0, 'boom']]],
  ['blast', 4.5, [[0.3, 'rumble:4'], [0.6, 'boom'], [0.8, 'roar:3.5'], [2.0, 'impact']]],
  ['rain', 4.5, [[0.2, 'rumble:4.2'], [0.8, 'boom'], [1.7, 'impact'], [2.6, 'boom'], [3.4, 'boom']]],
  ['boil', 4.0, [[0.1, 'roar:3.8']]],
  ['sky', 4.5, [[0.1, 'swell:2.6'], [2.75, 'impact'], [2.8, 'roar:1.6']]],
  ['toll', 5.0, [[0.2, 'rumble:4.5'], [2.6, 'boom']]],
  ['moon', 5.0, [[0.2, 'swell:4.6']]],
  ['cool', 4.0, [[0.2, 'swell:3.6']]],
  ['twist', 5.5, [[0.2, 'swell:2.4'], [2.6, 'impact'], [2.8, 'swell:2.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if a planet the size of Mars hit Earth?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 74, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const SUN = [-0.55, -0.35, 0.76];
const FNS = { hook: vHook, crowd: vCrowd, tide: vTide, impact: vImpact, globe: vGlobe, blast: vBlast, rain: vRain, boil: vBoil,
              sky: vSky, toll: vToll, moon: vMoon, cool: vCool, twist: vTwist, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2 });
}
const R2 = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

// ================================================================ crowds of thousands
// People scattered over a perspective ground band (far = small). flow: px/s drift (wraps). front/frontV: blast sweep.
function massCrowd(ctx, t, o) {
  const { n = 2500, yFar = 1250, yNear = 1950, sFar = 7, sNear = 70, x0 = -60, x1 = W + 60, seed = 1, col = '#120a16', rim = null,
          phones = 0, arms = 0, flow = 0, panic = 0, front = null, frontV = 800 } = o;
  const key = 'crowd' + seed + n + yFar + yNear;
  if (!massCrowd[key]) { const r = rng(seed), P = [];
    const Z = sNear / sFar, hor = (yFar * Z - yNear) / (Z - 1);
    for (let i = 0; i < n; i++) { const z = lerp(1, Z, r()); P.push([lerp(x0, x1, r()), hor + (yNear - hor) / z, sNear / z, r(), r()]); }
    P.sort((a, b) => a[1] - b[1]); massCrowd[key] = P; }
  const span = x1 - x0, body = [], flung = [];
  for (const [bx, y, s, a, b] of massCrowd[key]) {
    let x = bx;
    if (flow) x = x0 + ((((bx - x0) + flow * (s / sNear) * (0.7 + 0.6 * a) * t) % span) + span) % span;
    const bob = panic ? Math.sin(t * 11 + a * 60) * s * 0.06 * panic : 0;
    if (front !== null && x < front) { const fd = (front - x) / frontV; if (fd > 2.2) continue;
      flung.push([x + fd * 900 * (s / sNear) * (0.6 + a), y - (fd * 1300 - 700 * fd * fd) * (s / sNear) * (0.5 + b), s * 0.8, a]); continue; }
    body.push([x, y + bob, s, a, b]);
  }
  const fig = (c, x, y, s, a, b) => {
    c.moveTo(x + s * 0.14, y - s * 0.88); c.arc(x, y - s * 0.88, s * 0.14, 0, 6.283);
    c.moveTo(x + s * 0.21, y - s * 0.6); c.ellipse(x, y - s * 0.6, s * 0.21, s * 0.13, 0, 0, Math.PI, true); c.rect(x - s * 0.21, y - s * 0.6, s * 0.42, s * 0.6);
    if (b < arms) { c.rect(x - s * 0.24, y - s * 1.15, s * 0.08, s * 0.5); c.rect(x + s * 0.16, y - s * 1.15, s * 0.08, s * 0.5); }
  };
  for (let i0 = 0; i0 < body.length; i0 += 90) {
    const band = body.slice(i0, i0 + 90);
    ctx.fillStyle = col; ctx.beginPath(); for (const q of band) fig(ctx, ...q); ctx.fill();
    if (rim) { ctx.fillStyle = rim; ctx.beginPath();
      for (const [x, y, s] of band) { if (s < 14) continue; ctx.rect(x - s * 0.21, y - s * 0.68, s * 0.05, s * 0.5); }
      ctx.fill(); }
  }
  ctx.fillStyle = col; ctx.beginPath();
  for (const [x, y, s, a] of flung) { ctx.save(); ctx.translate(x, y); ctx.rotate(a * 20 + t * 6); ctx.rect(-s * 0.15, -s * 0.4, s * 0.3, s * 0.8); ctx.restore(); }
  ctx.fill();
  if (phones) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(200,235,255,0.95)'; ctx.beginPath();
    for (const [x, y, s, a] of body) if (a < phones) ctx.rect(x + s * 0.1, y - s * 1.12, s * 0.1, s * 0.14);
    ctx.fill();
    for (const [x, y, s, a] of body) if (a < phones * 0.35 && s > 50) glow(ctx, x + s * 0.15, y - s * 1.05, s * 0.5, '190,225,255', 0.35);
    ctx.restore(); }
}

// ================================================================ city skylines (destructible)
function bldBody(ctx, x, base, w, h, o, sB) {
  ctx.fillStyle = o.col; ctx.fillRect(x, base - h, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x + w * 0.76, base - h, w * 0.24, h);
  if (o.top) { ctx.fillStyle = o.top; ctx.fillRect(x, base - h, w, 3); }
  if (o.win) { const r = rng(sB), ws = o.ws || 7; ctx.fillStyle = o.win; ctx.beginPath();
    for (let wy = base - h + ws * 1.6; wy < base - ws * 1.5; wy += ws * 2.2) for (let wx = x + ws * 0.8; wx < x + w * 0.74 - ws; wx += ws * 1.8) if (r() < (o.winP || 0.4)) ctx.rect(wx, wy, ws, ws * 1.2);
    ctx.fill(); }
}
function cityLayer(ctx, t, o) {
  const { base, seed = 1, wMin = 50, wMax = 130, hMin = 150, hMax = 500, gap = 10, x0 = -80, x1 = W + 80, hit = null, dir = 1, fires = 0 } = o;
  const r = rng(seed); let x = x0;
  while (x < x1) {
    const w = lerp(wMin, wMax, r()), h = lerp(hMin, hMax, Math.pow(r(), 1.4)), sB = Math.floor(r() * 9999), rr = r(), hx = hit ? hit(x + w / 2) : 1e9, dt = t - hx;
    if (dt <= 0) bldBody(ctx, x, base, w, h, o, sB);
    else {
      const stump = h * (0.12 + 0.18 * rr), seg = (h - stump) / 3;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 2, base - stump, w + 4, stump + 2); ctx.clip(); bldBody(ctx, x, base, w, h, o, sB); ctx.restore();
      for (let c = 0; c < 3; c++) { const y0 = base - stump - (c + 1) * seg, mid = y0 + seg / 2;
        const dx = dir * dt * (220 + c * 160) * (0.7 + rr), dy = -dt * (90 + c * 70) + 420 * dt * dt, rot = dir * dt * (0.4 + c * 0.35) * (0.6 + rr);
        if (dy > 1400) continue;
        ctx.save(); ctx.translate(x + w / 2 + dx, mid + dy); ctx.rotate(rot); ctx.translate(-(x + w / 2), -mid);
        ctx.beginPath(); ctx.rect(x - 1, y0, w + 2, seg + 1); ctx.clip(); bldBody(ctx, x, base, w, h, o, sB); ctx.restore(); }
    }
    if (fires && rr < fires && dt <= 0) { const fy = base - h * (0.3 + 0.6 * ((sB % 7) / 7)); glow(ctx, x + w * 0.4, fy, w * 1.4, '255,120,40', 0.75 + 0.2 * Math.sin(t * 9 + sB));
      ctx.fillStyle = 'rgba(255,190,90,0.9)'; ctx.fillRect(x + w * 0.15, fy - 6, w * 0.5, 12); }
    x += w + gap * r();
  }
}

// ================================================================ globe with a molten front (real coastlines)
function gView(lon0, lat0) {
  const D = Math.PI / 180, l0 = lon0 * D, p0 = lat0 * D, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
  return (lon, lat) => { const l = lon * D - l0, p = lat * D, cp = Math.cos(p);
    return [cp * Math.sin(l), -(cp0 * Math.sin(p) - sp0 * cp * Math.cos(l)), sp0 * Math.sin(p) + cp0 * cp * Math.cos(l)]; };
}
const wvec = (lon, lat) => { const D = Math.PI / 180, cp = Math.cos(lat * D); return [cp * Math.sin(lon * D), Math.sin(lat * D), cp * Math.cos(lon * D)]; };
let _MAG = null;
function magTex() {
  if (_MAG) return _MAG; const w = 720, h = 360, m = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const lon = (i / w) * 6.283, lat = (0.5 - j / h) * Math.PI, c = Math.cos(lat);
    const x = c * Math.sin(lon) * 2.2, y = Math.sin(lat) * 2.2, z = c * Math.cos(lon) * 2.2;
    const n = fbm(x, y, z, 5), rdg = 1 - Math.abs(fbm(x * 2.1 + 7, y * 2.1, z * 2.1, 3)) * 2.2;
    m[j * w + i] = R2(0.5 + n * 0.9) * 0.5 + R2(rdg) * 0.5; }
  _MAG = { w, h, m }; return _MAG;
}
function burnGlobe(ctx, cx, cy, R, o = {}) {
  const { lon0 = 20, lat0 = 15, imp = [15, 22], ang = 0, t = 0, sun = SUN } = o;
  const D = Math.PI / 180, l0 = lon0 * D, p0 = lat0 * D, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
  const [ix, iy, iz] = wvec(imp[0], imp[1]), molten = R2(ang / 2.4);
  const hc = molten > 0.45 ? '255,130,50' : '120,180,255';
  const halo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.25);
  halo.addColorStop(0, `rgba(${hc},0.6)`); halo.addColorStop(0.35, `rgba(${hc},0.2)`); halo.addColorStop(1, `rgba(${hc},0)`);
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 6.283); ctx.fill();
  const tex = texFor('burn', R, 760), N = tex.width, tc = tex.getContext('2d'), img = tc.createImageData(N, N), d = img.data, LM = landMap(), MG = magTex();
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = (i + 0.5) / N * 2 - 1, y = (j + 0.5) / N * 2 - 1, rr = x * x + y * y, k = (j * N + i) * 4;
    if (rr > 1) { d[k + 3] = 0; continue; }
    const z = Math.sqrt(1 - rr), wy = -y * cp0 + z * sp0, wz = y * sp0 + z * cp0;
    const lat = Math.asin(R2(wy, -1, 1)), lon = Math.atan2(x, wz) + l0, cl = Math.cos(lat);
    const px = cl * Math.sin(lon), py = wy, pz = cl * Math.cos(lon);
    const dd = Math.acos(R2(px * ix + py * iy + pz * iz, -1, 1));
    const L = Math.max(0, x * sun[0] + y * sun[1] + z * sun[2]), amb = 0.1 + 0.9 * Math.pow(L, 0.8);
    let lonw = lon / D; lonw = ((lonw + 180) % 360 + 360) % 360;
    const cov = LM.m[Math.min(LM.h - 1, Math.floor((90 - lat / D) / 180 * LM.h)) * LM.w + Math.floor(lonw / 360 * LM.w) % LM.w];
    const nz = Math.sin(px * 31) * Math.sin(pz * 27 + py * 13);
    let r, g, b;
    if (cov > 0.5) { const al = Math.abs(lat / D);
      if (al > 66) { r = 225; g = 232; b = 240; } else if (al > 14 && al < 33) { r = 190 + nz * 14; g = 160 + nz * 12; b = 108; } else { r = 64 + nz * 12; g = 112 + nz * 16; b = 58; } }
    else { r = 16; g = 62 + nz * 6; b = 128 + nz * 8; }
    r *= amb; g *= amb; b *= amb;
    if (ang > 0 && dd < ang) {
      const age = ang - dd, mi = Math.floor((((lonw + t * 3) % 360) / 360) * MG.w) % MG.w, mj = Math.min(MG.h - 1, Math.floor((90 - lat / D) / 180 * MG.h));
      const n0 = MG.m[mj * MG.w + mi], n = R2(n0 + 0.05 * Math.sin(t * 2.2 + n0 * 30));
      const hot = Math.pow(R2((n - 0.35 + 0.25 * R2(1 - age * 0.6)) / 0.55), 2.2), e = 0.85 + 0.15 * amb;
      r = lerp(70, 255, Math.sqrt(hot)) * e; g = lerp(18, 225, hot * hot) * e + lerp(0, 60, hot) * e * (1 - hot); b = lerp(12, 120, Math.pow(hot, 4)) * e;
      if (age < 0.05) { const q = 1 - age / 0.05; r = lerp(r, 255, q); g = lerp(g, 240, q); b = lerp(b, 200, q); }
    } else if (ang > 0 && dd < ang + 0.3) { const q = 1 - (dd - ang) / 0.3; r = r * (1 - 0.7 * q) + 90 * q; g *= 1 - 0.75 * q; b *= 1 - 0.8 * q; }
    d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = 255;
  }
  tc.putImageData(img, 0, 0); ctx.drawImage(tex, cx - R, cy - R, 2 * R, 2 * R);
}
const CITIES = [['Tokyo', 139.7, 35.7, 37], ['Delhi', 77.2, 28.6, 33], ['Shanghai', 121.5, 31.2, 29], ['Dhaka', 90.4, 23.8, 23], ['São Paulo', -46.6, -23.5, 22],
  ['Cairo', 31.2, 30.0, 22], ['Mexico City', -99.1, 19.4, 22], ['Beijing', 116.4, 39.9, 22], ['Mumbai', 72.9, 19.1, 21], ['Osaka', 135.5, 34.7, 19],
  ['Karachi', 67.0, 24.9, 18], ['New York', -74.0, 40.7, 19], ['Kinshasa', 15.3, -4.3, 17], ['Lagos', 3.4, 6.5, 16], ['Istanbul', 29.0, 41.0, 16],
  ['Kolkata', 88.4, 22.6, 15], ['Manila', 121.0, 14.6, 15], ['Buenos Aires', -58.4, -34.6, 15], ['Lahore', 74.3, 31.5, 14], ['Moscow', 37.6, 55.8, 13],
  ['Los Angeles', -118.2, 34.0, 12], ['Paris', 2.35, 48.9, 11], ['Jakarta', 106.8, -6.2, 11], ['Bangkok', 100.5, 13.8, 11], ['Seoul', 127.0, 37.5, 10],
  ['London', -0.13, 51.5, 9.6], ['Tehran', 51.4, 35.7, 9.5], ['Luanda', 13.2, -8.8, 9.3], ['Riyadh', 46.7, 24.7, 7.9], ['Baghdad', 44.4, 33.3, 7.7],
  ['Madrid', -3.7, 40.4, 6.8], ['Khartoum', 32.5, 15.5, 6.3], ['Johannesburg', 28.0, -26.2, 6.2], ['Addis Ababa', 38.7, 9.0, 5.5], ['Nairobi', 36.8, -1.3, 5.3],
  ['Rome', 12.5, 41.9, 4.3], ['Berlin', 13.4, 52.5, 3.6], ['Dubai', 55.3, 25.2, 3.5], ['Athens', 23.7, 38.0, 3.2], ['Algiers', 3.1, 36.8, 3.0],
  ['Kano', 8.5, 12.0, 4.6], ['Abidjan', -4.0, 5.3, 5.9], ['Dakar', -17.4, 14.7, 3.5], ['Casablanca', -7.6, 33.6, 3.8], ['Tripoli', 13.2, 32.9, 1.2]];
function cityLights(ctx, cx, cy, R, o) {
  const { lon0, lat0, imp, ang, labels = true } = o, v = gView(lon0, lat0), I = wvec(imp[0], imp[1]);
  const pending = [];
  for (const [name, lon, lat, pop] of CITIES) {
    const [vx, vy, vz] = v(lon, lat); if (vz < 0.1) continue;
    const sx = cx + vx * R, sy = cy + vy * R, w = wvec(lon, lat), dd = Math.acos(R2(w[0] * I[0] + w[1] * I[1] + w[2] * I[2], -1, 1)), sz = 2 + Math.sqrt(pop) * 1.1;
    if (dd > ang) { glow(ctx, sx, sy, sz * 4.5, '255,225,170', 0.55 * vz); ctx.fillStyle = '#fff6e0'; ctx.beginPath(); ctx.arc(sx, sy, sz * 0.6, 0, 6.283); ctx.fill(); }
    else if (ang - dd < 0.26) { const k = (ang - dd) / 0.26; glow(ctx, sx, sy, sz * (6 + 14 * k), '255,240,200', 0.9 * (1 - k));
      if (labels && pop >= 5) pending.push([name, pop, sx, sy, k]); }
  }
  ctx.save(); ctx.font = `800 30px ${FONT}`; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  for (const [name, pop, sx, sy, k] of pending) { const a = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85, ty = sy - 24 - k * 30;
    ctx.globalAlpha = a; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(20,6,6,0.85)'; const s = `${name.toUpperCase()}  ${pop}M`; ctx.strokeText(s, sx, ty); ctx.fillStyle = '#ffffff'; ctx.fillText(s, sx, ty); }
  ctx.restore();
}

// ================================================================ the impactor (shaded, not outlined)
function rogue2(ctx, x, y, r, heat = 0) {
  if (heat > 0) glow(ctx, x, y, r * 2.0, '255,120,60', 0.3 * heat);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r);
  g.addColorStop(0, '#e29a6a'); g.addColorStop(0.55, '#b0583a'); g.addColorStop(1, '#3a1510');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.clip();
  const rr = rng(21);
  for (let i = 0; i < 22; i++) { const a = rr() * 6.283, dd = Math.sqrt(rr()) * r * 0.9, s2 = r * (0.03 + rr() * 0.1), cx2 = x + Math.cos(a) * dd, cy2 = y + Math.sin(a) * dd;
    ctx.fillStyle = 'rgba(70,24,14,0.35)'; ctx.beginPath(); ctx.arc(cx2, cy2, s2, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(255,200,160,0.18)'; ctx.lineWidth = Math.max(1, s2 * 0.15); ctx.beginPath(); ctx.arc(cx2, cy2, s2, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke(); }
  ctx.fillStyle = 'rgba(160,60,30,0.25)'; ctx.fillRect(x - r, y - r * 0.15, 2 * r, r * 0.18);
  ctx.restore();
}
function bgSky(ctx, stops) { ctx.fillStyle = grad(ctx, stops); ctx.fillRect(0, 0, W, H); }

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.08, W / 2, 1200);
  globe(ctx, W / 2 - 100, 1300, 330, { lon0: -10 + u * 4, lat0: 15, t: u, ink: false });
  const k = easeInOut(prog(u, 0.1, 3.4));
  rogue2(ctx, lerp(W + 120, W / 2 + 260, k), lerp(200, 800, k), lerp(30, 175, k), k);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.5 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if a planet', 'the size of Mars', 'hit Earth?'], 300, 0.15, { size: 88, out: OUT('hook'), mark: { line: 1, from: 12, to: 16, color: '#ff6b5b' } });
}

// ================================================================ 2. the last night: a plaza of thousands
function vCrowd(ctx, u) {
  const p = prog(u, 0, 4);
  bgSky(ctx, ['#120a24', '#3a1634', '#a8443a', '#f09a5a']);
  drift(ctx, u, 0, 4, 1.0, 1.06, W / 2, 1000);
  rogue2(ctx, W / 2 + 40, 470, lerp(480, 600, p), 1);
  cityLayer(ctx, u, { base: 1230, seed: 3, hMin: 90, hMax: 380, wMin: 40, wMax: 110, gap: 6, col: '#3a1c34', win: 'rgba(255,205,150,0.55)', winP: 0.3, ws: 5 });
  cityLayer(ctx, u, { base: 1290, seed: 4, hMin: 140, hMax: 560, wMin: 60, wMax: 150, gap: 14, col: '#22121f', win: 'rgba(255,210,160,0.7)', winP: 0.35, ws: 7, top: 'rgba(255,150,100,0.5)' });
  ctx.fillStyle = grad(ctx, ['#4a2232', '#7a3a3a', '#a85a44'], 0, 1260, 0, H); ctx.fillRect(0, 1270, W, H);
  massCrowd(ctx, u, { n: 2200, yFar: 1290, yNear: 2150, sFar: 7, sNear: 190, seed: 5, col: '#0d070d', rim: 'rgba(255,140,90,0.55)', phones: 0.22, arms: 0.06 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['After weeks of warnings,', '8 billion people watch'], 230, 0.15, { size: 72, out: OUT('crowd') });
  say(ctx, u, ['it fill the sky.'], 450, 1.0, { size: 96, out: OUT('crowd'), color: C.yellow });
}

// ================================================================ 3. the ocean heaves into the sky; the city flees
function vTide(ctx, u) {
  const p = easeInOut(prog(u, 0.1, 3.6));
  bgSky(ctx, ['#160a22', '#5a1e36', '#c85a3a', '#f4ac70']);
  drift(ctx, u, 0, 4, 1.0, 1.05, W / 2, 1300);
  rogue2(ctx, W / 2 + 80, 180, 560, 1);
  const base = 1180, peak = lerp(base - 40, 360, p), hump = x => { const dx = (x - W / 2 - 40) / 520; return base - (base - peak) * Math.exp(-dx * dx); };
  ctx.fillStyle = grad(ctx, ['#9adcff', '#2f8ad8', '#0e3e7a', '#082650'], 0, peak, 0, base + 60);
  ctx.beginPath(); ctx.moveTo(-40, base + 200); for (let x = -40; x <= W + 40; x += 16) ctx.lineTo(x, hump(x) + Math.sin(x * 0.02 + u * 3) * 6); ctx.lineTo(W + 40, base + 200); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(220,245,255,0.25)'; ctx.lineWidth = 3;
  for (let k = 1; k < 9; k++) { ctx.beginPath(); for (let x = -40; x <= W + 40; x += 20) { const yy = hump(x) + k * 22 * (1 + k * 0.15) + Math.sin(x * 0.015 + k + u * 2) * 8; x === -40 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
  ctx.restore();
  glow(ctx, W / 2 + 40, peak + 40, 260, '230,250,255', 0.35 * p);
  cityLayer(ctx, u, { base: 1260, seed: 7, hMin: 80, hMax: 330, wMin: 40, wMax: 100, gap: 8, col: '#24142a', win: 'rgba(255,210,150,0.6)', winP: 0.3, ws: 5 });
  cityLayer(ctx, u, { base: 1430, seed: 8, hMin: 160, hMax: 620, wMin: 70, wMax: 160, gap: 18, col: '#160c18', win: 'rgba(255,215,160,0.75)', winP: 0.35, ws: 8, top: 'rgba(255,140,90,0.45)' });
  ctx.fillStyle = grad(ctx, ['#3a1c2a', '#6a3236', '#9a5440'], 0, 1420, 0, H); ctx.fillRect(0, 1430, W, H);
  massCrowd(ctx, u, { n: 2000, yFar: 1440, yNear: 2150, sFar: 9, sNear: 180, seed: 9, col: '#0b060b', rim: 'rgba(255,150,100,0.5)', flow: 220, panic: 1, arms: 0.12 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['In the final hour,', 'its gravity heaves', 'the ocean into the sky'], 230, 0.15, { size: 76, out: OUT('tide') });
}

// ================================================================ 4. impact, seen from space (to scale)
const IMP = [15, 22];
function vImpact(ctx, u) {
  const hit = 1.0, R = 470, cx = W / 2 - 40, cy = 1180, lon0 = -15, lat0 = 5;
  const [sx, sy] = shakeOffset(u, hit, 2.5, 26); space(ctx, u); ctx.translate(sx, sy);
  const ang = 0.34 * easeOut(prog(u, hit, 4.5));
  burnGlobe(ctx, cx, cy, R, { lon0, lat0, imp: IMP, ang, t: u });
  cityLights(ctx, cx, cy, R, { lon0, lat0, imp: IMP, ang, labels: false });
  const [vx, vy] = gView(lon0, lat0)(IMP[0], IMP[1]), Px = cx + vx * R, Py = cy + vy * R, m = Math.hypot(vx, vy), dx = vx / m, dy = vy / m, Rr = 0.53 * R;
  if (u < hit + 1.2) { const a = easeIn2(prog(u, 0, hit)), sink = easeIn2(prog(u, hit, hit + 1.2));
    const x = lerp(Px + dx * R * 2.6, Px + dx * Rr * 0.55, a) - dx * Rr * 0.5 * sink, y = lerp(Py + dy * R * 2.6, Py + dy * Rr * 0.55, a) - dy * Rr * 0.5 * sink;
    ctx.save(); ctx.globalAlpha = 1 - sink; rogue2(ctx, x, y, Rr * (1 - 0.5 * sink), a); ctx.restore(); }
  if (u > hit) { const dt = u - hit, r = rng(31);   // ejecta curtain
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 700; i++) { const th = Math.atan2(dy, dx) + (r() - 0.5) * 2.6, sp = 150 + r() * 650, lag = r() * 0.6, tt = dt - lag; if (tt <= 0) continue;
      const x = Px + Math.cos(th) * sp * tt + dx * 0 , y = Py + Math.sin(th) * sp * tt + 120 * tt * tt * (1 - Math.abs(Math.sin(th)));
      const fade = R2(1 - tt / 3.2); if (fade <= 0) continue;
      ctx.fillStyle = `rgba(255,${150 + r() * 90},${60 + r() * 60},${0.8 * fade})`; ctx.fillRect(x, y, 3 + r() * 5, 3 + r() * 5); }
    ctx.restore();
    glow(ctx, Px, Py, 200 + 500 * R2(dt / 1.5), '255,220,160', 0.9 * Math.exp(-dt * 0.8)); }
  flash(ctx, u, hit, 0.45);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Mars is half', 'Earth’s width'], 230, 0.1, { size: 80, out: 0.9 });
  bigNum(ctx, u, 'IMPACT', 330, 1.05, { size: 170, out: 2.5 });
  say(ctx, u, ['at 40,000 km/h'], 490, 1.3, { size: 72, weight: 900, out: 2.5, x: W / 2, align: 'center' });
  bigNum(ctx, u, '100,000,000×', 330, 2.65, { size: 118, out: OUT('impact') });
  say(ctx, u, ['the energy of the', 'dinosaur asteroid'], 470, 2.8, { size: 64, weight: 900, out: OUT('impact'), x: W / 2, align: 'center' });
}
function bigNum(ctx, t, text, y, at, o = {}) {
  const { size = 140, color = C.yellow, out = 1e9 } = o;
  if (t < at || t > out + 0.3) return;
  const p = prog(t, at, at + 0.3), s2 = lerp(1.25, 1, easeOut(p)), e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e * R2(p * 2); ctx.translate(W / 2, y); ctx.scale(s2, s2);
  ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30; ctx.fillStyle = color; ctx.fillText(text, 0, 0);
  ctx.restore();
}

// ================================================================ 5. continents scoured; megacities wiped out
function vGlobe(ctx, u) {
  space(ctx, u);
  const e = easeInOut(prog(u, 0, 4.9)), R = 600, cx = W / 2, cy = 1130, lon0 = lerp(-15, 60, e), lat0 = 18, ang = lerp(0.34, 2.7, easeIn2(prog(u, 0, 4.9)) * 0.6 + prog(u, 0, 4.9) * 0.4);
  const [sx, sy] = shakeOffset(u, 0, 5, 6); ctx.translate(sx, sy);
  burnGlobe(ctx, cx, cy, R, { lon0, lat0, imp: IMP, ang, t: u });
  cityLights(ctx, cx, cy, R, { lon0, lat0, imp: IMP, ang });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Within hours, molten', 'rock buries every', 'continent on Earth'], 230, 0.15, { size: 72, out: OUT('globe') });
}

// ================================================================ 6. the blast wave flattens a city
function vBlast(ctx, u) {
  const t0 = 0.3, span = 3.4, front = -300 + 2500 * Math.pow(prog(u, t0, t0 + span), 1.25);
  const hit = x => t0 + span * Math.pow(R2((x + 300) / 2500), 0.8);
  const [sx, sy] = shakeOffset(u, 0.6, 3.8, 18);
  bgSky(ctx, ['#240c18', '#7a2426', '#e0683a', '#ffbe80']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1170, seed: 11, hMin: 120, hMax: 420, wMin: 40, wMax: 110, gap: 6, col: '#6a3040', hit, top: 'rgba(255,190,140,0.5)' });
  cityLayer(ctx, u, { base: 1320, seed: 12, hMin: 220, hMax: 640, wMin: 60, wMax: 140, gap: 10, col: '#3a1c2c', win: 'rgba(255,205,150,0.6)', winP: 0.35, ws: 6, hit, top: 'rgba(255,170,120,0.5)' });
  cityLayer(ctx, u, { base: 1500, seed: 13, hMin: 380, hMax: 950, wMin: 110, wMax: 220, gap: 18, col: '#1c1020', win: 'rgba(255,215,160,0.75)', winP: 0.4, ws: 10, hit, top: 'rgba(255,150,100,0.5)' });
  ctx.fillStyle = grad(ctx, ['#4a2228', '#8a4234', '#b8643e'], 0, 1490, 0, H); ctx.fillRect(-60, 1500, W + 120, H);
  massCrowd(ctx, u, { n: 1700, yFar: 1510, yNear: 2150, sFar: 12, sNear: 170, seed: 14, col: '#0b060b', rim: 'rgba(255,150,100,0.55)', flow: 120, panic: 1, arms: 0.2, front, frontV: 700 });
  // debris storm
  const r = rng(15); ctx.fillStyle = 'rgba(30,14,18,0.9)'; ctx.beginPath();
  for (let i = 0; i < 500; i++) { const x0 = r() * W, y0 = 700 + r() * 800, dt = u - hit(x0), s = 4 + r() * 16; if (dt <= 0 || dt > 2.5) continue;
    ctx.rect(x0 + dt * (500 + r() * 900), y0 - dt * (200 + r() * 500) + 300 * dt * dt, s, s * (0.5 + r())); }
  ctx.fill();
  // dust/fire front
  if (front > -300) {
    ctx.fillStyle = 'rgba(170,90,60,0.55)'; ctx.fillRect(-80, 0, front - 80, H + 100);
    const rr = rng(16); for (let i = 0; i < 16; i++) { const yy = i * 130, br = 130 + rr() * 90 + Math.sin(u * 5 + i) * 25;
      const g2 = ctx.createRadialGradient(front - 140, yy, 0, front - 140, yy, br); g2.addColorStop(0, 'rgba(255,200,140,0.55)'); g2.addColorStop(1, 'rgba(160,80,50,0)');
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(front - 140, yy, br, 0, 6.283); ctx.fill(); }
    glow(ctx, front - 60, 1300, 500, '255,210,150', 0.45);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The blast wave', 'flattens every city', 'on the planet'], 230, 0.15, { size: 80, out: OUT('blast') });
}

// ================================================================ 7. molten rock rains on a fleeing city
function vRain(ctx, u) {
  bgSky(ctx, ['#07040c', '#240a14', '#621a18', '#a8401e']);
  const [sx, sy] = shakeOffset(u, 0.8, 3.7, 12); ctx.translate(sx, sy);
  const r = rng(17), strikes = [];
  for (let i = 0; i < 46; i++) { const x1 = r() * W, y1 = 1150 + r() * 300, at = r() * 3.6, dur = 0.6 + r() * 0.5;
    fireball(ctx, u, x1 + 400 + r() * 300, -200, x1, y1, at, dur, 0.5 + r() * 0.8); strikes.push([x1, y1, at + dur]); }
  cityLayer(ctx, u, { base: 1260, seed: 18, hMin: 100, hMax: 400, wMin: 40, wMax: 110, gap: 6, col: '#2a1020', win: 'rgba(255,150,80,0.6)', winP: 0.3, ws: 5, fires: 0.25 });
  for (const [x, y, at] of strikes) if (u > at) { const dt = u - at;
    glow(ctx, x, y, 120 + 240 * R2(dt), '255,170,80', 0.9 * Math.exp(-dt * 0.9));
    for (let k = 0; k < 6; k++) { const yy = y - k * 70 * R2(dt * 0.8) * 1.6; ctx.fillStyle = `rgba(40,16,18,${0.45 - k * 0.06})`; ctx.beginPath(); ctx.arc(x + Math.sin(k + u) * 20, yy, 40 + k * 18 * R2(dt), 0, 6.283); ctx.fill(); } }
  cityLayer(ctx, u, { base: 1470, seed: 19, hMin: 260, hMax: 800, wMin: 90, wMax: 190, gap: 16, col: '#170a14', win: 'rgba(255,170,90,0.7)', winP: 0.35, ws: 9, fires: 0.35, top: 'rgba(255,120,70,0.5)' });
  ctx.fillStyle = grad(ctx, ['#4a1814', '#8a3018', '#c0501e'], 0, 1460, 0, H); ctx.fillRect(-60, 1470, W + 120, H);
  massCrowd(ctx, u, { n: 1900, yFar: 1480, yNear: 2150, sFar: 10, sNear: 180, seed: 20, col: '#090406', rim: 'rgba(255,130,60,0.65)', flow: -260, panic: 1, arms: 0.15 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Molten rock rains', 'down everywhere'], 230, 0.15, { size: 84, out: OUT('rain') });
  say(ctx, u, ['falling back at meteor speeds'], 430, 0.9, { size: 52, weight: 800, out: OUT('rain') });
}

// ================================================================ 8. the oceans boil away
function vBoil(ctx, u) {
  bgSky(ctx, ['#14080e', '#4a1618', '#b8482a', '#f09a5a']);
  drift(ctx, u, 0, 4, 1.0, 1.05, W / 2, 1200);
  const hz = 1000;
  cityLayer(ctx, u, { base: hz + 4, seed: 21, x0: 620, x1: W + 80, hMin: 40, hMax: 160, wMin: 20, wMax: 50, gap: 4, col: '#2a0e16', fires: 0.4 });
  ctx.fillStyle = grad(ctx, ['#3a2a3a', '#1a2a48', '#0a1a30'], 0, hz, 0, H); ctx.fillRect(0, hz, W, H);
  const r = rng(22);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 260; i++) { const q = r(), y = hz + 10 + q * q * 900, x = r() * W, ph = (((u * (1.5 + r() * 2) + r()) % 1) + 1) % 1, s = (4 + q * 30) * (0.3 + ph);
    ctx.strokeStyle = `rgba(255,190,140,${0.5 * (1 - ph)})`; ctx.lineWidth = 1 + q * 3; ctx.beginPath(); ctx.ellipse(x, y, s * 1.8, s * 0.5, 0, 0, 6.283); ctx.stroke(); }
  ctx.restore();
  [[160, 1080, 0.55, 0.8], [760, 1180, 0.9, 1.4], [420, 1420, 1.5, 0.5]].forEach(([x, y, s, at]) => { const k = easeIn2(R2((u - at) / 3.2));
    ctx.save(); ctx.beginPath(); ctx.rect(-100, 0, W + 200, y + 10 * s); ctx.clip(); tanker(ctx, x, y + k * 160 * s, s, 0.25 * k * (x > 500 ? -1 : 1), u); ctx.restore(); });
  for (let i = 0; i < 14; i++) { const q = (i % 5) / 4, x = (i * 173) % W, y0 = hz + 20 + q * 600, h = 900 + q * 500, s = 0.6 + q;
    for (let k = 0; k < 9; k++) { const f = ((k / 9) + u * 0.18) % 1, yy = y0 - f * h, rad = (40 + f * 160) * s;
      const g2 = ctx.createRadialGradient(x, yy, 0, x, yy, rad); g2.addColorStop(0, `rgba(255,230,210,${0.32 * (1 - f)})`); g2.addColorStop(1, 'rgba(255,200,170,0)');
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x + Math.sin(u + k + i) * 30 * s, yy, rad, 0, 6.283); ctx.fill(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The oceans', 'boil away'], 230, 0.15, { size: 96, out: OUT('boil') });
  say(ctx, u, ['That takes under 0.01%', 'of the impact’s energy'], 1640, 1.0, { size: 60, weight: 900, out: OUT('boil'), mark: { line: 0, from: 11, to: 22, color: '#ff6b5b' } });
}

function tanker(ctx, x, y, s, rot, u) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#120a10'; ctx.beginPath(); ctx.moveTo(-230, -40); ctx.lineTo(240, -40); ctx.lineTo(200, 10); ctx.lineTo(-215, 10); ctx.closePath(); ctx.fill();
  ctx.fillRect(-200, -62, 300, 22); ctx.fillRect(130, -120, 70, 80); ctx.fillRect(160, -150, 14, 30);
  ctx.fillStyle = 'rgba(255,200,140,0.9)'; for (let i = 0; i < 4; i++) ctx.fillRect(140 + i * 14, -108, 7, 7);
  ctx.fillStyle = 'rgba(255,120,60,0.7)'; ctx.fillRect(-230, -42, 470, 3);
  glow(ctx, 160, -100, 60, '255,180,120', 0.35);
  ctx.restore();
}
// ================================================================ 9. the sky turns to rock vapour over a jammed highway
function vSky(ctx, u) {
  const vy = 1050, yF = lerp(-300, 1080, easeIn2(prog(u, 0.1, 2.75))), lit = R2((u - 2.75) / 0.4);
  bgSky(ctx, ['#0c0508', '#2a0c10', '#5a1a16']);
  // incandescent vapour layer descending
  const g = ctx.createLinearGradient(0, yF - 900, 0, yF); g.addColorStop(0, '#ff7a20'); g.addColorStop(0.75, '#ffd27a'); g.addColorStop(1, '#fff6e0');
  ctx.fillStyle = g; ctx.fillRect(0, -10, W, yF + 10);
  ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#b83a10';
  for (let i = 0; i < 10; i++) { const yy = yF - 80 - i * 95, ph = u * (0.6 + i * 0.1) + i; ctx.beginPath(); ctx.moveTo(0, yy);
    for (let x = 0; x <= W; x += 30) ctx.lineTo(x, yy + Math.sin(x * 0.006 + ph) * 26 + Math.sin(x * 0.017 - ph) * 12); ctx.lineTo(W, yy - 40); ctx.lineTo(0, yy - 40); ctx.fill(); }
  ctx.restore(); glow(ctx, W / 2, yF, 900, '255,230,180', 0.5);
  cityLayer(ctx, u, { base: vy + 6, seed: 23, hMin: 30, hMax: 140, wMin: 18, wMax: 46, gap: 3, col: lit > 0 ? '#ff8a3a' : '#1c0c10' });
  ctx.fillStyle = lit > 0 ? `rgb(${lerp(26, 120, lit)},${lerp(10, 40, lit)},10)` : '#1a0a0c'; ctx.fillRect(0, vy, W, H);
  ctx.fillStyle = lit > 0 ? `rgb(${lerp(36, 90, lit)},${lerp(30, 30, lit)},26)` : '#241a1c'; ctx.beginPath(); ctx.moveTo(W / 2 - 40, vy); ctx.lineTo(W / 2 + 40, vy); ctx.lineTo(W + 900, H); ctx.lineTo(-900, H); ctx.fill();
  // thousands of cars, gridlocked
  const cars = [];
  for (let lane = -4; lane < 4; lane++) for (let z = 1.15; z < 42; z *= 1.045) { const s = 1 / z, jit = ((lane * 7 + Math.floor(z * 37)) % 5) / 5;
    cars.push([W / 2 + (lane + 0.5) * 230 * s, vy + 900 * s, s, lane < 0, jit]); }
  cars.sort((a, b) => a[1] - b[1]);
  for (const [x, y, s, toward, jit] of cars) { const w = 150 * s, h = 70 * s;
    ctx.fillStyle = '#0a0608'; ctx.fillRect(x - w / 2, y - h, w, h);
    if (lit > 0) { glow(ctx, x, y - h / 2, w * 1.2, '255,140,40', 0.7 * lit); continue; }
    ctx.fillStyle = toward ? '#fff8e0' : '#ff2a20'; const lw2 = Math.max(1.5, 16 * s);
    ctx.fillRect(x - w * 0.42, y - h * 0.55, lw2, lw2 * 0.7); ctx.fillRect(x + w * 0.42 - lw2, y - h * 0.55, lw2, lw2 * 0.7);
    if (s > 0.08) glow(ctx, x, y - h * 0.5, w * 0.9, toward ? '255,240,200' : '255,60,40', 0.25); }
  massCrowd(ctx, u, { n: 900, yFar: vy + 20, yNear: 2000, sFar: 4, sNear: 70, x0: -80, x1: 160, seed: 24, col: '#0a0507', flow: -60, panic: 1, arms: 0.3 });
  massCrowd(ctx, u, { n: 900, yFar: vy + 20, yNear: 2000, sFar: 4, sNear: 70, x0: W - 160, x1: W + 80, seed: 25, col: '#0a0507', flow: 60, panic: 1, arms: 0.3 });
  if (lit > 0) { ctx.fillStyle = `rgba(255,150,60,${0.35 * lit})`; ctx.fillRect(0, 0, W, H); }
  flash(ctx, u, 2.75, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The sky fills with', 'vaporized rock'], 230, 0.15, { size: 88, out: 2.6 });
  say(ctx, u, ['Thousands of degrees.', 'Everything burns.'], 230, 2.85, { size: 84, out: OUT('sky') });
}

// ================================================================ 10. the toll
function vToll(ctx, u) {
  space(ctx, u);
  burnGlobe(ctx, W / 2, 1210, 450, { lon0: 100 + u * 6, lat0: 15, imp: IMP, ang: 3.3, t: u });
  const n = Math.round(8200000000 * easeOut(prog(u, 0.5, 2.6)));
  say(ctx, u, ['Within a day (est.):'], 470, 0.15, { size: 72, x: W / 2, align: 'center', out: OUT('toll') });
  bigNum(ctx, u, n.toLocaleString('en-US'), 600, 0.4, { size: 118, color: '#ff6b5b', out: OUT('toll') });
  say(ctx, u, ['Everyone.'], 790, 2.6, { size: 120, x: W / 2, align: 'center', out: OUT('toll') });
  say(ctx, u, ['No bunker is deep enough:', 'the crust melts hundreds of km down'], 1760, 3.0, { size: 46, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 11. magma world -> ring -> new moon
function vMoon(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1150);
  const cx = W / 2, cy = 1150, R = 300, form = prog(u, 0.6, 2.0), clump = easeInOut(prog(u, 2.6, 4.3));
  const r = rng(9), target = 0.6 + u * 0.5;
  const debris = back => { for (let i = 0; i < 1600; i++) { const a0 = r() * 6.283, a = a0 + u * 0.5 * (0.8 + r() * 0.4), rr = 420 + r() * 260;
    if ((Math.sin(a) < 0) !== back) continue;
    const ang = lerp(a, target + (a0 - Math.PI) * 0.05, clump), rad = lerp(rr, 560, clump);
    ctx.fillStyle = `rgba(255,${150 + r() * 80},${80 + r() * 60},${(0.5 + r() * 0.5) * form})`; ctx.fillRect(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 0.28, 2 + r() * 3, 2 + r() * 3); } };
  debris(true); burnGlobe(ctx, cx, cy, R, { lon0: u * 8, lat0: 15, imp: IMP, ang: 3.3, t: u }); debris(false);
  if (clump > 0.6) { const mx = cx + Math.cos(target) * 560, my = cy + Math.sin(target) * 560 * 0.28; ctx.save(); ctx.globalAlpha = (clump - 0.6) / 0.4; moonFx(ctx, mx, my, 50, { sun: SUN, crack: 1.2 }); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Earth is now a', 'ball of magma'], 230, 0.15, { size: 88, out: 1.6 });
  say(ctx, u, ['Its debris spins', 'into a ring…'], 230, 1.75, { size: 88, out: 3.0 });
  say(ctx, u, ['…that clumps into', 'a new moon'], 230, 3.15, { size: 88, out: OUT('moon'), mark: { line: 1, from: 0, to: 10, color: '#3a86ff' } });
}

// ================================================================ 12. millions of years: rain, oceans return
function vCool(ctx, u) {
  space(ctx, u);
  const k = easeInOut(prog(u, 0.2, 3.6)), cx = W / 2, cy = 1150, R = 420;
  ctx.save(); ctx.globalAlpha = 1 - k; burnGlobe(ctx, cx, cy, R, { lon0: 40 + u * 5, lat0: 15, imp: IMP, ang: 3.3, t: u }); ctx.restore();
  ctx.save(); ctx.globalAlpha = k; globe(ctx, cx, cy, R, { lon0: 40 + u * 5, lat0: 15, t: u, ink: false }); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, 6.283); ctx.clip();
  ctx.strokeStyle = `rgba(200,225,255,${0.55 * Math.sin(Math.PI * k)})`; ctx.lineWidth = 2;
  const r = rng(4); for (let i = 0; i < 160; i++) { const x = cx + (r() - 0.5) * R * 2.4, y = (cy - R * 1.2 + ((u * 900 + r() * 1000) % (R * 2.4))); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 36); ctx.stroke(); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Over millions of years,', 'it cools… and rains…'], 230, 0.15, { size: 76, out: 1.9 });
  say(ctx, u, ['…and the oceans', 'come back.'], 230, 2.0, { size: 88, out: OUT('cool') });
}

// ================================================================ 13. the twist
function vTwist(ctx, u) {
  space(ctx, u);
  if (u < 2.6) {
    burnGlobe(ctx, W / 2 - 80, 1200, 300, { lon0: u * 10, lat0: 10, imp: IMP, ang: 3.3, t: u });
    const k = easeInOut(prog(u, 0.1, 2.6)), tx = lerp(W + 100, W / 2 + 150, k), ty = lerp(600, 1060, k);
    rogue2(ctx, tx, ty, 160, 1);
    ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#ffb0a0'; ctx.fillText('THEIA', tx, ty - 195); ctx.shadowBlur = 0;
  } else {
    globe(ctx, W / 2 - 60, 1250, 330, { lon0: u * 4, lat0: 15, t: u, ink: false });
    moonFx(ctx, W / 2 + 300, 760, 110, { sun: SUN });
  }
  flash(ctx, u, 2.6, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Plot twist:', 'this already happened.'], 230, 0.15, { size: 84, out: 2.5, mark: { line: 1, from: 5, to: 20, color: '#ff6b5b' } });
  say(ctx, u, ['4.5 billion years ago, Theia', 'hit the young Earth'], 1640, 0.8, { size: 56, weight: 900, out: 2.5 });
  say(ctx, u, ['The wreckage became', 'our Moon.'], 230, 2.75, { size: 96, out: OUT('twist'), mark: { line: 1, from: 0, to: 8, color: '#3a86ff' } });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1400, 260, { lon0: u * 4, lat0: 15, t: u, ink: false }); moonFx(ctx, W / 2 + 300, 1080, 70, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}
