// Channel art in the cinematic style: avatar (800x800) and banner (2560x1440).
//   node engine/brand.js  -> art/avatar.png, art/banner.png
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'style2.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'style3.js'), 'utf8');

const shared = `
function eyeMark(ctx, x, y, w) {
  const h = w * 0.42;
  const almond = () => { ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, -h * 1.6, w / 2, 0); ctx.quadraticCurveTo(0, h * 1.6, -w / 2, 0); ctx.closePath(); };
  ctx.save(); ctx.translate(x, y);
  ctx.shadowColor = 'rgba(27,22,64,0.35)'; ctx.shadowBlur = w * 0.08; ctx.shadowOffsetY = w * 0.03;
  almond(); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  const ig = ctx.createRadialGradient(-w * 0.04, -w * 0.04, 2, 0, 0, w * 0.2);
  ig.addColorStop(0, P.peach); ig.addColorStop(1, P.coral);
  ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(0, 0, w * 0.19, 0, 6.283); ctx.fill();
  ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, 0, w * 0.085, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w * 0.05, -w * 0.05, w * 0.03, 0, 6.283); ctx.fill();
  ctx.restore();
}
function backdrop(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#5a3fe0'); g.addColorStop(0.5, '#c25bc4'); g.addColorStop(1, '#ff7a5c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const r = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.5);
  r.addColorStop(0, 'rgba(255,255,255,0.22)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
}`;

const avatar = `
function draw(ctx) { backdrop(ctx, 800, 800); eyeMark(ctx, 400, 400, 600); }`;

const banner = `
function draw(ctx) {
  const BW = 2560, BH = 1440, cx = BW / 2, cy = BH / 2;
  backdrop(ctx, BW, BH);
  for (let k = 0; k < 4; k++) { ctx.strokeStyle = 'rgba(255,255,255,' + (0.14 - k * 0.03) + ')'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx - 560, cy, 230 + k * 120, 0, 6.283); ctx.stroke(); }
  eyeMark(ctx, cx - 560, cy, 300);
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(27,22,64,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8;
  ctx.font = '900 150px ' + P.sans; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '-4px';
  ctx.fillStyle = '#fff'; ctx.fillText('WHAT IF,', cx - 340, cy - 10);
  ctx.fillStyle = P.gold; ctx.fillText('THOUGH?', cx - 340, cy + 130);
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
  ctx.shadowColor = 'transparent';
  ctx.font = '700 34px ' + P.mono; const tag = 'EARTH-ENDING WHAT-IFS. REAL SCIENCE.';
  const tw = ctx.measureText(tag).width + 50;
  ctx.fillStyle = 'rgba(27,22,64,0.3)'; roundRect(ctx, cx - 340, cy + 160, tw, 56, 28); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(tag, cx - 315, cy + 190);
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
