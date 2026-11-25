// Channel art: avatar (800x800) and banner (2560x1440, logo inside the 1546x423 safe area).
//   node engine/brand.js  -> art/avatar.png, art/banner.png
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8');

const avatar = `
function draw(ctx) {
  const S = 800;
  const g = ctx.createRadialGradient(S/2, S/2, 50, S/2, S/2, S*0.7);
  g.addColorStop(0, '#26305e'); g.addColorStop(1, '#0b0f1e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  const r = rng(4); ctx.fillStyle = '#fff';
  for (let i = 0; i < 70; i++) { ctx.globalAlpha = 0.4 + r() * 0.6; ctx.beginPath(); ctx.arc(r() * S, r() * S, 1 + r() * 3, 0, 6.283); ctx.fill(); }
  ctx.globalAlpha = 1;
  blip(ctx, 0.3, 400, 480, 'shock', 2.1, 0);
}`;

const banner = `
function draw(ctx) {
  const BW = 2560, BH = 1440;
  const g = ctx.createLinearGradient(0, 0, 0, BH);
  g.addColorStop(0, '#070a1c'); g.addColorStop(1, '#1d1240');
  ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH);
  const r = rng(9); ctx.fillStyle = '#fff';
  for (let i = 0; i < 420; i++) { ctx.globalAlpha = 0.3 + r() * 0.7; ctx.beginPath(); ctx.arc(r() * BW, r() * BH, 1 + r() * 3.2, 0, 6.283); ctx.fill(); }
  ctx.globalAlpha = 1;
  // burning Earth on the right, frozen Moon on the left (outside the phone-safe strip)
  earth(ctx, 2330, 720, 260, 1.2);
  const fire = ctx.createRadialGradient(2330, 720, 240, 2330, 720, 380);
  fire.addColorStop(0, 'rgba(255,90,0,0.55)'); fire.addColorStop(1, 'rgba(255,90,0,0)');
  ctx.fillStyle = fire; ctx.beginPath(); ctx.arc(2330, 720, 380, 0, 6.283); ctx.fill();
  moon(ctx, 330, 720, 150);
  // safe area: 1546 x 423 centred
  const cx = BW / 2, cy = BH / 2;
  blip(ctx, 0.3, cx - 540, cy + 50, 'shock', 1.1, 0);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.font = '900 150px ' + FONT;
  const x0 = cx - 380;
  ctx.lineWidth = 30; ctx.strokeStyle = C.ink;
  ctx.strokeText('WHAT IF,', x0, cy - 70); ctx.fillStyle = C.paper; ctx.fillText('WHAT IF,', x0, cy - 70);
  ctx.strokeText('THOUGH?', x0, cy + 70); ctx.fillStyle = C.yellow; ctx.fillText('THOUGH?', x0, cy + 70);
  ctx.font = '800 42px ' + FONT; ctx.fillStyle = '#cfd3ff'; ctx.textAlign = 'center';
  ctx.fillText('Earth-ending what-ifs. Real science.', cx, cy + 172);
}`;

(async () => {
  const browser = await chromium.launch();
  fs.mkdirSync('art', { recursive: true });
  for (const [name, code, w, h] of [['avatar', avatar, 800, 800], ['banner', banner, 2560, 1440]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(`<canvas id="c" width="${w}" height="${h}"></canvas><script>${lib}\n${code}\ndraw(document.getElementById('c').getContext('2d'));</script>`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(code => { /* redraw once fonts are ready */ draw(document.getElementById('c').getContext('2d')); }, null);
    await page.locator('#c').screenshot({ path: `art/${name}.png` });
    await page.close();
  }
  await browser.close();
  console.log('wrote art/avatar.png, art/banner.png');
})();
