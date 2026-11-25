// What if the Moon were suddenly 10 times closer?   (v7: punchier cut, 3D surge + 3D quake, death-toll timeline)
// DEATH-TOLL TIMELINE (our estimates, labelled "est." on screen):
//  - First 24 h: 1+ billion. ~1.9 billion live in the surge's path (Kummu et al. 2016); few could outrun
//    tides of hundreds of metres arriving within hours.
//  - First week: tens of millions more under collapsing cities. Scale: the 2023 Turkey-Syria earthquake
//    alone killed more than 50,000; here every fault on Earth is strained at once.
//  - First year: ~half of humanity (~4 billion) could be gone: fisheries feeding 3.3 billion collapse
//    (FAO), volcanic winter wrecks harvests (Tambora/1816 precedent).
// v6 adds: a real 3D (WebGL) drone shot of the surge destroying a city; infrastructure, famine and
// species-level consequences with sourced numbers:
//  - ~80% of world trade by volume moves by sea (UNCTAD).
//  - Undersea cables carry ~99% of intercontinental internet traffic (widely cited industry figure).
//  - Aquatic foods provide >=20% of animal protein for ~3.3 billion people (FAO SOFIA 2022).
//  - 1816 "Year Without a Summer" followed one eruption (Tambora, 1815).
//  - Survivors in high inland regions (Tibetan Plateau, Andes, Ethiopian Highlands, Rockies): reasoning
//    from tides of hundreds of metres; stated as "retreat to the highlands", hedged "could".
//
// ARC: the Moon arrives -> its pull grabs the oceans -> the sea drains from the coast -> it returns as a
//      tide hundreds of metres high (death toll) -> the crust tears, volcanoes erupt -> ash and famine
//      -> the Moon is falling -> it's torn apart and bombards Earth -> rings, no Moon.
//
// NUMBERS (checked):
//  - Tidal force ∝ 1/d³: 10x closer -> 1,000x. Lunar equilibrium tide today is a few tenths of a metre
//    -> tides of hundreds of metres. Low tide is correspondingly deep: the sea retreats far offshore.
//  - ~1.9 billion people live within 100 km of a coast and below 100 m elevation (Kummu et al. 2016).
//  - Solid-Earth tide today ~20-40 cm twice daily -> x1,000: crust strained far past breaking ->
//    quakes and eruptions worldwide (Io comparison). Hedged: "quakes rip through", "erupt worldwide".
//  - Volcanic winter precedent: Tambora 1815 -> 1816. Famine hedged "could".
//  - Orbit ≈21 h < 24 h day -> inside synchronous orbit -> tidal drag pulls it inward (like Phobos),
//    tides growing as it falls; at the Roche limit it's torn apart into a ring; debris falls on Earth.
// segment map: old scenes are re-timed (compressed) into new slots; their sound cues move with them
const SEG = [
  // [newStart, newEnd, origStart, origEnd, sceneName]
  [0, 3.6, 0, 5, 'sArrive'], [3.6, 7.2, 5, 10, 'sPull'], [7.2, 10.4, 10, 14.5, 'sDrain'],
  [39.8, 44.4, 44, 51, 'sSpecies'], [44.4, 48, 33, 39, 'sFalling'], [48, 53, 39, 46, 'sBreak'], [53, 56, 46, 50, 'sRings'],
];
const ORIG_SFX = [
  [0.0, 'swell:2'], [1.8, 'impact'], [5.0, 'air'], [5.4, 'quake:4.5'], [7.0, 'roar:3'], [10.0, 'air'], [10.3, 'drawback:4.2'],
  [33.0, 'air'], [33.4, 'swell:1.6'], [34.2, 'impact'],
  [39.0, 'air'], [39.2, 'swell:2.4'], [41.6, 'impact'], [42.6, 'boom'], [43.4, 'impact'], [44.2, 'boom'],
  [44.0, 'air'], [44.3, 'swell:3'], [46.0, 'boom'], [48.0, 'boom'], [46.0, 'air'], [46.4, 'swell:3'],
];
const remapSfx = () => {
  const out = [];
  for (const [n0, n1, o0, o1, name] of SEG) {
    const k = (n1 - n0) / (o1 - o0);
    const owned = name === 'sSpecies' ? ORIG_SFX.slice(16, 20) : name === 'sRings' ? ORIG_SFX.slice(20) : name === 'sBreak' ? ORIG_SFX.slice(10, 16)
      : ORIG_SFX.filter(([t0]) => t0 >= o0 && t0 < o1 && !(name === 'sFalling' && t0 >= 39));
    for (const [t0, snd] of owned) { const [b, d] = snd.split(':'); out.push([+(n0 + (t0 - o0) * k).toFixed(2), d ? `${b}:${(+d * k).toFixed(2)}` : b]); }
  }
  return out;
};
const SHORT = {
  title: 'What if the Moon were suddenly 10 times closer?',
  duration: 56,
  fps: 60,
  motionSamples: 1,
  sfx: [
    ...remapSfx(),
    [10.4, 'air'], [10.5, 'quake:8'], [10.6, 'roar:8'], [11.0, 'impact'], [12.8, 'crumble'], [13.8, 'crumble'], [14.8, 'impact'], [15.4, 'crumble'], [16.6, 'crumble'],
    [18.4, 'air'], [18.6, 'impact'], [19.8, 'boom'], [21.0, 'boom'],
    [23.2, 'air'], [23.4, 'quake:7.4'], [24.0, 'impact'], [25.0, 'crumble'], [25.8, 'impact'], [26.4, 'crumble'], [27.2, 'boom'], [28.0, 'crumble'],
    [30.8, 'air'], [31.0, 'impact'], [32.3, 'boom'],
    [34.6, 'air'], [34.8, 'rumble:5'], [36.2, 'boom'], [37.6, 'impact'],
  ].sort((a, b) => a[0] - b[0]),
  music: { bpm: 70, mode: 'cinematic', until: 55.6, duckAt: [] },
};

