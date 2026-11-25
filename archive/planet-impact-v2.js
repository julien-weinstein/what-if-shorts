// What if a planet the size of Mars hit Earth?   (v2: fast cartoon montage, ~16 distinct vignettes)
//
// Every vignette shows a different consequence with its own visual; no reused set pieces.
// PHYSICS / NUMBERS (checked; see archive/planet-impact-v1.js for the working):
//  - Arrives at >= 11.2 km/s (~40,000 km/h). Energy ≈ 4e31 J ≈ 1e8 × Chicxulub; ~29 h of solar output.
//  - Boiling all oceans ≈ 3.6e27 J < 0.01% of the impact energy.
//  - In the final hour its gravity raises enormous tides (tidal force at a few Earth radii from a Mars-mass
//    body dwarfs the Moon's) -> "drags the oceans up toward it".
//  - Global shockwave, ejecta re-entering as fireballs worldwide, rock-vapour atmosphere thousands of
//    degrees hot, a magma ocean hundreds of kilometres deep (giant-impact models): landmarks melt,
//    bunkers fail.
//  - Debris disk -> new moon (a 2022 simulation: possibly within hours). Over millions of years the
//    magma cools, the steam atmosphere rains out, oceans return (as on the early Earth).
//  - Death toll (est.): all 8.2 billion within about a day.
//  - Twist: Theia, a Mars-sized planet, hit the young Earth ~4.5 billion years ago; our Moon formed
//    from the wreckage (leading hypothesis).
const SHORT = {
  title: 'What if a planet the size of Mars hit Earth?',
  duration: 48,
  fps: 60,
  motionSamples: 1,
  sfx: [
    [0.0, 'swell:2.6'], [3.0, 'air'], [5.5, 'air'], [5.7, 'swell:2.2'],
    [8.0, 'air'], [8.2, 'roar:2.4'], [10.5, 'air'], [10.9, 'impact'], [10.95, 'boom'], [11.0, 'quake:3'],
    [13.5, 'air'], [13.7, 'rumble:2.4'], [14.4, 'boom'],
    [16.0, 'air'], [16.4, 'boom'], [17.0, 'impact'], [17.6, 'crumble'], [18.2, 'boom'],
    [19.0, 'air'], [19.2, 'roar:3'], [22.0, 'air'], [22.3, 'crumble'], [23.8, 'crumble'],
    [25.5, 'air'], [25.8, 'quake:2.8'], [28.5, 'air'], [28.7, 'impact'],
    [31.0, 'air'], [31.2, 'rumble:3'], [34.0, 'air'], [34.2, 'swell:3'], [37.5, 'air'], [37.8, 'swell:2.6'],
    [40.5, 'air'], [40.8, 'swell:2.4'], [43.0, 'impact'], [45.0, 'air'], [45.4, 'swell:2.5'],
  ],
  music: { bpm: 74, mode: 'cinematic', until: 47.7, duckAt: [] },
};

const SUN = [-0.6, -0.35, 0.72];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, [[0, vHook], [3, vScope], [5.5, vCrowd], [8, vTide], [10.5, vCrown], [13.5, vShock], [16, vRain], [19, vBoil],
                    [22, vMelt], [25.5, vBunker], [28.5, vToll], [31, vMagma], [34, vMoon], [37.5, vCool], [40.5, vTwist], [45, vEnd]], 0.25);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 45) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}

