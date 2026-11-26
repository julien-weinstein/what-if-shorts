// What if the Cuban Missile Crisis went wrong?  (the Bay of Pigs and what came next)
//
// FACTS (checked):
//  - Bay of Pigs, 17-20 April 1961: ~1,400 CIA-trained Cuban exiles (Brigade 2506) landed; defeated in ~3 days;
//    ~1,200 captured. Castro then aligned openly with Moscow.
//  - Operation Anadyr (1962): the USSR secretly sent ~42,000 troops and nuclear missiles to Cuba. R-12 missiles
//    (~2,000 km range) could reach Washington (~1,800 km from western Cuba).
//  - 14 Oct 1962: U-2 photos reveal the sites. 22 Oct: Kennedy announces a naval "quarantine".
//  - 27 Oct ("Black Saturday"): a U-2 is shot down over Cuba (Maj. Rudolf Anderson killed). Soviet submarine B-59,
//    pinned by U.S. destroyers dropping signalling depth charges, its crew in 45°C+ heat, out of contact with Moscow:
//    Captain Savitsky ordered the nuclear torpedo prepared. Launch required the agreement of three officers; flotilla
//    chief of staff Vasily Arkhipov refused. (Widely publicised after the 2002 Havana conference.)
//  - JFK put the odds of war at "somewhere between one out of three and even" (Sorensen).
//  - The Joint Chiefs urged air strikes and an invasion; ~100 Soviet tactical nuclear weapons were already in Cuba,
//    unknown to the U.S. until 1992.
//  - Arsenals in 1962: U.S. ~25,000 warheads, USSR ~3,300.
//  - SIOP-62, the U.S. war plan, itself estimated ~285 million deaths in the USSR and China.
//  - Divergence (marked on screen as "what if"): the third officer agrees; war follows. Toll beyond SIOP-62 hedged (est.).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['bay', 4.5, [[0.4, 'boom'], [1.2, 'boom'], [2.0, 'boom']]],
  ['ship', 4.5, [[0.2, 'rumble:4.2']]],
  ['photo', 5.0, [[0.6, 'impact'], [2.2, 'swell:2.6']]],
  ['blockade', 4.0, [[0.2, 'heart:3.8']]],
  ['u2', 4.0, [[0.8, 'impact'], [1.6, 'boom']]],
  ['depth', 4.5, [[0.6, 'boom'], [1.4, 'boom'], [2.2, 'boom'], [3.0, 'boom']]],
  ['control', 5.0, [[0.2, 'heart:4.6']]],
  ['torpedo', 4.5, [[0.8, 'impact'], [0.85, 'boom'], [0.9, 'roar:3.4']]],
  ['invade', 4.5, [[0.4, 'boom'], [2.0, 'impact'], [2.05, 'boom']]],
  ['war', 5.0, [[0.4, 'rumble:4.4'], [1.6, 'boom'], [2.6, 'boom']]],
  ['siop', 4.5, [[0.4, 'impact']]],
  ['arkhipov', 6.0, [[0.2, 'swell:5.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the Cuban Missile Crisis went wrong?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 72, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, bay: vBay, ship: vShip, photo: vU2Photo, blockade: vBlockade, u2: vShootdown, depth: vDepth, control: vControl,
              torpedo: vTorpedo, invade: vInvade, war: vWar, siop: vSIOP, arkhipov: vArkhipov, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.22, contrast: 1.08, saturate: 1.1, vignette: 0.34 });
}
function dateTag(ctx, u, txt, at = 0.1) { if (u < at) return; const k = easeOut(R2((u - at) / 0.4)); ctx.save(); ctx.globalAlpha = k; ctx.font = `900 34px ${FONT}`; const w = ctx.measureText(txt).width + 40;
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; roundRect(ctx, 70, 120, w, 56, 28); ctx.fill(); ctx.fillStyle = '#1b1b2e'; ctx.textAlign = 'left'; ctx.fillText(txt, 90, 160); ctx.restore(); }

