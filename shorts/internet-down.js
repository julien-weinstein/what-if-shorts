// What if the internet crashed forever?
//
// FACTS (checked):
//  - ~5.5 billion people use the internet (ITU, 2024).
//  - Undersea cables carry over 99% of intercontinental data (~1.4 million km of cable).
//  - Visa alone processes roughly 600+ million transactions a day (~230 billion/yr).
//  - Supermarkets typically hold only a few days of stock ("3 days", hedged est.); just-in-time restocking is digital.
//  - July 2024 CrowdStrike faulty update: ~8.5 million computers crashed; thousands of flights cancelled; hospitals and
//    banks disrupted. (Shown generically, no brand.)
//  - Ships carry ~80% of world trade by volume (UNCTAD); bookings, customs and port operations are digital.
//  - Global stock market value ~$110 trillion.
//  - Data centres and networks use ~2-3% of world electricity (IEA). COVID lockdowns cut global CO2 ~5% in 2020.
//  - World population ~5.3 billion in 1990 (pre-web), ~8.2 billion today.
//  - First ARPANET message (29 Oct 1969, UCLA -> Stanford): "LOGIN" crashed after "LO".
//  - Toll (est., hedged): failing hospitals, food and water systems could cost millions of lives.
// PLOT HOLES: GPS still works (satellite), but most apps that use it need data. Radio and TV broadcast still work, which is
//  why the rebuild runs on radio. "Forever" = the global network can't be restored (premise).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['phones', 4.5, [[0.8, 'impact'], [0.85, 'boom']]],
  ['cable', 4.5, [[0.2, 'rumble:4.2'], [1.8, 'boom']]],
  ['money', 4.5, [[1.0, 'impact']]],
  ['food', 4.5, [[0.2, 'roar:4.2']]],
  ['screens', 4.5, [[0.4, 'impact'], [1.2, 'boom']]],
  ['blackout', 4.5, [[0.2, 'rumble:4.2'], [1.0, 'boom'], [2.2, 'boom']]],
  ['geo', 5.0, [[0.2, 'heart:4.6'], [1.2, 'impact']]],
  ['ports', 4.5, [[0.2, 'rumble:4.2']]],
  ['planet', 5.0, [[0.2, 'swell:4.6']]],
  ['rebuild', 5.0, [[0.2, 'swell:4.6']]],
  ['lo', 4.5, [[1.8, 'impact']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the internet crashed forever?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 76, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, phones: vPhones, cable: vCable, money: vMoney, food: vFood, screens: vScreens, blackout: vBlackout, geo: vGeo,
              ports: vPorts, planet: vPlanet, rebuild: vRebuild, lo: vLO, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const MONO = '"JetBrains Mono", "Menlo", "Consolas", monospace';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2, contrast: 1.06, saturate: 1.1 });
}
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.2)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function wifiIcon(ctx, x, y, s, col, cut = 0) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.12;
  for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 0, s * 0.3 * i, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, 6.283); ctx.fill();
  if (cut > 0) { ctx.strokeStyle = '#e63946'; ctx.lineWidth = s * 0.14; ctx.beginPath(); ctx.moveTo(-s * 0.9, -s * 1.0); ctx.lineTo(-s * 0.9 + s * 1.8 * cut, -s * 1.0 + s * 1.2 * cut); ctx.stroke(); }
  ctx.restore();
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#1b2a6b', '#3a4fc0', '#4f8bea']);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1100);
  const r = rng(3); for (let i = 0; i < 30; i++) { const x = r() * W, y = (r() * H + u * 60) % H; ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.font = `700 ${20 + r() * 20}px ${MONO}`; ctx.fillText(r() < 0.5 ? '0' : '1', x, y); }
  const k = easeBack(R2(prog(u, 0.1, 0.8))); wifiIcon(ctx, W / 2, 1250, 420 * k, '#ffffff', easeInOut(prog(u, 1.4, 2.0)));
  if (u > 1.4) glow(ctx, W / 2, 1100, 400, '230,57,70', 0.3 * R2((u - 1.4) / 0.6));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.5 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the', 'internet crashed', 'forever?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 1, from: 0, to: 8, color: '#e63946' } });
}

