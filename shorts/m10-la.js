// What if a magnitude 10 earthquake hit Los Angeles?   (big-action cut: present tense, no history lessons)
//
// HONESTY NOTE (one line on screen): the San Andreas is a sideways (strike-slip) fault and tops out around M8; no known
// fault near LA can make an M10 or a big tsunami. We imagine an offshore megathrust running the whole West Coast.
//
// PHYSICS (worked in python):
//  - Rupture line Baja -> Vancouver Island ≈ 3,535 km. M0 = 4e10 x (3,500 km x 200 km) x 50 m = 1.4e24 N·m -> Mw ≈ 10.0.
//    Radiated energy ~M0 x 5e-5 ≈ 7e19 J ≈ 15 Gt TNT (est.). Rupture at ~2.7 km/s: ~22 minutes; strong shaking for minutes.
//  - Seafloor uplift several meters; near-field tsunami up to ~30 m (est.) reaching LA beaches in ~15 min.
//  - Pacific crossing at ~713 km/h (4 km depth): Hawaii 5.7 h, Lima 9.5 h, Tokyo 12.3 h, Auckland 14.6 h, Manila 16.4 h, Sydney 16.8 h.
//  - Ports of LA/Long Beach: roughly a third of US container imports (est.). California: ~world's 4th-largest economy (~$4T).
//  - The aqueducts that bring LA most of its water cross the San Andreas, which would very likely be shaken loose too (est.).
//  - West Coast + Baja + BC: ~60 million people, most within ~150 km of the rupture.
//  - Toll (rough, hedged): immediate (collapse, tsunami, fire) ~1% of those exposed -> hundreds of thousands (est.);
//    after-effects (no water or power for months, hospitals lost, disease, heat) -> hundreds of thousands more (est.);
//    total could approach ~1 million (rough est.).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6'], [1.2, 'boom'], [1.25, 'rumble:2.2']]],
  ['rupture', 5.0, [[0.2, 'rumble:4.6'], [0.3, 'roar:4.4']]],
  ['wave', 3.5, [[0.2, 'rumble:3.2'], [0.6, 'boom'], [1.6, 'boom']]],
  ['overpass', 4.5, [[0.2, 'rumble:4.2'], [1.2, 'impact'], [1.25, 'boom'], [2.9, 'impact'], [2.95, 'boom']]],
  ['downtown', 4.5, [[0.2, 'rumble:4.2'], [1.0, 'boom'], [1.05, 'impact'], [2.2, 'boom'], [2.3, 'roar:2.0']]],
  ['basin', 4.5, [[0.2, 'roar:4.2'], [0.8, 'boom'], [2.0, 'boom']]],
  ['crack', 3.5, [[0.3, 'impact'], [0.35, 'boom'], [1.5, 'impact'], [1.55, 'boom']]],
  ['tsunami', 5.0, [[0.2, 'drawback:1.6'], [1.4, 'roar:3.4'], [2.4, 'boom'], [2.45, 'impact']]],
  ['port', 3.5, [[0.2, 'roar:3.2'], [1.2, 'boom']]],
  ['fires', 3.5, [[0.2, 'roar:3.2']]],
  ['aqueduct', 4.0, [[0.4, 'impact'], [0.45, 'boom'], [0.6, 'roar:3.2']]],
  ['pacific', 4.5, [[0.2, 'swell:4.2'], [0.3, 'rumble:4.0']]],
  ['economy', 3.5, [[0.3, 'impact'], [0.4, 'drawback:2.4']]],
  ['toll', 5.5, [[0.2, 'heart:5.2']]],
  ['dark', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if a magnitude 10 earthquake hit Los Angeles?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookLA, rupture: vRupture, wave: vWave, overpass: vOverpass, downtown: vDowntown, basin: vBasin, crack: vCrack, tsunami: vTsunamiLA,
              port: vPort2, fires: vFires, aqueduct: vAqueduct, pacific: vPacific, economy: vEconomy, toll: vTollLA, dark: vDark, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const RUP = [[-110.5, 23.5], [-112.5, 26.5], [-115.5, 29.5], [-117.6, 32.3], [-118.9, 33.6], [-120.8, 34.25], [-121.9, 36.2], [-123.2, 37.7], [-124.4, 40.3], [-124.9, 43], [-124.8, 46], [-125.6, 48.5], [-128, 50.5]];
const LA = [-119, 33.7];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.26, contrast: 1.1, saturate: 1.18, vignette: 0.38 });
}
function rupPts() { const pts = []; for (let i = 0; i < RUP.length - 1; i++) for (let s = 0; s < 1; s += 0.05) pts.push([lerp(RUP[i][0], RUP[i + 1][0], s), lerp(RUP[i][1], RUP[i + 1][1], s)]); pts.push(RUP[RUP.length - 1]); return pts; }
function drawRup(ctx, P, pts, a, b, glowTips) {
  if (b <= a) return;
  for (const [lw, col] of [[34, 'rgba(255,200,90,0.3)'], [12, '#ffd25a'], [4, '#ffffff']]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = a; i <= b; i++) i === a ? ctx.moveTo(...P(pts[i])) : ctx.lineTo(...P(pts[i])); ctx.stroke(); }
  if (glowTips) { glow(ctx, ...P(pts[a]), 120, '255,230,150', 0.9); glow(ctx, ...P(pts[b]), 120, '255,230,150', 0.9); }
}

