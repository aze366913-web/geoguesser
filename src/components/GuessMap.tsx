import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Loc } from '../game/locations';

export type LatLng = { lat: number; lng: number };
export type GuessApi = {
  pan: (dx: number, dy: number) => void;
  zoom: (d: number) => void;
  centerPick: () => void;
  resetView: () => void;
  invalidate: () => void;
};

type Props = {
  mode: 'guess' | 'result';
  guess: LatLng | null;
  actual: Loc | null;
  onPick: (ll: LatLng, sx: number, sy: number) => void;
  apiRef?: React.RefObject<GuessApi | null>;
  roundKey: number;
};

const TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function dotIcon(kind: 'guess' | 'target', label: string) {
  return L.divIcon({
    className: '',
    html: `<div class="pin-wrap pin-${kind}"><div class="pin-ring"></div><div class="pin-dot"></div><div class="pin-label">${label}</div></div>`,
    iconSize: [0, 0],
  });
}

export default function GuessMap({ mode, guess, actual, onPick, apiRef, roundKey }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const guessMarker = useRef<L.Marker | null>(null);
  const targetMarker = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;
    const map = L.map(divRef.current, {
      center: [20, 0],
      zoom: 1,
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true,
      zoomSnap: 0.5,
      minZoom: 1,
      maxZoom: 12,
      maxBounds: L.latLngBounds([-89, -220], [89, 220]),
      maxBoundsViscosity: 0.6,
    });
    L.tileLayer(TILES, {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (modeRef.current !== 'guess') return;
      const ll = e.latlng.wrap();
      const oe = e.originalEvent as MouseEvent | undefined;
      const r = divRef.current?.getBoundingClientRect();
      onPickRef.current(
        { lat: ll.lat, lng: ll.lng },
        oe?.clientX ?? (r ? r.left + r.width / 2 : 0),
        oe?.clientY ?? (r ? r.top + r.height / 2 : 0),
      );
    });
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    ro.observe(divRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // new round -> reset
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    guessMarker.current?.remove();
    guessMarker.current = null;
    targetMarker.current?.remove();
    targetMarker.current = null;
    lineRef.current?.remove();
    lineRef.current = null;
    map.setView([22, 8], 1, { animate: false });
  }, [roundKey]);

  // guess pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!guess) {
      guessMarker.current?.remove();
      guessMarker.current = null;
      return;
    }
    if (!guessMarker.current) {
      guessMarker.current = L.marker([guess.lat, guess.lng], {
        icon: dotIcon('guess', 'YOU'),
        keyboard: false,
        interactive: false,
      }).addTo(map);
    } else {
      guessMarker.current.setLatLng([guess.lat, guess.lng]);
    }
  }, [guess]);

  // reveal
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mode !== 'result' || !actual) return;
    const a = L.latLng(actual.lat, actual.lng);
    targetMarker.current?.remove();
    targetMarker.current = L.marker(a, {
      icon: dotIcon('target', actual.name.toUpperCase()),
      interactive: false,
      keyboard: false,
    }).addTo(map);
    if (!guess) {
      map.flyTo(a, 4, { duration: 0.9 });
      return;
    }
    const g = L.latLng(guess.lat, guess.lng);
    lineRef.current?.remove();
    lineRef.current = L.polyline([g, a], {
      color: '#38f5c8',
      weight: 2,
      opacity: 0.9,
      dashArray: '6 10',
      className: 'guess-line',
    }).addTo(map);
    const bounds = L.latLngBounds([g, a]).pad(0.35);
    map.flyToBounds(bounds, { duration: 0.9, maxZoom: 7, padding: [40, 40] });
  }, [mode, actual, guess]);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      pan: (dx, dy) => mapRef.current?.panBy([dx, dy], { animate: true, duration: 0.18 }),
      zoom: (d) => mapRef.current?.setZoom((mapRef.current?.getZoom() ?? 1) + d),
      centerPick: () => {
        const map = mapRef.current;
        if (!map || modeRef.current !== 'guess') return;
        const c = map.getCenter().wrap();
        const r = divRef.current?.getBoundingClientRect();
        onPickRef.current(
          { lat: c.lat, lng: c.lng },
          r ? r.left + r.width / 2 : window.innerWidth / 2,
          r ? r.top + r.height / 2 : window.innerHeight / 2,
        );
      },
      resetView: () => mapRef.current?.setView([22, 8], 1),
      invalidate: () => mapRef.current?.invalidateSize({ animate: false }),
    };
  }, [apiRef]);

  return <div ref={divRef} className="h-full w-full" />;
}
