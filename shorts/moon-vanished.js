// What if the Moon just vanished?
// Facts used: without the Moon, tides come only from the Sun, about a third of today's
// combined tide (solar tide ≈ 46% of lunar); many corals time mass spawning to the
// lunar cycle; the Moon damps changes in Earth's axial tilt; the Moon recedes ~3.8 cm/yr.
const SHORT = {
  title: 'What if the Moon just vanished?',
  duration: 38,
  // Sound cues: [time, sound]. The audio builder turns these into synthesised SFX.
  sfx: [
    [0.2, 'pop'], [0.9, 'pop'], [1.6, 'boing'],
    [3.7, 'riser'], [4.0, 'poof'], [4.6, 'pop'], [5.4, 'pop'],
    [6.5, 'whoosh'], [7.0, 'pop'], [8.2, 'dim'], [9.3, 'sparkle'],
    [11.5, 'whoosh'], [11.9, 'pop'], [12.0, 'waves:6'], [13.0, 'pop'], [15.2, 'shrink'], [16.0, 'pop'],
    [17.5, 'whoosh'], [17.9, 'pop'], [18.0, 'bubbles:5'], [19.0, 'pop'], [20.6, 'huh'], [21.3, 'huh'],
    [23.0, 'whoosh'], [23.4, 'pop'], [24.2, 'pop'], [25.0, 'wobble:5'], [27.4, 'pop'],
    [30.0, 'whoosh'], [30.4, 'record'], [31.2, 'pop'], [32.6, 'pop'], [33.6, 'boom'],
    [35.5, 'whoosh'], [35.9, 'pop'], [36.6, 'ding'],
  ],
  music: { bpm: 112, until: 37.6, duckAt: [[30.2, 31.2]] },
};

function render(ctx, t) {
  if (t < 6.5) sceneVanish(ctx, t);
  else if (t < 11.5) sceneNight(ctx, t);
  else if (t < 17.5) sceneTides(ctx, t);
  else if (t < 23) sceneCoral(ctx, t);
  else if (t < 30) sceneTilt(ctx, t);
  else if (t < 35.5) sceneLeaving(ctx, t);
  else sceneEnd(ctx, t);
  for (const cut of [6.5, 11.5, 17.5, 23, 30, 35.5]) wipe(ctx, t, cut);
}

// 0–6.5 s: Earth and Moon, then the Moon pops out of existence.
function sceneVanish(ctx, t) {
  space(ctx, t);
  const ex = W / 2, ey = 1080, er = 260;
  earth(ctx, ex, ey, er, t * 0.4);
  const a = -2.2 + t * 0.55, mx = ex + Math.cos(a) * 430, my = ey + Math.sin(a) * 300;
  const gone = t >= 4.0;
  const squash = t > 3.7 && !gone ? 1 + Math.sin((t - 3.7) * 60) * 0.08 : 1;
  if (!gone) moon(ctx, mx, my, 70 * squash);
  if (gone) { particlesBurst(ctx, t, ex + Math.cos(-2.2 + 4 * 0.55) * 430, ey + Math.sin(-2.2 + 4 * 0.55) * 300, 4.0, 50, '#dfe3ea', 380); }
  flash(ctx, t, 4.0, 0.3);
  caption(ctx, t, 'WHAT IF THE MOON', 300, 0.2, { size: 96, out: 3.6, maxW: 1020 });
  caption(ctx, t, 'JUST… VANISHED?', 430, 0.9, { size: 108, color: C.yellow, out: 3.6, maxW: 1040 });
  chip(ctx, t, '0 SECONDS LATER', 4.6);
  caption(ctx, t, "It's just… gone.", 1480, 5.4, { size: 84 });
  blip(ctx, t, 200, 1730, gone ? 'shock' : 'happy', 0.8, 1.6);
}

