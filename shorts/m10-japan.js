// What if a magnitude 10 earthquake hit the Ring of Fire next to Japan?
//
// SCENARIO (real, published): Toru Matsuzawa (Tohoku University), Dec 2012, to Japan's Coordinating Committee for
// Earthquake Prediction: an M10 is theoretically possible if ~3,000 km of the Japan Trench + Kuril-Kamchatka Trench slip
// ~60 m together; "around once every 10,000 years" if it happens at all. No M10 has ever been observed. (Japan Times, 2012-12-15)
//
// PHYSICS / FACTS (worked):
//  - M0 = mu·A·D = 4e10 x (3,000 km x 200 km) x 60 m = 1.44e24 N·m -> Mw ≈ 10.0. ~5.6x the 1960 Chile M9.5 energy; ~15 Gt TNT radiated (est.).
//  - Rupture at ~2.7 km/s over 3,000 km ≈ 18 minutes. Trench polyline used on the map ≈ 2,930 km. Southern end ~250 km from Tokyo.
//  - 2011 Tohoku (M9.0): ~60 m max slip; tsunami reached the coast in ~30 min; max runup ~40 m; ~18,500 dead or missing;
//    a ~14 m wave caused three meltdowns at Fukushima Daiichi; Tokyo Bay landfill (Urayasu) liquefied and manholes floated up;
//    Tokyo high-rises swayed for minutes; the tsunami killed ~110,000 albatross chicks on Midway (USFWS est.) and wrecked
//    harbors in California ~10 h later.
//  - 1923 Great Kanto quake: ~105,000 dead, most from the fires that followed.
//  - Japan Cabinet Office (Mar 2025): worst-case Nankai Trough M9 could kill up to 298,000. An M10 here: hundreds of thousands (est., hedged).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6'], [1.3, 'rumble:2.0']]],
  ['ladder', 4.5, [[0.3, 'impact'], [2.6, 'boom']]],
  ['fault', 5.0, [[0.2, 'rumble:4.6'], [0.4, 'roar:4.2']]],
  ['tower', 4.5, [[0.1, 'rumble:4.3'], [1.2, 'impact']]],
  ['liquefy', 4.5, [[0.2, 'rumble:4.2'], [1.6, 'boom']]],
  ['fires', 4.5, [[0.2, 'roar:4.2']]],
  ['xsec', 4.5, [[0.4, 'boom'], [0.45, 'rumble:3.6']]],
  ['drawback', 4.0, [[0.2, 'drawback:3.0'], [2.6, 'swell:1.4']]],
  ['japan', 5.0, [[0.3, 'drawback:1.4'], [1.4, 'roar:3.4'], [2.4, 'boom'], [2.5, 'impact']]],
  ['nuke', 4.5, [[0.2, 'heart:4.2'], [2.0, 'roar:2.4'], [2.8, 'boom']]],
  ['birds', 4.0, [[0.6, 'roar:3.2']]],
  ['port', 4.0, [[0.2, 'roar:3.6'], [1.2, 'boom']]],
  ['toll', 4.0, [[0.2, 'heart:3.8']]],
  ['dawn', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if a magnitude 10 earthquake hit Japan?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 74, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookJ, ladder: vLadder, fault: vFault, tower: vTower, liquefy: vLiquefy, fires: vFires, xsec: vXsec, drawback: vDrawback,
              japan: vJapan, nuke: vNuke, birds: vBirds, port: vPort2, toll: vToll3, dawn: vDawn, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const TRENCH = [[142, 34.5], [143.5, 38], [144.5, 41], [146.5, 42], [150, 44.3], [154, 46.8], [157.5, 50], [160.5, 52.5], [163.5, 55.5]];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2, saturate: 1.1 });
}
function skyline(ctx, base, seed, col, sway = 0) { const r = rng(seed); let x = -20; while (x < W + 20) { const w = 50 + r() * 90, h = 200 + r() * 520;
  ctx.save(); ctx.translate(x + w / 2, base); ctx.rotate(sway * h / 700); ctx.fillStyle = col; ctx.fillRect(-w / 2, -h, w, h); ctx.fillStyle = 'rgba(255,235,190,0.55)';
  for (let yy = -h + 14; yy < -10; yy += 26) for (let xx = -w / 2 + 8; xx < w / 2 - 8; xx += 18) if (r() < 0.45) ctx.fillRect(xx, yy, 8, 12); ctx.restore(); x += w + 6; } }