// ================================================================ characters (faceless)
function hist(ctx, x, y, s, who, o = {}) {
  const { pose = 'stand', t = 0, dir = 1, sweat = 0 } = o;
  const P = { jfk: { suit: '#1c2541', skin: '#f2c8a8', hair: '#8a5a2a' }, nk: { suit: '#5a5a62', skin: '#f0c0a0', hair: null }, fc: { suit: '#4a5a32', skin: '#d8a878', hair: '#1a1410', beard: 1, cap: '#4a5a32' },
    va: { suit: '#14203a', skin: '#f0c8a8', hair: '#3a2a1a', cap: '#14203a', capTop: '#f1f1f1' }, crew: { suit: '#2a3550', skin: '#e8b890', hair: '#2a1a10' } }[who];
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  ctx.fillStyle = 'rgba(20,20,60,0.2)'; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.3, s * 0.05, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = mixHex(P.suit, '#000000', 0.2); roundRect(ctx, -s * 0.16, -s * 0.34, s * 0.13, s * 0.34, s * 0.05); ctx.fill(); roundRect(ctx, s * 0.03, -s * 0.34, s * 0.13, s * 0.34, s * 0.05); ctx.fill();
  const w = Math.sin(t * 9) * 0.3, A = { stand: [0.15, 0.15], point: [0.15, 1.5 + w * 0.3], fist: [0.15, 2.5 + w * 0.2], wave: [0.15, 2.6 + w], arms: [0.6, 0.6] }[pose] || [0.15, 0.15];
  for (const side of [-1, 1]) { const a = side < 0 ? A[0] : A[1], sx = side * s * 0.2, sy = -s * 0.62, ex = sx + side * Math.sin(a) * s * 0.3, ey = sy + Math.cos(a) * s * 0.3;
    ctx.lineCap = 'round'; ctx.strokeStyle = P.suit; ctx.lineWidth = s * 0.1; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.fillStyle = P.skin; ctx.beginPath(); ctx.arc(ex, ey, s * 0.05, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = P.suit; roundRect(ctx, -s * 0.23, -s * 0.7, s * 0.46, s * 0.42, s * 0.12); ctx.fill();
  if (who === 'jfk' || who === 'nk') { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-s * 0.07, -s * 0.7); ctx.lineTo(s * 0.07, -s * 0.7); ctx.lineTo(0, -s * 0.58); ctx.fill(); ctx.fillStyle = who === 'jfk' ? '#3a5aa0' : '#6a2a2a'; ctx.fillRect(-s * 0.02, -s * 0.66, s * 0.04, s * 0.26); }
  ctx.fillStyle = P.skin; ctx.beginPath(); ctx.arc(0, -s * 0.85, who === 'nk' ? s * 0.18 : s * 0.155, 0, 6.283); ctx.fill();
  if (P.hair && !P.cap) { ctx.fillStyle = P.hair; ctx.beginPath(); ctx.ellipse(-s * 0.01, -s * 0.95, s * 0.16, s * 0.08, -0.1, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * 0.1, -s * 0.96, s * 0.08, s * 0.06, 0.4, 0, 6.283); ctx.fill(); }
  if (who === 'nk') { ctx.fillStyle = '#c8c0b8'; ctx.beginPath(); ctx.ellipse(-s * 0.16, -s * 0.84, s * 0.04, s * 0.06, 0, 0, 6.283); ctx.ellipse(s * 0.16, -s * 0.84, s * 0.04, s * 0.06, 0, 0, 6.283); ctx.fill(); }
  if (P.beard) { ctx.fillStyle = P.hair; ctx.beginPath(); ctx.ellipse(0, -s * 0.78, s * 0.15, s * 0.1, 0, 0, Math.PI); ctx.fill(); }
  if (P.cap) { ctx.fillStyle = P.cap; ctx.beginPath(); ctx.ellipse(0, -s * 0.97, s * 0.17, s * 0.07, 0, 0, 6.283); ctx.fill(); if (P.capTop) { ctx.fillStyle = P.capTop; ctx.beginPath(); ctx.ellipse(0, -s * 1.0, s * 0.19, s * 0.05, 0, 0, 6.283); ctx.fill(); } }
  if (sweat > 0) { ctx.fillStyle = 'rgba(140,210,255,0.9)'; for (const k of [0, 1]) { const ph = (t * 1.5 + k * 0.5) % 1; ctx.beginPath(); ctx.ellipse(s * (0.17 - k * 0.34), -s * (0.9 - ph * 0.2), s * 0.02, s * 0.035, 0, 0, 6.283); ctx.fill(); } }
  ctx.restore();
}
function nameTag(ctx, x, y, txt) { ctx.font = `900 28px ${FONT}`; ctx.textAlign = 'center'; const w = ctx.measureText(txt).width + 26; ctx.fillStyle = 'rgba(20,20,40,0.85)'; roundRect(ctx, x - w / 2, y - 24, w, 40, 20); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillText(txt, x, y + 5); }
function fireball(ctx2, x, y, dt, s, seed) {
  if (dt <= 0) return; const r = rng(seed), k = 1 - Math.exp(-dt * 2.5), fade = R2(1 - dt / 3.5);
  for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = r() * 90 * s * k, rr = (60 + r() * 70) * s * (0.4 + k);
    puff(ctx2, x + Math.cos(a) * d, y - k * 160 * s + Math.sin(a) * d * 0.6 - dt * 40 * s, rr, mixHex('#fff0a0', '#3a2a28', R2(dt / 1.6 + r() * 0.3)), fade); }
  glow(ctx2, x, y - 60 * s, 260 * s, '255,170,70', 0.9 * Math.exp(-dt * 1.4));
}
function mushroom(ctx, x, base, dt, s) { if (dt <= 0) return; const g = easeOut(R2(dt / 2.4)), top = base - lerp(60, 700, g) * s, capR = lerp(40, 240, g) * s;
  ctx.fillStyle = mixHex('#fff2c8', '#b88a6a', R2(dt / 1.6)); roundRect(ctx, x - capR * 0.2, top, capR * 0.4, base - top, capR * 0.2); ctx.fill();
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + dt * 0.3; puff(ctx, x + Math.cos(a) * capR * 0.6, top + Math.sin(a) * capR * 0.3, capR * (0.5 + 0.2 * Math.sin(i * 2.3)), mixHex('#ffe0a0', '#9a6a5a', R2(dt / 1.8 + (i % 3) * 0.1))); }
  glow(ctx, x, top, capR * 1.8, '255,220,160', 0.7 * Math.exp(-dt * 0.8)); }
