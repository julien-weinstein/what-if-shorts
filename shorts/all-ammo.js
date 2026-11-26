// What if every bullet, bomb and missile on Earth exploded at once?
//
// SAFETY: consequences only; nothing about how munitions work beyond widely known, non-technical facts.
//
// FACTS (checked; all hedged on screen where estimates):
//  - The world makes on the order of ~12 billion rounds of small-arms ammunition a year (Small Arms Survey-type estimates);
//    there are roughly 1 billion firearms worldwide (Small Arms Survey 2018: ~1.01 billion).
//  - Ammunition depot explosions are real and devastating: Lagos 2002 (~1,100 dead), Brazzaville 2012 (~300 dead);
//    the 2024 Toropets (Russia) arsenal blast registered on seismographs like a small earthquake.
//  - HMS Hood (1941): a magazine explosion sank her in about 3 minutes; 1,415 of 1,418 crew died.
//  - A cartridge that cooks off outside a gun is far less dangerous than one fired from a gun: without a barrel the case
//    ruptures and the bullet barely moves (fire-service and SAAMI tests). Chambered rounds in loaded guns would fire.
//  - Nuclear weapons are designed so a non-symmetric detonation of their explosive does not produce a nuclear yield; it
//    scatters plutonium instead (Palomares, Spain 1966; Thule, Greenland 1968).
//  - Unexploded ordnance: Laos has an estimated ~80 million unexploded cluster bomblets; France and Belgium still dig up
//    tons of WWI shells every year ("iron harvest").
//  - Toll (est.): tens of thousands at least, possibly far more (deliberately hedged).
//  - After the blast nobody has ammunition; ammunition factories store explosives too. Rebuilding large-scale munition
//    production has taken years (e.g. post-2022 artillery ramp-ups).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['lots', 4.5, [[0.2, 'rumble:4.2']]],
  ['depots', 5.0, [[0.3, 'impact'], [0.35, 'boom'], [1.0, 'boom'], [1.7, 'boom'], [2.4, 'boom'], [0.4, 'rumble:4.4']]],
  ['city', 4.5, [[0.6, 'impact'], [0.65, 'boom'], [0.8, 'roar:3']]],
  ['ships', 5.0, [[0.5, 'impact'], [0.55, 'boom'], [2.0, 'boom']]],
  ['popcorn', 5.0, [[0.6, 'impact'], [3.0, 'impact']]],
  ['nukes', 5.0, [[0.6, 'boom'], [0.7, 'rumble:4']]],
  ['fields', 4.5, [[0.4, 'boom'], [1.0, 'boom'], [1.6, 'boom']]],
  ['toll', 4.5, [[0.2, 'heart:4.2']]],
  ['stop', 5.0, [[0.2, 'swell:4.6']]],
  ['sling', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if every bullet, bomb and missile exploded at once?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, lots: vLots, depots: vDepots, city: vCity2, ships: vShips, popcorn: vPopcorn, nukes: vNukes, fields: vFields,
              toll: vToll, stop: vStop, sling: vSling, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.26, contrast: 1.08, saturate: 1.15, vignette: 0.34 });
}
function fireball(ctx2, x, y, dt, s, seed) {   // a rising, cooling explosion
  if (dt <= 0) return; const r = rng(seed), k = 1 - Math.exp(-dt * 2.5), fade = R2(1 - dt / 3.5);
  for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = r() * 90 * s * k, rr = (60 + r() * 70) * s * (0.4 + k);
    puff(ctx2, x + Math.cos(a) * d, y - k * 160 * s + Math.sin(a) * d * 0.6 - dt * 40 * s, rr, mixHex('#fff0a0', '#3a2a28', R2(dt / 1.6 + r() * 0.3)), fade); }
  glow(ctx2, x, y - 60 * s, 260 * s, '255,170,70', 0.9 * Math.exp(-dt * 1.4));
}
function cartridge(ctx, x, y, s, rot = 0, burst = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#d8a040'; roundRect(ctx, -12, -10, 24, 60, 4); ctx.fill(); ctx.fillStyle = '#e8c070'; ctx.fillRect(-12, -10, 6, 60);
  if (burst > 0) { ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-4, 50); ctx.lineTo(2, 20); ctx.lineTo(-3, 0); ctx.stroke(); }
  ctx.translate(0, -burst * 26); ctx.fillStyle = '#c87a4a'; ctx.beginPath(); ctx.moveTo(-11, -10); ctx.quadraticCurveTo(-11, -42, 0, -50); ctx.quadraticCurveTo(11, -42, 11, -10); ctx.fill(); ctx.restore(); }

