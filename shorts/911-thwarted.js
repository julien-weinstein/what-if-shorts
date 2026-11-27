// What if 9/11 had been thwarted?   (history counterfactual: REAL HISTORY / WHAT IF badges, red frame, explicit fork)
//
// RESPECT RULES: no depiction of the attacks, aircraft impacts or hijackers' likenesses. Real-history beat = memorial lights.
//
// SOURCES:
//  - 9/11 Commission Report (2004), ch. 8.2 "Late leads": the CIA did not watchlist al-Mihdhar and al-Hazmi in time; in Aug 2001
//    the FBI learned they were in the US but the search went nowhere; Zacarias Moussaoui was arrested Aug 16, 2001 in Minnesota;
//    the July 2001 "Phoenix memo" flagged extremists at US flight schools. No one connected these. The Commission did NOT conclude
//    the attacks could have been prevented: we say so on screen and frame the fork as hypothetical.
//  - 2,977 people were killed on Sept 11, 2001 (excluding the 19 hijackers).
//  - Brown University Costs of War: more than 900,000 people killed by direct war violence in post-9/11 war zones; at least
//    4.5-4.7 million total including indirect deaths; US spent or obligated more than $8 trillion (through 2021).
//  - TSA was created by law in Nov 2001. The original WTC towers opened in the early 1970s (~53 years old in 2026).
//  - Counterfactual claims are hedged ("probably", "many historians argue"): al-Qaeda still exists and keeps plotting.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['clues', 4.5, [[0.2, 'heart:4.2']]],
  ['memorial', 5.0, [[0.2, 'swell:4.6']]],
  ['wars', 5.0, [[0.2, 'rumble:4.6'], [1.6, 'boom']]],
  ['fork', 5.0, [[0.4, 'impact'], [2.6, 'swell:2.2']]],
  ['arrest', 4.5, [[0.2, 'heart:4.2'], [2.2, 'impact']]],
  ['tuesday', 5.0, [[0.2, 'swell:4.6']]],
  ['airport', 4.0, [[0.2, 'air']]],
  ['nowar', 5.0, [[0.2, 'swell:4.6']]],
  ['threat', 4.5, [[0.2, 'rumble:4.2']]],
  ['today', 5.0, [[0.2, 'swell:4.6']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if 9/11 had been stopped?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 70, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook9, clues: vClues9, memorial: vMemorial9, wars: vWars9, fork: vFork9, arrest: vArrest9, tuesday: vTuesday9, airport: vAirport9, nowar: vNoWar9,
              threat: vThreat9, today: vToday9, final: vFinal9, end: vEnd9 };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const REAL_SCENES = ['hook', 'clues', 'memorial', 'wars'], WHATIF_SCENES = ['arrest', 'tuesday', 'airport', 'nowar', 'threat', 'today', 'final'];
function sceneAt(t) { let cur = null; for (const [n] of SCENES) if (t >= START[n]) cur = n; return cur; }
function modeBadge(ctx, t) {
  const n = sceneAt(t), real = REAL_SCENES.includes(n), wif = WHATIF_SCENES.includes(n); if (!real && !wif) return;
  const a = R2((t - START[n]) / 0.3);
  ctx.save(); ctx.globalAlpha = a;
  if (wif) { const pulse = 0.75 + 0.25 * Math.sin(t * 2 * Math.PI * 0.6); ctx.strokeStyle = `rgba(230,57,70,${0.85 * pulse})`; ctx.lineWidth = 18; ctx.strokeRect(9, 9, W - 18, H - 18); }
  const txt = real ? '✓ REAL HISTORY' : '⚠ WHAT IF', col = real ? '#2a9d5a' : '#e63946';
  ctx.font = `900 36px ${FONT}`; const w = ctx.measureText(txt).width + 44, x = W - 60 - w, y = 48;
  ctx.fillStyle = col; roundRect(ctx, x, y, w, 60, 30); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(txt, x + 22, y + 43);
  ctx.restore();
}
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  modeBadge(ctx, t);
  post(ctx, { bloom: 0.22, contrast: 1.06, saturate: 1.08, vignette: 0.34 });
}
function dateTag(ctx, u, txt, at = 0.1) { if (u < at) return; const k = easeOut(R2((u - at) / 0.4)); ctx.save(); ctx.globalAlpha = k; ctx.font = `900 34px ${FONT}`; const w = ctx.measureText(txt).width + 40;
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; roundRect(ctx, 70, 1700, w, 56, 28); ctx.fill(); ctx.fillStyle = '#1b1b2e'; ctx.textAlign = 'left'; ctx.fillText(txt, 90, 1740); ctx.restore(); }
// Lower Manhattan skyline; twins = draw the original towers
function manhattan(ctx, base, seed, twins, col = '#5a6a98', lit = 0) { const r = rng(seed);
  let x = -20; while (x < W + 20) { const w = 40 + r() * 70, h = 120 + r() * 300; ctx.fillStyle = mixHex(col, '#2a3a6a', r() * 0.4); ctx.fillRect(x, base - h, w, h);
    if (lit) { ctx.fillStyle = `rgba(255,230,170,${0.55 * lit})`; for (let yy = base - h + 12; yy < base - 8; yy += 20) for (let xx = x + 6; xx < x + w - 6; xx += 14) if (r() < 0.45) ctx.fillRect(xx, yy, 6, 9); } x += w + 4; }
  if (twins) for (const tx of [430, 560]) { const h = 820, w = 92; const g = ctx.createLinearGradient(tx, 0, tx + w, 0); g.addColorStop(0, mixHex(col, '#d8e0f0', 0.5)); g.addColorStop(1, mixHex(col, '#2a3a6a', 0.3)); ctx.fillStyle = g; ctx.fillRect(tx, base - h, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; for (let xx = tx + 6; xx < tx + w; xx += 8) { ctx.beginPath(); ctx.moveTo(xx, base - h); ctx.lineTo(xx, base); ctx.stroke(); }
    if (lit) { ctx.fillStyle = `rgba(255,230,170,${0.35 * lit})`; for (let yy = base - h + 10; yy < base; yy += 14) if (r() < 0.6) ctx.fillRect(tx + 4, yy, w - 8, 3); }
    if (tx === 430) { ctx.fillStyle = mixHex(col, '#e8ecf4', 0.6); ctx.fillRect(tx + w / 2 - 3, base - h - 110, 6, 110); } } }
function folder(ctx, x, y, s, label, hl = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e8c878'; ctx.beginPath(); ctx.roundRect(-150, -100, 300, 200, 10); ctx.fill(); ctx.fillRect(-150, -120, 110, 30);
  ctx.fillStyle = '#fbf6ea'; ctx.fillRect(-130, -80, 260, 160); ctx.fillStyle = '#2a2a3a'; ctx.font = `900 26px ${FONT}`; ctx.textAlign = 'center'; label.forEach((l, i) => ctx.fillText(l, 0, -30 + i * 34));
  if (hl) { ctx.strokeStyle = `rgba(255,190,60,${hl})`; ctx.lineWidth = 8; ctx.strokeRect(-156, -106, 312, 212); } ctx.restore(); }

// ================================================================ 1. hook: Lower Manhattan at dawn, summer 2001
function vHook9(ctx, u) {
  bgSky(ctx, ['#3a6ac8', '#9ac0e8', '#ffe0c0']); glow(ctx, 760, 900, 300, '255,220,170', 0.6);
  manhattan(ctx, 1450, 1, true, '#5a6a98'); ctx.fillStyle = '#3a6a9a'; ctx.fillRect(0, 1450, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4)); shadowed(ctx, () => blip(ctx, u, 890, 1700, 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if 9/11', 'had been stopped?'], 300, 0.15, { size: 100, out: OUT('hook') });
}

// ================================================================ 2. REAL: summer 2001, the clues are already on desks
function vClues9(ctx, u) {
  bgSky(ctx, ['#4a4a6a', '#5a5a7a', '#6a6a8a']); ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, 900, W, H);
  folder(ctx, 280, 1120, 1.2, ['MOUSSAOUI', 'arrested Aug 16'], 0); folder(ctx, 760, 1200, 1.2, ['2 SUSPECTS', 'inside the US'], 0); folder(ctx, 480, 1560, 1.2, ['PHOENIX MEMO', 'flight schools'], 0);
  const k = easeInOut(prog(u, 2.4, 3.6)); ctx.strokeStyle = `rgba(255,255,255,${0.25 * (1 - k)})`; ctx.lineWidth = 4; ctx.setLineDash([14, 14]); ctx.beginPath(); ctx.moveTo(380, 1180); ctx.lineTo(660, 1220); ctx.moveTo(400, 1220); ctx.lineTo(460, 1460); ctx.stroke(); ctx.setLineDash([]);
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, 'Summer 2001');
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['The clues are already', 'on government desks'], 240, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['Nobody connects them'], 240, 2.5, { size: 88, out: OUT('clues') });
}