function sub(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#1a2030'; ctx.beginPath(); ctx.ellipse(0, 0, 380, 56, 0, 0, 6.283); ctx.fill();
  roundRect(ctx, -60, -120, 140, 80, 20); ctx.fill(); ctx.fillRect(-10, -160, 10, 40); ctx.beginPath(); ctx.moveTo(360, 0); ctx.lineTo(420, -40); ctx.lineTo(420, 40); ctx.fill(); ctx.restore(); }

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#1a2a4a', '#3a5a7a', '#c8a070']);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1300);
  ctx.fillStyle = '#2a6a9a'; ctx.fillRect(0, 1250, W, H); ctx.fillStyle = '#3a7a4a'; ctx.beginPath(); ctx.moveTo(0, 1240); ctx.quadraticCurveTo(540, 1180, W, 1240); ctx.lineTo(W, 1270); ctx.lineTo(0, 1270); ctx.fill();
  hist(ctx, 300, 1620, 420, 'jfk', { t: u, pose: 'point' }); hist(ctx, 780, 1620, 440, 'nk', { t: u, pose: 'fist', dir: -1 });
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(500, 1200); ctx.lineTo(560, 1260); ctx.lineTo(520, 1280); ctx.lineTo(590, 1360); ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1720, u > 1.4 ? 'shock' : 'worried', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the Cuban', 'Missile Crisis', 'went wrong?'], 300, 0.15, { size: 96, out: OUT('hook'), mark: { line: 2, from: 0, to: 10, color: '#e63946' } });
}

// ================================================================ 2. the Bay of Pigs, 1961
function vBay(ctx, u) {
  dateTag(ctx, u, 'APRIL 1961');
  bgSky(ctx, ['#4a8ac8', '#9ac8e8', '#f0e0c0']); dateTag(ctx, u, 'APRIL 1961');
  ctx.fillStyle = '#2a7ab0'; ctx.fillRect(0, 1000, W, 400); ctx.fillStyle = '#e8d29a'; ctx.beginPath(); ctx.moveTo(0, 1400); ctx.quadraticCurveTo(540, 1340, W, 1400); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = '#2a5a2a'; ctx.beginPath(); ctx.moveTo(0, 1000); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 960 - Math.abs(Math.sin(x * 0.02)) * 60); ctx.lineTo(W, 1000); ctx.fill();
  for (let i = 0; i < 3; i++) { const x = 200 + i * 330, y = 1280 + Math.sin(u * 2 + i) * 6; ctx.fillStyle = '#5a6a5a'; ctx.beginPath(); ctx.moveTo(x - 110, y); ctx.lineTo(x + 110, y); ctx.lineTo(x + 90, y + 50); ctx.lineTo(x - 90, y + 50); ctx.fill(); }
  for (const [at, x, y] of [[0.4, 240, 1220], [1.2, 760, 1180], [2.0, 520, 1400]]) fireball(ctx, x, y, u - at, 0.8, Math.floor(x));
  for (let i = 0; i < 7; i++) person2(ctx, 120 + i * 140 + (u > 2.2 ? -u * 20 : 0), 1700 + (i % 2) * 60, 220, { seed: 7, t: u, grey: 0.5 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.55); dateTag(ctx, u, 'APRIL 1961');
  say(ctx, u, ['1,400 CIA-trained exiles', 'invade Cuba'], 260, 0.15, { size: 76, out: 2.4 });
  say(ctx, u, ['In 3 days,', 'it’s over'], 260, 2.5, { size: 96, out: OUT('bay') });
}

