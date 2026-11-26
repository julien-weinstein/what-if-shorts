// What if all rain fell as lead?
//
// Premise: every raindrop becomes a drop of lead (same volume). Water still evaporates; it just never comes back as water.
//
// PHYSICS (worked):
//  - Lead melts at 327°C, so drops solidify into spheres in the cold air: lead "shot". Shot towers made lead shot
//    exactly this way (molten lead dropped from a height).
//  - Terminal speed (Cd ~0.47): 2 mm pellet ~23 m/s (83 km/h, ~0.01 J); 4 mm ~32 m/s (117 km/h, ~0.2 J): stings, bruises.
//  - Density 11.34 t/m³: 10 mm/h of rain = ~113 kg of lead per m² per hour. Roofs are designed for ~100-250 kg/m²
//    (snow load), so they fail within hours of steady rain. A monsoon day (~100 mm) = ~1.1 t/m².
//  - Land averages ~0.75 m of rain a year (rainforests 2-4 m): lead piles up ~0.75 m/yr on average.
//  - Waterfowl swallow lead shot as grit; lead poisoning from spent shot killed large numbers of ducks before the U.S.
//    banned lead shot for waterfowl hunting (1991).
//  - Rivers are fed by rain; agriculture uses ~70% of freshwater withdrawals.
//  - Global precipitation ~505,000 km³/yr -> 5.7e15 t of lead a year ≈ 1.3 billion years of world lead mining (~4.5 Mt/yr).
//  - Oceans lose ~505,000 km³/yr to evaporation with nothing returned: sea level falls ~1.4 m/yr; oceans gone in ~2,600 yr.
//  - Toll (est., hedged): billions, from thirst and crop failure.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['pellet', 4.5, [[0.2, 'rumble:4.2']]],
  ['street', 5.0, [[0.2, 'roar:4.8'], [1.0, 'impact']]],
  ['roofs', 4.5, [[1.4, 'impact'], [1.45, 'boom'], [2.6, 'boom']]],
  ['monsoon', 4.5, [[0.2, 'roar:4.2'], [1.8, 'boom']]],
  ['forest', 4.5, [[0.2, 'roar:4.2'], [1.2, 'boom']]],
  ['ducks', 4.5, [[0.2, 'swell:4.2']]],
  ['rivers', 4.5, [[0.2, 'rumble:4.2']]],
  ['thirst', 4.5, [[0.2, 'heart:4.2']]],
  ['oceans', 5.0, [[0.2, 'rumble:4.8']]],
  ['scale', 4.0, [[0.4, 'impact']]],
  ['toll', 4.0, [[0.2, 'heart:3.8']]],
  ['world', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if all rain fell as lead?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 72, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, pellet: vPellet, street: vStreet2, roofs: vRoofs, monsoon: vMonsoon, forest: vForest, ducks: vDucks, rivers: vRivers2,
              thirst: vThirst, oceans: vOceans, scale: vScale, toll: vToll2, world: vLeadWorld, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const PB = '#7a7f8a', PB_L = '#c8ccd6', PB_D = '#3a3d46';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2, saturate: 1.08 });
}
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.2)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function pellet(ctx, x, y, r) { const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r); g.addColorStop(0, '#f0f2f6'); g.addColorStop(0.4, PB_L); g.addColorStop(1, PB_D); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function leadRain(ctx, u, n, seed, speed = 1400, size = 5, x0 = 0, x1 = W, yTop = 0, yBot = H) { const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = yTop + ((r() * (yBot - yTop) + u * speed * (0.8 + r() * 0.4)) % (yBot - yTop)), s = size * (0.6 + r() * 0.8);
    ctx.strokeStyle = 'rgba(160,166,180,0.45)'; ctx.lineWidth = s * 0.8; ctx.beginPath(); ctx.moveTo(x, y - s * 6); ctx.lineTo(x, y); ctx.stroke(); pellet(ctx, x, y, s); } }