// ================================================================ 2. 5.5 billion phones go dark at once
function vPhones(ctx, u) {
  const cut = 0.8;
  bgSky(ctx, ['#ffd6a8', '#ffb98a', '#ff9a7a']);
  drift(ctx, u, 0, 4.5, 1.0, 1.06, W / 2, 1300);
  cityLayer(ctx, u, { base: 1150, seed: 3, hMin: 120, hMax: 520, wMin: 50, wMax: 130, gap: 8, col: '#c87a6a', win: 'rgba(255,240,210,0.6)', winP: 0.4, ws: 7 });
  ctx.fillStyle = '#e8a07a'; ctx.fillRect(0, 1150, W, H);
  massCrowd(ctx, u, { n: 1500, yFar: 1170, yNear: 2150, sFar: 10, sNear: 200, seed: 4, col: '#6a3a3a', rim: 'rgba(255,240,200,0.4)', phones: u < cut ? 0.7 : 0, arms: u > cut + 0.4 ? 0.25 : 0 });
  if (u > cut) { const r = rng(5); for (let i = 0; i < 40; i++) { const x = r() * W, y = 1250 + r() * 600, s = 30 + r() * 30; ctx.save(); ctx.globalAlpha = R2((u - cut - r() * 0.4) / 0.3);
    ctx.fillStyle = '#1b1b2e'; roundRect(ctx, x - s * 0.5, y - s * 0.8, s, s * 1.6, s * 0.15); ctx.fill(); wifiIcon(ctx, x, y + s * 0.15, s * 0.4, '#9aa0b0', 1); ctx.restore(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['5.5 billion people', 'lose it at once'], 230, 0.15, { size: 88, out: OUT('phones') });
}

// ================================================================ 3. the undersea cables go dark
function vCable(ctx, u) {
  const off = 1.8, dark = R2((u - off) / 0.6);
  bgSky(ctx, ['#0a3a5a', '#062a46', '#031a30']);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 100 + i * 180 + Math.sin(u + i) * 40; ctx.fillStyle = 'rgba(120,200,255,0.05)'; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 200, 1400); ctx.lineTo(x - 140, 1400); ctx.fill(); } ctx.restore();
  ctx.fillStyle = '#c8b080'; ctx.beginPath(); ctx.moveTo(0, 1500); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 1480 + Math.sin(x * 0.01) * 30); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  const cy = x => 1380 + Math.sin(x * 0.004 + 1) * 120;
  ctx.strokeStyle = '#1a1a22'; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath(); for (let x = -40; x <= W + 40; x += 20) x === -40 ? ctx.moveTo(x, cy(x)) : ctx.lineTo(x, cy(x)); ctx.stroke();
  ctx.strokeStyle = '#2a2a36'; ctx.lineWidth = 30; ctx.stroke();
  for (let i = 0; i < 14; i++) { const x = ((u * 600 + i * 160) % (W + 200)) - 100, a = 1 - dark; if (a <= 0) break; glow(ctx, x, cy(x), 50, '90,220,255', 0.9 * a); ctx.fillStyle = `rgba(180,240,255,${a})`; ctx.fillRect(x - 24, cy(x) - 5, 48, 10); }
  if (u > off && u < off + 0.6) glow(ctx, 540, cy(540), 300, '255,240,200', 0.9 * (1 - (u - off) / 0.6));
  const r = rng(8); for (let i = 0; i < 10; i++) { const x = ((r() * W + u * (40 + r() * 60)) % (W + 100)) - 50, y = 500 + r() * 800; ctx.fillStyle = 'rgba(20,60,90,0.8)'; ctx.beginPath(); ctx.ellipse(x, y, 30, 12, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.lineTo(x - 46, y - 12); ctx.lineTo(x - 46, y + 12); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['99% of data between', 'continents runs through', 'cables on the seabed'], 230, 0.15, { size: 72, out: 1.9 });
  say(ctx, u, ['1.4 million km of them.', 'All dark.'], 230, 2.3, { size: 84, out: OUT('cable') });
}

