type BurstOpts = {
  count?: number;
  colors?: string[];
  speed?: number;
  spread?: number;
  gravity?: number;
  life?: number;
  size?: number;
  shape?: 'spark' | 'confetti' | 'ring';
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rot: number;
  vrot: number;
  gravity: number;
  shape: 'spark' | 'confetti' | 'ring';
};

type Listener = () => void;

class FX {
  particles: Particle[] = [];
  shakeAmount = 0;
  private listeners = new Set<Listener>();

  onWake(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private wake() {
    this.listeners.forEach((l) => l());
  }

  shake(amount: number) {
    this.shakeAmount = Math.min(46, this.shakeAmount + amount);
    this.wake();
  }

  burst(x: number, y: number, opts: BurstOpts = {}) {
    const {
      count = 24,
      colors = ['#38f5c8', '#4ea8ff', '#ffc53d'],
      speed = 6,
      spread = Math.PI * 2,
      gravity = 0.16,
      life = 60,
      size = 4,
      shape = 'spark',
    } = opts;
    const budget = Math.max(0, 900 - this.particles.length);
    const n = Math.min(count, budget);
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * spread;
      const sp = speed * (0.35 + Math.random() * 0.95);
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: life * (0.6 + Math.random() * 0.7),
        maxLife: life,
        color: colors[(Math.random() * colors.length) | 0],
        size: size * (0.6 + Math.random() * 0.9),
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        gravity,
        shape,
      });
    }
    this.wake();
  }

  confetti(x: number, y: number, count = 70) {
    this.burst(x, y, {
      count,
      colors: ['#38f5c8', '#4ea8ff', '#ffc53d', '#ff5d73', '#ffffff', '#9a8cff'],
      speed: 11,
      spread: Math.PI * 1.9,
      gravity: 0.28,
      life: 95,
      size: 6,
      shape: 'confetti',
    });
  }

  step(dt: number) {
    const p = this.particles;
    for (let i = p.length - 1; i >= 0; i--) {
      const q = p[i];
      q.vy += q.gravity * dt;
      q.vx *= 0.992;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.rot += q.vrot * dt;
      q.life -= dt;
      if (q.life <= 0) p.splice(i, 1);
    }
    this.shakeAmount *= Math.pow(0.86, dt);
    if (this.shakeAmount < 0.12) this.shakeAmount = 0;
  }

  get active() {
    return this.particles.length > 0 || this.shakeAmount > 0;
  }

  clear() {
    this.particles.length = 0;
    this.shakeAmount = 0;
  }
}

export const fx = new FX();
