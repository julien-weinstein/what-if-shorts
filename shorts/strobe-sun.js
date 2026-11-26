// What if the Sun became a strobe light?   (v3: kick drum throughout; small-scale life vs. planet-scale collapse)
//
// VIEWER SAFETY: no real strobing. One global on-screen pulse at 1.6 Hz (96 bpm, locked to the kick drum), dimming
// the frame by at most ~24%: below the 3-flashes-per-second photosensitivity guideline. Labelled on screen.
//
// FACTS (checked; estimates hedged on screen):
//  - Sunlight takes ~8 min 20 s to reach Earth (the physics plot hole: light takes millennia to leave the core; the
//    premise is that the surface flickers 10x a second, dark half the time).
//  - "Flicker vertigo": light flickering at ~4-20 Hz (e.g. through propellers/rotors) can disorient pilots and has been
//    linked to accidents; an FAA-recognised hazard.
//  - Honeybees navigate using the Sun's position (sun compass); bees pollinate a large share of crops.
//  - Marine phytoplankton produce roughly half of Earth's oxygen and are the base of the ocean food web.
//  - Half the sunlight: 288 K × 0.5^0.25 ≈ 242 K (≈ −30°C global average) before ice feedback (est.).
//  - Last ice age: sea level ~120 m lower.
//  - Toll (est.): crop failure, cold and collapsing food webs could kill billions (hedged).
//  - Snowball Earth episodes (~720-635 million years ago) happened before humans existed; life survived them.
//    Hot springs and volcanic regions would be the last warm refuges (speculative, hedged).

const KICK_STEP = 60 / 96;
const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['rave', 4.5, []],
  ['roads', 4.0, [[1.4, 'impact'], [1.45, 'boom'], [2.6, 'boom']]],
  ['cockpit', 4.5, [[2.8, 'impact'], [2.85, 'boom']]],
  ['bee', 4.5, []],
  ['iss', 4.0, [[0.2, 'swell:3.6']]],
  ['micro', 4.0, []],
  ['thermal', 4.5, [[0.2, 'rumble:4.2']]],
  ['blizzard', 4.5, [[0.2, 'roar:4.2']]],
  ['herds', 4.0, [[0.2, 'rumble:3.8']]],
  ['seabed', 4.5, [[0.2, 'rumble:4.2']]],
  ['migrate', 4.5, [[0.2, 'heart:4.2']]],
  ['volcano', 4.5, [[0.2, 'rumble:4.2']]],
  ['finale', 6.0, [[0.2, 'swell:5.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(3), s]); _acc += d; }
const TOTAL = _acc;
_sfx.unshift([0, `kick:${TOTAL.toFixed(2)}`]);   // the kick drum throbs through the whole video

const SHORT = {
  title: 'What if the Sun became a strobe light?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 96, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, rave: vRave, roads: vRoads, cockpit: vCockpit, bee: vBeeEye, iss: vISS, micro: vMicro, thermal: vThermal, blizzard: vBlizzard,
              herds: vHerds, seabed: vSeabed, migrate: vMigrate, volcano: vVolcano, finale: vFinale, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
let G_T = 0;
const gbeat = () => { const p = (G_T % KICK_STEP) / KICK_STEP; return Math.exp(-p * 4.5); };
const beat = () => gbeat();
function pulseDim() {}
function render(ctx, t) {
  G_T = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = `rgba(8,10,26,${0.24 * (1 - gbeat())})`; ctx.fillRect(0, 0, W, H);   // the strobe, made safe
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  if (t < 8) safetyTag(ctx);
  post(ctx, { bloom: 0.24, saturate: 1.12 });
}
function safetyTag(ctx) { ctx.font = `800 28px ${FONT}`; const t = 'flicker slowed down for safety'; const w = ctx.measureText(t).width + 30; ctx.fillStyle = 'rgba(20,20,40,0.7)'; roundRect(ctx, W - 60 - w, 1790, w, 46, 23); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(t, W - 45 - w, 1822); }
function sunDisk(ctx, x, y, r, u, b = 1) {
  glow(ctx, x, y, r * (2.6 + 0.8 * b), '255,210,120', 0.35 + 0.35 * b);
  const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r); g.addColorStop(0, '#fffbe0'); g.addColorStop(0.7, '#ffd24a'); g.addColorStop(1, '#ff9a2a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.strokeStyle = `rgba(255,220,140,${0.3 + 0.5 * b})`; ctx.lineWidth = r * 0.04; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + u * 0.2, L = 1.35 + 0.25 * b; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.15, y + Math.sin(a) * r * 1.15); ctx.lineTo(x + Math.cos(a) * r * L, y + Math.sin(a) * r * L); ctx.stroke(); }
}
function snowfall(ctx, u, n, seed = 3, a = 0.9) { const r = rng(seed); ctx.fillStyle = `rgba(255,255,255,${a})`; for (let i = 0; i < n; i++) { const x = (r() * W + Math.sin(u + i) * 30) % W, y = (r() * H + u * (60 + r() * 100)) % H; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 4, 0, 6.283); ctx.fill(); } }
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.2)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function fireball(ctx2, x, y, dt, s, seed) {
  if (dt <= 0) return; const r = rng(seed), k = 1 - Math.exp(-dt * 2.5), fade = R2(1 - dt / 3.5);
  for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = r() * 90 * s * k, rr = (60 + r() * 70) * s * (0.4 + k);
    puff(ctx2, x + Math.cos(a) * d, y - k * 160 * s + Math.sin(a) * d * 0.6 - dt * 40 * s, rr, mixHex('#fff0a0', '#3a2a28', R2(dt / 1.6 + r() * 0.3)), fade); }
  glow(ctx2, x, y - 60 * s, 260 * s, '255,170,70', 0.9 * Math.exp(-dt * 1.4));
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1100);
  sunDisk(ctx, W / 2, 1100, 300, u, gbeat());
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700 - 24 * gbeat(), u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the Sun', 'became a', 'strobe light?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 2, from: 0, to: 6, color: '#ffbe0b' } });
}

