// test card for the 3D drone shot
const SHORT = { title: 'drone test', duration: 10, fps: 30, sfx: [], music: null };
const DRONE = { height: 320, z0: 1500, z1: -1800, dur: 10,
  path: [[0, [500, 650, -2100], [0, 160, 900]], [3.2, [1300, 450, -1250], [-100, 170, 200]], [6.5, [1400, 700, -2500], [-300, 150, -700]], [10, [650, 1500, -3400], [0, 20, -1300]]],
  shake: lt => 3 };
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = grad(ctx, ['#5a8fe0', '#a9cdf5', '#ffe0b8']); ctx.fillRect(0, 0, W, H);
  moonToon(ctx, 760, 420, 230, { sun: [0.3, -0.4, 0.86] });
  City3D.draw(ctx, t, DRONE);
  post(ctx, { bloom: 0.12 });
}