function leadLayer(ctx, y, seed, depth = H) { const g = ctx.createLinearGradient(0, y, 0, y + 120); g.addColorStop(0, PB_L); g.addColorStop(1, PB); ctx.fillStyle = g; ctx.fillRect(0, y, W, depth);
  const r = rng(seed); for (let i = 0; i < 220; i++) { const x = r() * W, yy = y + r() * Math.min(300, depth); pellet(ctx, x, yy, 3 + r() * 4); } }

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#2a2e3a', '#4a4e5a', '#6a6e7a']);
  for (let i = 0; i < 6; i++) puff(ctx, 100 + i * 180, 360 + (i % 2) * 60, 200, '#3a3e4a', 0.95);
  leadRain(ctx, u, 90, 2, 1200, 6);
  pellet(ctx, W / 2, lerp(300, 1150, easeIn2(R2(u / 1.4))), 120);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if all rain', 'fell as lead?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 1, from: 8, to: 12, color: '#7a7f8a' } });
}

// ================================================================ 2. a raindrop becomes lead shot
function vPellet(ctx, u) {
  bgSky(ctx, ['#4a5a7a', '#7a8aa8', '#b8c4d8']);
  const k = easeInOut(prog(u, 0.3, 2.4)), y = lerp(500, 1300, easeIn2(R2(u / 4.2)));
  if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#7ac8ff'; ctx.beginPath(); ctx.moveTo(W / 2, y - 120); ctx.quadraticCurveTo(W / 2 + 90, y, W / 2, y + 70); ctx.quadraticCurveTo(W / 2 - 90, y, W / 2, y - 120); ctx.fill(); ctx.restore(); }
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; pellet(ctx, W / 2, y, 80); ctx.restore(); }
  for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W / 2 - 60 + i * 24, y - 140 - i * 10); ctx.lineTo(W / 2 - 60 + i * 24, y - 260 - i * 20); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Each drop freezes into', 'a ball of lead shot,', 'like old shot towers made'], 230, 0.15, { size: 66, out: 2.6 });
  say(ctx, u, ['and hits at up', 'to 117 km/h'], 230, 2.7, { size: 92, out: OUT('pellet') });
}

// ================================================================ 3. the first downpour
function vStreet2(ctx, u) {
  bgSky(ctx, ['#3a3e4a', '#5a5e6a', '#7a7e8a']);
  cityLayer(ctx, u, { base: 1200, seed: 3, hMin: 200, hMax: 640, wMin: 70, wMax: 150, gap: 10, col: '#4a4e5a', win: 'rgba(255,230,180,0.5)', winP: 0.4, ws: 8 });
  ctx.fillStyle = '#5a5e68'; ctx.fillRect(0, 1200, W, H);
  const depth = easeOut(prog(u, 0, 5)) * 120; leadLayer(ctx, 1700 - depth, 4, 400);
  for (const [x, c] of [[200, '#e63946'], [800, '#3a86ff']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - 140, 1540, 280, 90, 24); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 90, 1480, 180, 70, 20); ctx.fill();
    ctx.fillStyle = 'rgba(40,40,50,0.5)'; for (let k = 0; k < 8; k++) { const r = rng(x + k); ctx.beginPath(); ctx.arc(x - 120 + r() * 240, 1490 + r() * 120, 6, 0, 6.283); ctx.fill(); } }
  [[440, 3], [620, 6]].forEach(([x, s]) => { person2(ctx, x + Math.sin(u * 2 + x) * 10, 1760, 320, { seed: s, t: u }); ctx.fillStyle = '#2a2a34'; ctx.beginPath(); ctx.arc(x, 1760 - 330, 110, Math.PI, 0); ctx.fill(); ctx.strokeStyle = '#2a2a34'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, 1430); ctx.lineTo(x, 1620); ctx.stroke(); });
  leadRain(ctx, u, 160, 5, 1600, 5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['A normal downpour:', '110 kg of lead per square', 'meter, every hour'], 230, 0.15, { size: 68, out: OUT('street') });
}

