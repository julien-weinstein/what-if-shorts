# What If, Though?

Animated vertical shorts (YouTube Shorts, TikTok, Reels) about hypothetical scenarios, with no voiceover. Each short is carried by bold on-screen captions, a "time later" timeline, sound effects, an original music loop, and Blip, the channel's mascot, who reacts to each twist.

Every short is code. The animation is drawn on an HTML canvas, rendered frame by frame to 1080×1920 at 30fps, and scored with synthesised music and effects. Nothing is licensed, so there are no copyright claims and each short costs nothing to make.

## Make a short

```bash
node engine/render.js shorts/moon-vanished.js out/moon-vanished           # video (about 30 s)
python3 engine/audio.py out/moon-vanished                                  # sound + mux -> out/moon-vanished.mp4
node engine/render.js shorts/moon-vanished.js out/preview/moon --stills 2,9,14   # quick PNG stills
```

A short is one file in `shorts/`. It holds a `SHORT` object (title, duration, sound cues with timestamps, music settings) and a `render(ctx, t)` function built from the drawing kit in `engine/lib.js`: `earth`, `moon`, `space`, `caption`, `chip`, `blip`, `wipe` and the rest.

## The format

1. **Hook, 0 to 3 seconds.** The question in huge text ("WHAT IF THE MOON JUST… VANISHED?") over a striking image.
2. **The event,** with a big visual and sound moment.
3. **The timeline.** Chips like "0 SECONDS LATER", "6 HOURS LATER" and "MILLIONS OF YEARS LATER", with one consequence per beat, each with its own scene.
4. **The twist.** A true fact that flips the premise ("The Moon is ALREADY leaving").
5. **End card,** built to loop back into the start.

Shorts run 30 to 45 seconds. Every claim has to be real science or real history, because the comments will check.

## House style (settled)

**Look:** the original planetary illustration (`lib.js`: space, Earth, Moon, skylines, waves, flames) with depth from `style3.js` (`glow`, `grad`, `drift`, whip-pan `sequence`).

**Captions:** `say()` from `style3.js`, which slides lines up in clean white type with an occasional highlighter band on the key phrase.

**Never:**
- the mascot anywhere except the opening (Blip appears in the first few seconds of every short, reacting to the hook, then exits)
- emoji, toilet humour or cartoon gags
- bouncy word pops
- time-stamp chips ("0 SECONDS LATER") or minute-by-minute timelines

A small "WHAT IF, THOUGH?" watermark sits bottom-left.

**Story:** every short is an arc with a direction and an endpoint, not a list of facts. It starts with a hook or a calm before the storm, then escalates through human consequences, turns ("but here's the thing…"), and ends on a final image. Give consequences as human cost (deaths, famine, cities lost) with a sourced, hedged number, never neutral demographics like "40% live near coasts". Keep broad strokes at planetary scale. Each beat is a system-level change (oceans, crust, sky, climate, orbits, civilisation) with one jaw-dropping true number. Physics and biology must check out (show the working in the script header), and the ending is a true twist that escalates the premise.

The retired experiments are kept for reference: `style2.js` (dark), `style4.js` (cartoon people and kinetic captions), and the shorts in `archive/`.

## FX engine (v5)

`engine/fx.js` and `engine/data/land.js` (Natural Earth 1:110m coastlines, public domain).

- **`globe()`:** an orthographic Earth with the real continents clipped properly at the horizon, plus per-pixel biomes (forest, desert, ice), animated noise clouds, a day/night terminator, city lights on the night side, a specular ocean glint and an atmosphere halo.
- **`moonFx()`:** a shaded Moon with maria, rimmed craters, and an optional `crack` glow for break-up.
- **Destruction:** `waterWall()` (a wall of water with foam and spray), `tower()` (topple and crumble), `dustBurst()`, `plume()` (a billowing smoke or ash column), `debrisBurst()` (ballistic chunks), `embers()`, `fireball()`, `shockwave()` and `ship()`.
- **Noise:** `noise3()` and `fbm()` (improved Perlin), for anything organic.
- **Camera and post:** `dof(px, fn)` blurs background layers for depth of field. `post()` runs at the end of every frame and adds bloom, contrast and saturation grading, and a vignette.
- **Renderer:** set `SHORT.fps = 60` and `SHORT.motionSamples = 2` for 60fps with motion blur. Frames render in parallel on several browser pages and are joined at the end. A 48-second short takes about 9 minutes on 4 cores.
- **Test card:** `shorts/fx-test.js` exercises the whole kit.

## FX v6: impact and lighting kit (`fx.js`)

- **`punch(ctx, t, hits)`:** a camera zoom-pulse on impacts. `hitAmount()` gives the impact strength, which drives `post({ chromaPx })` for a brief RGB-split colour fringe.
- **`lensFlare()`:** an anamorphic streak, starburst and ghosts. **`godRays()`:** volumetric light shafts.
- **`debrisPhys()`:** simulated chunks with gravity, drag and bounces on a ground line. **`spray()`:** streaking water droplets.
- **`silhouette()`:** faceless human figures (standing, reading, pointing). **`hand()`:** a hand held up at arm's length, for scale moments.
- **Slow motion:** remap time inside a scene for climaxes (see `sBreak` in `moon-closer.js`).

**Hook formula:** open with the viewer's own experience ("Here's what your life would look like", "Hold out your hand"). Give one relatable fact before the planetary escalation (the ground under you already rises 30 cm a day), and keep a counter or a number on screen at every big beat.

