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

import { getMarkerColor, getEmoji } from "@/lib/categories";
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

function createIcon(emoji: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 44 : 36;
  const fontSize = isSelected ? "22px" : "18px";
  const bg = isSelected ? "white" : "white";
  const shadow = isSelected
    ? "0 4px 16px rgba(0,0,0,0.25), 0 0 0 3px rgba(90,143,143,0.25)"
    : "0 2px 8px rgba(0,0,0,0.12)";

  return new L.DivIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${fontSize};
      box-shadow: ${shadow};
      border: 2px solid white;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s ease;
    ">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
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
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapEvents onSeleccionar={onSeleccionar} />
      <FocusMarkers markers={markers} selectedId={seleccionado} ciudad={ciudadSeleccionada} />

      {markers.map((m, idx) => {
        const isSelected = seleccionado === m.facilitador.id;
        const slug = m.facilitador.actividades.length > 0
          ? m.facilitador.actividades[0].slug
          : "";
        const emoji = getEmoji(slug);
        const icon = createIcon(emoji, isSelected);

        return (
          <Marker
            key={`${m.facilitador.id}-${m.ubicacion.id || idx}`}
            position={[m.ubicacion.latitud, m.ubicacion.longitud]}
            icon={icon}
            opacity={seleccionado && !isSelected ? 0.35 : 1}
            eventHandlers={{
              click: () => onSeleccionar(m.facilitador.id),
            }}
          >
            <Popup closeButton={true} autoPan={false}>
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
                <p className="text-[11px] text-bark-500 mb-2.5">
                  {m.ubicacion.direccion || "Ubicación sin dirección"}
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
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
