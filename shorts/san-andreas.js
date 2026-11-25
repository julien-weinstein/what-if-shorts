// What if the San Andreas Fault ruptured?   (v2: "Michael Bay" cut: action set pieces, no maps)
//
// FACTS (checked; USGS unless noted):
//  - The Pacific Plate slides NW past North America ~3-5 cm/yr; LA (~560 km from SF in a straight line) will sit
//    beside San Francisco in ~15 million years. California will not fall into the ocean.
//  - ShakeAlert early warning: seconds to tens of seconds before shaking.
//  - ShakeOut Scenario (USGS 2008): M7.8 on the southern San Andreas; up to ~2 minutes of shaking; ~1,600 fires;
//    broken water and gas mains; est. ~1,800 deaths, ~50,000 injuries, ~$200 billion.
//  - Ground offsets of several meters (1906: up to ~6 m). Surface waves make the ground visibly roll.
//  - Northridge 1994: freeway bridges collapsed (I-10, I-5/SR-14); on Balboa Blvd a broken gas main caught fire while a
//    broken water main flooded the same street.
//  - Kobe 1995: port quay walls slid and liquefied; container cranes were knocked out. The ports of LA/Long Beach sit on
//    similar fill (hedged: "the port's ground can turn to liquid").
//  - The fault is ~1,200 km long (about the length of Great Britain, ~1,000 km). The southern section last broke in 1857.
//  - UCERF3: >99% chance of an M6.7+ in California in the next 30 years.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['map', 5.0, [[0.2, 'rumble:4.6']]],
  ['alert', 3.5, [[0.2, 'heart:3.2']]],
  ['wave', 4.5, [[0.2, 'rumble:4.2'], [0.6, 'boom'], [1.6, 'boom']]],
  ['overpass', 5.5, [[0.2, 'rumble:5'], [1.2, 'impact'], [1.25, 'boom'], [2.9, 'impact'], [2.95, 'boom']]],
  ['tower', 5.0, [[0.2, 'rumble:4.6'], [1.0, 'boom'], [2.2, 'roar:2.6']]],
  ['crack', 4.5, [[0.3, 'impact'], [0.35, 'boom'], [1.5, 'impact'], [1.55, 'boom']]],
  ['fire', 5.0, [[0.5, 'impact'], [0.55, 'boom'], [0.6, 'roar:4.2']]],
  ['port', 4.5, [[0.2, 'rumble:4'], [1.6, 'boom'], [2.6, 'roar:1.8'], [2.7, 'boom']]],
  ['heli', 5.0, [[0.1, 'heart:4.8'], [0.7, 'impact'], [1.7, 'impact'], [2.7, 'impact']]],
  ['sign', 6.0, [[0.2, 'swell:5.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the San Andreas Fault ruptured?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, map: vMapFault, alert: vAlert2, wave: vWave, overpass: vOverpass, tower: vTower, crack: vCrack, fire: vFireWater, port: vPort,
              heli: vHeli, sign: vSign, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.26, contrast: 1.1, saturate: 1.18, vignette: 0.38 });
}

// ================================================================ stylised California map (Natural Earth coast + fault trace)
const FAULT = [[-115.7, 33.35], [-116.2, 33.7], [-116.8, 33.95], [-117.3, 34.2], [-117.45, 34.3], [-118.1, 34.55], [-118.95, 34.8], [-119.8, 35.2], [-120.43, 35.9],
  [-121.4, 36.85], [-122.45, 37.6], [-122.8, 38.0], [-123.7, 38.95], [-124.1, 40.1]];
