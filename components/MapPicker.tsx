"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let map: any = null;
    let marker: any = null;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      map = L.map("map-picker", {
        center: [lat, lng],
        zoom: 14,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; CARTO",
      }).addTo(map);

      marker = L.marker([lat, lng], { draggable: true }).addTo(map);

      map.on("click", (e: any) => {
        const { lat: newLat, lng: newLng } = e.latlng;
        marker.setLatLng([newLat, newLng]);
        onChange(parseFloat(newLat.toFixed(6)), parseFloat(newLng.toFixed(6)));
      });

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
      });

      setTimeout(() => map.invalidateSize(), 200);
      setMapReady(true);
    }

    init();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-cream-300">
      <div id="map-picker" className="h-[250px] w-full" />
      {!mapReady && (
        <div className="absolute inset-0 bg-cream-100 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-cream-400 animate-pulse" />
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[11px] font-mono text-bark-600 shadow-sm">
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </div>
    </div>
  );
}
