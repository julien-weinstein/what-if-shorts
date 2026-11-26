// What if all the water on Earth turned into beer?
//
// TONE: serious. This would be an extinction-level event. Premise: every drop of liquid water outside living cells,
// including oceans, lakes, rivers, groundwater, taps, IV bags and rain, becomes a typical lager.
//
// SCIENCE (worked/checked):
//  - Lager: ~5% alcohol (ABV), pH ~4.2, ~3-4% carbohydrate, ~5 g/L dissolved CO2, almost no salt.
//  - Oceans: 1.335 billion km³. Seawater pH ~8.1 -> 4.2 is ~8,000x more acidic; calcium carbonate shells and coral dissolve.
//  - Ethanol is lethal to fish at ~1-1.5% (96 h LC50 for trout ~11-13 g/L); 5% kills most aquatic animals within hours;
//    marine species also lose their salt balance. Amphibians absorb water through their skin.
//  - IV saline -> beer: nearly salt-free fluid in a vein makes red blood cells swell and burst (haemolysis).
//    ~4 million people rely on dialysis; each haemodialysis session uses ~120 L of purified water.
//  - A lactating dairy cow drinks ~100 L/day: at 5% that's ~5 L of pure alcohol. Agriculture uses ~70% of freshwater
//    withdrawals; high ethanol concentrations damage plant roots (crop toll hedged).
//  - People need ~2-3 L/day; 3 L of 5% beer ≈ 118 g alcohol ≈ 8 US standard drinks; alcohol drives fluid loss.
//    Infants and children can't drink it at all. Water can be boiled back out (distillation), but that needs fuel and
//    equipment billions don't have.
//  - Reactors must keep removing decay heat after shutdown; foaming, sugary coolant fouls systems (meltdown risk hedged).
//  - Microbes feeding on ~35 g/L of sugar would use up dissolved oxygen (~7 mg/L) almost at once: suffocating seas.
//  - The fizz: 1.335e18 m³ × 5 kg/m³ ≈ 6.7e18 kg CO2, more than the atmosphere's entire mass (5.15e18 kg).
//    Just the ocean's mixed layer (~50 m) degassing over weeks adds ~9e16 kg: ~1.2% CO2 by volume, ~25-30x today.
//    More escapes as deeper water mixes up over years; at several % CO2 the air becomes unbreathable for air-breathers.
//    Climate: ~3°C per CO2 doubling -> 420 ppm to ~12,000 ppm is ~+14°C long-term (est.).
//  - Toll (est., hedged): billions of people; most species.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['rules', 4.5, [[0.2, 'rumble:4.2']]],
  ['coast', 4.0, [[0.2, 'roar:3.8']]],
  ['hospital', 5.0, [[0.2, 'heart:4.8']]],
  ['sea', 5.0, [[0.2, 'rumble:4.8']]],
  ['lakes', 4.0, [[0.2, 'swell:3.8']]],
  ['farm', 4.5, [[0.2, 'rumble:4.2']]],
  ['rain', 4.0, [[0.2, 'roar:3.8']]],
  ['drink', 5.0, [[0.2, 'heart:4.8']]],
  ['reactor', 4.0, [[0.2, 'rumble:3.8'], [2.4, 'impact']]],
  ['dead', 4.5, [[0.2, 'rumble:4.2']]],
  ['fizz', 5.0, [[0.2, 'roar:4.8']]],
  ['long', 5.0, [[0.2, 'heart:4.8'], [2.6, 'boom']]],
  ['final', 4.5, [[0.2, 'swell:4.2']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if all the water on Earth turned into beer?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 70, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, rules: vRules, coast: vCoast, hospital: vHospital, sea: vSea, lakes: vLakes, farm: vFarm, rain: vBeerRain, drink: vDrink,
              reactor: vReactor, dead: vDead, fizz: vFizz, long: vLong, final: vFinal, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const BEER = '#e0a020', BEER_D = '#a86a10', FOAM = '#fff6e0';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, Math.max(0, tt - START[n]))]), 0.26);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2, saturate: 1.1 });
}
function puff(ctx, x, y, r, col, a = 1) { if (r <= 0) return; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, mixHex(col, '#ffffff', 0.2)); g.addColorStop(1, col);
  ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function bubbles(ctx, u, x0, y0, w, h, n, seed, col = 'rgba(255,248,220,0.8)') { const r = rng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) { const f = ((u * (0.3 + r() * 0.6) + r()) % 1), x = x0 + r() * w + Math.sin(u * 3 + i) * 4, y = y0 + h - f * h; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 5, 0, 6.283); ctx.fill(); } }
