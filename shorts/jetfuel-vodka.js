// What if all the jet fuel in the world suddenly turned into vodka?
//
// NUMBERS (worked in python; sources: IATA/EIA/IWSR-style public figures, rounded and hedged):
//  - ~5 billion airline passengers/yr x ~2 h average flight / 8,760 h ≈ ~1.1 million people airborne at any moment;
//    ~10,000 airliners in the air at peak.
//  - World jet fuel use ~7.9 million barrels/day ≈ 1.26 billion L/day. Stocks in tanks/pipelines/planes: rough scaling from
//    US EIA stocks (~40 Mbbl, ~21% of world use) -> ~190 Mbbl ≈ ~30 billion L ≈ ~24 days of supply.
//  - World vodka output ~4.3 billion L/yr -> ~30 billion L ≈ ~7 years of the world's vodka.
//  - Vodka is 40% ethanol / 60% water: will not sustain combustion in a turbine -> every engine flames out. (Also freezes ~-27 °C;
//    wing tanks on long flights get colder than that.)
//  - Airliner glide ratio ~17:1 -> from 11 km, ~190 km of glide (~20 min). Most flights over land can reach some runway;
//    flights over open ocean (hundreds at any moment, mostly North Atlantic & Pacific) cannot.
//  - Air cargo carries ~1/3 of world trade by value (<1% by volume): medicines, chips, transplant organs.
//  - US/NATO "single fuel" policy: JP-8 powers aircraft AND many ground vehicles (e.g. the M1 Abrams turbine).
//  - Ethanol spills are biodegradable but consume dissolved oxygen as they break down -> fish kills near spills.
//  - Toll (rough, hedged): ocean ditchings (~800 planes x ~250 seats x ~0.8 load ≈ 160,000 aboard, few survive at night in
//    open-ocean swells) + failed dead-stick landings over land -> ~100,000+ deaths within the hour.
//  - Refineries make ~8 Mbbl/day: refilling the world's tanks takes ~a month; tanks/engines must be flushed first.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['swap', 4.5, [[0.3, 'drawback:1.6'], [1.8, 'impact']]],
  ['engine', 4.5, [[0.2, 'roar:2.0'], [1.4, 'drawback:2.8']]],
  ['cockpit', 4.5, [[0.2, 'air'], [0.4, 'heart:4.0']]],
  ['glide', 5.0, [[0.2, 'swell:4.6']]],
  ['airport', 4.5, [[0.3, 'air'], [1.6, 'impact'], [2.6, 'boom']]],
  ['highway', 4.5, [[0.2, 'air'], [1.0, 'roar:3.0'], [2.6, 'impact'], [2.65, 'boom']]],
  ['ditch', 5.0, [[0.2, 'rumble:4.6'], [2.0, 'impact'], [2.05, 'boom'], [2.1, 'roar:2.4']]],
  ['military', 4.0, [[0.2, 'drawback:2.0'], [1.2, 'impact']]],
  ['cargo', 4.0, [[0.2, 'rumble:3.8']]],
  ['river', 4.0, [[0.2, 'swell:3.6']]],
  ['toll', 4.5, [[0.2, 'heart:4.2']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if all the jet fuel in the world turned into vodka?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookV, swap: vSwapV, engine: vEngineV, cockpit: vCockpitV, glide: vGlideV, airport: vAirportV, highway: vHighwayV, ditch: vDitchV,
              military: vMilitaryV, cargo: vCargoV, river: vRiverV, toll: vTollV, final: vFinalV, end: vEndV };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.24, contrast: 1.08, saturate: 1.15, vignette: 0.35 });
}

