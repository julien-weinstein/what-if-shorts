// What if every bacterium on Earth vanished?   (style 4: original look, turned up)
//
// PLOT-HOLE CHECK:
//  - "Things would stop rotting": no. Fungi still decompose; rotting just slows a lot. We say so.
//  - "We'd suffocate": no. Plants and algae still photosynthesise, and the atmosphere's oxygen
//    reservoir would last thousands of years even without new oxygen. Shown on screen.
//  - "We'd die without gut bacteria": no. Germ-free lab mice live fine (they need more food). Shown.
//  - "Beer and bread are fermented too": with yeast, a fungus. They survive (sour beers aside).
//  - "Methane-making archaea aren't bacteria": true, but they live off bacterial fermentation, so gut
//    gas still mostly stops; swallowed air remains, hence "MOST farts".
// FACTS: Sender et al. 2016: ~38 trillion bacteria vs ~30 trillion human cells, ~0.2 kg of bacteria
// per person. Bad breath, body odour and gut gas are produced by bacteria. WHO: TB killed ~1.25 million
// people in 2023. ~1.5 billion cattle; ruminants depend on rumen microbes to digest cellulose.
// Cheese, yogurt, salami, pickles and vinegar rely on bacteria. Soil bacteria fix and recycle nitrogen.
const SHORT = {
  title: 'What if every bacterium on Earth vanished?',
  duration: 52,
  sfx: [
    [0.2, 'pop'], [0.5, 'pop'], [0.8, 'pop'], [1.1, 'pop'], [1.6, 'pop'], [1.9, 'pop'], [2.5, 'boing'],
    [3.4, 'riser'], [3.7, 'poof'], [3.8, 'sparkle'],
    [4.5, 'whoosh'], [4.9, 'pop'], [5.6, 'boing'], [6.6, 'pop'], [6.9, 'pop'],
    [9.0, 'whoosh'], [9.4, 'pop'], [9.6, 'sparkle'], [11.2, 'pop'], [11.4, 'sparkle'], [12.9, 'fart'], [13.6, 'record'], [13.9, 'pop'],
    [15.0, 'whoosh'], [15.4, 'pop'], [16.0, 'ding'], [16.6, 'ding'], [17.2, 'ding'], [17.8, 'ding'], [18.6, 'cheer:2.4'], [19.0, 'boing'],
    [21.0, 'whoosh'], [21.4, 'pop'], [22.2, 'pop'], [23.4, 'shrink'], [24.2, 'moo'], [25.2, 'pop'],
    [27.0, 'whoosh'], [27.4, 'pop'], [28.0, 'zap'], [28.4, 'zap'], [28.8, 'zap'], [29.2, 'zap'], [29.6, 'zap'], [30.6, 'ding'], [31.0, 'ding'], [31.2, 'pop'],
    [33.0, 'whoosh'], [33.4, 'pop'], [34.0, 'pop'], [35.0, 'shrink'], [36.2, 'pop'], [37.0, 'huh'],
    [39.0, 'whoosh'], [39.4, 'pop'], [39.8, 'huh'], [40.6, 'ding'], [42.0, 'pop'], [42.6, 'ding'],
    [44.0, 'whoosh'], [44.4, 'record'], [45.0, 'pop'], [45.8, 'pop'], [47.0, 'boom'],
    [49.0, 'whoosh'], [49.4, 'pop'], [50.2, 'ding'],
  ],
  music: { bpm: 112, until: 51.6, duckAt: [[13.6, 14.4], [44.2, 45.0]] },
};

function render(ctx, t) {
  sequence(ctx, t, [[0, sHook], [4.5, sYou], [9, sSmells], [15, sCured], [21, sCows], [27, sFood], [33, sCrops], [39, sCheck], [44, sTwist], [49, sEnd]]);
}

const BUGCOLS = ['#7ae582', '#ff8fab', '#ffd166', '#8ecae6', '#cdb4db', '#90f1ef'];

