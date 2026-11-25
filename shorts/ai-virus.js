// What if AI created a super virus?   (v2: bright palette; follow the virus person to person and inside the body)
//
// SAFETY: strictly the outbreak and its consequences. No pathogen names, mechanisms of enhancement, or methods.
// The in-body sequence is generic textbook biology (attach, hijack, copy, burst; immune response; fever).
//
// FACTS (checked):
//  - A sneeze can release up to ~40,000 droplets; the gas cloud can carry them up to ~7-8 m (Bourouiba, JAMA 2020).
//  - Measles: each case infects ~12-18 others (R0); "~15" used. 15^5 ≈ 760,000 after five jumps.
//  - Smallpox killed ~30% of those infected. People can spread respiratory viruses before symptoms (COVID-19).
//  - Virus life cycle: attaches to a cell, takes over its machinery to copy itself; one infected cell can release
//    thousands of new virus particles. High fever (to ~41°C) and an over-reacting immune response ("cytokine storm")
//    can themselves damage the lungs.
//  - Toll (est.): ~75% of 8.2 billion infected × ~30% fatality ≈ 1.8 billion.
//  - Moderna finalised its COVID-19 vaccine design ~2 days after the genome was published; ~11 months to first doses.
//  - Twist: Urbina et al., Nature Machine Intelligence (2022): a drug-discovery AI with its objective flipped to
//    toxicity proposed ~40,000 potentially lethal molecules in under 6 hours.
// PLOT HOLES: Quarantine? spreads before symptoms. Borders? it's everywhere before anyone notices.
//  Vaccine? designed in days, but billions of doses take months.

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['ai', 4.0, [[0.1, 'rumble:3.8']]],
  ['sneeze', 5.0, [[0.4, 'drawback:0.8'], [1.0, 'air'], [1.05, 'boom']]],
  ['chain', 5.0, [[0.1, 'swell:4.8'], [1.9, 'boom'], [3.0, 'boom']]],
  ['cell', 6.0, [[0.1, 'heart:5.8'], [0.8, 'impact'], [3.0, 'boom'], [5.3, 'boom']]],
  ['immune', 5.0, [[0.1, 'rumble:4.8'], [2.8, 'impact'], [3.4, 'boom']]],
  ['ward', 4.5, [[0.1, 'heart:4.3']]],
  ['globe', 4.5, [[0.1, 'rumble:4.3'], [2.2, 'boom']]],
  ['toll', 5.0, [[0.2, 'rumble:4.6'], [1.8, 'boom']]],
  ['vaccine', 5.0, [[0.2, 'swell:4.6']]],
  ['twist', 5.5, [[0.2, 'swell:2.4'], [2.5, 'impact']]],
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

const FNS = { hook: vHook, ai: vAI, sneeze: vSneeze, chain: vChain, cell: vCell, immune: vImmune, ward: vWard, globe: vGlobe,
              toll: vToll, vaccine: vVaccine, twist: vTwist, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const MONO = '"JetBrains Mono", "Menlo", "Consolas", monospace';
const LIME = '#9be15d', VIR = '#8a4fff', SPK = '#c6ff4a';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}
function scrim(ctx, h = 640, a = 0.6) { const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, `rgba(22,18,60,${a})`); g.addColorStop(0.65, `rgba(22,18,60,${a * 0.55})`); g.addColorStop(1, 'rgba(22,18,60,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, h); }
function scrimB(ctx, y0 = 1480, a = 0.6) { const g = ctx.createLinearGradient(0, y0, 0, H); g.addColorStop(0, 'rgba(22,18,60,0)'); g.addColorStop(0.4, `rgba(22,18,60,${a * 0.6})`); g.addColorStop(1, `rgba(22,18,60,${a})`); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0); }
function mixHex(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], R2(p))).toString(16).padStart(2, '0')).join('');
}