// ---------------------------------------------------------------- aircraft
function airlinerSide(ctx, x, y, s, rot = 0, livery = '#3a86ff') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = livery; ctx.beginPath(); ctx.moveTo(-260, -30); ctx.lineTo(-300, -120); ctx.lineTo(-250, -120); ctx.lineTo(-190, -30); ctx.fill();
  ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.moveTo(-290, -10); ctx.quadraticCurveTo(-300, -36, -250, -36); ctx.lineTo(230, -36); ctx.quadraticCurveTo(300, -32, 310, 0); ctx.quadraticCurveTo(300, 30, 230, 34); ctx.lineTo(-240, 34); ctx.quadraticCurveTo(-290, 20, -290, -10); ctx.fill();
  ctx.fillStyle = livery; ctx.fillRect(-250, 6, 480, 10);
  ctx.fillStyle = '#5a7ab0'; for (let i = 0; i < 18; i++) ctx.fillRect(-200 + i * 22, -18, 10, 12); ctx.fillStyle = '#2a3a6a'; ctx.beginPath(); ctx.moveTo(260, -26); ctx.lineTo(290, -20); ctx.lineTo(282, -8); ctx.lineTo(258, -10); ctx.fill();
  ctx.fillStyle = '#d8dce6'; ctx.beginPath(); ctx.moveTo(-40, 10); ctx.lineTo(60, 10); ctx.lineTo(-60, 80); ctx.lineTo(-110, 80); ctx.fill();
  ctx.fillStyle = '#c8ccd6'; ctx.beginPath(); ctx.roundRect(-20, 30, 90, 36, 16); ctx.fill(); ctx.restore(); }
function airlinerTop(ctx, x, y, s, rot = 0, col = '#f4f6fa') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(0, 0, 60, 7, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-14, -48); ctx.lineTo(-24, -48); ctx.lineTo(-10, 0); ctx.lineTo(-24, 48); ctx.lineTo(-14, 48); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-46, 0); ctx.lineTo(-58, -18); ctx.lineTo(-62, -18); ctx.lineTo(-56, 0); ctx.lineTo(-62, 18); ctx.lineTo(-58, 18); ctx.fill(); ctx.restore(); }
function airlinerFront(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#d8dce6'; ctx.beginPath(); ctx.moveTo(-40, 10); ctx.lineTo(-380, 40); ctx.lineTo(-380, 52); ctx.lineTo(-40, 34); ctx.fill(); ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(380, 40); ctx.lineTo(380, 52); ctx.lineTo(40, 34); ctx.fill();
  ctx.fillStyle = '#c8ccd6'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 150, 56, 30, 0, 6.283); ctx.fill(); ctx.fillStyle = '#4a4a5a'; ctx.beginPath(); ctx.arc(sd * 150, 56, 20, 0, 6.283); ctx.fill(); ctx.fillStyle = '#c8ccd6'; }
  ctx.fillStyle = '#3a86ff'; ctx.fillRect(-6, -150, 12, 110); ctx.fillStyle = '#f4f6fa'; ctx.beginPath(); ctx.arc(0, 0, 48, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#2a3a6a'; ctx.beginPath(); ctx.ellipse(-16, -14, 14, 9, 0.2, 0, 6.283); ctx.ellipse(16, -14, 14, 9, -0.2, 0, 6.283); ctx.fill(); ctx.restore(); }
function landAt(lo, la) { const LM = landMap(); const x = Math.floor(((lo + 180) % 360 + 360) % 360 / 360 * LM.w), y = Math.floor((90 - la) / 180 * LM.h); return LM.m[Math.max(0, Math.min(LM.h - 1, y)) * LM.w + x] > 0.5; }
function flightDots() { if (flightDots._c) return flightDots._c; const r = rng(77), out = [];
  const hubs = [[-95, 38, 14, 7, 900], [10, 49, 12, 6, 700], [112, 32, 12, 7, 600], [78, 22, 8, 6, 200], [135, 36, 6, 4, 150], [-45, 50, 22, 6, 260], [-160, 35, 30, 10, 120], [150, -28, 10, 7, 80], [-60, -15, 12, 10, 120], [40, 30, 14, 8, 160], [20, 5, 18, 10, 60], [-30, 15, 14, 12, 60]];
  for (const [lo, la, dlo, dla, n] of hubs) for (let i = 0; i < n; i++) out.push([lo + (r() + r() - 1) * dlo, la + (r() + r() - 1) * dla, r() * 6.283]);
  flightDots._c = out; return out; }

// ================================================================ 1. hook: Earth at night, ~10,000 planes in the air
function vHookV(ctx, u) {
  space(ctx, u);
  const R = 700, cx = 540, cy = 1250, lon0 = -40 + u * 3, v = gView(lon0, 35);
  globe(ctx, cx, cy, R, { lon0, lat0: 35, t: u, ink: false, clouds: 0.2, sun: [0.3, -0.2, -0.93] });
  for (const [lo, la, h] of flightDots()) { const lo2 = lo + Math.cos(h) * u * 2, la2 = la + Math.sin(h) * u * 1, [x, y, z] = v(lo2, la2); if (z < 0.05) continue;
    ctx.fillStyle = 'rgba(255,200,110,0.35)'; ctx.fillRect(cx + x * R - 4, cy + y * R - 4, 8, 8); ctx.fillStyle = '#ffe8a8'; ctx.fillRect(cx + x * R - 2, cy + y * R - 2, 4, 4); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4)); shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if all the jet', 'fuel on Earth turned', 'into VODKA?'], 260, 0.15, { size: 88, out: OUT('hook'), mark: { line: 2, from: 5, to: 10, color: '#8ad8ff' } });
}

