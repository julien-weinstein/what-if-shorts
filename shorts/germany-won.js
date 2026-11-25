// What if Germany won World War 2?
//
// TONE: dramatic but respectful. No swastikas or Nazi insignia (YouTube restricts them); the Reich is a plain
// dark-red overlay. The Holocaust beat is a memorial (candles stay lit), never animated as killing.
// Point of divergence (plausible, both real near-misses): Britain seeks terms in 1940 and Moscow falls in 1941.
//
// FACTS (checked):
//  - May 25-28, 1940: Britain's War Cabinet debated Lord Halifax's proposal to explore peace terms via Mussolini.
//  - Early Dec 1941: German units got within ~30 km of Moscow.
//  - Barbarossa's goal: the "A-A line" (Arkhangelsk-Astrakhan), i.e. Europe to roughly the Urals.
//  - Wannsee Conference (Jan 20, 1942): the Nazis' list counted ~11 million Jews in Europe, incl. Britain and Ireland.
//    In our timeline ~6 million were murdered.
//  - Generalplan Ost: removal (deportation or death) of ~30-45 million people from Eastern Europe over 25-30 years.
//    Hunger Plan (May 1941): planners expected "umpteen millions" to starve; historians estimate ~30 million.
//  - "Germania": Hitler and Speer's planned Volkshalle dome ~290 m tall (about twice the Great Pyramid's 146 m);
//    the "Breitspurbahn", a planned railway with 3 m gauge.
//  - V-2 test MW 18014 reached ~176 km on 20 June 1944: the first human-made object in space.
//  - The Manhattan Project began from fear of a German bomb (Einstein-Szilard letter, 1939). Trinity: 16 July 1945.
//  - WWII killed ~70-85 million people.
//  - Later decades (speculative, by analogy): Hitler (b. 1889) would be in his 80s by the 1970s -> succession struggle;
//    occupied nations resisting like Poland's Solidarity (1980); a censored national internet like China's Great Firewall;
//    totalitarian empires either collapse (USSR, 1991) or endure in isolation (North Korea, whose night-time satellite
//    image is almost entirely dark).
// PLOT HOLES: Could Germany really win? Historians mostly say no (resources, the US); hence the explicit divergence.
//  Would the US keep fighting? Germany declared war on the US in Dec 1941, and the bomb was built for Germany.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['close', 5.0, [[0.2, 'rumble:4.6'], [2.6, 'boom']]],
  ['map', 5.0, [[0.2, 'rumble:4.6'], [1.0, 'boom']]],
  ['holo', 5.5, [[0.2, 'swell:5']]],
  ['east', 5.5, [[0.2, 'rumble:5.2'], [2.8, 'boom']]],
  ['germania', 5.0, [[0.2, 'rumble:4.6'], [2.6, 'roar:2.2']]],
  ['rocket', 4.5, [[0.4, 'roar:3.6'], [0.5, 'boom']]],
  ['bomb', 5.0, [[0.2, 'swell:2.4'], [2.6, 'impact'], [2.65, 'boom'], [2.7, 'rumble:2.2']]],
  ['cold', 5.0, [[0.2, 'heart:4.6']]],
  ['decades', 6.5, [[0.2, 'rumble:6'], [0.6, 'impact'], [2.4, 'impact'], [4.2, 'impact']]],
  ['today', 5.5, [[0.2, 'swell:5']]],
  ['final', 5.5, [[0.2, 'swell:5']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if Germany won World War 2?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 66, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, close: vClose, map: vMap, holo: vHolo, east: vEast, germania: vGermania, rocket: vRocket, bomb: vBomb,
              cold: vCold, decades: vDecades, today: vToday, final: vFinal, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const REICH = '122,31,43';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}
function sparkle(ctx, x, y, s, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#ffffff'; ctx.beginPath();
  ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); ctx.restore(); }

