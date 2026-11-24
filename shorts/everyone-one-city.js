// What if every human was teleported into one city?
// Facts used: ~8.2 billion people in the City of Los Angeles (~1,300 km²) is ~6 people per
// m², crowd-crush density (danger rises sharply above ~5/m²); 8,000–20,000 planes are
// airborne at any moment, and autopilot can hold altitude until fuel runs out; LA's water
// utility serves ~4 million people; people survive roughly 3 days without water; nuclear
// plants' emergency diesel generators typically hold ~3–7 days of fuel; after people left
// Chernobyl, wolf numbers in the exclusion zone rose to ~7x those of nearby reserves.
const SHORT = {
  title: 'What if every human was teleported into one city?',
  duration: 46,
  sfx: [
    [0.2, 'pop'], [0.9, 'pop'], [2.4, 'riser'], [3.2, 'zap'], [3.3, 'poof'], [3.4, 'braam'],
    [4.4, 'pop'], [5.0, 'crowd:4.5'], [5.4, 'pop'], [7.2, 'pop'], [7.6, 'alarmbeep:1.2'],
    [9.5, 'whoosh'], [9.9, 'pop'], [10.0, 'jet:5'], [10.6, 'pop'], [12.2, 'pop'], [13.3, 'dive'], [14.3, 'boom'], [14.6, 'boom'],
    [15.5, 'whoosh'], [15.9, 'pop'], [16.0, 'fire:5'], [16.6, 'pop'], [18.4, 'pop'], [19.0, 'boom'],
    [21.0, 'whoosh'], [21.4, 'pop'], [22.0, 'pop'], [23.4, 'drain:2'], [24.4, 'pop'],
    [26.5, 'whoosh'], [26.9, 'pop'], [27.5, 'pop'], [29.0, 'dim'], [29.6, 'pop'],
    [32.0, 'whoosh'], [32.4, 'pop'], [33.0, 'pop'], [34.4, 'alarmbeep:2.5'], [35.4, 'pop'], [36.2, 'braam'],
    [38.5, 'whoosh'], [38.8, 'record'], [39.5, 'pop'], [40.5, 'howl'], [41.2, 'pop'],
    [43.5, 'whoosh'], [43.8, 'pop'], [44.5, 'ding'],
  ],
  music: { bpm: 104, mode: 'dark', until: 45.6, duckAt: [[3.2, 4.4], [38.6, 39.5]] },
};

const CUTS = [4.0, 9.5, 15.5, 21, 26.5, 32, 38.5, 43.5];
const SKIN = ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac', '#5c3a1e', '#a0662f'];

function render(ctx, t) {
  const [sx, sy] = shakeOffset(t, 3.3, 1.0, 40);
  const [sx2, sy2] = shakeOffset(t, 14.3, 1.0, 30);
  ctx.save(); ctx.translate(sx + sx2, sy + sy2);
  if (t < 4.0) sceneHook(ctx, t);
  else if (t < 9.5) sceneCrowd(ctx, t);
  else if (t < 15.5) scenePlanes(ctx, t);
  else if (t < 21) sceneFires(ctx, t);
  else if (t < 26.5) sceneWater(ctx, t);
  else if (t < 32) sceneDay3(ctx, t);
  else if (t < 38.5) sceneReactors(ctx, t);
  else if (t < 43.5) sceneWolves(ctx, t);
  else sceneEnd(ctx, t);
  ctx.restore();
  for (const c of CUTS) wipe(ctx, t, c);
}

// tiny top-down people (heads + shoulders)
function crowd(ctx, t, density, x0, y0, w, h, grey = 0, seed = 1) {
  const r = rng(seed), step = lerp(80, 40, density);
  for (let y = y0; y < y0 + h; y += step) for (let x = x0; x < x0 + w; x += step) {
    const jx = (r() - 0.5) * step * 0.5 + Math.sin(t * 3 + x) * 2, jy = (r() - 0.5) * step * 0.5;
    const col = r() < grey ? '#6b6f7a' : SKIN[Math.floor(r() * SKIN.length)];
    ctx.fillStyle = ['#e63946', '#457b9d', '#2a9d8f', '#f4a261', '#264653', '#e9c46a'][Math.floor(r() * 6)];
    ctx.beginPath(); ctx.ellipse(x + jx, y + jy + step * 0.12, step * 0.42, step * 0.28, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + jx, y + jy, step * 0.22, 0, 6.283); ctx.fill();
  }
}

