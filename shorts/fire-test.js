const SHORT = { title: 'fire test', duration: 8, fps: 30, sfx: [], music: null };
const FIRE = { height: 360, z0: 1500, z1: -1800, dur: 8,
  path: [[0, [500, 650, -2100], [0, 160, 900]], [2.6, [1300, 450, -1250], [-100, 170, 200]], [5.2, [1400, 700, -2500], [-300, 150, -700]], [8, [650, 1500, -3400], [0, 20, -1300]]], shake: lt => 5 };
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = grad(ctx, ['#2a0f12', '#a8331c', '#ff9a4a']); ctx.fillRect(0, 0, W, H);
  FireCity3D.draw(ctx, t, FIRE);
  post(ctx, { bloom: 0.3 });
}
