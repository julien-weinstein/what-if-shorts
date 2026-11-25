#!/usr/bin/env python3
"""Build the soundtrack for a short from its cues JSON, then mux it with the video.

    python3 engine/audio.py out/moon-vanished

Reads out/NAME.cues.json and out/NAME.silent.mp4, writes out/NAME.mp4.
All music and sound effects are synthesised here: original audio, no samples,
so nothing can trigger a copyright claim.
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np

SR = 44100
rng = np.random.default_rng(11)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, a=0.005, d=None):
    e = np.ones(n); k = max(1, int(SR * a)); e[:k] = np.linspace(0, 1, k)
    if d: e *= np.exp(-np.arange(n) / (SR * d))
    return e


def sweep(f0, f1, sec, shape="sine"):
    tt = t(sec); f = np.geomspace(f0, f1, len(tt)); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) if shape == "sine" else np.sign(np.sin(ph))


def noise(sec):
    return rng.standard_normal(int(SR * sec))


def lp(x, a):
    # one-pole low-pass, vectorised via cumulative filtering on blocks
    y = np.empty_like(x); acc = 0.0
    for i in range(0, len(x), 4096):
        blk = x[i:i + 4096]; out = np.empty_like(blk)
        for j, v in enumerate(blk):
            acc += a * (v - acc); out[j] = acc
        y[i:i + 4096] = out
    return y


def norm(x, p):
    m = np.max(np.abs(x)) or 1
    return x / m * p


# ---------------------------------------------------------------- sound effects
def sfx(name):
    base, _, arg = name.partition(":")
    sec = float(arg) if arg else None
    if base == "pop":
        return norm(sweep(900, 300, 0.09) * env(int(SR * 0.09), 0.001, 0.03), 0.5)
    if base == "boing":
        tt = t(0.5); f = 220 + 160 * np.sin(2 * np.pi * 9 * tt) * np.exp(-tt * 5)
        return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.003, 0.25), 0.4)
    if base == "riser":
        x = sweep(200, 1600, 0.35) * np.linspace(0.1, 1, int(SR * 0.35))
        return norm(x + lp(noise(0.35), 0.3) * np.linspace(0, 0.6, int(SR * 0.35)), 0.35)
    if base == "poof":
        n = lp(noise(0.7), 0.08) * env(int(SR * 0.7), 0.002, 0.18)
        return norm(n + sweep(300, 60, 0.7) * env(int(SR * 0.7), 0.002, 0.15) * 0.8, 0.9)
    if base == "whoosh":
        n = noise(0.45); e = np.sin(np.linspace(0, np.pi, len(n))) ** 2
        return norm(lp(n, 0.06) * e + lp(n, 0.25) * e * 0.3, 0.45)
    if base == "dim":
        return norm(sweep(700, 120, 1.2) * env(int(SR * 1.2), 0.05, 0.6), 0.3)
    if base == "sparkle":
        out = np.zeros(int(SR * 1.0))
        for i, f in enumerate([1568, 2093, 2637, 3136, 2637, 3520]):
            tone = np.sin(2 * np.pi * f * t(0.4)) * env(int(SR * 0.4), 0.002, 0.12)
            s = int(SR * i * 0.09); out[s:s + len(tone)] += tone[: len(out) - s]
        return norm(out, 0.3)
    if base == "waves":
        n = lp(noise(sec), 0.03); swell = 0.55 + 0.45 * np.sin(2 * np.pi * t(sec) / 2.9)
        fade = np.minimum(1, np.minimum(t(sec) / 0.6, (sec - t(sec)) / 0.8))
        return norm(n * swell * fade, 0.3)
    if base == "shrink":  # slide whistle down
        return norm(sweep(1400, 350, 0.8) * env(int(SR * 0.8), 0.02, 0.6), 0.3)
    if base == "bubbles":
        out = np.zeros(int(SR * sec))
        for _ in range(int(sec * 5)):
            d = 0.06; f0 = rng.uniform(500, 1100)
            b = sweep(f0, f0 * 1.8, d) * env(int(SR * d), 0.002, 0.03)
            s = int(rng.uniform(0, sec - d) * SR); out[s:s + len(b)] += b
        return norm(out, 0.22)
    if base == "huh":  # cartoon question: low note then a rising one
        a = np.sin(2 * np.pi * 330 * t(0.12)) * env(int(SR * 0.12), 0.005, 0.08)
        b = sweep(330, 620, 0.25) * env(int(SR * 0.25), 0.005, 0.2)
        return norm(np.concatenate([a, np.zeros(int(SR * 0.03)), b]), 0.35)
    if base == "wobble":
        tt = t(sec); f = 150 + 40 * np.sin(2 * np.pi * (1.5 + tt) * tt)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
        fade = np.minimum(1, np.minimum(tt / 0.5, (sec - tt) / 0.5))
        return norm(x * fade, 0.25)
    if base == "record":  # record scratch
        tt = t(0.45); f = 600 * (1 + 1.5 * np.sin(2 * np.pi * 7 * tt))
        x = np.sign(np.sin(2 * np.pi * np.cumsum(np.abs(f)) / SR)) * 0.4 + lp(noise(0.45), 0.4)
        return norm(lp(x, 0.35) * env(len(tt), 0.002, 0.2), 0.5)
    if base == "boom":
        x = sweep(120, 35, 1.4) * env(int(SR * 1.4), 0.003, 0.45) + lp(noise(1.4), 0.02) * env(int(SR * 1.4), 0.003, 0.3) * 2
        return norm(x, 0.8)
    if base == "ding":
        tt = t(1.5)
        x = sum(np.sin(2 * np.pi * f * tt) * a for f, a in [(1318, 1), (2637, 0.4), (3951, 0.15)])
        return norm(x * env(len(tt), 0.002, 0.5), 0.4)
    if base == "screech":  # brakes / planetary stop
        tt = t(0.6); f = 2400 - 1200 * tt
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 + 0.5 * np.sin(2 * np.pi * 37 * tt)) + lp(noise(0.6), 0.5) * 0.5
        return norm(x * env(len(tt), 0.01, 0.4), 0.35)
    if base == "braam":  # cinematic low brass hit
        tt = t(2.2)
        x = sum(np.sign(np.sin(2 * np.pi * f * tt * (1 + 0.002 * k))) for k, f in enumerate([55, 55.4, 82.4, 110]))
        return norm(lp(x, 0.05) * env(len(tt), 0.02, 0.9), 0.85)
    if base == "rumble":
        x = lp(lp(noise(sec), 0.01), 0.02)
        fade = np.minimum(1, np.minimum(t(sec) / 0.2, (sec - t(sec)) / 1.0))
        return norm(x * fade, 0.7)
    if base == "wind":
        tt = t(sec); n = noise(sec)
        howl = sum(np.sin(2 * np.pi * (f + 40 * np.sin(2 * np.pi * 0.3 * tt + f)) * tt) for f in (420, 610, 880)) * 0.15
        fade = np.minimum(1, np.minimum(tt / 0.4, (sec - tt) / 0.6))
        return norm((lp(n, 0.12) + howl) * fade, 0.45)
    if base == "bigwave":
        x = lp(noise(2.5), 0.06) * env(int(SR * 2.5), 0.3, 0.9) + sweep(90, 30, 2.5) * env(int(SR * 2.5), 0.05, 0.7)
        return norm(x, 0.9)
    if base == "drain":  # descending gurgle
        tt = t(sec); f = np.geomspace(500, 90, len(tt)) * (1 + 0.15 * np.sin(2 * np.pi * 14 * tt))
        return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, (sec - tt) / 0.6) * np.minimum(1, tt / 0.2), 0.3)
    if base == "sizzle":
        n = lp(noise(sec), 0.7) * (0.6 + 0.4 * (rng.random(int(SR * sec)) > 0.97))
        return norm(n * np.minimum(1, np.minimum(t(sec) / 0.3, (sec - t(sec)) / 0.6)), 0.3)
    if base == "freeze":  # icy shimmer
        out = np.zeros(int(SR * 1.4))
        for i, f in enumerate([2637, 3136, 3951, 4699, 5274]):
            tone = np.sin(2 * np.pi * f * t(0.9)) * env(int(SR * 0.9), 0.003, 0.35)
            st = int(SR * i * 0.07); out[st:st + len(tone)] += tone[: len(out) - st]
        return norm(out + lp(noise(1.4), 0.9) * 0.05, 0.3)
    if base == "zap":
        return norm(sweep(3000, 200, 0.25, "square") * env(int(SR * 0.25), 0.001, 0.1), 0.25)
    if base == "tick":
        out = np.zeros(int(SR * sec)); click = lp(noise(0.02), 0.8) * env(int(SR * 0.02), 0.0005, 0.004)
        k = 0.0; gap = 0.12
        while k < sec - 0.05:
            st = int(k * SR); out[st:st + len(click)] += click; k += gap; gap *= 1.18  # slowing down
        return norm(out, 0.5)
    if base == "crowd":  # panicked crowd murmur
        tt = t(sec); x = np.zeros(len(tt))
        for k in range(14):
            f0 = rng.uniform(180, 420); vib = rng.uniform(3, 7)
            f = f0 * (1 + 0.06 * np.sin(2 * np.pi * vib * tt + k))
            x += np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(0.5, 2) * tt + k)) ** 2
        x = lp(x + lp(noise(sec), 0.2) * 3, 0.12)
        fade = np.minimum(1, np.minimum(tt / 0.6, (sec - tt) / 0.8))
        return norm(x * fade, 0.4)
    if base == "alarmbeep":
        out = np.zeros(int(SR * sec)); k = 0.0
        while k < sec - 0.2:
            b = np.sin(2 * np.pi * 880 * t(0.18)) * env(int(SR * 0.18), 0.003, 0.15)
            st = int(k * SR); out[st:st + len(b)] += b; k += 0.42
        return norm(lp(out, 0.5), 0.3)
    if base == "jet":
        tt = t(sec); x = lp(noise(sec), 0.05) + 0.3 * np.sin(2 * np.pi * 140 * tt) * lp(noise(sec), 0.02)
        fade = np.minimum(1, np.minimum(tt / 1.0, (sec - tt) / 1.0))
        return norm(x * fade, 0.35)
    if base == "dive":  # falling-plane whine
        return norm(sweep(1200, 300, 1.1) * env(int(SR * 1.1), 0.1, 0.9) + lp(noise(1.1), 0.08) * 0.4, 0.4)
    if base == "fire":
        tt = t(sec); x = lp(noise(sec), 0.05) * 0.6
        crack = (rng.random(len(tt)) > 0.9993) * rng.uniform(0.5, 1.0, len(tt))
        x += lp(crack * noise(sec), 0.6) * 8
        fade = np.minimum(1, np.minimum(tt / 0.5, (sec - tt) / 0.7))
        return norm(x * fade, 0.4)
    if base == "howl":
        tt = t(2.2); f = 420 + 160 * np.sin(np.pi * tt / 2.2) - 60 * tt
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.2 * np.sin(4 * np.pi * np.cumsum(f) / SR)
        return norm(x * np.sin(np.pi * tt / 2.2) ** 1.5, 0.3)
    if base == "heartbeat":
        out = np.zeros(int(SR * sec)); k = 0.0; gap = 0.85
        thump = lp(sweep(70, 40, 0.18) * env(int(SR * 0.18), 0.003, 0.06), 0.3)
        while k < sec - 0.4:
            for off, g in ((0, 1.0), (0.22, 0.7)):
                st = int((k + off) * SR); out[st:st + len(thump)] += thump[: len(out) - st] * g
            k += gap; gap *= 1.12                          # slowing as they fall asleep
        return norm(out, 0.8)
    if base == "glitchfx":
        x = np.sign(np.sin(2 * np.pi * rng.uniform(200, 900) * t(0.16))) * (rng.random(int(SR * 0.16)) > 0.5)
        return norm(lp(x + noise(0.16) * 0.5, 0.6) * env(int(SR * 0.16), 0.001, 0.08), 0.3)
    if base == "skid":
        tt = t(0.9); f = 900 + 120 * np.sin(2 * np.pi * 23 * tt)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + lp(noise(0.9), 0.4)
        return norm(x * env(len(tt), 0.05, 0.6), 0.35)
    if base == "crash":
        x = lp(noise(1.2), 0.5) * env(int(SR * 1.2), 0.001, 0.25) + sweep(140, 40, 1.2) * env(int(SR * 1.2), 0.001, 0.2)
        clat = np.zeros(int(SR * 1.2))
        for _ in range(12):
            st = int(rng.uniform(0.05, 0.9) * SR); b = np.sin(2 * np.pi * rng.uniform(1500, 4000) * t(0.05)) * env(int(SR * 0.05), 0.001, 0.015)
            clat[st:st + len(b)] += b * 0.4
        return norm(x + clat, 0.75)
    if base == "horn":  # stuck car horn
        tt = t(sec); x = sum(np.sign(np.sin(2 * np.pi * f * tt)) for f in (415, 523))
        fade = np.minimum(1, np.minimum(tt / 0.02, (sec - tt) / 0.3))
        return norm(lp(x, 0.2) * fade, 0.22)
    if base == "underwater":
        tt = t(sec); x = lp(lp(noise(sec), 0.01), 0.03) + 0.4 * np.sin(2 * np.pi * 55 * tt)
        fade = np.minimum(1, np.minimum(tt / 0.4, (sec - tt) / 0.6))
        return norm(x * fade, 0.45)
    if base == "ecg":  # monitor beeps that turn into a fast alarm
        out = np.zeros(int(SR * sec)); k = 0.0
        while k < sec - 0.2:
            fast = k > sec * 0.45
            b = np.sin(2 * np.pi * (960 if fast else 880) * t(0.1)) * env(int(SR * 0.1), 0.002, 0.06)
            st = int(k * SR); out[st:st + len(b)] += b; k += 0.22 if fast else 0.8
        return norm(out, 0.25)
    if base == "tickmark":
        return norm(sweep(1200, 1800, 0.07) * env(int(SR * 0.07), 0.001, 0.03) + np.sin(2 * np.pi * 2400 * t(0.07)) * env(int(SR * 0.07), 0.001, 0.02), 0.25)
    if base == "gasp":  # sharp inhale
        n = lp(noise(0.5), 0.25) * np.linspace(0.2, 1, int(SR * 0.5)) ** 2
        return norm(n * env(int(SR * 0.5), 0.2, None), 0.35)
    if base == "siren":
        tt = t(sec); f = 760 + 200 * np.sin(2 * np.pi * 0.35 * tt)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
        fade = np.minimum(1, np.minimum(tt / 1.0, (sec - tt) / 1.0))
        return norm(lp(x, 0.3) * fade, 0.18)
    if base == "busy":  # phone busy tone
        tt = t(sec); x = (np.sin(2 * np.pi * 480 * tt) + np.sin(2 * np.pi * 620 * tt)) * ((tt % 1.0) < 0.5)
        return norm(lp(x, 0.4), 0.2)
    if base == "apalarm":  # generic cockpit warning warble (not any manufacturer's actual alarm)
        out = []
        for _ in range(3):
            for f in (1050, 1400):
                out.append(np.sin(2 * np.pi * f * t(0.12)) * env(int(SR * 0.12), 0.003, None))
            out.append(np.zeros(int(SR * 0.08)))
        return norm(np.concatenate(out), 0.28)
    raise ValueError(f"unknown sound {name}")


# ---------------------------------------------------------------- music
def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def room(x, mix=0.28):
    """Cheap reverb: a few decaying echoes, low-passed, blended under the dry signal."""
    wet = np.zeros(len(x) + int(SR * 1.2))
    for d, g in [(0.071, 0.5), (0.113, 0.42), (0.173, 0.33), (0.241, 0.25), (0.337, 0.18), (0.461, 0.12)]:
        k = int(SR * d); wet[k:k + len(x)] += x * g
    wet = lp(wet, 0.18)[: len(x)]
    return x * (1 - mix) + wet * mix


def warm(freq, sec, decay=0.4, attack=0.01):
    """Rounded bass/keys tone: sine plus soft 2nd and 3rd harmonics."""
    tt = t(sec)
    x = np.sin(2 * np.pi * freq * tt) + 0.25 * np.sin(4 * np.pi * freq * tt) + 0.08 * np.sin(6 * np.pi * freq * tt)
    return x * env(len(tt), attack, decay)


def bell(freq, sec=1.2):
    tt = t(sec)
    return (np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(2 * np.pi * freq * 2.01 * tt)) * env(len(tt), 0.003, 0.35)


def pad(freqs, sec):
    """Soft, slowly breathing chord: detuned sines with a slow swell."""
    tt = t(sec)
    x = sum(np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.004 * tt) for f in freqs) / (2 * len(freqs))
    swell = np.minimum(1, np.minimum(tt / 0.9, (sec - tt) / 0.9))
    return x * swell


def music_dark(dur, bpm):
    """Original tense-but-smooth loop: rounded pulsing bass, soft kick, warm pads, sparse bells."""
    beat = 60 / bpm
    out = np.zeros(int(SR * (dur + 3)))
    def put(x, at, gain):
        st = int(at * SR)
        if st >= len(out): return
        out[st:st + len(x)] += x[: len(out) - st] * gain
    kick = sweep(95, 40, 0.4) * env(int(SR * 0.4), 0.002, 0.14)
    shaker = lp(noise(0.06), 0.35) * env(int(SR * 0.06), 0.004, 0.02)
    roots = [45, 41, 43, 40]                          # Am F G Em
    chords = {45: (57, 60, 64), 41: (53, 57, 60), 43: (55, 59, 62), 40: (52, 55, 59)}
    bars = int(dur / (4 * beat)) + 1
    for b in range(bars):
        root = roots[b % 4]; t0 = b * 4 * beat
        put(kick, t0, 0.5); put(kick, t0 + 2 * beat, 0.35)
        for k in range(8):
            put(shaker, t0 + k * beat / 2 + beat / 4, 0.05)
            put(warm(hz(root - 12), beat * 0.45, 0.18), t0 + k * beat / 2, 0.30 if k % 2 == 0 else 0.18)
        put(pad([hz(n) for n in chords[root]], 4 * beat), t0, 0.16)
        if b % 2 == 1 and b >= 2:                     # sparse bell motif every other bar
            for k, iv in enumerate([12, 7, 3, 7]):
                put(bell(hz(root + 12 + iv)), t0 + k * beat, 0.06)
    x = room(out[: int(SR * dur)])
    return lp(x, 0.35)                                # take the fizz off the top


def music(dur, bpm):
    """Original upbeat loop: soft kick, light shaker, rounded bass, mellow keys riff."""
    beat = 60 / bpm
    out = np.zeros(int(SR * (dur + 2)))
    def put(x, at, gain):
        st = int(at * SR)
        if st >= len(out): return
        out[st:st + len(x)] += x[: len(out) - st] * gain
    kick = sweep(110, 45, 0.3) * env(int(SR * 0.3), 0.002, 0.1)
    shaker = lp(noise(0.05), 0.35) * env(int(SR * 0.05), 0.003, 0.015)
    roots = [48, 43, 45, 41]                          # C G Am F
    riff = [0, 7, 12, 7, 16, 12, 7, 12]
    bars = int(dur / (4 * beat)) + 1
    for b in range(bars):
        root = roots[b % 4]; t0 = b * 4 * beat; minor = root == 45
        for k in range(4):
            put(kick, t0 + k * beat, 0.45)
        for k in range(8):
            put(shaker, t0 + k * beat / 2 + beat / 4, 0.06)
            put(warm(hz(root - 12), beat * 0.45, 0.2), t0 + k * beat / 2, 0.28)
            iv = riff[k] + (-1 if minor and riff[k] == 16 else 0)
            if b >= 1: put(warm(hz(root + 12 + iv), beat * 0.45, 0.15, 0.004), t0 + k * beat / 2, 0.10)
    return lp(room(out[: int(SR * dur)]), 0.4)


def main():
    base = Path(sys.argv[1])
    cues = json.loads(base.with_suffix(".cues.json").read_text())
    dur = cues["duration"]
    mix = np.zeros(int(SR * (dur + 0.5)))
    m = cues.get("music", {})
    if m:
        maker = music_dark if m.get("mode") == "dark" else music
        mu = maker(m.get("until", dur), m.get("bpm", 112))
        gain = np.full(len(mu), 0.34)  # music sits under the SFX
        for a, b in m.get("duckAt", []):  # drop the music out for a beat, for emphasis
            ia, ib = int(a * SR), int(b * SR); gain[ia:ib] = 0.05
        fade = int(SR * 1.2); gain[-fade:] *= np.linspace(1, 0, fade)
        mix[: len(mu)] += mu * lp(gain, 0.002)
    for at, name in cues["sfx"]:
        x = sfx(name); s = int(at * SR)
        mix[s:s + len(x)] += x[: len(mix) - s]
    mix = norm(mix, 0.95)
    raw = base.with_suffix(".f32")
    mix.astype(np.float32).tofile(raw)
    out = base.parent / f"{base.name}.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{base}.silent.mp4",
                    "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(raw),
                    "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-ar", "48000", "-shortest", str(out)], check=True)
    raw.unlink()
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