// ================================================================ 2. inside a wing tank: kerosene -> vodka
function vSwapV(ctx, u) {
  bgSky(ctx, ['#3a7ad8', '#8ac0f0', '#e8f4ff']);
  const k = easeInOut(prog(u, 0.3, 1.4));
  ctx.fillStyle = '#c8ccd6'; ctx.beginPath(); ctx.moveTo(-50, 700); ctx.lineTo(W + 50, 820); ctx.lineTo(W + 50, 1480); ctx.lineTo(-50, 1420); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(10, 760); ctx.lineTo(W - 10, 870); ctx.lineTo(W - 10, 1430); ctx.lineTo(10, 1370); ctx.closePath(); ctx.clip();
  ctx.fillStyle = mixHex('#e8b860', '#e8f4ff', k); ctx.fillRect(0, 900 + Math.sin(u * 2) * 8, W, 700); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(0, 900 + Math.sin(u * 2) * 8, W, 10);
  const r = rng(3); for (let i = 0; i < 40; i++) { const x = r() * W, y = 1400 - ((u * 120 * (0.5 + r()) + r() * 500) % 500); ctx.strokeStyle = `rgba(255,255,255,${0.6 * k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 4 + r() * 8, 0, 6.283); ctx.stroke(); }
  ctx.restore();
  for (const x of [200, 420, 640, 860]) { ctx.fillStyle = '#9aa0ae'; ctx.fillRect(x, 760 + (x / W) * 110, 16, 620); }
  ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#2a3a6a'; ctx.fillText(k < 0.5 ? 'JET FUEL' : '40% ALCOHOL · 60% WATER', 540, 1580);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Every wing, tanker and', 'pipeline: now vodka'], 230, 0.15, { size: 80, out: 2.3 });
  say(ctx, u, ['~30 billion liters: ~7 years', 'of the world’s vodka'], 230, 2.4, { size: 70, out: OUT('swap') });
}

// ================================================================ 3. engine cutaway: the flame dies
function vEngineV(ctx, u) {
  bgSky(ctx, ['#1e3a7a', '#2a4a8a', '#3a5a9a']);
  const fade = easeInOut(prog(u, 1.2, 2.8)), spin = u * lerp(8, 1.5, fade);
  ctx.fillStyle = '#c8ccd6'; ctx.beginPath(); ctx.moveTo(100, 700); ctx.lineTo(980, 760); ctx.lineTo(1040, 1000); ctx.lineTo(980, 1240); ctx.lineTo(100, 1300); ctx.quadraticCurveTo(40, 1000, 100, 700); ctx.fill();
  ctx.fillStyle = '#5a6a8a'; ctx.beginPath(); ctx.moveTo(130, 740); ctx.lineTo(960, 800); ctx.lineTo(1000, 1000); ctx.lineTo(960, 1200); ctx.lineTo(130, 1260); ctx.quadraticCurveTo(80, 1000, 130, 740); ctx.fill();
  // fan (blades drawn sparsely so the turn reads as slow, not flicker)
  ctx.save(); ctx.translate(190, 1000); for (let i = 0; i < 6; i++) { const a = spin * 0.3 + i * 1.047; ctx.strokeStyle = '#e8ecf4'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 30, Math.sin(a) * 240); ctx.stroke(); } ctx.restore();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = '#8a9ab8'; ctx.fillRect(320 + i * 40, 880 - i * 8, 18, 240 + i * 16); }
  ctx.fillStyle = '#3a4a6a'; ctx.fillRect(600, 860, 200, 280);
  const fl = 1 - fade; if (fl > 0) { glow(ctx, 700, 1000, 220 * fl, '255,170,60', 0.9 * fl); ctx.fillStyle = `rgba(255,190,80,${fl})`; ctx.beginPath(); ctx.ellipse(700, 1000, 110 * fl, 70 * fl, 0, 0, 6.283); ctx.fill(); }
  if (fade > 0) { const r = rng(4); for (let i = 0; i < 30; i++) { const x = 600 + ((u * 200 * (0.5 + r()) + r() * 400) % 420), y = 900 + r() * 200; puff(ctx, x, y, 10 + r() * 14, '#e8f6ff', 0.6 * fade); } }
  ctx.font = `800 34px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText('combustor', 700, 840);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['60% water won’t burn', 'in a jet engine'], 230, 0.15, { size: 84, out: 2.2 });
  say(ctx, u, ['~10,000 airliners: every', 'engine flames out'], 230, 2.3, { size: 76, out: OUT('engine') });
}