function foamLine(ctx, y, u, amp = 14, col = FOAM) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, y + 30); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, y + Math.sin(x * 0.03 + u * 2) * amp - Math.abs(Math.sin(x * 0.011 + u)) * amp); ctx.lineTo(W, y + 40); ctx.lineTo(0, y + 40); ctx.fill();
  const r = rng(Math.floor(y)); for (let i = 0; i < 40; i++) { const x = r() * W; ctx.beginPath(); ctx.arc(x, y + Math.sin(x * 0.03 + u * 2) * amp - 6, 8 + r() * 14, 0, 6.283); ctx.fill(); } }

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1150);
  const k = easeInOut(prog(u, 0.6, 2.4)), R = 420, cx = W / 2, cy = 1150;
  globe(ctx, cx, cy, R, { lon0: -30 + u * 6, lat0: 15, t: u, ink: false });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R * 1.1 * k + 1); g.addColorStop(0, 'rgba(230,170,40,0.75)'); g.addColorStop(0.9, 'rgba(200,130,20,0.7)'); g.addColorStop(1, 'rgba(200,130,20,0)');
  ctx.globalCompositeOperation = 'color'; ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if all the water', 'on Earth turned', 'into beer?'], 300, 0.15, { size: 92, out: OUT('hook'), mark: { line: 2, from: 5, to: 9, color: '#e0a020' } });
}

