// What if everyone on Earth fell asleep at the same second, for one hour?
//
// PLOT-HOLE CHECK (answered on screen or in the script):
//  - "Autopilot would fly the planes": yes at cruise, and we say so. The danger is planes in
//    takeoff, approach and landing, where pilots are actively flying.
//  - "Trains?": most have dead-man's / vigilance devices that brake automatically. Shown as fine.
//  - "Nuclear plants?": automatic safety systems; an hour is not a problem. Shown as fine.
//  - "Self-driving cars?": a tiny share of traffic; doesn't change the picture.
//  - "Why would everyone fall asleep?": that's the premise; we don't pretend otherwise.
//  - "Why not more deaths at home?": most people would just wake up. We focus on people
//    in motion, in water, mid-operation, and on unattended fires.
// Facts: ~313 million operations a year (Lancet, 2012 data) means tens of thousands under way
// at any moment; ~1.5 billion vehicles on Earth; ET343 (Aug 2022): both pilots reportedly
// asleep at 37,000 ft, overflew Addis Ababa, woken by the autopilot-disconnect alarm.
const SHORT = {
  title: 'What if everyone on Earth fell asleep for one hour?',
  duration: 51,
  sfx: [
    [0.0, 'rumble:4.5'], [1.0, 'heartbeat:3.5'], [4.4, 'braam'],
    [5.0, 'glitchfx'], [5.6, 'jet:5'], [6.6, 'skid'], [7.2, 'crash'], [8.0, 'crash'], [9.0, 'horn:2'],
    [11.0, 'glitchfx'], [11.4, 'jet:5'], [14.2, 'dive'], [15.2, 'boom'],
    [17.0, 'glitchfx'], [17.4, 'underwater:4.5'],
    [22.0, 'glitchfx'], [22.3, 'ecg:4.5'],
    [27.0, 'glitchfx'], [27.4, 'fire:5.5'], [29.4, 'boom'], [31.0, 'alarmbeep:1.8'],
    [33.0, 'glitchfx'], [33.8, 'tickmark'], [34.9, 'tickmark'], [36.0, 'tickmark'],
    [38.0, 'glitchfx'], [38.4, 'gasp'], [39.0, 'siren:4.5'], [40.6, 'busy:2.2'],
    [43.0, 'glitchfx'], [43.4, 'jet:4'], [46.2, 'apalarm'],
    [48.0, 'braam'],
  ],
  music: { bpm: 92, mode: 'dark', until: 50.6, duckAt: [[4.3, 5.6], [33.0, 38.0], [46.0, 48.0]] },
};

const CUTS = [5, 11, 17, 22, 27, 33, 38, 43, 48];
const CLOCKS = [[5, '00:00:02'], [11, '00:00:30'], [17, '00:03:00'], [22, '00:05:00'], [27, '00:20:00'], [33, '00:20:00'], [38, '01:00:00'], [43, null], [48, null]];

function render(ctx, t) {
  ctx.save();
  if (t < 5) sHook(ctx, t);
  else if (t < 11) sRoads(ctx, t);
  else if (t < 17) sSkies(ctx, t);
  else if (t < 22) sWater(ctx, t);
  else if (t < 27) sHospital(ctx, t);
  else if (t < 33) sFires(ctx, t);
  else if (t < 38) sCheck(ctx, t);
  else if (t < 43) sWake(ctx, t);
  else if (t < 48) sTwist(ctx, t);
  else sEnd(ctx, t);
  ctx.restore();
  let clock = t < 4.4 ? null : 'T+00:00:00';
  for (const [at, c] of CLOCKS) if (t >= at) clock = c ? 'T+' + c : null;
  finish(ctx, t, clock, SHORT.duration, t < 48);
  for (const c of CUTS) glitch(ctx, t, c);
}