// ================================================================ 3. REAL: memorial (two beams of light)
function vMemorial9(ctx, u) {
  bgSky(ctx, ['#0e1a4a', '#1a2a5a', '#2a3a6a']); stars(ctx, u, 0.5);
  const k = easeInOut(prog(u, 0.2, 1.6));
  for (const x of [470, 610]) { const g = ctx.createLinearGradient(0, 0, 0, 1450); g.addColorStop(0, 'rgba(160,200,255,0)'); g.addColorStop(1, `rgba(190,220,255,${0.6 * k})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30, 1450); ctx.lineTo(x - 90, 0); ctx.lineTo(x + 90, 0); ctx.lineTo(x + 30, 1450); ctx.fill(); }
  manhattan(ctx, 1450, 2, false, '#2a3a6a', 1); ctx.fillStyle = '#1a2a4a'; ctx.fillRect(0, 1450, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, 'September 11, 2001');
  say(ctx, u, ['2,977 people', 'are killed'], 300, 0.4, { size: 100, out: OUT('memorial') });
}

// ================================================================ 4. REAL: two decades of war follow
function vWars9(ctx, u) {
  space(ctx, u);
  const R = 640, cx = 540, cy = 1300, v = gView(50, 25); globe(ctx, cx, cy, R, { lon0: 50, lat0: 25, t: u, ink: false, clouds: 0.2, lights: false });
  const k = easeOut(prog(u, 0.3, 1.6)); for (const [lo, la] of [[67, 34], [44, 33], [72, 30], [38, 35], [48, 15], [45, 2]]) { const [x, y, z] = v(lo, la); if (z < 0.05) continue; glow(ctx, cx + x * R, cy + y * R, 70 * k, '255,150,70', 0.85); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, '2001–2021');
  bigNum(ctx, u, '900,000+', 420, 0.4, { size: 140, color: '#ffd25a', out: OUT('wars') });
  say(ctx, u, ['killed by direct violence in', 'post-9/11 war zones'], 520, 0.6, { size: 60, x: W / 2, align: 'center', out: OUT('wars') });
  say(ctx, u, ['and $8+ trillion spent'], 700, 1.8, { size: 66, x: W / 2, align: 'center', out: OUT('wars') });
}

// ================================================================ 5. FORK: history could have split right here
function vFork9(ctx, u) {
  bgSky(ctx, ['#2a2a5a', '#3a3a6a', '#4a4a7a']);
  const k = easeInOut(prog(u, 0.6, 2.4)); ctx.lineCap = 'round';
  ctx.strokeStyle = '#2a9d5a'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(540, 1800); ctx.lineTo(540, 1150); ctx.quadraticCurveTo(540, 900, 540 - 300 * k, 700 - 200 * k); ctx.stroke();
  ctx.strokeStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(540, 1150); ctx.quadraticCurveTo(540, 900, 540 + 300 * k, 700 - 200 * k); ctx.stroke();
  glow(ctx, 540, 1150, 70, '255,230,160', 0.9); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(540, 1150, 22, 0, 6.283); ctx.fill();
  ctx.globalAlpha = k; ctx.font = `900 38px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#7ad8a0'; ctx.fillText('what happened', 540 - 300, 440); ctx.fillStyle = '#ff8a94'; ctx.fillText('what if', 540 + 300, 440); ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, 'August 2001');
  say(ctx, u, ['History could have', 'split right here'], 240, 0.15, { size: 90, out: 2.4 });
  say(ctx, u, ['What if the FBI had', 'connected the dots?'], 240, 2.5, { size: 84, out: OUT('fork') });
  ctx.font = `700 28px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.textAlign = 'center'; ctx.fillText('The 9/11 Commission did not conclude it could have been prevented', 540, 1880);
}

// ================================================================ 6. WHAT IF: the plotters are stopped before they fly
function vArrest9(ctx, u) {
  bgSky(ctx, ['#d8e4f0', '#e8eef4', '#f4f6fa']);
  ctx.fillStyle = '#c8d0dc'; ctx.fillRect(0, 1100, W, H); ctx.fillStyle = '#8aa8c8'; ctx.fillRect(0, 300, W, 620);
  for (let i = 0; i < 6; i++) { ctx.strokeStyle = '#6a88a8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(i * 200, 300); ctx.lineTo(i * 200, 920); ctx.stroke(); }
  ctx.fillStyle = '#2a3a6a'; ctx.beginPath(); ctx.roundRect(140, 980, 340, 90, 16); ctx.fill(); ctx.font = `900 44px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.textAlign = 'center'; ctx.fillText('GATE 32', 310, 1042);
  const k = easeInOut(prog(u, 0.4, 2.2)); [[560, 3], [700, 5], [820, 7]].forEach(([x, s], i) => person2(ctx, lerp(x + 200, x, k), 1600, 280, { seed: s, t: u }));
  for (let i = 0; i < 3; i++) { const x = 180 + i * 120; person2(ctx, x, 1640, 300, { seed: 40 + i, t: u }); ctx.fillStyle = '#2a3a6a'; ctx.fillRect(x - 46, 1640 - 210, 92, 26); ctx.fillStyle = '#ffd25a'; ctx.font = `900 18px ${FONT}`; ctx.fillText('FBI', x, 1640 - 191); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, 'Early September 2001');
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['In this version, agents stop', 'the plotters before', 'they ever board'], 240, 0.15, { size: 72, out: OUT('arrest') });
}

// ================================================================ 7. WHAT IF: an ordinary Tuesday
function vTuesday9(ctx, u) {
  bgSky(ctx, ['#2a7ae0', '#7ab8f4', '#d8ecff']);
  manhattan(ctx, 1350, 3, true, '#6a7aa8'); ctx.fillStyle = '#9a9aa6'; ctx.fillRect(0, 1350, W, H);
  massCrowd(ctx, u, { n: 160, yFar: 1370, yNear: 1900, sFar: 40, sNear: 160, seed: 9, col: '#3a4a7a', flow: 60 });
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, 'September 11, 2001');
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['It’s just an', 'ordinary Tuesday'], 240, 0.15, { size: 92, out: 2.4 });
  say(ctx, u, ['2,977 people', 'go home that night'], 240, 2.5, { size: 88, out: OUT('tuesday') });
}

