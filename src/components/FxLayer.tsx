import { useEffect, useRef } from 'react';
import { fx } from '../game/fx';

export default function FxLayer({ shakeTarget }: { shakeTarget: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let running = false;
    let last = performance.now();

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of fx.particles) {
        const a = Math.max(0, Math.min(1, p.life / p.maxLife));
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        if (p.shape === 'confetti') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          const h = p.size * Math.abs(Math.cos(p.rot * 1.7)) + 1;
          ctx.fillRect(-p.size / 2, -h / 2, p.size, h);
          ctx.restore();
        } else if (p.shape === 'ring') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (1 - a) * p.size * 10 + 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.35 + a * 0.75), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const frame = (t: number) => {
      const dt = Math.min(3.5, (t - last) / 16.6667);
      last = t;
      fx.step(dt);
      draw();
      const el = shakeTarget.current;
      if (el) {
        const s = fx.shakeAmount;
        if (s > 0) {
          const x = (Math.random() - 0.5) * s;
          const y = (Math.random() - 0.5) * s;
          const r = (Math.random() - 0.5) * s * 0.12;
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg)`;
        } else {
          el.style.transform = '';
        }
      }
      if (fx.active) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        draw();
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const off = fx.onWake(start);
    if (fx.active) start();

    return () => {
      off();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [shakeTarget]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}
