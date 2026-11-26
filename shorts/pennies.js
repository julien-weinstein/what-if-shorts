// What if all the world's wealth turned into pennies?
//
// Premise: every dollar of household wealth (cash, bank balances, stocks, bonds, pensions, homes) becomes its value in
// physical U.S.-style pennies, where it is held. Digital money is gone; homes become heaps of coins.
//
// NUMBERS (worked; estimates hedged on screen):
//  - Global household wealth ~$450 trillion (UBS Global Wealth Report 2024) -> 4.5e16 pennies.
//  - Penny: 2.5 g, 19.05 mm × 1.52 mm, 97.5% zinc / 2.5% copper (since 1982).
//  - Mass: 4.5e16 × 2.5 g ≈ 1.1e14 kg ≈ 112 billion tonnes (≈ Mount Everest's estimated mass; ~225× all humans, ~0.5 Gt).
//  - Zinc: ~110 Gt vs ~230 Mt world zinc reserves -> ~500×.
//  - Volume: 4.33e-7 m³ each -> ~19.5 km³ solid, ~32 km³ as a loose pile. Over Manhattan (59 km²): ~540 m deep.
//  - $400,000 house -> 40 million pennies -> 100 tonnes -> ~23 m³ heap.
//  - U.S. median household net worth ~$193,000 (Fed SCF 2022) -> ~4.8 tonnes; typical floors are designed for ~200 kg/m².
//  - $1 trillion of deposits -> 250 million tonnes -> ~58 million m³ loose: a pile far taller than the Empire State Building.
//  - $100 of groceries = 10,000 pennies = 25 kg. A 25-tonne truckload = $100,000.
//  - Zinc corrodes once the copper plating is breached; dissolved zinc is toxic to fish at low concentrations.
//  - Earth's day: ΔI ≈ (2/3) m R² ≈ 3e27 kg·m² vs 8.0e37 -> ~3 microseconds longer (est.).
//  - The U.S. Mint's last circulating pennies were struck in 2025; each cost ~3.7¢ to make (FY2024).
//    4.5e16 × $0.037 ≈ $1.7 quadrillion ≈ 3.7× the world's wealth.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['count', 5.0, [[0.4, 'impact'], [2.4, 'boom']]],
  ['manhattan', 5.0, [[0.2, 'roar:4.6'], [1.2, 'rumble:3.6']]],
  ['homes', 4.5, [[0.8, 'impact'], [0.85, 'boom']]],
  ['living', 4.5, [[1.6, 'impact'], [1.65, 'boom']]],
  ['bank', 5.0, [[0.4, 'rumble:4.4'], [1.4, 'boom'], [2.6, 'boom']]],
  ['cart', 4.5, [[0.2, 'swell:4.2']]],
  ['freeze', 4.5, [[0.2, 'heart:4.2']]],
  ['metal', 4.0, [[0.2, 'rumble:3.8']]],
  ['rivers', 4.5, [[0.2, 'swell:4.2']]],
  ['planet', 5.0, [[0.2, 'swell:4.6']]],
  ['mint', 5.5, [[0.2, 'swell:5'], [3.2, 'impact']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if all the money in the world turned into pennies?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 78, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, count: vCount, manhattan: vManhattan, homes: vHomes, living: vLiving, bank: vBank, cart: vCart, freeze: vFreeze,
              metal: vMetal, rivers: vRivers, planet: vPlanet, mint: vMint, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const CU = '#c8743a', CU_L = '#f0a868', CU_D = '#7a3e1a';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.22, saturate: 1.12 });
}
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.2)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function penny(ctx, x, y, r, spin = 0, tilt = 1) {
  const sx = Math.abs(Math.cos(spin)) * 0.92 + 0.08; ctx.save(); ctx.translate(x, y); ctx.scale(sx, tilt);
  ctx.fillStyle = CU_D; ctx.beginPath(); ctx.arc(0, r * 0.08, r, 0, 6.283); ctx.fill();
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r); g.addColorStop(0, CU_L); g.addColorStop(1, CU); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
  ctx.strokeStyle = 'rgba(122,62,26,0.6)'; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.arc(0, 0, r * 0.86, 0, 6.283); ctx.stroke();
  if (r > 18) { ctx.font = `900 ${r * 0.8}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(122,62,26,0.75)'; ctx.fillText('1¢', 0, r * 0.04); }
  ctx.restore();
}
function pennyPile(ctx, cx, base, w, h, seed, coinR = 12) {   // a mound of pennies with glints
  const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, CU_L); g.addColorStop(1, CU_D);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - w / 2, base); ctx.quadraticCurveTo(cx - w * 0.2, base - h * 1.05, cx, base - h); ctx.quadraticCurveTo(cx + w * 0.2, base - h * 1.05, cx + w / 2, base); ctx.closePath(); ctx.fill();
  const r = rng(seed), n = Math.min(500, Math.floor(w * h / (coinR * coinR * 6)));
  for (let i = 0; i < n; i++) { const fx = r() * 2 - 1, top = base - h * (1 - fx * fx) * 0.98, y = lerp(top, base, Math.pow(r(), 1.6)), x = cx + fx * w / 2 * 0.95;
    ctx.fillStyle = r() < 0.5 ? CU_L : CU; ctx.beginPath(); ctx.ellipse(x, y, coinR, coinR * 0.45, r() * 0.6 - 0.3, 0, 6.283); ctx.fill(); if (r() < 0.06) glow(ctx, x, y, coinR * 2, '255,220,170', 0.6); }
}
function coinRain(ctx, u, n, seed, speed = 900) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * W, y = ((r() * H * 1.4 + u * speed * (0.7 + r() * 0.6)) % (H + 200)) - 100; penny(ctx, x, y, 14 + r() * 14, u * 6 + i, 0.8); } }

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#1b2a4a', '#2a3a6a', '#4a5a8a']);
  coinRain(ctx, u, 60, 2, 500);
  penny(ctx, W / 2, 1150, 260 * easeBack(R2(prog(u, 0.1, 0.8))), u * 2.2, 1);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if all the', 'world’s money turned', 'into pennies?'], 300, 0.15, { size: 90, out: OUT('hook'), mark: { line: 2, from: 5, to: 12, color: CU } });
}

// ================================================================ 2. the count, and the weight
function vCount(ctx, u) {
  bgSky(ctx, ['#14181e', '#1c2028', '#242a34']);
  coinRain(ctx, u, 40, 7, 300);
  ctx.fillStyle = 'rgba(20,24,30,0.6)'; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Cash, savings, stocks,', 'homes: ~$450 trillion (est.)'], 260, 0.15, { size: 68, out: OUT('count') });
  bigNum(ctx, u, '45,000,000,000,000,000', 760, 0.4, { size: 70, color: CU_L, out: OUT('count') });
  say(ctx, u, ['pennies'], 860, 0.8, { size: 56, weight: 800, x: W / 2, align: 'center', out: OUT('count') });
  bigNum(ctx, u, '112 billion tonnes', 1180, 2.4, { size: 96, color: '#ffffff', out: OUT('count') });
  say(ctx, u, ['About as heavy as', 'Mount Everest (est.)'], 1330, 2.8, { size: 56, weight: 800, x: W / 2, align: 'center', out: OUT('count') });
}

// ================================================================ 3. pile it on Manhattan
function vManhattan(ctx, u) {
  const lvl = lerp(1500, 620, easeInOut(prog(u, 0.4, 4.2)));
  bgSky(ctx, ['#4a7ab8', '#8ab8e0', '#d8ecf8']);
  cityLayer(ctx, u, { base: 1500, seed: 21, hMin: 300, hMax: 900, wMin: 60, wMax: 140, gap: 8, col: '#5a6a8a', win: 'rgba(220,240,255,0.7)', winP: 0.5, ws: 8, top: '#8a9ab8' });
  ctx.fillStyle = '#4a5a7a'; ctx.fillRect(500, 1500 - 880, 80, 880); ctx.beginPath(); ctx.moveTo(500, 620); ctx.lineTo(540, 470); ctx.lineTo(580, 620); ctx.fill(); ctx.fillRect(536, 380, 8, 100);
  coinRain(ctx, u, 70, 9, 1200);
  const g = ctx.createLinearGradient(0, lvl, 0, H); g.addColorStop(0, CU_L); g.addColorStop(0.2, CU); g.addColorStop(1, CU_D); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, lvl + Math.sin(x * 0.02 + u) * 14); ctx.lineTo(W, H); ctx.fill();
  const r = rng(5); for (let i = 0; i < 140; i++) { const x = r() * W, y = lvl + 10 + r() * (H - lvl); ctx.fillStyle = r() < 0.5 ? CU_L : CU; ctx.beginPath(); ctx.ellipse(x, y, 14, 6, 0, 0, 6.283); ctx.fill(); }
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10; ctx.fillText('Empire State Building', 600, 560); ctx.shadowBlur = 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 520, 0.55);
  say(ctx, u, ['Pile it on Manhattan:', '540 meters deep'], 230, 0.15, { size: 84, out: OUT('manhattan') });
}

// ================================================================ 4. homes become heaps of coins
function vHomes(ctx, u) {
  const turn = 0.8, k = easeInOut(R2((u - turn) / 1.2));
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#f0e8c8']);
  ctx.fillStyle = '#8ab05a'; ctx.fillRect(0, 1350, W, H);
  [[220, 1.0], [560, 1.1], [880, 0.95]].forEach(([x, s], i) => { const kk = R2(k * 1.2 - i * 0.1);
    if (kk < 1) { ctx.save(); ctx.globalAlpha = 1 - kk; ctx.translate(x, 1360); ctx.scale(s, s * (1 - kk * 0.4)); ctx.fillStyle = ['#e8c8a0', '#c8d8e8', '#f0d8c8'][i]; ctx.fillRect(-130, -220, 260, 220); ctx.fillStyle = '#b8503a'; ctx.beginPath(); ctx.moveTo(-160, -220); ctx.lineTo(0, -340); ctx.lineTo(160, -220); ctx.fill();
      ctx.fillStyle = '#6a4a3a'; ctx.fillRect(-30, -110, 60, 110); ctx.fillStyle = '#bfe8ff'; ctx.fillRect(-100, -180, 50, 50); ctx.fillRect(50, -180, 50, 50); ctx.restore(); }
    if (kk > 0) pennyPile(ctx, x, 1370, 220 * s * kk, 90 * s * kk, i + 3, 10); });
  [[400, 1], [700, 4]].forEach(([x, sd]) => person2(ctx, x, 1760, 300, { seed: sd, t: u }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Homes are wealth too.', 'A $400,000 house:', '100 tonnes of pennies'], 230, 0.15, { size: 72, out: OUT('homes') });
}

// ================================================================ 5. your savings, in your living room
function vLiving(ctx, u) {
  const fall = 1.6, k = easeIn2(R2((u - fall) / 0.6)), [sx, sy] = shakeOffset(u, fall, 1.8, 20);
  bgSky(ctx, ['#f4ecd8', '#ece2cc', '#e0d4bc']); ctx.translate(sx, sy);
  ctx.fillStyle = '#e8dcc0'; ctx.fillRect(0, 0, W, 1250); ctx.fillStyle = '#c8b898'; ctx.fillRect(0, 1250, W, 60);
  ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, 1310 + k * 0, W, 20);
  ctx.save(); ctx.translate(0, k * 500); ctx.rotate(k * 0.06);
  ctx.fillStyle = '#9a7a5a'; ctx.fillRect(-40, 1250, W + 80, 60);
  ctx.fillStyle = '#5a7ab0'; ctx.beginPath(); ctx.roundRect(120, 1080, 360, 170, 30); ctx.fill(); ctx.fillStyle = '#2a2a34'; ctx.fillRect(700, 900, 260, 160); ctx.fillStyle = '#7ab0e0'; ctx.fillRect(712, 912, 236, 136);
  pennyPile(ctx, 560, 1250, 520, 260 * easeOut(R2(u / 1.2)), 6, 12);
  ctx.restore();
  if (u > fall) { ctx.fillStyle = 'rgba(60,40,30,0.85)'; ctx.fillRect(0, 1310, W, H); for (let i = 0; i < 20; i++) { const r = rng(i); puff(ctx, r() * W, 1320 + r() * 100 - (u - fall) * 80, 60 + r() * 60, '#b8a890', 0.6 * R2(1 - (u - fall) / 2)); } }
  person2(ctx, 900, 1250 + k * 500, 280, { seed: 2, t: u });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['A median U.S. household:', '~5 tonnes of pennies', 'in the living room'], 230, 0.15, { size: 70, out: 1.5 });
  say(ctx, u, ['Floors give way'], 230, 1.6, { size: 100, out: OUT('living') });
}

// ================================================================ 6. a bank becomes a mountain
function vBank(ctx, u) {
  const k = easeOut(prog(u, 0.4, 3.6)), [sx, sy] = shakeOffset(u, 0.4, 4, 16);
  bgSky(ctx, ['#4a6a9a', '#8aaad0', '#d0e0ee']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1500, seed: 31, hMin: 300, hMax: 800, wMin: 80, wMax: 160, gap: 10, col: '#6a7a9a', win: 'rgba(220,240,255,0.7)', winP: 0.5, ws: 8, hit: x => (Math.abs(x - W / 2) < 300 ? 0.6 + Math.abs(x - W / 2) / 300 * 1.2 : 1e9), dir: 1 });
  pennyPile(ctx, W / 2, 1520, lerp(200, 1300, k), lerp(100, 1100, k), 8, 16);
  coinRain(ctx, u, 40, 11, 700);
  ctx.fillStyle = '#3a3a48'; ctx.fillRect(0, 1500, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['A bank holding $1 trillion', 'becomes a penny mountain', 'taller than the Empire State'], 230, 0.15, { size: 64, out: OUT('bank') });
}

// ================================================================ 7. paying for anything
function vCart(ctx, u) {
  bgSky(ctx, ['#f0ece4', '#e4ded2', '#d8d0c0']);
  ctx.fillStyle = '#b8b0a0'; ctx.fillRect(0, 1350, W, H);
  ctx.save(); ctx.translate(lerp(-200, 380, easeOut(R2(u / 2))), 1500); ctx.strokeStyle = '#6a6a74'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-180, -200); ctx.lineTo(160, -200); ctx.lineTo(130, 0); ctx.lineTo(-150, 0); ctx.closePath(); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.moveTo(-176, -196); ctx.lineTo(156, -196); ctx.lineTo(128, -4); ctx.lineTo(-148, -4); ctx.clip(); pennyPile(ctx, -10, 0, 360, 230, 3, 10); ctx.restore();
  ctx.fillStyle = '#2a2a34'; ctx.beginPath(); ctx.arc(-110, 40, 24, 0, 6.283); ctx.arc(110, 40, 24, 0, 6.283); ctx.fill(); ctx.restore();
  person2(ctx, lerp(-420, 160, easeOut(R2(u / 2))), 1640, 360, { seed: 5, t: u });
  ctx.save(); ctx.translate(820, 1300); ctx.fillStyle = '#e8eef4'; ctx.fillRect(-140, -260, 280, 260); ctx.fillStyle = '#2a2a34'; ctx.fillRect(-110, -230, 220, 70); ctx.font = `900 46px ${MONOFONT}`; ctx.fillStyle = '#7dffb0'; ctx.textAlign = 'center'; ctx.fillText('$100.00', 0, -180); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['$100 of groceries:', '25 kg of coins'], 230, 0.15, { size: 88, out: 2.4 });
  say(ctx, u, ['A full truckload is', 'worth just $100,000'], 230, 2.5, { size: 80, out: OUT('cart') });
}
const MONOFONT = '"JetBrains Mono", "Menlo", monospace';

// ================================================================ 8. digital money is gone: trade freezes
function vFreeze(ctx, u) {
  bgSky(ctx, ['#0e1220', '#161c30', '#1e2640']);
  const cols = 4, rows = 5;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c, x = 90 + c * 235, y = 560 + r * 220, gone = u > 0.4 + ((i * 7) % 20) / 20 * 1.6;
    ctx.fillStyle = '#05060a'; ctx.beginPath(); ctx.roundRect(x, y, 215, 190, 14); ctx.fill(); ctx.fillStyle = gone ? '#3a3a48' : ['#2ec4b6', '#3a86ff', '#ffbe0b'][i % 3]; ctx.fillRect(x + 10, y + 10, 195, 170);
    ctx.font = `900 ${gone ? 40 : 30}px ${MONOFONT}`; ctx.textAlign = 'center'; ctx.fillStyle = gone ? '#e63946' : '#1b1b2e'; ctx.fillText(gone ? '$0.00' : ['BALANCE', 'STOCKS', 'PAYROLL'][i % 3], x + 107, y + 108); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Every bank balance,', 'gone from every computer'], 230, 0.15, { size: 76, out: 2.4 });
  say(ctx, u, ['Trade freezes. Food', 'stops moving.'], 230, 2.5, { size: 84, out: OUT('freeze') });
}

// ================================================================ 9. metal markets implode
function vMetal(ctx, u) {
  bgSky(ctx, ['#1a1a20', '#24242c', '#2e2e38']);
  const x0 = 120, y0 = 1500, w = 840, h = 700;
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(x0, y0 - k * h / 4); ctx.lineTo(x0 + w, y0 - k * h / 4); ctx.stroke(); }
  const n = Math.floor(60 * prog(u, 0.2, 3.6)); ctx.strokeStyle = '#e63946'; ctx.lineWidth = 8; ctx.beginPath();
  for (let i = 0; i <= n; i++) { const f = i / 60, y = y0 - h * (f < 0.4 ? 0.7 + Math.sin(i) * 0.03 : Math.max(0.03, 0.7 - (f - 0.4) * 2.5)); i ? ctx.lineTo(x0 + f * w, y) : ctx.moveTo(x0, y); } ctx.stroke();
  ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.fillText('ZINC PRICE', x0, y0 - h - 30);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['~500× all the zinc', 'we’ve ever found'], 230, 0.15, { size: 88, out: 2.2 });
  say(ctx, u, ['Metal prices crash.', 'Mines shut.'], 230, 2.3, { size: 88, out: OUT('metal') });
}

// ================================================================ 10. corroding pennies poison rivers
function vRivers(ctx, u) {
  const k = easeInOut(prog(u, 0.4, 3.6));
  bgSky(ctx, ['#6a8a9a', '#9ab0b8', '#c8d4d8']);
  pennyPile(ctx, 300, 1200, 640, 380, 13, 12);
  ctx.fillStyle = mixHex('#3a8ab0', '#7a8a6a', k); ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(540, 1350, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.strokeStyle = `rgba(160,190,170,${0.7 * k})`; ctx.lineWidth = 10; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(300 + i * 40, 1210); ctx.quadraticCurveTo(360 + i * 50, 1360, 400 + i * 70, 1520); ctx.stroke(); }
  const r = rng(6); for (let i = 0; i < 9; i++) { const x = 160 + r() * 800, y = 1560 + r() * 280 - (u > 1.4 + r() ? (u - 1.4) * 30 : 0), dead = u > 1.4 + r() * 2;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, dead ? -1 : 1); ctx.fillStyle = dead ? '#b8b0a0' : '#5aa0c8'; ctx.beginPath(); ctx.ellipse(0, 0, 40, 16, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(-60, -16); ctx.lineTo(-60, 16); ctx.fill(); ctx.restore(); }
  for (let i = 0; i < 160; i++) { const x = (r() * W + u * 20) % W, y = (r() * H + u * 900) % H; ctx.strokeStyle = 'rgba(200,220,240,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 24); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Rain eats through the', 'copper skin. Zinc leaches', 'out and poisons rivers.'], 230, 0.15, { size: 68, out: OUT('rivers') });
}

// ================================================================ 11. the planet: heavier, slower
function vPlanet(ctx, u) {
  space(ctx, u);
  const R = 460, cx = W / 2, cy = 1150, v = gView(-40 + u * 8, 30);
  globe(ctx, cx, cy, R, { lon0: -40 + u * 8, lat0: 30, t: u, ink: false });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const [name, lon, lat, pop] of CITIES) { const [x, y, z] = v(lon, lat); if (z < 0.05) continue; glow(ctx, cx + x * R, cy + y * R, 20 + Math.sqrt(pop) * 4, '240,160,90', 0.7); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['112 billion tonnes', 'of new metal on Earth'], 230, 0.15, { size: 84, out: OUT('planet') });
  bigNum(ctx, u, '+3 microseconds', 1720, 1.4, { size: 84, color: CU_L, out: OUT('planet') });
  say(ctx, u, ['longer every day (est.)'], 1820, 1.8, { size: 46, weight: 800, x: W / 2, align: 'center', out: OUT('planet') });
}

// ================================================================ 12. the punchline: what it costs to make a penny
function vMint(ctx, u) {
  bgSky(ctx, ['#1b2a4a', '#2a3a6a', '#4a5a8a']);
  const land = easeOut(prog(u, 0, 1.6)), spin = (1 - land) * 20;
  penny(ctx, W / 2, lerp(500, 1150, land), 220, spin, lerp(1, 0.9, land));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The U.S. stopped making', 'pennies in 2025. Each cost', '~3.7¢ to make.'], 230, 0.15, { size: 66, out: 3.0 });
  say(ctx, u, ['Minting all of these would', 'cost ~4× the world’s wealth.'], 1560, 3.2, { size: 62, weight: 900, out: OUT('mint') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  penny(ctx, W / 2, 1420, 200, u * 1.5, 1);
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
