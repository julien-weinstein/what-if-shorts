// What if the Sun suddenly vanished?
// Facts used: sunlight (and changes in gravity) take ~8 min 20 s to reach Earth, so for
// that long nothing changes; then Earth leaves its orbit along a straight line; photo-
// synthesis stops; average surface temperature falls below about -18 °C within a week and
// to about -73 °C within a year; the ocean surface freezes but ice insulates the water
// below, and life around hydrothermal vents could carry on; over very long timescales the
// atmosphere itself freezes out; the Moon has no light of its own, so it goes dark too.
const SHORT = {
  title: 'What if the Sun suddenly vanished?',
  duration: 42,
  sfx: [
    [0.2, 'pop'], [0.9, 'pop'], [1.6, 'boing'],
    [3.3, 'riser'], [3.6, 'poof'], [3.6, 'braam'], [4.2, 'pop'], [4.9, 'pop'],
    [6.0, 'whoosh'], [6.3, 'pop'], [6.6, 'tick:3.2'], [9.9, 'dim'], [9.9, 'braam'], [10.4, 'pop'],
    [12.0, 'whoosh'], [12.4, 'pop'], [13.0, 'pop'], [13.6, 'whoosh'], [14.8, 'pop'],
    [16.5, 'whoosh'], [16.9, 'pop'], [17.6, 'pop'], [18.4, 'shrink'], [19.6, 'pop'],
    [21.5, 'whoosh'], [21.9, 'pop'], [22.4, 'wind:5'], [22.6, 'pop'], [24.0, 'freeze'], [24.4, 'pop'], [25.4, 'freeze'],
    [27.0, 'whoosh'], [27.4, 'pop'], [27.8, 'bubbles:4.5'], [28.4, 'pop'], [30.0, 'sparkle'],
    [32.0, 'whoosh'], [32.4, 'pop'], [32.6, 'rumble:4'], [33.2, 'pop'], [34.4, 'freeze'],
    [36.5, 'whoosh'], [36.8, 'record'], [37.5, 'pop'], [38.6, 'dim'], [38.8, 'pop'],
    [40.0, 'whoosh'], [40.3, 'pop'], [41.0, 'ding'],
  ],
  music: { bpm: 100, mode: 'dark', until: 41.6, duckAt: [[3.5, 6.0], [36.6, 37.5]] },
};

const CUTS = [6, 12, 16.5, 21.5, 27, 32, 36.5, 40];

function render(ctx, t) {
  const [sx, sy] = shakeOffset(t, 9.9, 1.2, 35);
  ctx.save(); ctx.translate(sx, sy);
  if (t < 6) sceneVanish(ctx, t);
  else if (t < 12) sceneCountdown(ctx, t);
  else if (t < 16.5) sceneDrift(ctx, t);
  else if (t < 21.5) scenePlants(ctx, t);
  else if (t < 27) sceneFreeze(ctx, t);
  else if (t < 32) sceneVents(ctx, t);
  else if (t < 36.5) sceneAirSnow(ctx, t);
  else if (t < 40) sceneTwist(ctx, t);
  else sceneEnd(ctx, t);
  ctx.restore();
  for (const c of CUTS) wipe(ctx, t, c);
}

function sun(ctx, x, y, r, t, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.2);
  g.addColorStop(0, 'rgba(255,200,60,0.7)'); g.addColorStop(1, 'rgba(255,120,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#ffb000';
  for (let i = 0; i < 6; i++) { const a = i + t * 0.3; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.5, y + Math.sin(a * 1.3) * r * 0.5, r * 0.12, 0, 6.283); ctx.fill(); }
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
  ctx.restore();
}

// 0–6: the Sun pops out of existence, but Earth still looks fine.
function sceneVanish(ctx, t) {
  space(ctx, t);
  const gone = t >= 3.6;
  if (!gone) sun(ctx, W / 2, 1000, 230 * (t > 3.3 ? 1 + Math.sin((t - 3.3) * 50) * 0.06 : 1), t);
  particlesBurst(ctx, t, W / 2, 1000, 3.6, 70, '#ffd23f', 600);
  flash(ctx, t, 3.6, 0.35);
  // Earth orbiting, still lit
  const a = 0.6 + t * 0.25;
  earth(ctx, W / 2 + Math.cos(a) * 400, 1000 + Math.sin(a) * 420, 80, t);
  caption(ctx, t, 'WHAT IF THE SUN', 300, 0.2, { size: 100, out: 3.3 });
  caption(ctx, t, 'SUDDENLY VANISHED?', 470, 0.9, { size: 104, color: C.yellow, out: 3.3, maxW: 1040 });
  chip(ctx, t, '0 SECONDS LATER', 4.2);
  caption(ctx, t, 'And… nobody on Earth notices.', 1620, 4.9, { size: 74 });
  blip(ctx, t, 190, 1790, gone ? 'shock' : 'happy', 0.6, 1.6);
}

