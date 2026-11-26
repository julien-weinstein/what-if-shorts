# Working on "What If, Though?" shorts

Read this first. It records what the channel owner has asked for across many rounds of feedback.

## Workflow
- One short = one file in `shorts/NAME.js`: a `SCENES` list of `[name, seconds, [[localTime, 'sfx'], ...]]`, one `vScene(ctx, u)` function per scene (u = local time), then the shared kit appended at the end (people/scrim/mixHex helpers plus crowds, skylines, globe projection, CITIES, bigNum, bgSky). Copy the kit from an existing short such as `shorts/pennies.js`.
- Preview stills: `node engine/render.js shorts/NAME.js out/preview/X --stills 2,6,10` (make a contact sheet with PIL and look at it).
- Full render: `node engine/render.js shorts/NAME.js out/NAME && python3 engine/audio.py out/NAME && ffmpeg -i out/NAME.mp4 -c:v libx264 -crf 20 -preset slow -c:a copy -movflags +faststart videos/NAME.mp4` (run in the background).
- Check duration and audio peak (`astats`; it should be about -2 dB, with no clipping).
- **Send the finished MP4 straight into the chat** with SendUserFile. Don't send links, and don't update the `videos` branch unless asked.
- Commit the script plus the `UPLOADS.md` copy to `main` with the attribution trailer. Archive old versions in `archive/NAME-vN.js` when rebuilding.
- Scene functions get `Math.max(0, localTime)`. Guard anything that can go negative (radii, modulo) to avoid render crashes.

## Content rules
- **Accuracy first.** Real physics and biology, numbers worked out in the script header, sources noted. Hedge estimates on screen with "(est.)". Never invent facts.
- **Human toll and destruction at scale.** Don't shy from death (death tolls as estimates), but use no gore. Balance small-scale human and species consequences with planet-scale ones.
- **Arc:** hook → escalation → strong final image. **No forced plot twists**, and no "it already happened" tags unless asked.
- **Pacing:** about 4–5 s per scene so captions can be read. Total length is about 50–65 s.
- **Variety:** every scene needs a different perspective or setting (cockpit POV, microscope, thermal view, cross-section, aerial, ground level, maps only sparingly). Avoid repeating the same close-up explosion. The owner loves "Michael Bay" action.
- **Tone:** cartoony but not childish. Faceless figures (`person2`), bright palettes (avoid black and red), and Blip the mascot only in the opening.
- **Politics:** stick to facts and hedge them. If the owner asks for a lean, keep every claim documented. Use caricature figures, never likenesses.
- **History counterfactuals:** a persistent "✓ REAL HISTORY" / "⚠ WHAT IF" badge, a red frame during the counterfactual, and an explicit "history splits here" fork beat.
- **Safety:** never strobe (keep pulses under 2 Hz with low contrast, and label them). Show no Nazi insignia and give no weapon how-to. Keep pathogen material at outbreak level only.
- **Sound:** cinematic only (impact, boom, rumble, roar, swell, air, heart, drawback, kick). Avoid tonal bleeps and the clicky `crumble`/`quake` effects. The master is limited to prevent crackle.
