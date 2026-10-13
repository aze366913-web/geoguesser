import { useState } from 'react';
import CountUp from './CountUp';
import type { RoundResult } from './ResultCard';
import type { ScoreEntry } from '../game/storage';
import { formatKm, MAX_ROUND_SCORE, ROUNDS } from '../game/scoring';

function rankFor(total: number) {
  const max = MAX_ROUND_SCORE * ROUNDS;
  const p = total / max;
  if (p >= 0.9) return { title: 'ORBITAL ORACLE', color: '#ffc53d', emoji: '🏆' };
  if (p >= 0.75) return { title: 'MASTER CARTOGRAPHER', color: '#38f5c8', emoji: '🧭' };
  if (p >= 0.55) return { title: 'GLOBETROTTER', color: '#38f5c8', emoji: '🌍' };
  if (p >= 0.35) return { title: 'NAVIGATOR', color: '#4ea8ff', emoji: '🗺️' };
  if (p >= 0.18) return { title: 'TOURIST', color: '#9a8cff', emoji: '🧳' };
  return { title: 'LOST IN SPACE', color: '#ff5d73', emoji: '🛸' };
}

export default function GameOverScreen({
  results,
  total,
  scores,
  qualified,
  defaultName,
  onSubmitName,
  onRestart,
  onMenu,
}: {
  results: RoundResult[];
  total: number;
  scores: ScoreEntry[];
  qualified: boolean;
  defaultName: string;
  onSubmitName: (name: string) => void;
  onRestart: () => void;
  onMenu: () => void;
}) {
  const [name, setName] = useState(defaultName || '');
  const rank = rankFor(total);
  const best = results.reduce((m, r) => Math.max(m, r.total), 0);

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-[#05070f]/92 backdrop-blur-lg">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-4 p-4 py-8">
        <div className="animate-popin text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Mission complete
          </div>
          <div className="mt-1 text-5xl">{rank.emoji}</div>
          <h2
            className="font-display text-2xl font-bold tracking-tight sm:text-4xl"
            style={{ color: rank.color, textShadow: `0 0 30px ${rank.color}55` }}
          >
            {rank.title}
          </h2>
          <CountUp
            value={total}
            duration={1400}
            className="mt-1 block font-mono text-5xl font-bold text-white sm:text-6xl"
          />
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            of {(MAX_ROUND_SCORE * ROUNDS).toLocaleString()} possible · best round {best.toLocaleString()}
          </div>
        </div>

        <div className="glass animate-slideup rounded-2xl p-3 sm:p-4">
          <table className="w-full font-mono text-[11px] sm:text-xs">
            <thead>
              <tr className="text-left uppercase tracking-widest text-slate-500">
                <th className="pb-1 font-normal">#</th>
                <th className="pb-1 font-normal">Location</th>
                <th className="pb-1 text-right font-normal">Miss</th>
                <th className="pb-1 text-right font-normal">Pts</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="py-1.5 text-slate-600">{i + 1}</td>
                  <td className="py-1.5 pr-2 text-slate-200">
                    <span className="block max-w-[150px] truncate sm:max-w-none">{r.loc.name}</span>
                    <span className="text-[10px] text-slate-500">{r.loc.country}</span>
                  </td>
                  <td className="py-1.5 text-right text-slate-400">{formatKm(r.km)}</td>
                  <td
                    className="py-1.5 text-right font-bold"
                    style={{ color: r.total > 3500 ? '#38f5c8' : r.total > 1500 ? '#4ea8ff' : '#ff8fa0' }}
                  >
                    {r.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {qualified ? (
          <form
            className="glass animate-slideup flex items-center gap-2 rounded-2xl p-3"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitName(name.trim() || 'ANON');
            }}
          >
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#ffc53d]">
              ★ New high score
            </span>
            <input
              autoFocus
              maxLength={12}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YOUR NAME"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm uppercase text-white outline-none placeholder:text-slate-600 focus:border-[#38f5c8]/60"
            />
            <button type="submit" className="btn btn-primary shrink-0 rounded-lg px-4 py-2 text-xs">
              Save
            </button>
          </form>
        ) : (
          <div className="glass animate-slideup rounded-2xl p-3">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Hall of fame
            </div>
            <ol className="grid gap-1 sm:grid-cols-2">
              {scores.length === 0 && (
                <li className="font-mono text-xs text-slate-500">empty — score higher!</li>
              )}
              {scores.map((s, i) => (
                <li
                  key={s.date + i}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 font-mono text-xs"
                >
                  <span className="w-4 text-slate-600">{i + 1}</span>
                  <span className="flex-1 truncate text-slate-300">{s.name}</span>
                  <span className={i === 0 ? 'text-[#ffc53d]' : 'text-[#38f5c8]'}>
                    {s.score.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onRestart} className="btn btn-primary flex-1 rounded-xl py-3.5 text-sm">
            ⟲ Play again <span className="opacity-60">[space]</span>
          </button>
          <button onClick={onMenu} className="btn btn-ghost rounded-xl px-5 py-3.5 text-sm">
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
