// What if Trump lost in 2016?   (v2: leans liberal by request; every factual claim documented)
//
// EDITORIAL: the channel's take is that the other timeline would be better. To keep it credible, the hits are documented
// events, and the counterfactuals are framed as likely, not certain. Little caricature figures (faceless) for Trump and
// Clinton.
//
// FACTS (checked):
//  - 2016 margins: WI 22,748; MI 10,704; PA 44,292 -> 77,744 votes, <0.06% of ~137M cast. Pledged EV 306-232 -> 260-278.
//  - Supreme Court: Gorsuch (2017), Kavanaugh (2018), Barrett (2020) -> 6-3 conservative; Dobbs (June 2022) overturned Roe.
//    Republican Senate 2017-2021 could have blocked Clinton's picks (footnote on screen).
//  - Paris exit announced 2017 (and again in 2025); Iran deal (JCPOA) exit May 2018; TCJA Dec 2017 (~$1.9T added to
//    deficits over 10 yrs, CBO); trade war tariffs 2018-19.
//  - Our-timeline events: travel ban (Jan 2017); family separations at the border (2018, thousands of children);
//    impeachments (Dec 2019, Jan 2021); January 6th (2021); pardons/commutations for ~1,500 Jan. 6 defendants (Jan 2025);
//    $TRUMP meme coin (Jan 2025); acceptance of a ~$400M Boeing 747 from Qatar (May 2025).
//  - COVID: ~1.2 million U.S. deaths. The White House NSC pandemic office was disbanded in 2018. Multiple studies
//    (e.g. Lancet Commission 2021; comparisons with peer nations) estimate hundreds of thousands of U.S. deaths were avoidable.
//  - 2025: sweeping tariffs on nearly every country; average effective rate highest since the 1930s (Yale Budget Lab);
//    most were struck down by the Supreme Court in Feb 2026 (Learning Resources v. Trump).
//  - 2026: a U.S.-Israeli war with Iran (began 2026; DoD cost estimate ~$48B by Nov 2026); unresolved as of Nov 2026.
//  - Oct 2016 reports (FT, Vanity Fair) of Trump allies exploring a "Trump TV" network.
//  - Today (Nov 2026): Trump is president (second term, inaugurated Jan 2025).

const SCENES = [
  ['hook', 3.5, [[0, 'swell:2.6']]],
  ['margin', 5.0, [[0.2, 'rumble:4.6'], [2.6, 'impact']]],
  ['flip', 4.5, [[0.4, 'impact'], [0.7, 'impact'], [1.0, 'impact'], [1.9, 'swell:2.4']]],
  ['fork', 4.0, [[0.2, 'swell:3.6'], [1.2, 'boom']]],
  ['court', 5.0, [[0.2, 'rumble:4.6'], [1.6, 'impact'], [3.2, 'impact']]],
  ['news', 6.0, [[0.3, 'air'], [1.4, 'air'], [2.5, 'air'], [3.6, 'air'], [4.7, 'air']]],
  ['wall', 6.0, [[0.2, 'rumble:5.6'], [2.2, 'impact'], [3.6, 'impact'], [5.0, 'impact']]],
  ['covid', 5.5, [[0.2, 'heart:5.2']]],
  ['war', 5.5, [[0.2, 'rumble:5.2'], [2.8, 'boom'], [3.2, 'impact']]],
  ['tv', 4.0, [[0.2, 'swell:3.6']]],
  ['final', 5.5, [[0.2, 'swell:5']]],
  ['end', 3.0, [[0.2, 'swell:2.5']]],
];
const START = {}; let _acc = 0; const _sfx = [];
for (const [n, d, cues] of SCENES) { START[n] = _acc; if (_acc > 0) _sfx.push([_acc, 'air']); for (const [lt, s] of cues) _sfx.push([+(_acc + lt).toFixed(2), s]); _acc += d; }
const TOTAL = _acc;

const SHORT = {
  title: 'What if Trump lost in 2016?',
  duration: TOTAL,
  fps: 60,
  motionSamples: 1,
  sfx: _sfx,
  music: { bpm: 76, mode: 'cinematic', until: TOTAL - 0.3, duckAt: [] },
};

const FNS = { hook: vHook, margin: vMargin, flip: vFlip, fork: vFork, court: vCourt, news: vNews, wall: vWall, covid: vCovid2, war: vWar,
              tv: vTV, final: vFinal, end: vEnd };
const OUT = n => SCENES.find(s => s[0] === n)[1] - 0.3;
const RED = '#e63946', BLUE = '#3a86ff', GOLD = '#ffbe0b', TEAL = '#4cc9f0', VIR = '#8a4fff', SPK = '#c6ff4a';
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  sequence(ctx, t, SCENES.map(([n]) => [START[n], (c, tt) => FNS[n](c, tt - START[n])]), 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < START.end) { ctx.font = `800 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', 70, 1850); }
  post(ctx, { bloom: 0.15 });
}
function nightSky(ctx, u, top = '#0b1440', bot = '#2a3a8a') { bgSky(ctx, [top, mixHex(top, bot, 0.5), bot]); const r = rng(5);
  for (let i = 0; i < 120; i++) { const x = r() * W, y = r() * H * 0.7, tw = 0.5 + 0.5 * Math.sin(u * 3 + i); ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.5 * tw * r()})`; ctx.fillRect(x, y, 3, 3); } }
function sparkle(ctx, x, y, s, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#ffffff'; ctx.beginPath();
  ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
  glow(ctx, x, y, s * 2, '255,255,255', 0.5 * a); ctx.restore(); }
function confetti(ctx, u, at, x, y, n = 260, cols = [BLUE, '#ffffff', '#9ec5ff', GOLD]) {
  if (u < at) return; const dt = u - at, r = rng(Math.floor(at * 100) + n);
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, sp = 600 + r() * 1300, drag = 1.6;
    const px = x + Math.cos(a) * sp * (1 - Math.exp(-drag * dt)) / drag + Math.sin(dt * 3 + i) * 30 * dt, py = y + Math.sin(a) * sp * (1 - Math.exp(-drag * dt)) / drag + 260 * dt * dt * 0.6;
    if (py > H + 40) continue; const spin = dt * (6 + r() * 8) + i;
    ctx.save(); ctx.translate(px, py); ctx.rotate(spin); ctx.scale(1, Math.cos(spin * 1.7)); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); }
}
function vMini(ctx, x, y, r, rot = 0, col = VIR) {
  ctx.strokeStyle = SPK; ctx.lineWidth = Math.max(1, r * 0.22); ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = rot + i * Math.PI / 4; ctx.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); ctx.lineTo(x + Math.cos(a) * r * 1.45, y + Math.sin(a) * r * 1.45); }
  ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
}

