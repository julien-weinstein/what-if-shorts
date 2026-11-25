// What if a planet the size of Mars hit Earth?   (v3: cartoon montage, slower beats, people up close)
//
// v3 notes: every scene holds ~4 s so captions can be read; cartoon people (toon()) put the human toll
// up close in classic cartoon fashion (fleeing, flung by the blast, zapped to a skeleton, crumbling to ash).
// No blood or gore.
//
// PHYSICS / NUMBERS (checked; working in archive/planet-impact-v1.js):
//  - Arrives at >= 11.2 km/s (~40,000 km/h). Energy ≈ 4e31 J ≈ 1e8 × Chicxulub; ~29 h of solar output.
//  - Boiling all oceans ≈ 3.6e27 J < 0.01% of the impact energy.
//  - In the final hour its gravity raises enormous tides (a Mars-mass body at a few Earth radii dwarfs the Moon's pull).
//  - Supersonic blast wave around the globe; ejecta re-entering as fireballs everywhere; rock-vapour atmosphere
//    thousands of degrees hot; magma ocean hundreds of km deep (giant-impact models): landmarks melt, bunkers fail.
//  - Debris disk -> new moon (a 2022 simulation: possibly within hours). Over millions of years the magma cools,
//    the steam atmosphere rains out and oceans return.
//  - Death toll (est.): all 8.2 billion within about a day.
//  - Twist: Theia hit the young Earth ~4.5 billion years ago; the Moon formed from the wreckage (leading hypothesis).
// PLOT HOLES: "Couldn't we deflect it?" -> a planet is ~10^12 × the mass of anything we've ever nudged.
// "Hide underground / evacuate?" -> the bunker beat: the crust itself melts; nowhere on Earth is far enough.