// ================================================================ the Reich on a globe (Atlantic to the Urals; excludes UK, Iberia, Sweden, Switzerland)
const REICH_POLY = [[-4.5, 48.4], [-1.2, 44.8], [-1.8, 43.3], [3.2, 42.4], [7.5, 43.8], [6.9, 45.9], [10.5, 46.8], [12.4, 44.2], [15.6, 40.0], [18.5, 40.1], [16, 38],
  [20.5, 39.6], [21.5, 37.0], [23.0, 36.4], [26.2, 40.9], [28.0, 43.8], [33.5, 44.5], [36.6, 45.2], [40.0, 43.4], [47.5, 45.5], [48.0, 46.4], [53.0, 50.5], [58.0, 52.0],
  [60.5, 56.5], [60.0, 61.5], [55.0, 64.5], [40.5, 64.6], [36.0, 66.9], [33.0, 69.2], [29.8, 69.8], [24.2, 65.8], [21.5, 63.5], [21.0, 60.5], [19.6, 59.6], [18.6, 56.5],
  [14.6, 55.0], [12.6, 55.6], [10.5, 57.7], [8.1, 56.9], [8.6, 53.6], [4.8, 52.9], [1.8, 51.0], [-1.6, 49.7]];
function reichGlobe(ctx, cx, cy, R, o = {}) {
  const { lon0 = 25, lat0 = 45, t = 0, reveal = 1, alpha = 0.62, sun = [0, -0.2, 1] } = o, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t, ink: false, sun, clouds: 0.3 });
  if (reveal <= 0) return;
  const [bx, by] = v(13.4, 52.5), B = [cx + bx * R, cy + by * R];
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  ctx.beginPath(); ctx.arc(B[0], B[1], reveal * R * 2.2, 0, 6.283); ctx.clip();
  ctx.beginPath(); REICH_POLY.forEach(([lo, la], i) => { const [x, y] = v(lo, la); i ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); }); ctx.closePath();
  ctx.fillStyle = `rgba(${REICH},${alpha})`; ctx.fill(); ctx.strokeStyle = 'rgba(255,120,120,0.85)'; ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 30; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  return v;
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1200);
  reichGlobe(ctx, W / 2, 1220, 470, { lon0: 20 + u * 2, lat0: 45, t: u, reveal: easeInOut(prog(u, 0.6, 3.2)) });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1720, u > 1.3 ? 'shock' : 'worried', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if Germany', 'won World War 2?'], 300, 0.15, { size: 100, out: OUT('hook'), mark: { line: 1, from: 0, to: 3, color: '#b02a3a' } });
}

