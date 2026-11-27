// Render a short to video.
//   node engine/render.js shorts/x.js out/x                  -> out/x.silent.mp4 + out/x.cues.json
//   node engine/render.js shorts/x.js out/preview/x --stills 2,5,9    -> PNG stills
// SHORT may set: fps (default 30), motionSamples (sub-frame samples for motion blur, default 1).
// Frames are rendered in parallel across several browser pages, then joined.
const fs = require('fs'), path = require('path'), os = require('os'), { spawn, execFileSync } = require('child_process');
const { chromium } = require('playwright');

const [, , scenePath, outBase, ...rest] = process.argv;
const stillsArg = rest.indexOf('--stills') >= 0 ? rest[rest.indexOf('--stills') + 1] : null;
const ENGINE = ['vendor/three.iife.js', 'lib.js', 'style2.js', 'style3.js', 'style4.js', 'data/land.js', 'data/elev.js', 'fx.js', 'city3d.js'];

async function openPage(browser, lib, scene) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(`<html><body style="margin:0;background:#000">
    <canvas id="c" width="1080" height="1920"></canvas><canvas id="acc" width="1080" height="1920" style="display:none"></canvas>
    <script>${lib}\n${scene}
    window.SHORT = SHORT;
    window.renderAt = t => render(document.getElementById('c').getContext('2d'), t);
    // Motion blur: average n sub-frame samples spread over the shutter interval.
    window.renderMB = (t, n, dt) => {
      const c = document.getElementById('c'), acc = document.getElementById('acc'), a = acc.getContext('2d');
      if (n <= 1) { window.renderAt(t); return; }
      for (let k = 0; k < n; k++) {
        const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        window.renderAt(t - dt * (0.5 - (k + 0.5) / n));
        a.globalAlpha = 1 / (k + 1); a.drawImage(c, 0, 0);
      }
      const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(acc, 0, 0);
    };
    </script></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

(async () => {
  const lib = ENGINE.map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n');
  const scene = fs.readFileSync(scenePath, 'utf8');
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  if (stillsArg) {
    const page = await openPage(browser, lib, scene);
    for (const s of stillsArg.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), s);
      await page.locator('#c').screenshot({ path: `${outBase}-${s}s.png` });
    }
    await browser.close();
    return;
  }

  const probe = await openPage(browser, lib, scene);
  const short = await probe.evaluate(() => window.SHORT);
  await probe.close();
  const FPS = short.fps || 30, MB = short.motionSamples || 1;
  fs.writeFileSync(`${outBase}.cues.json`, JSON.stringify(short, null, 2));
  const frames = Math.round(short.duration * FPS);
  const workers = Math.max(1, Math.min(4, os.cpus().length - 1));
  const per = Math.ceil(frames / workers);
  let done = 0;
  const parts = await Promise.all([...Array(workers).keys()].map(async w => {
    const page = await openPage(browser, lib, scene);
    const part = `${outBase}.part${w}.mp4`;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg',
      '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '14', part], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = w * per; i < Math.min(frames, (w + 1) * per); i++) {
      const b64 = await page.evaluate(([t, n, dt]) => { window.renderMB(t, n, dt); return document.getElementById('c').toDataURL('image/jpeg', 0.985).slice(23); }, [i / FPS, MB, 0.5 / FPS]);
      if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 300 === 0) process.stderr.write(`  ${done}/${frames} frames\n`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    await page.close();
    return part;
  }));
  await browser.close();
  const list = `${outBase}.parts.txt`;
  fs.writeFileSync(list, parts.map(p => `file '${path.resolve(p)}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', `${outBase}.silent.mp4`]);
  parts.forEach(p => fs.unlinkSync(p)); fs.unlinkSync(list);
  process.stderr.write(`wrote ${outBase}.silent.mp4 (${frames} frames @ ${FPS}fps, ${MB}x motion samples)\n`);
})();
