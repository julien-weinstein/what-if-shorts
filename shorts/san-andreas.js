// What if the San Andreas Fault ruptured?  ("The Big One")
//
// FACTS (checked; USGS unless noted):
//  - The San Andreas Fault is ~1,200 km long. The Pacific Plate slides NW past North America at ~3-5 cm/yr,
//    about as fast as fingernails grow. The southern section last ruptured in a big quake in 1857 (Fort Tejon, M7.9).
//  - 1906 San Francisco (M7.9): ~3,000 deaths; ground offsets up to ~6 m.
//  - ShakeOut Scenario (USGS 2008): M7.8 rupture of ~300 km from the Salton Sea toward Lake Hughes; shaking lasting up to
//    ~2 minutes; ~1,600 fire ignitions with broken water mains; aqueducts, power lines, pipelines and freeways that cross the
//    fault are cut; some areas without water for weeks to months; est. ~1,800 deaths, ~50,000 injuries, ~$200 billion.
//  - Rupture speeds ~2-3 km/s: a 300 km rupture unzips in roughly 1-2 minutes.
//  - ShakeAlert earthquake early warning can give seconds to tens of seconds of warning on phones.
//  - UCERF3: >99% chance of an M6.7+ quake somewhere in California in the next 30 years.
//  - California will not fall into the ocean; the plates slide sideways. In ~15 million years Los Angeles and
//    San Francisco will be side by side.
// PLOT HOLES: Evacuate? quakes can't be predicted, only warned seconds ahead. M10? the fault isn't long enough (USGS).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['fault', 5.0, [[0.2, 'rumble:4.6']]],
  ['alert', 4.0, [[0.2, 'heart:3.8']]],
  ['unzip', 5.5, [[0.1, 'impact'], [0.15, 'boom'], [0.2, 'rumble:5.2'], [2.4, 'boom']]],
  ['offset', 4.5, [[0.6, 'impact'], [0.65, 'boom']]],
  ['city', 5.5, [[0.1, 'rumble:5.2'], [1.6, 'boom'], [3.0, 'boom']]],
  ['fires', 5.0, [[0.2, 'roar:4.6']]],
  ['life', 5.0, [[0.2, 'rumble:4.6'], [1.0, 'impact']]],
  ['toll', 5.0, [[0.2, 'heart:4.6'], [2.4, 'boom']]],
  ['myth', 6.0, [[0.2, 'swell:5.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the San Andreas Fault ruptured?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 72, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, fault: vFault, alert: vAlert, unzip: vUnzip, offset: vOffset, city: vCity, fires: vFires, life: vLife,
              toll: vToll, myth: vMyth, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}

// ================================================================ stylised California map (Natural Earth coast + fault trace)
const FAULT = [[-115.7, 33.35], [-116.2, 33.7], [-116.8, 33.95], [-117.3, 34.2], [-117.45, 34.3], [-118.1, 34.55], [-118.95, 34.8], [-119.8, 35.2], [-120.43, 35.9],
  [-121.4, 36.85], [-122.45, 37.6], [-122.8, 38.0], [-123.7, 38.95], [-124.1, 40.1]];
const CA_BORDER = [[-124.2, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.63, 35.0], [-114.45, 34.3], [-114.72, 33.0], [-114.72, 32.72], [-117.12, 32.53]];
const CAC = [['Los Angeles', -118.24, 34.05, 1], ['San Francisco', -122.42, 37.77, 1], ['San Diego', -117.16, 32.72, 0], ['San Bernardino', -117.29, 34.11, 0], ['Palm Springs', -116.55, 33.83, 0], ['Bakersfield', -119.0, 35.37, 0], ['Sacramento', -121.49, 38.58, 0]];
function caMap(ctx, o) {
  const { lon0 = -119, lat0 = 36, k = 150, cx = W / 2, cy = 1150, t = 0, rupture = 0, rupFrom = 0, rupTo = 6 } = o, cl = Math.cos(lat0 * Math.PI / 180);
  const P = (lo, la) => [cx + (lo - lon0) * k * cl, cy - (la - lat0) * k];
  bgSky(ctx, ['#2a6aaa', '#3a86c8', '#5aa6e0']);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(0, i * 70 + (t * 10) % 70); ctx.lineTo(W, i * 70 + (t * 10) % 70); ctx.stroke(); }
  for (const poly of LAND) { const [lo, la] = poly[0]; if (poly.length < 30 && !(lo > -140 && lo < -60 && la > 10 && la < 70)) continue;
    let near = false; for (const [a, b] of poly) if (a > -135 && a < -100 && b > 25 && b < 50) { near = true; break; } if (!near) continue;
    ctx.fillStyle = '#e6d6a8'; ctx.beginPath(); poly.forEach(([a, b], i) => { const [x, y] = P(a, b); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c8b480'; ctx.lineWidth = 4; ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,100,70,0.6)'; ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.beginPath(); CA_BORDER.forEach(([a, b], i) => { const [x, y] = P(a, b); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
  // the fault
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#b02a3a'; ctx.lineWidth = 8; ctx.beginPath(); FAULT.forEach(([a, b], i) => { const [x, y] = P(a, b); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  if (rupture > 0) { const seg = FAULT.slice(rupFrom, rupTo + 1), L = []; let tot = 0; for (let i = 1; i < seg.length; i++) { const d = Math.hypot(...P(...seg[i]).map((v, j) => v - P(...seg[i - 1])[j])); L.push(d); tot += d; }
    let rem = tot * rupture, end = P(...seg[0]); ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(...end);
    for (let i = 1; i < seg.length && rem > 0; i++) { const q = Math.min(1, rem / L[i - 1]), a = P(...seg[i - 1]), b = P(...seg[i]); end = [lerp(a[0], b[0], q), lerp(a[1], b[1], q)]; ctx.lineTo(...end); rem -= L[i - 1]; }
    ctx.stroke(); glow(ctx, end[0], end[1], 90, '255,220,120', 0.9); return { P, tip: end }; }
  return { P };
}
function cityDots(ctx, P, which, size = 40) {
  for (const [name, lo, la, big] of CAC) { if (which && !which.includes(name)) continue; const [x, y] = P(lo, la);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, big ? 14 : 10, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#1b1b2e'; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'left'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fillStyle = '#ffffff'; ctx.fillText(name, x + 22, y + 12); ctx.shadowBlur = 0; }
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  const { P } = caMap(ctx, { lon0: -119.2, lat0: 36.2, k: 118, cy: 1200, t: u });
  const pulse = 0.5 + 0.5 * Math.sin(u * 5); FAULT.forEach(([a, b]) => { const [x, y] = P(a, b); glow(ctx, x, y, 50, '255,80,80', 0.3 * pulse); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the', 'San Andreas', 'ruptured?'], 300, 0.15, { size: 104, out: OUT('hook'), mark: { line: 1, from: 0, to: 11, color: '#b02a3a' } });
}

// ================================================================ 2. the fault: sliding as fast as fingernails grow
function vFault(ctx, u) {
  const { P } = caMap(ctx, { lon0: -119.2, lat0: 36.2, k: 118, cy: 1200, t: u });
  // plate arrows
  const sh = Math.sin(u * 2) * 10;
  const arrow = (x, y, ang, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col; ctx.fillRect(-70, -14, 110, 28); ctx.beginPath(); ctx.moveTo(40, -36); ctx.lineTo(90, 0); ctx.lineTo(40, 36); ctx.fill(); ctx.restore(); };
  arrow(250 + sh, 1250 + sh, -2.2, 'rgba(255,255,255,0.9)'); arrow(800 - sh, 1050 - sh, 0.95, 'rgba(255,255,255,0.9)');
  ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('PACIFIC PLATE', 230, 1380); ctx.fillText('NORTH AMERICAN', 820, 900); ctx.fillText('PLATE', 820, 940);
  // fingernail comparison
  if (u > 1.6) { const k = easeBack(R2((u - 1.6) / 0.4)); ctx.save(); ctx.translate(820, 1560); ctx.scale(k, k); ctx.fillStyle = 'rgba(255,255,255,0.95)'; roundRect(ctx, -200, -90, 400, 180, 28); ctx.fill();
    ctx.fillStyle = '#f2c4a8'; roundRect(ctx, -170, -50, 120, 100, 40); ctx.fill(); ctx.fillStyle = '#ffe6e0'; roundRect(ctx, -150, -44, 80, 50, 20); ctx.fill();
    ctx.font = `900 46px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#1b1b2e'; ctx.fillText('~4 cm', -30, -6); ctx.font = `800 28px ${FONT}`; ctx.fillText('a year', -30, 34); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['1,200 km long. Sliding', 'as fast as fingernails grow'], 230, 0.15, { size: 70, out: 2.5 });
  say(ctx, u, ['But the south has been', 'stuck since 1857'], 230, 2.6, { size: 80, out: OUT('fault'), mark: { line: 1, from: 0, to: 5, color: '#b02a3a' } });
}

// ================================================================ 3. phones buzz: early warning
function vAlert(ctx, u) {
  bgSky(ctx, ['#ffd6a8', '#ffb98a', '#ff9a7a']);
  drift(ctx, u, 0, 4, 1.0, 1.05, W / 2, 1300);
  cityLayer(ctx, u, { base: 1200, seed: 3, hMin: 120, hMax: 520, wMin: 50, wMax: 130, gap: 8, col: '#c87a6a', win: 'rgba(255,240,210,0.6)', winP: 0.4, ws: 7 });
  ctx.fillStyle = '#e8a07a'; ctx.fillRect(0, 1200, W, H);
  massCrowd(ctx, u, { n: 1200, yFar: 1220, yNear: 2150, sFar: 10, sNear: 190, seed: 4, col: '#6a3a3a', rim: 'rgba(255,240,200,0.4)', phones: u > 0.8 ? 0.6 : 0.1, arms: 0 });
  // giant phone with the alert
  const k = easeBack(R2((u - 0.6) / 0.5)), buzz = Math.sin(u * 60) * 6 * (u > 0.6 ? 1 : 0);
  if (k > 0) { ctx.save(); ctx.translate(W / 2 + buzz, 1000); ctx.scale(k, k); ctx.rotate(-0.06);
    ctx.fillStyle = '#16161e'; roundRect(ctx, -200, -360, 400, 720, 60); ctx.fill(); ctx.fillStyle = '#ffffff'; roundRect(ctx, -180, -330, 360, 660, 44); ctx.fill();
    ctx.fillStyle = '#e63946'; roundRect(ctx, -160, -300, 320, 260, 30); ctx.fill();
    ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('EARTHQUAKE', 0, -210); ctx.font = `800 30px ${FONT}`; ctx.fillText('Expect strong shaking', 0, -160); ctx.fillText('Drop · Cover · Hold On', 0, -110);
    const sec = Math.max(0, Math.ceil(12 - (u - 0.6) * 4)); ctx.font = `900 150px ${FONT}`; ctx.fillStyle = '#1b1b2e'; ctx.fillText(sec, 0, 130); ctx.font = `800 30px ${FONT}`; ctx.fillText('seconds until shaking', 0, 190);
    ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['Your phone buzzes', 'seconds before it hits'], 230, 0.15, { size: 80, out: OUT('alert') });
}

// ================================================================ 4. M7.8: the fault unzips
function vUnzip(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0.1, 5.2, 14);
  ctx.translate(sx, sy);
  const { P, tip: tip0 } = caMap(ctx, { lon0: -117.5, lat0: 34.1, k: 330, cy: 1150, t: u, rupture: easeInOut(prog(u, 0.2, 4.6)), rupFrom: 0, rupTo: 5 });
  const tip = tip0 || P(...FAULT[0]);
  for (let i = 0; i < 5; i++) { const ph = ((u * 0.8 + i / 5) % 1); ctx.strokeStyle = `rgba(255,220,120,${0.7 * (1 - ph)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(tip[0], tip[1], ph * 700, 0, 6.283); ctx.stroke(); }
  cityDots(ctx, P, ['Los Angeles', 'San Bernardino', 'Palm Springs', 'San Diego'], 42);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 580, 0.6);
  bigNum(ctx, u, 'M7.8', 300, 0.2, { size: 150, color: '#ffd25a', out: 2.4 });
  say(ctx, u, ['The fault unzips', 'for 300 km'], 230, 2.5, { size: 92, out: OUT('unzip') });
  if (u > 1.0) { scrimB(ctx, 1560, 0.55); say(ctx, u, ['at ~10,000 km/h'], 1760, 1.0, { size: 56, weight: 900, x: W / 2, align: 'center', out: OUT('unzip') }); }
}

// ================================================================ 5. the ground lurches sideways
function vOffset(ctx, u) {
  const jolt = easeOut(R2((u - 0.6) / 0.35)) * 260, [sx, sy] = shakeOffset(u, 0.6, 2.4, 30);
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#f0e8c8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#c8a870'; ctx.fillRect(0, 900, W, H);
  // the fault line runs diagonally; everything on the far side shifts
  const fx = y => 300 + (y - 900) * 0.45;
  const side = (fn, off) => { ctx.save(); ctx.beginPath(); if (off) { ctx.moveTo(fx(900), 900); ctx.lineTo(W + 400, 900); ctx.lineTo(W + 400, H); ctx.lineTo(fx(H), H); }
    else { ctx.moveTo(-400, 900); ctx.lineTo(fx(900), 900); ctx.lineTo(fx(H), H); ctx.lineTo(-400, H); } ctx.closePath(); ctx.clip(); ctx.translate(off ? jolt * 0.9 : 0, off ? -jolt * 0.2 : 0); fn(); ctx.restore(); };
  const scene = () => { ctx.fillStyle = '#3a3a44'; ctx.beginPath(); ctx.moveTo(-200, 1500); ctx.lineTo(W + 200, 1260); ctx.lineTo(W + 200, 1420); ctx.lineTo(-200, 1700); ctx.fill();
    ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 8; ctx.setLineDash([40, 30]); ctx.beginPath(); ctx.moveTo(-200, 1600); ctx.lineTo(W + 200, 1340); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#8a5a3a'; ctx.lineWidth = 8; for (let i = 0; i < 12; i++) { const x = -100 + i * 110; ctx.beginPath(); ctx.moveTo(x, 1180 - i * 18); ctx.lineTo(x, 1260 - i * 18); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-100, 1200); ctx.lineTo(W + 100, 1000); ctx.stroke();
    const r = rng(3); for (let i = 0; i < 9; i++) { const x = r() * W, y = 1720 + r() * 160; ctx.fillStyle = '#7a9a4a'; ctx.beginPath(); ctx.arc(x, y, 30 + r() * 20, 0, 6.283); ctx.fill(); } };
  side(scene, false); side(scene, true);
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(fx(900), 900); for (let y = 900; y <= H; y += 40) ctx.lineTo(fx(y) + Math.sin(y * 0.05) * 8, y); ctx.stroke();
  if (u > 0.6) { const r = rng(9); for (let i = 0; i < 30; i++) { const dt = u - 0.6, y = 900 + r() * 1000, x = fx(y); ctx.fillStyle = `rgba(160,130,90,${0.7 * R2(1 - dt / 2)})`; ctx.beginPath(); ctx.arc(x + (r() - 0.5) * 60, y - dt * 200 * r(), 20 + r() * 30, 0, 6.283); ctx.fill(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['The ground lurches', 'meters sideways'], 230, 0.15, { size: 88, out: OUT('offset') });
  scrimB(ctx, 1560, 0.55); say(ctx, u, ['In 1906: up to 6 m'], 1760, 1.4, { size: 56, weight: 900, x: W / 2, align: 'center', out: OUT('offset') });
}

// ================================================================ 6. Los Angeles shakes
function vCity(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0, 5.4, 26 * (1 - prog(u, 3.5, 5.4) * 0.6));
  bgSky(ctx, ['#ffb98a', '#ffd6a8', '#ffe8c8']); ctx.translate(sx, sy);
  const collapse = x => (Math.floor(x / 97) % 3 === 0 ? 1.4 + (x / W) * 1.6 : 1e9);
  cityLayer(ctx, u, { base: 1150, seed: 31, hMin: 120, hMax: 420, wMin: 50, wMax: 120, gap: 8, col: '#c8907a', win: 'rgba(255,245,220,0.6)', winP: 0.4, ws: 6 });
  cityLayer(ctx, u, { base: 1330, seed: 32, hMin: 220, hMax: 720, wMin: 90, wMax: 170, gap: 16, col: '#a8706a', win: 'rgba(255,245,220,0.7)', winP: 0.45, ws: 9, hit: collapse, dir: (u % 2) > 1 ? 1 : -1 });
  // freeway overpass that gives way
  const fall = easeIn2(R2((u - 3.0) / 0.6));
  ctx.fillStyle = '#9a9aa4'; ctx.fillRect(0, 1420, 380, 50); ctx.fillRect(700, 1420, W - 700, 50);
  ctx.save(); ctx.translate(380, 1420); ctx.rotate(fall * 0.35); ctx.fillRect(0, 0, 330, 50); ctx.restore();
  for (const x of [120, 300, 760, 950]) ctx.fillRect(x, 1470, 36, 160);
  ctx.fillStyle = '#7a6a64'; ctx.fillRect(-40, 1630, W + 80, H);
  if (u > 3.0) { const r = rng(4); for (let i = 0; i < 24; i++) { const dt = u - 3.0; ctx.fillStyle = `rgba(200,180,160,${0.6 * R2(1 - dt / 2.4)})`; ctx.beginPath(); ctx.arc(520 + (r() - 0.5) * 400, 1600 - dt * 150 * r(), 40 + r() * 50, 0, 6.283); ctx.fill(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Up to 2 minutes', 'of shaking'], 230, 0.15, { size: 92, out: 2.6 });
  say(ctx, u, ['Old buildings and', 'freeway bridges give way'], 230, 2.7, { size: 76, out: OUT('city') });
}

// ================================================================ 7. fires, and no water to fight them
function vFires(ctx, u) {
  bgSky(ctx, ['#1a0e1a', '#4a1a1a', '#8a3a1e']);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1200);
  cityLayer(ctx, u, { base: 1250, seed: 41, hMin: 100, hMax: 460, wMin: 40, wMax: 110, gap: 6, col: '#2a1a24', win: 'rgba(255,170,90,0.5)', winP: 0.3, ws: 6, fires: 0.4 });
  const r = rng(42); const n = Math.floor(30 * easeOut(prog(u, 0.2, 3.4)));
  for (let i = 0; i < n; i++) { const x = r() * W, y = 1000 + r() * 260, s = 0.6 + r();
    glow(ctx, x, y, 120 * s, '255,140,40', 0.7); for (let k = 0; k < 5; k++) { ctx.fillStyle = `rgba(50,30,34,${0.35 - k * 0.06})`; ctx.beginPath(); ctx.arc(x + Math.sin(u + k + i) * 20, y - 60 - k * 70 * s, 40 * s + k * 14, 0, 6.283); ctx.fill(); } }
  ctx.fillStyle = '#24161c'; ctx.fillRect(0, 1250, W, H);
  // broken water main: a hydrant with no water, a cracked pipe
  ctx.fillStyle = '#e63946'; roundRect(ctx, 760, 1560, 70, 130, 20); ctx.fill(); ctx.fillRect(740, 1600, 110, 26);
  ctx.fillStyle = '#5a6a7a'; ctx.fillRect(0, 1760, 420, 40); ctx.fillRect(470, 1770, 610, 40);
  const drip = (u * 1.5) % 1; ctx.fillStyle = 'rgba(120,190,255,0.9)'; ctx.beginPath(); ctx.ellipse(445, 1790 + drip * 60, 8, 12, 0, 0, 6.283); ctx.fill();
  person2(ctx, 600, 1820, 300, { seed: 6, t: u });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then: 1,600 fires.', 'And the water mains', 'are broken.'], 230, 0.15, { size: 80, out: OUT('fires') });
}

// ================================================================ 8. lifelines cut where they cross the fault
function vLife(ctx, u) {
  const { P } = caMap(ctx, { lon0: -118.2, lat0: 34.6, k: 380, cy: 1150, t: u });
  const cut = R2((u - 1.0) / 0.4);
  const lines = [[[-119.3, 36.2], [-118.6, 34.6], [-118.3, 34.1]], [[-117.3, 35.6], [-117.6, 34.4], [-118.1, 34.1]], [[-115.8, 34.3], [-117.0, 34.0], [-118.0, 34.0]], [[-119.0, 35.4], [-118.9, 34.9], [-118.5, 34.3]]];
  const cols = ['#4cc9f0', '#ffbe0b', '#7dffb0', '#ff7ab6'], names = ['WATER', 'POWER', 'GAS', 'I-5'];
  lines.forEach((pts, i) => { const sp = pts.map(p => P(...p)); ctx.strokeStyle = cols[i]; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...sp[0]); ctx.lineTo(...sp[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sp[1][0] + cut * 40, sp[1][1] + cut * 30); ctx.lineTo(sp[2][0] + cut * 40, sp[2][1] + cut * 30); ctx.stroke();
    if (cut > 0 && u < 2.2) glow(ctx, sp[1][0], sp[1][1], 100, '255,240,180', 0.8 * (1 - (u - 1.0) / 1.2));
    ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 10; ctx.fillText(names[i], sp[0][0], sp[0][1] - 22); ctx.shadowBlur = 0; });
  cityDots(ctx, P, ['Los Angeles'], 44);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 580, 0.6);
  say(ctx, u, ['Water, power, gas and', 'highways into LA', 'all cross the fault'], 230, 0.15, { size: 72, out: 2.7 });
  say(ctx, u, ['Some places go without', 'water for months'], 230, 2.8, { size: 76, out: OUT('life') });
}

// ================================================================ 9. the toll (USGS ShakeOut estimates)
function vToll(ctx, u) {
  bgSky(ctx, ['#2a2440', '#3a3050', '#4a3a5a']);
  const rows = [['Killed', 1800, '#ffffff', ''], ['Injured', 50000, '#ffd25a', ''], ['Damage', 200, '#7dffb0', 'B']];
  rows.forEach(([label, v, col, unit], i) => { const at = 0.4 + i * 0.7; if (u < at) return; const k = easeOut(prog(u, at, at + 1.0)), y = 760 + i * 300;
    ctx.save(); ctx.globalAlpha = R2((u - at) / 0.3); ctx.font = `800 46px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText(label, W / 2, y - 90);
    ctx.font = `900 120px ${FONT}`; ctx.fillStyle = col; ctx.fillText(unit ? `$${Math.round(v * k)} billion` : `~${Math.round(v * k).toLocaleString('en-US')}`, W / 2, y + 30); ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The toll (USGS est.)'], 230, 0.15, { size: 88, out: OUT('toll') });
  say(ctx, u, ['1906 San Francisco: ~3,000 dead'], 1700, 2.6, { size: 46, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 10. myth-busting: sideways, not into the sea
function vMyth(ctx, u) {
  const { P } = caMap(ctx, { lon0: -119.8, lat0: 36.0, k: 150, cy: 1200, t: u });
  const k = easeInOut(prog(u, 2.4, 5.2)), [lx, ly] = P(-118.24, 34.05), [fx, fy] = P(-122.42, 37.77);
  const x = lerp(lx, fx + 60, k), y = lerp(ly, fy + 40, k);
  const [x2, y2] = P(-122.42, 37.77); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x2, y2, 14, 0, 6.283); ctx.fill();
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fillText('San Francisco', x2 + 24, y2 - 16);
  glow(ctx, x, y, 60, '255,210,90', 0.8); ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.arc(x, y, 16, 0, 6.283); ctx.fill(); ctx.textAlign = 'left'; ctx.fillStyle = '#ffd25a'; ctx.fillText('Los Angeles', x + 26, y + 14); ctx.shadowBlur = 0;
  if (u > 2.4) { ctx.strokeStyle = 'rgba(255,210,90,0.6)'; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Will California fall', 'into the ocean? No.'], 230, 0.15, { size: 80, out: 2.3 });
  say(ctx, u, ['In ~15 million years, LA', 'slides up next to San Francisco'], 230, 2.4, { size: 64, out: OUT('myth') });
  scrimB(ctx, 1560, 0.6); say(ctx, u, ['Chance of an M6.7+ in California', 'in the next 30 years: over 99%'], 1700, 3.4, { size: 46, weight: 800, out: OUT('myth') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -118 + u * 4, lat0: 35, t: u, ink: false });
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
