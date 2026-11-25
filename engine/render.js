// Render a short to video frames.
//   node engine/render.js shorts/moon-vanished.js out/moon-vanished      -> silent .mp4 + cues .json
//   node engine/render.js shorts/moon-vanished.js out/preview --stills 2,5,9   -> PNG stills only
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');

const [, , scenePath, outBase, ...rest] = process.argv;
const stillsArg = rest.indexOf('--stills') >= 0 ? rest[rest.indexOf('--stills') + 1] : null;
const FPS = 30;

(async () => {
  const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'style2.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'style3.js'), 'utf8');
  const scene = fs.readFileSync(scenePath, 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(`<html><body style="margin:0;background:#000">
    <canvas id="c" width="1080" height="1920"></canvas>
    <script>${lib}\n${scene}\nwindow.SHORT = SHORT; window.renderAt = t => render(document.getElementById('c').getContext('2d'), t);</script>
    </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const short = await page.evaluate(() => window.SHORT);
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  if (stillsArg) {
    for (const s of stillsArg.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), s);
      await page.locator('#c').screenshot({ path: `${outBase}-${s}s.png` });
    }
    await browser.close();
    return;
  }

  fs.writeFileSync(`${outBase}.cues.json`, JSON.stringify(short, null, 2));
  const frames = Math.round(short.duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg',
    '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '18', `${outBase}.silent.mp4`],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    const b64 = await page.evaluate(t => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).slice(23); }, i / FPS);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) process.stderr.write(`  frame ${i}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  process.stderr.write(`wrote ${outBase}.silent.mp4\n`);
})();