// ================================================================ little caricature figures (faceless)
function pol(ctx, x, y, s, who, o = {}) {
  const { pose = 'stand', t = 0, dir = 1, slump = 0 } = o;
  const P = who === 'trump' ? { suit: '#1c2541', leg: '#141a30', skin: '#f4a462', hair: '#f2c14e' } : { suit: '#2f6fd6', leg: '#2558b0', skin: '#ffd9c0', hair: '#f5d78e' };
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  ctx.fillStyle = 'rgba(20,20,60,0.2)'; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.3, s * 0.05, 0, 0, 6.283); ctx.fill();
  ctx.rotate(slump * 0.12);
  ctx.fillStyle = P.leg; roundRect(ctx, -s * 0.16, -s * 0.34, s * 0.13, s * 0.34, s * 0.05); ctx.fill(); roundRect(ctx, s * 0.03, -s * 0.34, s * 0.13, s * 0.34, s * 0.05); ctx.fill();
  const w = Math.sin(t * 9) * 0.3, A = { stand: [0.15, 0.15], wave: [0.15, 2.6 + w], cheer: [2.7 + w, 2.7 - w], point: [0.15, 1.5 + w * 0.3], sad: [0.04, 0.04] }[pose] || [0.15, 0.15];
  for (const side of [-1, 1]) { const a = side < 0 ? A[0] : A[1], sx = side * s * 0.2, sy = -s * 0.62, ex = sx + side * Math.sin(a) * s * 0.3, ey = sy + Math.cos(a) * s * 0.3;
    ctx.lineCap = 'round'; ctx.strokeStyle = P.suit; ctx.lineWidth = s * 0.1; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = P.skin; ctx.beginPath(); ctx.arc(ex, ey, s * 0.05, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = P.suit; roundRect(ctx, -s * 0.23, -s * 0.7, s * 0.46, s * 0.42, s * 0.12); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-s * 0.07, -s * 0.7); ctx.lineTo(s * 0.07, -s * 0.7); ctx.lineTo(0, -s * 0.58); ctx.fill();
  if (who === 'trump') { ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(-s * 0.025, -s * 0.66); ctx.lineTo(s * 0.025, -s * 0.66); ctx.lineTo(s * 0.035, -s * 0.24); ctx.lineTo(0, -s * 0.2); ctx.lineTo(-s * 0.035, -s * 0.24); ctx.fill(); }
  else { ctx.fillStyle = '#ffffff'; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * s * 0.03, -s * 0.66 + Math.abs(i) * -s * 0.008, s * 0.012, 0, 6.283); ctx.fill(); } }
  ctx.fillStyle = P.skin; ctx.beginPath(); ctx.arc(0, -s * 0.85, s * 0.155, 0, 6.283); ctx.fill();
  ctx.fillStyle = P.hair;
  if (who === 'trump') { ctx.beginPath(); ctx.ellipse(-s * 0.01, -s * 0.96, s * 0.17, s * 0.075, -0.12, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * 0.12, -s * 0.94, s * 0.09, s * 0.05, 0.3, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-s * 0.13, -s * 0.88, s * 0.05, s * 0.07, 0, 0, 6.283); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(0, -s * 0.93, s * 0.18, s * 0.11, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-s * 0.18, -s * 0.94, s * 0.07, s * 0.15); ctx.fillRect(s * 0.11, -s * 0.94, s * 0.07, s * 0.15); }
  ctx.restore();
}
function tag(ctx, x, y, txt, col) { ctx.font = `900 30px ${FONT}`; ctx.textAlign = 'center'; const w = ctx.measureText(txt).width + 30;
  ctx.fillStyle = col; roundRect(ctx, x - w / 2, y - 26, w, 44, 22); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillText(txt, x, y + 6); }

// ================================================================ the "never happens" wall
const NEVER = [['2017', 'Muslim travel ban'], ['2018', 'Kids separated from parents at the border'], ['2019', 'First impeachment'], ['2021', 'January 6th attack on the Capitol'],
  ['2021', 'Second impeachment'], ['2025', 'Pardons for ~1,500 Jan. 6 defendants'], ['2025', 'A $TRUMP meme coin'], ['2025', 'A $400M jet gift from Qatar']];