// ================================================================ 4. cockpit: silence at 11 km
function vCockpitV(ctx, u) {
  bgSky(ctx, ['#2a3a8a', '#ff9a6a', '#ffd8a0']);
  ctx.fillStyle = '#f4ecf4'; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.ellipse(((i * 160 - u * 40) % (W + 300)) - 100, 1150 + (i % 3) * 30, 220, 40, 0, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = '#e8d8e8'; ctx.fillRect(0, 1180, W, 400);
  ctx.fillStyle = '#1e2a4a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 260); ctx.quadraticCurveTo(540, 180, 0, 260); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, 1460); ctx.quadraticCurveTo(540, 1360, W, 1460); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.fillRect(520, 200, 40, 1220); ctx.fillRect(0, 200, 50, 1300); ctx.fillRect(W - 50, 200, 50, 1300);
  const p = 0.55 + 0.35 * Math.sin(u * 2 * Math.PI * 1.0);
  for (const [i, t] of [[0, 'ENG 1 FLAMEOUT'], [1, 'ENG 2 FLAMEOUT']]) { ctx.fillStyle = '#2e3e66'; ctx.beginPath(); ctx.roundRect(110 + i * 450, 1540, 410, 96, 14); ctx.fill(); ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = `rgba(255,190,60,${u > 0.5 ? p : 0.2})`; ctx.fillText(t, 315 + i * 450, 1602); }
  ctx.fillStyle = '#2e3e66'; ctx.beginPath(); ctx.roundRect(340, 1660, 400, 80, 14); ctx.fill(); ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#5ad0a0'; ctx.fillText(`ALT ${Math.round(lerp(11000, 10400, u / 4.5)).toLocaleString()} m`, 540, 1714);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['~1 million people in the', 'air. Then: silence'], 260, 0.15, { size: 80, out: 2.2 });
  say(ctx, u, ['From 11 km, an airliner', 'glides ~190 km'], 260, 2.3, { size: 80, out: OUT('cockpit') });
}

// ================================================================ 5. glide map from orbit: who can reach land?
function vGlideV(ctx, u) {
  space(ctx, u);
  const R = 760, cx = 540, cy = 1180, lon0 = -40, lat0 = 42, v = gView(lon0, lat0);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, clouds: 0.15, lights: false });
  const gr = 190 / 6371 * R, k = easeOut(prog(u, 0.3, 1.6));
  for (const [lo, la] of flightDots()) { const [x, y, z] = v(lo, la); if (z < 0.1) continue; const near = landAt(lo, la) || landAt(lo + 2.2, la) || landAt(lo - 2.2, la) || landAt(lo, la + 1.7) || landAt(lo, la - 1.7);
    const px = cx + x * R, py = cy + y * R; ctx.strokeStyle = near ? 'rgba(90,220,160,0.55)' : 'rgba(255,170,60,0.85)'; ctx.lineWidth = near ? 1.5 : 3; ctx.beginPath(); ctx.arc(px, py, gr * k * z, 0, 6.283); ctx.stroke();
    ctx.fillStyle = near ? '#5ad0a0' : '#ffb04a'; ctx.fillRect(px - 2.5, py - 2.5, 5, 5); }
  ctx.font = `800 34px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#5ad0a0'; ctx.fillText('● can reach land', 80, 1700); ctx.fillStyle = '#ffb04a'; ctx.fillText('● over open ocean', 560, 1700);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Over land, most can', 'reach some runway'], 230, 0.15, { size: 84, out: 2.4 });
  say(ctx, u, ['Over the ocean, hundreds', 'have nowhere to go'], 230, 2.5, { size: 80, out: OUT('glide') });
}

// ================================================================ 6. bird's-eye of a hub airport: everyone lands at once
function vAirportV(ctx, u) {
  ctx.fillStyle = '#7aa060'; ctx.fillRect(0, 0, W, H);
  const r = rng(6); for (let i = 0; i < 40; i++) { ctx.fillStyle = ['#8ab070', '#6a9050', '#9ab878'][i % 3]; ctx.fillRect(r() * W, r() * H, 100 + r() * 200, 60 + r() * 140); }
  ctx.save(); ctx.translate(540, 1000); ctx.rotate(-0.35);
  ctx.fillStyle = '#5a5a66'; ctx.fillRect(-700, -260, 1400, 90); ctx.fillRect(-700, 180, 1400, 90); ctx.fillStyle = '#8a8a96'; ctx.fillRect(-700, -40, 1400, 40);
  ctx.fillStyle = '#ffffff'; for (const y of [-215, 225]) for (let x = -660; x < 660; x += 90) ctx.fillRect(x, y - 3, 50, 6);
  ctx.fillStyle = '#d8d8e0'; ctx.fillRect(-300, 340, 600, 140); ctx.restore();
  // planes streaming in from every direction toward the two runways
  const lanes = [[-0.35, -215, 0], [-0.35, 225, 0.4], [-0.35, -215, 1.1], [-0.35, 225, 1.5], [-0.35, -215, 2.0], [-0.35, 225, 2.4], [-0.35, -40, 1.8]];
  for (const [rot, off, t0] of lanes) { const d = (u - t0) / 2.4; if (d < -0.6) continue; const along = lerp(-1300, 500, Math.min(1.2, d + 0.6) / 1.2), c = Math.cos(rot), s = Math.sin(rot);
    const x = 540 + along * c - off * s, y = 1000 + along * s + off * c, sc = lerp(2.6, 1.2, R2(d + 0.6)); airlinerTop(ctx, x, y, sc, rot);
    if (off === -40 && d > 0.3) dustBlast(ctx, x, y, d - 0.3, 61, { n: 12, spread: 260, up: 120, col: '#c8b898' }); }
  for (let i = 0; i < 5; i++) { const a = i * 1.25 + 0.5, rr = lerp(1200, 600, R2(u / 4.5)); airlinerTop(ctx, 540 + Math.cos(a) * rr, 1000 + Math.sin(a) * rr, 2.2, a + Math.PI); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Every nearby airport:', 'dozens of planes, all', 'landing at once'], 230, 0.15, { size: 76, out: 2.4 });
  say(ctx, u, ['No engines.', 'No second tries'], 230, 2.5, { size: 88, out: OUT('airport') });
}

// ================================================================ 7. a highway landing, head-on
function vHighwayV(ctx, u) {
  const vy = 960, k = easeIn2(prog(u, 0.3, 3.0)), [sx, sy] = shakeOffset(u, 2.6, 1.8, 26);
  bgSky(ctx, ['#2a4a9a', '#e8906a', '#ffd0a0']); ctx.translate(sx, sy);
  ctx.fillStyle = '#7a8a6a'; ctx.fillRect(0, vy, W, H);
  ctx.fillStyle = '#4a4850'; ctx.beginPath(); ctx.moveTo(W / 2 - 30, vy); ctx.lineTo(W / 2 + 30, vy); ctx.lineTo(W + 300, H); ctx.lineTo(-300, H); ctx.fill();
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 8; ctx.setLineDash([50, 40]); ctx.beginPath(); ctx.moveTo(W / 2, vy); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
  for (let i = 0; i < 6; i++) { const z = 1 + i * 1.6, s = 1 / z; for (const sd of [-1, 1]) { const x = W / 2 + sd * 640 * s, y = vy + 900 * s; ctx.fillStyle = '#8a8a96'; ctx.fillRect(x - 4 * s * 3, y - 500 * s, 8 * s * 3, 500 * s); } }
  for (let i = 0; i < 6; i++) { const z = 1.4 + ((i * 2.3 + u * 1.5) % 12), s = 1 / z; carRear(ctx, W / 2 + (i % 2 ? 1 : -1) * 200 * s, vy + 900 * s, s * 1.6, CARCOL[i % 8], i % 2 === 0); }
  const sc = lerp(0.15, 2.4, k), py = lerp(vy - 220, 1350, k); airlinerFront(ctx, W / 2, py, sc);
  if (u > 2.6) { const d = u - 2.6; for (let i = 0; i < 40; i++) { const r = rng(i), a = -Math.PI * r(), sp = 300 + r() * 600; ctx.fillStyle = r() < 0.5 ? '#ffe08a' : '#ffb04a'; ctx.beginPath(); ctx.arc(W / 2 + (r() - 0.5) * 700 + Math.cos(a) * sp * d, 1420 + Math.sin(a) * sp * d + 600 * d * d, 4 + r() * 6, 0, 6.283); ctx.fill(); }
    dustBlast(ctx, W / 2, 1500, d, 71, { n: 24, spread: 900, up: 400, col: '#c8b8a8' }); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Others aim for', 'highways and fields'], 230, 0.15, { size: 88, out: OUT('highway') });
}

// ================================================================ 8. night ditching in open-ocean swells
function vDitchV(ctx, u) {
  const vt = tm(u, 1.6, 3.6, 0.45), hit = 2.0, dt = Math.max(0, vt - hit), [sx, sy] = shakeOffset(u, 2.0, 2.2, 22);
  bgSky(ctx, ['#0e1a4a', '#1e2a6a', '#2a3a7a']); stars(ctx, u, 0.6); ctx.translate(sx, sy);
  glow(ctx, 820, 420, 200, '220,230,255', 0.5); ctx.fillStyle = '#f0f0f8'; ctx.beginPath(); ctx.arc(820, 420, 60, 0, 6.283); ctx.fill();
  const hz = 1100; ctx.fillStyle = '#1e3a6a'; ctx.fillRect(0, hz, W, H);
  for (let j = 0; j < 30; j++) { const q = (j + 1) / 30, y = hz + (H - hz) * q * q; ctx.strokeStyle = `rgba(200,220,255,${0.1 + q * 0.25})`; ctx.lineWidth = 1 + q * 4; ctx.beginPath(); for (let x = 0; x <= W; x += 30) { const yy = y + Math.sin(x * 0.01 * (2 - q) + u * 1.4 + j) * 30 * q; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
  const px = lerp(-200, 520, Math.min(1, vt / hit)) + dt * 120, py = lerp(700, hz + 40, Math.min(1, vt / hit)), rot = 0.12 + (dt > 0 ? Math.min(0.5, dt * 0.4) : 0);
  if (dt < 0.5) airlinerSide(ctx, px, py, 1.1, rot, '#2ec4b6');
  else { ctx.save(); ctx.translate(px - 120, py + dt * 30); ctx.rotate(rot); ctx.beginPath(); ctx.rect(-400, -200, 330, 400); ctx.clip(); airlinerSide(ctx, 120, 0, 1.1, 0, '#2ec4b6'); ctx.restore();
    ctx.save(); ctx.translate(px + 60, py + dt * 50); ctx.rotate(-rot * 0.6); ctx.beginPath(); ctx.rect(-70, -200, 400, 400); ctx.clip(); airlinerSide(ctx, -60, 0, 1.1, 0, '#2ec4b6'); ctx.restore(); }
  if (dt > 0) { const r = rng(8); for (let i = 0; i < 50; i++) { const a = -Math.PI * (0.1 + r() * 0.8), sp = 300 + r() * 700; puff(ctx, px + Math.cos(a) * sp * dt, hz + 40 + Math.sin(a) * sp * dt + 500 * dt * dt, 20 + r() * 40, '#e8f2ff', 0.8 * R2(1.6 - dt)); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Mid-ocean: ditching in', 'big swells, often at night'], 230, 0.15, { size: 76, out: 2.4 });
  say(ctx, u, ['Few survive', 'the impact'], 230, 2.5, { size: 92, out: OUT('ditch') });
}

// ================================================================ 9. every air force grounded; even tanks
function vMilitaryV(ctx, u) {
  bgSky(ctx, ['#4a6ab8', '#9ab0d8', '#e8e0d0']);
  ctx.fillStyle = '#a8a49a'; ctx.fillRect(0, 1100, W, H); ctx.fillStyle = '#8a867c'; ctx.fillRect(0, 1100, W, 20);
  for (let i = 0; i < 5; i++) { const x = 120 + i * 210, y = 1220 + (i % 2) * 60; ctx.save(); ctx.translate(x, y); ctx.scale(1.1, 1.1); ctx.fillStyle = '#8a92a4';
    ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(80, -6); ctx.lineTo(96, 0); ctx.lineTo(80, 6); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-40, -34); ctx.lineTo(-56, -34); ctx.lineTo(-30, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-60, -4); ctx.lineTo(-80, -40); ctx.lineTo(-90, -40); ctx.lineTo(-80, -2); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(200,230,255,0.6)'; ctx.beginPath(); ctx.ellipse(x - 10, y + 40, 50 * R2(u / 2), 10 * R2(u / 2), 0, 0, 6.283); ctx.fill(); }
  for (let i = 0; i < 2; i++) { const x = 300 + i * 480, y = 1600; ctx.fillStyle = '#6a7a5a'; ctx.beginPath(); ctx.roundRect(x - 170, y - 70, 340, 80, 18); ctx.fill(); ctx.fillRect(x - 70, y - 130, 150, 64); ctx.fillRect(x + 70, y - 108, 180, 18);
    ctx.fillStyle = '#4a5440'; ctx.beginPath(); ctx.roundRect(x - 190, y, 380, 60, 30); ctx.fill(); }
  ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.textAlign = 'center'; ctx.globalAlpha = R2((u - 1.2) / 0.4); ctx.fillText('NO FUEL', 540, 1460); ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Every air force: grounded.', 'Many armies’ tanks run', 'on jet fuel too'], 230, 0.15, { size: 74, out: OUT('military') });
}

// ================================================================ 10. the cargo that was in the air
function vCargoV(ctx, u) {
  bgSky(ctx, ['#2a3050', '#3a4060', '#4a5070']);
  const vy = 900; ctx.fillStyle = '#5a6070'; ctx.beginPath(); ctx.moveTo(0, 300); ctx.lineTo(W, 300); ctx.lineTo(700, vy); ctx.lineTo(380, vy); ctx.fill(); ctx.fillStyle = '#6a7080'; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.lineTo(700, vy); ctx.lineTo(380, vy); ctx.fill();
  const B = [['MEDICINE', '#2ec4b6'], ['MICROCHIPS', '#3a86ff'], ['DONOR ORGAN', '#ffbe0b'], ['VACCINES', '#ff7aa8'], ['PARCELS', '#c8a070'], ['FRESH FOOD', '#5ad07a']];
  B.forEach(([t, c], i) => { const z = 1 + (i >> 1) * 1.3, s = 1 / z, x = W / 2 + (i % 2 ? 1 : -1) * 300 * s, y = vy + 900 * s, w = 340 * s, h = 300 * s; ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, 16 * s); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = `900 ${Math.round(42 * s)}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(t, x, y - h / 2 + 14 * s); });
  ctx.fillStyle = `rgba(255,190,60,${0.15 + 0.1 * Math.sin(u * 2 * Math.PI * 0.8)})`; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['~1/3 of world trade by', 'value flies. All of it', 'stops'], 230, 0.15, { size: 78, out: OUT('cargo') });
}