// 6.5–11.5 s: a night landscape loses its moonlight; more stars appear.
function sceneNight(ctx, t) {
  const d = easeInOut(prog(t, 8.2, 9.6));
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, mix('#2b3f73', '#03040b', d)); g.addColorStop(1, mix('#4a5f96', '#0b1022', d));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 1, prog(t, 9.0, 10.2));
  // moonlight glow fading (no moon disc: it's gone)
  ctx.fillStyle = `rgba(200,215,255,${0.18 * (1 - d)})`; ctx.fillRect(0, 0, W, H);
  // hills, tree and a house with a lit window
  ctx.fillStyle = mix('#1c2a4a', '#05070f', d);
  ctx.beginPath(); ctx.moveTo(0, 1350); ctx.quadraticCurveTo(300, 1200, 620, 1330); ctx.quadraticCurveTo(880, 1430, W, 1300); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = mix('#111b33', '#020309', d); ctx.fillRect(0, 1500, W, H);
  ctx.fillStyle = '#0a0f1f'; ctx.fillRect(700, 1220, 220, 170);
  ctx.beginPath(); ctx.moveTo(680, 1230); ctx.lineTo(810, 1120); ctx.lineTo(940, 1230); ctx.fill();
  ctx.fillStyle = '#ffd88a'; ctx.fillRect(750, 1270, 60, 60);
  chip(ctx, t, 'THAT NIGHT', 7.0);
  caption(ctx, t, 'Nights get WAY darker', 560, 7.0, { size: 92, out: 11.1 });
  caption(ctx, t, '…but you see way more stars', 720, 9.3, { size: 66, color: C.yellow, out: 11.1 });
  blip(ctx, t, 230, 1700, 'worried', 0.75, 7.2);
}