// ================================================================ 3. Castro turns to Moscow; missiles shipped in secret
function vShip(ctx, u) {
  bgSky(ctx, ['#0a1430', '#1a2a50', '#3a4a70']); stars(ctx, u, 1);
  ctx.fillStyle = '#0e2a4a'; ctx.fillRect(0, 1200, W, H);
  const x = lerp(-300, 1300, u / 4.5);
  ctx.save(); ctx.translate(x, 1200 + Math.sin(u * 1.5) * 6); ctx.fillStyle = '#1a1a22'; ctx.beginPath(); ctx.moveTo(-320, -40); ctx.lineTo(320, -40); ctx.lineTo(280, 30); ctx.lineTo(-300, 30); ctx.fill();
  ctx.fillRect(160, -140, 90, 100); ctx.fillStyle = '#3a4a30'; for (let k = 0; k < 3; k++) { roundRect(ctx, -280 + k * 140, -90, 130, 50, 20); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,220,150,0.8)'; ctx.fillRect(180, -120, 14, 12); ctx.restore();
  hist(ctx, 230, 1820, 380, 'fc', { t: u, pose: 'fist' }); nameTag(ctx, 230, 1360, 'CASTRO');
  hist(ctx, 820, 1820, 380, 'nk', { t: u, pose: 'wave', dir: -1 }); nameTag(ctx, 820, 1360, 'KHRUSHCHEV');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Castro turns to Moscow.', 'Khrushchev secretly', 'ships nuclear missiles'], 230, 0.15, { size: 72, out: OUT('ship') });
}

// ================================================================ 4. the U-2 photo and the range rings
function ringPts(lon, lat, km) { const D = Math.PI / 180, d = km / 6371, p1 = lat * D, l1 = lon * D, P = [];
  for (let b = 0; b <= 360; b += 6) { const br = b * D, p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(br)), l2 = l1 + Math.atan2(Math.sin(br) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2)); P.push([l2 / D, p2 / D]); } return P; }
function vU2Photo(ctx, u) {
  const flip = easeInOut(prog(u, 2.0, 2.6));
  if (flip < 0.5) {
    bgSky(ctx, ['#2a2a2a', '#3a3a3a', '#2a2a2a']);
    ctx.save(); ctx.translate(W / 2, 1150); ctx.rotate(-0.04); ctx.scale(1 - flip * 2, 1); ctx.fillStyle = '#e8e8e0'; ctx.fillRect(-420, -420, 840, 840);
    ctx.fillStyle = '#8a8a80'; ctx.fillRect(-390, -390, 780, 780); const r = rng(4); ctx.fillStyle = '#6a6a62'; for (let i = 0; i < 40; i++) ctx.fillRect(-390 + r() * 760, -390 + r() * 760, 20 + r() * 60, 8 + r() * 20);
    ctx.fillStyle = '#4a4a44'; for (let i = 0; i < 4; i++) { ctx.fillRect(-200 + i * 110, -60, 70, 18); ctx.fillRect(-180 + i * 110, 80, 18, 50); }
    if (u > 0.6) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(-40, 0, 300 * easeOut(R2((u - 0.6) / 0.4)), 180 * easeOut(R2((u - 0.6) / 0.4)), 0, 0, 6.283); ctx.stroke();
      ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('MISSILE LAUNCH SITE', -360, -260); }
    ctx.restore();
  } else {
    space(ctx, u);
    const R = 1500, cx = W / 2, cy = 1280, lon0 = -80, lat0 = 30, v = gView(lon0, lat0);
    globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0, -0.3, 1], clouds: 0.15 });
    const k = easeOut(prog(u, 2.5, 4.2));
    for (const [km, a] of [[1000, 0.5], [2000 * k, 0.8]]) { const P = ringPts(-83.3, 22.7, km); ctx.strokeStyle = `rgba(230,57,70,${a})`; ctx.fillStyle = `rgba(230,57,70,${a * 0.15})`; ctx.lineWidth = 6; ctx.beginPath();
      P.forEach(([lo, la], i) => { const [x, y] = v(lo, la); i ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); }); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    for (const [name, lo, la] of [['Washington', -77, 38.9], ['New York', -74, 40.7], ['Miami', -80.2, 25.8], ['Havana', -82.4, 23.1], ['Dallas', -96.8, 32.8]]) { const [x, y] = v(lo, la);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(cx + x * R, cy + y * R, 10, 0, 6.283); ctx.fill(); ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 8; ctx.fillText(name, cx + x * R + 16, cy + y * R + 10); ctx.shadowBlur = 0; }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6); dateTag(ctx, u, 'OCTOBER 1962');
  say(ctx, u, ['A U-2 spy plane', 'photographs the sites'], 260, 0.15, { size: 80, out: 2.2 });
  say(ctx, u, ['They can hit', 'Washington'], 260, 2.6, { size: 96, out: OUT('photo'), mark: { line: 1, from: 0, to: 10, color: '#e63946' } });
}

