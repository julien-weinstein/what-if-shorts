// What if everyone on Earth fell asleep at the same second, for one hour?  (style 3: pop editorial)
//
// PLOT-HOLE CHECK (answered on screen or in the script):
//  - "Autopilot would fly the planes": yes at cruise, and we say so. The danger is takeoff/landing.
//  - "Trains?": most have dead-man's / vigilance devices that brake automatically. Shown as fine.
//  - "Nuclear plants?": automatic safety systems; an hour is not a problem. Shown as fine.
//  - "Self-driving cars?": a tiny share of traffic; doesn't change the picture.
//  - "Why would everyone fall asleep?": that's the premise; we don't pretend otherwise.
//  - "Why not more deaths at home?": most people just wake up. We focus on people in motion,
//    in water, mid-operation, and on unattended fires.
// Facts: ~313 million operations a year (Lancet, 2012 data) means tens of thousands under way at
// any moment; ET343 (Aug 2022): both pilots reportedly asleep at 37,000 ft, overflew Addis Ababa,
// woken by the autopilot-disconnect alarm.
const SHORT = {
  title: 'What if everyone on Earth fell asleep for one hour?',
  duration: 51,
  sfx: [
    [0.0, 'rumble:4.5'], [1.0, 'heartbeat:3.5'], [4.4, 'braam'],
    [5.0, 'whoosh'], [5.6, 'jet:5'], [6.6, 'skid'], [7.2, 'crash'], [8.0, 'crash'], [9.0, 'horn:2'],
    [11.0, 'whoosh'], [11.4, 'jet:5'], [14.2, 'dive'], [15.2, 'boom'],
    [17.0, 'whoosh'], [17.4, 'underwater:4.5'],
    [22.0, 'whoosh'], [22.3, 'ecg:4.5'],
    [27.0, 'whoosh'], [27.4, 'fire:5.5'], [29.4, 'boom'], [31.0, 'alarmbeep:1.8'],
    [33.0, 'whoosh'], [33.8, 'tickmark'], [34.9, 'tickmark'], [36.0, 'tickmark'],
    [38.0, 'whoosh'], [38.4, 'gasp'], [39.0, 'siren:4.5'], [40.6, 'busy:2.2'],
    [43.0, 'whoosh'], [43.4, 'jet:4'], [46.2, 'apalarm'],
    [48.0, 'whoosh'], [48.3, 'ding'],
  ],
  music: { bpm: 92, mode: 'dark', until: 50.6, duckAt: [[4.3, 5.6], [33.0, 38.0], [46.0, 48.0]] },
};

const CLOCKS = [[4.4, 'T+00:00:00'], [5, 'T+00:00:02'], [11, 'T+00:00:30'], [17, 'T+00:03:00'], [22, 'T+00:05:00'], [27, 'T+00:20:00'], [38, 'T+01:00:00'], [43, null]];

function render(ctx, t) {
  sequence(ctx, t, [[0, sHook], [5, sRoads], [11, sSkies], [17, sWater], [22, sHospital], [27, sFires], [33, sCheck], [38, sWake], [43, sTwist], [48, sEnd]]);
  let clock = null; for (const [at, c] of CLOCKS) if (t >= at) clock = c;
  if (t < 48) hudPop(ctx, t, clock, SHORT.duration);
}

// ----- illustration helpers
function eyePop(ctx, x, y, w, open, iris = P.coral) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = P.white; ctx.lineWidth = w * 0.03; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (open < 0.12) {
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, w * 0.2, w / 2, 0); ctx.stroke();
    for (let i = -2; i <= 2; i++) { const u = 0.5 + i * 0.17, px = -w / 2 + w * u, py = 2 * u * (1 - u) * w * 0.2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + i * 10, py + w * 0.08); ctx.stroke(); }
    ctx.restore(); return;
  }
  const h = w * 0.42 * open;
  const almond = () => { ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath(); };
  almond(); ctx.fillStyle = P.white; ctx.fill();
  ctx.save(); almond(); ctx.clip();
  const ig = ctx.createRadialGradient(-w * 0.04, -w * 0.04, 2, 0, 0, w * 0.2);
  ig.addColorStop(0, P.peach); ig.addColorStop(1, iris);
  ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(0, 0, w * 0.19, 0, 6.283); ctx.fill();
  ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, 0, w * 0.085, 0, 6.283); ctx.fill();
  ctx.fillStyle = P.white; ctx.beginPath(); ctx.arc(w * 0.05, -w * 0.05, w * 0.03, 0, 6.283); ctx.fill();
  ctx.restore(); ctx.restore();
}

