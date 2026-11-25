// What if the Moon were 10 times closer?   (house style: original planetary look, mature captions)
//
// PHYSICS (checked):
//  - Distance 384,400 km -> 38,440 km. Angular size from the surface: 2*1737/(38440-6371) ≈ 0.108 rad
//    ≈ 6.2° (today 0.52°): "more than 10x wider", ~100x the area -> full-moon light ~100x brighter
//    (~0.25 lux -> ~25 lux, enough to read by).
//  - Tidal force ∝ 1/d³ -> 1,000x stronger. Today's lunar equilibrium tide is a few tenths of a metre,
//    so equilibrium tides of hundreds of metres. Hedged as "hundreds of metres".
//  - Kepler: period ∝ a^1.5 -> 27.3 d × 0.0316 ≈ 0.86 d ≈ 21 h, faster than Earth's 24 h spin.
//    So it rises in the WEST and drifts across the sky over days (synodic ~6 days).
//  - 38,440 km is inside the synchronous orbit (42,164 km), so tides drag it INWARD, like Phobos at
//    Mars, until it reaches the Roche limit (~18,000 km for a fluid-like body) and breaks into a ring.
//    Timescale not stated ("eventually").
//  - Solid-Earth tides also scale up: constant quakes and volcanism, compared to Io. Hedged as "would".
//  - ~40% of people live within 100 km of a coast (UN Atlas of the Oceans).
// PLOT HOLES: how it got there is the premise. It doesn't crash immediately: the orbit is stable on
// human timescales; the spiral is the long-term ending, stated as "eventually".
const SHORT = {
  title: 'What if the Moon were 10 times closer?',
  duration: 46,
  sfx: [
    [0.3, 'riser'], [1.2, 'braam'],
    [5.0, 'whoosh'], [6.0, 'sparkle'], [8.4, 'sparkle'],
    [11.0, 'whoosh'], [12.0, 'wobble:3'],
    [16.0, 'whoosh'], [16.5, 'rumble:3'], [18.6, 'bigwave'], [21.0, 'bigwave'],
    [23.0, 'whoosh'], [23.6, 'rumble:4.5'], [25.0, 'boom'], [26.8, 'boom'],
    [29.0, 'whoosh'], [30.2, 'dim'], [31.6, 'sparkle'],
    [34.0, 'whoosh'], [35.0, 'riser'], [38.6, 'boom'], [38.8, 'sparkle'], [39.4, 'braam'],
    [42.5, 'whoosh'], [43.2, 'ding'],
  ],
  music: { bpm: 96, mode: 'dark', until: 45.6, duckAt: [[38.4, 39.6]] },
};

function render(ctx, t) {
  sequence(ctx, t, [[0, sHook], [5, sSky], [11, sWest], [16, sTides], [23, sCrust], [29, sEclipse], [34, sRing], [42.5, sEnd]]);
  // small watermark instead of a mascot
  ctx.save(); ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.textAlign = 'left';
  if (t < 42.5) ctx.fillText('WHAT IF, THOUGH?', 70, 1850); ctx.restore();
}

function bigMoon(ctx, x, y, r, t, light = 1) {
  glow(ctx, x, y, r * 1.6, '220,230,255', 0.35 * light);
  ctx.fillStyle = grad(ctx, ['#f4f6fb', '#c9cfdb'], x - r, y - r, x + r, y + r);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(140,150,170,0.55)';
  for (const [dx, dy, s] of [[-0.35, -0.2, 0.22], [0.25, 0.15, 0.16], [-0.05, 0.45, 0.12], [0.4, -0.38, 0.09], [-0.5, 0.25, 0.08], [0.1, -0.05, 0.07]]) {
    ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, s * r, 0, 6.283); ctx.fill();
  }
}

