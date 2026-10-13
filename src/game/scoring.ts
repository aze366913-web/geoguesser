export const ROUNDS = 5;
export const ROUND_SECONDS = 75;
export const MAX_ROUND_SCORE = 5000;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** 5000 at 0 km, decays exponentially. */
export function distanceScore(km: number): number {
  return Math.round(MAX_ROUND_SCORE * Math.exp(-km / 1400));
}

export function timeBonus(secondsLeft: number, accuracy: number): number {
  // up to 500, scaled by how good the guess was
  return Math.round(500 * (secondsLeft / ROUND_SECONDS) * accuracy);
}

export function hintPenalty(hintsUsed: number): number {
  return hintsUsed * 400;
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(2)} km`;
  if (km < 1000) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

export type Grade = {
  label: string;
  color: string;
  tier: 'perfect' | 'great' | 'good' | 'ok' | 'bad';
};

export function gradeFor(km: number): Grade {
  if (km < 1) return { label: 'PINPOINT!', color: '#ffc53d', tier: 'perfect' };
  if (km < 25) return { label: 'BULLSEYE', color: '#38f5c8', tier: 'great' };
  if (km < 150) return { label: 'SHARP', color: '#38f5c8', tier: 'great' };
  if (km < 750) return { label: 'CLOSE', color: '#4ea8ff', tier: 'good' };
  if (km < 2500) return { label: 'WIDE', color: '#9a8cff', tier: 'ok' };
  if (km < 6000) return { label: 'LOST', color: '#ff9f43', tier: 'bad' };
  return { label: 'WRONG PLANET', color: '#ff5d73', tier: 'bad' };
}
