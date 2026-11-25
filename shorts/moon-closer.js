// What if the Moon were 10 times closer?   (v4: lived experience first, then the planetary arc)
//
// ARC: your sky -> your hand -> your night -> the ground under you -> the first tide (death toll)
//      -> it keeps coming -> volcanic winter (famine) -> TURN: the Moon is falling -> it's torn apart
//      -> final image: rings, no Moon.
//
// NUMBERS (checked):
//  - 10x closer = 38,440 km. Angular size ≈ 6.2° vs 0.52° today. At arm's length a pinky is ~1° wide
//    (today's Moon hides behind the pinky nail) and three fingers ≈ 5-6°.
//  - ~100x the disc area -> full-moon light ~100x brighter (~0.25 lux -> ~25 lux): enough to read by.
//  - Solid-Earth tide today: the ground rises and falls ~20-40 cm, about twice a day (Earth tide
//    literature). Tidal force ∝ 1/d³ -> 1,000x -> hundreds of metres (elastic scaling; real rock would
//    fracture first). Hedged: "hundreds of meters", "rock can't bend that far".
//  - Ocean tides of hundreds of metres. ~1.9 billion people live within 100 km of the coast and below
//    100 m elevation (Kummu et al. 2016) -> "nearly 2 billion people live in its path; most could not escape".
//  - Orbit ≈21 h < 24 h day -> inside synchronous orbit -> tidal drag spirals it inward (as for Phobos).
//    Scaling today's 3.8 cm/yr recession (∝ a^-5.5) -> ~12 km/yr, accelerating -> roughly centuries.
//  - At the fluid Roche limit (~18,000 km) tides ≈ (384,400/18,000)³ ≈ 9,700x today: kilometre-scale.
//  - Volcanic winter precedent: Tambora 1815 -> 1816 "Year Without a Summer". Famine hedged as "could".
// PLOT HOLES: the premise is the placement; "most could not escape" (not "all"); timescales hedged.
const SHORT = {
  title: 'What if the Moon were 10 times closer?',
  duration: 56,
  fps: 60,
  motionSamples: 1,
  sfx: [
    [0.0, 'rumble:3'], [0.6, 'riser'], [1.6, 'braam'], [2.6, 'sparkle'],
    [5.0, 'whoosh'], [6.4, 'pop'], [8.0, 'braam'], [8.2, 'sparkle'],
    [10.5, 'whoosh'], [11.4, 'sparkle'], [12.8, 'sparkle'],
    [15.0, 'whoosh'], [15.6, 'tick:2.6'], [18.6, 'boom'], [18.7, 'rumble:2.4'], [19.4, 'crash'],
    [21.0, 'whoosh'], [21.2, 'braam'], [21.4, 'bigwave'], [22.0, 'rumble:6.5'], [22.4, 'crash'], [23.6, 'crash'], [24.6, 'bigwave'], [25.4, 'crash'],
    [28.5, 'whoosh'], [28.9, 'bigwave'], [30.4, 'bigwave'],
    [32.0, 'whoosh'], [32.3, 'rumble:6'], [33.0, 'boom'], [33.6, 'crash'], [34.8, 'boom'], [36.4, 'dim'],
    [39.0, 'whoosh'], [39.3, 'record'], [40.2, 'braam'], [41.6, 'tick:4'], [44.6, 'riser'],
    [46.0, 'whoosh'], [46.2, 'rumble:3'], [46.6, 'boom'], [46.7, 'braam'], [48.4, 'dive'], [49.0, 'boom'], [49.8, 'boom'], [50.6, 'boom'],
    [53.0, 'whoosh'], [53.6, 'sparkle'], [55.0, 'ding'],
  ],
  music: { bpm: 92, mode: 'dark', until: 55.6, duckAt: [[39.2, 40.2], [46.4, 47.4]] },
};

const SUN = [-0.6, -0.35, 0.72];
const HITS = [1.6, 8.0, 18.6, 21.2, 22.4, 24.6, 33.0, 46.6];

