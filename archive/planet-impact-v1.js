// What if a planet the size of Mars hit Earth?
//
// ARC: a new "star" that keeps growing -> it fills the sky -> IMPACT (3D, simulated ejecta)
//      -> energy scale -> a wall of molten rock sweeps the planet (3D city) -> death toll: everyone
//      -> Earth becomes a magma world -> debris ring -> a new moon -> TWIST: it already happened (Theia).
//
// PHYSICS / NUMBERS (checked):
//  - Mars mass 6.42e23 kg. Anything falling onto Earth arrives at >= escape velocity, 11.2 km/s
//    (~40,300 km/h): "over 40,000 km/h". KE = 0.5 * 6.42e23 * 11,200² ≈ 4.0e31 J.
//  - Chicxulub impact ≈ 4e23 J (~100 teratons TNT) -> ratio ≈ 1e8: "100 million times".
//  - Sun's luminosity 3.83e26 W -> 4.0e31 J ≈ 1.05e5 s ≈ 29 hours: "more than a full day of the Sun's output".
//  - Oceans 1.4e21 kg × ~2.6 MJ/kg (heat + vaporise) ≈ 3.6e27 J ≈ 0.009% of the impact energy: "<0.01%".
//  - Approach (assume ~15 km/s closing speed): a day out ≈ 1.3 million km -> ~0.3° (about the Moon's
//    size); an hour out ≈ 54,000 km -> ~7°; minutes out it fills the sky. Weeks out it is a brilliant
//    "star" (Mars-sized body at tens of millions of km is brighter than Mars at opposition).
//  - Outcome per giant-impact studies: global melting, a rock-vapour atmosphere thousands of degrees hot,
//    oceans vaporised, a debris disk around Earth. A 2022 simulation (Kegerreis et al., ApJL) found a
//    moon could form within hours. Theia: the Mars-sized body thought to have hit the young Earth ~4.5
//    billion years ago, forming the Moon (leading hypothesis).
//  - Death toll (est.): billions in the first hour as the ejecta heat pulse and molten curtain spread;
//    everyone (8.2 billion) within about a day. Labelled "est." on screen.
// PLOT HOLES: why weren't we warned? We would be, for weeks, and it wouldn't matter: no technology can
// deflect a planet. Shelters? The crust itself melts ("no shelter is deep enough").
const SHORT = {
  title: 'What if a planet the size of Mars hit Earth?',
  duration: 52.5,
  fps: 60,
  motionSamples: 1,
  sfx: [
    [0.0, 'swell:2.4'], [3.5, 'air'], [3.7, 'swell:4'],
    [8.0, 'air'], [8.2, 'swell:2'], [10.2, 'impact'], [10.25, 'boom'], [10.3, 'quake:5.5'], [12.0, 'roar:4'],
    [16.0, 'air'], [16.2, 'boom'], [17.6, 'boom'],
    [20.0, 'air'], [20.2, 'roar:7.8'], [20.4, 'quake:7.6'], [22.0, 'crumble'], [23.5, 'crumble'], [25.0, 'impact'], [26.0, 'crumble'],
    [28.0, 'air'], [28.3, 'impact'], [30.0, 'boom'],
    [32.5, 'air'], [32.7, 'rumble:5'],
    [37.5, 'air'], [37.7, 'swell:3'], [40.5, 'boom'],
    [43.5, 'air'], [43.8, 'swell:3'], [45.5, 'impact'],
    [49.5, 'air'], [50.0, 'swell:2.5'],
  ],
  music: { bpm: 70, mode: 'cinematic', until: 52.2, duckAt: [] },
};

const SUN = [-0.6, -0.35, 0.72];
const toonGlobe = (ctx, x, y, R, t, extra = {}) => globe(ctx, x, y, R, { toon: true, t, sun: SUN, lights: false, clouds: 0.75, ...extra });

function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, [[0, sHook], [3.5, sSky], [8, sImpact], [16, sEnergy], [20, sFire], [28, sToll], [32.5, sMagma], [37.5, sRing], [43.5, sTwist], [49.5, sEnd]], 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 49.5) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2 });
}