function vWall(ctx, u) {
  bgSky(ctx, ['#2a1f6a', '#3a2f8a', '#4a3faa']);
  NEVER.forEach(([yr, txt], i) => { const c = i % 2, r = Math.floor(i / 2), x = 60 + c * 490, y = 560 + r * 250, at = 0.2 + i * 0.18, k = easeBack(R2((u - at) / 0.35)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 230, y + 100); ctx.scale(k, k); ctx.rotate((i % 3 - 1) * 0.02);
    ctx.fillStyle = '#ffffff'; roundRect(ctx, -230, -100, 460, 200, 24); ctx.fill(); ctx.fillStyle = GOLD; roundRect(ctx, -230, -100, 460, 22, 11); ctx.fill();
    ctx.font = `900 30px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#9a8a40'; ctx.fillText(yr, -200, -46);
    ctx.font = `800 36px ${FONT}`; ctx.fillStyle = '#1b1b2e'; const words = txt.split(' '); let line = '', ly = 4; for (const wd of words) { if (ctx.measureText(line + wd).width > 400) { ctx.fillText(line, -200, ly); line = ''; ly += 42; } line += wd + ' '; } ctx.fillText(line, -200, ly);
    const st = 2.0 + i * 0.42, sk = R2((u - st) / 0.18);
    if (sk > 0) { ctx.strokeStyle = 'rgba(230,57,70,0.85)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-205, -8); ctx.lineTo(-205 + 410 * R2(sk * 1.5), -8); ctx.stroke();
      ctx.save(); ctx.translate(95, 62); ctx.rotate(-0.12); const sc = lerp(1.6, 0.55, easeOut(sk)); ctx.scale(sc, sc); ctx.globalAlpha = R2(sk * 1.5);
      ctx.strokeStyle = '#e63946'; ctx.lineWidth = 8; roundRect(ctx, -190, -44, 380, 88, 14); ctx.stroke(); ctx.font = `900 50px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e63946'; ctx.fillText('NEVER HAPPENS', 0, 18); ctx.restore(); }
    ctx.restore();
    if (u > st && u < st + 0.5) for (let q = 0; q < 5; q++) sparkle(ctx, x + 230 + Math.cos(q * 1.26) * 200, y + 100 + Math.sin(q * 1.26) * 110, 14, 1 - (u - st) / 0.5); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['In the other timeline,', 'none of this happens:'], 230, 0.15, { size: 80, out: OUT('wall') });
}

// ================================================================ COVID, side by side
function vCovid2(ctx, u) {
  bgSky(ctx, ['#ece6ff', '#dcd2ff', '#c9bcff']);
  ctx.fillStyle = 'rgba(255,190,11,0.16)'; ctx.fillRect(0, 600, W, 560); ctx.fillStyle = 'rgba(76,201,240,0.18)'; ctx.fillRect(0, 1160, W, 600); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 1156, W, 8);
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#b07a00'; ctx.fillText('OUR TIMELINE', 70, 660); ctx.fillStyle = '#1478a0'; ctx.fillText('THE OTHER ONE', 70, 1220);
  for (let i = 0; i < 9; i++) { const x = 110 + i * 108;
    const f1 = R2((u - 0.8 - i * 0.12) / 0.5); person2(ctx, x, 1010, 150, { seed: i + 3, sick: 0.7, fall: f1, grey: f1, t: u, dir: i % 2 ? 1 : -1 });
    const dies = i % 3 === 0, f2 = dies ? R2((u - 2.2 - i * 0.1) / 0.5) : 0; person2(ctx, x, 1570, 150, { seed: i + 3, sick: dies ? 0.7 : 0, fall: f2, grey: f2, t: u, dir: i % 2 ? 1 : -1 });
    if (!dies && u > 2.8 && u < 4.4) sparkle(ctx, x + 40, 1400 + Math.sin(u * 4 + i) * 20, 14, 0.8); }
  const lab = (txt, y, at, col, sz = 42) => { if (u < at) return; ctx.save(); ctx.globalAlpha = R2((u - at) / 0.3); ctx.font = `900 ${sz}px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = col; ctx.fillText(txt, 70, y); ctx.restore(); };
  lab('~1.2 million Americans died', 1110, 1.4, '#2b2d42');
  lab('Pandemic team still in place.', 1660, 2.4, '#2b2d42'); lab('Experts: hundreds of thousands', 1712, 3.0, BLUE, 38); lab('of those deaths were avoidable', 1756, 3.0, BLUE, 38);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.7);
  say(ctx, u, ['2020: COVID hits.', 'Trump had disbanded', 'the pandemic office.'], 230, 0.15, { size: 72, out: OUT('covid') });
}

// ================================================================ tariffs and the Iran war, side by side
function vWar(ctx, u) {
  bgSky(ctx, ['#ece6ff', '#dcd2ff', '#c9bcff']);
  // top: our timeline (smoky, jets, containers stamped with tariffs)
  ctx.fillStyle = '#e8c9a8'; ctx.fillRect(0, 600, W, 556);
  const r = rng(13);
  for (let i = 0; i < 4; i++) { const ex = 640 + r() * 380, ey = 760 + r() * 300, at = 1.6 + i * 0.5, dt = u - at; if (dt < 0) continue;
    glow(ctx, ex, ey, 60 + 160 * R2(dt), '255,140,40', 0.9 * Math.exp(-dt)); for (let k = 0; k < 5; k++) { ctx.fillStyle = `rgba(80,60,60,${0.35 - k * 0.06})`; ctx.beginPath(); ctx.arc(ex + k * 10, ey - k * 40 * R2(dt), 30 + k * 12, 0, 6.283); ctx.fill(); } }
  for (let i = 0; i < 3; i++) { const jx = ((u * 500 + i * 380) % 1500) - 200, jy = 700 + i * 70; ctx.fillStyle = '#4a4f63'; ctx.beginPath(); ctx.moveTo(jx + 60, jy); ctx.lineTo(jx - 30, jy - 18); ctx.lineTo(jx - 30, jy + 18); ctx.fill(); ctx.fillRect(jx - 50, jy - 4, 40, 8); }
  const CC = ['#e63946', '#3a86ff', '#ffbe0b', '#2ec4b6', '#8338ec'];
  for (let i = 0; i < 12; i++) { const c = i % 4, rr = Math.floor(i / 4), x = 70 + c * 125, y = 1110 - rr * 70; ctx.fillStyle = CC[i % 5]; ctx.fillRect(x, y - 60, 118, 62); ctx.fillStyle = 'rgba(0,0,0,0.15)'; for (let k = 0; k < 6; k++) ctx.fillRect(x + 8 + k * 18, y - 54, 6, 50); }
  if (u > 0.6) { const k = easeBack(R2((u - 0.6) / 0.3)); ctx.save(); ctx.translate(320, 960); ctx.rotate(-0.15); ctx.scale(k, k); ctx.strokeStyle = '#e63946'; ctx.lineWidth = 8; roundRect(ctx, -170, -40, 340, 80, 12); ctx.stroke();
    ctx.font = `900 50px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e63946'; ctx.fillText('TARIFFS', 0, 18); ctx.restore(); }
  // bottom: the other timeline (calm sea, ships sailing)
  ctx.fillStyle = '#9fdcff'; ctx.fillRect(0, 1164, W, 600); ctx.fillStyle = '#3a9ad8'; ctx.fillRect(0, 1480, W, 300);
  for (let i = 0; i < 3; i++) { const sx = ((u * 90 + i * 400) % 1400) - 200, sy = 1500 + i * 60, s = 0.7 + i * 0.15;
    ctx.save(); ctx.translate(sx, sy); ctx.scale(s, s); ctx.fillStyle = '#263a6a'; ctx.beginPath(); ctx.moveTo(-160, -30); ctx.lineTo(170, -30); ctx.lineTo(140, 10); ctx.lineTo(-140, 10); ctx.fill();
    for (let k = 0; k < 6; k++) { ctx.fillStyle = CC[(k + i) % 5]; ctx.fillRect(-130 + k * 44, -70, 40, 38); } ctx.restore(); }
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 1156, W, 8);
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#7a4a00'; ctx.fillText('OUR TIMELINE', 70, 660); ctx.fillStyle = '#0a5a80'; ctx.fillText('THE OTHER ONE', 70, 1220);
  const lab = (txt, x, y, at, col, al = 'left') => { if (u < at) return; ctx.save(); ctx.globalAlpha = R2((u - at) / 0.3); ctx.font = `900 40px ${FONT}`; ctx.textAlign = al; ctx.fillStyle = col; ctx.fillText(txt, x, y); ctx.restore(); };
  lab('2025: biggest tariffs', 70, 730, 0.6, '#2b2d42'); lab('since the 1930s', 70, 776, 0.6, '#2b2d42');
  lab('2026: war with Iran', 1010, 730, 1.6, '#c0202e', 'right');
  lab('Iran deal holds. No war.', 70, 1300, 3.0, '#0a5a80'); lab('No tariff wall.', 70, 1350, 3.4, '#0a5a80');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.7);
  say(ctx, u, ['Then the second term:', 'tariffs and a war'], 230, 0.15, { size: 80, out: OUT('war') });
}