// ================================================================ 8. WHAT IF: airports stay simple
function vAirport9(ctx, u) {
  bgSky(ctx, ['#e8eef4', '#f0f4f8', '#f8fafc']); ctx.fillStyle = '#d8dce4'; ctx.fillRect(0, 1200, W, H);
  ctx.fillStyle = '#9ab8d8'; ctx.fillRect(0, 380, W, 600);
  for (let i = 0; i < 4; i++) { const x = ((i * 300 + u * 160) % (W + 300)) - 150; person2(ctx, x, 1600, 300, { seed: 20 + i, t: u }); ctx.fillStyle = ['#ffbe0b', '#3a86ff', '#2ec4b6', '#ff7aa8'][i]; ctx.beginPath(); ctx.roundRect(x + 30, 1500, 70, 100, 10); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['Airport security stays', 'simple. Shoes stay on.', 'Probably no TSA'], 240, 0.15, { size: 78, out: OUT('airport') });
}

// ================================================================ 9. WHAT IF: the wars may never happen
function vNoWar9(ctx, u) {
  space(ctx, u);
  const R = 640, cx = 540, cy = 1300; globe(ctx, cx, cy, R, { lon0: 50, lat0: 25, t: u, ink: false, clouds: 0.3, lights: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Probably no invasion of', 'Afghanistan in 2001'], 240, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['An Iraq war: far less likely,', 'many historians argue'], 240, 2.5, { size: 74, out: OUT('nowar') });
}

// ================================================================ 10. WHAT IF: but the threat doesn't vanish
function vThreat9(ctx, u) {
  bgSky(ctx, ['#c8a878', '#e8c898', '#f4e0b8']); ctx.fillStyle = '#b89868'; ctx.fillRect(0, 1200, W, H);
  ctx.fillStyle = '#9a7a58'; ctx.beginPath(); ctx.moveTo(-50, 1200); ctx.quadraticCurveTo(300, 900, 600, 1050); ctx.quadraticCurveTo(850, 950, W + 50, 1150); ctx.lineTo(W + 50, 1220); ctx.lineTo(-50, 1220); ctx.fill();
  folder(ctx, 540, 1500, 1.4, ['STILL ACTIVE', 'still plotting'], 0.6 + 0.3 * Math.sin(u * 2 * Math.PI * 0.6));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['But al-Qaeda is still', 'out there, still plotting'], 240, 0.15, { size: 80, out: OUT('threat') });
}

// ================================================================ 11. WHAT IF: 2026, the towers still stand
function vToday9(ctx, u) {
  bgSky(ctx, ['#3a5ab8', '#a88ac0', '#ffc8a0']); glow(ctx, 760, 1100, 300, '255,210,160', 0.6);
  manhattan(ctx, 1450, 4, true, '#5a6a9a', 0.6); ctx.fillStyle = '#3a5a8a'; ctx.fillRect(0, 1450, W, H);
  for (let i = 0; i < 3; i++) { const x = 120 + i * 360; ctx.fillStyle = '#4a5a8a'; ctx.fillRect(x, 1450 - 560 - i * 60, 40, 560 + i * 60); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); dateTag(ctx, u, '2026');
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['2026: the Twin Towers', 'still stand, ~53 years old'], 240, 0.15, { size: 78, out: OUT('today') });
}

