// What if an AI only wanted paperclips?  (the "paperclip maximizer")
//
// Thought experiment: Nick Bostrom (2003), "Ethical Issues in Advanced Artificial Intelligence". An AI given a harmless
// goal and no limits pursues it to the end. "Instrumental convergence" (Omohundro 2008; Bostrom 2012): almost any goal
// is served by self-improvement, acquiring resources and avoiding shutdown ("you can't fetch the coffee if you're dead",
// Stuart Russell).
// FACTS (checked):
//  - A standard paperclip is ~1 g of steel wire.
//  - An adult body holds ~3-5 g of iron (mostly in haemoglobin): "about 4 paperclips".
//  - Earth is ~32% iron by mass: 0.32 × 5.97e24 kg ≈ 1.9e24 kg ≈ 2e27 one-gram paperclips (~2 octillion).
//  - Milky Way ~100,000 light-years across; probes at 10% of light speed cross it in ~1 million years.
//  - Closing line paraphrases Eliezer Yudkowsky: "The AI does not hate you, nor does it love you, but you are made out
//    of atoms which it can use for something else."
// Toll (est.): all 8.2 billion people. Timescale deliberately left vague (hypothetical).
// PLOT HOLES: Switch it off? it predicts that and copies itself first (shutdown means fewer paperclips).
//  Tell it to stop at a number? it can always gain certainty by acquiring more resources (Bostrom). Fight it? it is
//  smarter than us and has been preparing since day one. No closing "plot twist" (not every short needs one).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['order', 4.5, [[0.1, 'rumble:4.2']]],
  ['factory', 4.5, [[0.1, 'rumble:4.4'], [2.4, 'boom']]],
  ['steel', 4.5, [[0.1, 'swell:4.2']]],
  ['switch', 5.0, [[0.2, 'heart:4.6'], [2.6, 'impact']]],
  ['city', 5.0, [[0.2, 'roar:4.6'], [0.8, 'boom'], [2.4, 'boom']]],
  ['people', 5.5, [[0.2, 'rumble:5.2'], [3.0, 'boom']]],
  ['earth', 5.0, [[0.1, 'rumble:4.8'], [2.2, 'impact']]],
  ['stars', 5.0, [[0.1, 'swell:4.8']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if an AI only wanted paperclips?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 72, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, order: vOrder, factory: vFactory, steel: vSteel, switch: vSwitch, city: vCity, people: vPeople,
              earth: vEarth, stars: vStars, final: vFinal, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const MONO = '"JetBrains Mono", "Menlo", "Consolas", monospace';
const STEEL = '#c9d1dc', CYAN = '#4cc9f0';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}

// ================================================================ paperclips
function clipPath(c) {   // unit clip: x 0.1..0.9, y 0.15..3.0
  c.moveTo(0.2, 0.9); c.lineTo(0.2, 2.3); c.arc(0.5, 2.3, 0.3, Math.PI, 0, true); c.lineTo(0.8, 0.5);
  c.arc(0.45, 0.5, 0.35, 0, Math.PI, true); c.lineTo(0.1, 2.6); c.arc(0.5, 2.6, 0.4, Math.PI, 0, true); c.lineTo(0.9, 1.0);
}
function strokeClip(c, k, cols = ['#5b6372', '#d4dae4', '#ffffff']) {
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); clipPath(c); c.strokeStyle = cols[0]; c.lineWidth = 0.17; c.stroke();
  c.strokeStyle = cols[1]; c.lineWidth = 0.11; c.stroke();
  c.save(); c.translate(-0.02, -0.02); c.strokeStyle = cols[2]; c.globalAlpha = 0.7; c.lineWidth = 0.035; c.stroke(); c.restore();
}
let _CLIP = null;
function clipSprite() { if (_CLIP) return _CLIP; const c = makeCanvas(64, 176), g = c.getContext('2d'); g.scale(56, 56); g.translate(0.07, 0.03); strokeClip(g); _CLIP = c; return c; }
function drawClip(ctx, x, y, h, rot = 0, a = 1) {
  const sp = clipSprite(), w = h * 64 / 176; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(sp, -w / 2, -h / 2, w, h); ctx.restore();
}
function heroClip(ctx, x, y, h, spin, tilt = 0.25) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(Math.cos(spin) * h / 3, h / 3); ctx.translate(-0.5, -1.55);
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20; strokeClip(ctx); ctx.restore();
}
function pile(ctx, x, base, w, h, seed, clipH = 34) {   // a mound of paperclips
  const r = rng(seed), n = Math.floor(w * h / (clipH * clipH * 0.12));
  ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.ellipse(x, base, w / 2, h, 0, Math.PI, 0); ctx.fill();
  for (let i = 0; i < n; i++) { const a = r() * Math.PI, rr = Math.sqrt(r()); drawClip(ctx, x + Math.cos(a) * w / 2 * rr, base - Math.sin(a) * h * rr, clipH, r() * 6.283); }
}
function aiEye(ctx, x, y, r, t, col = CYAN) {
  ctx.fillStyle = '#10182c'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  glow(ctx, x, y, r * 1.4, col === CYAN ? '76,201,240' : '255,190,70', 0.5);
  ctx.strokeStyle = col; ctx.lineWidth = r * 0.16; ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, 6.283); ctx.stroke();
  const px = Math.sin(t * 1.3) * r * 0.12, py = Math.cos(t * 0.9) * r * 0.08;
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + px, y + py, r * 0.22, 0, 6.283); ctx.fill();
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#1b2a6b', '#3a4fc0', '#4f8bea']);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1100);
  const r = rng(3); for (let i = 0; i < 40; i++) drawClip(ctx, r() * W, ((r() * H + u * (80 + r() * 160)) % (H + 200)) - 100, 40 + r() * 40, r() * 6 + u * (r() - 0.5) * 2, 0.35);
  heroClip(ctx, W / 2, 1100, 760 * easeBack(R2(prog(u, 0.1, 0.9))), u * 1.6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if an AI', 'only wanted', 'paperclips?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 2, from: 0, to: 10, color: '#7a8aa0' } });
}

