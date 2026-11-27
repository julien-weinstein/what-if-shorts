// What if Earth suddenly stopped spinning?
// Facts used: the equator moves east at ~1,670 km/h; the atmosphere and anything not
// anchored would keep that speed (faster than sound at sea level, ~1,235 km/h); oceans
// would surge eastward; without the spin's equatorial bulge, water would migrate toward
// the poles, leaving a land belt around the equator; with no rotation, one solar day
// lasts a year (≈6 months light, 6 months dark); tidal braking really is lengthening
// the day, and ~1.4 billion years ago a day was roughly 18–19 hours.
const SHORT = {
  title: 'What if Earth suddenly stopped spinning?',
  duration: 41,
  sfx: [
    [0.2, 'pop'], [0.9, 'pop'], [1.6, 'boing'],
    [3.3, 'screech'], [3.6, 'braam'], [3.6, 'rumble:3'], [4.4, 'pop'],
    [6.0, 'whoosh'], [6.3, 'wind:5.4'], [6.5, 'pop'], [8.2, 'boom'], [8.4, 'pop'],
    [11.5, 'whoosh'], [11.8, 'pop'], [12.2, 'rumble:4'], [13.2, 'pop'], [14.6, 'bigwave'],
    [16.5, 'whoosh'], [16.9, 'pop'], [17.6, 'drain:3.5'], [18.4, 'pop'], [20.6, 'pop'],
    [22.0, 'whoosh'], [22.4, 'pop'], [23.4, 'sizzle:3'], [24.1, 'pop'], [25.6, 'freeze'], [26.4, 'pop'],
    [29.0, 'whoosh'], [29.4, 'zap'], [29.6, 'pop'], [31.0, 'zap'], [31.4, 'pop'],
    [33.0, 'whoosh'], [33.3, 'record'], [34.1, 'pop'], [35.6, 'tick:2.5'], [35.8, 'pop'], [37.2, 'braam'],
    [38.4, 'whoosh'], [38.8, 'pop'], [39.6, 'ding'],
  ],
  music: { bpm: 126, mode: 'dark', until: 40.6, duckAt: [[3.4, 6.0], [33.1, 34.1]] },
};

const CUTS = [6, 11.5, 16.5, 22, 29, 33, 38.4];

function render(ctx, t) {
  // big shake when the planet stops, smaller ones on impacts
  const [sx1, sy1] = shakeOffset(t, 3.5, 2.2, 55);
  const [sx2, sy2] = shakeOffset(t, 8.2, 1.0, 30);
  const [sx3, sy3] = shakeOffset(t, 14.6, 1.4, 45);
  ctx.save(); ctx.translate(sx1 + sx2 + sx3, sy1 + sy2 + sy3);
  if (t < 6) sceneStop(ctx, t);
  else if (t < 11.5) sceneWind(ctx, t);
  else if (t < 16.5) sceneWave(ctx, t);
  else if (t < 22) sceneOceans(ctx, t);
  else if (t < 29) sceneDayNight(ctx, t);
  else if (t < 33) sceneShield(ctx, t);
  else if (t < 38.4) sceneTwist(ctx, t);
  else sceneEnd(ctx, t);
  ctx.restore();
  for (const c of CUTS) wipe(ctx, t, c);
}

// 0–6: fast spin, then a violent stop.
function sceneStop(ctx, t) {
  space(ctx, t);
  // rotation angle: spinning fast, decelerating hard to zero at 3.6 s
  const rot = t < 3.6 ? t * 2.2 - Math.pow(Math.max(0, t - 3.0), 2) * 1.8 : 3.6 * 2.2 - 0.36 * 1.8;
  earth(ctx, W / 2, 1080, 290, rot);
  if (t < 3.6) { // motion arcs while spinning
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (const k of [0, 2.1, 4.2]) { ctx.beginPath(); ctx.arc(W / 2, 1080, 360, k + t * 3, k + t * 3 + 0.9); ctx.stroke(); }
  }
  flash(ctx, t, 3.6, 0.4);
  if (t > 3.6) alarm(ctx, t, prog(t, 3.6, 4.2));
  caption(ctx, t, 'WHAT IF EARTH', 300, 0.2, { size: 104, out: 3.3 });
  caption(ctx, t, 'STOPPED SPINNING?', 510, 0.9, { size: 108, color: C.yellow, out: 3.3, maxW: 1040 });
  chip(ctx, t, '0 SECONDS LATER', 4.4);
  caption(ctx, t, 'The planet stops. Everything on it doesn’t.', 1560, 4.6, { size: 70 });
  blip(ctx, t, 190, 1780, t > 3.6 ? 'shock' : 'happy', 0.7, 1.6);
}

