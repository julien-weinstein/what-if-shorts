// What if the Sun became a strobe light?
//
// VIEWER SAFETY: no real strobing in this video. The "flicker" is a soft pulse under 2 Hz with limited contrast
// (well below the 3-flashes-per-second photosensitivity guideline), labelled "slowed down for safety".
//
// FACTS (checked):
//  - Light made in the Sun's core takes tens of thousands of years (estimates ~10,000-170,000) to random-walk out,
//    so the Sun can't physically "switch off"; premise: the surface flickers 10x a second, half the time dark.
//  - Sunlight takes ~8 min 20 s to reach Earth.
//  - Photosensitive epilepsy affects ~3% of the ~50 million people with epilepsy (~1.5 million); flicker in the 3-60 Hz
//    range (esp. 15-25 Hz) is the risk band. Flicker causes headaches/migraine more widely.
//  - Stroboscopic effect: periodic light freezes or reverses motion (water drops, wheels, fans).
//  - Emerson & Arnold (1932): algae photosynthesise nearly as efficiently per flash in flashing light; but total light is halved.
//  - Half the sunlight: equilibrium temperature scales with L^(1/4): 288 K × 0.5^0.25 ≈ 242 K (≈ −30°C) before ice
//    feedback (est.). Earth froze over in "Snowball Earth" episodes ~720-635 million years ago.
//  - Toll (est., hedged): crop failure in the cold could put billions at risk of famine.
//  - Pulsars are real cosmic strobes; the fastest known (PSR J1748-2446ad) spins 716 times a second.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['impossible', 4.5, [[0.2, 'rumble:4.2']]],
  ['warn', 4.5, [[0.2, 'heart:4.2']]],
  ['street', 4.5, [[0.2, 'swell:4.2']]],
  ['seizure', 4.5, [[0.2, 'heart:4.2']]],
  ['frozen', 5.0, [[0.2, 'swell:4.6']]],
  ['plants', 4.5, [[0.2, 'swell:4.2']]],
  ['freeze', 5.0, [[0.2, 'rumble:4.6']]],
  ['snowball', 5.0, [[0.2, 'swell:4.6']]],
  ['toll', 4.0, [[0.2, 'heart:3.8']]],
  ['pulsar', 5.5, [[0.2, 'swell:5']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the Sun became a strobe light?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 76, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, impossible: vImpossible, warn: vWarn, street: vStreet, seizure: vSeizure, frozen: vFrozen, plants: vPlants,
              freeze: vFreeze, snowball: vSnowball, toll: vToll, pulsar: vPulsar, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
// gentle, photosensitivity-safe "flicker": 1.6 Hz, max 30% dimming
const SAFE = u => 0.85 + 0.15 * Math.cos(u * 2 * Math.PI * 1.6);
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.24, saturate: 1.1 });
}
function dimmer(ctx, u, max = 0.3) { ctx.fillStyle = `rgba(10,12,30,${max * (1 - SAFE(u)) / 0.3})`; ctx.fillRect(0, 0, W, H); }
function safetyTag(ctx) { ctx.font = `800 28px ${FONT}`; const t = 'flicker slowed down for safety'; const w = ctx.measureText(t).width + 30; ctx.fillStyle = 'rgba(20,20,40,0.7)'; roundRect(ctx, W - 60 - w, 1790, w, 46, 23); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(t, W - 45 - w, 1822); }
function sunDisk(ctx, x, y, r, u, on = 1) {
  on = 0.8 + 0.2 * on;
  glow(ctx, x, y, r * 3.2, '255,210,120', 0.55 * on);
  const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r); g.addColorStop(0, mixHex('#5a4a40', '#fffbe0', on)); g.addColorStop(0.7, mixHex('#3a2a28', '#ffd24a', on)); g.addColorStop(1, mixHex('#2a1a18', '#ff9a2a', on));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  if (on > 0.3) { ctx.strokeStyle = `rgba(255,220,140,${0.5 * on})`; ctx.lineWidth = r * 0.04; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + u * 0.2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.15, y + Math.sin(a) * r * 1.15); ctx.lineTo(x + Math.cos(a) * r * (1.35 + 0.1 * Math.sin(u * 3 + i)), y + Math.sin(a) * r * (1.35 + 0.1 * Math.sin(u * 3 + i))); ctx.stroke(); } }
}
function snowfall(ctx, u, n, seed = 3, a = 0.9) { const r = rng(seed); ctx.fillStyle = `rgba(255,255,255,${a})`; for (let i = 0; i < n; i++) { const x = (r() * W + Math.sin(u + i) * 30) % W, y = (r() * H + u * (60 + r() * 100)) % H; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 4, 0, 6.283); ctx.fill(); } }

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1100);
  sunDisk(ctx, W / 2, 1100, 300, u, u < 1.0 ? 1 : SAFE(u) * 0.9 + 0.05);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the Sun', 'became a', 'strobe light?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 2, from: 0, to: 6, color: '#ffbe0b' } });
}

