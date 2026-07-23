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

function FlyToFacilitador({
  facilitador,
}: {
  facilitador: Facilitador | undefined;
}) {
  const map = useMap();
  useEffect(() => {
    if (facilitador) {
      map.flyTo([facilitador.latitud, facilitador.longitud], 15, {
        duration: 0.8,
      });
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
              <div className="p-2 min-w-[220px]">
                <h3 className="font-serif font-medium text-warmblack text-sm mb-1.5">
                  {f.nombre}
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {f.actividades.map((a) => (
                    <span
                      key={a.id}
                      className="px-2 py-0.5 bg-cream-200/60 text-warmblack/50 text-[11px] rounded-full"
                    >
                      {a.nombre}
                    </span>
                  ))}
                </div>
                {f.bio && (
                  <p className="text-xs text-warmblack/40 mb-2 line-clamp-2 leading-relaxed">
                    {f.bio}
                  </p>
                )}
                {f.direccion && (
                  <p className="text-[11px] text-warmblack/30 mb-2.5">
                    {f.direccion}
                  </p>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/facilitadores/${f.id}`}
                    className="text-xs bg-warmblack text-white px-3 py-1.5 rounded-full hover:bg-warmblack/90 transition-colors font-medium"
                    onClick={() => track("facilitador", f.id)}
                  >
                    Ver perfil
                  </Link>
                  {f.whatsapp && (
                    <a
                      href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-sage-600 text-white px-3 py-1.5 rounded-full hover:bg-sage-700 transition-colors font-medium"
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