// 6–11.5: supersonic wind; the city is flung east.
function sceneWind(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#ff8a3d'); g.addColorStop(1, '#5a1e3a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const lean = easeInOut(prog(t, 8.2, 11.2));
  skyline(ctx, 1520, '#20152e', lean, t);
  ctx.fillStyle = '#20152e'; ctx.fillRect(0, 1500, W, H);
  speedLines(ctx, t, 0.7, '#ffe0c2', 60, 3200);
  debris(ctx, t, 8.2, 50, '#20152e');
  chip(ctx, t, 'ONE SECOND LATER', 6.5);
  caption(ctx, t, 'Winds of 1,670 km/h', 420, 6.5, { size: 96, color: C.yellow, out: 11.1 });
  caption(ctx, t, 'That’s faster than the speed of sound', 580, 7.3, { size: 64, out: 11.1 });
  caption(ctx, t, 'Cities get scoured off the map', 800, 8.4, { size: 80, out: 11.1 });
}

// 11.5–16.5: the oceans keep moving and slam into the continents.
function sceneWave(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#3b2a55'); g.addColorStop(1, '#a04a5e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  skyline(ctx, 1600, '#1a1230', 0, t);
  ctx.fillStyle = '#1a1230'; ctx.fillRect(0, 1590, W, H);
  megaWave(ctx, t, prog(t, 12.2, 15.2));
  chip(ctx, t, 'MINUTES LATER', 11.8);
  caption(ctx, t, 'The oceans keep going too', 420, 13.2, { size: 88, out: 14.4 });
  caption(ctx, t, 'MEGA-TSUNAMIS', 420, 14.6, { size: 100, color: C.yellow, out: 16.1 });
  if (t > 14.6) alarm(ctx, t, 1);
}

// 16.5–22: water drains to the poles; a land belt rises around the equator.
function sceneOceans(ctx, t) {
  space(ctx, t);
  const p = easeInOut(prog(t, 17.6, 20.8));
  const cx = W / 2, cy = 1100, r = 300;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.clip();
  ctx.fillStyle = C.sea; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  earth(ctx, cx, cy, r, 1.0, 0);
  // equatorial land belt grows as water leaves
  const band = lerp(0, r * 0.62, p);
  const bg = ctx.createLinearGradient(0, cy - band, 0, cy + band);
  bg.addColorStop(0, '#8a6a3c'); bg.addColorStop(0.5, '#c49a5a'); bg.addColorStop(1, '#8a6a3c');
  ctx.fillStyle = bg; ctx.fillRect(cx - r, cy - band, 2 * r, 2 * band);
  // polar oceans swell
  ctx.fillStyle = 'rgba(29,111,209,0.95)';
  ctx.beginPath(); ctx.ellipse(cx, cy - r, r * 1.1, lerp(r * 0.2, r * 0.42, p), 0, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx, cy + r, r * 1.1, lerp(r * 0.2, r * 0.42, p), 0, 0, 6.283); ctx.fill();
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
  if (p > 0.05) { ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.lineCap = 'round';
    for (const d of [-1, 1]) { const y0 = cy + d * 80, y1 = cy + d * (r - 40);
      ctx.beginPath(); ctx.moveTo(cx + 380, y0); ctx.lineTo(cx + 380, y1); ctx.moveTo(cx + 350, y1 - d * 30); ctx.lineTo(cx + 380, y1); ctx.lineTo(cx + 410, y1 - d * 30); ctx.stroke(); } }
  chip(ctx, t, 'THEN, SLOWLY', 16.9);
  caption(ctx, t, 'Without the spin, the oceans flow to the poles', 470, 18.4, { size: 76, out: 21.6 });
  caption(ctx, t, 'One giant continent rings the equator', 1620, 20.6, { size: 70, color: C.yellow, out: 21.6 });
}