// ================================================================ 2. how close it came: Moscow, Dec 1941
function onion(ctx, x, base, s, col) {
  ctx.fillStyle = col; ctx.fillRect(x - 22 * s, base - 160 * s, 44 * s, 160 * s);
  ctx.beginPath(); ctx.moveTo(x - 34 * s, base - 160 * s); ctx.bezierCurveTo(x - 50 * s, base - 210 * s, x - 6 * s, base - 230 * s, x, base - 260 * s);
  ctx.bezierCurveTo(x + 6 * s, base - 230 * s, x + 50 * s, base - 210 * s, x + 34 * s, base - 160 * s); ctx.fill(); ctx.fillRect(x - 2 * s, base - 300 * s, 4 * s, 44 * s);
}
function tank(ctx, x, y, s, col = '#1a1c26') { ctx.fillStyle = col; roundRect(ctx, x - 90 * s, y - 40 * s, 180 * s, 40 * s, 18 * s); ctx.fill(); roundRect(ctx, x - 50 * s, y - 72 * s, 100 * s, 36 * s, 10 * s); ctx.fill(); ctx.fillRect(x + 40 * s, y - 62 * s, 110 * s, 10 * s); }
function vClose(ctx, u) {
  bgSky(ctx, ['#1a2240', '#3a4670', '#7a86a8']);
  drift(ctx, u, 0, 5, 1.0, 1.06, W / 2, 1200);
  // searchlights
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { const a = -1.6 + Math.sin(u * 0.7 + i * 2) * 0.35, x0 = 300 + i * 260; ctx.fillStyle = 'rgba(200,220,255,0.08)';
    ctx.beginPath(); ctx.moveTo(x0, 1100); ctx.lineTo(x0 + Math.cos(a - 0.05) * 1400, 1100 + Math.sin(a - 0.05) * 1400); ctx.lineTo(x0 + Math.cos(a + 0.05) * 1400, 1100 + Math.sin(a + 0.05) * 1400); ctx.fill(); }
  ctx.restore();
  // Moscow skyline far off
  ctx.fillStyle = '#2a3254'; ctx.fillRect(0, 1060, W, 60);
  [[180, 0.8], [300, 1.1], [420, 0.9], [560, 1.3], [700, 1.0], [840, 0.85]].forEach(([x, s]) => onion(ctx, x, 1100, s * 0.9, '#2a3254'));
  ctx.fillStyle = '#e8eef8'; ctx.fillRect(0, 1100, W, H);
  ctx.fillStyle = 'rgba(160,175,200,0.4)'; for (let i = 0; i < 6; i++) ctx.fillRect(0, 1180 + i * 120, W, 6);
  // tanks halted in the snow, close to the camera
  [[200, 1500, 1.4], [620, 1620, 1.9], [980, 1440, 1.1]].forEach(([x, y, s]) => tank(ctx, x, y, s));
  // distance marker
  if (u > 1.0) { const k = easeOut(R2((u - 1.0) / 0.8)); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.setLineDash([16, 12]);
    ctx.beginPath(); ctx.moveTo(620, 1500); ctx.lineTo(lerp(620, 560, k), lerp(1500, 1110, k)); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; ctx.globalAlpha = k; ctx.fillText('~30 km', 640, 1320); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
  // snow
  const r = rng(5); ctx.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 240; i++) { const x = (r() * W + Math.sin(u + i) * 30) % W, y = (r() * H + u * (60 + r() * 120)) % H; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 3, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['It came closer', 'than you think'], 230, 0.15, { size: 92, out: 2.3 });
  say(ctx, u, ['Dec 1941: German tanks', 'reach the edge of Moscow'], 230, 2.4, { size: 72, out: OUT('close') });
  say(ctx, u, ['A year earlier, Britain’s cabinet', 'had debated asking for peace'], 1720, 3.0, { size: 44, weight: 800, out: OUT('close') });
}