// ================================================================ 5. blockade
function vBlockade(ctx, u) {
  bgSky(ctx, ['#4a7ab0', '#8ab8e0', '#d8ecf8']);
  ctx.fillStyle = '#2a6a9a'; ctx.fillRect(0, 1000, W, H);
  for (let i = 0; i < 6; i++) { const x = 90 + i * 180, y = 1060 + (i % 2) * 40, s = 0.4; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#7a8494'; ctx.beginPath(); ctx.moveTo(-260, -30); ctx.lineTo(260, -30); ctx.lineTo(220, 20); ctx.lineTo(-220, 20); ctx.fill(); ctx.fillRect(-60, -110, 120, 80); ctx.restore(); }
  hist(ctx, 540, 1560, 640, 'jfk', { t: u, pose: 'point' });
  ctx.fillStyle = '#3a2a20'; ctx.fillRect(120, 1260, 840, 70); ctx.fillStyle = '#2a1a14'; ctx.fillRect(120, 1330, 840, 360); nameTag(ctx, 540, 1420, 'KENNEDY');
  ctx.fillStyle = '#e8e0d0'; for (let k = 0; k < 2; k++) { ctx.fillRect(300 + k * 360, 1246, 120, 14); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Kennedy blockades Cuba.', 'He puts the odds of war', 'at “one in three, or even”'], 230, 0.15, { size: 68, out: OUT('blockade') });
}

// ================================================================ 6. Black Saturday: a U-2 is shot down
function vShootdown(ctx, u) {
  bgSky(ctx, ['#2a4a8a', '#6a9ad0', '#c8e0f0']); dateTag(ctx, u, 'OCT 27, 1962');
  const px = lerp(-100, 700, R2(u / 1.0)), py = 520, hit = 0.8;
  const mk = R2((u - 0.2) / 0.6), mx = lerp(300, px, mk), my = lerp(1500, py, mk);
  if (u < hit) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(300, 1500); ctx.lineTo(mx, my); ctx.stroke(); glow(ctx, mx, my, 50, '255,200,120', 0.9); }
  const fall = Math.max(0, u - hit), fx = px + fall * 120, fy = py + fall * fall * 300;
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(fall * 1.6); ctx.fillStyle = '#2a2a30'; ctx.fillRect(-90, -8, 180, 16); ctx.fillRect(-20, -120, 30, 240); ctx.restore();
  if (u > hit) { fireball(ctx, fx, fy, (u - hit) * 1.2, 0.6, 2); ctx.strokeStyle = 'rgba(40,40,40,0.5)'; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 60, py + 100, fx, fy); ctx.stroke(); }
  ctx.fillStyle = '#3a6a3a'; ctx.beginPath(); ctx.moveTo(0, 1500); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 1480 - Math.abs(Math.sin(x * 0.015)) * 80); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.45); dateTag(ctx, u, 'OCT 27, 1962');
  say(ctx, u, ['“Black Saturday.”', 'A U-2 is shot down'], 260, 0.15, { size: 84, out: OUT('u2') });
}

