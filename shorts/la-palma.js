// What if La Palma's volcano collapsed into the Atlantic?   (worst-case mega-tsunami)
//
// SOURCES / NUMBERS (hedged):
//  - Worst-case model: Ward & Day (2001, GRL) — a ~500 km³ flank of Cumbre Vieja slides at ~100 m/s; initial dome ~hundreds of m;
//    Canaries hit by waves of hundreds of m; tens of m on the African coast; several m in Europe; 10-25 m on the Americas.
//    Later work (e.g. Løvholt 2008, Abadie 2020) suggests smaller, piecemeal slides and far-field waves of a few m: we show the
//    worst case and say so on screen.
//  - Slide energy: 500 km³ x 2,600 kg/m³ x g x ~2 km drop ≈ 2.5e19 J ≈ ~6 Gt TNT.
//  - Deep-ocean speed sqrt(g·5 km) ≈ 800 km/h. Great-circle arrivals from La Palma: Tenerife ~10 min, Gran Canaria ~20 min,
//    Morocco ~1 h, Lisbon ~1.7 h, Cornwall ~3.3 h, Brazil ~5.6 h, Caribbean ~6.3 h, Boston ~7 h, New York ~8 h, Miami ~9 h
//    (shelf + Bahamas slow the last legs).
//  - Canary Islands ~2.2 million people, mostly coastal. Miami Beach sits ~1-2 m above sea level.
//  - Florida beaches host ~90% of US loggerhead sea turtle nesting (FWC).
//  - Toll (worst case, rough): hundreds of thousands+ (Canaries and West Africa get minutes-to-hours of warning; the Americas ~8 h).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['island', 4.5, [[0.2, 'rumble:4.2'], [2.2, 'impact']]],
  ['collapse', 5.0, [[0.4, 'boom'], [0.45, 'roar:4.4'], [1.6, 'boom'], [2.8, 'boom']]],
  ['dome', 4.5, [[0.3, 'boom'], [0.35, 'rumble:4.0']]],
  ['tenerife', 4.5, [[0.2, 'drawback:1.0'], [1.0, 'roar:3.4'], [2.4, 'boom'], [2.45, 'impact']]],
  ['atlantic', 5.0, [[0.2, 'swell:4.6'], [0.3, 'rumble:4.4']]],
  ['evac', 4.0, [[0.2, 'heart:3.8']]],
  ['miamiair', 5.5, [[0.2, 'roar:5.0'], [2.2, 'boom'], [3.4, 'boom']]],
  ['miami', 4.5, [[0.2, 'drawback:1.0'], [1.0, 'roar:3.4'], [3.0, 'boom'], [3.05, 'impact']]],
  ['nyc', 4.5, [[0.2, 'roar:4.2'], [1.8, 'boom']]],
  ['turtles', 4.0, [[0.2, 'swell:3.6'], [1.8, 'roar:2.0']]],
  ['toll', 4.5, [[0.2, 'heart:4.2']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if La Palma collapsed into the Atlantic?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookP, island: vIslandP, collapse: vCollapseP, dome: vDomeP, tenerife: vTenerifeP, atlantic: vAtlanticP, evac: vEvacP, miamiair: vMiamiAirP,
              miami: vMiamiP, nyc: vNycP, turtles: vTurtlesP, toll: vTollP, final: vFinalP, end: vEndP };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const LP = [-17.9, 28.6];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.26, contrast: 1.08, saturate: 1.15, vignette: 0.36 });
}
// a frontal wave coming at the camera: crest at y (screen), height h
function frontWave(ctx, u, yb, hh, seed = 1) {
  const g = ctx.createLinearGradient(0, yb - hh, 0, yb); g.addColorStop(0, '#7ad0ec'); g.addColorStop(0.3, '#1f80b4'); g.addColorStop(1, '#0c4a7a'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-20, yb); for (let x = -20; x <= W + 20; x += 20) ctx.lineTo(x, yb - hh + Math.sin(x * 0.012 + u * 2) * hh * 0.06); ctx.lineTo(W + 20, yb); ctx.fill();
  const r = rng(seed); for (let i = 0; i < 70; i++) { const x = r() * W; puff(ctx, x, yb - hh + Math.sin(x * 0.012 + u * 2) * hh * 0.06 - r() * hh * 0.1, hh * (0.04 + r() * 0.06) + 8, '#ffffff', 0.92); }
  for (let i = 0; i < 40; i++) { const x = r() * W, y = yb - hh - ((u * 300 * (0.5 + r())) % (hh * 0.6 + 40)); puff(ctx, x, y, 4 + r() * hh * 0.02, '#ffffff', 0.6); }
}
function turtle(ctx, x, y, s, a = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s); ctx.fillStyle = '#8a7a4a'; for (const [dx, dy] of [[-30, -26], [30, -26], [-26, 24], [26, 24]]) { ctx.beginPath(); ctx.ellipse(dx, dy, 18, 8, Math.atan2(dy, dx), 0, 6.283); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, -44, 12, 0, 6.283); ctx.fill(); ctx.fillStyle = '#a8905a'; ctx.beginPath(); ctx.ellipse(0, 0, 32, 40, 0, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(80,60,30,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 18, 24, 0, 0, 6.283); ctx.stroke(); ctx.restore(); }

