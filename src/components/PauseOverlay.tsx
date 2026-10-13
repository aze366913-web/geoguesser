export default function PauseOverlay({
  onResume,
  onRestart,
  onQuit,
  score,
  round,
}: {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  score: number;
  round: number;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#05070f]/80 backdrop-blur-md">
      <div className="glass animate-popin w-[min(92vw,380px)] rounded-2xl p-6 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#38f5c8]">System halted</div>
        <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">PAUSED</h2>
        <div className="mt-3 flex justify-center gap-6 font-mono text-xs text-slate-400">
          <span>
            round <b className="text-white">{round}</b>
          </span>
          <span>
            score <b className="text-[#38f5c8]">{score.toLocaleString()}</b>
          </span>
        </div>
        <div className="mt-6 space-y-2">
          <button onClick={onResume} className="btn btn-primary w-full rounded-xl py-3 text-sm">
            Resume <span className="opacity-60">[esc]</span>
          </button>
          <button onClick={onRestart} className="btn btn-ghost w-full rounded-xl py-3 text-sm">
            Restart run <span className="opacity-60">[r]</span>
          </button>
          <button onClick={onQuit} className="btn btn-ghost w-full rounded-xl py-3 text-sm">
            Abort to menu
          </button>
        </div>
      </div>
    </div>
  );
}
