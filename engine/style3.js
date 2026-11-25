// Style 3: "pop editorial". Colourful illustration with depth: gradients, soft shadows, glow,
// masked caption reveals with highlighter bands, frosted pill labels, whip-pan transitions.
const P = {
  ink: '#1b1640', white: '#ffffff', cream: '#fff7ee',
  violet: '#6c4cff', indigo: '#2b2a7a', coral: '#ff6b5b', peach: '#ffb38a', gold: '#ffc93c',
  teal: '#14c8b4', mint: '#a8f0d8', sky: '#52b8ff', pink: '#ff5fa2', lime: '#9be15d',
  sans: '"Inter Display", "Inter", sans-serif', mono: '"JetBrains Mono", monospace', margin: 84,
};

// ---------- backgrounds & lighting
function grad(ctx, stops, x0 = 0, y0 = 0, x1 = 0, y1 = H) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
}
function sky(ctx, stops) { ctx.fillStyle = grad(ctx, stops); ctx.fillRect(0, 0, W, H); }
function glow(ctx, x, y, r, rgb = '255,255,255', a = 0.6) {   // rgb as "r,g,b"
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
}
function shadowed(ctx, fn, blur = 40, oy = 18, color = 'rgba(27,22,64,0.28)') {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; fn(); ctx.restore();
}
function cloud(ctx, x, y, s, a = 0.95) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff';
  for (const [dx, dy, r] of [[0, 0, 70], [70, -20, 85], [150, 0, 65], [75, 25, 70]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, 6.283); ctx.fill(); }
  ctx.restore();
}
function bokeh(ctx, t, color = 'rgba(255,255,255,', n = 26, seed = 3) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = (r() * H - t * 20 * (0.5 + r())) % H, rr = 6 + r() * 26;
    ctx.fillStyle = color + (0.08 + r() * 0.15) + ')'; ctx.beginPath(); ctx.arc(x, (y + H) % H, rr, 0, 6.283); ctx.fill();
  }
}
function softVignette(ctx, a = 0.28) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, 'rgba(27,22,64,0)'); g.addColorStop(1, `rgba(27,22,64,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function drift(ctx, t, a, b, from = 1.0, to = 1.05, cx = W / 2, cy = H / 2) {
  const s = lerp(from, to, easeInOut(prog(t, a, b)));
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
}

// ---------- typography
// Masked slide-up lines. `mark` = {line, from, to, color}: a highlighter band that sweeps in behind
// characters [from, to) of that line.
function say(ctx, t, lines, y, at, o = {}) {
  const { size = 84, weight = 900, color = P.white, out = 1e9, x = P.margin, stagger = 0.08, lh = 1.1, align = 'left', mark = null, shadow = true } = o;
  if (t < at || t > out + 0.5) return;
  const exit = prog(t, out, out + 0.35);
  ctx.save();
  ctx.font = `${weight} ${size}px ${P.sans}`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${-size * 0.025}px`;
  lines.forEach((ln, i) => {
    const p = easeOut(prog(t, at + i * stagger, at + i * stagger + 0.5));
    const ly = y + i * size * lh, dy = (1 - p) * size * 1.1 - exit * 20;
    const lx = align === 'center' ? x - ctx.measureText(ln).width / 2 : x;
    if (mark && mark.line === i) {
      const pre = ctx.measureText(ln.slice(0, mark.from)).width, wd = ctx.measureText(ln.slice(mark.from, mark.to)).width;
      const mp = easeInOut(prog(t, at + 0.35 + i * stagger, at + 0.8 + i * stagger));
      ctx.save(); ctx.globalAlpha = 1 - exit; ctx.fillStyle = mark.color || P.coral;
      roundRect(ctx, lx + pre - 12, ly - size * 0.8, (wd + 24) * mp, size * 1.0, 14); ctx.fill(); ctx.restore();
    }
    ctx.save(); ctx.beginPath(); ctx.rect(0, ly - size * 1.05, W, size * 1.35); ctx.clip();
    ctx.globalAlpha = 1 - exit;
    if (shadow) { ctx.shadowColor = 'rgba(27,22,64,0.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; }
    ctx.fillStyle = color; ctx.fillText(ln, x, ly + dy);
    ctx.restore();
  });
  ctx.restore();
}

// Frosted pill label: coloured dot + mono text, glides in from the left.
function pill(ctx, t, text, y, at, out = 1e9, dot = P.coral, x = P.margin) {
  if (t < at || t > out + 0.35) return;
  const p = easeOut(prog(t, at, at + 0.45)), e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e * p;
  ctx.font = `700 32px ${P.mono}`;
  const w = ctx.measureText(text).width + 92, h = 66, px = x - (1 - p) * 40;
  shadowed(ctx, () => { ctx.fillStyle = 'rgba(255,255,255,0.88)'; roundRect(ctx, px, y - h / 2, w, h, h / 2); ctx.fill(); }, 30, 10);
  ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(px + 36, y, 11, 0, 6.283); ctx.fill();
  ctx.fillStyle = P.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, px + 60, y + 2);
  ctx.restore();
}

