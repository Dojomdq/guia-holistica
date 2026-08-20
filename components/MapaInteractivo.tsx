"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Navigation,
  Share2,
  Globe,
  Phone,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

import { getCategoryIconSVG, getMarkerColor } from "@/lib/categories";
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
  horarios: string | null;
  sitio_web: string | null;
  telefono: string | null;
  logo_url: string | null;
  actividades: Actividad[];
}

export interface MarkerItem {
  ubicacion: Ubicacion;
  facilitador: FacilitadorMarker;
}

interface Props {
  markers: MarkerItem[];
  seleccionado: string | null;
  onSeleccionar: (id: string | null) => void;
  ciudadSeleccionada?: string | null;
  onOpenBottomSheet?: (marker: MarkerItem) => void;
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

  useEffect(() => {
    if (!selectedId) return;
    const marker = markers.find((m) => m.facilitador.id === selectedId);
    if (marker) {
      map.flyTo(
        [marker.ubicacion.latitud, marker.ubicacion.longitud],
        16,
        { duration: 0.6 }
      );
    }
  }, [selectedId, markers, map]);

  return null;
}

function buildGoogleMapsUrl(lat: number, lng: number, direccion: string | null): string {
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion || "")}`;
}

async function handleShare(nombre: string, id: string) {
  const url = `${window.location.origin}/facilitadores/${id}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: nombre, url });
    } catch {
      /* user cancelled */
    }
  } else {
    await navigator.clipboard.writeText(url);
  }
}

export function PopupContent({
  m,
  track,
}: {
  m: MarkerItem;
  track: (tipo: string, ref: string) => void;
}) {
  const f = m.facilitador;
  const primarySlug = f.actividades.length > 0 ? f.actividades[0].slug : "";
  const gmapsUrl = buildGoogleMapsUrl(
    m.ubicacion.latitud,
    m.ubicacion.longitud,
    m.ubicacion.direccion
  );

  return (
    <div className="p-3 min-w-[240px] max-w-[300px]">
      <div className="flex items-start gap-3 mb-2">
        {f.foto_url ? (
          <img
            src={f.foto_url}
            alt={f.nombre}
            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-cream-200"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-serif font-medium text-sm"
            style={{ backgroundColor: getMarkerColor(primarySlug) }}
          >
            {f.nombre
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif font-medium text-bark text-sm leading-tight truncate">
            {f.nombre}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {f.actividades.map((a) => (
              <span
                key={a.id}
                className="px-1.5 py-0.5 bg-cream-200/60 text-bark-600 text-[10px] font-medium rounded-full"
              >
                {a.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-bark-500 flex items-center gap-1 mb-1.5">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">
          {m.ubicacion.direccion || "Sin dirección"}
          {m.ubicacion.ciudad ? `, ${m.ubicacion.ciudad}` : ""}
        </span>
      </p>

      {f.bio && (
        <p className="text-[11px] text-bark-600 mb-2 leading-relaxed line-clamp-2">
          {f.bio}
        </p>
      )}

      {f.horarios && (
        <p className="text-[11px] text-bark-500 flex items-center gap-1 mb-2">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="truncate">{f.horarios}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full font-medium bg-cream-200/60 text-bark-700 hover:bg-cream-200 transition-colors"
          onClick={() => track("como_llegar", f.id)}
        >
          <Navigation className="h-3 w-3" />
          Cómo llegar
        </a>
        {f.whatsapp && (
          <a
            href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full font-medium bg-sage-600 popup-btn-white hover:bg-sage-700 transition-colors"
            onClick={() => track("whatsapp", f.id)}
          >
            WhatsApp
          </a>
        )}
        <button
          className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full font-medium bg-cream-200/60 text-bark-700 hover:bg-cream-200 transition-colors"
          onClick={() => handleShare(f.nombre, f.id)}
        >
          <Share2 className="h-3 w-3" />
          Compartir
        </button>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-cream-200/60">
        <Link
          href={`/facilitadores/${f.id}`}
          className="inline-flex items-center gap-1 text-[10px] font-medium text-sage-600 hover:text-sage-700 transition-colors"
          onClick={() => track("facilitador", f.id)}
        >
          Ver perfil
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {(f.instagram || f.whatsapp || f.sitio_web || f.telefono) && (
        <div className="pt-2.5 mt-2.5 border-t border-cream-200/60">
          <p className="text-[10px] text-bark-400/60 font-medium tracking-wide uppercase mb-2">Redes</p>
          <div className="flex items-center gap-2">
            {f.instagram && (
              <a
                href={`https://www.instagram.com/${f.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-sage-50 text-bark-400 hover:text-clay hover:bg-sage-100 transition-colors"
                onClick={() => track("instagram", f.id)}
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {f.whatsapp && (
              <a
                href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-sage-50 text-bark-400 hover:text-clay hover:bg-sage-100 transition-colors"
                onClick={() => track("whatsapp", f.id)}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            {f.sitio_web && (
              <a
                href={f.sitio_web.startsWith("http") ? f.sitio_web : `https://${f.sitio_web}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-sage-50 text-bark-400 hover:text-clay hover:bg-sage-100 transition-colors"
                onClick={() => track("sitio_web", f.id)}
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            {f.telefono && (
              <a
                href={`tel:${f.telefono}`}
                className="p-1.5 rounded-full bg-sage-50 text-bark-400 hover:text-clay hover:bg-sage-100 transition-colors"
                onClick={() => track("telefono", f.id)}
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapaInteractivo({
  markers,
  seleccionado,
  onSeleccionar,
  ciudadSeleccionada,
  onOpenBottomSheet,
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents onSeleccionar={onSeleccionar} />
      <FocusMarkers markers={markers} selectedId={seleccionado} ciudad={ciudadSeleccionada} />

      <ClusteredMarkers
        items={markers.map((m) => {
          const slug =
            m.facilitador.actividades.length > 0
              ? m.facilitador.actividades[0].slug
              : "";
          return {
            id: m.facilitador.id,
            lat: m.ubicacion.latitud,
            lng: m.ubicacion.longitud,
            emoji: "",
            nombre: m.facilitador.nombre,
            color: getMarkerColor(slug),
            iconSvg: getCategoryIconSVG(slug),
            data: m,
          };
        })}
        selectedId={seleccionado}
        onSelect={(id) => {
          onSeleccionar(id);
          if (onOpenBottomSheet) {
            const marker = markers.find((m) => m.facilitador.id === id);
            if (marker) onOpenBottomSheet(marker);
          }
        }}
        dimOthers
        renderPopup={(item) => {
          const m = item.data as MarkerItem;
          return <PopupContent m={m} track={track} />;
        }}
      />
    </MapContainer>
  );
}