// 11.5–17.5 s: a beach and a tide gauge; the tidal swing shrinks to ~1/3.
function sceneTides(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#8fd3ff'); g.addColorStop(1, '#e7f6ff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(860, 330, 90, 0, 6.283); ctx.fill();
  const amp = lerp(170, 57, easeInOut(prog(t, 15.0, 16.2)));   // tidal range shrinks to about a third
  const level = 1250 - amp * Math.sin((t - 11.5) * 2.2);
  // gauge pole
  ctx.fillStyle = C.paper; ctx.fillRect(500, 900, 80, 720); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.strokeRect(500, 900, 80, 720);
  ctx.fillStyle = C.ink; for (let y = 940; y < 1600; y += 60) ctx.fillRect(500, y, 40, 8);
  // old high-water mark
  ctx.fillStyle = C.pink; ctx.fillRect(470, 1080, 140, 12);
  ctx.font = `800 40px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = C.ink; ctx.fillText('old high tide', 630, 1095);
  // sand and sea
  ctx.fillStyle = '#f4d58d'; ctx.beginPath(); ctx.moveTo(0, 1500); ctx.quadraticCurveTo(500, 1420, W, 1480); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = 'rgba(29,111,209,0.85)'; ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, level + Math.sin(x / 60 + t * 3) * 14);
  ctx.lineTo(W, H); ctx.fill();
  chip(ctx, t, '6 HOURS LATER', 11.9);
  caption(ctx, t, 'Tides shrink to about ⅓ their size', 520, 13.0, { size: 84, out: 17.1 });
  caption(ctx, t, '(only the Sun is pulling now)', 700, 16.0, { size: 60, color: C.ink, out: 17.1 });
}

// 17.5–23 s: corals that spawn by moonlight lose their cue.
function sceneCoral(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0e4a8a'); g.addColorStop(1, '#06223f');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(5);
  for (let i = 0; i < 40; i++) { const x = r() * W, y = (r() * H - (t - 17.5) * 160 * (0.5 + r())) % H;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, (y + H) % H, 6 + r() * 10, 0, 6.283); ctx.stroke(); }
  ctx.fillStyle = '#d9b98c'; ctx.fillRect(0, 1640, W, 300);
  const corals = [[200, '#ff5d8f'], [430, '#ff9f1c'], [650, '#c77dff'], [870, '#ff5d8f']];
  corals.forEach(([x, col], i) => {
    ctx.strokeStyle = col; ctx.lineWidth = 34; ctx.lineCap = 'round';
    const sway = Math.sin(t * 2 + i) * 12;
    ctx.beginPath(); ctx.moveTo(x, 1660); ctx.lineTo(x + sway, 1460);
    ctx.moveTo(x + sway * 0.5, 1560); ctx.lineTo(x - 70 + sway, 1440);
    ctx.moveTo(x + sway * 0.6, 1530); ctx.lineTo(x + 70 + sway, 1420); ctx.stroke();
    const qa = i % 2 === 0 ? 20.6 : 21.3;
    if (t > qa) { const p = easeBack(prog(t, qa, qa + 0.3));
      ctx.save(); ctx.translate(x + sway, 1340); ctx.scale(p, p); ctx.font = `900 110px ${FONT}`; ctx.textAlign = 'center';
      ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.strokeText('?', 0, 0); ctx.fillStyle = C.yellow; ctx.fillText('?', 0, 0); ctx.restore(); }
  });
  chip(ctx, t, 'NEXT "FULL MOON"', 17.9);
  caption(ctx, t, 'Corals that spawn by moonlight lose their calendar', 560, 19.0, { size: 80, out: 22.6 });
}

// 23–30 s: without the Moon, Earth's tilt wobbles far more over long timescales.
function sceneTilt(ctx, t) {
  space(ctx, t);
  const wob = easeInOut(prog(t, 24.5, 28.5));
  const tilt = 0.41 + Math.sin((t - 23) * 2.4) * lerp(0.03, 0.55, wob);
  earth(ctx, W / 2, 1120, 270, t * 0.6, tilt, true);
  chip(ctx, t, 'MILLIONS OF YEARS LATER', 23.4);
  caption(ctx, t, "Earth's tilt starts wobbling way more", 520, 24.2, { size: 84, out: 29.6 });
  caption(ctx, t, '→ much wilder swings in climate', 1600, 27.4, { size: 70, color: C.yellow, out: 29.6 });
  blip(ctx, t, 190, 1760, 'shock', 0.6, 25);
}

// 30–35.5 s: the twist. The Moon really is drifting away, slowly.
function sceneLeaving(ctx, t) {
  space(ctx, t);
  const ex = W / 2, ey = 1180;
  earth(ctx, ex, ey, 220, t * 0.4);
  const drift = easeInOut(prog(t, 31.2, 35)) * 160;
  const mx = ex + 250 + drift, my = ey - 330 - drift * 0.9;
  moon(ctx, mx, my, 62);
  if (t > 32.6) { ctx.strokeStyle = C.yellow; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(mx - 60, my + 120); ctx.lineTo(mx + 40, my + 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx + 40, my + 20); ctx.lineTo(mx + 40, my + 70); ctx.moveTo(mx + 40, my + 20); ctx.lineTo(mx - 10, my + 20); ctx.stroke(); }
  caption(ctx, t, 'Plot twist:', 360, 30.4, { size: 80, color: C.yellow });
  caption(ctx, t, 'The Moon is ALREADY leaving.', 500, 31.2, { size: 92 });
  caption(ctx, t, 'About 3.8 cm farther away every year', 1620, 32.6, { size: 66 });
  blip(ctx, t, 200, 1770, 'worried', 0.6, 33.6);
}

// 35.5–38 s: end card.
function sceneEnd(ctx, t) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  stars(ctx, t, 0.6);
  caption(ctx, t, 'WHAT IF,', 640, 35.9, { size: 150, color: C.paper });
  caption(ctx, t, 'THOUGH?', 800, 36.1, { size: 170, color: C.yellow });
  caption(ctx, t, 'Follow for a new what-if every day', 1000, 36.6, { size: 56 });
  blip(ctx, t, W / 2, 1400, 'wave', 1.3, 35.9);
}

function mix(a, b, p) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join('');
}