// ================================================================ 3. Moscow falls, Britain makes peace: Atlantic to the Urals
function vMap(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1150);
  reichGlobe(ctx, W / 2, 1150, 560, { lon0: lerp(10, 30, easeInOut(prog(u, 0, 5))), lat0: 50, t: u, reveal: easeInOut(prog(u, 0.6, 3.6)), alpha: 0.7 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Now say Moscow falls,', 'and Britain makes peace'], 230, 0.15, { size: 76, out: 2.5 });
  say(ctx, u, ['The Reich stretches from', 'the Atlantic to the Urals'], 230, 2.6, { size: 76, out: OUT('map'), mark: { line: 1, from: 4, to: 12, color: '#b02a3a' } });
}

// ================================================================ 4. the Holocaust does not stop (memorial)
function candle(ctx, x, y, s, t, seed) {
  ctx.fillStyle = '#f1ece0'; roundRect(ctx, x - 7 * s, y - 40 * s, 14 * s, 40 * s, 3 * s); ctx.fill();
  const fl = 1 + Math.sin(t * 9 + seed * 3.1) * 0.12 + Math.sin(t * 13 + seed) * 0.06;
  glow(ctx, x, y - 52 * s, 30 * s, '255,200,120', 0.55);
  ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.ellipse(x, y - 52 * s * fl, 6 * s, 12 * s * fl, Math.sin(t * 3 + seed) * 0.1, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.ellipse(x, y - 49 * s, 3 * s, 6 * s, 0, 0, 6.283); ctx.fill();
}
function vHolo(ctx, u) {
  bgSky(ctx, ['#0e1020', '#171a30', '#1f2340']);
  const cols = 11, rows = 10, n = Math.floor(cols * rows * R2(prog(u, 0.3, 3.0)));
  for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols), x = 90 + c * 90 + (r % 2) * 20, y = 760 + r * 95; candle(ctx, x, y, 1.0, u, i); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The Holocaust', 'doesn’t stop'], 230, 0.15, { size: 92, out: OUT('holo') });
  say(ctx, u, ['The Nazis’ own list counted', '11 million Jews in Europe'], 1720, 1.0, { size: 52, weight: 800, out: OUT('holo') });
  if (u > 3.4) say(ctx, u, ['each candle = 100,000 people'], 470, 3.4, { size: 40, weight: 700, out: OUT('holo'), color: 'rgba(255,255,255,0.75)' });
}

// ================================================================ 5. the plan for the East
const EAST = [['Warsaw', 21.0, 52.2], ['Minsk', 27.6, 53.9], ['Kyiv', 30.5, 50.45], ['Leningrad', 30.3, 59.9], ['Moscow', 37.6, 55.8], ['Odesa', 30.7, 46.5]];
function vEast(ctx, u) {
  space(ctx, u);
  const R = 900, cx = W / 2, cy = 1250, lon0 = 30, lat0 = 53;
  const v = reichGlobe(ctx, cx, cy, R, { lon0, lat0, t: u, reveal: 1, alpha: 0.45 });
  EAST.forEach(([name, lon, lat], i) => { const [x, y, z] = v(lon, lat); if (z < 0.1) return; const sx = cx + x * R, sy = cy + y * R, dim = R2((u - 1.4 - i * 0.15) / 1.2);
    glow(ctx, sx, sy, 60 * (1 - dim * 0.85), '255,225,170', 0.7 * (1 - dim * 0.8)); ctx.fillStyle = `rgba(255,246,224,${1 - dim * 0.7})`; ctx.beginPath(); ctx.arc(sx, sy, 9, 0, 6.283); ctx.fill();
    ctx.font = `900 38px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = `rgba(255,255,255,${0.95 - dim * 0.5})`; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fillText(name, sx, sy - 24); ctx.shadowBlur = 0; });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Then the plan', 'for the East'], 230, 0.15, { size: 92, out: OUT('east') });
  scrimB(ctx, 1440, 0.75);
  say(ctx, u, ['Generalplan Ost: remove', '30–45 million people'], 1580, 1.0, { size: 58, weight: 900, out: OUT('east'), mark: { line: 1, from: 0, to: 13, color: '#b02a3a' } });
  say(ctx, u, ['The Hunger Plan: ~30 million to starve (est.)'], 1760, 2.6, { size: 40, weight: 800, out: OUT('east') });
}

// ================================================================ 6. Germania
function vGermania(ctx, u) {
  bgSky(ctx, ['#2a2440', '#8a5a5a', '#e8a070']);
  drift(ctx, u, 0, 5, 1.08, 1.0, W / 2, 1300);
  const base = 1450, cx = W / 2;
  glow(ctx, cx, 600, 500, '255,200,150', 0.25);
  ctx.fillStyle = '#7a7480'; ctx.fillRect(cx - 420, base - 300, 840, 300);
  ctx.fillStyle = '#6a6470'; for (let i = 0; i < 14; i++) ctx.fillRect(cx - 400 + i * 60, base - 290, 22, 290);
  ctx.fillStyle = '#8a8490'; ctx.beginPath(); ctx.ellipse(cx, base - 300, 400, 560, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = 'rgba(255,220,180,0.18)'; ctx.beginPath(); ctx.ellipse(cx - 120, base - 420, 140, 360, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#6a6470'; ctx.fillRect(cx - 40, base - 920, 80, 70);
  // scale references at the dome's foot
  ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.moveTo(90, base); ctx.lineTo(160, base - 70); ctx.lineTo(230, base); ctx.fill();
  ctx.fillStyle = '#b0a080'; ctx.fillRect(820, base - 34, 90, 34); for (let i = 0; i < 5; i++) { ctx.fillStyle = '#8a7a60'; ctx.fillRect(824 + i * 18, base - 30, 8, 30); }
  ctx.font = `800 24px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('Great Pyramid', 160, base + 34); ctx.fillText('Brandenburg Gate', 865, base + 34);
  ctx.fillStyle = '#3a3440'; ctx.fillRect(0, base, W, H);
  // the 3-metre-gauge train
  const tx = lerp(W + 200, -1800, easeInOut(prog(u, 1.8, 4.8)));
  for (let k = 0; k < 6; k++) { const x = tx + k * 330; ctx.fillStyle = k === 0 ? '#5a2a30' : '#6a3a40'; roundRect(ctx, x, 1560, 320, 180, 20); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,170,0.8)'; for (let w = 0; w < 5; w++) { ctx.fillRect(x + 20 + w * 60, 1590, 40, 34); ctx.fillRect(x + 20 + w * 60, 1660, 40, 34); }
    ctx.fillStyle = '#1a1820'; ctx.beginPath(); ctx.arc(x + 70, 1748, 22, 0, 6.283); ctx.arc(x + 250, 1748, 22, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#9a96a0'; ctx.fillRect(0, 1768, W, 8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['Berlin becomes “Germania”:', 'a dome 290 m tall'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['and trains on tracks', '3 meters wide'], 230, 2.5, { size: 80, out: OUT('germania') });
}

// ================================================================ 7. rockets already reached space
function vRocket(ctx, u) {
  const k = easeIn2(prog(u, 0.4, 4.2)), alt = Math.round(176 * k);
  const sk = R2(k * 1.3); bgSky(ctx, [mixHex('#7fc8ff', '#070a1c', sk), mixHex('#b8e2ff', '#101640', sk), mixHex('#e6f6ff', '#1a2050', sk)]);
  if (sk > 0.4) { ctx.save(); ctx.globalAlpha = (sk - 0.4) / 0.6; stars(ctx, u, 1); ctx.restore(); }
  const ground = lerp(1700, 4200, k); ctx.fillStyle = '#6a8a5a'; ctx.fillRect(0, ground, W, H);
  const rx = W / 2, ry = lerp(1640, 1000, R2(k * 4));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i++) { const f = i / 26; glow(ctx, rx + Math.sin(u * 20 + i) * 6, ry + 90 + f * 260, 40 * (1 - f) + 10, '255,190,90', 0.5 * (1 - f)); }
  ctx.restore();
  ctx.save(); ctx.translate(rx, ry);
  ctx.fillStyle = '#f2f2ee'; ctx.beginPath(); ctx.moveTo(0, -150); ctx.bezierCurveTo(30, -110, 34, -40, 30, 80); ctx.lineTo(-30, 80); ctx.bezierCurveTo(-34, -40, -30, -110, 0, -150); ctx.fill();
  ctx.fillStyle = '#1b1b24'; ctx.fillRect(-30, -40, 30, 40); ctx.fillRect(0, 0, 30, 40); ctx.fillRect(0, -100, 20, 30);
  ctx.beginPath(); ctx.moveTo(-30, 50); ctx.lineTo(-66, 100); ctx.lineTo(-30, 90); ctx.fill(); ctx.beginPath(); ctx.moveTo(30, 50); ctx.lineTo(66, 100); ctx.lineTo(30, 90); ctx.fill();
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Their rockets had', 'already reached space'], 230, 0.15, { size: 84, out: OUT('rocket') });
  bigNum(ctx, u, `${alt} km`, 1640, 0.5, { size: 110, color: '#ffffff', out: OUT('rocket') });
  say(ctx, u, ['V-2 test flight, June 1944'], 1760, 0.8, { size: 44, weight: 800, x: W / 2, align: 'center', out: OUT('rocket') });
}

// ================================================================ 8. the bomb was built to beat Hitler
function vBomb(ctx, u) {
  const hit = 2.6, dt = u - hit;
  bgSky(ctx, ['#1a2a5a', '#5a6aa0', '#c8a890']);
  if (dt > 0) { ctx.fillStyle = `rgba(255,230,200,${0.5 * Math.exp(-dt * 1.2)})`; ctx.fillRect(0, 0, W, H); }
  const [sx, sy] = shakeOffset(u, hit, 2, 18); ctx.translate(sx, sy);
  if (dt > 0) { const g = easeOut(R2(dt / 2.2)), cx = W / 2, top = lerp(1300, 560, g), capR = lerp(60, 330, g);
    ctx.fillStyle = mixHex('#fff2c8', '#c88a6a', R2(dt / 1.5)); roundRect(ctx, cx - capR * 0.22, top, capR * 0.44, 1400 - top, capR * 0.2); ctx.fill();
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + dt * 0.3, rr = capR * (0.55 + 0.25 * Math.sin(i * 2.3)); ctx.fillStyle = mixHex('#ffe0a0', '#b0705a', R2(dt / 1.8 + (i % 3) * 0.1));
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * capR * 0.6, top + Math.sin(a) * capR * 0.35, rr, 0, 6.283); ctx.fill(); }
    glow(ctx, cx, top, capR * 1.6, '255,220,160', 0.6 * Math.exp(-dt * 0.8));
    ctx.strokeStyle = `rgba(255,255,255,${0.6 * R2(1 - dt / 1.2)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(cx, 1400, dt * 900, dt * 160, 0, 0, 6.283); ctx.stroke(); }
  cityLayer(ctx, u, { base: 1420, seed: 31, hMin: 80, hMax: 300, wMin: 40, wMax: 110, gap: 6, col: '#2a2638', win: 'rgba(255,220,170,0.5)', winP: 0.3, ws: 6 });
  ctx.fillStyle = '#1e1a28'; ctx.fillRect(-40, 1420, W + 80, H);
  flash(ctx, u, hit, 0.6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['But America is building', 'a new weapon, to beat Hitler'], 230, 0.15, { size: 72, out: 2.5 });
  say(ctx, u, ['1945: the first atomic', 'bomb falls on… Germany?'], 230, 2.75, { size: 76, out: OUT('bomb'), mark: { line: 1, from: 13, to: 24, color: '#b02a3a' } });
}

// ================================================================ 9. a cold war across the Atlantic
function vCold(ctx, u) {
  space(ctx, u);
  const R = 560, cx = W / 2, cy = 1150, lon0 = -30, lat0 = 40;
  const v = reichGlobe(ctx, cx, cy, R, { lon0, lat0, t: u, reveal: 1, alpha: 0.65 });
  const P = (lo, la) => { const [x, y] = v(lo, la); return [cx + x * R, cy + y * R]; };
  const pairs = [[[-77, 38.9], [13.4, 52.5]], [[13.4, 52.5], [-74, 40.7]], [[-87.6, 41.9], [2.35, 48.9]], [[30.5, 50.4], [-71, 42.4]]];
  pairs.forEach(([a, b], i) => { const at = 0.4 + i * 0.6, f = easeInOut(R2((u - at) / 1.6)); if (f <= 0) return;
    const A = P(...a), Bp = P(...b), mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2 - 380;
    ctx.strokeStyle = i % 2 ? 'rgba(255,120,120,0.9)' : 'rgba(140,200,255,0.9)'; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(...A);
    for (let s = 1; s <= 30; s++) { const q = s / 30 * f; ctx.lineTo((1 - q) ** 2 * A[0] + 2 * (1 - q) * q * mx + q * q * Bp[0], (1 - q) ** 2 * A[1] + 2 * (1 - q) * q * my + q * q * Bp[1]); }
    ctx.stroke(); ctx.setLineDash([]); });
  for (const p of [[-77, 38.9], [13.4, 52.5]]) { const [x, y] = P(...p); glow(ctx, x, y, 50, '255,255,255', 0.5 + 0.3 * Math.sin(u * 4)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Or worse: a cold war', 'across the Atlantic'], 230, 0.15, { size: 80, out: 2.6 });
  say(ctx, u, ['with nuclear weapons', 'on both sides'], 230, 2.7, { size: 80, out: OUT('cold') });
}

// ================================================================ 10a. the decades (speculative)
const DECADES = [['1970s', 'Hitler dies. A brutal', 'fight over who rules next.', '#b02a3a'], ['1980s', 'Uprisings across occupied', 'Europe, like Poland’s Solidarity', '#ffbe0b'],
  ['1990s', 'Two internets: one open,', 'one censored', '#4cc9f0']];
function vDecades(ctx, u) {
  bgSky(ctx, ['#141a3a', '#232a5a', '#33407a']);
  const x0 = 120, y0 = 560, y1 = 1780, f = easeInOut(prog(u, 0, 5.2));
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, lerp(y0, y1, f)); ctx.stroke();
  DECADES.forEach(([yr, a, b, col], i) => { const at = 0.5 + i * 1.8, k = easeBack(R2((u - at) / 0.45)); if (k <= 0) return; const y = y0 + 120 + i * 400;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0, y, 28 * k, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.stroke();
    ctx.save(); ctx.translate(x0 + 70, y); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(255,255,255,0.96)'; roundRect(ctx, 0, -120, 830, 240, 30); ctx.fill(); ctx.fillStyle = col; roundRect(ctx, 0, -120, 22, 240, 11); ctx.fill();
    ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = col === '#ffbe0b' ? '#b07a00' : col; ctx.fillText(yr, 50, -42);
    ctx.font = `800 40px ${FONT}`; ctx.fillStyle = '#1b1b2e'; ctx.fillText(a, 50, 20); ctx.fillText(b, 50, 70);
    // small icon per decade
    ctx.translate(730, -50);
    if (i === 0) { ctx.fillStyle = '#b02a3a'; ctx.beginPath(); ctx.moveTo(-40, 20); ctx.lineTo(-40, -10); ctx.lineTo(-20, 5); ctx.lineTo(0, -20); ctx.lineTo(20, 5); ctx.lineTo(40, -10); ctx.lineTo(40, 20); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6, -14); ctx.lineTo(4, 2); ctx.lineTo(-4, 8); ctx.lineTo(6, 20); ctx.stroke(); }
    else if (i === 1) { ctx.fillStyle = '#1b1b2e'; for (let q = -2; q <= 2; q++) { ctx.beginPath(); ctx.arc(q * 18, -8, 8, 0, 6.283); ctx.fill(); ctx.fillRect(q * 18 - 8, 0, 16, 26); }
      ctx.fillStyle = '#ffbe0b'; ctx.fillRect(-4, -48, 6, 40); ctx.fillRect(2, -48, 30, 18); }
    else { ctx.strokeStyle = '#4cc9f0'; ctx.lineWidth = 6; for (let q = 1; q <= 3; q++) { ctx.beginPath(); ctx.arc(0, 20, q * 14, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
      ctx.strokeStyle = '#b02a3a'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-36, -30); ctx.lineTo(36, 30); ctx.stroke(); }
    ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then the decades', 'roll on…'], 230, 0.15, { size: 92, out: OUT('decades') });
}

// ================================================================ 10b. 2026: collapse, or a continent in the dark
function inPoly(lon, lat, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j];
  if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c; } return c; }
function vToday(ctx, u) {
  space(ctx, u);
  const R = 720, cx = W / 2, cy = 1240, lon0 = lerp(-25, 12, easeInOut(prog(u, 0, 5.5))), lat0 = 47, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0.15, -0.1, -0.98], clouds: 0.15 });
  const dark = easeInOut(prog(u, 2.5, 3.6));
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  ctx.beginPath(); REICH_POLY.forEach(([lo, la], i) => { const [x, y] = v(lo, la); i ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R); }); ctx.closePath();
  ctx.fillStyle = `rgba(4,6,16,${0.92 * dark})`; ctx.fill(); ctx.strokeStyle = `rgba(255,110,110,${0.7 * dark})`; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  const extra = [['Boston', -71, 42.4, 5], ['Washington', -77, 38.9, 6], ['Chicago', -87.6, 41.9, 9], ['Toronto', -79.4, 43.7, 6], ['Montreal', -73.6, 45.5, 4], ['Dublin', -6.3, 53.3, 1.5],
    ['Lisbon', -9.1, 38.7, 3], ['Barcelona', 2.2, 41.4, 5], ['Stockholm', 18.1, 59.3, 2], ['Zurich', 8.5, 47.4, 1.4], ['Atlanta', -84.4, 33.7, 6], ['Miami', -80.2, 25.8, 6]];
  for (const [name, lon, lat, pop] of [...CITIES, ...extra]) { const [x, y, z] = v(lon, lat); if (z < 0.08) continue; const sx = cx + x * R, sy = cy + y * R;
    const inside = inPoly(lon, lat, REICH_POLY), a = inside ? (name === 'Berlin' ? 1 : 1 - dark) : 1, sz = 3 + Math.sqrt(pop) * 1.6;
    if (a <= 0.02) continue; glow(ctx, sx, sy, sz * 6, '255,214,140', 0.6 * a * z); ctx.fillStyle = `rgba(255,240,200,${a})`; ctx.beginPath(); ctx.arc(sx, sy, sz * 0.5, 0, 6.283); ctx.fill(); }
  { const [x, y, z] = v(13.4, 52.5); if (z > 0) { glow(ctx, cx + x * R, cy + y * R, 70, '255,200,120', 0.9); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['2026: maybe it collapses,', 'like the Soviet Union did'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['Or Europe at night looks', 'like North Korea'], 230, 2.5, { size: 76, out: OUT('today'), mark: { line: 1, from: 5, to: 16, color: '#b02a3a' } });
}

// ================================================================ 10. final image: remembrance poppies at dawn
function vFinal(ctx, u) {
  bgSky(ctx, ['#2a3a6a', '#c87a8a', '#ffd0a0']);
  glow(ctx, W / 2, 1150, 520, '255,220,170', 0.6);
  ctx.fillStyle = '#ffe6b0'; ctx.beginPath(); ctx.arc(W / 2, 1180, 110, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#3a5a3a'; ctx.fillRect(0, 1180, W, H);
  const r = rng(41), P = [];
  for (let i = 0; i < 260; i++) { const q = Math.pow(r(), 1.6), y = 1200 + q * 760, s = 0.3 + q * 1.4; P.push([r() * W, y, s, r()]); }
  P.sort((a, b) => a[1] - b[1]);
  for (const [x, y, s, ph] of P) { const sw = Math.sin(u * 1.5 + ph * 6) * 8 * s, k = easeBack(R2((u - ph * 1.6) / 0.6)); if (k <= 0) continue;
    ctx.strokeStyle = '#2a4a2a'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.5, y - 40 * s, x + sw, y - 80 * s * k); ctx.stroke();
    const fx = x + sw, fy = y - 80 * s * k; ctx.fillStyle = '#d62828';
    for (let p = 0; p < 4; p++) { const a = p * 1.571 + ph; ctx.beginPath(); ctx.ellipse(fx + Math.cos(a) * 12 * s, fy + Math.sin(a) * 9 * s, 16 * s * k, 12 * s * k, a, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(fx, fy, 6 * s * k, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['In our timeline,', 'the Allies stopped it.'], 230, 0.15, { size: 84, out: OUT('final') });
  say(ctx, u, ['It cost 70–85 million lives.'], 470, 1.6, { size: 56, weight: 800, out: OUT('final') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: 15 + u * 4, lat0: 40, t: u, ink: false });
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