// ================================================================ 1. hook
function vHook(ctx, u) {
  bgSky(ctx, ['#1b1430', '#3a2050', '#6a3060']);
  drift(ctx, u, 0, 3.5, 1.0, 1.08, W / 2, 1150);
  const r = rng(2); for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = 300 + r() * 700, x = W / 2 + Math.cos(a + u * 0.2) * d * 0.6, y = 1150 + Math.sin(a + u * 0.2) * d;
    cartridge(ctx, x, y, 1.4 + r(), a + u * (r() - 0.5), 0); }
  ctx.save(); ctx.translate(W / 2, 1150); ctx.rotate(u * 0.6); cartridge(ctx, 0, 0, 7, 0, 0); ctx.restore();
  if (u > 2.6) { fireball(ctx, W / 2, 1300, (u - 2.6) * 1.5, 2.4, 3); flash(ctx, u, 2.6, 0.3); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if every bullet,', 'bomb and missile', 'exploded at once?'], 300, 0.15, { size: 84, out: OUT('hook'), mark: { line: 2, from: 0, to: 8, color: '#e63946' } });
}

// ================================================================ 2. there's a LOT of it
function vLots(ctx, u) {
  bgSky(ctx, ['#2a2a34', '#3a3a46', '#4a4a58']);
  const vx = W / 2, vy = 820, z0 = u * 0.8;
  ctx.fillStyle = '#5a5a66'; ctx.beginPath(); ctx.moveTo(vx - 40, vy); ctx.lineTo(vx + 40, vy); ctx.lineTo(W + 500, H); ctx.lineTo(-500, H); ctx.fill();
  for (const side of [-1, 1]) for (let k = 14; k >= 0; k--) { const z = 1 + k * 0.6 - (z0 % 0.6), s = 1 / z, x = vx + side * 330 * s, base = vy + 900 * s;
    for (let st = 0; st < 5; st++) { const w = 260 * s, h = 110 * s, y = base - st * h; ctx.fillStyle = ['#4a5a3a', '#5a6a42', '#3a4a30'][(k + st) % 3]; ctx.fillRect(x - w / 2, y - h, w, h - 4 * s);
      ctx.fillStyle = 'rgba(255,220,120,0.7)'; ctx.fillRect(x - w * 0.3, y - h * 0.6, w * 0.6, h * 0.18); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['The world makes ~12 billion', 'bullets a year (est.)'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['Plus millions of shells,', 'bombs and missiles'], 230, 2.5, { size: 80, out: OUT('lots') });
}

// ================================================================ 3. thousands of depots, all at once
function vDepots(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0.3, 4.5, 26);
  bgSky(ctx, ['#2a3a6a', '#7a8aaa', '#c8b8a0']); ctx.translate(sx, sy);
  ctx.fillStyle = '#8a9a6a'; ctx.fillRect(0, 1000, W, H);
  const pos = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const z = 1 + r * 0.7, s = 1 / z, x = W / 2 + (c - 1.5) * 420 * s, y = 1000 + 800 * s; pos.push([x, y, s, r * 4 + c]); }
  pos.sort((a, b) => a[1] - b[1]);
  for (const [x, y, s, i] of pos) { const at = 0.3 + ((i * 7) % 16) / 16 * 2.4; if (u < at) { ctx.fillStyle = '#6a7a5a'; ctx.beginPath(); ctx.ellipse(x, y, 160 * s, 100 * s, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x - 30 * s, y - 60 * s, 60 * s, 60 * s); } }
  for (const [x, y, s, i] of pos) { const at = 0.3 + ((i * 7) % 16) / 16 * 2.4; if (u >= at) { fireball(ctx, x, y, u - at, s * 1.8, i); debrisAtCam(ctx, x, y - 40 * s, (u - at) * 0.7, i + 50, 14, '#2a2420'); } }
  for (const [x, y, s, i] of pos) { const at = 0.3 + ((i * 7) % 16) / 16 * 2.4, dt = u - at; if (dt > 0 && dt < 1.2) { ctx.strokeStyle = `rgba(255,255,255,${0.6 * (1 - dt / 1.2)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, dt * 600 * s, dt * 200 * s, 0, 0, 6.283); ctx.stroke(); } }
  flash(ctx, u, 0.3, 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Thousands of ammo depots', 'go up in the same second'], 230, 0.15, { size: 72, out: OUT('depots') });
  if (u > 2.2) { scrimB(ctx, 1600, 0.65); say(ctx, u, ['In 2024, one depot blast', 'registered as an earthquake'], 1720, 2.2, { size: 50, weight: 900, out: OUT('depots') }); }
}

// ================================================================ 4. the shockwave hits a nearby city
function vCity2(ctx, u) {
  const hit = 0.6, dt = Math.max(0, u - hit), [sx, sy] = shakeOffset(u, hit, 3, 30);
  bgSky(ctx, ['#4a5a8a', '#c88a6a', '#ffd0a0']); ctx.translate(sx, sy);
  fireball(ctx, 880, 1050, u * 0.8 + 0.4, 3, 9);
  cityLayer(ctx, u, { base: 1300, seed: 12, hMin: 260, hMax: 800, wMin: 90, wMax: 180, gap: 14, col: '#3a3a5a', win: 'rgba(200,230,255,0.75)', winP: 0.6, ws: 10 });
  if (dt > 0) { const r = rng(4); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 220; i++) { const x0 = r() * W, y0 = 600 + r() * 680, vx = -(300 + r() * 600), vy = -100 + r() * 200, s = (6 + r() * 12) * (1 + dt * 1.5), x = x0 + vx * dt, y = y0 + vy * dt + 600 * dt * dt;
      if (dt * 900 < W - x0) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(dt * 8 + i); ctx.fillStyle = 'rgba(210,240,255,0.8)'; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, s * 0.4); ctx.lineTo(-s * 0.5, s * 0.6); ctx.fill(); ctx.restore(); }
    ctx.restore();
    const front = W - dt * 900; ctx.fillStyle = 'rgba(220,190,160,0.35)'; ctx.fillRect(front, 0, W - front + 200, H); }
  ctx.fillStyle = '#2a2a3a'; ctx.fillRect(-40, 1300, W + 80, H);
  massCrowd(ctx, u, { n: 500, yFar: 1320, yNear: 2150, sFar: 20, sNear: 200, seed: 13, col: '#14141e', flow: dt > 0 ? -220 : 0, panic: dt > 0 ? 1 : 0, arms: dt > 0 ? 0.4 : 0 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['Many depots sit', 'right next to cities'], 230, 0.15, { size: 84, out: OUT('city') });
  if (u > 2.0) { scrimB(ctx, 1600, 0.65); say(ctx, u, ['Lagos, 2002: one armory blast', 'killed over 1,000 people'], 1720, 2.0, { size: 50, weight: 900, out: OUT('city') }); }
}

// ================================================================ 5. every warship's magazine
function warship(ctx, x, y, s, split, t) {
  for (const [side, dir] of [[0, -1], [1, 1]]) { ctx.save(); ctx.translate(x + dir * split * 80 * s, y + split * 160 * s); ctx.rotate(dir * split * 0.5); ctx.scale(s, s);
    ctx.beginPath(); ctx.rect(side ? 0 : -500, -400, 500, 600); ctx.clip();
    ctx.fillStyle = '#7a8494'; ctx.beginPath(); ctx.moveTo(-460, -60); ctx.lineTo(480, -60); ctx.lineTo(420, 40); ctx.lineTo(-420, 40); ctx.fill();
    ctx.fillStyle = '#6a7484'; ctx.fillRect(-160, -150, 260, 90); ctx.fillRect(-60, -220, 90, 70); ctx.fillRect(-30, -300, 12, 80);
    ctx.fillStyle = '#5a6474'; ctx.fillRect(220, -100, 110, 40); ctx.fillRect(330, -90, 90, 10); ctx.fillRect(-330, -100, 110, 40); ctx.fillRect(-420, -90, 90, 10); ctx.restore(); }
}
function vShips(ctx, u) {
  const hit = 0.5, dt = Math.max(0, u - hit), [sx, sy] = shakeOffset(u, hit, 3, 22);
  bgSky(ctx, ['#2a4a7a', '#6a9ac0', '#c8dcec']); ctx.translate(sx, sy);
  for (let i = 0; i < 6; i++) { const x = 90 + i * 180, at = 0.8 + i * 0.3; if (u > at) fireball(ctx, x, 1000, (u - at) * 1.2, 0.35, i + 20); }
  ctx.fillStyle = '#2a6a9a'; ctx.fillRect(0, 1000, W, H);
  const split = easeInOut(R2((dt - 0.3) / 3.6)) * 0.8, sink = easeIn2(R2((dt - 0.8) / 3.6)) * 220;
  warship(ctx, W / 2, 1300 + sink, 1.0, split, u);
  if (dt > 0) { fireball(ctx, W / 2, 1180 + sink * 0.5, dt * 1.3, 1.1, 7); debrisAtCam(ctx, W / 2, 1200, dt * 0.7, 3, 40, '#3a3a44'); }
  ctx.fillStyle = 'rgba(42,106,154,0.6)'; ctx.fillRect(0, 1340, W, H);
  for (let i = 0; i < 8; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(i * 150 + (u * 40) % 150, 1360 + i * 60); ctx.lineTo(i * 150 + 80 + (u * 40) % 150, 1360 + i * 60); ctx.stroke(); }
  flash(ctx, u, hit, 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Every warship’s magazine', 'detonates'], 230, 0.15, { size: 80, out: OUT('ships') });
  if (u > 2.0) { scrimB(ctx, 1600, 0.65); say(ctx, u, ['HMS Hood, 1941: one magazine', 'blast sank her in 3 minutes'], 1720, 2.0, { size: 50, weight: 900, out: OUT('ships') }); }
}

// ================================================================ 6. surprise: a loose bullet barely flies
function vPopcorn(ctx, u) {
  bgSky(ctx, ['#f0e6d0', '#e6d8bc', '#d8c8a8']);
  ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, 1350, W, H); ctx.fillStyle = '#6a4a30'; ctx.fillRect(0, 1350, W, 20);
  ctx.fillStyle = '#4a6a3a'; ctx.fillRect(200, 1080, 680, 270); ctx.fillStyle = '#3a5a2a'; ctx.fillRect(200, 1080, 680, 40);
  ctx.font = `900 50px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e8e0c0'; ctx.fillText('AMMO', 540, 1260);
  const r = rng(6);
  for (let i = 0; i < 40; i++) { const at = 0.6 + r() * 2.0, dt = u - at, x0 = 240 + r() * 600, y0 = 1090; if (dt < 0) { continue; }
    const h = 120 + r() * 160, x = x0 + (r() - 0.5) * 200 * Math.min(dt, 0.8), y = y0 - (h * Math.sin(Math.min(dt, 0.9) / 0.9 * Math.PI)) + (dt > 0.9 ? Math.min(260, (dt - 0.9) * 600) : 0);
    cartridge(ctx, x, Math.min(y, 1330), 1.2, dt * 10 + i, 1); if (dt < 0.15) glow(ctx, x0, y0, 60, '255,200,120', 0.8); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Surprise: a loose bullet', 'barely flies. It just pops.'], 230, 0.15, { size: 70, out: 2.8 });
  say(ctx, u, ['But every loaded gun', 'fires once'], 230, 2.9, { size: 84, out: OUT('popcorn'), mark: { line: 0, from: 4, to: 20, color: '#e63946' } });
}

// ================================================================ 7. nukes don't go nuclear: they scatter plutonium
function vNukes(ctx, u) {
  const hit = 0.6, dt = Math.max(0, u - hit);
  bgSky(ctx, ['#2a3a5a', '#6a7aa0', '#b8c0d0']);
  ctx.fillStyle = '#9aa07a'; ctx.fillRect(0, 1250, W, H); ctx.fillStyle = '#6a6a6a'; ctx.fillRect(0, 1450, W, 120);
  for (const x of [220, 540, 860]) { ctx.fillStyle = '#c8ccd4'; ctx.beginPath(); ctx.moveTo(x - 120, 1460); ctx.lineTo(x + 140, 1460); ctx.lineTo(x + 100, 1430); ctx.lineTo(x - 90, 1430); ctx.fill(); ctx.fillRect(x - 10, 1400, 50, 30); }
  if (dt > 0) { const r = rng(3); for (let i = 0; i < 26; i++) { const x = 540 + (r() - 0.5) * 900 * R2(dt / 2), y = 1300 - r() * 600 * R2(dt / 2.2) - dt * 20; puff(ctx, x, y, (60 + r() * 80) * (0.5 + R2(dt / 2)), mixHex('#c8c0b8', '#8a8a8a', r()), 0.7); }
    for (let i = 0; i < 80; i++) { const a = r() * 6.283, d = r() * 700 * R2(dt / 3), x = 540 + Math.cos(a) * d, y = 1100 + Math.sin(a) * d * 0.5 + dt * 30; ctx.fillStyle = 'rgba(160,255,120,0.85)'; ctx.beginPath(); ctx.arc(x, y, 4 + r() * 4, 0, 6.283); ctx.fill(); }
    if (u > 2.2) { const k = easeBack(R2((u - 2.2) / 0.4)); ctx.save(); ctx.translate(840, 880); ctx.scale(k, k); ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(110, 80); ctx.lineTo(-110, 80); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#1b1b2e'; ctx.beginPath(); ctx.arc(0, 20, 14, 0, 6.283); ctx.fill(); for (let q = 0; q < 3; q++) { const a = -Math.PI / 2 + q * 2.094; ctx.beginPath(); ctx.moveTo(0, 20); ctx.arc(0, 20, 52, a - 0.5, a + 0.5); ctx.fill(); } ctx.restore(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.6);
  say(ctx, u, ['Nukes don’t go nuclear.', 'They spray plutonium', 'over their bases instead.'], 230, 0.15, { size: 70, out: OUT('nukes') });
  if (u > 2.4) { scrimB(ctx, 1600, 0.65); say(ctx, u, ['It really happened: Spain, 1966'], 1760, 2.4, { size: 48, weight: 900, x: W / 2, align: 'center', out: OUT('nukes') }); }
}

// ================================================================ 8. old battlefields erupt
function vFields(ctx, u) {
  bgSky(ctx, ['#6aa0d8', '#a8d0ec', '#e8f4ff']);
  for (let k = 0; k < 7; k++) { const y = 1000 + k * 140; ctx.fillStyle = k % 2 ? '#7ab04a' : '#8ac05a'; ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(W / 2, y - 40 + k * 6, W, y); ctx.lineTo(W, y + 160); ctx.lineTo(0, y + 160); ctx.fill(); }
  const r = rng(11); for (let i = 0; i < 46; i++) { const x = r() * W, y = 1020 + r() * 900, at = 0.3 + r() * 3.6, dt = u - at, s = 0.4 + (y - 1000) / 900;
    if (dt < 0) continue; for (let k = 0; k < 6; k++) puff(ctx, x + (r() - 0.5) * 40 * s, y - dt * 260 * s * (0.6 + k * 0.15), (20 + k * 8) * s * (0.5 + dt), '#6a5040', R2(1 - dt / 1.6) * 0.9);
    if (dt < 0.2) glow(ctx, x, y, 90 * s, '255,200,120', 0.8); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 620, 0.55);
  say(ctx, u, ['Old war zones erupt.', 'Laos alone holds ~80 million', 'unexploded bomblets'], 230, 0.15, { size: 68, out: OUT('fields') });
}

// ================================================================ 9. the toll
function vToll(ctx, u) {
  bgSky(ctx, ['#14080e', '#2a0e16', '#3a121c']);
  const r = rng(2); for (let i = 0; i < 16; i++) glow(ctx, r() * W, 1300 + r() * 600, 120, '255,120,40', 0.25 + 0.15 * Math.sin(u * 3 + i));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Killed in the first', 'minute (est.):'], 600, 0.15, { size: 76, x: W / 2, align: 'center', out: OUT('toll') });
  bigNum(ctx, u, 'tens of thousands', 920, 0.8, { size: 100, color: '#ff6b5b', out: OUT('toll') });
  say(ctx, u, ['probably far more'], 1060, 1.8, { size: 60, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 10. every war on Earth stops
function vStop(ctx, u) {
  bgSky(ctx, ['#8a9aaa', '#b8c0c8', '#d8d4cc']);
  ctx.fillStyle = '#7a6a50'; ctx.fillRect(0, 1200, W, H);
  ctx.fillStyle = '#5a4a38'; ctx.fillRect(0, 1260, W, 60); ctx.fillRect(0, 1640, W, 60);
  const soldier = (x, y, s, dir, seed) => { person2(ctx, x, y, s, { seed: 7, t: u, dir, grey: 0.6 }); ctx.fillStyle = '#4a5a3a'; ctx.beginPath(); ctx.ellipse(x, y - s * 0.96, s * 0.2, s * 0.09, 0, Math.PI, 0); ctx.fill();
    ctx.save(); ctx.translate(x + dir * s * 0.2, y - s * 0.5); ctx.rotate(dir * (0.4 + Math.sin(u * 2 + seed) * 0.1)); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(0, -6, dir * s * 0.55, 12); ctx.restore(); };
  for (let i = 0; i < 4; i++) soldier(140 + i * 140, 1270, 220, 1, i);
  for (let i = 0; i < 4; i++) soldier(W - 140 - i * 140, 1660, 260, -1, i + 9);
  if (u > 1.2) { for (const [x, y] of [[420, 960], [700, 1350]]) { ctx.save(); ctx.globalAlpha = R2((u - 1.2) / 0.3); ctx.font = `900 120px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 16; ctx.fillText('?', x, y); ctx.restore(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Then: silence. Every war', 'on Earth stops mid-battle'], 230, 0.15, { size: 70, out: 2.6 });
  say(ctx, u, ['Nobody has', 'a single bullet'], 230, 2.7, { size: 92, out: OUT('stop') });
}

// ================================================================ 11. the new deadliest weapon
function vSling(ctx, u) {
  bgSky(ctx, ['#ffb07a', '#ffd6a0', '#fff0d0']);
  ctx.fillStyle = '#c8a070'; ctx.fillRect(0, 1450, W, H);
  person2(ctx, 460, 1760, 520, { seed: 3, t: u });
  const pull = 0.5 + 0.5 * Math.sin(u * 2.4), hx = 700, hy = 1240;
  ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy + 140); ctx.lineTo(hx, hy + 40); ctx.lineTo(hx - 50, hy - 60); ctx.moveTo(hx, hy + 40); ctx.lineTo(hx + 50, hy - 60); ctx.stroke();
  ctx.strokeStyle = '#e63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(hx - 50, hy - 60); ctx.lineTo(hx - 120 * pull - 30, hy - 20); ctx.lineTo(hx + 50, hy - 60); ctx.stroke();
  ctx.fillStyle = '#9a9aa0'; ctx.beginPath(); ctx.arc(hx - 120 * pull - 30, hy - 20, 16, 0, 6.283); ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Ammo factories blew up too.', 'Rearming takes years.'], 230, 0.15, { size: 70, out: 2.4 });
  say(ctx, u, ['Until then, the world’s', 'deadliest weapon is…', 'a slingshot'], 230, 2.5, { size: 76, out: OUT('sling'), mark: { line: 2, from: 0, to: 11, color: '#e63946' } });
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
