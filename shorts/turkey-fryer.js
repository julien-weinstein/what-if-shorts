// What if the Pacific were deep-fryer oil and we dropped in a frozen turkey the size of Mount Everest?
//
// PHYSICS (worked in python; sources: USDA turkey composition ~70% water; vegetable-oil properties; NOAA Pacific volume):
//  - Turkey: typical 6.35 kg (14 lb), ~38 x 28 x 20 cm, density ~1.0. Scale 8,849 m / 0.20 m = 44,245x.
//    Volume 6.35 L x 44,245^3 ≈ 550 km³ -> ~550 billion tonnes; ~385 billion tonnes of it is frozen water.
//    Semi-axes ~8.4 x 6.2 x 4.4 km; surface ~500 km².
//  - Oil: frying temp ~180 °C (not "boiling": oil smokes ~200-230 °C, flash point ~315 °C, autoignition ~400 °C+).
//    Hot oil density ~0.92 x (1 - 0.0007 x 160) ≈ 0.82 g/cm³ < frozen turkey (~0.95-1.0) -> it sinks.
//    Pacific depth ~4-5 km at the drop site (5°N 170°W) -> ~4 km of turkey sticks out.
//  - Dropped from 10 km: v = sqrt(2gh) ≈ 440 m/s (~1,600 km/h); KE ≈ 5.4e19 J ≈ 13 Gt TNT.
//  - Ice/water meeting 180 °C oil flashes to steam (~1,700x volume). The outer 1 m of skin+meat alone -> ~580 km³ of steam.
//  - Displacement raises the Pacific by ~3 mm.
//  - Waves: 550 km³ displaced suddenly ≈ a giant submarine landslide (Storegga, ~3,000 km³, left 10-20 m run-ups 1,000+ km away).
//    -> hundreds of m near the turkey, several m at distant coasts (est.). Speed sqrt(g h) ≈ 700 km/h (density-independent).
//    Arrival (from 5°N 170°W): Hawaii 3.1 h, Sydney 8.3 h, Tokyo 8.6 h, LA 8.7 h, Manila 10.7 h, Chile 15.6 h.
//  - Ignition: 180 °C oil on land meets sparks, power lines, engines (exhaust 300-600 °C), lava -> fires; nothing can put out a burning ocean.
//  - Oxygen: atmosphere holds ~1.2e18 kg O2; burning triglyceride oil uses ~2.9 kg O2 per kg -> ~4.5e14 m³ of oil
//    = 0.06% of the Pacific = a layer ~2.7 m thick across it.
//  - Cooking to the center by conduction: t ≈ L²/α = (4.4 km)² / 1.3e-7 m²/s ≈ 5 million years.
//  - Toll (rough): several-meter 180 °C oil waves + fires on every Pacific coast -> tens of millions on day one; if the
//    ocean fire kept spreading, potentially everyone.

const SCENES = [
  ['hook', 4.0, [[0, 'swell:3.0'], [2.0, 'air']]],
  ['scale', 4.5, [[0.3, 'impact'], [2.2, 'swell:2.0']]],
  ['cockpit', 4.5, [[0.2, 'air'], [0.4, 'roar:3.8'], [2.4, 'boom']]],
  ['splash', 5.0, [[0.9, 'impact'], [0.95, 'boom'], [1.0, 'roar:3.8'], [2.2, 'boom']]],
  ['section', 4.5, [[0.2, 'rumble:4.2'], [0.5, 'drawback:3.6']]],
  ['plume', 5.0, [[0.2, 'roar:4.6'], [0.6, 'boom'], [2.4, 'boom']]],
  ['wave', 5.0, [[0.2, 'swell:4.6'], [0.3, 'rumble:4.4']]],
  ['hawaii', 4.5, [[0.2, 'drawback:1.0'], [1.0, 'roar:3.4'], [2.4, 'boom'], [2.45, 'impact']]],
  ['ignite', 4.5, [[1.2, 'impact'], [1.3, 'boom'], [1.4, 'roar:3.0']]],
  ['seafire', 4.5, [[0.2, 'roar:4.2'], [1.5, 'boom']]],
  ['oxygen', 4.5, [[0.2, 'rumble:4.2'], [0.4, 'heart:4.0']]],
  ['toll', 4.0, [[0.2, 'heart:3.8']]],
  ['final', 5.0, [[0.2, 'swell:4.6']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if the Pacific was deep-fryer oil and we dropped in an Everest-sized frozen turkey?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 84, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHookT, scale: vScaleT, cockpit: vCockpitT, splash: vSplashT, section: vSectionT, plume: vPlumeT, wave: vWaveT, hawaii: vHawaiiT,
              ignite: vIgniteT, seafire: vSeaFireT, oxygen: vOxygenT, toll: vTollT, final: vFinalT, end: vEndT };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const DROP = [-170, 5];
const OIL = ['#ffd36a', '#f0a830', '#c87818'];
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.28, contrast: 1.08, saturate: 1.18, vignette: 0.35 });
}