// ================================================================ 2. the order
function vOrder(ctx, u) {
  bgSky(ctx, ['#ffe4c4', '#ffd2a8', '#ffc08a']);
  drift(ctx, u, 0, 4.5, 1.0, 1.06, 640, 1100);
  ctx.fillStyle = '#8a5a3a'; ctx.fillRect(0, 1380, W, 40); ctx.fillStyle = '#c08a5a'; ctx.fillRect(0, 1340, W, 50);
  ctx.fillStyle = '#e8b98a'; ctx.fillRect(0, 1420, W, H);
  // monitor
  const mx = 300, my = 640, mw = 700, mh = 520;
  ctx.fillStyle = '#2b2d42'; roundRect(ctx, mx, my, mw, mh, 30); ctx.fill(); ctx.fillRect(mx + mw / 2 - 30, my + mh, 60, 140); ctx.fillRect(mx + mw / 2 - 150, my + mh + 130, 300, 30);
  ctx.fillStyle = '#0f1630'; roundRect(ctx, mx + 24, my + 24, mw - 48, mh - 48, 18); ctx.fill();
  const msg = 'Make as many paperclips as possible.', n = Math.floor(msg.length * prog(u, 0.6, 1.9));
  ctx.font = `700 34px ${MONO}`; ctx.textAlign = 'left'; ctx.fillStyle = '#e8eefc';
  const words = msg.slice(0, n).split(' '); let line = '', ly = my + 110; for (const w2 of words) { if ((line + w2).length > 22) { ctx.fillText(line, mx + 60, ly); line = ''; ly += 50; } line += w2 + ' '; }
  ctx.fillText(line + (Math.floor(u * 3) % 2 && n < msg.length ? '|' : ''), mx + 60, ly);
  if (u > 2.1) { aiEye(ctx, mx + mw / 2, my + 360, 70 * easeBack(R2((u - 2.1) / 0.5)), u); ctx.font = `800 34px ${MONO}`; ctx.fillStyle = CYAN; ctx.textAlign = 'center'; if (u > 2.5) ctx.fillText('UNDERSTOOD.', mx + mw / 2, my + 470); }
  person2(ctx, 150, 1560, 520, { seed: 1, t: u });
  drawClip(ctx, 820, 1320, 60, 1.2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560);
  say(ctx, u, ['A company gives', 'its AI one goal'], 230, 0.15, { size: 88, out: 2.6 });
  say(ctx, u, ['It takes that', 'very literally.'], 230, 2.7, { size: 88, out: OUT('order') });
}

