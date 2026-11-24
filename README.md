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

## Topic backlog

**The rules:** a premise few people have animated, and the consequences for *people* come first. That means what happens in the first seconds, hours and days: planes, hospitals, cities, death tolls. Planet-scale effects come after that, and every short ends on a true twist. The classics (the Sun or Moon vanishing, Earth stopping spinning) are already overdone, so the short in that style is the only one we keep.

| Scenario | Immediate human consequences | Twist (true) |
|---|---|---|
| ✅ Every human teleported into one city | Crowd-crush density, pilotless planes, burning cities, no water, unattended reactors | Wolves took over Chernobyl |
| Everyone on Earth falls asleep for one hour | Cars and trains crash, surgeries stop mid-cut, ships run aground, stoves start fires; autopilot can't land most planes | Some planes *can* land themselves, but only at airports with special equipment |
| Every satellite falls out of the sky | GPS gone; card payments, power grids and phone networks lose their clocks; militaries go blind and panic; the space-station crew is stranded | GPS is also the clock that time-stamps the world's bank transactions |
| Every dam on Earth breaks at once | Walls of water through valleys, megacities flooded, power gone | Three Gorges holds enough water to measurably slow Earth's rotation |
| All bacteria vanish | Digestion fails, cows starve (they can't digest grass without microbes), crops collapse, the dead stop rotting | Your body has about as many bacterial cells as human ones |
| Oxygen drops to half for one minute | The whole planet is suddenly at Everest altitude: pilots black out, people collapse, fires go out | Some sherpas' blood is adapted to this |
| Every concrete structure turns to dust | Buildings, bridges, highways and dams collapse at once | Concrete is the most-used material on Earth after water |
| Every ant on Earth attacks at once | About 20 quadrillion ants versus 8 billion humans | Ants together outweigh all wild birds and mammals combined |
| Everyone forgets how to read overnight | No signs, no medicine labels, no cockpit displays, no code | Writing is only about 5,000 years old |
| Every undersea internet cable is cut at once | Banks, trade and cloud services across continents go dark; GPS is no backup | Satellites carry only a tiny share of intercontinental data |
| A solar storm like the one in 1859 hits tomorrow | Grids burn out for months: no water pumps, no hospitals, no refrigeration | One just missed us in July 2012 |
| The world's population doubles overnight | Food is gone in days, hospitals overflow, cities burst | Earth's population has doubled since the 1970s |

Check every figure before it goes into a script. A few in this table are drafts.