// ---------------------------------------------------------------- timeline: [name, duration, local sfx]
const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['crowd', 4.0, [[0.1, 'swell:3']]],
  ['tide', 4.0, [[0.2, 'roar:3.4']]],
  ['crown', 4.5, [[0.42, 'impact'], [0.45, 'boom'], [0.5, 'quake:3.5'], [2.3, 'boom']]],
  ['shock', 4.0, [[0.6, 'rumble:1.5'], [0.9, 'boom'], [1.0, 'roar:2.6'], [1.6, 'crumble']]],
  ['rain', 4.5, [[0.3, 'rumble:3'], [1.6, 'impact'], [1.65, 'boom'], [2.6, 'impact'], [3.1, 'crumble']]],
  ['boil', 4.0, [[0.1, 'roar:3.6'], [2.0, 'crumble']]],
  ['melt', 4.0, [[0.3, 'rumble:3'], [1.6, 'impact'], [2.2, 'crumble'], [3.0, 'crumble']]],
  ['bunker', 4.0, [[0.2, 'quake:3.6'], [2.2, 'boom'], [2.4, 'crumble']]],
  ['toll', 4.5, [[0.3, 'rumble:3'], [2.4, 'impact']]],
  ['magma', 3.5, [[0.1, 'rumble:3.2']]],
  ['moon', 4.5, [[0.2, 'swell:4']]],
  ['cool', 4.0, [[0.2, 'swell:3.6']]],
  ['twist', 5.5, [[0.2, 'swell:2.4'], [2.6, 'impact'], [2.8, 'swell:2.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if a planet the size of Mars hit Earth?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 74, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const SUN = [-0.6, -0.35, 0.72];
const FNS = { hook: vHook, crowd: vCrowd, tide: vTide, crown: vCrown, shock: vShock, rain: vRain, boil: vBoil, melt: vMelt,
              bunker: vBunker, toll: vToll, magma: vMagma, moon: vMoon, cool: vCool, twist: vTwist, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;     // caption exit, local time
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}

// ---------------------------------------------------------------- cartoon people
const R2 = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const SHIRTS = ['#3a86ff', '#ff5d8f', '#2ec4b6', '#ffbe0b', '#8338ec', '#fb5607', '#06d6a0'];
const TSKINS = ['#ffd2a8', '#e9b18a', '#c68a5e', '#8d5a3b', '#f3c9a0'];
// toon(ctx, x, y(feet), h, {pose, t, col, skin, face, dir, rot, zap, ash, look, seed})
//  pose: stand | run | fly | cower | film | panic;  zap 0..1 = skeleton flash;  ash 0..1 = crumble to ash pile
function toon(ctx, x, y, h, o = {}) {
  const { pose = 'stand', t = 0, seed = 1, face = 'shock', dir = 1, rot = 0, zap = 0, ash = 0, look = 0 } = o;
  const col = o.col || SHIRTS[seed % SHIRTS.length], skin = o.skin || TSKINS[seed % TSKINS.length], hairC = ['#2a1a10', '#5a3a1a', '#111', '#c9a04a'][seed % 4];
  const u = h, lw = Math.max(2.5, u * 0.022);
  if (ash > 0.25) {     // ash pile + drifting flakes
    const k = R2((ash - 0.25) / 0.75);
    ctx.save(); ctx.fillStyle = '#5d5a60'; ctx.beginPath(); ctx.ellipse(x, y, u * 0.22 * (0.4 + 0.6 * k), u * 0.07 * (0.4 + 0.6 * k), 0, Math.PI, 0); ctx.fill();
    ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
    const r = rng(seed * 7 + 3); for (let i = 0; i < 14; i++) { const a = r(), yy = y - u * (0.1 + r() * 0.9) * (1 - k * 0.5) - k * u * 0.4 * r();
      ctx.fillStyle = `rgba(80,76,84,${0.8 * (1 - k)})`; ctx.fillRect(x + (a - 0.5) * u * 0.5 + k * u * 0.3 * r(), yy, u * 0.025, u * 0.025); }
    ctx.restore();
    if (ash >= 0.6) return;
  }
  const zapOn = zap > 0 && zap < 1 && Math.floor(zap * 14) % 2 === 0;
  const grey = ash > 0, gcol = c => (grey ? '#5d5a60' : zapOn ? '#dff8ff' : c);
  ctx.save(); ctx.translate(x, y);
  if (grey) { ctx.scale(1 + ash * 0.4, 1 - ash * 1.3); ctx.globalAlpha = 1 - ash * 0.6; }
  if (rot) { ctx.translate(0, -u * 0.5); ctx.rotate(rot); ctx.translate(0, u * 0.5); }
  if (pose === 'cower') { ctx.scale(1, 0.72); }
  ctx.scale(dir, 1);
  if (zapOn) glow(ctx, 0, -u * 0.5, u * 0.7, '200,240,255', 0.9);
  const ph = t * 13 + seed * 1.7, sw = Math.sin(ph);
  let legs, arms;
  if (pose === 'run') { legs = [sw * 0.8, -sw * 0.8]; arms = [-sw * 1.0, sw * 1.0]; }
  else if (pose === 'fly') { legs = [0.8 + Math.sin(ph * 0.7) * 0.3, -0.7 - Math.cos(ph * 0.6) * 0.3]; arms = [2.6 + Math.sin(ph) * 0.3, -2.5 + Math.cos(ph) * 0.3]; }
  else if (pose === 'panic') { legs = [0.18 + sw * 0.15, -0.18 - sw * 0.15]; arms = [2.7 + Math.sin(ph * 1.3) * 0.35, -2.7 + Math.cos(ph * 1.2) * 0.35]; }
  else if (pose === 'cower') { legs = [0.5, -0.5]; arms = [2.4, -2.4]; }
  else if (pose === 'film') { legs = [0.12, -0.12]; arms = [2.75, -0.25]; }
  else { legs = [0.12, -0.12]; arms = [0.25, -0.25]; }
  const hipY = -u * 0.34, shY = -u * 0.6;
  const limb = (x0, y0, ang, len, w, c) => {     // ang: 0 = straight down, + = toward front
    const x1 = x0 + Math.sin(ang) * len, y1 = y0 + Math.cos(ang) * len;
    ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = gcol(c); ctx.lineWidth = w; ctx.stroke();
    if (zapOn) { ctx.strokeStyle = INK; ctx.lineWidth = w * 0.28; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x1, y1, w * 0.3, 0, 6.283); ctx.fill(); }
    return [x1, y1];
  };
  const pants = '#2b2f45';
  limb(-u * 0.04, hipY, legs[1], u * 0.34, u * 0.085, pants);
  limb(-u * 0.05, shY, arms[1], u * 0.27, u * 0.07, col);
  ctx.fillStyle = gcol(col); roundRect(ctx, -u * 0.12, shY - u * 0.04, u * 0.24, u * 0.32, u * 0.08); ctx.fill();
  ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
  if (zapOn) { ctx.lineWidth = u * 0.02; ctx.beginPath(); ctx.moveTo(0, shY - u * 0.02); ctx.lineTo(0, hipY);
    for (let i = 0; i < 3; i++) { const yy = shY + u * (0.04 + i * 0.065); ctx.moveTo(-u * 0.08, yy); ctx.quadraticCurveTo(0, yy - u * 0.03, u * 0.08, yy); } ctx.stroke(); }
  limb(u * 0.04, hipY, legs[0], u * 0.34, u * 0.085, pants);
  const hand = limb(u * 0.05, shY, arms[0], u * 0.27, u * 0.07, col);
  if (pose === 'film' && !grey && !zapOn) { ctx.fillStyle = '#222'; roundRect(ctx, hand[0] - u * 0.03, hand[1] - u * 0.09, u * 0.06, u * 0.1, u * 0.01); ctx.fill();
    glow(ctx, hand[0], hand[1] - u * 0.04, u * 0.12, '190,232,255', 0.6); }
  const hx = u * 0.01, hy = -u * 0.8, hr = u * 0.14;
  ctx.fillStyle = gcol(skin); ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 6.283); ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
  if (zapOn) {   // skull
    ctx.fillStyle = INK; for (const ex of [-0.045, 0.06]) { ctx.beginPath(); ctx.ellipse(hx + u * ex, hy - u * 0.01, u * 0.035, u * 0.04, 0, 0, 6.283); ctx.fill(); }
    ctx.lineWidth = u * 0.012; ctx.beginPath(); for (let i = -2; i <= 2; i++) { ctx.moveTo(hx + i * u * 0.02, hy + u * 0.06); ctx.lineTo(hx + i * u * 0.02, hy + u * 0.1); } ctx.stroke();
    ctx.restore(); return;
  }
  if (!grey) {
    ctx.fillStyle = hairC; ctx.beginPath(); ctx.arc(hx, hy, hr, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(hx + hr * 0.6, hy - hr * 0.45); ctx.quadraticCurveTo(hx, hy - hr * 0.2, hx - hr * 0.9, hy - hr * 0.2); ctx.fill();
    const scream = face === 'scream';
    for (const ex of [-0.04, 0.065]) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hx + u * ex, hy, u * (scream ? 0.038 : 0.033), 0, 6.283); ctx.fill(); ctx.lineWidth = lw * 0.6; ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(hx + u * ex + u * 0.008, hy - look * u * 0.018, u * (scream ? 0.011 : 0.015), 0, 6.283); ctx.fill();
    }
    if (scream) { ctx.fillStyle = '#3a0d12'; ctx.beginPath(); ctx.ellipse(hx + u * 0.015, hy + u * 0.075, u * 0.035, u * 0.05 + Math.sin(ph * 2) * u * 0.006, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#ff6b7a'; ctx.beginPath(); ctx.ellipse(hx + u * 0.015, hy + u * 0.105, u * 0.022, u * 0.014, 0, 0, 6.283); ctx.fill(); }
    else if (face === 'shock') { ctx.fillStyle = '#3a0d12'; ctx.beginPath(); ctx.ellipse(hx + u * 0.015, hy + u * 0.07, u * 0.018, u * 0.024, 0, 0, 6.283); ctx.fill(); }
    else { ctx.lineWidth = lw * 0.8; ctx.beginPath(); ctx.arc(hx + u * 0.015, hy + u * 0.04, u * 0.03, 0.3, Math.PI - 0.3); ctx.stroke(); }
    if (scream || face === 'shock') { ctx.fillStyle = 'rgba(140,220,255,0.9)'; ctx.beginPath(); ctx.ellipse(hx - hr * 0.95, hy - hr * 0.2, u * 0.012, u * 0.02, 0, 0, 6.283); ctx.fill(); }  // sweat drop
  }
  ctx.restore();
}
// Fate of a person struck at local time `hit`: skeleton flash, then ash.
const fate = (u, hit) => ({ zap: u >= hit ? R2((u - hit) / 0.5) : 0, ash: u >= hit + 0.5 ? R2((u - hit - 0.5) / 0.9) : 0 });

// ---------------------------------------------------------------- shared props
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
function bigNum(ctx, t, text, y, at, o = {}) {
  const { size = 140, color = C.yellow, out = 1e9 } = o;
  if (t < at || t > out + 0.3) return;
  const p = prog(t, at, at + 0.35), s2 = p < 1 ? easeBack(p) : 1, e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e; ctx.translate(W / 2, y); ctx.scale(s2 * (1 + 0.08 * Math.exp(-(t - at - 0.35) * 8)), s2);
  ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = color; ctx.fillText(text, 0, 0);
  ctx.restore();
}
function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
function car(ctx, x, y, s, rot, col = '#4fa3ff') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = col; roundRect(ctx, -80, -60, 160, 46, 16); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  roundRect(ctx, -46, -92, 92, 38, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#bfe8ff'; roundRect(ctx, -36, -84, 32, 24, 6); ctx.fill(); roundRect(ctx, 4, -84, 32, 24, 6); ctx.fill();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-46, -12, 18, 0, 6.283); ctx.arc(46, -12, 18, 0, 6.283); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.08, W / 2, 1200);
  earth(ctx, W / 2 - 100, 1300, 320, u * 0.4);
  const k = easeInOut(prog(u, 0.1, 3.4));
  rogue(ctx, lerp(W + 120, W / 2 + 250, k), lerp(200, 820, k), lerp(30, 170, k), k);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.5 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if a planet', 'the size of Mars', 'hit Earth?'], 300, 0.15, { size: 88, out: OUT('hook'), mark: { line: 1, from: 12, to: 16, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 2. the last night (close-up crowd filming)
function vCrowd(ctx, u) {
  const p = prog(u, 0, 4);
  ctx.fillStyle = grad(ctx, ['#2a0f2a', '#8a2f2a', '#f08a4a']); ctx.fillRect(0, 0, W, H);
  drift(ctx, u, 0, 4, 1.0, 1.05, W / 2, 900);
  const r = lerp(300, 520, p); glow(ctx, W / 2, 760, r * 1.8, '255,150,90', 0.7); rogue(ctx, W / 2, 760, r, 1);
  for (const [x, w, h] of [[-20, 300, 420], [300, 260, 320], [560, 280, 480], [840, 260, 360]]) { ctx.fillStyle = '#1a1022'; ctx.fillRect(x, 1500 - h, w, h + 600); }
  ctx.fillStyle = '#24162c'; ctx.fillRect(0, 1480, W, H);
  const shocked = u > 1.4;
  toon(ctx, 190, 2080, 900, { pose: 'film', t: u, seed: 1, face: shocked ? 'scream' : 'shock', look: 1 });
  toon(ctx, 560, 2140, 1000, { pose: shocked ? 'panic' : 'stand', t: u, seed: 4, face: shocked ? 'scream' : 'shock', look: 1 });
  toon(ctx, 910, 2080, 900, { pose: 'film', t: u, seed: 2, face: 'shock', look: 1, dir: -1 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['After weeks of warnings,', 'the last night:'], 230, 0.15, { size: 72, out: OUT('crowd') });
  say(ctx, u, ['it fills the sky.'], 440, 0.9, { size: 96, out: OUT('crowd'), color: C.yellow });
}

// ---------------------------------------------------------------- 3. gravity drags the ocean up; beach-goers flee
function vTide(ctx, u) {
  const p = easeInOut(prog(u, 0.1, 3.4));
  ctx.fillStyle = grad(ctx, ['#3a1a3a', '#c0503a', '#ffb070']); ctx.fillRect(0, 0, W, H);
  drift(ctx, u, 0, 4, 1.0, 1.05, W / 2, 1300);
  rogue(ctx, W / 2 + 160, 180, 400, 1);
  const base = 1350, peak = lerp(base - 60, 700, p), hump = x => { const d = (x - W / 2 - 60) / 380; return base - (base - peak) * Math.exp(-d * d) + Math.sin(x * 0.03 + u * 4) * 10; };
  ctx.fillStyle = grad(ctx, ['#5fd0ff', '#1f7fd6', '#0d4a92'], 0, peak, 0, base + 200);
  ctx.beginPath(); ctx.moveTo(-40, base + 400); for (let x = -40; x <= W + 40; x += 20) ctx.lineTo(x, hump(x)); ctx.lineTo(W + 40, base + 400); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  [[330, 2], [760, 5]].forEach(([x0, s], i) => { const x = lerp(x0, W / 2 + 60, p * 0.6), y = hump(x);
    toon(ctx, x, y + 10, 150, { pose: 'fly', t: u, seed: s, face: 'scream', rot: (i ? -1 : 1) * (0.4 + u * 1.2) }); });
  ctx.fillStyle = '#7d6a4a'; ctx.fillRect(-40, base + 60, W + 80, 140);
  ctx.fillStyle = '#e6c98a'; ctx.beginPath(); ctx.moveTo(-40, 1560); ctx.quadraticCurveTo(W / 2, 1520, W + 40, 1560); ctx.lineTo(W + 40, H); ctx.lineTo(-40, H); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = 0; i < 4; i++) { const fx = 120 + i * 260, fy = base + 120 - Math.abs(Math.sin(u * 9 + i)) * 30;
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(u * 9 + i) * 0.6); ctx.fillStyle = '#ff9f43'; ctx.beginPath(); ctx.ellipse(0, 0, 30, 14, 0, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(-46, -14); ctx.lineTo(-46, 14); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  [[60, 1, 1.0], [300, 3, 0.9], [-200, 6, 1.1], [520, 0, 0.8]].forEach(([x0, s, sp], i) =>
    toon(ctx, x0 + u * 260 * sp, 1700 + (i % 2) * 90, 300, { pose: 'run', t: u, seed: s, face: 'scream' }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['In the final hour,', 'its gravity drags', 'the ocean upward'], 230, 0.15, { size: 76, out: OUT('tide') });
}

// ---------------------------------------------------------------- 4. impact: crown-splash of molten rock
function vCrown(ctx, u) {
  const hit = 0.45;
  const [sx, sy] = shakeOffset(u, hit, 2.5, 40); ctx.translate(sx, sy);
  const k = prog(u, hit, 4.4);
  ctx.fillStyle = grad(ctx, ['#1a0a1a', mixHex('#3a1020', '#ff7a2a', k), mixHex('#6a2a2a', '#ffd08a', k)]); ctx.fillRect(0, 0, W, H);
  if (u < hit) rogue(ctx, W / 2, lerp(-300, 1180, easeIn2(prog(u, 0, hit))), 700, 1);
  ctx.fillStyle = '#2f6fd0'; ctx.beginPath(); ctx.ellipse(W / 2, 2500, 1800, 1150, 0, 0, 6.283); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  if (u >= hit) {
    const r = rng(14);
    for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, len = (420 + r() * 600) * easeOut(k);
      const bx = W / 2 + Math.cos(a) * 140, by = 1360, tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len + 300 * k * k * r();
      ctx.strokeStyle = '#ff8a2a'; ctx.lineWidth = 46 * (1 - k * 0.5); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo((bx + tx) / 2, (by + ty) / 2 - 80, tx, ty); ctx.stroke();
      ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(tx, ty, 30 + r() * 26, 0, 6.283); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(W / 2, 1360, 360 + 300 * k, 140, 0, 0, 6.283); ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    glow(ctx, W / 2, 1300, 900, '255,220,150', 0.8 * (1 - k * 0.6));
  }
  flash(ctx, u, hit, 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'IMPACT', 400, 0.5, { size: 170, out: 2.2 });
  say(ctx, u, ['at 40,000 km/h'], 560, 0.85, { size: 76, weight: 900, out: 2.2, x: W / 2, align: 'center' });
  bigNum(ctx, u, '100,000,000×', 400, 2.35, { size: 120, out: OUT('crown') });
  say(ctx, u, ['the energy of the', 'dinosaur asteroid'], 540, 2.55, { size: 66, weight: 900, out: OUT('crown'), x: W / 2, align: 'center' });
}

// ---------------------------------------------------------------- 5. the blast wave hits a street
function vShock(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0.9, 2.4, 22); ctx.translate(sx, sy);
  ctx.fillStyle = grad(ctx, ['#5a1f2a', '#e0703a', '#ffc07a']); ctx.fillRect(0, 0, W, H);
  const front = lerp(-500, W + 700, easeIn2(prog(u, 0.6, 3.0)));
  const tPass = x => { const q = (x + 500) / (W + 1200); return 0.6 + Math.sqrt(R2(q)) * 2.4; };
  const g = rng(7);
  for (let i = 0; i < 8; i++) { const x = -20 + i * 140, h = 380 + g() * 420;
    block3d(ctx, u, x, 1420, 120, h, { col: ['#3d5a80', '#5a4a7a', '#4a6a6a'][i % 3], depth: 40, seed: 30 + i, crumble: easeInOut(R2((u - tPass(x)) / 1.0)), lit: 'rgba(255,220,150,0.9)' }); }
  ctx.fillStyle = '#3a3340'; ctx.fillRect(-60, 1420, W + 120, H); ctx.fillStyle = '#e8d070'; for (let x = 0; x < W; x += 160) ctx.fillRect(x, 1640, 90, 14);
  ctx.fillStyle = 'rgba(230,190,150,0.72)'; ctx.fillRect(-60, 0, front + 60 - 120, H);
  for (let i = 0; i < 14; i++) { const yy = i * 150, rr = 150 + Math.sin(i * 3 + u * 6) * 40; ctx.beginPath(); ctx.arc(front - 120, yy, rr, 0, 6.283); ctx.fill(); }
  const flung = (x0, draw, sp = 1) => { const tl = tPass(x0), dt = Math.max(0, u - tl);
    draw(x0 + dt * 1300 * sp, -dt * 1400 * sp + 900 * dt * dt, dt * 7 * sp, dt > 0); };
  [[140, '#ff5d8f', 0.9], [620, '#ffbe0b', 1.1]].forEach(([x, c, s]) => flung(x, (X, dy, rot) => car(ctx, X, 1600 + dy, 1.0, rot, c), s));
  [[60, 1], [330, 2], [460, 5], [790, 3], [900, 6]].forEach(([x, s]) =>
    flung(x, (X, dy, rot, gone) => toon(ctx, X, 1780 + dy, 280, { pose: gone ? 'fly' : 'stand', t: u, seed: s, face: gone ? 'scream' : 'shock', rot: gone ? rot : 0 }), 1 + (s % 3) * 0.15));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['A blast wave races', 'around the planet'], 230, 0.15, { size: 84, out: OUT('shock') });
}

// ---------------------------------------------------------------- 6. molten rock rains on a city; people up close
function vRain(ctx, u) {
  ctx.fillStyle = grad(ctx, ['#1a0812', '#6a1a1a', '#d0582a']); ctx.fillRect(0, 0, W, H);
  const [sx, sy] = shakeOffset(u, 1.6, 2.6, 16); ctx.translate(sx, sy);
  for (let i = 0; i < 12; i++) fireball(ctx, u, 120 + i * 85 + 300, -200, 60 + i * 85, 1100 + (i % 4) * 100, (i % 6) * 0.6, 0.9, 0.8);
  const g = rng(3);
  for (let i = 0; i < 9; i++) { const x = -30 + i * 125, h = 300 + g() * 420, hit = 0.6 + (i % 5) * 0.6;
    block3d(ctx, u, x, 1480, 100, h, { col: '#3a2a4a', depth: 40, seed: 50 + i, crumble: easeInOut(R2((u - hit) / 1.3)) * (i % 2), lit: 'rgba(255,180,110,0.9)' });
    if (u > hit && i % 2) glow(ctx, x + 50, 1480 - h * 0.6, 160, '255,140,50', 0.8 * Math.exp(-(u - hit))); }
  ctx.fillStyle = '#20141c'; ctx.fillRect(-60, 1480, W + 120, H);
  const people = [[760, 260, 1.6, 1], [960, 220, 2.6, 4], [1180, 300, 99, 2], [400, 200, 99, 6]];
  for (const [x0, sp, hit, s] of people) {
    const x = x0 - sp * Math.min(u, hit), f = fate(u, hit);
    if (hit < 99) fireball(ctx, u, x0 - sp * hit + 260, -150, x0 - sp * hit, 1700, hit - 0.7, 0.7, 1.2);
    toon(ctx, x, 1800, 340, { pose: 'run', t: u, seed: s, face: 'scream', dir: -1, ...f });
    if (u > hit && u < hit + 1) glow(ctx, x, 1700, 300, '255,150,60', 0.9 * (1 - (u - hit)));
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Molten rock rains', 'down everywhere'], 230, 0.15, { size: 84, out: OUT('rain') });
}

// ---------------------------------------------------------------- 7. the oceans boil; a ship goes down
function boat(ctx, u, x, y, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#f4f1e8'; roundRect(ctx, -150, -190, 200, 90, 12); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#bfe8ff'; for (let i = 0; i < 4; i++) { roundRect(ctx, -136 + i * 46, -172, 30, 26, 6); ctx.fill(); }
  ctx.fillStyle = '#e63946'; ctx.fillRect(-20, -250, 46, 62); ctx.strokeRect(-20, -250, 46, 62);
  [[-230, 3], [-90, 0], [110, 5], [230, 2]].forEach(([dx, s]) => toon(ctx, dx, -100, 150, { pose: 'panic', t: u, seed: s, face: 'scream' }));
  ctx.fillStyle = '#263a6a'; ctx.beginPath(); ctx.moveTo(-300, -100); ctx.lineTo(320, -100); ctx.lineTo(250, 0); ctx.lineTo(-250, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e63946'; ctx.fillRect(-268, -48, 560, 14);
  ctx.restore();
}
function vBoil(ctx, u) {
  ctx.fillStyle = grad(ctx, ['#5a2a2a', '#c86a3a', '#ffc090']); ctx.fillRect(0, 0, W, H);
  drift(ctx, u, 0, 4, 1.0, 1.05, W / 2, 1300);
  const sea = 1200;
  for (let i = 0; i < 9; i++) { const x = 60 + i * 120, h = 600 + Math.sin(u * 2 + i) * 80;
    for (let k = 0; k < 6; k++) { const yy = sea - k * h / 6 - (u * 120 % (h / 6)); ctx.fillStyle = `rgba(250,245,240,${0.45 - k * 0.06})`; ctx.beginPath(); ctx.arc(x + Math.sin(u + k + i) * 30, yy, 50 + k * 12, 0, 6.283); ctx.fill(); } }
  const sink = easeIn2(R2((u - 0.8) / 3.0));
  boat(ctx, u, 560, sea + 40 + sink * 420, 0.05 + 0.3 * sink);
  ctx.fillStyle = grad(ctx, ['#3a8ad0', '#1d4f8a'], 0, sea, 0, H);
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, sea + 20); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, sea + 20 + Math.sin(x * 0.04 + u * 9) * 12); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  const r = rng(6);
  for (let i = 0; i < 80; i++) { const life = (u * (0.6 + r() * 0.8) + r()) % 1, x = r() * W, y = sea + 40 + r() * 700 - life * 120, rr = (10 + r() * 34) * (0.4 + life);
    ctx.fillStyle = 'rgba(220,240,255,0.85)'; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(27,22,64,0.5)'; ctx.stroke(); }
  const fy = sea + 300 - easeOut(prog(u, 1.5, 3)) * 230; ctx.save(); ctx.translate(250, fy); ctx.rotate(Math.PI);   // cooked fish, belly up
  ctx.fillStyle = '#ff8a6a'; ctx.beginPath(); ctx.ellipse(0, 0, 50, 24, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(-76, -22); ctx.lineTo(-76, 22); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(22, -12); ctx.lineTo(34, 0); ctx.moveTo(34, -12); ctx.lineTo(22, 0); ctx.stroke(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The oceans boil', 'like a pot of soup'], 230, 0.15, { size: 88, out: OUT('boil') });
  say(ctx, u, ['That takes under 0.01%', 'of the impact’s energy'], 1660, 1.2, { size: 60, weight: 900, out: OUT('boil'), mark: { line: 0, from: 11, to: 22, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 8. landmarks melt, tourists vaporize
function drip(ctx, x, y, w, k, col) { const r = rng(Math.floor(x));
  for (let i = 0; i < 5; i++) { const dx = x + (r() - 0.5) * w, len = k * (40 + r() * 140); ctx.fillStyle = col; roundRect(ctx, dx - 8, y, 16, len, 8); ctx.fill(); } }
function vMelt(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.7));
  ctx.fillStyle = grad(ctx, ['#4a1010', '#d0401a', '#ffb050']); ctx.fillRect(0, 0, W, H);
  drift(ctx, u, 0, 4, 1.0, 1.04, W / 2, 1300);
  const ground = 1450;
  ctx.save(); ctx.translate(230, ground); ctx.scale(1 + k * 0.25, 1 - k * 0.55); ctx.rotate(-0.15 * k);
  ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.moveTo(-140, 0); ctx.quadraticCurveTo(-30, -300, -12, -760); ctx.lineTo(12, -760); ctx.quadraticCurveTo(30, -300, 140, 0); ctx.lineTo(80, 0); ctx.quadraticCurveTo(0, -120, -80, 0); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(560, ground); ctx.scale(1 + k * 0.4, 1 - k * 0.6);
  ctx.fillStyle = '#d9b26a'; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(0, -330); ctx.lineTo(200, 0); ctx.closePath(); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#b8914f'; ctx.beginPath(); ctx.moveTo(0, -330); ctx.lineTo(200, 0); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(880, ground); ctx.rotate(0.2 * k); ctx.scale(1 + k * 0.2, 1 - k * 0.5);
  ctx.fillStyle = '#c9a77a'; ctx.fillRect(-55, -620, 110, 620); ctx.beginPath(); ctx.moveTo(-60, -620); ctx.lineTo(0, -760); ctx.lineTo(60, -620); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.strokeRect(-55, -620, 110, 620);
  ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(0, -520, 40, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.restore();
  drip(ctx, 230, ground - 760 * (1 - k * 0.55) + 200, 160, k, '#5a4a3a'); drip(ctx, 880, ground - 300, 110, k, '#c9a77a');
  ctx.fillStyle = '#ff7a24'; ctx.fillRect(-40, ground - k * 40, W + 80, H); glow(ctx, W / 2, ground, 700, '255,140,40', 0.5 * k);
  ctx.fillStyle = '#7a3a24'; ctx.fillRect(-40, 1560, W + 80, H);
  [[180, 1, 'film', 1.6], [470, 3, 'panic', 1.9], [760, 5, 'run', 2.2], [960, 2, 'film', 2.5]].forEach(([x, s, pose, hit]) => {
    const f = fate(u, hit), ps = u < 1.0 ? (pose === 'run' ? 'stand' : pose) : (pose === 'film' ? 'panic' : pose);
    toon(ctx, x, 1860, 330, { pose: ps, t: u, seed: s, face: u < 1.0 ? 'calm' : 'scream', dir: x > 600 ? -1 : 1, ...f }); });
  flash(ctx, u, 1.6, 0.25);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The air fills with', 'vaporized rock…'], 230, 0.15, { size: 84, out: 1.9 });
  say(ctx, u, ['…thousands of degrees.', 'Landmarks melt like wax'], 230, 2.0, { size: 76, out: OUT('melt') });
}

// ---------------------------------------------------------------- 9. bunkers fail
function vBunker(ctx, u) {
  const k = easeInOut(prog(u, 0.2, 3.7)), brk = 2.2;
  const [sx, sy] = shakeOffset(u, 0.2, 3.6, 10); ctx.translate(sx, sy);
  ctx.fillStyle = grad(ctx, ['#6b4a34', '#3e2a1e', '#22140e']); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ff6a1a'; ctx.fillRect(0, 0, W, 520 + k * 200); glow(ctx, W / 2, 520 + k * 200, 600, '255,120,40', 0.6);
  ctx.fillStyle = '#ff5a10'; ctx.fillRect(0, H - k * 260, W, k * 260);
  const bx = W / 2, by = 1150, bw = 900, bh = 560;
  ctx.fillStyle = '#9aa3b8'; roundRect(ctx, bx - bw / 2 - 40, by - bh / 2 - 40, bw + 80, bh + 80, 50); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  const heat = R2((u - 0.6) / 1.6);
  ctx.fillStyle = mixHex('#ffe6a8', '#ff8a4a', heat); roundRect(ctx, bx - bw / 2, by - bh / 2, bw, bh, 30); ctx.fill();
  ctx.fillStyle = `rgba(255,60,20,${0.6 * heat})`; ctx.fillRect(bx - bw / 2 + 20, by - bh / 2, bw - 40, 30 + heat * 40);
  ctx.fillStyle = '#7a8296'; ctx.fillRect(bx - 420, by - 120, 130, 390); ctx.fillRect(bx + 300, by - 60, 120, 330);
  [[-200, 1], [-50, 4], [100, 2], [230, 6]].forEach(([dx, s], i) => toon(ctx, bx + dx, by + bh / 2 - 10, 300, { pose: 'cower', t: u, seed: s, face: 'scream', look: 1, ...fate(u, brk + 0.2 + i * 0.08) }));
  if (u > brk) { const q = easeOut(R2((u - brk) / 0.8));
    ctx.save(); roundRect(ctx, bx - bw / 2, by - bh / 2, bw, bh, 30); ctx.clip(); ctx.fillStyle = '#ff7a1a';
    ctx.beginPath(); ctx.moveTo(bx - 140, by - bh / 2); for (let i = 0; i <= 10; i++) ctx.lineTo(bx - 140 - i * 50 * q + Math.sin(i + u * 8) * 20, by - bh / 2 + q * bh * (0.4 + 0.6 * Math.sin(i * 0.6)));
    ctx.lineTo(bx + 500 * q, by + bh / 2); ctx.lineTo(bx + 140, by - bh / 2); ctx.closePath(); ctx.fill(); ctx.restore(); glow(ctx, bx, by, 600, '255,150,60', 0.8 * q); }
  ctx.font = `900 46px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.lineJoin = 'round';
  ctx.strokeText('1 km underground', 70, 800); ctx.fillText('1 km underground', 70, 800);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Deep bunkers?'], 230, 0.15, { size: 96, out: OUT('bunker') });
  say(ctx, u, ['The crust melts hundreds', 'of kilometers down'], 1600, 0.9, { size: 64, weight: 900, out: OUT('bunker'), mark: { line: 0, from: 10, to: 24, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 10. the toll: a crowd turning to ash
function vToll(ctx, u) {
  ctx.fillStyle = grad(ctx, ['#14080e', '#3a0e12']); ctx.fillRect(0, 0, W, H);
  const cols = 9, rows = 6;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = 90 + c * 112 + (r % 2) * 40, y = 1230 + r * 105, hit = 0.6 + c * 0.16 + r * 0.06;
    toon(ctx, x, y, 110, { pose: 'stand', t: u, seed: r * cols + c, face: 'shock', look: 1, ...fate(u, hit) });
  }
  const n = Math.round(8200000000 * easeOut(prog(u, 0.6, 2.6)));
  bigNum(ctx, u, n.toLocaleString('en-US'), 800, 0.4, { size: 118, color: '#ff6b5b' });
  say(ctx, u, ['Within a day (est.):'], 560, 0.15, { size: 76, x: W / 2, align: 'center', out: OUT('toll') });
  say(ctx, u, ['Everyone.'], 1030, 2.5, { size: 120, x: W / 2, align: 'center', out: OUT('toll') });
}

// ---------------------------------------------------------------- 11. magma world
function vMagma(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1150);
  magmaWorld(ctx, u, W / 2, 1150, 440, 0);
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = `rgba(255,170,90,${0.25 - k * 0.06})`; ctx.lineWidth = 30 - k * 8; ctx.beginPath(); ctx.arc(W / 2, 1150, 480 + k * 30 + Math.sin(u * 2 + k) * 6, 0, 6.283); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Earth becomes', 'a ball of magma'], 230, 0.15, { size: 92, out: OUT('magma') });
}

// ---------------------------------------------------------------- 12. ring -> new moon
function vMoon(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 4.5, 1.0, 1.05, W / 2, 1150);
  const cx = W / 2, cy = 1150, R = 300, form = prog(u, 0.1, 1.4), clump = easeInOut(prog(u, 1.6, 3.4));
  const r = rng(9), target = 0.6 + u * 0.5;
  const debris = back => { for (let i = 0; i < 1400; i++) { const a0 = r() * 6.283, a = a0 + u * 0.5 * (0.8 + r() * 0.4), rr = 420 + r() * 260;
    if ((Math.sin(a) < 0) !== back) continue;
    const ang = lerp(a, target + (a0 - Math.PI) * 0.05, clump), rad = lerp(rr, 560, clump);
    ctx.fillStyle = `rgba(255,${150 + r() * 80},${80 + r() * 60},${(0.5 + r() * 0.5) * form})`; ctx.fillRect(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 0.28, 3 + r() * 3, 3 + r() * 3); } };
  debris(true); magmaWorld(ctx, u, cx, cy, R, 0.5); debris(false);
  if (clump > 0.6) { const mx = cx + Math.cos(target) * 560, my = cy + Math.sin(target) * 560 * 0.28; ctx.save(); ctx.globalAlpha = (clump - 0.6) / 0.4; moonToon(ctx, mx, my, 50, { sun: SUN, crack: 1.2 }); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The debris spins', 'into a ring…'], 230, 0.15, { size: 84, out: 1.9 });
  say(ctx, u, ['…then clumps into', 'a new moon'], 230, 2.0, { size: 88, out: OUT('moon'), mark: { line: 1, from: 0, to: 10, color: '#3a86ff' } });
}

// ---------------------------------------------------------------- 13. millions of years: rain, oceans return
function vCool(ctx, u) {
  space(ctx, u);
  const k = easeInOut(prog(u, 0.2, 3.6)), cx = W / 2, cy = 1150, R = 420;
  ctx.save(); ctx.globalAlpha = 1 - k; magmaWorld(ctx, u, cx, cy, R, 0.8); ctx.restore();
  ctx.save(); ctx.globalAlpha = k; earth(ctx, cx, cy, R, u * 0.2); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 6.283); ctx.clip();
  ctx.strokeStyle = `rgba(200,225,255,${0.7 * Math.sin(Math.PI * k)})`; ctx.lineWidth = 3;
  const r = rng(4); for (let i = 0; i < 120; i++) { const x = cx + (r() - 0.5) * R * 2.4, y = (cy - R * 1.2 + ((u * 900 + r() * 1000) % (R * 2.4))); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 40); ctx.stroke(); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Over millions of years,', 'it cools… and rains…'], 230, 0.15, { size: 76, out: 1.9 });
  say(ctx, u, ['…and the oceans', 'come back.'], 230, 2.0, { size: 88, out: OUT('cool') });
}

// ---------------------------------------------------------------- 14. the twist
function vTwist(ctx, u) {
  space(ctx, u);
  if (u < 2.6) {
    magmaWorld(ctx, u, W / 2 - 80, 1200, 300, 0.4);
    const k = easeInOut(prog(u, 0.1, 2.6)), tx = lerp(W + 100, W / 2 + 180, k), ty = lerp(600, 1040, k);
    rogue(ctx, tx, ty, 150, 1);
    ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = INK;
    ctx.strokeText('Theia', tx, ty - 190); ctx.fillStyle = '#ffb0a0'; ctx.fillText('Theia', tx, ty - 190);
  } else {
    earth(ctx, W / 2 - 60, 1250, 330, u * 0.3);
    moonToon(ctx, W / 2 + 300, 760, 110, { sun: SUN });
  }
  flash(ctx, u, 2.6, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Plot twist:', 'this already happened.'], 230, 0.15, { size: 84, out: 2.5, mark: { line: 1, from: 5, to: 20, color: '#ff6b5b' } });
  say(ctx, u, ['4.5 billion years ago, Theia', 'hit the young Earth'], 1640, 0.8, { size: 56, weight: 900, out: 2.5 });
  say(ctx, u, ['The wreckage became', 'our Moon.'], 230, 2.75, { size: 96, out: OUT('twist'), mark: { line: 1, from: 0, to: 8, color: '#3a86ff' } });
}

function vEnd(ctx, u) {
  space(ctx, u);
  earth(ctx, W / 2, 1400, 260, u * 0.3); moonToon(ctx, W / 2 + 300, 1080, 70, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}
