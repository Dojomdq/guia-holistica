"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

import { getMarkerColor } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import { CITY_COORDS } from "@/lib/constants";

interface Actividad {
  id: string;
  nombre: string;
  slug: string;
}

interface Ubicacion {
  id: string;
  facilitador_id: string;
  direccion: string | null;
  latitud: number;
  longitud: number;
  ciudad: string;
}

interface FacilitadorMarker {
  id: string;
  nombre: string;
  bio: string | null;
  whatsapp: string | null;
  instagram: string | null;
  foto_url: string | null;
  actividades: Actividad[];
}

interface MarkerItem {
  ubicacion: Ubicacion;
  facilitador: FacilitadorMarker;
}

interface Props {
  markers: MarkerItem[];
  seleccionado: string | null;
  onSeleccionar: (id: string | null) => void;
  ciudadSeleccionada?: string | null;
}

function createIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 36 : 26;
  const borderW = isSelected ? 3 : 2.5;

  return new L.DivIcon({
    html: `<div style="
      background:${color};
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      border:${borderW}px solid white;
      box-shadow:${isSelected ? `0 0 0 4px ${color}25, 0 4px 12px rgba(0,0,0,0.2)` : "0 2px 8px rgba(0,0,0,0.12)"};
      transition:all .2s ease;
      ${isSelected ? "transform:scale(1.1);" : ""}
    "></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const DEFAULT_CENTER: [number, number] = [-38.0055, -57.5426];

function MapEvents({
  onSeleccionar,
}: {
  onSeleccionar: (id: string | null) => void;
}) {
  useMapEvents({ click: () => onSeleccionar(null) });
  return null;
}

function FocusMarkers({
  markers,
  selectedId,
  ciudad,
}: {
  markers: MarkerItem[];
  selectedId: string | null;
  ciudad?: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (ciudad && CITY_COORDS[ciudad]) {
      map.flyTo(CITY_COORDS[ciudad], 12, { duration: 0.8 });
      return;
    }
    if (selectedId && markers.length > 0) {
      const target = markers.find((m) => m.facilitador.id === selectedId);
      if (target) {
        map.flyTo([target.ubicacion.latitud, target.ubicacion.longitud], 15, {
          duration: 0.8,
        });
      }
    } else if (!selectedId && markers.length > 0) {
      const lats = markers.map((m) => m.ubicacion.latitud);
      const lngs = markers.map((m) => m.ubicacion.longitud);
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      map.flyTo([avgLat, avgLng], 12, { duration: 0.8 });
    }
  }, [selectedId, markers, map]);
  return null;
}

export default function MapaInteractivo({
  markers,
  seleccionado,
  onSeleccionar,
  ciudadSeleccionada,
}: Props) {
  const track = useClickTracker();

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapEvents onSeleccionar={onSeleccionar} />
      <FocusMarkers markers={markers} selectedId={seleccionado} ciudad={ciudadSeleccionada} />

      {markers.map((m, idx) => {
        const isSelected = seleccionado === m.facilitador.id;
        const color = getMarkerColor(
          m.facilitador.actividades.length > 0
            ? m.facilitador.actividades[0].slug
            : ""
        );
        const icon = createIcon(color, isSelected);

        return (
          <Marker
            key={`${m.facilitador.id}-${m.ubicacion.id || idx}`}
            position={[m.ubicacion.latitud, m.ubicacion.longitud]}
            icon={icon}
            eventHandlers={{
              click: () => onSeleccionar(m.facilitador.id),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <h3 className="font-serif font-medium text-bark text-sm mb-1.5">
                  {m.facilitador.nombre}
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {m.facilitador.actividades.map((a) => (
                    <span
                      key={a.id}
                      className="px-2 py-0.5 bg-cream-200/60 text-bark-600 text-[11px] rounded-full"
                    >
                      {a.nombre}
                    </span>
                  ))}
                </div>
                {m.facilitador.bio && (
                  <p className="text-xs text-bark-600 mb-2 line-clamp-2 leading-relaxed">
                    {m.facilitador.bio}
                  </p>
                )}
                <p className="text-[11px] text-bark-500 mb-2.5">
                  {m.ubicacion.direccion || "Ubicación sin dirección"}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/facilitadores/${m.facilitador.id}`}
                    style={{ backgroundColor: "#2A1F14", color: "#fff" }}
                    className="text-xs px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity font-medium inline-block"
                    onClick={() => track("facilitador", m.facilitador.id)}
                  >
                    Ver perfil
                  </Link>
                  {m.facilitador.whatsapp && (
                    <a
                      href={`https://wa.me/${m.facilitador.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: "#5d8a6e", color: "#fff" }}
                      className="text-xs px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity font-medium inline-block"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
