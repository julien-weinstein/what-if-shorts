// What if the Sun became a strobe light?   (v2: more life-on-Earth upheaval; techno kick in time with the "strobe")
//
// VIEWER SAFETY: no real strobing. The on-screen pulse is 1.6 Hz (96 bpm, one per kick drum), dimming the frame by at
// most ~28%: below the 3-flashes-per-second photosensitivity guideline.
//
// FACTS (checked):
//  - Light from the Sun's core takes tens of thousands of years to escape; sunlight takes ~8 min 20 s to reach Earth.
//  - ~1.5 million people have photosensitive epilepsy (~3% of ~50 million with epilepsy); flicker also causes headaches,
//    disorientation and impaired judgement of motion.
//  - Light-dark cycles set animals' circadian clocks (birds, bees, bats).
//  - Marine phytoplankton produce roughly half of Earth's oxygen and form the base of the ocean food web.
//  - Half the sunlight: equilibrium temperature 288 K × 0.5^0.25 ≈ 242 K (≈ −30°C) before ice feedback (est.).
//  - In the last ice age, sea level was ~120 m lower as water was locked into ice sheets (shown as "over centuries").
//  - Snowball Earth episodes ~720-635 million years ago; complex animal life (Ediacaran, then the Cambrian explosion)
//    appeared afterwards. Some scientists think the two are linked (hedged "soon after").
//  - Tolls are estimates (hedged): famine could put billions at risk; tropical rainforests and reefs would collapse.

const KICK_STEP = 60 / 96;
const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6'], [1.25, 'kick:2.2']]],
  ['physics', 4.5, [[0.2, 'rumble:4.2']]],
  ['rave', 4.5, [[0, 'kick:4.5']]],
  ['roads', 4.5, [[0, 'kick:1.3'], [1.4, 'impact'], [1.45, 'boom'], [2.6, 'boom']]],
  ['seizure', 4.0, [[0.2, 'heart:3.8']]],
  ['animals', 4.5, [[0, 'kick:4.5']]],
  ['frozen', 4.0, [[0, 'kick:4.0']]],
  ['plankton', 4.5, [[0.2, 'rumble:4.2']]],
  ['july', 4.5, [[0.2, 'swell:4.2']]],
  ['seabed', 4.5, [[0.2, 'rumble:4.2']]],
  ['migrate', 4.5, [[0.2, 'heart:4.2']]],
  ['extinct', 4.0, [[0.2, 'rumble:3.8']]],
  ['disco', 6.0, [[0, 'kick:6.0'], [3.0, 'swell:3']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0 && !cues.some(c => c[0] === 0 && c[1].startsWith('kick'))) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(3), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the Sun became a strobe light?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 96, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, physics: vPhysics, rave: vRave, roads: vRoads, seizure: vSeizure, animals: vAnimals, frozen: vFrozen, plankton: vPlankton,
              july: vJuly, seabed: vSeabed, migrate: vMigrate, extinct: vExtinct, disco: vDisco, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
// beat-synced pulse: brightest on each kick, then eases dark; 1.6 Hz, max 28% dimming (photosensitivity-safe)
const beat = (u, off = 0) => { const p = (((u - off) % KICK_STEP) + KICK_STEP) % KICK_STEP / KICK_STEP; return Math.exp(-p * 4.5); };
function pulseDim(ctx, u, off = 0, max = 0.28) { ctx.fillStyle = `rgba(8,10,26,${max * (1 - beat(u, off))})`; ctx.fillRect(0, 0, W, H); }
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
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

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1100);
  const b = u < 1.25 ? 1 : beat(u, 1.25);
  sunDisk(ctx, W / 2, 1100, 300, u, b);
  if (u > 1.25) pulseDim(ctx, u, 1.25, 0.25);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700 - (u > 1.25 ? 20 * beat(u, 1.25) : 0), u > 1.25 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the Sun', 'became a', 'strobe light?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 2, from: 0, to: 6, color: '#ffbe0b' } });
}

