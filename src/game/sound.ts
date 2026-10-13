let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

function ac(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

type ToneOpts = {
  freq: number;
  to?: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
};

export function tone({ freq, to, dur = 0.16, type = 'triangle', gain = 0.12, delay = 0 }: ToneOpts) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.04);
}

export function noise(dur = 0.3, gain = 0.1) {
  const a = ac();
  if (!a) return;
  const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = a.createBufferSource();
  src.buffer = buf;
  const filt = a.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = 1400;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(filt).connect(g).connect(a.destination);
  src.start();
}

export const sfx = {
  click: () => tone({ freq: 620, to: 820, dur: 0.07, type: 'square', gain: 0.05 }),
  pin: () => tone({ freq: 420, to: 900, dur: 0.12, type: 'triangle', gain: 0.09 }),
  launch: () => {
    tone({ freq: 220, to: 660, dur: 0.3, type: 'sawtooth', gain: 0.07 });
    tone({ freq: 440, to: 1320, dur: 0.35, type: 'sine', gain: 0.05, delay: 0.05 });
  },
  tick: () => tone({ freq: 1100, dur: 0.05, type: 'square', gain: 0.04 }),
  good: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, dur: 0.22, type: 'triangle', gain: 0.1, delay: i * 0.07 }),
    );
  },
  mid: () => {
    [440, 554].forEach((f, i) => tone({ freq: f, dur: 0.2, type: 'triangle', gain: 0.09, delay: i * 0.08 }));
  },
  bad: () => {
    tone({ freq: 220, to: 90, dur: 0.45, type: 'sawtooth', gain: 0.08 });
    noise(0.35, 0.06);
  },
  gameover: () => {
    [784, 659, 523, 392].forEach((f, i) =>
      tone({ freq: f, dur: 0.3, type: 'triangle', gain: 0.09, delay: i * 0.12 }),
    );
  },
  fanfare: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone({ freq: f, dur: 0.35, type: 'square', gain: 0.07, delay: i * 0.09 }),
    );
  },
};
