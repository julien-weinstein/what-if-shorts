// What if gravity suddenly doubled?   (format: the first hours, minute by minute)
//
// PHYSICS (worked in python; scratch model: 2-layer Earth, Birch–Murnaghan EOS, hydrostatic, fixed mass):
//  - Weight doubles instantly. A 1 m fall takes 0.32 s instead of 0.45 s; impact speed x1.41, energy x2.
//  - Bodies: the heart pumps against double weight; healthy people stay conscious at 2g (blackout ~4-5g) but the frail faint.
//  - Structures are designed with ~1.5-2x margins on gravity loads -> many roofs, balconies, bridges and towers fail.
//  - Airliners (~10,000 airborne) suddenly need 2x lift: dive for speed and denser low air (sea-level density ~1.6x).
//  - Orbits: velocity unchanged, mu doubled -> new perigee = r/3. ISS/Starlink perigee falls inside Earth: re-entry within
//    ~10-15 minutes (half-orbit ~18 min). GPS perigee ~2,500 km altitude: they survive but on wrong orbits.
//  - Atmosphere: same mass, double weight -> surface pressure ~2 atm, scale height 8.5 -> ~4.25 km. Rapid (minutes)
//    adiabatic compression: T x 2^0.286 = x1.22 -> 15 °C average air -> ~78 °C; poles -20 °C -> ~35 °C. Radiative cooling
//    takes weeks.
//  - The planet: rock is crushed too. Model: R 6,256 -> 5,968 km (-288 km, -4.6%); surface gravity ends ~2.2x.
//    Crust shortened ~4.6% (rock breaks at ~0.1%): it shatters everywhere. Energy dissipated ~half of
//    0.6 x 2G M² (1/R2 - 1/R1) ≈ 1e31 J ≈ ~30 million Chicxulub impacts (4e23 J), mostly deep inside.
//    Even x1.1 gravity -> -32 km and ~2 million impacts' worth: there is no gentle multiplier.
//  - Moon: perigee 384,400 -> ~128,000 km (3x closer, looks 3x wider), period ~10.6 days; tidal pull x27, tide heights ~x13.
//  - Toll: nearly everyone (~8 billion) within hours to days; deep shelters at high latitude are the only hedge.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.4'], [1.2, 'impact'], [1.25, 'boom']]],
  ['weight', 4.5, [[0.2, 'heart:4.2'], [0.4, 'impact']]],
  ['body', 4.0, [[0.1, 'heart:3.8']]],
  ['collapse', 4.5, [[0.2, 'rumble:4.2'], [0.9, 'boom'], [0.95, 'impact'], [2.0, 'boom'], [2.1, 'roar:2.2']]],
  ['plane', 4.5, [[0.2, 'roar:4.2'], [1.5, 'drawback:2.0']]],
  ['sats', 4.5, [[0.2, 'swell:4.2'], [1.6, 'air'], [2.6, 'air']]],
  ['air', 5.0, [[0.2, 'drawback:2.0'], [0.4, 'rumble:4.4']]],
  ['squeeze', 5.0, [[0.2, 'rumble:4.6'], [0.6, 'boom'], [2.4, 'boom']]],
  ['shatter', 5.0, [[0.2, 'roar:4.6'], [0.5, 'boom'], [1.6, 'boom'], [2.8, 'boom']]],
  ['erupt', 4.5, [[0.2, 'roar:4.2'], [0.6, 'boom'], [0.65, 'impact'], [2.2, 'boom']]],
  ['moon', 4.5, [[0.2, 'swell:4.2'], [1.6, 'drawback:2.4']]],
  ['toll', 4.0, [[0.2, 'heart:3.8']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if gravity suddenly doubled?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookG, weight: vWeightG, body: vBodyG, collapse: vCollapseG, plane: vPlaneG, sats: vSatsG, air: vAirG, squeeze: vSqueezeG,
              shatter: vShatterG, erupt: vEruptG, moon: vMoonG, toll: vTollG, final: vFinalG, end: vEndG };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const CLOCK = { weight: 'T + 1 second', body: 'T + 10 seconds', collapse: 'T + 30 seconds', plane: 'T + 1 minute', sats: 'T + 10 minutes', air: 'T + 15 minutes',
  squeeze: 'T + 20 minutes', shatter: 'T + 30 minutes', erupt: 'T + 1 hour', moon: 'T + 5 days' };
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => { const u = Math.max(0, tt - START[n]); FNS[n](c, u); if (CLOCK[n]) clockBadge(c, u, CLOCK[n]); }]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.26, contrast: 1.08, saturate: 1.15, vignette: 0.36 });
}
function clockBadge(ctx, u, txt) { ctx.setTransform(1, 0, 0, 1, 0, 0); const a = R2(u / 0.3); ctx.globalAlpha = a; ctx.font = `900 50px ${FONT}`; const w = ctx.measureText(txt).width + 60;
  ctx.fillStyle = 'rgba(20,24,60,0.75)'; ctx.beginPath(); ctx.roundRect(540 - w / 2, 1700, w, 84, 42); ctx.fill(); ctx.fillStyle = '#ffd25a'; ctx.textAlign = 'center'; ctx.fillText(txt, 540, 1760); ctx.globalAlpha = 1; }