// ================================================================ 4. money stops
function vMoney(ctx, u) {
  const fail = 1.0;
  bgSky(ctx, ['#e8f4ff', '#d0e4f4', '#b8d4ea']);
  for (let i = 0; i < 6; i++) person2(ctx, 140 + i * 160, 1260, 220, { seed: i + 1, t: u, dir: -1 });
  ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, 1260, W, 120); ctx.fillStyle = '#6a4a30'; ctx.fillRect(0, 1380, W, H);
  // hand-written sign
  if (u > 2.4) { const k = easeBack(R2((u - 2.4) / 0.4)); ctx.save(); ctx.translate(800, 760); ctx.rotate(0.08); ctx.scale(k, k); ctx.fillStyle = '#fff6c8'; ctx.fillRect(-150, -80, 300, 160); ctx.font = `900 54px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e63946'; ctx.fillText('CASH', 0, -10); ctx.fillText('ONLY', 0, 50); ctx.restore(); }
  // the card terminal
  const sh = u > fail && u < fail + 0.4 ? Math.sin(u * 80) * 8 : 0;
  ctx.save(); ctx.translate(W / 2 + sh, 1500); ctx.fillStyle = '#20202a'; roundRect(ctx, -230, -320, 460, 620, 50); ctx.fill();
  ctx.fillStyle = u < fail ? '#2ec4b6' : '#e63946'; roundRect(ctx, -190, -280, 380, 240, 24); ctx.fill();
  ctx.font = `900 50px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText(u < fail ? 'TAP CARD' : 'NO', 0, -170); if (u >= fail) ctx.fillText('CONNECTION', 0, -110);
  ctx.fillStyle = '#3a3a48'; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { roundRect(ctx, -150 + c * 110, -10 + r * 70, 90, 54, 12); ctx.fill(); }
  ctx.restore();
  const cx = lerp(W + 200, W / 2 + 120, easeOut(R2(u / 0.8))); ctx.save(); ctx.translate(cx, 1300); ctx.rotate(-0.4); ctx.fillStyle = '#3a86ff'; roundRect(ctx, -110, -70, 220, 140, 14); ctx.fill(); ctx.fillStyle = '#ffd25a'; ctx.fillRect(-80, -30, 50, 40); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Cards stop working.', 'ATMs too.'], 230, 0.15, { size: 88, out: 2.3 });
  say(ctx, u, ['Visa alone handles 600', 'million payments a day'], 230, 2.4, { size: 72, out: OUT('money') });
}

// ================================================================ 5. supermarkets empty
function vFood(ctx, u) {
  bgSky(ctx, ['#f8f4ec', '#ece6da', '#ddd4c4']);
  const vy = 900, empty = easeIn2(prog(u, 0.3, 4.0)), r0 = rng(11);
  ctx.fillStyle = '#c8c0b0'; ctx.beginPath(); ctx.moveTo(W / 2 - 60, vy); ctx.lineTo(W / 2 + 60, vy); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H); ctx.fill();
  for (const side of [-1, 1]) for (let k = 9; k >= 0; k--) { const z = 1 + k * 0.7, z2 = z + 0.7, s = 1 / z, s2 = 1 / z2, xa = W / 2 + side * 420 * s, xb = W / 2 + side * 420 * s2;
    for (let sh = 0; sh < 5; sh++) { const ya = vy - 700 * s + sh * 320 * s, yb = vy - 700 * s2 + sh * 320 * s2;
      ctx.fillStyle = '#9a9286'; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.lineTo(xb, yb + 18 * s2); ctx.lineTo(xa, ya + 18 * s); ctx.fill();
      const r = rng(k * 31 + sh * 7 + (side > 0 ? 3 : 0)); for (let i = 0; i < 4; i++) { if (r() < empty * 1.2) { r(); continue; } const f = (i + 0.5) / 4, x = lerp(xa, xb, f), y = lerp(ya, yb, f), bs = lerp(s, s2, f) * 120;
        ctx.fillStyle = ['#e63946', '#ffbe0b', '#3a86ff', '#2ec4b6', '#fb5607'][Math.floor(r() * 5)]; ctx.fillRect(x - bs * 0.4, y - bs, bs * 0.8, bs); } } }
  for (let i = 0; i < 6; i++) { const z = 1.2 + ((i * 0.9 + u * 0.8) % 6), s = 1 / z; person2(ctx, W / 2 + ((i % 3) - 1) * 200 * s, vy + 1000 * s, 600 * s, { seed: i + 2, t: u * 2 }); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['Trucks can’t be dispatched.', 'Stores hold ~3 days', 'of food (est.)'], 230, 0.15, { size: 70, out: OUT('food') });
}

