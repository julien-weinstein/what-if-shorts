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

## Topic backlog (apocalyptic and extreme)

The channel's lane is planet-scale catastrophe told through real science: the bigger the change to Earth's climate, cycles and life, the better. Every short still ends on a true twist.

| Scenario | The extreme beats | The twist (true) |
|---|---|---|
| ✅ What if Earth stopped spinning? | Supersonic winds, mega-tsunamis, oceans flee to the poles, year-long days | Earth's spin really is slowing |
| ✅ What if the Sun vanished? | 8 minutes of normal life, then darkness, oceans freezing over, life only at deep-sea vents | Earth keeps flying in a straight line, and the vents could keep some life going |
| What if Yellowstone erupted? | Ash across America, a volcanic winter, failed harvests | It's erupted before, about 640,000 years ago |
| What if Earth lost its magnetic field? | Solar wind strips the atmosphere, oceans slowly escape | That's probably what happened to Mars |
| What if a gamma-ray burst hit Earth? | Ozone destroyed in seconds, UV sterilises the surface | One may have helped cause a mass extinction 440 million years ago (a hypothesis) |
| What if all of Antarctica's ice melted? | Seas up about 58 metres, coastal cities gone, the map redrawn | It was ice-free tens of millions of years ago |
| What if the Gulf Stream current collapsed? | Europe freezes, storms intensify, monsoons shift | Some studies suggest it's already weakening |
| What if Earth were 10% closer to the Sun? | Runaway greenhouse, oceans boil, a second Venus | Venus probably once had water |
| What if a rogue black hole passed through the solar system? | Orbits scrambled, Earth flung into deep space | Rogue black holes exist, and we've detected one drifting through the galaxy |
| What if the asteroid had missed the dinosaurs? | No mammal takeover, no humans | Birds are dinosaurs, so they never fully died out |
| What if every volcano erupted at once? | Volcanic winter, acid rain, a mass extinction | The Siberian Traps nearly did this 252 million years ago |
| What if the oceans drained? | Weather stops, the planet bakes, life collapses | About half of Earth's oxygen comes from ocean life |
| What if the Sun became a red giant tomorrow? | Oceans boil away, the Earth may be swallowed | It really will happen, in about 5 billion years |