const SUN = [-0.6, -0.35, 0.72];
const shifted = (fn, origStart, newStart) => (ctx, t) => fn(ctx, t - newStart + origStart);
const scaled = (fn, n0, n1, o0, o1) => (ctx, t) => fn(ctx, o0 + (t - n0) * (o1 - o0) / (n1 - n0));
const SCENES = { sArrive: () => sArrive, sPull: () => sPull, sDrain: () => sDrain, sSpecies: () => sSpecies, sFalling: () => sFalling, sBreak: () => sBreak, sRings: () => sRings };
const seg = name => { const [n0, n1, o0, o1] = SEG.find(x => x[4] === name); return [n0, scaled(SCENES[name](), n0, n1, o0, o1)]; };

function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, [seg('sArrive'), seg('sPull'), seg('sDrain'), [10.4, sDrone], [18.4, sToll1], [23.2, sQuake3], [30.8, sToll2], [34.6, sFamine2],
                    seg('sSpecies'), seg('sFalling'), seg('sBreak'), seg('sRings')], 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850);
  post(ctx, { bloom: 0.15 });
}

const toonGlobe = (ctx, x, y, R, t, extra = {}) => globe(ctx, x, y, R, { toon: true, t, sun: SUN, lights: false, clouds: 0.75, ...extra });