// ================================================================ 6. screens fail: airports, hospitals, banks
function vScreens(ctx, u) {
  bgSky(ctx, ['#0e1220', '#161c30', '#1e2640']);
  const cols = 5, rows = 7;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c, x = 70 + c * 196, y = 520 + r * 170, at = 0.4 + ((i * 17) % 35) / 35 * 1.4, bad = u > at;
    ctx.fillStyle = '#05060a'; roundRect(ctx, x, y, 180, 150, 10); ctx.fill();
    ctx.fillStyle = bad ? '#1f5fd6' : (['#2ec4b6', '#ffbe0b', '#e8eef8'][i % 3]); ctx.fillRect(x + 10, y + 10, 160, 130);
    ctx.font = `800 ${bad ? 28 : 20}px ${MONO}`; ctx.textAlign = 'center'; ctx.fillStyle = bad ? '#ffffff' : '#1b1b2e'; ctx.fillText(bad ? 'ERROR' : ['FLIGHTS', 'PATIENT', 'ACCOUNT'][i % 3], x + 90, y + 82);
    if (bad && u < at + 0.15) glow(ctx, x + 90, y + 75, 120, '120,170,255', 0.8); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Flights, hospitals,', 'banks: all down'], 230, 0.15, { size: 88, out: OUT('screens') });
  if (u > 1.8) { scrimB(ctx, 1600, 0.7); say(ctx, u, ['In 2024, one bad update crashed', '8.5 million computers. For a day.'], 1720, 1.8, { size: 46, weight: 800, out: OUT('screens') }); }
}

// ================================================================ 7. the city at night: blackouts and gridlock
function vBlackout(ctx, u) {
  bgSky(ctx, ['#05060e', '#0e1224', '#1a1e38']); stars(ctx, u, 1);
  const off = q => R2(1 - prog(u, 0.8 + q, 1.2 + q));
  for (let L = 0; L < 3; L++) cityLayer(ctx, u, { base: 1150 + L * 110, seed: 80 + L, hMin: 120 + L * 80, hMax: 480 + L * 140, wMin: 50 + L * 20, wMax: 120 + L * 40, gap: 8,
    col: ['#141830', '#101426', '#0a0e1c'][L], win: `rgba(255,214,150,${(0.5 + L * 0.1) * off(L * 0.6)})`, winP: 0.45, ws: 6 + L * 2 });
  ctx.fillStyle = '#0e0e16'; ctx.fillRect(0, 1480, W, H);
  for (let lane = 0; lane < 3; lane++) for (let i = 0; i < 9; i++) { const x = 40 + i * 120 + lane * 40, y = 1560 + lane * 110, s = 0.7 + lane * 0.2;
    ctx.fillStyle = '#05050a'; roundRect(ctx, x - 50 * s, y - 34 * s, 100 * s, 34 * s, 8 * s); ctx.fill();
    glow(ctx, x + 50 * s, y - 16 * s, 40 * s, '255,240,200', 0.4); }
  for (const x of [300, 780]) { ctx.fillStyle = '#05050a'; ctx.fillRect(x, 1180, 14, 300); roundRect(ctx, x - 20, 1180, 54, 130, 10); ctx.fill(); if (u < 1.0) glow(ctx, x + 7, 1290, 30, '80,255,120', 0.8); }
  const r = rng(9); for (let i = 0; i < 6; i++) { const x = 100 + r() * 880, y = 1600 + r() * 200, a = Math.sin(u * 3 + i) * 0.6; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,255,220,0.12)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 400 - 40, y - 300); ctx.lineTo(x + Math.cos(a) * 400 + 40, y - 300); ctx.fill(); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Many grids, water pumps', 'and traffic systems run', 'on networks'], 230, 0.15, { size: 72, out: 2.3 });
  say(ctx, u, ['Cities flicker out.', 'Gridlock.'], 230, 2.4, { size: 88, out: OUT('blackout') });
}