// ================================================================ characters & germs
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
function vMini(ctx, x, y, r, rot = 0, col = VIR) {
  ctx.strokeStyle = SPK; ctx.lineWidth = Math.max(1, r * 0.22); ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = rot + i * Math.PI / 4; ctx.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); ctx.lineTo(x + Math.cos(a) * r * 1.45, y + Math.sin(a) * r * 1.45); }
  ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
}
const _SPK = (() => { const P = [], n = 46; for (let i = 0; i < n; i++) { const y = 1 - (i + 0.5) / n * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; P.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return P; })();
function virus2(ctx, x, y, r, t) {
  const rot = t * 0.6, ca = Math.cos(rot), sa = Math.sin(rot), ct = Math.cos(0.35), st = Math.sin(0.35);
  const pts = _SPK.map(([a, b, c]) => { const x1 = a * ca + c * sa, z1 = -a * sa + c * ca; return [x1, b * ct - z1 * st, b * st + z1 * ct]; });
  glow(ctx, x, y, r * 2, '170,120,255', 0.35);
  const spike = (p, back) => { const [a, b, c] = p, x0 = x + a * r * 0.92, y0 = y + b * r * 0.92, x1 = x + a * r * 1.32, y1 = y + b * r * 1.32;
    ctx.strokeStyle = back ? '#6a9a2a' : SPK; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = back ? '#7aaa30' : '#e6ff8a'; ctx.beginPath(); ctx.arc(x1, y1, r * 0.09 * (0.8 + 0.2 * c), 0, 6.283); ctx.fill(); };
  for (const p of pts) if (p[2] < 0) spike(p, true);
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r);
  g.addColorStop(0, '#c9a6ff'); g.addColorStop(0.55, '#8a4fff'); g.addColorStop(1, '#3a1a8a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  for (const [a, b, c] of pts) if (c > 0.1) { ctx.fillStyle = `rgba(60,20,140,${0.35 * c})`; ctx.beginPath(); ctx.arc(x + a * r * 0.75, y + b * r * 0.75, r * 0.07 * c + 1, 0, 6.283); ctx.fill(); }
  for (const p of pts) if (p[2] >= 0) spike(p, false);
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  space(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.07, W / 2, 1200);
  globe(ctx, W / 2 - 60, 1380, 340, { lon0: 20 + u * 4, lat0: 15, t: u, ink: false });
  const k = easeBack(R2(prog(u, 0.1, 1.2)));
  virus2(ctx, W / 2 + 170, 790 + Math.sin(u * 2) * 14, lerp(40, 200, k), u);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.2 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if AI', 'created a', 'super virus?'], 300, 0.15, { size: 96, out: OUT('hook'), mark: { line: 2, from: 0, to: 11, color: VIR } });
}

// ================================================================ 2. the AI designs it (bright lab)
function vAI(ctx, u) {
  const vx = W / 2, vy = 930, form = easeOut(prog(u, 0.4, 2.4));
  bgSky(ctx, ['#0d3b66', '#1b6f9a', '#3aa6c4']);
  drift(ctx, u, 0, 4, 1.0, 1.06, vx, vy);
  ctx.fillStyle = grad(ctx, ['#1b4f78', '#2a7aa0', '#47a7c4'], 0, vy, 0, H); ctx.fillRect(0, vy, W, H);
  const r = rng(41);
  for (let k = 18; k >= 0; k--) { const z0 = 1 + k * 0.55, z1 = z0 + 0.45, s0 = 1 / z0, s1 = 1 / z1;
    for (const side of [-1, 1]) {
      const xa = vx + side * 330 * s0, xb = vx + side * 330 * s1, ta = vy - 1000 * s0, tb = vy - 1000 * s1, ba = vy + 900 * s0, bb = vy + 900 * s1;
      ctx.fillStyle = side < 0 ? '#e8f1f8' : '#cfdeea'; ctx.beginPath(); ctx.moveTo(xa, ta); ctx.lineTo(xb, tb); ctx.lineTo(xb, bb); ctx.lineTo(xa, ba); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#9ab4c8'; ctx.lineWidth = Math.max(1, 3 * s0); ctx.stroke();
      for (let i = 0; i < 30; i++) { const fx = r(), fy = r(), on = Math.sin(u * (3 + r() * 8) + r() * 40) > -0.3, c = r();
        if (!on) continue; const px = lerp(xa, xb, fx), py = lerp(lerp(ta, tb, fx), lerp(ba, bb, fx), 0.08 + fy * 0.84), sz = Math.max(1.5, 8 * lerp(s0, s1, fx));
        ctx.fillStyle = c < form * 0.6 ? VIR : (c < 0.7 ? '#2ec4b6' : SPK); ctx.fillRect(px, py, sz, sz * 0.6); }
    } }
  const hx = vx, hy = 820;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) { const rr = 230 + i * 40 + Math.sin(u * 2 + i) * 6; ctx.strokeStyle = `rgba(200,170,255,${0.35 - i * 0.07})`; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(hx, hy + 260, rr, rr * 0.18, 0, 0, 6.283); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = form; virus2(ctx, hx, hy, 180 * (0.5 + 0.5 * form), u); ctx.restore();
  ctx.font = `600 22px ${MONO}`; ctx.textAlign = 'left';
  for (let i = 0; i < 8; i++) { const line = Math.floor(u * 6) + i, rr2 = rng(line * 13 + 5); let s = '';
    for (let k = 0; k < 14; k++) s += 'ACGU'[Math.floor(rr2() * 4)];
    ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.07 * i})`; ctx.fillText(s, 70, 1080 + i * 30); ctx.fillText(s.split('').reverse().join(''), W - 290, 1080 + i * 30); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Someone uses an AI', 'to design a brand-', 'new virus'], 230, 0.15, { size: 80, out: OUT('ai') });
  say(ctx, u, ['As contagious as measles.', 'As deadly as smallpox.'], 1620, 1.4, { size: 58, weight: 900, out: OUT('ai'), mark: { line: 1, from: 3, to: 9, color: VIR } });
}

// ================================================================ 3. one sneeze on the subway
function vSneeze(ctx, u) {
  const sn = 1.0, dt = Math.max(0, u - sn);
  bgSky(ctx, ['#ffe7a0', '#ffd36e', '#ffc04a']);
  drift(ctx, u, 0, 5, 1.0, 1.05, 400, 1300);
  // windows with tunnel lights streaking past
  ctx.fillStyle = '#2b3a67'; ctx.fillRect(0, 470, W, 460);
  for (let i = 0; i < 3; i++) { const x = 40 + i * 360; ctx.fillStyle = '#1a2850'; roundRect(ctx, x, 500, 300, 380, 40); ctx.fill();
    ctx.save(); roundRect(ctx, x, 500, 300, 380, 40); ctx.clip();
    for (let k = 0; k < 4; k++) { const lx = x + 300 - ((u * 1400 + k * 260 + i * 90) % 1040); ctx.fillStyle = 'rgba(255,230,160,0.8)'; ctx.fillRect(lx, 640, 120, 10); }
    ctx.restore(); }
  for (const x of [330, 690]) { ctx.fillStyle = '#ffcf3a'; ctx.fillRect(x, 380, 18, 1300); }
  ctx.fillStyle = '#2ec4b6'; ctx.fillRect(0, 1330, W, 130); ctx.fillStyle = '#25a89c'; ctx.fillRect(0, 1440, W, 30);
  ctx.fillStyle = grad(ctx, ['#4a5a8a', '#3a4874'], 0, 1460, 0, H); ctx.fillRect(0, 1460, W, H);
  const x0 = 175, hy = 1880 - 0.86 * 430;
  const reach = x => { const d = x - x0; const q = 1 - d * 1.2 / 1250; return q <= 0 ? 99 : sn + 0.15 - Math.log(q) / 1.2; };
  const back = [[330, 0, 3], [560, 1, 5], [790, 2, 7], [990, 3, 1]], front = [[560, 4, 2], [800, 5, 8], [1030, 6, 4]];
  for (const [x, sd, c] of back) person2(ctx, x, 1440, 270, { seed: c, sick: R2((u - reach(x) - 0.3) / 0.8), t: u });
  // the sneeze cloud
  if (dt > 0) { const r = rng(81), k = 1.2, spread = (1 - Math.exp(-k * dt)) / k;
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 700; i++) { const vx = 500 + r() * 1100, vy = (r() - 0.5) * 700, big = r() < 0.15, sz = big ? 5 + r() * 5 : 1.5 + r() * 3;
      const x = x0 + 60 + vx * spread, y = hy + vy * spread + (big ? 260 * dt * dt : 20 * dt);
      const a = R2(1 - dt / 4.2) * (big ? 0.9 : 0.6); if (a <= 0) continue;
      ctx.fillStyle = `rgba(40,150,230,${a})`; ctx.beginPath(); ctx.arc(x, y, sz * 1.3, 0, 6.283); ctx.fill(); ctx.fillStyle = `rgba(220,245,255,${a})`; ctx.beginPath(); ctx.arc(x - sz * 0.3, y - sz * 0.3, sz * 0.45, 0, 6.283); ctx.fill(); }
    for (let i = 0; i < 26; i++) { const vx = 500 + r() * 1100, vy = (r() - 0.5) * 600, x = x0 + 60 + vx * spread, y = hy + vy * spread + 20 * dt;
      if (dt < 3.8) vMini(ctx, x, y, 13 + r() * 8, u * 3 + i); }
    ctx.restore(); }
  const jerk = u > sn - 0.5 && u < sn + 0.3 ? (u < sn ? -0.12 * prog(u, sn - 0.5, sn) : 0.18 * (1 - prog(u, sn, sn + 0.3))) : 0;
  ctx.save(); ctx.translate(x0, 1880); ctx.rotate(jerk); person2(ctx, 0, 0, 430, { seed: 0, sick: 1, t: u }); ctx.restore();
  for (const [x, sd, c] of front) person2(ctx, x, 1880, 430, { seed: c, sick: R2((u - reach(x) - 0.3) / 0.8), t: u });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx);
  say(ctx, u, ['One sneeze sprays', 'up to 40,000 droplets'], 230, 0.15, { size: 76, out: OUT('sneeze'), mark: { line: 1, from: 6, to: 21, color: '#3a86ff' } });
  say(ctx, u, ['flying as far as 8 meters'], 420, 1.6, { size: 54, weight: 800, out: OUT('sneeze') });
}

// ================================================================ 4. person to person: the chain reaction
const TREE = (() => { const N = [[0, 0, 0, -1, 0, 0]], r = rng(91);
  const kids = (pi, g, rad, spread) => { const [px, py] = N[pi], base = Math.atan2(py, px);
    for (let i = 0; i < 15; i++) { const a = g === 1 ? i / 15 * 6.283 : base + (i / 14 - 0.5) * spread; N.push([px + Math.cos(a) * rad, py + Math.sin(a) * rad, g, pi, r(), a]); } };
  kids(0, 1, 1.0, 0); const g1 = N.length; for (let i = 1; i < g1; i++) kids(i, 2, 0.42, 2.2);
  const g2 = N.length; for (let i = g1; i < g2; i++) kids(i, 3, 0.16, 2.4);
  return N; })();
function vChain(ctx, u) {
  bgSky(ctx, ['#7fd1ff', '#a9e2ff', '#d4f2ff']);
  const tg = [0.15, 0.8, 1.9, 3.0], sc = 520 * Math.pow(190 / 520, easeInOut(prog(u, 0.6, 4.4))), cx = W / 2, cy = 1150;
  const P = n => [cx + n[0] * sc, cy + n[1] * sc], tInf = n => tg[n[2]] + n[4] * 0.6;
  ctx.lineCap = 'round';
  for (const n of TREE) { if (n[3] < 0) continue; const ti = tInf(n), f = R2((u - ti) / 0.35); if (f <= 0) continue;
    const [x1, y1] = P(n), [x0, y0] = P(TREE[n[3]]); ctx.strokeStyle = `rgba(90,200,40,${n[2] === 3 ? 0.35 : 0.7})`; ctx.lineWidth = n[2] === 3 ? 1.5 : 4;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, f), lerp(y0, y1, f)); ctx.stroke();
    if (f < 1 && n[2] < 3) vMini(ctx, lerp(x0, x1, f), lerp(y0, y1, f), 8, u * 4); }
  for (let i = TREE.length - 1; i >= 0; i--) { const n = TREE[i], [x, y] = P(n), sick = R2((u - tInf(n)) / 0.4);
    if (n[2] === 3) { if (sick <= 0) continue; ctx.fillStyle = LIME; ctx.beginPath(); ctx.arc(x, y, Math.max(1.5, sc * 0.02), 0, 6.283); ctx.fill(); continue; }
    const s = sc * (n[2] === 0 ? 0.34 : n[2] === 1 ? 0.26 : 0.11); if (s < 4) { ctx.fillStyle = sick > 0 ? LIME : '#5a7aa0'; ctx.fillRect(x - 2, y - 2, 4, 4); continue; }
    person2(ctx, x, y + s * 0.5, s, { seed: i, sick, t: u, shadow: s > 30 });
    if (sick > 0 && sick < 1 && s > 30) glow(ctx, x, y, s * 0.8, '150,255,80', 0.5 * (1 - sick)); }
  const count = TREE.reduce((a, n) => a + (u > tInf(n) ? 1 : 0), 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx);
  say(ctx, u, ['Each sick person', 'infects ~15 more'], 230, 0.15, { size: 88, out: 2.5 });
  say(ctx, u, ['Five jumps later:', '760,000 people'], 230, 2.6, { size: 88, out: OUT('chain'), mark: { line: 1, from: 0, to: 7, color: '#3aa020' } });
  scrimB(ctx, 1500, 0.5);
  bigNum(ctx, u, `${count.toLocaleString('en-US')} infected`, 1740, 0.3, { size: 76, color: '#ffffff', out: OUT('chain') });
}

// ================================================================ 5. inside the body: hijacked cells burst
const CELLS = (() => { const C = []; for (let row = -1; row < 11; row++) for (let col = -1; col < 6; col++) C.push([col * 230 + (row % 2 ? 115 : 0) + 30, row * 200 + 60, C.length]); return C; })();
const nearCell = (x, y) => CELLS.reduce((b, c) => (Math.hypot(c[0] - x, c[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? c : b));
function tissue(ctx, u, state, heat = 0) {
  bgSky(ctx, [mixHex('#ffb3c6', '#ff9a7a', heat), mixHex('#ff8fab', '#ff7050', heat), mixHex('#f06a92', '#e0503a', heat)]);
  for (const [x, y, id] of CELLS) { const st = state(id), wob = Math.sin(u * 2 + id) * 4;
    if (st.burst) { const k = R2(st.burst); ctx.strokeStyle = `rgba(255,220,230,${1 - k})`; ctx.lineWidth = 6;
      for (let i = 0; i < 8; i++) { const a = i * 0.785 + id, d = 110 + k * 120; ctx.beginPath(); ctx.arc(x + Math.cos(a) * k * 60, y + Math.sin(a) * k * 60, d, a - 0.25, a + 0.25); ctx.stroke(); }
      ctx.fillStyle = 'rgba(160,40,70,0.25)'; ctx.beginPath(); ctx.arc(x, y, 90, 0, 6.283); ctx.fill(); continue; }
    const sw = st.swell || 0, dmg = st.dmg || 0, R = 105 + wob + sw * 22;
    ctx.fillStyle = mixHex(mixHex('#ffd6e0', '#e6f7b0', sw), '#8a4a5a', dmg); ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    ctx.strokeStyle = mixHex('#ff8fab', '#9be15d', sw); ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = mixHex('#e05c8a', '#6a8a30', sw); ctx.beginPath(); ctx.arc(x - 20, y - 15, 38, 0, 6.283); ctx.fill();
    if (sw > 0) { const r = rng(id * 7 + 1), n = Math.floor(sw * 40); for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.8;
      vMini(ctx, x + Math.cos(a) * d + Math.sin(u * 5 + i) * 3, y + Math.sin(a) * d, 6, u * 2 + i); } }
  }
}
function vCell(ctx, u) {
  const c0 = nearCell(W / 2, 1150), nb = CELLS.filter(c => c !== c0 && Math.hypot(c[0] - c0[0], c[1] - c0[1]) < 260), nbIds = new Set(nb.map(c => c[2]));
  const dock = 0.8, b0 = 3.0, b1 = 5.3;
  const state = id => {
    if (id === c0[2]) return u > b0 ? { burst: (u - b0) / 0.6 } : { swell: R2((u - dock) / (b0 - dock)) };
    if (nbIds.has(id)) return u > b1 ? { burst: (u - b1) / 0.6 } : { swell: R2((u - b0 - 0.5) / (b1 - b0 - 0.5)) };
    return {};
  };
  const z = lerp(1.25, 1.0, easeOut(prog(u, 0, 1.5)));
  ctx.save(); ctx.translate(W / 2, 1150); ctx.scale(z, z); ctx.translate(-W / 2, -1150);
  tissue(ctx, u, state);
  // the first virus arrives and docks
  if (u < dock + 0.4) { const k = easeOut(prog(u, 0, dock)); virus2(ctx, lerp(c0[0] - 420, c0[0] - 95, k), lerp(c0[1] - 520, c0[1] - 95, k), 34, u); }
  // bursts: copies fly out and land on neighbours
  for (const [bt, src, n] of [[b0, c0, 140], ...nb.map(c => [b1, c, 60])]) { if (u < bt) continue; const dt = u - bt, r = rng(src[2] * 13 + 3);
    for (let i = 0; i < n; i++) { const a = r() * 6.283, sp = 200 + r() * 700, d = sp * (1 - Math.exp(-1.8 * dt)) / 1.8; vMini(ctx, src[0] + Math.cos(a) * d, src[1] + Math.sin(a) * d, 7 + r() * 4, u * 3 + i); } }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx);
  say(ctx, u, ['Inside you, it hijacks', 'your cells to make', 'copies of itself'], 230, 0.15, { size: 76, out: 2.9 });
  say(ctx, u, ['Each cell bursts,', 'releasing thousands more'], 230, 3.05, { size: 76, out: OUT('cell'), mark: { line: 1, from: 10, to: 24, color: VIR } });
}

// ================================================================ 6. the immune war (fever, friendly fire)
function vImmune(ctx, u) {
  const heat = easeInOut(prog(u, 0.3, 4.5)), storm = 2.8, r0 = rng(101);
  const dmgAt = CELLS.map(() => storm + r0() * 2.2), hitX = CELLS.map(() => r0() < 0.45);
  tissue(ctx, u, id => ({ dmg: hitX[id] ? R2((u - dmgAt[id]) / 0.5) * 0.8 : 0 }), heat);
  // white blood cells hunting viruses
  const r = rng(102), WBC = [];
  for (let i = 0; i < 6; i++) { const x0 = r() * W, y0 = 500 + r() * 1300, ax = 120 + r() * 160, ay = 80 + r() * 140, f = 0.5 + r() * 0.6, p = r() * 6;
    WBC.push(t => [x0 + Math.sin(t * f + p) * ax, y0 + Math.cos(t * f * 0.8 + p) * ay]); }
  for (let i = 0; i < 90; i++) { const w = WBC[i % 6], eat = 0.4 + r() * 4.2, vx = r() * W, vy = 400 + r() * 1500;
    if (u > eat) { if (u < eat + 0.2) glow(ctx, ...w(eat), 60, '255,255,255', 0.6); continue; }
    const k = easeIn2(R2((u - (eat - 1.0)) / 1.0)), [tx, ty] = w(eat); vMini(ctx, lerp(vx, tx, k), lerp(vy, ty, k), 10, u * 2 + i); }
  for (const w of WBC) { const [x, y] = w(u); ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath();
    for (let a = 0; a <= 6.3; a += 0.3) { const rr = 70 + Math.sin(a * 5 + u * 4) * 8; a === 0 ? ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.fill(); ctx.fillStyle = '#b79cff'; for (const [dx, dy] of [[-18, -10], [12, -16], [6, 14]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, 18, 0, 6.283); ctx.fill(); } }
  // friendly fire: the storm
  CELLS.forEach(([x, y], id) => { if (!hitX[id] || u < dmgAt[id] - 0.1 || u > dmgAt[id] + 0.5) return; const k = (u - dmgAt[id] + 0.1) / 0.6;
    ctx.strokeStyle = `rgba(255,230,90,${1 - k})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, y, 60 + k * 120, 0, 6.283); ctx.stroke(); });
  // thermometer
  const tx = 975, top = 620, bot = 1480, temp = lerp(37, 41, heat);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; roundRect(ctx, tx - 26, top, 52, bot - top, 26); ctx.fill(); ctx.beginPath(); ctx.arc(tx, bot + 20, 46, 0, 6.283); ctx.fill();
  ctx.fillStyle = mixHex('#ff9a3a', '#ff2a2a', heat); const lvl = lerp(bot - 120, top + 30, heat); roundRect(ctx, tx - 14, lvl, 28, bot - lvl + 20, 14); ctx.fill(); ctx.beginPath(); ctx.arc(tx, bot + 20, 34, 0, 6.283); ctx.fill();
  ctx.font = `900 48px ${FONT}`; ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 12;
  ctx.fillText(`${temp.toFixed(1)}°C`, tx - 50, lvl + 16); ctx.shadowBlur = 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx);
  say(ctx, u, ['Your immune system', 'goes to war'], 230, 0.15, { size: 88, out: 2.6 });
  say(ctx, u, ['…and the fight itself', 'wrecks your lungs'], 230, 2.75, { size: 84, out: OUT('immune') });
}