function lavaFlame(ctx, x, y, s, u, seed = 1) { const r = rng(seed); glow(ctx, x, y - s * 0.4, s * 1.6, '255,150,50', 0.7);
  for (let i = 0; i < 6; i++) { const dx = (r() - 0.5) * s, h = s * (0.8 + r()) * (0.85 + 0.15 * Math.sin(u * 7 + i * 2)), w = s * 0.22; ctx.fillStyle = i % 2 ? '#ff9a2a' : '#ffc84a';
    ctx.beginPath(); ctx.moveTo(x + dx - w, y); ctx.quadraticCurveTo(x + dx - w * 0.6, y - h * 0.6, x + dx + Math.sin(u * 5 + i) * w * 0.6, y - h); ctx.quadraticCurveTo(x + dx + w * 0.6, y - h * 0.6, x + dx + w, y); ctx.fill(); } }

// ================================================================ 1. hook: a normal street... then everyone drops
function vHookG(ctx, u) {
  const q = 1.2, k = easeOut(R2((u - q) / 0.5)), [sx, sy] = shakeOffset(u, q, 1.0, 20);
  bgSky(ctx, ['#3a7ad8', '#8ac0f0', '#ffe8c8']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1250, seed: 3, hMin: 200, hMax: 600, wMin: 70, wMax: 150, gap: 8, col: '#7a8ab8', win: 'rgba(255,240,200,0.45)', winP: 0.4, ws: 6 });
  ctx.fillStyle = '#b8b4c0'; ctx.fillRect(0, 1250, W, H);
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200, s = 300; ctx.save(); ctx.translate(x, 1720); ctx.scale(1, 1 - k * 0.45); ctx.rotate(k * (i % 2 ? 0.2 : -0.15)); person2(ctx, 0, 0, s, { seed: i + 2, t: u }); ctx.restore(); }
  if (u > q) for (let i = 0; i < 4; i++) { const x = 180 + i * 240, d = (u - q); ctx.fillStyle = ['#ffbe0b', '#3a86ff', '#2ec4b6', '#ff7aa8'][i]; ctx.beginPath(); ctx.arc(x, Math.min(1700, 1400 + 0.5 * 2400 * d * d), 18, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4)); shadowed(ctx, () => blip(ctx, u, 890, 1700, u > q ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['What if gravity', 'suddenly DOUBLED?'], 260, 0.15, { size: 96, out: OUT('hook'), mark: { line: 1, from: 9, to: 16, color: '#ffd25a' } });
}

// ================================================================ 2. T+1 s: you weigh twice as much
function vWeightG(ctx, u) {
  bgSky(ctx, ['#4a6ab8', '#9ab0e0', '#e8ecf8']);
  ctx.fillStyle = '#d8d0c4'; ctx.fillRect(0, 1350, W, H);
  // bathroom scale
  ctx.fillStyle = '#f4f4f8'; ctx.beginPath(); ctx.roundRect(300, 1420, 480, 120, 30); ctx.fill(); ctx.fillStyle = '#2a3a6a'; ctx.beginPath(); ctx.roundRect(440, 1440, 200, 60, 12); ctx.fill();
  const kg = Math.round(lerp(70, 140, easeOut(prog(u, 0.3, 1.2)))); ctx.font = `900 46px ${FONT}`; ctx.fillStyle = '#5ad0a0'; ctx.textAlign = 'center'; ctx.fillText(`${kg} kg`, 540, 1486);
  const k = easeOut(prog(u, 0.3, 1.0)); ctx.save(); ctx.translate(540, 1430); ctx.scale(1 + k * 0.05, 1 - k * 0.12); person2(ctx, 0, 0, 520, { seed: 4, t: u }); ctx.restore();
  // a "second you" on your back (ghost)
  ctx.save(); ctx.globalAlpha = 0.35 * k; ctx.translate(540, 1430 - 380 * (1 - k * 0.12)); ctx.scale(0.8, 0.8); person2(ctx, 0, 0, 400, { seed: 4, t: u }); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['You weigh double.', 'Like carrying a', 'second you'], 230, 0.15, { size: 88, out: OUT('weight') });
}

