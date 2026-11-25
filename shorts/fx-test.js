// Engine test card: globe, moon, water wall, collapse, plume, fireballs.
const SHORT = { title: 'fx test', duration: 4, sfx: [], music: null };
function render(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 1) { space(ctx, t); globe(ctx, W / 2, 900, 380, { lon0: -40 + t * 20, lat0: 20, t }); moonFx(ctx, 860, 380, 110, {}); }
  else if (t < 2) {
    ctx.fillStyle = grad(ctx, ['#7fa6d6', '#c9d8ea']); ctx.fillRect(0, 0, W, H);
    dof(ctx, 6, c => { for (let i = 0; i < 6; i++) tower(c, t, 40 + i * 180, 1300, 150, 500 + (i % 3) * 120, { col: '#8a96b0', seed: 30 + i }); });
    for (let i = 0; i < 4; i++) tower(ctx, t, 60 + i * 260, 1500, 200, 700 + (i % 2) * 200, { fall: i === 2 ? 0.4 : 0, crumble: i === 1 ? 0.5 : 0, seed: i });
    dustBurst(ctx, t, 400, 1500, 1.0, { size: 1.4 });
    ctx.fillStyle = '#4a4f5c'; ctx.fillRect(0, 1500, W, H);
    waterWall(ctx, t, 420, 1520, 700, {});
    ship(ctx, 250, 900, 0.9, -0.2);
  } else if (t < 3) {
    ctx.fillStyle = grad(ctx, ['#3a1d1d', '#a2452a', '#f1a15a']); ctx.fillRect(0, 0, W, H);
    plume(ctx, t, 540, 1300, { height: 1100, width: 300, seed: 3 });
    ctx.fillStyle = '#2a1714'; ctx.beginPath(); ctx.moveTo(140, 1500); ctx.lineTo(500, 1260); ctx.lineTo(580, 1260); ctx.lineTo(940, 1500); ctx.fill();
    ctx.fillRect(0, 1500, W, H);
    embers(ctx, t, 540, 1280, {});
    debrisBurst(ctx, t, 540, 1270, 2.0, { col: '#ff7a2a' });
  } else {
    space(ctx, t); globe(ctx, W / 2, 1300, 520, { lon0: 20, lat0: 10, t, sun: [-0.7, -0.2, 0.68] });
    for (let i = 0; i < 5; i++) fireball(ctx, t, 100 + i * 200, -50, 300 + i * 160, 1000, 3.0 + i * 0.1, 1.2);
  }
  post(ctx);
}