// ---------------------------------------------------------------- the turkey (side view, facing right). s = half-width in px
function turkey(ctx, x, y, s, o = {}) {
  const { frost = 1, brown = 0, rot = 0 } = o; if (s <= 0) return;
  const skin = mixHex('#f6dccb', '#c86e1c', brown), dark = mixHex('#d8a890', '#7a3e10', brown), lite = mixHex('#fff4ea', '#ffc060', brown);
  const shade = (cx, cy, r) => { const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.45, r * 0.05, cx, cy, r * 1.1); g.addColorStop(0, lite); g.addColorStop(0.55, skin); g.addColorStop(1, dark); return g; };
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // drumsticks behind the body edge
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 0.62, -0.18); ctx.rotate(sd * 0.75);
    ctx.fillStyle = '#fbf3e6'; ctx.fillRect(-0.06, -0.78, 0.12, 0.4); for (const dx of [-0.07, 0.07]) { ctx.beginPath(); ctx.arc(dx, -0.8, 0.085, 0, 6.283); ctx.fill(); }
    ctx.strokeStyle = 'rgba(150,120,100,0.5)'; ctx.lineWidth = 0.015; ctx.beginPath(); ctx.arc(-0.07, -0.8, 0.085, 0, 6.283); ctx.arc(0.07, -0.8, 0.085, 0, 6.283); ctx.stroke();
    ctx.fillStyle = shade(0, -0.15, 0.4); ctx.beginPath(); ctx.moveTo(-0.1, -0.42); ctx.quadraticCurveTo(-0.36, -0.1, -0.2, 0.2); ctx.quadraticCurveTo(0, 0.32, 0.2, 0.2); ctx.quadraticCurveTo(0.36, -0.1, 0.1, -0.42); ctx.closePath(); ctx.fill(); ctx.restore(); }
  // body dome
  ctx.fillStyle = shade(0, -0.1, 1.0); ctx.beginPath(); ctx.moveTo(-1.0, 0.3); ctx.bezierCurveTo(-1.05, -0.45, -0.45, -0.72, 0, -0.72); ctx.bezierCurveTo(0.45, -0.72, 1.05, -0.45, 1.0, 0.3);
  ctx.quadraticCurveTo(0.9, 0.5, 0, 0.5); ctx.quadraticCurveTo(-0.9, 0.5, -1.0, 0.3); ctx.fill();
  // breast seam + wing tucks
  ctx.strokeStyle = dark; ctx.globalAlpha = 0.45; ctx.lineWidth = 0.03; ctx.beginPath(); ctx.moveTo(0, -0.7); ctx.quadraticCurveTo(0.04, -0.1, 0, 0.45); ctx.stroke();
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 0.75, 0.18, 0.2, 0.12, sd * 0.4, 0, 6.283); ctx.stroke(); }
  ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-0.35, -0.45, 0.28, 0.1, -0.3, 0, 6.283); ctx.fill();
  if (frost > 0) { ctx.globalAlpha = frost; const r = rng(7); ctx.fillStyle = 'rgba(236,248,255,0.9)';
    for (let i = 0; i < 90; i++) { const px = (r() - 0.5) * 1.9, py = -0.65 + r() * 1.1; if (py > 0.45 || Math.abs(px) > 0.98 * Math.sqrt(Math.max(0, 1 - Math.pow((py + 0.1) / 0.7, 2)))) continue; ctx.beginPath(); ctx.arc(px, py, 0.008 + r() * 0.02, 0, 6.283); ctx.fill(); }
    ctx.strokeStyle = 'rgba(225,245,255,0.95)'; ctx.lineWidth = 0.035; ctx.beginPath(); ctx.moveTo(-0.95, -0.15); ctx.bezierCurveTo(-0.9, -0.5, -0.45, -0.7, 0, -0.7); ctx.bezierCurveTo(0.45, -0.7, 0.9, -0.5, 0.95, -0.15); ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore();
}
function goldOcean(ctx, v, cx, cy, R, a = 0.6, u = 0) {
  const P = gProj(v, cx, cy, R), g = ocx(); const gr = g.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R); gr.addColorStop(0, '#ffe08a'); gr.addColorStop(0.6, '#f0a830'); gr.addColorStop(1, '#a8601a');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill(); g.globalCompositeOperation = 'destination-out'; landGlobe(g, P, v); g.fill('nonzero');
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(_OC, 0, 0); ctx.restore();
}
function oilSea(ctx, u, hy, seed = 1) {
  const g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, '#ffe08a'); g.addColorStop(0.4, '#f0a830'); g.addColorStop(1, '#b8681a'); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy);
  const r = rng(seed); for (let j = 0; j < 30; j++) { const q = (j + 1) / 30, y = hy + (H - hy) * q * q; for (let i = 0; i < 5 + q * 6; i++) { const x = ((r() * W + u * 40 * (0.5 + q)) % (W + 100)) - 50, w = 20 + q * 110;
    ctx.strokeStyle = `rgba(255,250,220,${0.2 + q * 0.3})`; ctx.lineWidth = 1 + q * 3; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x, y - 3 - q * 6, x + w, y); ctx.stroke(); } }
  for (let i = 0; i < 26; i++) { const x = r() * W, y = hy + 10 + r() * (H - hy), rr = ((u * 30 + i * 13) % 14); ctx.strokeStyle = `rgba(255,255,230,${0.35 * (1 - rr / 14)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, rr * (0.5 + (y - hy) / 600), 0, 6.283); ctx.stroke(); }
}
function oilWave(ctx, u, x, base, h, seed = 3) {
  if (h <= 0) return;
  const g = ctx.createLinearGradient(0, base - h, 0, base); g.addColorStop(0, '#ffe7a0'); g.addColorStop(0.35, '#f0a830'); g.addColorStop(1, '#a8601a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + h * 0.9, base); ctx.lineTo(x, base);
  ctx.quadraticCurveTo(x - h * 0.05, base - h * 0.6, x + h * 0.05, base - h * 0.95); ctx.quadraticCurveTo(x - h * 0.25, base - h * 1.05, x - h * 0.32, base - h * 0.82);
  ctx.quadraticCurveTo(x - h * 0.05, base - h * 1.25, x + h * 0.6, base - h * 1.05); ctx.lineTo(W + 900, base - h * 0.95); ctx.lineTo(W + 900, base); ctx.fill();
  const r = rng(seed); for (let i = 0; i < 26; i++) { const a = r() * 3.1; puff(ctx, x - h * 0.2 + Math.cos(a) * h * 0.35 + Math.sin(u * 3 + i) * 8, base - h * 0.95 - Math.sin(a) * h * 0.2, h * (0.08 + r() * 0.12), '#fff0c0', 0.85); }
  for (let i = 0; i < 18; i++) { const px = x + r() * h * 1.4, py = base - h * (1.1 + r() * 0.3) - ((u * 120 * (0.5 + r())) % (h * 0.6)); puff(ctx, px, py, h * (0.05 + r() * 0.08), '#f4f0ea', 0.35); }
}
function oilFlame(ctx, x, y, s, u, seed = 1) { const r = rng(seed);
  glow(ctx, x, y - s * 0.4, s * 1.6, '255,150,50', 0.7);
  for (let i = 0; i < 7; i++) { const dx = (r() - 0.5) * s * 1.2, h = s * (0.8 + r() * 0.9) * (0.85 + 0.15 * Math.sin(u * 7 + i * 2)), w = s * 0.22;
    ctx.fillStyle = i % 2 ? '#ff9a2a' : '#ffc84a'; ctx.beginPath(); ctx.moveTo(x + dx - w, y); ctx.quadraticCurveTo(x + dx - w * 0.6, y - h * 0.6, x + dx + Math.sin(u * 5 + i) * w * 0.6, y - h); ctx.quadraticCurveTo(x + dx + w * 0.6, y - h * 0.6, x + dx + w, y); ctx.fill(); }
  ctx.fillStyle = '#fff2b0'; ctx.beginPath(); ctx.ellipse(x, y - s * 0.15, s * 0.3, s * 0.2, 0, 0, 6.283); ctx.fill(); }

// ================================================================ 1. hook: the golden Pacific from space; the turkey descends
function vHookT(ctx, u) {
  space(ctx, u);
  const R = 820, cx = 540, cy = 1500, v = gView(-165, 8);
  globe(ctx, cx, cy, R, { lon0: -165, lat0: 8, t: u, ink: false, clouds: 0.25, lights: false }); goldOcean(ctx, v, cx, cy, R, 0.75, u);
  glow(ctx, cx, cy - R * 0.3, R * 0.8, '255,210,120', 0.25);
  const ty = lerp(-300, 760, easeOut(R2(u / 3.6))); turkey(ctx, 540, ty, 250, { frost: 1, rot: Math.sin(u * 0.8) * 0.08 });
  for (let i = 0; i < 20; i++) { const r = rng(i); puff(ctx, 540 + (r() - 0.5) * 500, ty - 200 - ((u * 200 + r() * 400) % 500), 6 + r() * 10, '#e8f6ff', 0.6); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.9) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.5, 3.9)); shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.8 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if the Pacific', 'was deep-fryer oil...'], 230, 0.15, { size: 86, out: 1.9, mark: { line: 1, from: 4, to: 19, color: '#f0a830' } });
  say(ctx, u, ['and we dropped in a', 'frozen turkey the', 'size of Everest?'], 230, 2.0, { size: 86, out: OUT('hook') });
}

// ================================================================ 2. scale: Everest vs the bird
function vScaleT(ctx, u) {
  bgSky(ctx, ['#3a7ad8', '#8ac0f0', '#e8f4ff']);
  const base = 1640, km = 86, k = easeOut(prog(u, 0.2, 1.4));
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(0, base - 11 * km); ctx.lineTo(W, base - 11 * km); ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.translate(200 + u * 50, base - 11 * km); ctx.fillStyle = '#f4f4f8'; ctx.fillRect(-40, -6, 80, 12); ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-24, 24); ctx.lineTo(10, 0); ctx.fill(); ctx.restore();
  ctx.font = `700 28px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.fillText('airliners cruise here (11 km)', W - 30, base - 11 * km - 16);
  // Everest
  ctx.fillStyle = '#7a7aa0'; ctx.beginPath(); ctx.moveTo(-200, base); ctx.lineTo(150, base - 8.85 * km * k); ctx.lineTo(260, base - 7.6 * km * k); ctx.lineTo(420, base); ctx.fill();
  ctx.fillStyle = '#f4f8ff'; ctx.beginPath(); ctx.moveTo(70, base - 7.6 * km * k); ctx.lineTo(150, base - 8.85 * km * k); ctx.lineTo(220, base - 8.1 * km * k); ctx.lineTo(190, base - 7.4 * km * k); ctx.lineTo(140, base - 7.8 * km * k); ctx.fill();
  // turkey: height 1.37 s = 8.85 km
  const s = 8.85 * km / 1.22 * easeBack(R2((u - 0.6) / 0.8)); turkey(ctx, 1010, base - 0.5 * s, s, { frost: 1 });
  ctx.fillStyle = '#5a8a5a'; ctx.fillRect(0, base, W, H);
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(400, base); ctx.lineTo(400, base - 8.85 * km * k); ctx.stroke();
  ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#ffd25a'; ctx.save(); ctx.translate(386, base - 4.4 * km); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText('8.8 km', 0, 0); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['8.8 km tall.', '~550 billion tonnes', 'of frozen turkey'], 230, 0.15, { size: 84, out: OUT('scale') });
}