// ---------------------------------------------------------------- scenes
function sHook(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 0, 5, 1.0, 1.06, W / 2, 1150);
  earth(ctx, W / 2 - 120, 1250, 300, t * 0.3);
  const k = easeInOut(prog(t, 0.6, 2.6));               // moon swings in from far away
  bigMoon(ctx, lerp(W + 200, W / 2 + 260, k), lerp(380, 880, k), lerp(30, 150, k), t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['What if the Moon', 'were 10 times closer?'], 340, 0.4, { size: 92, out: 4.7, mark: { line: 1, from: 5, to: 13, color: '#3a86ff' } });
}

function sSky(ctx, t) {
  // night landscape lit by a giant moon
  const g = grad(ctx, ['#1c2b5a', '#3b5998', '#7f9cd6']); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.35);
  drift(ctx, t, 5, 11, 1.0, 1.05, W / 2, 800);
  bigMoon(ctx, W / 2, 820, 380, t, 1.3);
  glow(ctx, W / 2, 1500, 900, '200,215,255', 0.25);
  ctx.fillStyle = '#2b3d6b'; ctx.beginPath(); ctx.moveTo(0, 1420); ctx.quadraticCurveTo(300, 1300, 620, 1400); ctx.quadraticCurveTo(880, 1470, W, 1380); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = '#1e2c52'; ctx.fillRect(0, 1560, W, H);
  ctx.fillStyle = '#152140'; ctx.fillRect(700, 1420, 220, 150); ctx.beginPath(); ctx.moveTo(680, 1430); ctx.lineTo(810, 1330); ctx.lineTo(940, 1430); ctx.fill();
  ctx.fillStyle = '#ffd88a'; ctx.fillRect(750, 1460, 50, 50);
  // small "today's moon" for scale
  bigMoon(ctx, 160, 360, 18, t, 0.6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `700 30px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'left'; ctx.fillText('today', 195, 370);
  say(ctx, t, ['Over 10× wider in the sky'], 1680, 5.4, { size: 76, out: 10.6 });
  say(ctx, t, ['Full-moon nights ~100× brighter.', 'Bright enough to read by.'], 1790, 7.6, { size: 52, weight: 800, out: 10.6 });
}

function sWest(ctx, t) {
  const g = grad(ctx, ['#4a6fd1', '#86a8f0', '#f6c89f']); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 11, 16, 1.0, 1.04);
  // horizon with compass, moon crawling from WEST to EAST (left = west here)
  const p = prog(t, 11.2, 15.8);
  const ax = lerp(120, 960, p), ay = 1300 - Math.sin(p * Math.PI) * 700;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 6; ctx.setLineDash([18, 16]);
  ctx.beginPath(); for (let i = 0; i <= 40; i++) { const q = i / 40, x = lerp(120, 960, q), y = 1300 - Math.sin(q * Math.PI) * 700; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
  bigMoon(ctx, ax, ay, 230, t, 0.7);
  ctx.fillStyle = '#3d4f7a'; ctx.fillRect(0, 1320, W, H);
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
  ctx.fillText('W', 120, 1420); ctx.fillText('E', 960, 1420);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['It would orbit faster', 'than Earth spins'], 330, 11.4, { size: 86, out: 15.6 });
  say(ctx, t, ['Rising in the west, crawling', 'across the sky for days'], 1560, 12.8, { size: 58, weight: 800, out: 15.6, mark: { line: 0, from: 7, to: 18, color: '#ff6b5b' } });
}

function sTides(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 16, 23, 1.0, 1.04, W / 2, 1000);
  // globe with exaggerated tidal bulge facing the moon
  const cx = W / 2, cy = 760, r = 230;
  bigMoon(ctx, cx + 430, cy - 20, 66, t, 0.5);
  const bul = 1 + 0.16 * easeInOut(prog(t, 16.4, 18.0));
  ctx.save(); ctx.translate(cx, cy); ctx.scale(bul, 1 / Math.sqrt(bul));
  ctx.fillStyle = 'rgba(80,170,255,0.55)'; ctx.beginPath(); ctx.arc(0, 0, r * 1.08, 0, 6.283); ctx.fill();
  ctx.restore();
  earth(ctx, cx, cy, r, 0.7 + t * 0.05);
  // coast: water surging up over a city
  const cityTop = 1180;
  ctx.save(); ctx.beginPath(); roundRect(ctx, 50, cityTop, W - 100, 640, 40); ctx.clip();
  ctx.fillStyle = grad(ctx, ['#7fb3ff', '#cfe3ff'], 0, cityTop, 0, H); ctx.fillRect(0, cityTop, W, H - cityTop);
  ctx.translate(0, cityTop); ctx.scale(1, 640 / H);
  skyline(ctx, H - 40, '#4b5d8a', 0, t);
  const surge = Math.max(0, Math.sin((t - 17.6) * 0.75));
  megaWave(ctx, t, 0.08 + surge * 0.34);
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Tidal pull: 1,000× stronger'], 300, 16.4, { size: 80, out: 22.6, mark: { line: 0, from: 11, to: 26, color: '#ff6b5b' } });
  say(ctx, t, ['Tides hundreds of meters high.', '40% of humanity lives near a coast.'], 1100, 19.4, { size: 54, weight: 800, out: 22.6 });
}

function sCrust(ctx, t) {
  space(ctx, t);
  const [sx, sy] = shakeOffset(t, 25.0, 1.4, 26), [sx2, sy2] = shakeOffset(t, 26.8, 1.2, 22);
  ctx.translate(sx + sx2, sy + sy2);
  drift(ctx, t, 23, 29, 1.0, 1.06, W / 2, 1100);
  const cx = W / 2, cy = 1120, r = 360;
  earth(ctx, cx, cy, r, 1.4 + t * 0.04);
  // glowing cracks + eruptions dotting the globe
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.clip();
  const rr = rng(31), heat = prog(t, 23.6, 26.0);
  ctx.strokeStyle = `rgba(255,120,40,${0.9 * heat})`; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { let x = cx + (rr() - 0.5) * 2 * r, y = cy + (rr() - 0.5) * 2 * r; ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += (rr() - 0.5) * 120; y += (rr() - 0.5) * 120; ctx.lineTo(x, y); } ctx.stroke(); }
  for (let i = 0; i < 14; i++) { const x = cx + (rr() - 0.5) * 1.6 * r, y = cy + (rr() - 0.5) * 1.6 * r, at = 24 + rr() * 4;
    if (t > at) { const k = prog(t, at, at + 1.2); glow(ctx, x, y, 50 + 40 * k, '255,110,30', 0.9 * (1 - k * 0.4));
      ctx.fillStyle = `rgba(90,80,90,${0.6 * k})`; ctx.beginPath(); ctx.arc(x + 10, y - 40 * k, 30 * k + 10, 0, 6.283); ctx.fill(); } }
  ctx.restore();
  bigMoon(ctx, cx + 420, 520, 110, t, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The ground itself', 'would flex too'], 300, 23.4, { size: 84, out: 28.6 });
  say(ctx, t, ['Constant quakes and eruptions,', "like Jupiter's volcanic moon Io"], 1660, 25.2, { size: 54, weight: 800, out: 28.6, mark: { line: 0, from: 0, to: 29, color: '#ff6b5b' } });
}

function sEclipse(ctx, t) {
  const cover = easeInOut(prog(t, 29.6, 31.4));
  const g = grad(ctx, [mixHex('#5b8def', '#0b1030', cover), mixHex('#a9c6ff', '#1a2050', cover)]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, cover);
  drift(ctx, t, 29, 34, 1.0, 1.05, W / 2, 900);
  const sx = W / 2, sy = 900;
  if (cover > 0.8) { for (let k = 0; k < 3; k++) glow(ctx, sx, sy, 420 + k * 120, '255,240,210', (0.55 - k * 0.12) * prog(cover, 0.8, 1)); }  // corona
  ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(sx, sy, 120, 0, 6.283); ctx.fill();
  glow(ctx, sx, sy, 300, '255,230,150', 0.6 * (1 - cover));
  ctx.fillStyle = '#0c1024'; ctx.beginPath(); ctx.arc(lerp(sx - 900, sx, cover), sy, 330, 0, 6.283); ctx.fill();
  ctx.strokeStyle = `rgba(255,240,210,${0.7 * prog(cover, 0.85, 1)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, sy, 334, 0, 6.283); ctx.stroke();
  ctx.fillStyle = '#18213d'; ctx.fillRect(0, 1500, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Total solar eclipses', 'become routine'], 330, 29.4, { size: 88, out: 33.6 });
  say(ctx, t, ['The Moon would dwarf the Sun', 'in the sky'], 1640, 31.6, { size: 56, weight: 800, out: 33.6 });
}

function sRing(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 34, 42.5, 1.0, 1.08, W / 2, 1000);
  const cx = W / 2, cy = 1050;
  const shatter = 38.6;
  // inward spiral path
  const p = easeIn(prog(t, 34.6, shatter));
  const ang = -1.2 + p * 9, rad = lerp(430, 290, p);
  const ringP = prog(t, shatter, 41.5);
  // ring (back half)
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, true);
  earth(ctx, cx, cy, 200, t * 0.4, 0.2);
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, false);
  if (t < shatter) {
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.setLineDash([10, 12]);
    ctx.beginPath(); for (let i = 0; i <= 80; i++) { const q = i / 80, a = -1.2 + q * 9, rr = lerp(430, 290, q); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.35; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
    const mx = cx + Math.cos(ang) * rad, my = cy + Math.sin(ang) * rad * 0.35;
    const stretch = 1 + p * 0.5;
    ctx.save(); ctx.translate(mx, my); ctx.rotate(Math.atan2(cy - my, cx - mx)); ctx.scale(stretch, 1 / stretch);
    bigMoon(ctx, 0, 0, 60, t, 0.5); ctx.restore();
  }
  flash(ctx, t, shatter, 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['And it would be doomed.'], 300, 34.4, { size: 84, out: 38.3 });
  say(ctx, t, ['Too close to keep pace with Earth,', "it spirals inward, like Mars's moon Phobos"], 1560, 35.4, { size: 50, weight: 800, out: 38.3 });
  say(ctx, t, ['Until Earth’s gravity', 'tears it into a ring.'], 300, 39.4, { size: 88, mark: { line: 1, from: 0, to: 20, color: '#3a86ff' } });
}