// 6–12: a sunny day while a clock races to 8:20, then instant blackness.
function sceneCountdown(ctx, t) {
  const dark = t >= 9.9;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (!dark) { g.addColorStop(0, '#5bc0ff'); g.addColorStop(1, '#d8f1ff'); } else { g.addColorStop(0, '#000000'); g.addColorStop(1, '#05060c'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (!dark) sun(ctx, 820, 330, 90, t); else stars(ctx, t, 1, 1);
  ctx.fillStyle = dark ? '#05070c' : '#4caf50';
  ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(540, 1380, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  // racing clock
  const secs = Math.min(500, Math.max(0, (t - 6.6) / 3.3 * 500));
  const label = `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
  ctx.font = `900 190px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 34; ctx.strokeStyle = C.ink; ctx.strokeText(label, W / 2, 1020);
  ctx.fillStyle = secs >= 500 ? '#ff4d4d' : C.paper; ctx.fillText(label, W / 2, 1020);
  chip(ctx, t, 'THE SUNLIGHT IS STILL ON ITS WAY', 6.3, 9.7);
  caption(ctx, t, 'Light takes 8 min 20 sec to reach us', 560, 6.3, { size: 76, out: 9.8 });
  caption(ctx, t, 'LIGHTS OUT.', 560, 10.4, { size: 130, color: C.yellow, out: 11.7 });
  if (dark) alarm(ctx, t, 0.6);
}

// 12–16.5: Earth leaves its orbit along a straight line.
function sceneDrift(ctx, t) {
  ctx.fillStyle = '#020309'; ctx.fillRect(0, 0, W, H); stars(ctx, t, 1, 1);
  const cx = W / 2, cy = 1150, R = 380;
  ctx.setLineDash([18, 22]); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  const p = easeInOut(prog(t, 13.6, 16.3));
  const ex = cx + R + 0, ey = cy - p * 1100;                 // straight tangent line, upward
  ctx.strokeStyle = C.yellow; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx + R, cy); ctx.lineTo(ex, ey); ctx.stroke();
  earth(ctx, ex, ey, 70, t * 0.5, 0.41);
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.arc(ex, ey, 70, 0, 6.283); ctx.fill();   // unlit
  chip(ctx, t, '8 MIN 20 SEC LATER', 12.4);
  caption(ctx, t, 'Nothing to orbit anymore…', 520, 13.0, { size: 84, out: 16.1 });
  caption(ctx, t, 'Earth flies off into deep space', 1650, 14.8, { size: 76, color: C.yellow, out: 16.1 });
}

// 16.5–21.5: plants wilt as photosynthesis stops.
function scenePlants(ctx, t) {
  ctx.fillStyle = '#04050b'; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.8, 1);
  ctx.fillStyle = '#1a1410'; ctx.fillRect(0, 1450, W, H);
  const wilt = easeInOut(prog(t, 17.8, 20.2));
  for (let i = 0; i < 7; i++) {
    const x = 110 + i * 145, h = 360 + (i % 3) * 60;
    const green = [60, 175, 90], brown = [120, 85, 45];
    const col = `rgb(${green.map((g, k) => Math.round(lerp(g, brown[k], wilt))).join(',')})`;
    ctx.strokeStyle = col; ctx.lineWidth = 16; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, 1460);
    const tipX = x + wilt * 160, tipY = 1460 - h * (1 - wilt * 0.55);
    ctx.quadraticCurveTo(x, 1460 - h * 0.7, tipX, tipY); ctx.stroke();
    ctx.fillStyle = col;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * 50 + wilt * 60, 1460 - h * 0.55 + wilt * 120, 60, 22, s * (0.5 + wilt), 0, 6.283); ctx.fill(); }
  }
  chip(ctx, t, 'WEEKS LATER', 16.9);
  caption(ctx, t, 'No sunlight = no photosynthesis', 520, 17.6, { size: 80, out: 21.1 });
  caption(ctx, t, 'Plants die. Then everything that eats them.', 720, 19.6, { size: 70, color: C.yellow, out: 21.1 });
}