// ================================================================ 7. hospitals run out of beds
function vWard(ctx, u) {
  const vx = W / 2, vy = 820, fill = easeInOut(prog(u, 0.1, 3.4)), r = rng(111);
  bgSky(ctx, ['#bff0e6', '#9fe3d6', '#7fd3c4']);
  drift(ctx, u, 0, 4.5, 1.0, 1.06, vx, 1100);
  ctx.fillStyle = '#5fb8aa'; ctx.fillRect(0, vy, W, H); ctx.fillStyle = '#c9ece4'; ctx.beginPath(); ctx.moveTo(-600, H); ctx.lineTo(vx - 50, vy); ctx.lineTo(vx + 50, vy); ctx.lineTo(W + 600, H); ctx.fill();
  ctx.fillStyle = '#ffffff'; for (let k = 0; k < 6; k++) { const s = 1 / (1 + k * 1.2); ctx.fillRect(vx - 300 * s, vy - 1100 * s, 600 * s, 18 * s); glow(ctx, vx, vy - 1080 * s, 300 * s, '255,255,240', 0.3); }
  const beds = [];
  for (let k = 0; k < 14; k++) for (const side of [-1, 0, 1]) { const z = 0.9 + k * 0.55, s = 1 / z; if (side === 0 && k > 10) continue;
    beds.push([vx + side * 400 * s, vy + 1000 * s, s * 1.25, side, r(), r(), r()]); }
  beds.sort((a, b) => a[1] - b[1]);
  for (const [x, y, s, side, a, b, c] of beds) {
    const show = side === 0 ? fill > 0.5 + a * 0.4 : true; if (!show) continue;
    const w = 340 * s, h = 120 * s, occupied = side === 0 || fill > a * 0.6, dead = occupied && c < 0.35 && u > 1.6 + c * 6;
    ctx.fillStyle = '#c8d6de'; ctx.fillRect(x - w / 2, y - h * 0.4, w, h * 0.5);
    ctx.fillStyle = '#ffffff'; roundRect(ctx, x - w / 2, y - h, w, h * 0.65, 14 * s); ctx.fill();
    ctx.fillStyle = '#eaf2ff'; roundRect(ctx, x - w / 2 + 10 * s, y - h - 10 * s, w * 0.26, h * 0.35, 10 * s); ctx.fill();
    if (!occupied) continue;
    if (dead) { ctx.fillStyle = '#f4f6f8'; roundRect(ctx, x - w / 2 + 6 * s, y - h - 26 * s, w - 12 * s, h * 0.6, 24 * s); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 3 * s; ctx.stroke(); continue; }
    ctx.fillStyle = mixHex(SKN[Math.floor(b * 5)], '#c8f08a', 0.5); ctx.beginPath(); ctx.arc(x - w / 2 + 50 * s, y - h - 6 * s, 28 * s, 0, 6.283); ctx.fill();
    ctx.fillStyle = mixHex(COLS[Math.floor(b * 9)], '#9be15d', 0.5); roundRect(ctx, x - w / 2 + 80 * s, y - h - 14 * s, w - 90 * s, h * 0.42, 20 * s); ctx.fill();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx);
  say(ctx, u, ['Hospitals run out', 'of beds in days'], 230, 0.15, { size: 88, out: 2.5 });
  say(ctx, u, ['Then hallways.', 'Then parking lots.'], 230, 2.6, { size: 88, out: OUT('ward') });
}