// ---------------------------------------------------------------- 1. the Moon arrives
function sArrive(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 0, 5, 1.0, 1.06, W / 2, 1200);
  toonGlobe(ctx, W / 2 - 90, 1300, 340, t, { lon0: -30 + t * 4, lat0: 18 });
  const k = easeInOut(prog(t, 0.4, 1.9));
  moonToon(ctx, lerp(W - 40, W / 2 + 270, k), lerp(260, 800, k), lerp(22, 190, k), { sun: SUN });
  shockwave(ctx, t, W / 2 + 270, 800, 1.8, { maxR: 520, dur: 1.0, col: '220,230,255', flat: 1 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 4.9) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(t, 4.5, 4.9));
    shadowed(ctx, () => blip(ctx, t, 890, 1700, t > 1.8 ? 'shock' : 'happy', 0.8, 0.5), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, t, ['What if the Moon were', 'suddenly 10× closer?'], 300, 0.3, { size: 88, out: 4.7, mark: { line: 1, from: 9, to: 20, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 2. its pull grabs the oceans
function sPull(ctx, t) {
  space(ctx, t);
  const [sx, sy] = shakeOffset(t, 5.4, 4.0, 10); ctx.translate(sx, sy);
  drift(ctx, t, 5, 10, 1.0, 1.05, W / 2, 1050);
  const cx = W / 2 - 40, cy = 1080, R = 340;
  // the two tidal bulges: the oceans heave out past the planet's outline, toward and away from the Moon
  const b = easeInOut(prog(t, 5.6, 8.6));
  ctx.save(); ctx.translate(cx, cy);
  const bg = ctx.createRadialGradient(0, 0, R * 0.9, 0, 0, R * (1 + 0.32 * b));
  bg.addColorStop(0, 'rgba(70,160,245,0.95)'); bg.addColorStop(1, 'rgba(70,160,245,0.55)');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, R * (1 + 0.3 * b), R * (1 - 0.02 * b), 0, 0, 6.283); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 6; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -t * 50;
  ctx.beginPath(); ctx.ellipse(0, 0, R * (1 + 0.26 * b), R * (1 - 0.04 * b), 0, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  toonGlobe(ctx, cx, cy, R, t, { lon0: -20, lat0: 10 });
  // seawater spilling over the continents on the Moon-facing edge
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const sg = ctx.createLinearGradient(cx + R * 0.2, 0, cx + R, 0); sg.addColorStop(0, 'rgba(60,150,240,0)'); sg.addColorStop(1, `rgba(60,150,240,${0.7 * b})`);
  ctx.fillStyle = sg; ctx.fillRect(cx, cy - R, R, 2 * R);
  const sg2 = ctx.createLinearGradient(cx - R * 0.2, 0, cx - R, 0); sg2.addColorStop(0, 'rgba(60,150,240,0)'); sg2.addColorStop(1, `rgba(60,150,240,${0.6 * b})`);
  ctx.fillStyle = sg2; ctx.fillRect(cx - R, cy - R, R, 2 * R);
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
  moonToon(ctx, cx + 370, cy - 480, 90, { sun: SUN });
  // pull arrows
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Its pull on our oceans:', '1,000× stronger'], 300, 5.3, { size: 88, out: 9.6, mark: { line: 1, from: 0, to: 15, color: '#ff6b5b' } });
  say(ctx, t, ['The seas heap up into a bulge', 'hundreds of meters high'], 1600, 7.0, { size: 56, weight: 800, out: 9.6 });
}

// a coastal city drawn as 3D blocks, reused by the drain and wave scenes
function city3d(ctx, t, ground, o = {}) {
  const { wave = -1e9 } = o;
  const back = [[40, 120, 430], [190, 110, 520], [330, 130, 380], [500, 120, 600], [650, 140, 450], [820, 120, 540]];
  dof(ctx, 3, c => back.forEach(([x, w, h], i) => block3d(c, t, x, ground - 120, w, h, { col: '#7f93c7', depth: 40, seed: 30 + i })));
  const front = [[20, 170, 640, 1], [250, 190, 820, 1], [500, 160, 560, -1], [700, 200, 900, 1]];
  front.forEach(([x, w, h, dir], i) => {
    const hit = prog(wave, x - 60, x + 420);
    block3d(ctx, t, x, ground, w, h, { col: ['#5468a8', '#6a5aa0', '#4d7aa6', '#6a6496'][i], depth: 70, fall: i % 2 ? 0 : hit, crumble: i % 2 ? hit : hit * 0.25, dir, seed: i + 1 });
  });
}

// ---------------------------------------------------------------- 3. the sea drains away
function sDrain(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#5aa8ff', '#9fd0ff', '#ffe2b8']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 10, 15, 1.0, 1.05, W / 2, 1300);
  moonToon(ctx, 830, 380, 210, { sun: [0.3, -0.4, 0.86] });
  const ground = 1180;
  city3d(ctx, t, ground);
  ctx.fillStyle = '#5b6b80'; ctx.fillRect(-60, ground, W + 120, 40);                  // seawall
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.strokeRect(-60, ground, W + 120, 40);
  // exposed seabed
  ctx.fillStyle = grad(ctx, ['#d9b77f', '#b8925a'], 0, ground + 40, 0, H); ctx.fillRect(-60, ground + 40, W + 120, H);
  const rr = rng(6); ctx.fillStyle = '#8f7350';
  for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.ellipse(rr() * W, ground + 80 + rr() * 700, 18 + rr() * 30, 8 + rr() * 10, 0, 0, 6.283); ctx.fill(); }
  // the water line retreating toward the horizon of the frame
  const level = lerp(ground + 40, H + 60, easeInOut(prog(t, 10.4, 14.0)));
  ctx.fillStyle = grad(ctx, ['#3d9bf0', '#2068bf'], 0, level, 0, H); ctx.fillRect(-60, level, W + 120, H);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.beginPath(); for (let x = -60; x <= W + 60; x += 20) ctx.lineTo(x, level + Math.sin(x * 0.03 + t * 3) * 8); ctx.stroke();
  // stranded boats tilting onto the sand
  const strand = easeOut(prog(t, 11.6, 13.2));
  [[230, ground + 380, 0.55, -0.25], [700, ground + 520, 0.7, 0.3]].forEach(([x, y, s2, rot]) => {
    ctx.save(); ctx.translate(x, Math.min(y, level - 20)); ctx.rotate(rot * strand); ship(ctx, 0, 0, s2, 0); ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['First, the sea', 'drains away.'], 300, 10.3, { size: 92, out: 14.6 });
  say(ctx, t, ['Harbors empty. Ships are left', 'stranded on the seabed.'], 1620, 11.8, { size: 54, weight: 800, out: 14.6 });
}

// ---------------------------------------------------------------- 4. it comes back
function sWave(ctx, t) {
  const [sx, sy] = shakeOffset(t, 15.4, 7.0, 14); ctx.translate(sx, sy);
  ctx.fillStyle = grad(ctx, ['#4a7fd1', '#8fbaf0', '#ffd6a8']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 15, 23, 1.0, 1.07, W / 2, 1300);
  moonToon(ctx, 830, 360, 210, { sun: [0.3, -0.4, 0.86] });
  const ground = 1520, front = lerp(-460, 1020, easeInOut(prog(t, 15.4, 22.8)));
  city3d(ctx, t, ground, { wave: front });
  ctx.fillStyle = '#4a5568'; ctx.fillRect(-60, ground, W + 120, H);
  [[20, 640], [250, 820], [500, 560], [700, 900]].forEach(([x], i) => {
    const at = 15.4 + 7.4 * ((x + 400) / 1480);
    if (t > at) dustToon(ctx, t, x + 90, ground - 30, at, i);
  });
  toonWave(ctx, t, front, ground + 30, 520, 4);
  if (front > 60) { ctx.save(); ctx.translate(front - 180, ground - 520 + Math.sin(t * 2) * 16); ctx.rotate(-0.2 + Math.sin(t * 1.4) * 0.08); ship(ctx, 0, 0, 0.85, 0); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Then it comes back.'], 300, 15.3, { size: 92, out: 18.8 });
  say(ctx, t, ['Hundreds of', 'meters high.'], 420, 16.8, { size: 92, out: 18.8, mark: { line: 0, from: 0, to: 11, color: '#ff6b5b' } });
  say(ctx, t, ['Nearly 2 billion people', 'live in its path.'], 300, 19.2, { size: 84, out: 22.7 });
  say(ctx, t, ['Most could not escape.'], 520, 20.8, { size: 72, weight: 900, out: 22.7, mark: { line: 0, from: 0, to: 22, color: '#ff6b5b' } });
}
function dustToon(ctx, t, x, y, at, seed) {
  const k = prog(t, at, at + 3.0); if (k <= 0 || k >= 1) return;
  const r = rng(seed + 50);
  ctx.save(); ctx.globalAlpha = 1 - k; ctx.lineWidth = 3; ctx.strokeStyle = INK;
  for (let i = 0; i < 9; i++) { const a = -Math.PI + r() * Math.PI, d = easeOut(k) * (120 + r() * 160), rr = (40 + r() * 40) * (0.6 + k);
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.5 - k * 60;
    ctx.fillStyle = '#b9b3ad'; ctx.beginPath(); ctx.arc(px, py, rr, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8d3cd'; ctx.beginPath(); ctx.arc(px - rr * 0.2, py - rr * 0.25, rr * 0.6, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

// ---------------------------------------------------------------- 5. the crust tears
function sQuake(ctx, t) {
  const [sx, sy] = shakeOffset(t, 23.2, 5.6, 22); ctx.translate(sx + Math.sin(t * 38) * 3, sy);
  const erupt = prog(t, 26.2, 27.2);
  ctx.fillStyle = grad(ctx, [mixHex('#5a8fe0', '#7a3a3a', erupt), mixHex('#a9cdf5', '#e0773a', erupt)]); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 23, 29, 1.0, 1.05, W / 2, 1300);
  if (erupt > 0) toonPlume(ctx, t, 560, 1000, { height: 1100, width: 300, grow: 0.25 + erupt * 0.75, seed: 6 });
  volcano3d(ctx, t, 560, 1240, 760, 300, erupt);
  if (erupt > 0) debrisPhys(ctx, t, 560, 950, 26.4, { n: 30, speed: 1100, seed: 21, col: '#ff7a2a', ground: 1240, size: 16 });
  // town in the foreground with a fissure opening under it
  const open = easeInOut(prog(t, 24.4, 25.6));
  [[60, 150, 420, 24.8], [260, 170, 520, 25.2], [700, 160, 460, 24.6], [880, 140, 380, 25.4]].forEach(([x, w, h, at], i) => {
    block3d(ctx, t, x, 1480, w, h, { col: ['#5468a8', '#6a5aa0', '#4d7aa6', '#6a6496'][i], depth: 60, crumble: easeInOut(prog(t, at, at + 1.6)), seed: 60 + i });
    if (t > at) dustToon(ctx, t, x + w / 2, 1460, at, i + 20);
  });
  ctx.fillStyle = '#6d7f5a'; ctx.fillRect(-60, 1480, W + 120, H);
  ctx.fillStyle = '#56653f'; ctx.fillRect(-60, 1480, W + 120, 22);
  if (open > 0) {
    const pts = []; for (let i = 0; i <= 30; i++) pts.push([lerp(-60, W + 60, i / 30), 1660 + Math.sin(i * 0.9) * 22 + noise3(i * 0.7, 3, 1) * 26]);
    const wd = i => open * (30 + Math.abs(noise3(i * 0.8, 1, 2)) * 70);
    ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y - wd(i)) : ctx.moveTo(x, y - wd(i)));
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + wd(i)); ctx.closePath();
    ctx.fillStyle = '#2a1a14'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    ctx.clip(); ctx.fillStyle = '#4a2e22'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y - wd(i)) : ctx.moveTo(x, y - wd(i)));
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] - wd(i) + 40 * open); ctx.closePath(); ctx.fill();   // 3D wall face
    glow(ctx, W / 2, 1700, 600, '255,110,30', 0.5 * open);
    ctx.restore();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The ground', 'stretches too.'], 300, 23.3, { size: 92, out: 26.0 });
  say(ctx, t, ['Quakes rip through', 'every continent'], 520, 24.6, { size: 70, weight: 900, out: 26.0 });
  say(ctx, t, ['Volcanoes erupt', 'worldwide.'], 300, 26.4, { size: 92, out: 28.7, mark: { line: 0, from: 0, to: 15, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 6. ash and famine
function sAsh(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 29, 33, 1.0, 1.05, W / 2, 1050);
  const cx = W / 2, cy = 1060, R = 400;
  toonGlobe(ctx, cx, cy, R, t, { lon0: 60 + t * 4, lat0: 15 });
  const ash = easeInOut(prog(t, 29.4, 32.4));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const r = rng(33);
  for (let i = 0; i < 40; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R, rr = 60 + r() * 120;
    ctx.fillStyle = `rgba(80,72,78,${0.85 * Math.min(1, ash * 1.6 - r() * 0.5)})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr * ash, 0, 6.283); ctx.fill(); }
  for (let i = 0; i < 10; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.85; glow(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 40, '255,120,40', 0.9 * (0.5 + 0.5 * Math.sin(t * 6 + i))); }
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Ash blots out the Sun.', 'Harvests fail.'], 300, 29.3, { size: 84, out: 32.7 });
  say(ctx, t, ['Billions more could starve'], 1660, 30.8, { size: 64, weight: 900, out: 32.7, mark: { line: 0, from: 0, to: 13, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 7. the Moon is falling
function sFalling(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 33, 39, 1.0, 1.05, W / 2, 1100);
  const cx = W / 2, cy = 1120;
  toonGlobe(ctx, cx, cy, 170, t, { lon0: 40 + t * 3, lat0: 12 });
  ctx.strokeStyle = 'rgba(255,110,90,0.7)'; ctx.lineWidth = 4; ctx.setLineDash([8, 12]); ctx.beginPath(); ctx.arc(cx, cy, 230, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `800 30px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,150,130,0.95)'; ctx.fillText('BREAKING POINT', cx, cy + 280);
  const p = easeIn3(prog(t, 34.2, 38.8)), a = -0.6 + p * 9.5, rr = lerp(470, 260, p);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let i = 0; i <= 120; i++) { const q = i / 120 * p, aa = -0.6 + q * 9.5, r2 = lerp(470, 260, q); const x = cx + Math.cos(aa) * r2, y = cy + Math.sin(aa) * r2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  moonToon(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 52 + p * 18, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['And it only gets worse:'], 300, 33.3, { size: 72, out: 38.7 });
  say(ctx, t, ['the Moon is falling.'], 420, 34.2, { size: 96, out: 38.7, mark: { line: 0, from: 4, to: 20, color: '#ff6b5b' } });
  say(ctx, t, ['Every year closer.', 'Every year, bigger tides.'], 1620, 35.8, { size: 58, weight: 800, out: 38.7 });
}

// ---------------------------------------------------------------- 8. torn apart, bombardment
function sBreak(ctx, t) {
  space(ctx, t);
  const [sx, sy] = shakeOffset(t, 41.6, 3.5, 22); ctx.translate(sx, sy);
  drift(ctx, t, 39, 46, 1.0, 1.07, W / 2, 1200);
  const cx = W / 2, cy = 1250, R = 360, shatter = 41.6;
  const ringP = prog(t, shatter, 45.5);
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, true);
  toonGlobe(ctx, cx, cy, R, t, { lon0: 80 + t * 3, lat0: 15 });
  // impact flashes on the globe from falling wreckage
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const [at, ax, ay] of [[42.6, -120, -150], [43.4, 90, -60], [44.2, -30, 80], [44.8, 170, -170]]) {
    const k = prog(t, at, at + 1.4); if (k <= 0) continue;
    glow(ctx, cx + ax, cy + ay, 60 + 120 * k, '255,190,90', 0.95 * (1 - k * 0.6));
    ctx.strokeStyle = `rgba(255,240,200,${1 - k})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx + ax, cy + ay, 30 + 160 * k, 0, 6.283); ctx.stroke();
    ctx.fillStyle = `rgba(70,60,65,${0.7 * k})`; ctx.beginPath(); ctx.arc(cx + ax, cy + ay, 50 + 70 * k, 0, 6.283); ctx.fill();
  }
  ctx.restore();
  if (t > shatter) drawRing(ctx, cx, cy, ringP, t, false);
  const p = easeIn3(prog(t, 39.2, shatter)), mx = cx + 200 - p * 40, my = cy - 520 + p * 40;
  if (t < shatter) moonToon(ctx, mx, my, 120 * (1 + p * 0.15), { sun: SUN, crack: 0.3 + p * 1.5 });
  else {
    const T = t - shatter, rr = rng(41);
    for (let i = 0; i < 26; i++) { const a = rr() * 6.283, v = 140 + rr() * 260, s2 = 14 + rr() * 30;
      const px = mx + Math.cos(a) * v * T, py = my + Math.sin(a) * v * T + (i % 3 === 0 ? 220 * T * T : 0);
      ctx.save(); ctx.translate(px, py); ctx.rotate(T * (rr() - 0.5) * 4); ctx.fillStyle = '#d5d9e3'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-s2, -s2 * 0.5); ctx.lineTo(s2 * 0.7, -s2); ctx.lineTo(s2, s2 * 0.6); ctx.lineTo(-s2 * 0.6, s2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    shockwave(ctx, t, mx, my, shatter, { maxR: 520, dur: 1.2, col: '255,225,190', flat: 1 });
  }
  flash(ctx, t, shatter, 0.3);
  for (let i = 0; i < 8; i++) fireball(ctx, t, cx - 300 + i * 90, cy - 760, cx - 180 + i * 50, cy - R * 0.6, 42.2 + i * 0.32, 0.9, 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Until Earth’s gravity', 'tears it apart.'], 300, 39.3, { size: 92, out: 45.6, mark: { line: 1, from: 0, to: 14, color: '#ff6b5b' } });
  say(ctx, t, ['The wreckage bombards', 'the planet.'], 1600, 42.4, { size: 68, weight: 900, out: 45.6 });
}

// ---------------------------------------------------------------- 9. final image
function sRings(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 46, 50, 1.0, 1.04, W / 2, 1250);
  drawRing(ctx, W / 2, 1250, 1, t, true);
  toonGlobe(ctx, W / 2, 1250, 330, t, { lon0: 100 + t * 3, lat0: 15 });
  drawRing(ctx, W / 2, 1250, 1, t, false);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Earth ends up', 'with rings…'], 300, 46.3, { size: 92 });
  say(ctx, t, ['…and no Moon.'], 520, 47.4, { size: 92, mark: { line: 0, from: 7, to: 12, color: '#3a86ff' } });
}

function drawRing(ctx, cx, cy, p, t, back) {
  const r = rng(77), spread = Math.min(1, p * 1.3);
  for (let i = 0; i < 1800; i++) {
    const a = r() * 6.283 + t * 0.12 * (0.8 + r() * 0.4), rr = 420 + r() * 300 * Math.min(1, p * 1.4);
    if ((Math.sin(a) < 0) !== back) continue;
    const x = cx + Math.cos(a) * rr * spread + (1 - spread) * 200, y = lerp(cy - 500, cy + Math.sin(a) * rr * 0.26, spread);
    const v = 200 + r() * 55;
    ctx.fillStyle = `rgba(${v},${v - 6},${v - 16},${0.55 + r() * 0.45})`;
    ctx.fillRect(x, y, 2 + r() * 3, 2 + r() * 3);
  }
}
function easeIn3(p) { return p * p * p; }
function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------- v6: the 3D drone flyover
const DRONE = { height: 320, z0: 1500, z1: -1800, dur: 8,
  path: [[0, [500, 650, -2100], [0, 160, 900]], [2.6, [1300, 450, -1250], [-100, 170, 200]], [5.2, [1400, 700, -2500], [-300, 150, -700]], [8, [650, 1500, -3400], [0, 20, -1300]]],
  shake: lt => 5 * Math.exp(-Math.abs(lt - 2.3) * 0.5) };
function sDrone(ctx, t) {
  const lt = t - 10.4;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = grad(ctx, ['#4f86da', '#a2c6f2', '#ffd9b0']); ctx.fillRect(0, 0, W, H);
  moonToon(ctx, 760, 400, 240, { sun: [0.3, -0.4, 0.86] });
  City3D.draw(ctx, lt, DRONE);
  say(ctx, t, ['Then it comes back.'], 300, 10.6, { size: 92, out: 12.5 });
  say(ctx, t, ['Hundreds of', 'meters high.'], 300, 12.7, { size: 96, out: 14.7, mark: { line: 0, from: 0, to: 11, color: '#ff6b5b' } });
  say(ctx, t, ['Tokyo. Shanghai.', 'Mumbai. New York.'], 300, 14.9, { size: 86, out: 18.1 });
  say(ctx, t, ['Nowhere to run.'], 1680, 15.8, { size: 76, weight: 900, out: 18.1, mark: { line: 0, from: 0, to: 15, color: '#ff6b5b' } });
}

// a stat row in the original bold style: big outlined number + a line of context underneath
function statRow(ctx, t, y, at, big, text, o = {}) {
  const { out = 1e9, color = C.yellow, size = 108 } = o;
  if (t < at || t > out + 0.4) return;
  const p = easeOut(prog(t, at, at + 0.5)), e = 1 - prog(t, out, out + 0.35);
  ctx.save(); ctx.globalAlpha = e * Math.min(1, p * 1.5); ctx.translate((1 - p) * -60, 0);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
  ctx.font = `900 ${size}px ${FONT}`; ctx.lineWidth = size * 0.19; ctx.strokeStyle = INK; ctx.strokeText(big, 84, y); ctx.fillStyle = color; ctx.fillText(big, 84, y);
  ctx.font = `800 40px ${FONT}`; ctx.lineWidth = 9; const lines = wrap(ctx, text, 900);
  lines.forEach((ln, i) => { ctx.strokeText(ln, 88, y + 62 + i * 48); ctx.fillStyle = '#ffffff'; ctx.fillText(ln, 88, y + 62 + i * 48); });
  ctx.restore();
}

// ---------------------------------------------------------------- v6: the toll on civilization
function sToll(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#1b2a5c', '#2d4f93', '#3f74c4']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 25, 32, 1.0, 1.04, W / 2, 1700);
  toonGlobe(ctx, W / 2, 2150, 760, t, { lon0: 120 + t * 2, lat0: 30 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['In the first days:'], 300, 25.2, { size: 84, out: 31.7 });
  statRow(ctx, t, 520, 25.4, '1.9 BILLION', 'people live in the surge’s path', { out: 31.7, color: '#ffb0a0' });
  statRow(ctx, t, 790, 26.8, '80%', 'of world trade moves by sea. Every major port: wrecked.', { out: 31.7 });
  statRow(ctx, t, 1060, 28.2, '99%', 'of intercontinental internet traffic rides undersea cables. Torn apart.', { out: 31.7 });
  statRow(ctx, t, 1330, 29.6, 'DOZENS', 'of coastal nuclear plants, refineries and power stations: flooded', { out: 31.7 });
}

// ---------------------------------------------------------------- v6: famine
function sFamine(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 38, 44, 1.0, 1.05, W / 2, 1450);
  const cx = W / 2, cy = 1480, R = 400;
  toonGlobe(ctx, cx, cy, R, t, { lon0: 60 + t * 4, lat0: 15 });
  const ash = easeInOut(prog(t, 38.3, 41.0));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const r = rng(33);
  for (let i = 0; i < 40; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R, rr = 60 + r() * 120;
    ctx.fillStyle = `rgba(80,72,78,${0.85 * Math.min(1, ash * 1.6 - r() * 0.5)})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr * ash, 0, 6.283); ctx.fill(); }
  for (let i = 0; i < 10; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.85; glow(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 40, '255,120,40', 0.9 * (0.5 + 0.5 * Math.sin(t * 6 + i))); }
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Ash blots out the Sun.', 'Harvests fail.'], 300, 38.3, { size: 84, out: 43.7 });
  statRow(ctx, t, 560, 39.6, '1816', 'One volcano gave Earth a “year without a summer.” This is hundreds.', { out: 43.7 });
  statRow(ctx, t, 850, 41.2, '3.3 BILLION', 'people rely on fish for protein. Fisheries collapse.', { out: 43.7, color: '#ffb0a0' });
}