// 21.5–27: the deep freeze: thermometer plunges, oceans ice over.
function sceneFreeze(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#02040d'); g.addColorStop(1, '#0d2342');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.8, 1);
  ctx.fillStyle = '#cfe8ff'; ctx.fillRect(0, 1500, W, H);
  ctx.strokeStyle = '#9fc7ea'; ctx.lineWidth = 5;
  for (const [x, y] of [[120, 1600], [420, 1700], [760, 1580], [930, 1760]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 90, y + 30); ctx.lineTo(x + 140, y - 20); ctx.stroke(); }
  snow(ctx, t, prog(t, 22.4, 23.2));
  // thermometer
  const tx = 780, top = 820, bot = 1380;
  const temp = t < 24.0 ? lerp(15, -18, easeInOut(prog(t, 22.6, 23.8))) : lerp(-18, -73, easeInOut(prog(t, 24.4, 25.6)));
  const level = lerp(bot, top, (temp + 80) / 110);
  ctx.fillStyle = C.paper; roundRect(ctx, tx - 45, top - 40, 90, bot - top + 80, 45); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = '#4fc3ff'; ctx.fillRect(tx - 22, level, 44, bot - level + 30);
  ctx.beginPath(); ctx.arc(tx, bot + 40, 70, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.font = `900 120px ${FONT}`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  const label = `${Math.round(temp)}°C`;
  ctx.lineWidth = 24; ctx.strokeStyle = C.ink; ctx.strokeText(label, tx - 110, level);
  ctx.fillStyle = '#bfe6ff'; ctx.fillText(label, tx - 110, level);
  chip(ctx, t, t < 24.0 ? '1 WEEK LATER' : '1 YEAR LATER', 21.9);
  caption(ctx, t, 'The whole planet freezes', 520, 22.6, { size: 88, out: 26.6 });
  caption(ctx, t, 'Oceans ice over', 680, 24.4, { size: 76, color: '#bfe6ff', out: 26.6 });
}

// 27–32: under the ice, vents keep a little life going.
function sceneVents(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b2238'); g.addColorStop(1, '#010409');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d9eeff'; ctx.fillRect(0, 0, W, 160);              // ice ceiling
  ctx.fillStyle = '#2a1c14'; ctx.fillRect(0, 1640, W, H);
  // vent chimney with glowing plume
  const vx = W / 2;
  ctx.fillStyle = '#3b2a20'; ctx.beginPath(); ctx.moveTo(vx - 120, 1660); ctx.lineTo(vx - 40, 1300); ctx.lineTo(vx + 40, 1300); ctx.lineTo(vx + 120, 1660); ctx.fill();
  const glow = ctx.createRadialGradient(vx, 1290, 10, vx, 1290, 380);
  glow.addColorStop(0, 'rgba(255,140,40,0.75)'); glow.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(vx, 1290, 380, 0, 6.283); ctx.fill();
  const r = rng(12);
  for (let i = 0; i < 30; i++) { const y = 1280 - ((t - 27) * 220 + r() * 600) % 600, x = vx + Math.sin(t * 2 + i) * 40 + (r() - 0.5) * 80;
    ctx.fillStyle = 'rgba(70,60,60,0.5)'; ctx.beginPath(); ctx.arc(x, y, 20 + r() * 30, 0, 6.283); ctx.fill(); }
  // tube worms
  for (const [x, h] of [[250, 220], [320, 280], [390, 200], [690, 240], [760, 300], [830, 210]]) {
    const sway = Math.sin(t * 2 + x) * 10;
    ctx.strokeStyle = '#f2efe6'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, 1650); ctx.quadraticCurveTo(x, 1650 - h / 2, x + sway, 1650 - h); ctx.stroke();
    ctx.fillStyle = '#ff2d55'; ctx.beginPath(); ctx.arc(x + sway, 1650 - h - 10, 22, 0, 6.283); ctx.fill();
  }
  chip(ctx, t, 'THOUSANDS OF YEARS LATER', 27.4);
  caption(ctx, t, 'Deep under the ice, the ocean stays liquid', 460, 28.4, { size: 74, out: 31.6 });
  caption(ctx, t, 'Life clings on around volcanic vents', 660, 30.0, { size: 70, color: C.yellow, out: 31.6 });
}

// 32–36.5: the air itself freezes and snows down.
function sceneAirSnow(ctx, t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); stars(ctx, t, 1, 1);
  const pile = easeInOut(prog(t, 32.6, 36));
  ctx.fillStyle = '#e8f3ff'; ctx.fillRect(0, lerp(1600, 1300, pile), W, H);
  snow(ctx, t * 0.6, 1);
  // frozen skyline sinking under the drifts
  skyline(ctx, 1600, '#101522', 0, t);
  ctx.fillStyle = 'rgba(232,243,255,0.92)'; ctx.fillRect(0, lerp(1600, 1300, pile), W, H);
  chip(ctx, t, 'MILLIONS OF YEARS LATER', 32.4);
  caption(ctx, t, 'It gets so cold the AIR freezes', 520, 33.2, { size: 84, out: 36.1 });
  caption(ctx, t, 'and falls as snow', 680, 34.4, { size: 84, color: '#bfe6ff', out: 36.1 });
}

// 36.5–40: twist: the Moon goes dark too.
function sceneTwist(ctx, t) {
  ctx.fillStyle = '#04060f'; ctx.fillRect(0, 0, W, H); stars(ctx, t, 1, 1);
  const fade = 1 - easeInOut(prog(t, 38.4, 39.3));
  moon(ctx, W / 2, 1100, 200, 0.15 + 0.85 * fade);
  caption(ctx, t, 'Plot twist:', 360, 36.8, { size: 80, color: C.yellow });
  caption(ctx, t, 'The Moon goes dark too', 500, 37.5, { size: 92 });
  caption(ctx, t, 'It never had its own light. It was just reflecting the Sun.', 1580, 38.8, { size: 60 });
}

function sceneEnd(ctx, t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); stars(ctx, t, 0.6);
  caption(ctx, t, 'WHAT IF,', 640, 40.3, { size: 150, color: C.paper });
  caption(ctx, t, 'THOUGH?', 800, 40.5, { size: 170, color: C.yellow });
  caption(ctx, t, 'Follow for more ways the world could end', 1000, 41.0, { size: 54 });
  blip(ctx, t, W / 2, 1400, 'wave', 1.3, 40.3);
}