// ================================================================ 2. physics, and 8 minutes of warning
function vPhysics(ctx, u) {
  space(ctx, u);
  const sx = 260, sy = 760, ex = 840, ey = 1500;
  sunDisk(ctx, sx, sy, 170, u, 1);
  globe(ctx, ex, ey, 120, { lon0: u * 10, lat0: 15, t: u, ink: false, sun: [-0.6, -0.6, 0.5] });
  for (let i = 0; i < 6; i++) { const f = ((u * 0.25 + i / 6) % 1), x = lerp(sx + 180, ex - 130, f), y = lerp(sy + 180, ey - 130, f); ctx.strokeStyle = `rgba(255,220,140,${0.7 * (1 - Math.abs(f - 0.5) * 1.6)})`; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(x, y, 40, Math.atan2(ey - sy, ex - sx) - 0.8, Math.atan2(ey - sy, ex - sx) + 0.8); ctx.stroke(); }
  const secs = Math.max(0, Math.round(500 - u * 110)); if (u > 2.3) bigNum(ctx, u, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, 1150, 2.3, { size: 110, color: '#ffd25a', out: OUT('physics') });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Impossible: light takes', 'millennia to escape the core.', 'But say it happens anyway.'], 230, 0.15, { size: 64, out: 1.95 });
  say(ctx, u, ['You get 8 minutes', 'of warning'], 230, 2.3, { size: 88, out: OUT('physics') });
}

// ================================================================ 3. for an hour, the world's biggest rave
function vRave(ctx, u) {
  bgSky(ctx, ['#3a1a6a', '#7a2a8a', '#ff7aa0']);
  sunDisk(ctx, W / 2, 420, 120, u, beat(u));
  cityLayer(ctx, u, { base: 1150, seed: 5, hMin: 160, hMax: 560, wMin: 60, wMax: 140, gap: 10, col: '#2a1440', win: 'rgba(255,120,220,0.6)', winP: 0.4, ws: 8 });
  ctx.fillStyle = '#1a0a2a'; ctx.fillRect(0, 1150, W, H);
  for (let i = 0; i < 5; i++) { const a = Math.sin(u * 1.2 + i * 1.3) * 0.6 - Math.PI / 2, x = 100 + i * 220; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = ['rgba(255,80,200,0.18)', 'rgba(80,200,255,0.18)', 'rgba(255,220,80,0.18)'][i % 3]; ctx.beginPath(); ctx.moveTo(x, 1150); ctx.lineTo(x + Math.cos(a - 0.08) * 1400, 1150 + Math.sin(a - 0.08) * 1400); ctx.lineTo(x + Math.cos(a + 0.08) * 1400, 1150 + Math.sin(a + 0.08) * 1400); ctx.fill(); ctx.restore(); }
  massCrowd(ctx, u, { n: 900, yFar: 1170, yNear: 1700, sFar: 14, sNear: 90, seed: 8, col: '#140a20', arms: 0.6, panic: 0.6 });
  const bounce = Math.abs(Math.sin(Math.PI * (u % KICK_STEP) / KICK_STEP));
  for (let i = 0; i < 5; i++) { const x = 120 + i * 210; person2(ctx, x, 1880 - bounce * 40 * (i % 2 ? 1 : 0.6), 360, { seed: i + 1, t: u });
    ctx.strokeStyle = ['#ff5d8f', '#4cc9f0', '#ffbe0b'][i % 3]; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 70, 1880 - 360 * 0.62 - bounce * 30); ctx.lineTo(x - 110, 1880 - 360 * 1.05 - bounce * 50); ctx.moveTo(x + 70, 1880 - 360 * 0.62 - bounce * 30); ctx.lineTo(x + 110, 1880 - 360 * 1.05 - bounce * 50); ctx.stroke(); }
  pulseDim(ctx, u, 0, 0.28); safetyTag(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['For about an hour, Earth is', 'the world’s biggest rave'], 230, 0.15, { size: 70, out: OUT('rave') });
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
  say(ctx, u, ['Drivers can’t judge speed', 'or distance. Pileups', 'everywhere.'], 230, 1.4, { size: 72, out: OUT('roads') });
}

// ================================================================ 5. seizures and hospitals
function vSeizure(ctx, u) {
  bgSky(ctx, ['#ffe0c8', '#ffd0b0', '#ffc09a']);
  ctx.fillStyle = '#e8eef4'; ctx.fillRect(0, 1200, W, H);
  for (let i = 0; i < 2; i++) { const x = 260 + i * 560; ctx.fillStyle = '#ffffff'; roundRect(ctx, x - 200, 1330, 400, 100, 20); ctx.fill(); ctx.fillStyle = '#c8d4e0'; ctx.fillRect(x - 200, 1430, 400, 20); }
  for (let i = 0; i < 5; i++) { const x = 120 + i * 210; person2(ctx, x, 1780, 340, { seed: i + 2, t: u });
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = 'rgba(90,60,140,0.6)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, 1780 - 340 * 1.1, 20 + k * 16, u * 3 + k, u * 3 + k + 4); ctx.stroke(); } }
  for (let i = 0; i < 2; i++) glow(ctx, 300 + i * 500, 1000, 120, i ? '230,57,70' : '58,134,255', 0.35 + 0.15 * Math.sin(u * 3 + i));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['~1.5 million people with', 'photosensitive epilepsy', 'risk seizures. ERs overflow.'], 230, 0.15, { size: 66, out: OUT('seizure') });
}

