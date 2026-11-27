// What if everyone on Earth played GTA VI at the same time?
// (References the game by name only: no Rockstar logo, characters, art style or music. Our own neon art.)
//
// NUMBERS (worked in python; hedged):
//  - GTA VI launched Nov 19, 2026 on PS5 / Xbox Series X|S (est. ~$1.84B by launch day, third-party trackers).
//    Consoles able to run it: roughly ~110 million (PS5 + Xbox Series, rough).
//  - Premise: every one of ~8.2 billion people gets a console + TV and drops everything to play at the same moment.
//  - Download: even at ~100 GB each -> ~820 exabytes; at ~1.2 Pbps of international internet bandwidth ≈ ~2 months.
//  - Power: console (~200 W) + TV (~100 W) ≈ 300 W x 8.2 billion ≈ +2.5 TW in one second. World electricity averages
//    ~31,000 TWh/yr ≈ 3.5 TW -> a ~70% jump. Grids keep only a few % in fast reserve: frequency collapses, under-frequency
//    protection trips, plants disconnect -> cascading blackouts within seconds.
//  - Dropping everything: tens of millions of cars moving at any moment; ~10,000 airliners on autopilot fly until their fuel runs out.
//  - Blackout: ~20 million elevators worldwide; water pumping and traffic signals stop; hospitals fall back to generators.
//    Restarting grids from zero ("black start") takes hours to days.
//  - World GDP ~$110T/yr ≈ ~$300B per day of work lost.
//  - Toll (rough): crashes on the roads and in the air plus the blackout -> ~1 million+.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6'], [1.6, 'kick:1.6']]],
  ['consoles', 4.0, [[0.3, 'impact'], [1.8, 'swell:2.0']]],
  ['download', 4.5, [[0.2, 'rumble:4.2']]],
  ['drop', 4.5, [[0.6, 'impact'], [0.65, 'boom'], [1.6, 'boom'], [2.6, 'impact']]],
  ['cockpit', 4.5, [[0.2, 'air'], [0.4, 'heart:4.0']]],
  ['power', 5.0, [[0.4, 'impact'], [0.45, 'rumble:4.4']]],
  ['grid', 5.0, [[0.6, 'boom'], [0.65, 'impact'], [1.6, 'boom'], [2.6, 'boom']]],
  ['blackout', 5.0, [[0.2, 'drawback:4.0']]],
  ['screen', 4.0, [[0.2, 'kick:1.6'], [1.8, 'impact']]],
  ['dark', 4.5, [[0.2, 'heart:4.2']]],
  ['restart', 4.0, [[0.2, 'rumble:3.8']]],
  ['toll', 4.5, [[0.2, 'heart:4.2']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if everyone on Earth played GTA VI at the same time?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 96, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookG6, consoles: vConsolesG6, download: vDownloadG6, drop: vDropG6, cockpit: vCockpitG6, power: vPowerG6, grid: vGridG6, blackout: vBlackoutG6,
              screen: vScreenG6, dark: vDarkG6, restart: vRestartG6, toll: vTollG6, final: vFinalG6, end: vEndG6 };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const NEON = ['#ff5ab8', '#3ae0e8', '#ffb84a', '#9a6aff'];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.3, contrast: 1.08, saturate: 1.2, vignette: 0.36 });
}
function consoleBox(ctx, x, y, s, on = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#e8e4f4'; ctx.beginPath(); ctx.roundRect(-40, -100, 80, 200, 16); ctx.fill(); ctx.fillStyle = '#2a2a4a'; ctx.fillRect(-14, -96, 28, 192);
  ctx.fillStyle = on ? '#3ae0e8' : '#4a4a6a'; ctx.fillRect(-3, -90, 6, 180); ctx.restore(); }
function pad(ctx, x, y, s, a = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s); ctx.fillStyle = '#e8e4f4';
  ctx.beginPath(); ctx.moveTo(-60, -20); ctx.quadraticCurveTo(0, -40, 60, -20); ctx.quadraticCurveTo(90, 40, 60, 50); ctx.quadraticCurveTo(30, 30, 0, 28); ctx.quadraticCurveTo(-30, 30, -60, 50); ctx.quadraticCurveTo(-90, 40, -60, -20); ctx.fill();
  ctx.fillStyle = '#2a2a4a'; ctx.beginPath(); ctx.arc(-28, 6, 9, 0, 6.283); ctx.arc(28, 6, 9, 0, 6.283); ctx.fill(); ctx.restore(); }