// ================================================================ the tile map (2016 results)
const TILES = { AK: [0, 0], ME: [11, 0], VT: [10, 1], NH: [11, 1], WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], WI: [7, 2], MI: [8, 2], NY: [9, 2], RI: [10, 2], MA: [11, 2],
  OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3],
  CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
  AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
  OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6], HI: [0, 7], TX: [4, 7], FL: [9, 7] };
const DWON = new Set(['CA', 'OR', 'WA', 'NV', 'CO', 'NM', 'MN', 'IL', 'VA', 'MD', 'DE', 'NJ', 'NY', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME', 'HI', 'DC']);
const SWING = { WI: 22748, MI: 10704, PA: 44292 };
function tileMap(ctx, u, cx, cy, sz, o = {}) {
  const { flip = () => 0, pulse = () => 0, appear = 1, flicker = 0 } = o, gap = sz * 0.1;
  for (const [st, [c, r]] of Object.entries(TILES)) {
    const x = cx + (c - 5.5) * sz, y = cy + (r - 3.5) * sz, a = easeBack(R2((appear * 2.2 - (c + r) * 0.08)));
    if (a <= 0) continue;
    const f = flip(st), sy = Math.abs(Math.cos(Math.PI * f)), blue = DWON.has(st) !== (f > 0.5);
    let col = blue ? BLUE : RED; if (flicker) col = (Math.sin(u * 9 + c * 1.3 + r * 2.1) > 0) ? BLUE : RED;
    const p = pulse(st);
    ctx.save(); ctx.translate(x, y); ctx.scale(a * (1 + 0.12 * p), a * Math.max(0.04, sy) * (1 + 0.12 * p));
    if (p > 0) glow(ctx, 0, 0, sz, '255,255,255', 0.5 * p);
    ctx.fillStyle = col; roundRect(ctx, -sz / 2 + gap / 2, -sz / 2 + gap / 2, sz - gap, sz - gap, sz * 0.18); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; roundRect(ctx, -sz / 2 + gap / 2, -sz / 2 + gap / 2, sz - gap, (sz - gap) * 0.4, sz * 0.18); ctx.fill();
    ctx.font = `800 ${sz * 0.32}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fillText(st, 0, 2);
    ctx.restore();
  }
}

// ================================================================ 1. hook
function vHook(ctx, u) {
  nightSky(ctx, u);
  drift(ctx, u, 0, 3.5, 1.0, 1.06, W / 2, 1150);
  tileMap(ctx, u, W / 2, 1150, 88, { appear: prog(u, 0, 1.2), flicker: u > 1.4 ? 1 : 0 });
  pol(ctx, 150, 1760, 260, 'clinton', { pose: 'wave', t: u }); pol(ctx, 420, 1760, 260, 'trump', { pose: 'point', t: u, dir: -1 });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u < 3.4) { ctx.save(); ctx.globalAlpha = 1 - easeInOut(prog(u, 3.0, 3.4));
    shadowed(ctx, () => blip(ctx, u, 890, 1700, u > 1.3 ? 'shock' : 'happy', 0.8, 0.3), 30, 14, 'rgba(0,0,0,0.35)'); ctx.restore(); }
  say(ctx, u, ['What if Trump', 'lost in 2016?'], 300, 0.15, { size: 104, out: OUT('hook'), mark: { line: 1, from: 0, to: 4, color: BLUE } });
}

// ================================================================ 2. 77,744 votes
function vMargin(ctx, u) {
  nightSky(ctx, u);
  const z = lerp(1, 1.35, easeInOut(prog(u, 0.3, 2.2))), fx = lerp(W / 2, W / 2 - 160, easeInOut(prog(u, 0.3, 2.2)));
  ctx.save(); ctx.translate(W / 2, 1100); ctx.scale(z, z); ctx.translate(-fx, -1100);
  tileMap(ctx, u, W / 2, 1100, 88, { pulse: st => (SWING[st] ? 0.5 + 0.5 * Math.sin(u * 6) : 0) });
  ctx.restore();
  // margins float up from the three states
  const pos = st => { const [c, r] = TILES[st]; return [W / 2 + ((W / 2 + (c - 5.5) * 88) - fx) * z, 1100 + (r - 3.5) * 88 * z]; };
  Object.entries(SWING).forEach(([st, v], i) => { const at = 0.6 + i * 0.4; if (u < at) return; const k = easeBack(R2((u - at) / 0.4)), [x, y] = pos(st);
    const tx = 200 + i * 340, ty = 700; const px = lerp(x, tx, k), py = lerp(y, ty, k);
    ctx.save(); ctx.globalAlpha = R2((u - at) / 0.2); ctx.fillStyle = 'rgba(255,255,255,0.95)'; roundRect(ctx, px - 150, py - 62, 300, 124, 26); ctx.fill();
    ctx.font = `900 50px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = RED; ctx.fillText(v.toLocaleString('en-US'), px, py + 4);
    ctx.font = `800 28px ${FONT}`; ctx.fillStyle = '#2b2d42'; ctx.fillText({ WI: 'Wisconsin', MI: 'Michigan', PA: 'Pennsylvania' }[st], px, py + 42); ctx.restore(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['It came down to', '3 states'], 230, 0.15, { size: 92, out: 2.4 });
  if (u > 2.5) { const n = Math.round(77744 * easeOut(prog(u, 2.5, 3.6))); bigNum(ctx, u, n.toLocaleString('en-US'), 330, 2.5, { size: 140, color: '#ffffff', out: OUT('margin') }); }
  scrimB(ctx, 1560, 0.6);
  say(ctx, u, ['votes. Less than 0.06%', 'of all votes cast.'], 1700, 2.9, { size: 64, weight: 900, out: OUT('margin'), mark: { line: 0, from: 7, to: 21, color: RED } });
}

// ================================================================ 3. flip them
function vFlip(ctx, u) {
  nightSky(ctx, u, '#0b1440', '#23408a');
  const flips = { WI: 0.4, MI: 0.7, PA: 1.0 };
  tileMap(ctx, u, W / 2, 1060, 88, { flip: st => (flips[st] !== undefined ? easeInOut(R2((u - flips[st]) / 0.45)) : 0), pulse: st => (flips[st] !== undefined && u > flips[st] && u < flips[st] + 0.6 ? 1 - (u - flips[st]) / 0.6 : 0) });
  for (const [st, at] of Object.entries(flips)) if (u > at + 0.2 && u < at + 0.9) { const [c, r] = TILES[st], x = W / 2 + (c - 5.5) * 88, y = 1060 + (r - 3.5) * 88;
    for (let k = 0; k < 5; k++) { const a = k * 1.256 + u * 3; sparkle(ctx, x + Math.cos(a) * 70, y + Math.sin(a) * 70, 16, 1 - (u - at - 0.2) / 0.7); } }
  // electoral vote bar
  const k = easeInOut(prog(u, 0.4, 1.5)), dEV = Math.round(lerp(232, 278, k)), rEV = 538 - 0 - dEV - (538 - 232 - 306), y = 1500, bx = 70, bw = W - 140;
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; roundRect(ctx, bx, y, bw, 70, 35); ctx.fill();
  ctx.save(); roundRect(ctx, bx, y, bw, 70, 35); ctx.clip();
  ctx.fillStyle = BLUE; ctx.fillRect(bx, y, bw * dEV / 538, 70); ctx.fillStyle = RED; ctx.fillRect(bx + bw - bw * rEV / 538, y, bw * rEV / 538, 70); ctx.restore();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(bx + bw * 270 / 538, y - 20); ctx.lineTo(bx + bw * 270 / 538, y + 90); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `900 64px ${FONT}`; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(dEV, bx, y - 26); ctx.textAlign = 'right'; ctx.fillText(rEV, bx + bw, y - 26);
  ctx.font = `800 28px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('270 TO WIN', bx + bw * 270 / 538, y + 125);
  pol(ctx, 300, 1880, 280, 'clinton', { pose: u > 1.55 ? 'cheer' : 'stand', t: u }); tag(ctx, 470, 1790, 'CLINTON', BLUE);
  const off = easeIn2(R2((u - 2.2) / 1.6)); pol(ctx, 790 + off * 500, 1880, 280, 'trump', { pose: u > 1.55 ? 'sad' : 'stand', slump: u > 1.55 ? 1 : 0, t: u, dir: off > 0 ? 1 : -1 }); if (off < 0.4) tag(ctx, 620, 1790, 'TRUMP', RED);
  confetti(ctx, u, 1.55, W / 2, 1500, 320);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Flip them, and', 'Hillary Clinton becomes', 'the 45th president'], 230, 0.15, { size: 76, out: OUT('flip') });
}

// ================================================================ 4. history forks (subway map of time)
function track(ctx, pts, col, w, f, u) {   // draw a polyline up to fraction f, with flowing dashes
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * f; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(...pts[0]); let end = pts[0];
  for (let i = 1; i < pts.length && rem > 0; i++) { const q = Math.min(1, rem / L[i - 1]); end = [lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)]; ctx.lineTo(...end); rem -= L[i - 1]; }
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.setLineDash([w * 0.6, w * 1.4]); ctx.lineDashOffset = -u * 120; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = w * 0.3; ctx.stroke(); ctx.setLineDash([]);
  glow(ctx, end[0], end[1], w * 2.5, '255,255,255', 0.6); return end;
}
function node(ctx, x, y, label, col, a = 1, side = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, 26, 0, 6.283); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.stroke();
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = side > 0 ? 'left' : 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff'; ctx.fillText(label, x + side * 46, y); ctx.restore();
}
const FORK = { base: [[W / 2, 2000], [W / 2, 1380]], ours: [[W / 2, 1380], [W / 2 - 60, 1250], [250, 1000], [250, 560]], other: [[W / 2, 1380], [W / 2 + 60, 1250], [830, 1000], [830, 560]] };
function vFork(ctx, u) {
  nightSky(ctx, u, '#140f3a', '#3a2a8a');
  drift(ctx, u, 0, 4, 1.04, 1.0, W / 2, 1200);
  track(ctx, FORK.base, '#ffffff', 34, easeOut(prog(u, 0, 0.9)), u);
  if (u > 0.8) node(ctx, W / 2, 1380, '2016', '#ffffff', R2((u - 0.8) / 0.3));
  if (u > 1.1) { const f = easeInOut(prog(u, 1.1, 2.6)); track(ctx, FORK.ours, GOLD, 30, f, u); track(ctx, FORK.other, TEAL, 30, f, u);
    if (u > 1.2 && u < 1.8) { const k = (u - 1.2) / 0.6; for (let i = 0; i < 10; i++) sparkle(ctx, W / 2 + Math.cos(i * 0.63) * k * 220, 1380 + Math.sin(i * 0.63) * k * 220, 20, 1 - k); } }
  if (u > 2.4) { const a = R2((u - 2.4) / 0.4);
    ctx.save(); ctx.globalAlpha = a; ctx.font = `900 44px ${FONT}`; ctx.textAlign = 'center';
    ctx.fillStyle = GOLD; ctx.fillText('OUR', 250, 470); ctx.fillText('TIMELINE', 250, 520); ctx.fillStyle = TEAL; ctx.fillText('THE OTHER', 830, 470); ctx.fillText('ONE', 830, 520); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['History splits', 'in two'], 230, 0.15, { size: 100, out: OUT('fork') });
}

// ================================================================ 5. the Supreme Court, side by side
function bench(ctx, u, y, cols, labelsOn, at) {
  for (let i = 0; i < 9; i++) { const x = 100 + i * 110, k = easeBack(R2((u - at - i * 0.05) / 0.35)); if (k <= 0) continue;
    const c = cols[i], swing = [3, 4, 5].includes(i);
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    if (swing && labelsOn) glow(ctx, 0, -40, 90, '255,255,255', 0.35 + 0.2 * Math.sin(u * 5));
    ctx.fillStyle = c; roundRect(ctx, -42, -150, 84, 150, 20); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.2)'; roundRect(ctx, -42, -150, 84, 50, 20); ctx.fill();
    ctx.fillStyle = '#1b1b2e'; ctx.beginPath(); ctx.arc(0, -180, 30, 0, 6.283); ctx.fill(); ctx.fillStyle = '#2b2b3e'; roundRect(ctx, -36, -150, 72, 100, 18); ctx.fill();
    ctx.restore(); }
}
function vCourt(ctx, u) {
  bgSky(ctx, ['#ece6ff', '#dcd2ff', '#c9bcff']);
  // split: top = ours, bottom = other
  ctx.fillStyle = 'rgba(255,190,11,0.16)'; ctx.fillRect(0, 600, W, 560); ctx.fillStyle = 'rgba(76,201,240,0.18)'; ctx.fillRect(0, 1160, W, 560);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 1156, W, 8);
  const flipK = easeInOut(prog(u, 1.6, 2.2)), oursC = [RED, RED, RED, RED, RED, RED, BLUE, BLUE, BLUE], otherC = [RED, RED, RED, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE];
  const ours = [RED, RED, RED, RED, RED, RED, BLUE, BLUE, BLUE].map((c, i) => ([3, 4, 5].includes(i) ? c : c));
  const reorderedOurs = [RED, RED, RED, RED, RED, RED, BLUE, BLUE, BLUE];
  bench(ctx, u, 960, reorderedOurs, true, 0.3);
  bench(ctx, u, 1520, otherC.map((c, i) => ([3, 4, 5].includes(i) ? mixHex(RED, BLUE, flipK) : c)), true, 0.5);
  ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#b07a00'; ctx.fillText('OUR TIMELINE', 70, 660); ctx.fillStyle = '#1478a0'; ctx.fillText('THE OTHER ONE', 70, 1220);
  const lab = (txt, y, at, col) => { if (u < at) return; ctx.save(); ctx.globalAlpha = R2((u - at) / 0.3); ctx.font = `900 46px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = col; ctx.fillText(txt, 70, y); ctx.restore(); };
  lab('6–3 conservative', 1040, 1.0, '#2b2d42'); lab('2022: Roe v. Wade overturned', 1100, 1.6, RED);
  lab('6–3 liberal*', 1600, 2.3, '#2b2d42'); lab('Roe probably still stands', 1660, 3.2, BLUE);
  if (u > 3.6) { ctx.save(); ctx.globalAlpha = R2((u - 3.6) / 0.3); ctx.font = `700 30px ${FONT}`; ctx.fillStyle = '#4a4a66'; ctx.textAlign = 'left'; ctx.fillText('*assuming the Senate let her fill the seats', 70, 1770); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.7);
  say(ctx, u, ['First, the Supreme Court:', '3 seats change hands'], 230, 0.15, { size: 76, out: OUT('court') });
}

// ================================================================ 6. spinning headlines from the other timeline
const HEADS = [['2017', 'U.S. STAYS IN PARIS CLIMATE DEAL'], ['2017', 'NO $1.9 TRILLION TAX CUT'], ['2018', 'IRAN NUCLEAR DEAL HOLDS'],
  ['2018', 'NO TRADE WAR WITH CHINA'], ['2020', 'PANDEMIC TEAM READY AS COVID ARRIVES']];
function paper(ctx, year, head, seed) {
  const w = 820, h = 620; ctx.fillStyle = '#fbf6e9'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(-w / 2, h / 2 - 8, w, 8);
  ctx.fillStyle = '#1b1b2e'; ctx.font = `900 54px Georgia, "Times New Roman", serif`; ctx.textAlign = 'center'; ctx.fillText('The Other Times', 0, -h / 2 + 80);
  ctx.fillRect(-w / 2 + 30, -h / 2 + 100, w - 60, 4); ctx.font = `700 22px ${FONT}`; ctx.fillText(`${year} · ALTERNATE EDITION · 25¢`, 0, -h / 2 + 132); ctx.fillRect(-w / 2 + 30, -h / 2 + 148, w - 60, 2);
  ctx.font = `900 64px ${FONT}`; const words = head.split(' '); let line = '', ly = -h / 2 + 240, lines = [];
  for (const wd of words) { if (ctx.measureText(line + wd).width > w - 90) { lines.push(line); line = ''; } line += wd + ' '; } lines.push(line);
  for (const l of lines) { ctx.fillText(l.trim(), 0, ly); ly += 72; }
  ctx.fillStyle = 'rgba(27,27,46,0.18)'; const r = rng(seed); for (let c = 0; c < 3; c++) for (let k = 0; k < 7; k++) ctx.fillRect(-w / 2 + 40 + c * 250, ly + 10 + k * 26, 220 * (0.6 + 0.4 * r()), 10);
}
function vNews(ctx, u) {
  bgSky(ctx, ['#ff9e7a', '#ffbe7a', '#ffd9a0']);
  const r0 = rng(7); for (let i = 0; i < 14; i++) { const a = r0() * 6.283 + u * 0.2; ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.moveTo(W / 2, 1100); ctx.arc(W / 2, 1100, 1800, a, a + 0.12); ctx.fill(); }
  HEADS.forEach(([y, h], i) => { const at = 0.3 + i * 1.1, k = easeOut(R2((u - at) / 0.7)); if (k <= 0) return;
    const settle = [[-40, -0.06], [30, 0.05], [-20, -0.03], [40, 0.07], [0, -0.02]][i];
    ctx.save(); ctx.translate(W / 2 + settle[0] * k, 1150 + i * 14); ctx.rotate((1 - k) * 9 + settle[1]); ctx.scale(k * 1.0, k * 1.0);
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 30; paper(ctx, y, h, i + 1); ctx.restore();
    if (k > 0.95 && u < at + 1.0) for (let s = 0; s < 6; s++) sparkle(ctx, W / 2 + Math.cos(s + i) * 430, 1150 + Math.sin(s * 2 + i) * 330, 18, 1 - (u - at - 0.7) / 0.3); });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 520, 0.55);
  say(ctx, u, ['Meanwhile, in the', 'other timeline…'], 230, 0.15, { size: 88, out: OUT('news') });
}

// ================================================================ 7. Congress: a red wave and investigations
function vCongress(ctx, u) {
  bgSky(ctx, ['#7fc8ff', '#a9dcff', '#d8f0ff']);
  drift(ctx, u, 0, 4.5, 1.0, 1.05, W / 2, 1150);
  const cx = W / 2, base = 1360;
  ctx.fillStyle = '#f4f1ea'; ctx.fillRect(cx - 420, base - 190, 840, 190); ctx.fillRect(cx - 220, base - 300, 440, 120);
  ctx.fillStyle = '#e2ddd0'; for (let i = 0; i < 13; i++) ctx.fillRect(cx - 400 + i * 66, base - 180, 18, 170);
  ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.ellipse(cx, base - 300, 210, 230, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(cx - 30, base - 600, 60, 80); ctx.beginPath(); ctx.arc(cx, base - 610, 30, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#e2ddd0'; for (let i = -3; i <= 3; i++) ctx.fillRect(cx + i * 56 - 6, base - 470 + Math.abs(i) * 18, 12, 160 - Math.abs(i) * 18);
  // red wave rolling in
  const wv = easeInOut(prog(u, 0.3, 2.2)), lvl = lerp(H + 50, base - 70, wv);
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, lvl + Math.sin(x * 0.02 + u * 5) * 26); ctx.lineTo(W, H); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.arc(x + ((u * 60) % 60), lvl + Math.sin(x * 0.02 + u * 5) * 26, 14, 0, 6.283); ctx.fill(); }
  // subpoenas flying
  const r = rng(9); for (let i = 0; i < 12; i++) { const at = 1.4 + r() * 2.2, dt = u - at; if (dt < 0) continue; const x0 = cx + (r() - 0.5) * 200, sx = (r() - 0.5) * 900, sy = -500 - r() * 400;
    ctx.save(); ctx.translate(x0 + sx * dt, base - 300 + sy * dt + 500 * dt * dt); ctx.rotate(dt * (r() * 6 - 3));
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-50, -66, 100, 132); ctx.fillStyle = RED; ctx.font = `900 16px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('SUBPOENA', 0, -36);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 0; k < 5; k++) ctx.fillRect(-38, -16 + k * 16, 76, 6); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 600, 0.65);
  say(ctx, u, ['2018: Republicans likely', 'win big in the midterms'], 230, 0.15, { size: 72, out: OUT('congress') });
  if (u > 1.8) { scrimB(ctx, 1450, 0.7); say(ctx, u, ['“We’ve got two years’ worth', 'of material already lined up.”'], 1640, 1.8, { size: 50, weight: 800, out: OUT('congress') });
    say(ctx, u, ['— a House committee chair, Oct 2016'], 1760, 2.2, { size: 34, weight: 700, out: OUT('congress'), color: 'rgba(255,255,255,0.8)' }); }
}

// ================================================================ 8. Trump TV
function vTV(ctx, u) {
  bgSky(ctx, ['#2a0f5a', '#4a1f8a', '#7a3fc0']);
  drift(ctx, u, 0, 5, 1.0, 1.05, W / 2, 1100);
  ctx.fillStyle = 'rgba(255,215,0,0.16)'; ctx.fillRect(W / 2 - 120, 380, 240, 1500); for (let k = 0; k < 30; k++) { ctx.fillStyle = 'rgba(255,230,120,0.25)'; ctx.fillRect(W / 2 - 100 + (k % 4) * 52, 420 + Math.floor(k / 4) * 60, 30, 34); }
  for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 3; c++) { const i = rr * 3 + c, at = 0.2 + i * 0.12, k = easeBack(R2((u - at) / 0.35)); if (k <= 0) continue;
    const x = 200 + c * 340, y = 700 + rr * 270; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = '#16161e'; roundRect(ctx, -150, -105, 300, 210, 22); ctx.fill();
    const g = ctx.createLinearGradient(0, -90, 0, 90); g.addColorStop(0, '#1b2a6b'); g.addColorStop(1, '#3a1f6a'); ctx.fillStyle = g; roundRect(ctx, -132, -88, 264, 176, 14); ctx.fill();
    ctx.save(); roundRect(ctx, -132, -88, 264, 176, 14); ctx.clip(); pol(ctx, 0, 150, 220, 'trump', { pose: i % 2 ? 'point' : 'wave', t: u + i * 0.3 }); ctx.restore();
    ctx.fillStyle = 'rgba(16,20,40,0.85)'; ctx.fillRect(-132, 52, 264, 36); ctx.font = `900 26px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = GOLD; ctx.fillText('TRUMP TV', 0, 79);
    ctx.fillStyle = RED; roundRect(ctx, -120, -78, 70, 28, 8); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = `900 18px ${FONT}`; ctx.fillText('LIVE', -85, -58);
    if (Math.sin(u * 7 + i) > 0.6) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; roundRect(ctx, -132, -88, 264, 176, 14); ctx.fill(); }
    ctx.restore(); }
  // ratings rocket
  const k = easeIn2(prog(u, 1.2, 4.6)), rx = 940, ry = lerp(1780, 560, k);
  ctx.strokeStyle = 'rgba(125,255,176,0.9)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(rx, 1780); ctx.lineTo(rx, ry); ctx.stroke();
  ctx.fillStyle = '#7dffb0'; ctx.beginPath(); ctx.moveTo(rx, ry - 40); ctx.lineTo(rx - 26, ry); ctx.lineTo(rx + 26, ry); ctx.fill(); if (u > 1.2) sparkle(ctx, rx, ry - 50, 22, 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  scrim(ctx, 560, 0.6);
  say(ctx, u, ['And Trump? Probably', 'his own TV network'], 230, 0.15, { size: 80, out: OUT('tv') });
  scrimB(ctx, 1560, 0.6);
  say(ctx, u, ['(In 2016 there really were', 'reports he was eyeing one.)'], 1700, 1.4, { size: 46, weight: 800, out: OUT('tv') });
}

