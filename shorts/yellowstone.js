// What if Yellowstone erupted?  (a supereruption, VEI 8)
//
// FACTS (checked; USGS Yellowstone Volcano Observatory unless noted):
//  - Three caldera-forming eruptions: 2.1 Myr (Huckleberry Ridge, ~2,450 km³), 1.3 Myr (Mesa Falls, ~280 km³),
//    631,000 yr ago (Lava Creek, ~1,000 km³). The caldera is roughly 45 × 85 km.
//  - Probability of another supereruption: about 1 in 730,000 per year. USGS: Yellowstone is not "overdue"; the
//    magma reservoir is mostly crystallised (only ~5-20% melt in studies), far from eruptible.
//  - Likely precursors: intense earthquake swarms and ground uplift (hedged on screen).
//  - Eruption columns of supereruptions likely reach 40+ km (Pinatubo 1991 reached ~35 km). Volcanic lightning is common.
//  - Pyroclastic flows: hundreds of °C, speeds of 100s of km/h; Yellowstone's ignimbrites reach ~100 km from the caldera.
//  - Ash fall model (Mastin et al., USGS, 2014): up to a meter or more near Yellowstone, centimetres across the Midwest,
//    millimetres on the coasts. ~10 cm of wet ash can collapse roofs. Ash stops jet engines (BA Flight 9, 1982).
//    Eyjafjallajökull (2010) grounded ~100,000 European flights.
//  - The U.S. grows roughly a third of the world's corn.
//  - Tambora 1815 (~150 km³ bulk) caused 1816's "Year Without a Summer"; Lava Creek was ~6× larger. A supereruption
//    could cool the planet by several °C for years (models vary).
//  - Toll (est., hedged): tens of thousands killed directly; worldwide famine could kill millions.
// PLOT HOLES: Evacuate? You'd get warning signs, but the ash covers half a continent. Overdue? No (ending).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['park', 5.0, [[0.3, 'rumble:4.6'], [1.6, 'boom'], [3.0, 'boom']]],
  ['erupt', 5.5, [[0.3, 'impact'], [0.35, 'boom'], [0.4, 'roar:5'], [2.2, 'boom'], [3.6, 'boom']]],
  ['flow', 4.5, [[0.2, 'roar:4.2'], [1.0, 'boom']]],
  ['ash', 5.0, [[0.2, 'rumble:4.6']]],
  ['town', 5.5, [[0.2, 'swell:5'], [2.8, 'boom']]],
  ['farm', 4.5, [[0.2, 'rumble:4.2']]],
  ['winter', 5.0, [[0.2, 'swell:4.6']]],
  ['toll', 5.0, [[0.2, 'heart:4.6'], [2.6, 'boom']]],
  ['relax', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if Yellowstone erupted?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 70, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, park: vPark, erupt: vErupt, flow: vFlow, ash: vAshMap, town: vTown, farm: vFarm, winter: vWinter, toll: vToll,
              relax: vRelax, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const YS = [-110.6, 44.4];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}

// ================================================================ scenery kit
function mountains(ctx, base, seed, col, amp, n = 7) { const r = rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, base + 200);
  let x = -50; ctx.lineTo(x, base); while (x < W + 50) { const w = 120 + r() * 160; ctx.lineTo(x + w / 2, base - amp * (0.4 + r() * 0.6)); x += w; ctx.lineTo(x, base - r() * amp * 0.2); }
  ctx.lineTo(W + 50, base + 200); ctx.fill(); }
function pines(ctx, base, seed, n, s, col, burn = () => 0) { const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = r() * W, h = (60 + r() * 60) * s, b = burn(x); ctx.fillStyle = b > 0 ? mixHex(col, '#2a1a14', b) : col;
    ctx.beginPath(); ctx.moveTo(x, base - h); ctx.lineTo(x - h * 0.28, base); ctx.lineTo(x + h * 0.28, base); ctx.fill(); if (b > 0.3 && b < 1) glow(ctx, x, base - h * 0.4, h * 0.6, '255,120,40', 0.6 * (1 - b)); } }
function prismatic(ctx, x, y, s) { const cols = ['#c8501e', '#e8901e', '#f2d24a', '#9ad06a', '#2ec4b6', '#1a8ad8'];
  cols.forEach((c, i) => { const k = 1 - i / cols.length; ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 280 * s * k, 70 * s * k, 0, 0, 6.283); ctx.fill(); }); }
