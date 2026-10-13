import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Loc } from '../game/locations';

export type SatApi = { reset: () => void; zoom: (d: number) => void };

type Props = {
  location: Loc | null;
  interactive: boolean;
  apiRef?: React.RefObject<SatApi | null>;
  onLoading?: (loading: boolean) => void;
};

const IMAGERY =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

export default function SatelliteView({ location, interactive, apiRef, onLoading }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const loadingRef = useRef(onLoading);
  loadingRef.current = onLoading;

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;
    const map = L.map(divRef.current, {
      center: [0, 0],
      zoom: 16,
      zoomControl: false,
      attributionControl: true,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel: 110,
      maxBoundsViscosity: 0.9,
      fadeAnimation: true,
      preferCanvas: true,
    });
    L.tileLayer(IMAGERY, {
      maxZoom: 19,
      maxNativeZoom: 18,
      minZoom: 3,
      attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
      keepBuffer: 2,
      updateWhenIdle: false,
    })
      .on('loading', () => loadingRef.current?.(true))
      .on('load', () => loadingRef.current?.(false))
      .addTo(map);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // move to new location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    const z = location.z ?? 16;
    map.setMaxBounds(undefined as unknown as L.LatLngBoundsExpression);
    map.setMinZoom(Math.max(4, z - 2));
    map.setView([location.lat, location.lng], z, { animate: false });
    const pad = 0.5;
    map.setMaxBounds(
      L.latLngBounds(
        [location.lat - pad, location.lng - pad * 1.7],
        [location.lat + pad, location.lng + pad * 1.7],
      ),
    );
    map.invalidateSize();
  }, [location]);

  // toggle interactivity
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handlers = [map.dragging, map.scrollWheelZoom, map.doubleClickZoom, map.touchZoom, map.boxZoom];
    handlers.forEach((h) => (interactive ? h?.enable() : h?.disable()));
  }, [interactive]);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      reset: () => {
        const map = mapRef.current;
        if (map && location) map.flyTo([location.lat, location.lng], location.z ?? 16, { duration: 0.6 });
      },
      zoom: (d: number) => {
        const map = mapRef.current;
        if (map) map.setZoom(map.getZoom() + d);
      },
    };
  }, [apiRef, location]);

  useEffect(() => {
    const onResize = () => mapRef.current?.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <div ref={divRef} className="absolute inset-0 z-0" />;
}