// ================================================================ 4. roofs collapse
function vRoofs(ctx, u) {
  const fail = 1.4, k = easeIn2(R2((u - fail) / 0.6)), [sx, sy] = shakeOffset(u, fail, 2, 20);
  bgSky(ctx, ['#3a3e4a', '#5a5e6a', '#7a7e8a']); ctx.translate(sx, sy);
  ctx.fillStyle = '#6a6e78'; ctx.fillRect(0, 1450, W, H);
  [[220, 0], [560, 0.3], [880, 0.15]].forEach(([x, d]) => { const kk = easeIn2(R2((u - fail - d) / 0.6)), sag = lerp(easeOut(prog(u, 0, fail)) * 40, 300, kk);
    ctx.fillStyle = '#d8c8a8'; ctx.fillRect(x - 140, 1450 - 260, 280, 260); ctx.fillStyle = '#bfe8ff'; ctx.fillRect(x - 100, 1450 - 200, 60, 60); ctx.fillRect(x + 40, 1450 - 200, 60, 60);
    ctx.fillStyle = '#7a3a2a'; ctx.beginPath(); ctx.moveTo(x - 170, 1190 + kk * 200); ctx.quadraticCurveTo(x, 1190 - 120 + sag, x + 170, 1190 + kk * 200); ctx.lineTo(x + 170, 1210 + kk * 200); ctx.lineTo(x - 170, 1210 + kk * 200); ctx.fill();
    ctx.fillStyle = PB_L; ctx.beginPath(); ctx.moveTo(x - 160, 1190 + kk * 200); ctx.quadraticCurveTo(x, 1170 - 140 + sag, x + 160, 1190 + kk * 200); ctx.quadraticCurveTo(x, 1150 - 100 + sag, x - 160, 1190 + kk * 200); ctx.fill();
    if (kk > 0 && kk < 1) for (let i = 0; i < 6; i++) puff(ctx, x + (i - 3) * 40, 1350 - kk * 60, 50, '#b8b4b0', 0.6 * (1 - kk)); });
  leadRain(ctx, u, 120, 7, 1600, 5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Roofs are built for', '~100-250 kg per m²'], 230, 0.15, { size: 80, out: 1.6 });
  say(ctx, u, ['Most fail within', 'hours'], 230, 1.7, { size: 100, out: OUT('roofs') });
}

// ================================================================ 5. monsoon cities buried
function vMonsoon(ctx, u) {
  const lvl = lerp(1700, 900, easeInOut(prog(u, 0.2, 4.2))), [sx, sy] = shakeOffset(u, 1.8, 1.5, 10);
  bgSky(ctx, ['#2a2e3a', '#3a3e4a', '#5a5e6a']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1600, seed: 9, hMin: 200, hMax: 900, wMin: 60, wMax: 150, gap: 8, col: '#6a5a5a', win: 'rgba(255,220,160,0.5)', winP: 0.4, ws: 8, hit: x => (x % 3 < 1 ? 1.8 + x / W : 1e9) });
  leadLayer(ctx, lvl, 9, H);
  leadRain(ctx, u, 200, 11, 1800, 6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['A monsoon day: over a', 'tonne per square meter.', 'Cities get buried.'], 230, 0.15, { size: 70, out: OUT('monsoon') });
}

// ================================================================ 6. rainforests shredded and buried
function vForest(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 4.0));
  bgSky(ctx, ['#3a4a3e', '#5a6a5a', '#7a8a7a']);
  const r = rng(4);
  for (let i = 0; i < 18; i++) { const x = r() * W, h = 500 + r() * 400, snap = r() < 0.6 && u > 0.8 + r() * 2, lean = snap ? R2((u - 0.8) / 2) * 1.2 * (r() < 0.5 ? 1 : -1) : 0;
    ctx.save(); ctx.translate(x, 1500); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(-14, -h * 0.5, 28, h * 0.5); ctx.translate(0, -h * 0.5); ctx.rotate(lean);
    ctx.fillRect(-12, -h * 0.5, 24, h * 0.5); ctx.fillStyle = mixHex('#2a7a3a', '#5a5a50', k); ctx.beginPath(); ctx.arc(0, -h * 0.5, 120 * (1 - 0.6 * k), 0, 6.283); ctx.fill(); ctx.restore(); }
  leadLayer(ctx, lerp(1700, 1250, k), 13, H);
  leadRain(ctx, u, 200, 15, 1800, 6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Rainforests get shredded,', 'then buried meters deep', 'every year'], 230, 0.15, { size: 70, out: OUT('forest') });
}