function carPop(ctx, x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(27,22,64,0.25)'; roundRect(ctx, -30, -50, 70, 112, 18); ctx.fill();   // shadow
  ctx.fillStyle = col; roundRect(ctx, -34, -58, 68, 116, 18); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; roundRect(ctx, -24, -34, 48, 36, 10); ctx.fill();   // windshield
  ctx.fillStyle = 'rgba(27,22,64,0.25)'; roundRect(ctx, -24, 14, 48, 22, 8); ctx.fill();
  ctx.fillStyle = '#fff6c2'; ctx.fillRect(-28, -60, 14, 6); ctx.fillRect(14, -60, 14, 6);
  ctx.fillStyle = P.coral; ctx.fillRect(-28, 54, 14, 6); ctx.fillRect(14, 54, 14, 6);
  ctx.restore();
}

function planePop(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  shadowed(ctx, () => {
    ctx.fillStyle = grad(ctx, ['#ffffff', '#dfe6f5'], 0, -16, 0, 16);
    ctx.beginPath(); ctx.ellipse(0, 0, 130, 16, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#e8edf8';
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-40, -95); ctx.lineTo(-64, -95); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-40, 95); ctx.lineTo(-64, 95); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.violet;
    ctx.beginPath(); ctx.moveTo(-105, 0); ctx.lineTo(-138, -44); ctx.lineTo(-122, -44); ctx.lineTo(-95, 0); ctx.closePath(); ctx.fill();
  }, 30, 20);
  ctx.fillStyle = P.violet; for (let i = -70; i < 90; i += 22) { ctx.beginPath(); ctx.arc(i, -3, 4.5, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

function puff(ctx, t, x, y, at, size = 1, col = '255,255,255') {
  const k = prog(t, at, at + 1.6); if (k <= 0 || k >= 1) return;
  const r = rng(Math.floor(x + y));
  for (let i = 0; i < 9; i++) {
    const a = r() * 6.283, d = easeOut(k) * 140 * size * (0.4 + r());
    ctx.fillStyle = `rgba(${col},${0.85 * (1 - k)})`;
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6 - k * 80 * size, (50 + r() * 60) * size * (0.6 + k), 0, 6.283); ctx.fill();
  }
  ctx.fillStyle = `rgba(255,190,90,${0.9 * (1 - k * 2.2)})`; ctx.beginPath(); ctx.arc(x, y, 70 * size * (0.5 + k), 0, 6.283); ctx.fill();
}

function swimmer(ctx, x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 30; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -98, 30, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -20, 32, 54, 0, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -45); ctx.lineTo(-50, -5); ctx.moveTo(0, -45); ctx.lineTo(52, -15);
  ctx.moveTo(-10, 25); ctx.lineTo(-30, 100); ctx.moveTo(10, 25); ctx.lineTo(30, 96); ctx.stroke();
  ctx.restore();
}

function building(ctx, x, w, h, base, col, t, burn, seed) {
  shadowed(ctx, () => { ctx.fillStyle = grad(ctx, [col, shade(col, -0.18)], x, base - h, x + w, base); ctx.fillRect(x, base - h, w, h); }, 30, 0);
  const r = rng(seed);
  for (let y = base - h + 40; y < base - 40; y += 64) for (let xx = x + 26; xx < x + w - 50; xx += 56) {
    const v = r(), b = v < burn * 0.55;
    ctx.fillStyle = b ? (Math.sin(t * 12 + xx + y) > 0 ? '#ff7a3d' : '#ffc93c') : v > 0.5 ? 'rgba(255,240,200,0.9)' : 'rgba(255,255,255,0.25)';
    roundRect(ctx, xx, y, 32, 40, 6); ctx.fill();
    if (b) glow(ctx, xx + 16, y + 20, 70, '255,140,60', 0.35);
  }
}
function shade(hex, k) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).map(v => Math.round(clamp(v * (1 + k), 0, 255)));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

