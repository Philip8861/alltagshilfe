"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { PlzMapMarker } from "@/lib/standort-region-map";
import {
  REGION_MAP_INTERACTIVE_ZOOM_MAX,
  REGION_MAP_INTERACTIVE_ZOOM_MIN,
} from "@/lib/region-map-embed";

type MapView = { lat: number; lng: number; zoom: number };

type Props = {
  markers: PlzMapMarker[];
  currentPlz: string;
  initialView: MapView;
};

function clampZoom(z: number): number {
  return Math.min(
    REGION_MAP_INTERACTIVE_ZOOM_MAX,
    Math.max(REGION_MAP_INTERACTIVE_ZOOM_MIN, Math.round(z)),
  );
}

/**
 * Interaktive Regionalkarte (OpenStreetMap + MapLibre): Marker sind an Geo-Koordinaten gebunden und wandern mit Pan/Zoom.
 */
export function StandortRegionMapInteractive({ markers, currentPlz, initialView }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a>',
            maxzoom: 19,
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [initialView.lng, initialView.lat],
      zoom: clampZoom(initialView.zoom),
      minZoom: REGION_MAP_INTERACTIVE_ZOOM_MIN,
      maxZoom: REGION_MAP_INTERACTIVE_ZOOM_MAX,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    const onLoad = () => {
      if (!cancelled) setMapLoaded(true);
    };
    if (map.loaded()) {
      onLoad();
    } else {
      map.once("load", onLoad);
    }

    return () => {
      cancelled = true;
      map.off("load", onLoad);
      setMapLoaded(false);
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [initialView.lat, initialView.lng, initialView.zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map) return;

    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const marker of markers) {
      const active = marker.plz === currentPlz;
      const a = document.createElement("a");
      a.href = `/standorte/${marker.slug}`;
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.justifyContent = "center";
      a.style.minWidth = "44px";
      a.style.minHeight = "44px";
      a.style.borderRadius = "9999px";
      a.style.textDecoration = "none";
      a.setAttribute("aria-label", `Standort ${marker.plz} ${marker.ort}`);
      a.title = `${marker.plz} ${marker.ort}`;
      if (active) a.setAttribute("aria-current", "location");

      const dot = document.createElement("span");
      dot.style.display = "block";
      dot.style.flexShrink = "0";
      dot.style.borderRadius = "9999px";
      dot.style.backgroundColor = active ? "#0F4F68" : "#F78F2E";
      dot.style.boxShadow = "0 1px 3px rgba(15,79,104,0.35)";
      if (active) {
        dot.style.width = "16px";
        dot.style.height = "16px";
        dot.style.border = "2px solid rgba(255,255,255,0.95)";
      } else {
        dot.style.width = "8px";
        dot.style.height = "8px";
        dot.style.border = "1px solid rgba(255,255,255,0.95)";
      }
      a.appendChild(dot);

      const ml = new maplibregl.Marker({ element: a, anchor: "center" })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);
      markersRef.current.push(ml);
    }
  }, [mapLoaded, markers, currentPlz]);

  return (
    <div className="relative aspect-[4/3] w-full min-h-[154px] overflow-hidden rounded-b-xl bg-neutral-200">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
