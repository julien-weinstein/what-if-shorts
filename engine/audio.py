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
    raise ValueError(f"unknown sound {name}")


# ---------------------------------------------------------------- music
def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def music_dark(dur, bpm):
    """Original tense loop: pulsing minor bass, low drums, a high ostinato and a pad."""
    beat = 60 / bpm
    out = np.zeros(int(SR * (dur + 3)))
    def put(x, at, gain):
        st = int(at * SR)
        if st >= len(out): return
        out[st:st + len(x)] += x[: len(out) - st] * gain
    kick = sweep(120, 38, 0.35) * env(int(SR * 0.35), 0.001, 0.12)
    tom = sweep(180, 80, 0.3) * env(int(SR * 0.3), 0.001, 0.1)
    roots = [45, 41, 43, 40]                          # Am F G Em
    bars = int(dur / (4 * beat)) + 1
    for b in range(bars):
        root = roots[b % 4]; t0 = b * 4 * beat
        put(kick, t0, 0.6); put(kick, t0 + 2.5 * beat, 0.45)
        if b % 2 == 1: put(tom, t0 + 3.5 * beat, 0.35); put(tom, t0 + 3.75 * beat, 0.3)
        for k in range(16):  # sixteenth-note pulsing bass
            tt = t(beat / 4)
            bn = np.sign(np.sin(2 * np.pi * hz(root - 12) * tt)) * env(len(tt), 0.002, 0.05)
            put(lp(bn, 0.08), t0 + k * beat / 4, 0.22)
        for k, iv in enumerate([12, 15, 19, 15, 12, 15, 19, 22]):
            tt = t(beat * 0.4)
            pl = np.sin(2 * np.pi * hz(root + 12 + iv) * tt) * env(len(tt), 0.002, 0.1)
            if b >= 2: put(pl, t0 + k * beat / 2, 0.08)
        pad = sum(np.sin(2 * np.pi * hz(root + 12 + iv) * t(4 * beat)) for iv in (0, 3, 7)) / 3
        pad *= np.minimum(1, np.minimum(t(4 * beat) / 0.5, (4 * beat - t(4 * beat)) / 0.5))
        put(pad, t0, 0.12)
    return out[: int(SR * dur)]


def music(dur, bpm):
    """Original upbeat loop: kick, hats, bass and a bright plucked riff."""
    beat = 60 / bpm
    out = np.zeros(int(SR * (dur + 2)))
    def put(x, at, gain):
        s = int(at * SR)
        if s >= len(out): return
        out[s:s + len(x)] += x[: len(out) - s] * gain
    kick = sweep(150, 45, 0.25) * env(int(SR * 0.25), 0.001, 0.08)
    hat = lp(noise(0.05), 0.9) * env(int(SR * 0.05), 0.001, 0.015)
    clap = lp(noise(0.12), 0.5) * env(int(SR * 0.12), 0.001, 0.04)
    prog_roots = [48, 43, 45, 41]                     # C G Am F (one bar each)
    riff = [0, 7, 12, 7, 16, 12, 7, 12]               # eighth notes, relative to the chord
    bars = int(dur / (4 * beat)) + 1
    for b in range(bars):
        root = prog_roots[b % 4]; t0 = b * 4 * beat
        minor = root == 45
        for k in range(4):
            put(kick, t0 + k * beat, 0.55)
            if k in (1, 3): put(clap, t0 + k * beat, 0.25)
        for k in range(8):
            put(hat, t0 + k * beat / 2 + beat / 4, 0.12)
            bn = np.sin(2 * np.pi * hz(root - 12) * t(beat / 2)) * env(int(SR * beat / 2), 0.005, 0.2)
            put(bn, t0 + k * beat / 2, 0.35)
            iv = riff[k] + (3 if minor and riff[k] % 12 == 4 else 0) - (1 if minor and riff[k] == 16 else 0)
            f = hz(root + 24 + iv); tt = t(beat * 0.45)
            pl = sum(np.sin(2 * np.pi * f * h * tt) / h ** 1.6 for h in range(1, 5)) * env(len(tt), 0.002, 0.12)
            if b >= 1: put(pl, t0 + k * beat / 2, 0.16)
    return out[: int(SR * dur)]


def main():
    base = Path(sys.argv[1])
    cues = json.loads(base.with_suffix(".cues.json").read_text())
    dur = cues["duration"]
    mix = np.zeros(int(SR * (dur + 0.5)))
    m = cues.get("music", {})
    if m:
        maker = music_dark if m.get("mode") == "dark" else music
        mu = maker(m.get("until", dur), m.get("bpm", 112))
        gain = np.full(len(mu), 0.5)
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
