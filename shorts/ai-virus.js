// What if AI created a super virus?
//
// SAFETY: strictly the outbreak and its consequences. No pathogen names to enhance, no mechanisms, no methods.
//
// FACTS (checked):
//  - Measles is among the most contagious diseases known (R0 ~12-18). Smallpox killed ~30% of those infected.
//  - People can spread a respiratory virus before symptoms appear (shown with COVID-19), which defeats screening.
//  - COVID-19 reached nearly every country within ~3 months; a faster spreader moving by air could do it in weeks.
//  - Toll (est.): if ~75% of 8.2 billion people were infected and ~30% died (smallpox-like) -> ~1.8 billion.
//    Comparisons: COVID-19 ~7 million confirmed deaths (WHO); 1918 flu ~50 million; Black Death ~25-50 million in Europe.
//  - Moderna finalised its COVID-19 vaccine design about 2 days after the genome was published (Jan 2020);
//    the first authorised doses came ~11 months later. Making billions of doses took about a year.
//  - Twist: Urbina et al., Nature Machine Intelligence (2022): a drug-discovery AI with its objective flipped toward
//    toxicity proposed ~40,000 potentially lethal molecules in under 6 hours.
// PLOT HOLES: Quarantine it? it spreads before symptoms. Close borders? by the time anyone notices it is already
//  everywhere. Vaccine? designed in days, but billions of doses take months. Masks? help, but not enough against
//  measles-level spread.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['ai', 4.5, [[0.1, 'rumble:4.2']]],
  ['silent', 4.5, [[0.1, 'heart:4.3']]],
  ['globe', 5.0, [[0.1, 'rumble:4.8'], [2.5, 'boom']]],
  ['borders', 4.0, [[0.6, 'impact'], [2.8, 'boom']]],
  ['hospital', 4.5, [[0.1, 'roar:4.2'], [0.2, 'heart:4.0']]],
  ['dark', 4.5, [[0.1, 'rumble:4.3']]],
  ['toll', 5.5, [[0.2, 'rumble:5'], [2.7, 'boom']]],
  ['vaccine', 5.0, [[0.2, 'swell:4.6']]],
  ['twist', 6.0, [[0.2, 'swell:2.4'], [2.6, 'impact']]],
  ['end', 3.5, [[0.2, 'swell:3']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if AI created a super virus?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 70, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, ai: vAI, silent: vSilent, globe: vGlobe, borders: vBorders, hospital: vHospital, dark: vDark,
              toll: vToll, vaccine: vVaccine, twist: vTwist, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const MONO = '"JetBrains Mono", "Menlo", "Consolas", monospace';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.2 });
}

// ================================================================ the virus (stylised, generic)
const _SPK = (() => { const P = [], n = 46; for (let i = 0; i < n; i++) { const y = 1 - (i + 0.5) / n * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; P.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return P; })();
function virusP(ctx, x, y, r, t, heat = 1) {
  const rot = t * 0.5, ca = Math.cos(rot), sa = Math.sin(rot), tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
  const pts = _SPK.map(([a, b, c]) => { const x1 = a * ca + c * sa, z1 = -a * sa + c * ca, y1 = b * ct - z1 * st, z2 = b * st + z1 * ct; return [x1, y1, z2]; });
  glow(ctx, x, y, r * 2.2, `255,${lerp(180, 60, heat)},${lerp(200, 70, heat)}`, 0.35);
  const spike = (p, back) => { const [a, b, c] = p, x0 = x + a * r * 0.92, y0 = y + b * r * 0.92, x1 = x + a * r * 1.32, y1 = y + b * r * 1.32;
    ctx.strokeStyle = back ? '#5a1a24' : '#ff8a8a'; ctx.lineWidth = r * 0.045; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = back ? '#6a1e2a' : '#ffb0a0'; ctx.beginPath(); ctx.arc(x1, y1, r * 0.085 * (0.8 + 0.2 * c), 0, 6.283); ctx.fill(); };
  for (const p of pts) if (p[2] < 0) spike(p, true);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r);
  g.addColorStop(0, '#ff9a9a'); g.addColorStop(0.5, '#c8303e'); g.addColorStop(1, '#3a0810');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  for (const [a, b, c] of pts) if (c > 0.1) { ctx.fillStyle = `rgba(80,10,20,${0.35 * c})`; ctx.beginPath(); ctx.ellipse(x + a * r * 0.75, y + b * r * 0.75, r * 0.07 * c + 1, r * 0.07, Math.atan2(b, a), 0, 6.283); ctx.fill(); }
  for (const p of pts) if (p[2] >= 0) spike(p, false);
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.07, W / 2, 1200);
  globe(ctx, W / 2 - 60, 1380, 340, { lon0: 20 + u * 4, lat0: 15, t: u, ink: false });
  const k = easeOut(prog(u, 0.1, 2.0));
  virusP(ctx, W / 2 + 170, lerp(900, 760, k) + Math.sin(u * 1.6) * 12, lerp(60, 210, k), u);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.4 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if AI', 'created a', 'super virus?'], 300, 0.15, { size: 96, out: OUT('hook'), mark: { line: 2, from: 0, to: 11, color: '#ff4d5e' } });
}

