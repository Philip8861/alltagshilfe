"use client";

import { useCallback, useState } from "react";
import { StandortMapMarkerOverlay } from "@/components/standorte/StandortMapMarkerOverlay";
import type { PlzMapMarker } from "@/lib/standort-region-map";
import {
  buildRegionMapsEmbedSrc,
  REGION_MAP_INTERACTIVE_ZOOM_MAX,
  REGION_MAP_INTERACTIVE_ZOOM_MIN,
} from "@/lib/region-map-embed";

type MapView = { lat: number; lng: number; zoom: number };

type Props = {
  markers: PlzMapMarker[];
  currentPlz: string;
  initialView: MapView;
};

/**
 * Eingebettete Regionalkarte mit Zoom (+/−) und Marker-Overlay (Zoom synchron zur iframe-URL).
 */
export function StandortRegionMapInteractive({ markers, currentPlz, initialView }: Props) {
  const [zoom, setZoom] = useState(() =>
    Math.round(
      Math.min(
        REGION_MAP_INTERACTIVE_ZOOM_MAX,
        Math.max(REGION_MAP_INTERACTIVE_ZOOM_MIN, initialView.zoom),
      ),
    ),
  );

  const mapView: MapView = {
    lat: initialView.lat,
    lng: initialView.lng,
    zoom,
  };

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(REGION_MAP_INTERACTIVE_ZOOM_MAX, z + 1)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(REGION_MAP_INTERACTIVE_ZOOM_MIN, z - 1)),
    [],
  );

  const iframeSrc = buildRegionMapsEmbedSrc(initialView.lat, initialView.lng, zoom);

  return (
    <div className="relative aspect-[4/3] w-full min-h-[220px] bg-neutral-200">
      <iframe
        key={iframeSrc}
        title="Google Maps: Versorgungsgebiet Alltagshilfe-Süd"
        src={iframeSrc}
        className="absolute inset-0 z-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <StandortMapMarkerOverlay markers={markers} currentPlz={currentPlz} mapView={mapView} />
      <div className="pointer-events-none absolute right-2 top-1/2 z-[5] flex -translate-y-1/2 flex-col overflow-hidden rounded-md border border-[#0F4F68]/25 bg-white/95 shadow-md">
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= REGION_MAP_INTERACTIVE_ZOOM_MAX}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center text-xl font-semibold leading-none text-[#0F4F68] transition hover:bg-[#F2F9FA] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Karte vergrößern"
        >
          +
        </button>
        <div className="h-px shrink-0 bg-[#0F4F68]/15" aria-hidden />
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= REGION_MAP_INTERACTIVE_ZOOM_MIN}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center text-xl font-semibold leading-none text-[#0F4F68] transition hover:bg-[#F2F9FA] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Karte verkleinern"
        >
          −
        </button>
      </div>
    </div>
  );
}