// ================================================================ 2. physics says no (then: say it happens anyway)
function vImpossible(ctx, u) {
  space(ctx, u);
  const cx = W / 2, cy = 1150, R = 520;
  sunDisk(ctx, cx, cy, R, u, 1);
  ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R + 2, -Math.PI / 2, 0); ctx.closePath(); ctx.fillStyle = '#05060e'; ctx.fill();
  for (const [f, c] of [[1.0, '#ff9a2a'], [0.7, '#ffc24a'], [0.25, '#fff4c0']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * f, -Math.PI / 2, 0); ctx.closePath(); ctx.fill(); }
  const r = rng(7); let x = cx + 20, y = cy - 20; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y);
  const n = Math.floor(220 * prog(u, 0.4, 4.2)); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + r() * Math.PI / 2; x += Math.cos(a) * 26 * (r() - 0.2); y += Math.sin(a) * 26 * (r() - 0.2); ctx.lineTo(Math.max(cx, Math.min(cx + R, x)), Math.min(cy, Math.max(cy - R, y))); } ctx.stroke();
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Physics says no: light', 'takes tens of thousands of', 'years to escape the core'], 230, 0.15, { size: 66, out: 2.6 });
  say(ctx, u, ['But say the surface', 'flickers 10× a second'], 230, 2.7, { size: 80, out: OUT('impossible'), mark: { line: 1, from: 0, to: 7, color: '#ffbe0b' } });
}

// ================================================================ 3. 8 minutes of warning
function vWarn(ctx, u) {
  space(ctx, u);
  const sx = 200, sy = 700, ex = 860, ey = 1500;
  sunDisk(ctx, sx, sy, 130, u, SAFE(u));
  globe(ctx, ex, ey, 110, { lon0: u * 10, lat0: 15, t: u, ink: false, sun: [-0.6, -0.6, 0.5] });
  for (let i = 0; i < 6; i++) { const f = ((u * 0.25 + i / 6) % 1), x = lerp(sx + 140, ex - 120, f), y = lerp(sy + 140, ey - 120, f); ctx.strokeStyle = `rgba(255,220,140,${0.7 * (1 - Math.abs(f - 0.5) * 1.6)})`; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(x, y, 40, Math.atan2(ey - sy, ex - sx) - 0.8, Math.atan2(ey - sy, ex - sx) + 0.8); ctx.stroke(); }
  const secs = Math.max(0, Math.round(500 - u * 110)); bigNum(ctx, u, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, 1120, 0.4, { size: 120, color: '#ffd25a', out: OUT('warn') });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Sunlight takes 8 minutes', 'to reach us. That’s', 'all the warning you get.'], 230, 0.15, { size: 70, out: OUT('warn') });
}