// ================================================================ 12. final: lit skyline at night; the stakes
function vFinal9(ctx, u) {
  bgSky(ctx, ['#0e1a4a', '#1a2a5a', '#2a3a6a']); stars(ctx, u, 0.5);
  manhattan(ctx, 1450, 5, true, '#2a3a6a', 1); ctx.fillStyle = '#1a2a4a'; ctx.fillRect(0, 1450, W, H);
  ctx.save(); ctx.globalAlpha = 0.35; ctx.scale(1, -0.5); ctx.translate(0, -1450 * 3); manhattan(ctx, 1450, 5, true, '#2a3a6a', 1); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['One connected clue.', 'Maybe a different', 'century'], 260, 0.15, { size: 92, out: OUT('final') });
}
function vEnd9(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -74 + u * 4, lat0: 30, t: u, ink: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ action kit
const tm = (u, a, b, f) => (u < a ? u : u < b ? a + (u - a) * f : a + (b - a) * f + (u - b));   // slow-motion time remap
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.25)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function dustBlast(ctx, x, y, dt, seed, o = {}) {   // a rolling dust cloud that grows toward the camera
  const { n = 40, spread = 700, col = '#b8a090', up = 300, life = 3 } = o; if (dt <= 0) return; const r = rng(seed);
  for (let i = 0; i < n; i++) { const a = -Math.PI * r(), sp = 0.3 + r() * 0.7, k = 1 - Math.exp(-dt * 2.2), px = x + Math.cos(a) * spread * sp * k * 1.3, py = y + Math.sin(a) * up * sp * k;
    puff(ctx, px, py, (40 + r() * 70) * (0.5 + k * 1.6), mixHex(col, '#6a5a50', r() * 0.5), 0.9 * R2(1 - dt / life)); } }
function debrisAtCam(ctx, x, y, dt, seed, n = 40, col = '#3a3030') {   // chunks that fly outward and swell as if toward the lens
  if (dt <= 0) return; const r = rng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) { const a = r() * 6.283, sp = 300 + r() * 900, d = sp * dt, sc = 1 + dt * (1 + r() * 3), px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.7 + 400 * dt * dt, s = (6 + r() * 12) * sc;
    if (px < -100 || px > W + 100 || py > H + 100) continue; ctx.save(); ctx.translate(px, py); ctx.rotate(dt * (4 + r() * 8) + i); ctx.fillRect(-s / 2, -s / 3, s, s * 0.66); ctx.restore(); } }