// ================================================================ 2. the data centre
function vAI(ctx, u) {
  const red = easeInOut(prog(u, 1.2, 3.8)), vx = W / 2, vy = 930;
  ctx.fillStyle = '#03060b'; ctx.fillRect(0, 0, W, H);
  drift(ctx, u, 0, 4.5, 1.0, 1.07, vx, vy);
  ctx.fillStyle = grad(ctx, ['#03060b', '#0a1420', '#0e1c2a'], 0, vy, 0, H); ctx.fillRect(0, vy, W, H);
  const r = rng(41);
  for (let k = 22; k >= 0; k--) { const z0 = 1 + k * 0.55, z1 = z0 + 0.45, s0 = 1 / z0, s1 = 1 / z1;
    for (const side of [-1, 1]) {
      const xa = vx + side * 330 * s0, xb = vx + side * 330 * s1, ta = vy - 1000 * s0, tb = vy - 1000 * s1, ba = vy + 900 * s0, bb = vy + 900 * s1;
      ctx.fillStyle = side < 0 ? '#121e2c' : '#0e1824'; ctx.beginPath(); ctx.moveTo(xa, ta); ctx.lineTo(xb, tb); ctx.lineTo(xb, bb); ctx.lineTo(xa, ba); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#2a4258'; ctx.lineWidth = Math.max(1, 3 * s0); ctx.stroke();
      for (let i = 0; i < 40; i++) { const fx = r(), fy = r(), on = Math.sin(u * (3 + r() * 8) + r() * 40) > -0.2;
        if (!on) continue; const px = lerp(xa, xb, fx), py = lerp(lerp(ta, tb, fx), lerp(ba, bb, fx), 0.08 + fy * 0.84), sz = Math.max(1.5, 7 * lerp(s0, s1, fx));
        const isRed = r() < red; ctx.fillStyle = isRed ? '#ff3b4e' : (r() < 0.5 ? '#3fe0c5' : '#4aa8ff'); ctx.fillRect(px, py, sz, sz * 0.6); }
    } }
  // floor reflection + hologram
  glow(ctx, vx, 1250, 520, red > 0.5 ? '255,60,80' : '60,200,255', 0.35);
  const hx = vx, hy = 820;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) { const rr = 230 + i * 40 + Math.sin(u * 2 + i) * 6; ctx.strokeStyle = `rgba(${red > 0.5 ? '255,90,110' : '90,220,255'},${0.25 - i * 0.05})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(hx, hy + 260, rr, rr * 0.18, 0, 0, 6.283); ctx.stroke(); }
  ctx.fillStyle = `rgba(${red > 0.5 ? '255,90,110' : '90,220,255'},0.08)`; ctx.beginPath(); ctx.moveTo(hx - 240, hy + 260); ctx.lineTo(hx + 240, hy + 260); ctx.lineTo(hx + 160, hy - 220); ctx.lineTo(hx - 160, hy - 220); ctx.fill();
  ctx.restore();
  const form = easeOut(prog(u, 0.6, 2.6));
  ctx.save(); ctx.globalAlpha = 0.85 * form; virusP(ctx, hx, hy, 170 * (0.6 + 0.4 * form), u, red); ctx.restore();
  // scrolling design log (abstract)
  ctx.font = `500 22px ${MONO}`; ctx.textAlign = 'left';
  for (let i = 0; i < 9; i++) { const line = Math.floor(u * 6) + i, rr2 = rng(line * 13 + 5); let s = '';
    for (let k = 0; k < 14; k++) s += '0123456789ABCDEF'[Math.floor(rr2() * 16)];
    ctx.fillStyle = `rgba(${red > 0.5 ? '255,120,130' : '120,230,255'},${0.15 + 0.06 * i})`; ctx.fillText(s, 70, 1040 + i * 30); ctx.fillText(s.split('').reverse().join(''), W - 290, 1040 + i * 30); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Someone uses an AI', 'to design a brand-', 'new virus'], 230, 0.15, { size: 80, out: OUT('ai') });
  say(ctx, u, ['As contagious as measles.', 'As deadly as smallpox.'], 1620, 1.6, { size: 58, weight: 900, out: OUT('ai'), mark: { line: 1, from: 3, to: 9, color: '#ff4d5e' } });
}

// ================================================================ 3. the silent spread (airport terminal)
function vSilent(ctx, u) {
  bgSky(ctx, ['#0c1426', '#2a3a5a', '#d07a5a', '#f0b080']);
  drift(ctx, u, 0, 4.5, 1.0, 1.05, W / 2, 1200);
  // parked jet outside the glass
  ctx.save(); ctx.translate(560, 980); ctx.fillStyle = '#121a28';
  ctx.beginPath(); ctx.ellipse(0, 0, 420, 46, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(160, 120); ctx.lineTo(230, 120); ctx.lineTo(80, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-360, -10); ctx.lineTo(-420, -170); ctx.lineTo(-370, -170); ctx.lineTo(-300, -20); ctx.fill(); ctx.restore();
  ctx.fillStyle = 'rgba(10,14,22,0.92)'; for (let x = 0; x < W; x += 180) ctx.fillRect(x, 0, 14, 1150); ctx.fillRect(0, 380, W, 10); ctx.fillRect(0, 1130, W, 30);
  ctx.fillStyle = grad(ctx, ['#2a2e3a', '#3a3e4c', '#4c505e'], 0, 1150, 0, H); ctx.fillRect(0, 1150, W, H);
  massCrowd(ctx, u, { n: 1900, yFar: 1170, yNear: 2150, sFar: 10, sNear: 190, seed: 51, col: '#0b0d14', rim: 'rgba(255,180,140,0.45)', flow: 70, arms: 0 });
  // invisible made visible: aerosol drifting through the crowd
  const k = easeIn2(prog(u, 0.3, 4.2)), r = rng(52);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 700; i++) { if (r() > k) { r(); r(); r(); continue; } const x = (r() * W + u * (20 + r() * 60)) % W, y = 1200 + r() * 720 - u * 15 * r(), s = 1.5 + r() * 3.5;
    ctx.fillStyle = 'rgba(255,60,80,0.55)'; ctx.beginPath(); ctx.arc(x + Math.sin(u * 2 + i) * 8, y, s, 0, 6.283); ctx.fill(); }
  ctx.restore();
  for (let i = 0; i < 9; i++) { const q = (i * 0.37 + 0.1) % 1, x = 80 + ((i * 211) % 920), y = 1300 + q * 550; if (u < 0.5 + i * 0.35) continue; glow(ctx, x, y - 60, 90 + 60 * q, '255,50,70', 0.45); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['It spreads for days', 'before anyone', 'feels sick'], 230, 0.15, { size: 84, out: OUT('silent') });
}

// ================================================================ 4. every country, within weeks
const ORIGIN = [55.3, 25.2];   // an unlabelled major air hub; the short never names a source
function vGlobe(ctx, u) {
  space(ctx, u);
  const e = easeInOut(prog(u, 0, 5)), R = 560, cx = W / 2, cy = 1150, lon0 = lerp(60, -20, e), lat0 = 22, v = gView(lon0, lat0);
  drift(ctx, u, 0, 5, 1.0, 1.04, cx, cy);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false });
  const O = wvec(...ORIGIN), spread = lerp(0.1, 4.6, prog(u, 0.2, 4.8));
  const [ox, oy, oz] = v(...ORIGIN);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const [name, lon, lat, pop] of CITIES) {
    const w = wvec(lon, lat), dd = Math.acos(R2(w[0] * O[0] + w[1] * O[1] + w[2] * O[2], -1, 1)), jit = ((name.length * 7) % 10) / 10;
    const ti = dd * 1.1 + jit * 0.8, age = spread - ti; if (age < 0) continue;
    const [vx, vy, vz] = v(lon, lat); if (vz < 0.02) continue;
    const sx = cx + vx * R, sy = cy + vy * R, rad = (20 + Math.sqrt(pop) * 12) * R2(age / 1.2);
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad * 2); g.addColorStop(0, 'rgba(255,40,60,0.55)'); g.addColorStop(1, 'rgba(255,40,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, rad * 2, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#ff5a6a'; ctx.beginPath(); ctx.arc(sx, sy, 3 + Math.sqrt(pop) * 0.8, 0, 6.283); ctx.fill();
    // flight arc from the hub
    if (oz > -0.2) { const f = R2(age / 0.8), x0 = cx + ox * R, y0 = cy + oy * R, mx = (x0 + sx) / 2, my = (y0 + sy) / 2, dl = Math.hypot(sx - x0, sy - y0);
      const nx = mx - cx, ny = my - cy, nl = Math.hypot(nx, ny) || 1, qx = mx + nx / nl * dl * 0.35, qy = my + ny / nl * dl * 0.35;
      ctx.strokeStyle = `rgba(255,140,150,${0.55 * (1 - R2((age - 1.5) / 1.5))})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0);
      for (let s = 1; s <= 24; s++) { const q = s / 24 * f, a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, c = q * q; ctx.lineTo(a * x0 + b * qx + c * sx, a * y0 + b * qy + c * sy); }
      ctx.stroke(); }
  }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Within weeks, it’s', 'in every country', 'on Earth'], 230, 0.15, { size: 84, out: OUT('globe') });
}