// ----- drawing helpers
function eye(ctx, x, y, w, open, t) {      // open: 0 closed .. 1 open
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = S2.fg; ctx.lineWidth = 7; ctx.lineCap = 'round';
  if (open < 0.12) {                       // closed: a single curved lid with lashes
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, w * 0.2, w / 2, 0); ctx.stroke();
    for (let i = -2; i <= 2; i++) {
      const u = 0.5 + i * 0.17, px = -w / 2 + w * u, py = 2 * u * (1 - u) * w * 0.2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + i * 10, py + 46); ctx.stroke();
    }
    ctx.restore(); return;
  }
  const h = w * 0.42 * open;
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath();
  ctx.save(); ctx.clip();
  if (open > 0.25) {
    ctx.fillStyle = S2.fg; ctx.beginPath(); ctx.arc(0, 0, w * 0.17, 0, 6.283); ctx.fill();
    ctx.fillStyle = S2.bg; ctx.beginPath(); ctx.arc(0, 0, w * 0.08, 0, 6.283); ctx.fill();
    ctx.fillStyle = S2.red; ctx.beginPath(); ctx.arc(w * 0.04, -w * 0.04, w * 0.02, 0, 6.283); ctx.fill();
  }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function car(ctx, x, y, s, rot, lightsOn = true) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#141418'; ctx.fillRect(-60, -30, 120, 60);
  ctx.fillStyle = '#1d1d23'; ctx.fillRect(-35, -24, 60, 48);
  if (lightsOn) { ctx.fillStyle = S2.red; ctx.fillRect(56, -26, 8, 14); ctx.fillRect(56, 12, 8, 14); }
  ctx.restore();
}

function jet(ctx, x, y, s, rot, col = S2.fg) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(0, 0, 130, 14, 0, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-40, -95); ctx.lineTo(-62, -95); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-40, 95); ctx.lineTo(-62, 95); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-105, 0); ctx.lineTo(-135, -40); ctx.lineTo(-122, -40); ctx.lineTo(-95, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-105, 0); ctx.lineTo(-135, 40); ctx.lineTo(-122, 40); ctx.lineTo(-95, 0); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function person(ctx, x, y, s, rot, col = S2.fg) {        // silhouette, limbs slack
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(0, -98, 30, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -20, 30, 52, 0, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 20); ctx.moveTo(0, -45); ctx.lineTo(-40, 0); ctx.moveTo(0, -45); ctx.lineTo(42, -5);
  ctx.moveTo(0, 20); ctx.lineTo(-26, 95); ctx.moveTo(0, 20); ctx.lineTo(28, 92); ctx.stroke();
  ctx.restore();
}

// ----- scenes
function sHook(ctx, t) {
  ctx.fillStyle = S2.bg; ctx.fillRect(0, 0, W, H);
  push(ctx, t, 0, 5, 1.0, 1.08, W / 2, 1150);
  const open = 1 - easeInOut(prog(t, 2.6, 4.4));
  eye(ctx, W / 2, 1150, 520, open, t);
  ctx.restore(); ctx.save();
  reveal(ctx, t, ['What if everyone', 'on Earth fell asleep'], 430, 0.3, { size: 86, out: 4.7 });
  reveal(ctx, t, ['at the exact', 'same second?'], 640, 1.6, { size: 86, color: S2.red, out: 4.7 });
  reveal(ctx, t, ['8,200,000,000 people. One hour.'], 1660, 3.0, { size: 46, weight: 600, color: S2.dim, out: 4.7 });
}

