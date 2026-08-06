"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import Link from "next/link";

import { getEmoji, getMarkerColor } from "@/lib/categories";
import ClusteredMarkers from "@/components/ClusteredMarkers";
import { useClickTracker } from "@/lib/useClickTracker";
import { CITY_COORDS, CITY_NAME } from "@/lib/constants";

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

const DEFAULT_CENTER: [number, number] = CITY_COORDS[CITY_NAME] ?? [-38, -57];

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
      map.flyTo(CITY_COORDS[ciudad], 14, { duration: 0.8 });
    }
  }, [ciudad, map]);

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
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapEvents onSeleccionar={onSeleccionar} />
      <FocusMarkers markers={markers} selectedId={seleccionado} ciudad={ciudadSeleccionada} />

      <ClusteredMarkers
        items={markers.map((m) => {
          const slug = m.facilitador.actividades.length > 0
            ? m.facilitador.actividades[0].slug
            : "";
          return {
            id: m.facilitador.id,
            lat: m.ubicacion.latitud,
            lng: m.ubicacion.longitud,
            emoji: getEmoji(slug),
            nombre: m.facilitador.nombre,
            color: getMarkerColor(slug),
            data: m,
          };
        })}
        selectedId={seleccionado}
        onSelect={onSeleccionar}
        dimOthers
        renderPopup={(item) => {
          const m = item.data as MarkerItem;
          return (
            <div className="p-2.5 min-w-[200px] max-w-[260px]">
              <h3 className="font-serif font-medium text-bark text-sm mb-2 leading-tight">
                {m.facilitador.nombre}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {m.facilitador.actividades.map((a) => (
                  <span
                    key={a.id}
                    className="px-2 py-0.5 bg-cream-200/60 text-bark-600 text-[10px] font-medium rounded-full"
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
              <p className="text-[11px] text-bark-500 mb-2.5 flex items-baseline gap-1.5">
    <span>{m.ubicacion.direccion || "Sin dirección"}</span>
    {m.ubicacion.ciudad && (
      <>
        <span className="text-bark-300">·</span>
        <span className="text-bark-400">{m.ubicacion.ciudad}</span>
      </>
    )}
  </p>
              <div className="flex gap-2">
                <Link
                  href={`/facilitadores/${m.facilitador.id}`}
                  className="text-xs px-3 py-1.5 rounded-full font-medium bg-bark popup-btn-white hover:opacity-90 transition-opacity"
                  onClick={() => track("facilitador", m.facilitador.id)}
                >
                  Ver perfil
                </Link>
                {m.facilitador.whatsapp && (
                  <a
                    href={`https://wa.me/${m.facilitador.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full font-medium bg-sage-600 popup-btn-white hover:opacity-90 transition-opacity"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        }}
      />
    </MapContainer>
  );
}