function plane(ctx, x, y, s, rot = 0, color = '#f1f3f8') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = color; ctx.strokeStyle = C.ink; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 0, 120, 22, 0, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-50, 75); ctx.lineTo(-20, 75); ctx.lineTo(40, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-95, -5); ctx.lineTo(-120, -55); ctx.lineTo(-100, -55); ctx.lineTo(-70, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a86ff'; for (let i = -60; i < 80; i += 24) { ctx.beginPath(); ctx.arc(i, -4, 6, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

function coolingTower(ctx, x, y, s, t, steam = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#c9ced8'; ctx.strokeStyle = C.ink; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(-80, -220, -110, -400); ctx.lineTo(110, -400); ctx.quadraticCurveTo(80, -220, 150, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  const r = rng(4);
  for (let i = 0; i < 10; i++) { const k = ((t * 0.4 + i / 10) % 1);
    ctx.fillStyle = `rgba(240,240,245,${0.6 * (1 - k) * steam})`; ctx.beginPath(); ctx.arc((r() - 0.5) * 120 + k * 60, -420 - k * 380, 70 + k * 90, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

function radiation(ctx, x, y, r, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.8);
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink;
  for (let i = 0; i < 3; i++) { const a = i * 2.094 - 1.571; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 0.85, a - 0.52, a + 0.52); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, 6.283); ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, r * 0.15, 0, 6.283); ctx.fill();
  ctx.restore();
}

function gauge(ctx, x, y, label, level, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(0, 0, 120, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e63946'; ctx.fillText('E', -90, -20); ctx.fillStyle = C.ink; ctx.fillText('F', 90, -20);
  const a = Math.PI + level * Math.PI;
  ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = level < 0.15 ? '#e63946' : C.ink;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 95, Math.sin(a) * 95); ctx.stroke();
  ctx.font = `900 34px ${FONT}`; ctx.fillStyle = C.paper; ctx.lineWidth = 10; ctx.strokeStyle = C.ink;
  ctx.strokeText(label, 0, 60); ctx.fillText(label, 0, 60);
  ctx.restore();
}

function wolf(ctx, x, y, s, t, i) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const step = Math.sin(t * 8 + i) * 10;
  ctx.fillStyle = '#4a4e5a'; ctx.strokeStyle = C.ink; ctx.lineWidth = 5;
  for (const lx of [-50, -20, 30, 55]) { ctx.fillRect(lx, 20, 14, 60 + (lx % 2 ? step : -step)); }
  ctx.beginPath(); ctx.ellipse(0, 0, 85, 40, 0, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60, -20); ctx.lineTo(140, -30); ctx.lineTo(95, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(85, -30); ctx.lineTo(95, -70); ctx.lineTo(110, -30); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-80, -10); ctx.quadraticCurveTo(-140, -40 + step, -150, 10); ctx.lineTo(-80, 10); ctx.fill();
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(105, -15, 6, 0, 6.283); ctx.fill();
  ctx.restore();
}

// 0–4: people all over the globe zip to one point.
function sceneHook(ctx, t) {
  space(ctx, t);
  earth(ctx, W / 2, 1100, 330, 0.3 + t * 0.15);
  const p = easeInOut(prog(t, 2.4, 3.3)), r = rng(3);
  const tx = W / 2 - 150, ty = 1010;                       // "Los Angeles"
  for (let i = 0; i < 120; i++) {
    const a = r() * 6.283, d = Math.sqrt(r()) * 300;
    const x = lerp(W / 2 + Math.cos(a) * d, tx, p), y = lerp(1100 + Math.sin(a) * d, ty, p);
    ctx.fillStyle = SKIN[i % SKIN.length]; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
  }
  if (t > 3.3) { ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.arc(tx, ty, 26 + Math.sin(t * 20) * 4, 0, 6.283); ctx.fill(); }
  flash(ctx, t, 3.3, 0.35);
  caption(ctx, t, 'WHAT IF EVERY HUMAN', 260, 0.2, { size: 92, out: 3.9, maxW: 1040 });
  caption(ctx, t, 'WAS TELEPORTED INTO ONE CITY?', 520, 0.9, { size: 92, color: C.yellow, out: 3.9, maxW: 1000 });
}