function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, [[0, sHook], [5, sHand], [10.5, sNight], [15, sGround], [21, sFlood], [28.5, sAgain], [32, sAsh], [39, sFalling], [46, sBreak], [53, sRings]]);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850);
  post(ctx, { chromaPx: 7 * hitAmount(t, HITS, 14) });
}

// ---------------------------------------------------------------- shared set pieces
function bayCity(ctx, t, o = {}) {
  const { moonR = 360, moonY = 700, sky = ['#16264f', '#3c5a99', '#7d97cf'], flare = 0.6 } = o;
  ctx.fillStyle = grad(ctx, sky); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.25);
  godRays(ctx, t, W / 2, moonY, { alpha: 0.06, len: 1600 });
  glow(ctx, W / 2, moonY, moonR * 2.0, '205,220,255', 0.32);
  moonFx(ctx, W / 2, moonY, moonR, { sun: [0.05, -0.08, 0.99] });
  dof(ctx, 4, c => { for (let i = 0; i < 10; i++) tower(c, t, -30 + i * 115, 1330, 95, 260 + (i * 61 % 190), { col: '#3a4d7c', win: 'rgba(255,226,170,0.75)', seed: 70 + i }); });
  [[60, 150, 520], [240, 170, 700], [440, 140, 460], [600, 190, 820], [820, 160, 600]].forEach(([x, w, h], i) =>
    tower(ctx, t, x, 1420, w, h, { col: ['#2e3d66', '#34406e', '#2b3a60', '#3a4672', '#2f3c68'][i], win: 'rgba(255,226,170,0.9)', seed: 80 + i }));
  lensFlare(ctx, W / 2 + moonR * 0.55, moonY - moonR * 0.55, flare);
}
function bay(ctx, t, level = 1420) {
  const g = ctx.createLinearGradient(0, level, 0, H); g.addColorStop(0, '#2c4a86'); g.addColorStop(1, '#0f1d3d');
  ctx.fillStyle = g; ctx.fillRect(-60, level, W + 120, H);
  const col = ctx.createLinearGradient(W / 2 - 180, 0, W / 2 + 180, 0);
  col.addColorStop(0, 'rgba(210,225,255,0)'); col.addColorStop(0.5, 'rgba(210,225,255,0.35)'); col.addColorStop(1, 'rgba(210,225,255,0)');
  ctx.fillStyle = col; ctx.fillRect(W / 2 - 180, level, 360, H - level);
  const r = rng(5);
  for (let i = 0; i < 90; i++) { const y = level + 10 + r() * (H - level), spread = 40 + (y - level) * 0.35, x = W / 2 + (r() - 0.5) * spread * 2;
    const w = 6 + r() * 26, a = 0.25 + 0.6 * Math.abs(Math.sin(t * (1 + r() * 2) + i));
    ctx.fillStyle = `rgba(235,242,255,${a})`; ctx.beginPath(); ctx.ellipse(x, y, w, 1.6, 0, 0, 6.283); ctx.fill(); }
}

// ---------------------------------------------------------------- 1. your sky
function sHook(ctx, t) {
  punch(ctx, t, [1.6], 0.06);
  const rise = easeOut(prog(t, 0, 2.4));
  drift(ctx, t, 0, 5, 1.0, 1.05, W / 2, 900);
  bayCity(ctx, t, { moonY: lerp(1450, 720, rise), flare: rise });
  bay(ctx, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['What if the Moon', 'were 10× closer?'], 300, 0.3, { size: 96, out: 4.7 });
  say(ctx, t, ["Here's what your life", 'would look like.'], 1640, 2.4, { size: 64, weight: 800, out: 4.7, mark: { line: 0, from: 7, to: 16, color: '#3a86ff' } });
}