// ================================================================ 3. cockpit POV: it drops past the windshield
function vCockpitT(ctx, u) {
  const roll = Math.sin(u * 0.7) * 0.04 + (u > 2.4 ? Math.sin((u - 2.4) * 9) * 0.03 * Math.exp(-(u - 2.4) * 2) : 0);
  ctx.save(); ctx.translate(540, 900); ctx.rotate(roll); ctx.translate(-540, -900);
  bgSky(ctx, ['#2a6ad0', '#7ab4ec', '#d8ecff']); oilSea(ctx, u, 1080, 4);
  ctx.fillStyle = 'rgba(255,230,170,0.35)'; ctx.fillRect(-200, 1060, W + 400, 30);
  const ty = lerp(-300, 2200, prog(u, 0.2, 3.4)), ts = 300;
  for (let i = 0; i < 40; i++) { const r = rng(i + 50); puff(ctx, 790 + (r() - 0.5) * 500, ty - 300 - r() * 1000, 10 + r() * 30, '#eef8ff', 0.55); }
  turkey(ctx, 790, ty, ts, { frost: 1, rot: 0.2 + u * 0.05 });
  if (u > 2.4) { const k = R2((u - 2.4) / 1.6); ctx.fillStyle = `rgba(255,240,200,${0.35 * k})`; ctx.beginPath(); ctx.ellipse(620, 1090, 300 + k * 500, 30 + k * 80, 0, 0, 6.283); ctx.fill(); for (let i = 0; i < 14; i++) puff(ctx, 620 + (i - 7) * 70, 1060 - k * 240 * (1 - Math.abs(i - 7) / 8), 50 + k * 60, '#fff4d8', 0.7 * k); }
  ctx.restore();
  // cockpit frame (navy, not black)
  ctx.fillStyle = '#1e2a4a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 260); ctx.quadraticCurveTo(540, 180, 0, 260); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(540, 1380, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillRect(520, 200, 40, 1250); ctx.fillRect(0, 200, 50, 1300); ctx.fillRect(W - 50, 200, 50, 1300);
  ctx.fillStyle = '#2e3e66'; for (let i = 0; i < 6; i++) { ctx.fillRect(90 + i * 160, 1560, 130, 90); ctx.fillStyle = '#5ad0a0'; ctx.fillRect(100 + i * 160, 1570, 110, 6 + (i % 3) * 20); ctx.fillStyle = '#2e3e66'; }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.5);
  say(ctx, u, ['Dropped from 10 km,', 'it hits at ~1,600 km/h'], 260, 0.15, { size: 80, out: OUT('cockpit') });
}