function sRoads(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#050507'); g.addColorStop(1, '#16161c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  push(ctx, t, 5, 11, 1.0, 1.06, W / 2, 1300);
  const vx = W / 2, vy = 900;   // vanishing point
  ctx.fillStyle = '#101014'; ctx.beginPath(); ctx.moveTo(vx - 20, vy); ctx.lineTo(vx + 20, vy); ctx.lineTo(W + 500, H); ctx.lineTo(-500, H); ctx.fill();
  ctx.strokeStyle = 'rgba(236,232,225,0.5)'; ctx.lineWidth = 6;
  for (let k = 0; k < 14; k++) { const d = ((k / 14) + (t - 5) * 0.9) % 1, d2 = d + 0.025;
    for (const lane of [-0.33, 0.33]) { ctx.beginPath(); ctx.moveTo(vx + lane * 1500 * d * d, vy + (H - vy) * d * d); ctx.lineTo(vx + lane * 1500 * d2 * d2, vy + (H - vy) * d2 * d2); ctx.stroke(); } }
  const drift = prog(t, 6.4, 8.4);
  const cars = [[-0.55, 0.5, 1], [-0.15, 0.36, -1], [0.2, 0.44, 1], [0.5, 0.6, -1], [-0.3, 0.72, 1], [0.35, 0.82, -1], [-0.05, 0.6, 1], [0.6, 0.3, -1], [-0.45, 0.28, 1]];
  cars.forEach(([lane, d0, dir], i) => {
    const d = d0 + ((t - 5) * 0.03) * (1 - drift);
    const sway = drift * dir * (0.25 + (i % 4) * 0.12);
    const x = vx + (lane + sway) * 1500 * d * d, y = vy + (H - vy) * d * d, s = 0.5 + d * 2.0;
    const beam = ctx.createRadialGradient(x, y - 60 * s, 5, x, y - 60 * s, 160 * s);
    beam.addColorStop(0, 'rgba(255,236,200,0.35)'); beam.addColorStop(1, 'rgba(255,236,200,0)');
    ctx.fillStyle = beam; ctx.beginPath(); ctx.arc(x, y - 60 * s, 160 * s, 0, 6.283); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 1.4); ctx.translate(-x, -y);
    ctx.fillStyle = '#18181e'; ctx.fillRect(x - 32 * s, y - 62 * s, 64 * s, 110 * s);
    ctx.fillStyle = '#26262e'; ctx.fillRect(x - 26 * s, y - 40 * s, 52 * s, 40 * s);
    ctx.fillStyle = S2.red; ctx.fillRect(x - 30 * s, y + 40 * s, 16 * s, 8 * s); ctx.fillRect(x + 14 * s, y + 40 * s, 16 * s, 8 * s);
    const glow = ctx.createRadialGradient(x, y + 44 * s, 1, x, y + 44 * s, 60 * s);
    glow.addColorStop(0, 'rgba(255,59,48,0.45)'); glow.addColorStop(1, 'rgba(255,59,48,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y + 44 * s, 60 * s, 0, 6.283); ctx.fill();
    ctx.restore();
  });
  for (const [at, x, y] of [[7.2, 360, 1500], [8.0, 760, 1380]]) { const k = prog(t, at, at + 0.6);
    if (k > 0 && k < 1) { ctx.fillStyle = `rgba(255,170,90,${1 - k})`; ctx.beginPath(); ctx.arc(x, y, 60 + k * 260, 0, 6.283); ctx.fill(); } }
  ctx.restore(); ctx.save();
  kicker(ctx, t, 'T+00:00:02  ·  ROADS', 300, 5.2, 10.6);
  reveal(ctx, t, ['Every driver.', 'Hands off the wheel.'], 420, 5.5, { size: 88, out: 10.6 });
  callout(ctx, t, 760, 1380, 'MILLIONS OF CARS IN MOTION', 8.4, { dx: -120, dy: 220, out: 10.6, size: 30 });
}