// ================================================================ 7. birds swallow the shot
function vDucks(ctx, u) {
  bgSky(ctx, ['#7a8a9a', '#a8b4c0', '#d0d8e0']);
  ctx.fillStyle = '#5a7a8a'; ctx.fillRect(0, 1200, W, 400); leadLayer(ctx, 1600, 17, H);
  for (let i = 0; i < 4; i++) { const x = 160 + i * 240, y = 1300 + (i % 2) * 120, sick = u > 1.4 + i * 0.5, tilt = sick ? R2((u - 1.4 - i * 0.5) / 1.5) * 0.9 : 0;
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.fillStyle = '#8a6a4a'; ctx.beginPath(); ctx.ellipse(0, 0, 80, 40, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#2a6a3a'; ctx.beginPath(); ctx.arc(-70, -40, 30, 0, 6.283); ctx.fill(); ctx.fillStyle = '#e8a020'; ctx.beginPath(); ctx.moveTo(-96, -40); ctx.lineTo(-124, -34); ctx.lineTo(-96, -30); ctx.fill(); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Birds swallow lead shot', 'as grit. Lead poisoning', 'wipes out whole species.'], 230, 0.15, { size: 68, out: OUT('ducks') });
}

// ================================================================ 8. rivers run dry
function vRivers2(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 4.0));
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#f0e0c0']);
  ctx.fillStyle = '#c8a878'; ctx.fillRect(0, 900, W, H);
  ctx.fillStyle = '#9a8060'; ctx.beginPath(); ctx.moveTo(380, 900); ctx.quadraticCurveTo(260, 1400, 120, H); ctx.lineTo(960, H); ctx.quadraticCurveTo(820, 1400, 700, 900); ctx.fill();
  const w = lerp(1, 0.08, k); ctx.fillStyle = '#3a8ab0'; ctx.beginPath(); ctx.moveTo(540 - 160 * w, 900); ctx.quadraticCurveTo(540 - 280 * w, 1400, 540 - 420 * w, H); ctx.lineTo(540 + 420 * w, H); ctx.quadraticCurveTo(540 + 280 * w, 1400, 540 + 160 * w, 900); ctx.fill();
  ctx.strokeStyle = 'rgba(90,60,40,0.5)'; ctx.lineWidth = 4; const r = rng(4); for (let i = 0; i < 20 * k; i++) { let x = 200 + r() * 680, y = 1100 + r() * 700; ctx.beginPath(); ctx.moveTo(x, y); for (let s = 0; s < 4; s++) { x += (r() - 0.5) * 60; y += (r() - 0.5) * 30; ctx.lineTo(x, y); } ctx.stroke(); }
  for (let i = 0; i < 5; i++) { const x = 300 + i * 120, y = 1500 + (i % 2) * 120; ctx.save(); ctx.translate(x, y); ctx.scale(1, -1); ctx.fillStyle = '#b8b0a0'; ctx.beginPath(); ctx.ellipse(0, 0, 34, 14, 0, 0, 6.283); ctx.fill(); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.5);
  say(ctx, u, ['No water falls from', 'the sky. Rivers', 'run dry.'], 230, 0.15, { size: 80, out: OUT('rivers') });
}

// ================================================================ 9. farms die; people thirst
function vThirst(ctx, u) {
  bgSky(ctx, ['#e8c890', '#f0d8a8', '#f8ecc8']);
  ctx.fillStyle = '#c8a870'; ctx.fillRect(0, 1100, W, H);
  for (let row = 0; row < 12; row++) { const q = row / 11, y = 1120 + q * q * 760, s = 0.3 + q * 1.4, n = Math.floor(24 - q * 12);
    for (let i = 0; i < n; i++) { const x = (i + (row % 2) * 0.5) / n * W; ctx.strokeStyle = '#8a7040'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20 * s, y - 40 * s, x + 30 * s, y - 50 * s); ctx.stroke(); } }
  massCrowd(ctx, u, { n: 300, yFar: 1200, yNear: 1900, sFar: 20, sNear: 120, x0: 300, x1: 780, seed: 4, col: '#3a3a4a', arms: 0.3 });
  ctx.fillStyle = '#3a86ff'; ctx.beginPath(); ctx.roundRect(470, 1080, 140, 200, 20); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('H₂O', 540, 1190);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Farms use 70% of our', 'fresh water. Crops die.', 'Every drop is fought over.'], 230, 0.15, { size: 68, out: OUT('thirst') });
}