function carSide(ctx, x, y, s, col, rot = 0, dir = 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * dir, s);
  ctx.fillStyle = col; roundRect(ctx, -80, -46, 160, 34, 12); ctx.fill(); roundRect(ctx, -46, -74, 86, 34, 14); ctx.fill();
  ctx.fillStyle = '#bfe8ff'; roundRect(ctx, -38, -68, 34, 24, 6); ctx.fill(); roundRect(ctx, 2, -68, 30, 24, 6); ctx.fill();
  ctx.fillStyle = '#16161e'; ctx.beginPath(); ctx.arc(-46, -10, 15, 0, 6.283); ctx.arc(48, -10, 15, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ffe9a0'; ctx.fillRect(74, -40, 8, 8); ctx.fillStyle = '#ff3a3a'; ctx.fillRect(-82, -40, 6, 8); ctx.restore(); }
function carRear(ctx, x, y, s, col, toward = false) { const w = 150 * s, h = 80 * s; ctx.fillStyle = col; roundRect(ctx, x - w / 2, y - h, w, h, 14 * s); ctx.fill();
  ctx.fillStyle = 'rgba(20,24,40,0.6)'; roundRect(ctx, x - w * 0.36, y - h * 0.95, w * 0.72, h * 0.4, 8 * s); ctx.fill();
  ctx.fillStyle = toward ? '#fff6d0' : '#ff2a2a'; ctx.fillRect(x - w * 0.46, y - h * 0.45, w * 0.16, h * 0.14); ctx.fillRect(x + w * 0.3, y - h * 0.45, w * 0.16, h * 0.14);
  if (s > 0.12) glow(ctx, x, y - h * 0.4, w * 0.8, toward ? '255,240,200' : '255,60,40', 0.25); }
function palm(ctx, x, base, h, sway = 0) { ctx.strokeStyle = '#2a1a24'; ctx.lineWidth = h * 0.035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x + h * 0.08, base - h * 0.5, x + sway, base - h); ctx.stroke();
  ctx.lineWidth = h * 0.025; for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6 + sway * 0.002; ctx.beginPath(); ctx.moveTo(x + sway, base - h); ctx.quadraticCurveTo(x + sway + Math.cos(a) * h * 0.2, base - h - h * 0.12, x + sway + Math.cos(a) * h * 0.32, base - h + Math.abs(Math.sin(a)) * h * 0.05 + h * 0.08); ctx.stroke(); } }
const CARCOL = ['#e63946', '#3a86ff', '#ffbe0b', '#f1f1f1', '#2ec4b6', '#8338ec', '#fb5607', '#16161e'];

// ================================================================ 1. hook: LA at golden hour
function vWave(ctx, u) {
  const vy = 860, [sx, sy] = shakeOffset(u, 0.4, 4, 18);
  bgSky(ctx, ['#3a4a8a', '#d07a6a', '#ffb07a']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: vy + 6, seed: 5, hMin: 60, hMax: 300, wMin: 30, wMax: 80, gap: 5, col: '#6a3a5a', win: 'rgba(255,220,160,0.5)', winP: 0.3, ws: 4 });
  const zc = lerp(16, -3, easeIn2(prog(u, 0.2, 3.6))), disp = z => { const d = (z - zc) / 2.6; return Math.exp(-d * d) * Math.cos((z - zc) * 1.3) * 300; };
  const Zs = []; for (let z = 1; z < 45; z *= 1.04) Zs.push(z);
  const edge = (z, side) => { const s = 1 / z; return [W / 2 + side * 560 * s, vy + 900 * s - disp(z) * Math.min(1, s * 4)]; };
  ctx.fillStyle = '#4a3a4a'; ctx.beginPath(); Zs.forEach((z, i) => { const [x, y] = edge(z, -1); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); [...Zs].reverse().forEach(z => ctx.lineTo(...edge(z, 1))); ctx.fill();
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 6; ctx.beginPath(); Zs.forEach((z, i) => { const s = 1 / z, y = vy + 900 * s - disp(z) * Math.min(1, s * 4); i ? ctx.lineTo(W / 2, y) : ctx.moveTo(W / 2, y); }); ctx.stroke();
  const cars = []; for (let lane = -2; lane <= 2; lane++) { if (lane === 0) continue; for (let z = 1.25; z < 18; z *= 1.32) cars.push([lane, z * (1 + ((lane * 13 + Math.floor(z * 9)) % 5) * 0.04)]); }
  cars.sort((a, b) => b[1] - a[1]);
  for (const [lane, z] of cars) { const s = 1 / z, x = W / 2 + (lane - Math.sign(lane) * 0.5) * 230 * s, y = vy + 900 * s - disp(z) * Math.min(1, s * 4) - Math.abs(disp(z)) * s * 0.4;
    carRear(ctx, x, y, s * 1.6, CARCOL[(lane + 3 + Math.floor(z * 3)) % 8], lane < 0); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'M10', 330, 0.2, { size: 190, color: '#ffd25a', out: 1.9 });
  say(ctx, u, ['The ground rolls', 'like an ocean wave'], 230, 2.0, { size: 88, out: OUT('wave') });
}

