// What if the Moon were 10 times closer?   (v3: story arc toward an endpoint)
//
// ARC: beauty -> the first tide (death toll) -> it keeps coming -> crust & volcanic winter (famine)
//      -> TURN: the Moon is falling -> it gets worse every year -> ENDPOINT: torn apart -> rings, no Moon.
//
// PHYSICS / NUMBERS (checked):
//  - 38,440 km (10x closer). Tidal force ∝ 1/d³ -> 1,000x; today's lunar equilibrium tide is a few
//    tenths of a metre -> tides of hundreds of metres. At the fluid Roche limit (~18,000 km) the factor
//    is (384,400/18,000)³ ≈ 9,700x -> kilometre-scale tides. Hedged: "hundreds of meters", "kilometers".
//  - Death toll: ~1.9 billion people live within 100 km of the coast AND below 100 m elevation
//    (Kummu et al. 2016, Environ. Res. Lett.). Tides of hundreds of metres reach all of them within a
//    day or so; we say "nearly 2 billion people live in the tide's path" and "most could not escape".
//  - Orbit period ≈21 h < 24 h day -> inside synchronous orbit (42,164 km): tidal torque drags it INWARD
//    (as with Phobos). Scaling today's recession (3.8 cm/yr ∝ a^-5.5) gives ~12 km/yr at 38,440 km,
//    accelerating; integrating to ~18,000 km gives roughly 500 years. Stated as "within centuries".
//  - Solid-Earth tides scale too: constant quakes and eruptions (Io comparison); widespread ash ->
//    volcanic-winter crop failures (as after Tambora 1815, the "Year Without a Summer"). Hedged "could".
//  - Break-up at the Roche limit forms a ring; some debris falls to Earth. Earth ends with rings, no Moon.
// PLOT HOLES: how it got there is the premise. Evacuation: a tide arriving within a day can't be
// outrun by billions of people at once ("most could not escape" rather than "all die").
const SHORT = {
  title: 'What if the Moon were 10 times closer?',
  duration: 52,
  fps: 60,
  motionSamples: 1,
  sfx: [
    [0.2, 'sparkle'], [2.2, 'sparkle'],
    [5.0, 'whoosh'], [5.6, 'braam'], [6.4, 'rumble:3.6'],
    [10.0, 'whoosh'], [10.3, 'bigwave'], [11.0, 'rumble:7'], [12.2, 'crash'], [13.4, 'crash'], [14.6, 'bigwave'], [15.4, 'crash'],
    [17.5, 'whoosh'], [18.0, 'bigwave'], [19.6, 'bigwave'],
    [21.0, 'whoosh'], [21.3, 'rumble:6'], [22.0, 'boom'], [22.6, 'crash'], [23.8, 'boom'], [25.4, 'dim'],
    [28.0, 'whoosh'], [28.3, 'record'], [29.2, 'braam'], [30.5, 'tick:4'], [33.6, 'riser'],
    [36.0, 'whoosh'], [36.6, 'rumble:4'], [39.6, 'boom'], [39.7, 'braam'], [41.2, 'dive'], [41.8, 'boom'], [42.6, 'boom'], [43.4, 'boom'],
    [46.0, 'whoosh'], [47.0, 'sparkle'], [49.2, 'ding'],
  ],
  music: { bpm: 92, mode: 'dark', until: 51.6, duckAt: [[28.2, 29.2], [39.4, 40.4]] },
};

const SUN = [-0.6, -0.35, 0.72];

function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, [[0, sBeauty], [5, sTurn], [10, sFlood], [17.5, sAgain], [21, sAsh], [28, sFalling], [36, sBreak], [46, sRings]]);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850);
  post(ctx);
}