// ================================================================ 6. animals lose day and night
function vAnimals(ctx, u) {
  bgSky(ctx, ['#4a7ab8', '#8ab8e0', '#d8ecf8']);
  sunDisk(ctx, 860, 360, 90, u, beat(u));
  ctx.fillStyle = '#4a7a3a'; ctx.beginPath(); ctx.moveTo(0, 1500); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 1480 - Math.abs(Math.sin(x * 0.012)) * 100); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  const r = rng(5);
  for (let i = 0; i < 40; i++) { const a = u * (1 + r()) * (r() < 0.5 ? 1 : -1) + i, cx = 300 + r() * 500, cy = 700 + r() * 500, x = cx + Math.cos(a * 2) * 160, y = cy + Math.sin(a * 3) * 100, flap = Math.sin(u * 14 + i) * 10;
    ctx.strokeStyle = '#1b1b2e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 20, y - flap); ctx.quadraticCurveTo(x - 10, y - 10, x, y); ctx.quadraticCurveTo(x + 10, y - 10, x + 20, y - flap); ctx.stroke(); }
  for (let i = 0; i < 8; i++) { const x = 140 + i * 110 + Math.sin(u * 2 + i) * 40, y = 1050 + Math.cos(u * 3 + i) * 60; ctx.fillStyle = '#2a1a2a'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 40, y - 20 + Math.sin(u * 16 + i) * 10); ctx.lineTo(x - 20, y + 6); ctx.lineTo(x, y + 2); ctx.lineTo(x + 20, y + 6); ctx.lineTo(x + 40, y - 20 + Math.sin(u * 16 + i) * 10); ctx.fill(); }
  for (let i = 0; i < 14; i++) { const a = u * 3 + i, x = 600 + Math.cos(a) * (60 + i * 8), y = 1600 + Math.sin(a * 1.3) * (40 + i * 5); ctx.fillStyle = '#ffbe0b'; ctx.beginPath(); ctx.ellipse(x, y, 12, 9, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#1b1b2e'; ctx.fillRect(x - 3, y - 9, 4, 18); }
  pulseDim(ctx, u, 0, 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.5);
  say(ctx, u, ['Birds, bees and bats lose', 'track of day and night'], 230, 0.15, { size: 72, out: OUT('animals') });
}

// ================================================================ 7. the stroboscope effect: rain frozen midair
function vFrozen(ctx, u) {
  bgSky(ctx, ['#5a6a8a', '#8a9ab8', '#b8c4d8']);
  ctx.fillStyle = '#4a5a4a'; ctx.fillRect(0, 1300, W, H);
  const r = rng(4); ctx.fillStyle = 'rgba(200,230,255,0.85)'; for (let i = 0; i < 260; i++) { const x = r() * W, y = 300 + r() * 1300; ctx.beginPath(); ctx.ellipse(x, y + Math.sin(u * 0.6 + i) * 3, 3, 9, 0, 0, 6.283); ctx.fill(); }
  const cx = 540, cy = 1520; ctx.fillStyle = '#e63946'; roundRect(ctx, cx - 240, cy - 120, 480, 110, 30); ctx.fill(); roundRect(ctx, cx - 140, cy - 200, 280, 90, 30); ctx.fill();
  ctx.fillStyle = '#bfe8ff'; roundRect(ctx, cx - 120, cy - 186, 110, 66, 12); ctx.fill(); roundRect(ctx, cx + 10, cy - 186, 110, 66, 12); ctx.fill();
  for (const wx of [cx - 140, cx + 140]) { ctx.fillStyle = '#16161e'; ctx.beginPath(); ctx.arc(wx, cy, 64, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#c8ccd8'; ctx.lineWidth = 10; for (let k = 0; k < 5; k++) { const a = -u * 1.4 + k * 1.2566; ctx.beginPath(); ctx.moveTo(wx, cy); ctx.lineTo(wx + Math.cos(a) * 50, cy + Math.sin(a) * 50); ctx.stroke(); } }
  pulseDim(ctx, u, 0, 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Rain hangs frozen in midair.', 'Wheels spin backwards.'], 230, 0.15, { size: 70, out: OUT('frozen') });
}

// ================================================================ 8. the ocean's oxygen-makers starve
function vPlankton(ctx, u) {
  const k = easeInOut(prog(u, 0.6, 3.8));
  bgSky(ctx, [mixHex('#1a7aa0', '#0a2a3a', k), mixHex('#0a4a6a', '#061820', k), mixHex('#042a40', '#020a10', k)]);
  const r = rng(6); for (let i = 0; i < 320; i++) { if (r() < k * 0.8) { r(); r(); continue; } const x = (r() * W + u * 10 * r()) % W, y = 500 + r() * 1400; ctx.fillStyle = `rgba(120,255,160,${0.6 * (1 - k * 0.6)})`; ctx.beginPath(); ctx.arc(x, y, 3 + r() * 3, 0, 6.283); ctx.fill(); }
  const n = Math.round(30 * (1 - k * 0.8)); for (let i = 0; i < n; i++) { const x = ((i * 97 + u * 120) % (W + 200)) - 100, y = 900 + (i % 6) * 120 + Math.sin(u + i) * 20; ctx.fillStyle = '#c8d8e0'; ctx.beginPath(); ctx.ellipse(x, y, 30, 12, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.lineTo(x - 46, y - 12); ctx.lineTo(x - 46, y + 12); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Ocean plankton make about', 'half our oxygen. With half', 'the light, they starve.'], 230, 0.15, { size: 66, out: 2.6 });
  say(ctx, u, ['So does everything', 'that eats them'], 230, 2.7, { size: 84, out: OUT('plankton') });
}

// ================================================================ 9. no more summers
function vJuly(ctx, u) {
  bgSky(ctx, ['#8aa0b8', '#b8c8d8', '#e0e8f0']);
  ctx.fillStyle = '#e8eef4'; ctx.fillRect(0, 1250, W, H);
  ctx.fillStyle = '#c8b090'; for (let i = 0; i < 4; i++) { const x = 140 + i * 250; ctx.fillRect(x, 1150, 12, 160); ctx.fillStyle = ['#e63946', '#3a86ff', '#ffbe0b', '#2ec4b6'][i]; ctx.beginPath(); ctx.moveTo(x - 90, 1160); ctx.quadraticCurveTo(x + 6, 1060, x + 102, 1160); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x - 90, 1160); ctx.quadraticCurveTo(x + 6, 1130, x + 102, 1160); ctx.fill(); ctx.fillStyle = '#c8b090'; }
  ctx.save(); ctx.translate(800, 760); ctx.rotate(0.06); ctx.fillStyle = '#ffffff'; roundRect(ctx, -150, -170, 300, 300, 20); ctx.fill(); ctx.fillStyle = '#e63946'; roundRect(ctx, -150, -170, 300, 90, 20); ctx.fill(); ctx.fillRect(-150, -110, 300, 30);
  ctx.font = `900 54px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('JULY', 0, -108); ctx.font = `900 130px ${FONT}`; ctx.fillStyle = '#1b1b2e'; ctx.fillText('4', 0, 70); ctx.restore();
  person2(ctx, 300, 1760, 380, { seed: 5, t: u }); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(300, 1760 - 380 * 0.97, 60, 22, 0, Math.PI, 0); ctx.fill();
  snowfall(ctx, u, 220);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['Summer never comes.', 'Snow on the 4th of July.'], 230, 0.15, { size: 76, out: OUT('july') });
  bigNum(ctx, u, '+15°C → −30°C', 1640, 1.4, { size: 80, color: '#9ad8ff', out: OUT('july') });
  if (u > 1.6) say(ctx, u, ['global average (est.)'], 1740, 1.6, { size: 38, weight: 800, x: W / 2, align: 'center', out: OUT('july') });
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
  bigNum(ctx, u, 'Billions at risk of famine', 1640, 1.4, { size: 64, color: '#ffffff', out: OUT('migrate') });
  if (u > 1.6) say(ctx, u, ['(est.)'], 1740, 1.6, { size: 40, weight: 800, x: W / 2, align: 'center', out: OUT('migrate') });
}

// ================================================================ 12. rainforests and reefs freeze
function vExtinct(ctx, u) {
  const k = easeInOut(prog(u, 0.2, 3.4));
  bgSky(ctx, [mixHex('#4a8a6a', '#9aaab8', k), mixHex('#6aaa7a', '#c8d4e0', k), mixHex('#8ac08a', '#e8eef4', k)]);
  ctx.fillStyle = mixHex('#2a5a2a', '#c8d0d8', k); ctx.fillRect(0, 1100, W, 300);
  const r = rng(4); for (let i = 0; i < 24; i++) { const x = r() * W, h = 200 + r() * 300; ctx.fillStyle = mixHex('#2a6a2a', '#d8e0e8', k * (0.6 + r() * 0.4)); ctx.beginPath(); ctx.arc(x, 1100 - h * 0.6, h * 0.35, 0, 6.283); ctx.fill(); ctx.fillStyle = mixHex('#5a3a2a', '#9a9aa0', k); ctx.fillRect(x - 10, 1100 - h * 0.4, 20, h * 0.4); }
  ctx.fillStyle = mixHex('#1a6aa0', '#8aa0b0', k); ctx.fillRect(0, 1400, W, H);
  for (let i = 0; i < 9; i++) { const x = 80 + i * 120, y = 1700 + (i % 3) * 60; ctx.fillStyle = mixHex(['#ff7aa0', '#ffbe0b', '#7ae0ff'][i % 3], '#f0f0f4', k); for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc(x + (j - 2) * 16, y - j % 2 * 30 - 20, 14, 0, 6.283); ctx.fill(); } }
  snowfall(ctx, u, Math.floor(140 * k), 6, 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['Rainforests and reefs', 'freeze. A mass extinction.'], 230, 0.15, { size: 76, out: OUT('extinct') });
}

// ================================================================ 13. the finale: Earth, a frozen disco ball (to the beat)
function vDisco(ctx, u) {
  space(ctx, u);
  const b = beat(u), cx = W / 2, cy = 1180, R = 400;
  sunDisk(ctx, 900, 1680, 90, u, b);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 10; i++) { const a = u * 0.6 + i * 0.628; ctx.fillStyle = `rgba(${['255,120,220', '120,220,255', '255,230,120'][i % 3]},${0.08 + 0.12 * b})`; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a - 0.04) * 1400, cy + Math.sin(a - 0.04) * 1400); ctx.lineTo(cx + Math.cos(a + 0.04) * 1400, cy + Math.sin(a + 0.04) * 1400); ctx.fill(); } ctx.restore();
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R); g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#cfe0f0'); g.addColorStop(1, '#7a90b0'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); const rot = u * 0.6;
  for (let la = -80; la <= 80; la += 12) for (let lo = 0; lo < 360; lo += 12) { const L = lo * Math.PI / 180 + rot, P = la * Math.PI / 180, x = Math.cos(P) * Math.sin(L), y = -Math.sin(P), z = Math.cos(P) * Math.cos(L); if (z < 0) continue;
    const sx = cx + x * R, sy = cy + y * R, s = 46 * z + 6, br = (((lo * 7 + la * 13) % 11) / 11 + u * 0.8) % 1, lit = 0.35 + 0.65 * Math.pow(br, 3) * (0.5 + 0.5 * b), tint = ['#ffffff', '#cfeaff', '#ffe6f6', '#fff4c8'][(lo / 12 + la / 12 + 40) % 4 | 0];
    ctx.fillStyle = mixHex('#6a7c98', tint, lit); ctx.fillRect(sx - s * 0.46, sy - s * 0.46, s * 0.92, s * 0.92); if (lit > 0.85) glow(ctx, sx, sy, s * 1.2, '255,255,255', 0.5 * b); }
  ctx.restore();
  for (let i = 0; i < 6; i++) { const a = i * 1.05 + u, x = cx + Math.cos(a) * R * 0.7, y = cy + Math.sin(a) * R * 0.7; ctx.fillStyle = `rgba(255,255,255,${0.9 * b})`; ctx.beginPath(); ctx.moveTo(x, y - 24); ctx.quadraticCurveTo(x, y, x + 24, y); ctx.quadraticCurveTo(x, y, x, y + 24); ctx.quadraticCurveTo(x, y, x - 24, y); ctx.quadraticCurveTo(x, y, x, y - 24); ctx.fill(); }
  pulseDim(ctx, u, 0, 0.22);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Earth becomes a giant', 'frozen disco ball'], 230, 0.15, { size: 84, out: 2.9 });
  say(ctx, u, ['Last time Earth froze over,', 'complex animal life', 'evolved soon after'], 230, 3.0, { size: 70, out: OUT('disco'), mark: { line: 1, from: 0, to: 19, color: '#2a9df4' } });
}

function vEnd(ctx, u) {
  space(ctx, u);
  sunDisk(ctx, W / 2, 1420, 200, u, 1);
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