// ================================================================ 2. the rules: everything, and what beer really is
function vRules(ctx, u) {
  bgSky(ctx, ['#1e1a14', '#2a2418', '#3a3020']);
  const gx = W / 2 + 160, gy = 1150, gw = 300, gh = 600;
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.moveTo(gx - gw / 2, gy - gh / 2); ctx.lineTo(gx + gw / 2, gy - gh / 2); ctx.lineTo(gx + gw * 0.4, gy + gh / 2); ctx.lineTo(gx - gw * 0.4, gy + gh / 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(gx - gw / 2 + 8, gy - gh / 2 + 80); ctx.lineTo(gx + gw / 2 - 8, gy - gh / 2 + 80); ctx.lineTo(gx + gw * 0.4 - 8, gy + gh / 2 - 8); ctx.lineTo(gx - gw * 0.4 + 8, gy + gh / 2 - 8); ctx.closePath(); ctx.clip();
  ctx.fillStyle = BEER; ctx.fillRect(gx - gw, gy - gh, 2 * gw, 2 * gh); bubbles(ctx, u, gx - gw / 2, gy - gh / 2 + 80, gw, gh - 90, 50, 3); ctx.restore();
  ctx.fillStyle = FOAM; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(gx - gw / 2 + 30 + i * 42, gy - gh / 2 + 70, 34, 0, 6.283); ctx.fill(); }
  const items = [['95%', 'water'], ['5%', 'alcohol'], ['pH 4.2', 'acidic'], ['~4%', 'sugars'], ['5 g/L', 'CO₂ gas'], ['~0', 'salt']];
  items.forEach(([v, lab], i) => { const at = 0.4 + i * 0.3; if (u < at) return; const k = easeBack(R2((u - at) / 0.35)); ctx.save(); ctx.translate(250, 760 + i * 130); ctx.scale(k, k);
    ctx.font = `900 54px ${FONT}`; ctx.textAlign = 'right'; ctx.fillStyle = '#ffd25a'; ctx.fillText(v, 20, 0); ctx.font = `800 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.fillText(lab, 40, 0); ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Every ocean, river, tap,', 'raindrop and IV drip.', 'And beer isn’t just water…'], 230, 0.15, { size: 66, out: OUT('rules') });
}

// ================================================================ 3. the coast, the moment it happens
function vCoast(ctx, u) {
  bgSky(ctx, ['#4f9be0', '#8ccaf0', '#d0ecff']);
  ctx.fillStyle = BEER; ctx.fillRect(0, 980, W, 700); ctx.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = 0; i < 10; i++) ctx.fillRect(0, 1000 + i * 60, W, 3);
  bubbles(ctx, u, 0, 980, W, 700, 160, 5);
  for (let k = 0; k < 3; k++) foamLine(ctx, 1240 + k * 150 + Math.sin(u * 1.2 + k) * 20, u + k, 16);
  ctx.fillStyle = '#e8d29a'; ctx.beginPath(); ctx.moveTo(0, 1680); ctx.quadraticCurveTo(W / 2, 1620, W, 1680); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = FOAM; ctx.beginPath(); ctx.ellipse(540, 1700, 520, 60, 0, 0, 6.283); ctx.fill();
  [[220, 1], [880, 4]].forEach(([x, s]) => person2(ctx, x, 1840, 320, { seed: s, t: u }));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['1.3 billion cubic km', 'of it. Foam rolls', 'onto every beach.'], 230, 0.15, { size: 76, out: OUT('coast') });
}

// ================================================================ 4. hospitals: beer in the IV, no water for dialysis
function vHospital(ctx, u) {
  bgSky(ctx, ['#dff0ec', '#c8e4de', '#b0d8d0']);
  ctx.fillStyle = '#c8ccd4'; ctx.fillRect(300, 400, 12, 1000); ctx.fillRect(220, 400, 180, 10);
  ctx.save(); ctx.translate(306, 560); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.roundRect(-90, -20, 180, 260, 30); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(-82, -12, 164, 244, 26); ctx.clip(); ctx.fillStyle = BEER; ctx.fillRect(-90, 40 + u * 6, 180, 300); bubbles(ctx, u, -80, 40, 160, 190, 18, 7); ctx.restore();
  ctx.font = `900 28px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#1b2a4a'; ctx.fillText('SALINE', 0, 20); ctx.strokeStyle = '#e63946'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-56, 12); ctx.lineTo(56, 12); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = BEER; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(306, 820); ctx.quadraticCurveTo(320, 1100, 520, 1260); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(380, 1250, 600, 140, 30); ctx.fill(); ctx.fillStyle = '#ffd9c0'; ctx.beginPath(); ctx.arc(860, 1230, 70, 0, 6.283); ctx.fill(); ctx.fillStyle = '#8ab8e0'; ctx.beginPath(); ctx.roundRect(400, 1200, 400, 90, 30); ctx.fill();
  // microscope inset: red blood cells swelling and bursting
  const ix = 760, iy = 760, ir = 210; ctx.fillStyle = '#2a0a10'; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(ix, iy, ir - 4, 0, 6.283); ctx.clip(); const r = rng(9);
  for (let i = 0; i < 12; i++) { const x = ix + (r() - 0.5) * 340, y = iy + (r() - 0.5) * 340, sw = 1 + 0.6 * prog(u, 0.6 + r() * 1.5, 2.6 + r()), burst = u > 2.8 + r() * 1.4;
    if (burst) { ctx.strokeStyle = 'rgba(220,60,70,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 30 * sw, 0.4, 2.2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 30 * sw, 3.2, 5.0); ctx.stroke(); continue; }
    ctx.fillStyle = '#d8283a'; ctx.beginPath(); ctx.ellipse(x, y, 28 * sw, 24 * sw, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#b01a2a'; ctx.beginPath(); ctx.ellipse(x, y, 12 * sw, 9 * sw, 0, 0, 6.283); ctx.fill(); }
  ctx.restore(); ctx.font = `800 26px ${FONT}`; ctx.fillStyle = '#1b2a4a'; ctx.textAlign = 'center'; ctx.fillText('red blood cells', ix, iy + ir + 40);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Hospital drips turn to beer.', 'Without salt, blood cells', 'swell and burst.'], 230, 0.15, { size: 64, out: 2.6 });
  say(ctx, u, ['4 million dialysis patients', 'lose their clean water'], 1560, 2.6, { size: 60, weight: 900, out: OUT('hospital') });
}

// ================================================================ 5. the oceans: drunk, acidic, dying
function vSea(ctx, u) {
  bgSky(ctx, ['#7a5a18', '#5a400c', '#3a2a06']);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = 120 + i * 210; ctx.fillStyle = 'rgba(255,210,120,0.06)'; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 160, 1300); ctx.lineTo(x - 120, 1300); ctx.fill(); } ctx.restore();
  bubbles(ctx, u, 0, 300, W, 1500, 120, 11);
  const k = easeInOut(prog(u, 0.4, 4.2));
  // coral reef fizzing away
  for (let i = 0; i < 8; i++) { const x = 80 + i * 130, h = (180 + (i % 3) * 60) * (1 - 0.8 * k); ctx.fillStyle = mixHex(['#ff7aa0', '#ffbe0b', '#7ae0ff'][i % 3], '#d8d0c0', k);
    for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc(x + (j - 2) * 18, 1800 - j * h / 5, 22 * (1 - 0.5 * k), 0, 6.283); ctx.fill(); }
    if (k > 0.1) bubbles(ctx, u, x - 40, 1500, 80, 300, 8, i + 30, 'rgba(255,255,255,0.7)'); }
  // fish turning belly-up and rising
  const r = rng(12); for (let i = 0; i < 16; i++) { const x = r() * W, y0 = 600 + r() * 900, dead = u > 0.6 + r() * 2.8, y = dead ? y0 - (u - 0.6) * 90 * r() : y0 + Math.sin(u * 3 + i) * 20, s = 0.6 + r() * 0.8;
    ctx.save(); ctx.translate(x + (dead ? 0 : Math.sin(u + i) * 30), y); ctx.scale(s, dead ? -s : s); ctx.fillStyle = dead ? '#b8b0a0' : '#5aa0c8'; ctx.beginPath(); ctx.ellipse(0, 0, 50, 20, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(-76, -20); ctx.lineTo(-76, 20); ctx.fill();
    if (dead) { ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(24, -8); ctx.lineTo(34, 2); ctx.moveTo(34, -8); ctx.lineTo(24, 2); ctx.stroke(); } ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['5% alcohol, 8,000× more', 'acidic than seawater.', 'Most sea life dies in hours.'], 230, 0.15, { size: 64, out: 2.7 });
  say(ctx, u, ['Shells and coral reefs', 'dissolve'], 230, 2.8, { size: 84, out: OUT('sea') });
}

// ================================================================ 6. lakes, rivers, and the creatures that breathe through their skin
function vLakes(ctx, u) {
  bgSky(ctx, ['#6a9a5a', '#8ab87a', '#b8d8a0']);
  ctx.fillStyle = BEER_D; ctx.fillRect(0, 1100, W, H); bubbles(ctx, u, 0, 1100, W, 820, 80, 14);
  for (let i = 0; i < 6; i++) { const x = 140 + i * 160; ctx.fillStyle = '#4a7a3a'; ctx.beginPath(); ctx.ellipse(x, 1140, 70, 18, 0, 0, 6.283); ctx.fill(); }
  const k = easeInOut(prog(u, 0.4, 2.6));
  ctx.save(); ctx.translate(540, 1080); ctx.scale(2.4, 2.4); ctx.fillStyle = mixHex('#5aa040', '#9a9a7a', k); ctx.beginPath(); ctx.ellipse(0, 0, 60, 34, 0, 0, 6.283); ctx.fill();
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 26, -30, 16, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s * 26, -32, 9, 0, 6.283); ctx.fill(); ctx.fillStyle = '#1b1b2e';
    if (k > 0.7) { ctx.lineWidth = 3; ctx.strokeStyle = '#1b1b2e'; ctx.beginPath(); ctx.moveTo(s * 26 - 6, -38); ctx.lineTo(s * 26 + 6, -26); ctx.moveTo(s * 26 + 6, -38); ctx.lineTo(s * 26 - 6, -26); ctx.stroke(); } else { ctx.beginPath(); ctx.arc(s * 26, -32, 4, 0, 6.283); ctx.fill(); } ctx.fillStyle = mixHex('#5aa040', '#9a9a7a', k); }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Every lake and river.', 'Frogs drink through', 'their skin.'], 230, 0.15, { size: 80, out: OUT('lakes') });
}

// ================================================================ 7. livestock and farms
function dairyCow(ctx, x, y, s, k) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(k * 0.25);
  ctx.fillStyle = '#f4f4f4'; ctx.beginPath(); ctx.ellipse(0, -110, 140, 70, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#1b1b2e'; ctx.beginPath(); ctx.ellipse(-40, -130, 40, 28, 0.3, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(60, -100, 30, 22, -0.2, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#f4f4f4'; ctx.beginPath(); ctx.ellipse(-150, -80 + k * 40, 46, 38, 0.4, 0, 6.283); ctx.fill(); ctx.fillStyle = '#f0b0b0'; ctx.beginPath(); ctx.ellipse(-180, -64 + k * 40, 24, 16, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#e8e8e8'; for (const lx of [-90, -50, 60, 100]) ctx.fillRect(lx, -60, 22, 70 - k * 30); ctx.restore(); }
function vFarm(ctx, u) {
  bgSky(ctx, ['#7ab8e8', '#b8dcf0', '#f0e8c8']);
  ctx.fillStyle = '#8ab05a'; ctx.fillRect(0, 1100, W, H);
  ctx.fillStyle = '#8a8a90'; ctx.fillRect(140, 1500, 800, 90); ctx.fillStyle = BEER; ctx.fillRect(152, 1500, 776, 40); ctx.fillStyle = FOAM; ctx.fillRect(152, 1494, 776, 10);
  const wob = Math.min(1, prog(u, 1.4, 3.6));
  dairyCow(ctx, 360, 1500, 1.1, wob * (0.5 + 0.5 * Math.sin(u * 3))); dairyCow(ctx, 760, 1480, 0.9, wob * (0.5 + 0.5 * Math.sin(u * 3 + 1)));
  for (let i = 0; i < 20; i++) { const r = rng(i); const x = r() * W, y = 1120 + r() * 100; ctx.strokeStyle = mixHex('#5a9a2a', '#b8a060', wob); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y + 40); ctx.quadraticCurveTo(x + wob * 20, y + 10, x + wob * 30, y + 10 * wob); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['A dairy cow drinks ~100 L', 'a day: now 5 liters', 'of pure alcohol'], 230, 0.15, { size: 70, out: OUT('farm') });
  if (u > 2.0) { scrimB(ctx, 1600, 0.6); say(ctx, u, ['Livestock die by the billion'], 1760, 2.0, { size: 52, weight: 900, x: W / 2, align: 'center', out: OUT('farm') }); }
}

// ================================================================ 8. it rains beer
function vBeerRain(ctx, u) {
  bgSky(ctx, ['#4a4030', '#6a5a40', '#8a7a58']);
  for (let i = 0; i < 6; i++) puff(ctx, 100 + i * 180, 300 + (i % 2) * 60, 180, '#7a6a50', 0.9);
  const k = easeInOut(prog(u, 0.6, 3.6));
  ctx.fillStyle = mixHex('#c8a840', '#7a6040', k); ctx.fillRect(0, 1150, W, H);
  for (let row = 0; row < 14; row++) { const q = row / 13, y = 1170 + q * q * 760, s = 0.3 + q * 1.4, n = Math.floor(26 - q * 14);
    for (let i = 0; i < n; i++) { const x = (i + (row % 2) * 0.5) / n * W, h = 100 * s * (1 - 0.5 * k); ctx.strokeStyle = mixHex('#d8b840', '#6a5030', k); ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + k * 20 * s, y - h * 0.6, x + k * 40 * s, y - h * (1 - 0.4 * k)); ctx.stroke(); } }
  ctx.strokeStyle = 'rgba(230,170,40,0.7)'; ctx.lineWidth = 3; const r = rng(4); for (let i = 0; i < 200; i++) { const x = (r() * W + u * 40) % W, y = (r() * H + u * 1100) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 30); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['It rains beer. Fields', 'and forests soak up', 'alcohol and acid.'], 230, 0.15, { size: 74, out: OUT('rain') });
}

