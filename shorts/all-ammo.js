// What if every bullet, bomb and missile on Earth exploded at once?   (v2: more variety; nukes act two)
//
// SAFETY: consequences only. Nuclear weapons are described at the public, non-technical level ("needs a perfectly timed
// trigger"); base locations shown are widely published regions, drawn approximately.
//
// FACTS (checked; hedged on screen where estimates):
//  - ~12 billion small-arms rounds made a year (est.); ~1 billion firearms worldwide, ~857 million in civilian hands
//    (Small Arms Survey 2018). 12e9 rounds × ~3 cm ≈ 360,000 km (Moon: ~384,000 km away) -> "almost to the Moon".
//  - Loose cartridges that cook off outside a gun barely move (fire-service/SAAMI tests); loaded guns would fire.
//  - Depot blasts: Lagos 2002 (~1,100 dead); 2024 Toropets arsenal blast registered on seismographs.
//  - HMS Hood (1941): magazine explosion, sank in ~3 minutes.
//  - Nuclear weapons are "one-point safe": a non-symmetric detonation of the explosive gives no nuclear yield and instead
//    scatters plutonium (Palomares 1966, Thule 1968).
//  - ~12,000 nuclear warheads worldwide (FAS 2025). Most sit at remote missile fields, submarine and bomber bases, or at
//    sea; some bases are near cities (e.g. Kitsap-Bangor ~30 km from Seattle; Faslane ~40 km from Glasgow).
//  - Ground bursts at missile fields would spread heavy fallout downwind (studies of attacks on U.S. ICBM fields
//    estimated millions to tens of millions of U.S. deaths). Toll (est.) hedged as "tens of millions".
//  - Afterwards: no ammunition anywhere; rearming takes years.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6'], [1.6, 'impact']]],
  ['grid', 5.0, [[1.2, 'impact'], [1.25, 'boom'], [1.3, 'rumble:3.4']]],
  ['moonline', 4.5, [[0.2, 'swell:4.2']]],
  ['house', 5.0, [[1.2, 'impact']]],
  ['seismo', 4.5, [[0.4, 'boom'], [0.45, 'rumble:3.8'], [1.2, 'boom']]],
  ['fleet', 4.5, [[0.8, 'impact'], [0.85, 'boom'], [1.4, 'boom']]],
  ['radar', 4.0, [[0.2, 'heart:3.6']]],
  ['why', 5.0, [[1.4, 'boom']]],
  ['nukes', 5.5, [[0.2, 'swell:1.4'], [1.6, 'impact'], [1.65, 'boom'], [1.7, 'rumble:3.6']]],
  ['fallout', 5.0, [[0.2, 'rumble:4.6']]],
  ['disarm', 4.5, [[0.2, 'swell:4.2']]],
  ['sling', 4.5, [[0.2, 'swell:4.2']]],
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

const FNS = { hook: vOrbit, grid: vGrid, moonline: vMoonLine, house: vHouse, seismo: vSeismo, fleet: vFleet, radar: vRadar, why: vWhy,
              nukes: vNukes2, fallout: vFallout, disarm: vDisarm, sling: vSling, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.26, contrast: 1.08, saturate: 1.15, vignette: 0.34 });
}
function fireball(ctx2, x, y, dt, s, seed) {
  if (dt <= 0) return; const r = rng(seed), k = 1 - Math.exp(-dt * 2.5), fade = R2(1 - dt / 3.5);
  for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = r() * 90 * s * k, rr = (60 + r() * 70) * s * (0.4 + k);
    puff(ctx2, x + Math.cos(a) * d, y - k * 160 * s + Math.sin(a) * d * 0.6 - dt * 40 * s, rr, mixHex('#fff0a0', '#3a2a28', R2(dt / 1.6 + r() * 0.3)), fade); }
  glow(ctx2, x, y - 60 * s, 260 * s, '255,170,70', 0.9 * Math.exp(-dt * 1.4));
}
function cartridge(ctx, x, y, s, rot = 0, burst = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#d8a040'; roundRect(ctx, -12, -10, 24, 60, 4); ctx.fill(); ctx.fillStyle = '#e8c070'; ctx.fillRect(-12, -10, 6, 60);
  ctx.translate(0, -burst * 26); ctx.fillStyle = '#c87a4a'; ctx.beginPath(); ctx.moveTo(-11, -10); ctx.quadraticCurveTo(-11, -42, 0, -50); ctx.quadraticCurveTo(11, -42, 11, -10); ctx.fill(); ctx.restore(); }
