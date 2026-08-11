"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

interface EventoMapItem {
  id: string; titulo: string; fecha: string | null; latitud: number; longitud: number; ciudad: string | null;
}

function FlyTo({ evento }: { evento: EventoMapItem | null }) {
  const map = useMap();
  useEffect(() => { if (evento) map.flyTo([evento.latitud, evento.longitud], 15, { duration: 0.5 }); }, [evento, map]);
  return null;
}

function createIcon() {
  return new L.DivIcon({
    html: `<div style="width:24px;height:24px;background:#b45309;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer"></div>`,
    className: "", iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14],
  });
}

interface Props {
  eventos: EventoMapItem[];
  seleccionado: EventoMapItem | null;
  onSelect: (e: EventoMapItem | null) => void;
}

export default function EventoMapa({ eventos, seleccionado, onSelect }: Props) {
  const center: [number, number] = [eventos[0]?.latitud ?? -38, eventos[0]?.longitud ?? -57];
  const icon = createIcon();

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyTo evento={seleccionado} />
      {eventos.map(e => (
        <Marker key={e.id} position={[e.latitud, e.longitud]} icon={icon} eventHandlers={{ click: () => onSelect(e) }}>
          <Popup><div className="p-1 text-sm font-medium text-bark">{e.titulo}{e.fecha && <p className="text-xs text-bark-500 mt-0.5">{e.fecha}</p>}</div></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
