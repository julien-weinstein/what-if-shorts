const SHORT = { title: 'impact test', duration: 8, fps: 30, sfx: [], music: null };
const IMPACT = { contact: 2.2, site: [0.55, 0.45, 0.7], from: [1, 0.6, 0.2], approach: 700, meltSpeed: 0.55,
  path: [[0, [0, 40, 560], [30, 20, 0]], [2.2, [80, 60, 470], [40, 30, 0]], [8, [-160, 160, 640], [0, 0, 0]]], shake: lt => (lt > 2.2 ? 6 * Math.exp(-(lt - 2.2) * 1.5) : 0) };
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); space(ctx, t);
  Impact3D.draw(ctx, t, IMPACT);
  post(ctx, { bloom: 0.3 });
}