## v7: illustrated 3D (the current look) and cinematic sound

**Visual:** the original illustrated style (clean shapes, bold colour, ink outlines, Blip in the opening) with real 3D depth, from `fx.js`:
- `globe(..., { toon: true })`: a cel-shaded stylized Earth with the real continents and an ink outline.
- `moonToon()`: a cel-shaded Moon.
- `block3d()`: 3D buildings with a lit front, shaded side and roof, which topple and crumble.
- `toonWave()`: an illustrated wall of water with a foam crest.
- `toonPlume()` and `volcano3d()`: a stylized eruption column and a shaded volcano.

Don't use lens flares, colour fringing, HUD counters, hand or "your life" gimmicks, or photoreal textures in the house style.

**Sound:** no tonal blips (pop, boing, sparkle, ding, zap, tick, huh, riser). Use the cinematic palette in `audio.py`: `impact`, `quake`, `roar`, `crumble`, `drawback`, `swell`, `air`, plus `rumble` and `boom`. For music, use `mode: 'cinematic'`: slow string-like pads, low drones and sparse deep drums.

**Story:** lead with the immediate, planet-wide destruction the premise causes, with human cost in sourced numbers.

## v8: real 3D shots (Three.js / WebGL)

`engine/city3d.js` renders a true 3D, cel-shaded scene into the 2D frame with `City3D.draw(ctx, localTime, opts)`. It's currently a drone flyover of a giant surge destroying a city:
- **City:** about 500 instanced towers whose lit windows are generated in a shader in world space and fade with distance, on a street-grid ground plane.
- **Lighting:** a low sun with soft shadows, plus atmospheric fog.
- **The surge:** a curling extruded wave with a height gradient, a churning foam crest of instanced blobs, a rolling flood surface behind it, mist particles, and tumbling debris.
- **Destruction:** each tower is struck when the front reaches it, then topples inland and sinks.
- **Camera:** keyframed drone path `[[time, position, lookAt], ...]` with eased interpolation and an optional shake.

Three.js is bundled once into `engine/vendor/three.iife.js`. To rebuild it: `npm install`, then `npx esbuild node_modules/three/build/three.module.js --bundle --format=iife --global-name=THREE --minify --outfile=engine/vendor/three.iife.js`. The renderer launches Chromium with SwiftShader WebGL, which works headless with no GPU.

**Long shorts:** reuse scenes at new times with `shifted(sceneFn, originalStart, newStart)`. Show societal tolls with `statRow()`: a big outlined number with one line of sourced context.

## Plot-hole check (required before animating)

Every script starts with a comment block listing the obvious objections ("wouldn't they just leave?", "wouldn't autopilot handle it?") and how the short deals with each. Where an objection is a common one, answer it on screen with a "What doesn't break" beat, which makes the short more credible. If an objection breaks the premise, change the premise. For example, the everyone-in-one-city short was pulled because the math says people could walk out of LA within hours.

## Topic backlog

**The rules:** a premise few people have animated, and the consequences for *people* come first. That means what happens in the first seconds, hours and days: planes, hospitals, cities, death tolls. Planet-scale effects come after that, and every short ends on a true twist. The classics (the Sun or Moon vanishing, Earth stopping spinning) are already overdone, so the short in that style is the only one we keep.

| Scenario | Immediate human consequences | Twist (true) |
|---|---|---|
| ~~Every human teleported into one city~~ (pulled: they could walk out within hours) | Crowd-crush density, pilotless planes, burning cities, no water, unattended reactors | Wolves took over Chernobyl |
| ✅ Everyone on Earth falls asleep for one hour | Cars and trains crash, surgeries stop mid-cut, ships run aground, stoves start fires; autopilot can't land most planes | Some planes *can* land themselves, but only at airports with special equipment |
| Every satellite falls out of the sky | GPS gone; card payments, power grids and phone networks lose their clocks; militaries go blind and panic; the space-station crew is stranded | GPS is also the clock that time-stamps the world's bank transactions |
| Every dam on Earth breaks at once | Walls of water through valleys, megacities flooded, power gone | Three Gorges holds enough water to measurably slow Earth's rotation |
| ✅ All bacteria vanish | Digestion fails, cows starve (they can't digest grass without microbes), crops collapse, the dead stop rotting | Your body has about as many bacterial cells as human ones |
| Oxygen drops to half for one minute | The whole planet is suddenly at Everest altitude: pilots black out, people collapse, fires go out | Some sherpas' blood is adapted to this |
| Every concrete structure turns to dust | Buildings, bridges, highways and dams collapse at once | Concrete is the most-used material on Earth after water |
| Every ant on Earth attacks at once | About 20 quadrillion ants versus 8 billion humans | Ants together outweigh all wild birds and mammals combined |
| Everyone forgets how to read overnight | No signs, no medicine labels, no cockpit displays, no code | Writing is only about 5,000 years old |
| Every undersea internet cable is cut at once | Banks, trade and cloud services across continents go dark; GPS is no backup | Satellites carry only a tiny share of intercontinental data |
| A solar storm like the one in 1859 hits tomorrow | Grids burn out for months: no water pumps, no hospitals, no refrigeration | One just missed us in July 2012 |
| The world's population doubles overnight | Food is gone in days, hospitals overflow, cities burst | Earth's population has doubled since the 1970s |

Check every figure before it goes into a script. A few in this table are drafts.
