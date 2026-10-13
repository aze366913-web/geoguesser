import CountUp from './CountUp';
import { formatKm, gradeFor, MAX_ROUND_SCORE } from '../game/scoring';
import type { Loc } from '../game/locations';

export type RoundResult = {
  loc: Loc;
  km: number;
  base: number;
  bonus: number;
  penalty: number;
  streakBonus: number;
  total: number;
  timedOut: boolean;
};

export default function ResultCard({
  result,
  isLast,
  onNext,
}: {
  result: RoundResult;
  isLast: boolean;
  onNext: () => void;
}) {
  const grade = gradeFor(result.km);
  const pct = Math.min(1, result.base / MAX_ROUND_SCORE);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center p-3 pb-4 sm:p-5">
      <div className="glass animate-slideup pointer-events-auto w-full max-w-xl rounded-2xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="font-display text-xl font-bold leading-none tracking-wide sm:text-2xl"
              style={{ color: grade.color, textShadow: `0 0 22px ${grade.color}66` }}
            >
              {result.timedOut ? 'TIME OUT' : grade.label}
            </div>
            <div className="mt-1.5 truncate font-mono text-xs text-slate-300">
              📍 {result.loc.name} — {result.loc.country}
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              you missed by <b className="text-slate-300">{formatKm(result.km)}</b>
            </div>
          </div>
          <div className="text-right">
            <CountUp
              value={result.total}
              className="font-mono text-3xl font-bold leading-none text-white sm:text-4xl"
              suffix=""
            />
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">points</div>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-[width] duration-[900ms] ease-out"
            style={{
              width: `${pct * 100}%`,
              background: `linear-gradient(90deg, ${grade.color}, #4ea8ff)`,
              boxShadow: `0 0 16px ${grade.color}99`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-slate-400">
          <span>
            accuracy <b className="text-slate-200">{result.base.toLocaleString()}</b>
          </span>
          {result.bonus > 0 && (
            <span className="text-[#38f5c8]">speed +{result.bonus.toLocaleString()}</span>
          )}
          {result.streakBonus > 0 && (
            <span className="text-[#ffc53d]">streak +{result.streakBonus.toLocaleString()}</span>
          )}
          {result.penalty > 0 && <span className="text-[#ff5d73]">hints −{result.penalty}</span>}
        </div>

        <button onClick={onNext} className="btn btn-primary mt-4 w-full rounded-xl py-3 text-sm">
          {isLast ? 'See final report ▸' : 'Next drop ▸'}{' '}
          <span className="ml-1 opacity-60">[space]</span>
        </button>
      </div>
    </div>
  );
}