// ================================================================ 1. hook: the Atlantic from orbit, La Palma glows
function vHookP(ctx, u) {
  space(ctx, u);
  const R = 760, cx = 600, cy = 1250, v = gView(-40, 28);
  globe(ctx, cx, cy, R, { lon0: -40, lat0: 28, t: u, ink: false, clouds: 0.3, lights: false });
  const [x, y] = gProj(v, cx, cy, R)(LP); const p = 0.6 + 0.4 * Math.sin(u * 2 * Math.PI * 0.8); glow(ctx, x, y, 60 + 30 * p, '255,200,90', 0.9); ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
  ctx.font = `800 34px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('La Palma', x + 18, y + 10);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4)); shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.6 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if half an island', 'fell into the Atlantic?'], 260, 0.15, { size: 84, out: OUT('hook'), mark: { line: 0, from: 8, to: 22, color: '#ffd25a' } });
}

// ================================================================ 2. La Palma from above: the crack along the ridge
function vIslandP(ctx, u) {
  ctx.fillStyle = '#1e5a9a'; ctx.fillRect(0, 0, W, H);
  const r = rng(3); for (let i = 0; i < 60; i++) { ctx.fillStyle = 'rgba(80,140,200,0.25)'; ctx.beginPath(); ctx.ellipse(r() * W, r() * H, 80 + r() * 120, 12, -0.3, 0, 6.283); ctx.fill(); }
  const isl = [[540, 380], [700, 470], [760, 700], [700, 980], [640, 1300], [580, 1620], [520, 1660], [470, 1400], [380, 1100], [300, 820], [360, 520]];
  ctx.fillStyle = '#c8b080'; ctx.beginPath(); isl.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a9a5a'; ctx.beginPath(); ctx.ellipse(560, 700, 170, 220, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#4a7a4a'; ctx.beginPath(); ctx.arc(540, 700, 110, 0, 6.283); ctx.fill(); ctx.fillStyle = '#6a5a4a'; ctx.beginPath(); ctx.arc(540, 700, 60, 0, 6.283); ctx.fill();
  for (let i = 0; i < 9; i++) { const y = 1000 + i * 70, x = 560 - i * 6; ctx.fillStyle = '#6a5a5a'; ctx.beginPath(); ctx.arc(x, y, 24, 0, 6.283); ctx.fill(); ctx.fillStyle = '#4a3a3a'; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.283); ctx.fill(); }
  const k = easeOut(prog(u, 0.6, 2.4)); ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(556, 980); for (let y = 980; y < 980 + k * 640; y += 30) ctx.lineTo(556 - (y - 980) * 0.09 + Math.sin(y * 0.05) * 10, y); ctx.stroke(); glow(ctx, 540, 980 + k * 640, 60, '255,210,100', k > 0 && k < 1 ? 0.9 : 0);
  ctx.font = `800 34px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.fillText('Cumbre Vieja', 500, 1240);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6); scrimB(ctx, 1660, 0.7);
  say(ctx, u, ['La Palma: a volcanic', 'ridge with a crack', 'down its spine'], 230, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['Worst case: its whole', 'west flank lets go'], 230, 2.5, { size: 80, out: OUT('island') });
  ctx.font = `700 28px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'center'; ctx.fillText('Worst-case model. Many scientists expect smaller slides.', 540, 1790);
}

// ================================================================ 3. the flank slides into the sea (side view, slow motion)
function vCollapseP(ctx, u) {
  const vt = tm(u, 0.4, 4.2, 0.45), d = Math.max(0, vt - 0.4), [sx, sy] = shakeOffset(u, 0.4, 4.4, 24);
  bgSky(ctx, ['#3a7ad8', '#8ac0f0', '#ffe8c8']); ctx.translate(sx, sy);
  const sea = 1250; ctx.fillStyle = '#2a7ab0'; ctx.fillRect(0, sea, W, H);
  ctx.fillStyle = '#7a8a6a'; ctx.beginPath(); ctx.moveTo(1150, sea); ctx.lineTo(900, 640); ctx.lineTo(760, 600); ctx.lineTo(600, sea); ctx.fill();
  const slide = Math.min(900, 0.5 * 380 * d * d), rot = Math.min(0.5, d * 0.12);
  ctx.save(); ctx.translate(600 - slide, 620 + slide * 0.7); ctx.rotate(-rot); ctx.fillStyle = '#8a7a5a'; ctx.beginPath(); ctx.moveTo(160, -20); ctx.lineTo(-500, 640); ctx.lineTo(0, 640); ctx.lineTo(160, 300); ctx.fill();
  ctx.fillStyle = '#5a9a5a'; ctx.beginPath(); ctx.moveTo(160, -20); ctx.lineTo(-120, 260); ctx.lineTo(60, 200); ctx.fill(); ctx.restore();
  if (d > 0) { for (let i = 0; i < 6; i++) dustBlast(ctx, 600 - slide * (0.3 + i * 0.12), 700 + i * 90 + slide * 0.5, d - i * 0.1, 30 + i, { n: 14, spread: 500, up: 300, col: '#c8b8a0', life: 6 });
    const sp = Math.min(1, d / 2.4); for (let i = 0; i < 40; i++) { const r = rng(i), a = -Math.PI * (0.15 + r() * 0.7), v = 400 + r() * 700; puff(ctx, 480 - slide * 0.6 + Math.cos(a) * v * d * 0.6, sea + Math.sin(a) * v * d * 0.6 + 300 * d * d * 0.3, 30 + r() * 50, '#f0f8ff', 0.85 * sp); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['~500 km³ of rock', 'slides into the sea'], 230, 0.15, { size: 88, out: 2.4 });
  say(ctx, u, ['at ~100 m/s: ~6 gigatons', 'of energy'], 230, 2.5, { size: 78, out: OUT('collapse') });
}

// ================================================================ 4. cross-section: the slide shoves up a dome of water
function vDomeP(ctx, u) {
  const k = easeOut(prog(u, 0.2, 2.4)), [sx, sy] = shakeOffset(u, 0.3, 2, 14); bgSky(ctx, ['#5aa8e8', '#9ad0f4', '#d8f0ff']); ctx.translate(sx, sy);
  const sea = 900, c = Math.max(0, u - 2.2) * 240, A = 380 * k;
  const surf = x => sea - (c === 0 ? A : A * 0.55) * Math.exp(-(((x - 420 - c) / 220) ** 2)) - (c === 0 ? 0 : A * 0.35 * Math.exp(-(((x - 420 + c * 0.6) / 220) ** 2)));
  const g = ctx.createLinearGradient(0, sea - 400, 0, 1700); g.addColorStop(0, '#3aa0d8'); g.addColorStop(1, '#0e3a6a'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, surf(x)); ctx.lineTo(W, H); ctx.fill();
  ctx.strokeStyle = '#e8f8ff'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 0; x <= W; x += 10) x ? ctx.lineTo(x, surf(x)) : ctx.moveTo(x, surf(x)); ctx.stroke();
  ctx.fillStyle = '#8a7a5a'; ctx.beginPath(); ctx.moveTo(W + 20, 600); ctx.lineTo(700, 1300); ctx.lineTo(0, 1650); ctx.lineTo(0, H); ctx.lineTo(W + 20, H); ctx.fill();
  const bx = lerp(640, 160, k); ctx.fillStyle = '#6a5a40'; ctx.beginPath(); ctx.moveTo(bx + 220, 1200 + (640 - bx) * 0.35); ctx.lineTo(bx - 200, 1400 + (640 - bx) * 0.35); ctx.lineTo(bx + 80, 1420 + (640 - bx) * 0.35); ctx.fill();
  const r = rng(5); for (let i = 0; i < 30; i++) puff(ctx, bx + (r() - 0.3) * 300, 1300 + (640 - bx) * 0.3 + (r() - 0.5) * 120, 20 + r() * 30, '#a8987a', 0.6);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(420 + c, sea); ctx.lineTo(420 + c, surf(420 + c)); ctx.stroke(); ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('hundreds of m', 440 + c, sea - A * 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Underwater, it shoves up', 'a dome of water hundreds', 'of meters high'], 230, 0.15, { size: 72, out: OUT('dome') });
}

// ================================================================ 5. Tenerife, 10 minutes later
function vTenerifeP(ctx, u) {
  const wx = lerp(-1400, W + 400, easeInOut(prog(u, 0.2, 3.8))), [sx, sy] = shakeOffset(u, 1.8, 2.4, 30);
  bgSky(ctx, ['#3a6ac8', '#9ac0e8', '#ffe8c8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#9a8a80'; ctx.beginPath(); ctx.moveTo(-50, 1250); ctx.lineTo(560, 560); ctx.lineTo(640, 540); ctx.lineTo(1150, 1250); ctx.fill(); ctx.fillStyle = '#f4f4f8'; ctx.beginPath(); ctx.moveTo(500, 620); ctx.lineTo(560, 560); ctx.lineTo(640, 540); ctx.lineTo(700, 610); ctx.lineTo(600, 640); ctx.fill();
  cityLayer(ctx, u, { base: 1400, seed: 60, hMin: 80, hMax: 300, wMin: 50, wMax: 110, gap: 8, col: '#f0e8d8', win: 'rgba(80,140,200,0.5)', winP: 0.5, ws: 5, hit: x => (wx > x - 200 ? 0 : 1e9), dir: 1 });
  ctx.fillStyle = '#e8d8b0'; ctx.fillRect(0, 1400, W, H);
  ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); waveWall(ctx, u, W - wx, 1500, 1400, 61); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Tenerife, 10 minutes later:', 'waves hundreds of m tall'], 230, 0.15, { size: 76, out: OUT('tenerife') });
}

// ================================================================ 6. from orbit: the wave crosses the whole Atlantic
function vAtlanticP(ctx, u) {
  space(ctx, u);
  const R = 700, cx = 540, cy = 1180, lon0 = lerp(-30, -45, u / 5), v = gView(lon0, 25);
  globe(ctx, cx, cy, R, { lon0, lat0: 25, t: u, ink: false, lights: false, clouds: 0.2 });
  const hrs = 9.5 * easeInOut(prog(u, 0.2, 4.6)); tsunamiGlobe(ctx, v, cx, cy, R, [LP], hrs * 800 / 6371, 0.04);
  const P = ([lo, la]) => { const [x, y, z] = v(lo, la); return [cx + x * R, cy + y * R, z]; };
  for (const [n, lo, la, h] of [['Morocco', -9.6, 30.4, 1.0], ['Lisbon', -9.2, 38.7, 1.7], ['UK', -5.6, 50.1, 3.3], ['Brazil', -34.9, -8.05, 5.6], ['Caribbean', -66.1, 18.47, 6.3], ['New York', -73.9, 40.6, 8.0], ['Miami', -80.13, 25.77, 9.0]]) {
    const [x, y, z] = P([lo, la]); if (z < 0.05) continue; const hit = hrs >= h; ctx.fillStyle = hit ? '#ffd25a' : '#ffffff'; ctx.beginPath(); ctx.arc(x, y, hit ? 12 : 8, 0, 6.283); ctx.fill();
    ctx.font = `800 ${hit ? 32 : 26}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = hit ? '#ffd25a' : 'rgba(255,255,255,0.85)'; ctx.fillText(hit ? `${n} ${h} h` : n, x, y - 22); }
  ctx.font = `900 90px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText(`+${hrs.toFixed(1)} h`, 540, 1820);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then it crosses the whole', 'Atlantic at ~800 km/h'], 230, 0.15, { size: 78, out: OUT('atlantic') });
}

// ================================================================ 7. evacuation gridlock from above
function vEvacP(ctx, u) {
  ctx.fillStyle = '#7aa060'; ctx.fillRect(0, 0, W, H);
  const r = rng(7); for (let i = 0; i < 30; i++) { ctx.fillStyle = ['#8ab070', '#6a9050'][i % 2]; ctx.fillRect(r() * W, r() * H, 140, 90); }
  ctx.fillStyle = '#5a5a66'; ctx.fillRect(200, 0, 300, H); ctx.fillRect(580, 0, 300, H); ctx.fillStyle = '#8a9a70'; ctx.fillRect(500, 0, 80, H);
  ctx.fillStyle = '#ffffff'; for (const x of [275, 350, 425, 655, 730, 805]) for (let y = 0; y < H; y += 90) ctx.fillRect(x - 2, y, 4, 40);
  for (let lane = 0; lane < 8; lane++) { const x = (lane < 4 ? 237 + lane * 75 : 617 + (lane - 4) * 75), spd = lane < 4 ? 6 : 14;
    for (let i = 0; i < 26; i++) { const y = ((i * 78 - u * spd * (1 + (i % 3) * 0.1)) % (H + 80) + H + 80) % (H + 80) - 40; ctx.fillStyle = CARCOL[(i + lane) % 8]; ctx.beginPath(); ctx.roundRect(x - 22, y, 44, 66, 8); ctx.fill(); ctx.fillStyle = 'rgba(20,30,60,0.4)'; ctx.fillRect(x - 16, y + 10, 32, 16); } }
  ctx.fillStyle = '#2a7a4a'; ctx.beginPath(); ctx.roundRect(640, 700, 260, 110, 10); ctx.fill(); ctx.font = `900 50px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText('I-95 N', 770, 775);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['The US East Coast gets', '~8 hours of warning'], 230, 0.15, { size: 80, out: 1.9 });
  say(ctx, u, ['Tens of millions try', 'to flee at once'], 230, 2.0, { size: 84, out: OUT('evac') });
}