// ================================================================ 4. a city at noon, flickering
function vStreet(ctx, u) {
  bgSky(ctx, ['#4f9be0', '#8ccaf0', '#d0ecff']);
  sunDisk(ctx, 820, 330, 90, u, SAFE(u));
  cityLayer(ctx, u, { base: 1150, seed: 3, hMin: 160, hMax: 600, wMin: 60, wMax: 140, gap: 10, col: '#8aa0c8', win: 'rgba(255,255,255,0.6)', winP: 0.5, ws: 8 });
  ctx.fillStyle = '#9a9aa6'; ctx.fillRect(0, 1150, W, H);
  massCrowd(ctx, u, { n: 700, yFar: 1170, yNear: 2150, sFar: 14, sNear: 200, seed: 6, col: '#3a3a4a', arms: 0.35 });
  dimmer(ctx, u, 0.3); safetyTag(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Daylight now flickers', '10 times a second'], 230, 0.15, { size: 80, out: OUT('street') });
}

// ================================================================ 5. seizures and headaches
function vSeizure(ctx, u) {
  bgSky(ctx, ['#ffe0c8', '#ffd0b0', '#ffc09a']);
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200; person2(ctx, x, 1700, 360, { seed: i + 2, t: u });
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = 'rgba(90,60,140,0.6)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, 1700 - 360 * 1.1, 20 + k * 16, u * 3 + k, u * 3 + k + 4); ctx.stroke(); } }
  for (let i = 0; i < 2; i++) { const x = 300 + i * 500; glow(ctx, x, 1100, 120, i ? '230,57,70' : '58,134,255', 0.4 + 0.2 * Math.sin(u * 3 + i)); }
  dimmer(ctx, u, 0.25); safetyTag(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['~1.5 million people with', 'photosensitive epilepsy', 'are at risk of seizures'], 230, 0.15, { size: 68, out: 2.6 });
  say(ctx, u, ['Billions more get', 'pounding headaches'], 230, 2.7, { size: 80, out: OUT('seizure') });
}

// ================================================================ 6. the stroboscope effect: rain freezes midair
function vFrozen(ctx, u) {
  bgSky(ctx, ['#5a6a8a', '#8a9ab8', '#b8c4d8']);
  ctx.fillStyle = '#4a5a4a'; ctx.fillRect(0, 1300, W, H);
  const r = rng(4); ctx.fillStyle = 'rgba(200,230,255,0.85)';
  for (let i = 0; i < 260; i++) { const x = r() * W, y = 300 + r() * 1300; ctx.beginPath(); ctx.ellipse(x, y + Math.sin(u * 0.6 + i) * 3, 3, 9, 0, 0, 6.283); ctx.fill(); }
  // a car whose wheels appear to turn backwards
  const cx = 540, cy = 1520; ctx.fillStyle = '#e63946'; roundRect(ctx, cx - 240, cy - 120, 480, 110, 30); ctx.fill(); roundRect(ctx, cx - 140, cy - 200, 280, 90, 30); ctx.fill();
  ctx.fillStyle = '#bfe8ff'; roundRect(ctx, cx - 120, cy - 186, 110, 66, 12); ctx.fill(); roundRect(ctx, cx + 10, cy - 186, 110, 66, 12); ctx.fill();
  for (const wx of [cx - 140, cx + 140]) { ctx.fillStyle = '#16161e'; ctx.beginPath(); ctx.arc(wx, cy, 64, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#c8ccd8'; ctx.lineWidth = 10; const a0 = -u * 1.4;
    for (let k = 0; k < 5; k++) { const a = a0 + k * 1.2566; ctx.beginPath(); ctx.moveTo(wx, cy); ctx.lineTo(wx + Math.cos(a) * 50, cy + Math.sin(a) * 50); ctx.stroke(); }
    ctx.save(); ctx.translate(wx, cy - 100); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 40, -0.3, -2.5, true); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-34, -24); ctx.lineTo(-48, -6); ctx.lineTo(-26, -2); ctx.stroke(); ctx.restore(); }
  for (let k = 0; k < 4; k++) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx + 260 + k * 30, cy - 120 + k * 30); ctx.lineTo(cx + 340 + k * 30, cy - 120 + k * 30); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Rain looks frozen', 'in midair'], 230, 0.15, { size: 92, out: 2.5 });
  say(ctx, u, ['Car wheels seem', 'to spin backwards'], 230, 2.6, { size: 88, out: OUT('frozen') });
}

// ================================================================ 7. plants barely mind
function vPlants(ctx, u) {
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#f0e8c8']);
  sunDisk(ctx, 860, 340, 80, u, SAFE(u));
  ctx.fillStyle = '#4a7a2a'; ctx.fillRect(0, 1000, W, H);
  for (let row = 0; row < 14; row++) { const q = row / 13, y = 1020 + q * q * 880, s = 0.25 + q * 1.5, n = Math.floor(26 - q * 14);
    for (let i = 0; i < n; i++) { const x = (i + (row % 2) * 0.5) / n * W, h = 90 * s, sway = Math.sin(u * 1.5 + i + row) * 6 * s;
      ctx.strokeStyle = '#5aa02a'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway, y - h * 0.6, x + sway * 1.4, y - h); ctx.stroke();
      ctx.fillStyle = '#7ac03a'; ctx.beginPath(); ctx.ellipse(x + sway * 1.4, y - h, 10 * s, 5 * s, 0.5, 0, 6.283); ctx.fill(); } }
  dimmer(ctx, u, 0.2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Surprise: plants can use', 'flashing light just fine', '(a 1932 experiment)'], 230, 0.15, { size: 68, out: 2.6 });
  say(ctx, u, ['But they only get', 'half the sunlight'], 230, 2.7, { size: 84, out: OUT('plants') });
}