// ================================================================ 11. leaking tanks suffocate a river
function vRiverV(ctx, u) {
  bgSky(ctx, ['#4a8ad8', '#a8d0f0', '#f0f4f8']);
  ctx.fillStyle = '#7aa060'; ctx.fillRect(0, 800, W, H);
  ctx.fillStyle = '#3a8ab0'; ctx.beginPath(); ctx.moveTo(-50, 1250); ctx.quadraticCurveTo(540, 1150, W + 50, 1300); ctx.lineTo(W + 50, 1650); ctx.quadraticCurveTo(540, 1500, -50, 1600); ctx.fill();
  for (let i = 0; i < 4; i++) { const x = 140 + i * 220; ctx.fillStyle = '#e8eaf0'; ctx.fillRect(x, 820, 170, 220); ctx.beginPath(); ctx.ellipse(x + 85, 820, 85, 22, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#c8ccd6'; ctx.fillRect(x, 1020, 170, 20); }
  const k = easeOut(prog(u, 0.2, 3.4)); ctx.fillStyle = 'rgba(220,240,255,0.55)'; ctx.beginPath(); ctx.moveTo(400, 1040); ctx.quadraticCurveTo(420, 1150, 300 + k * 0, 1250); ctx.lineTo(300 + 700 * k, 1300 + 80 * k); ctx.quadraticCurveTo(520, 1180, 470, 1040); ctx.fill();
  const r = rng(11); for (let i = 0; i < 18; i++) { const x = 200 + r() * 700, y = 1300 + r() * 240, a = R2((u - 1.4 - r() * 1.6) / 0.6); if (a <= 0) continue; ctx.globalAlpha = a; ctx.fillStyle = '#e8e8f0'; ctx.save(); ctx.translate(x + u * 20, y); ctx.scale(1, -1);
    ctx.beginPath(); ctx.ellipse(0, 0, 26, 9, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-38, -9); ctx.lineTo(-38, 9); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1; }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Leaking vodka strips', 'rivers of oxygen.', 'Fish suffocate'], 230, 0.15, { size: 80, out: OUT('river') });
}

// ================================================================ 12. toll
function vTollV(ctx, u) {
  bgSky(ctx, ['#1e2a5a', '#2a3a6a', '#3a4a7a']); stars(ctx, u, 0.5);
  const r = rng(12); for (let i = 0; i < 14; i++) { const x = r() * W, y = ((u * 120 * (0.5 + r()) + r() * H) % H); airlinerTop(ctx, x, y, 0.5, Math.PI / 2 + 0.3, 'rgba(255,255,255,0.18)'); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, '~1 million people airborne', 640, 0.2, { size: 62, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'Deaths in the first hour:', 800, 0.9, { size: 62, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, '~100,000+', 940, 1.2, { size: 130, color: '#ffd25a', out: OUT('toll') });
  say(ctx, u, ['mostly over the oceans'], 1060, 1.8, { size: 56, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 13. final: the empty night sky
function vFinalV(ctx, u) {
  space(ctx, u);
  const R = 760, cx = 540, cy = 1250, lon0 = -30 + u * 2, v = gView(lon0, 38);
  globe(ctx, cx, cy, R, { lon0, lat0: 38, t: u, ink: false, clouds: 0.2, sun: [0.3, -0.2, -0.93] });
  const k = easeInOut(prog(u, 0.3, 3.6));
  for (const [lo, la, h] of flightDots()) { if ((lo * 13 + la * 7) % 1 + 0 > 1 - k * 1.05) continue; const [x, y, z] = v(lo, la); if (z < 0.05) continue; ctx.fillStyle = `rgba(255,232,168,${1 - k})`; ctx.fillRect(cx + x * R - 2, cy + y * R - 2, 4, 4); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['For weeks, the sky', 'goes quiet'], 230, 0.15, { size: 92, out: 2.5 });
  say(ctx, u, ['Refineries need ~a month', 'to refill the world'], 230, 2.6, { size: 76, out: OUT('final') });
}
function vEndV(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -30 + u * 4, lat0: 30, t: u, ink: false });
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