// ================================================================ 3. T+10 s: inside the body
function vBodyG(ctx, u) {
  bgSky(ctx, ['#0e2a5a', '#14386a', '#1a4a7a']);
  ctx.strokeStyle = 'rgba(120,200,255,0.12)'; ctx.lineWidth = 2; for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // x-ray silhouette
  ctx.fillStyle = 'rgba(140,210,255,0.18)'; ctx.strokeStyle = 'rgba(160,220,255,0.7)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(540, 620, 120, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(400, 760); ctx.lineTo(680, 760); ctx.lineTo(720, 1200); ctx.lineTo(640, 1210); ctx.lineTo(620, 1800); ctx.lineTo(560, 1800); ctx.lineTo(545, 1260); ctx.lineTo(535, 1260); ctx.lineTo(520, 1800); ctx.lineTo(460, 1800); ctx.lineTo(440, 1210); ctx.lineTo(360, 1200); ctx.closePath(); ctx.fill(); ctx.stroke();
  // brain dims, heart beats (~1.6 Hz, gentle), blood sinks to the legs
  const dim = easeInOut(prog(u, 0.3, 3)); glow(ctx, 540, 610, 120, '255,220,120', 0.6 * (1 - dim * 0.7));
  const beat = 1 + 0.08 * Math.max(0, Math.sin(u * 2 * Math.PI * 1.6)); ctx.fillStyle = '#ff7a8a'; ctx.save(); ctx.translate(560, 900); ctx.scale(beat, beat); ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-70, -20, -40, -70, 0, -40); ctx.bezierCurveTo(40, -70, 70, -20, 0, 30); ctx.fill(); ctx.restore();
  const r = rng(5); for (let i = 0; i < 40; i++) { const x = 470 + r() * 140, y = 900 + ((u * 300 * (0.5 + r()) + r() * 900) % 900); ctx.fillStyle = 'rgba(255,120,140,0.8)'; ctx.beginPath(); ctx.arc(x + (y > 1250 ? (x < 540 ? -10 : 30) : 0), y, 7, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = `rgba(255,120,140,${0.3 * dim})`; ctx.fillRect(460, 1500, 60, 300); ctx.fillRect(560, 1500, 60, 300);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Your heart pumps', 'against double weight'], 230, 0.15, { size: 80, out: 1.9 });
  say(ctx, u, ['Blood pools in the legs.', 'The frail faint first'], 230, 2.0, { size: 76, out: OUT('body') });
}

// ================================================================ 4. T+30 s: structures built with ~2x margins start to go
function vCollapseG(ctx, u) {
  const vt = tm(u, 0.8, 3.6, 0.5), [sx, sy] = shakeOffset(u, 0.8, 3, 16);
  bgSky(ctx, ['#3a6ac8', '#8ab8ec', '#ffe0b8']); ctx.translate(sx, sy);
  cityLayer(ctx, vt, { base: 1150, seed: 30, hMin: 220, hMax: 640, wMin: 70, wMax: 150, gap: 8, col: '#7a7ab0', win: 'rgba(255,240,200,0.45)', winP: 0.4, ws: 6, hit: x => (((x * 7) % 11) < 6 ? 0.9 + ((x * 3) % 13) / 13 * 2.2 : 1e9) });
  for (let i = 0; i < 4; i++) { const x = 120 + i * 260; dustBlast(ctx, x, 1150, vt - 1.2 - i * 0.4, 31 + i, { n: 14, spread: 400, up: 300, col: '#c8b8a8', life: 5 }); }
  // bridge in front sags and snaps
  const sag = easeIn2(R2((vt - 1.4) / 1.0)), brk = vt > 2.2; ctx.fillStyle = '#5a9ad0'; ctx.fillRect(0, 1500, W, H);
  ctx.fillStyle = '#8a8a96'; for (const x of [120, 960]) ctx.fillRect(x - 30, 1300, 60, 400);
  if (!brk) { ctx.fillStyle = '#a8a8b4'; ctx.beginPath(); ctx.moveTo(90, 1300); ctx.quadraticCurveTo(540, 1300 + sag * 180, 990, 1300); ctx.lineTo(990, 1340); ctx.quadraticCurveTo(540, 1340 + sag * 180, 90, 1340); ctx.fill(); }
  else { const d = vt - 2.2, drop = Math.min(400, 0.5 * 2400 * d * d); for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd < 0 ? 90 : 990, 1320); ctx.rotate(sd * -Math.min(1.1, d * 1.6)); ctx.fillStyle = '#a8a8b4'; ctx.fillRect(sd < 0 ? 0 : -450, -20, 450, 40); ctx.restore(); }
    for (let i = 0; i < 20; i++) { const r = rng(i); puff(ctx, 540 + (r() - 0.5) * 400, 1500 - r() * 200 * Math.min(1, d), 30 + r() * 40, '#e8f6ff', 0.8 * R2(1.6 - d)); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Buildings and bridges', 'have ~2x safety margins.', 'Gravity just used it up'], 230, 0.15, { size: 72, out: OUT('collapse') });
}

// ================================================================ 5. T+1 min: inside an airliner cockpit, nose down
function vPlaneG(ctx, u) {
  const pitch = -easeInOut(prog(u, 0.3, 2.0)) * 0.35 + easeInOut(prog(u, 2.8, 4.4)) * 0.2, roll = Math.sin(u * 1.3) * 0.05;
  ctx.save(); ctx.translate(540, 900); ctx.rotate(roll); ctx.translate(0, pitch * 1100); ctx.translate(-540, -900);
  bgSky(ctx, ['#1e4aa8', '#6aa8e8', '#d8ecff']);
  const gg = ctx.createLinearGradient(0, 1000, 0, 3400); gg.addColorStop(0, '#8aa8a0'); gg.addColorStop(0.3, '#6a9a5a'); gg.addColorStop(1, '#4a7a3a'); ctx.fillStyle = gg; ctx.fillRect(-600, 1000, W + 1200, 2400);
  const r = rng(7); for (let i = 0; i < 70; i++) { const y = 1010 + Math.pow(r(), 1.4) * 2300, s = 0.3 + (y - 1000) / 900; ctx.fillStyle = ['#8ab060', '#b8a870', '#6a9a50', '#c8b880'][i % 4]; ctx.fillRect(r() * W * 1.8 - 400, y, 120 * s, 40 * s); }
  for (let i = 0; i < 26; i++) { const yb = 1040 + ((r() * 1800 + u * 260 * (0.5 + r())) % 2000), s = 0.4 + (yb - 1000) / 700, x = r() * W * 1.6 - 300; ctx.fillStyle = 'rgba(248,250,255,0.9)';
    for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(x + j * 90 * s, yb + Math.sin(j) * 10 * s, 140 * s, 34 * s, 0, 0, 6.283); ctx.fill(); } }
  ctx.restore();
  ctx.fillStyle = '#1e2a4a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 260); ctx.quadraticCurveTo(540, 180, 0, 260); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(540, 1380, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.fillRect(520, 200, 40, 1250); ctx.fillRect(0, 200, 50, 1300); ctx.fillRect(W - 50, 200, 50, 1300);
  // gauges: altitude unwinding, warning light (slow, under 2 Hz)
  const alt = Math.round(lerp(11000, 4200, easeInOut(prog(u, 0.3, 4.2)))); ctx.fillStyle = '#2e3e66'; ctx.beginPath(); ctx.roundRect(120, 1560, 360, 110, 16); ctx.fill(); ctx.beginPath(); ctx.roundRect(600, 1560, 360, 110, 16); ctx.fill();
  ctx.font = `900 46px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#5ad0a0'; ctx.fillText(`ALT ${alt.toLocaleString()} m`, 300, 1632);
  ctx.fillStyle = `rgba(255,190,60,${0.55 + 0.35 * Math.sin(u * 2 * Math.PI * 1.2)})`; ctx.fillText('STALL', 780, 1632);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['~10,000 airliners suddenly', 'need double the lift'], 260, 0.15, { size: 72, out: 2.2 });
  say(ctx, u, ['They dive for speed and', 'thicker air. Not all', 'pull out'], 260, 2.3, { size: 72, out: OUT('plane') });
}

// ================================================================ 6. T+10 min: every low-orbit satellite falls
function vSatsG(ctx, u) {
  space(ctx, u);
  const R = 640, cx = 540, cy = 1250;
  globe(ctx, cx, cy, R, { lon0: -40 + u * 3, lat0: 15, t: u, ink: false, clouds: 0.35 });
  const r = rng(8);
  for (let i = 0; i < 120; i++) { const a0 = r() * 6.283, sp = 0.5 + r() * 0.4, rad0 = R * (1.07 + r() * 0.05), k = R2((u - r() * 1.2) / 3.0), a = a0 + u * sp * 0.6, rad = lerp(rad0, R * 0.99, easeIn2(k));
    const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad * 0.35 - (Math.sin(a) > 0 ? 0 : 0); if (Math.sin(a) > 0 && rad < R * 1.02 && Math.abs(Math.cos(a)) < 0.9) continue;
    if (k > 0.55) { const t2 = (k - 0.55) / 0.45; ctx.strokeStyle = `rgba(255,200,110,${0.8 * (1 - t2 * 0.6)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.sin(a) * 40, y + Math.cos(a) * 14); ctx.stroke(); glow(ctx, x, y, 18, '255,210,130', 0.9); }
    else { ctx.fillStyle = '#e8f0ff'; ctx.fillRect(x - 3, y - 3, 6, 6); } }
  // the ISS
  const ik = R2((u - 0.6) / 3.2), ia = 3.6 + u * 0.5, irad = lerp(R * 1.1, R * 0.99, easeIn2(ik)), ix = cx + Math.cos(ia) * irad, iy = cy + Math.sin(ia) * irad * 0.35 - 80 * (1 - ik);
  ctx.save(); ctx.translate(ix, iy); ctx.fillStyle = '#d8dce8'; ctx.fillRect(-40, -5, 80, 10); ctx.fillStyle = '#3a86ff'; ctx.fillRect(-70, -18, 26, 36); ctx.fillRect(44, -18, 26, 36); ctx.restore();
  if (ik > 0.6) glow(ctx, ix, iy, 60, '255,190,100', ik);
  ctx.font = `800 32px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText('ISS', ix, iy - 40);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Satellites are suddenly', 'too slow to stay up'], 230, 0.15, { size: 80, out: 2.2 });
  say(ctx, u, ['The ISS and ~10,000', 'satellites burn up as', 'shooting stars'], 230, 2.3, { size: 76, out: OUT('sats') });
}

// ================================================================ 7. T+15 min: the sky sinks and cooks
function vAirG(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.6)), [sx, sy] = shakeOffset(u, 0.3, 3.5, 6);
  bgSky(ctx, [mixHex('#3a7ad8', '#e8a060', k), mixHex('#8ac0f0', '#ffc080', k), mixHex('#e8f4ff', '#ffe0a0', k)]); ctx.translate(sx, sy);
  // cloud deck sinking from ~8 km to ~4 km
  const top = 380, base = 1450, kmPx = (base - top) / 10, deck = lerp(8, 4, k);
  for (let i = 0; i < 12; i++) puff(ctx, 40 + i * 90, base - deck * kmPx + Math.sin(i * 2) * 20, 70, '#f4f4f8', 0.9);
  cityLayer(ctx, u, { base, seed: 40, hMin: 160, hMax: 520, wMin: 60, wMax: 130, gap: 8, col: mixHex('#7a8ab8', '#9a7a8a', k), win: 'rgba(255,240,200,0.45)', winP: 0.4, ws: 6 });
  ctx.fillStyle = '#b8a890'; ctx.fillRect(0, base, W, H);
  // heat shimmer
  ctx.strokeStyle = `rgba(255,240,220,${0.25 * k})`; ctx.lineWidth = 3; for (let i = 0; i < 16; i++) { const y = base - 40 - i * 30; ctx.beginPath(); for (let x = 0; x <= W; x += 30) { const yy = y + Math.sin(x * 0.03 + u * 5 + i) * 6; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
  // thermometer
  const T = Math.round(lerp(15, 78, k)); ctx.fillStyle = '#f4f4f8'; ctx.beginPath(); ctx.roundRect(900, 700, 70, 760, 35); ctx.fill(); ctx.beginPath(); ctx.arc(935, 1480, 70, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ff8a3a'; const fh = lerp(150, 700, (T - 15) / 63); ctx.fillRect(915, 1450 - fh, 40, fh); ctx.beginPath(); ctx.arc(935, 1480, 52, 0, 6.283); ctx.fill();
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.fillText(`${T} °C`, 870, 800);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['The air weighs double.', 'The whole sky sinks', 'and gets squeezed'], 230, 0.15, { size: 74, out: 2.4 });
  say(ctx, u, ['Squeezed air heats up:', '~78 °C on average'], 230, 2.5, { size: 78, out: OUT('air') });
}

// ================================================================ 8. T+20 min: Earth itself is crushed smaller (cross-section)
function vSqueezeG(ctx, u) {
  space(ctx, u);
  const k = easeInOut(prog(u, 0.4, 3.6)), cx = 540, cy = 1650, R0 = 1050, R = R0 * (1 - 0.046 * k), [sx, sy] = shakeOffset(u, 0.6, 4, 10 * k); ctx.translate(sx, sy);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.arc(cx, cy, R0, Math.PI, 0); ctx.stroke(); ctx.setLineDash([]);
  const L = [[1, '#c8a070'], [0.985, '#ff9a3a'], [0.55, '#ffc84a'], [0.19, '#fff0a0']];
  for (const [f, col] of L) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * f); g.addColorStop(0, mixHex(col, '#ffffff', 0.2)); g.addColorStop(1, col); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * f, Math.PI, 0); ctx.fill(); }
  for (let i = 0; i < 9; i++) { const a = Math.PI + (i + 0.5) / 9 * Math.PI, r1 = R0 * 1.1, r2 = R0 * 1.02; ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke(); }
  ctx.font = `800 34px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText('mantle', cx, cy - R * 0.75); ctx.fillText('core', cx, cy - R * 0.33);
  ctx.font = `900 44px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.fillText(`−${Math.round(288 * k)} km`, cx, cy - R0 - 40);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Rock gets crushed too.', 'Earth shrinks ~290 km'], 230, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['and gravity climbs', 'to ~2.2x'], 230, 2.5, { size: 84, out: OUT('squeeze') });
}

// ================================================================ 9. T+30 min: from orbit, the crust shatters everywhere
function vShatterG(ctx, u) {
  space(ctx, u);
  const R = 600, cx = 540, cy = 1150, lon0 = -60 + u * 4, v = gView(lon0, 20), [sx, sy] = shakeOffset(u, 0.4, 4.6, 8); ctx.translate(sx, sy);
  globe(ctx, cx, cy, R, { lon0, lat0: 20, t: u, ink: false, clouds: 0.25 });
  const P = gProj(v, cx, cy, R), r = rng(9), k = easeOut(prog(u, 0.3, 4.2));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (let i = 0; i < 46; i++) { let lo = r() * 360 - 180, la = r() * 140 - 70; const len = Math.floor(6 + r() * 14), at = r() * 0.7; const kk = R2((k - at) / 0.4); if (kk <= 0) continue; const pts = [[lo, la]];
    for (let s = 0; s < len; s++) { lo += (r() - 0.5) * 14; la += (r() - 0.5) * 8; pts.push([lo, la]); } const n = Math.max(1, Math.floor(pts.length * kk));
    for (const [lw, col] of [[16, 'rgba(255,170,60,0.35)'], [5, '#ffd27a']]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let pen = false; for (let s = 0; s < n; s++) { const [x, y, z] = v(...pts[s]); if (z > 0.05) { pen ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); pen = true; } else pen = false; } ctx.stroke(); } }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The crust gets squeezed', '~4.6% shorter. Rock', 'breaks at ~0.1%'], 230, 0.15, { size: 74, out: 2.4 });
  say(ctx, u, ['It shatters everywhere', 'at once'], 230, 2.5, { size: 84, out: OUT('shatter') });
}

// ================================================================ 10. T+1 h: the energy comes out
function vEruptG(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0, 4.4, 18); bgSky(ctx, ['#4a3a8a', '#9a6aa0', '#ffb070']); ctx.translate(sx, sy);
  const r = rng(10);
  ctx.fillStyle = '#7a6a8a'; ctx.beginPath(); ctx.moveTo(-50, 1250); ctx.lineTo(260, 760); ctx.lineTo(340, 780); ctx.lineTo(700, 1250); ctx.fill();
  for (let i = 0; i < 40; i++) { const f = r(), y = lerp(760, 150, f * easeOut(prog(u, 0.2, 3.8))); puff(ctx, 300 + (r() - 0.5) * (200 + f * 600) + u * 30 * f, y, 60 + f * 120, mixHex('#a898b0', '#6a5a7a', f), 0.85); }
  for (let i = 0; i < 50; i++) { const t0 = r() * 3, d = ((u + t0) % 1.6), a = -Math.PI / 2 + (r() - 0.5) * 0.9, sp = 600 + r() * 600, x = 300 + Math.cos(a) * sp * d, y = 770 + Math.sin(a) * sp * d + 900 * d * d; ctx.fillStyle = r() < 0.5 ? '#ffb04a' : '#ffe08a'; ctx.beginPath(); ctx.arc(x, y, 8 + r() * 8, 0, 6.283); ctx.fill(); }
  lavaFlame(ctx, 300, 790, 120, u, 3);
  ctx.fillStyle = '#9a8a7a'; ctx.fillRect(0, 1250, W, H);
  // a fissure rips across the plain, glowing
  const fk = easeOut(prog(u, 0.6, 2.2)); ctx.strokeStyle = '#ffb04a'; ctx.lineWidth = 26 * fk; ctx.beginPath(); ctx.moveTo(-20, 1500); for (let x = 0; x <= W * fk; x += 40) ctx.lineTo(x, 1500 + Math.sin(x * 0.02) * 40 + (x / W) * 120); ctx.stroke();
  for (let x = 0; x < W * fk; x += 120) lavaFlame(ctx, x, 1500 + Math.sin(x * 0.02) * 40 + (x / W) * 120, 70, u, x);
  cityLayer(ctx, u, { base: 1250, seed: 11, hMin: 60, hMax: 200, wMin: 40, wMax: 90, gap: 10, col: '#6a6a8a', x0: 640, win: 'rgba(255,220,160,0.4)', winP: 0.3, ws: 4, hit: x => 0.8 + (x - 640) / 600 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['The squeeze unleashes', 'the energy of ~30 million', 'dinosaur-killer impacts'], 230, 0.15, { size: 72, out: OUT('erupt') });
}

// ================================================================ 11. T+5 days: the Moon falls into a tighter orbit
function vMoonG(ctx, u) {
  bgSky(ctx, ['#0e1a4a', '#1e2a6a', '#3a3a7a']); stars(ctx, u);
  const k = easeInOut(prog(u, 0.2, 3.4)), mr = lerp(80, 240, k), my = lerp(600, 760, k);
  glow(ctx, 540, my, mr * 2.2, '220,230,255', 0.5); moonFx(ctx, 540, my, mr, { t: u });
  ctx.fillStyle = '#2a3a6a'; ctx.fillRect(0, 1250, W, H);
  const tide = Math.sin(u * 1.6) * 60 * k + k * 120; ctx.fillStyle = '#3a6aa8'; ctx.fillRect(0, 1250 - tide, W, H); for (let x = 0; x < W; x += 60) puff(ctx, x, 1250 - tide + Math.sin(x * 0.03 + u * 3) * 10, 20, '#e8f6ff', 0.5);
  cityLayer(ctx, u, { base: 1300, seed: 12, hMin: 80, hMax: 300, wMin: 50, wMax: 110, gap: 8, col: '#1e2a5a', win: 'rgba(255,220,160,0.35)', winP: 0.25, ws: 5, x0: 600 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The Moon swings 3x closer', 'every ~10 days'], 230, 0.15, { size: 78, out: 2.2 });
  say(ctx, u, ['Its pull is 27x stronger.', 'Tides ~13x higher'], 230, 2.3, { size: 76, out: OUT('moon') });
}

// ================================================================ 12. toll
function vTollG(ctx, u) {
  bgSky(ctx, ['#2a2050', '#3a2a6a', '#5a3a7a']);
  const r = rng(13); for (let i = 0; i < 40; i++) { const x = r() * W, y = H - ((u * 80 * (0.5 + r()) + r() * H) % H); ctx.fillStyle = `rgba(255,190,90,${0.5 + 0.3 * Math.sin(u + i)})`; ctx.beginPath(); ctx.arc(x, y, 3 + r() * 4, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'Within hours to days:', 640, 0.2, { size: 60, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'nearly everyone', 770, 0.5, { size: 104, color: '#ffd25a', out: OUT('toll') });
  bigNum(ctx, u, '~8 billion people', 900, 1.2, { size: 66, color: '#ffffff', out: OUT('toll') });
  say(ctx, u, ['Even +10% gravity would', 'crack the planet. There’s', 'no gentle version'], 1150, 1.9, { size: 60, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 13. final: a smaller, cracked, glowing Earth with the Moon looming
function vFinalG(ctx, u) {
  space(ctx, u);
  const R = 520, cx = 540, cy = 1200, lon0 = 20 + u * 3, v = gView(lon0, 15);
  glow(ctx, cx, cy, R * 1.5, '255,170,80', 0.35);
  globe(ctx, cx, cy, R, { lon0, lat0: 15, t: u, ink: false, clouds: 0.2, atmo: '255,190,120' });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); ctx.fillStyle = 'rgba(80,50,60,0.35)'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  const r = rng(14); for (let i = 0; i < 50; i++) { let lo = r() * 360 - 180, la = r() * 140 - 70; const pts = [[lo, la]]; for (let s = 0; s < 14; s++) { lo += (r() - 0.5) * 14; la += (r() - 0.5) * 8; pts.push([lo, la]); }
    for (const [lw, col] of [[14, 'rgba(255,170,60,0.4)'], [4, '#ffd27a']]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let pen = false; for (const p of pts) { const [x, y, z] = v(...p); if (z > 0.05) { pen ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); pen = true; } else pen = false; } ctx.stroke(); } }
  ctx.restore();
  const mx = lerp(980, 900, u / 5), my = 560; moonFx(ctx, mx, my, 150, { t: u });
  for (let i = 0; i < 14; i++) { const a = (i / 14) * 6.283 + u * 0.4, x = cx + Math.cos(a) * R * 1.15, y = cy + Math.sin(a) * R * 0.3 - 40; if (Math.sin(a) > 0) continue; glow(ctx, x, y, 14, '255,210,130', 0.9); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Double the gravity, and', 'the planet crushes itself'], 230, 0.15, { size: 80, out: OUT('final') });
}
function vEndG(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: 20 + u * 4, lat0: 15, t: u, ink: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ tsunami toolkit
let _OC = null;
function ocx() { if (!_OC) { _OC = document.createElement('canvas'); _OC.width = W; _OC.height = H; } const g = _OC.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H); return g; }
function gProj(v, cx, cy, R) { return ([lo, la]) => { let [x, y, z] = v(lo, la); if (z < 0) { const m = Math.hypot(x, y) || 1; x /= m; y /= m; } return [cx + x * R, cy + y * R]; }; }
function discsGlobe(g, P, srcs, d) { g.beginPath(); for (const s of srcs) { for (let b = 0; b <= 6.3; b += 0.06) { const p = P(dest(s[0], s[1], b, d)); b ? g.lineTo(...p) : g.moveTo(...p); } g.closePath(); } }
function landGlobe(g, P, v) { g.beginPath(); for (const poly of LAND) { let hid = 0; for (const [lo, la] of poly) if (v(lo, la)[2] < 0) hid++; if (hid > poly.length * 0.3 || poly.some(([lo, la]) => la < -60)) continue;
  poly.forEach((p, i) => i ? g.lineTo(...P(p)) : g.moveTo(...P(p))); g.closePath(); } }
// whole-ocean tsunami from orbit: passed water tinted, a bright front band, land masked out
function tsunamiGlobe(ctx, v, cx, cy, R, srcs, dRad, band = 0.035) {
  if (dRad <= 0) return; const P = gProj(v, cx, cy, R);
  let g = ocx(); g.fillStyle = '#bfe8ff'; discsGlobe(g, P, srcs, dRad); g.fill('nonzero');
  g.globalCompositeOperation = 'destination-out'; landGlobe(g, P, v); g.fill('nonzero'); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, R, 2 * Math.PI, 0, true); g.fill();
  ctx.save(); ctx.globalAlpha = 0.22; ctx.drawImage(_OC, 0, 0); ctx.restore();
  g = ocx(); g.fillStyle = '#ffffff'; discsGlobe(g, P, srcs, dRad); g.fill('nonzero');
  g.globalCompositeOperation = 'destination-out'; discsGlobe(g, P, srcs, Math.max(0, dRad - band)); g.fill('nonzero'); landGlobe(g, P, v); g.fill('nonzero'); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, R, 2 * Math.PI, 0, true); g.fill();
  ctx.save(); ctx.filter = 'blur(14px)'; ctx.globalAlpha = 0.9; ctx.drawImage(_OC, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.drawImage(_OC, 0, 0); ctx.restore();
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
  bigNum(ctx, u, 'M10', 330, 0.2, { size: 190, color: '#ffd25a', out: 1.9 });
  say(ctx, u, ['The ground rolls', 'like an ocean wave'], 230, 2.0, { size: 88, out: OUT('wave') });
}

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
  say(ctx, u, ['Every freeway', 'bridge is tested.', 'Many fall'], 230, 0.15, { size: 84, out: OUT('overpass') });
}

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

function crane(ctx, x, base, s, rot, col) { ctx.save(); ctx.translate(x, base); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-70, -520); ctx.moveTo(90, 0); ctx.lineTo(70, -520); ctx.moveTo(-80, -260); ctx.lineTo(80, -260); ctx.moveTo(-90, 0); ctx.lineTo(70, -520); ctx.stroke();
  ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-420, -520); ctx.lineTo(260, -520); ctx.stroke(); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -700); ctx.lineTo(-420, -520); ctx.moveTo(0, -700); ctx.lineTo(260, -520); ctx.moveTo(0, -700); ctx.lineTo(0, -520); ctx.stroke(); ctx.restore(); }

function sea(ctx, u, hy, cols, swell = null, seed = 1) {
  const g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);
  const r = rng(seed);
  for (let j = 0; j < 40; j++) { const q = (j + 1) / 40, y0 = hy + (H - hy) * q * q, n = 6 + Math.floor(q * 8);
    for (let i = 0; i < n; i++) { const x = ((r() * W + u * 30 * (0.5 + q)) % (W + 100)) - 50, lift = swell ? swell(x / W, q) : 0, w = 20 + q * 120;
      ctx.strokeStyle = `rgba(255,255,255,${0.12 + q * 0.25})`; ctx.lineWidth = 1 + q * 4; ctx.beginPath(); ctx.moveTo(x - w, y0 - lift); ctx.quadraticCurveTo(x, y0 - lift - 3 - q * 8, x + w, y0 - lift); ctx.stroke(); } }
}
// a breaking wave wall seen side-on; front edge at x moving left, height h, base y

function waveWall(ctx, u, x, base, h, seed = 3, col = '#1f7fb0') {
  if (h <= 0) return;
  const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, '#7fd4f0'); g.addColorStop(0.35, col); g.addColorStop(1, '#0f4f7a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + h * 0.9, base); ctx.lineTo(x, base);
  ctx.quadraticCurveTo(x - h * 0.05, base - h * 0.6, x + h * 0.05, base - h * 0.95); ctx.quadraticCurveTo(x - h * 0.25, base - h * 1.05, x - h * 0.32, base - h * 0.82);
  ctx.quadraticCurveTo(x - h * 0.05, base - h * 1.25, x + h * 0.6, base - h * 1.05); ctx.lineTo(W + 600, base - h * 0.95); ctx.lineTo(W + 600, base); ctx.fill();
  const r = rng(seed); for (let i = 0; i < 26; i++) { const a = r() * 3.1, rr = h * (0.08 + r() * 0.12);
    puff(ctx, x - h * 0.2 + Math.cos(a) * h * 0.35 + Math.sin(u * 3 + i) * 8, base - h * 0.95 - Math.sin(a) * h * 0.2, rr, '#e8f6fc', 0.85); }
  for (let i = 0; i < 40; i++) { const px = x - r() * h * 0.6, py = base - h * (1 + r() * 0.4) - ((u * 200 * (0.5 + r())) % (h * 0.5)); puff(ctx, px, py, 4 + r() * 10, '#ffffff', 0.6); }
}

function dest(lon, lat, brg, d) { const D = Math.PI / 180, p1 = lat * D, l1 = lon * D;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(brg));
  const l2 = l1 + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2)); return [l2 / D, p2 / D]; }

function ringOnGlobe(ctx, v, cx, cy, R, ctr, dRad, col, lw) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let pen = false;
  for (let b = 0; b <= 6.3; b += 0.02) { const [lo, la] = dest(ctr[0], ctr[1], b, dRad), [x, y, z] = v(lo, la);
    if (z > 0) { pen ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); pen = true; } else pen = false; }
  ctx.stroke(); }

function vPort2(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.4)), lvl = lerp(1360, 1020, k), [sx, sy] = shakeOffset(u, 1.2, 2.5, 16);
  bgSky(ctx, ['#4a8ad8', '#9ac8f0', '#ffe0b8']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1000, seed: 50, hMin: 80, hMax: 340, wMin: 40, wMax: 90, gap: 6, col: '#7a8ab0', win: 'rgba(255,240,200,0.4)', winP: 0.3, ws: 4 });
  ctx.fillStyle = '#9a96a0'; ctx.fillRect(0, 1260, W, H);
  [[260, 0], [700, 0.25]].forEach(([x, d]) => crane(ctx, x, 1260, 0.9, easeIn2(R2((u - 1.3 - d) / 1.6)) * 1.2, d ? '#e6c84a' : '#ff8a3a'));
  const CC = ['#3a86ff', '#ffbe0b', '#2ec4b6', '#8338ec', '#fb5607', '#e8e8f0'], r = rng(51);
  for (let i = 0; i < 24; i++) { const c = i % 8, rw = Math.floor(i / 8), bx = 40 + c * 130, by = 1250 - rw * 60, fl = R2((u - 1.0 - r() * 0.6) / 2);
    ctx.save(); ctx.translate(bx + fl * (200 + r() * 300), Math.min(by, lvl - 30 - rw * 20 * fl) - fl * r() * 100); ctx.rotate(fl * (r() - 0.5) * 1.6); ctx.fillStyle = CC[(i * 5) % 6]; ctx.fillRect(-60, -28, 120, 56); ctx.fillStyle = 'rgba(0,0,0,0.15)'; for (let q = 0; q < 6; q++) ctx.fillRect(-52 + q * 20, -22, 6, 44); ctx.restore(); }
  // ship shoved onto the dock
  ctx.save(); ctx.translate(lerp(-300, 380, k), lvl - 20); ctx.rotate(-0.12 * k); ctx.fillStyle = '#263a6a'; ctx.beginPath(); ctx.moveTo(-380, -50); ctx.lineTo(380, -50); ctx.lineTo(330, 40); ctx.lineTo(-330, 40); ctx.fill(); ctx.fillStyle = '#e8e8f0'; ctx.fillRect(-340, -150, 90, 100); ctx.restore();
  const g = ctx.createLinearGradient(0, lvl, 0, H); g.addColorStop(0, 'rgba(60,160,210,0.9)'); g.addColorStop(1, 'rgba(20,80,130,0.95)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, lvl + Math.sin(x * 0.015 + u * 4) * 24); ctx.lineTo(W, H); ctx.fill();
  for (let x = 0; x <= W; x += 60) puff(ctx, x, lvl + Math.sin(x * 0.015 + u * 4) * 24, 28, '#f0fbff', 0.7);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['LA & Long Beach ports:', '~1/3 of US imports.', 'Wrecked.'], 230, 0.15, { size: 76, out: OUT('port') });
}

function vFires(ctx, u) {
  bgSky(ctx, ['#2a2a6a', '#4a3a8a', '#6a4a9a']);
  ctx.save(); ctx.translate(540, 1100); ctx.scale(1 + u * 0.02, 1 + u * 0.02); ctx.translate(-540, -1100);
  ctx.fillStyle = '#5a5a8a'; ctx.fillRect(-100, 500, W + 200, H);
  const r = rng(14); for (let j = 0; j < 30; j++) for (let i = 0; i < 20; i++) { const x = i * 58 - 20 + (j % 2) * 20, y = 520 + j * 50; ctx.fillStyle = ['#8a7aa8', '#9a8aa0', '#7a6a98'][(i + j) % 3]; ctx.fillRect(x, y, 48, 36); ctx.fillStyle = 'rgba(40,30,70,0.35)'; ctx.fillRect(x, y + 30, 48, 6); }
  ctx.strokeStyle = '#9a9ac0'; ctx.lineWidth = 14; for (const y of [760, 1260, 1660]) { ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); }
  const F = []; for (let i = 0; i < 12; i++) F.push([80 + r() * 920, 600 + r() * 1200, r() * 1.5, 80 + r() * 160]);
  for (const [x, y, t0, sz] of F) { const g = R2((u - t0) / 2.5), s = sz * (0.4 + g); if (u < t0) continue;
    glow(ctx, x, y, s * 1.6, '255,150,60', 0.75); for (let k = 0; k < 6; k++) puff(ctx, x + k * 30 + u * 40, y - 60 - k * 70, 40 + k * 22, '#6a5a80', 0.55);
    ctx.fillStyle = '#ffb04a'; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + u; ctx.beginPath(); ctx.arc(x + Math.cos(a) * s * 0.4, y + Math.sin(a) * s * 0.25, s * 0.18, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(x, y, s * 0.2, 0, 6.283); ctx.fill(); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Gas lines burst.', 'Thousands of fires'], 230, 0.15, { size: 76, out: 1.9 });
  say(ctx, u, ['and no water', 'to fight them'], 230, 2.0, { size: 80, out: OUT('fires') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -118 + u * 4, lat0: 30, t: u, ink: false });
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
