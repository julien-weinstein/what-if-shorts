// What if the Moon was made of cheese?
//
// PHYSICS (worked):
//  - Cheese ~1.1 g/cm³ vs the Moon's mean 3.34 g/cm³ -> a same-size cheese Moon has ~1/3 the mass (~2.4e22 kg).
//  - Its orbit barely changes: orbital speed depends on Earth's mass, not the Moon's.
//  - Tides: the lunar tide scales with lunar mass; the solar tide is ~46% of today's lunar tide.
//    (0.33 + 0.46) / (1 + 0.46) ≈ 0.54 -> tides about half as big.
//  - Brightness: the Moon reflects ~12% of sunlight (albedo ~0.12); pale cheese ~0.5 -> moonlight ~4x brighter (est.).
//  - Central pressure of a uniform sphere: P = 3GM²/(8πR⁴) ≈ 5.1e8 Pa ≈ 5,000 atmospheres.
//  - Surface: ~+120°C in two weeks of sunlight, ~-170°C in two weeks of night; in vacuum the water boils off.
//  - ~600 lunar meteorites have been found on Earth; Apollo brought back 382 kg of samples (~0.1 kg cheese per pizza
//    -> ~4,000 pizzas).
//  - World cheese production ~22 million tonnes/yr -> the Moon = ~1.1 trillion years of output; ~2.9 billion tonnes
//    per person alive.
//  - Weaker tides -> Earth's days lengthen and the Moon drifts away (now ~3.8 cm/yr) more slowly; the Moon steadies
//    Earth's tilt, so a lighter Moon might let it wobble more (hedged est.).
//  - Ending: Apollo astronauts said real Moon dust smells like spent gunpowder.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['scale', 4.5, [[1.0, 'impact']]],
  ['tides', 4.5, [[0.2, 'drawback:3']]],
  ['bright', 4.5, [[0.2, 'swell:4.2']]],
  ['squeeze', 4.5, [[0.2, 'rumble:4.2']]],
  ['daynight', 5.0, [[0.2, 'roar:2.2'], [2.6, 'air']]],
  ['splat', 5.0, [[0.8, 'impact'], [0.85, 'boom'], [3.0, 'boom']]],
  ['apollo', 4.5, [[0.2, 'swell:4.2']]],
  ['numbers', 5.0, [[0.4, 'impact'], [2.4, 'impact']]],
  ['tilt', 5.0, [[0.2, 'rumble:4.6']]],
  ['smell', 4.5, [[0.2, 'swell:4.2']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the Moon was made of cheese?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 80, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, scale: vScale, tides: vTides, bright: vBright, squeeze: vSqueeze, daynight: vDayNight, splat: vSplat, apollo: vApollo,
              numbers: vNumbers, tilt: vTilt, smell: vSmell, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const CHEESE = '#ffc93c';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.28);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2, saturate: 1.12 });
}
function sparkle(ctx, x, y, s, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#ffffff'; ctx.beginPath();
  ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); ctx.restore(); }

// ================================================================ the cheese Moon
const HOLES = (() => { const r = rng(77), H = []; for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 0.82; H.push([Math.cos(a) * d, Math.sin(a) * d, 0.04 + Math.pow(r(), 2) * 0.14]); } return H; })();
function cheeseMoon(ctx, x, y, r, o = {}) {
  const { toast = 0, shade = true, rot = 0 } = o;
  glow(ctx, x, y, r * 1.6, '255,210,90', 0.35);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r); g.addColorStop(0, '#fff2a8'); g.addColorStop(0.6, CHEESE); g.addColorStop(1, '#d08a1a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.clip();
  if (toast > 0) { const r2 = rng(5); for (let i = 0; i < 18; i++) { const a = r2() * 6.283, d = Math.sqrt(r2()) * r; ctx.fillStyle = `rgba(170,90,20,${0.35 * toast})`; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.18, r * 0.1, a, 0, 6.283); ctx.fill(); } }
  for (const [hx, hy, hr] of HOLES) { const cx = x + (hx * Math.cos(rot) - hy * Math.sin(rot)) * r, cy = y + (hx * Math.sin(rot) + hy * Math.cos(rot)) * r, rr = hr * r;
    ctx.fillStyle = '#c8861a'; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.283); ctx.fill(); ctx.fillStyle = '#e8a42a'; ctx.beginPath(); ctx.arc(cx + rr * 0.18, cy + rr * 0.18, rr * 0.8, 0, 6.283); ctx.fill(); }
  if (shade) { ctx.fillStyle = 'rgba(90,40,10,0.35)'; ctx.beginPath(); ctx.arc(x + r * 0.55, y + r * 0.35, r * 1.05, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.07, W / 2, 1100);
  const k = easeInOut(prog(u, 0.9, 1.6)), R = 360;
  if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; moonFx(ctx, W / 2, 1100, R, {}); ctx.restore(); }
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; cheeseMoon(ctx, W / 2, 1100, R * (1 + 0.06 * Math.sin(k * Math.PI)), { rot: u * 0.05 }); ctx.restore();
    if (u < 2.4) for (let i = 0; i < 8; i++) sparkle(ctx, W / 2 + Math.cos(i * 0.8 + u) * 440, 1100 + Math.sin(i * 0.8 + u) * 440, 22, 1 - (u - 1.6) / 0.8); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the Moon', 'was made of', 'cheese?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 2, from: 0, to: 6, color: '#e8a01e' } });
}