// ================================================================ 1. hook: Tokyo, a normal evening
function vHookJ(ctx, u) {
  const q = 1.3, [sx, sy] = shakeOffset(u, q, 2.2, 24), sw = u > q ? Math.sin((u - q) * 4) * 0.03 * R2((u - q) * 2) : 0;
  bgSky(ctx, ['#3a5ab8', '#8a8ad8', '#ffc8a8']); ctx.translate(sx, sy);
  glow(ctx, 760, 900, 260, '255,220,180', 0.6);
  ctx.fillStyle = '#e8e4f0'; ctx.beginPath(); ctx.moveTo(620, 1000); ctx.lineTo(760, 760); ctx.lineTo(900, 1000); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(712, 842); ctx.lineTo(760, 760); ctx.lineTo(808, 842); ctx.fill();
  skyline(ctx, 1300, 3, '#5a5a9a', sw * 0.5); skyline(ctx, 1500, 4, '#3a3a7a', sw);
  ctx.fillStyle = '#2a2a5a'; ctx.fillRect(0, 1500, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.3 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  scrim(ctx, 600, 0.5);
  say(ctx, u, ['What if a magnitude 10', 'hit the Ring of Fire', 'right next to Japan?'], 260, 0.15, { size: 84, out: OUT('hook'), mark: { line: 0, from: 10, to: 22, color: '#ffd25a' } });
}

// ================================================================ 3. the one map: the real M10 scenario, unzipping
function vFault(ctx, u) {
  space(ctx, u);
  const R = 1500, cx = W / 2, cy = 1150, v = gView(150, 45);
  globe(ctx, cx, cy, R, { lon0: 150, lat0: 45, t: u, ink: false, lights: false, clouds: 0.15 });
  const P = ([lo, la]) => { const [x, y] = v(lo, la); return [cx + x * R, cy + y * R]; };
  // densify trench
  const pts = []; for (let i = 0; i < TRENCH.length - 1; i++) for (let s = 0; s < 1; s += 0.05) pts.push([lerp(TRENCH[i][0], TRENCH[i + 1][0], s), lerp(TRENCH[i][1], TRENCH[i + 1][1], s)]); pts.push(TRENCH[TRENCH.length - 1]);
  const k = easeInOut(prog(u, 0.4, 4.2)), mid = 20, a = Math.max(0, Math.round(mid - k * mid)), b = Math.min(pts.length - 1, Math.round(mid + k * (pts.length - 1 - mid)));
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.setLineDash([14, 12]); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...P(p)) : ctx.moveTo(...P(p))); ctx.stroke(); ctx.setLineDash([]);
  if (b > a) { for (const [lw, col] of [[26, 'rgba(255,200,90,0.35)'], [10, '#ffd25a']]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = a; i <= b; i++) i === a ? ctx.moveTo(...P(pts[i])) : ctx.lineTo(...P(pts[i])); ctx.stroke(); }
    if (k < 1) { glow(ctx, ...P(pts[a]), 90, '255,230,150', 0.9); glow(ctx, ...P(pts[b]), 90, '255,230,150', 0.9); } }
  for (const [n, lo, la] of [['Tokyo', 139.7, 35.7], ['Sendai', 140.9, 38.3], ['Sapporo', 141.35, 43.06], ['Petropavlovsk', 158.65, 53.0]]) { const [x, y] = P([lo, la]);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, 10, 0, 6.283); ctx.fill(); ctx.font = `800 32px ${FONT}`; ctx.textAlign = 'right'; ctx.fillText(n, x - 16, y + 10); }
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.textAlign = 'center'; ctx.fillText(`minute ${Math.round(k * 18)}`, 540, 1820);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['A real M10 scenario:', '3,000 km of trench', 'slips ~60 m'], 230, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['Maybe once in 10,000', 'years. It unzips for', '~18 minutes'], 230, 2.5, { size: 76, out: OUT('fault') });
}