// Light HUD: channel name, in-world clock, slim progress bar.
function hudPop(ctx, t, clock, duration) {
  ctx.save(); ctx.font = `700 26px ${P.mono}`; ctx.textBaseline = 'middle';
  const chipBox = (x, txt, align) => {
    const w = ctx.measureText(txt).width + 40, bx = align === 'left' ? x : x - w;
    ctx.fillStyle = 'rgba(27,22,64,0.32)'; roundRect(ctx, bx, 70, w, 52, 26); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(txt, bx + 20, 97);
  };
  chipBox(P.margin, 'WHAT IF, THOUGH?', 'left');
  if (clock) chipBox(W - P.margin, clock, 'right');
  ctx.fillStyle = 'rgba(27,22,64,0.22)'; roundRect(ctx, P.margin, H - 80, W - 2 * P.margin, 8, 4); ctx.fill();
  ctx.fillStyle = P.coral; roundRect(ctx, P.margin, H - 80, Math.max(8, (W - 2 * P.margin) * clamp(t / duration)), 8, 4); ctx.fill();
  ctx.restore();
}

// Callout bubble with a leader line.
function note(ctx, t, x, y, text, at, o = {}) {
  const { dx = 140, dy = -140, out = 1e9, color = P.white, size = 34 } = o;
  if (t < at || t > out + 0.3) return;
  const p = easeOut(prog(t, at, at + 0.45)), e = 1 - prog(t, out, out + 0.3);
  ctx.save(); ctx.globalAlpha = e;
  ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, 10, 0, 6.283); ctx.fill();
  const ex = x + dx * p, ey = y + dy * p;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.font = `800 ${size}px ${P.sans}`; const w = ctx.measureText(text).width + 44;
  const bx = dx >= 0 ? ex : ex - w;
  ctx.globalAlpha = e * prog(t, at + 0.2, at + 0.5);
  shadowed(ctx, () => { ctx.fillStyle = color; roundRect(ctx, bx, ey - 34, w, 68, 34); ctx.fill(); }, 24, 8);
  ctx.fillStyle = P.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, bx + 22, ey + 2);
  ctx.restore();
}

// ---------- sequencing with whip-pan transitions
const _bufs = [];
function _buf(i) { if (!_bufs[i]) { const c = document.createElement('canvas'); c.width = W; c.height = H; _bufs[i] = c; } return _bufs[i]; }

// scenes: [[startTime, drawFn], ...]. Cuts get a 0.36 s whip-pan with motion smear.
function sequence(ctx, t, scenes, whip = 0.36) {
  let i = 0; while (i + 1 < scenes.length && t >= scenes[i + 1][0]) i++;
  const next = scenes[i + 1], cur = scenes[i];
  const draw = (k, c) => { const cx = c.getContext('2d'); cx.save(); cx.clearRect(0, 0, W, H); scenes[k][1](cx, t); cx.restore(); return c; };
  // in a transition window?
  const into = t - cur[0] < whip / 2 && i > 0, outof = next && next[0] - t < whip / 2;
  if (!into && !outof) { ctx.save(); cur[1](ctx, t); ctx.restore(); return; }
  const a = outof ? i : i - 1, b = a + 1, cut = scenes[b][0];
  const p = easeInOut(prog(t, cut - whip / 2, cut + whip / 2));
  const A = draw(a, _buf(0)), B = draw(b, _buf(1));
  for (const [img, off] of [[A, -p * W], [B, (1 - p) * W]]) {
    for (let k = 0; k < 5; k++) { ctx.globalAlpha = k === 0 ? 1 : 0.18; ctx.drawImage(img, off - k * 26 * Math.sin(p * Math.PI), 0); }
  }
  ctx.globalAlpha = 1;
}