// 0–4.5: microscope view teeming with bacteria, which then all blink out.
function sHook(ctx, t) {
  backdrop4(ctx, t, ['#5f3dc4', '#9b5de5', '#f15bb5'], 2);
  const cx = W / 2, cy = 1150, R = 400;
  shadowed(ctx, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, R + 40, 0, 6.283); ctx.fill(); }, 60, 24);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip();
  ctx.fillStyle = grad(ctx, ['#e8fff6', '#bdf7e6'], 0, cy - R, 0, cy + R); ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  const r = rng(8);
  for (let i = 0; i < 34; i++) {
    const bx = cx + (r() - 0.5) * 760 + Math.sin(t * (0.6 + r()) + i) * 40, by = cy + (r() - 0.5) * 760 + Math.cos(t * (0.5 + r()) + i) * 40;
    const vanish = 3.7 + r() * 0.15;
    bacterium(ctx, bx, by, 0.55 + r() * 0.45, i % 3, r() * 6 + t * 0.3, BUGCOLS[i % BUGCOLS.length], t < vanish ? 1 : 0);
    if (t >= vanish) particlesBurst(ctx, t, bx, by, vanish, 8, '#ffffff', 80);
  }
  ctx.restore();
  ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, R + 40, 0, 6.283); ctx.stroke();
  flash(ctx, t, 3.7, 0.3);
  pop(ctx, t, 'WHAT IF EVERY *BACTERIUM* ON EARTH', 300, 0.2, { size: 80, out: 4.2, maxW: 1000 });
  pop(ctx, t, 'JUST… *VANISHED?*', 560, 1.0, { size: 104, out: 4.2 });
  blip(ctx, t, 170, 1760, t > 3.7 ? 'shock' : 'happy', 0.65, 2.5);
}

// 4.5–9: a person instantly loses ~0.2 kg.
function sYou(ctx, t) {
  backdrop4(ctx, t, ['#4cc9f0', '#4895ef', '#7b2ff7'], 4);
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(W / 2, 1720, 420, 70, 0, 0, 6.283); ctx.fill();
  drift(ctx, t, 4.5, 9, 1.0, 1.05, W / 2, 1300);
  human(ctx, t, W / 2, 1720, 900, { skin: SKINS[1], shirt: '#ff6b6b', hair: '#3b2416', face: t > 5.6 ? 'shock' : 'neutral' });
  const r = rng(3);   // little bacteria leaving the body
  for (let i = 0; i < 26; i++) { const k = prog(t, 4.6 + r() * 0.3, 6.0);
    if (k > 0 && k < 1) bacterium(ctx, W / 2 + (r() - 0.5) * 260 + (r() - 0.5) * 500 * k, 1250 + (r() - 0.5) * 600 - k * 300, 0.25, i % 3, r() * 6, BUGCOLS[i % 6], 1 - k); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  chip(ctx, t, '0 SECONDS LATER', 4.9);
  stat(ctx, t, '−0.2 KG', 'of YOU, gone instantly', W / 2, 520, 5.6, { out: 8.7 });
  pop(ctx, t, 'That was all bacteria', 1830, 6.6, { size: 60, out: 8.7 });
}

// 9–15: smells vanish (lighthearted).
function sSmells(ctx, t) {
  backdrop4(ctx, t, ['#ffd6a5', '#ffadad', '#ff8fab'], 6);
  ctx.fillStyle = '#ffe8cc'; ctx.fillRect(0, 1640, W, H);
  drift(ctx, t, 9, 15, 1.0, 1.04, W / 2, 1400);
  const happy = t > 11.4;
  human(ctx, t, 340, 1680, 820, { skin: SKINS[3], shirt: '#3a86ff', hair: '#6b3e26', pose: happy ? 'cheer' : 'sniff', face: happy ? 'happy' : 'gross' });
  human(ctx, t, 740, 1680, 780, { skin: SKINS[0], shirt: '#ffbe0b', hair: '#111', long: true, flip: true, face: 'happy', pose: t > 13.9 ? 'shrug' : 'stand' });
  if (t < 11.2) { ctx.strokeStyle = 'rgba(120,170,80,0.7)'; ctx.lineWidth = 12; ctx.lineCap = 'round';      // stink lines
    for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let k = 0; k < 20; k++) { const yy = 1150 - k * 14, xx = 560 + i * 40 + Math.sin(k * 0.6 + t * 6 + i) * 18; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } }
  else particlesBurst(ctx, t, 580, 1050, 11.4, 22, '#fff7b0', 220);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  chip(ctx, t, 'SECONDS LATER', 9.4);
  pop(ctx, t, 'Bad breath? *Gone.*', 420, 9.6, { size: 84, out: 14.6 });
  pop(ctx, t, 'Body odor? *Gone.*', 540, 11.2, { size: 84, out: 14.6 });
  pop(ctx, t, 'Most farts? *Gone.*', 660, 12.9, { size: 84, out: 14.6 });
  pop(ctx, t, '(Bacteria make all three)', 790, 13.9, { size: 54, out: 14.6 });
}