// ================================================================ 7. depth charges around submarine B-59
function vDepth(ctx, u) {
  bgSky(ctx, ['#0a3a5a', '#062a46', '#031a30']);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = 140 + i * 200; ctx.fillStyle = 'rgba(120,200,255,0.05)'; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 160, 1300); ctx.lineTo(x - 120, 1300); ctx.fill(); } ctx.restore();
  for (let i = 0; i < 3; i++) { const x = 160 + i * 380; ctx.fillStyle = '#1a2a3a'; ctx.beginPath(); ctx.moveTo(x - 140, 150); ctx.lineTo(x + 140, 150); ctx.lineTo(x + 110, 190); ctx.lineTo(x - 110, 190); ctx.fill(); }
  const [sx, sy] = shakeOffset(u, 0.6, 3.8, 14); ctx.translate(sx, sy);
  sub(ctx, W / 2, 1250, 1.1);
  for (const [at, x] of [[0.6, 300], [1.4, 760], [2.2, 480], [3.0, 860]]) { const dt = u - at, y = lerp(200, 1100, R2((u - at + 0.8) / 0.8));
    if (dt < 0) { ctx.fillStyle = '#2a2a30'; ctx.fillRect(x - 14, y - 20, 28, 40); continue; }
    const r = rng(Math.floor(x)); for (let k = 0; k < 18; k++) puff(ctx, x + (r() - 0.5) * 160 * (1 + dt), 1100 - r() * 300 * dt, (30 + r() * 40) * (0.6 + dt), 'rgba(220,240,255,1)' === '' ? '#ffffff' : '#c8e4f4', R2(1 - dt / 1.6) * 0.8);
    glow(ctx, x, 1100, 200, '200,230,255', 0.6 * Math.exp(-dt * 2)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Under the sea, U.S. ships', 'drop depth charges on', 'Soviet sub B-59'], 230, 0.15, { size: 70, out: OUT('depth') });
}

// ================================================================ 8. inside B-59: three officers must agree
function vControl(ctx, u) {
  bgSky(ctx, ['#2a0a0a', '#3a1010', '#4a1414']);
  ctx.strokeStyle = '#5a3030'; ctx.lineWidth = 18; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, 520 + i * 60); ctx.lineTo(W, 500 + i * 60); ctx.stroke(); }
  ctx.fillStyle = '#3a2424'; ctx.fillRect(0, 1500, W, H);
  const r = rng(2); for (let i = 0; i < 16; i++) { ctx.fillStyle = Math.sin(u * 4 + i) > 0 ? '#ff4a3a' : '#5a1a1a'; ctx.beginPath(); ctx.arc(120 + r() * 840, 900 + r() * 200, 12, 0, 6.283); ctx.fill(); }
  glow(ctx, W / 2, 700, 500, '255,60,40', 0.25 + 0.15 * Math.sin(u * 3));
  hist(ctx, 220, 1700, 380, 'crew', { t: u, pose: 'fist', sweat: 1 }); nameTag(ctx, 220, 1760, 'CAPTAIN: YES');
  hist(ctx, 540, 1700, 380, 'crew', { t: u, pose: 'point', sweat: 1 }); nameTag(ctx, 540, 1760, 'POLITICAL OFFICER: YES');
  hist(ctx, 860, 1700, 380, 'va', { t: u, pose: u > 3.0 ? 'arms' : 'stand', sweat: 1, dir: -1 }); nameTag(ctx, 860, 1760, u > 3.0 ? 'ARKHIPOV: ?' : 'ARKHIPOV');
  ctx.font = `900 54px ${FONT}`; ctx.textAlign = 'right'; ctx.fillStyle = '#ffd25a'; ctx.fillText('45°C+', W - 70, 820);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The captain orders the', 'nuclear torpedo armed.', 'Three officers must agree.'], 230, 0.15, { size: 68, out: OUT('control') });
}