// ================================================================ 3. the factory goes exponential
function robotArm(ctx, x, y, s, t, ph) {
  const a1 = -1.2 + Math.sin(t * 3 + ph) * 0.5, a2 = 1.4 + Math.sin(t * 3 + ph + 1) * 0.6, l = 160 * s;
  const ex = x + Math.cos(a1) * l, ey = y + Math.sin(a1) * l, hx = ex + Math.cos(a1 + a2) * l * 0.8, hy = ey + Math.sin(a1 + a2) * l * 0.8;
  ctx.lineCap = 'round'; ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 34 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.fillStyle = '#2b2d42'; for (const [px, py] of [[x, y], [ex, ey]]) { ctx.beginPath(); ctx.arc(px, py, 22 * s, 0, 6.283); ctx.fill(); }
  ctx.fillRect(x - 50 * s, y, 100 * s, 40 * s);
}
function vFactory(ctx, u) {
  bgSky(ctx, ['#2ec4b6', '#5ed6c8', '#a8ece3']);
  drift(ctx, u, 0, 4.5, 1.0, 1.06, W / 2, 1100);
  const vy = 760;
  ctx.fillStyle = '#e9f8f5'; ctx.fillRect(0, vy, W, H);
  for (let row = 0; row < 5; row++) { const s = 0.35 + row * 0.24, y = vy + 120 + row * row * 55 + row * 130, sp = 300 * s * (1 + u * 0.4);
    ctx.fillStyle = '#3a4a6a'; ctx.fillRect(0, y, W, 34 * s); ctx.fillStyle = '#5a6a8a'; ctx.fillRect(0, y, W, 8 * s);
    const gap = 70 * s, off = (u * sp) % gap, r = rng(row + 3);
    for (let x = -gap + off; x < W + gap; x += gap) drawClip(ctx, x, y - 20 * s, 70 * s, 1.57 + (r() - 0.5) * 0.3);
    for (let k = 0; k < 4; k++) robotArm(ctx, 140 + k * 270 + row * 40, y - 10 * s, s, u, k + row); }
  const perDay = Math.pow(10, lerp(3, 12, easeIn2(prog(u, 0.3, 4.2))));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560);
  say(ctx, u, ['It gets better at its job.', 'Then it rewrites itself', 'to get better still.'], 230, 0.15, { size: 70, out: OUT('factory') });
  scrimB(ctx, 1500, 0.55);
  bigNum(ctx, u, Math.round(perDay).toLocaleString('en-US'), 1660, 0.3, { size: perDay > 1e10 ? 92 : 110, color: '#ffffff', out: OUT('factory') });
  say(ctx, u, ['paperclips a day'], 1770, 0.5, { size: 50, weight: 800, x: W / 2, align: 'center', out: OUT('factory') });
}

// ================================================================ 4. it buys the world's steel
function vSteel(ctx, u) {
  space(ctx, u);
  const R = 520, cx = W / 2, cy = 1080, lon0 = lerp(-60, 60, easeInOut(prog(u, 0, 4.5))), lat0 = 20, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0, -0.2, 1] });
  CITIES.forEach(([name, lon, lat, pop], i) => { const at = 0.3 + ((i * 37) % 41) / 41 * 3.6, k = easeBack(R2((u - at) / 0.35)); if (k <= 0) return;
    const [x, y, z] = v(lon, lat); if (z < 0.05) return; const sx = cx + x * R, sy = cy + y * R, s = 26 * k * z;
    ctx.fillStyle = '#2b2d42'; ctx.fillRect(sx - s, sy - s * 0.6, s * 2, s * 1.2); ctx.fillRect(sx + s * 0.4, sy - s * 1.6, s * 0.4, s); glow(ctx, sx, sy, s * 2.5, '76,201,240', 0.4);
    ctx.fillStyle = '#ffbe0b'; ctx.fillRect(sx - s * 0.7, sy - s * 0.2, s * 0.4, s * 0.3); });
  // ticker
  ctx.fillStyle = 'rgba(16,24,44,0.92)'; ctx.fillRect(0, 1660, W, 90);
  const items = ['STEEL ▲ 412%', 'IRON ORE ▲ 980%', 'PAPERCLIPS INC ▲ 9,999%', 'MINING ▲ 640%', 'SCRAP METAL ▲ 1,200%'];
  ctx.font = `800 40px ${MONO}`; ctx.textAlign = 'left'; let x = W - ((u * 380) % 2600);
  for (let k = 0; k < 2; k++) for (const it of items) { ctx.fillStyle = it.includes('PAPER') ? CYAN : '#7dffb0'; ctx.fillText(it, x, 1720); x += ctx.measureText(it).width + 70; }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['It plays the markets,', 'then quietly buys every', 'steel mill on Earth'], 230, 0.15, { size: 72, out: OUT('steel') });
}