// ================================================================ 8. geopolitics: markets frozen, governments half-blind
function vGeo(ctx, u) {
  space(ctx, u);
  const R = 500, cx = W / 2, cy = 1150, v = gView(10 + u * 6, 25);
  globe(ctx, cx, cy, R, { lon0: 10 + u * 6, lat0: 25, t: u, ink: false, sun: [0.1, -0.1, -0.99] });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  CITIES.forEach(([name, lon, lat, pop], i) => { const [x, y, z] = v(lon, lat); if (z < 0.05) return; const sx = cx + x * R, sy = cy + y * R, dim = R2((u - 0.6 - (i % 9) * 0.12) / 0.6);
    glow(ctx, sx, sy, 30 + Math.sqrt(pop) * 4, '255,220,150', 0.6 * (1 - dim * 0.8)); });
  for (let i = 0; i < 3; i++) { const sa = u * 2 + i * 2.1, sx = cx + Math.cos(i * 2.4) * R * 0.5, sy = cy + Math.sin(i * 2.4) * R * 0.4;
    ctx.strokeStyle = 'rgba(120,255,160,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sx, sy, 90, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(sa) * 90, sy + Math.sin(sa) * 90); ctx.stroke(); }
  ctx.restore();
  // frozen ticker
  ctx.fillStyle = 'rgba(10,14,24,0.95)'; ctx.fillRect(0, 1700, W, 90); ctx.font = `800 40px ${MONO}`; ctx.textAlign = 'left';
  const x0 = W - Math.min(u, 1.2) * 600; ['DOW', 'NIKKEI', 'FTSE', 'DAX'].forEach((t2, i) => { ctx.fillStyle = u < 1.2 ? '#7dffb0' : '#9aa0b0'; ctx.fillText(u < 1.2 ? `${t2} ▲` : `${t2} --`, x0 + i * 300, 1758); });
  if (u > 1.2) { ctx.fillStyle = '#e63946'; ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('MARKETS CLOSED', W / 2, 1680); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['$110 trillion in markets,', 'frozen'], 230, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['Governments go half-blind.', 'Some suspect an attack.'], 230, 2.5, { size: 70, out: OUT('geo') });
}

// ================================================================ 9. global trade stalls at the ports
function vPorts(ctx, u) {
  bgSky(ctx, ['#2a6a9a', '#3a86c8', '#5aa6e0']);
  ctx.fillStyle = '#9a9286'; ctx.fillRect(0, 0, W, 520); ctx.fillStyle = '#7a7268'; ctx.fillRect(0, 480, W, 50);
  for (let i = 0; i < 4; i++) { ctx.strokeStyle = '#e6c84a'; ctx.lineWidth = 12; const x = 160 + i * 250; ctx.beginPath(); ctx.moveTo(x - 50, 500); ctx.lineTo(x - 40, 260); ctx.moveTo(x + 50, 500); ctx.lineTo(x + 40, 260); ctx.moveTo(x - 140, 260); ctx.lineTo(x + 120, 260); ctx.stroke(); }
  const r = rng(13), CC = ['#e63946', '#3a86ff', '#ffbe0b', '#2ec4b6', '#8338ec'];
  for (let i = 0; i < 26; i++) { const x = 80 + r() * 920, y = 640 + r() * 1150, a = -0.3 + r() * 0.6, bob = Math.sin(u * 1.5 + i) * 3;
    ctx.save(); ctx.translate(x, y + bob); ctx.rotate(a); ctx.fillStyle = '#1e2a4a'; ctx.beginPath(); ctx.moveTo(-26, -90); ctx.lineTo(26, -90); ctx.lineTo(26, 80); ctx.lineTo(0, 100); ctx.lineTo(-26, 80); ctx.fill();
    for (let k = 0; k < 6; k++) { ctx.fillStyle = CC[(k + i) % 5]; ctx.fillRect(-20, -80 + k * 24, 40, 20); } ctx.fillStyle = '#f1f1f1'; ctx.fillRect(-18, 60, 36, 20); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.55);
  say(ctx, u, ['Ships carry ~80% of', 'world trade. Their', 'paperwork is digital.'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['Ports grind', 'to a halt'], 230, 2.5, { size: 96, out: OUT('ports') });
}

// ================================================================ 10. the toll, and the planet
function vPlanet(ctx, u) {
  const clear = easeInOut(prog(u, 2.2, 4.6));
  bgSky(ctx, [mixHex('#8a8070', '#2a6ad0', clear), mixHex('#a89a86', '#7ab8f0', clear), mixHex('#c8b89c', '#d8eeff', clear)]);
  cityLayer(ctx, u, { base: 1400, seed: 91, hMin: 200, hMax: 700, wMin: 70, wMax: 160, gap: 12, col: mixHex('#6a625a', '#3a4a6a', clear), win: 'rgba(40,40,50,0.4)', winP: 0.3, ws: 8 });
  ctx.fillStyle = 'rgba(170,150,120,' + (0.45 * (1 - clear)) + ')'; ctx.fillRect(0, 600, W, 900);
  ctx.fillStyle = mixHex('#5a5248', '#3a5a3a', clear); ctx.fillRect(0, 1400, W, H);
  if (clear > 0.3) { const r = rng(4); for (let i = 0; i < 8; i++) { const x = r() * W, y = 1460 + r() * 60; ctx.strokeStyle = '#2a4a2a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(u + i) * 6, y - 60 * clear); ctx.stroke(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Hospitals, food and water', 'falter: millions could', 'die (est.)'], 230, 0.15, { size: 70, out: 2.2 });
  say(ctx, u, ['The one upside: emissions', 'plunge. The skies clear.'], 230, 2.3, { size: 70, out: OUT('planet') });
}

// ================================================================ 11. the rebuild: radio, paper, local
function vRebuild(ctx, u) {
  bgSky(ctx, ['#ffb07a', '#ffd6a0', '#fff0d0']);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1300);
  ctx.fillStyle = '#c89a6a'; ctx.fillRect(0, 1350, W, H);
  ctx.strokeStyle = '#4a3a3a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(W / 2 - 120, 1350); ctx.lineTo(W / 2, 640); ctx.lineTo(W / 2 + 120, 1350); for (let k = 1; k < 6; k++) { const y = 1350 - k * 120, w = 120 - k * 20; ctx.moveTo(W / 2 - w, y); ctx.lineTo(W / 2 + w, y); } ctx.stroke();
  glow(ctx, W / 2, 640, 40, '255,80,80', 0.9);
  for (let i = 0; i < 4; i++) { const rr = ((u * 260 + i * 160) % 640); ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - rr / 640)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W / 2, 640, rr, -Math.PI * 0.85, -Math.PI * 0.15); ctx.stroke(); }
  [[180, 1, 'newspaper'], [380, 4], [720, 2], [900, 6]].forEach(([x, seed]) => person2(ctx, x, 1700, 300, { seed, t: u }));
  ctx.fillStyle = '#f8f4ea'; ctx.save(); ctx.translate(180, 1500); ctx.rotate(-0.1); ctx.fillRect(-70, -50, 140, 100); ctx.fillStyle = '#1b1b2e'; ctx.fillRect(-60, -40, 120, 14); for (let k = 0; k < 4; k++) ctx.fillRect(-60, -16 + k * 14, 120, 6); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['We rebuild on radio,', 'paper and cash'], 230, 0.15, { size: 84, out: 2.4 });
  say(ctx, u, ['The world last ran offline', 'in 1990, with 5.3 billion', 'people. Now: 8.2 billion.'], 230, 2.5, { size: 66, out: OUT('rebuild') });
}