// ================================================================ 9. WHAT IF: the torpedo fires
function vTorpedo(ctx, u) {
  const boom = 0.8, dt = Math.max(0, u - boom), [sx, sy] = shakeOffset(u, boom, 3, 30);
  bgSky(ctx, ['#4a7ab0', '#8ab8e0', '#d8ecf8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#2a6a9a'; ctx.fillRect(0, 1200, W, H);
  for (let i = 0; i < 4; i++) { const x = 180 + i * 240, lift = dt > 0 ? easeOut(R2(dt / 1.4)) * (500 - Math.abs(i - 1.5) * 120) : 0, rot = dt > 0 ? (i - 1.5) * 0.4 * R2(dt / 1.4) : 0;
    ctx.save(); ctx.translate(x, 1190 - lift); ctx.rotate(rot); ctx.scale(0.5, 0.5); ctx.fillStyle = '#7a8494'; ctx.beginPath(); ctx.moveTo(-260, -30); ctx.lineTo(260, -30); ctx.lineTo(220, 20); ctx.lineTo(-220, 20); ctx.fill(); ctx.fillRect(-60, -110, 120, 80); ctx.restore(); }
  if (dt > 0) { const g = easeOut(R2(dt / 1.6)); ctx.fillStyle = mixHex('#ffffff', '#c8d8e8', R2(dt / 2)); ctx.beginPath(); ctx.moveTo(W / 2 - 360 * g, 1220); ctx.quadraticCurveTo(W / 2 - 300 * g, 1220 - 900 * g, W / 2, 1220 - 1000 * g); ctx.quadraticCurveTo(W / 2 + 300 * g, 1220 - 900 * g, W / 2 + 360 * g, 1220); ctx.fill();
    for (let i = 0; i < 20; i++) { const r = rng(i); puff(ctx, W / 2 + (r() - 0.5) * 900 * g, 1220 - r() * 120, 80 + r() * 80, '#e8f0f8', 0.8); } glow(ctx, W / 2, 1100, 700, '255,255,255', 0.7 * Math.exp(-dt)); }
  flash(ctx, u, boom, 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['WHAT IF the third', 'officer said yes?'], 230, 0.15, { size: 84, out: 0.9, color: '#ffd25a' });
  say(ctx, u, ['A U.S. naval group', 'is nuked at sea'], 230, 1.0, { size: 88, out: OUT('torpedo') });
}

// ================================================================ 10. the invasion meets nukes nobody knew about
function vInvade(ctx, u) {
  const boom = 2.0, dt = Math.max(0, u - boom), [sx, sy] = shakeOffset(u, boom, 2.4, 26);
  bgSky(ctx, ['#4a8ac8', '#9ac8e8', '#f0e0c0']); ctx.translate(sx, sy);
  ctx.fillStyle = '#2a7ab0'; ctx.fillRect(0, 1100, W, 300); ctx.fillStyle = '#e8d29a'; ctx.fillRect(0, 1400, W, H);
  for (let i = 0; i < 6; i++) { const x = 100 + i * 170, y = 1300 - Math.min(u, boom) * 20; ctx.fillStyle = '#5a6a5a'; ctx.beginPath(); ctx.moveTo(x - 70, y); ctx.lineTo(x + 70, y); ctx.lineTo(x + 55, y + 34); ctx.lineTo(x - 55, y + 34); ctx.fill(); }
  massCrowd(ctx, u, { n: 400, yFar: 1420, yNear: 2100, sFar: 30, sNear: 160, seed: 4, col: '#3a4a2a', flow: dt > 0 ? -300 : 60, panic: dt > 0 ? 1 : 0, arms: 0 });
  mushroom(ctx, 760, 1150, dt, 1.3); flash(ctx, u, boom, 0.4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['The U.S. invades Cuba,', 'as its generals wanted'], 230, 0.15, { size: 76, out: 1.9 });
  say(ctx, u, ['Cuba had ~100 battlefield', 'nukes. Nobody knew.'], 230, 2.1, { size: 72, out: OUT('invade'), mark: { line: 1, from: 6, to: 19, color: '#e63946' } });
}

// ================================================================ 11. full war, 1962
function vWar(ctx, u) {
  space(ctx, u);
  const R = 560, cx = W / 2, cy = 1150, lon0 = lerp(-70, 10, easeInOut(prog(u, 0, 5))), lat0 = 45, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0.2, -0.2, -0.95] });
  const P = (lo, la) => { const [x, y, z] = v(lo, la); return [cx + x * R, cy + y * R, z]; };
  const arcs = [[[-83, 22.7], [-77, 38.9]], [[-83, 22.7], [-74, 40.7]], [[-100, 45], [37.6, 55.8]], [[-100, 45], [30.3, 59.9]], [[37.6, 55.8], [2.35, 48.9]], [[37.6, 55.8], [-0.1, 51.5]], [[37.6, 55.8], [13.4, 52.5]], [[-1, 52], [37.6, 55.8]]];
  arcs.forEach(([a, b], i) => { const at = 0.3 + i * 0.25, f = easeInOut(R2((u - at) / 1.2)); if (f <= 0) return; const A = P(...a), B = P(...b); if (A[2] < -0.2 && B[2] < -0.2) return;
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - 300; ctx.strokeStyle = 'rgba(255,120,120,0.85)'; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(A[0], A[1]);
    for (let s = 1; s <= 30; s++) { const q = s / 30 * f; ctx.lineTo((1 - q) ** 2 * A[0] + 2 * (1 - q) * q * mx + q * q * B[0], (1 - q) ** 2 * A[1] + 2 * (1 - q) * q * my + q * q * B[1]); } ctx.stroke(); ctx.setLineDash([]);
    if (f >= 1 && B[2] > 0) glow(ctx, B[0], B[1], 70 + 30 * Math.sin(u * 6 + i), '255,230,170', 0.9); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Full nuclear war.', 'U.S.: ~25,000 warheads.', 'USSR: ~3,300.'], 230, 0.15, { size: 72, out: OUT('war') });
}

// ================================================================ 12. the toll, from America's own war plan
function vSIOP(ctx, u) {
  bgSky(ctx, ['#1a1410', '#2a1e18', '#3a2a20']);
  const r = rng(4); ctx.fillStyle = 'rgba(160,150,140,0.6)'; for (let i = 0; i < 180; i++) { const x = (r() * W + u * 20) % W, y = (r() * H + u * (40 + r() * 40)) % H; ctx.fillRect(x, y, 3, 3); }
  ctx.fillStyle = '#e8e0cc'; ctx.save(); ctx.translate(W / 2, 1080); ctx.rotate(-0.03); ctx.fillRect(-380, -260, 760, 520); ctx.fillStyle = '#c8302a'; ctx.font = `900 48px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('TOP SECRET', 0, -190);
  ctx.fillStyle = '#1b1b2e'; ctx.font = `800 34px ${MONOX}`; ctx.fillText('SIOP-62 · EST. DEATHS', 0, -120); ctx.font = `900 92px ${FONT}`; ctx.fillText(`${Math.round(285 * easeOut(prog(u, 0.4, 2.0)))},000,000`, 0, 20);
  ctx.font = `800 34px ${FONT}`; ctx.fillText('USSR + CHINA', 0, 90); ctx.fillStyle = 'rgba(27,27,46,0.2)'; for (let k = 0; k < 3; k++) ctx.fillRect(-320, 140 + k * 30, 640, 12); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['America’s own war plan', 'counted the dead'], 230, 0.15, { size: 80, out: OUT('siop') });
  if (u > 2.0) { scrimB(ctx, 1560, 0.6); say(ctx, u, ['Plus tens of millions in', 'America and Europe (est.)'], 1680, 2.0, { size: 54, weight: 900, out: OUT('siop') }); }
}
const MONOX = '"JetBrains Mono", "Menlo", monospace';

// ================================================================ 13. reality: one man said no
function vArkhipov(ctx, u) {
  const rise = easeOut(prog(u, 0.3, 2.6));
  bgSky(ctx, ['#ff9a6a', '#ffc89a', '#ffe8c8']);
  glow(ctx, W / 2, 1150, 400, '255,220,160', 0.8); ctx.fillStyle = '#fff0c0'; ctx.beginPath(); ctx.arc(W / 2, 1150, 110, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#2a5a8a'; ctx.fillRect(0, 1200, W, H); ctx.fillStyle = 'rgba(255,220,170,0.35)'; ctx.fillRect(W / 2 - 60, 1200, 120, 700);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1212); ctx.clip(); sub(ctx, W / 2 + 40, lerp(1330, 1230, rise), 1.2); if (rise > 0.6) hist(ctx, W / 2 + 40, lerp(1330, 1230, rise) - 140, 200, 'va', { t: u, pose: 'stand' }); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 640, 0.5);
  say(ctx, u, ['In reality, one man', 'said no: Vasily Arkhipov'], 230, 0.15, { size: 76, out: OUT('arkhipov'), mark: { line: 1, from: 9, to: 24, color: '#2a9df4' } });
  say(ctx, u, ['The world didn’t learn', 'his name for 40 years.'], 470, 2.6, { size: 60, weight: 800, out: OUT('arkhipov') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -60 + u * 4, lat0: 25, t: u, ink: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ shared kit
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