// ================================================================ 8. half the sunlight: the planet freezes
function vFreeze(ctx, u) {
  space(ctx, u);
  const k = easeInOut(prog(u, 0.4, 4.4)), cx = W / 2, cy = 1150, R = 470;
  globe(ctx, cx, cy, R, { lon0: u * 8, lat0: 20, t: u, ink: false });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const sgn of [-1, 1]) { const g = ctx.createLinearGradient(0, cy + sgn * R, 0, cy + sgn * R * (1 - 1.6 * k)); g.addColorStop(0, 'rgba(240,248,255,0.98)'); g.addColorStop(0.85, 'rgba(240,248,255,0.85)'); g.addColorStop(1, 'rgba(240,248,255,0)');
    ctx.fillStyle = g; ctx.fillRect(cx - R, sgn < 0 ? cy - R : cy + R * (1 - 1.6 * k) - 1, 2 * R, R * 1.6 * k + 2); }
  ctx.restore();
  const temp = lerp(15, -30, k);
  bigNum(ctx, u, `${temp < 0 ? '−' : '+'}${Math.abs(temp).toFixed(0)}°C`, 1760, 0.4, { size: 120, color: temp < 0 ? '#9ad8ff' : '#ffd25a', out: OUT('freeze') });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Half the sunlight.', 'The planet freezes.'], 230, 0.15, { size: 88, out: OUT('freeze') });
  if (u > 1.4) say(ctx, u, ['global average (est.)'], 1640, 1.4, { size: 40, weight: 800, x: W / 2, align: 'center', out: OUT('freeze'), color: 'rgba(255,255,255,0.8)' });
}

// ================================================================ 9. Snowball Earth (it has happened before)
function vSnowball(ctx, u) {
  bgSky(ctx, ['#8aa8c8', '#c8d8e8', '#eef4fa']);
  ctx.fillStyle = '#e8f0f8'; ctx.fillRect(0, 1100, W, H);
  ctx.strokeStyle = 'rgba(140,170,200,0.6)'; ctx.lineWidth = 4; const r = rng(3); for (let i = 0; i < 14; i++) { let x = r() * W, y = 1150 + r() * 700; ctx.beginPath(); ctx.moveTo(x, y); for (let s = 0; s < 5; s++) { x += (r() - 0.3) * 120; y += (r() - 0.5) * 40; ctx.lineTo(x, y); } ctx.stroke(); }
  [[200, 1500, 0.9], [780, 1300, 0.6]].forEach(([x, y, s]) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#5a6a7a'; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(200, 0); ctx.lineTo(160, -40); ctx.lineTo(-160, -40); ctx.fill(); ctx.fillRect(-40, -110, 80, 70); ctx.fillStyle = '#e8f0f8'; ctx.fillRect(-210, -6, 420, 20); ctx.restore(); });
  sunDisk(ctx, 860, 400, 60, u, SAFE(u) * 0.7);
  snowfall(ctx, u, 160);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['The oceans start', 'to freeze over'], 230, 0.15, { size: 88, out: 2.5 });
  say(ctx, u, ['“Snowball Earth” has happened', 'before: 700 million years ago'], 230, 2.6, { size: 64, out: OUT('snowball') });
}

// ================================================================ 10. the toll
function vToll(ctx, u) {
  bgSky(ctx, ['#2a3450', '#3a4460', '#4a5470']);
  snowfall(ctx, u, 120, 5, 0.7);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Crops fail in the cold.'], 700, 0.15, { size: 76, x: W / 2, align: 'center', out: OUT('toll') });
  bigNum(ctx, u, 'Billions at risk', 940, 0.8, { size: 108, color: '#ffffff', out: OUT('toll') });
  say(ctx, u, ['of famine (est.)'], 1070, 1.1, { size: 60, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 11. the universe already has strobe lights: pulsars
function vPulsar(ctx, u) {
  space(ctx, u);
  const cx = W / 2, cy = 1150, a = u * 1.1;   // shown rotating slowly (the real one spins 716×/s)
  for (const s of [1, -1]) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(a + (s < 0 ? Math.PI : 0)); const g = ctx.createLinearGradient(0, 0, 900, 0); g.addColorStop(0, 'rgba(160,210,255,0.85)'); g.addColorStop(1, 'rgba(160,210,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, -90); ctx.lineTo(900, 90); ctx.fill(); ctx.restore(); }
  glow(ctx, cx, cy, 160, '180,220,255', 0.9); ctx.fillStyle = '#eaf4ff'; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 6.283); ctx.fill();
  ctx.strokeStyle = 'rgba(160,210,255,0.35)'; ctx.lineWidth = 3; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.ellipse(cx, cy, 120 * k, 40 * k, a * 0.3, 0, 6.283); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The universe already', 'has strobe lights:', 'pulsars'], 230, 0.15, { size: 84, out: OUT('pulsar'), mark: { line: 2, from: 0, to: 7, color: '#2a9df4' } });
  say(ctx, u, ['The fastest flashes', '716 times a second'], 1600, 1.8, { size: 66, weight: 900, out: OUT('pulsar') });
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