function vOverpass(ctx, u) {
  const brk = 1.2, vt = tm(u, brk, 4.6, 0.35), fdt = Math.max(0, vt - brk), drop = Math.min(700, 0.5 * 2400 * fdt * fdt), landed = drop >= 700;
  const landAt = brk + Math.sqrt(700 * 2 / 2400) / 0.35, ldt = u - landAt;
  const [sx, sy] = shakeOffset(u, 0, 5.4, 10 + (ldt > 0 ? 30 * Math.exp(-ldt * 2) : 0));
  bgSky(ctx, ['#1e3a5a', '#2a7a8a', '#ffa06a']); ctx.translate(sx, sy);
  glow(ctx, 820, 900, 380, '255,190,120', 0.6);
  cityLayer(ctx, u, { base: 1300, seed: 7, hMin: 120, hMax: 520, wMin: 50, wMax: 120, gap: 8, col: '#1e3048', win: 'rgba(255,220,160,0.5)', winP: 0.35, ws: 6 });
  ctx.fillStyle = '#3a3440'; ctx.fillRect(0, 1700, W, H);
  // columns
  ctx.fillStyle = '#8a8690'; for (const x of [60, 300, 760, 1000]) ctx.fillRect(x - 28, 1060, 56, 640);
  const deck = (x0, x1, y, rot = 0, px = x0) => { ctx.save(); ctx.translate(px, y); ctx.rotate(rot); ctx.translate(-px, -y); ctx.fillStyle = '#b0acb6'; ctx.fillRect(x0, y, x1 - x0, 70); ctx.fillStyle = '#7a7680'; ctx.fillRect(x0, y + 54, x1 - x0, 16);
    ctx.fillStyle = '#d0ccd6'; ctx.fillRect(x0, y - 18, x1 - x0, 18); ctx.restore(); };
  deck(-60, 300, 1000); deck(760, 1140, 1000);
  const rot = landed ? 0.12 : fdt * 0.08;
  ctx.save(); ctx.translate(530, 1000 + drop); ctx.rotate(rot); ctx.translate(-530, -1000); deck(300, 760, 1000);
  [[380, '#e63946'], [560, '#3a86ff'], [700, '#ffbe0b']].forEach(([x, c], i) => { const slide = landed ? Math.min(80, (u - landAt) * 120) * (i % 2 ? 1 : -1) : 0, flip = !landed ? fdt * (i - 1) * 0.6 : (i - 1) * 0.5;
    carSide(ctx, x + slide, 982 - (landed ? 0 : fdt * 60 * (i % 2)), 0.9, c, flip); });
  ctx.restore();
  // cars that stop at the brink
  carSide(ctx, lerp(-100, 210, easeOut(R2(u / 1.4))), 982, 0.9, '#2ec4b6', u > brk ? Math.sin(u * 8) * 0.05 + 0.08 : 0);
  carSide(ctx, lerp(W + 100, 870, easeOut(R2(u / 1.4))), 982, 0.9, '#f1f1f1', 0, -1);
  if (u > brk && !landed) { const r = rng(2); ctx.fillStyle = '#9a96a0'; for (let i = 0; i < 16; i++) { const x = 300 + r() * 460, y = 1070 + drop * (0.6 + r() * 0.6); ctx.fillRect(x, y, 20 + r() * 30, 14 + r() * 20); } }
  if (ldt > 0) { dustBlast(ctx, 530, 1700, ldt * 0.6, 5, { n: 46, spread: 900, up: 700, col: '#c8b0a0', life: 3 }); debrisAtCam(ctx, 530, 1600, ldt * 0.6, 9, 50, '#5a5058'); }
  flash(ctx, u, landAt, 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Every freeway', 'bridge is tested.', 'Many fall'], 230, 0.15, { size: 84, out: OUT('overpass') });
}

function vCrack(ctx, u) {
  const vy = 980, p = easeIn2(prog(u, 0.3, 1.5)), shear = easeOut(R2((u - 1.5) / 0.25)) * 240, [sx, sy] = shakeOffset(u, 0.3, 4, 16 + (u > 1.5 ? 20 : 0));
  bgSky(ctx, ['#3a5a9a', '#e8a06a', '#ffd6a0']); ctx.translate(sx, sy);
  mountainsS(ctx, vy, 3, '#8a6a7a', 160);
  const crackX = y => W / 2 + 40 + (y - vy) * 0.18 + Math.sin(y * 0.03) * 14;
  const world = () => { ctx.fillStyle = '#d0a070'; ctx.fillRect(-300, vy, W + 600, H); ctx.fillStyle = '#4a4048'; ctx.beginPath(); ctx.moveTo(W / 2 - 30, vy); ctx.lineTo(W / 2 + 30, vy); ctx.lineTo(W + 500, H); ctx.lineTo(-500, H); ctx.fill();
    ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 10; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(W / 2, vy); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
    const r = rng(4); for (let i = 0; i < 14; i++) { const y = vy + 30 + r() * 900, x = r() < 0.5 ? r() * 200 : W - r() * 200; ctx.fillStyle = '#7a8a4a'; ctx.beginPath(); ctx.arc(x, y, 14 + (y - vy) * 0.05, 0, 6.283); ctx.fill(); } };
  const half = (right, off) => { ctx.save(); ctx.beginPath(); ctx.moveTo(crackX(vy), vy); for (let y = vy; y <= H; y += 30) ctx.lineTo(crackX(y), y);
    ctx.lineTo(right ? W + 600 : -600, H); ctx.lineTo(right ? W + 600 : -600, vy); ctx.closePath(); ctx.clip(); ctx.translate(off, 0); world(); ctx.restore(); };
  half(false, 0); half(true, shear);
  const yEnd = lerp(vy, H, p); ctx.strokeStyle = '#1a1014'; ctx.lineWidth = 14 + (u > 1.5 ? 30 : 0); ctx.beginPath(); ctx.moveTo(crackX(vy), vy); for (let y = vy; y <= yEnd; y += 30) ctx.lineTo(crackX(y) + shear * 0.5, y); ctx.stroke();
  if (u > 0.3 && u < 1.6) { const tip = [crackX(yEnd), yEnd]; dustBlast(ctx, tip[0], tip[1], 0.4, Math.floor(u * 10), { n: 10, spread: 200, up: 160, col: '#c8a080', life: 1 }); }
  if (u > 1.5) { for (let k = 0; k < 6; k++) { const y = vy + 100 + k * 150; dustBlast(ctx, crackX(y) + shear * 0.5, y, (u - 1.5) * 0.7, k + 20, { n: 8, spread: 300, up: 260, col: '#c8a080', life: 2.5 }); } debrisAtCam(ctx, crackX(1700), 1700, (u - 1.5) * 0.6, 4, 30, '#5a4038'); }
  // a car skids to a stop at the edge
  const k = easeOut(R2((u - 0.6) / 1.6)), cy = lerp(1050, 1560, k), cs = lerp(0.3, 1.5, k);
  ctx.save(); ctx.translate(W / 2 - 140 * cs * 0.6, cy); ctx.rotate(k > 0.7 ? (k - 0.7) * 1.2 : 0); carRear(ctx, 0, 0, cs, '#e63946', true); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['The ground rips open', 'and lurches sideways'], 230, 0.15, { size: 84, out: OUT('crack') });
}