// ================================================================ 8. bird's-eye: the wave rolls over Miami Beach into downtown
function vMiamiAirP(ctx, u) {
  const z = 1 + easeInOut(prog(u, 0, 5.5)) * 0.25; ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000);
  ctx.fillStyle = '#b8b0a8'; ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.strokeStyle = 'rgba(140,134,128,0.8)'; ctx.lineWidth = 2; for (let x = -200; x < 520; x += 26) { ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x, H + 200); ctx.stroke(); } for (let y = -200; y < H + 200; y += 26) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(520, y); ctx.stroke(); }
  const r = rng(8); for (let i = 0; i < 40; i++) { ctx.fillStyle = '#e8e4ee'; ctx.fillRect(400 + r() * 110, 900 + r() * 260, 16 + r() * 18, 16 + r() * 18); }
  ctx.fillStyle = '#5ab0d0'; ctx.beginPath(); ctx.moveTo(520, -200); ctx.quadraticCurveTo(560, 1000, 520, H + 200); ctx.lineTo(700, H + 200); ctx.quadraticCurveTo(720, 1000, 700, -200); ctx.fill();
  ctx.fillStyle = '#d8d0b8'; ctx.beginPath(); ctx.moveTo(700, -200); ctx.quadraticCurveTo(720, 1000, 700, H + 200); ctx.lineTo(780, H + 200); ctx.quadraticCurveTo(800, 1000, 780, -200); ctx.fill();
  for (let y = -180; y < H + 180; y += 34) { ctx.fillStyle = '#f4f2ee'; ctx.fillRect(712, y, 40, 24); }
  ctx.fillStyle = '#9a9aa4'; for (const y of [700, 1150, 1500]) ctx.fillRect(520, y, 190, 10);
  ctx.fillStyle = '#1e6aa8'; ctx.beginPath(); ctx.moveTo(780, -200); ctx.quadraticCurveTo(800, 1000, 780, H + 200); ctx.lineTo(W + 200, H + 200); ctx.lineTo(W + 200, -200); ctx.fill();
  const fx = lerp(W + 300, 790, easeIn2(prog(u, 0.2, 2.2))); for (let i = 0; i < 4; i++) { const x = fx + i * 70; ctx.strokeStyle = `rgba(255,255,255,${0.9 - i * 0.2})`; ctx.lineWidth = 14 - i * 3; ctx.beginPath(); ctx.moveTo(x, -200); for (let y = -200; y < H + 200; y += 40) ctx.lineTo(x + Math.sin(y * 0.01 + u) * 20, y); ctx.stroke(); }
  const inn = easeOut(prog(u, 2.0, 5.3)), ix = lerp(790, 80, inn);
  if (inn > 0) { const g = ctx.createLinearGradient(ix, 0, 790, 0); g.addColorStop(0, 'rgba(240,250,255,0.95)'); g.addColorStop(0.08, 'rgba(70,150,200,0.92)'); g.addColorStop(1, 'rgba(40,110,170,0.95)'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(800, -200); for (let y = -200; y < H + 200; y += 40) ctx.lineTo(ix + Math.sin(y * 0.013 + u * 2) * 30, y); ctx.lineTo(800, H + 200); ctx.fill();
    for (let i = 0; i < 40; i++) { const y = r() * H; puff(ctx, ix + Math.sin(y * 0.013 + u * 2) * 30, y, 16 + r() * 20, '#ffffff', 0.8); } }
  ctx.restore();
  ctx.font = `800 30px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; if (inn < 0.3) { ctx.fillText('Miami Beach', 745, 1650); ctx.fillText('Downtown', 460, 1220); }
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.fillText(`+9 h ${String(Math.round(lerp(0, 25, u / 5.5))).padStart(2, '0')} min`, 540, 1800);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Miami from above: the', 'wave rolls over', 'Miami Beach'], 230, 0.15, { size: 80, out: 2.8 });
  say(ctx, u, ['then straight across', 'the bay, downtown'], 230, 2.9, { size: 84, out: OUT('miamiair') });
}

// ================================================================ 9. on the beach, facing the ocean
function vMiamiP(ctx, u) {
  const hz = 1080, yb = lerp(hz + 10, H + 600, easeIn2(prog(u, 0.6, 4.4))), hh = lerp(20, 1000, easeIn2(prog(u, 0.6, 4.4))), [sx, sy] = shakeOffset(u, 3.0, 1.4, 26);
  bgSky(ctx, ['#3a8ae0', '#9ad0f4', '#ffe8c8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#2a8ac0'; ctx.fillRect(0, hz, W, H);
  if (u > 0.6) { ctx.fillStyle = '#3a9ad0'; ctx.fillRect(0, hz, W, Math.max(0, yb - hh - hz + 40)); }
  ctx.fillStyle = '#f0e0b0'; ctx.fillRect(0, 1500, W, H);
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const x = sd < 0 ? i * 110 : W - 110 - i * 110, h = 900 - i * 140; ctx.fillStyle = ['#f4f0e8', '#ffe0d0', '#d8f0f0'][i]; ctx.fillRect(x, 1500 - h, 110, h); ctx.fillStyle = 'rgba(80,150,200,0.45)'; for (let k = 0; k < h / 40; k++) ctx.fillRect(x + 10, 1500 - h + 12 + k * 40, 90, 16); }
  for (let i = 0; i < 4; i++) palm(ctx, 360 + i * 120, 1520, 280, Math.sin(u * 2 + i) * 10);
  massCrowd(ctx, u, { n: 80, yFar: 1520, yNear: 1900, sFar: 60, sNear: 180, x0: 300, x1: 780, seed: 9, col: '#2a3a6a', flow: 0, panic: 1, arms: 0.6 });
  if (u > 0.6) frontWave(ctx, u, yb, hh, 10);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Worst case: walls of', 'water up to ~25 m'], 230, 0.15, { size: 84, out: OUT('miami') });
}

// ================================================================ 10. New York: the surge pours into the harbor
function vNycP(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.8)), lvl = lerp(1350, 1000, k), [sx, sy] = shakeOffset(u, 1.8, 2.4, 14);
  bgSky(ctx, ['#3a6ac8', '#9ab8e8', '#ffd8b0']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1300, seed: 70, hMin: 200, hMax: 900, wMin: 50, wMax: 110, gap: 6, col: '#7a8ab8', win: 'rgba(255,240,200,0.45)', winP: 0.4, ws: 5, x0: 300 });
  ctx.fillStyle = '#6aa890'; ctx.fillRect(110, 1060, 140, 260); ctx.fillRect(140, 940, 80, 130); ctx.beginPath(); ctx.arc(180, 900, 34, 0, 6.283); ctx.fill(); ctx.fillRect(200, 780, 16, 130); ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.arc(208, 770, 18, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#a8a094'; ctx.fillRect(80, 1300, 200, 40);
  const g = ctx.createLinearGradient(0, lvl, 0, H); g.addColorStop(0, '#5ab0d8'); g.addColorStop(1, '#1a5a8a'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, lvl + Math.sin(x * 0.012 + u * 3) * 26); ctx.lineTo(W, H); ctx.fill();
  const r = rng(11); for (let i = 0; i < 50; i++) { const x = r() * W; puff(ctx, x, lvl + Math.sin(x * 0.012 + u * 3) * 26, 16 + r() * 24, '#ffffff', 0.7); }
  for (let i = 0; i < 5; i++) { const x = (i * 230 + u * 90) % (W + 200) - 100; ctx.save(); ctx.translate(x, lvl + 20); ctx.rotate(Math.sin(u * 2 + i) * 0.3); ctx.fillStyle = ['#f4f4f8', '#ffbe0b', '#3a86ff'][i % 3]; ctx.fillRect(-70, -20, 140, 40); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['New York: the surge', 'pours into the harbor', 'and Lower Manhattan'], 230, 0.15, { size: 76, out: OUT('nyc') });
}

// ================================================================ 11. turtle nesting beaches scoured
function vTurtlesP(ctx, u) {
  bgSky(ctx, ['#0e1a4a', '#1e2a6a', '#2a3a7a']); stars(ctx, u, 0.6); glow(ctx, 820, 400, 160, '220,230,255', 0.4); ctx.fillStyle = '#f0f0f8'; ctx.beginPath(); ctx.arc(820, 400, 50, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#1e3a6a'; ctx.fillRect(0, 900, W, 300); ctx.fillStyle = '#c8b890'; ctx.fillRect(0, 1150, W, H);
  const r = rng(12); for (let i = 0; i < 7; i++) turtle(ctx, 120 + i * 140 + Math.sin(u + i) * 6, 1300 + (i % 3) * 140, 1.1, -0.2 + (i % 2) * 0.4);
  for (let i = 0; i < 30; i++) { const x = r() * W, y = 1600 + r() * 260; turtle(ctx, x + u * 8, y - u * 10, 0.25, -0.2); }
  const fl = easeIn2(prog(u, 1.8, 3.8)); if (fl > 0) { const ex = lerp(-200, W + 200, fl); ctx.fillStyle = 'rgba(60,140,200,0.92)'; ctx.beginPath(); ctx.moveTo(-50, 880); for (let y = 880; y <= H; y += 40) ctx.lineTo(ex + Math.sin(y * 0.02 + u * 4) * 40, y); ctx.lineTo(-50, H); ctx.fill();
    for (let y = 880; y <= H; y += 50) puff(ctx, ex + Math.sin(y * 0.02 + u * 4) * 40, y, 26, '#f0fbff', 0.8); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Florida beaches host ~90%', 'of US loggerhead nests'], 230, 0.15, { size: 76, out: 1.7 });
  say(ctx, u, ['Whole nesting beaches', 'are scoured away'], 230, 1.8, { size: 82, out: OUT('turtles') });
}

// ================================================================ 12. toll
function vTollP(ctx, u) {
  bgSky(ctx, ['#1a2a5a', '#24346a', '#2e3e7a']);
  const r = rng(13); for (let i = 0; i < 30; i++) { const x = r() * W, y = 1500 + r() * 400; glow(ctx, x, y, 40, '255,200,120', 0.25 + 0.1 * Math.sin(u * 1.5 + i)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'Canaries & West Africa:', 620, 0.2, { size: 60, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'minutes of warning', 720, 0.4, { size: 66, color: '#ffd25a', out: OUT('toll') });
  bigNum(ctx, u, 'Worst-case toll:', 900, 1.4, { size: 60, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'hundreds of thousands+', 1020, 1.7, { size: 80, color: '#ffd25a', out: OUT('toll') });
}

// ================================================================ 13. final: every Atlantic coast lit by surf
function vFinalP(ctx, u) {
  space(ctx, u);
  const R = 640, cx = 540, cy = 1180, lon0 = -35 + u * 2, v = gView(lon0, 25), P = gProj(v, cx, cy, R);
  globe(ctx, cx, cy, R, { lon0, lat0: 25, t: u, ink: false, clouds: 0.2, lights: false });
  const k = easeInOut(prog(u, 0.2, 2.6));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const poly of LAND) { if (poly.length < 12) continue; let hid = 0; for (const [lo, la] of poly) if (v(lo, la)[2] < 0) hid++; if (hid > poly.length * 0.4) continue;
    for (const [lw, col] of [[26, `rgba(255,255,255,${0.3 * k})`], [7, `rgba(255,255,255,${0.95 * k})`]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.beginPath(); let pen = false;
      for (const p of poly) { const z = v(...p)[2]; if (z > 0.05) { pen ? ctx.lineTo(...P(p)) : ctx.moveTo(...P(p)); pen = true; } else pen = false; } ctx.stroke(); } }
  ctx.restore();
  const [x, y] = P(LP); glow(ctx, x, y, 50, '255,200,90', 0.9);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['One island collapses.', 'An entire ocean', 'feels it'], 230, 0.15, { size: 92, out: OUT('final') });
}
function vEndP(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -35 + u * 4, lat0: 25, t: u, ink: false });
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
