// Style 2: cinematic / documentary. Near-black, off-white, one signal red.
// Masked line reveals instead of pop-ins, a HUD clock, film grain, vignette, glitch cuts.
const S2 = {
  bg: '#0a0a0c', fg: '#ece8e1', dim: '#8a8a92', red: '#ff3b30', blue: '#4da3ff', line: 'rgba(236,232,225,0.18)',
  sans: '"Inter Display", "Inter", sans-serif', mono: '"JetBrains Mono", monospace',
  margin: 90,
};

// ---------- texture
const GRAIN = (() => {
  const tiles = [];
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), img = g.createImageData(256, 256), r = rng(100 + k);
    for (let i = 0; i < img.data.length; i += 4) { const v = r() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0); tiles.push(c);
  }
  return tiles;
})();

function grain(ctx, t, amount = 0.07) {
  const tile = GRAIN[Math.floor(t * 24) % GRAIN.length];
  ctx.save(); ctx.globalAlpha = amount; ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(tile, 'repeat'); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function vignette(ctx, k = 0.75) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// Slow cinematic push-in: call before drawing a scene, restore after.
function push(ctx, t, a, b, from = 1.0, to = 1.07, cx = W / 2, cy = H / 2) {
  const s = lerp(from, to, prog(t, a, b));
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
}

// ---------- typography
// Lines slide up from behind a mask, staggered. Exit: fade + drift up.
function reveal(ctx, t, lines, y, at, opts = {}) {
  const { size = 78, weight = 800, color = S2.fg, out = 1e9, x = S2.margin, stagger = 0.09, lh = 1.08, align = 'left', accent = null } = opts;
  if (t < at || t > out + 0.5) return;
  const exit = prog(t, out, out + 0.4);
  ctx.save();
  ctx.font = `${weight} ${size}px ${S2.sans}`; ctx.textBaseline = 'alphabetic'; ctx.textAlign = align;
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${-size * 0.02}px`;
  lines.forEach((ln, i) => {
    const p = easeOut(prog(t, at + i * stagger, at + i * stagger + 0.55));
    const ly = y + i * size * lh;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, ly - size * 1.0, W, size * 1.28); ctx.clip();
    ctx.globalAlpha = 1 - exit;
    ctx.fillStyle = accent && accent[i] ? accent[i] : color;
    ctx.fillText(ln, x, ly + (1 - p) * size * 1.15 - exit * 24);
    ctx.restore();
  });
  ctx.restore();
}

// Small monospace label with a red tick: "T+00:20:00  ·  CITIES"
function kicker(ctx, t, text, y, at, out = 1e9, x = S2.margin) {
  if (t < at || t > out + 0.4) return;
  const p = easeOut(prog(t, at, at + 0.4)), e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e;
  ctx.fillStyle = S2.red; ctx.fillRect(x, y - 26, 6, 32);
  ctx.font = `600 34px ${S2.mono}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const shown = text.slice(0, Math.ceil(text.length * p));         // typewriter
  ctx.fillStyle = S2.fg; ctx.fillText(shown, x + 26, y);
  ctx.restore();
}

// Persistent HUD: channel bug, in-world clock, thin progress bar.
function hud(ctx, t, clock, duration, show = true) {
  if (!show) return;
  ctx.save();
  ctx.font = `700 26px ${S2.mono}`; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = S2.dim; ctx.textAlign = 'left'; ctx.fillText('WHAT IF, THOUGH?', S2.margin, 96);
  ctx.textAlign = 'right';
  if (clock) {
    ctx.fillStyle = Math.floor(t * 2) % 2 ? S2.red : 'rgba(255,59,48,0.35)';
    ctx.beginPath(); ctx.arc(W - S2.margin - ctx.measureText(clock).width - 26, 87, 9, 0, 6.283); ctx.fill();
    ctx.fillStyle = S2.fg; ctx.fillText(clock, W - S2.margin, 96);
  }
  ctx.fillStyle = 'rgba(236,232,225,0.12)'; ctx.fillRect(S2.margin, H - 70, W - 2 * S2.margin, 3);
  ctx.fillStyle = S2.red; ctx.fillRect(S2.margin, H - 70, (W - 2 * S2.margin) * clamp(t / duration), 3);
  ctx.restore();
}

// Leader-line callout: dot at (x, y), line to a label.
function callout(ctx, t, x, y, label, at, opts = {}) {
  const { dx = 160, dy = -120, out = 1e9, color = S2.fg, size = 34 } = opts;
  if (t < at || t > out + 0.3) return;
  const p = easeOut(prog(t, at, at + 0.45)), e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e;
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, 9 + 18 * ((t * 1.2) % 1), 0, 6.283); ctx.globalAlpha = e * (1 - (t * 1.2) % 1); ctx.stroke(); ctx.globalAlpha = e;
  const ex = x + dx * p, ey = y + dy * p;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.lineTo(ex + Math.sign(dx) * 30 * p, ey); ctx.stroke();
  ctx.font = `600 ${size}px ${S2.mono}`; ctx.textAlign = dx >= 0 ? 'left' : 'right'; ctx.textBaseline = 'middle';
  ctx.fillText(label.slice(0, Math.ceil(label.length * prog(t, at + 0.25, at + 0.7))), ex + Math.sign(dx) * 44, ey);
  ctx.restore();
}

// Glitch cut: a few frames of RGB-split slices around time `at`.
function glitch(ctx, t, at, dur = 0.16) {
  const p = prog(t, at - dur / 2, at + dur / 2);
  if (p <= 0 || p >= 1) return;
  const r = rng(Math.floor(t * 60));
  const snap = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < 9; i++) {
    const y = Math.floor(r() * H), h = Math.floor(20 + r() * 140), off = Math.floor((r() - 0.5) * 120);
    ctx.putImageData(snap, off, 0, 0, y, W, h);
  }
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(255,59,48,${0.25 * (1 - Math.abs(p - 0.5) * 2)})`; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function fadeBlack(ctx, t, at, dur = 0.5) {
  const p = 1 - Math.abs(prog(t, at - dur / 2, at + dur / 2) - 0.5) * 2;
  if (p <= 0) return;
  ctx.fillStyle = `rgba(0,0,0,${p})`; ctx.fillRect(0, 0, W, H);
}

// Count-up number in mono.
function counter(ctx, t, value, x, y, at, opts = {}) {
  const { size = 120, color = S2.fg, dur = 1.2, suffix = '', out = 1e9 } = opts;
  if (t < at || t > out + 0.3) return;
  const v = Math.round(value * easeOut(prog(t, at, at + dur)));
  ctx.save(); ctx.globalAlpha = 1 - prog(t, out, out + 0.3);
  ctx.font = `700 ${size}px ${S2.mono}`; ctx.textAlign = 'left'; ctx.fillStyle = color;
  ctx.fillText(v.toLocaleString('en-US') + suffix, x, y);
  ctx.restore();
}

// Common frame finish: grain + vignette + HUD.
function finish(ctx, t, clock, duration, showHud = true) {
  vignette(ctx); grain(ctx, t); hud(ctx, t, clock, duration, showHud);
}
