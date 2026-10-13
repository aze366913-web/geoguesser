import { useCallback, useEffect, useRef, useState } from 'react';
import SatelliteView, { type SatApi } from './components/SatelliteView';
import GuessMap, { type GuessApi, type LatLng } from './components/GuessMap';
import StartScreen from './components/StartScreen';
import Hud from './components/Hud';
import ResultCard, { type RoundResult } from './components/ResultCard';
import PauseOverlay from './components/PauseOverlay';
import GameOverScreen from './components/GameOverScreen';
import FxLayer from './components/FxLayer';
import { pickRound, type Loc } from './game/locations';
import {
  ROUNDS,
  ROUND_SECONDS,
  distanceScore,
  gradeFor,
  haversineKm,
  hintPenalty,
  timeBonus,
} from './game/scoring';
import { fx } from './game/fx';
import { sfx, setMuted } from './game/sound';
import { loadName, loadScores, qualifies, saveScore, storeName, clearScores, type ScoreEntry } from './game/storage';

type Phase = 'menu' | 'playing' | 'result' | 'over';

export default function App() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [paused, setPaused] = useState(false);
  const [locs, setLocs] = useState<Loc[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintUsedThisRound, setHintUsedThisRound] = useState(0);
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadScores());
  const [qualified, setQualified] = useState(false);
  const [banner, setBanner] = useState<{ text: string; sub: string; key: number } | null>(null);
  const [flash, setFlash] = useState<{ color: string; key: number } | null>(null);

  const shakeRef = useRef<HTMLDivElement>(null);
  const satApi = useRef<SatApi | null>(null);
  const guessApi = useRef<GuessApi | null>(null);
  const deadlineRef = useRef(0);
  const remainingRef = useRef(ROUND_SECONDS);
  const lastTickRef = useRef(99);

  const loc = locs[roundIdx] ?? null;

  /* ------------------------- round lifecycle ------------------------- */

  const startRound = useCallback((idx: number) => {
    setRoundIdx(idx);
    setGuess(null);
    setExpanded(false);
    setHintLevel(0);
    setHintUsedThisRound(0);
    setSecondsLeft(ROUND_SECONDS);
    remainingRef.current = ROUND_SECONDS;
    deadlineRef.current = performance.now() + ROUND_SECONDS * 1000;
    lastTickRef.current = 99;
    setPhase('playing');
    setBanner({ text: `DROP ${idx + 1}`, sub: 'where on earth are you?', key: Date.now() });
    sfx.launch();
  }, []);

  const startGame = useCallback(() => {
    setLocs(pickRound(ROUNDS));
    setResults([]);
    setTotal(0);
    setStreak(0);
    setHintsLeft(3);
    setQualified(false);
    fx.clear();
    startRound(0);
  }, [startRound]);

  const finish = useCallback(
    (finalResults: RoundResult[], finalTotal: number) => {
      setPhase('over');
      setExpanded(false);
      const q = qualifies(finalTotal);
      setQualified(q);
      setScores(loadScores());
      if (q) {
        sfx.fanfare();
        for (let i = 0; i < 5; i++) {
          setTimeout(
            () => fx.confetti(window.innerWidth * (0.15 + Math.random() * 0.7), window.innerHeight * 0.4, 50),
            i * 170,
          );
        }
        fx.shake(10);
      } else {
        sfx.gameover();
      }
      void finalResults;
    },
    [],
  );

  const submitGuess = useCallback(
    (timedOut = false) => {
      if (phase !== 'playing' || !loc) return;
      const g = guess;
      const km = g ? haversineKm(g, loc) : 20015;
      const base = g ? distanceScore(km) : 0;
      const accuracy = base / 5000;
      const bonus = g && !timedOut ? timeBonus(secondsLeft, accuracy) : 0;
      const penalty = hintPenalty(hintUsedThisRound);
      const good = base >= 3000;
      const nextStreak = good ? streak + 1 : 0;
      const streakBonus = good && nextStreak >= 2 ? Math.round(base * 0.1 * Math.min(3, nextStreak - 1)) : 0;
      const pts = Math.max(0, base + bonus + streakBonus - penalty);

      const result: RoundResult = { loc, km, base, bonus, penalty, streakBonus, total: pts, timedOut };
      setStreak(nextStreak);
      setResults((r) => [...r, result]);
      setTotal((t) => t + pts);
      setPhase('result');
      setExpanded(true);

      // juice
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.55;
      const tier = gradeFor(km).tier;
      if (tier === 'perfect' || tier === 'great') {
        fx.confetti(cx, cy, 90);
        fx.burst(cx, cy, { count: 40, colors: ['#38f5c8', '#ffffff'], speed: 9, life: 60, shape: 'spark' });
        fx.shake(14);
        setFlash({ color: '56,245,200', key: Date.now() });
        sfx.good();
      } else if (tier === 'good') {
        fx.burst(cx, cy, { count: 40, colors: ['#4ea8ff', '#9a8cff', '#ffffff'], speed: 7, life: 55 });
        fx.shake(7);
        setFlash({ color: '78,168,255', key: Date.now() });
        sfx.mid();
      } else {
        fx.burst(cx, cy, {
          count: 34,
          colors: ['#ff5d73', '#ff9f43'],
          speed: 6,
          life: 55,
          gravity: 0.3,
        });
        fx.shake(tier === 'bad' ? 24 : 14);
        setFlash({ color: '255,93,115', key: Date.now() });
        sfx.bad();
      }
    },
    [phase, loc, guess, secondsLeft, hintUsedThisRound, streak],
  );

  const next = useCallback(() => {
    if (phase !== 'result') return;
    sfx.click();
    if (roundIdx + 1 >= ROUNDS) {
      finish(results, total);
    } else {
      startRound(roundIdx + 1);
    }
  }, [phase, roundIdx, results, total, finish, startRound]);

  /* ------------------------------ timer ------------------------------ */
  useEffect(() => {
    if (phase !== 'playing' || paused) return;
    let id = 0;
    const tick = () => {
      const left = Math.max(0, (deadlineRef.current - performance.now()) / 1000);
      remainingRef.current = left;
      setSecondsLeft(left);
      const whole = Math.ceil(left);
      if (whole <= 5 && whole !== lastTickRef.current && whole > 0) {
        lastTickRef.current = whole;
        sfx.tick();
        fx.shake(2.5);
      }
      if (left <= 0) {
        window.clearInterval(id);
        submitGuess(true);
      }
    };
    id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [phase, paused, submitGuess]);

  // pause/resume deadline bookkeeping
  const togglePause = useCallback(() => {
    if (phase !== 'playing') return;
    setPaused((p) => {
      if (p) {
        deadlineRef.current = performance.now() + remainingRef.current * 1000;
      }
      sfx.click();
      return !p;
    });
  }, [phase]);

  /* ------------------------------ hints ------------------------------ */
  const useHint = useCallback(() => {
    if (phase !== 'playing' || !loc || hintsLeft <= 0 || hintLevel >= 3) return;
    setHintsLeft((h) => h - 1);
    setHintLevel((l) => l + 1);
    setHintUsedThisRound((h) => h + 1);
    sfx.pin();
    fx.shake(3);
  }, [phase, loc, hintsLeft, hintLevel]);

  const hintText = (() => {
    if (!loc || hintLevel === 0) return null;
    if (hintLevel === 1) return `Continent · ${loc.continent}`;
    if (hintLevel === 2)
      return `Country · ${loc.country[0]}${'•'.repeat(Math.max(1, loc.country.length - 1))}`;
    return `Country · ${loc.country}`;
  })();

  /* ---------------------------- keyboard ----------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      const k = e.key.toLowerCase();

      if (phase === 'menu') {
        if (k === ' ' || k === 'enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (phase === 'over') {
        if (k === ' ' || k === 'enter' || k === 'r') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (phase === 'result') {
        if (k === ' ' || k === 'enter') {
          e.preventDefault();
          next();
        }
        return;
      }
      // playing
      if (k === 'escape') {
        e.preventDefault();
        togglePause();
        return;
      }
      if (paused) {
        if (k === 'r') startGame();
        return;
      }
      if (k === ' ') {
        e.preventDefault();
        if (guess) submitGuess();
        else {
          setExpanded(true);
          guessApi.current?.centerPick();
        }
        return;
      }
      if (k === 'enter') {
        e.preventDefault();
        setExpanded(true);
        guessApi.current?.centerPick();
        sfx.pin();
        return;
      }
      if (k === 'm') {
        setExpanded((v) => !v);
        sfx.click();
        return;
      }
      if (k === 'h') {
        useHint();
        return;
      }
      if (k === 'arrowleft' || k === 'arrowright' || k === 'arrowup' || k === 'arrowdown') {
        if (!expanded) return;
        e.preventDefault();
        const d = 110;
        guessApi.current?.pan(
          k === 'arrowleft' ? -d : k === 'arrowright' ? d : 0,
          k === 'arrowup' ? -d : k === 'arrowdown' ? d : 0,
        );
        return;
      }
      if (k === '+' || k === '=' || k === 'z') guessApi.current?.zoom(1);
      if (k === '-' || k === '_' || k === 'x') guessApi.current?.zoom(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, paused, guess, expanded, startGame, next, submitGuess, togglePause, useHint]);

  /* ----------------------------- banner ------------------------------ */
  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(null), 1500);
    return () => clearTimeout(id);
  }, [banner]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(id);
  }, [flash]);

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      setMuted(!m);
      return !m;
    });
  }, []);

  const onPick = useCallback((ll: LatLng, sx: number, sy: number) => {
    setGuess(ll);
    sfx.pin();
    fx.burst(sx, sy, {
      count: 16,
      colors: ['#4ea8ff', '#ffffff', '#38f5c8'],
      speed: 4.5,
      life: 34,
      gravity: 0.08,
      size: 3,
      spread: Math.PI * 2,
    });
    fx.shake(2);
  }, []);

  /* ----------------------------- layout ------------------------------ */
  const resultMode = phase === 'result';
  const mapPanelStyle: React.CSSProperties = resultMode
    ? { inset: 0, width: 'auto', height: 'auto', borderRadius: 0 }
    : expanded
      ? {
          right: 'max(8px, env(safe-area-inset-right))',
          bottom: 'max(8px, env(safe-area-inset-bottom))',
          width: 'min(calc(100vw - 16px), 760px)',
          height: 'min(calc(100dvh - 150px), 520px)',
        }
      : {
          right: 'max(8px, env(safe-area-inset-right))',
          bottom: 'max(8px, env(safe-area-inset-bottom))',
          width: 'clamp(140px, 34vw, 300px)',
          height: 'clamp(104px, 24vw, 200px)',
        };

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#05070f]">
      <div ref={shakeRef} className="absolute inset-0 will-change-transform">
        {/* satellite imagery */}
        {phase !== 'menu' && (
          <SatelliteView
            location={loc}
            interactive={phase === 'playing' && !paused}
            apiRef={satApi}
            onLoading={setLoading}
          />
        )}

        {/* vignette + scanline atmosphere */}
        {phase !== 'menu' && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 45%, rgba(3,6,14,0.75) 100%)',
            }}
          />
        )}

        {/* orbital frame */}
        {phase === 'playing' && (
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute left-2 top-[110px] h-9 w-9 border-l border-t border-[#38f5c8]/25" />
            <div className="absolute right-2 top-[110px] h-9 w-9 border-r border-t border-[#38f5c8]/25" />
            <div className="absolute bottom-2 left-2 h-9 w-9 border-b border-l border-[#38f5c8]/25" />
            <div className="absolute bottom-4 left-[58px] font-mono text-[9px] uppercase tracking-[0.3em] text-[#38f5c8]/55">
              <span className="mr-1 inline-block animate-pulse">◉</span> live orbital feed
            </div>
          </div>
        )}

        {/* HUD */}
        {phase === 'playing' && (
          <Hud
            round={roundIdx + 1}
            total={total}
            secondsLeft={secondsLeft}
            streak={streak}
            hintText={hintText}
            hintsLeft={hintsLeft}
            onHint={useHint}
            onPause={togglePause}
            onRecenter={() => {
              satApi.current?.reset();
              sfx.click();
            }}
            muted={muted}
            onToggleMute={toggleMute}
            loading={loading}
          />
        )}

        {/* guess map panel */}
        {(phase === 'playing' || phase === 'result') && (
          <div
            className={`absolute z-30 overflow-hidden border bg-[#060a14] shadow-[0_18px_50px_rgba(0,0,0,.6)] transition-all duration-300 ease-out ${
              phase === 'playing' && !guess && secondsLeft < 20
                ? 'animate-pulse border-[#ff5d73]/70'
                : 'border-[#38f5c8]/25'
            }`}
            style={{
              ...mapPanelStyle,
              borderRadius: resultMode ? 0 : 14,
            }}
          >
            <div className="relative h-full w-full">
              <GuessMap
                mode={resultMode ? 'result' : 'guess'}
                guess={guess}
                actual={loc}
                onPick={onPick}
                apiRef={guessApi}
                roundKey={roundIdx}
              />

              {/* collapsed overlay: tap to open */}
              {phase === 'playing' && !expanded && (
                <button
                  onClick={() => {
                    setExpanded(true);
                    sfx.click();
                  }}
                  className="group absolute inset-0 z-[1200] flex flex-col items-center justify-center bg-[#05070f]/35 backdrop-blur-[1px] transition hover:bg-[#05070f]/15"
                >
                  <span className="rounded-full border border-[#38f5c8]/40 bg-[#05070f]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#38f5c8] transition group-hover:scale-105">
                    {guess ? '✎ edit pin' : '⊕ open map'}
                  </span>
                  <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                    [m]
                  </span>
                </button>
              )}

              {/* expanded controls */}
              {phase === 'playing' && expanded && (
                <>
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1200] -translate-x-1/2 -translate-y-1/2 opacity-50">
                    <div className="h-6 w-6 rounded-full border border-[#38f5c8]/70" />
                    <div className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-[#38f5c8]/50" />
                    <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-[#38f5c8]/50" />
                  </div>
                  <div className="absolute inset-x-2 bottom-2 z-[1200] flex items-center gap-2">
                    <button
                      onClick={() => {
                        setExpanded(false);
                        sfx.click();
                      }}
                      className="btn btn-ghost rounded-lg px-3 py-3 text-xs"
                      title="Shrink map (M)"
                    >
                      ⤡
                    </button>
                    <button
                      onClick={() => submitGuess()}
                      disabled={!guess}
                      className="btn btn-primary flex-1 rounded-lg py-3 text-sm"
                    >
                      {guess ? 'Lock in guess' : 'Tap the map to drop a pin'}
                      {guess && <span className="ml-1 opacity-60">[space]</span>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* round banner */}
        {banner && (
          <div
            key={banner.key}
            className="animate-popin pointer-events-none absolute inset-x-0 top-[26%] z-40 text-center"
          >
            <div
              className="font-display text-6xl font-bold tracking-tighter text-white sm:text-8xl"
              style={{ textShadow: '0 0 40px rgba(56,245,200,.65)' }}
            >
              {banner.text}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-[#38f5c8]">
              {banner.sub}
            </div>
          </div>
        )}

        {/* result card */}
        {phase === 'result' && results.length > 0 && (
          <ResultCard
            result={results[results.length - 1]}
            isLast={roundIdx + 1 >= ROUNDS}
            onNext={next}
          />
        )}

        {/* flash */}
        {flash && (
          <div
            key={flash.key}
            className="pointer-events-none absolute inset-0 z-[55]"
            style={{
              background: `radial-gradient(circle at 50% 55%, rgba(${flash.color},.35), transparent 65%)`,
              animation: 'fadein .45s ease reverse both',
            }}
          />
        )}

        {paused && phase === 'playing' && (
          <PauseOverlay
            score={total}
            round={roundIdx + 1}
            onResume={togglePause}
            onRestart={() => {
              setPaused(false);
              startGame();
            }}
            onQuit={() => {
              setPaused(false);
              setPhase('menu');
              setScores(loadScores());
            }}
          />
        )}

        {phase === 'menu' && (
          <StartScreen
            scores={scores}
            onStart={() => {
              sfx.click();
              startGame();
            }}
            onClearScores={() => {
              clearScores();
              setScores([]);
            }}
            muted={muted}
            onToggleMute={toggleMute}
          />
        )}

        {phase === 'over' && (
          <GameOverScreen
            results={results}
            total={total}
            scores={scores}
            qualified={qualified}
            defaultName={loadName()}
            onSubmitName={(name) => {
              storeName(name);
              const next = saveScore({ name: name.toUpperCase().slice(0, 12), score: total, best: total, date: Date.now() });
              setScores(next);
              setQualified(false);
              sfx.good();
              fx.confetti(window.innerWidth / 2, window.innerHeight * 0.3, 60);
            }}
            onRestart={startGame}
            onMenu={() => {
              setPhase('menu');
              setScores(loadScores());
            }}
          />
        )}
      </div>

      <FxLayer shakeTarget={shakeRef} />
    </div>
  );
}