// 4–9.5: 8 billion people packed into LA: crowd-crush density.
function sceneCrowd(ctx, t) {
  ctx.fillStyle = '#9aa0a8'; ctx.fillRect(0, 0, W, H);
  const dens = easeOut(prog(t, 4.2, 5.4));
  crowd(ctx, t, dens, -20, 300, W + 40, H - 300, 0, 2);
  ctx.fillStyle = 'rgba(11,15,30,0.35)'; ctx.fillRect(0, 0, W, H);
  chip(ctx, t, '0 SECONDS LATER', 4.4);
  caption(ctx, t, '8 billion people. One city.', 480, 5.4, { size: 92, out: 9.1 });
  caption(ctx, t, "That's 6 people per square meter", 900, 7.2, { size: 72, color: C.yellow, out: 9.1 });
  caption(ctx, t, 'Crowd-crush density. Everywhere.', 1080, 7.9, { size: 72, color: '#ff6b6b', out: 9.1 });
  if (t > 7.6) alarm(ctx, t, 0.8);
  blip(ctx, t, W - 190, 1760, 'shock', 0.6, 5.0);
}

// 9.5–15.5: pilotless planes fly on until the fuel runs out, then fall.
function scenePlanes(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4aa8ff'); g.addColorStop(1, '#cfe9ff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const fuel = 1 - easeInOut(prog(t, 10.6, 13.2));
  const fall = easeInOut(prog(t, 13.3, 14.4));
  [[200, 760, 0.9], [640, 980, 0.7], [380, 1220, 0.6]].forEach(([x, y, s], i) => {
    const px = x + (t - 9.5) * 60 + fall * 160, py = y + fall * (1200 - i * 100);
    plane(ctx, px, py, s, fall * (0.9 + i * 0.1));
  });
  ctx.fillStyle = '#2b5d34'; ctx.fillRect(0, 1700, W, H);
  if (t > 14.3) { for (const x of [380, 760]) { const k = prog(t, 14.3, 15.4);
    ctx.fillStyle = `rgba(255,120,0,${1 - k})`; ctx.beginPath(); ctx.arc(x, 1690, 80 + k * 220, Math.PI, 0); ctx.fill(); } }
  gauge(ctx, W - 190, 1500, 'FUEL', fuel, t);
  chip(ctx, t, 'MEANWHILE, EVERYWHERE ELSE', 9.9);
  caption(ctx, t, '10,000+ planes. No pilots.', 470, 10.6, { size: 88, out: 15.1 });
  caption(ctx, t, 'Autopilot keeps them flying… until the fuel runs out', 640, 12.2, { size: 64, color: C.yellow, out: 15.1 });
}

// 15.5–21: empty cities burn with no one to fight the fires.
function sceneFires(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a0f12'); g.addColorStop(1, '#c2410c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(6);
  for (let i = 0; i < 14; i++) { const x = r() * W, k = (t * 0.25 + r()) % 1;
    ctx.fillStyle = `rgba(40,30,35,${0.5 * (1 - k)})`; ctx.beginPath(); ctx.arc(x + k * 120, 1300 - k * 1100, 90 + k * 160, 0, 6.283); ctx.fill(); }
  skyline(ctx, 1600, '#1a0e12', 0, t);
  ctx.fillStyle = '#1a0e12'; ctx.fillRect(0, 1590, W, H);
  flames(ctx, t, 1600, 0.5 + easeInOut(prog(t, 16, 19)) * 1.1);
  chip(ctx, t, 'HOURS LATER', 15.9);
  caption(ctx, t, 'Stoves. Candles. Crashed cars.', 470, 16.6, { size: 80, out: 20.6 });
  caption(ctx, t, 'Nobody to fight the fires. Cities burn.', 640, 18.4, { size: 72, color: C.yellow, out: 20.6 });
}

// 21–26.5: LA's water system was built for 4 million.
function sceneWater(ctx, t) {
  ctx.fillStyle = '#e9e4da'; ctx.fillRect(0, 0, W, H);
  // big tap
  ctx.fillStyle = '#b8c0cc'; ctx.strokeStyle = C.ink; ctx.lineWidth = 8;
  ctx.fillRect(330, 860, 420, 90); ctx.strokeRect(330, 860, 420, 90);
  ctx.fillRect(650, 940, 100, 140); ctx.strokeRect(650, 940, 100, 140);
  ctx.fillRect(470, 780, 120, 80); ctx.strokeRect(470, 780, 120, 80);
  const flow = 1 - easeInOut(prog(t, 23.4, 25.2));
  if (flow > 0.05) { ctx.fillStyle = '#3a86ff'; ctx.fillRect(700 - 26 * flow, 1080, 52 * flow, 600); }
  else { const d = (t * 1.6) % 1; ctx.fillStyle = '#3a86ff'; ctx.beginPath(); ctx.arc(700, 1100 + d * 500, 18, 0, 6.283); ctx.fill(); }
  ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'center';
  const lines = [['Built for:', C.ink, 1400], ['4,000,000', '#2a9d8f', 1480], ['Now serving:', C.ink, 1580], ['8,200,000,000', '#e63946', 1665]];
  lines.forEach(([s, col, y], i) => { if (t > 22 + i * 0.5) { ctx.fillStyle = col; ctx.fillText(s, W / 2 - 60, y); } });
  chip(ctx, t, 'DAY 1', 21.4);
  caption(ctx, t, 'The taps run dry', 470, 24.4, { size: 100, color: '#e63946', out: 26.1 });
}

