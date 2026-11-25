// What if the Moon were 10 times closer?   (FX engine v5: realistic globe, visceral destruction, 60 fps)
//
// PHYSICS (checked):
//  - Distance 384,400 km -> 38,440 km. Angular size from the surface ≈ 6.2° (today 0.52°): "more than
//    10x wider"; ~100x the area -> full-moon light ~100x brighter (~0.25 lux -> ~25 lux).
//  - Tidal force ∝ 1/d³ -> 1,000x. Today's lunar equilibrium tide is a few tenths of a metre, so
//    equilibrium tides of hundreds of metres. Hedged as "hundreds of meters".
//  - Kepler: period ∝ a^1.5 -> ≈21 h < 24 h spin: it rises in the WEST and crawls across the sky.
//  - Inside synchronous orbit (42,164 km): tides drag it inward like Phobos until the Roche limit
//    (~18,000 km) tears it apart into a ring; some debris would fall to Earth. "Eventually".
//  - Solid-Earth tides scale up too: constant quakes and eruptions (Io comparison). Hedged "would".
//  - ~40% of people live within 100 km of a coast (UN Atlas of the Oceans).
// PLOT HOLES: how it got there is the premise; the orbit is stable on human timescales, the spiral
// is the long-term ending.
const SHORT = {
  title: 'What if the Moon were 10 times closer?',
  duration: 48,
  fps: 60,
  motionSamples: 2,
  sfx: [
    [0.3, 'riser'], [1.4, 'braam'],
    [5.0, 'whoosh'], [6.0, 'sparkle'], [8.4, 'sparkle'],
    [11.0, 'whoosh'], [12.0, 'wobble:3'],
    [16.0, 'whoosh'], [16.4, 'rumble:4'],
    [20.0, 'whoosh'], [20.2, 'bigwave'], [21.0, 'rumble:6'], [22.2, 'crash'], [23.4, 'crash'], [24.6, 'bigwave'], [25.2, 'crash'],
    [27.0, 'whoosh'], [27.3, 'rumble:6'], [28.0, 'boom'], [28.6, 'crash'], [29.8, 'boom'], [31.0, 'crash'],
    [33.0, 'whoosh'], [34.0, 'dim'], [35.4, 'sparkle'],
    [37.0, 'whoosh'], [37.6, 'riser'], [40.4, 'boom'], [40.5, 'braam'], [42.0, 'dive'], [42.6, 'boom'], [43.4, 'boom'],
    [45.0, 'whoosh'], [45.6, 'ding'],
  ],
  music: { bpm: 96, mode: 'dark', until: 47.6, duckAt: [[40.2, 41.2]] },
};

const SUN = [-0.6, -0.35, 0.72];

function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, [[0, sHook], [5, sSky], [11, sWest], [16, sBulge], [20, sFlood], [27, sQuake], [33, sEclipse], [37, sRing], [45, sEnd]]);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 45) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx);
}

// ---------------------------------------------------------------- scenes
function sHook(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 0, 5, 1.0, 1.06, W / 2, 1150);
  const k = easeInOut(prog(t, 0.6, 2.8));
  globe(ctx, W / 2 - 110, 1260, 330, { lon0: -20 + t * 4, lat0: 18, t, sun: SUN });
  moonFx(ctx, lerp(W + 150, W / 2 + 290, k), lerp(330, 820, k), lerp(25, 150, k), { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['What if the Moon', 'were 10 times closer?'], 340, 0.4, { size: 92, out: 4.7, mark: { line: 1, from: 5, to: 13, color: '#3a86ff' } });
}