// ================================================================ 9. nothing safe to drink
function vDrink(ctx, u) {
  bgSky(ctx, ['#f0ece4', '#e4ded2', '#d8d0c0']);
  ctx.fillStyle = '#c8bca8'; ctx.fillRect(0, 1300, W, H);
  ctx.fillStyle = '#b0b4bc'; ctx.fillRect(140, 700, 40, 240); ctx.fillRect(140, 700, 200, 40); ctx.beginPath(); ctx.roundRect(300, 700, 80, 70, 14); ctx.fill();
  const flow = 1; ctx.fillStyle = BEER; ctx.fillRect(320, 770, 40, 530); bubbles(ctx, u, 320, 770, 40, 530, 14, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.roundRect(260, 1100, 160, 220, 12); ctx.fill(); ctx.fillStyle = BEER; ctx.fillRect(268, 1170, 144, 142); ctx.fillStyle = FOAM; ctx.fillRect(268, 1150, 144, 26);
  ctx.save(); ctx.translate(760, 1150); ctx.rotate(-0.3); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.roundRect(-50, -140, 100, 240, 30); ctx.fill(); ctx.fillStyle = BEER; ctx.fillRect(-42, -40, 84, 132); ctx.fillStyle = '#ffbfa0'; ctx.beginPath(); ctx.roundRect(-30, -190, 60, 60, 20); ctx.fill();
  ctx.strokeStyle = '#e63946'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, -40, 150, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-106, -146); ctx.lineTo(106, 66); ctx.stroke(); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['No drinkable water. 3 liters', 'of beer a day = 8 drinks,', 'and it dries you out.'], 230, 0.15, { size: 64, out: 2.6 });
  say(ctx, u, ['Babies can’t drink it at all.', 'Boiling water back out', 'takes fuel most don’t have.'], 230, 2.7, { size: 64, out: OUT('drink') });
}