function sSkies(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#04060c'); g.addColorStop(1, '#141a28');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.5);
  push(ctx, t, 11, 17, 1.0, 1.05);
  // cruising plane, steady
  jet(ctx, 260 + (t - 11) * 70, 820, 0.7, 0, S2.fg);
  // approaching plane, no one flying: drifts below the glide path and hits short of the runway
  const k = prog(t, 11.4, 15.2);
  const ax = lerp(1150, 520, k), ay = lerp(980, 1520, Math.pow(k, 1.4));
  if (t < 15.2) jet(ctx, ax, ay, 0.55, 0.55 + k * 0.25, '#b9b4ab');
  ctx.fillStyle = '#0b0b0f'; ctx.fillRect(0, 1560, W, H);
  for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? S2.fg : S2.red; ctx.fillRect(120 + i * 60, 1600, 18, 8); }
  const b = prog(t, 15.2, 16.4);
  if (b > 0 && b < 1) { ctx.fillStyle = `rgba(255,150,70,${1 - b})`; ctx.beginPath(); ctx.arc(520, 1560, 80 + b * 320, Math.PI, 0); ctx.fill(); }
  ctx.restore(); ctx.save();
  callout(ctx, t, 260 + (t - 11) * 70 * 1.05, 820, 'CRUISING: AUTOPILOT HOLDS', 11.6, { dx: 120, dy: -140, out: 16.6, color: S2.blue, size: 28 });
  kicker(ctx, t, 'T+00:00:30  ·  SKIES', 300, 11.2, 16.6);
  reveal(ctx, t, ['Planes at cruise? Fine.'], 420, 11.6, { size: 78, out: 16.6 });
  reveal(ctx, t, ['Planes taking off or landing', 'have no one flying them.'], 540, 12.8, { size: 66, weight: 700, color: S2.red, out: 16.6 });
}

function sWater(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b2a33'); g.addColorStop(1, '#020608');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  push(ctx, t, 17, 22, 1.0, 1.06);
  ctx.fillStyle = 'rgba(160,220,235,0.08)';                        // light shafts
  for (let i = 0; i < 5; i++) { const x = 100 + i * 230 + Math.sin(t * 0.5 + i) * 30;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 90, 0); ctx.lineTo(x + 260, H); ctx.lineTo(x + 140, H); ctx.fill(); }
  const sink = easeInOut(prog(t, 17.4, 21.8));
  [[330, 0.8, -0.3], [700, 0.65, 0.4], [520, 0.5, 1.2]].forEach(([x, s, r], i) =>
    person(ctx, x + Math.sin(t + i) * 12, 900 + i * 120 + sink * 380, s, r + sink * 0.4, 'rgba(236,232,225,0.75)'));
  const rr = rng(17); ctx.strokeStyle = 'rgba(236,232,225,0.35)'; ctx.lineWidth = 3;
  for (let i = 0; i < 24; i++) { const y = H - ((t - 17) * 200 + rr() * H) % H; ctx.beginPath(); ctx.arc(250 + rr() * 600, y, 4 + rr() * 10, 0, 6.283); ctx.stroke(); }
  ctx.restore(); ctx.save();
  kicker(ctx, t, 'T+00:03:00  ·  WATER', 300, 17.2, 21.6);
  reveal(ctx, t, ['Anyone in the water.'], 420, 17.5, { size: 86, out: 21.6 });
  reveal(ctx, t, ['Swimmers. Divers. Surfers.', 'Unconscious, they drown', 'within minutes.'], 560, 18.6, { size: 62, weight: 700, color: S2.dim, out: 21.6, accent: [null, S2.red, S2.red] });
}

