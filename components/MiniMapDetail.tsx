"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.DivIcon({
  html: `<div style="background:#5d8a6e;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.15)"></div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface Props {
  lat: number;
  lng: number;
  nombre: string;
}

export default function MiniMapDetail({ lat, lng, nombre }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "220px", width: "100%" }}
      dragging={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lng]} icon={markerIcon}>
        <Popup>
          <p className="font-serif font-medium text-warmblack text-sm">
            {nombre}
          </p>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