// 15–21: every bacterial disease cured instantly.
function sCured(ctx, t) {
  backdrop4(ctx, t, ['#06d6a0', '#1b9aaa', '#3a86ff'], 9);
  drift(ctx, t, 15, 21, 1.0, 1.04);
  const items = ['Tuberculosis', 'Cholera', 'Plague', 'Strep throat'];
  items.forEach((s, i) => {
    const at = 16.0 + i * 0.6, y = 780 + i * 150, p = easeBack(prog(t, at, at + 0.35));
    if (p <= 0) return;
    ctx.save(); ctx.translate(W / 2, y); ctx.scale(p, p);
    shadowed(ctx, () => { ctx.fillStyle = '#fff'; roundRect(ctx, -380, -60, 760, 120, 60); ctx.fill(); }, 30, 12);
    ctx.font = `900 60px ${FONT}`; ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, -300, 4);
    greenCheck(ctx, 300, 0, 0.5, prog(t, at + 0.2, at + 0.5));
    ctx.restore();
  });
  if (t > 18.6) for (const [x, c] of [[160, SKINS[4]], [920, SKINS[1]]]) human(ctx, t, x, 1800, 340, { skin: c, shirt: x < 500 ? '#ff006e' : '#ffbe0b', pose: 'cheer', face: 'happy' });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  chip(ctx, t, 'INSTANTLY', 15.4);
  pop(ctx, t, 'Every bacterial disease on Earth: *CURED*', 470, 15.4, { size: 80, out: 20.6 });
  stat(ctx, t, '1.25 MILLION', 'people died of TB in 2023 alone', W / 2, 1480, 19.0, { size: 110, out: 20.6 });
}