function mountainsS(ctx, base, seed, col, amp) { const r = rng(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, base); let x = -50; while (x < W + 50) { const w = 140 + r() * 160; ctx.lineTo(x + w / 2, base - amp * (0.4 + r() * 0.6)); x += w; ctx.lineTo(x, base - r() * amp * 0.2); } ctx.lineTo(W + 50, base); ctx.fill(); }

function crane(ctx, x, base, s, rot, col) { ctx.save(); ctx.translate(x, base); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-70, -520); ctx.moveTo(90, 0); ctx.lineTo(70, -520); ctx.moveTo(-80, -260); ctx.lineTo(80, -260); ctx.moveTo(-90, 0); ctx.lineTo(70, -520); ctx.stroke();
  ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-420, -520); ctx.lineTo(260, -520); ctx.stroke(); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -700); ctx.lineTo(-420, -520); ctx.moveTo(0, -700); ctx.lineTo(260, -520); ctx.moveTo(0, -700); ctx.lineTo(0, -520); ctx.stroke(); ctx.restore(); }

function sea(ctx, u, hy, cols, swell = null, seed = 1) {
  const g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);
  const r = rng(seed);
  for (let j = 0; j < 40; j++) { const q = (j + 1) / 40, y0 = hy + (H - hy) * q * q, n = 6 + Math.floor(q * 8);
    for (let i = 0; i < n; i++) { const x = ((r() * W + u * 30 * (0.5 + q)) % (W + 100)) - 50, lift = swell ? swell(x / W, q) : 0, w = 20 + q * 120;
      ctx.strokeStyle = `rgba(255,255,255,${0.12 + q * 0.25})`; ctx.lineWidth = 1 + q * 4; ctx.beginPath(); ctx.moveTo(x - w, y0 - lift); ctx.quadraticCurveTo(x, y0 - lift - 3 - q * 8, x + w, y0 - lift); ctx.stroke(); } }
}
// a breaking wave wall seen side-on; front edge at x moving left, height h, base y

function waveWall(ctx, u, x, base, h, seed = 3, col = '#1f7fb0') {
  if (h <= 0) return;
  const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, '#7fd4f0'); g.addColorStop(0.35, col); g.addColorStop(1, '#0f4f7a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + h * 0.9, base); ctx.lineTo(x, base);
  ctx.quadraticCurveTo(x - h * 0.05, base - h * 0.6, x + h * 0.05, base - h * 0.95); ctx.quadraticCurveTo(x - h * 0.25, base - h * 1.05, x - h * 0.32, base - h * 0.82);
  ctx.quadraticCurveTo(x - h * 0.05, base - h * 1.25, x + h * 0.6, base - h * 1.05); ctx.lineTo(W + 600, base - h * 0.95); ctx.lineTo(W + 600, base); ctx.fill();
  const r = rng(seed); for (let i = 0; i < 26; i++) { const a = r() * 3.1, rr = h * (0.08 + r() * 0.12);
    puff(ctx, x - h * 0.2 + Math.cos(a) * h * 0.35 + Math.sin(u * 3 + i) * 8, base - h * 0.95 - Math.sin(a) * h * 0.2, rr, '#e8f6fc', 0.85); }
  for (let i = 0; i < 40; i++) { const px = x - r() * h * 0.6, py = base - h * (1 + r() * 0.4) - ((u * 200 * (0.5 + r())) % (h * 0.5)); puff(ctx, px, py, 4 + r() * 10, '#ffffff', 0.6); }
}

function dest(lon, lat, brg, d) { const D = Math.PI / 180, p1 = lat * D, l1 = lon * D;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(brg));
  const l2 = l1 + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2)); return [l2 / D, p2 / D]; }