// ---------------------------------------------------------------- 2. your hand
function sHand(ctx, t) {
  punch(ctx, t, [8.0], 0.07, W / 2, 900);
  ctx.fillStyle = grad(ctx, ['#0d1838', '#22386e', '#4b67a6']); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.6);
  const big = easeOut(prog(t, 7.8, 8.6));
  const mx = W / 2 + 44, my = 1215;
  if (big < 1) { glow(ctx, W / 2 - 128, 1192, 60, '205,220,255', 0.5); moonFx(ctx, W / 2 - 128, 1192, 15, { sun: [0.05, -0.08, 0.99] }); }   // today's Moon, peeking behind the pinky tip
  if (big > 0) { ctx.save(); ctx.globalAlpha = big; godRays(ctx, t, mx, my, { alpha: 0.07 }); glow(ctx, mx, my, 520, '205,220,255', 0.35);
    moonFx(ctx, mx, my, lerp(15, 150, big), { sun: [0.05, -0.08, 0.99] }); ctx.restore(); lensFlare(ctx, mx + 100, my - 130, big * 0.8); }
  hand(ctx, W / 2, 1560, 1.12);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Hold out your hand.'], 300, 5.3, { size: 92, out: 10.2 });
  say(ctx, t, ['Today, your pinky nail', 'hides the Moon.'], 1640, 6.4, { size: 60, weight: 800, out: 7.9 });
  say(ctx, t, ['Now it would cover', 'three fingers.'], 1640, 8.2, { size: 72, weight: 900, out: 10.2, mark: { line: 1, from: 0, to: 13, color: '#3a86ff' } });
}

// ---------------------------------------------------------------- 3. your night
function sNight(ctx, t) {
  drift(ctx, t, 10.5, 15, 1.0, 1.06, W / 2, 1300);
  ctx.fillStyle = grad(ctx, ['#1f3a7a', '#5b80c8', '#a9c0ea']); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.15);
  godRays(ctx, t, 780, 520, { alpha: 0.08 });
  glow(ctx, 780, 520, 600, '215,228,255', 0.45);
  moonFx(ctx, 780, 520, 300, { sun: [0.05, -0.08, 0.99] });
  lensFlare(ctx, 940, 380, 0.7);
  dof(ctx, 3, c => { for (let i = 0; i < 8; i++) { c.fillStyle = '#2c3f70'; c.fillRect(i * 140 - 20, 1180 - (i * 47 % 160), 120, 600); } });
  // street, lamp-free, lit by the Moon; long moon shadows
  ctx.fillStyle = grad(ctx, ['#3d5488', '#24345c'], 0, 1500, 0, H); ctx.fillRect(0, 1480, W, H);
  ctx.fillStyle = 'rgba(10,18,40,0.35)'; ctx.beginPath(); ctx.ellipse(360, 1760, 260, 26, -0.08, 0, 6.283); ctx.fill();
  silhouette(ctx, 470, 1760, 560, { pose: 'read' });
  silhouette(ctx, 860, 1720, 420, { pose: 'point', col: '#14203f' });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Nights bright enough', 'to read by.'], 300, 10.8, { size: 92, out: 14.7 });
  say(ctx, t, ['~100× brighter than a full moon today'], 520, 12.4, { size: 50, weight: 800, out: 14.7 });
}