function flashPts(ctx, cx, cy, R, v, pts, u, at, col = '255,220,150') {
  for (const [lon, lat, s] of pts) { const [x, y, z] = v(lon, lat); if (z < 0.05) continue; const sx = cx + x * R, sy = cy + y * R, dt = u - at;
    if (dt < 0) continue; const k = Math.exp(-dt * 1.2); glow(ctx, sx, sy, (12 + 40 * s) * (1 + 0.4 * dt), col, 0.95 * k + 0.2); ctx.fillStyle = `rgba(255,250,230,${0.9 * k + 0.1})`; ctx.beginPath(); ctx.arc(sx, sy, 3 + 4 * s, 0, 6.283); ctx.fill();
    if (dt < 1.2) { ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - dt / 1.2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sx, sy, dt * 120 * s + 6, 0, 6.283); ctx.stroke(); } }
}

// ================================================================ 1. hook: Earth from orbit lights up
const SITES = (() => { const r = rng(5), P = []; for (let i = 0; i < 260; i++) { let lon, lat; do { lon = -170 + r() * 340; lat = -45 + r() * 110; } while (!onLand(lon, lat)); P.push([lon, lat, 0.2 + r() * 0.5]); } return P; })();
function onLand(lon, lat) { const LM = landMap(); const x = Math.floor((lon + 180) / 360 * LM.w), y = Math.floor((90 - lat) / 180 * LM.h); return LM.m[y * LM.w + x] > 0.5; }
function vOrbit(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1200);
  const lon0 = 10 + u * 6, v = gView(lon0, 25), R = 470, cx = W / 2, cy = 1200;
  globe(ctx, cx, cy, R, { lon0, lat0: 25, t: u, ink: false, sun: [0.2, -0.2, -0.95] });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); flashPts(ctx, cx, cy, R, v, SITES, u, 1.6); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1720, u > 1.6 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if every bullet,', 'bomb and missile', 'exploded at once?'], 300, 0.15, { size: 84, out: OUT('hook'), mark: { line: 2, from: 0, to: 8, color: '#e63946' } });
}

// ================================================================ 2. everywhere, the same instant: a 3×3 grid
const TILES9 = [['ARMY DEPOT', '#6a7a5a'], ['WARSHIP', '#2a6a9a'], ['FIGHTER JET', '#7ab0e0'], ['TANK', '#9a8a60'], ['POLICE CAR', '#3a3a5a'], ['GUN SHOP', '#c89a6a'],
  ['MINEFIELD', '#7a9a4a'], ['ROCKET LAUNCHER', '#a8a080'], ['ARMORY', '#5a5a66']];