// a moonlit bay city, reused by the opening scenes
function bayCity(ctx, t, o = {}) {
  const { moonR = 360, moonY = 700, sky = ['#16264f', '#3c5a99', '#7d97cf'] } = o;
  ctx.fillStyle = grad(ctx, sky); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.25);
  glow(ctx, W / 2, moonY, moonR * 2.0, '205,220,255', 0.32);
  moonFx(ctx, W / 2, moonY, moonR, { sun: [0.05, -0.08, 0.99] });
  dof(ctx, 4, c => { for (let i = 0; i < 10; i++) tower(c, t, -30 + i * 115, 1330, 95, 260 + (i * 61 % 190), { col: '#3a4d7c', win: 'rgba(255,226,170,0.75)', seed: 70 + i }); });
  [[60, 150, 520], [240, 170, 700], [440, 140, 460], [600, 190, 820], [820, 160, 600]].forEach(([x, w, h], i) =>
    tower(ctx, t, x, 1420, w, h, { col: ['#2e3d66', '#34406e', '#2b3a60', '#3a4672', '#2f3c68'][i], win: 'rgba(255,226,170,0.9)', seed: 80 + i }));
}
function bay(ctx, t, level = 1420) {
  const g = ctx.createLinearGradient(0, level, 0, H); g.addColorStop(0, '#2c4a86'); g.addColorStop(1, '#0f1d3d');
  ctx.fillStyle = g; ctx.fillRect(-60, level, W + 120, H);
  // moonlight on the water: a soft glow column with fine glints
  const col = ctx.createLinearGradient(W / 2 - 180, 0, W / 2 + 180, 0);
  col.addColorStop(0, 'rgba(210,225,255,0)'); col.addColorStop(0.5, 'rgba(210,225,255,0.35)'); col.addColorStop(1, 'rgba(210,225,255,0)');
  ctx.fillStyle = col; ctx.fillRect(W / 2 - 180, level, 360, H - level);
  const r = rng(5);
  for (let i = 0; i < 90; i++) { const y = level + 10 + r() * (H - level), spread = 40 + (y - level) * 0.35, x = W / 2 + (r() - 0.5) * spread * 2;
    const w = 6 + r() * 26, a = 0.25 + 0.6 * Math.abs(Math.sin(t * (1 + r() * 2) + i));
    ctx.fillStyle = `rgba(235,242,255,${a})`; ctx.beginPath(); ctx.ellipse(x, y, w, 1.6, 0, 0, 6.283); ctx.fill(); }
}

// 0–5: the most beautiful thing you'd ever see
function sBeauty(ctx, t) {
  drift(ctx, t, 0, 5, 1.0, 1.05, W / 2, 900);
  bayCity(ctx, t);
  bay(ctx, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['What if the Moon', 'were 10× closer?'], 300, 0.3, { size: 92, out: 4.7 });
  say(ctx, t, ["It'd be the most beautiful", "thing you've ever seen…"], 1640, 2.0, { size: 64, weight: 800, out: 4.7 });
}

// 5–10: ...for about a day. The ocean starts to rise.
function sTurn(ctx, t) {
  drift(ctx, t, 5, 10, 1.05, 1.0, W / 2, 900);
  bayCity(ctx, t);
  const rise = easeInOut(prog(t, 6.2, 9.8));
  bay(ctx, t, 1420 - rise * 260);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['…for about a day.'], 300, 5.3, { size: 92, out: 9.6 });
  say(ctx, t, ['Then the ocean starts to rise.'], 1640, 6.6, { size: 64, weight: 800, out: 9.6, mark: { line: 0, from: 9, to: 29, color: '#3a86ff' } });
}