function neonCity(ctx, u, base, seed, on = 1) { const r = rng(seed); let x = -20;
  while (x < W + 20) { const w = 60 + r() * 100, h = 200 + r() * 560, c = NEON[Math.floor(r() * 4)]; ctx.fillStyle = mixHex('#2a2a5a', '#1a1a3a', r()); ctx.fillRect(x, base - h, w, h);
    if (on > 0) { ctx.globalAlpha = on; ctx.fillStyle = c; ctx.fillRect(x, base - h, w, 6); for (let yy = base - h + 20; yy < base - 10; yy += 28) for (let xx = x + 8; xx < x + w - 8; xx += 18) if (r() < 0.4) { ctx.fillStyle = r() < 0.2 ? c : 'rgba(255,235,200,0.7)'; ctx.fillRect(xx, yy, 8, 12); } ctx.globalAlpha = 1; }
    x += w + 6; } }

// ================================================================ 1. hook: a neon night skyline, every window glowing with the same game
function vHookG6(ctx, u) {
  bgSky(ctx, ['#2a1a5a', '#6a3a9a', '#ff8ab8']); glow(ctx, 540, 1100, 400, '255,140,200', 0.5); ctx.fillStyle = '#ffb0a0'; ctx.beginPath(); ctx.arc(540, 1150, 220, Math.PI, 0); ctx.fill();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = '#6a3a9a'; ctx.fillRect(320, 1000 + i * 26, 440, 8 + i * 2); }
  neonCity(ctx, u, 1500, 3); ctx.fillStyle = '#1a1a3a'; ctx.fillRect(0, 1500, W, H);
  for (let i = 0; i < 5; i++) palm(ctx, 80 + i * 240, 1560, 340, Math.sin(u * 1.5 + i) * 8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4)); shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.6 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if everyone', 'on Earth played GTA VI', 'at the same time?'], 260, 0.15, { size: 84, out: OUT('hook'), mark: { line: 1, from: 16, to: 22, color: '#ff5ab8' } });
}

// ================================================================ 2. only ~110 million consoles... so 8 billion appear
function vConsolesG6(ctx, u) {
  bgSky(ctx, ['#1e1a4a', '#2a2a6a', '#3a2a7a']);
  const k = easeIn2(prog(u, 1.4, 3.4)), n = Math.floor(lerp(6, 400, k)), r = rng(4);
  for (let i = 0; i < n; i++) { const c = i % 20, rw = Math.floor(i / 20), s = lerp(1.6, 0.4, k), x = 540 + (c - 9.5) * 110 * s, y = 1100 + (rw - 2) * 230 * s; if (y > H + 100) continue; consoleBox(ctx, x, y, s * 0.9); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Only ~110 million', 'consoles can run it'], 230, 0.15, { size: 84, out: 1.8 });
  say(ctx, u, ['So: 8 billion consoles', 'appear. Everyone plays'], 230, 1.9, { size: 80, out: OUT('consoles') });
}

// ================================================================ 3. the download: data streams from orbit
function vDownloadG6(ctx, u) {
  space(ctx, u);
  const R = 640, cx = 540, cy = 1250, lon0 = -40 + u * 5, v = gView(lon0, 20);
  globe(ctx, cx, cy, R, { lon0, lat0: 20, t: u, ink: false, clouds: 0.2, sun: [0.3, -0.2, -0.93] });
  const r = rng(5); ctx.lineCap = 'round';
  for (let i = 0; i < 70; i++) { const a = r() * 6.283, sp = 0.4 + r() * 0.6, f = ((u * sp + r()) % 1), x0 = cx + Math.cos(a) * R * 1.6, y0 = cy + Math.sin(a) * R * 1.6, x1 = cx + Math.cos(a) * R * 0.6 * r(), y1 = cy + Math.sin(a) * R * 0.6 * r();
    const x = lerp(x0, x1, f), y = lerp(y0, y1, f); ctx.strokeStyle = NEON[i % 4]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - (x1 - x0) * 0.06, y - (y1 - y0) * 0.06); ctx.stroke(); }
  const pct = Math.min(1.6, u * 0.4); ctx.fillStyle = 'rgba(20,20,50,0.75)'; ctx.beginPath(); ctx.roundRect(140, 1640, 800, 60, 30); ctx.fill(); ctx.fillStyle = '#3ae0e8'; ctx.beginPath(); ctx.roundRect(150, 1650, 780 * pct / 100 * 10, 40, 20); ctx.fill();
  ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText(`downloading... ${pct.toFixed(1)}%`, 540, 1760);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['~100 GB each: ~820', 'exabytes in total'], 230, 0.15, { size: 84, out: 2.2 });
  say(ctx, u, ['That jams the internet', 'for ~2 months. Fine:', 'we’ll pre-install it'], 230, 2.3, { size: 74, out: OUT('download') });
}