// ---------------------------------------------------------------- 4. the ground under you
function sGround(ctx, t) {
  const [sx, sy] = shakeOffset(t, 18.6, 2.6, 34);
  ctx.translate(sx, sy);
  punch(ctx, t, [18.6], 0.08, W / 2, 1300);
  ctx.fillStyle = grad(ctx, ['#2a3f7c', '#6f8fcf', '#d6c2a6']); ctx.fillRect(0, 0, W, H);
  glow(ctx, 840, 420, 460, '215,228,255', 0.4); moonFx(ctx, 840, 420, 200, { sun: [0.05, -0.08, 0.99] });
  const small = t < 18.6 ? Math.sin((t - 15) * 2.4) * 14 : 0;                       // the gentle 30 cm breathing
  const heave = t >= 18.6 ? easeOut(prog(t, 18.6, 20.4)) : 0;
  const lift = small - heave * 420;
  // strata
  const top = 1350 + lift;
  [['#7a5a3a', 0], ['#5e4430', 120], ['#47331f', 300], ['#2f2215', 520]].forEach(([c, d]) => { ctx.fillStyle = c; ctx.fillRect(-60, top + d, W + 120, H); });
  ctx.fillStyle = '#4f7d3a'; ctx.fillRect(-60, top - 14, W + 120, 18);
  if (heave > 0) {                                                                      // fractures
    ctx.strokeStyle = 'rgba(255,140,60,0.9)'; ctx.lineWidth = 6; const r = rng(17);
    for (let i = 0; i < 7; i++) { let x = r() * W, y = top + 20; ctx.beginPath(); ctx.moveTo(x, y);
      for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 120; y += 60 + r() * 60; ctx.lineTo(x, y); } ctx.globalAlpha = heave; ctx.stroke(); ctx.globalAlpha = 1; }
    dustBurst(ctx, t, 300, top, 18.6, { size: 1.6, seed: 4, col: [150, 120, 95] });
    dustBurst(ctx, t, 800, top, 18.8, { size: 1.4, seed: 5, col: [150, 120, 95] });
    debrisPhys(ctx, t, 540, top, 18.6, { n: 36, speed: 900, ground: top + 10, col: '#5e4430', seed: 9 });
  }
  silhouette(ctx, 540, top - 10, 330, { col: '#101830' });
  // ruler showing the rise
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(880, 1350); ctx.lineTo(880, top); ctx.stroke();
  ctx.font = `800 34px ${FONT}`; ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
  ctx.fillText(t < 18.6 ? '≈30 cm' : 'hundreds of m', 860, (1350 + top) / 2 + 12);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Right now, the ground', 'under you rises ~30 cm,', 'twice a day.'], 300, 15.3, { size: 70, out: 18.4 });
  say(ctx, t, ['You never feel it.'], 560, 16.8, { size: 70, out: 18.4, mark: { line: 0, from: 4, to: 17, color: '#3a86ff' } });
  say(ctx, t, ['10× closer:', 'hundreds of meters.'], 300, 18.8, { size: 92, out: 20.8, mark: { line: 1, from: 0, to: 19, color: '#ff6b5b' } });
  say(ctx, t, ['Rock can’t bend that far.'], 520, 19.6, { size: 60, weight: 800, out: 20.8 });
}

// ---------------------------------------------------------------- 5. the first tide
function sFlood(ctx, t) {
  const [sx, sy] = shakeOffset(t, 22.0, 6.5, 14);
  ctx.translate(sx, sy);
  punch(ctx, t, [21.2, 22.4, 24.6], 0.05, W / 2, 1300);
  drift(ctx, t, 21, 28.5, 1.0, 1.06, W / 2, 1300);
  ctx.fillStyle = grad(ctx, ['#1b2c58', '#40609e', '#8ba3d6']); ctx.fillRect(0, 0, W, H);
  glow(ctx, 820, 420, 520, '205,220,255', 0.3); moonFx(ctx, 820, 420, 260, { sun: [0.05, -0.08, 0.99] });
  const ground = 1560;
  dof(ctx, 5, c => { for (let i = 0; i < 9; i++) tower(c, t, -40 + i * 130, 1300, 110, 380 + (i * 53 % 200), { col: '#4a5d8c', win: 'rgba(255,226,170,0.7)', seed: 40 + i }); });
  const front = lerp(-420, 1180, easeInOut(prog(t, 21.4, 28.3)));
  [[80, 170, 720, 1], [300, 190, 900, 1], [540, 160, 640, -1], [760, 200, 980, 1]].forEach(([x, w, h, dir], i) => {
    const hit = prog(front, x - 100, x + 500);
    tower(ctx, t, x, ground, w, h, { col: ['#34416e', '#3d3a66', '#2f4a66', '#433d5e'][i], win: 'rgba(255,226,170,0.9)', fall: i % 2 ? 0 : hit, crumble: i % 2 ? hit : hit * 0.3, dir, seed: i + 1 });
    if (hit > 0.02) dustBurst(ctx, t, x + w / 2, ground - 40, 21.4 + 6.9 * ((x + 400) / 1600), { size: 1.2, seed: i + 7, col: [110, 118, 140] });
  });
  ctx.fillStyle = '#1e2640'; ctx.fillRect(-60, ground, W + 120, H);
  waterWall(ctx, t, front, ground + 20, 640, { seed: 4 });
  if (front > 0) spray(ctx, t, front + 80, ground - 560, { n: 70, dir: -1.0, seed: 3 });
  if (front > 100) ship(ctx, front - 160, ground - 630 + Math.sin(t * 2) * 18, 0.9, -0.15 + Math.sin(t * 1.5) * 0.06);
  debrisPhys(ctx, t, Math.max(140, front), ground - 300, 22.4, { n: 34, speed: 900, dir: -0.9, spread: 1.3, col: '#1f2638', seed: 12, ground });
  debrisPhys(ctx, t, Math.max(140, front), ground - 300, 24.6, { n: 34, speed: 950, dir: -0.9, spread: 1.3, col: '#2a2f44', seed: 13, ground });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Then the oceans move.'], 300, 21.2, { size: 92, out: 23.6 });
  say(ctx, t, ['A tide hundreds', 'of meters high'], 300, 23.8, { size: 92, out: 25.4 });
  say(ctx, t, ['Nearly 2 billion people', 'live in its path'], 300, 25.6, { size: 80, out: 28.2 });
  tally(ctx, t, 1900000000, W / 2, 1690, 25.8, { size: 104, out: 28.2, label: 'Most could not escape', color: '#ffb0a0' });
}