function drawRing(ctx, cx, cy, p, t, back) {
  const r = rng(77);
  for (let i = 0; i < 900; i++) {
    const a = r() * 6.283 + t * 0.15 * (0.8 + r() * 0.4), rr = 280 + r() * 260 * Math.min(1, p * 1.4);
    const y = cy + Math.sin(a) * rr * 0.28;
    if ((Math.sin(a) < 0) !== back) continue;
    const spread = Math.min(1, p * 1.3);
    const x = cx + Math.cos(a) * rr * spread + (1 - spread) * 250;
    ctx.fillStyle = `rgba(${200 + r() * 55},${200 + r() * 40},${190 + r() * 40},${0.5 + r() * 0.5})`;
    ctx.fillRect(x, lerp(cy - 300, y, spread), 3 + r() * 4, 3 + r() * 4);
  }
}

function sEnd(ctx, t) {
  space(ctx, t);
  earth(ctx, W / 2, 1400, 240, t * 0.3, 0.2);
  drawRing(ctx, W / 2, 1400, 1, t, false);
  say(ctx, t, ['WHAT IF,'], 720, 42.8, { size: 150, x: W / 2, align: 'center' });
  say(ctx, t, ['THOUGH?'], 880, 43.0, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, t, ['Follow for a new one every day'], 1000, 43.6, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

function easeIn(p) { return p * p * p; }
function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
