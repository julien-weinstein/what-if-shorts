// Shared drawing kit for What If, Though? shorts. Everything is deterministic:
// render(t) always draws the same frame for the same t, so videos are reproducible.
const W = 1080, H = 1920;
const FONT = '"Inter Display", "Inter", system-ui, sans-serif';
const C = {
  ink: '#0b0f1e', paper: '#fff8e7', yellow: '#ffd23f', pink: '#ff5d8f',
  blue: '#3a86ff', sea: '#1d6fd1', land: '#3ccf7a', landDark: '#27a35c', moon: '#cfd3dc',
};

// ---------- timing helpers
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));          // 0..1 over [a, b]
const lerp = (a, b, p) => a + (b - a) * p;
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeBack = p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// ---------- text
function wrap(ctx, text, maxW) {
  const words = text.split(' '), lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// Big punchy caption that pops in (scale overshoot) at time `at`, optional exit at `out`.
function caption(ctx, t, text, y, at, opts = {}) {
  const { size = 92, color = C.paper, out = 1e9, maxW = 940, weight = 900 } = opts;
  if (t < at || t > out + 0.25) return;
  const pIn = easeBack(prog(t, at, at + 0.35));
  const pOut = 1 - easeInOut(prog(t, out, out + 0.25));
  const s = pIn * pOut;
  if (s <= 0.001) return;
  ctx.save();
  ctx.translate(W / 2, y);
  ctx.scale(s, s);
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lines = wrap(ctx, text, maxW);
  const lh = size * 1.08;
  lines.forEach((ln, i) => {
    const ly = (i - (lines.length - 1) / 2) * lh;
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.2; ctx.strokeStyle = color === C.ink ? C.paper : C.ink; ctx.strokeText(ln, 0, ly);
    ctx.fillStyle = color; ctx.fillText(ln, 0, ly);
  });
  ctx.restore();
}

// "6 HOURS LATER" chip that slides down from the top.
function chip(ctx, t, text, at, out = 1e9) {
  if (t < at || t > out + 0.3) return;
  const p = easeOut(prog(t, at, at + 0.3)) * (1 - easeInOut(prog(t, out, out + 0.3)));
  ctx.save();
  ctx.font = `900 52px ${FONT}`;
  const w = ctx.measureText(text).width + 70, h = 92;
  const x = W / 2 - w / 2, y = lerp(-120, 170, p);
  ctx.rotate(-0.02);
  ctx.fillStyle = C.ink; roundRect(ctx, x + 8, y + 10, w, h, 22); ctx.fill();
  ctx.fillStyle = C.yellow; roundRect(ctx, x, y, w, h, 22); ctx.fill();
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, y + h / 2 + 3);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// ---------- space
const STARS = (() => { const r = rng(7); return Array.from({ length: 260 }, () => ({ x: r() * W, y: r() * H, s: r() * 2.6 + 0.6, ph: r() * 6.28, dim: r() })); })();
function space(ctx, t, extra = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#070a1c'); g.addColorStop(1, '#151a3d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 1, extra);
}
function stars(ctx, t, alpha = 1, extra = 0) {
  for (const s of STARS) {
    const vis = s.dim < 0.55 ? 1 : extra;           // the dimmer half only shows on dark nights
    if (vis <= 0) continue;
    const tw = 0.6 + 0.4 * Math.sin(t * 2.2 + s.ph);
    ctx.globalAlpha = alpha * vis * tw;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---------- Earth (stylised flat globe with rotating blob continents)
const CONTINENTS = (() => { const r = rng(42); const out = [];
  const centers = [[-1.6, 0.55], [-1.2, 0.1], [-1.0, -0.45], [0.2, 0.6], [0.35, 0.05], [0.4, -0.4], [1.6, 0.6], [2.0, 0.3], [2.4, -0.45], [-2.6, 0.25], [0.0, -1.2], [0.5, 1.25]];
  for (const [lon, lat] of centers) for (let i = 0; i < 9; i++) out.push({ lon: lon + (r() - 0.5) * 0.7, lat: lat + (r() - 0.5) * 0.5, s: 0.12 + r() * 0.16 });
  return out; })();

function earth(ctx, cx, cy, r, rot = 0, tilt = 0.41, axis = false) {
  ctx.save();
  // glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.25);
  glow.addColorStop(0, 'rgba(90,170,255,0.45)'); glow.addColorStop(1, 'rgba(90,170,255,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, r * 1.25, 0, 6.283); ctx.fill();
  ctx.translate(cx, cy); ctx.rotate(tilt);
  if (axis) { ctx.strokeStyle = C.paper; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.setLineDash([26, 20]);
    ctx.beginPath(); ctx.moveTo(0, -r * 1.45); ctx.lineTo(0, r * 1.45); ctx.stroke(); ctx.setLineDash([]); }
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.clip();
  ctx.fillStyle = C.sea; ctx.fillRect(-r, -r, 2 * r, 2 * r);
  for (const b of CONTINENTS) {
    const lon = b.lon + rot, z = Math.cos(lon);
    if (z <= -0.05) continue;
    const x = r * Math.sin(lon) * Math.cos(b.lat), y = -r * Math.sin(b.lat);
    ctx.fillStyle = b.s > 0.2 ? C.landDark : C.land;
    ctx.beginPath(); ctx.ellipse(x, y, r * b.s * Math.max(z, 0.05), r * b.s * 0.85, 0, 0, 6.283); ctx.fill();
  }
  // ice caps
  ctx.fillStyle = '#f2f7ff';
  ctx.beginPath(); ctx.ellipse(0, -r * 0.98, r * 0.5, r * 0.16, 0, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, r * 0.98, r * 0.55, r * 0.17, 0, 0, 6.283); ctx.fill();
  // night side shading
  const sh = ctx.createLinearGradient(-r, 0, r, 0);
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(0.55, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(5,8,30,0.55)');
  ctx.fillStyle = sh; ctx.fillRect(-r, -r, 2 * r, 2 * r);
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
}

function moon(ctx, cx, cy, r, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = C.moon; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#aab0bd';
  for (const [dx, dy, s] of [[-0.3, -0.25, 0.22], [0.3, 0.1, 0.18], [-0.1, 0.4, 0.14], [0.35, -0.4, 0.1]]) {
    ctx.beginPath(); ctx.arc(cx + dx * r, cy + dy * r, s * r, 0, 6.283); ctx.fill();
  }
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
  ctx.restore();
}

// ---------- Blip, the channel mascot (original character)
// mood: 'happy' | 'shock' | 'worried' | 'wave'
function blip(ctx, t, x, y, mood = 'happy', scale = 1, at = 0) {
  if (t < at) return;
  const pop = easeBack(prog(t, at, at + 0.4));
  const bob = Math.sin(t * 4) * 6;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(scale * pop, scale * pop * (1 + 0.03 * Math.sin(t * 8)));
  // body
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(8, 10, 110, 100, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.ellipse(0, 0, 110, 100, 0, 0, 6.283); ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  // antenna
  ctx.beginPath(); ctx.moveTo(10, -98); ctx.quadraticCurveTo(30, -150, 50, -160); ctx.stroke();
  ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(52, -162, 16, 0, 6.283); ctx.fill(); ctx.stroke();
  // eyes
  const blink = (t % 3.3) < 0.12 ? 0.1 : 1;
  const eyeR = mood === 'shock' ? 30 : 24;
  for (const ex of [-38, 38]) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, -18, eyeR, eyeR * blink, 0, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(ex + (mood === 'worried' ? -6 : 4), -14, mood === 'shock' ? 8 : 11, 0, 6.283); ctx.fill();
  }
  if (mood === 'worried') { ctx.beginPath(); ctx.moveTo(-64, -50); ctx.lineTo(-22, -64); ctx.moveTo(64, -50); ctx.lineTo(22, -64); ctx.stroke(); }
  // mouth
  ctx.beginPath();
  if (mood === 'shock') { ctx.fillStyle = C.ink; ctx.ellipse(0, 42, 22, 28, 0, 0, 6.283); ctx.fill(); }
  else if (mood === 'worried') { ctx.moveTo(-30, 50); ctx.quadraticCurveTo(0, 30, 30, 50); ctx.stroke(); }
  else { ctx.moveTo(-36, 30); ctx.quadraticCurveTo(0, 70, 36, 30); ctx.stroke(); }
  // waving arm
  if (mood === 'wave') { const a = Math.sin(t * 10) * 0.5;
    ctx.save(); ctx.translate(98, 20); ctx.rotate(0.7 + a);
    ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.ellipse(0, -40, 22, 50, 0, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

// ---------- transitions
function flash(ctx, t, at, dur = 0.35) {
  const p = prog(t, at, at + dur);
  if (p <= 0 || p >= 1) return;
  ctx.fillStyle = `rgba(255,255,255,${1 - p})`; ctx.fillRect(0, 0, W, H);
}
// Diagonal yellow wipe covering the cut at time `at`.
function wipe(ctx, t, at, dur = 0.5) {
  const p = prog(t, at - dur / 2, at + dur / 2);
  if (p <= 0 || p >= 1) return;
  const x = lerp(-W * 1.6, W * 1.6, easeInOut(p));
  ctx.save(); ctx.translate(x, 0); ctx.rotate(0.35);
  ctx.fillStyle = C.yellow; ctx.fillRect(-W * 0.55, -H, W * 1.1, H * 3);
  ctx.fillStyle = C.ink; ctx.fillRect(W * 0.55, -H, 30, H * 3); ctx.fillRect(-W * 0.55 - 30, -H, 30, H * 3);
  ctx.restore();
}

function particlesBurst(ctx, t, x, y, at, n = 40, color = '#fff', spread = 520) {
  const p = prog(t, at, at + 0.9);
  if (p <= 0 || p >= 1) return;
  const r = rng(99);
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283, d = easeOut(p) * spread * (0.4 + r() * 0.6);
    ctx.globalAlpha = 1 - p; ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, (1 - p) * (8 + r() * 14), 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---------- apocalypse kit
// Screen shake offset at time t for a shake starting at `at`.
function shakeOffset(t, at, dur = 1.2, amp = 40) {
  const p = prog(t, at, at + dur);
  if (p <= 0 || p >= 1) return [0, 0];
  const k = amp * (1 - p);
  return [Math.sin(t * 91) * k, Math.cos(t * 77) * k];
}

// Horizontal speed streaks (wind) moving right.
function speedLines(ctx, t, alpha = 1, color = '#ffffff', count = 50, speed = 2600) {
  const r = rng(3);
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const y = r() * H, len = 120 + r() * 380, v = speed * (0.6 + r() * 0.8);
    const x = ((r() * W * 2 + t * v) % (W + len * 2)) - len;
    ctx.lineWidth = 3 + r() * 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
  }
  ctx.restore();
}

// City skyline silhouette; `lean` tilts/flings buildings to the right (0..1).
function skyline(ctx, baseY, color = '#1b1f3b', lean = 0, t = 0) {
  const r = rng(21);
  let x = -40;
  while (x < W + 40) {
    const w = 70 + r() * 110, h = 160 + r() * 480, fly = lean * (300 + r() * 1400);
    ctx.save(); ctx.translate(x + w / 2 + fly, baseY - (lean > 0 ? fly * 0.25 * r() : 0));
    ctx.rotate(lean * (0.4 + r() * 1.4));
    ctx.fillStyle = color; ctx.fillRect(-w / 2, -h, w, h);
    ctx.fillStyle = 'rgba(255,214,120,0.75)';
    for (let wy = -h + 30; wy < -30; wy += 50) for (let wx = -w / 2 + 16; wx < w / 2 - 20; wx += 34) if (r() > 0.45) ctx.fillRect(wx, wy, 14, 22);
    ctx.restore();
    x += w + 8;
  }
}

// Flying debris chunks streaming right.
function debris(ctx, t, at, count = 40, color = '#2a2238') {
  if (t < at) return;
  const r = rng(77);
  for (let i = 0; i < count; i++) {
    const y0 = 700 + r() * 1100, v = 1800 + r() * 2400, s = 10 + r() * 40;
    const x = -200 + ((t - at) * v + r() * W * 1.5) % (W + 400), y = y0 - (t - at) * 120 * r();
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * (3 + r() * 8));
    ctx.fillStyle = color; ctx.fillRect(-s / 2, -s / 2, s, s * 0.7); ctx.restore();
  }
}

// A giant wave rising from the left/bottom; p = 0..1 height progress.
function megaWave(ctx, t, p) {
  const crest = lerp(H + 100, 260, easeInOut(p));
  ctx.save();
  const g = ctx.createLinearGradient(0, crest, 0, H);
  g.addColorStop(0, '#5ec8ff'); g.addColorStop(0.3, '#1d6fd1'); g.addColorStop(1, '#0a2f6b');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-50, H);
  for (let x = -50; x <= W + 50; x += 20) {
    const curl = Math.max(0, (x - 600) / 480);
    ctx.lineTo(x, crest + Math.sin(x / 70 + t * 4) * 18 + curl * curl * 260);
  }
  ctx.lineTo(W + 50, H); ctx.closePath(); ctx.fill();
  // foam
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 18; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let x = -50; x <= 700; x += 20) ctx.lineTo(x, crest + Math.sin(x / 70 + t * 4) * 18 - 6);
  ctx.stroke();
  ctx.restore();
}

// Rising flames along the bottom.
function flames(ctx, t, baseY, intensity = 1) {
  const r = rng(13);
  for (let i = 0; i < 34; i++) {
    const x = r() * W, h = (120 + r() * 260) * intensity * (0.75 + 0.25 * Math.sin(t * 9 + i));
    const w = 50 + r() * 70;
    for (const [col, k] of [['#ff3d00', 1], ['#ff9100', 0.7], ['#ffd54f', 0.4]]) {
      ctx.fillStyle = col; ctx.beginPath();
      ctx.moveTo(x - w * k, baseY); ctx.quadraticCurveTo(x - w * k * 0.4, baseY - h * k * 0.6, x + Math.sin(t * 6 + i) * 14, baseY - h * k);
      ctx.quadraticCurveTo(x + w * k * 0.4, baseY - h * k * 0.6, x + w * k, baseY); ctx.fill();
    }
  }
}

// Falling snow / ice crystals.
function snow(ctx, t, alpha = 1) {
  const r = rng(31);
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 140; i++) {
    const x = (r() * W + Math.sin(t + i) * 30) % W, y = (r() * H + t * (90 + r() * 140)) % H;
    ctx.beginPath(); ctx.arc(x, y, 2 + r() * 5, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}

// Red emergency vignette pulse.
function alarm(ctx, t, strength = 1) {
  const a = (0.25 + 0.2 * Math.sin(t * 8)) * strength;
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(255,0,40,0)'); g.addColorStop(1, `rgba(255,0,40,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