// ================================================================ 2. a third the weight (same orbit)
function vScale(ctx, u) {
  space(ctx, u);
  const tilt = easeBack(R2((u - 0.8) / 0.6)) * 0.22, cx = W / 2, cy = 1050, L = 400;
  ctx.fillStyle = '#c8ccd8'; ctx.beginPath(); ctx.moveTo(cx - 90, 1600); ctx.lineTo(cx + 90, 1600); ctx.lineTo(cx + 20, cy); ctx.lineTo(cx - 20, cy); ctx.fill();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-tilt); ctx.fillStyle = '#e8ecf4'; roundRect(ctx, -L - 20, -12, 2 * L + 40, 24, 12); ctx.fill(); ctx.restore();
  const lx = cx - Math.cos(tilt) * L, ly = cy + Math.sin(tilt) * L, rx = cx + Math.cos(tilt) * L, ry = cy - Math.sin(tilt) * L;
  for (const [x, y] of [[lx, ly], [rx, ry]]) { ctx.strokeStyle = '#e8ecf4'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 120, y + 260); ctx.moveTo(x, y); ctx.lineTo(x + 120, y + 260); ctx.stroke();
    ctx.fillStyle = '#e8ecf4'; ctx.beginPath(); ctx.ellipse(x, y + 270, 150, 24, 0, 0, 6.283); ctx.fill(); }
  moonFx(ctx, lx, ly + 150, 120, {}); cheeseMoon(ctx, rx, ry + 150, 120, {});
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('MOON ROCK', lx, ly + 360); ctx.fillText('CHEESE', rx, ry + 360);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Cheese is 3× lighter', 'than moon rock'], 230, 0.15, { size: 84, out: 2.5 });
  say(ctx, u, ['The Moon weighs a third', 'as much, but stays in orbit'], 230, 2.6, { size: 70, out: OUT('scale') });
}