// 22–29: one day lasts a year: half burning, half frozen.
function sceneDayNight(ctx, t) {
  const split = W / 2 + Math.sin(t * 1.5) * 10;
  // day side
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, H); ctx.clip();
  const g1 = ctx.createLinearGradient(0, 0, 0, H); g1.addColorStop(0, '#ff6a00'); g1.addColorStop(1, '#7a1800');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff1a8'; ctx.beginPath(); ctx.arc(200, 420, 110, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#4a1405'; ctx.fillRect(0, 1450, W, H);
  ctx.strokeStyle = '#ff9a3c'; ctx.lineWidth = 5;  // cracks
  for (const [x, y] of [[80, 1550], [260, 1650], [140, 1780], [380, 1520]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60, y + 40); ctx.lineTo(x + 30, y + 90); ctx.lineTo(x + 90, y + 140); ctx.stroke(); }
  flames(ctx, t, 1460, prog(t, 23.2, 24.4));
  ctx.restore();
  // night side
  ctx.save(); ctx.beginPath(); ctx.rect(split, 0, W - split, H); ctx.clip();
  const g2 = ctx.createLinearGradient(0, 0, 0, H); g2.addColorStop(0, '#020414'); g2.addColorStop(1, '#16305a');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 1, 1);
  ctx.fillStyle = '#d8ecff'; ctx.fillRect(0, 1450, W, H);
  ctx.fillStyle = '#a8cff0';
  for (const x of [600, 760, 920]) { ctx.beginPath(); ctx.moveTo(x - 70, 1450); ctx.lineTo(x, 1250 + (x % 3) * 30); ctx.lineTo(x + 70, 1450); ctx.fill(); }
  snow(ctx, t, prog(t, 25.4, 26.2));
  ctx.restore();
  ctx.fillStyle = C.ink; ctx.fillRect(split - 6, 0, 12, H);
  chip(ctx, t, '1 DAY = 1 YEAR', 22.4);
  caption(ctx, t, '6 months of blazing sun…', 560, 24.1, { size: 80, out: 28.6 });
  caption(ctx, t, '…then 6 months of frozen night', 760, 26.4, { size: 80, color: '#bfe6ff', out: 28.6 });
}

// 29–33: the magnetic shield may weaken.
function sceneShield(ctx, t) {
  space(ctx, t);
  const fade = 1 - easeInOut(prog(t, 30.8, 32.4));
  earth(ctx, W / 2, 1080, 240, 1.0);
  ctx.strokeStyle = `rgba(120,200,255,${0.8 * fade})`; ctx.lineWidth = 7;
  for (const k of [1.4, 1.8, 2.3]) { ctx.beginPath(); ctx.ellipse(W / 2 - 240 * k * 0.55, 1080, 240 * k * 0.6, 240 * k, 0, 0, 6.283); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(W / 2 + 240 * k * 0.55, 1080, 240 * k * 0.6, 240 * k, 0, 0, 6.283); ctx.stroke(); }
  // solar wind streaks hitting from the left, getting closer as the shield fades
  const reach = lerp(W / 2 - 560, W / 2 - 250, 1 - fade);
  const r = rng(8);
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6;
  for (let i = 0; i < 26; i++) { const y = 760 + r() * 640, x = ((t * 900 + r() * 600) % 700) - 300;
    if (x < reach) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(Math.min(x + 140, reach), y); ctx.stroke(); } }
  chip(ctx, t, 'MEANWHILE', 29.6);
  caption(ctx, t, "Earth's magnetic shield could weaken", 460, 29.6, { size: 80, out: 32.6 });
  caption(ctx, t, 'More radiation reaches the surface', 1560, 31.4, { size: 70, color: C.yellow, out: 32.6 });
}

// 33–38.4: twist: the spin really is slowing.
function sceneTwist(ctx, t) {
  ctx.fillStyle = '#0b0f1e'; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.5);
  // clock
  const cx = W / 2, cy = 1120, r = 230;
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r * 0.82, cy - Math.cos(a) * r * 0.82); ctx.lineTo(cx + Math.sin(a) * r * 0.92, cy - Math.cos(a) * r * 0.92); ctx.stroke(); }
  const spin = t < 35.6 ? 0 : (t - 35.6) * 9 * Math.max(0.15, 1 - (t - 35.6) / 2.5);
  ctx.lineCap = 'round';
  ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(spin) * r * 0.7, cy - Math.cos(spin) * r * 0.7); ctx.stroke();
  ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(spin / 12 + 2) * r * 0.45, cy - Math.cos(spin / 12 + 2) * r * 0.45); ctx.stroke();
  caption(ctx, t, 'Plot twist:', 330, 33.3, { size: 80, color: C.yellow });
  caption(ctx, t, "Earth's spin IS slowing down", 470, 34.1, { size: 92 });
  caption(ctx, t, '1.4 billion years ago, a day lasted about 19 hours', 1560, 35.8, { size: 64 });
  blip(ctx, t, 190, 1790, 'worried', 0.6, 37.2);
}

function sceneEnd(ctx, t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.6);
  caption(ctx, t, 'WHAT IF,', 640, 38.8, { size: 150, color: C.paper });
  caption(ctx, t, 'THOUGH?', 800, 39.0, { size: 170, color: C.yellow });
  caption(ctx, t, 'Follow for a new what-if every day', 1000, 39.6, { size: 56 });
  blip(ctx, t, W / 2, 1400, 'wave', 1.3, 38.8);
}