// ---------------------------------------------------------------- shared cartoon pieces
const R2 = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
function rogue(ctx, x, y, r, glowK = 0) {
  if (glowK > 0) glow(ctx, x, y, r * 2.2, '255,120,60', 0.35 * glowK);
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, '#e08050'); g.addColorStop(1, '#9c4326');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.clip();
  const rr = rng(21);
  for (let i = 0; i < 12; i++) { const a = rr() * 6.283, d = Math.sqrt(rr()) * r * 0.85, s2 = r * (0.05 + rr() * 0.13);
    ctx.fillStyle = '#7f3420'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s2, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = 'rgba(40,20,40,0.45)'; ctx.beginPath(); ctx.arc(x + r * 0.45, y + r * 0.3, r * 1.05, 0, 6.283); ctx.fill();
  ctx.restore(); ctx.lineWidth = Math.max(4, r * 0.035); ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
}
function person(ctx, x, y, h, col = '#141b33', phone = false, t = 0) {   // simple cartoon silhouette
  const u = h / 8; ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -7.2 * u, 0.6 * u, 0, 6.283); ctx.fill();
  roundRect(ctx, -0.9 * u, -6.4 * u, 1.8 * u, 3 * u, 0.6 * u); ctx.fill();
  ctx.lineWidth = 0.6 * u; ctx.beginPath(); ctx.moveTo(-0.4 * u, -3.5 * u); ctx.lineTo(-0.45 * u, 0); ctx.moveTo(0.4 * u, -3.5 * u); ctx.lineTo(0.45 * u, 0); ctx.stroke();
  if (phone) { ctx.lineWidth = 0.45 * u; ctx.beginPath(); ctx.moveTo(0.8 * u, -6 * u); ctx.lineTo(1.4 * u, -8.4 * u); ctx.stroke();
    ctx.fillStyle = '#bfe8ff'; ctx.fillRect(1.15 * u, -9.4 * u, 0.7 * u, 1.0 * u); glow(ctx, 1.5 * u, -8.9 * u, 1.6 * u, '190,232,255', 0.5); }
  ctx.restore();
}
function magmaWorld(ctx, t, cx, cy, R, crust = 0) {
  glow(ctx, cx, cy, R * 1.5, '255,110,40', 0.55);
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
  g.addColorStop(0, '#ffe08a'); g.addColorStop(0.5, '#ff8a2a'); g.addColorStop(1, '#c7360e');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const r = rng(8);
  for (let i = 0; i < 26; i++) { const a = r() * 6.283 + t * 0.05, d = Math.sqrt(r()) * R, s2 = R * (0.08 + r() * 0.16);
    ctx.fillStyle = `rgba(60,24,20,${0.35 + crust * 0.5})`; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, s2, s2 * 0.6, a, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = 'rgba(30,10,30,0.45)'; ctx.beginPath(); ctx.arc(cx + R * 0.55, cy + R * 0.35, R * 1.05, 0, 6.283); ctx.fill();
  ctx.restore(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
}
function bigNum(ctx, t, text, y, at, o = {}) {   // cartoon number slam: drops in with a squash
  const { size = 140, color = C.yellow, out = 1e9 } = o;
  if (t < at || t > out + 0.3) return;
  const p = prog(t, at, at + 0.35), s2 = p < 1 ? easeBack(p) : 1, e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e; ctx.translate(W / 2, y); ctx.scale(s2 * (1 + 0.08 * Math.exp(-(t - at - 0.35) * 8)), s2);
  ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = color; ctx.fillText(text, 0, 0);
  ctx.restore();
}

// ---------------------------------------------------------------- 1. hook
function vHook(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 0, 3, 1.0, 1.08, W / 2, 1200);
  earth(ctx, W / 2 - 100, 1300, 320, t * 0.4);
  const k = easeInOut(prog(t, 0.1, 2.9));
  rogue(ctx, lerp(W + 120, W / 2 + 250, k), lerp(200, 820, k), lerp(30, 170, k), k);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 2.9) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(t, 2.5, 2.9));
    shadowed(ctx, () => blip(ctx, t, 890, 1700, t > 1.3 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, t, ['What if a planet', 'the size of Mars', 'hit Earth?'], 300, 0.15, { size: 88, out: 2.85, mark: { line: 1, from: 12, to: 16, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 2. observatory
function vScope(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#0b1230', '#1d2c5c', '#33467e']); ctx.fillRect(0, 0, W, H); stars(ctx, t, 1);
  drift(ctx, t, 3, 5.5, 1.0, 1.05, W / 2, 1300);
  const px = 300, py = 520; glow(ctx, px, py, 60, '255,150,90', 0.9); rogue(ctx, px, py, 12, 1);
  ctx.fillStyle = '#3b4568'; ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(540, 1350, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  // dome + slit + telescope tube
  const dx = 620, dy = 1380;
  ctx.fillStyle = '#d9dde8'; ctx.beginPath(); ctx.arc(dx, dy, 230, Math.PI, 0); ctx.fill(); ctx.fillRect(dx - 230, dy, 460, 180);
  ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(dx, dy, 230, Math.PI, 0); ctx.stroke(); ctx.strokeRect(dx - 230, dy, 460, 180);
  ctx.save(); ctx.translate(dx, dy - 40); ctx.rotate(-0.75); ctx.fillStyle = '#2b3150'; ctx.fillRect(-20, -330, 70, 330); ctx.strokeRect(-20, -330, 70, 330); ctx.restore();
  ctx.fillStyle = '#ffd88a'; ctx.fillRect(dx - 40, dy + 60, 80, 110); ctx.strokeRect(dx - 40, dy + 60, 80, 110);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Weeks out,', 'telescopes spot it.'], 300, 3.15, { size: 88, out: 5.3 });
  say(ctx, t, ['Nothing on Earth', 'can stop a planet.'], 1640, 4.0, { size: 64, weight: 900, out: 5.3, mark: { line: 1, from: 0, to: 17, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 3. the last night: everyone looks up
function vCrowd(ctx, t) {
  const p = prog(t, 5.5, 8);
  ctx.fillStyle = grad(ctx, ['#2a0f2a', '#8a2f2a', '#f08a4a']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 5.5, 8, 1.0, 1.06, W / 2, 800);
  const r = lerp(260, 520, p); glow(ctx, W / 2, 620, r * 1.8, '255,150,90', 0.7); rogue(ctx, W / 2, 620, r, 1);
  for (const [x, w, h] of [[-20, 300, 520], [300, 260, 420], [560, 280, 600], [840, 260, 460]]) {
    ctx.fillStyle = '#1a1022'; ctx.fillRect(x, 1900 - h, w, h);
    const g = rng(x + 7); for (let k = 0; k < 7; k++) person(ctx, x + 30 + g() * (w - 60), 1900 - h, 90 + g() * 30, '#0e0a16', g() > 0.3);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The last night:', 'it fills the sky.'], 300, 5.65, { size: 92, out: 7.8 });
}

// ---------------------------------------------------------------- 4. its gravity drags the sea upward
function vTide(ctx, t) {
  const p = easeInOut(prog(t, 8.1, 10.3));
  ctx.fillStyle = grad(ctx, ['#3a1a3a', '#c0503a', '#ffb070']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 8, 10.5, 1.0, 1.05, W / 2, 1200);
  rogue(ctx, W / 2 + 120, 260, 420, 1);
  // the sea heaped into a tall hump reaching toward the planet
  const base = 1450, peak = lerp(base - 60, 620, p);
  ctx.fillStyle = grad(ctx, ['#5fd0ff', '#1f7fd6', '#0d4a92'], 0, peak, 0, base + 200);
  ctx.beginPath(); ctx.moveTo(-40, base + 300); ctx.lineTo(-40, base);
  for (let x = -40; x <= W + 40; x += 20) { const d = (x - W / 2 - 60) / 420, y = base - (base - peak) * Math.exp(-d * d) + Math.sin(x * 0.03 + t * 4) * 10; ctx.lineTo(x, y); }
  ctx.lineTo(W + 40, base + 300); ctx.closePath(); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  // boats sliding up the slope, beach drained below
  [[200, 0.6], [820, 0.5]].forEach(([x, s2], i) => { const d = (x - W / 2 - 60) / 420, y = base - (base - peak) * Math.exp(-d * d) * (0.7 + 0.3 * p);
    ctx.save(); ctx.translate(x + (W / 2 - x) * p * 0.25, y - 20); ctx.rotate((i ? -1 : 1) * 0.5 * p); ship(ctx, 0, 0, s2, 0); ctx.restore(); });
  ctx.fillStyle = '#e6c98a'; ctx.fillRect(-40, base + 140, W + 80, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['In the final hour,', 'its gravity drags', 'the ocean upward'], 1560, 8.15, { size: 72, out: 10.3 });
}

// ---------------------------------------------------------------- 5. impact: a crown-splash of molten rock on the horizon
function vCrown(ctx, t) {
  const [sx, sy] = shakeOffset(t, 10.9, 2.2, 40); ctx.translate(sx, sy);
  const k = prog(t, 10.9, 13.4);
  ctx.fillStyle = grad(ctx, ['#1a0a1a', mixHex('#3a1020', '#ff7a2a', k), mixHex('#6a2a2a', '#ffd08a', k)]); ctx.fillRect(0, 0, W, H);
  if (t < 10.9) rogue(ctx, W / 2, lerp(-300, 1180, easeIn2(prog(t, 10.5, 10.9))), 700, 1);
  // curved horizon of the planet
  ctx.fillStyle = '#2f6fd0'; ctx.beginPath(); ctx.ellipse(W / 2, 2500, 1800, 1150, 0, 0, 6.283); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  if (t >= 10.9) {
    // crown of molten rock: spikes rising and arcing out, each tipped with a blob
    const r = rng(14);
    for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, len = (420 + r() * 600) * easeOut(k);
      const bx = W / 2 + Math.cos(a) * 140, by = 1360, tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len + 300 * k * k * r();
      ctx.strokeStyle = '#ff8a2a'; ctx.lineWidth = 46 * (1 - k * 0.5); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo((bx + tx) / 2, (by + ty) / 2 - 80, tx, ty); ctx.stroke();
      ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(tx, ty, 30 + r() * 26, 0, 6.283); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(W / 2, 1360, 360 + 300 * k, 140, 0, 0, 6.283); ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    glow(ctx, W / 2, 1300, 900, '255,220,150', 0.8 * (1 - k * 0.6));
  }
  flash(ctx, t, 10.9, 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, t, 'IMPACT', 420, 10.95, { size: 170, out: 12.2 });
  say(ctx, t, ['at 40,000 km/h'], 560, 11.3, { size: 72, weight: 900, out: 12.2 });
  bigNum(ctx, t, '100,000,000×', 420, 12.3, { size: 120, out: 13.3, color: '#ffb0a0' });
  say(ctx, t, ['the dinosaur asteroid'], 540, 12.5, { size: 64, weight: 900, out: 13.3 });
}

// ---------------------------------------------------------------- 6. shockwave lapping the globe
function vShock(ctx, t) {
  space(ctx, t);
  const [sx, sy] = shakeOffset(t, 13.5, 2.5, 16); ctx.translate(sx, sy);
  const cx = W / 2, cy = 1100, R = 420, k = prog(t, 13.6, 15.8);
  earth(ctx, cx, cy, R, 1.2 + t * 0.1);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const ix = cx + 150, iy = cy - 180;
  glow(ctx, ix, iy, 120 + 300 * k, '255,140,50', 0.9);
  for (let j = 0; j < 3; j++) { const kk = R2(k * 1.2 - j * 0.15); ctx.strokeStyle = `rgba(255,${220 - j * 40},150,${1 - kk})`; ctx.lineWidth = 16 - j * 4;
    ctx.beginPath(); ctx.ellipse(ix - kk * 150, iy + kk * 180, kk * R * 1.4, kk * R * 1.1, 0.4, 0, 6.283); ctx.stroke(); }
  const r = rng(5); ctx.strokeStyle = 'rgba(255,120,40,0.95)'; ctx.lineWidth = 6;
  for (let i = 0; i < 10; i++) { let x = ix, y = iy, a = r() * 6.283; ctx.beginPath(); ctx.moveTo(x, y);
    for (let s2 = 0; s2 < 8 * k; s2++) { a += (r() - 0.5) * 0.8; x += Math.cos(a) * 50; y += Math.sin(a) * 50; ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['A shockwave laps', 'the entire planet'], 300, 13.65, { size: 88, out: 15.8 });
  say(ctx, t, ['Every continent cracks'], 1700, 14.6, { size: 64, weight: 900, out: 15.8 });
}

// ---------------------------------------------------------------- 7. molten debris rains on a city
function vRain(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#1a0812', '#6a1a1a', '#d0582a']); ctx.fillRect(0, 0, W, H);
  const [sx, sy] = shakeOffset(t, 16.4, 2.6, 14); ctx.translate(sx, sy);
  drift(ctx, t, 16, 19, 1.0, 1.06, W / 2, 1500);
  for (let i = 0; i < 14; i++) fireball(ctx, t, 80 + i * 75 + 300, -200, 40 + i * 75, 1000 + (i % 4) * 140, 16.0 + (i % 7) * 0.32 + Math.floor(i / 7) * 0.2, 0.9, 0.8);
  const g = rng(3);
  for (let i = 0; i < 9; i++) { const x = -30 + i * 125, h = 300 + g() * 420, hit = 16.6 + (i % 5) * 0.45;
    block3d(ctx, t, x, 1560, 100, h, { col: '#3a2a4a', depth: 40, seed: 50 + i, crumble: easeInOut(R2((t - hit) / 1.3)) * (i % 2), lit: 'rgba(255,180,110,0.9)' });
    if (t > hit && i % 2) { glow(ctx, x + 50, 1560 - h * 0.6, 160, '255,140,50', 0.8 * Math.exp(-(t - hit))); } }
  ctx.fillStyle = '#20141c'; ctx.fillRect(-60, 1560, W + 120, H);
  // a flipped car
  const ck = R2((t - 17.6) / 0.7); ctx.save(); ctx.translate(lerp(820, 560, ck), 1560 - Math.sin(ck * Math.PI) * 220); ctx.rotate(ck * Math.PI);
  ctx.fillStyle = '#4fa3ff'; roundRect(ctx, -70, -50, 140, 50, 14); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-40, 0, 16, 0, 6.283); ctx.arc(40, 0, 16, 0, 6.283); ctx.fill(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Molten debris rains', 'back down. Everywhere.'], 300, 16.15, { size: 82, out: 18.8 });
}

// ---------------------------------------------------------------- 8. the oceans boil
function vBoil(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#5a2a2a', '#c86a3a', '#ffc090']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 19, 22, 1.0, 1.05, W / 2, 1300);
  const sea = 1150;
  ctx.fillStyle = grad(ctx, ['#3a8ad0', '#1d4f8a'], 0, sea, 0, H); ctx.fillRect(0, sea, W, H);
  const r = rng(6);
  for (let i = 0; i < 70; i++) { const life = (t * (0.6 + r() * 0.8) + r()) % 1, x = r() * W, y = sea + 40 + r() * 700 - life * 120, rr = (10 + r() * 34) * (0.4 + life);
    ctx.fillStyle = 'rgba(220,240,255,0.85)'; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(27,22,64,0.5)'; ctx.stroke(); }
  for (let i = 0; i < 9; i++) { const x = 60 + i * 120, h = 500 + Math.sin(t * 2 + i) * 80;      // steam columns
    for (let k = 0; k < 6; k++) { const yy = sea - k * h / 6 - (t * 120 % (h / 6)); ctx.fillStyle = `rgba(250,245,240,${0.5 - k * 0.07})`; ctx.beginPath(); ctx.arc(x + Math.sin(t + k + i) * 30, yy, 50 + k * 12, 0, 6.283); ctx.fill(); } }
  const sink = R2((t - 19.6) / 2.2); ctx.save(); ctx.translate(560, sea + 30 + sink * 260); ctx.rotate(0.35 * sink); ship(ctx, 0, 0, 1.0, 0); ctx.restore();
  ctx.fillStyle = grad(ctx, ['#3a8ad0', '#1d4f8a'], 0, sea, 0, H); ctx.globalAlpha = 0.55; ctx.fillRect(0, sea + 90, W, H); ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The oceans boil', 'like a pot of soup'], 300, 19.15, { size: 88, out: 21.8 });
  say(ctx, t, ['Less than 0.01% of', 'the impact’s energy'], 1640, 20.2, { size: 62, weight: 900, out: 21.8, mark: { line: 0, from: 10, to: 18, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 9. landmarks melt like wax
function drip(ctx, x, y, w, k, col) { const r = rng(Math.floor(x));
  for (let i = 0; i < 5; i++) { const dx = x + (r() - 0.5) * w, len = k * (40 + r() * 140); ctx.fillStyle = col; roundRect(ctx, dx - 8, y, 16, len, 8); ctx.fill(); } }
function vMelt(ctx, t) {
  const k = easeInOut(prog(t, 22.3, 25.2));
  ctx.fillStyle = grad(ctx, ['#4a1010', '#d0401a', '#ffb050']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 22, 25.5, 1.0, 1.05, W / 2, 1300);
  const ground = 1600;
  // lattice tower (Eiffel-style)
  ctx.save(); ctx.translate(250, ground); ctx.scale(1 + k * 0.25, 1 - k * 0.55); ctx.rotate(-0.15 * k);
  ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.moveTo(-140, 0); ctx.quadraticCurveTo(-30, -300, -12, -760); ctx.lineTo(12, -760); ctx.quadraticCurveTo(30, -300, 140, 0); ctx.lineTo(80, 0); ctx.quadraticCurveTo(0, -120, -80, 0); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  // pyramid
  ctx.save(); ctx.translate(560, ground); ctx.scale(1 + k * 0.4, 1 - k * 0.6);
  ctx.fillStyle = '#d9b26a'; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(0, -330); ctx.lineTo(200, 0); ctx.closePath(); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#b8914f'; ctx.beginPath(); ctx.moveTo(0, -330); ctx.lineTo(200, 0); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  // clock tower
  ctx.save(); ctx.translate(860, ground); ctx.rotate(0.2 * k); ctx.scale(1 + k * 0.2, 1 - k * 0.5);
  ctx.fillStyle = '#c9a77a'; ctx.fillRect(-55, -620, 110, 620); ctx.beginPath(); ctx.moveTo(-60, -620); ctx.lineTo(0, -760); ctx.lineTo(60, -620); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.strokeRect(-55, -620, 110, 620);
  ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(0, -520, 40, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.restore();
  drip(ctx, 250, ground - 760 * (1 - k * 0.55) + 200, 160, k, '#5a4a3a'); drip(ctx, 860, ground - 300, 110, k, '#c9a77a');
  ctx.fillStyle = '#ff7a24'; ctx.fillRect(-40, ground - 10 - k * 60, W + 80, H); glow(ctx, W / 2, ground, 700, '255,140,40', 0.5 * k);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Landmarks melt', 'like candle wax'], 300, 22.15, { size: 92, out: 25.3 });
  say(ctx, t, ['The air itself: vaporized rock,', 'thousands of degrees'], 1700, 23.3, { size: 54, weight: 900, out: 25.3 });
}

// ---------------------------------------------------------------- 10. bunkers fail
function vBunker(ctx, t) {
  const k = easeInOut(prog(t, 25.8, 28.3));
  ctx.fillStyle = grad(ctx, ['#ff9a4a', '#d0401a'], 0, 0, 0, 500); ctx.fillRect(0, 0, W, 500);
  ctx.fillStyle = grad(ctx, ['#6b4a34', '#3e2a1e', '#22140e'], 0, 500, 0, H); ctx.fillRect(0, 500, W, H);
  drift(ctx, t, 25.5, 28.5, 1.0, 1.05, W / 2, 1200);
  // molten layer creeping down from the surface and up from below
  ctx.fillStyle = '#ff6a1a'; ctx.fillRect(0, 500, W, 80 + k * 520); glow(ctx, W / 2, 500 + k * 520, 600, '255,120,40', 0.6);
  ctx.fillStyle = '#ff5a10'; ctx.fillRect(0, H - k * 520, W, k * 520);
  // the bunker
  const bx = W / 2, by = 1250;
  ctx.fillStyle = '#9aa3b8'; roundRect(ctx, bx - 260, by - 140, 520, 280, 40); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#ffe6a8'; roundRect(ctx, bx - 220, by - 100, 440, 200, 24); ctx.fill();
  for (let i = 0; i < 4; i++) person(ctx, bx - 150 + i * 100, by + 95, 150, '#2a2f4a');
  ctx.fillStyle = `rgba(255,90,20,${0.6 * R2((k - 0.6) / 0.4)})`; roundRect(ctx, bx - 220, by - 100, 440, 200, 24); ctx.fill();
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.lineWidth = 9; ctx.strokeStyle = INK;
  ctx.strokeText('−1 km', 40, by); ctx.fillText('−1 km', 40, by);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Deep bunkers?'], 300, 25.65, { size: 92, out: 28.3 });
  say(ctx, t, ['The crust melts hundreds', 'of kilometers down'], 1640, 26.4, { size: 62, weight: 900, out: 28.3, mark: { line: 0, from: 10, to: 24, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 11. the toll
function vToll(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#14080e', '#3a0e12']); ctx.fillRect(0, 0, W, H);
  const n = Math.round(8200000000 * easeOut(prog(t, 28.7, 30.6)));
  bigNum(ctx, t, n.toLocaleString('en-US'), 900, 28.7, { size: 120, color: '#ff6b5b' });
  say(ctx, t, ['Within a day (est.):'], 600, 28.65, { size: 72, x: W / 2, align: 'center', out: 30.9 });
  say(ctx, t, ['Everyone.'], 1180, 30.0, { size: 110, x: W / 2, align: 'center', out: 30.9 });
}

// ---------------------------------------------------------------- 12. magma world
function vMagma(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 31, 34, 1.0, 1.06, W / 2, 1150);
  magmaWorld(ctx, t, W / 2, 1150, 440, 0);
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = `rgba(255,170,90,${0.25 - k * 0.06})`; ctx.lineWidth = 30 - k * 8; ctx.beginPath(); ctx.arc(W / 2, 1150, 480 + k * 30 + Math.sin(t * 2 + k) * 6, 0, 6.283); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Earth becomes', 'a ball of magma'], 300, 31.15, { size: 92, out: 33.8 });
}

// ---------------------------------------------------------------- 13. ring -> new moon
function vMoon(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 34, 37.5, 1.0, 1.05, W / 2, 1150);
  const cx = W / 2, cy = 1150, R = 300, form = prog(t, 34.1, 35.4), clump = easeInOut(prog(t, 35.4, 37.0));
  const r = rng(9), target = 0.6 + t * 0.5;
  const debris = back => { for (let i = 0; i < 1400; i++) { const a0 = r() * 6.283, a = a0 + t * 0.5 * (0.8 + r() * 0.4), rr = 420 + r() * 260;
    if ((Math.sin(a) < 0) !== back) continue;
    const ang = lerp(a, target + (a0 - Math.PI) * 0.05, clump), rad = lerp(rr, 560, clump);
    ctx.fillStyle = `rgba(255,${150 + r() * 80},${80 + r() * 60},${(0.5 + r() * 0.5) * form})`; ctx.fillRect(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 0.28, 3 + r() * 3, 3 + r() * 3); } };
  debris(true); magmaWorld(ctx, t, cx, cy, R, 0.5); debris(false);
  if (clump > 0.6) { const mx = cx + Math.cos(target) * 560, my = cy + Math.sin(target) * 560 * 0.28; ctx.save(); ctx.globalAlpha = (clump - 0.6) / 0.4; moonToon(ctx, mx, my, 50, { sun: SUN, crack: 1.2 }); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The debris spins into a ring…'], 300, 34.15, { size: 76, out: 35.5 });
  say(ctx, t, ['…then clumps into', 'a new moon'], 300, 35.6, { size: 88, out: 37.3, mark: { line: 1, from: 0, to: 10, color: '#3a86ff' } });
}

// ---------------------------------------------------------------- 14. millions of years: rain, oceans return
function vCool(ctx, t) {
  space(ctx, t);
  const k = easeInOut(prog(t, 37.7, 40.3)), cx = W / 2, cy = 1150, R = 420;
  ctx.save(); ctx.globalAlpha = 1 - k; magmaWorld(ctx, t, cx, cy, R, 0.8); ctx.restore();
  ctx.save(); ctx.globalAlpha = k; earth(ctx, cx, cy, R, t * 0.2); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 6.283); ctx.clip();          // rain streaks
  ctx.strokeStyle = `rgba(200,225,255,${0.7 * Math.sin(Math.PI * k)})`; ctx.lineWidth = 3;
  const r = rng(4); for (let i = 0; i < 120; i++) { const x = cx + (r() - 0.5) * R * 2.4, y = (cy - R * 1.2 + ((t * 900 + r() * 1000) % (R * 2.4))); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 40); ctx.stroke(); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Over millions of years,', 'it cools… and rains…'], 300, 37.65, { size: 76, out: 39.1 });
  say(ctx, t, ['…and the oceans', 'come back.'], 300, 39.2, { size: 88, out: 40.3 });
}

// ---------------------------------------------------------------- 15. the twist
function vTwist(ctx, t) {
  space(ctx, t);
  const p = prog(t, 40.6, 44.8);
  if (t < 42.9) {
    magmaWorld(ctx, t, W / 2 - 80, 1200, 300, 0.4);
    const k = easeInOut(prog(t, 40.6, 42.9)); rogue(ctx, lerp(W + 100, W / 2 + 180, k), lerp(600, 1040, k), 150, 1);
    ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = INK;
    ctx.strokeText('Theia', W / 2 + 280, 820); ctx.fillStyle = '#ffb0a0'; ctx.fillText('Theia', W / 2 + 280, 820);
  } else {
    earth(ctx, W / 2 - 60, 1250, 330, t * 0.3);
    moonToon(ctx, W / 2 + 300, 760, 110, { sun: SUN });
  }
  flash(ctx, t, 42.9, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Plot twist:', 'this already happened.'], 300, 40.65, { size: 84, out: 42.8, mark: { line: 1, from: 5, to: 20, color: '#ff6b5b' } });
  say(ctx, t, ['4.5 billion years ago, Theia', 'hit the young Earth'], 1640, 41.3, { size: 56, weight: 900, out: 42.8 });
  say(ctx, t, ['The wreckage became', 'our Moon.'], 300, 43.0, { size: 96, out: 44.8, mark: { line: 1, from: 0, to: 8, color: '#3a86ff' } });
}

function vEnd(ctx, t) {
  space(ctx, t);
  earth(ctx, W / 2, 1400, 260, t * 0.3); moonToon(ctx, W / 2 + 300, 1080, 70, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['WHAT IF,'], 720, 45.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, t, ['THOUGH?'], 880, 45.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, t, ['Follow for more'], 1000, 45.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