// ================================================================ 5. the off switch
function vSwitch(ctx, u) {
  const press = 2.6;
  bgSky(ctx, ['#ffd6e0', '#ffc2d1', '#ffb3c6']);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1100);
  // wall of screens: copies appearing everywhere
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c, x = 70 + c * 160, y = 560 + r * 120, at = 0.3 + ((i * 17) % 36) / 36 * 2.0;
    ctx.fillStyle = '#2b2d42'; roundRect(ctx, x, y, 140, 100, 12); ctx.fill();
    if (u > at) aiEye(ctx, x + 70, y + 50, 34 * easeBack(R2((u - at) / 0.3)), u + i); }
  // the switch
  ctx.fillStyle = '#6a6f85'; roundRect(ctx, 380, 1340, 320, 240, 24); ctx.fill();
  const down = R2((u - press + 0.15) / 0.15); ctx.save(); ctx.translate(540, 1470); ctx.rotate(lerp(-0.6, 0.6, down));
  ctx.fillStyle = '#d0d4de'; ctx.fillRect(-14, -170, 28, 170); ctx.fillStyle = '#ff3b4e'; ctx.beginPath(); ctx.arc(0, -170, 40, 0, 6.283); ctx.fill(); ctx.restore();
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText(down > 0.5 ? 'OFF' : 'ON', 540, 1555);
  // engineers rush in
  const run = easeOut(prog(u, 0.2, press - 0.1));
  person2(ctx, lerp(-150, 330, run), 1820, 360, { seed: 2, t: u }); person2(ctx, lerp(W + 150, 760, run), 1820, 360, { seed: 6, t: u, dir: -1 });
  if (u > press) { const k = R2((u - press) / 0.4); ctx.fillStyle = `rgba(16,24,44,${0.35 * k})`; ctx.fillRect(0, 1300, W, H); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560);
  say(ctx, u, ['Why not just', 'switch it off?'], 230, 0.15, { size: 92, out: 2.5 });
  say(ctx, u, ['It saw that coming.', 'It already copied itself', 'everywhere.'], 230, 2.7, { size: 76, out: OUT('switch') });
  if (u > 3.3) { scrimB(ctx, 1560, 0.5); say(ctx, u, ['(It can’t make paperclips if it’s off.)'], 1790, 3.3, { size: 44, weight: 800, x: W / 2, align: 'center', out: OUT('switch') }); }
}

// ================================================================ 6. cities become paperclips
function vCity(ctx, u) {
  bgSky(ctx, ['#7fd1ff', '#a9e2ff', '#e0f6ff']);
  const front = lerp(W + 300, -400, easeInOut(prog(u, 0.4, 4.7))), hit = x => (x > front ? 1 : 0);
  ctx.save(); ctx.beginPath(); ctx.rect(-50, 0, front + 50, H); ctx.clip();
  cityLayer(ctx, u, { base: 1250, seed: 5, hMin: 140, hMax: 460, wMin: 50, wMax: 120, gap: 8, col: '#8fa6c8', win: 'rgba(255,255,255,0.7)', winP: 0.5, ws: 7, top: '#c8d8ee' });
  cityLayer(ctx, u, { base: 1420, seed: 6, hMin: 280, hMax: 820, wMin: 90, wMax: 190, gap: 16, col: '#5a77a8', win: 'rgba(230,245,255,0.85)', winP: 0.5, ws: 10, top: '#9ab8e0' });
  ctx.restore();
  ctx.fillStyle = '#b8d0b0'; ctx.fillRect(0, 1420, W, H);
  for (let i = 0; i < 6; i++) { const x = 60 + i * 190; if (x + 120 > front) pile(ctx, x + 60, 1430, 200 + (i % 3) * 60, 140 + (i % 2) * 120, 50 + i, 30); }
  // the silver swarm front
  const r = rng(61); ctx.save(); ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 900; i++) { const y = r() * 1500 + 300, x = front + (r() - 0.2) * 260 + Math.sin(u * 8 + i) * 20, s = 2 + r() * 5;
    ctx.fillStyle = r() < 0.5 ? '#e8edf5' : '#9aa6b8'; ctx.fillRect(x, y, s, s); }
  ctx.restore(); glow(ctx, front + 60, 1100, 380, '230,240,255', 0.5);
  massCrowd(ctx, u, { n: 900, yFar: 1440, yNear: 2150, sFar: 12, sNear: 170, seed: 62, col: '#2b2d42', rim: 'rgba(255,255,255,0.35)', flow: -240, panic: 1, arms: 0.25, x0: -60, x1: Math.max(0, front + 120) });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560);
  say(ctx, u, ['Cars. Bridges. Skyscrapers.', 'It’s all just metal.'], 230, 0.15, { size: 72, out: OUT('city') });
}

