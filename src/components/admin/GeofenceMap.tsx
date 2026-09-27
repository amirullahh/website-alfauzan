"use client";

import { useEffect } from "react";
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  lat: number;
  lng: number;
  label: string;
}

interface GeofenceMapProps {
  center: { lat: number; lng: number };
  radiusMeter: number;
  /** Titik bukti check-in/out (mode lihat). */
  points?: MapPoint[];
  /** Bila diisi, peta jadi mode pilih: klik peta memanggil onPick. */
  onPick?: (lat: number, lng: number) => void;
  height?: number;
}

function Recenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [map, center.lat, center.lng]);
  return null;
}

function ClickPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Peta geofence reusable (Leaflet + OpenStreetMap, tanpa API key —
 * sesuai keputusan tech stack). Sengaja hanya memakai Circle/CircleMarker
 * (SVG) agar tidak bergantung pada aset gambar marker Leaflet.
 *
 * WAJIB diimpor dinamis dengan ssr:false di halaman pemakai:
 *   const GeofenceMap = dynamic(() => import("@/components/admin/GeofenceMap").then(m => m.GeofenceMap), { ssr: false });
 */
export function GeofenceMap({ center, radiusMeter, points = [], onPick, height = 320 }: GeofenceMapProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#E7E5E4] dark:border-[#44403C]" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        {onPick && <ClickPicker onPick={onPick} />}
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusMeter}
          pathOptions={{ color: "#0F766E", weight: 2, fillColor: "#0F766E", fillOpacity: 0.12 }}
        />
        <CircleMarker
          center={[center.lat, center.lng]}
          radius={8}
          pathOptions={{ color: "#0F766E", weight: 2, fillColor: "#0F766E", fillOpacity: 1 }}
        >
          <Tooltip>Titik nol geofence (r={radiusMeter}m)</Tooltip>
        </CircleMarker>
        {points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lng]}
            radius={6}
            pathOptions={{ color: "#D4A017", weight: 2, fillColor: "#D4A017", fillOpacity: 1 }}
          >
            <Tooltip>{p.label}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