const CA_BORDER = [[-124.2, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.63, 35.0], [-114.45, 34.3], [-114.72, 33.0], [-114.72, 32.72], [-117.12, 32.53]];
const CAC = [['Los Angeles', -118.24, 34.05, 1], ['San Francisco', -122.42, 37.77, 1], ['San Diego', -117.16, 32.72, 0], ['San Bernardino', -117.29, 34.11, 0], ['Palm Springs', -116.55, 33.83, 0], ['Bakersfield', -119.0, 35.37, 0], ['Sacramento', -121.49, 38.58, 0]];
function caMap(ctx, o) {
  const { lon0 = -119, lat0 = 36, k = 150, cx = W / 2, cy = 1150, t = 0, rupture = 0, rupFrom = 0, rupTo = 6 } = o, cl = Math.cos(lat0 * Math.PI / 180);
  const P = (lo, la) => [cx + (lo - lon0) * k * cl, cy - (la - lat0) * k];
  bgSky(ctx, ['#2a6aaa', '#3a86c8', '#5aa6e0']);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(0, i * 70 + (t * 10) % 70); ctx.lineTo(W, i * 70 + (t * 10) % 70); ctx.stroke(); }
  for (const poly of LAND) { const [lo, la] = poly[0]; if (poly.length < 30 && !(lo > -140 && lo < -60 && la > 10 && la < 70)) continue;
    let near = false; for (const [a, b] of poly) if (a > -135 && a < -100 && b > 25 && b < 50) { near = true; break; } if (!near) continue;
    ctx.fillStyle = '#e6d6a8'; ctx.beginPath(); poly.forEach(([a, b], i) => { const [x, y] = P(a, b); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c8b480'; ctx.lineWidth = 4; ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,100,70,0.6)'; ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.beginPath(); CA_BORDER.forEach(([a, b], i) => { const [x, y] = P(a, b); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
  // the fault
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#b02a3a'; ctx.lineWidth = 8; ctx.beginPath(); FAULT.forEach(([a, b], i) => { const [x, y] = P(a, b); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  if (rupture > 0) { const seg = FAULT.slice(rupFrom, rupTo + 1), L = []; let tot = 0; for (let i = 1; i < seg.length; i++) { const d = Math.hypot(...P(...seg[i]).map((v, j) => v - P(...seg[i - 1])[j])); L.push(d); tot += d; }
    let rem = tot * rupture, end = P(...seg[0]); ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(...end);
    for (let i = 1; i < seg.length && rem > 0; i++) { const q = Math.min(1, rem / L[i - 1]), a = P(...seg[i - 1]), b = P(...seg[i]); end = [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]; ctx.lineTo(...end); rem -= L[i - 1]; }
    ctx.stroke(); glow(ctx, end[0], end[1], 90, '255,220,120', 0.9); return { P, tip: end }; }
  return { P };
}
function cityDots(ctx, P, which, size = 40) {
  for (const [name, lo, la, big] of CAC) { if (which && !which.includes(name)) continue; const [x, y] = P(lo, la);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, big ? 14 : 10, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#1b1b2e'; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fillStyle = '#ffffff'; ctx.fillText(name, x + 22, y + 12); ctx.shadowBlur = 0; }
}

// ================================================================ action kit
const tm = (u, a, b, f) => (u < a ? u : u < b ? a + (u - a) * f : a + (b - a) * f + (u - b));   // slow-motion time remap
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.25)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function dustBlast(ctx, x, y, dt, seed, o = {}) {   // a rolling dust cloud that grows toward the camera
  const { n = 40, spread = 700, col = '#b8a090', up = 300, life = 3 } = o; if (dt <= 0) return; const r = rng(seed);
  for (let i = 0; i < n; i++) { const a = -Math.PI * r(), sp = 0.3 + r() * 0.7, k = 1 - Math.exp(-dt * 2.2), px = x + Math.cos(a) * spread * sp * k * 1.3, py = y + Math.sin(a) * up * sp * k;
    puff(ctx, px, py, (40 + r() * 70) * (0.5 + k * 1.6), mixHex(col, '#6a5a50', r() * 0.5), 0.9 * R2(1 - dt / life)); } }
function debrisAtCam(ctx, x, y, dt, seed, n = 40, col = '#3a3030') {   // chunks that fly outward and swell as if toward the lens
  if (dt <= 0) return; const r = rng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) { const a = r() * 6.283, sp = 300 + r() * 900, d = sp * dt, sc = 1 + dt * (1 + r() * 3), px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.7 + 400 * dt * dt, s = (6 + r() * 12) * sc;
    if (px < -100 || px > W + 100 || py > H + 100) continue; ctx.save(); ctx.translate(px, py); ctx.rotate(dt * (4 + r() * 8) + i); ctx.fillRect(-s / 2, -s / 3, s, s * 0.66); ctx.restore(); } }
function carSide(ctx, x, y, s, col, rot = 0, dir = 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * dir, s);
  ctx.fillStyle = col; roundRect(ctx, -80, -46, 160, 34, 12); ctx.fill(); roundRect(ctx, -46, -74, 86, 34, 14); ctx.fill();
  ctx.fillStyle = '#bfe8ff'; roundRect(ctx, -38, -68, 34, 24, 6); ctx.fill(); roundRect(ctx, 2, -68, 30, 24, 6); ctx.fill();
  ctx.fillStyle = '#16161e'; ctx.beginPath(); ctx.arc(-46, -10, 15, 0, 6.283); ctx.arc(48, -10, 15, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ffe9a0'; ctx.fillRect(74, -40, 8, 8); ctx.fillStyle = '#ff3a3a'; ctx.fillRect(-82, -40, 6, 8); ctx.restore(); }
function carRear(ctx, x, y, s, col, toward = false) { const w = 150 * s, h = 80 * s; ctx.fillStyle = col; roundRect(ctx, x - w / 2, y - h, w, h, 14 * s); ctx.fill();
  ctx.fillStyle = 'rgba(20,24,40,0.6)'; roundRect(ctx, x - w * 0.36, y - h * 0.95, w * 0.72, h * 0.4, 8 * s); ctx.fill();
  ctx.fillStyle = toward ? '#fff6d0' : '#ff2a2a'; ctx.fillRect(x - w * 0.46, y - h * 0.45, w * 0.16, h * 0.14); ctx.fillRect(x + w * 0.3, y - h * 0.45, w * 0.16, h * 0.14);
  if (s > 0.12) glow(ctx, x, y - h * 0.4, w * 0.8, toward ? '255,240,200' : '255,60,40', 0.25); }
function palm(ctx, x, base, h, sway = 0) { ctx.strokeStyle = '#2a1a24'; ctx.lineWidth = h * 0.035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x + h * 0.08, base - h * 0.5, x + sway, base - h); ctx.stroke();
  ctx.lineWidth = h * 0.025; for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6 + sway * 0.002; ctx.beginPath(); ctx.moveTo(x + sway, base - h); ctx.quadraticCurveTo(x + sway + Math.cos(a) * h * 0.2, base - h - h * 0.12, x + sway + Math.cos(a) * h * 0.32, base - h + Math.abs(Math.sin(a)) * h * 0.05 + h * 0.08); ctx.stroke(); } }
const CARCOL = ['#e63946', '#3a86ff', '#ffbe0b', '#f1f1f1', '#2ec4b6', '#8338ec', '#fb5607', '#16161e'];

// ================================================================ 1. hook: LA at golden hour
function vHook(ctx, u) {
  bgSky(ctx, ['#2a3a7a', '#e07a5a', '#ffc07a']);
  drift(ctx, u, 0, 3.5, 1.0, 1.08, W / 2, 1300);
  glow(ctx, W / 2, 1150, 420, '255,210,140', 0.6); ctx.fillStyle = '#ffe0a0'; ctx.beginPath(); ctx.arc(W / 2, 1150, 110, 0, 6.283); ctx.fill();
  cityLayer(ctx, u, { base: 1250, seed: 3, hMin: 140, hMax: 640, wMin: 50, wMax: 130, gap: 8, col: '#5a2a4a', win: 'rgba(255,220,160,0.6)', winP: 0.4, ws: 7, top: 'rgba(255,170,120,0.6)' });
  ctx.fillStyle = '#3a1a34'; ctx.fillRect(0, 1250, W, H);
  for (const [x, h] of [[90, 620], [220, 520], [880, 600], [1000, 500]]) palm(ctx, x, 1500, h, Math.sin(u * 1.5 + x) * 10);
  ctx.fillStyle = '#2a1428'; ctx.fillRect(0, 1480, W, 60);
  for (let i = 0; i < 16; i++) { const x = ((i * 140 + u * 220) % (W + 300)) - 150; carSide(ctx, x, 1478, 0.55, CARCOL[i % 8]); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1720, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the', 'San Andreas', 'finally snapped?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 1, from: 0, to: 11, color: '#e63946' } });
}