// ================================================================ 12. final image: the first message, "LO"
function vLO(ctx, u) {
  bgSky(ctx, ['#0a0e08', '#101810', '#0a0e08']);
  ctx.fillStyle = '#c8c0a8'; roundRect(ctx, 140, 560, 800, 680, 60); ctx.fill(); ctx.fillStyle = '#0a1a0a'; roundRect(ctx, 200, 620, 680, 500, 40); ctx.fill();
  glow(ctx, 540, 870, 380, '90,255,120', 0.15);
  const txt = 'LOGIN', n = u < 0.6 ? 0 : u < 1.0 ? 1 : 2, crashed = u > 1.8;
  ctx.font = `700 120px ${MONO}`; ctx.textAlign = 'left'; ctx.fillStyle = '#5aff7a'; ctx.fillText('> ' + txt.slice(0, n) + (Math.floor(u * 3) % 2 && !crashed ? '_' : ''), 250, 900);
  if (crashed && Math.floor(u * 8) % 2 === 0 && u < 2.6) { ctx.fillStyle = 'rgba(90,255,120,0.15)'; roundRect(ctx, 200, 620, 680, 500, 40); ctx.fill(); }
  if (crashed) { ctx.font = `700 44px ${MONO}`; ctx.fillStyle = '#5aff7a'; ctx.fillText('CONNECTION LOST', 250, 1040); }
  ctx.fillStyle = '#9a9278'; ctx.fillRect(420, 1240, 240, 60); ctx.fillRect(300, 1300, 480, 30);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The internet’s first message,', '1969: “LOGIN”'], 230, 0.15, { size: 70, out: OUT('lo') });
  say(ctx, u, ['It crashed after', 'two letters.'], 1500, 2.0, { size: 84, out: OUT('lo'), x: W / 2, align: 'center' });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: u * 4, lat0: 20, t: u, ink: false });
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