// ================================================================ 10. the oceans drain away
function vOceans(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 4.4));
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#e8f0f4']);
  const lvl = lerp(1000, 1550, k); ctx.fillStyle = '#9a8a70'; ctx.fillRect(0, 1000, W, H);
  ctx.fillStyle = '#2a6a9a'; ctx.fillRect(0, lvl, W, H);
  for (let i = 0; i < 7; i++) { const y = 1000 + i * 80; if (y < lvl) { ctx.strokeStyle = 'rgba(240,240,240,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, 940, 360, 40); for (let i = 0; i < 4; i++) ctx.fillRect(40 + i * 90, 980, 18, 480);
  [[660, 1280], [300, 1460]].forEach(([x, y], i) => { const yy = Math.min(y, lvl - 10); ctx.save(); ctx.translate(x, yy); ctx.rotate(k * (i ? -0.15 : 0.2)); ctx.fillStyle = '#263a6a'; ctx.beginPath(); ctx.moveTo(-200, -30); ctx.lineTo(200, -30); ctx.lineTo(170, 14); ctx.lineTo(-170, 14); ctx.fill(); ctx.fillStyle = '#e8e8f0'; ctx.fillRect(-60, -100, 120, 70); ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.5);
  say(ctx, u, ['Seas keep evaporating,', 'but nothing comes back:', '1.4 m lower every year'], 230, 0.15, { size: 68, out: 2.8 });
  say(ctx, u, ['In ~2,600 years, the', 'oceans are gone'], 230, 2.9, { size: 80, out: OUT('oceans') });
}

// ================================================================ 11. scale
function vScale(ctx, u) {
  bgSky(ctx, ['#2a2e3a', '#3a3e4a', '#4a4e5a']);
  leadRain(ctx, u, 120, 21, 900, 7);
  ctx.fillStyle = 'rgba(20,22,30,0.55)'; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Every year it rains'], 620, 0.15, { size: 76, x: W / 2, align: 'center', out: OUT('scale') });
  bigNum(ctx, u, '1,300,000,000', 860, 0.4, { size: 120, color: PB_L, out: OUT('scale') });
  say(ctx, u, ['years of the world’s', 'lead mining'], 1000, 0.8, { size: 66, weight: 800, x: W / 2, align: 'center', out: OUT('scale') });
}

// ================================================================ 12. the toll
function vToll2(ctx, u) {
  bgSky(ctx, ['#1a1c24', '#24262e', '#2e3038']);
  leadLayer(ctx, 1400, 23, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['From thirst and famine:'], 700, 0.15, { size: 72, x: W / 2, align: 'center', out: OUT('toll') });
  bigNum(ctx, u, 'Billions die (est.)', 920, 0.6, { size: 100, color: '#ffffff', out: OUT('toll') });
}

// ================================================================ 13. final: a dry world wrapped in lead
function vLeadWorld(ctx, u) {
  space(ctx, u);
  const z = lerp(1.1, 0.85, easeInOut(prog(u, 0, 5))), R = 440 * z, cx = W / 2, cy = 1150;
  glow(ctx, cx, cy, R * 1.3, '180,186,200', 0.25);
  globe(ctx, cx, cy, R, { lon0: 10 + u * 6, lat0: 15, t: u, ink: false });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#808080'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.05, cx, cy, R); g.addColorStop(0, 'rgba(240,242,246,0.55)'); g.addColorStop(0.5, 'rgba(150,155,166,0.35)'); g.addColorStop(1, 'rgba(40,42,50,0.75)');
  ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  ctx.strokeStyle = 'rgba(160,200,255,0.35)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R + 6, 0, 6.283); ctx.stroke();
  ctx.font = `800 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.globalAlpha = R2((u - 1.2) / 0.6); ctx.fillText('dry seabeds · lead-covered continents', W / 2, cy + R + 90); ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Earth: a dry ball', 'wrapped in lead'], 230, 0.15, { size: 92, out: OUT('world') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: u * 4, lat0: 20, t: u, ink: false });
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