// ================================================================ 1b. the fault from above
function vMapFault(ctx, u) {
  const zoom = lerp(96, 118, easeInOut(prog(u, 0, 5)));
  const { P } = caMap(ctx, { lon0: -119.4, lat0: 36.3, k: zoom, cy: 1220, t: u, rupture: easeInOut(prog(u, 0.3, 2.2)), rupFrom: 0, rupTo: FAULT.length - 1 });
  // plates grinding past each other
  const sh = Math.sin(u * 2.2) * 14, arrow = (x, y, ang) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(-80, -16, 120, 32); ctx.beginPath(); ctx.moveTo(40, -40); ctx.lineTo(96, 0); ctx.lineTo(40, 40); ctx.fill(); ctx.restore(); };
  if (u > 1.6) { ctx.save(); ctx.globalAlpha = R2((u - 1.6) / 0.4); arrow(230 + sh, 1330 + sh, -2.2); arrow(820 - sh, 1080 - sh, 0.95);
    ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10;
    ctx.fillText('PACIFIC PLATE', 230, 1470); ctx.fillText('NORTH AMERICAN', 830, 930); ctx.fillText('PLATE', 830, 970); ctx.shadowBlur = 0; ctx.restore(); }
  cityDots(ctx, P, ['Los Angeles', 'San Francisco'], 40);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['The San Andreas:', '1,200 km of cracked crust'], 230, 0.15, { size: 78, out: 2.4 });
  say(ctx, u, ['Two plates grinding past', 'each other. The south has', 'been stuck since 1857.'], 230, 2.5, { size: 68, out: OUT('map') });
  scrimB(ctx, 1600, 0.55); say(ctx, u, ['about as long as Great Britain'], 1780, 0.9, { size: 46, weight: 800, x: W / 2, align: 'center', out: OUT('map') });
}