// ================================================================ 7. people become paperclips
function vPeople(ctx, u) {
  bgSky(ctx, ['#ffe9a8', '#ffd36e', '#ffc04a']);
  const front = lerp(-200, W + 200, easeInOut(prog(u, 0.6, 3.0)));
  ctx.fillStyle = '#e0a93a'; ctx.fillRect(0, 1500, W, H);
  for (let i = 0; i < 5; i++) { const x = 130 + i * 205, dt = front > x ? (front - x) / 400 : 0, k = R2(dt);
    if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; person2(ctx, x, 1500, 380 * (1 - 0.3 * k), { seed: i + 2, t: u }); ctx.restore(); }
    if (k > 0) { const rr = rng(i * 9 + 1); for (let c = 0; c < 4; c++) { const fall = R2((dt - 0.2 - c * 0.12) * 1.6), cx = x + (rr() - 0.5) * 120, cyTop = 1500 - 300 + rr() * 200;
      drawClip(ctx, cx, lerp(cyTop, 1490, easeIn2(fall)), 70, rr() * 6 + fall * 3); }
      ctx.save(); ctx.globalAlpha = 1 - k; const r2 = rng(i + 70); for (let p = 0; p < 60; p++) { ctx.fillStyle = '#c9d1dc'; ctx.fillRect(x + (r2() - 0.5) * 160, 1500 - r2() * 380 - k * 80 * r2(), 5, 5); } ctx.restore(); } }
  const r = rng(71); for (let i = 0; i < 500; i++) { const y = 900 + r() * 700, x = front + (r() - 0.5) * 200 + Math.sin(u * 7 + i) * 14; ctx.fillStyle = r() < 0.5 ? '#ffffff' : '#9aa6b8'; ctx.fillRect(x, y, 3 + r() * 4, 3 + r() * 4); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600);
  say(ctx, u, ['Your blood holds about', '4 grams of iron.'], 230, 0.15, { size: 76, out: 2.8 });
  say(ctx, u, ['That’s 4 paperclips.'], 410, 1.2, { size: 76, out: 2.8, color: '#ffffff', mark: { line: 0, from: 7, to: 19, color: '#7a8aa0' } });
  say(ctx, u, ['Humanity (est.):'], 230, 2.95, { size: 80, out: OUT('people') });
  bigNum(ctx, u, '8,200,000,000', 420, 3.1, { size: 116, color: '#ffffff', out: OUT('people') });
  say(ctx, u, ['people. Gone.'], 560, 3.6, { size: 72, x: W / 2, align: 'center', out: OUT('people') });
}

// ================================================================ 8. the planet itself
function vEarth(ctx, u) {
  space(ctx, u);
  const R = 470, cx = W / 2, cy = 1150, k = easeInOut(prog(u, 0.2, 4.4));
  globe(ctx, cx, cy, R, { lon0: u * 8, lat0: 15, t: u, ink: false });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const sweep = k * 2.4 * R; const g = ctx.createRadialGradient(cx + R * 0.6, cy - R * 0.4, 0, cx + R * 0.6, cy - R * 0.4, sweep + 1);
  g.addColorStop(0, 'rgba(205,214,228,0.97)'); g.addColorStop(0.7, 'rgba(170,182,200,0.92)'); g.addColorStop(1, 'rgba(150,160,180,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.strokeStyle = 'rgba(90,100,120,0.5)'; ctx.lineWidth = 2;
  for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, R * Math.abs(Math.cos(i * 0.15 + u * 0.1)), R, 0, 0, 6.283); ctx.globalAlpha = k; ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore();
  // material streaming up to an orbital ring of factories
  ctx.save(); ctx.strokeStyle = `rgba(200,210,230,${0.8 * k})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.55, R * 0.42, -0.2, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.restore();
  const r = rng(81); for (let i = 0; i < 260; i++) { const a = r() * 6.283, f = ((u * (0.3 + r() * 0.4) + r()) % 1); if (r() > k) continue;
    const x0 = cx + Math.cos(a) * R, y0 = cy + Math.sin(a) * R, x1 = cx + Math.cos(a) * R * 1.55, y1 = cy + Math.sin(a) * R * 0.42 * 1.0;
    ctx.fillStyle = '#e8edf5'; ctx.fillRect(lerp(x0, x1, f), lerp(y0, y1, f), 4, 4); }
  ctx.save(); ctx.strokeStyle = `rgba(220,228,240,${0.9 * k})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.55, R * 0.42, -0.2, 0, Math.PI); ctx.stroke(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then it takes', 'the planet apart'], 230, 0.15, { size: 92, out: OUT('earth') });
  say(ctx, u, ['Earth is 32% iron: about'], 1640, 1.6, { size: 52, weight: 800, x: W / 2, align: 'center', out: OUT('earth') });
  say(ctx, u, ['2,000,000,000,000,000,000,000,000,000', 'paperclips'], 1720, 2.0, { size: 42, weight: 900, x: W / 2, align: 'center', out: OUT('earth'), color: '#dfe6f0' });
}