// ================================================================ 4. inside a Tokyo tower: the long sway
function vTower(ctx, u) {
  const sw = Math.sin(u * 2 * Math.PI * 0.3) * R2(u * 1.5), [sx, sy] = shakeOffset(u, 0, 4.4, 8);
  ctx.translate(sx, sy);
  bgSky(ctx, ['#3a6ac8', '#8ab0e8', '#e0e8f8']);
  ctx.save(); ctx.translate(sw * 120, 0); ctx.rotate(sw * 0.02); skyline(ctx, 1500, 9, '#6a7ab0', sw * 0.03); ctx.restore();
  // window frame + room
  ctx.fillStyle = '#e8e0d4'; ctx.fillRect(0, 0, W, 300); ctx.fillRect(0, 1450, W, H); ctx.fillRect(0, 0, 60, H); ctx.fillRect(W - 60, 0, 60, H); ctx.fillRect(520, 300, 40, 1150);
  ctx.fillStyle = '#c8b8a0'; ctx.fillRect(0, 1450, W, 30);
  // ceiling lamps swinging (pendulum)
  for (const x of [270, 810]) { const a = -sw * 0.5; ctx.strokeStyle = '#6a6a72'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, 300); const lx = x + Math.sin(a) * 260, ly = 300 + Math.cos(a) * 260; ctx.lineTo(lx, ly); ctx.stroke();
    ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.moveTo(lx - 60, ly + 40); ctx.lineTo(lx + 60, ly + 40); ctx.lineTo(lx + 30, ly); ctx.lineTo(lx - 30, ly); ctx.fill(); glow(ctx, lx, ly + 50, 120, '255,230,150', 0.4); }
  // desks sliding
  for (let i = 0; i < 2; i++) { const x = 200 + i * 520 + sw * 140; ctx.fillStyle = '#8a6a4a'; ctx.fillRect(x - 160, 1580, 320, 26); ctx.fillRect(x - 150, 1606, 18, 160); ctx.fillRect(x + 132, 1606, 18, 160);
    ctx.fillStyle = '#3a3a4a'; ctx.fillRect(x - 60, 1510, 120, 70); }
  [[300, 3], [780, 6]].forEach(([x, s]) => person2(ctx, x - sw * 30, 1880, 220, { seed: s, t: u }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Tokyo, ~250 km away.', 'Towers sway for', 'minutes on end'], 230, 0.15, { size: 80, out: OUT('tower') });
}

// ================================================================ 5. Tokyo Bay landfill liquefies
function vLiquefy(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 3.8)), [sx, sy] = shakeOffset(u, 0, 4.4, 14);
  bgSky(ctx, ['#4a8ad8', '#9ac4ec', '#f0f0f4']); ctx.translate(sx, sy);
  cityLayer(ctx, u, { base: 1050, seed: 12, hMin: 120, hMax: 420, wMin: 60, wMax: 140, gap: 10, col: '#b8b0c8', win: 'rgba(80,120,180,0.5)', winP: 0.5, ws: 6 });
  ctx.fillStyle = '#9a9aa4'; ctx.fillRect(0, 1050, W, H);
  // slurry spreading
  const g = ctx.createLinearGradient(0, 1050, 0, H); g.addColorStop(0, '#9a8a6a'); g.addColorStop(1, '#7a6a50'); ctx.fillStyle = g; ctx.globalAlpha = k; ctx.fillRect(0, 1050, W, H); ctx.globalAlpha = 1;
  const r = rng(13); for (let i = 0; i < 14; i++) { const x = r() * W, y = 1150 + r() * 700, t0 = 0.6 + r() * 2, dt = u - t0; if (dt < 0) continue; const s = 0.6 + (y - 1150) / 700;
    for (let j = 0; j < 4; j++) puff(ctx, x + Math.sin(u * 3 + j) * 10, y - ((dt * 120 + j * 30) % 90) * s, (10 + j * 4) * s, '#b8a888', 0.7); }
  // manhole rising
  const mh = easeOut(R2((u - 1.4) / 2)) * 260; ctx.fillStyle = '#6a6a72'; ctx.fillRect(380, 1500 - mh, 90, mh); ctx.fillStyle = '#4a4a52'; ctx.beginPath(); ctx.ellipse(425, 1500 - mh, 45, 14, 0, 0, 6.283); ctx.fill();
  // car sinking + tilting, lamppost leaning
  ctx.save(); ctx.translate(760, 1560 + k * 70); ctx.rotate(k * 0.22); carSide(ctx, 0, 0, 1.4, '#3a86ff'); ctx.restore();
  ctx.save(); ctx.translate(180, 1400 + k * 30); ctx.rotate(-k * 0.35); ctx.fillStyle = '#5a5a62'; ctx.fillRect(-8, -420, 16, 420); ctx.fillStyle = '#ffd25a'; ctx.fillRect(-8, -430, 60, 20); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Tokyo Bay’s landfill', 'turns to quicksand'], 230, 0.15, { size: 84, out: 2.2 });
  say(ctx, u, ['Manholes pop up.', 'Cars sink.'], 230, 2.3, { size: 88, out: OUT('liquefy') });
}