// ================================================================ 4. cockpit: flicker vertigo
function vCockpit(ctx, u) {
  const crash = 2.8, roll = Math.sin(u * 1.7) * 0.25 * prog(u, 0.6, 2.8), pitch = prog(u, 1.4, crash) * 160, [sx, sy] = shakeOffset(u, crash, 2, 30);
  bgSky(ctx, ['#4a7ab8', '#a8cce8', '#f0e0c8']); ctx.translate(sx, sy);
  ctx.save(); ctx.translate(W / 2, 1100); ctx.rotate(roll); ctx.translate(-W / 2, -1100 + pitch);
  ctx.fillStyle = '#6a8a5a'; ctx.fillRect(-600, 1050, W + 1200, 2000);
  ctx.fillStyle = '#4a4a54'; ctx.beginPath(); ctx.moveTo(W / 2 - 30, 1050); ctx.lineTo(W / 2 + 30, 1050); ctx.lineTo(W / 2 + 500, 2400); ctx.lineTo(W / 2 - 500, 2400); ctx.fill();
  for (let k = 0; k < 10; k++) { const f = (k / 10 + u * 0.4) % 1, y = 1050 + f * f * 1300, w = 6 + f * 40; ctx.fillStyle = '#ffffff'; ctx.fillRect(W / 2 - w / 2, y, w, 8 + f * 60); }
  for (let k = 0; k < 8; k++) { const f = (k / 8 + u * 0.4) % 1, y = 1050 + f * f * 1300, x = 40 + f * 520; for (const sgn of [-1, 1]) glow(ctx, W / 2 + sgn * x, y, 10 + f * 30, '255,230,150', 0.9); }
  ctx.restore();
  if (u > crash) { fireball(ctx, W / 2, 1300, (u - crash) * 1.4, 2.6, 4); ctx.fillStyle = `rgba(255,240,220,${0.6 * R2(1 - (u - crash) * 3)})`; ctx.fillRect(0, 0, W, H); }
  ctx.fillStyle = '#16161e'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 520); ctx.lineTo(W - 200, 560); ctx.lineTo(200, 560); ctx.lineTo(0, 520); ctx.fill();
  ctx.fillRect(0, 0, 120, H); ctx.fillRect(W - 120, 0, 120, H); ctx.beginPath(); ctx.moveTo(W / 2 - 30, 560); ctx.lineTo(W / 2 + 30, 560); ctx.lineTo(W / 2 + 18, 1400); ctx.lineTo(W / 2 - 18, 1400); ctx.fill();
  ctx.fillStyle = '#1e1e28'; ctx.fillRect(0, 1450, W, H);
  for (let i = 0; i < 6; i++) { const x = 200 + i * 140, y = 1600; ctx.fillStyle = '#0a0a10'; ctx.beginPath(); ctx.arc(x, y, 54, 0, 6.283); ctx.fill(); ctx.strokeStyle = i === 2 && u > 1.5 ? '#ff4a3a' : '#7dffb0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 40, 0, 6.283); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); const a = u * (1 + i * 0.3) * (u > 1.5 ? 3 : 0.3) + i; ctx.lineTo(x + Math.cos(a) * 36, y + Math.sin(a) * 36); ctx.stroke(); }
  if (u > 1.6 && u < crash && Math.sin(u * 8) > 0) { ctx.fillStyle = '#ff3a3a'; ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('PULL UP', W / 2, 1780); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Pilots get “flicker vertigo”', 'a real aviation hazard'], 230, 0.15, { size: 66, out: 2.6 });
  say(ctx, u, ['Planes fall', 'out of the sky'], 230, 2.75, { size: 92, out: OUT('cockpit') });
}

// ================================================================ 5. a bee's-eye view
function vBeeEye(ctx, u) {
  bgSky(ctx, ['#0a0a0a', '#101010', '#0a0a0a']);
  const R = 46, cols = 14, rows = 26, wob = Math.sin(u * 7) * 0.04;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = c * R * 1.5 + 30, y = r * R * 1.73 / 2 * 2 + (c % 2) * R * 0.86 + 10, ix = x / W, iy = y / H;
    let col; const sunD = Math.hypot(ix - 0.62 - wob, iy - 0.28); if (iy < 0.62) col = sunD < 0.08 ? mixHex('#ffd24a', '#5a4a30', 1 - gbeat()) : mixHex('#6aa8e8', '#2a3a5a', (1 - gbeat()) * 0.6 + iy * 0.3);
    else col = (Math.floor(ix * 8 + Math.sin(iy * 20)) % 2) ? mixHex('#ff7ab6', '#3a2030', u / 6) : mixHex('#5aa02a', '#2a3a1a', u / 6);
    ctx.fillStyle = col; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.lineTo(x + Math.cos(a) * R * 0.95, y + Math.sin(a) * R * 0.95); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(x - R * 0.3, y - R * 0.3, R * 0.25, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.65);
  say(ctx, u, ['Bees steer by the Sun.', 'Now it keeps vanishing.'], 230, 0.15, { size: 76, out: 2.4 });
  say(ctx, u, ['Hives get lost.', 'Crops go unpollinated.'], 230, 2.5, { size: 80, out: OUT('bee') });
}

// ================================================================ 6. from the space station: the whole planet blinks
function vISS(ctx, u) {
  space(ctx, u);
  const b = gbeat(); globe(ctx, W / 2, 1900, 1200, { lon0: u * 6, lat0: 25, t: u, ink: false, sun: [0.2 * b - 0.6 * (1 - b), -0.4, 0.8 * b - 0.4 * (1 - b)] });
  ctx.fillStyle = '#20222c'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.roundRect(110, 520, W - 220, 1100, 180); ctx.fill('evenodd');
  ctx.strokeStyle = '#4a4c58'; ctx.lineWidth = 26; ctx.beginPath(); ctx.roundRect(110, 520, W - 220, 1100, 180); ctx.stroke();
  for (const [x, y] of [[150, 560], [W - 150, 560], [150, 1580], [W - 150, 1580]]) { ctx.fillStyle = '#6a6c78'; ctx.beginPath(); ctx.arc(x, y, 14, 0, 6.283); ctx.fill(); }
  ctx.save(); ctx.translate(300, 1760); ctx.fillStyle = '#f1f1f1'; ctx.beginPath(); ctx.roundRect(-110, -40, 220, 300, 60); ctx.fill(); ctx.beginPath(); ctx.arc(0, -90, 100, 0, 6.283); ctx.fill(); ctx.fillStyle = '#1b2a4a'; ctx.beginPath(); ctx.ellipse(10, -90, 72, 58, 0, 0, 6.283); ctx.fill(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['From space, the', 'whole planet blinks'], 230, 0.15, { size: 88, out: OUT('iss') });
}

// ================================================================ 7. under the microscope: plankton starve
function vMicro(ctx, u) {
  bgSky(ctx, ['#0a0a0a', '#0a0a0a', '#0a0a0a']);
  const cx = W / 2, cy = 1150, R = 470, k = easeInOut(prog(u, 0.6, 3.6));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  ctx.fillStyle = mixHex('#d8f0e0', '#7a8a80', k); ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  const r = rng(8); for (let i = 0; i < 22; i++) { const x = cx + (r() - 0.5) * 2 * R * 0.85, y = cy + (r() - 0.5) * 2 * R * 0.85, s = 30 + r() * 50, a = r() * 6.283 + u * 0.2 * (r() - 0.5), dead = r() < k;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = dead ? '#6a6a60' : '#2a8a4a'; ctx.lineWidth = 4; ctx.fillStyle = dead ? 'rgba(120,120,100,0.5)' : 'rgba(90,200,120,0.6)';
    if (i % 3 === 0) { ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.fill(); ctx.stroke(); for (let q = 0; q < 8; q++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(q * 0.785) * s, Math.sin(q * 0.785) * s); ctx.stroke(); } }
    else if (i % 3 === 1) { ctx.beginPath(); ctx.ellipse(0, 0, s * 1.6, s * 0.5, 0, 0, 6.283); ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); for (let q = 0; q < 3; q++) { const aa = q * 2.094; ctx.lineTo(Math.cos(aa) * s, Math.sin(aa) * s); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
    if (dead) { ctx.strokeStyle = '#3a3a30'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-s * 0.6, -s * 0.2); ctx.lineTo(s * 0.5, s * 0.3); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 40; ctx.beginPath(); ctx.arc(cx, cy, R + 20, 0, 6.283); ctx.stroke();
  ctx.font = `800 30px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'right'; ctx.fillText('×400', cx + R, cy + R + 80);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Plankton make half our', 'oxygen. Half the light:', 'they start to die.'], 230, 0.15, { size: 70, out: OUT('micro') });
}

// ================================================================ 8. thermal satellite: the planet cools
function vThermal(ctx, u) {
  space(ctx, u);
  const cx = W / 2, cy = 1150, R = 470, k = easeInOut(prog(u, 0.3, 4.0));
  const pal = f => { const stops = ['#0a1a6a', '#2a5ad8', '#3ac8e0', '#8ae05a', '#ffd23a', '#ff7a1a', '#d81a1a']; const x = R2(f) * (stops.length - 1), i = Math.floor(Math.min(x, stops.length - 2)); return mixHex(stops[i], stops[i + 1], x - i); };
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (let y = -R; y < R; y += 8) { const lat = Math.asin(y / R), base = 1 - Math.abs(lat) / (Math.PI / 2) * 1.1; for (let x = -R; x < R; x += 8) { const n = Math.sin(x * 0.02 + u * 0.3 + y * 0.01) * 0.08 + Math.sin(x * 0.007 - y * 0.013) * 0.06; ctx.fillStyle = pal(base + n - k * 0.75); ctx.fillRect(cx + x, cy + y, 8, 8); } }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
  for (let i = 0; i < 7; i++) { ctx.fillStyle = pal(i / 6); ctx.fillRect(140 + i * 114, 1720, 114, 30); } ctx.font = `800 30px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('COLD', 140, 1700); ctx.textAlign = 'right'; ctx.fillText('HOT', 940, 1700);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Half the sunlight.', 'The planet goes cold.'], 230, 0.15, { size: 84, out: 2.4 });
  say(ctx, u, ['+15°C → −30°C', 'global average (est.)'], 230, 2.5, { size: 80, out: OUT('thermal') });
}

// ================================================================ 9. blizzard city: grids fail, people freeze
function vBlizzard(ctx, u) {
  bgSky(ctx, ['#1a2030', '#2a3448', '#3a4660']);
  const off = R2((u - 1.0) / 1.2);
  cityLayer(ctx, u, { base: 1250, seed: 9, hMin: 200, hMax: 700, wMin: 70, wMax: 160, gap: 12, col: '#1a1e2a', win: `rgba(255,214,150,${0.7 * (1 - off)})`, winP: 0.5, ws: 8 });
  ctx.fillStyle = '#e8eef4'; ctx.fillRect(0, 1250, W, H);
  ctx.fillStyle = '#5a5a66'; roundRect(ctx, 470, 1560, 140, 160, 14); ctx.fill(); glow(ctx, 540, 1540, 200, '255,150,60', 0.7 + 0.2 * Math.sin(u * 9)); for (let k = 0; k < 4; k++) puff(ctx, 540 + Math.sin(u * 3 + k) * 16, 1520 - k * 40, 30 + k * 6, '#ffb04a', 0.6);
  [[260, 3], [380, 5], [700, 1], [820, 6]].forEach(([x, s]) => { person2(ctx, x, 1800, 300, { seed: s, t: u, grey: 0.25 }); ctx.fillStyle = '#e8eef4'; ctx.beginPath(); ctx.ellipse(x, 1800 - 300 * 0.98, 50, 16, 0, Math.PI, 0); ctx.fill(); });
  ctx.fillStyle = '#c8d0dc'; for (let i = 0; i < 3; i++) { ctx.fillRect(60 + i * 340, 1880, 260, 30); }
  snowfall(ctx, u, 320, 3, 0.95);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Winter never ends.', 'Pipes burst. Grids fail.'], 230, 0.15, { size: 80, out: 2.6 });
  say(ctx, u, ['Millions freeze', 'in their homes (est.)'], 230, 2.7, { size: 84, out: OUT('blizzard') });
}

// ================================================================ 10. herds die in the snow
function vHerds(ctx, u) {
  bgSky(ctx, ['#8aa0b8', '#b8c8d8', '#e0e8f0']);
  ctx.fillStyle = '#eef2f6'; ctx.fillRect(0, 1100, W, H);
  const r = rng(4);
  for (let i = 0; i < 14; i++) { const x = r() * W, y = 1150 + r() * 700, s = 0.4 + (y - 1100) / 700, down = r() < 0.4 + 0.5 * prog(u, 0.5, 3.5);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#5a4030';
    if (down) { ctx.beginPath(); ctx.ellipse(0, -30, 90, 34, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(-90, -20, 30, 20, 0.3, 0, 6.283); ctx.fill(); ctx.fillStyle = '#eef2f6'; ctx.beginPath(); ctx.ellipse(0, -56, 80, 14, 0, 0, 6.283); ctx.fill(); }
    else { ctx.beginPath(); ctx.ellipse(0, -100, 90, 46, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(-90, -130, 30, 26, -0.3, 0, 6.283); ctx.fill(); for (const lx of [-60, -30, 30, 60]) ctx.fillRect(lx, -70, 14, 70); ctx.strokeStyle = '#5a4030'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-100, -150); ctx.lineTo(-130, -200); ctx.moveTo(-84, -152); ctx.lineTo(-70, -205); ctx.stroke(); }
    ctx.restore(); }
  for (let i = 0; i < 6; i++) { const x = 160 + i * 150, y = 400 + ((u * 300 + i * 200) % 1400); ctx.save(); ctx.translate(x, y); ctx.rotate(1.2 + i); ctx.fillStyle = '#3a3a4a'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, 6.283); ctx.fill(); ctx.fillRect(-26, -3, 52, 6); ctx.restore(); }
  snowfall(ctx, u, 180, 7, 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.5);
  say(ctx, u, ['Birds drop from the sky.', 'Herds starve in the snow.'], 230, 0.15, { size: 74, out: OUT('herds') });
}

// ================================================================ 13. the last humans huddle by volcanoes
function vVolcano(ctx, u) {
  bgSky(ctx, ['#0a0608', '#1a0e10', '#2a1414']);
  ctx.fillStyle = '#1e1416'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 700); ctx.quadraticCurveTo(W / 2, 520, 0, 700); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, 1500); ctx.quadraticCurveTo(W / 2, 1440, W, 1500); ctx.lineTo(W, H); ctx.fill();
  glow(ctx, W / 2, 1420, 520, '255,110,40', 0.75 + 0.1 * Math.sin(u * 3));
  ctx.fillStyle = '#ff7a2a'; ctx.beginPath(); ctx.ellipse(W / 2, 1460, 260, 40, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.ellipse(W / 2, 1460, 150, 20, 0, 0, 6.283); ctx.fill();
  for (let k = 0; k < 8; k++) puff(ctx, W / 2 + Math.sin(u + k) * 80, 1400 - ((u * 120 + k * 120) % 900), 50 + k * 8, '#c8a898', 0.25);
  [[180, 2], [330, 5], [760, 1], [900, 4]].forEach(([x, s]) => person2(ctx, x, 1700, 300, { seed: s, t: u }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Billions die.', 'The last humans huddle', 'around volcanoes.'], 230, 0.15, { size: 76, out: OUT('volcano') });
}

// ================================================================ 14. finale: a frozen marble, blinking in the dark
function vFinale(ctx, u) {
  space(ctx, u);
  const z = lerp(1.3, 0.75, easeInOut(prog(u, 0, 6))), cx = W / 2, cy = 1150, R = 420 * z, b = gbeat();
  glow(ctx, cx, cy, R * 1.5, '220,235,255', 0.15 + 0.35 * b);
  globe(ctx, cx, cy, R, { lon0: -20 + u * 6, lat0: 20, t: u, ink: false, clouds: 0.2, atmo: '200,225,255' });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R); g.addColorStop(0, 'rgba(255,255,255,0.86)'); g.addColorStop(1, 'rgba(200,220,240,0.78)'); ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.strokeStyle = 'rgba(140,170,200,0.45)'; ctx.lineWidth = 3; const r = rng(3); for (let i = 0; i < 14; i++) { let x = cx + (r() - 0.5) * 2 * R, y = cy + (r() - 0.5) * 2 * R; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * R * 0.3; y += (r() - 0.5) * R * 0.2; ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = `rgba(10,14,30,${0.45 * (1 - b)})`; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  moonFx(ctx, cx + R * 1.6, cy - R * 1.2, R * 0.22, {});
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Earth: a frozen marble,', 'blinking in the dark'], 230, 0.15, { size: 80, out: 2.8 });
  say(ctx, u, ['Earth has survived freezing', 'solid before.'], 230, 2.9, { size: 70, out: OUT('finale') });
  say(ctx, u, ['Humans never have.'], 1640, 3.8, { size: 92, x: W / 2, align: 'center', out: OUT('finale'), color: '#ffd25a' });
}

function vEnd(ctx, u) {
  space(ctx, u);
  sunDisk(ctx, W / 2, 1420, 200, u, gbeat());
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ reused scenes (rave, roads, seabed, migration)
// ================================================================ 3. for an hour, the world's biggest rave
function vRave(ctx, u) {
  bgSky(ctx, ['#3a1a6a', '#7a2a8a', '#ff7aa0']);
  sunDisk(ctx, W / 2, 420, 120, u, beat(u));
  cityLayer(ctx, u, { base: 1150, seed: 5, hMin: 160, hMax: 560, wMin: 60, wMax: 140, gap: 10, col: '#2a1440', win: 'rgba(255,120,220,0.6)', winP: 0.4, ws: 8 });
  ctx.fillStyle = '#1a0a2a'; ctx.fillRect(0, 1150, W, H);
  for (let i = 0; i < 5; i++) { const a = Math.sin(u * 1.2 + i * 1.3) * 0.6 - Math.PI / 2, x = 100 + i * 220; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = ['rgba(255,80,200,0.18)', 'rgba(80,200,255,0.18)', 'rgba(255,220,80,0.18)'][i % 3]; ctx.beginPath(); ctx.moveTo(x, 1150); ctx.lineTo(x + Math.cos(a - 0.08) * 1400, 1150 + Math.sin(a - 0.08) * 1400); ctx.lineTo(x + Math.cos(a + 0.08) * 1400, 1150 + Math.sin(a + 0.08) * 1400); ctx.fill(); ctx.restore(); }
  massCrowd(ctx, u, { n: 900, yFar: 1170, yNear: 1700, sFar: 14, sNear: 90, seed: 8, col: '#140a20', arms: 0.6, panic: 0.6 });
  const bounce = Math.abs(Math.sin(Math.PI * (G_T % KICK_STEP) / KICK_STEP));
  for (let i = 0; i < 5; i++) { const x = 120 + i * 210; person2(ctx, x, 1880 - bounce * 40 * (i % 2 ? 1 : 0.6), 360, { seed: i + 1, t: u });
    ctx.strokeStyle = ['#ff5d8f', '#4cc9f0', '#ffbe0b'][i % 3]; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 70, 1880 - 360 * 0.62 - bounce * 30); ctx.lineTo(x - 110, 1880 - 360 * 1.05 - bounce * 50); ctx.moveTo(x + 70, 1880 - 360 * 0.62 - bounce * 30); ctx.lineTo(x + 110, 1880 - 360 * 1.05 - bounce * 50); ctx.stroke(); }
  pulseDim(ctx, u, 0, 0.28); safetyTag(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['8 minutes later, the light', 'arrives. For about an hour,', 'Earth is the world’s', 'biggest rave'], 230, 0.15, { size: 64, out: OUT('rave') });
}

// ================================================================ 4. the fun stops: pileups
function vRoads(ctx, u) {
  const crash = 1.4, [sx, sy] = shakeOffset(u, crash, 2.6, 16);
  bgSky(ctx, ['#4f9be0', '#8ccaf0', '#d0ecff']); ctx.translate(sx, sy);
  const vy = 900; ctx.fillStyle = '#7a9a5a'; ctx.fillRect(0, vy, W, H);
  ctx.fillStyle = '#4a4a54'; ctx.beginPath(); ctx.moveTo(W / 2 - 40, vy); ctx.lineTo(W / 2 + 40, vy); ctx.lineTo(W + 500, H); ctx.lineTo(-500, H); ctx.fill();
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 8; ctx.setLineDash([40, 40]); ctx.beginPath(); ctx.moveTo(W / 2, vy); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
  const cars = []; for (let lane = -1; lane <= 1; lane += 2) for (let z = 1.3; z < 14; z *= 1.35) cars.push([lane, z]);
  cars.sort((a, b) => b[1] - a[1]);
  const C = ['#e63946', '#3a86ff', '#ffbe0b', '#f1f1f1', '#2ec4b6', '#8338ec'];
  cars.forEach(([lane, z], i) => { const s = 1 / z, x = W / 2 + lane * 200 * s, y = vy + 900 * s, hit = u > crash + (z - 1.3) * 0.08, rot = hit ? ((i * 37) % 7 - 3) * 0.12 * R2((u - crash) * 2) : 0, w = 230 * s, h = 120 * s;
    ctx.save(); ctx.translate(x + (hit ? (i % 2 ? 1 : -1) * 40 * s * R2(u - crash) : 0), y); ctx.rotate(rot); ctx.fillStyle = C[i % 6]; roundRect(ctx, -w / 2, -h, w, h, 18 * s); ctx.fill();
    ctx.fillStyle = 'rgba(20,24,40,0.6)'; roundRect(ctx, -w * 0.36, -h * 0.95, w * 0.72, h * 0.4, 10 * s); ctx.fill(); ctx.restore();
    if (hit && s > 0.2) for (let k = 0; k < 4; k++) puff(ctx, x, y - h - (u - crash) * 120 * s - k * 40 * s, (30 + k * 12) * s * (1 + R2(u - crash)), '#8a8a90', 0.5 * R2(1 - (u - crash) / 3)); });
  if (u < crash) pulseDim(ctx, u, 0, 0.28);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Then the fun stops.'], 230, 0.15, { size: 92, out: 1.3 });
  say(ctx, u, ['Drivers can’t judge speed', 'or distance. Pileups on', 'every highway.'], 230, 1.4, { size: 72, out: OUT('roads') });
}

// ================================================================ 10. the oceans lock into ice; ships stranded
function vSeabed(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.6));
  bgSky(ctx, ['#8aa0b8', '#b8c8d8', '#e0e8f0']);
  const sea = lerp(1050, 1550, k);
  ctx.fillStyle = '#8a7a5a'; ctx.fillRect(0, 1050, W, H); ctx.fillStyle = '#6a5a40'; for (let i = 0; i < 20; i++) { const r = rng(i); ctx.beginPath(); ctx.ellipse(r() * W, 1100 + r() * 800, 40 + r() * 60, 10, 0, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#4a7aa0'; ctx.fillRect(0, sea, W, H); ctx.fillStyle = 'rgba(240,248,255,0.7)'; ctx.fillRect(0, sea, W, 30);
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, 980, 420, 40); for (let i = 0; i < 5; i++) ctx.fillRect(30 + i * 90, 1020, 18, 300);
  [[640, 1320, 0.9, 0.18], [300, 1480, 0.7, -0.12]].forEach(([x, y, s, tilt]) => { const yy = Math.min(y, sea - 10); ctx.save(); ctx.translate(x, yy); ctx.rotate(tilt * k); ctx.scale(s, s); ctx.fillStyle = '#263a6a'; ctx.beginPath(); ctx.moveTo(-260, -40); ctx.lineTo(260, -40); ctx.lineTo(220, 20); ctx.lineTo(-220, 20); ctx.fill(); ctx.fillStyle = '#e8e8f0'; ctx.fillRect(-80, -120, 140, 80); ctx.restore(); });
  snowfall(ctx, u, 80, 7, 0.7);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.5);
  say(ctx, u, ['Over centuries, oceans lock', 'into ice sheets. Seas drop.'], 230, 0.15, { size: 68, out: 2.6 });
  say(ctx, u, ['Last ice age:', '120 meters lower'], 230, 2.7, { size: 88, out: OUT('seabed') });
}

// ================================================================ 11. the great migration south
function vMigrate(ctx, u) {
  bgSky(ctx, ['#c8d4e0', '#e0e4e8', '#ffe0b0']);
  glow(ctx, W / 2, 1050, 400, '255,210,140', 0.6); ctx.fillStyle = '#ffd88a'; ctx.beginPath(); ctx.arc(W / 2, 1050, 70, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#eef2f6'; ctx.fillRect(0, 1080, W, H);
  for (let i = 0; i < 6; i++) { const x = 200 + i * 140, y = 1100; ctx.fillStyle = ['#e63946', '#3a86ff', '#ffbe0b'][i % 3]; ctx.beginPath(); ctx.moveTo(x - 30, y + 20); ctx.lineTo(x, y - 10); ctx.lineTo(x + 30, y + 20); ctx.fill(); }
  massCrowd(ctx, u, { n: 1400, yFar: 1100, yNear: 2150, sFar: 8, sNear: 160, seed: 9, x0: 140, x1: 940, col: '#3a3a4a', flow: 0 });
  snowfall(ctx, u, 90, 5, 0.6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['Billions head for the', 'equator. Crops fail.'], 230, 0.15, { size: 80, out: OUT('migrate') });
  bigNum(ctx, u, 'Billions could die', 1640, 1.4, { size: 84, color: '#ffffff', out: OUT('migrate') });
  if (u > 1.6) say(ctx, u, ['(est.)'], 1740, 1.6, { size: 40, weight: 800, x: W / 2, align: 'center', out: OUT('migrate') });
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