function ringOnGlobe(ctx, v, cx, cy, R, ctr, dRad, col, lw) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let pen = false;
  for (let b = 0; b <= 6.3; b += 0.02) { const [lo, la] = dest(ctr[0], ctr[1], b, dRad), [x, y, z] = v(lo, la);
    if (z > 0) { pen ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); pen = true; } else pen = false; }
  ctx.stroke(); }

function vPort2(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.4)), lvl = lerp(1360, 1020, k), [sx, sy] = shakeOffset(u, 1.2, 2.5, 16);
  bgSky(ctx, ['#4a8ad8', '#9ac8f0', '#ffe0b8']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1000, seed: 50, hMin: 80, hMax: 340, wMin: 40, wMax: 90, gap: 6, col: '#7a8ab0', win: 'rgba(255,240,200,0.4)', winP: 0.3, ws: 4 });
  ctx.fillStyle = '#9a96a0'; ctx.fillRect(0, 1260, W, H);
  [[260, 0], [700, 0.25]].forEach(([x, d]) => crane(ctx, x, 1260, 0.9, easeIn2(R2((u - 1.3 - d) / 1.6)) * 1.2, d ? '#e6c84a' : '#ff8a3a'));
  const CC = ['#3a86ff', '#ffbe0b', '#2ec4b6', '#8338ec', '#fb5607', '#e8e8f0'], r = rng(51);
  for (let i = 0; i < 24; i++) { const c = i % 8, rw = Math.floor(i / 8), bx = 40 + c * 130, by = 1250 - rw * 60, fl = R2((u - 1.0 - r() * 0.6) / 2);
    ctx.save(); ctx.translate(bx + fl * (200 + r() * 300), Math.min(by, lvl - 30 - rw * 20 * fl) - fl * r() * 100); ctx.rotate(fl * (r() - 0.5) * 1.6); ctx.fillStyle = CC[(i * 5) % 6]; ctx.fillRect(-60, -28, 120, 56); ctx.fillStyle = 'rgba(0,0,0,0.15)'; for (let q = 0; q < 6; q++) ctx.fillRect(-52 + q * 20, -22, 6, 44); ctx.restore(); }
  // ship shoved onto the dock
  ctx.save(); ctx.translate(lerp(-300, 380, k), lvl - 20); ctx.rotate(-0.12 * k); ctx.fillStyle = '#263a6a'; ctx.beginPath(); ctx.moveTo(-380, -50); ctx.lineTo(380, -50); ctx.lineTo(330, 40); ctx.lineTo(-330, 40); ctx.fill(); ctx.fillStyle = '#e8e8f0'; ctx.fillRect(-340, -150, 90, 100); ctx.restore();
  const g = ctx.createLinearGradient(0, lvl, 0, H); g.addColorStop(0, 'rgba(60,160,210,0.9)'); g.addColorStop(1, 'rgba(20,80,130,0.95)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, lvl + Math.sin(x * 0.015 + u * 4) * 24); ctx.lineTo(W, H); ctx.fill();
  for (let x = 0; x <= W; x += 60) puff(ctx, x, lvl + Math.sin(x * 0.015 + u * 4) * 24, 28, '#f0fbff', 0.7);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['LA & Long Beach ports:', '~1/3 of US imports.', 'Wrecked.'], 230, 0.15, { size: 76, out: OUT('port') });
}

function vFires(ctx, u) {
  bgSky(ctx, ['#2a2a6a', '#4a3a8a', '#6a4a9a']);
  ctx.save(); ctx.translate(540, 1100); ctx.scale(1 + u * 0.02, 1 + u * 0.02); ctx.translate(-540, -1100);
  ctx.fillStyle = '#5a5a8a'; ctx.fillRect(-100, 500, W + 200, H);
  const r = rng(14); for (let j = 0; j < 30; j++) for (let i = 0; i < 20; i++) { const x = i * 58 - 20 + (j % 2) * 20, y = 520 + j * 50; ctx.fillStyle = ['#8a7aa8', '#9a8aa0', '#7a6a98'][(i + j) % 3]; ctx.fillRect(x, y, 48, 36); ctx.fillStyle = 'rgba(40,30,70,0.35)'; ctx.fillRect(x, y + 30, 48, 6); }
  ctx.strokeStyle = '#9a9ac0'; ctx.lineWidth = 14; for (const y of [760, 1260, 1660]) { ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); }
  const F = []; for (let i = 0; i < 12; i++) F.push([80 + r() * 920, 600 + r() * 1200, r() * 1.5, 80 + r() * 160]);
  for (const [x, y, t0, sz] of F) { const g = R2((u - t0) / 2.5), s = sz * (0.4 + g); if (u < t0) continue;
    glow(ctx, x, y, s * 1.6, '255,150,60', 0.75); for (let k = 0; k < 6; k++) puff(ctx, x + k * 30 + u * 40, y - 60 - k * 70, 40 + k * 22, '#6a5a80', 0.55);
    ctx.fillStyle = '#ffb04a'; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + u; ctx.beginPath(); ctx.arc(x + Math.cos(a) * s * 0.4, y + Math.sin(a) * s * 0.25, s * 0.18, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(x, y, s * 0.2, 0, 6.283); ctx.fill(); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Gas lines burst.', 'Thousands of fires'], 230, 0.15, { size: 76, out: 1.9 });
  say(ctx, u, ['and no water', 'to fight them'], 230, 2.0, { size: 80, out: OUT('fires') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -118 + u * 4, lat0: 30, t: u, ink: false });
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