// ================================================================ 8. every country within weeks
const ORIGIN = [55.3, 25.2];   // an unlabelled major air hub; no source is named
function vGlobe(ctx, u) {
  space(ctx, u);
  const e = easeInOut(prog(u, 0, 4.5)), R = 560, cx = W / 2, cy = 1150, lon0 = lerp(60, -20, e), lat0 = 22, v = gView(lon0, lat0);
  drift(ctx, u, 0, 4.5, 1.0, 1.04, cx, cy);
  globe(ctx, cx, cy, R, { lon0, lat0, t: u, ink: false, sun: [0, -0.2, 1] });
  const O = wvec(...ORIGIN), spread = lerp(0.1, 4.6, prog(u, 0.2, 4.3)), [ox, oy, oz] = v(...ORIGIN);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  for (const [name, lon, lat, pop] of CITIES) {
    const w = wvec(lon, lat), dd = Math.acos(R2(w[0] * O[0] + w[1] * O[1] + w[2] * O[2], -1, 1)), jit = ((name.length * 7) % 10) / 10;
    const age = spread - (dd * 1.1 + jit * 0.8); if (age < 0) continue;
    const [vx, vy, vz] = v(lon, lat); if (vz < 0.02) continue;
    const sx = cx + vx * R, sy = cy + vy * R, rad = (20 + Math.sqrt(pop) * 12) * R2(age / 1.2);
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad * 2); g.addColorStop(0, 'rgba(170,255,60,0.6)'); g.addColorStop(1, 'rgba(170,255,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, rad * 2, 0, 6.283); ctx.fill();
    vMini(ctx, sx, sy, 5 + Math.sqrt(pop) * 0.9, u * 2 + pop);
    if (oz > -0.2) { const f = R2(age / 0.8), x0 = cx + ox * R, y0 = cy + oy * R, mx = (x0 + sx) / 2, my = (y0 + sy) / 2, dl = Math.hypot(sx - x0, sy - y0);
      const nx = mx - cx, ny = my - cy, nl = Math.hypot(nx, ny) || 1, qx = mx + nx / nl * dl * 0.35, qy = my + ny / nl * dl * 0.35;
      ctx.strokeStyle = `rgba(230,255,170,${0.7 * (1 - R2((age - 1.5) / 1.5))})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0);
      for (let s = 1; s <= 24; s++) { const q = s / 24 * f, a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, c = q * q; ctx.lineTo(a * x0 + b * qx + c * sx, a * y0 + b * qy + c * sy); }
      ctx.stroke(); }
  }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Within weeks, it’s', 'in every country', 'on Earth'], 230, 0.15, { size: 84, out: OUT('globe') });
}

// ================================================================ 9. the toll: 1 in 3 fall
function vToll(ctx, u) {
  bgSky(ctx, ['#4b3fc9', '#3a2fa0', '#2a2178']);
  const cols = 10, rows = 9, n = Math.round(1800000000 * easeOut(prog(u, 1.6, 3.6)));
  for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) { const i = rr * cols + c, x = 95 + c * 99 + (rr % 2) * 30 - 15, y = 980 + rr * 92;
    const sick = R2((u - 0.2 - (c + rr) * 0.05) / 0.4), dies = (i * 7) % 3 === 0, fall = dies ? R2((u - 1.6 - ((i * 13) % 17) * 0.07) / 0.5) : 0;
    person2(ctx, x, y, 80, { seed: i, sick, fall, grey: fall, t: u, dir: i % 2 ? 1 : -1 }); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Most of the world', 'catches it. 1 in 3 die.'], 230, 0.15, { size: 76, out: OUT('toll'), mark: { line: 1, from: 12, to: 22, color: '#ff4d6d' } });
  bigNum(ctx, u, n.toLocaleString('en-US'), 560, 1.6, { size: 116, color: '#ffffff', out: OUT('toll') });
  say(ctx, u, ['dead in a year (est.)'], 690, 1.9, { size: 56, weight: 800, x: W / 2, align: 'center', out: OUT('toll') });
}

// ================================================================ 10. AI fights back: antibodies
function vVaccine(ctx, u) {
  tissue(ctx, u, () => ({}));
  const r = rng(121);
  for (let i = 0; i < 70; i++) { const x = r() * W, y = 420 + r() * 1450, lock = 0.5 + r() * 3.2, rot = u * 2 + i, a = r() * 6.283;
    const k = R2((u - lock) / 0.4);
    if (k < 1) vMini(ctx, x + Math.sin(u + i) * 20, y + Math.cos(u * 0.8 + i) * 20, 11 * (1 - 0.3 * k), rot, mixHex(VIR, '#8a8a98', k));
    else { ctx.fillStyle = 'rgba(140,140,160,0.6)'; ctx.beginPath(); ctx.arc(x + Math.sin(u + i) * 20, y + Math.cos(u * 0.8 + i) * 20, 7, 0, 6.283); ctx.fill(); }
    // antibody flies in from the edge and latches on
    const ka = easeOut(R2((u - (lock - 0.7)) / 0.7)); if (ka <= 0) continue;
    const tx = x + Math.sin(u + i) * 20 + Math.cos(a) * 26, ty = y + Math.cos(u * 0.8 + i) * 20 + Math.sin(a) * 26, sx = tx + Math.cos(a) * 900 * (1 - ka), sy = ty + Math.sin(a) * 900 * (1 - ka);
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(a - Math.PI / 2); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 6); ctx.lineTo(-14, -12); ctx.moveTo(0, 6); ctx.lineTo(14, -12); ctx.stroke();
    ctx.strokeStyle = '#4cc9f0'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx); scrimB(ctx, 1400);
  say(ctx, u, ['But AI can', 'fight back too'], 230, 0.15, { size: 96, out: OUT('vaccine'), mark: { line: 1, from: 0, to: 10, color: '#2a9df4' } });
  say(ctx, u, ['COVID’s vaccine was', 'designed in 2 days.'], 1560, 1.0, { size: 66, weight: 900, out: 2.9 });
  say(ctx, u, ['Making billions of', 'doses took a year.'], 1560, 3.0, { size: 66, weight: 900, out: OUT('vaccine') });
}

// ================================================================ 11. twist
function molecule(ctx, x, y, s, seed, col) {
  const r = rng(seed), n = 4 + Math.floor(r() * 4), P = [[0, 0]];
  for (let i = 1; i < n; i++) { const p = P[Math.floor(r() * P.length)], a = r() * 6.283; P.push([p[0] + Math.cos(a), p[1] + Math.sin(a)]); }
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, s * 0.14); ctx.beginPath();
  for (let i = 1; i < n; i++) { const q = P[Math.max(0, i - 1 - Math.floor(r() * 2))]; ctx.moveTo(x + q[0] * s, y + q[1] * s); ctx.lineTo(x + P[i][0] * s, y + P[i][1] * s); } ctx.stroke();
  ctx.fillStyle = col; for (const [a, b] of P) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, s * 0.24, 0, 6.283); ctx.fill(); }
}
function vTwist(ctx, u) {
  bgSky(ctx, ['#1d2b64', '#2b3f8f', '#3a55b0']);
  const cols = 11, rows = 13, total = cols * rows, p = easeIn2(prog(u, 2.4, 5.2)), shown = Math.floor(total * p);
  for (let i = 0; i < shown; i++) { const c = i % cols, r = Math.floor(i / cols), x = 80 + c * 92, y = 700 + r * 68;
    molecule(ctx, x, y, 15, i * 31 + 7, [SPK, '#ff7ab6', '#7ae0ff', '#ffd25a'][i % 4]); }
  const n = Math.round(40000 * p);
  say(ctx, u, ['Plot twist:', 'this is already possible.'], 230, 0.15, { size: 84, out: 2.3, mark: { line: 1, from: 8, to: 24, color: VIR } });
  say(ctx, u, ['In 2022, researchers set a', 'drug-design AI to look for', 'toxins instead of cures.'], 230, 2.4, { size: 62, out: OUT('twist') });
  if (u > 2.4) { ctx.fillStyle = 'rgba(29,43,100,0.85)'; ctx.fillRect(0, 1630, W, 200); }
  bigNum(ctx, u, `${n.toLocaleString('en-US')} deadly molecules`, 1690, 2.5, { size: 70, color: SPK, out: OUT('twist') });
  say(ctx, u, ['in under 6 hours'], 1790, 3.0, { size: 52, weight: 800, x: W / 2, align: 'center', out: OUT('twist') });
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