// ================================================================ 9. COVID in both timelines
function vCovid(ctx, u) {
  space(ctx, u);
  const R = 420, cx = W / 2, cy = 1150;
  globe(ctx, cx, cy, R, { lon0: -40 + u * 10, lat0: 20, t: u, ink: false, sun: [0, -0.2, 1] });
  const r = rng(11), k = easeInOut(prog(u, 0.2, 3.8));
  for (let i = 0; i < 70; i++) { if (r() > k) { r(); r(); continue; } const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.95; vMini(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.95, 10 + Math.sin(u * 3 + i) * 2, u * 2 + i); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['2020: COVID hits', 'both timelines'], 230, 0.15, { size: 90, out: OUT('covid') });
  say(ctx, u, ['How it’s handled?', 'Anyone’s guess.'], 1640, 1.4, { size: 64, weight: 900, out: OUT('covid') });
}

// ================================================================ 10. the 2020 race in the other timeline
function vRace(ctx, u) {
  bgSky(ctx, ['#0b1440', '#1b2a6b', '#2a3a8a']);
  for (const [x, col] of [[260, '58,134,255'], [820, '230,57,70']]) { ctx.fillStyle = `rgba(${col},0.18)`; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 280, 1500); ctx.lineTo(x - 280, 1500); ctx.fill(); }
  tileMap(ctx, u, W / 2, 760, 70, { flicker: 1 });
  ctx.fillStyle = 'rgba(11,20,64,0.55)'; ctx.fillRect(0, 440, W, 650);
  for (const [x, seed, col, name] of [[260, 1, BLUE, 'CLINTON (INCUMBENT)'], [820, 6, RED, 'TRUMP?']]) {
    person2(ctx, x, 1390, 330, { seed, t: u });
    ctx.fillStyle = '#e8eef8'; ctx.beginPath(); ctx.moveTo(x - 150, 1330); ctx.lineTo(x + 150, 1330); ctx.lineTo(x + 120, 1600); ctx.lineTo(x - 120, 1600); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x - 150, 1330, 300, 26); ctx.font = `900 30px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#1b1b2e'; ctx.fillText(name, x, 1460); }
  if (u > 2.3 && u < 3.0) { const k = (u - 2.3) / 0.7; ctx.strokeStyle = `rgba(255,240,120,${1 - k})`; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(470, 1180); ctx.lineTo(560, 1260); ctx.lineTo(500, 1290); ctx.lineTo(610, 1380); ctx.stroke(); glow(ctx, 540, 1280, 200, '255,240,150', 0.6 * (1 - k)); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['2020: no President Biden.', 'No January 6th.'], 230, 0.15, { size: 72, out: 2.3 });
  say(ctx, u, ['Instead: President Clinton', 'vs… Trump again?'], 230, 2.4, { size: 76, out: OUT('race'), mark: { line: 1, from: 4, to: 16, color: RED } });
}

// ================================================================ 11. both timelines arrive at today
function vFinal(ctx, u) {
  nightSky(ctx, u, '#140f3a', '#3a2a8a');
  const pts = { ours: [[250, 1900], [250, 1000], [250, 700]], other: [[830, 1900], [830, 1000], [830, 700]] };
  track(ctx, pts.ours, GOLD, 30, easeOut(prog(u, 0.1, 1.4)), u); track(ctx, pts.other, TEAL, 30, easeOut(prog(u, 0.1, 1.4)), u);
  if (u > 1.3) { node(ctx, 250, 700, '2026', GOLD, R2((u - 1.3) / 0.3), 1); node(ctx, 830, 700, '2026', TEAL, R2((u - 1.3) / 0.3), -1); }
  const card = (x, txt, col, at) => { if (u < at) return; const k = easeBack(R2((u - at) / 0.4)); ctx.save(); ctx.translate(x, 960); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; roundRect(ctx, -220, -130, 440, 260, 30); ctx.fill(); ctx.fillStyle = col; roundRect(ctx, -220, -130, 440, 26, 13); ctx.fill();
    ctx.font = `900 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#1b1b2e'; txt.forEach((l, i) => ctx.fillText(l, 0, -40 + i * 54)); ctx.restore(); };
  if (u > 1.3) { ctx.save(); ctx.globalAlpha = R2((u - 1.3) / 0.3); ctx.font = `900 36px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = GOLD; ctx.fillText('OUR TIMELINE', 250, 1395); ctx.fillStyle = TEAL; ctx.fillText('THE OTHER ONE', 830, 1395); ctx.restore(); }
  card(250, ['President Trump.', 'Tariffs.', 'War with Iran.'], GOLD, 1.8);
  card(830, ['No war.', 'No tariff wall.', 'Roe stands.'], TEAL, 2.3);
  if (u > 1.8) { pol(ctx, 250, 1330, 190, 'trump', { pose: 'point', t: u }); } if (u > 2.3) { pol(ctx, 830, 1330, 190, 'clinton', { pose: 'wave', t: u, dir: -1 }); }
  if (u > 2.3) for (let i = 0; i < 6; i++) sparkle(ctx, 830 + Math.cos(u * 2 + i) * 260, 960 + Math.sin(u * 2 + i) * 160, 16, 0.8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  say(ctx, u, ['Which timeline', 'would you rather', 'live in?'], 1540, 2.9, { size: 88, out: OUT('final'), x: W / 2, align: 'center' });
  say(ctx, u, ['Today…'], 230, 0.15, { size: 96, out: OUT('final') });
}

function vEnd(ctx, u) {
  nightSky(ctx, u);
  tileMap(ctx, u, W / 2, 1420, 56, { flicker: 1 });
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