// ================================================================ 2. the alert, from the driver's seat
function vAlert2(ctx, u) {
  bgSky(ctx, ['#e07a5a', '#ffb07a', '#ffd6a0']);
  const vy = 1000, buzz = u > 0.4 ? Math.sin(u * 70) * 7 : 0;
  ctx.fillStyle = '#6a4a4a'; ctx.beginPath(); ctx.moveTo(W / 2 - 40, vy); ctx.lineTo(W / 2 + 40, vy); ctx.lineTo(W + 600, H); ctx.lineTo(-600, H); ctx.fill();
  for (let lane = -1; lane <= 1; lane++) for (let z = 1.2; z < 30; z *= 1.25) { const s = 1 / z; carRear(ctx, W / 2 + lane * 300 * s, vy + 900 * s, s * 1.3, CARCOL[(Math.floor(z * 7) + lane + 8) % 8]); }
  // windshield frame + dash
  ctx.fillStyle = '#16161e'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 260); ctx.quadraticCurveTo(W / 2, 200, 0, 260); ctx.fill();
  ctx.fillRect(0, 0, 70, H); ctx.fillRect(W - 70, 0, 70, H);
  ctx.fillStyle = '#20202a'; ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(W / 2, 1420, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  // phone on its mount
  ctx.save(); ctx.translate(W / 2 + buzz, 1380); ctx.rotate(-0.05 + buzz * 0.004);
  ctx.fillStyle = '#0e0e14'; roundRect(ctx, -170, -300, 340, 600, 50); ctx.fill(); ctx.fillStyle = u > 0.4 ? '#e63946' : '#1b2a4a'; roundRect(ctx, -152, -282, 304, 564, 40); ctx.fill();
  if (u > 0.4) { ctx.font = `900 46px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('EARTHQUAKE', 0, -190); ctx.font = `800 28px ${FONT}`; ctx.fillText('Drop · Cover · Hold On', 0, -140);
    const sec = Math.max(0, Math.ceil(9 - (u - 0.4) * 3)); ctx.font = `900 190px ${FONT}`; ctx.fillText(sec, 0, 90); ctx.font = `800 30px ${FONT}`; ctx.fillText('seconds', 0, 150);
    glow(ctx, 0, 0, 420, '255,60,60', 0.35 + 0.25 * Math.sin(u * 14)); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Your phone screams.', 'Seconds to go.'], 330, 0.15, { size: 84, out: OUT('alert') });
}

// ================================================================ 3. the ground rolls like the ocean, through rush-hour traffic
function vWave(ctx, u) {
  const vy = 860, [sx, sy] = shakeOffset(u, 0.4, 4, 18);
  bgSky(ctx, ['#3a4a8a', '#d07a6a', '#ffb07a']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: vy + 6, seed: 5, hMin: 60, hMax: 300, wMin: 30, wMax: 80, gap: 5, col: '#6a3a5a', win: 'rgba(255,220,160,0.5)', winP: 0.3, ws: 4 });
  const zc = lerp(16, -3, easeIn2(prog(u, 0.2, 3.6))), disp = z => { const d = (z - zc) / 2.6; return Math.exp(-d * d) * Math.cos((z - zc) * 1.3) * 300; };
  const Zs = []; for (let z = 1; z < 45; z *= 1.04) Zs.push(z);
  const edge = (z, side) => { const s = 1 / z; return [W / 2 + side * 560 * s, vy + 900 * s - disp(z) * Math.min(1, s * 4)]; };
  ctx.fillStyle = '#4a3a4a'; ctx.beginPath(); Zs.forEach((z, i) => { const [x, y] = edge(z, -1); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); [...Zs].reverse().forEach(z => ctx.lineTo(...edge(z, 1))); ctx.fill();
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 6; ctx.beginPath(); Zs.forEach((z, i) => { const s = 1 / z, y = vy + 900 * s - disp(z) * Math.min(1, s * 4); i ? ctx.lineTo(W / 2, y) : ctx.moveTo(W / 2, y); }); ctx.stroke();
  const cars = []; for (let lane = -2; lane <= 2; lane++) { if (lane === 0) continue; for (let z = 1.25; z < 18; z *= 1.32) cars.push([lane, z * (1 + ((lane * 13 + Math.floor(z * 9)) % 5) * 0.04)]); }
  cars.sort((a, b) => b[1] - a[1]);
  for (const [lane, z] of cars) { const s = 1 / z, x = W / 2 + (lane - Math.sign(lane) * 0.5) * 230 * s, y = vy + 900 * s - disp(z) * Math.min(1, s * 4) - Math.abs(disp(z)) * s * 0.4;
    carRear(ctx, x, y, s * 1.6, CARCOL[(lane + 3 + Math.floor(z * 3)) % 8], lane < 0); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'M7.8', 330, 0.2, { size: 170, color: '#ffd25a', out: 1.9 });
  say(ctx, u, ['The ground rolls', 'like an ocean wave'], 230, 2.0, { size: 88, out: OUT('wave') });
}

// ================================================================ 4. the overpass collapses (slow motion)
function vOverpass(ctx, u) {
  const brk = 1.2, vt = tm(u, brk, 4.6, 0.35), fdt = Math.max(0, vt - brk), drop = Math.min(700, 0.5 * 2400 * fdt * fdt), landed = drop >= 700;
  const landAt = brk + Math.sqrt(700 * 2 / 2400) / 0.35, ldt = u - landAt;
  const [sx, sy] = shakeOffset(u, 0, 5.4, 10 + (ldt > 0 ? 30 * Math.exp(-ldt * 2) : 0));
  bgSky(ctx, ['#1e3a5a', '#2a7a8a', '#ffa06a']); ctx.translate(sx, sy);
  glow(ctx, 820, 900, 380, '255,190,120', 0.6);
  cityLayer(ctx, u, { base: 1300, seed: 7, hMin: 120, hMax: 520, wMin: 50, wMax: 120, gap: 8, col: '#1e3048', win: 'rgba(255,220,160,0.5)', winP: 0.35, ws: 6 });
  ctx.fillStyle = '#3a3440'; ctx.fillRect(0, 1700, W, H);
  // columns
  ctx.fillStyle = '#8a8690'; for (const x of [60, 300, 760, 1000]) ctx.fillRect(x - 28, 1060, 56, 640);
  const deck = (x0, x1, y, rot = 0, px = x0) => { ctx.save(); ctx.translate(px, y); ctx.rotate(rot); ctx.translate(-px, -y); ctx.fillStyle = '#b0acb6'; ctx.fillRect(x0, y, x1 - x0, 70); ctx.fillStyle = '#7a7680'; ctx.fillRect(x0, y + 54, x1 - x0, 16);
    ctx.fillStyle = '#d0ccd6'; ctx.fillRect(x0, y - 18, x1 - x0, 18); ctx.restore(); };
  deck(-60, 300, 1000); deck(760, 1140, 1000);
  const rot = landed ? 0.12 : fdt * 0.08;
  ctx.save(); ctx.translate(530, 1000 + drop); ctx.rotate(rot); ctx.translate(-530, -1000); deck(300, 760, 1000);
  [[380, '#e63946'], [560, '#3a86ff'], [700, '#ffbe0b']].forEach(([x, c], i) => { const slide = landed ? Math.min(80, (u - landAt) * 120) * (i % 2 ? 1 : -1) : 0, flip = !landed ? fdt * (i - 1) * 0.6 : (i - 1) * 0.5;
    carSide(ctx, x + slide, 982 - (landed ? 0 : fdt * 60 * (i % 2)), 0.9, c, flip); });
  ctx.restore();
  // cars that stop at the brink
  carSide(ctx, lerp(-100, 210, easeOut(R2(u / 1.4))), 982, 0.9, '#2ec4b6', u > brk ? Math.sin(u * 8) * 0.05 + 0.08 : 0);
  carSide(ctx, lerp(W + 100, 870, easeOut(R2(u / 1.4))), 982, 0.9, '#f1f1f1', 0, -1);
  if (u > brk && !landed) { const r = rng(2); ctx.fillStyle = '#9a96a0'; for (let i = 0; i < 16; i++) { const x = 300 + r() * 460, y = 1070 + drop * (0.6 + r() * 0.6); ctx.fillRect(x, y, 20 + r() * 30, 14 + r() * 20); } }
  if (ldt > 0) { dustBlast(ctx, 530, 1700, ldt * 0.6, 5, { n: 46, spread: 900, up: 700, col: '#c8b0a0', life: 3 }); debrisAtCam(ctx, 530, 1600, ldt * 0.6, 9, 50, '#5a5058'); }
  flash(ctx, u, landAt, 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Freeway bridges', 'collapse'], 230, 0.15, { size: 96, out: OUT('overpass') });
  if (u > 3.2) say(ctx, u, ['Like Northridge, 1994'], 470, 3.2, { size: 52, weight: 800, out: OUT('overpass') });
}

// ================================================================ 5. glass rains from a tower (slow motion)
function vTower(ctx, u) {
  const vt = tm(u, 1.0, 4.4, 0.4), [sx, sy] = shakeOffset(u, 0, 5, 14);
  bgSky(ctx, ['#1a3a6a', '#3a8aba', '#a8dcf0']); ctx.translate(sx, sy);
  const sway = Math.sin(u * 6) * 0.012 * (1 - prog(u, 3.5, 5));
  ctx.save(); ctx.translate(W / 2, H); ctx.rotate(sway); ctx.translate(-W / 2, -H);
  const T = y => { const f = y / H; return [lerp(W / 2 - 160, W / 2 - 420, f), lerp(W / 2 + 160, W / 2 + 420, f)]; };
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#1a4a6a'); g.addColorStop(0.5, '#5ab0d0'); g.addColorStop(1, '#1a3a5a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(...[T(0)[0], 0]); ctx.lineTo(T(0)[1], 0); ctx.lineTo(T(H)[1], H); ctx.lineTo(T(H)[0], H); ctx.fill();
  const rows = 26, cols = 8, panes = [];
  for (let r = 0; r < rows; r++) { const y0 = (r / rows) * H, y1 = ((r + 1) / rows) * H, [a0, b0] = T(y0), [a1, b1] = T(y1);
    for (let c = 0; c < cols; c++) { const f0 = c / cols, f1 = (c + 1) / cols, P = [[lerp(a0, b0, f0), y0], [lerp(a0, b0, f1), y0], [lerp(a1, b1, f1), y1], [lerp(a1, b1, f0), y1]];
      const bt = 1.0 + ((r * 7 + c * 13) % 23) / 23 * 1.4 + (r < 12 ? 0 : 99); panes.push([P, bt, r, c]);
      ctx.fillStyle = vt > bt ? 'rgba(10,20,30,0.85)' : `rgba(200,240,255,${0.12 + ((r + c) % 3) * 0.06})`; ctx.beginPath(); ctx.moveTo(...P[0]); P.slice(1).forEach(p => ctx.lineTo(...p)); ctx.fill();
      ctx.strokeStyle = '#0e2a3a'; ctx.lineWidth = 4; ctx.stroke(); } }
  ctx.restore();
  // shards: burst outward, fall, swell toward the lens, glint
  for (const [P, bt, r, c] of panes) { const dt = vt - bt; if (dt <= 0 || bt > 50) continue; const rr = rng(r * 31 + c), cx = (P[0][0] + P[2][0]) / 2, cy = (P[0][1] + P[2][1]) / 2;
    for (let k = 0; k < 5; k++) { const vx = (cx - W / 2) * (0.6 + rr()) * 1.2 + (rr() - 0.5) * 300, x = cx + vx * dt, y = cy + 140 * dt + 900 * dt * dt, sc = 1 + dt * 1.8, s = (10 + rr() * 16) * sc, rot = dt * (6 + rr() * 6) + k;
      if (y > H + 60) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(210,245,255,0.85)'; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, s * 0.4); ctx.lineTo(-s * 0.5, s * 0.7); ctx.fill(); ctx.restore();
      if (Math.sin(rot * 3) > 0.92) glow(ctx, x, y, s * 2, '255,255,255', 0.8); } }
  massCrowd(ctx, u, { n: 260, yFar: 1840, yNear: 2300, sFar: 120, sNear: 360, seed: 12, col: '#0e1420', flow: -260, panic: 1, arms: 0.5 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 520, 0.6);
  say(ctx, u, ['Glass rains', 'from the towers'], 230, 0.15, { size: 96, out: OUT('tower') });
}

// ================================================================ 6. the fault rips across the road, straight at us
function vCrack(ctx, u) {
  const vy = 980, p = easeIn2(prog(u, 0.3, 1.5)), shear = easeOut(R2((u - 1.5) / 0.25)) * 240, [sx, sy] = shakeOffset(u, 0.3, 4, 16 + (u > 1.5 ? 20 : 0));
  bgSky(ctx, ['#3a5a9a', '#e8a06a', '#ffd6a0']); ctx.translate(sx, sy);
  mountainsS(ctx, vy, 3, '#8a6a7a', 160);
  const crackX = y => W / 2 + 40 + (y - vy) * 0.18 + Math.sin(y * 0.03) * 14;
  const world = () => { ctx.fillStyle = '#d0a070'; ctx.fillRect(-300, vy, W + 600, H); ctx.fillStyle = '#4a4048'; ctx.beginPath(); ctx.moveTo(W / 2 - 30, vy); ctx.lineTo(W / 2 + 30, vy); ctx.lineTo(W + 500, H); ctx.lineTo(-500, H); ctx.fill();
    ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 10; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(W / 2, vy); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
    const r = rng(4); for (let i = 0; i < 14; i++) { const y = vy + 30 + r() * 900, x = r() < 0.5 ? r() * 200 : W - r() * 200; ctx.fillStyle = '#7a8a4a'; ctx.beginPath(); ctx.arc(x, y, 14 + (y - vy) * 0.05, 0, 6.283); ctx.fill(); } };
  const half = (right, off) => { ctx.save(); ctx.beginPath(); ctx.moveTo(crackX(vy), vy); for (let y = vy; y <= H; y += 30) ctx.lineTo(crackX(y), y);
    ctx.lineTo(right ? W + 600 : -600, H); ctx.lineTo(right ? W + 600 : -600, vy); ctx.closePath(); ctx.clip(); ctx.translate(off, 0); world(); ctx.restore(); };
  half(false, 0); half(true, shear);
  const yEnd = lerp(vy, H, p); ctx.strokeStyle = '#1a1014'; ctx.lineWidth = 14 + (u > 1.5 ? 30 : 0); ctx.beginPath(); ctx.moveTo(crackX(vy), vy); for (let y = vy; y <= yEnd; y += 30) ctx.lineTo(crackX(y) + shear * 0.5, y); ctx.stroke();
  if (u > 0.3 && u < 1.6) { const tip = [crackX(yEnd), yEnd]; dustBlast(ctx, tip[0], tip[1], 0.4, Math.floor(u * 10), { n: 10, spread: 200, up: 160, col: '#c8a080', life: 1 }); }
  if (u > 1.5) { for (let k = 0; k < 6; k++) { const y = vy + 100 + k * 150; dustBlast(ctx, crackX(y) + shear * 0.5, y, (u - 1.5) * 0.7, k + 20, { n: 8, spread: 300, up: 260, col: '#c8a080', life: 2.5 }); } debrisAtCam(ctx, crackX(1700), 1700, (u - 1.5) * 0.6, 4, 30, '#5a4038'); }
  // a car skids to a stop at the edge
  const k = easeOut(R2((u - 0.6) / 1.6)), cy = lerp(1050, 1560, k), cs = lerp(0.3, 1.5, k);
  ctx.save(); ctx.translate(W / 2 - 140 * cs * 0.6, cy); ctx.rotate(k > 0.7 ? (k - 0.7) * 1.2 : 0); carRear(ctx, 0, 0, cs, '#e63946', true); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['The ground rips open', 'and lurches sideways'], 230, 0.15, { size: 84, out: OUT('crack') });
}
function mountainsS(ctx, base, seed, col, amp) { const r = rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, base); let x = -50; while (x < W + 50) { const w = 140 + r() * 160; ctx.lineTo(x + w / 2, base - amp * (0.4 + r() * 0.6)); x += w; ctx.lineTo(x, base - r() * amp * 0.2); } ctx.lineTo(W + 50, base); ctx.fill(); }

// ================================================================ 7. gas main fireball + water main geyser on one street
function vFireWater(ctx, u) {
  const boom = 0.5, dt = Math.max(0, u - boom), [sx, sy] = shakeOffset(u, boom, 3, 30);
  bgSky(ctx, ['#1a1430', '#4a2a4a', '#a0503a']); ctx.translate(sx, sy);
  const vy = 1000; ctx.fillStyle = '#2a2230'; ctx.fillRect(0, vy, W, H); ctx.fillStyle = '#3a3240'; ctx.beginPath(); ctx.moveTo(W / 2 - 40, vy); ctx.lineTo(W / 2 + 40, vy); ctx.lineTo(W + 500, H); ctx.lineTo(-500, H); ctx.fill();
  for (let k = 0; k < 5; k++) { const z = 1 + k * 0.9, s = 1 / z; for (const side of [-1, 1]) { const x = W / 2 + side * 520 * s, w = 340 * s, h = 220 * s, b = vy + 760 * s;
    ctx.fillStyle = '#2a2034'; ctx.fillRect(x - w / 2, b - h, w, h); ctx.beginPath(); ctx.moveTo(x - w * 0.6, b - h); ctx.lineTo(x, b - h * 1.6); ctx.lineTo(x + w * 0.6, b - h); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,120,0.7)'; ctx.fillRect(x - w * 0.25, b - h * 0.7, w * 0.18, h * 0.3); } }
  const fx = W / 2 - 150, fy = 1380, wx = W / 2 + 200, wy = 1420;
  if (dt > 0) {
    // the water geyser
    const r = rng(7); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 260; i++) { const life = ((dt * 0.9 + r()) % 1.2), vx = (r() - 0.5) * 260, vyv = -(900 + r() * 500), x = wx + vx * life, y = wy + vyv * life + 900 * life * life;
      if (y > wy + 40) continue; ctx.fillStyle = `rgba(160,220,255,${0.55 * (1 - life / 1.2)})`; ctx.beginPath(); ctx.arc(x, y, 4 + r() * 8, 0, 6.283); ctx.fill(); }
    ctx.restore();
    // the gas fireball column
    const h = lerp(100, 900, easeOut(R2(dt / 1.0)));
    for (let i = 0; i < 30; i++) { const f = i / 30, y = fy - f * h, w = (70 + 130 * f) * (1 + 0.15 * Math.sin(u * 9 + i)); puff(ctx, fx + Math.sin(u * 5 + i) * 30 * f, y, w, mixHex('#fff0a0', '#c82a10', f * 0.9 + 0.1)); }
    for (let i = 0; i < 12; i++) { const f = i / 12; puff(ctx, fx + Math.sin(u + i) * 60, fy - h - f * 400, 140 + f * 120, '#2a1a20', 0.75 * (1 - f * 0.5)); }
    glow(ctx, fx, fy - h * 0.4, 700, '255,140,50', 0.8);
    debrisAtCam(ctx, fx, fy, dt * 0.8, 3, 36, '#2a1a1a');
  }
  carSide(ctx, 230, 1720, 1.4, '#3a86ff', u > boom ? 0.12 : 0); carSide(ctx, 880, 1760, 1.5, '#ffbe0b', 0, -1);
  flash(ctx, u, boom, 0.35);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Gas mains explode.', 'Water mains burst.'], 230, 0.15, { size: 88, out: OUT('fire') });
  if (u > 2.4) { scrimB(ctx, 1560, 0.6); say(ctx, u, ['(Both happened on one LA street in 1994)'], 1780, 2.4, { size: 40, weight: 800, x: W / 2, align: 'center', out: OUT('fire') }); }
}

// ================================================================ 8. the port liquefies; cranes topple (slow motion)
function crane(ctx, x, base, s, rot, col) { ctx.save(); ctx.translate(x, base); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-70, -520); ctx.moveTo(90, 0); ctx.lineTo(70, -520); ctx.moveTo(-80, -260); ctx.lineTo(80, -260); ctx.moveTo(-90, 0); ctx.lineTo(70, -520); ctx.stroke();
  ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-420, -520); ctx.lineTo(260, -520); ctx.stroke(); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -700); ctx.lineTo(-420, -520); ctx.moveTo(0, -700); ctx.lineTo(260, -520); ctx.moveTo(0, -700); ctx.lineTo(0, -520); ctx.stroke(); ctx.restore(); }
function vPort(ctx, u) {
  const vt = tm(u, 1.4, 4.2, 0.4), [sx, sy] = shakeOffset(u, 0, 4.4, 12);
  bgSky(ctx, ['#2a4a7a', '#7aaad0', '#ffd0a0']); ctx.translate(sx, sy);
  ctx.fillStyle = '#2a6a9a'; ctx.fillRect(0, 1300, W, H);
  const tilt = easeIn2(R2((vt - 1.4) / 1.4)) * 0.18, sink = tilt * 400;
  ctx.save(); ctx.translate(0, sink * 0.5); ctx.rotate(tilt * 0.3);
  ctx.fillStyle = '#7a7480'; ctx.fillRect(-100, 1260, W + 200, 60);
  const CC = ['#e63946', '#3a86ff', '#ffbe0b', '#2ec4b6', '#8338ec', '#fb5607'];
  for (let i = 0; i < 18; i++) { const c = i % 6, r = Math.floor(i / 6), x = 40 + c * 170, y = 1260 - r * 70, slide = Math.max(0, vt - 1.6 - c * 0.08) * 200 * (r + 1) * 0.5;
    ctx.save(); ctx.translate(x + 70 + slide, y - 30 + slide * 0.6 * (r === 2 ? 1 : 0)); ctx.rotate(slide * 0.004 * (r + 1)); ctx.fillStyle = CC[(i * 5) % 6]; ctx.fillRect(-75, -30, 150, 62);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; for (let k = 0; k < 7; k++) ctx.fillRect(-66 + k * 20, -24, 6, 50); ctx.restore(); }
  ctx.restore();
  [[260, 0], [700, 0.3]].forEach(([x, d]) => { const f = easeIn2(R2((vt - 1.6 - d) / 1.6)); crane(ctx, x, 1260 + sink * 0.5, 1.0, f * 1.25, ['#ff7a2a', '#e6c84a'][d ? 1 : 0]);
    const land = 1.6 + d + 1.6; if (vt > land) { const dd = (vt - land); const r = rng(Math.floor(x)); for (let i = 0; i < 40; i++) { const a = -Math.PI * r(), sp = 300 + r() * 600; ctx.fillStyle = `rgba(220,240,255,${0.8 * R2(1 - dd)})`;
      ctx.beginPath(); ctx.arc(x + 500 + Math.cos(a) * sp * dd, 1330 + Math.sin(a) * sp * dd + 700 * dd * dd, 6 + r() * 10, 0, 6.283); ctx.fill(); } } });
  ctx.fillStyle = 'rgba(40,90,130,0.6)'; ctx.fillRect(0, 1330, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['The port’s ground', 'turns to liquid'], 230, 0.15, { size: 88, out: 2.4 });
  say(ctx, u, ['Cranes topple', 'into the harbor'], 230, 2.5, { size: 92, out: OUT('port') });
}

// ================================================================ 9. night: helicopter over the burning city; the toll
function vHeli(ctx, u) {
  bgSky(ctx, ['#05060e', '#120e20', '#2a1424']);
  cityLayer(ctx, u, { base: 1500, seed: 21, hMin: 160, hMax: 700, wMin: 50, wMax: 130, gap: 8, col: '#0e0c18', win: 'rgba(255,200,130,0.35)', winP: 0.25, ws: 7, fires: 0.3 });
  const r = rng(22); for (let i = 0; i < 16; i++) { const x = r() * W, y = 1300 + r() * 300; glow(ctx, x, y, 140, '255,130,40', 0.6); for (let k = 0; k < 5; k++) puff(ctx, x + Math.sin(u + k + i) * 20, y - 80 - k * 90, 50 + k * 20, '#1a1218', 0.5); }
  ctx.fillStyle = '#08060c'; ctx.fillRect(0, 1500, W, H);
  // searchlight
  const a = Math.sin(u * 0.9) * 0.35, hx = 300 + u * 60, hy = 640;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(220,235,255,0.12)'; ctx.beginPath(); ctx.moveTo(hx, hy + 30); ctx.lineTo(hx + Math.sin(a) * 1400 - 160, hy + 1300); ctx.lineTo(hx + Math.sin(a) * 1400 + 160, hy + 1300); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(hx, hy); ctx.fillStyle = '#05050a'; ctx.beginPath(); ctx.ellipse(0, 0, 110, 46, 0, 0, 6.283); ctx.fill(); ctx.fillRect(60, -12, 190, 18); ctx.fillRect(230, -40, 18, 50);
  ctx.strokeStyle = 'rgba(30,30,40,0.6)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-220 * Math.cos(u * 40), -60); ctx.lineTo(220 * Math.cos(u * 40), -60); ctx.stroke(); ctx.fillRect(-60, 46, 140, 8);
  ctx.fillStyle = Math.sin(u * 10) > 0 ? '#ff3a3a' : '#05050a'; ctx.beginPath(); ctx.arc(-100, 0, 8, 0, 6.283); ctx.fill(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const lines = [['~1,800 dead', '#ffffff', 0.7], ['~50,000 injured', '#ffd25a', 1.7], ['$200 billion', '#7dffb0', 2.7]];
  lines.forEach(([txt, col, at], i) => bigNum(ctx, u, txt, 840 + i * 170, at, { size: 104, color: col, out: OUT('heli') }));
  say(ctx, u, ['The toll (USGS est.)'], 330, 0.15, { size: 84, out: OUT('heli') });
}

// ================================================================ 10. ending: LA rides the Pacific Plate north to San Francisco
function vSign(ctx, u) {
  const k = easeInOut(prog(u, 1.4, 4.8)), { P } = caMap(ctx, { lon0: -120.2, lat0: 36.1, k: 150, cy: 1220, t: u });
  const path = FAULT.slice(3, 11).map(([a, b]) => [a - 0.35, b - 0.05]);   // just west of the fault, on the Pacific side
  const L = []; let tot = 0; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * k, pos = path[0]; for (let i = 1; i < path.length && rem > 0; i++) { const q = Math.min(1, rem / L[i - 1]); pos = [lerp(path[i - 1][0], path[i][0], q), lerp(path[i - 1][1], path[i][1], q)]; rem -= L[i - 1]; }
  const [ox, oy] = P(-118.24, 34.05), [x, y] = P(...pos), [fx, fy] = P(-122.42, 37.77);
  ctx.strokeStyle = 'rgba(255,210,90,0.7)'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(ox, oy, 12, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(fx, fy, 14, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#1b1b2e'; ctx.lineWidth = 4; ctx.stroke();
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fillStyle = '#ffffff'; ctx.fillText('San Francisco', fx + 24, fy - 16);
  glow(ctx, x, y, 70, '255,210,90', 0.85); ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.arc(x, y, 18, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffd25a'; ctx.fillText('Los Angeles', x + 28, y + 14); ctx.shadowBlur = 0;
  if (u > 1.4) bigNum(ctx, u, `${(k * 15).toFixed(1)} million years`, 1560, 1.4, { size: 74, color: '#ffffff', out: OUT('sign') });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['California won’t fall', 'into the ocean.'], 230, 0.15, { size: 84, out: 1.6 });
  say(ctx, u, ['LA rides north ~4 cm a year,', 'until it meets San Francisco'], 230, 1.7, { size: 68, out: OUT('sign') });
  if (u > 4.6) { scrimB(ctx, 1640, 0.65); say(ctx, u, ['Over 99% chance of an M6.7+', 'in the next 30 years.'], 1740, 4.6, { size: 44, weight: 800, out: OUT('sign') }); }
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -118 + u * 4, lat0: 35, t: u, ink: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ shared kit
function scrim(ctx, h = 640, a = 0.6) { const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, `rgba(22,18,60,${a})`); g.addColorStop(0.65, `rgba(22,18,60,${a * 0.55})`); g.addColorStop(1, 'rgba(22,18,60,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, h); }
function scrimB(ctx, y0 = 1480, a = 0.6) { const g = ctx.createLinearGradient(0, y0, 0, H); g.addColorStop(0, 'rgba(22,18,60,0)'); g.addColorStop(0.4, `rgba(22,18,60,${a * 0.6})`); g.addColorStop(1, `rgba(22,18,60,${a})`); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0); }
function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], R2(p))).toString(16).padStart(2, '0')).join('');
}

const COLS = ['#ff7a59', '#3a86ff', '#ffbe0b', '#ff5d8f', '#2ec4b6', '#8338ec', '#fb5607', '#06d6a0', '#4cc9f0'];
const SKN = ['#ffd2b0', '#e9b18a', '#c68a5e', '#8d5a3b', '#f3c9a0'];
// Faceless figure. sick 0..1 tints green; fall 0..1 topples; grey 0..1 drains colour (dead).
function person2(ctx, x, y, s, o = {}) {
  const { seed = 0, sick = 0, fall = 0, grey = 0, t = 0, dir = 1, shadow = true } = o;
  let body = mixHex(COLS[seed % COLS.length], '#7fcf4a', sick * 0.75), head = mixHex(SKN[seed % SKN.length], '#c8f08a', sick * 0.6);
  body = mixHex(body, '#8a8a98', grey); head = mixHex(head, '#b4b4be', grey);
  ctx.save(); ctx.translate(x, y);
  if (shadow) { ctx.fillStyle = 'rgba(20,20,60,0.18)'; ctx.beginPath(); ctx.ellipse(dir * fall * s * 0.45, 0, s * (0.3 + fall * 0.5), s * 0.06, 0, 0, 6.283); ctx.fill(); }
  ctx.rotate(dir * easeIn2(R2(fall)) * Math.PI / 2 * 0.97 + (sick > 0.5 && grey < 0.5 ? Math.sin(t * 9 + seed) * 0.04 : 0));
  ctx.fillStyle = body; roundRect(ctx, -s * 0.21, -s * 0.68, s * 0.42, s * 0.68, s * 0.18); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; roundRect(ctx, s * 0.06, -s * 0.68, s * 0.15, s * 0.68, s * 0.12); ctx.fill();
  ctx.fillStyle = head; ctx.beginPath(); ctx.arc(0, -s * 0.86, s * 0.17, 0, 6.283); ctx.fill();
  if (sick > 0.6 && grey < 0.3) { ctx.fillStyle = 'rgba(120,210,255,0.9)'; for (const k of [0, 1]) { const ph = (t * 1.5 + k * 0.5 + seed * 0.3) % 1;
    ctx.beginPath(); ctx.ellipse(s * (0.2 - k * 0.4), -s * (0.95 - ph * 0.2), s * 0.025, s * 0.04, 0, 0, 6.283); ctx.fill(); } }
  ctx.restore();
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

const CITIES = [['Tokyo', 139.7, 35.7, 37], ['Delhi', 77.2, 28.6, 33], ['Shanghai', 121.5, 31.2, 29], ['Dhaka', 90.4, 23.8, 23], ['São Paulo', -46.6, -23.5, 22],
  ['Cairo', 31.2, 30.0, 22], ['Mexico City', -99.1, 19.4, 22], ['Beijing', 116.4, 39.9, 22], ['Mumbai', 72.9, 19.1, 21], ['Osaka', 135.5, 34.7, 19],
  ['Karachi', 67.0, 24.9, 18], ['New York', -74.0, 40.7, 19], ['Kinshasa', 15.3, -4.3, 17], ['Lagos', 3.4, 6.5, 16], ['Istanbul', 29.0, 41.0, 16],
  ['Kolkata', 88.4, 22.6, 15], ['Manila', 121.0, 14.6, 15], ['Buenos Aires', -58.4, -34.6, 15], ['Lahore', 74.3, 31.5, 14], ['Moscow', 37.6, 55.8, 13],
  ['Los Angeles', -118.2, 34.0, 12], ['Paris', 2.35, 48.9, 11], ['Jakarta', 106.8, -6.2, 11], ['Bangkok', 100.5, 13.8, 11], ['Seoul', 127.0, 37.5, 10],
  ['London', -0.13, 51.5, 9.6], ['Tehran', 51.4, 35.7, 9.5], ['Luanda', 13.2, -8.8, 9.3], ['Riyadh', 46.7, 24.7, 7.9], ['Baghdad', 44.4, 33.3, 7.7],
  ['Madrid', -3.7, 40.4, 6.8], ['Khartoum', 32.5, 15.5, 6.3], ['Johannesburg', 28.0, -26.2, 6.2], ['Addis Ababa', 38.7, 9.0, 5.5], ['Nairobi', 36.8, -1.3, 5.3],
  ['Rome', 12.5, 41.9, 4.3], ['Berlin', 13.4, 52.5, 3.6], ['Dubai', 55.3, 25.2, 3.5], ['Athens', 23.7, 38.0, 3.2], ['Algiers', 3.1, 36.8, 3.0],
  ['Kano', 8.5, 12.0, 4.6], ['Abidjan', -4.0, 5.3, 5.9], ['Dakar', -17.4, 14.7, 3.5], ['Casablanca', -7.6, 33.6, 3.8], ['Tripoli', 13.2, 32.9, 1.2]];

function bigNum(ctx, t, text, y, at, o = {}) {
  const { size = 140, color = C.yellow, out = 1e9 } = o;
  if (t < at || t > out + 0.3) return;
  const p = prog(t, at, at + 0.3), s2 = lerp(1.25, 1, easeOut(p)), e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e * R2(p * 2); ctx.translate(W / 2, y); ctx.scale(s2, s2);
  ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30; ctx.fillStyle = color; ctx.fillText(text, 0, 0);
  ctx.restore();
}


function bgSky(ctx, stops) { ctx.fillStyle = grad(ctx, stops); ctx.fillRect(0, 0, W, H); }
