const SHORT = { title: 'quake test', duration: 8, fps: 30, sfx: [], music: null };
const QUAKE = { splitAt: 0.8, splitDur: 3.2, gap: 700, eruptAt: 2.2,
  path: [[0, [1500, 380, 260], [-400, 20, 0]], [3, [1500, 700, 900], [-200, -120, 0]], [7.6, [700, 1600, 2300], [-300, 0, -1500]]],
  shake: lt => 6 + 10 * Math.exp(-Math.abs(lt - 1.5)) };
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = grad(ctx, ['#4a2a3a', '#b0503a', '#f0a070']); ctx.fillRect(0, 0, W, H);
  Quake3D.draw(ctx, t, QUAKE);
  post(ctx, { bloom: 0.2 });
}
