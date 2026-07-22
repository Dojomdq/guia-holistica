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

interface Actividad {
  id: string;
  nombre: string;
  slug: string;
}

interface Facilitador {
  id: string;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  latitud: number;
  longitud: number;
  whatsapp: string | null;
  instagram: string | null;
  foto_url: string | null;
  actividades: Actividad[];
}

interface Props {
  facilitadores: Facilitador[];
  seleccionado: string | null;
  onSeleccionar: (id: string | null) => void;
}

function createIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 38 : 28;
  const borderW = isSelected ? 3 : 2;

  return new L.DivIcon({
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:${borderW}px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;${isSelected ? `box-shadow:0 0 0 3px ${color}33, 0 2px 8px rgba(0,0,0,0.25);` : ""}transition:all .15s ease"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const DEFAULT_CENTER: [number, number] = [-38.0055, -57.5426];

function MapEvents({ onSeleccionar }: { onSeleccionar: (id: string | null) => void }) {
  useMapEvents({ click: () => onSeleccionar(null) });
  return null;
}

function FlyToFacilitador({ facilitador }: { facilitador: Facilitador | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (facilitador) {
      map.flyTo([facilitador.latitud, facilitador.longitud], 15, { duration: 0.8 });
    }
  }, [facilitador, map]);
  return null;
}

export default function MapaInteractivo({
  facilitadores,
  seleccionado,
  onSeleccionar,
}: Props) {
  const seleccionadoData = facilitadores.find((f) => f.id === seleccionado);

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
      <FlyToFacilitador facilitador={seleccionadoData} />

      {facilitadores.map((f) => {
        const isSelected = seleccionado === f.id;
        const color = getMarkerColor(
          f.actividades.length > 0 ? f.actividades[0].slug : ""
        );
        const icon = createIcon(color, isSelected);

        return (
          <Marker
            key={f.id}
            position={[f.latitud, f.longitud]}
            icon={icon}
            eventHandlers={{ click: () => onSeleccionar(f.id) }}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-sm text-gray-800 mb-1">{f.nombre}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {f.actividades.map((a) => (
                    <span key={a.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {a.nombre}
                    </span>
                  ))}
                </div>
                {f.bio && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{f.bio}</p>}
                {f.direccion && <p className="text-xs text-gray-400 mb-2">{f.direccion}</p>}
                <div className="flex gap-2">
                  <Link
                    href={`/facilitadores/${f.id}`}
                    className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    Ver perfil
                  </Link>
                  {f.whatsapp && (
                    <a
                      href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
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