// ================================================================ 1. hook: from orbit, the coast lights up
function vHookLA(ctx, u) {
  space(ctx, u);
  const R = 900, cx = 640, cy = 1250, v = gView(-118 + u * 1.5, 34), [sx, sy] = shakeOffset(u, 1.2, 2.2, 20); ctx.translate(sx, sy);
  globe(ctx, cx, cy, R, { lon0: -118 + u * 1.5, lat0: 34, t: u, ink: false, clouds: 0.3 });
  const P = ([lo, la]) => { const [x, y] = v(lo, la); return [cx + x * R, cy + y * R]; };
  const pts = rupPts(), k = easeOut(R2((u - 1.2) / 1.6)), mid = 24;
  drawRup(ctx, P, pts, Math.max(0, Math.round(mid - k * mid)), Math.min(pts.length - 1, Math.round(mid + k * (pts.length - 1 - mid))), k < 1);
  if (u > 1.2) for (let i = 0; i < 3; i++) { const rr = (u - 1.2) * 500 - i * 160; if (rr > 0) { const [lx, ly] = P(LA); ctx.strokeStyle = `rgba(255,240,200,${0.6 * R2(1 - rr / 1200)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly, rr, 0, 6.283); ctx.stroke(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if a', 'MAGNITUDE 10', 'hit Los Angeles?'], 260, 0.15, { size: 100, out: OUT('hook'), mark: { line: 1, from: 0, to: 12, color: '#ffd25a' } });
}

// ================================================================ 2. planetary: the whole West Coast unzips; shock rings sweep the continent
function vRupture(ctx, u) {
  space(ctx, u);
  const R = 1250, cx = 700, cy = 1150, v = gView(-112, 38);
  globe(ctx, cx, cy, R, { lon0: -112, lat0: 38, t: u, ink: false, clouds: 0.25 });
  const P = ([lo, la]) => { const [x, y] = v(lo, la); return [cx + x * R, cy + y * R]; };
  const pts = rupPts(), k = easeInOut(prog(u, 0.2, 4.4)), mid = 24, a = Math.max(0, Math.round(mid - k * mid)), b = Math.min(pts.length - 1, Math.round(mid + k * (pts.length - 1 - mid)));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (let i = a; i <= b; i += 8) { const [x, y] = P(pts[i]); for (let j = 0; j < 3; j++) { const rr = ((u * 420 + j * 260 + i * 7) % 900); ctx.strokeStyle = `rgba(255,220,140,${0.35 * (1 - rr / 900)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.stroke(); } }
  ctx.restore();
  drawRup(ctx, P, pts, a, b, k < 1);
  for (const [n, lo, la] of [['Los Angeles', -118.25, 34.05], ['San Francisco', -122.42, 37.77], ['Seattle', -122.33, 47.6], ['San Diego', -117.16, 32.7], ['Portland', -122.68, 45.52], ['Vancouver', -123.1, 49.28]]) {
    const [x, y] = P([lo, la]); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.283); ctx.fill(); ctx.font = `800 34px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText(n, x + 18, y + 12); }
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.textAlign = 'center'; ctx.fillText(`minute ${Math.round(k * 22)}`, 540, 1800);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.65);
  say(ctx, u, ['Imagine a fault the whole', 'West Coast long: 3,500 km', 'snapping at once'], 220, 0.15, { size: 70, out: 2.5 });
  say(ctx, u, ['~15 gigatons of energy', 'in 22 minutes (est.)'], 220, 2.6, { size: 76, out: OUT('rupture') });
  ctx.font = `700 28px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.textAlign = 'center'; ctx.fillText('Hypothetical: no known fault here can make an M10', 540, 1870);
}

// ================================================================ 5. downtown: high-rises pancake, dust surges at the lens
function vDowntown(ctx, u) {
  const vt = tm(u, 0.9, 3.8, 0.45), [sx, sy] = shakeOffset(u, 0, 4.4, 16 + (vt > 1 ? 14 : 0));
  bgSky(ctx, ['#2a5aa8', '#7ab0e0', '#ffd8a8']); ctx.translate(sx, sy);
  cityLayer(ctx, vt, { base: 1250, seed: 70, hMin: 200, hMax: 520, wMin: 60, wMax: 120, gap: 8, col: '#7a8ab8', win: 'rgba(255,240,200,0.45)', winP: 0.4, ws: 5, hit: x => 1.6 + ((x * 7) % 13) / 13 * 2 });
  const T = [[300, 140, 1050, 1.0, '#5a7ab8'], [620, 170, 1250, 1.9, '#4a6aa8'], [860, 120, 900, 2.6, '#6a8ac8']];
  for (const [x, w, h, at, col] of T) { const dt = Math.max(0, vt - at), drop = Math.min(h * 0.92, 0.5 * 1800 * dt * dt), hh = h - drop, lean = dt > 0 ? Math.min(0.12, dt * 0.06) : 0;
    ctx.save(); ctx.translate(x, 1500); ctx.rotate(lean * (x > 540 ? 1 : -1)); ctx.fillStyle = col; ctx.fillRect(-w / 2, -hh, w, hh);
    ctx.fillStyle = 'rgba(200,235,255,0.5)'; for (let y = -hh + 16; y < -10; y += 34) ctx.fillRect(-w / 2 + 10, y, w - 20, 14);
    ctx.fillStyle = mixHex(col, '#ffffff', 0.3); ctx.fillRect(-w / 2, -hh, w, 12); ctx.restore();
    if (dt > 0) { dustBlast(ctx, x, 1500 - hh, dt, Math.floor(x), { n: 26, spread: 600, up: 400, col: '#c8b8a8', life: 6 }); debrisAtCam(ctx, x, 1500 - hh, dt * 0.6, Math.floor(x) + 1, 26, '#6a6a7a'); } }
  ctx.fillStyle = '#8a8a96'; ctx.fillRect(-100, 1500, W + 200, H);
  if (vt > 1.6) dustBlast(ctx, 540, 1600, (vt - 1.6) * 0.8, 77, { n: 50, spread: 1100, up: 700, col: '#d8c8b8', life: 8 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Minutes of shaking,', 'not seconds'], 230, 0.15, { size: 92, out: 2.0 });
  say(ctx, u, ['High-rises give way', '(est.)'], 230, 2.1, { size: 92, out: OUT('downtown') });
}

// ================================================================ 6. aerial: the LA basin collapses in a sweeping wave
function vBasin(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0, 4.4, 8);
  bgSky(ctx, ['#3a6ab8', '#9ac0e8', '#ffe0b8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#9aa0a8'; ctx.beginPath(); ctx.moveTo(-50, 760); ctx.quadraticCurveTo(300, 600, 600, 700); ctx.quadraticCurveTo(850, 620, W + 50, 740); ctx.lineTo(W + 50, 800); ctx.lineTo(-50, 800); ctx.fill();
  ctx.fillStyle = '#b8b0a8'; ctx.fillRect(0, 780, W, H);
  for (let row = 0; row < 7; row++) { const q = row / 6, base = 820 + q * q * 1000, s = 0.25 + q * 1.1;
    cityLayer(ctx, u, { base, seed: 80 + row, hMin: 60 * s, hMax: 260 * s, wMin: 40 * s, wMax: 110 * s, gap: 6 * s, col: mixHex('#8a8ab8', '#5a6a98', q), win: 'rgba(255,240,200,0.4)', winP: 0.3, ws: Math.max(2, 5 * s),
      hit: x => (((x * 13 + row * 31) % 17) < 11 ? 0.5 + (1 - x / W) * 2.2 + (1 - q) * 0.6 + ((x * 3) % 7) / 14 : 1e9), dir: -1 });
    const r = rng(90 + row); for (let i = 0; i < 4; i++) { const x = r() * W, at = 0.5 + (1 - x / W) * 2.2 + (1 - q) * 0.6; dustBlast(ctx, x, base, u - at, row * 10 + i, { n: 10, spread: 300 * s, up: 260 * s, col: '#d0c0b0', life: 5 }); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.6);
  say(ctx, u, ['Across the LA basin,', 'buildings fall by', 'the thousands (est.)'], 230, 0.15, { size: 80, out: OUT('basin') });
}

// ================================================================ 8. Santa Monica: the wall of water
function vTsunamiLA(ctx, u) {
  const wx = lerp(W + 700, -1400, easeInOut(prog(u, 0.5, 4.4))), [sx, sy] = shakeOffset(u, 2.4, 2.4, 26);
  bgSky(ctx, ['#3a7ad0', '#9ac8f0', '#ffe8c8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#2a8ac0'; ctx.fillRect(0, 1100, W, 300);
  ctx.fillStyle = '#f0e0b0'; ctx.fillRect(0, 1330, W, 120);
  // pier + ferris wheel
  ctx.fillStyle = '#8a6a4a'; ctx.fillRect(560, 1180, W, 22); for (let x = 580; x < W; x += 60) ctx.fillRect(x, 1200, 10, 140);
  ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(820, 1020, 150, 0, 6.283); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + u * 0.3; ctx.beginPath(); ctx.moveTo(820, 1020); ctx.lineTo(820 + Math.cos(a) * 150, 1020 + Math.sin(a) * 150); ctx.stroke(); }
  for (let i = 0; i < 8; i++) palm(ctx, 40 + i * 140, 1460, 300, Math.sin(u * 2 + i) * 10 - (wx < 40 + i * 140 + 200 ? 160 : 0));
  ctx.fillStyle = '#e8d8c0'; ctx.fillRect(0, 1450, W, H);
  massCrowd(ctx, u, { n: 120, yFar: 1460, yNear: 1900, sFar: 50, sNear: 170, x0: 40, x1: 1040, seed: 101, col: '#2a3a6a', flow: -200, panic: 1, arms: 0.5 });
  waveWall(ctx, u, wx, 1500, 1150, 21);
  if (wx + 300 < W) { const x0 = Math.max(-20, wx + 300), top = y => 520 + Math.sin(y * 0.01 + u * 3) * 40;
    const g = ctx.createLinearGradient(0, 480, 0, H); g.addColorStop(0, '#5ab8dc'); g.addColorStop(0.3, '#1f7fb0'); g.addColorStop(1, '#0e4a7a'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(x0, H); ctx.lineTo(x0, top(x0)); for (let x = x0; x <= W + 20; x += 20) ctx.lineTo(x, top(x)); ctx.lineTo(W + 20, H); ctx.fill();
    const r = rng(140); for (let i = 0; i < 70; i++) { const x = x0 + r() * (W - x0 + 40), y = 520 + r() * 1300; puff(ctx, x + Math.sin(u * 4 + i) * 20, y, 14 + r() * 30, '#e8f6fc', 0.55); }
    for (let i = 0; i < 9; i++) { const x = x0 + 60 + ((i * 137 + u * 160) % Math.max(60, W - x0)), y = 700 + (i * 173) % 1000; if (x > W) continue;
      if (i % 3 === 0) carSide(ctx, x, y, 0.9, CARCOL[i % 8], Math.sin(u * 2 + i) * 0.7); else { ctx.save(); ctx.translate(x, y); ctx.rotate(u + i); ctx.fillStyle = ['#8a6a4a', '#e8e0d0'][i % 2]; ctx.fillRect(-60, -10, 120, 20); ctx.restore(); } } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['~15 minutes later:', 'the beaches'], 230, 0.15, { size: 92, out: 1.9 });
  say(ctx, u, ['A wall of water', 'up to ~30 m (est.)'], 230, 2.0, { size: 92, out: OUT('tsunami') });
}

// ================================================================ 11. the aqueduct rips: LA's water pours into the desert
function vAqueduct(ctx, u) {
  const sh = easeOut(R2((u - 0.4) / 0.3)) * 260, [sx, sy] = shakeOffset(u, 0.4, 2, 24);
  bgSky(ctx, ['#4a8ad8', '#a8d0f0', '#ffe8c0']); ctx.translate(sx, sy);
  mountainsS(ctx, 900, 5, '#b89a7a', 180);
  ctx.fillStyle = '#e0c090'; ctx.fillRect(0, 900, W, H);
  const cx = y => 540 + (y - 900) * 0.05, wd = y => 40 + (y - 900) * 0.4, fault = 1300;
  const canal = (y0, y1, off) => { ctx.fillStyle = '#c8c4bc'; ctx.beginPath(); ctx.moveTo(cx(y0) - wd(y0) - 20 + off, y0); ctx.lineTo(cx(y0) + wd(y0) + 20 + off, y0); ctx.lineTo(cx(y1) + wd(y1) + 20 + off, y1); ctx.lineTo(cx(y1) - wd(y1) - 20 + off, y1); ctx.fill();
    ctx.fillStyle = '#3a9ad0'; ctx.beginPath(); ctx.moveTo(cx(y0) - wd(y0) + off, y0); ctx.lineTo(cx(y0) + wd(y0) + off, y0); ctx.lineTo(cx(y1) + wd(y1) + off, y1); ctx.lineTo(cx(y1) - wd(y1) + off, y1); ctx.fill(); };
  canal(900, fault, 0); canal(fault, H, sh);
  ctx.strokeStyle = '#6a4a3a'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-50, fault - 40); ctx.lineTo(W + 50, fault + 40); ctx.stroke();
  if (u > 0.5) { const dt = u - 0.5; for (let i = 0; i < 60; i++) { const r = rng(i), a = -Math.PI * (0.1 + r() * 0.8), sp = 300 + r() * 700, x = cx(fault) + (r() - 0.5) * 200 + Math.cos(a) * sp * dt, y = fault + Math.sin(a) * sp * dt + 500 * dt * dt;
      puff(ctx, x, y, 14 + r() * 26, '#8ad0f0', 0.8); }
    ctx.fillStyle = 'rgba(70,150,210,0.6)'; ctx.beginPath(); ctx.ellipse(cx(fault) + sh / 2, fault + 60, 140 + dt * 260, 30 + dt * 60, 0, 0, 6.283); ctx.fill();
    dustBlast(ctx, 300, fault, dt, 3, { n: 12, spread: 500, up: 200, col: '#d8b890' }); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['The aqueducts that bring', 'LA its water snap (est.)'], 230, 0.15, { size: 74, out: 2.0 });
  say(ctx, u, ['Millions without water', 'for months (est.)'], 230, 2.1, { size: 80, out: OUT('aqueduct') });
}

// ================================================================ 12. planetary: the tsunami fans across the whole Pacific
function vPacific(ctx, u) {
  space(ctx, u);
  const R = 560, cx = W / 2, cy = 1180, lon0 = lerp(-130, -165, easeInOut(prog(u, 0, 4.5))), v = gView(lon0, 10);
  globe(ctx, cx, cy, R, { lon0, lat0: 10, t: u, ink: false, lights: false, clouds: 0.2 });
  const hrs = 17 * easeInOut(prog(u, 0.2, 4.2)), dRad = hrs * 713 / 6371;
  for (const src of [LA]) for (let i = 0; i < 3; i++) { const dd = dRad - i * 0.03; if (dd > 0) ringOnGlobe(ctx, v, cx, cy, R, src, dd, `rgba(255,255,255,${0.6 - i * 0.17})`, 6 - i * 1.5); }
  const P = ([lo, la]) => { const [x, y, z] = v(lo, la); return [cx + x * R, cy + y * R, z]; };
  const pts = rupPts(); ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 8; ctx.beginPath(); let pen = false; for (const p of pts) { const [x, y, z] = P(p); if (z > 0) { pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; } } ctx.stroke();
  for (const [n, lo, la, h] of [['Hawaii', -157.9, 21.3, 5.7], ['Peru', -77.1, -12, 9.5], ['Japan', 139.7, 35.7, 12.3], ['N. Zealand', 174.8, -36.8, 14.6], ['Philippines', 121, 14.6, 16.4], ['Australia', 151.2, -33.9, 16.8]]) {
    const [x, y, z] = P([lo, la]); if (z < 0.05) continue; const hit = hrs >= h; ctx.fillStyle = hit ? '#ffd25a' : '#ffffff'; ctx.beginPath(); ctx.arc(x, y, hit ? 12 : 8, 0, 6.283); ctx.fill();
    ctx.font = `800 ${hit ? 32 : 26}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = hit ? '#ffd25a' : 'rgba(255,255,255,0.85)'; ctx.fillText(hit ? `${n} ${h} h` : n, x, y - 22); }
  ctx.font = `900 90px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText(`+${hrs.toFixed(1)} h`, 540, 1820);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then it crosses the', 'whole Pacific'], 230, 0.15, { size: 84, out: OUT('pacific') });
}

// ================================================================ 13. the world economy takes the hit
function vEconomy(ctx, u) {
  bgSky(ctx, ['#1e2a6a', '#2a3a8a', '#3a4aa0']);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; for (let y = 900; y <= 1700; y += 100) { ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(1000, y); ctx.stroke(); }
  const k = easeIn2(prog(u, 0.2, 1.6)), N = 80;
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i <= N; i++) { const f = i / N, x = 80 + f * 920, n = Math.sin(i * 1.7) * 14 + Math.sin(i * 0.6) * 20, y = f < 0.4 ? 1000 + n : 1000 + n + Math.pow((f - 0.4) / 0.6, 1.6) * 640 * k;
    if (f > 0.4 + 0.6 * Math.max(k, 0.01) && k < 1) break; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  const _ic = 0, icons = [['⚓', 'ports'], ['🔌', 'chips & tech'], ['🌾', 'farms'], ['🎬', 'film & media']];
  icons.forEach(([ic, lab], i) => { const a = R2((u - 0.6 - i * 0.25) / 0.4); ctx.globalAlpha = a; ctx.font = `64px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(ic, 180 + i * 240, 1660); ctx.font = `800 28px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.fillText(lab, 180 + i * 240, 1710); ctx.globalAlpha = 1; });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['California is the world’s', '~4th-biggest economy.', 'Global recession (est.)'], 230, 0.15, { size: 72, out: OUT('economy') });
}

// ================================================================ 14. the toll: immediate + aftermath
function vTollLA(ctx, u) {
  bgSky(ctx, ['#1a2050', '#24306a', '#2e3a7a']);
  const r = rng(120); for (let i = 0; i < 40; i++) { const x = r() * W, y = 1500 + r() * 400; glow(ctx, x, y, 40, '255,200,120', 0.25 + 0.1 * Math.sin(u * 1.5 + i)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['~60 million people live', 'along the rupture'], 230, 0.15, { size: 72, out: OUT('toll') });
  bigNum(ctx, u, 'First hours:', 640, 0.6, { size: 60, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'hundreds of thousands', 740, 0.8, { size: 72, color: '#ffd25a', out: OUT('toll') });
  bigNum(ctx, u, 'Months after (no water,', 900, 1.8, { size: 54, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'power or hospitals):', 970, 1.9, { size: 54, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'hundreds of thousands more', 1060, 2.1, { size: 62, color: '#ffd25a', out: OUT('toll') });
  bigNum(ctx, u, 'Total: up to ~1 million', 1260, 3.2, { size: 84, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, '(rough est.)', 1350, 3.4, { size: 50, color: '#c8d0ff', out: OUT('toll') });
}

// ================================================================ 15. final: night from orbit, the West Coast goes dark
function vDark(ctx, u) {
  space(ctx, u);
  const R = 1000, cx = 640, cy = 1250, lon0 = -110, lat0 = 38, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, clouds: 0.15, sun: [0.3, -0.2, -0.93] });
  const P = ([lo, la]) => { const [x, y] = v(lo, la); return [cx + x * R, cy + y * R]; };
  const k = easeInOut(prog(u, 0.4, 2.8)), pts = rupPts();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const n = Math.round(k * (pts.length - 1));
  for (let i = 0; i <= n; i++) { const [lo, la] = pts[i]; for (const dl of [1.5, 3.2]) { const [x, y] = P([lo + dl, la]); const g = ctx.createRadialGradient(x, y, 0, x, y, 120); g.addColorStop(0, 'rgba(6,10,30,0.95)'); g.addColorStop(1, 'rgba(6,10,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 120, 0, 6.283); ctx.fill(); } }
  const r = rng(130); for (let i = 0; i <= n; i += 3) { const [lo, la] = pts[i], [x, y] = P([lo + 1.2 + r() * 2, la + (r() - 0.5)]); glow(ctx, x, y, 22, '255,160,70', 0.8); puff(ctx, x + 30 + u * 20, y - 30, 26, '#5a5a7a', 0.35); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['From space, the', 'West Coast goes dark'], 230, 0.15, { size: 88, out: OUT('dark') });
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
  say(ctx, u, ['Every freeway', 'bridge is tested.', 'Many fall (est.)'], 230, 0.15, { size: 84, out: OUT('overpass') });
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
  say(ctx, u, ['Gas lines burst.', 'Thousands of fires (est.)'], 230, 0.15, { size: 76, out: 1.9 });
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
