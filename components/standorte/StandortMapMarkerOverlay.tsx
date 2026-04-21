"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { latLngToWorldPixel } from "@/lib/maps-mercator";
import type { PlzMapMarker } from "@/lib/standort-region-map";

type MapView = { lat: number; lng: number; zoom: number };

type Props = {
  markers: PlzMapMarker[];
  currentPlz: string;
  mapView: MapView;
};

/**
 * Klickbare orangefarbene Punkte über der eingebetteten Karte (Web-Mercator, gemessene Containergröße).
 */
export function StandortMapMarkerOverlay({ markers, currentPlz, mapView }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSize({ w: r.width, h: r.height });
  }, []);

  useLayoutEffect(() => {
    measure();
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const { lat: cLat, lng: cLng, zoom } = mapView;
  const ready = size.w > 0 && size.h > 0;
  const centerPx = ready ? latLngToWorldPixel(cLat, cLng, zoom) : null;

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {ready &&
        centerPx &&
        markers.map((m) => {
          const pt = latLngToWorldPixel(m.lat, m.lng, zoom);
          const dx = pt.x - centerPx.x;
          const dy = pt.y - centerPx.y;
          const left = size.w / 2 + dx;
          const top = size.h / 2 + dy;
          const active = m.plz === currentPlz;
          return (
            <Link
              key={m.plz}
              href={`/standorte/${m.slug}`}
              className={`pointer-events-auto absolute flex min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2 ${
                active ? "z-[4]" : "z-[3]"
              }`}
              style={{ left, top }}
              aria-label={`Standort ${m.plz} ${m.ort}`}
              title={`${m.plz} ${m.ort}`}
            >
              <span
                className={`shrink-0 rounded-full bg-[#F78F2E] shadow-[0_1px_3px_rgba(15,79,104,0.35)] ring-1 ring-white/95 ${
                  active ? "h-3 w-3" : "h-2 w-2"
                }`}
                aria-hidden
              />
            </Link>
          );
        })}
    </div>
  );
}