// ================================================================ 3. tides shrink by half
function vTides(ctx, u) {
  bgSky(ctx, ['#4f9be0', '#8ccaf0', '#d0ecff']);
  cheeseMoon(ctx, 820, 330, 90, { shade: false });
  const sea = 1150 + Math.sin(u * 1.5) * 10;
  ctx.fillStyle = '#e8d29a'; ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(W, 1300); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = '#2f8ad8'; ctx.beginPath(); ctx.moveTo(0, sea - 200); ctx.lineTo(W * 0.55, sea); ctx.lineTo(W * 0.55, sea); ctx.lineTo(0, sea + 300); ctx.fill();
  ctx.fillRect(0, 0, 0, 0);
  ctx.fillStyle = 'rgba(47,138,216,1)'; ctx.beginPath(); ctx.moveTo(0, 900); ctx.quadraticCurveTo(300, sea - 80, 560, sea + 40); ctx.lineTo(0, sea + 600); ctx.fill();
  // ghost line: where high tide used to reach
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 6; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(0, 1080); ctx.quadraticCurveTo(500, 1240, 1000, 1500); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `900 34px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('old high tide', 640, 1330);
  // a sad surfer and a stranded crab
  person2(ctx, 760, 1640, 340, { seed: 4, t: u }); ctx.save(); ctx.translate(880, 1560); ctx.rotate(-1.3); ctx.fillStyle = '#ff5d8f'; roundRect(ctx, -26, -170, 52, 340, 26); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.ellipse(420, 1700, 40, 26, 0, 0, 6.283); ctx.fill(); for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(420 + s * 56, 1680 + Math.sin(u * 4) * 4, 14, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Tides shrink', 'by about half'], 230, 0.15, { size: 96, out: OUT('tides') });
}

// ================================================================ 4. moonlight 4x brighter
function vBright(ctx, u) {
  const k = easeInOut(prog(u, 0.6, 2.4));
  bgSky(ctx, [mixHex('#05060e', '#1a2448', k), mixHex('#0a0e20', '#3a4a7a', k), mixHex('#141a30', '#6a7aa0', k)]);
  glow(ctx, W / 2, 520, 300 + 300 * k, '255,220,120', 0.5 + 0.4 * k); cheeseMoon(ctx, W / 2, 520, 150, { shade: false });
  ctx.fillStyle = mixHex('#0a0e18', '#2a3a3a', k); ctx.beginPath(); ctx.moveTo(0, 1300); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 1260 + Math.sin(x * 0.01) * 50); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  const r = rng(3); for (let i = 0; i < 9; i++) { const x = r() * W, h = 300 + r() * 300; ctx.fillStyle = mixHex('#05080c', '#1a2a2a', k); ctx.beginPath(); ctx.moveTo(x, 1300 - h); ctx.lineTo(x - h * 0.22, 1320); ctx.lineTo(x + h * 0.22, 1320); ctx.fill(); }
  // an owl, wide awake and very confused
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, 1480); ctx.lineTo(620, 1440); ctx.stroke();
  ctx.save(); ctx.translate(420, 1390); ctx.fillStyle = '#8a6a4a'; ctx.beginPath(); ctx.ellipse(0, 0, 70, 90, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ffffff'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 30, -30, 26, 0, 6.283); ctx.fill(); } ctx.fillStyle = '#1b1b2e'; const sq = 1 - 0.7 * k;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 30, -30, 12, 12 * sq, 0, 0, 6.283); ctx.fill(); } ctx.fillStyle = '#e8a01e'; ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(8, -6); ctx.lineTo(0, 10); ctx.fill(); ctx.restore();
  // baby turtles heading the wrong way
  for (let i = 0; i < 5; i++) { const x = 700 + i * 60 - u * 40, y = 1700 + (i % 2) * 40; ctx.fillStyle = '#3a6a3a'; ctx.beginPath(); ctx.ellipse(x, y, 18, 12, 0, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Cheese reflects way more', 'light than grey rock'], 230 + 760, 0.15, { size: 64, out: 2.2 });
  say(ctx, u, ['Moonlight: ~4× brighter.', 'Night is never dark again.'], 990, 2.3, { size: 64, out: OUT('bright') });
}

// ================================================================ 5. squeezed by its own gravity
function vSqueeze(ctx, u) {
  space(ctx, u);
  const cx = W / 2, cy = 1150, R = 440;
  cheeseMoon(ctx, cx, cy, R, { shade: false });
  ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R + 2, -Math.PI / 2, 0); ctx.closePath(); ctx.fillStyle = '#05060e'; ctx.fill(); ctx.restore();
  const layers = [[1.0, '#b86a14'], [0.92, '#ffc93c'], [0.6, '#f0a020'], [0.32, '#c86a10']];
  for (const [f, c] of layers) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * f, -Math.PI / 2, 0); ctx.closePath(); ctx.fill(); }
  glow(ctx, cx, cy, R * 0.4, '255,150,60', 0.5 + 0.2 * Math.sin(u * 3));
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i + 0.5) / 6 * Math.PI / 2, d = lerp(R * 0.95, R * 0.45, ((u * 0.6 + i / 6) % 1));
    ctx.save(); ctx.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d); ctx.rotate(a + Math.PI); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-10, -16); ctx.lineTo(-10, 16); ctx.fill(); ctx.restore(); }
  ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.fillText('dried, toasted crust', cx + 40, cy - R - 20);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Its own gravity crushes', 'the core'], 230, 0.15, { size: 80, out: OUT('squeeze') });
  bigNum(ctx, u, '~5,000 atmospheres', 1700, 1.2, { size: 80, color: '#ffd25a', out: OUT('squeeze') });
}

// ================================================================ 6. fondue by day, frozen by night
function vDayNight(ctx, u) {
  space(ctx, u);
  const cx = W / 2, cy = 1150, R = 460;
  cheeseMoon(ctx, cx, cy, R, { shade: false, toast: 0.6 });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  ctx.fillStyle = 'rgba(150,200,255,0.55)'; ctx.fillRect(cx, cy - R, R, 2 * R);
  const r = rng(6); ctx.strokeStyle = 'rgba(240,250,255,0.9)'; ctx.lineWidth = 3; for (let i = 0; i < 30; i++) { const x = cx + 40 + r() * R, y = cy - R + r() * 2 * R, s = 10 + r() * 16; ctx.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.moveTo(x - Math.cos(a) * s, y - Math.sin(a) * s); ctx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); } ctx.stroke(); }
  for (let i = 0; i < 40; i++) { const x = cx - r() * R, y = cy - R + r() * 2 * R, ph = ((u * (0.8 + r()) + r()) % 1), s = 6 + ph * 26; ctx.strokeStyle = `rgba(255,240,180,${0.9 * (1 - ph)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y - ph * 30, s, 0, 6.283); ctx.stroke(); }
  ctx.restore();
  for (let i = 0; i < 8; i++) { const x = cx - R * 0.9 - 20 + i * 8, y = cy - R * 0.3 + i * 60, ph = ((u + i * 0.2) % 1); ctx.fillStyle = `rgba(255,255,255,${0.4 * (1 - ph)})`; ctx.beginPath(); ctx.arc(x - ph * 120, y - ph * 40, 16 + ph * 30, 0, 6.283); ctx.fill(); }
  ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffb04a'; ctx.fillText('+120°C', cx - R / 2, cy + R + 100); ctx.fillStyle = '#9ad8ff'; ctx.fillText('−170°C', cx + R / 2, cy + R + 100);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Two weeks of sun:', 'it bubbles like fondue'], 230, 0.15, { size: 80, out: 2.5 });
  say(ctx, u, ['Two weeks of night:', 'frozen rock-hard'], 230, 2.6, { size: 84, out: OUT('daynight') });
}