function sHospital(ctx, t) {
  ctx.fillStyle = '#07090b'; ctx.fillRect(0, 0, W, H);
  push(ctx, t, 22, 27, 1.0, 1.06, W / 2, 1100);
  const lamp = ctx.createRadialGradient(W / 2, 700, 40, W / 2, 1050, 700);
  lamp.addColorStop(0, 'rgba(220,240,255,0.35)'); lamp.addColorStop(1, 'rgba(220,240,255,0)');
  ctx.fillStyle = lamp; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#1b2228'; ctx.fillRect(140, 1180, 800, 70);           // table
  ctx.fillStyle = '#2f6f73'; ctx.beginPath(); ctx.ellipse(W / 2, 1160, 330, 50, 0, 0, 6.283); ctx.fill();   // draped patient
  // monitor
  ctx.strokeStyle = '#2a3238'; ctx.lineWidth = 8; ctx.strokeRect(120, 1360, 840, 300);
  ctx.save(); ctx.beginPath(); ctx.rect(124, 1364, 832, 292); ctx.clip();
  ctx.strokeStyle = '#38e07b'; ctx.lineWidth = 5; ctx.beginPath();
  const chaos = prog(t, 24.0, 25.5);
  for (let x = 0; x <= 840; x += 4) {
    const ph = (x / 840) * 6 + (t - 22) * 3;
    let y = 0, f = ph % 1;
    if (f > 0.4 && f < 0.48) y = -120 * Math.sin((f - 0.4) / 0.08 * Math.PI);
    y = lerp(y, Math.sin(x * 0.09 + t * 20) * 60 * Math.sin(x * 0.013 + t), chaos);
    x === 0 ? ctx.moveTo(124 + x, 1510 + y) : ctx.lineTo(124 + x, 1510 + y);
  }
  ctx.stroke(); ctx.restore();
  ctx.restore(); ctx.save();
  kicker(ctx, t, 'T+00:05:00  ·  HOSPITALS', 300, 22.2, 26.6);
  reveal(ctx, t, ['Tens of thousands', 'of operations.'], 420, 22.5, { size: 86, out: 26.6 });
  reveal(ctx, t, ['Mid-procedure. Nobody watching', 'the anesthesia. Nobody holding', 'the bleeding.'], 640, 23.8, { size: 54, weight: 600, color: S2.dim, out: 26.6 });
}

function sFires(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060608'); g.addColorStop(1, '#2a0d08');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  push(ctx, t, 27, 33, 1.0, 1.07, W / 2, 1300);
  const spread = easeInOut(prog(t, 27.6, 32.4));
  const r = rng(44);
  for (const [bx, bw, bh] of [[40, 300, 900], [380, 320, 1080], [740, 300, 820]]) {
    ctx.fillStyle = '#0d0d11'; ctx.fillRect(bx, 1700 - bh, bw, bh);
    for (let y = 1700 - bh + 40; y < 1660; y += 70) for (let x = bx + 30; x < bx + bw - 40; x += 62) {
      const v = r(), burning = v < spread * 0.5, lit = v > 0.55;
      ctx.fillStyle = burning ? (Math.sin(t * 14 + x + y) > 0 ? '#ff5a1f' : '#ffb347') : lit ? 'rgba(255,214,150,0.55)' : '#16161b';
      ctx.fillRect(x, y, 34, 42);
    }
  }
  for (let i = 0; i < 16; i++) { const k = (t * 0.22 + r()) % 1, x = r() * W;
    ctx.fillStyle = `rgba(30,24,26,${0.6 * (1 - k) * spread})`; ctx.beginPath(); ctx.arc(x + k * 160, 1500 - k * 1300, 90 + k * 200, 0, 6.283); ctx.fill(); }
  ctx.restore(); ctx.save();
  kicker(ctx, t, 'T+00:20:00  ·  CITIES', 300, 27.2, 32.6);
  reveal(ctx, t, ['Pans left on the stove.'], 420, 27.5, { size: 82, out: 32.6 });
  reveal(ctx, t, ['No one awake to smell the smoke.', 'No firefighters to answer.'], 540, 28.8, { size: 58, weight: 700, color: S2.red, out: 32.6 });
}

function sCheck(ctx, t) {
  ctx.fillStyle = S2.bg; ctx.fillRect(0, 0, W, H);
  kicker(ctx, t, 'PLOT-HOLE CHECK', 300, 33.2);
  reveal(ctx, t, ["What doesn't break."], 430, 33.4, { size: 86 });
  const items = [['TRAINS', "Dead-man's switches brake automatically"], ['NUCLEAR PLANTS', 'Automatic safety systems take over'], ['PLANES AT CRUISE', 'Autopilot holds altitude']];
  items.forEach(([a, b], i) => {
    const at = 33.8 + i * 1.1, y = 700 + i * 260;
    if (t < at) return;
    const p = easeOut(prog(t, at, at + 0.4));
    ctx.save(); ctx.globalAlpha = p;
    ctx.strokeStyle = S2.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(S2.margin, y - 80); ctx.lineTo(W - S2.margin, y - 80); ctx.stroke();
    ctx.strokeStyle = S2.blue; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(S2.margin + 4, y - 10); ctx.lineTo(S2.margin + 24, y + 12); ctx.lineTo(S2.margin + 60 * p, y - 36); ctx.stroke();
    ctx.font = `700 44px ${S2.mono}`; ctx.fillStyle = S2.fg; ctx.textAlign = 'left'; ctx.fillText(a, S2.margin + 100, y);
    ctx.font = `500 40px ${S2.sans}`; ctx.fillStyle = S2.dim; ctx.fillText(b, S2.margin + 100, y + 62);
    ctx.restore();
  });
}