// ================================================================ 5. borders slam shut
const BOARD = ['LONDON', 'TOKYO', 'NEW YORK', 'SINGAPORE', 'PARIS', 'SÃO PAULO', 'LAGOS', 'MUMBAI', 'SYDNEY', 'MEXICO CITY', 'CAIRO', 'SEOUL'];
function vBorders(ctx, u) {
  bgSky(ctx, ['#05070c', '#0c1018', '#141a24']);
  drift(ctx, u, 0, 4, 1.03, 1.0, W / 2, 900);
  const x0 = 60, y0 = 330, rw = W - 120, rh = 88;
  ctx.fillStyle = '#0a0c10'; ctx.fillRect(x0 - 20, y0 - 110, rw + 40, rh * BOARD.length + 140);
  ctx.font = `800 30px ${FONT}`; ctx.fillStyle = 'rgba(255,210,90,0.9)'; ctx.textAlign = 'left'; ctx.fillText('DEPARTURES', x0 + 10, y0 - 50);
  BOARD.forEach((c, i) => {
    const y = y0 + i * rh, flip = 0.5 + i * 0.16, k = prog(u, flip, flip + 0.12), cancelled = u > flip + 0.06;
    ctx.fillStyle = i % 2 ? '#111419' : '#0d1014'; ctx.fillRect(x0, y, rw, rh - 6);
    ctx.font = `700 40px ${MONO}`; ctx.fillStyle = '#ffd25a'; ctx.fillText(`${String(6 + i).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}`, x0 + 18, y + 56);
    ctx.fillStyle = '#f2f2f2'; ctx.fillText(c, x0 + 190, y + 56);
    ctx.save(); ctx.translate(x0 + rw - 20, y + 42); ctx.scale(1, Math.abs(Math.cos(k * Math.PI)) * 0.9 + 0.1);
    ctx.textAlign = 'right'; ctx.font = `800 38px ${MONO}`; ctx.fillStyle = cancelled ? '#ff4d5e' : '#7dffb0'; ctx.fillText(cancelled ? 'CANCELLED' : 'ON TIME', 0, 14);
    ctx.restore();
    if (cancelled && u < flip + 0.5) glow(ctx, x0 + rw - 130, y + 42, 160, '255,60,80', 0.4 * (1 - (u - flip) / 0.5));
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Borders slam shut.', 'Planes are grounded.'], 1500, 0.15, { size: 76, out: OUT('borders') });
  say(ctx, u, ['Too late.'], 1700, 2.6, { size: 96, color: '#ff4d5e', out: OUT('borders') });
}

// ================================================================ 6. hospitals overflow
function vHospital(ctx, u) {
  bgSky(ctx, ['#06070e', '#141a2e', '#3a2030']);
  drift(ctx, u, 0, 4.5, 1.0, 1.05, W / 2, 1200);
  cityLayer(ctx, u, { base: 1240, seed: 61, hMin: 90, hMax: 360, wMin: 40, wMax: 110, gap: 6, col: '#141826', win: 'rgba(255,220,170,0.45)', winP: 0.3, ws: 5 });
  const hx = 150, hw = 780, hb = 1330, hh = 760;
  bldBody(ctx, hx, hb, hw, hh, { col: '#d8dce6', win: 'rgba(255,248,220,0.95)', winP: 0.85, ws: 16, top: '#ffffff' }, 62);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(hx, hb - hh, hw, hh);
  ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('HOSPITAL', hx + hw / 2, hb - hh - 30);
  glow(ctx, hx + hw / 2, hb - hh - 50, 300, '255,255,255', 0.25);
  ctx.fillStyle = '#ff3b4e'; ctx.fillRect(hx + hw / 2 - 20, hb - hh + 40, 40, 120); ctx.fillRect(hx + hw / 2 - 60, hb - hh + 80, 120, 40);
  // field tents
  for (let i = 0; i < 7; i++) { const x = 40 + i * 150, y = hb + 40; ctx.fillStyle = '#e8eaee'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 65, y - 80); ctx.lineTo(x + 130, y); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.moveTo(x + 65, y - 80); ctx.lineTo(x + 130, y); ctx.lineTo(x + 75, y); ctx.fill(); }
  ctx.fillStyle = grad(ctx, ['#1e2432', '#3a3e4e', '#4a4c5a'], 0, hb, 0, H); ctx.fillRect(0, hb + 40, W, H);
  for (let i = 0; i < 6; i++) { const x = 90 + i * 180, ph = Math.sin(u * 14 + i * 1.7) > 0; glow(ctx, x, hb + 70, 140, ph ? '255,40,60' : '60,120,255', 0.6); }
  massCrowd(ctx, u, { n: 1900, yFar: hb + 60, yNear: 2150, sFar: 12, sNear: 190, seed: 63, col: '#07080c', rim: 'rgba(255,90,100,0.45)', panic: 0.4, arms: 0.05 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Hospitals overflow', 'in days'], 230, 0.15, { size: 92, out: OUT('hospital') });
  say(ctx, u, ['Doctors and nurses are', 'among the first to fall sick'], 1640, 1.4, { size: 54, weight: 900, out: OUT('hospital') });
}

// ================================================================ 7. cities go dark
function vDark(ctx, u) {
  bgSky(ctx, ['#020308', '#0a0c18', '#1a1424']);
  drift(ctx, u, 0, 4.5, 1.0, 1.05, W / 2, 1300);
  const fade = q => R2(1 - prog(u, 0.5 + q, 3.2 + q));
  for (let i = 0; i < 6; i++) { const x = 120 + i * 170, base = 1150 - (i % 3) * 30;
    for (let k = 0; k < 10; k++) { const f = ((k / 10) + u * 0.1) % 1, yy = base - f * 900, rad = 30 + f * 140;
      const sx2 = x + Math.sin(u + k + i) * 30, g2 = ctx.createRadialGradient(sx2, yy, 0, sx2, yy, rad); g2.addColorStop(0, `rgba(70,64,78,${0.35 * (1 - f) * R2(u - 0.3)})`); g2.addColorStop(1, 'rgba(70,64,78,0)');
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(sx2, yy, rad, 0, 6.283); ctx.fill(); }
    glow(ctx, x, base, 90, '255,120,50', 0.4 * R2(u - 0.3)); }
  cityLayer(ctx, u, { base: 1200, seed: 71, hMin: 120, hMax: 460, wMin: 40, wMax: 110, gap: 6, col: '#0e1018', win: `rgba(255,214,150,${0.6 * fade(0.0)})`, winP: 0.4, ws: 5 });
  cityLayer(ctx, u, { base: 1380, seed: 72, hMin: 260, hMax: 760, wMin: 80, wMax: 170, gap: 14, col: '#090a10', win: `rgba(255,220,160,${0.75 * fade(0.5)})`, winP: 0.4, ws: 9 });
  ctx.fillStyle = grad(ctx, ['#14141c', '#22222c'], 0, 1380, 0, H); ctx.fillRect(0, 1380, W, H);
  ctx.fillStyle = '#3a3a44'; for (let x = 0; x < W; x += 180) ctx.fillRect(x + ((u * 0) | 0), 1640, 100, 10);
  const r = rng(73);
  for (let i = 0; i < 7; i++) { const x = r() * W, y = 1440 + r() * 400, s = 0.6 + (y - 1440) / 400 * 0.8, rot = (r() - 0.5) * 0.4;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#05060a'; ctx.fillRect(-90, -50, 180, 50); ctx.fillRect(-55, -85, 110, 38);
    ctx.fillStyle = 'rgba(120,140,170,0.25)'; ctx.fillRect(-48, -80, 40, 28); ctx.fillRect(8, -80, 40, 28); ctx.restore(); }
  const blink = Math.floor(u * 1.6) % 2 === 0; if (blink) glow(ctx, 900, 1300, 60, '255,180,40', 0.8);
  ctx.fillStyle = '#05060a'; ctx.fillRect(895, 1300, 10, 300);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Supply chains break.', 'Power fails.', 'Cities go dark.'], 230, 0.15, { size: 80, out: OUT('dark') });
}

// ================================================================ 8. the toll, against history
function vToll(ctx, u) {
  bgSky(ctx, ['#05040a', '#14060e', '#22080e']);
  const n = Math.round(1800000000 * easeOut(prog(u, 0.6, 2.6)));
  say(ctx, u, ['If it spreads like measles', 'and kills like smallpox:'], 230, 0.15, { size: 68, out: OUT('toll') });
  bigNum(ctx, u, n.toLocaleString('en-US'), 560, 0.5, { size: 116, color: '#ff4d5e', out: OUT('toll') });
  say(ctx, u, ['dead in a year (est.)'], 680, 1.0, { size: 56, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
  const rows = [['This virus (est.)', 1800e6, '#ff4d5e'], ['Black Death', 50e6, '#b8b8c8'], ['1918 flu', 50e6, '#b8b8c8'], ['COVID-19 (confirmed)', 7e6, '#b8b8c8']];
  const bx = 70, bw = W - 140;
  rows.forEach(([label, v, col], i) => { const at = 2.6 + i * 0.25, k = easeOut(prog(u, at, at + 0.8)); if (u < at) return;
    const y = 920 + i * 210;
    ctx.globalAlpha = R2((u - at) / 0.3); ctx.font = `800 44px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.fillText(label, bx, y);
    ctx.fillStyle = col; ctx.fillRect(bx, y + 22, Math.max(4, bw * (v / 1800e6) * k), 56);
    ctx.font = `700 36px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.textAlign = 'right';
    ctx.fillText(v >= 1e9 ? `~${(v / 1e9).toFixed(1)} billion` : `~${v / 1e6} million`, bx + bw, y); ctx.globalAlpha = 1; });
}

// ================================================================ 9. AI fights back
function vVaccine(ctx, u) {
  bgSky(ctx, ['#04121a', '#0a2a38', '#12485a']);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1200);
  for (let row = 0; row < 4; row++) { const s = 0.5 + row * 0.35, y = 980 + row * 220 + row * row * 30, sp = 220 * s;
    ctx.fillStyle = `rgba(20,40,52,0.9)`; ctx.fillRect(0, y + 8 * s, W, 26 * s); ctx.fillStyle = 'rgba(120,200,230,0.25)'; ctx.fillRect(0, y + 8 * s, W, 3 * s);
    const gap = 90 * s, off = (u * sp) % gap;
    for (let x = -gap + off; x < W + gap; x += gap) { const vw = 46 * s, vh = 120 * s;
      ctx.fillStyle = 'rgba(200,235,255,0.18)'; roundRect(ctx, x - vw / 2, y - vh, vw, vh, 10 * s); ctx.fill();
      ctx.fillStyle = '#3fb8ff'; roundRect(ctx, x - vw / 2 + 4 * s, y - vh * 0.6, vw - 8 * s, vh * 0.6 - 4 * s, 8 * s); ctx.fill();
      ctx.fillStyle = '#e8eef4'; ctx.fillRect(x - vw / 2 - 2 * s, y - vh - 22 * s, vw + 4 * s, 24 * s);
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x - vw / 2 + 6 * s, y - vh + 10 * s, 5 * s, vh - 30 * s); }
    glow(ctx, W / 2, y - 60 * s, 500 * s, '90,200,255', 0.12); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['But AI can', 'fight back too'], 230, 0.15, { size: 96, out: OUT('vaccine'), mark: { line: 1, from: 0, to: 10, color: '#2a9df4' } });
  say(ctx, u, ['COVID’s vaccine was', 'designed in 2 days.'], 520, 1.1, { size: 66, weight: 900, out: 2.9 });
  say(ctx, u, ['Making billions of', 'doses took a year.'], 520, 3.0, { size: 66, weight: 900, out: OUT('vaccine') });
}

// ================================================================ 10. the twist: it already happened (with chemistry)
function molecule(ctx, x, y, s, seed, col) {
  const r = rng(seed), n = 4 + Math.floor(r() * 4), P = [[0, 0]];
  for (let i = 1; i < n; i++) { const p = P[Math.floor(r() * P.length)], a = r() * 6.283; P.push([p[0] + Math.cos(a), p[1] + Math.sin(a)]); }
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, s * 0.12); ctx.beginPath();
  for (let i = 1; i < n; i++) { const q = P[Math.max(0, i - 1 - Math.floor(r() * 2))]; ctx.moveTo(x + q[0] * s, y + q[1] * s); ctx.lineTo(x + P[i][0] * s, y + P[i][1] * s); } ctx.stroke();
  ctx.fillStyle = col; for (const [a, b] of P) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, s * 0.22, 0, 6.283); ctx.fill(); }
}
function vTwist(ctx, u) {
  bgSky(ctx, ['#030508', '#0a0c14', '#140a10']);
  const cols = 12, rows = 15, total = cols * rows, shown = Math.floor(total * easeIn2(prog(u, 2.4, 5.4)));
  for (let i = 0; i < shown; i++) { const c = i % cols, r = Math.floor(i / cols), x = 70 + c * 85, y = 660 + r * 66;
    const age = R2((u - 2.4 - (i / total) * 3.0) / 0.3); ctx.globalAlpha = 0.85 * (age || 1);
    molecule(ctx, x, y, 14, i * 31 + 7, i % 9 === 0 ? '#ff4d5e' : '#d97a86'); }
  ctx.globalAlpha = 1;
  const n = Math.round(40000 * easeIn2(prog(u, 2.4, 5.4)));
  say(ctx, u, ['Plot twist:', 'this is already possible.'], 230, 0.15, { size: 84, out: 2.4, mark: { line: 1, from: 8, to: 24, color: '#ff4d5e' } });
  say(ctx, u, ['In 2022, researchers set a', 'drug-design AI to look for', 'toxins instead of cures.'], 230, 2.5, { size: 62, out: OUT('twist') });
  if (u > 2.4) { ctx.fillStyle = 'rgba(3,5,8,0.75)'; ctx.fillRect(0, 1630, W, 200); }
  bigNum(ctx, u, `${n.toLocaleString('en-US')} deadly molecules`, 1690, 2.6, { size: 70, color: '#ff4d5e', out: OUT('twist') });
  say(ctx, u, ['in under 6 hours'], 1790, 3.2, { size: 52, weight: 800, x: W / 2, align: 'center', out: OUT('twist') });
}

function vEnd(ctx, u) {
  space(ctx, u);
  globe(ctx, W / 2, 1420, 260, { lon0: u * 4, lat0: 15, t: u, ink: false });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['The tech that could end us', 'might be what saves us.'], 420, 0.15, { size: 58, weight: 800, x: W / 2, align: 'center' });
  say(ctx, u, ['WHAT IF,'], 760, 0.7, { size: 150, x: W / 2, align: 'center' });
  say(ctx, u, ['THOUGH?'], 920, 0.9, { size: 150, x: W / 2, align: 'center', color: C.yellow });
  say(ctx, u, ['Follow for more'], 1040, 1.4, { size: 50, weight: 800, x: W / 2, align: 'center' });
}

// ================================================================ shared kit (crowds, skylines, globe projection, cities)
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