// ----- scenes
function sHook(ctx, t) {
  sky(ctx, ['#3b2d9e', '#8e4fd6', '#ff7aa8', '#ffb38a']);
  drift(ctx, t, 0, 5, 1.0, 1.06, W / 2, 1200);
  glow(ctx, W / 2, 1200, 520, '255,255,255', 0.22);
  for (let k = 0; k < 3; k++) { const pr = ((t * 0.8 + k / 3) % 1);
    ctx.strokeStyle = `rgba(255,255,255,${0.35 * (1 - pr)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W / 2, 1200, 300 + pr * 320, 0, 6.283); ctx.stroke(); }
  shadowed(ctx, () => eyePop(ctx, W / 2, 1200, 560, 1 - easeInOut(prog(t, 2.6, 4.4))), 50, 20);
  bokeh(ctx, t, 'rgba(255,255,255,', 18, 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, t, ['What if everyone', 'on Earth fell asleep', 'at the same second?'], 400, 0.3, { size: 90, out: 4.7, mark: { line: 2, from: 7, to: 18, color: P.coral } });
  say(ctx, t, ['8.2 billion people. One hour.'], 1700, 3.0, { size: 48, weight: 700, out: 4.7 });
}

function sRoads(ctx, t) {
  sky(ctx, ['#2b2a7a', '#7a3fb8', '#ff6b5b', '#ffb38a']);
  glow(ctx, W / 2, 820, 360, '255,201,120', 0.7);
  ctx.fillStyle = '#ffd59e'; ctx.beginPath(); ctx.arc(W / 2, 820, 120, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#5b3aa8'; ctx.beginPath(); ctx.moveTo(0, 900); ctx.quadraticCurveTo(300, 780, 620, 880); ctx.quadraticCurveTo(880, 820, W, 870); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = '#3d2a86'; ctx.fillRect(0, 900, W, H);
  drift(ctx, t, 5, 11, 1.0, 1.05, W / 2, 1400);
  const vx = W / 2, vy = 900;
  ctx.fillStyle = grad(ctx, ['#4b4f8a', '#2f2f66'], 0, vy, 0, H);
  ctx.beginPath(); ctx.moveTo(vx - 30, vy); ctx.lineTo(vx + 30, vy); ctx.lineTo(W + 600, H); ctx.lineTo(-600, H); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 7;
  for (let k = 0; k < 14; k++) { const d = ((k / 14) + (t - 5) * 0.8 * (1 - prog(t, 6.6, 7.4))) % 1, d2 = d + 0.025;
    for (const lane of [-0.33, 0.33]) { ctx.beginPath(); ctx.moveTo(vx + lane * 1500 * d * d, vy + (H - vy) * d * d); ctx.lineTo(vx + lane * 1500 * d2 * d2, vy + (H - vy) * d2 * d2); ctx.stroke(); } }
  const drf = prog(t, 6.4, 8.4);
  const cols = [P.coral, P.gold, P.teal, P.sky, P.pink, '#ffffff', P.lime, P.peach];
  [[-0.5, 0.5, 1], [-0.12, 0.38, -1], [0.22, 0.46, 1], [0.5, 0.62, -1], [-0.3, 0.72, 1], [0.32, 0.84, -1], [-0.02, 0.6, 1], [0.6, 0.32, -1]].forEach(([lane, d, dir], i) => {
    const sway = drf * dir * (0.25 + (i % 4) * 0.12);
    const x = vx + (lane + sway) * 1500 * d * d, y = vy + (H - vy) * d * d;
    carPop(ctx, x, y, 0.45 + d * 1.6, sway * 1.5, cols[i]);
  });
  puff(ctx, t, 380, 1500, 7.2, 1.1); puff(ctx, t, 720, 1350, 8.0, 0.9);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  pill(ctx, t, 'T+00:00:02 · ROADS', 300, 5.3, 10.7, P.coral);
  say(ctx, t, ['Every driver.', 'Hands off the wheel.'], 470, 5.5, { size: 90, out: 10.6, mark: { line: 1, from: 0, to: 9, color: P.coral } });
  note(ctx, t, 720, 1350, 'Millions of cars in motion', 8.6, { dx: -120, dy: 260, out: 10.6, size: 34 });
}

function sSkies(ctx, t) {
  sky(ctx, ['#2f8cff', '#52b8ff', '#bfe6ff']);
  glow(ctx, 860, 360, 300, '255,240,200', 0.6);
  for (const [x, y, s, v] of [[60, 620, 0.9, 25], [640, 760, 1.1, 40], [-80, 1080, 1.0, 30], [700, 1240, 0.8, 18]]) cloud(ctx, (x + (t - 11) * v) % (W + 300) - 150, y, s, 0.9);
  drift(ctx, t, 11, 17, 1.0, 1.04);
  planePop(ctx, 240 + (t - 11) * 70, 1000, 0.75, 0);
  const k = prog(t, 11.4, 15.2);
  if (t < 15.2) planePop(ctx, lerp(1160, 520, k), lerp(980, 1560, Math.pow(k, 1.4)), 0.6, 0.55 + k * 0.25);
  ctx.fillStyle = grad(ctx, ['#7fd36b', '#4fb35a'], 0, 1580, 0, H); ctx.fillRect(0, 1580, W, H);
  ctx.fillStyle = '#5a6078'; ctx.fillRect(80, 1620, 760, 60);
  ctx.fillStyle = '#fff'; for (let i = 0; i < 11; i++) ctx.fillRect(110 + i * 66, 1646, 36, 8);
  puff(ctx, t, 520, 1590, 15.2, 1.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  note(ctx, t, 240 + (t - 11) * 70 * 1.04, 1000, 'Cruising: autopilot holds', 11.7, { dx: 60, dy: 170, out: 16.6, color: P.mint, size: 32 });
  pill(ctx, t, 'T+00:00:30 · SKIES', 300, 11.3, 16.7, P.sky);
  say(ctx, t, ['Planes at cruise? Fine.'], 470, 11.5, { size: 82, out: 16.6 });
  say(ctx, t, ['Taking off or landing?', "Nobody's flying."], 590, 12.8, { size: 72, out: 16.6, mark: { line: 1, from: 0, to: 16, color: P.coral } });
}

function sWater(ctx, t) {
  sky(ctx, ['#7ff0e0', '#14c8b4', '#0c7fa8', '#0b4f7a']);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 6; i++) { const x = 40 + i * 200 + Math.sin(t * 0.6 + i) * 30;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 80, 0); ctx.lineTo(x + 260, H); ctx.lineTo(x + 150, H); ctx.fill(); }
  // surface + surfboard
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(0, 260);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 250 + Math.sin(x / 60 + t * 2) * 10); ctx.lineTo(W, 0); ctx.lineTo(0, 0); ctx.fill();
  shadowed(ctx, () => { ctx.fillStyle = P.coral; ctx.beginPath(); ctx.ellipse(780, 245 + Math.sin(t * 2) * 8, 150, 26, 0.05, 0, 6.283); ctx.fill(); }, 20, 10);
  drift(ctx, t, 17, 22, 1.0, 1.05);
  const sink = easeInOut(prog(t, 17.4, 21.8));
  [[320, 0.8, -0.3], [720, 0.65, 0.4], [540, 0.55, 1.2]].forEach(([x, s, r], i) =>
    swimmer(ctx, x + Math.sin(t + i) * 12, 980 + i * 120 + sink * 340, s, r + sink * 0.4, 'rgba(10,60,90,0.75)'));
  bokeh(ctx, t * 6, 'rgba(255,255,255,', 30, 9);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  pill(ctx, t, 'T+00:03:00 · WATER', 420, 17.3, 21.7, P.teal);
  say(ctx, t, ['Anyone in the water —', 'swimmers, divers, surfers —'], 590, 17.6, { size: 70, out: 21.6 });
  say(ctx, t, ['drowns within minutes.'], 760, 18.8, { size: 78, out: 21.6, mark: { line: 0, from: 7, to: 21, color: P.coral } });
}

function sHospital(ctx, t) {
  sky(ctx, ['#e9fff7', '#a8f0d8', '#4fd1c5']);
  drift(ctx, t, 22, 27, 1.0, 1.05, W / 2, 1150);
  glow(ctx, W / 2, 960, 520, '255,255,255', 0.85);
  shadowed(ctx, () => { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(W / 2, 930, 230, 60, 0, 0, 6.283); ctx.fill(); }, 30, 12);
  shadowed(ctx, () => { ctx.fillStyle = '#2f8f9d'; roundRect(ctx, 170, 1130, 740, 110, 40); ctx.fill(); }, 40, 20);
  ctx.fillStyle = '#7ad3c8'; roundRect(ctx, 200, 1100, 680, 70, 35); ctx.fill();
  // monitor card
  shadowed(ctx, () => { ctx.fillStyle = P.ink; roundRect(ctx, 140, 1340, 800, 300, 34); ctx.fill(); }, 40, 20);
  ctx.save(); roundRect(ctx, 160, 1360, 760, 260, 24); ctx.clip();
  ctx.strokeStyle = P.mint; ctx.lineWidth = 6; ctx.beginPath();
  const chaos = prog(t, 24.0, 25.5);
  for (let x = 0; x <= 760; x += 4) {
    const f = ((x / 760) * 6 + (t - 22) * 3) % 1;
    let y = (f > 0.4 && f < 0.48) ? -110 * Math.sin((f - 0.4) / 0.08 * Math.PI) : 0;
    y = lerp(y, Math.sin(x * 0.09 + t * 20) * 60 * Math.sin(x * 0.013 + t), chaos);
    x === 0 ? ctx.moveTo(160 + x, 1500 + y) : ctx.lineTo(160 + x, 1500 + y);
  }
  ctx.strokeStyle = chaos > 0.5 ? P.coral : P.mint; ctx.stroke(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  pill(ctx, t, 'T+00:05:00 · HOSPITALS', 300, 22.3, 26.7, P.teal);
  say(ctx, t, ['Tens of thousands', 'of operations.'], 470, 22.5, { size: 88, out: 26.6, color: P.ink, shadow: false });
  say(ctx, t, ['Mid-procedure.', 'Nobody watching.'], 700, 23.8, { size: 70, out: 26.6, color: P.ink, shadow: false, mark: { line: 1, from: 0, to: 16, color: P.gold } });
}

function sFires(ctx, t) {
  sky(ctx, ['#4a3bb8', '#c25bc4', '#ff8a6b', '#ffc38a']);
  drift(ctx, t, 27, 33, 1.0, 1.06, W / 2, 1300);
  const burn = easeInOut(prog(t, 27.6, 32.4));
  const r = rng(12);
  for (let i = 0; i < 12; i++) { const k = (t * 0.2 + r()) % 1, x = r() * W;
    ctx.fillStyle = `rgba(120,90,150,${0.45 * (1 - k) * burn})`; ctx.beginPath(); ctx.arc(x + k * 140, 1300 - k * 1100, 100 + k * 200, 0, 6.283); ctx.fill(); }
  building(ctx, 30, 320, 900, 1760, '#ff9fb0', t, burn, 1);
  building(ctx, 370, 340, 1100, 1760, '#b9a6ff', t, burn, 2);
  building(ctx, 730, 320, 820, 1760, '#ffc1a1', t, burn, 3);
  ctx.fillStyle = '#4b3a8f'; ctx.fillRect(0, 1750, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  pill(ctx, t, 'T+00:20:00 · CITIES', 300, 27.3, 32.7, P.gold);
  say(ctx, t, ['Pans left on the stove.'], 470, 27.5, { size: 84, out: 32.6 });
  say(ctx, t, ['No one awake', 'to put out the fires.'], 600, 28.8, { size: 74, out: 32.6, mark: { line: 1, from: 7, to: 20, color: P.coral } });
}

function sCheck(ctx, t) {
  sky(ctx, ['#fff7ee', '#ffe7d6']);
  pill(ctx, t, 'PLOT-HOLE CHECK', 300, 33.2, 1e9, P.violet);
  say(ctx, t, ["What doesn't break."], 470, 33.4, { size: 90, color: P.ink, shadow: false, mark: { line: 0, from: 5, to: 12, color: P.gold } });
  const items = [['Trains', "Dead-man's switches brake automatically", P.sky], ['Nuclear plants', 'Automatic safety systems take over', P.teal], ['Planes at cruise', 'Autopilot holds altitude', P.violet]];
  items.forEach(([a, b, col], i) => {
    const at = 33.8 + i * 1.1, y = 660 + i * 300;
    if (t < at) return;
    const p = easeOut(prog(t, at, at + 0.45));
    ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 40);
    shadowed(ctx, () => { ctx.fillStyle = '#fff'; roundRect(ctx, P.margin, y, W - 2 * P.margin, 230, 36); ctx.fill(); }, 40, 16);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(P.margin + 90, y + 115, 52, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(P.margin + 66, y + 115); ctx.lineTo(P.margin + 84, y + 135); ctx.lineTo(P.margin + 66 + 54 * p, y + 92); ctx.stroke();
    ctx.font = `900 50px ${P.sans}`; ctx.fillStyle = P.ink; ctx.textAlign = 'left'; ctx.fillText(a, P.margin + 180, y + 100);
    ctx.font = `600 36px ${P.sans}`; ctx.fillStyle = '#6a6488'; ctx.fillText(b, P.margin + 180, y + 156);
    ctx.restore();
  });
}

function sWake(ctx, t) {
  sky(ctx, ['#6c4cff', '#ff6b8a', '#ffb38a', '#ffe2a8']);
  glow(ctx, W / 2, 1500, 520, '255,226,168', 0.9);
  drift(ctx, t, 38, 43, 1.06, 1.0, W / 2, 1200);
  const r = rng(5);
  for (let i = 0; i < 10; i++) { const k = (t * 0.18 + r()) % 1;
    ctx.fillStyle = `rgba(110,80,140,${0.4 * (1 - k)})`; ctx.beginPath(); ctx.arc(r() * W + k * 120, 1500 - k * 1100, 100 + k * 220, 0, 6.283); ctx.fill(); }
  skyline(ctx, 1760, '#3b2a7a', 0, t);
  ctx.fillStyle = '#3b2a7a'; ctx.fillRect(0, 1750, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 39.2) { sky(ctx, ['#3b2d9e', '#8e4fd6', '#ff7aa8']); eyePop(ctx, W / 2, 1150, 560, easeOut(prog(t, 38.1, 38.9))); }
  pill(ctx, t, 'T+01:00:00 · EVERYONE', 300, 39.2, 42.7, P.coral);
  say(ctx, t, ['8 billion people', 'wake up at once.'], 470, 39.4, { size: 90, out: 42.6 });
  say(ctx, t, ['To smoke, wreckage —', 'and no signal.'], 700, 40.6, { size: 68, out: 42.6, mark: { line: 1, from: 4, to: 13, color: P.violet } });
}

function sTwist(ctx, t) {
  sky(ctx, ['#1f2a7a', '#3a4fc4', '#7c8cf0', '#ffb38a']);
  stars(ctx, t, 0.6);
  drift(ctx, t, 43, 48, 1.0, 1.04);
  planePop(ctx, lerp(-200, W + 200, prog(t, 43, 48)), 1200, 0.85, 0);
  ctx.fillStyle = '#2a2f6e'; ctx.fillRect(0, 1620, W, H);
  for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 3 ? '#ffe2a8' : P.coral; ctx.beginPath(); ctx.arc(150 + i * 66, 1660, 8, 0, 6.283); ctx.fill(); glow(ctx, 150 + i * 66, 1660, 30, '255,226,168', 0.5); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  pill(ctx, t, 'THIS ALREADY HAPPENED', 300, 43.2, 1e9, P.gold);
  say(ctx, t, ['August 2022.', '37,000 ft.'], 470, 43.4, { size: 90 });
  say(ctx, t, ['Both pilots of an Ethiopian', 'Airlines jet reportedly fell', 'asleep and flew past', 'their airport.'], 700, 44.4, { size: 58, weight: 800 });
  say(ctx, t, ['A cockpit alarm woke them up.'], 980, 46.2, { size: 56, weight: 800, mark: { line: 0, from: 2, to: 15, color: P.coral } });
}

function sEnd(ctx, t) {
  sky(ctx, ['#6c4cff', '#c25bc4', '#ff6b5b']);
  glow(ctx, W / 2, 700, 420, '255,255,255', 0.3);
  shadowed(ctx, () => eyePop(ctx, W / 2, 700, 380, easeOut(prog(t, 48.1, 48.7))), 40, 16);
  say(ctx, t, ['WHAT IF,'], 1080, 48.3, { size: 150, x: W / 2, align: 'center' });
  say(ctx, t, ['THOUGH?'], 1240, 48.5, { size: 150, x: W / 2, align: 'center', color: P.gold });
  pill(ctx, t, 'NEW SCENARIO EVERY DAY', 1400, 49.0, 1e9, P.coral, W / 2 - 250);
}
