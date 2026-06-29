"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { SCHOOL_MAP_CENTER } from "@/lib/school-map";
import "leaflet/dist/leaflet.css";

type LeafletContainer = HTMLDivElement & { _leaflet_id?: number };

function clearLeafletContainer(container: LeafletContainer) {
  if (container._leaflet_id !== undefined) {
    container.replaceChildren();
    delete container._leaflet_id;
  }
}

export function FooterMap() {
  const containerRef = useRef<LeafletContainer>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: LeafletMap | null = null;
    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      clearLeafletContainer(containerRef.current);

      map = L.map(containerRef.current, {
        center: SCHOOL_MAP_CENTER,
        zoom: 11,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    });

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        map = null;
      }
      if (containerRef.current) {
        clearLeafletContainer(containerRef.current);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden />;
}