// ================================================================ 6. aerial at dusk: fires spread through wooden districts
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
  say(ctx, u, ['1923: fires after a quake', 'killed most of Tokyo’s', '~105,000 dead'], 230, 0.15, { size: 74, out: 2.3 });
  say(ctx, u, ['Packed wooden districts', 'burn again (est.)'], 230, 2.4, { size: 80, out: OUT('fires') });
}

// ================================================================ 8. the sea pulls back
function vDrawback(ctx, u) {
  const k = easeInOut(prog(u, 0.2, 2.6)), shore = lerp(1250, 900, k);
  bgSky(ctx, ['#4a8ad8', '#9ac8f0', '#f0f4f8']);
  ctx.fillStyle = '#2a8ac0'; ctx.fillRect(0, 800, W, shore - 800 + 40);
  if (u > 2.4) { const a = R2((u - 2.4) / 1.2); ctx.fillStyle = `rgba(255,255,255,${0.9 * a})`; ctx.fillRect(0, 792, W, 10 + a * 18); for (let x = 0; x < W; x += 40) puff(ctx, x, 795, 10 + a * 18, '#ffffff', a); }
  ctx.fillStyle = '#8a7a5a'; ctx.fillRect(0, shore, W, 1250 - shore + 10);
  const r = rng(15); for (let i = 0; i < 12; i++) { const x = r() * W, y = shore + 20 + r() * Math.max(10, 1250 - shore - 40); if (y > 1240) continue; ctx.fillStyle = '#c8d0d8'; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(u * 8 + i) * 0.4); ctx.beginPath(); ctx.ellipse(0, 0, 22, 8, 0, 0, 6.283); ctx.fill(); ctx.restore(); }
  if (k > 0.3) { ctx.save(); ctx.translate(700, Math.min(1220, shore + 120)); ctx.rotate(0.25); ctx.fillStyle = '#e8e8f0'; ctx.beginPath(); ctx.moveTo(-110, -20); ctx.lineTo(110, -20); ctx.lineTo(80, 30); ctx.lineTo(-80, 30); ctx.fill(); ctx.fillStyle = '#3a86ff'; ctx.fillRect(-30, -70, 60, 50); ctx.restore(); }
  ctx.fillStyle = '#e8d8b0'; ctx.fillRect(0, 1250, W, H);
  massCrowd(ctx, u, { n: 40, yFar: 1300, yNear: 1850, sFar: 40, sNear: 180, x0: 80, x1: 1000, seed: 16, col: '#3a4a7a', arms: u > 2.6 ? 0.6 : 0 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['The coast, ~20–30 min', 'later. The sea', 'pulls back...'], 230, 0.15, { size: 80, out: 2.4 });
  say(ctx, u, ['then a white line', 'on the horizon'], 230, 2.5, { size: 84, out: OUT('drawback') });
}