// ================================================================ 4. everyone drops what they're doing: traffic chaos
function vDropG6(ctx, u) {
  const vy = 900, [sx, sy] = shakeOffset(u, 0.6, 3.6, 16); bgSky(ctx, ['#3a6ac8', '#9ab8e8', '#ffe0c0']); ctx.translate(sx, sy);
  neonCity(ctx, u, vy + 40, 6, 0.3); ctx.fillStyle = '#5a5a66'; ctx.fillRect(0, vy + 40, W, H);
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 8; ctx.setLineDash([60, 40]); ctx.beginPath(); ctx.moveTo(0, 1350); ctx.lineTo(W, 1350); ctx.stroke(); ctx.setLineDash([]);
  const t0 = 0.6, r = rng(7);
  for (let i = 0; i < 12; i++) { const lane = i % 3, x0 = -150 + (i * 137) % 1250, d = Math.max(0, u - t0), drift = 520 * Math.min(u, t0) + 520 * (1 - Math.exp(-d * 1.4)) / 1.4, x = ((x0 + drift) % (W + 300)) - 150;
    const rot = d > 0 ? (r() - 0.5) * Math.min(1.6, d * (0.6 + r())) : 0, y = [1180, 1330, 1480][lane] + (d > 0 ? (r() - 0.5) * Math.min(80, d * 60) : 0);
    carSide(ctx, x, y, 1.0, CARCOL[i % 8], rot); if (d > 0.3 && i % 3 === 0) dustBlast(ctx, x, y, d - 0.3, 30 + i, { n: 6, spread: 180, up: 110, col: '#d8d0c8' }); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Everyone drops what', 'they’re doing'], 230, 0.15, { size: 88, out: 2.0 });
  say(ctx, u, ['Tens of millions of cars:', 'nobody steering'], 230, 2.1, { size: 80, out: OUT('drop') });
}

// ================================================================ 5. cockpit: the pilots are playing too
function vCockpitG6(ctx, u) {
  bgSky(ctx, ['#2a3a8a', '#ff9a6a', '#ffd8a0']);
  ctx.fillStyle = '#f4ecf4'; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.ellipse(((i * 160 - u * 40) % (W + 300)) - 100, 1150 + (i % 3) * 30, 220, 40, 0, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#1e2a4a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 260); ctx.quadraticCurveTo(540, 180, 0, 260); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, 1460); ctx.quadraticCurveTo(540, 1360, W, 1460); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.fillRect(520, 200, 40, 1220); ctx.fillRect(0, 200, 50, 1300); ctx.fillRect(W - 50, 200, 50, 1300);
  ctx.fillStyle = '#2e3e66'; ctx.beginPath(); ctx.roundRect(110, 1540, 380, 96, 14); ctx.fill(); ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#5ad0a0'; ctx.fillText('AUTOPILOT ON', 300, 1602);
  ctx.fillStyle = '#2e3e66'; ctx.beginPath(); ctx.roundRect(590, 1540, 380, 96, 14); ctx.fill(); ctx.fillStyle = '#ffb84a'; ctx.fillText(`FUEL ${Math.round(lerp(38, 31, u / 4.5))}%`, 780, 1602);
  pad(ctx, 300, 1760, 1.4, -0.2); pad(ctx, 780, 1760, 1.4, 0.2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['~10,000 airliners fly', 'on autopilot...'], 260, 0.15, { size: 84, out: 2.0 });
  say(ctx, u, ['until the fuel', 'runs out'], 260, 2.1, { size: 92, out: OUT('cockpit') });
}

// ================================================================ 6. the power spike
function vPowerG6(ctx, u) {
  bgSky(ctx, ['#1e1a4a', '#2a2a6a', '#3a2a7a']);
  const k = easeOut(prog(u, 0.4, 0.9)), base = 1600, bw = 260;
  ctx.fillStyle = '#5ad0a0'; ctx.fillRect(200, base - 700, bw, 700); ctx.fillStyle = '#ff5ab8'; ctx.fillRect(620, base - 700 - 490 * k, bw, 700 + 490 * k);
  ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('normal', 330, base + 60); ctx.fillText('everyone plays', 750, base + 60);
  ctx.fillText('~3.5 TW', 330, base - 730); ctx.fillStyle = '#ffd25a'; ctx.fillText(`~${(3.5 + 2.5 * k).toFixed(1)} TW`, 750, base - 730 - 490 * k);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['Each setup draws ~300 W.', 'Together: +2.5 TW in', 'one second'], 230, 0.15, { size: 74, out: 2.4 });
  say(ctx, u, ['~70% more than the', 'world normally uses'], 230, 2.5, { size: 80, out: OUT('power') });
}

// ================================================================ 7. the grid fails: frequency crashes, breakers blow
function vGridG6(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0.6, 4, 12); bgSky(ctx, ['#2a2a6a', '#5a4a8a', '#c88aa0']); ctx.translate(sx, sy);
  ctx.fillStyle = '#4a4a6a'; ctx.fillRect(0, 1300, W, H);
  const tow = (x, s, fall) => { ctx.save(); ctx.translate(x, 1300); ctx.rotate(fall); ctx.strokeStyle = '#a8a8c0'; ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.moveTo(-60 * s, 0); ctx.lineTo(0, -520 * s); ctx.lineTo(60 * s, 0); ctx.moveTo(-90 * s, -380 * s); ctx.lineTo(90 * s, -380 * s); ctx.moveTo(-70 * s, -300 * s); ctx.lineTo(70 * s, -300 * s); ctx.stroke(); ctx.restore(); };
  const xs = [140, 420, 700, 980]; xs.forEach((x, i) => tow(x, 1.1, 0));
  for (let i = 0; i < 3; i++) { const sag = 60 + Math.sin(u * 3 + i) * 10; ctx.strokeStyle = '#8a8aa8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xs[i] - 99, 882); ctx.quadraticCurveTo((xs[i] + xs[i + 1]) / 2, 882 + sag, xs[i + 1] - 99, 882); ctx.stroke(); }
  for (let i = 0; i < 4; i++) { const t0 = 0.6 + i * 0.7, d = u - t0; if (d < 0) continue; const x = xs[i] + 99, y = 882; glow(ctx, x, y, 120 * R2(1 - d / 1.2), '200,230,255', 0.9); const r = rng(i);
    for (let j = 0; j < 20; j++) { const a = r() * 6.283, sp = 200 + r() * 400; ctx.fillStyle = '#ffe8a0'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * sp * d, y + Math.sin(a) * sp * d + 600 * d * d, 4, 0, 6.283); ctx.fill(); } }
  const hz = lerp(50, 46.8, easeIn2(prog(u, 0.3, 3.6))); ctx.fillStyle = 'rgba(20,20,50,0.8)'; ctx.beginPath(); ctx.roundRect(290, 1420, 500, 160, 20); ctx.fill();
  ctx.font = `900 80px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = hz < 49 ? '#ffb84a' : '#5ad0a0'; ctx.fillText(`${hz.toFixed(1)} Hz`, 540, 1530);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Grids can’t take it.', 'The frequency crashes'], 230, 0.15, { size: 84, out: 2.4 });
  say(ctx, u, ['Breakers blow.', 'Power plants trip offline'], 230, 2.5, { size: 80, out: OUT('grid') });
}

// ================================================================ 8. from orbit: the lights go out, continent by continent
function vBlackoutG6(ctx, u) {
  space(ctx, u);
  const R = 760, cx = 540, cy = 1250, lon0 = -40, v = gView(lon0, 30), k = easeInOut(prog(u, 0.3, 3.8));
  globe(ctx, cx, cy, R, { lon0, lat0: 30, t: u, ink: false, clouds: 0.15, sun: [0.3, -0.2, -0.93] });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const front = lerp(-140, 80, k); const g = ctx.createLinearGradient(0, 0, W, 0); const fx = (front + 140) / 220;
  g.addColorStop(0, 'rgba(6,10,30,0.92)'); g.addColorStop(Math.max(0.001, Math.min(0.999, fx)), 'rgba(6,10,30,0.92)'); g.addColorStop(Math.min(1, fx + 0.08), 'rgba(6,10,30,0)'); g.addColorStop(1, 'rgba(6,10,30,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Within seconds:', 'a global blackout'], 230, 0.15, { size: 92, out: OUT('blackout') });
}

// ================================================================ 9. the living room: every game turns off at once
function vScreenG6(ctx, u) {
  const off = u > 1.8; bgSky(ctx, off ? ['#0e1030', '#14163a', '#1a1c44'] : ['#3a2a6a', '#4a3a7a', '#5a4a8a']);
  ctx.fillStyle = off ? '#1a1a30' : '#2a2a4a'; ctx.fillRect(140, 500, 800, 480);
  if (!off) { ctx.save(); ctx.beginPath(); ctx.rect(160, 520, 760, 440); ctx.clip(); const g = ctx.createLinearGradient(0, 520, 0, 960); g.addColorStop(0, '#6a3a9a'); g.addColorStop(1, '#ff8ab8'); ctx.fillStyle = g; ctx.fillRect(160, 520, 760, 440);
    ctx.fillStyle = '#ffb0a0'; ctx.beginPath(); ctx.arc(540, 820, 120, Math.PI, 0); ctx.fill(); ctx.save(); ctx.translate(160, 520); ctx.scale(760 / W, 440 / 1000); neonCity(ctx, u, 1000, 9); ctx.restore();
    carSide(ctx, 200 + ((u * 300) % 800), 930, 0.6, '#3ae0e8'); ctx.restore(); }
  else { glow(ctx, 540, 740, 40 * R2(1 - (u - 1.8) / 0.4), '255,255,255', 0.8); }
  ctx.fillStyle = '#3a3a5a'; ctx.fillRect(500, 980, 80, 60); ctx.fillRect(400, 1040, 280, 14);
  ctx.fillStyle = '#5a4a8a'; ctx.beginPath(); ctx.roundRect(160, 1400, 760, 200, 40); ctx.fill(); ctx.fillRect(160, 1300, 760, 120);
  [[360, 4], [720, 7]].forEach(([x, s]) => person2(ctx, x, 1500, 300, { seed: s, t: u })); pad(ctx, 360, 1340, 0.8); pad(ctx, 720, 1340, 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 480, 0.55);
  say(ctx, u, ['And every game on', 'Earth turns off at once'], 230, 0.15, { size: 80, out: OUT('screen') });
}

// ================================================================ 10. the blackout on the ground
function vDarkG6(ctx, u) {
  bgSky(ctx, ['#0e1030', '#1a1c44', '#24265a']); stars(ctx, u, 0.9);
  neonCity(ctx, u, 1300, 11, 0); ctx.fillStyle = '#14163a'; ctx.fillRect(0, 1300, W, H);
  for (let i = 0; i < 4; i++) { const x = 160 + i * 250; ctx.fillStyle = '#3a3a5a'; ctx.fillRect(x - 6, 1050, 12, 260); ctx.fillStyle = '#2a2a3a'; ctx.beginPath(); ctx.roundRect(x - 26, 1000, 52, 120, 10); ctx.fill(); for (let j = 0; j < 3; j++) { ctx.fillStyle = '#4a4a5a'; ctx.beginPath(); ctx.arc(x, 1024 + j * 36, 12, 0, 6.283); ctx.fill(); } }
  const r = rng(12); for (let i = 0; i < 8; i++) { const x = r() * W, y = 1400 + r() * 400, a = 0.6 + 0.3 * Math.sin(u * 1.4 + i); glow(ctx, x, y, 70, '255,230,170', 0.4 * a); ctx.fillStyle = `rgba(255,240,200,${a})`; ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['No traffic lights. No', 'water pumps. People stuck', 'in ~20 million elevators'], 230, 0.15, { size: 72, out: OUT('dark') });
}

// ================================================================ 11. restarting the world
function vRestartG6(ctx, u) {
  bgSky(ctx, ['#1e1a4a', '#2a2a6a', '#3a2a7a']);
  const r = rng(13); for (let i = 0; i < 40; i++) { const x = r() * W, y = 900 + r() * 900, on = u > r() * 3.6; ctx.fillStyle = on ? 'rgba(255,230,170,0.9)' : 'rgba(80,80,110,0.6)'; ctx.fillRect(x, y, 16, 22); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Restarting grids from', 'zero takes days'], 230, 0.15, { size: 84, out: OUT('restart') });
  bigNum(ctx, u, '~$300 billion', 620, 1.2, { size: 100, color: '#ffd25a', out: OUT('restart') });
  bigNum(ctx, u, 'of work lost per day', 720, 1.4, { size: 60, color: '#ffffff', out: OUT('restart') });
}

// ================================================================ 12. toll
function vTollG6(ctx, u) {
  bgSky(ctx, ['#14163a', '#1e1e4a', '#2a2a5a']); stars(ctx, u, 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'Car crashes, falling planes,', 640, 0.2, { size: 56, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'no power:', 710, 0.3, { size: 56, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, '~1 million+', 870, 0.8, { size: 130, color: '#ffd25a', out: OUT('toll') });
  bigNum(ctx, u, 'deaths', 970, 1.0, { size: 60, color: '#ffffff', out: OUT('toll') });
}

// ================================================================ 13. final: a dark planet, one glowing screen on a generator
function vFinalG6(ctx, u) {
  space(ctx, u);
  const R = 700, cx = 540, cy = 1250;
  globe(ctx, cx, cy, R, { lon0: -80, lat0: 25, t: u, ink: false, clouds: 0.15, sun: [0.3, -0.2, -0.93], lights: false });
  const x = cx - 150, y = cy - 300, p = 0.75 + 0.25 * Math.sin(u * 1.2); glow(ctx, x, y, 40, '255,140,210', 0.9 * p); ctx.fillStyle = '#ff9ad0'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.283); ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The most anticipated', 'game in history crashed', 'the whole planet'], 230, 0.15, { size: 80, out: OUT('final') });
}
function vEndG6(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -80 + u * 4, lat0: 25, t: u, ink: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['WHAT IF,'], 720, 0.2, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 880, 0.4, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1000, 0.9, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ tsunami toolkit
let _OC = null;
function ocx() { if (!_OC) { _OC = document.createElement('canvas'); _OC.width = W; _OC.height = H; } const g = _OC.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H); return g; }
function gProj(v, cx, cy, R) { return ([lo, la]) => { let [x, y, z] = v(lo, la); if (z < 0) { const m = Math.hypot(x, y) || 1; x /= m; y /= m; } return [cx + x * R, cy + y * R]; }; }
function discsGlobe(g, P, srcs, d) { g.beginPath(); for (const s of srcs) { for (let b = 0; b <= 6.3; b += 0.06) { const p = P(dest(s[0], s[1], b, d)); b ? g.lineTo(...p) : g.moveTo(...p); } g.closePath(); } }
function landGlobe(g, P, v) { g.beginPath(); for (const poly of LAND) { let hid = 0; for (const [lo, la] of poly) if (v(lo, la)[2] < 0) hid++; if (hid > poly.length * 0.3 || poly.some(([lo, la]) => la < -60)) continue;
  poly.forEach((p, i) => i ? g.lineTo(...P(p)) : g.moveTo(...P(p))); g.closePath(); } }
// whole-ocean tsunami from orbit: passed water tinted, a bright front band, land masked out
function tsunamiGlobe(ctx, v, cx, cy, R, srcs, dRad, band = 0.035) {
  if (dRad <= 0) return; const P = gProj(v, cx, cy, R);
  let g = ocx(); g.fillStyle = '#bfe8ff'; discsGlobe(g, P, srcs, dRad); g.fill('nonzero');
  g.globalCompositeOperation = 'destination-out'; landGlobe(g, P, v); g.fill('nonzero'); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, R, 2 * Math.PI, 0, true); g.fill();
  ctx.save(); ctx.globalAlpha = 0.22; ctx.drawImage(_OC, 0, 0); ctx.restore();
  g = ocx(); g.fillStyle = '#ffffff'; discsGlobe(g, P, srcs, dRad); g.fill('nonzero');
  g.globalCompositeOperation = 'destination-out'; discsGlobe(g, P, srcs, Math.max(0, dRad - band)); g.fill('nonzero'); landGlobe(g, P, v); g.fill('nonzero'); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, R, 2 * Math.PI, 0, true); g.fill();
  ctx.save(); ctx.filter = 'blur(14px)'; ctx.globalAlpha = 0.9; ctx.drawImage(_OC, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.drawImage(_OC, 0, 0); ctx.restore();
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