// 21–27: cattle can't digest grass without their microbes.
function sCows(ctx, t) {
  backdrop4(ctx, t, ['#a0e7ff', '#cdf5ff', '#fdfdfd'], 11);
  ctx.fillStyle = grad(ctx, ['#8ee06b', '#5fbf4a'], 0, 1300, 0, H); ctx.beginPath(); ctx.moveTo(0, 1320); ctx.quadraticCurveTo(540, 1240, W, 1320); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  drift(ctx, t, 21, 27, 1.0, 1.05, W / 2, 1300);
  const thin = easeInOut(prog(t, 23.4, 25.0));
  cow(ctx, t, 470, 1320, 1.25, thin, thin > 0.5 ? 'sad' : 'neutral');
  // cutaway stomach bubble with microbes disappearing
  const bx = 400, by = 1300;
  ctx.save(); ctx.beginPath(); ctx.arc(bx, by, 95, 0, 6.283); ctx.clip();
  ctx.fillStyle = '#ffd6e0'; ctx.fillRect(bx - 100, by - 100, 200, 200);
  const r = rng(21);
  for (let i = 0; i < 10; i++) bacterium(ctx, bx + (r() - 0.5) * 150, by + (r() - 0.5) * 150, 0.28, i % 3, r() * 6 + t, BUGCOLS[i % 6], 1 - prog(t, 22.2, 22.8));
  ctx.restore(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.arc(bx, by, 95, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `900 34px ${FONT}`; ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.strokeText('STOMACH', bx, by - 115); ctx.fillStyle = C.paper; ctx.fillText('STOMACH', bx, by - 115);
  for (let i = 0; i < 9; i++) { ctx.strokeStyle = '#3f9a37'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(760 + i * 22, 1560); ctx.quadraticCurveTo(770 + i * 22, 1500, 760 + i * 22 + Math.sin(t * 3 + i) * 10, 1460); ctx.stroke(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  chip(ctx, t, 'DAYS LATER', 21.4);
  pop(ctx, t, 'Cows *can’t digest grass* on their own', 440, 22.2, { size: 78, out: 26.6 });
  pop(ctx, t, 'Their gut microbes did it for them', 620, 23.0, { size: 58, out: 26.6 });
  stat(ctx, t, '1.5 BILLION', 'cattle start to starve (plus sheep, goats, deer…)', W / 2, 1720, 25.2, { size: 100, out: 26.6 });
}

// 27–33: fermented foods vanish; yeast foods survive.
function sFood(ctx, t) {
  backdrop4(ctx, t, ['#fff1e6', '#ffd7ba', '#fec89a'], 13);
  ctx.fillStyle = '#b08968'; for (const y of [980, 1420]) { shadowed(ctx, () => ctx.fillRect(60, y, W - 120, 26), 20, 10); }
  const foods = [[200, 920, '🧀'], [420, 920, '🥛'], [640, 920, '🥓'], [860, 920, '🥒'], [530, 1360, '🍺'], [760, 1360, '🍞']];
  foods.forEach(([x, y, e], i) => {
    const bob = Math.sin(t * 3 + i) * 6;
    ctx.font = '150px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = i < 4 && t > 28 + i * 0.4 + 0.3 ? 0.6 : 1; ctx.fillText(e, x, y + bob); ctx.globalAlpha = 1;
    ctx.font = `900 30px ${FONT}`; ctx.fillStyle = '#7f5539'; ctx.fillText(['CHEESE', 'YOGURT', 'SALAMI', 'PICKLES', 'BEER', 'BREAD'][i], x, y + 56);
    if (i < 4) redX(ctx, x + 55, y - 130, 0.5, prog(t, 28 + i * 0.4, 28.3 + i * 0.4));
    else greenCheck(ctx, x + 70, y - 140, 0.6, prog(t, 30.6 + (i - 4) * 0.4, 30.9 + (i - 4) * 0.4));
  });
  ctx.font = `800 38px ${FONT}`; ctx.fillStyle = '#7f5539'; ctx.textAlign = 'left'; ctx.fillText('VINEGAR, SAUERKRAUT, SOURDOUGH… gone too', 80, 1110);
  chip(ctx, t, 'WEEKS LATER', 27.4);
  pop(ctx, t, 'Goodbye cheese, yogurt, salami, pickles', 420, 27.6, { size: 74, out: 32.6 });
  pop(ctx, t, 'Beer and bread? *Fine.* That’s yeast — a fungus.', 1640, 31.2, { size: 64, out: 32.6 });
}

// 33–39: soils stop feeding crops; dead stuff barely rots.
function sCrops(ctx, t) {
  backdrop4(ctx, t, ['#ffe066', '#ffd166', '#fca311'], 15);
  // soil cross-section
  ctx.fillStyle = '#8b5e34'; ctx.fillRect(0, 1250, W, H);
  ctx.fillStyle = '#6f4518'; for (let i = 0; i < 40; i++) { const r = rng(i); ctx.beginPath(); ctx.arc(r() * W, 1300 + r() * 600, 6 + r() * 10, 0, 6.283); ctx.fill(); }
  drift(ctx, t, 33, 39, 1.0, 1.04, W / 2, 1250);
  const wilt = easeInOut(prog(t, 35.0, 37.0));
  for (let i = 0; i < 8; i++) {
    const x = 90 + i * 128, col = `rgb(${Math.round(lerp(110, 196, wilt))},${Math.round(lerp(190, 150, wilt))},${Math.round(lerp(60, 70, wilt))})`;
    ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, 1250); ctx.quadraticCurveTo(x, 1050, x + wilt * 110, 900 + wilt * 170); ctx.stroke();
    ctx.fillStyle = wilt > 0.5 ? '#c9a227' : '#f4d35e'; ctx.beginPath(); ctx.ellipse(x + wilt * 110, 880 + wilt * 170, 22, 60, wilt * 1.2, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#d4a373'; ctx.lineWidth = 5;                                    // roots
    for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, 1250); ctx.quadraticCurveTo(x + d * 30, 1340, x + d * 50, 1440); ctx.stroke(); }
    const r = rng(40 + i);                                                               // root bacteria vanish
    for (let k = 0; k < 3; k++) bacterium(ctx, x + (r() - 0.5) * 90, 1320 + r() * 120, 0.16, 1, 0, '#ff8fab', 1 - prog(t, 34.0, 34.6));
  }
  // leaf litter piling up, mushrooms still working
  const pile = easeInOut(prog(t, 36.2, 38.6));
  ctx.fillStyle = '#b5651d'; ctx.beginPath(); ctx.moveTo(0, 1250); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 1250 - pile * (80 + Math.sin(x * 0.05) * 30)); ctx.lineTo(W, 1250); ctx.fill();
  for (const mx of [180, 620, 940]) { ctx.fillStyle = '#fefae0'; ctx.fillRect(mx - 10, 1180 - pile * 90, 20, 60); ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(mx, 1180 - pile * 90, 40, Math.PI, 0); ctx.fill(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  chip(ctx, t, 'MONTHS LATER', 33.4);
  pop(ctx, t, 'Soil bacteria feed nitrogen to crops. Without them, *harvests crash.*', 470, 34.0, { size: 70, out: 38.6 });
  pop(ctx, t, 'Dead leaves pile up: only *fungi* are left to rot them', 1720, 36.2, { size: 56, out: 38.6 });
}

// 39–44: plot-hole check.
function sCheck(ctx, t) {
  backdrop4(ctx, t, ['#c77dff', '#9d4edd', '#7b2cbf'], 17);
  chip(ctx, t, 'WAIT, BUT…', 39.4);
  pop(ctx, t, 'Would we *suffocate?*', 520, 39.8, { size: 88 });
  pop(ctx, t, 'No. Plants still make oxygen, and the air holds enough for thousands of years.', 760, 40.6, { size: 56 });
  pop(ctx, t, 'Would *we* die without gut bacteria?', 1060, 42.0, { size: 76 });
  pop(ctx, t, 'Probably not: germ-free lab mice live just fine.', 1280, 42.6, { size: 56 });
  blip(ctx, t, W / 2, 1650, 'happy', 0.9, 40.4);
}

// 44–49: twist: you're about half bacteria.
function sTwist(ctx, t) {
  backdrop4(ctx, t, ['#3a0ca3', '#7209b7', '#f72585'], 19);
  const cx = W / 2;
  human(ctx, t, cx, 1700, 900, { skin: SKINS[2], shirt: '#4cc9f0', hair: '#2a1a12', face: t > 47 ? 'shock' : 'neutral' });
  const p = easeInOut(prog(t, 45.8, 47.0));
  ctx.save(); ctx.beginPath(); ctx.rect(cx, 700, 400 * p, 1100); ctx.clip();      // right half fills with bacteria
  const r = rng(55);
  for (let i = 0; i < 90; i++) bacterium(ctx, cx + r() * 240, 820 + r() * 900, 0.18, i % 3, r() * 6 + t, BUGCOLS[i % 6]);
  ctx.restore();
  chip(ctx, t, 'PLOT TWIST', 44.4);
  stat(ctx, t, '38 TRILLION', 'bacteria live in you', 300, 470, 45.0, { size: 74 });
  stat(ctx, t, '30 TRILLION', 'human cells', 780, 470, 45.8, { size: 74, color: '#4cc9f0' });
  pop(ctx, t, 'By cell count, you’re about *HALF* bacteria', 1840, 47.0, { size: 62 });
}

function sEnd(ctx, t) {
  backdrop4(ctx, t, ['#ffbe0b', '#fb5607', '#ff006e'], 21);
  caption(ctx, t, 'WHAT IF,', 640, 49.4, { size: 150, color: C.paper });
  caption(ctx, t, 'THOUGH?', 800, 49.6, { size: 170, color: C.yellow });
  caption(ctx, t, 'Follow for a new what-if every day', 1000, 50.2, { size: 56 });
  blip(ctx, t, W / 2, 1400, 'wave', 1.3, 49.4);
}