// ---------------------------------------------------------------- helpers
function rogue(ctx, x, y, r, o = {}) {      // the Mars-sized impactor: rusty, cel-shaded, ink outline
  const { sun = SUN, glowK = 0 } = o;
  ctx.save();
  if (glowK > 0) glow(ctx, x, y, r * 2.2, '255,120,60', 0.35 * glowK);
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, '#d9774a'); g.addColorStop(1, '#9c4326');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.clip();
  const rr = rng(21);
  for (let i = 0; i < 12; i++) { const a = rr() * 6.283, d = Math.sqrt(rr()) * r * 0.85, s2 = r * (0.05 + rr() * 0.13);
    ctx.fillStyle = '#7f3420'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s2, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,220,180,0.35)'; ctx.beginPath(); ctx.ellipse(x, y - r * 0.82, r * 0.35, r * 0.1, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(40,20,40,0.5)'; ctx.beginPath(); ctx.arc(x - sun[0] * r * 0.55, y - sun[1] * r * 0.55, r * 1.05, 0, 6.283); ctx.fill();
  ctx.restore();
  ctx.lineWidth = Math.max(4, r * 0.035); ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
  ctx.restore();
}
function magmaWorld(ctx, t, cx, cy, R, crust = 0) {   // glowing molten Earth with drifting dark crust plates
  glow(ctx, cx, cy, R * 1.5, '255,110,40', 0.55);
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
  g.addColorStop(0, '#ffe08a'); g.addColorStop(0.5, '#ff8a2a'); g.addColorStop(1, '#c7360e');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const r = rng(8);
  for (let i = 0; i < 26; i++) { const a = r() * 6.283 + t * 0.05, d = Math.sqrt(r()) * R, s2 = R * (0.08 + r() * 0.16);
    ctx.fillStyle = `rgba(60,24,20,${0.35 + crust * 0.4})`; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, s2, s2 * 0.6, a, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = 'rgba(30,10,30,0.45)'; ctx.beginPath(); ctx.arc(cx + R * 0.55, cy + R * 0.35, R * 1.05, 0, 6.283); ctx.fill();
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
}
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

// ---------------------------------------------------------------- 1. hook
function sHook(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 0, 3.5, 1.0, 1.06, W / 2, 1200);
  toonGlobe(ctx, W / 2 - 110, 1300, 330, t, { lon0: -40 + t * 4, lat0: 18 });
  const k = easeInOut(prog(t, 0.2, 3.4));
  rogue(ctx, lerp(W + 100, W / 2 + 260, k), lerp(240, 820, k), lerp(30, 175, k), { glowK: k });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(t, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, t, 890, 1700, t > 1.5 ? 'shock' : 'happy', 0.8, 0.4), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, t, ['What if a planet', 'the size of Mars', 'hit Earth?'], 300, 0.2, { size: 88, out: 3.3, mark: { line: 1, from: 12, to: 16, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 2. it grows in the sky
function sSky(ctx, t) {
  const p = prog(t, 3.6, 7.8);
  ctx.fillStyle = grad(ctx, [mixHex('#0d1638', '#5a1a20', p), mixHex('#2a3a6e', '#b0402a', p), mixHex('#4b5f93', '#f08a4a', p)]); ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.7 * (1 - p));
  const r = p < 0.4 ? 6 + p * 20 : p < 0.7 ? 18 + (p - 0.4) * 160 : 66 + Math.pow((p - 0.7) / 0.3, 2) * 900;
  const py = lerp(560, 760, p);
  glow(ctx, W / 2, py, r * 3 + 40, '255,150,90', 0.8);
  rogue(ctx, W / 2, py, r, { sun: [0.2, -0.3, 0.93], glowK: 1 });
  const g = rng(4);
  for (let i = 0; i < 9; i++) block3d(ctx, t, -40 + i * 125, 1700, 100, 260 + g() * 380, { col: '#1f2a4a', depth: 40, seed: 90 + i, lit: 'rgba(255,200,140,0.9)' });
  ctx.fillStyle = '#121a30'; ctx.fillRect(0, 1700, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['For weeks: a new star', 'that keeps getting brighter'], 300, 3.6, { size: 72, out: 5.0 });
  say(ctx, t, ['On the last day,', 'it’s as big as the Moon'], 300, 5.1, { size: 80, out: 6.4 });
  say(ctx, t, ['In the last hour,', 'it fills the sky.'], 300, 6.5, { size: 92, out: 7.9, mark: { line: 1, from: 3, to: 16, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 3. impact (3D)
const IMPACT = { contact: 2.2, site: [0.55, 0.45, 0.7], from: [1, 0.6, 0.2], approach: 700, meltSpeed: 0.5, particles: 8000,
  path: [[0, [0, 40, 560], [30, 20, 0]], [2.2, [80, 60, 470], [40, 30, 0]], [8, [-170, 170, 660], [0, 0, 0]]],
  shake: lt => (lt > 2.2 ? 7 * Math.exp(-(lt - 2.2) * 1.4) : 0) };
function sImpact(ctx, t) {
  const lt = t - 8;
  ctx.setTransform(1, 0, 0, 1, 0, 0); space(ctx, t);
  Impact3D.draw(ctx, lt, IMPACT);
  flash(ctx, t, 10.2, 0.35);
  say(ctx, t, ['At over 40,000 km/h…'], 300, 8.2, { size: 80, out: 10.1 });
  say(ctx, t, ['IMPACT.'], 360, 10.25, { size: 150, out: 12.4, color: '#ffd23f' });
  statRow(ctx, t, 1600, 12.6, '100 MILLION×', 'the energy of the asteroid that killed the dinosaurs', { out: 15.8, color: '#ffb0a0' });
}

// ---------------------------------------------------------------- 4. energy scale
function sEnergy(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 16, 20, 1.0, 1.04, W / 2, 1400);
  magmaWorld(ctx, t, W / 2, 1520, 420, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  statRow(ctx, t, 420, 16.2, 'A FULL DAY', 'of the Sun’s entire energy output, released in an instant', { out: 19.8 });
  statRow(ctx, t, 760, 17.6, '<0.01%', 'of that energy is enough to boil away every ocean on Earth', { out: 19.8, color: '#ffb0a0' });
}

// ---------------------------------------------------------------- 5. the firestorm (3D city)
const FIREWALL = { height: 380, z0: 1500, z1: -1800, dur: 8,
  path: [[0, [500, 650, -2100], [0, 160, 900]], [2.6, [1300, 450, -1250], [-100, 170, 200]], [5.2, [1400, 700, -2500], [-300, 150, -700]], [8, [650, 1500, -3400], [0, 20, -1300]]],
  shake: lt => 5 + 4 * Math.exp(-Math.abs(lt - 2.4)) };
function sFire(ctx, t) {
  const lt = t - 20;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = grad(ctx, ['#2a0f12', '#a8331c', '#ff9a4a']); ctx.fillRect(0, 0, W, H);
  FireCity3D.draw(ctx, lt, FIREWALL);
  say(ctx, t, ['A wall of molten rock', 'races around the planet'], 300, 20.2, { size: 80, out: 23.2 });
  say(ctx, t, ['The sky turns to fire.'], 300, 23.4, { size: 88, out: 25.6, mark: { line: 0, from: 4, to: 21, color: '#ff6b5b' } });
  say(ctx, t, ['No shelter is', 'deep enough.'], 300, 25.8, { size: 96, out: 27.8 });
  say(ctx, t, ['Even the ground melts'], 1700, 26.2, { size: 64, weight: 900, out: 27.8 });
}

// ---------------------------------------------------------------- 6. the toll
function sToll(ctx, t) {
  ctx.fillStyle = grad(ctx, ['#1a0c14', '#4a1418', '#8a2a1a']); ctx.fillRect(0, 0, W, H);
  drift(ctx, t, 28, 32.5, 1.0, 1.04, W / 2, 1700);
  magmaWorld(ctx, t, W / 2, 2150, 760, 0.2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['IMPACT + 1 HOUR (est.)'], 300, 28.2, { size: 72, out: 32.3 });
  statRow(ctx, t, 520, 28.4, 'BILLIONS', 'dead: vaporized, burned, buried', { out: 32.3, color: '#ffb0a0' });
  say(ctx, t, ['IMPACT + 1 DAY (est.)'], 860, 30.0, { size: 72, out: 32.3 });
  statRow(ctx, t, 1080, 30.2, '8.2 BILLION', 'Everyone. Every human, every animal, every plant on the surface.', { out: 32.3, color: '#ff6b5b' });
}

// ---------------------------------------------------------------- 7. magma world
function sMagma(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 32.5, 37.5, 1.0, 1.05, W / 2, 1150);
  magmaWorld(ctx, t, W / 2, 1150, 430, prog(t, 33, 37));
  // rock-vapour atmosphere
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = `rgba(255,170,90,${0.25 - k * 0.06})`; ctx.lineWidth = 30 - k * 8; ctx.beginPath(); ctx.arc(W / 2, 1150, 470 + k * 30 + Math.sin(t * 2 + k) * 6, 0, 6.283); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Earth becomes a', 'ball of magma.'], 300, 32.7, { size: 92, out: 37.3 });
  say(ctx, t, ['A sky of vaporized rock,', 'thousands of degrees hot'], 1660, 33.9, { size: 56, weight: 900, out: 35.6 });
  say(ctx, t, ['The oceans? Gone.'], 1700, 35.7, { size: 66, weight: 900, out: 37.3, mark: { line: 0, from: 12, to: 17, color: '#ff6b5b' } });
}

// ---------------------------------------------------------------- 8. debris ring -> new moon
function sRing(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 37.5, 43.5, 1.0, 1.05, W / 2, 1150);
  const cx = W / 2, cy = 1150, R = 300;
  const form = prog(t, 37.6, 40.4), clump = easeInOut(prog(t, 40.4, 42.8));
  const r = rng(9);
  const drawDebris = back => { for (let i = 0; i < 1600; i++) {
    const a0 = r() * 6.283, a = a0 + t * 0.4 * (0.8 + r() * 0.4), rr = 420 + r() * 260;
    if ((Math.sin(a) < 0) !== back) continue;
    const target = 0.6 + t * 0.4;                                   // clumps toward one orbiting point
    const ang = lerp(a, target + (a0 - Math.PI) * 0.05, clump), rad = lerp(rr, 560, clump);
    const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad * 0.28;
    ctx.fillStyle = `rgba(255,${150 + r() * 80},${80 + r() * 60},${(0.5 + r() * 0.5) * form})`; ctx.fillRect(x, y, 3 + r() * 3, 3 + r() * 3); } };
  drawDebris(true);
  magmaWorld(ctx, t, cx, cy, R, 0.6);
  drawDebris(false);
  if (clump > 0.6) { const ang = 0.6 + t * 0.4, mx = cx + Math.cos(ang) * 560, my = cy + Math.sin(ang) * 560 * 0.28;
    ctx.save(); ctx.globalAlpha = (clump - 0.6) / 0.4; glow(ctx, mx, my, 90, '255,170,90', 0.7); moonToon(ctx, mx, my, 46, { sun: SUN, crack: 1.2 }); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['The debris forms a ring…'], 300, 37.7, { size: 84, out: 40.3 });
  say(ctx, t, ['…that clumps into', 'a brand-new moon'], 300, 40.5, { size: 88, out: 43.3, mark: { line: 1, from: 0, to: 16, color: '#3a86ff' } });
  say(ctx, t, ['A 2022 simulation: it could', 'take just a few hours'], 1660, 41.3, { size: 54, weight: 900, out: 43.3 });
}

// ---------------------------------------------------------------- 9. twist
function sTwist(ctx, t) {
  space(ctx, t);
  drift(ctx, t, 43.5, 49.5, 1.0, 1.05, W / 2, 1150);
  const p = prog(t, 45.0, 49.4);
  if (p < 0.5) {
    magmaWorld(ctx, t, W / 2 - 60, 1200, 300, 0.4);
    rogue(ctx, lerp(W + 100, W / 2 + 220, easeInOut(prog(t, 43.6, 45.4))), lerp(600, 980, easeInOut(prog(t, 43.6, 45.4))), 160, { glowK: 1 });
    ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = INK;
    ctx.strokeText('young Earth', W / 2 - 60, 1540); ctx.fillStyle = '#fff'; ctx.fillText('young Earth', W / 2 - 60, 1540);
    ctx.strokeText('Theia', W / 2 + 300, 800); ctx.fillStyle = '#ffb0a0'; ctx.fillText('Theia', W / 2 + 300, 800);
  } else {
    toonGlobe(ctx, W / 2 - 60, 1250, 330, t, { lon0: 30 + t * 4, lat0: 15 });
    moonToon(ctx, W / 2 + 300, 760, 110, { sun: SUN });
  }
  flash(ctx, t, 47.2, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['Here’s the thing:', 'this already happened.'], 300, 43.7, { size: 84, out: 46.8, mark: { line: 1, from: 5, to: 20, color: '#ff6b5b' } });
  say(ctx, t, ['4.5 billion years ago, a planet', 'we call Theia hit the young Earth'], 1640, 44.6, { size: 52, weight: 900, out: 47.0 });
  say(ctx, t, ['Its wreckage', 'became our Moon.'], 300, 47.3, { size: 96, out: 49.3, mark: { line: 1, from: 7, to: 15, color: '#3a86ff' } });
}

function sEnd(ctx, t) {
  space(ctx, t);
  toonGlobe(ctx, W / 2, 1400, 260, t, { lon0: 60 + t * 3, lat0: 15 });
  moonToon(ctx, W / 2 + 300, 1080, 70, { sun: SUN });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['WHAT IF,'], 720, 49.7, { size: 150, x: W / 2, align: 'center' });
  say(ctx, t, ['THOUGH?'], 880, 49.9, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, t, ['Follow for more'], 1000, 50.4, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
