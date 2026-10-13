import type { ScoreEntry } from '../game/storage';
import { ROUNDS, ROUND_SECONDS } from '../game/scoring';

type Props = {
  scores: ScoreEntry[];
  onStart: () => void;
  onClearScores: () => void;
  muted: boolean;
  onToggleMute: () => void;
};

export default function StartScreen({ scores, onStart, onClearScores, muted, onToggleMute }: Props) {
  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-[#05070f]">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#38f5c8] opacity-[0.13] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-80px] h-[420px] w-[420px] rounded-full bg-[#4ea8ff] opacity-[0.14] blur-[120px]" />

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-7 px-5 py-10">
        <div className="animate-popin text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="animate-floaty text-5xl sm:text-6xl">🛰️</div>
          </div>
          <h1 className="text-sheen font-display text-5xl font-bold leading-none tracking-tight sm:text-7xl">
            TERRAPOINT
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-[#5fd8bb] sm:text-xs">
            Satellite drop · Guess the spot · Beat the clock
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-5">
          <div className="glass animate-slideup rounded-2xl p-5 sm:col-span-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#38f5c8]">Mission brief</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-[#38f5c8]">01</span> You are dropped over a real place on Earth, seen
                from orbit. Pan and zoom the imagery for clues.
              </li>
              <li className="flex gap-2">
                <span className="text-[#38f5c8]">02</span> Open the world map, drop your pin and lock the
                guess in before the {ROUND_SECONDS}s timer runs out.
              </li>
              <li className="flex gap-2">
                <span className="text-[#38f5c8]">03</span> Closer = more points. {ROUNDS} rounds, 5 000 pts
                each, plus speed bonus and streak multipliers.
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              <Key k="Click / Tap" v="drop pin" />
              <Key k="Space" v="lock guess" />
              <Key k="M" v="map size" />
              <Key k="H" v="hint" />
              <Key k="Esc" v="pause" />
              <Key k="Arrows" v="pan map" />
            </div>
          </div>

          <div className="glass animate-slideup rounded-2xl p-5 sm:col-span-2" style={{ animationDelay: '80ms' }}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#ffc53d]">Hall of fame</h2>
              {scores.length > 0 && (
                <button
                  onClick={onClearScores}
                  className="font-mono text-[10px] uppercase text-slate-500 transition hover:text-[#ff5d73]"
                >
                  clear
                </button>
              )}
            </div>
            <ol className="mt-3 space-y-1.5">
              {scores.length === 0 && (
                <li className="font-mono text-xs text-slate-500">No runs logged yet. Be the first.</li>
              )}
              {scores.map((s, i) => (
                <li
                  key={s.date + i}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 font-mono text-xs"
                >
                  <span className="w-5 text-slate-500">{i + 1}</span>
                  <span className="flex-1 truncate text-slate-200">{s.name}</span>
                  <span className={i === 0 ? 'text-[#ffc53d]' : 'text-[#38f5c8]'}>
                    {s.score.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            className="btn btn-primary animate-popin rounded-xl px-10 py-4 text-lg"
            style={{ animationDelay: '120ms' }}
          >
            ▶ Launch mission
          </button>
          <button
            onClick={onToggleMute}
            className="font-mono text-[11px] uppercase tracking-widest text-slate-500 transition hover:text-slate-200"
          >
            sound: {muted ? 'off' : 'on'}
          </button>
        </div>

        <p className="pb-2 text-center font-mono text-[10px] leading-relaxed text-slate-600">
          Imagery © Esri, Maxar, Earthstar Geographics · Basemap © OpenStreetMap contributors, © CARTO
        </p>
      </div>
    </div>
  );
}

function Key({ k, v }: { k: string; v: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1">
      <b className="text-slate-200">{k}</b>
      <span className="text-slate-500">{v}</span>
    </span>
  );
}