// ---------------------------------------------------------------- 6. it keeps coming
function sAgain(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 28.5, 32, 1.0, 1.04, W / 2, 1050);
  const cx = W / 2, cy = 1050, r = 360, ang = (t - 28.5) * 0.9;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(1.18, 0.88);
  const g = ctx.createRadialGradient(0, 0, r * 0.92, 0, 0, r * 1.1);
  g.addColorStop(0, 'rgba(80,170,255,0.7)'); g.addColorStop(1, 'rgba(80,170,255,0.05)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, 6.283); ctx.fill(); ctx.restore();
  globe(ctx, cx, cy, r, { lon0: 100 + (t - 28.5) * 14, lat0: 12, t, sun: SUN });
  const mx = cx + Math.cos(ang) * 600, my = cy + Math.sin(ang) * 210;
  moonFx(ctx, mx, my, 70, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['And it comes back.', 'Again. And again.'], 300, 28.8, { size: 88, out: 31.7 });
  say(ctx, t, ['Every few days, for every coast on Earth'], 1640, 29.8, { size: 52, weight: 800, out: 31.7 });
}

// ---------------------------------------------------------------- 7. volcanic winter
function sAsh(ctx, t) {
  const [sx, sy] = shakeOffset(t, 32.3, 5.5, 20);
  ctx.translate(sx, sy);
  punch(ctx, t, [33.0], 0.07, W / 2, 1100);
  drift(ctx, t, 32, 39, 1.0, 1.05, W / 2, 1300);
  const dim = easeInOut(prog(t, 35.6, 38.0));
  ctx.fillStyle = grad(ctx, [mixHex('#3a2232', '#2a2a2e', dim), mixHex('#a2442c', '#55504e', dim), mixHex('#f08a42', '#77706a', dim)]); ctx.fillRect(0, 0, W, H);
  const erupt = prog(t, 32.6, 33.8);
  for (const [vx, vy, sc, sd] of [[260, 1180, 0.7, 2], [820, 1120, 0.8, 3]]) plume(ctx, t, vx, vy, { height: 1200, width: 260 * sc, grow: 0.25 + erupt * 0.75, seed: sd, col: [62, 56, 60], light: [160, 146, 138] });
  plume(ctx, t, 560, 1060, { height: 1400, width: 340, grow: 0.3 + erupt * 0.7, seed: 6, col: [58, 52, 56], light: [168, 150, 140] });
  ctx.fillStyle = '#231417';
  for (const [x0, x1, top] of [[60, 460, 1180], [300, 820, 1060], [620, 1040, 1120]]) { ctx.beginPath(); ctx.moveTo(x0, 1420); ctx.lineTo((x0 + x1) / 2 - 50, top); ctx.lineTo((x0 + x1) / 2 + 50, top); ctx.lineTo(x1, 1420); ctx.fill(); }
  if (erupt > 0) for (const [x, y] of [[260, 1180], [560, 1060], [830, 1120]]) { glow(ctx, x, y, 200, '255,120,40', 0.85 * erupt); embers(ctx, t, x, y, { n: 50, w: 220, h: 600, seed: x }); }
  debrisPhys(ctx, t, 560, 1060, 33.0, { col: '#ff7a2a', n: 36, speed: 1100, seed: 21, ground: 1420 });
  ctx.fillStyle = grad(ctx, ['#2b2023', '#151012'], 0, 1420, 0, H); ctx.fillRect(-60, 1420, W + 120, H);
  ctx.fillStyle = `rgba(200,195,190,${0.5 * dim})`; const r = rng(91);
  for (let i = 0; i < 160; i++) ctx.fillRect((r() * W + t * 30) % W, (r() * H + t * (60 + r() * 60)) % H, 3, 3);
  for (let i = 0; i < 18; i++) { const x = 30 + i * 60, col = mixHex('#7fbf4a', '#8a7a52', dim);
    ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, 1860); ctx.quadraticCurveTo(x, 1760, x + dim * 60, 1700 + dim * 60); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The crust heaves.', 'Volcanoes erupt', 'everywhere.'], 300, 32.3, { size: 80, out: 35.6 });
  say(ctx, t, ['Ash blots out the Sun.', 'Harvests fail.'], 300, 35.8, { size: 84, out: 38.7 });
  say(ctx, t, ['Billions more could starve'], 1600, 36.8, { size: 66, weight: 900, out: 38.7, mark: { line: 0, from: 0, to: 13, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 8. the turn: the Moon is falling
function sFalling(ctx, t) {
  space(ctx, t);
  punch(ctx, t, [40.2], 0.05, W / 2, 1100);
  drift(ctx, t, 39, 46, 1.0, 1.05, W / 2, 1100);
  const cx = W / 2, cy = 1120;
  globe(ctx, cx, cy, 150, { lon0: 40 + t * 3, lat0: 12, t, sun: SUN });
  ctx.strokeStyle = 'rgba(120,200,255,0.55)'; ctx.lineWidth = 4; ctx.setLineDash([14, 14]); ctx.beginPath(); ctx.arc(cx, cy, 440, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255,110,90,0.6)'; ctx.setLineDash([6, 12]); ctx.beginPath(); ctx.arc(cx, cy, 190, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `800 30px ${FONT}`; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(150,210,255,0.95)'; ctx.fillText('SAFE ORBIT', cx, cy - 462);
  ctx.fillStyle = 'rgba(255,140,120,0.95)'; ctx.fillText('BREAKING POINT', cx, cy + 236);
  const p = easeIn3(prog(t, 40.4, 45.8)), a = -0.6 + p * 9.5, rr = lerp(400, 215, p);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 120; i++) { const q = i / 120 * p, aa = -0.6 + q * 9.5, r2 = lerp(400, 215, q); const x = cx + Math.cos(aa) * r2, y = cy + Math.sin(aa) * r2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  moonFx(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 46 + p * 14, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['But here’s the twist:'], 300, 39.3, { size: 70, out: 40.1 });
  say(ctx, t, ['the Moon is falling.'], 300, 40.2, { size: 96, out: 45.8, mark: { line: 0, from: 4, to: 20, color: '#ff6b5b' } });
  say(ctx, t, ['It orbits faster than Earth spins,', 'so the tides drag it inward'], 1560, 40.8, { size: 50, weight: 800, out: 43.2 });
  tally(ctx, t, 10000, W / 2, 1700, 43.4, { size: 120, dur: 2.4, suffix: '×', out: 45.8, label: 'stronger tides by the end: kilometers high', labelSize: 38, color: '#ffb0a0' });
}

// ---------------------------------------------------------------- 9. the end: torn apart (slow motion)
function sBreak(ctx, t) {
  // time remap: slow motion (0.3x) for 1.2 s around the shatter
  const S0 = 46.4, S1 = 47.6, K = 0.3;
  const lt = t < S0 ? t : t < S1 ? S0 + (t - S0) * K : S0 + (S1 - S0) * K + (t - S1);
  const shatter = 46.6 + (46.6 - S0) * 0;            // shatter happens at local 46.6
  space(ctx, t);
  const [sx, sy] = shakeOffset(t, 46.6, 1.6, 24);
  ctx.translate(sx, sy);
  punch(ctx, t, [46.6], 0.1, W / 2, 1150);
  drift(ctx, t, 46, 53, 1.0, 1.07, W / 2, 1150);
  const cx = W / 2, cy = 1180;
  const p = easeIn3(prog(lt, 46.0, shatter)), ang = -0.4 + 0.75 + p * 0.6, rad = lerp(470, 400, p);
  const ringP = prog(lt, shatter, 51.5);
  if (lt > shatter) drawRing(ctx, cx, cy, ringP, t, true);
  globe(ctx, cx, cy, 300, { lon0: 70 + t * 3, lat0: 15, t, sun: SUN });
  if (lt > shatter) drawRing(ctx, cx, cy, ringP, t, false);
  const mx = cx + Math.cos(ang) * rad, my = cy - 300 + Math.sin(ang) * 40;
  if (lt < shatter) {
    const st = 1 + p * 0.5;
    ctx.save(); ctx.translate(mx, my); ctx.rotate(Math.atan2(cy - my, cx - mx)); ctx.scale(st, 1 / st);
    moonFx(ctx, 0, 0, 110, { sun: SUN, crack: 1 + p * 2.5 }); ctx.restore();
  } else {
    debrisPhys(ctx, lt, mx, my, shatter, { n: 80, speed: 420, g: 0, spread: 6.28, col: '#bdb8ae', size: 20, dur: 6, seed: 31 });
    shockwave(ctx, lt, mx, my, shatter, { maxR: 600, dur: 1.3, col: '255,220,180', flat: 1 });
    lensFlare(ctx, mx, my, Math.max(0, 1 - (lt - shatter) * 0.8), '255,220,180');
  }
  flash(ctx, t, 46.6, 0.3);
  for (let i = 0; i < 12; i++) { const at = 48.4 + i * 0.22, x0 = 180 + (i * 97) % 700; fireball(ctx, t, x0 + 280, cy - 680, x0 + 40, cy - 230 + (i % 3) * 50, at, 1.0, 0.85); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Within centuries,', 'Earth’s gravity'], 300, 46.2, { size: 92, out: 49.4 });
  say(ctx, t, ['tears it apart.'], 490, 46.7, { size: 110, out: 49.4, mark: { line: 0, from: 0, to: 15, color: '#ff6b5b' } });
  say(ctx, t, ['Moon-sized wreckage rains', 'down on what’s left of us'], 300, 49.6, { size: 74, out: 52.6 });
}

// ---------------------------------------------------------------- 10. final image
function sRings(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 53, 56, 1.0, 1.04, W / 2, 1250);
  drawRing(ctx, W / 2, 1250, 1, t, true);
  globe(ctx, W / 2, 1250, 300, { lon0: 90 + t * 3, lat0: 15, t, sun: SUN });
  drawRing(ctx, W / 2, 1250, 1, t, false);
  lensFlare(ctx, 120, 300, 0.5, '255,236,200');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Earth would end up', 'with rings…'], 300, 53.2, { size: 92 });
  say(ctx, t, ['…and no Moon at all.'], 530, 54.2, { size: 92, mark: { line: 0, from: 7, to: 19, color: '#3a86ff' } });
}

function drawRing(ctx, cx, cy, p, t, back) {
  const r = rng(77), spread = Math.min(1, p * 1.3);
  for (let i = 0; i < 1800; i++) {
    const a = r() * 6.283 + t * 0.12 * (0.8 + r() * 0.4), rr = 340 + r() * 300 * Math.min(1, p * 1.4);
    if ((Math.sin(a) < 0) !== back) continue;
    const x = cx + Math.cos(a) * rr * spread + (1 - spread) * 220, y = lerp(cy - 300, cy + Math.sin(a) * rr * 0.26, spread);
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