// ================================================================ 7. meteor strikes splash cheese; cheese meteors on Earth
function vSplat(ctx, u) {
  const hit = 0.8, dt = Math.max(0, u - hit), [sx, sy] = shakeOffset(u, hit, 1.4, 22);
  if (u < 2.8) {
    bgSky(ctx, ['#05060e', '#0a0e20', '#141a30']); stars(ctx, u, 1); ctx.translate(sx, sy);
    ctx.fillStyle = CHEESE; ctx.beginPath(); ctx.ellipse(W / 2, 2400, 1700, 1100, 0, 0, 6.283); ctx.fill();
    for (const [hx, hy, hr] of HOLES.slice(0, 10)) { ctx.fillStyle = '#d08a1a'; ctx.beginPath(); ctx.ellipse(W / 2 + hx * 1200, 1400 + Math.abs(hy) * 500, hr * 600, hr * 200, 0, 0, 6.283); ctx.fill(); }
    if (u < hit) { const k = u / hit; ctx.fillStyle = '#9a8a80'; ctx.beginPath(); ctx.arc(lerp(1000, W / 2, k), lerp(200, 1320, k), 40, 0, 6.283); ctx.fill(); glow(ctx, lerp(1000, W / 2, k), lerp(200, 1320, k), 90, '255,200,120', 0.8); }
    else { const r = rng(9); for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, len = (300 + r() * 600) * easeOut(R2(dt / 1.2)), x0 = W / 2, y0 = 1320, x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len + 300 * dt * dt * r();
        ctx.strokeStyle = '#ffd86a'; ctx.lineWidth = 10 * (1 - R2(dt / 2)) + 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - 120, x1, y1); ctx.stroke();
        ctx.fillStyle = '#ffc93c'; ctx.beginPath(); ctx.arc(x1, y1, 16 + r() * 18, 0, 6.283); ctx.fill(); }
      ctx.fillStyle = '#c8861a'; ctx.beginPath(); ctx.ellipse(W / 2, 1330, 160 + 120 * R2(dt), 40, 0, 0, 6.283); ctx.fill(); }
    flash(ctx, u, hit, 0.3);
  } else {
    bgSky(ctx, ['#0a1030', '#2a2a5a', '#5a3a6a']); stars(ctx, u, 1);
    cityLayer(ctx, u, { base: 1500, seed: 4, hMin: 120, hMax: 520, wMin: 50, wMax: 120, gap: 8, col: '#141830', win: 'rgba(255,214,150,0.6)', winP: 0.4, ws: 6 });
    ctx.fillStyle = '#0e1020'; ctx.fillRect(0, 1500, W, H);
    for (let i = 0; i < 7; i++) { const st = 2.8 + i * 0.25, k = R2((u - st) / 0.9); if (k <= 0 || k >= 1) continue; const x0 = 200 + i * 130, x = lerp(x0 + 300, x0 - 200, k), y = lerp(300, 1100, k);
      ctx.strokeStyle = 'rgba(255,200,90,0.6)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 200, y - 320); ctx.lineTo(x, y); ctx.stroke(); glow(ctx, x, y, 60, '255,190,80', 0.9); }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Meteor strikes', 'splash molten cheese'], 230, 0.15, { size: 84, out: 2.6 });
  say(ctx, u, ['Some reach Earth as', 'flaming cheese meteors'], 230, 2.85, { size: 76, out: OUT('splat'), mark: { line: 1, from: 0, to: 14, color: '#e8a01e' } });
}