// 26.5–32: day 3: no water, disease, the crowd thins.
function sceneDay3(ctx, t) {
  ctx.fillStyle = '#7d828b'; ctx.fillRect(0, 0, W, H);
  const grey = easeInOut(prog(t, 29.0, 31.0)) * 0.65;
  crowd(ctx, t * 0.2, 0.75, -20, 300, W + 40, H - 300, grey, 5);
  ctx.fillStyle = `rgba(10,12,20,${0.35 + grey * 0.4})`; ctx.fillRect(0, 0, W, H);
  chip(ctx, t, 'DAY 3', 26.9);
  caption(ctx, t, 'Humans last about 3 days without water', 480, 27.5, { size: 78, out: 31.6 });
  caption(ctx, t, 'Billions start to die', 700, 29.6, { size: 96, color: '#ff6b6b', out: 31.6 });
}

// 32–38.5: unattended nuclear plants lose backup power.
function sceneReactors(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b2d42'); g.addColorStop(1, '#5c4a3c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#2f3a2a'; ctx.fillRect(0, 1500, W, H);
  coolingTower(ctx, 330, 1520, 0.9, t, 1 - prog(t, 35.4, 36.4));
  coolingTower(ctx, 720, 1540, 0.75, t, 1 - prog(t, 35.4, 36.4));
  gauge(ctx, W - 200, 1720, 'BACKUP FUEL', 1 - easeInOut(prog(t, 33.0, 35.4)), t);
  if (t > 36.2) { radiation(ctx, W / 2, 1120, 120 * easeBack(prog(t, 36.2, 36.6)), t); alarm(ctx, t, 1); }
  chip(ctx, t, 'ABOUT A WEEK LATER', 32.4);
  caption(ctx, t, '400+ nuclear reactors. Nobody at the controls.', 470, 33.0, { size: 74, out: 38.1 });
  caption(ctx, t, 'Backup generators run dry → meltdowns', 700, 35.4, { size: 70, color: C.yellow, out: 38.1 });
}

// 38.5–43.5: twist: nature moves in.
function sceneWolves(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9ed0ff'); g.addColorStop(1, '#e9f6ff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#8c8f96'; ctx.fillRect(140, 980, 260, 520); ctx.fillRect(620, 880, 300, 620);   // empty buildings
  ctx.fillStyle = '#5f646c'; for (let y = 1020; y < 1460; y += 90) for (const x of [180, 290, 660, 780]) ctx.fillRect(x, y, 60, 50);
  ctx.fillStyle = '#3f8f45';
  for (const [x, y, rr] of [[150, 1000, 90], [380, 1080, 70], [900, 900, 110], [620, 1250, 80], [260, 1350, 100]]) { ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#5aa64f'; ctx.fillRect(0, 1500, W, H);
  [[220, 1640, 0.8], [560, 1700, 0.95], [860, 1620, 0.75]].forEach(([x, y, s], i) => wolf(ctx, x + ((t - 38.5) * 70) % 200 - 100, y, s, t, i));
  caption(ctx, t, 'Plot twist:', 330, 38.8, { size: 80, color: C.yellow });
  caption(ctx, t, "For the rest of nature, it's the best day ever", 490, 39.5, { size: 80 });
  caption(ctx, t, 'After people left Chernobyl, wolves became ~7x more common there than in nearby reserves', 760, 41.2, { size: 54, color: C.ink, maxW: 960 });
}

function sceneEnd(ctx, t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.6);
  caption(ctx, t, 'WHAT IF,', 640, 43.8, { size: 150, color: C.paper });
  caption(ctx, t, 'THOUGH?', 800, 44.0, { size: 170, color: C.yellow });
  caption(ctx, t, 'Follow for more ways the world could end', 1000, 44.5, { size: 54 });
  blip(ctx, t, W / 2, 1400, 'wave', 1.3, 43.8);
}
