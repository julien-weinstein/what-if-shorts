// Channel art in the cinematic style: avatar (800x800) and banner (2560x1440).
//   node engine/brand.js  -> art/avatar.png, art/banner.png
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'style2.js'), 'utf8');

const shared = `
function eyeMark(ctx, x, y, w) {
  const h = w * 0.42;
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = S2.fg; ctx.lineWidth = w * 0.035; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = S2.fg; ctx.beginPath(); ctx.arc(0, 0, w * 0.17, 0, 6.283); ctx.fill();
  ctx.fillStyle = S2.bg; ctx.beginPath(); ctx.arc(0, 0, w * 0.08, 0, 6.283); ctx.fill();
  ctx.fillStyle = S2.red; ctx.beginPath(); ctx.arc(w * 0.04, -w * 0.04, w * 0.022, 0, 6.283); ctx.fill();
  ctx.restore();
}
function texture(ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, '#16161a'); g.addColorStop(1, '#050506');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}`;

const avatar = `
function draw(ctx) {
  texture(ctx, 800, 800);
  eyeMark(ctx, 400, 400, 560);
}`;

const banner = `
function draw(ctx) {
  const BW = 2560, BH = 1440, cx = BW / 2, cy = BH / 2;
  texture(ctx, BW, BH);
  // faint horizon line and grid, documentary feel
  ctx.strokeStyle = 'rgba(236,232,225,0.06)'; ctx.lineWidth = 2;
  for (let x = 0; x < BW; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, BH); ctx.stroke(); }
  for (let y = 0; y < BH; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(BW, y); ctx.stroke(); }
  eyeMark(ctx, cx - 560, cy, 300);
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.font = '900 150px ' + S2.sans; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '-4px';
  ctx.fillStyle = S2.fg; ctx.fillText('WHAT IF,', cx - 340, cy - 10);
  ctx.fillStyle = S2.red; ctx.fillText('THOUGH?', cx - 340, cy + 130);
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
  ctx.fillStyle = S2.red; ctx.fillRect(cx - 340, cy + 165, 6, 34);
  ctx.font = '600 36px ' + S2.mono; ctx.fillStyle = S2.dim;
  ctx.fillText('EARTH-ENDING WHAT-IFS. REAL SCIENCE.', cx - 314, cy + 195);
}`;

(async () => {
  const browser = await chromium.launch();
  fs.mkdirSync('art', { recursive: true });
  for (const [name, code, w, h] of [['avatar', avatar, 800, 800], ['banner', banner, 2560, 1440]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(`<canvas id="c" width="${w}" height="${h}"></canvas><script>const W0=${w};${lib}\n${shared}\n${code}</script>`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => draw(document.getElementById('c').getContext('2d')));
    await page.locator('#c').screenshot({ path: `art/${name}.png` });
    await page.close();
  }
  await browser.close();
  console.log('wrote art/avatar.png, art/banner.png');
})();