// ================================================================ 10. reactors still need cooling
function vReactor(ctx, u) {
  bgSky(ctx, ['#7a9ab8', '#a8c0d8', '#d8e4ee']);
  ctx.fillStyle = '#8a9a7a'; ctx.fillRect(0, 1350, W, H);
  for (const [x, s] of [[320, 1], [760, 0.85]]) { ctx.save(); ctx.translate(x, 1350); ctx.scale(s, s); ctx.fillStyle = '#c8ccd4'; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(-110, -300, -150, -620); ctx.lineTo(150, -620); ctx.quadraticCurveTo(110, -300, 200, 0); ctx.fill();
    for (let k = 0; k < 8; k++) puff(ctx, Math.sin(u + k) * 40, -680 - k * 70 - (u * 40) % 70, 80 + k * 14, mixHex('#ffffff', '#e8c888', R2(u / 3)), 0.85); ctx.restore(); }
  ctx.fillStyle = '#9aa0ac'; ctx.fillRect(470, 1150, 160, 200); ctx.beginPath(); ctx.arc(550, 1150, 80, Math.PI, 0); ctx.fill();
  if (u > 2.4 && Math.sin(u * 10) > 0) { ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.roundRect(390, 1520, 300, 70, 16); ctx.fill(); ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('COOLING FAULT', 540, 1568); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.55);
  say(ctx, u, ['Reactors shut down, but', 'must keep cooling, now', 'with foaming, sugary beer'], 230, 0.15, { size: 68, out: OUT('reactor') });
}