function sSky(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#0f1c3f', '#4a679f']); ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.3);
  drift(ctx, t, 5, 11, 1.0, 1.05, W / 2, 800);
  glow(ctx, W / 2, 820, 700, '200,215,255', 0.35);
  moonFx(ctx, W / 2, 820, 380, { sun: [0.1, -0.1, 0.99] });
  moonFx(ctx, 150, 330, 18, { sun: [0.1, -0.1, 0.99] });                   // today's Moon, for scale
  dof(ctx, 3, c => { c.fillStyle = '#2b3d6b'; c.beginPath(); c.moveTo(0, 1420); c.quadraticCurveTo(300, 1300, 620, 1400); c.quadraticCurveTo(880, 1470, W, 1380); c.lineTo(W, H); c.lineTo(0, H); c.fill(); });
  ctx.fillStyle = grad(ctx, ['#2a3c66', '#141f3a'], 0, 1520, 0, H); ctx.fillRect(0, 1540, W, H);
  ctx.fillStyle = '#101a33';
  for (let i = 0; i < 14; i++) { const x = i * 85, h = 120 + (i * 37 % 60); ctx.beginPath(); ctx.moveTo(x - 50, 1550); ctx.lineTo(x, 1550 - h); ctx.lineTo(x + 50, 1550); ctx.fill(); }
  ctx.fillStyle = '#0d1630'; ctx.fillRect(700, 1420, 220, 140); ctx.beginPath(); ctx.moveTo(680, 1430); ctx.lineTo(810, 1330); ctx.lineTo(940, 1430); ctx.fill();
  ctx.fillStyle = '#ffd88a'; ctx.fillRect(750, 1460, 50, 50); glow(ctx, 775, 1485, 80, '255,216,138', 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `700 30px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'left'; ctx.fillText('today', 185, 340);
  say(ctx, t, ['Over 10× wider in the sky'], 1690, 5.4, { size: 76, out: 10.6 });
  say(ctx, t, ['Full-moon nights ~100× brighter.', 'Bright enough to read by.'], 1790, 7.6, { size: 50, weight: 800, out: 10.6 });
}

function sWest(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#1d2f6b', '#5a78c8', '#f3b98a']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 11, 16, 1.0, 1.04);
  const p = prog(t, 11.2, 15.8);
  const ax = lerp(130, 950, p), ay = 1300 - Math.sin(p * Math.PI) * 720;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 5; ctx.setLineDash([16, 16]);
  ctx.beginPath(); for (let i = 0; i <= 40; i++) { const q = i / 40; const x = lerp(130, 950, q), y = 1300 - Math.sin(q * Math.PI) * 720; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
  glow(ctx, ax, ay, 420, '220,230,255', 0.3);
  moonFx(ctx, ax, ay, 230, { sun: [0.4, -0.2, 0.9] });
  ctx.fillStyle = grad(ctx, ['#26345e', '#121a33'], 0, 1320, 0, H); ctx.fillRect(0, 1320, W, H);
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('W', 130, 1420); ctx.fillText('E', 950, 1420);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['It would orbit faster', 'than Earth spins'], 330, 11.4, { size: 86, out: 15.6 });
  say(ctx, t, ['Rising in the west, crawling', 'across the sky for days'], 1580, 12.8, { size: 58, weight: 800, out: 15.6, mark: { line: 0, from: 7, to: 18, color: '#ff6b5b' } });
}

function sBulge(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 16, 20, 1.0, 1.05, W / 2, 1000);
  const cx = W / 2 - 60, cy = 1050, r = 340;
  moonFx(ctx, cx + 500, cy - 40, 80, { sun: SUN });
  const bul = 1 + 0.2 * easeInOut(prog(t, 16.4, 18.4));
  ctx.save(); ctx.translate(cx, cy); ctx.scale(bul, 1 / Math.sqrt(bul));
  const g = ctx.createRadialGradient(0, 0, r * 0.9, 0, 0, r * 1.1);
  g.addColorStop(0, 'rgba(70,160,255,0.75)'); g.addColorStop(1, 'rgba(70,160,255,0.15)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, 6.283); ctx.fill(); ctx.restore();
  globe(ctx, cx, cy, r, { lon0: -60, lat0: 10, t, sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Tidal pull: 1,000× stronger'], 330, 16.4, { size: 80, out: 19.7, mark: { line: 0, from: 11, to: 26, color: '#ff6b5b' } });
  say(ctx, t, ["Earth's oceans pile up toward it"], 1620, 17.4, { size: 56, weight: 800, out: 19.7 });
}

// 20–27: street level: a wall of ocean tears through a coastal city.
function sFlood(ctx, t) {
  const [sx, sy] = shakeOffset(t, 21.0, 6.0, 14);
  ctx.translate(sx, sy);
  ctx.fillStyle = grad(ctx, ['#5d7fb3', '#a9c2e3', '#e8d3b8']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 20, 27, 1.0, 1.07, W / 2, 1300);
  const ground = 1560;
  dof(ctx, 5, c => { for (let i = 0; i < 9; i++) tower(c, t, -40 + i * 130, 1300, 110, 380 + (i * 53 % 200), { col: '#8c9ab8', seed: 40 + i }); });
  const front = lerp(-420, 1180, easeInOut(prog(t, 20.4, 26.9)));
  const mids = [[80, 170, 720, 1], [300, 190, 900, 1], [540, 160, 640, -1], [760, 200, 980, 1]];
  mids.forEach(([x, w, h, dir], i) => {
    const hit = prog(front, x - 100, x + 500);
    tower(ctx, t, x, ground, w, h, { col: ['#5b6680', '#6c5b7b', '#4f6d7a', '#7a6a5b'][i], fall: i % 2 ? 0 : hit, crumble: i % 2 ? hit : hit * 0.3, dir, seed: i + 1 });
    const hitAt = 20.4 + 6.2 * ((x - 100 + 500) / 2000);
    if (hit > 0.02) dustBurst(ctx, t, x + w / 2, ground - 40, hitAt, { size: 1.3, seed: i + 7 });
  });
  ctx.fillStyle = '#3b3f4c'; ctx.fillRect(-60, ground, W + 120, H);
  waterWall(ctx, t, front, ground + 20, 620, { seed: 4 });
  if (front > 100) ship(ctx, front - 160, ground - 610 + Math.sin(t * 2) * 20, 0.9, -0.15 + Math.sin(t * 1.5) * 0.06);
  debrisBurst(ctx, t, Math.max(100, front), ground - 300, 22.2, { n: 50, speed: 900, dir: -0.9, spread: 1.4, col: '#2e3442', seed: 12 });
  debrisBurst(ctx, t, Math.max(100, front), ground - 300, 24.6, { n: 50, speed: 950, dir: -0.9, spread: 1.4, col: '#3d3a46', seed: 13 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Tides hundreds of', 'meters high'], 330, 20.6, { size: 92, out: 26.6 });
  say(ctx, t, ['40% of humanity lives', 'within 100 km of a coast'], 1660, 22.8, { size: 56, weight: 800, out: 26.6, mark: { line: 0, from: 0, to: 15, color: '#ff6b5b' } });
}

// 27–33: the crust flexes: fissures, collapsing towers, an erupting volcano behind.
function sQuake(ctx, t) {
  const [sx, sy] = shakeOffset(t, 27.3, 5.8, 22);
  ctx.translate(sx + Math.sin(t * 40) * 4, sy);
  ctx.fillStyle = grad(ctx, ['#2a1a2e', '#7a2f2a', '#e0773a']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 27, 33, 1.0, 1.06, W / 2, 1300);
  const erupt = prog(t, 27.8, 29.0);
  plume(ctx, t, 600, 1050, { height: 1300, width: 330, grow: 0.3 + erupt * 0.7, seed: 6, col: [60, 52, 58], light: [170, 150, 140] });
  ctx.fillStyle = '#26151a'; ctx.beginPath(); ctx.moveTo(180, 1360); ctx.lineTo(540, 1040); ctx.lineTo(660, 1040); ctx.lineTo(1040, 1360); ctx.fill();
  if (erupt > 0) { glow(ctx, 600, 1040, 260, '255,120,40', 0.9 * erupt); embers(ctx, t, 600, 1040, { n: 90, w: 300, h: 700 });
    debrisBurst(ctx, t, 600, 1040, 28.0, { col: '#ff7a2a', n: 40, speed: 1100, seed: 21 }); debrisBurst(ctx, t, 600, 1040, 29.8, { col: '#ff9a3a', n: 40, speed: 1200, seed: 22 }); }
  [[60, 180, 520, 28.6], [820, 200, 620, 31.0]].forEach(([x, w, h, at], i) => {
    tower(ctx, t, x, 1500, w, h, { col: ['#4a4f63', '#5a4a5f'][i], crumble: easeInOut(prog(t, at, at + 1.6)), seed: 50 + i });
    dustBurst(ctx, t, x + w / 2, 1480, at, { size: 1.2, seed: 60 + i, col: [120, 100, 95] });
  });
  ctx.fillStyle = '#2d2a33'; ctx.fillRect(-60, 1500, W + 120, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 8; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(-60, 1700); ctx.lineTo(W + 60, 1700); ctx.stroke(); ctx.setLineDash([]);
  const open = easeInOut(prog(t, 27.6, 29.6));
  if (open > 0) {
    const top = [], bot = [];
    for (let i = 0; i <= 44; i++) {
      const x = lerp(-60, W + 60, i / 44), mid = 1640 + Math.sin(i * 0.25) * 18 + noise3(i * 0.8, 2, 3) * 30 + (i % 2 ? 8 : -8);
      const w = open * (26 + Math.abs(noise3(i * 0.9, 5, 1)) * 60) * (0.6 + 0.4 * Math.sin(i * 0.2 + 1));
      top.push([x + noise3(i, 7, 1) * 10, mid - w]); bot.push([x + noise3(i, 9, 1) * 10, mid + w]);
    }
    ctx.save(); ctx.beginPath(); top.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath();
    const g = ctx.createLinearGradient(0, 1560, 0, 1740); g.addColorStop(0, '#150b0a'); g.addColorStop(0.5, '#ff5a10'); g.addColorStop(1, '#150b0a');
    ctx.fillStyle = g; ctx.fill();
    ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)'; ctx.fillStyle = `rgba(255,120,30,${0.55 * open})`; ctx.fill(); ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 5; ctx.strokeStyle = '#1b1416'; ctx.stroke();
    ctx.restore();
    embers(ctx, t, W / 2, 1650, { n: 70, w: W, h: 400, seed: 14 });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The ground itself', 'would flex too'], 330, 27.4, { size: 88, out: 32.6 });
  say(ctx, t, ['Constant quakes and eruptions,', "like Jupiter's volcanic moon Io"], 540, 29.4, { size: 50, weight: 800, out: 32.6, mark: { line: 0, from: 0, to: 29, color: '#ff6b5b' } });
}

function sEclipse(ctx, t) {
  const cover = easeInOut(prog(t, 33.4, 35.2));
  ctx.fillStyle = grad(ctx, [mixHex('#4f7fdc', '#05081a', cover), mixHex('#a9c6ff', '#121736', cover)]); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, cover);
  drift(ctx, t, 33, 37, 1.0, 1.05, W / 2, 900);
  const sx = W / 2, sy = 900;
  if (cover > 0.8) { const c = prog(cover, 0.8, 1); for (let k = 0; k < 4; k++) glow(ctx, sx, sy, 400 + k * 140, '255,240,215', (0.6 - k * 0.13) * c); }
  ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.arc(sx, sy, 120, 0, 6.283); ctx.fill();
  glow(ctx, sx, sy, 320, '255,230,150', 0.7 * (1 - cover));
  ctx.fillStyle = '#05070f'; ctx.beginPath(); ctx.arc(lerp(sx - 900, sx, cover), sy, 330, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#0c1024'; ctx.fillRect(0, 1500, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Total solar eclipses', 'become routine'], 330, 33.4, { size: 88, out: 36.6 });
}

// 37–45: the death spiral, break-up, ring, and debris raining into the atmosphere.
function sRing(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 37, 45, 1.0, 1.06, W / 2, 1100);
  const cx = W / 2, cy = 1150, shatter = 40.4;
  const p = Math.pow(prog(t, 37.4, shatter), 2);
  const ang = -1.0 + p * 7.5, rad = lerp(470, 330, p);
  const ringP = prog(t, shatter, 44);
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, true);
  globe(ctx, cx, cy, 260, { lon0: 10 + t * 3, lat0: 15, t, sun: SUN });
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, false);
  const mx = cx + Math.cos(ang) * rad, my = cy + Math.sin(ang) * rad * 0.35;
  if (t < shatter) {
    const st = 1 + p * 0.45;
    ctx.save(); ctx.translate(mx, my); ctx.rotate(Math.atan2(cy - my, cx - mx)); ctx.scale(st, 1 / st);
    moonFx(ctx, 0, 0, 70, { sun: SUN, crack: p * 3 }); ctx.restore();
  } else {
    debrisBurst(ctx, t, mx, my, shatter, { n: 70, speed: 380, g: 0, spread: 6.28, col: '#b9b6ae', size: 18, dur: 4, seed: 31 });
    shockwave(ctx, t, mx, my, shatter, { maxR: 500, dur: 1.2, col: '255,220,180', flat: 1 });
  }
  flash(ctx, t, shatter, 0.35);
  for (let i = 0; i < 7; i++) { const at = 42.0 + i * 0.25, x0 = 200 + i * 120; fireball(ctx, t, x0 + 260, cy - 520, x0, cy - 200 + (i % 3) * 40, at, 1.1, 0.7); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['And it would be doomed.'], 330, 37.4, { size: 84, out: 40.2 });
  say(ctx, t, ['Too close to keep pace with Earth,', "it spirals inward, like Mars's moon Phobos"], 1640, 38.2, { size: 48, weight: 800, out: 40.2 });
  say(ctx, t, ['Until Earth’s gravity', 'tears it apart.'], 330, 40.8, { size: 92, mark: { line: 1, from: 0, to: 14, color: '#3a86ff' } });
  say(ctx, t, ['A ring forms, and debris rains down'], 1660, 42.2, { size: 54, weight: 800 });
}

function drawRing(ctx, cx, cy, p, t, back) {
  const r = rng(77);
  for (let i = 0; i < 1400; i++) {
    const a = r() * 6.283 + t * 0.15 * (0.8 + r() * 0.4), rr = 300 + r() * 280 * Math.min(1, p * 1.4);
    if ((Math.sin(a) < 0) !== back) continue;
    const spread = Math.min(1, p * 1.3);
    const x = cx + Math.cos(a) * rr * spread + (1 - spread) * 200, y = lerp(cy - 320, cy + Math.sin(a) * rr * 0.28, spread);
    const v = 180 + r() * 70;
    ctx.fillStyle = `rgba(${v},${v - 8},${v - 20},${0.45 + r() * 0.5})`;
    ctx.fillRect(x, y, 2 + r() * 4, 2 + r() * 4);
  }
}

function sEnd(ctx, t) {
  space(ctx, t);
  globe(ctx, W / 2, 1420, 260, { lon0: 30 + t * 3, lat0: 15, t, sun: SUN });
  drawRing(ctx, W / 2, 1420, 1, t, false);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['WHAT IF,'], 720, 45.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, t, ['THOUGH?'], 880, 45.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, t, ['Follow for a new one every day'], 1000, 46.0, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