function sWake(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0a08'); g.addColorStop(1, '#3a1308');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  push(ctx, t, 38, 43, 1.08, 1.0, W / 2, 1150);
  skyline(ctx, 1700, '#0c0807', 0, t);
  ctx.fillStyle = '#0c0807'; ctx.fillRect(0, 1690, W, H);
  const r = rng(9);
  for (let i = 0; i < 12; i++) { const k = (t * 0.18 + r()) % 1;
    ctx.fillStyle = `rgba(20,14,14,${0.55 * (1 - k)})`; ctx.beginPath(); ctx.arc(r() * W + k * 120, 1500 - k * 1200, 100 + k * 220, 0, 6.283); ctx.fill(); }
  ctx.restore(); ctx.save();
  const open = easeOut(prog(t, 38.1, 38.9));
  if (t < 39.2) { ctx.fillStyle = S2.bg; ctx.fillRect(0, 0, W, H); eye(ctx, W / 2, 1150, 520, open, t); }
  kicker(ctx, t, 'T+01:00:00  ·  EVERYONE', 300, 39.2, 42.6);
  reveal(ctx, t, ['8 billion people', 'wake up at once.'], 420, 39.4, { size: 86, out: 42.6 });
  reveal(ctx, t, ['Smoke. Wreckage. No signal:', 'every phone network jams at once.'], 640, 40.6, { size: 54, weight: 600, color: S2.dim, out: 42.6 });
}

function sTwist(ctx, t) {
  ctx.fillStyle = '#05070c'; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.45);
  push(ctx, t, 43, 48, 1.0, 1.05);
  jet(ctx, lerp(-200, W + 200, prog(t, 43, 48)), 1180, 0.8, 0, S2.fg);
  for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 3 ? 'rgba(236,232,225,0.6)' : S2.red; ctx.fillRect(140 + i * 66, 1640, 16, 6); }
  ctx.font = `600 30px ${S2.mono}`; ctx.fillStyle = S2.dim; ctx.textAlign = 'left'; ctx.fillText('ADD — ADDIS ABABA  ·  FL370', 140, 1700);
  ctx.restore(); ctx.save();
  kicker(ctx, t, 'THIS ALREADY HAPPENED', 300, 43.2);
  reveal(ctx, t, ['August 2022. 37,000 ft.'], 420, 43.4, { size: 80 });
  reveal(ctx, t, ['Both pilots of an Ethiopian', 'Airlines jet reportedly fell', 'asleep and flew right past', 'their airport.'], 560, 44.4, { size: 58, weight: 700, color: S2.dim });
  reveal(ctx, t, ['The autopilot alarm woke them up.'], 860, 46.2, { size: 54, weight: 700, color: S2.red });
}

function sEnd(ctx, t) {
  ctx.fillStyle = S2.bg; ctx.fillRect(0, 0, W, H);
  reveal(ctx, t, ['WHAT IF,'], 880, 48.2, { size: 150, weight: 900, x: W / 2, align: 'center' });
  reveal(ctx, t, ['THOUGH?'], 1040, 48.4, { size: 150, weight: 900, x: W / 2, align: 'center', color: S2.red });
  kicker(ctx, t, 'NEW SCENARIO EVERY DAY', 1200, 49.0, 1e9, W / 2 - 230);
}