// ================================================================ 11. microbes eat the sugar; the seas suffocate
function vDead(ctx, u) {
  space(ctx, u);
  const k = easeInOut(prog(u, 0.3, 3.8)), R = 480, cx = W / 2, cy = 1150;
  globe(ctx, cx, cy, R, { lon0: 140 + u * 6, lat0: 5, t: u, ink: false, clouds: 0.3 });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = `rgba(${Math.round(lerp(220, 110, k))},${Math.round(lerp(160, 80, k))},${Math.round(lerp(30, 40, k))},0.85)`; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(40,30,10,${0.35 * k})`; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Bacteria feast on the sugar', 'and use up the oxygen.', 'The seas suffocate.'], 230, 0.15, { size: 68, out: OUT('dead') });
}

// ================================================================ 12. the fizz: more CO2 than the atmosphere weighs
function vFizz(ctx, u) {
  space(ctx, u);
  const k = easeInOut(prog(u, 0.3, 4.6)), R = 470, cx = W / 2, cy = 1250;
  globe(ctx, cx, cy, R, { lon0: -60 + u * 6, lat0: 15, t: u, ink: false, clouds: 0.3 });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = 'rgba(130,90,40,0.8)'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  const r = rng(5); for (let i = 0; i < 300; i++) { const a = r() * 6.283, f = ((u * (0.2 + r() * 0.4) + r()) % 1), d = R + f * 260 * (0.4 + k); ctx.fillStyle = `rgba(230,240,255,${0.7 * (1 - f)})`; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3 + r() * 5, 0, 6.283); ctx.fill(); }
  ctx.strokeStyle = `rgba(200,210,180,${0.5 * k})`; ctx.lineWidth = 60 * k + 4; ctx.beginPath(); ctx.arc(cx, cy, R + 50, 0, 6.283); ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Then the fizz. The oceans', 'hold more CO₂ than the', 'whole atmosphere weighs.'], 230, 0.15, { size: 66, out: 2.6 });
  say(ctx, u, ['Within weeks, CO₂ in the', 'air climbs ~25× (est.)'], 230, 2.7, { size: 70, out: OUT('fizz') });
}

// ================================================================ 13. the long run: heat, then air you can't breathe
function vLong(ctx, u) {
  const k = easeInOut(prog(u, 0.3, 4.4));
  bgSky(ctx, [mixHex('#4a3a2a', '#6a2a1a', k), mixHex('#7a5a3a', '#a04a2a', k), mixHex('#a88a5a', '#d08a4a', k)]);
  cityLayer(ctx, u, { base: 1300, seed: 13, hMin: 200, hMax: 680, wMin: 70, wMax: 160, gap: 12, col: mixHex('#4a4038', '#2a1a14', k), win: 'rgba(40,30,20,0.4)', winP: 0.3, ws: 8 });
  ctx.fillStyle = mixHex('#6a5a40', '#3a2a1a', k); ctx.fillRect(0, 1300, W, H);
  ctx.fillStyle = `rgba(180,170,140,${0.35 * k})`; ctx.fillRect(0, 1100, W, 400);
  massCrowd(ctx, u, { n: 500, yFar: 1320, yNear: 2150, sFar: 18, sNear: 180, seed: 6, col: '#1a140e', panic: 0.5, arms: 0 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Over years, more fizzes out.', 'The planet heats ~14°C (est.)', 'and the air turns toxic.'], 230, 0.15, { size: 64, out: OUT('long') });
  bigNum(ctx, u, 'Billions die (est.)', 1640, 2.6, { size: 88, color: '#ffffff', out: OUT('long') });
}

// ================================================================ 14. final image: a dead amber world
function vFinal(ctx, u) {
  space(ctx, u);
  const z = lerp(1.1, 0.8, easeInOut(prog(u, 0, 4.5))), R = 440 * z, cx = W / 2, cy = 1150;
  glow(ctx, cx, cy, R * 1.4, '200,150,80', 0.35);
  globe(ctx, cx, cy, R, { lon0: 20 + u * 5, lat0: 10, t: u, ink: false, clouds: 0.2, atmo: '210,170,110' });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = 'rgba(150,100,40,0.85)'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(200,180,140,0.25)'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['It wouldn’t be a party.'], 230, 0.15, { size: 84, out: OUT('final') });
  say(ctx, u, ['It would end most', 'life on Earth.'], 1600, 1.4, { size: 84, x: W / 2, align: 'center', out: OUT('final'), color: '#ffd25a' });
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