// ---------------------------------------------------------------- v6: what happens to humanity
const HIGHLANDS = [['Tibetan Plateau', 88, 33], ['Ethiopian Highlands', 39, 9], ['Andes', -70, -15], ['Rockies', -106, 40]];
function projectLL(cx, cy, R, lon0, lat0, lon, lat) {
  const l0 = lon0 * Math.PI / 180, p0 = lat0 * Math.PI / 180, l = lon * Math.PI / 180 - l0, p = lat * Math.PI / 180;
  const x = Math.cos(p) * Math.sin(l), y = -(Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
  const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  return [cx + x * R, cy + y * R, z];
}
function sSpecies(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 44, 51, 1.0, 1.04, W / 2, 1150);
  const cx = W / 2, cy = 1150, R = 430, lon0 = lerp(110, -90, easeInOut(prog(t, 44, 50.8))), lat0 = 12;
  toonGlobe(ctx, cx, cy, R, t, { lon0, lat0 });
  // drowned coastlines: a dark-blue fringe along every shore, the land that's left glows faintly
  for (const [name, lo, la] of HIGHLANDS) {
    const [x, y, z] = projectLL(cx, cy, R, lon0, lat0, lo, la); if (z < 0.15) continue;
    const a = Math.min(1, (z - 0.15) * 3) * prog(t, 44.6, 45.4);
    ctx.save(); ctx.globalAlpha = a;
    glow(ctx, x, y, 70 + Math.sin(t * 3) * 8, '255,214,90', 0.9);
    ctx.fillStyle = C.yellow; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 14, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.font = `900 40px ${FONT}`; ctx.lineJoin = 'round'; ctx.lineWidth = 10;
    const right = x + 26 + ctx.measureText(name).width < W - 40; ctx.textAlign = right ? 'left' : 'right'; const lx = right ? x + 26 : x - 26;
    ctx.strokeText(name, lx, y + 14); ctx.fillStyle = '#fff'; ctx.fillText(name, lx, y + 14);
    ctx.restore();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Survivors retreat', 'to the highlands'], 300, 44.3, { size: 92, out: 47.4 });
  say(ctx, t, ['Civilization could be', 'set back centuries'], 300, 47.6, { size: 88, out: 50.7, mark: { line: 1, from: 0, to: 18, color: '#ff6b5b' } });
  say(ctx, t, ['And the Moon isn’t finished.'], 1700, 49.0, { size: 60, weight: 900, out: 50.7 });
}

// ---------------------------------------------------------------- v7: death-toll cards and the 3D quake
function tollBackdrop(ctx, t, t0, t1) {
  ctx.fillStyle = grad(ctx, ['#1b2a5c', '#2d4f93', '#3f74c4']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, t0, t1, 1.0, 1.04, W / 2, 1700);
  toonGlobe(ctx, W / 2, 2150, 760, t, { lon0: 120 + t * 2, lat0: 30 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function sToll1(ctx, t) {
  tollBackdrop(ctx, t, 18.4, 23.2);
  say(ctx, t, ['FIRST 24 HOURS (est.)'], 300, 18.5, { size: 76, out: 23.0 });
  statRow(ctx, t, 520, 18.7, '1+ BILLION', 'dead: drowned, crushed, swept out to sea', { out: 23.0, color: '#ffb0a0' });
  statRow(ctx, t, 790, 19.9, '80%', 'of world trade sinks with the ports', { out: 23.0 });
  statRow(ctx, t, 1060, 21.1, '99%', 'of internet traffic between continents: cut', { out: 23.0 });
}

const QUAKE = { splitAt: 0.8, splitDur: 3.2, gap: 700, eruptAt: 3.6,
  path: [[0, [1500, 380, 260], [-400, 20, 0]], [3, [1500, 700, 900], [-200, -120, 0]], [7.6, [700, 1600, 2300], [-300, 0, -1500]]],
  shake: lt => 6 + 12 * Math.exp(-Math.abs(lt - 1.5)) };
function sQuake3(ctx, t) {
  const lt = t - 23.2;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = grad(ctx, ['#4a2a3a', '#b0503a', '#f0a070']); ctx.fillRect(0, 0, W, H);
  Quake3D.draw(ctx, lt, QUAKE);
  say(ctx, t, ['The ground', 'tears open.'], 300, 23.4, { size: 96, out: 25.6 });
  say(ctx, t, ['Whole cities fall', 'into the earth.'], 300, 25.8, { size: 92, out: 28.1, mark: { line: 1, from: 0, to: 15, color: '#ff6b5b' } });
  say(ctx, t, ['Volcanoes erupt', 'worldwide.'], 300, 28.3, { size: 92, out: 30.6 });
  say(ctx, t, ['Millions trapped as', 'towers come down'], 1620, 26.6, { size: 66, weight: 900, out: 30.6 });
}

function sToll2(ctx, t) {
  tollBackdrop(ctx, t, 30.8, 34.6);
  say(ctx, t, ['FIRST WEEK (est.)'], 300, 30.9, { size: 76, out: 34.4 });
  statRow(ctx, t, 520, 31.0, 'TENS OF MILLIONS', 'more, buried as cities collapse', { out: 34.4, color: '#ffb0a0', size: 90 });
  statRow(ctx, t, 790, 32.3, '50,000+', 'died in ONE quake in Turkey in 2023. This is every fault on Earth at once.', { out: 34.4 });
}

function sFamine2(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 34.6, 39.8, 1.0, 1.05, W / 2, 1450);
  const cx = W / 2, cy = 1480, R = 400;
  toonGlobe(ctx, cx, cy, R, t, { lon0: 60 + t * 4, lat0: 15 });
  const ash = easeInOut(prog(t, 34.8, 37.0));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const r = rng(33);
  for (let i = 0; i < 40; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R, rr = 60 + r() * 120;
    ctx.fillStyle = `rgba(80,72,78,${0.85 * Math.min(1, ash * 1.6 - r() * 0.5)})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr * ash, 0, 6.283); ctx.fill(); }
  for (let i = 0; i < 10; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.85; glow(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 40, '255,120,40', 0.9 * (0.5 + 0.5 * Math.sin(t * 6 + i))); }
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Ash blots out the Sun.', 'Harvests fail.'], 300, 34.8, { size: 84, out: 37.3 });
  statRow(ctx, t, 640, 35.8, '3.3 BILLION', 'rely on fish for protein. Fisheries collapse.', { out: 37.3 });
  say(ctx, t, ['FIRST YEAR (est.)'], 300, 37.5, { size: 76, out: 39.6 });
  statRow(ctx, t, 560, 37.7, 'HALF OF HUMANITY', 'could be gone: around 4 billion people', { out: 39.6, color: '#ffb0a0', size: 88 });
}