// ================================================================ 8. Apollo: one small step into cheese
function vApollo(ctx, u) {
  bgSky(ctx, ['#05060e', '#0a0e20', '#141a30']); stars(ctx, u, 1);
  globe(ctx, 850, 720, 110, { lon0: -40, lat0: 15, t: u, ink: false });
  ctx.fillStyle = CHEESE; ctx.fillRect(0, 1250, W, H); for (const [hx, hy, hr] of HOLES.slice(0, 8)) { ctx.fillStyle = '#d8962a'; ctx.beginPath(); ctx.ellipse(W / 2 + hx * 900, 1400 + Math.abs(hy) * 500, hr * 500, hr * 150, 0, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#c8c8d0'; ctx.fillRect(700, 1080, 220, 120); ctx.fillStyle = '#e8c84a'; ctx.fillRect(680, 1200, 260, 60); ctx.strokeStyle = '#c8c8d0'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(700, 1260); ctx.lineTo(650, 1300); ctx.moveTo(920, 1260); ctx.lineTo(970, 1300); ctx.stroke();
  const sink = easeOut(prog(u, 0.6, 1.6)) * 60;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1560 + 4); ctx.clip();
  ctx.save(); ctx.translate(380, 1560 + sink); ctx.fillStyle = '#f1f1f1'; roundRect(ctx, -90, -300, 180, 220, 50); ctx.fill(); ctx.fillRect(-70, -90, 50, 90); ctx.fillRect(20, -90, 50, 90);
  ctx.beginPath(); ctx.arc(0, -350, 80, 0, 6.283); ctx.fill(); ctx.fillStyle = '#e8b84a'; ctx.beginPath(); ctx.ellipse(10, -350, 56, 44, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(-10, -366, 18, 10, -0.4, 0, 6.283); ctx.fill(); ctx.restore();
  ctx.restore();
  ctx.fillStyle = '#e8a82a'; ctx.beginPath(); ctx.ellipse(380, 1564, 140, 22, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#d0d4dc'; ctx.fillRect(520, 1100, 10, 450); ctx.fillStyle = '#ffffff'; ctx.fillRect(530, 1100, 170, 100); ctx.fillStyle = '#e63946'; for (let k = 0; k < 4; k++) ctx.fillRect(530, 1100 + k * 25, 170, 12);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['One small step…', 'ankle-deep in cheese'], 230, 0.15, { size: 84, out: 2.4 });
  say(ctx, u, ['Apollo’s 382 kg haul:', 'enough for ~4,000 pizzas'], 230, 2.5, { size: 72, out: OUT('apollo') });
}

// ================================================================ 9. the numbers
function vNumbers(ctx, u) {
  bgSky(ctx, ['#ffb07a', '#ffd06a', '#ffe8a0']);
  const r = rng(8); for (let i = 0; i < 40; i++) { const x = r() * W, y = ((r() * H + u * (60 + r() * 120)) % (H + 300)) - 150, s = 40 + r() * 50;
    ctx.save(); ctx.translate(x, y); ctx.rotate(u * (r() - 0.5) * 2 + i); ctx.fillStyle = CHEESE; ctx.beginPath(); ctx.moveTo(-s, s * 0.6); ctx.lineTo(s, s * 0.6); ctx.lineTo(-s * 0.6, -s * 0.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8a42a'; ctx.beginPath(); ctx.arc(-s * 0.2, s * 0.2, s * 0.15, 0, 6.283); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = 'rgba(40,20,10,0.45)'; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['That’s a trillion years', 'of all the cheese', 'Earth makes'], 230, 0.15, { size: 76, out: OUT('numbers') });
  bigNum(ctx, u, '3 billion tonnes', 1250, 2.4, { size: 104, color: '#ffffff', out: OUT('numbers') });
  say(ctx, u, ['for every person alive'], 1380, 2.7, { size: 56, weight: 800, x: W / 2, align: 'center', out: OUT('numbers') });
}

// ================================================================ 10. the long run: days, drift, tilt
function vTilt(ctx, u) {
  space(ctx, u);
  const cx = W / 2, cy = 1150, wob = Math.sin(u * 1.4) * 0.35 * easeInOut(prog(u, 1.6, 3.0)), tilt = 0.41 + wob;
  globe(ctx, cx, cy, 300, { lon0: u * 40, lat0: 15, t: u, ink: false });
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 6; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(cx - Math.sin(tilt) * 440, cy - Math.cos(tilt) * 440); ctx.lineTo(cx + Math.sin(tilt) * 440, cy + Math.cos(tilt) * 440); ctx.stroke(); ctx.setLineDash([]);
  const a = u * 0.9; ctx.strokeStyle = 'rgba(255,210,90,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy, 470, 120, 0, 0, 6.283); ctx.stroke();
  const mx = cx + Math.cos(a) * 470, my = cy + Math.sin(a) * 120; if (Math.sin(a) > 0 || true) cheeseMoon(ctx, mx, my, 60, { shade: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Weaker tides: days stretch', 'and the Moon drifts off', 'more slowly'], 230, 0.15, { size: 70, out: 2.6 });
  say(ctx, u, ['A lighter Moon might let', 'Earth’s tilt wobble more', '(est.)'], 230, 2.7, { size: 70, out: OUT('tilt') });
}

// ================================================================ 11. the real Moon smells like gunpowder
function vSmell(ctx, u) {
  space(ctx, u);
  moonFx(ctx, W / 2, 1900, 900, {});
  ctx.save(); ctx.translate(W / 2, 1200); ctx.fillStyle = '#f1f1f1'; roundRect(ctx, -200, -40, 400, 520, 90); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -160, 190, 0, 6.283); ctx.fill(); ctx.fillStyle = '#1b2a4a'; ctx.beginPath(); ctx.ellipse(10, -160, 140, 110, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-50, -200, 40, 22, -0.4, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(120,120,130,0.55)'; const r = rng(2); for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(-180 + r() * 360, 0 + r() * 460, 4 + r() * 8, 0, 6.283); ctx.fill(); }
  ctx.restore();
  for (let i = 0; i < 4; i++) { const ph = ((u * 0.5 + i / 4) % 1); ctx.strokeStyle = `rgba(200,200,210,${0.6 * (1 - ph)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W / 2 + 230, 1240 - ph * 300); ctx.bezierCurveTo(W / 2 + 280, 1180 - ph * 300, W / 2 + 200, 1120 - ph * 300, W / 2 + 250, 1060 - ph * 300); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The real Moon?', 'Its dust smells like', 'spent gunpowder'], 230, 0.15, { size: 84, out: OUT('smell') });
  say(ctx, u, ['(Apollo astronauts said so)'], 560, 1.4, { size: 46, weight: 800, out: OUT('smell') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  cheeseMoon(ctx, W / 2, 1420, 240, { rot: u * 0.1 });
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