// 10–17.5: the first tide, hundreds of metres high, through the city. Death toll.
function sFlood(ctx, t) {
  const [sx, sy] = shakeOffset(t, 11.0, 7.0, 12);
  ctx.translate(sx, sy);
  drift(ctx, t, 10, 17.5, 1.0, 1.06, W / 2, 1300);
  ctx.fillStyle = grad(ctx, ['#1b2c58', '#40609e', '#8ba3d6']); ctx.fillRect(0, 0, W, H);
  glow(ctx, 820, 420, 520, '205,220,255', 0.3); moonFx(ctx, 820, 420, 260, { sun: [0.05, -0.08, 0.99] });
  const ground = 1560;
  dof(ctx, 5, c => { for (let i = 0; i < 9; i++) tower(c, t, -40 + i * 130, 1300, 110, 380 + (i * 53 % 200), { col: '#4a5d8c', win: 'rgba(255,226,170,0.7)', seed: 40 + i }); });
  const front = lerp(-420, 1180, easeInOut(prog(t, 10.4, 17.3)));
  [[80, 170, 720, 1], [300, 190, 900, 1], [540, 160, 640, -1], [760, 200, 980, 1]].forEach(([x, w, h, dir], i) => {
    const hit = prog(front, x - 100, x + 500);
    tower(ctx, t, x, ground, w, h, { col: ['#34416e', '#3d3a66', '#2f4a66', '#433d5e'][i], win: 'rgba(255,226,170,0.9)', fall: i % 2 ? 0 : hit, crumble: i % 2 ? hit : hit * 0.3, dir, seed: i + 1 });
    if (hit > 0.02) dustBurst(ctx, t, x + w / 2, ground - 40, 10.4 + 6.9 * ((x + 400) / 1600), { size: 1.2, seed: i + 7, col: [110, 118, 140] });
  });
  ctx.fillStyle = '#1e2640'; ctx.fillRect(-60, ground, W + 120, H);
  waterWall(ctx, t, front, ground + 20, 640, { seed: 4 });
  if (front > 100) ship(ctx, front - 160, ground - 630 + Math.sin(t * 2) * 18, 0.9, -0.15 + Math.sin(t * 1.5) * 0.06);
  debrisBurst(ctx, t, Math.max(140, front), ground - 300, 12.2, { n: 40, speed: 900, dir: -0.9, spread: 1.3, col: '#1f2638', seed: 12 });
  debrisBurst(ctx, t, Math.max(140, front), ground - 300, 14.6, { n: 40, speed: 950, dir: -0.9, spread: 1.3, col: '#2a2f44', seed: 13 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Tides hundreds of', 'meters high'], 300, 10.3, { size: 92, out: 13.4 });
  say(ctx, t, ['Nearly 2 billion people', "live in the tide's path"], 300, 13.6, { size: 80, out: 17.2 });
  tally(ctx, t, 1900000000, W / 2, 1690, 13.9, { size: 104, out: 17.2, label: 'Most could not escape', color: '#ffb0a0' });
}

// 17.5–21: and it comes back, every few days.
function sAgain(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 17.5, 21, 1.0, 1.04, W / 2, 1050);
  const cx = W / 2, cy = 1050, r = 360;
  const ang = (t - 17.5) * 0.9;                                      // bulge sweeping around
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(1.18, 0.88);
  const g = ctx.createRadialGradient(0, 0, r * 0.92, 0, 0, r * 1.1);
  g.addColorStop(0, 'rgba(80,170,255,0.7)'); g.addColorStop(1, 'rgba(80,170,255,0.05)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, 6.283); ctx.fill(); ctx.restore();
  globe(ctx, cx, cy, r, { lon0: 100 + (t - 17.5) * 14, lat0: 12, t, sun: SUN });
  moonFx(ctx, cx + Math.cos(ang) * 600, cy + Math.sin(ang) * 210, 70, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['And it comes back.', 'Again. And again.'], 300, 17.8, { size: 88, out: 20.7 });
  say(ctx, t, ['Every few days, for every coast on Earth'], 1640, 18.8, { size: 52, weight: 800, out: 20.7 });
}

// 21–28: the crust heaves; ash blots out the sun; famine.
function sAsh(ctx, t) {
  const [sx, sy] = shakeOffset(t, 21.3, 5.5, 20);
  ctx.translate(sx, sy);
  drift(ctx, t, 21, 28, 1.0, 1.05, W / 2, 1300);
  const dim = easeInOut(prog(t, 24.6, 27.0));
  ctx.fillStyle = grad(ctx, [mixHex('#3a2232', '#2a2a2e', dim), mixHex('#a2442c', '#55504e', dim), mixHex('#f08a42', '#77706a', dim)]); ctx.fillRect(0, 0, W, H);
  const erupt = prog(t, 21.6, 22.8);
  for (const [vx, vy, sc, sd] of [[260, 1180, 0.7, 2], [820, 1120, 0.8, 3]]) plume(ctx, t, vx, vy, { height: 1200, width: 260 * sc, grow: 0.25 + erupt * 0.75, seed: sd, col: [62, 56, 60], light: [160, 146, 138] });
  plume(ctx, t, 560, 1060, { height: 1400, width: 340, grow: 0.3 + erupt * 0.7, seed: 6, col: [58, 52, 56], light: [168, 150, 140] });
  ctx.fillStyle = '#231417';
  for (const [x0, x1, top] of [[60, 460, 1180], [300, 820, 1060], [620, 1040, 1120]]) { ctx.beginPath(); ctx.moveTo(x0, 1420); ctx.lineTo((x0 + x1) / 2 - 50, top); ctx.lineTo((x0 + x1) / 2 + 50, top); ctx.lineTo(x1, 1420); ctx.fill(); }
  if (erupt > 0) for (const [x, y] of [[260, 1180], [560, 1060], [830, 1120]]) { glow(ctx, x, y, 200, '255,120,40', 0.85 * erupt); embers(ctx, t, x, y, { n: 50, w: 220, h: 600, seed: x }); }
  debrisBurst(ctx, t, 560, 1060, 22.0, { col: '#ff7a2a', n: 40, speed: 1100, seed: 21 });
  ctx.fillStyle = grad(ctx, ['#2b2023', '#151012'], 0, 1420, 0, H); ctx.fillRect(-60, 1420, W + 120, H);
  // ash falling as the sky dims
  ctx.fillStyle = `rgba(200,195,190,${0.5 * dim})`; const r = rng(91);
  for (let i = 0; i < 160; i++) ctx.fillRect((r() * W + t * 30) % W, (r() * H + t * (60 + r() * 60)) % H, 3, 3);
  // dying crop field in the foreground
  for (let i = 0; i < 18; i++) { const x = 30 + i * 60, col = mixHex('#7fbf4a', '#8a7a52', dim);
    ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, 1860); ctx.quadraticCurveTo(x, 1760, x + dim * 60, 1700 + dim * 60); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The crust heaves too.', 'Volcanoes erupt', 'everywhere.'], 300, 21.3, { size: 76, out: 24.6 });
  say(ctx, t, ['Ash blots out the Sun.', 'Harvests fail.'], 300, 24.8, { size: 84, out: 27.7 });
  say(ctx, t, ['Billions more could starve'], 1600, 25.8, { size: 66, weight: 900, out: 27.7, mark: { line: 0, from: 0, to: 13, color: '#ff6b5b' } });
}

// 28–36: the turn: the Moon is falling, and it gets worse every year.
function sFalling(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 28, 36, 1.0, 1.05, W / 2, 1100);
  const cx = W / 2, cy = 1120;
  globe(ctx, cx, cy, 150, { lon0: 40 + t * 3, lat0: 12, t, sun: SUN });
  // synchronous-orbit circle (where a moon could keep pace with the spin)
  ctx.strokeStyle = 'rgba(120,200,255,0.55)'; ctx.lineWidth = 4; ctx.setLineDash([14, 14]);
  ctx.beginPath(); ctx.arc(cx, cy, 440, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `800 30px ${FONT}`; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(150,210,255,0.95)'; ctx.fillText('SAFE ORBIT', cx, cy - 462);
  ctx.fillStyle = 'rgba(255,140,120,0.95)'; ctx.fillText('BREAKING POINT', cx, cy + 236);
  // breaking-point circle
  ctx.strokeStyle = 'rgba(255,110,90,0.6)'; ctx.setLineDash([6, 12]); ctx.beginPath(); ctx.arc(cx, cy, 190, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  // the Moon spiralling inward
  const p = easeIn3(prog(t, 29.4, 35.8));
  const a = -0.6 + p * 9.5, rr = lerp(400, 215, p);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 120; i++) { const q = i / 120 * p, aa = -0.6 + q * 9.5, r2 = lerp(400, 215, q); const x = cx + Math.cos(aa) * r2, y = cy + Math.sin(aa) * r2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  moonFx(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 46 + p * 14, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['But here’s the thing:'], 300, 28.3, { size: 70, out: 29.6 });
  say(ctx, t, ['the Moon is falling.'], 300, 29.4, { size: 96, out: 35.8, mark: { line: 0, from: 4, to: 20, color: '#ff6b5b' } });
  say(ctx, t, ['It orbits faster than Earth spins,', 'so tides drag it inward'], 1560, 30.0, { size: 50, weight: 800, out: 32.6 });
  tally(ctx, t, 10000, W / 2, 1700, 32.8, { size: 120, dur: 2.8, suffix: '×', out: 35.8, label: 'stronger tides by the end: kilometers high', labelSize: 38, color: '#ffb0a0' });
}

// 36–46: the endpoint: torn apart, debris rains down.
function sBreak(ctx, t) {
  space(ctx, t);
  const [sx, sy] = shakeOffset(t, 39.6, 1.4, 22);
  ctx.translate(sx, sy);
  drift(ctx, t, 36, 46, 1.0, 1.07, W / 2, 1150);
  const cx = W / 2, cy = 1180, shatter = 39.6;
  const p = easeIn3(prog(t, 36.2, shatter));
  const ang = -0.4 + p * 3.2, rad = lerp(520, 400, p);
  const ringP = prog(t, shatter, 45.5);
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, true);
  globe(ctx, cx, cy, 300, { lon0: 70 + t * 3, lat0: 15, t, sun: SUN });
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, false);
  const mx = cx + Math.cos(ang) * rad, my = cy + Math.sin(ang) * rad * 0.35;
  if (t < shatter) {
    const st = 1 + p * 0.5;
    ctx.save(); ctx.translate(mx, my); ctx.rotate(Math.atan2(cy - my, cx - mx)); ctx.scale(st, 1 / st);
    moonFx(ctx, 0, 0, 95, { sun: SUN, crack: p * 3.2 }); ctx.restore();
  } else {
    debrisBurst(ctx, t, mx, my, shatter, { n: 80, speed: 420, g: 0, spread: 6.28, col: '#bdb8ae', size: 20, dur: 4.5, seed: 31 });
    shockwave(ctx, t, mx, my, shatter, { maxR: 560, dur: 1.3, col: '255,220,180', flat: 1 });
  }
  flash(ctx, t, shatter, 0.4);
  for (let i = 0; i < 10; i++) { const at = 41.2 + i * 0.28, x0 = 180 + (i * 97) % 700; fireball(ctx, t, x0 + 280, cy - 640, x0 + 40, cy - 220 + (i % 3) * 50, at, 1.0, 0.8); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Within centuries, it crosses', 'the breaking point'], 300, 36.4, { size: 76, out: 39.4 });
  say(ctx, t, ['Earth’s gravity', 'tears it apart.'], 300, 40.2, { size: 96, out: 45.6, mark: { line: 1, from: 0, to: 14, color: '#ff6b5b' } });
  say(ctx, t, ['Moon-sized wreckage rains down', 'on what’s left of us'], 1620, 41.6, { size: 54, weight: 800, out: 45.6 });
}

// 46–52: the final image: rings, no Moon.
function sRings(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 46, 52, 1.0, 1.05, W / 2, 1250);
  drawRing(ctx, W / 2, 1250, 1, t, true);
  globe(ctx, W / 2, 1250, 300, { lon0: 90 + t * 3, lat0: 15, t, sun: SUN });
  drawRing(ctx, W / 2, 1250, 1, t, false);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Earth would end up', 'with rings…'], 300, 46.3, { size: 92 });
  say(ctx, t, ['…and no Moon at all.'], 530, 47.6, { size: 92, mark: { line: 0, from: 7, to: 19, color: '#3a86ff' } });
  say(ctx, t, ['WHAT IF, THOUGH?  ·  Follow for more'], 1700, 49.2, { size: 44, weight: 800, x: W / 2, align: 'center' });
}

function drawRing(ctx, cx, cy, p, t, back) {
  const r = rng(77), spread = Math.min(1, p * 1.3);
  for (let i = 0; i < 1800; i++) {
    const a = r() * 6.283 + t * 0.12 * (0.8 + r() * 0.4), rr = 340 + r() * 300 * Math.min(1, p * 1.4);
    if ((Math.sin(a) < 0) !== back) continue;
    const x = cx + Math.cos(a) * rr * spread + (1 - spread) * 220, y = lerp(cy - 340, cy + Math.sin(a) * rr * 0.26, spread);
    const v = 185 + r() * 65;
    ctx.fillStyle = `rgba(${v},${v - 8},${v - 20},${0.5 + r() * 0.5})`;
    ctx.fillRect(x, y, 2 + r() * 3, 2 + r() * 3);
  }
}

function easeIn3(p) { return p * p * p; }
function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
