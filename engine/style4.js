// Style 4: the original bright cartoon look (lib.js), turned up. Richer colour and depth,
// word-by-word kinetic captions, realistic-proportion people, and biology/props kit.
// Uses lib.js (C palette, chip, blip, earth...) and style3.js (sequence, shadowed, glow, grad, drift).

// ---------- kinetic caption: words pop in one at a time; *starred* words get the accent colour.
function pop(ctx, t, text, y, at, o = {}) {
  const { size = 88, color = C.paper, accent = C.yellow, out = 1e9, maxW = 940, per = 0.06, x = W / 2 } = o;
  if (t < at || t > out + 0.3) return;
  const exit = prog(t, out, out + 0.25);
  ctx.save();
  ctx.font = `900 ${size}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const words = text.split(' ').map(w => ({ w: w.replace(/\*/g, ''), hot: w.includes('*') }));
  const space = ctx.measureText(' ').width, lines = [[]]; let lw = 0;
  for (const wd of words) {
    const ww = ctx.measureText(wd.w).width;
    if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; }
    lines[lines.length - 1].push({ ...wd, ww }); lw += ww + space;
  }
  let k = 0;
  lines.forEach((ln, li) => {
    const total = ln.reduce((a, b) => a + b.ww, 0) + space * (ln.length - 1);
    let cx = x - total / 2;
    const ly = y + (li - (lines.length - 1) / 2) * size * 1.12;
    for (const wd of ln) {
      const p = prog(t, at + k * per, at + k * per + 0.28), s = easeBack(p) * (1 - exit * 0.3);
      if (p > 0) {
        ctx.save(); ctx.globalAlpha = Math.min(1, p * 2) * (1 - exit);
        ctx.translate(cx + wd.ww / 2, ly + (1 - easeOut(p)) * 30 - exit * 30); ctx.scale(0.7 + 0.3 * s, 0.7 + 0.3 * s);
        ctx.textAlign = 'center';
        ctx.lineWidth = size * 0.22; ctx.strokeStyle = C.ink; ctx.strokeText(wd.w, 0, 0);
        ctx.fillStyle = wd.hot ? accent : color; ctx.fillText(wd.w, 0, 0);
        ctx.restore();
      }
      cx += wd.ww + space; k++;
    }
  });
  ctx.restore();
}

// Big fact number + label ("0.2 KG" / "of you, gone").
function stat(ctx, t, big, small, x, y, at, o = {}) {
  const { out = 1e9, color = C.yellow, size = 170 } = o;
  if (t < at || t > out + 0.3) return;
  const p = easeBack(prog(t, at, at + 0.45)) * (1 - easeInOut(prog(t, out, out + 0.25)));
  ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = `900 ${size}px ${FONT}`; ctx.lineWidth = size * 0.18; ctx.strokeStyle = C.ink; ctx.strokeText(big, 0, 0); ctx.fillStyle = color; ctx.fillText(big, 0, 0);
  ctx.font = `800 ${size * 0.32}px ${FONT}`; ctx.lineWidth = size * 0.08; ctx.strokeText(small, 0, size * 0.72); ctx.fillStyle = C.paper; ctx.fillText(small, 0, size * 0.72);
  ctx.restore();
}

// Bright scene backdrop: gradient + soft blobs for depth.
function backdrop4(ctx, t, stops, seed = 1) {
  ctx.fillStyle = grad(ctx, stops); ctx.fillRect(0, 0, W, H);
  const r = rng(seed);
  for (let i = 0; i < 6; i++) { const x = r() * W, y = r() * H, rr = 200 + r() * 300;
    glow(ctx, x + Math.sin(t * 0.3 + i) * 30, y, rr, '255,255,255', 0.10); }
}

// ---------- people with realistic proportions (about 7.5 heads tall), simple but human.
// pose: 'stand' | 'sniff' | 'cheer' | 'shrug'; face: 'neutral' | 'happy' | 'shock' | 'gross'
const SKINS = ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac', '#5c3a1e'];
function human(ctx, t, x, y, h, o = {}) {
  const { skin = SKINS[2], shirt = C.blue, pants = '#2b2f4a', hair = '#2a1a12', pose = 'stand', face = 'neutral', flip = false, long = false } = o;
  const u = h / 7.5;                                    // one head-height
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  const sway = Math.sin(t * 2 + x) * 0.03;
  ctx.rotate(sway);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // shadow
  ctx.fillStyle = 'rgba(27,22,64,0.18)'; ctx.beginPath(); ctx.ellipse(0, 0, u * 1.4, u * 0.3, 0, 0, 6.283); ctx.fill();
  // legs
  ctx.strokeStyle = pants; ctx.lineWidth = u * 0.62;
  ctx.beginPath(); ctx.moveTo(-u * 0.32, -u * 3.8); ctx.lineTo(-u * 0.38, -u * 0.2); ctx.moveTo(u * 0.32, -u * 3.8); ctx.lineTo(u * 0.4, -u * 0.2); ctx.stroke();
  ctx.fillStyle = '#222'; for (const sx of [-0.45, 0.45]) { ctx.beginPath(); ctx.ellipse(u * sx * 1.05, -u * 0.12, u * 0.45, u * 0.2, 0, 0, 6.283); ctx.fill(); }
  // torso
  ctx.fillStyle = shirt; roundRect(ctx, -u * 0.85, -u * 6.35, u * 1.7, u * 2.75, u * 0.45); ctx.fill();
  // arms by pose
  const arm = (side, ang1, ang2) => {
    const sx = side * u * 0.78, sy = -u * 6.0;
    const ex = sx + side * Math.sin(ang1) * u * 1.5, ey = sy + Math.cos(ang1) * u * 1.5;   // angles: 0 = down, + = outward
    const hx = ex + side * Math.sin(ang2) * u * 1.35, hy = ey + Math.cos(ang2) * u * 1.35;
    ctx.strokeStyle = shirt; ctx.lineWidth = u * 0.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.strokeStyle = skin; ctx.lineWidth = u * 0.42; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hx, hy, u * 0.26, 0, 6.283); ctx.fill();
  };
  const wav = Math.sin(t * 9) * 0.25;
  if (pose === 'cheer') { for (const sd of [-1, 1]) arm(sd, 2.5 + wav * sd, 2.9 + wav * sd); }
  else if (pose === 'sniff') { arm(-1, 0.12, 0.05); arm(1, 0.55, -2.75); }        // pinching nose
  else if (pose === 'shrug') { for (const sd of [-1, 1]) arm(sd, 0.9, 2.3); }
  else { for (const sd of [-1, 1]) arm(sd, 0.12, 0.05); }
  // neck + head
  ctx.fillStyle = skin; ctx.fillRect(-u * 0.22, -u * 6.75, u * 0.44, u * 0.5);
  ctx.beginPath(); ctx.ellipse(0, -u * 7.15, u * 0.5, u * 0.6, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(0, -u * 7.45, u * 0.54, u * 0.38, 0, Math.PI, 0); ctx.fill();
  if (long) { ctx.fillRect(-u * 0.54, -u * 7.45, u * 0.22, u * 1.1); ctx.fillRect(u * 0.32, -u * 7.45, u * 0.22, u * 1.1); }
  // face
  ctx.fillStyle = C.ink;
  const ey = -u * 7.15, blink = (t + x * 0.01) % 3.1 < 0.1 ? 0.2 : 1;
  for (const ex of [-0.2, 0.2]) { ctx.beginPath(); ctx.ellipse(u * ex + u * 0.06, ey, u * 0.07, u * (face === 'shock' ? 0.12 : 0.08) * blink, 0, 0, 6.283); ctx.fill(); }
  ctx.strokeStyle = C.ink; ctx.lineWidth = u * 0.07; ctx.beginPath();
  if (face === 'happy') { ctx.arc(u * 0.06, -u * 6.95, u * 0.2, 0.2, Math.PI - 0.2); }
  else if (face === 'shock') { ctx.ellipse(u * 0.06, -u * 6.85, u * 0.09, u * 0.13, 0, 0, 6.283); }
  else if (face === 'gross') { ctx.moveTo(-u * 0.12, -u * 6.85); ctx.quadraticCurveTo(u * 0.06, -u * 6.98, u * 0.24, -u * 6.85); }
  else { ctx.moveTo(-u * 0.08, -u * 6.88); ctx.lineTo(u * 0.2, -u * 6.88); }
  ctx.stroke();
  ctx.restore();
}

// ---------- biology props
function bacterium(ctx, x, y, s, kind, rot, col, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.fillStyle = col; ctx.strokeStyle = C.ink; ctx.lineWidth = 5;
  if (kind === 0) { roundRect(ctx, -60, -22, 120, 44, 22); ctx.fill(); ctx.stroke();                        // rod
    ctx.beginPath(); ctx.moveTo(60, 0); ctx.bezierCurveTo(90, -20, 110, 20, 140, 0); ctx.stroke(); }          // flagellum
  else if (kind === 1) { for (const dx of [-26, 26]) { ctx.beginPath(); ctx.arc(dx, 0, 26, 0, 6.283); ctx.fill(); ctx.stroke(); } }   // diplococcus
  else { ctx.lineWidth = 22; ctx.strokeStyle = col; ctx.beginPath();                                          // spiral
    for (let i = 0; i <= 40; i++) { const xx = -70 + i * 3.5, yy = Math.sin(i * 0.5) * 16; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-14, -8, 14, 6, 0, 0, 6.283); ctx.fill();
  ctx.restore();
}

function cow(ctx, t, x, y, s, thin = 0, face = 'neutral') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(27,22,64,0.18)'; ctx.beginPath(); ctx.ellipse(0, 150, 220, 26, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 7;
  for (const lx of [-130, -80, 90, 140]) { ctx.fillRect(lx - 14, 40, 28, 110); ctx.strokeRect(lx - 14, 40, 28, 110); }
  ctx.beginPath(); ctx.ellipse(0, 0, 200 - thin * 30, 95 - thin * 25, 0, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2b2233';
  for (const [sx, sy, r] of [[-60, -30, 40], [70, 10, 34], [-120, 30, 24]]) { ctx.beginPath(); ctx.ellipse(sx, sy, r, r * 0.75, 0.4, 0, 6.283); ctx.fill(); }
  if (thin > 0.3) { ctx.strokeStyle = `rgba(27,22,64,${thin * 0.6})`; ctx.lineWidth = 5;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * 34, -10, 60, 1.2, 1.9); ctx.stroke(); } }
  // head
  ctx.save(); ctx.translate(210, -40 + Math.sin(t * 2) * 4);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.ellipse(20, 0, 70, 60, 0.2, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffb3c1'; ctx.beginPath(); ctx.ellipse(55, 35, 46, 32, 0.2, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(15, -12, 8, 0, 6.283); ctx.fill();
  if (face === 'sad') { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(2, -32); ctx.lineTo(28, -26); ctx.stroke(); }
  ctx.fillStyle = '#e9d7b0'; ctx.beginPath(); ctx.moveTo(-20, -50); ctx.lineTo(-40, -95); ctx.lineTo(-5, -55); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

function redX(ctx, x, y, s, p) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * easeBack(p), s * easeBack(p));
  ctx.strokeStyle = '#ff3b5c'; ctx.lineWidth = 26; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-60, -60); ctx.lineTo(60, 60); ctx.moveTo(60, -60); ctx.lineTo(-60, 60); ctx.stroke();
  ctx.restore();
}
function greenCheck(ctx, x, y, s, p) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * easeBack(p), s * easeBack(p));
  ctx.strokeStyle = '#27c46b'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-15, 45); ctx.lineTo(65, -50); ctx.stroke();
  ctx.restore();
}