// ================================================================ 10. nuclear plant on the coast
function vNuke(ctx, u) {
  const wx = lerp(W + 700, -1200, easeIn2(prog(u, 1.6, 4.4))), [sx, sy] = shakeOffset(u, 2.8, 1.8, 18);
  bgSky(ctx, ['#4a8ad8', '#9ac8f0', '#f0f4f8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#2a8ac0'; ctx.fillRect(0, 1200, W, H);
  ctx.fillStyle = '#c8c8c0'; ctx.fillRect(0, 1260, W, H); ctx.fillStyle = '#a8a8a0'; ctx.fillRect(0, 1240, W, 30);
  for (let i = 0; i < 4; i++) { const x = 60 + i * 250; ctx.fillStyle = '#e8eef4'; ctx.fillRect(x, 900, 200, 360); ctx.fillStyle = '#5aa0d8'; ctx.fillRect(x, 900, 200, 30); for (let k = 0; k < 4; k++) ctx.fillRect(x, 960 + k * 60, 200, 8);
    ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#4a5a7a'; ctx.textAlign = 'center'; ctx.fillText(`${i + 1}`, x + 100, 1220); }
  ctx.fillStyle = '#d8d8d0'; ctx.fillRect(0, 1340, W, 140); ctx.fillStyle = '#ffd25a'; for (let i = 0; i < 6; i++) ctx.fillRect(60 + i * 170, 1380, 90, 50);
  ctx.font = `800 28px ${FONT}`; ctx.fillStyle = '#4a4a52'; ctx.textAlign = 'left'; ctx.fillText('backup generators', 60, 1470);
  waveWall(ctx, u, wx, 1480, 820, 17);
  if (wx < W) { ctx.fillStyle = 'rgba(30,120,180,0.85)'; ctx.fillRect(Math.max(0, wx + 200), 1150, W, H); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['2011: a ~14 m wave caused', 'three meltdowns at', 'Fukushima'], 230, 0.15, { size: 74, out: 2.2 });
  say(ctx, u, ['This one hits that', 'same coast harder (est.)'], 230, 2.3, { size: 76, out: OUT('nuke') });
}

// ================================================================ 14. final: dawn over an erased coast
function vDawn(ctx, u) {
  bgSky(ctx, ['#4a5ab8', '#c88ab8', '#ffc890']);
  glow(ctx, 540, 1000, 360, '255,220,150', 0.8); ctx.fillStyle = '#ffe8b0'; ctx.beginPath(); ctx.arc(540, 1000 - u * 30, 90, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#6a8ab8'; ctx.fillRect(0, 1000, W, H);
  const r = rng(18); for (let i = 0; i < 160; i++) { const y = 1010 + Math.pow(r(), 1.5) * 700, s = 0.3 + (y - 1010) / 700 * 1.4; ctx.fillStyle = ['#a88a6a', '#e8e0d0', '#8a7a6a', '#c8b8a0'][i % 4];
    ctx.save(); ctx.translate(r() * W + Math.sin(u * 0.5 + i) * 6, y); ctx.rotate(r() * 3); ctx.fillRect(-20 * s, -5 * s, (30 + r() * 40) * s, 10 * s); ctx.restore(); }
  for (let i = 0; i < 6; i++) { const x = 120 + i * 170, s = 0.6; ctx.fillStyle = 'rgba(200,190,180,0.8)'; ctx.fillRect(x, 1000 - 40 * s - i % 2 * 20, 60, 50 + i % 2 * 20); }
  ctx.fillStyle = '#4a3a6a'; ctx.beginPath(); ctx.moveTo(-50, 1640); ctx.quadraticCurveTo(300, 1520, 640, 1600); ctx.quadraticCurveTo(900, 1660, W + 50, 1700); ctx.lineTo(W + 50, H); ctx.lineTo(-50, H); ctx.fill();
  massCrowd(ctx, u, { n: 60, yFar: 1580, yNear: 1720, sFar: 50, sNear: 90, x0: 60, x1: 700, seed: 19, col: '#3a2a5a', arms: 0 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Dawn: hundreds of km', 'of coastline, gone'], 230, 0.15, { size: 84, out: OUT('dawn') });
}

// ---------------------------------------------------------------- local helpers
// perspective open ocean: horizon at hy, optional swell(xNorm, depth) -> px lift
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
function bird(ctx, x, y, s, flap, chick = false) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (chick) { ctx.fillStyle = '#8a8478'; ctx.beginPath(); ctx.ellipse(0, 0, 30, 26, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#a8a294'; ctx.beginPath(); ctx.arc(-18, -18, 13, 0, 6.283); ctx.fill(); ctx.restore(); return; }
  ctx.fillStyle = '#f4f4f0'; ctx.beginPath(); ctx.ellipse(0, 0, 44, 20, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(-40, -16, 15, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#f0c060'; ctx.beginPath(); ctx.moveTo(-54, -16); ctx.lineTo(-74, -10); ctx.lineTo(-54, -10); ctx.fill();
  ctx.fillStyle = '#4a4a52'; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.lineTo(60, -6 - flap * 60); ctx.lineTo(90, 4 - flap * 40); ctx.lineTo(20, 6); ctx.fill(); ctx.restore(); }

function vLadder(ctx, u) {
  bgSky(ctx, ['#1e2a6a', '#2a3a8a', '#3a4aa0']);
  const x0 = 160, y0 = 1720, S10 = 760;
  const steps = [['M8', '#ffd25a', S10 / Math.sqrt(1000), 0.2], ['M9', '#2ec4b6', S10 / Math.sqrt(31.6), 0.5], ['M9.5 · Chile 1960, largest recorded', '#3a86ff', S10 / Math.sqrt(5.62), 1.0], ['M10', '#ff9a3a', S10, 2.5]];
  for (let i = steps.length - 1; i >= 0; i--) { const [lab, col, s, at] = steps[i], k = easeBack(R2((u - at) / 0.7)), ss = s * k; if (ss <= 0) continue;
    ctx.fillStyle = col; ctx.globalAlpha = i === 3 ? 0.9 : 1; ctx.fillRect(x0, y0 - ss, ss, ss); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; ctx.strokeRect(x0, y0 - ss, ss, ss); }
  // labels drawn on top
  for (let i = 0; i < steps.length; i++) { const [lab, col, s, at] = steps[i]; if (u < at + 0.3) continue; ctx.font = `900 ${i === 3 ? 80 : i === 2 ? 34 : 38}px ${FONT}`; ctx.fillStyle = i === 3 ? '#ffffff' : '#ffffff';
    ctx.textAlign = 'left'; ctx.globalAlpha = R2((u - at - 0.3) / 0.3);
    if (i === 0) ctx.fillText(lab, x0 + s + 10, y0 - 4); else if (i === 1) ctx.fillText(lab, x0 + s + 10, y0 - s + 34); else if (i === 2) { ctx.fillText('M9.5', x0 + s + 12, y0 - s + 36); ctx.font = `800 30px ${FONT}`; ctx.fillText('Chile 1960,', x0 + s + 12, y0 - s + 72); ctx.fillText('largest recorded', x0 + s + 12, y0 - s + 104); }
    else { ctx.textAlign = 'right'; ctx.fillText(lab, x0 + s - 24, y0 - s + 90); } ctx.globalAlpha = 1; }
  ctx.font = `700 30px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.textAlign = 'left'; ctx.fillText('area = energy released', x0, y0 + 50);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Each step up is', '~32x the energy'], 230, 0.15, { size: 88, out: 2.4 });
  say(ctx, u, ['M10: ~5.6x Chile 1960,', '~15 gigatons of TNT (est.)'], 230, 2.5, { size: 72, out: OUT('ladder') });
}

function vXsec(ctx, u) {
  const k = easeOut(prog(u, 0.3, 1.0)), [sx, sy] = shakeOffset(u, 0.3, 1.6, 26), sea0 = 700, floor = 1350, up = 110 * k, c = Math.max(0, u - 1.5) * 260;
  bgSky(ctx, ['#5aa8e8', '#9ad0f4', '#d8f0ff']); ctx.translate(sx, sy);
  const surf = x => sea0 - (c === 0 ? 2 * 60 * k : 60) * Math.exp(-(((x - 540 - c) / 200) ** 2)) - (c === 0 ? 0 : 60 * Math.exp(-(((x - 540 + c) / 200) ** 2)));
  const g = ctx.createLinearGradient(0, sea0 - 120, 0, floor); g.addColorStop(0, '#3aa0d8'); g.addColorStop(1, '#0e3a6a'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, surf(x)); ctx.lineTo(W, H); ctx.fill();
  ctx.strokeStyle = '#e8f8ff'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 0; x <= W; x += 10) x ? ctx.lineTo(x, surf(x)) : ctx.moveTo(x, surf(x)); ctx.stroke();
  // crust blocks: left fixed, right (hanging wall) lifted
  const L = ['#a8805a', '#8a6648', '#6a4e3a'];
  for (let i = 0; i < 3; i++) { ctx.fillStyle = L[i]; ctx.beginPath(); ctx.moveTo(0, floor + i * 180); ctx.lineTo(420 + i * 120, floor + i * 180); ctx.lineTo(420 + (i + 1) * 120, floor + (i + 1) * 180); ctx.lineTo(0, floor + (i + 1) * 180); ctx.fill();
    ctx.beginPath(); ctx.moveTo(420 + i * 120, floor + i * 180 - up); ctx.lineTo(W, floor + i * 180 - up); ctx.lineTo(W, floor + (i + 1) * 180 - up); ctx.lineTo(420 + (i + 1) * 120, floor + (i + 1) * 180 - up); ctx.fill(); }
  ctx.fillStyle = L[2]; ctx.fillRect(540, floor + 540 - up, W, 400);
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(420, floor - up); ctx.lineTo(800, floor + 570); ctx.stroke();
  if (u > 0.3) { glow(ctx, 600, floor + 260, 220 * R2(1.5 - u), '255,220,120', 0.8); }
  if (k > 0.5) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(880, floor); ctx.lineTo(880, floor - up); ctx.stroke(); ctx.font = `800 34px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('meters', 900, floor - up / 2 + 12); }
  if (c > 0) for (const s of [-1, 1]) { const x = 540 + s * c; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x + s * 90, sea0 - 190); ctx.lineTo(x + s * 40, sea0 - 215); ctx.lineTo(x + s * 40, sea0 - 165); ctx.fill(); ctx.fillRect(x - (s < 0 ? -40 : 40) - 0, sea0 - 194, s * -60 + 0, 8); }
  ctx.font = `700 28px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'right'; ctx.fillText('vertical scale exaggerated', W - 40, 1860);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['The seafloor jolts up', 'meters (est.), lifting', 'the ocean above it'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['The hump splits into', 'waves racing outward'], 230, 2.5, { size: 76, out: OUT('xsec') });
}

function vJapan(ctx, u) {
  const vt = tm(u, 1.8, 3.6, 0.45), h = 540 * easeOut(prog(vt, 0.6, 2.4)), over = R2((vt - 2.4) / 1.6), [sx, sy] = shakeOffset(u, 2.4, 2.4, 30);
  bgSky(ctx, ['#4a8ad0', '#9ac8ec', '#f0f4f8']); ctx.translate(sx, sy);
  const wallY = 1150, draw = 1 - prog(u, 0.2, 1.6) * 0.6;
  ctx.fillStyle = '#2a8ac0'; ctx.fillRect(0, 900 + (1 - draw) * 120, W, 260);
  if (h > 0) { const g = ctx.createLinearGradient(0, wallY - h, 0, wallY); g.addColorStop(0, '#5ab8d8'); g.addColorStop(0.25, '#16709e'); g.addColorStop(1, '#0a3a62'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, wallY);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, wallY - h + Math.sin(x * 0.01 + u * 2) * 30); ctx.lineTo(W, wallY); ctx.fill();
    const r = rng(40); for (let i = 0; i < 90; i++) puff(ctx, r() * W, wallY - h + Math.sin(u * 3 + i) * 20 - r() * 70, 30 + r() * 60, '#ffffff', 0.95);
    for (let i = 0; i < 50; i++) puff(ctx, r() * W, wallY - h - 60 - ((u * 180 * (0.5 + r())) % 260), 6 + r() * 14, '#ffffff', 0.7); }
  ctx.fillStyle = '#c8c4bc'; ctx.fillRect(0, wallY - 60, W, 80); ctx.fillStyle = '#a8a49c'; ctx.fillRect(0, wallY + 10, W, 14);
  ctx.font = `800 30px ${FONT}`; ctx.fillStyle = '#4a4a52'; ctx.textAlign = 'left'; ctx.fillText('15 m SEAWALL', 40, wallY - 15);
  ctx.fillStyle = '#8a8a90'; ctx.fillRect(0, wallY + 20, W, H);
  // town on both sides
  [[0, 300, 0], [780, 300, 1]].forEach(([x0, w, s]) => { for (let i = 0; i < 3; i++) { const x = x0 + i * 100, hh = 420 + i * 120; ctx.fillStyle = ['#e8d8c0', '#d8e0e8', '#f0e8d8'][i]; ctx.fillRect(x, H - hh - 60 * i, 100, hh + 60 * i); ctx.fillStyle = 'rgba(80,150,200,0.5)'; for (let k = 0; k < 8; k++) ctx.fillRect(x + 14, H - hh - 60 * i + 20 + k * 50, 72, 22); } });
  if (over > 0) { const fy = lerp(wallY - 40, H + 200, 0) , front = lerp(wallY, H + 100, easeIn2(over)); const g = ctx.createLinearGradient(0, wallY, 0, front); g.addColorStop(0, '#2a90c4'); g.addColorStop(1, '#6ac4e4');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-20, wallY - 80); ctx.lineTo(W + 20, wallY - 80); for (let x = W; x >= 0; x -= 30) ctx.lineTo(x, front + Math.sin(x * 0.02 + u * 6) * 40); ctx.fill();
    for (let x = 0; x <= W; x += 50) puff(ctx, x, front + Math.sin(x * 0.02 + u * 6) * 40, 50, '#f0fbff', 0.8);
    for (let i = 0; i < 6; i++) carSide(ctx, 100 + i * 170, front - 40 - i % 2 * 30, 0.9, CARCOL[i], Math.sin(u * 2 + i) * 0.6);
    debrisAtCam(ctx, 540, wallY, (vt - 2.4) * 0.7, 41, 30, '#6a5a4a'); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Runup could beat', '2011’s ~40 m (est.)'], 230, 0.15, { size: 84, out: 1.7 });
  say(ctx, u, ['Seawalls are simply', 'overtopped'], 230, 1.8, { size: 78, out: OUT('japan') });
}

function vBirds(ctx, u) {
  const fl = easeOut(prog(u, 0.6, 3.6)), edge = lerp(-200, 700, fl);
  bgSky(ctx, ['#4a9ae8', '#9ad4f8', '#f0f8ff']);
  ctx.fillStyle = '#3ab0d0'; ctx.fillRect(0, 900, W, 200); ctx.fillStyle = '#f0e4c0'; ctx.fillRect(0, 1000, W, H);
  const r = rng(12), B = []; for (let i = 0; i < 70; i++) B.push([r() * W, 1050 + r() * 800, r() < 0.4, r()]); B.sort((a, b) => a[1] - b[1]);
  for (const [x, y, chick, q] of B) { const s = 0.5 + (y - 1050) / 800 * 1.2, wet = x < edge, up = !chick && wet ? (u - 0.6) * 300 * (0.5 + q) : 0;
    if (chick && wet) continue; bird(ctx, x + (wet && !chick ? u * 60 : 0), y - up, s, wet && !chick ? Math.abs(Math.sin(u * 5 + q * 6)) : 0, chick); }
  // flood sheet from the left
  const g = ctx.createLinearGradient(edge - 300, 0, edge, 0); g.addColorStop(0, 'rgba(40,140,190,0.95)'); g.addColorStop(1, 'rgba(120,200,230,0.8)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-10, 1000); for (let y = 1000; y <= H; y += 40) ctx.lineTo(edge + Math.sin(y * 0.02 + u * 4) * 40, y); ctx.lineTo(-10, H); ctx.fill();
  for (let y = 1000; y <= H; y += 60) puff(ctx, edge + Math.sin(y * 0.02 + u * 4) * 40, y, 30, '#f0fbff', 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Midway, 2011: Japan’s', 'tsunami killed ~110,000', 'albatross chicks (est.)'], 230, 0.15, { size: 70, out: 2.0 });
  say(ctx, u, ['This one is far', 'bigger, Pacific-wide'], 230, 2.1, { size: 74, out: OUT('birds') });
}

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
  say(ctx, u, ['Hours later: Hawaii,', 'then California ports.', 'Global trade stalls'], 230, 0.15, { size: 76, out: OUT('port') });
}

function vToll3(ctx, u) {
  bgSky(ctx, ['#5a7aa0', '#7a9ab8', '#a8bcd0']);
  ctx.fillStyle = '#6a7a6a'; ctx.fillRect(0, 0, W, H);
  const r = rng(60); for (let j = 0; j < 14; j++) for (let i = 0; i < 9; i++) { const x = i * 124 + 10, y = j * 140 + 10 - u * 20, sub = r() < 0.5; ctx.fillStyle = sub ? '#c8b8a0' : '#d8d0c8'; ctx.fillRect(x, y, 100, 110); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x + 100, y + 10, 10, 100); }
  ctx.fillStyle = 'rgba(90,120,110,0.78)'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { ctx.fillStyle = ['#8a6a48', '#e8e0d0', '#3a86ff', '#ffbe0b'][i % 4]; ctx.save(); ctx.translate((r() * W + u * 20) % W, r() * H); ctx.rotate(r() * 3); ctx.fillRect(-14, -5, 28 + r() * 30, 10); ctx.restore(); }
  ctx.fillStyle = 'rgba(30,40,60,0.45)'; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Japan’s worst case for a', 'Nankai M9: 298,000 dead'], 600, 0.15, { size: 70, x: W / 2, align: 'center', out: OUT('toll') });
  bigNum(ctx, u, 'An M10: hundreds', 900, 0.8, { size: 92, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'of thousands (est.)', 1010, 0.9, { size: 92, color: '#ffffff', out: OUT('toll') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: 140 + u * 4, lat0: 30, t: u, ink: false });
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
function crane(ctx, x, base, s, rot, col) { ctx.save(); ctx.translate(x, base); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-70, -520); ctx.moveTo(90, 0); ctx.lineTo(70, -520); ctx.moveTo(-80, -260); ctx.lineTo(80, -260); ctx.moveTo(-90, 0); ctx.lineTo(70, -520); ctx.stroke();
  ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(-420, -520); ctx.lineTo(260, -520); ctx.stroke(); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -700); ctx.lineTo(-420, -520); ctx.moveTo(0, -700); ctx.lineTo(260, -520); ctx.moveTo(0, -700); ctx.lineTo(0, -520); ctx.stroke(); ctx.restore(); }
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
