"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { SCHOOL_MAP_CENTER } from "@/lib/school-map";
import "leaflet/dist/leaflet.css";

export function FooterMap() {
  return (
    <MapContainer
      center={SCHOOL_MAP_CENTER}
      zoom={11}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
}
