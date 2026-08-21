"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  X,
  MapPin,
  Clock,
  Navigation,
  Globe,
  Phone,
  ExternalLink,
  MessageCircle,
  ChevronDown,
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
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
  getCategoryIcon,
  CATEGORY_MARKER_COLORS,
} from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import type { FacilitadorConActividades, Ubicacion } from "@/lib/types";

const MapaInteractivo = dynamic(() => import("@/components/MapaInteractivo"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-10 w-10 text-cream-300 mx-auto animate-pulse-subtle" />
        <p className="text-bark-400 mt-3 text-[13px]">Cargando mapa...</p>
      </div>
    </div>
  ),
});

interface Actividad {
  id: string;
  nombre: string;
  slug: string;
}

interface FacilitadorConUbi {
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
  ubicaciones: Ubicacion[];
}

interface MarkerItem {
  ubicacion: Ubicacion;
  facilitador: FacilitadorConUbi;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function MapaPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [busqueda, setBusqueda] = useState(searchParams.get("q") || "");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(
    searchParams.get("ciudad") || null
  );
  const [actividadSeleccionada, setActividadSeleccionada] = useState<string | null>(null);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);
  const [facilitadorSeleccionado, setFacilitadorSeleccionado] = useState<string | null>(null);
  const [todosFacilitadores, setTodosFacilitadores] = useState<FacilitadorConUbi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [bottomSheetMarker, setBottomSheetMarker] = useState<MarkerItem | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const track = useClickTracker();
  const busquedaDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (busquedaDebounceRef.current) clearTimeout(busquedaDebounceRef.current);
    if (busqueda.trim()) {
      busquedaDebounceRef.current = setTimeout(() => {
        track("busqueda", busqueda.trim().toLowerCase());
      }, 1200);
    }
    return () => {
      if (busquedaDebounceRef.current) clearTimeout(busquedaDebounceRef.current);
    };
  }, [busqueda, track]);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("facilitadores")
        .select(
          "*, facilitador_actividades(actividades(id, nombre, slug)), ubicaciones(*)"
        )
        .eq("activo", true)
        .order("nombre");

      if (data) {
        const mapped: FacilitadorConUbi[] = (data as any[]).map((row) => ({
          id: row.id,
          nombre: row.nombre,
          bio: row.bio,
          whatsapp: row.whatsapp,
          instagram: row.instagram,
          foto_url: row.foto_url,
          horarios: row.horarios,
          sitio_web: row.sitio_web,
          telefono: row.telefono,
          logo_url: row.logo_url || null,
          actividades: (row.facilitador_actividades || []).map((fa: any) => ({
            id: fa.actividades.id,
            nombre: fa.actividades.nombre,
            slug: fa.actividades.slug,
          })),
          ubicaciones: (row.ubicaciones || []).map((u: any) => ({
            id: u.id,
            facilitador_id: u.facilitador_id,
            direccion: u.direccion,
            latitud: u.latitud,
            longitud: u.longitud,
            ciudad: u.ciudad,
            created_at: u.created_at,
          })),
        }));
        setTodosFacilitadores(mapped);

        const ciudades = new Set<string>();
        mapped.forEach((f) =>
          f.ubicaciones.forEach((u) => {
            if (u.ciudad) ciudades.add(u.ciudad);
          })
        );
        const sorted = Array.from(ciudades).sort((a, b) => a.localeCompare(b));
        setCiudadesDisponibles(sorted);
      }
      setCargando(false);
    }
    cargar();
  }, []);

  useEffect(() => {
    if (
      !cargando &&
      busqueda.trim() &&
      ciudadesDisponibles.length > 0 &&
      !ciudadSeleccionada
    ) {
      const q = normalizeText(busqueda.trim());
      const match = ciudadesDisponibles.find(
        (c) =>
          normalizeText(c).includes(q) ||
          normalizeText(q).includes(normalizeText(c))
      );
      if (match) setCiudadSeleccionada(match);
    }
  }, [cargando, busqueda, ciudadesDisponibles, ciudadSeleccionada]);

  const facilitadoresFiltrados = useMemo(() => {
    let results = todosFacilitadores;

    if (ciudadSeleccionada) {
      results = results.filter((f) =>
        f.ubicaciones.some(
          (u) => normalizeText(u.ciudad) === normalizeText(ciudadSeleccionada)
        )
      );
    }

    if (actividadSeleccionada) {
      results = results.filter((f) =>
        f.actividades.some(
          (a) => normalizeText(a.slug) === normalizeText(actividadSeleccionada)
        )
      );
    }

    if (busqueda.trim()) {
      const q = normalizeText(busqueda.trim());
      results = results.filter(
        (f) =>
          normalizeText(f.nombre).includes(q) ||
          f.actividades.some(
            (a) =>
              normalizeText(a.nombre).includes(q) ||
              normalizeText(a.slug).includes(q)
          ) ||
          f.ubicaciones.some((u) => normalizeText(u.ciudad).includes(q))
      );
    }

    return results.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [busqueda, ciudadSeleccionada, actividadSeleccionada, todosFacilitadores]);

  useEffect(() => {
    if (!cargando && busqueda.trim() && facilitadoresFiltrados.length === 0) {
      track("busqueda_sin_resultado", busqueda.trim().toLowerCase());
    }
  }, [cargando, busqueda, facilitadoresFiltrados.length, track]);

  const markers: MarkerItem[] = useMemo(() => {
    const items: MarkerItem[] = [];
    facilitadoresFiltrados.forEach((f) =>
      f.ubicaciones.forEach((u) => {
        if (u.latitud && u.longitud) {
          items.push({ ubicacion: u, facilitador: f });
        }
      })
    );
    return items;
  }, [facilitadoresFiltrados]);

  const allActividades = useMemo(() => {
    const map = new Map<string, { nombre: string; slug: string; count: number }>();
    todosFacilitadores.forEach((f) =>
      f.actividades.forEach((a) => {
        const existing = map.get(a.slug);
        if (existing) existing.count++;
        else map.set(a.slug, { nombre: a.nombre, slug: a.slug, count: 1 });
      })
    );
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [todosFacilitadores]);

  const handleBusqueda = useCallback(
    (value: string) => {
      setBusqueda(value);
      setFacilitadorSeleccionado(null);
      setBottomSheetMarker(null);
      setShowBottomSheet(false);
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.replace(`/mapa?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const limpiarBusqueda = () => {
    setBusqueda("");
    setCiudadSeleccionada(null);
    setActividadSeleccionada(null);
    setFacilitadorSeleccionado(null);
    setBottomSheetMarker(null);
    setShowBottomSheet(false);
    router.replace("/mapa", { scroll: false });
  };

  const handleOpenBottomSheet = (marker: MarkerItem) => {
    setBottomSheetMarker(marker);
    setShowBottomSheet(true);
  };

  const mostrarSelectorCiudad = ciudadesDisponibles.length > 1;
  const hasActiveFilters = !!(busqueda.trim() || ciudadSeleccionada || actividadSeleccionada);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-cream-100">
      {/* Fullscreen map */}
      <div className="absolute inset-0 z-0">
        <MapaInteractivo
          markers={markers}
          seleccionado={facilitadorSeleccionado}
          onSeleccionar={(id) => {
            setFacilitadorSeleccionado(id);
            if (!id) {
              setBottomSheetMarker(null);
              setShowBottomSheet(false);
            }
          }}
          ciudadSeleccionada={ciudadSeleccionada}
          onOpenBottomSheet={handleOpenBottomSheet}
        />
      </div>

      {/* Floating search + filters — top left (hidden on mobile when bottom sheet is open) */}
      <div className={`absolute top-20 left-3 sm:left-4 z-20 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] sm:max-w-[420px] ${showBottomSheet ? "hidden sm:block" : ""}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-cream-200/80 overflow-hidden">
          {/* Search input */}
          <div className="relative px-3 py-2.5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-bark-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Buscar actividad, facilitador o lugar..."
              className="w-full pl-10 pr-10 py-2.5 text-[13px] rounded-xl bg-cream-50 border border-cream-200 text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400 transition-all"
            />
            {busqueda && (
              <button
                onClick={limpiarBusqueda}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-cream-200/80 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4 text-bark-400" />
              </button>
            )}
          </div>

          {/* City selector */}
          {mostrarSelectorCiudad && (
            <div className="px-3 pb-2">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {ciudadesDisponibles.map((ciudad) => {
                  const isActive = ciudadSeleccionada === ciudad;
                  return (
                    <button
                      key={ciudad}
                      onClick={() => {
                        const nueva = isActive ? null : ciudad;
                        setCiudadSeleccionada(nueva);
                        setFacilitadorSeleccionado(null);
                        setBottomSheetMarker(null);
                        setShowBottomSheet(false);
                      }}
                      className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border ${
                        isActive
                          ? "bg-bark text-white border-bark shadow-sm"
                          : "bg-white text-bark-600 border-cream-200 hover:border-cream-300"
                      }`}
                    >
                      {ciudad}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity chips */}
          <div className="px-3 pb-2.5">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActividadSeleccionada(null)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 border ${
                  !actividadSeleccionada
                    ? "bg-sage-600 text-white border-sage-600 shadow-sm"
                    : "bg-white text-bark-600 border-cream-200 hover:border-cream-300"
                }`}
              >
                Todas
              </button>
              {allActividades.map((act) => {
                const Icon = getCategoryIcon(act.slug);
                const isActive = actividadSeleccionada === act.slug;
                return (
                  <button
                    key={act.slug}
                    onClick={() =>
                      setActividadSeleccionada(isActive ? null : act.slug)
                    }
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 border ${
                      isActive
                        ? "bg-sage-600 text-white border-sage-600 shadow-sm"
                        : "bg-white text-bark-600 border-cream-200 hover:border-cream-300"
                    }`}
                  >
                    <Icon className="h-2.5 w-2.5" strokeWidth={2} />
                    {act.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active filter indicator */}
        {hasActiveFilters && (
          <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow border border-cream-200/80 text-[11px]">
            <span className="text-bark-600 truncate">
              {ciudadSeleccionada && <span className="font-medium">{ciudadSeleccionada}</span>}
              {busqueda.trim() && ciudadSeleccionada && " · "}
              {busqueda.trim() && <span>{busqueda}</span>}
              {actividadSeleccionada && (
                <>
                  {(busqueda.trim() || ciudadSeleccionada) && " · "}
                  <span className="font-medium capitalize">{actividadSeleccionada.replace(/-/g, " ")}</span>
                </>
              )}
              <span className="text-bark-400 ml-1">({markers.length})</span>
            </span>
            <button onClick={limpiarBusqueda} className="shrink-0 ml-auto p-0.5 rounded hover:bg-cream-200 transition-colors" aria-label="Limpiar filtros">
              <X className="h-3.5 w-3.5 text-bark-400" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom sheet — marker detail */}
      {showBottomSheet && bottomSheetMarker && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => {
            setShowBottomSheet(false);
            setBottomSheetMarker(null);
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-cream-50 rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto bottom-sheet-animate"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-cream-300 rounded-full mx-auto mt-3 mb-1" />
            <PopupContentInternal marker={bottomSheetMarker} />
          </div>
        </div>
      )}
    </div>
  );
}

function PopupContentInternal({ marker }: { marker: MarkerItem }) {
  const f = marker.facilitador;
  const primarySlug = f.actividades.length > 0 ? f.actividades[0].slug : "";
  const color = CATEGORY_MARKER_COLORS[primarySlug] || "#5d8a6e";
  const gmapsUrl =
    marker.ubicacion.latitud && marker.ubicacion.longitud
      ? `https://www.google.com/maps/dir/?api=1&destination=${marker.ubicacion.latitud},${marker.ubicacion.longitud}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(marker.ubicacion.direccion || "")}`;

  return (
    <div className="p-4 pb-8">
      <div className="flex items-start gap-3 mb-3">
        {f.foto_url ? (
          <img
            src={f.foto_url}
            alt={f.nombre}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-cream-200"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white font-serif font-medium text-lg"
            style={{ backgroundColor: color }}
          >
            {f.nombre
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif font-medium text-bark text-base leading-tight">
            {f.nombre}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {f.actividades.map((a) => (
              <span
                key={a.id}
                className="px-2 py-0.5 bg-cream-200/60 text-bark-600 text-[11px] font-medium rounded-full"
              >
                {a.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[12px] text-bark-500 flex items-center gap-1.5 mb-2">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {marker.ubicacion.direccion || "Sin dirección"}
        {marker.ubicacion.ciudad ? `, ${marker.ubicacion.ciudad}` : ""}
      </p>

      {f.bio && (
        <p className="text-[12px] text-bark-600 mb-3 leading-relaxed">
          {f.bio}
        </p>
      )}

      {f.horarios && (
        <p className="text-[12px] text-bark-500 flex items-center gap-1.5 mb-3">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {f.horarios}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-medium bg-bark text-white hover:bg-bark/85 transition-colors"
        >
          <Navigation className="h-3.5 w-3.5" />
          Cómo llegar
        </a>
        {f.whatsapp && (
          <a
            href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-medium bg-sage-600 text-white hover:bg-sage-700 transition-colors"
          >
            WhatsApp
          </a>
        )}
      </div>

      <div className="pt-3 border-t border-cream-200/60">
        <p className="text-[10px] text-bark-400/60 font-medium tracking-wide uppercase mb-2">Redes</p>
        <div className="flex items-center gap-2 flex-wrap">
          {f.instagram && (
            <a
              href={`https://www.instagram.com/${f.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sage-50 rounded-full p-1.5 text-bark-500 hover:text-clay transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
          {f.whatsapp && (
            <a
              href={`https://wa.me/${f.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, te contacto desde la Guía de Bienestar")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sage-50 rounded-full p-1.5 text-bark-500 hover:text-clay transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
          {f.sitio_web && (
            <a
              href={f.sitio_web.startsWith("http") ? f.sitio_web : `https://${f.sitio_web}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sage-50 rounded-full p-1.5 text-bark-500 hover:text-clay transition-colors"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
          {f.telefono && (
            <a
              href={`tel:${f.telefono}`}
              className="bg-sage-50 rounded-full p-1.5 text-bark-500 hover:text-clay transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          <Link
            href={`/facilitadores/${f.id}`}
            className="ml-auto text-[12px] font-medium text-sage-600 hover:text-sage-700 transition-colors flex items-center gap-1"
          >
            Ver perfil
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