// ================================================================ 4. the splash (slow motion)
function vSplashT(ctx, u) {
  const vt = tm(u, 0.9, 4.0, 0.4), hit = 1.0, dt = Math.max(0, vt - hit), [sx, sy] = shakeOffset(u, 0.9, 3, 30);
  bgSky(ctx, ['#3a7ad8', '#9ac8f0', '#ffe8c0']); ctx.translate(sx, sy);
  const sea = 1250; oilSea(ctx, u, sea, 6);
  const ty = vt < hit ? lerp(-500, sea - 120, vt / hit) : sea - 120 + Math.min(500, dt * 260);
  turkey(ctx, 540, ty, 420, { frost: Math.max(0, 1 - dt * 0.6), rot: 0.1 });
  ctx.fillStyle = '#f0a830'; ctx.fillRect(0, sea + 40, W, H);
  oilSea(ctx, u, sea + 40, 7);
  if (dt > 0) { const hh = 1100 * (1 - Math.exp(-dt * 1.6)) * (dt < 2.4 ? 1 : Math.max(0, 1 - (dt - 2.4) * 0.5)), wd = 460 + dt * 260;
    for (const side of [-1, 1]) { ctx.fillStyle = '#f6b440'; ctx.beginPath(); ctx.moveTo(540 + side * 120, sea + 60);
      for (let i = 0; i <= 12; i++) { const f = i / 12, x = 540 + side * (120 + f * wd), y = sea - hh * Math.sin(f * Math.PI) * (0.7 + 0.3 * ((i * 7) % 3) / 2) - (i % 2 ? hh * 0.12 : 0); ctx.lineTo(x, y); }
      ctx.lineTo(540 + side * (120 + wd), sea + 60); ctx.fill(); }
    const r = rng(9); for (let i = 0; i < 160; i++) { const a = -Math.PI * (0.08 + r() * 0.84), sp = 500 + r() * 900, x = 540 + Math.cos(a) * sp * dt, y = sea + Math.sin(a) * sp * dt + 420 * dt * dt;
      if (y < sea + 60) { ctx.fillStyle = r() < 0.5 ? '#ffd36a' : '#f0a030'; ctx.beginPath(); ctx.arc(x, y, 6 + r() * 16, 0, 6.283); ctx.fill(); } }
    for (let i = 0; i < 30; i++) { const a = r() * 3.14, rr = (80 + r() * 200) * (0.4 + dt); puff(ctx, 540 + Math.cos(a) * rr * 1.6, sea - 120 - Math.sin(a) * rr - dt * 160, 60 + r() * 80 + dt * 40, '#fbfbf6', 0.8); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.55);
  say(ctx, u, ['SPLASH: a crown of', 'hot oil kilometers high'], 230, 0.15, { size: 82, out: 2.6 });
  say(ctx, u, ['~13 gigatons of', 'impact energy'], 230, 2.7, { size: 88, out: OUT('splash') });
}

// ================================================================ 5. cross-section: it sinks, frozen core, steam pouring off the skin
function vSectionT(ctx, u) {
  const surf = 900, floor = 1600, s = 1050;
  bgSky(ctx, ['#4a8ad8', '#a8d0f0', '#ffe8c8']);
  const og = ctx.createLinearGradient(0, surf, 0, floor); og.addColorStop(0, '#ffd36a'); og.addColorStop(1, '#b86a18'); ctx.fillStyle = og; ctx.fillRect(0, surf, W, floor - surf);
  ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, floor, W, H); ctx.fillStyle = '#6a5038'; ctx.fillRect(0, floor + 120, W, H);
  const cyT = floor - 0.5 * s, cxT = 420;
  turkey(ctx, cxT, cyT, s, { frost: 0.4, brown: 0.15 * R2(u / 4) });
  ctx.save(); ctx.translate(cxT, cyT); ctx.scale(s, s); ctx.fillStyle = 'rgba(170,215,255,0.75)'; ctx.beginPath(); ctx.ellipse(-0.05, -0.1, 0.72 - 0.02 * u, 0.42 - 0.01 * u, 0, 0, 6.283); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 0.006; ctx.setLineDash([0.03, 0.02]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  ctx.fillStyle = 'rgba(240,160,48,0.45)'; ctx.fillRect(0, surf, W, floor - surf); ctx.fillStyle = 'rgba(255,245,210,0.9)'; ctx.fillRect(0, surf - 4, W, 8);
  ctx.font = `900 40px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.fillText('frozen core', cxT - 40, cyT - 40); ctx.font = `800 34px ${FONT}`; ctx.fillText('−18 °C', cxT - 40, cyT + 6);
  // steam bubbles from the submerged skin
  const r = rng(11); for (let i = 0; i < 90; i++) { const a = -Math.PI * r(), px = cxT + Math.cos(a) * s * 0.98, py0 = cyT + Math.sin(a) * s * 0.58 * 0.9 + s * 0.05; if (py0 < surf) continue;
    const y = py0 - ((u * 260 * (0.6 + r()) + r() * 600) % Math.max(1, py0 - surf)); puff(ctx, px + Math.sin(u * 3 + i) * 10 + (px - cxT) * 0.05, y, 6 + r() * 14, '#fffbe8', 0.75); }
  for (let i = 0; i < 16; i++) { const x = 60 + r() * 960; puff(ctx, x, surf - 20 - ((u * 120 + i * 40) % 160), 30 + r() * 40, '#fbfbf6', 0.6); }
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#7a3a0a'; ctx.fillText('180 °C oil', 760, 1300);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(990, surf); ctx.lineTo(990, floor); ctx.stroke(); ctx.font = `800 32px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.fillText('5 km', 975, 1260);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrimB(ctx, 1560, 0.75);
  say(ctx, u, ['It sinks: hot oil is lighter.', '~4 km still sticks out'], 1690, 0.15, { size: 60, out: 2.3 });
  say(ctx, u, ['Its ice flashes to steam,', '1,700x bigger'], 1690, 2.4, { size: 62, out: OUT('section') });
}

// ================================================================ 6. the boil-over: a steam plume into the stratosphere
function vPlumeT(ctx, u) {
  const [sx, sy] = shakeOffset(u, 0.6, 2.4, 10); bgSky(ctx, ['#2a5ab8', '#7ab0e8', '#ffe0b0']); ctx.translate(sx, sy);
  const hz = 1250; oilSea(ctx, u, hz, 12);
  const k = easeOut(prog(u, 0.2, 4.6)), foam = 200 + k * 700;
  ctx.fillStyle = 'rgba(255,248,225,0.85)'; ctx.beginPath(); ctx.ellipse(540, hz + 40, foam, foam * 0.12, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(240,168,48,0.9)'; ctx.beginPath(); ctx.ellipse(540, hz + 40, foam * 0.8, foam * 0.09, 0, 0, 6.283); ctx.fill();
  turkey(ctx, 540, hz - 40, 230, { frost: 0.3, brown: 0.2 });
  const top = lerp(hz - 200, 260, k), r = rng(13);
  for (let i = 0; i < 70; i++) { const f = r(), y = lerp(hz - 120, top, f), w = 120 + f * 160 + Math.sin(u + i) * 20; puff(ctx, 540 + (r() - 0.5) * w * 1.4, y, w * (0.5 + r() * 0.5), mixHex('#fbfbf6', '#d8dce8', f), 0.9); }
  for (let i = 0; i < 26; i++) { const a = r() * 3.14, rr = 200 + r() * 360 * k; puff(ctx, 540 + Math.cos(a) * rr * 1.5, top + 60 - Math.sin(a) * rr * 0.4, 90 + r() * 80, '#f0f2f8', 0.9); }
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(0, 560); ctx.lineTo(W, 560); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `700 28px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText('stratosphere', 30, 546);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 520, 0.55);
  say(ctx, u, ['The world’s biggest', 'fryer boil-over'], 230, 0.15, { size: 88, out: 2.3 });
  say(ctx, u, ['A steam plume punches', 'into the stratosphere'], 230, 2.4, { size: 78, out: OUT('plume') });
}

// ================================================================ 7. from orbit: rings of hot oil race across the Pacific
function vWaveT(ctx, u) {
  space(ctx, u);
  const R = 560, cx = W / 2, cy = 1180, lon0 = lerp(-170, -160, u / 5), v = gView(lon0, 8);
  globe(ctx, cx, cy, R, { lon0, lat0: 8, t: u, ink: false, lights: false, clouds: 0.2 }); goldOcean(ctx, v, cx, cy, R, 0.75, u);
  const hrs = 16 * easeInOut(prog(u, 0.2, 4.6));
  tsunamiGlobe(ctx, v, cx, cy, R, [DROP], hrs * 713 / 6371, 0.045, '#fff0c0', '#ffffff');
  const P = ([lo, la]) => { const [x, y, z] = v(lo, la); return [cx + x * R, cy + y * R, z]; };
  const [ex, ey] = P(DROP); turkey(ctx, ex, ey - 6, 16, { frost: 0, brown: 0.3 }); puff(ctx, ex, ey - 40, 22, '#fbfbf6', 0.8);
  for (const [n, lo, la, h] of [['Hawaii', -157.9, 21.3, 3.1], ['Sydney', 151.2, -33.9, 8.3], ['Tokyo', 139.7, 35.7, 8.6], ['LA', -118.2, 34, 8.7], ['Manila', 121, 14.6, 10.7], ['Chile', -71.6, -33, 15.6]]) {
    const [x, y, z] = P([lo, la]); if (z < 0.05) continue; const hit = hrs >= h; ctx.fillStyle = hit ? '#ffd25a' : '#ffffff'; ctx.beginPath(); ctx.arc(x, y, hit ? 12 : 8, 0, 6.283); ctx.fill();
    ctx.font = `800 ${hit ? 32 : 26}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = hit ? '#ffd25a' : 'rgba(255,255,255,0.85)'; ctx.fillText(hit ? `${n} ${h} h` : n, x, y - 22); }
  ctx.font = `900 90px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText(`+${hrs.toFixed(1)} h`, 540, 1820);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Waves of hot oil race', 'out at ~700 km/h'], 230, 0.15, { size: 84, out: OUT('wave') });
}

// ================================================================ 8. Waikiki: a wall of 180 °C oil
function vHawaiiT(ctx, u) {
  const wx = lerp(W + 700, -1400, easeInOut(prog(u, 0.5, 4.4))), [sx, sy] = shakeOffset(u, 2.4, 2.0, 22);
  bgSky(ctx, ['#3a7ad0', '#9ac8f0', '#ffe8c8']); ctx.translate(sx, sy);
  ctx.fillStyle = '#5a9a5a'; ctx.beginPath(); ctx.moveTo(620, 1150); ctx.quadraticCurveTo(820, 820, 1000, 900); ctx.quadraticCurveTo(1060, 960, W + 50, 1150); ctx.fill();
  oilSea(ctx, u, 1150, 14); ctx.fillStyle = '#f0e0b0'; ctx.fillRect(0, 1330, W, 120);
  for (let i = 0; i < 6; i++) { const x = 20 + i * 100, h = 260 + (i % 3) * 120; ctx.fillStyle = ['#f4f0e8', '#e8e0d0', '#d8e8f0'][i % 3]; ctx.fillRect(x, 1330 - h, 86, h); ctx.fillStyle = 'rgba(80,150,200,0.45)'; for (let k = 0; k < h / 26; k++) ctx.fillRect(x + 6, 1330 - h + 8 + k * 26, 74, 9); }
  for (let i = 0; i < 8; i++) palm(ctx, 40 + i * 140, 1460, 300, Math.sin(u * 2 + i) * 10 - (wx < 40 + i * 140 + 200 ? 160 : 0));
  ctx.fillStyle = '#e8d8c0'; ctx.fillRect(0, 1450, W, H);
  massCrowd(ctx, u, { n: 110, yFar: 1460, yNear: 1900, sFar: 50, sNear: 170, x0: 40, x1: 1040, seed: 15, col: '#2a3a6a', flow: -200, panic: 1, arms: 0.5 });
  oilWave(ctx, u, wx, 1500, 1050, 16);
  if (wx + 300 < W) { const x0 = Math.max(-20, wx + 300); const g = ctx.createLinearGradient(0, 500, 0, H); g.addColorStop(0, '#ffd36a'); g.addColorStop(1, '#b86a18'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, H);
    for (let x = x0; x <= W + 20; x += 20) ctx.lineTo(x, 560 + Math.sin(x * 0.01 + u * 3) * 40); ctx.lineTo(W + 20, H); ctx.fill();
    const r = rng(17); for (let i = 0; i < 40; i++) { const x = x0 + r() * (W - x0 + 40), y = 560 + r() * 1200; puff(ctx, x, y, 12 + r() * 26, '#fff0c0', 0.5); puff(ctx, x, 520 - r() * 200, 30 + r() * 40, '#f4f0ea', 0.25); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Hawaii, 3 hours later:', 'a wall of 180 °C oil'], 230, 0.15, { size: 82, out: OUT('hawaii') });
}

// ================================================================ 9. ignition: a spark, and the flooded street goes up
function vIgniteT(ctx, u) {
  const sp = 1.2, k = easeIn2(R2((u - sp) / 2.6)), [sx, sy] = shakeOffset(u, sp, 1.4, 18);
  bgSky(ctx, ['#4a6ab8', '#9aa8d8', '#ffd0a0']); ctx.translate(sx, sy);
  const vy = 900, lvl = 1500;
  cityLayer(ctx, u, { base: vy + 120, seed: 18, hMin: 160, hMax: 520, wMin: 60, wMax: 140, gap: 6, col: '#7a7ab0', win: 'rgba(255,240,200,0.45)', winP: 0.4, ws: 6 });
  ctx.fillStyle = '#d8c8b8'; ctx.beginPath(); ctx.moveTo(0, 300); ctx.lineTo(300, vy); ctx.lineTo(300, H); ctx.lineTo(0, H); ctx.fill(); ctx.beginPath(); ctx.moveTo(W, 300); ctx.lineTo(780, vy); ctx.lineTo(780, H); ctx.lineTo(W, H); ctx.fill();
  ctx.fillStyle = '#9a9aa8'; ctx.fillRect(300, vy, 480, H);
  const og = ctx.createLinearGradient(0, vy + 80, 0, H); og.addColorStop(0, '#ffd36a'); og.addColorStop(1, '#c8781a'); ctx.fillStyle = og; ctx.beginPath(); ctx.moveTo(0, lvl - 200); ctx.lineTo(300, vy + 80); ctx.lineTo(780, vy + 80); ctx.lineTo(W, lvl - 200); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  carSide(ctx, 420, vy + 110, 0.7, CARCOL[1]); carSide(ctx, 640, vy + 160, 1.0, CARCOL[2], 0.1);
  // power pole + falling line
  ctx.fillStyle = '#6a5a4a'; ctx.fillRect(700, 500, 18, 560); ctx.fillRect(650, 520, 120, 12);
  const drop = easeIn2(R2((u - 0.4) / 0.8)); ctx.strokeStyle = '#2a2a3a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(760, 526); ctx.quadraticCurveTo(820, 700, lerp(1080, 760, drop), lerp(560, vy + 90, drop)); ctx.stroke();
  if (u > sp && u < sp + 0.5) glow(ctx, 760, vy + 90, 140, '255,255,220', 0.9 * (1 - (u - sp) / 0.5));
  if (k > 0) { const front = lerp(vy + 90, H + 300, k), r = rng(19);
    for (let i = 0; i < 46; i++) { const f = r(), y = lerp(vy + 90, front, f), s = 30 + (y - vy) * 0.25; if (y > front) continue; const half = lerp(240, 600, (y - vy) / (H - vy)); oilFlame(ctx, 540 + (r() - 0.5) * 2 * half, y, s, u, i); }
    for (let i = 0; i < 18; i++) puff(ctx, 300 + r() * 480 + u * 30, vy - 100 - r() * 600 * k, 60 + r() * 90, '#6a5a7a', 0.55); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Hot oil + one spark:', 'power lines, engines, lava'], 230, 0.15, { size: 72, out: 2.0 });
  say(ctx, u, ['The coasts', 'catch fire'], 230, 2.1, { size: 100, out: OUT('ignite') });
}

// ================================================================ 10. from high altitude: the sea itself burns
function vSeaFireT(ctx, u) {
  bgSky(ctx, ['#1e2a6a', '#5a5aa0', '#ffb070']);
  const hz = 760; oilSea(ctx, u, hz, 20);
  ctx.fillStyle = '#8a7a6a'; ctx.beginPath(); ctx.moveTo(W, hz); ctx.quadraticCurveTo(800, 1100, 900, H); ctx.lineTo(W, H); ctx.fill();
  const k = easeOut(prog(u, 0, 4.4)), r = rng(21);
  for (let i = 0; i < 90; i++) { const y = hz + 10 + Math.pow(r(), 1.3) * (H - hz), x0 = W - 80 - r() * W * 1.3 * k, s = 10 + (y - hz) * 0.12; if (x0 < -50) continue; oilFlame(ctx, x0, y, s, u, i); }
  for (let i = 0; i < 16; i++) { const x = W - r() * W * k, y = hz - r() * 300; for (let j = 0; j < 4; j++) puff(ctx, x - j * 50 - u * 30, y - j * 90, 50 + j * 30, '#5a4a6a', 0.45); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.6);
  say(ctx, u, ['Nothing can put it out.', 'The ocean itself burns'], 230, 0.15, { size: 80, out: OUT('seafire') });
}

// ================================================================ 11. the oxygen math
function vOxygenT(ctx, u) {
  space(ctx, u);
  const R = 1600, cx = 540, cy = 2500, v = gView(-160, 0);
  globe(ctx, cx, cy, R, { lon0: -160, lat0: 0, t: u, ink: false, clouds: 0.3, lights: false, atmo: '120,180,255' }); goldOcean(ctx, v, cx, cy, R, 0.7, u);
  const k = easeInOut(prog(u, 1.4, 4.2)), pct = 21 * (1 - k);
  ctx.strokeStyle = `rgba(140,200,255,${0.6 * (1 - k) + 0.05})`; ctx.lineWidth = 40; ctx.beginPath(); ctx.arc(cx, cy, R + 30, 0, 6.283); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(140, 1060, 800, 56); ctx.fillStyle = mixHex('#5ad0ff', '#f0a830', k); ctx.fillRect(140, 1060, 800 * pct / 21, 56);
  ctx.font = `900 54px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText(`oxygen in the air: ${pct.toFixed(0)}%`, 540, 1030);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Burning a layer just', '~2.7 m deep off the Pacific'], 230, 0.15, { size: 76, out: OUT('oxygen') });
  say(ctx, u, ['would use up all the', 'oxygen in the air'], 1250, 1.2, { size: 80, x: W / 2, align: 'center', out: OUT('oxygen') });
}

// ================================================================ 12. toll
function vTollT(ctx, u) {
  bgSky(ctx, ['#2a2050', '#3a2a6a', '#5a3a7a']);
  const r = rng(22); for (let i = 0; i < 40; i++) { const x = r() * W, y = H - ((u * 80 * (0.5 + r()) + r() * H) % H); ctx.fillStyle = `rgba(255,190,90,${0.5 + 0.3 * Math.sin(u + i)})`; ctx.beginPath(); ctx.arc(x, y, 3 + r() * 4, 0, 6.283); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  bigNum(ctx, u, 'Pacific coasts, day one:', 640, 0.2, { size: 60, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'tens of millions', 760, 0.5, { size: 92, color: '#ffd25a', out: OUT('toll') });
  bigNum(ctx, u, 'If the fire keeps spreading:', 980, 1.6, { size: 60, color: '#ffffff', out: OUT('toll') });
  bigNum(ctx, u, 'everyone', 1110, 1.9, { size: 120, color: '#ffd25a', out: OUT('toll') });
}

// ================================================================ 13. final: Earth's last Thanksgiving
function vFinalT(ctx, u) {
  space(ctx, u);
  const R = 600, cx = W / 2, cy = 1150, lon0 = -165 + u * 2, v = gView(lon0, 10);
  globe(ctx, cx, cy, R, { lon0, lat0: 10, t: u, ink: false, lights: false, clouds: 0.1 }); goldOcean(ctx, v, cx, cy, R, 0.75, u);
  const P = gProj(v, cx, cy, R);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const poly of LAND) { if (poly.length < 10) continue; let hid = 0; for (const [lo, la] of poly) if (v(lo, la)[2] < 0) hid++; if (hid > poly.length * 0.5) continue;
    for (const [lw, col] of [[26, 'rgba(255,140,40,0.35)'], [8, 'rgba(255,190,90,0.9)']]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let pen = false; for (const p of poly) { const z = v(...p)[2]; if (z > 0.05) { pen ? ctx.lineTo(...P(p)) : ctx.moveTo(...P(p)); pen = true; } else pen = false; } ctx.stroke(); } }
  const r = rng(23); for (let i = 0; i < 40; i++) { const a = r() * 6.283, rr = Math.sqrt(r()) * R; puff(ctx, cx + Math.cos(a) * rr + u * 10, cy + Math.sin(a) * rr, 40 + r() * 70, '#7a6a80', 0.25); }
  ctx.restore();
  const [ex, ey] = P(DROP); glow(ctx, ex, ey, 90, '255,200,120', 0.6); turkey(ctx, ex, ey - 10, 80, { frost: 0, brown: 0.85 }); for (let i = 0; i < 6; i++) puff(ctx, ex + i * 8, ey - 60 - i * 26 - u * 10, 16 + i * 5, '#fbfbf6', 0.5);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Earth’s last', 'Thanksgiving'], 230, 0.15, { size: 110, out: 2.5 });
  say(ctx, u, ['And the turkey? Cooked to', 'the middle in ~5 million years'], 230, 2.6, { size: 68, out: OUT('final') });
}
function vEndT(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: -165 + u * 4, lat0: 10, t: u, ink: false });
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
function tsunamiGlobe(ctx, v, cx, cy, R, srcs, dRad, band = 0.035, tint = '#bfe8ff', front = '#ffffff') {
  if (dRad <= 0) return; const P = gProj(v, cx, cy, R);
  let g = ocx(); g.fillStyle = tint; discsGlobe(g, P, srcs, dRad); g.fill('nonzero');
  g.globalCompositeOperation = 'destination-out'; landGlobe(g, P, v); g.fill('nonzero'); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, R, 2 * Math.PI, 0, true); g.fill();
  ctx.save(); ctx.globalAlpha = 0.22; ctx.drawImage(_OC, 0, 0); ctx.restore();
  g = ocx(); g.fillStyle = front; discsGlobe(g, P, srcs, dRad); g.fill('nonzero');
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