function bison(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#3a2618';
  ctx.beginPath(); ctx.ellipse(0, -50, 70, 40, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(-55, -62, 40, 46, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(-90, -40, 22, 26, 0.3, 0, 6.283); ctx.fill();
  for (const lx of [-40, -15, 25, 50]) ctx.fillRect(lx, -20, 12, 22 + Math.sin(t * 6 + lx) * 0); ctx.restore(); }
function geyserCol(ctx, x, base, h, t, seed) { const r = rng(seed);
  for (let k = 0; k < 14; k++) { const f = ((k / 14) + t * 0.5) % 1, yy = base - f * h, rad = (18 + f * 70) * (0.8 + r() * 0.4);
    const g = ctx.createRadialGradient(x, yy, 0, x, yy, rad); g.addColorStop(0, `rgba(255,255,255,${0.75 * (1 - f)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + Math.sin(t * 2 + k) * 14 * f, yy, rad, 0, 6.283); ctx.fill(); } }
function puff(ctx, x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.25)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#4f9be0', '#8ccaf0', '#d0ecff']);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1300);
  mountains(ctx, 1150, 3, '#7a8aa8', 260); mountains(ctx, 1250, 4, '#5a7a6a', 180);
  ctx.fillStyle = '#c8b898'; ctx.fillRect(0, 1250, W, H);
  prismatic(ctx, W / 2, 1520, 1.1);
  geyserCol(ctx, 250, 1360, 700, u, 1); geyserCol(ctx, 820, 1330, 520, u, 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if', 'Yellowstone', 'erupted?'], 300, 0.15, { size: 104, out: OUT('hook'), mark: { line: 1, from: 0, to: 11, color: '#e8601e' } });
}

// ================================================================ 2. warning signs in the park
function vPark(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0.4, 4.4, 10 + 14 * prog(u, 0, 4.5));
  bgSky(ctx, ['#5a9ad8', '#9ac8ea', '#dcefff']); ctx.translate(sx, sy);
  const bulge = easeInOut(prog(u, 1.0, 4.4)) * 60;
  mountains(ctx, 1100, 3, '#7a8aa8', 260); mountains(ctx, 1200 - bulge * 0.5, 4, '#5a7a6a', 180);
  ctx.fillStyle = '#c8b898'; ctx.beginPath(); ctx.moveTo(-40, 1220); ctx.quadraticCurveTo(W / 2, 1200 - bulge * 2, W + 40, 1220); ctx.lineTo(W + 40, H); ctx.lineTo(-40, H); ctx.fill();
  prismatic(ctx, W / 2, 1420 - bulge, 0.9);
  geyserCol(ctx, 200, 1320 - bulge * 0.6, 500 + 300 * prog(u, 0, 4), u * 1.6, 1); geyserCol(ctx, 880, 1300 - bulge * 0.6, 420 + 400 * prog(u, 0, 4), u * 1.6, 2);
  // cracks
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 5; const r = rng(9);
  for (let i = 0; i < 6; i++) { const at = 1.6 + i * 0.4; if (u < at) continue; const k = R2((u - at) / 0.4); let x = r() * W, y = 1500 + r() * 300; ctx.beginPath(); ctx.moveTo(x, y);
    for (let s = 0; s < 8 * k; s++) { x += (r() - 0.5) * 80; y += 20 + r() * 20; ctx.lineTo(x, y); } ctx.stroke(); }
  bison(ctx, 760, 1660, 1.4, u); bison(ctx, 980, 1600, 1.0, u);
  [[140, 1, 'run'], [300, 4, 'run'], [460, 2, 'stand']].forEach(([x, seed], i) => person2(ctx, x - u * (i < 2 ? 60 : 0), 1800, 240, { seed, t: u }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['First, warning signs:', 'earthquake swarms'], 230, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['The ground bulges.', 'Geysers go wild.'], 230, 2.5, { size: 84, out: OUT('park') });
}

// ================================================================ 3. the eruption: a ring of fire and a 40 km column
function vErupt(ctx, u) {
  const t0 = 0.3, dt = Math.max(0, u - t0), [sx, sy] = shakeOffset(u, t0, 5, 24);
  const dusk = R2(dt / 3); bgSky(ctx, [mixHex('#5a9ad8', '#2a2030', dusk), mixHex('#9ac8ea', '#5a3a3a', dusk), mixHex('#dcefff', '#b0603a', dusk)]); ctx.translate(sx, sy);
  const g = easeOut(R2(dt / 3.5)), base = 1350, top = lerp(base, 260, g);
  // umbrella cloud spreading at the top
  if (dt > 1.2) { const k = easeOut(R2((dt - 1.2) / 3)), r = rng(5); for (let i = 0; i < 40; i++) { const a = r(), x = W / 2 + (a - 0.5) * 2 * (300 + k * 900), y = top + 40 + r() * 140 * k;
    puff(ctx, x, y, 90 + r() * 80, mixHex('#8a7a78', '#5a4a4a', r()), 0.95); } }
  // the column: stacked billows
  const r = rng(7); for (let i = 0; i < 46; i++) { const f = i / 46, y = lerp(base, top, f), w = lerp(260, 180, f) + Math.sin(i * 1.7 + u * 2) * 30;
    if (y < top) continue; puff(ctx, W / 2 + Math.sin(i * 2.3 + u) * w * 0.4, y, w * (0.6 + r() * 0.3), mixHex('#c8a890', '#6a5a58', f + r() * 0.2)); }
  glow(ctx, W / 2, base - 40, 420, '255,140,50', 0.7);
  // volcanic lightning
  for (let i = 0; i < 3; i++) { const at = 1.5 + i * 1.1; if (u < at || u > at + 0.18) continue; ctx.strokeStyle = '#e8f0ff'; ctx.lineWidth = 6; ctx.beginPath(); let x = W / 2 + (i - 1) * 160, y = lerp(base, top, 0.5);
    ctx.moveTo(x, y); for (let s = 0; s < 8; s++) { x += (rng(i * 9 + s)() - 0.5) * 120; y += 50; ctx.lineTo(x, y); } ctx.stroke(); glow(ctx, x, y - 200, 260, '220,230,255', 0.6); }
  // ring of vents along the caldera
  mountains(ctx, 1320, 4, '#3a3a4a', 120);
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, 1320, W, H);
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283, x = W / 2 + Math.cos(a) * 440, y = 1460 + Math.sin(a) * 90, h = (120 + 80 * Math.sin(u * 7 + i)) * R2(dt * 2);
    glow(ctx, x, y - h * 0.5, 120, '255,150,50', 0.8); ctx.fillStyle = '#ffb04a'; ctx.beginPath(); ctx.moveTo(x - 24, y); ctx.quadraticCurveTo(x, y - h * 1.3, x + 24, y); ctx.fill(); }
  flash(ctx, u, t0, 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then the ground', 'splits in a ring', '80 km wide'], 230, 0.15, { size: 80, out: 2.6 });
  say(ctx, u, ['An ash column climbs', '40 km into the sky'], 230, 2.7, { size: 80, out: OUT('erupt') });
}

// ================================================================ 4. pyroclastic flows
function vFlow(ctx, u) {
  const front = lerp(W + 400, -500, easeIn2(prog(u, 0.3, 4.2)));
  bgSky(ctx, ['#2a2030', '#5a3a3a', '#a0603a']);
  mountains(ctx, 1150, 8, '#3a3040', 220);
  ctx.fillStyle = '#4a5a3a'; ctx.fillRect(0, 1250, W, H);
  pines(ctx, 1300, 3, 40, 1.2, '#2a4a2a', x => (x > front ? R2((x - front) / 400) : 0));
  [[180, 1500], [520, 1560], [860, 1480]].forEach(([x, y]) => { const b = x > front ? R2((x - front) / 300) : 0; ctx.fillStyle = mixHex('#c8783a', '#2a1a14', b);
    ctx.fillRect(x - 80, y - 90, 160, 90); ctx.fillStyle = mixHex('#8a3a2a', '#1a1010', b); ctx.beginPath(); ctx.moveTo(x - 100, y - 90); ctx.lineTo(x, y - 160); ctx.lineTo(x + 100, y - 90); ctx.fill();
    if (b > 0 && b < 1) glow(ctx, x, y - 80, 160, '255,120,40', 0.8 * (1 - b)); });
  pines(ctx, 1800, 5, 22, 2.2, '#1f3a1f', x => (x > front ? R2((x - front) / 400) : 0));
  // the flow: a hot, billowing grey wall moving left
  const r = rng(11);
  for (let i = 0; i < 70; i++) { const y = 700 + r() * 1300, x = front + r() * 900 + Math.sin(u * 3 + i) * 30, rad = 120 + r() * 160;
    puff(ctx, x, y, rad, mixHex('#9a8a80', '#5a4a48', r()), 0.95); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(front, 0, front + 400, 0); g.addColorStop(0, 'rgba(255,120,40,0.0)'); g.addColorStop(0.3, 'rgba(255,120,40,0.35)'); g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g; ctx.fillRect(front, 1300, 400, 700); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Avalanches of ash and gas', 'race out at hundreds of km/h'], 230, 0.15, { size: 68, out: OUT('flow') });
  scrimB(ctx, 1500, 0.6);
  say(ctx, u, ['Hotter than an oven.', 'Up to 100 km from the caldera.'], 1660, 1.2, { size: 52, weight: 900, out: OUT('flow') });
}

// ================================================================ 5. the ash map
const USC = [['Billings', -108.5, 45.8, '1 m+'], ['Denver', -104.99, 39.74, '10s of cm'], ['Minneapolis', -93.27, 44.98, 'cm'], ['Chicago', -87.63, 41.88, 'cm'],
  ['Dallas', -96.8, 32.78, 'cm'], ['Seattle', -122.33, 47.6, 'cm'], ['New York', -74.0, 40.71, 'mm'], ['Los Angeles', -118.24, 34.05, 'mm'], ['Miami', -80.19, 25.76, 'mm']];
function vAshMap(ctx, u) {
  space(ctx, u);
  const R = 1600, cx = W / 2, cy = 1180, lon0 = -98, lat0 = 39, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0, -0.3, 1], clouds: 0.2 });
  const [yx, yy] = v(...YS), X = cx + yx * R, Y = cy + yy * R, k = easeOut(prog(u, 0.3, 4.2));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); ctx.translate(X, Y); ctx.scale(1.7, 1); ctx.translate(300 * k / 1.7, 0);
  for (const [rad, a] of [[1150, 0.55], [720, 0.6], [400, 0.75], [170, 0.95]]) { const rr = rad * k, g = ctx.createRadialGradient(0, 0, 0, 0, 0, rr + 1);
    g.addColorStop(0, `rgba(90,84,84,${a})`); g.addColorStop(0.7, `rgba(110,104,102,${a * 0.6})`); g.addColorStop(1, 'rgba(120,112,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rr + 1, 0, 6.283); ctx.fill(); }
  ctx.restore();
  glow(ctx, X, Y, 60, '255,140,50', 0.9); ctx.fillStyle = '#ff7a2a'; ctx.beginPath(); ctx.arc(X, Y, 12, 0, 6.283); ctx.fill();
  USC.forEach(([name, lon, lat, depth], i) => { const [x, y, z] = v(lon, lat); const sxx = cx + x * R, syy = cy + y * R, at = 0.8 + i * 0.25; if (u < at || syy < 560 || sxx < 40 || sxx > W - 40) return;
    const a = R2((u - at) / 0.3); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(sxx, syy, 8, 0, 6.283); ctx.fill();
    ctx.font = `800 36px ${FONT}`; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 12; ctx.fillStyle = '#ffffff'; const lx = Math.max(130, Math.min(W - 130, sxx)); ctx.fillText(name, lx, syy - 20);
    ctx.font = `900 36px ${FONT}`; ctx.fillStyle = '#ffd27a'; ctx.fillText(depth, lx, syy + 38); ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['Ash falls on most', 'of the United States'], 230, 0.15, { size: 84, out: OUT('ash') });
}

// ================================================================ 6. a town under ash
function house(ctx, x, base, w, h, col, sag) { ctx.save(); ctx.translate(x, base); ctx.fillStyle = col; ctx.fillRect(-w / 2, -h, w, h);
  ctx.fillStyle = 'rgba(255,220,150,0.8)'; ctx.fillRect(-w * 0.3, -h * 0.7, w * 0.18, h * 0.3); ctx.fillRect(w * 0.12, -h * 0.7, w * 0.18, h * 0.3);
  ctx.fillStyle = '#9a9290'; ctx.beginPath(); ctx.moveTo(-w * 0.6, -h); ctx.lineTo(0, -h - h * 0.7 * (1 - sag) + sag * h * 0.3); ctx.lineTo(w * 0.6, -h); ctx.fill(); ctx.restore(); }
function vTown(ctx, u) {
  const depth = easeOut(prog(u, 0, 5)) * 80;
  bgSky(ctx, ['#4a4440', '#7a706a', '#a09890']);
  mountains(ctx, 1100, 21, '#6a625e', 120);
  ctx.fillStyle = '#8a827e'; ctx.fillRect(0, 1250, W, H);
  [[140, 1300, '#6a8ac0', 0], [420, 1320, '#c07a6a', 0], [720, 1300, '#8ac07a', 1], [960, 1320, '#c0b06a', 0]].forEach(([x, b, c, collapses]) =>
    house(ctx, x, b, 220, 160, c, collapses ? easeIn2(R2((u - 2.7) / 0.5)) : 0));
  if (u > 2.7 && u < 3.6) { const r = rng(4); for (let i = 0; i < 30; i++) puff(ctx, 720 + (r() - 0.5) * 300, 1200 - r() * 200 * (u - 2.7), 40 + r() * 40, '#b0a8a4', 0.6 * (1 - (u - 2.7) / 0.9)); }
  // power line sparking
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 980); ctx.quadraticCurveTo(W / 2, 1060, W, 980); ctx.stroke();
  if (Math.sin(u * 23) > 0.8 && u > 1.5) glow(ctx, 540, 1020, 120, '200,230,255', 0.9);
  // street, cars stalled under ash
  ctx.fillStyle = '#5a5250'; ctx.fillRect(0, 1450, W, 260);
  for (const [x, c] of [[200, '#3a86ff'], [620, '#ff5d8f'], [920, '#ffbe0b']]) { ctx.fillStyle = c; roundRect(ctx, x - 110, 1580, 220, 70, 20); ctx.fill(); roundRect(ctx, x - 70, 1540, 140, 50, 16); ctx.fill();
    ctx.fillStyle = '#b8b0ac'; roundRect(ctx, x - 110, 1576 - depth * 0.2, 220, 14 + depth * 0.2, 8); ctx.fill(); }
  // people with masks walking through the ash
  [[350, 3], [520, 6]].forEach(([x, s]) => { person2(ctx, x + u * 30, 1840, 260, { seed: s, t: u, grey: 0.35 }); ctx.fillStyle = '#ffffff'; roundRect(ctx, x + u * 30 - 28, 1840 - 260 * 0.84, 56, 30, 10); ctx.fill(); });
  ctx.fillStyle = '#b8b0ac'; ctx.fillRect(0, H - depth * 2, W, depth * 2);
  const r = rng(6); ctx.fillStyle = 'rgba(200,192,188,0.9)'; for (let i = 0; i < 400; i++) { const x = (r() * W + u * 20 * r()) % W, y = (r() * H + u * (50 + r() * 70)) % H; ctx.fillRect(x, y, 3 + r() * 3, 3 + r() * 3); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.65);
  say(ctx, u, ['10 cm of wet ash', 'can collapse a roof'], 230, 0.15, { size: 84, out: 2.6 });
  say(ctx, u, ['Ash kills jet engines.', 'Every flight is grounded.'], 230, 2.7, { size: 76, out: OUT('town') });
}

// ================================================================ 7. the corn belt buried
function vFarm(ctx, u) {
  const ash = easeInOut(prog(u, 0.6, 3.6));
  bgSky(ctx, [mixHex('#7ab8e8', '#5a5250', ash), mixHex('#b8dcf0', '#8a827e', ash), mixHex('#f0e8c8', '#a09890', ash)]);
  ctx.fillStyle = mixHex('#4a7a2a', '#8a827e', ash); ctx.fillRect(0, 1000, W, H);
  for (let row = 0; row < 16; row++) { const q = row / 15, y = 1020 + q * q * 900, s = 0.2 + q * 1.6, n = Math.floor(28 - q * 16);
    for (let i = 0; i < n; i++) { const x = (i + (row % 2) * 0.5) / n * W, bend = ash * 0.9 * (0.5 + 0.5 * Math.sin(i * 7 + row)), h = 90 * s;
      ctx.strokeStyle = mixHex('#5aa02a', '#9a928e', ash); ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + bend * h * 0.3, y - h * 0.6, x + bend * h * 0.8, y - h * (1 - bend * 0.5)); ctx.stroke();
      if (s > 0.6) { ctx.fillStyle = mixHex('#f2c84a', '#a8a09c', ash); ctx.beginPath(); ctx.ellipse(x + bend * h * 0.3, y - h * 0.55, 6 * s, 14 * s, bend, 0, 6.283); ctx.fill(); } } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['The U.S. grows about a', 'third of the world’s corn'], 230, 0.15, { size: 76, out: OUT('farm'), mark: { line: 1, from: 0, to: 5, color: '#e8a01e' } });
  if (u > 2.0) { scrimB(ctx, 1500, 0.6); say(ctx, u, ['This year’s harvest:', 'buried.'], 1640, 2.0, { size: 64, weight: 900, out: OUT('farm') }); }
}

// ================================================================ 8. volcanic winter, worldwide
function vWinter(ctx, u) {
  space(ctx, u);
  const R = 470, cx = W / 2, cy = 1160, k = easeInOut(prog(u, 0.2, 4.0));
  globe(ctx, cx, cy, R, { lon0: -100 + u * 30, lat0: 30, t: u, ink: false, clouds: 0.3 });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const g = ctx.createLinearGradient(cx - R, 0, cx + R, 0); g.addColorStop(0, `rgba(230,225,220,${0.75 * k})`); g.addColorStop(R2(k * 1.2), `rgba(230,225,220,${0.6 * k})`); g.addColorStop(1, `rgba(230,225,220,${0.15 * k})`);
  ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  glow(ctx, cx, cy, R * 1.25, '230,225,220', 0.35 * k);
  const r = rng(8); ctx.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 160 * k; i++) { const x = r() * W, y = (r() * H + u * (40 + r() * 60)) % H; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 3, 0, 6.283); ctx.fill(); }
  const tmp = lerp(0, -5, k);
  bigNum(ctx, u, `${tmp <= -0.05 ? '−' : ''}${Math.abs(tmp).toFixed(1)}°C`, 1760, 0.4, { size: 110, color: '#9ad8ff', out: OUT('winter') });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Ash and sulfur', 'veil the whole planet'], 230, 0.15, { size: 84, out: 2.6 });
  say(ctx, u, ['Years of volcanic winter.', 'Snow in summer.'], 230, 2.7, { size: 76, out: OUT('winter') });
  if (u > 1.0) say(ctx, u, ['global cooling, est. (models vary)'], 1640, 1.0, { size: 36, weight: 700, x: W / 2, align: 'center', out: OUT('winter'), color: 'rgba(255,255,255,0.8)' });
}

// ================================================================ 9. the toll
function vToll(ctx, u) {
  bgSky(ctx, ['#2a2440', '#3a3050', '#4a3a5a']);
  // empty shelves and a soaring price tag
  for (let s = 0; s < 4; s++) { const y = 900 + s * 200; ctx.fillStyle = '#d8d4e0'; ctx.fillRect(80, y, W - 160, 22); const r = rng(s + 3);
    for (let i = 0; i < 10; i++) if (r() < 0.25 * (1 - prog(u, 0.5, 2.5))) { ctx.fillStyle = ['#ff7a59', '#ffbe0b', '#2ec4b6'][i % 3]; ctx.fillRect(100 + i * 88, y - 70, 60, 70); } }
  const k = easeIn2(prog(u, 0.6, 3.4)), py = lerp(1600, 980, k);
  ctx.save(); ctx.translate(820, py); ctx.rotate(-0.15); ctx.fillStyle = '#ffd25a'; roundRect(ctx, -110, -60, 220, 120, 20); ctx.fill();
  ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#1b1b2e'; ctx.fillText(`$${(4 * Math.pow(10, k * 1.2)).toFixed(0)}`, 0, 22); ctx.restore();
  ctx.font = `800 28px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('a box of cereal', 820, py + 100);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Killed outright:', 'tens of thousands (est.)'], 230, 0.15, { size: 76, out: OUT('toll') });
  say(ctx, u, ['Worldwide famine:', 'millions (est.)'], 1620, 2.4, { size: 76, out: OUT('toll'), color: '#ffd25a' });
}

// ================================================================ 10. relax: it is not overdue
function vRelax(ctx, u) {
  bgSky(ctx, ['#4f9be0', '#8ccaf0', '#d0ecff']);
  drift(ctx, u, 0, 5, 1.05, 1.0, W / 2, 1300);
  mountains(ctx, 1150, 3, '#7a8aa8', 260); mountains(ctx, 1250, 4, '#5a7a6a', 180);
  ctx.fillStyle = '#c8b898'; ctx.fillRect(0, 1250, W, H);
  prismatic(ctx, W / 2, 1520, 1.1); geyserCol(ctx, 300, 1360, 650, u * 0.8, 1);
  bison(ctx, 720, 1700, 1.4, u); bison(ctx, 930, 1640, 1.0, u);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 640, 0.55);
  say(ctx, u, ['Relax: it’s not', '“overdue.”'], 230, 0.15, { size: 96, out: OUT('relax') });
  say(ctx, u, ['Odds of a supereruption:', '1 in 730,000 a year (USGS)'], 470, 1.2, { size: 54, weight: 800, out: OUT('relax') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -100 + u * 4, lat0: 35, t: u, ink: false });
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