function vGrid(ctx, u) {
  bgSky(ctx, ['#14141e', '#1a1a28', '#202030']);
  const boom = 1.2, sz = 320, gap = 20, x0 = (W - 3 * sz - 2 * gap) / 2, y0 = 560;
  TILES9.forEach(([label, col], i) => { const c = i % 3, r = Math.floor(i / 3), x = x0 + c * (sz + gap), y = y0 + r * (sz + gap), dt = u - boom;
    ctx.save(); ctx.beginPath(); roundRect(ctx, x, y, sz, sz, 24); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(x, y, sz, sz);
    const cx = x + sz / 2, cy = y + sz * 0.62; ctx.fillStyle = 'rgba(20,20,30,0.85)';
    if (i === 0) { ctx.beginPath(); ctx.ellipse(cx, cy + 40, 110, 70, 0, Math.PI, 0); ctx.fill(); }
    else if (i === 1) { ctx.beginPath(); ctx.moveTo(cx - 130, cy); ctx.lineTo(cx + 130, cy); ctx.lineTo(cx + 100, cy + 30); ctx.lineTo(cx - 100, cy + 30); ctx.fill(); ctx.fillRect(cx - 30, cy - 50, 60, 50); }
    else if (i === 2) { ctx.beginPath(); ctx.moveTo(cx + 110, cy - 40); ctx.lineTo(cx - 90, cy - 70); ctx.lineTo(cx - 90, cy - 10); ctx.fill(); ctx.fillRect(cx - 40, cy - 10, 60, 10); }
    else if (i === 3) { roundRect(ctx, cx - 110, cy, 220, 50, 20); ctx.fill(); ctx.fillRect(cx - 50, cy - 40, 100, 40); ctx.fillRect(cx + 40, cy - 30, 100, 12); }
    else if (i === 4) { roundRect(ctx, cx - 110, cy, 220, 60, 18); ctx.fill(); ctx.fillStyle = Math.sin(u * 14) > 0 ? '#e63946' : '#3a86ff'; ctx.fillRect(cx - 20, cy - 14, 40, 14); }
    else if (i === 5) { ctx.fillRect(cx - 120, cy - 80, 240, 140); ctx.fillStyle = '#ffd25a'; ctx.fillRect(cx - 100, cy - 110, 200, 34); }
    else if (i === 6) { for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(cx - 100 + (k % 3) * 100, cy - 20 + Math.floor(k / 3) * 60, 16, 0, 6.283); ctx.fill(); } }
    else if (i === 7) { ctx.fillRect(cx - 110, cy, 220, 40); ctx.save(); ctx.translate(cx - 60, cy); ctx.rotate(-0.5); ctx.fillRect(0, -40, 160, 40); ctx.restore(); }
    else { ctx.fillRect(cx - 110, cy - 70, 220, 130); ctx.fillStyle = col; ctx.fillRect(cx - 30, cy - 10, 60, 70); }
    if (dt > 0) { fireball(ctx, cx, cy, dt * 1.3, 0.9, i + 1); }
    ctx.restore();
    ctx.font = `900 26px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 8; ctx.fillText(label, x + 18, y + 40); ctx.shadowBlur = 0; });
  if (u > boom && u < boom + 0.12) { ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(0, 0, W, H); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Everywhere.', 'The same instant.'], 230, 0.15, { size: 96, out: OUT('grid') });
}

// ================================================================ 3. scale: bullets end to end almost reach the Moon
function vMoonLine(ctx, u) {
  space(ctx, u);
  const ex = 230, ey = 1600, mx = 860, my = 600, k = easeInOut(prog(u, 0.4, 3.4));
  globe(ctx, ex, ey, 200, { lon0: 20 + u * 6, lat0: 20, t: u, ink: false }); moonFx(ctx, mx, my, 70, {});
  const n = 46; for (let i = 0; i < n * k * 0.94; i++) { const f = i / n, x = lerp(ex + 150, mx - 50, f), y = lerp(ey - 150, my + 50, f); cartridge(ctx, x, y, 0.7, Math.atan2(my - ey, mx - ex) + Math.PI / 2, 0); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['A year’s worth of bullets,', 'lined up end to end…'], 230, 0.15, { size: 72, out: 2.2 });
  say(ctx, u, ['…almost reaches', 'the Moon'], 230, 2.3, { size: 92, out: OUT('moonline'), mark: { line: 1, from: 0, to: 8, color: '#e63946' } });
}

// ================================================================ 4. a dollhouse view of an ordinary home
function vHouse(ctx, u) {
  const pop = 1.2, dt = Math.max(0, u - pop);
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#e8f4ff']);
  const x0 = 110, y0 = 700, w = 860, h = 960, fl = h / 2;
  ctx.fillStyle = '#c86a4a'; ctx.beginPath(); ctx.moveTo(x0 - 40, y0); ctx.lineTo(x0 + w / 2, y0 - 260); ctx.lineTo(x0 + w + 40, y0); ctx.fill();
  ctx.fillStyle = '#f4ecd8'; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = '#8a6a4a'; ctx.lineWidth = 14; ctx.strokeRect(x0, y0, w, h);
  ctx.beginPath(); ctx.moveTo(x0, y0 + fl); ctx.lineTo(x0 + w, y0 + fl); ctx.moveTo(x0 + w / 2, y0); ctx.lineTo(x0 + w / 2, y0 + h); ctx.stroke();
  ctx.fillStyle = '#e8dcc0'; ctx.fillRect(x0 + 7, y0 + 7, w / 2 - 14, fl - 14);
  // rooms: bedroom closet w/ safe (TL), living room (TR), kitchen (BL), garage shelf (BR)
  const jump = dt > 0 && dt < 0.5 ? Math.sin(dt / 0.5 * Math.PI) * 50 : 0;
  ctx.fillStyle = '#5a5a66'; roundRect(ctx, x0 + 260, y0 + 200, 150, 260, 12); ctx.fill(); ctx.fillStyle = '#9aa0b0'; ctx.beginPath(); ctx.arc(x0 + 380, y0 + 330, 14, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#3a6ab0'; roundRect(ctx, x0 + 40, y0 + 380, 200, 80, 20); ctx.fill();
  ctx.fillStyle = '#2a2a34'; ctx.fillRect(x0 + w / 2 + 240, y0 + 200, 160, 110); ctx.fillStyle = '#7ab0e0'; ctx.fillRect(x0 + w / 2 + 250, y0 + 210, 140, 90);
  ctx.fillStyle = '#c86a6a'; roundRect(ctx, x0 + w / 2 + 40, y0 + 360, 220, 100, 24); ctx.fill();
  person2(ctx, x0 + w / 2 + 150, y0 + fl - 20 - jump, 260, { seed: 1, t: u });
  ctx.fillStyle = '#d8d0c0'; ctx.fillRect(x0 + 30, y0 + fl + 260, 380, 200); person2(ctx, x0 + 300, y0 + h - 20 - jump * 0.8, 280, { seed: 3, t: u });
  ctx.fillStyle = '#8a6a4a'; for (let s = 0; s < 3; s++) ctx.fillRect(x0 + w / 2 + 60, y0 + fl + 120 + s * 110, 340, 14);
  ctx.fillStyle = '#4a5a3a'; for (let s = 0; s < 3; s++) for (let b = 0; b < 3; b++) ctx.fillRect(x0 + w / 2 + 80 + b * 110, y0 + fl + 60 + s * 110, 90, 60);
  if (dt > 0) { for (const [px, py] of [[x0 + 335, y0 + 330], [x0 + w / 2 + 230, y0 + fl + 160]]) { glow(ctx, px, py, 120, '255,200,120', 0.8 * Math.exp(-dt * 2));
      const r = rng(Math.floor(px)); for (let i = 0; i < 14; i++) { const a = -Math.PI * r(), d = (60 + r() * 120) * Math.min(dt, 0.6) / 0.6; cartridge(ctx, px + Math.cos(a) * d, py + Math.sin(a) * d + 200 * Math.max(0, dt - 0.4) ** 2, 0.8, dt * 8 + i, 1); } }
    ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e63946'; if (dt < 1.5) { ctx.fillText('POP!', x0 + 335, y0 + 160); ctx.fillText('POP POP!', x0 + w / 2 + 230, y0 + fl + 40); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Most of the world’s guns', 'are in people’s homes'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['Loose ammo just pops.', 'But any loaded gun fires.'], 230, 2.5, { size: 72, out: OUT('house') });
}

// ================================================================ 5. depots, read on a seismograph
function vSeismo(ctx, u) {
  const boom = 0.4, [sx, sy] = shakeOffset(u, boom, 3.6, 18);
  bgSky(ctx, ['#2a3a6a', '#7a8aaa', '#c8b8a0']);
  ctx.save(); ctx.translate(sx, sy); ctx.fillStyle = '#8a9a6a'; ctx.fillRect(0, 900, W, 400);
  for (let i = 0; i < 7; i++) { const x = 90 + i * 150, at = boom + (i % 3) * 0.25; ctx.fillStyle = '#6a7a5a'; ctx.beginPath(); ctx.ellipse(x, 1200, 60, 40, 0, Math.PI, 0); ctx.fill(); fireball(ctx, x, 1180, u - at, 0.8, i); }
  ctx.restore();
  // seismograph strip
  ctx.fillStyle = '#f8f4ea'; ctx.fillRect(0, 1340, W, 380); ctx.strokeStyle = 'rgba(120,140,180,0.3)'; ctx.lineWidth = 2; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.moveTo(0, 1360 + k * 45); ctx.lineTo(W, 1360 + k * 45); ctx.stroke(); }
  ctx.strokeStyle = '#1b1b2e'; ctx.lineWidth = 4; ctx.beginPath();
  for (let x = 0; x <= W - 120; x += 3) { const tt = u - (W - 120 - x) / 400, amp = tt > boom ? 160 * Math.exp(-(tt - boom) * 1.4) * (1 + (tt > boom + 0.8 ? 0.8 * Math.exp(-(tt - boom - 0.8) * 2) : 0)) : 4, y = 1530 + Math.sin(tt * 90 + x) * amp;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(W - 120, 1530 + Math.sin(u * 90) * (u > boom ? 160 * Math.exp(-(u - boom) * 1.4) : 4), 12, 0, 6.283); ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Thousands of ammo depots', 'blow at once'], 230, 0.15, { size: 76, out: 2.3 });
  say(ctx, u, ['Big ones register', 'as earthquakes'], 230, 2.4, { size: 88, out: OUT('seismo') });
}

// ================================================================ 6. a fleet from directly above
function vFleet(ctx, u) {
  const boom = 0.8;
  bgSky(ctx, ['#1a5a8a', '#2a6a9a', '#1a4a7a']);
  for (let i = 0; i < 40; i++) { const r = rng(i); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 3; const x = r() * W, y = (r() * H + u * 30) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y); ctx.stroke(); }
  const ships = [[W / 2, 1100, 1.4, 0], [260, 760, 0.8, 1], [820, 760, 0.8, 2], [230, 1500, 0.8, 3], [860, 1480, 0.8, 4]];
  for (const [x, y, s, i] of ships) { const dt = u - boom - i * 0.12, split = easeOut(R2(dt / 2.5)) * 40 * s;
    if (dt > 0) { ctx.fillStyle = 'rgba(20,20,20,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, 140 * s * (1 + dt * 0.5), 70 * s * (1 + dt * 0.5), 0.3, 0, 6.283); ctx.fill(); }
    for (const dir of [-1, 1]) { ctx.save(); ctx.translate(x + dir * split * 0.3, y + dir * split); ctx.rotate(dir * split * 0.004); ctx.beginPath(); ctx.rect(-80 * s, dir < 0 ? -400 * s : 0, 160 * s, 400 * s); ctx.clip();
      ctx.fillStyle = '#8a94a4'; ctx.beginPath(); ctx.moveTo(0, -300 * s); ctx.lineTo(50 * s, -200 * s); ctx.lineTo(50 * s, 260 * s); ctx.lineTo(-50 * s, 260 * s); ctx.lineTo(-50 * s, -200 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#6a7484'; ctx.fillRect(-26 * s, -60 * s, 52 * s, 120 * s); ctx.restore(); }
    if (dt > 0) fireball(ctx, x, y, dt * 1.2, s * 0.8, i + 3); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Every warship’s magazine', 'goes off'], 230, 0.15, { size: 80, out: OUT('fleet') });
  if (u > 2.2) { scrimB(ctx, 1640, 0.6); say(ctx, u, ['HMS Hood, 1941: sank in 3 minutes'], 1780, 2.2, { size: 46, weight: 900, x: W / 2, align: 'center', out: OUT('fleet') }); }
}

// ================================================================ 7. radar: armed jets vanish
function vRadar(ctx, u) {
  bgSky(ctx, ['#020804', '#041008', '#06140a']);
  const cx = W / 2, cy = 1150, R = 440, sw = u * 2.2;
  ctx.strokeStyle = 'rgba(90,255,120,0.35)'; ctx.lineWidth = 3; for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(cx, cy, R * k / 4, 0, 6.283); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
  const g = ctx.createConicGradient ? ctx.createConicGradient(sw - 0.6, cx, cy) : null;
  if (g) { g.addColorStop(0, 'rgba(90,255,120,0)'); g.addColorStop(0.09, 'rgba(90,255,120,0.4)'); g.addColorStop(0.1, 'rgba(90,255,120,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill(); }
  const r = rng(4); for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = (0.2 + r() * 0.75) * R, x = cx + Math.cos(a) * d + u * 10, y = cy + Math.sin(a) * d;
    const gone = u > 1.0 + ((a - (1.0 * 2.2 % 6.283) + 12.566) % 6.283) / 2.2; if (gone) { if (u < 1.0 + ((a - 2.2 + 12.566) % 6.283) / 2.2 + 0.3) glow(ctx, x, y, 40, '255,200,120', 0.8); continue; }
    ctx.fillStyle = '#7dffb0'; ctx.beginPath(); ctx.arc(x, y, 10, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Every jet carrying', 'missiles: gone'], 230, 0.15, { size: 88, out: OUT('radar') });
}

// ================================================================ 8. why the nukes don't go nuclear
function vWhy(ctx, u) {
  const boom = 1.4, dt = Math.max(0, u - boom);
  bgSky(ctx, ['#1a2240', '#2a3460', '#3a4680']);
  ctx.save(); ctx.translate(W / 2, 1150);
  if (dt < 0.2) { ctx.fillStyle = '#c8ccd8'; ctx.beginPath(); ctx.moveTo(0, -300); ctx.quadraticCurveTo(140, -120, 120, 260); ctx.lineTo(-120, 260); ctx.quadraticCurveTo(-140, -120, 0, -300); ctx.fill();
    ctx.fillStyle = '#ffd25a'; roundRect(ctx, -60, -20, 120, 100, 16); ctx.fill(); ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, -20, 40, Math.PI, 0); ctx.stroke(); }
  ctx.restore();
  if (dt > 0) { const r = rng(3); for (let i = 0; i < 24; i++) { const x = W / 2 + (r() - 0.5) * 700 * R2(dt / 2), y = 1150 - r() * 400 * R2(dt / 2); puff(ctx, x, y, (50 + r() * 70) * (0.5 + R2(dt / 2)), '#a8a4a0', 0.75); }
    for (let i = 0; i < 60; i++) { const a = r() * 6.283, d = r() * 520 * R2(dt / 2.5); ctx.fillStyle = 'rgba(160,255,120,0.85)'; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * d, 1100 + Math.sin(a) * d * 0.6, 4 + r() * 4, 0, 6.283); ctx.fill(); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['But the nukes don’t go', 'nuclear. They need a', 'perfectly timed trigger'], 230, 0.15, { size: 70, out: 2.6 });
  say(ctx, u, ['They just spray plutonium', '(it happened in Spain, 1966)'], 230, 2.7, { size: 64, out: OUT('why') });
}

// ================================================================ 9. ...but what if they DID go off?
const BASES = [[-111, 47.5, 1], [-101.4, 48.4, 1], [-104.8, 41.1, 1], [-122.7, 47.7, 0.8], [-81.5, 30.8, 0.8], [-115.0, 36.2, 0.5], [-93.5, 38.7, 0.5],
  [35.8, 54.0, 1], [45.6, 51.9, 1], [59.5, 50.8, 1], [89.8, 55.3, 1], [33.3, 69.25, 0.8], [158.4, 52.9, 0.8], [39.5, 56.2, 0.6], [84.0, 56.5, 0.6],
  [-4.82, 56.07, 0.6], [-4.5, 48.3, 0.6], [7.06, 50.17, 0.4], [12.6, 46.03, 0.4], [35.4, 37.0, 0.4], [5.5, 51.6, 0.4],
  [96.5, 40.1, 0.8], [105.7, 39.7, 0.8], [93.0, 42.5, 0.6], [125.7, 39.0, 0.4], [72.9, 19.1, 0.3], [73.0, 33.6, 0.3], [35.0, 31.2, 0.3],
  [-40, 50, 0.5], [-30, 30, 0.5], [160, 40, 0.5], [-150, 45, 0.5], [60, 75, 0.5], [-10, 65, 0.5]];
function vNukes2(ctx, u) {
  space(ctx, u);
  const lon0 = lerp(-90, 60, easeInOut(prog(u, 0, 5.5))), lat0 = 45, v = gView(lon0, lat0), R = 520, cx = W / 2, cy = 1150;
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0.2, -0.2, -0.95] });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); flashPts(ctx, cx, cy, R, v, BASES, u, 1.6, '255,240,200'); ctx.restore();
  if (u > 1.6 && u < 1.8) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(0, 0, W, H); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['…but what if they', 'DID go off?'], 230, 0.15, { size: 92, out: 1.6, mark: { line: 1, from: 0, to: 3, color: '#e63946' } });
  say(ctx, u, ['~12,000 warheads at once.', 'Most at remote bases and subs'], 230, 1.8, { size: 66, out: OUT('nukes') });
}

// ================================================================ 10. fallout drifts downwind
function vFallout(ctx, u) {
  space(ctx, u);
  const R = 1500, cx = W / 2, cy = 1250, lon0 = -97, lat0 = 42, v = gView(lon0, lat0), k = easeOut(prog(u, 0.2, 4.6));
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0, -0.3, 1], clouds: 0.15 });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const [lon, lat] of [[-111, 47.5], [-101.4, 48.4], [-104.8, 41.1]]) { const [x, y] = v(lon, lat), X = cx + x * R, Y = cy + y * R;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(0.25); const len = 900 * k; const g = ctx.createLinearGradient(0, 0, len, 0); g.addColorStop(0, 'rgba(190,90,200,0.65)'); g.addColorStop(1, 'rgba(190,90,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(len / 2, 0, len / 2 + 20, 70 + 60 * k, 0, 0, 6.283); ctx.fill(); ctx.restore(); glow(ctx, X, Y, 50, '255,220,160', 0.8); }
  for (const [name, lon, lat] of [['Chicago', -87.63, 41.88], ['Minneapolis', -93.27, 44.98], ['Denver', -104.99, 39.74], ['Des Moines', -93.6, 41.6]]) { const [x, y] = v(lon, lat), X = cx + x * R, Y = cy + y * R;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(X, Y, 9, 0, 6.283); ctx.fill(); ctx.font = `800 32px ${FONT}`; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 8; ctx.fillText(name, X, Y - 18); ctx.shadowBlur = 0; }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Missile fields become', 'fallout factories'], 230, 0.15, { size: 84, out: 2.6 });
  bigNum(ctx, u, 'Tens of millions (est.)', 1640, 2.6, { size: 72, color: '#ffffff', out: OUT('fallout') });
  if (u > 2.8) say(ctx, u, ['in the U.S., Russia and beyond'], 1760, 2.8, { size: 44, weight: 800, x: W / 2, align: 'center', out: OUT('fallout') });
}

// ================================================================ 11. the world, disarmed
function vDisarm(ctx, u) {
  bgSky(ctx, ['#8a9aaa', '#b8c0c8', '#d8d4cc']);
  ctx.fillStyle = '#7a6a50'; ctx.fillRect(0, 1200, W, H); ctx.fillStyle = '#5a4a38'; ctx.fillRect(0, 1260, W, 60); ctx.fillRect(0, 1640, W, 60);
  const soldier = (x, y, s, dir, seed) => { person2(ctx, x, y, s, { seed: 7, t: u, dir, grey: 0.6 }); ctx.fillStyle = '#4a5a3a'; ctx.beginPath(); ctx.ellipse(x, y - s * 0.96, s * 0.2, s * 0.09, 0, Math.PI, 0); ctx.fill();
    ctx.save(); ctx.translate(x + dir * s * 0.2, y - s * 0.5); ctx.rotate(dir * (0.4 + Math.sin(u * 2 + seed) * 0.1)); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(0, -6, dir * s * 0.55, 12); ctx.restore(); };
  for (let i = 0; i < 4; i++) soldier(140 + i * 140, 1270, 220, 1, i);
  for (let i = 0; i < 4; i++) soldier(W - 140 - i * 140, 1660, 260, -1, i + 9);
  if (u > 1.0) for (const [x, y] of [[420, 960], [700, 1350]]) { ctx.save(); ctx.globalAlpha = R2((u - 1.0) / 0.3); ctx.font = `900 120px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 16; ctx.fillText('?', x, y); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Then: silence. Every', 'war stops mid-battle.'], 230, 0.15, { size: 80, out: 2.3 });
  say(ctx, u, ['Nobody on Earth has', 'a single bullet'], 230, 2.4, { size: 84, out: OUT('disarm') });
}

// ================================================================ 12. the new deadliest weapon
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
  say(ctx, u, ['Rearming takes years.', 'Until then, the world’s', 'deadliest weapon is…'], 230, 0.15, { size: 72, out: 2.4 });
  say(ctx, u, ['…a slingshot'], 230, 2.5, { size: 110, out: OUT('sling'), color: '#ffd25a' });
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
