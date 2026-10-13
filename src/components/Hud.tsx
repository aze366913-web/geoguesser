import { ROUNDS, ROUND_SECONDS } from '../game/scoring';

type Props = {
  round: number;
  total: number;
  secondsLeft: number;
  streak: number;
  hintText: string | null;
  hintsLeft: number;
  onHint: () => void;
  onPause: () => void;
  onRecenter: () => void;
  muted: boolean;
  onToggleMute: () => void;
  loading: boolean;
};

export default function Hud({
  round,
  total,
  secondsLeft,
  streak,
  hintText,
  hintsLeft,
  onHint,
  onPause,
  onRecenter,
  muted,
  onToggleMute,
  loading,
}: Props) {
  const pct = Math.max(0, Math.min(1, secondsLeft / ROUND_SECONDS));
  const danger = secondsLeft <= 10;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-2 sm:p-3">
      <div className="glass pointer-events-auto mx-auto flex max-w-4xl items-center gap-2 rounded-2xl px-2.5 py-2 sm:gap-4 sm:px-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Round</span>
          <span className="font-display text-base font-bold leading-none text-white sm:text-lg">
            {round}
            <span className="text-slate-500">/{ROUNDS}</span>
          </span>
        </div>

        <div className="h-7 w-px bg-white/10" />

        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Score</span>
          <span className="font-mono text-base font-bold leading-none text-[#38f5c8] sm:text-lg">
            {total.toLocaleString()}
          </span>
        </div>

        {streak > 1 && (
          <div className="animate-popin flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Streak</span>
            <span className="font-mono text-base font-bold leading-none text-[#ffc53d] sm:text-lg">
              ×{streak}
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onHint}
            disabled={hintsLeft <= 0}
            title="Hint (H) — costs 400 pts"
            className="btn btn-ghost rounded-lg px-2.5 py-2 text-[10px] sm:text-xs"
          >
            💡<span className="ml-1 hidden sm:inline">Hint</span>
            <span className="ml-1 opacity-60">{hintsLeft}</span>
          </button>
          <button
            onClick={onRecenter}
            title="Recenter imagery"
            className="btn btn-ghost rounded-lg px-2.5 py-2 text-xs"
          >
            🎯
          </button>
          <button
            onClick={onToggleMute}
            title="Mute"
            className="btn btn-ghost rounded-lg px-2.5 py-2 text-xs"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button onClick={onPause} title="Pause (Esc)" className="btn btn-ghost rounded-lg px-2.5 py-2 text-xs">
            ⏸
          </button>
        </div>
      </div>

      {/* timer */}
      <div className="mx-auto mt-1.5 max-w-4xl px-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-200 ease-linear"
            style={{
              width: `${pct * 100}%`,
              background: danger
                ? 'linear-gradient(90deg,#ff5d73,#ffc53d)'
                : 'linear-gradient(90deg,#38f5c8,#4ea8ff)',
              boxShadow: danger ? '0 0 14px rgba(255,93,115,.7)' : '0 0 12px rgba(56,245,200,.5)',
            }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
          <span className={danger ? 'animate-pulse text-[#ff5d73]' : 'text-slate-500'}>
            {Math.ceil(secondsLeft)}s
          </span>
          <span className="text-slate-500">{loading ? 'streaming imagery…' : ''}</span>
        </div>
      </div>

      {hintText && (
        <div className="animate-popin mx-auto mt-2 w-fit rounded-full border border-[#ffc53d]/30 bg-[#ffc53d]/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#ffc53d]">
          {hintText}
        </div>
      )}
    </div>
  );
}