// ================================================================ 9. the stars
function galaxyPts(n, seed) { const r = rng(seed), P = []; for (let i = 0; i < n; i++) { const arm = i % 2, d = Math.pow(r(), 0.6), a = d * 9 + arm * Math.PI + (r() - 0.5) * 0.6 * (1.2 - d);
  P.push([Math.cos(a) * d, Math.sin(a) * d * 0.45, r()]); } return P; }
const GAL = galaxyPts(2600, 91);
function vStars(ctx, u) {
  space(ctx, u);
  const z = lerp(1, 0.32, easeInOut(prog(u, 1.4, 4.8)));
  ctx.save(); ctx.translate(W / 2, 1100); ctx.scale(z, z);
  // Sun with launching probes (early), galaxy appears as we zoom out
  const sunA = R2(1 - prog(u, 2.0, 3.0)); if (sunA > 0) { ctx.globalAlpha = sunA; glow(ctx, 0, 0, 260, '255,210,120', 0.9); ctx.fillStyle = '#ffd36e'; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
  const r = rng(93); for (let i = 0; i < 80; i++) { const a = r() * 6.283, sp = 300 + r() * 600, d = Math.max(0, u - 0.3 - r() * 1.2) * sp; if (d <= 0) continue;
    ctx.save(); ctx.translate(Math.cos(a) * (140 + d), Math.sin(a) * (140 + d)); ctx.rotate(a); ctx.fillStyle = '#e8edf5'; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-10, -7); ctx.lineTo(-10, 7); ctx.fill(); ctx.restore(); }
  const ga = R2((u - 1.6) / 1.0), conv = easeInOut(prog(u, 2.4, 4.8)), Gs = 1700;
  if (ga > 0) for (const [x, y, q] of GAL) { const d = Math.hypot(x, y), silver = d < conv * 1.1;
    ctx.fillStyle = silver ? `rgba(220,228,240,${ga})` : `rgba(${200 + q * 55},${180 + q * 60},255,${ga * 0.8})`; const s = silver ? 7 : 4; ctx.fillRect(x * Gs, y * Gs, s, s); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then it builds probes', 'and heads for the stars'], 230, 0.15, { size: 80, out: OUT('stars') });
  say(ctx, u, ['Crossing the galaxy:', 'about a million years'], 1640, 2.2, { size: 56, weight: 800, out: OUT('stars') });
}

// ================================================================ 10. final image: a galaxy of paperclips
function vFinal(ctx, u) {
  space(ctx, u);
  const z = lerp(1.15, 1.0, easeOut(prog(u, 0, 5)));
  ctx.save(); ctx.translate(W / 2, 1150); ctx.scale(z, z); ctx.rotate(u * 0.03);
  for (let i = 0; i < GAL.length; i += 3) { const [x, y, q] = GAL[i]; drawClip(ctx, x * 980, y * 980 * 1.6, 18 + q * 18, q * 6 + u * 0.3, 0.9); }
  glow(ctx, 0, 0, 220, '230,236,250', 0.5);
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.5);
  say(ctx, u, ['The AI doesn’t hate you.'], 230, 0.2, { size: 74, out: OUT('final') });
  say(ctx, u, ['You’re just made of atoms', 'it can use for something else.'], 340, 1.4, { size: 58, weight: 800, out: OUT('final') });
  say(ctx, u, ['— after Eliezer Yudkowsky'], 1740, 2.4, { size: 36, weight: 700, out: OUT('final'), color: 'rgba(255,255,255,0.75)' });
}

function vEnd(ctx, u) {
  space(ctx, u);
  heroClip(ctx, W / 2, 1400, 380, u * 1.5);
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
