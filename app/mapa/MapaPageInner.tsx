"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, X, MapPin, ChevronRight, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import type { FacilitadorConActividades } from "@/lib/types";

const MapaInteractivo = dynamic(() => import("@/components/MapaInteractivo"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-10 w-10 text-cream-300 mx-auto animate-pulse-subtle" />
        <p className="text-warmblack/25 mt-3 text-[13px]">Cargando mapa...</p>
      </div>
    </div>
  ),
});

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

const FILTROS = [
  { label: "Todas", slug: null },
  { label: "Yoga", slug: "yoga" },
  { label: "Reiki", slug: "reiki" },
  { label: "Meditación", slug: "meditacion" },
  { label: "Biodanza", slug: "biodanza" },
  { label: "Chamanismo", slug: "chamanismo" },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function mapToFacilitador(row: FacilitadorConActividades): Facilitador {
  return {
    id: row.id,
    nombre: row.nombre,
    bio: row.bio,
    direccion: row.direccion,
    latitud: row.latitud,
    longitud: row.longitud,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    foto_url: row.foto_url,
    actividades: (row.facilitador_actividades || []).map((fa) => ({
      id: fa.actividades.id,
      nombre: fa.actividades.nombre,
      slug: fa.actividades.slug,
    })),
  };
}

export default function MapaPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [busqueda, setBusqueda] = useState(initialQuery);
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  const [facilitadorSeleccionado, setFacilitadorSeleccionado] = useState<string | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(true);
  const [todosFacilitadores, setTodosFacilitadores] = useState<Facilitador[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("facilitadores")
        .select("*, facilitador_actividades(actividades(id, nombre, slug))")
        .eq("activo", true)
        .order("nombre");

      if (data) {
        setTodosFacilitadores(data.map(mapToFacilitador));
      }
      setCargando(false);
    }
    cargar();
  }, []);

  const facilitadoresFiltrados = useMemo(() => {
    let results = todosFacilitadores;

    if (busqueda.trim()) {
      const q = normalizeText(busqueda.trim());
      results = results.filter((f) => {
        const matchActividad = f.actividades.some(
          (a) =>
            normalizeText(a.nombre).includes(q) ||
            normalizeText(a.slug).includes(q)
        );
        const matchNombre = normalizeText(f.nombre).includes(q);
        const matchBio = f.bio ? normalizeText(f.bio).includes(q) : false;
        return matchActividad || matchNombre || matchBio;
      });
    }

    if (filtroActivo) {
      const catSlug = normalizeText(filtroActivo);
      results = results.filter((f) =>
        f.actividades.some(
          (a) =>
            normalizeText(a.slug).includes(catSlug) ||
            normalizeText(a.nombre).includes(catSlug)
        )
      );
    }

    return results;
  }, [busqueda, filtroActivo, todosFacilitadores]);

  const handleBusqueda = useCallback(
    (value: string) => {
      setBusqueda(value);
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.replace(`/mapa?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const limpiarBusqueda = () => {
    setBusqueda("");
    setFiltroActivo(null);
    router.replace("/mapa", { scroll: false });
  };

  const facilitadoresEnMapa = useMemo(
    () => facilitadoresFiltrados.filter((f) => f.direccion && f.direccion.trim()),
    [facilitadoresFiltrados]
  );

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Sidebar */}
      <div
        className={`${
          panelAbierto ? "w-full md:w-[360px]" : "w-0"
        } flex-shrink-0 bg-cream-100 border-r border-cream-200 flex flex-col transition-all duration-500 ease-out-expo overflow-hidden`}
      >
        <div className="p-4 border-b border-cream-200/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base font-medium text-warmblack tracking-tight">
              Facilitadores
            </h2>
            <span className="text-[11px] text-warmblack/25 font-mono">
              {cargando ? "..." : `${facilitadoresFiltrados.length}`}
            </span>
          </div>

          {/* Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-warmblack/20" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Buscar por nombre o actividad..."
              className="input-field pl-10 pr-10 py-2.5 text-[13px] w-full"
            />
            {busqueda && (
              <button
                onClick={limpiarBusqueda}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-warmblack/25" />
              </button>
            )}
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-3.5 w-3.5 text-warmblack/20 shrink-0" />
            {FILTROS.map((f) => {
              const isActive =
                f.slug === null
                  ? filtroActivo === null
                  : normalizeText(filtroActivo || "") === normalizeText(f.label);
              return (
                <button
                  key={f.label}
                  onClick={() =>
                    setFiltroActivo(isActive ? null : f.slug ? f.label : null)
                  }
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-warmblack text-white"
                      : "bg-cream-200/50 text-warmblack/45 hover:text-warmblack/70 border border-cream-200 hover:border-cream-300"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {cargando ? (
            <div className="p-4 animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="h-9 w-9 rounded-lg bg-cream-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-cream-200 rounded w-2/3" />
                    <div className="h-2 bg-cream-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : facilitadoresFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-warmblack/25 text-[13px]">
                No se encontraron facilitadores
              </p>
              <button
                onClick={limpiarBusqueda}
                className="mt-2 text-sage-600 text-[13px] font-medium hover:text-sage-700 transition-colors"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="divide-y divide-cream-200/50">
              {facilitadoresFiltrados.map((f) => {
                const Icon = getCategoryIcon(
                  f.actividades.length > 0 ? f.actividades[0].slug : ""
                );
                const color =
                  CATEGORY_MARKER_COLORS[
                    f.actividades.length > 0 ? f.actividades[0].slug : ""
                  ] || "#5d8a6e";
                return (
                  <button
                    key={f.id}
                    onClick={() =>
                      setFacilitadorSeleccionado(
                        facilitadorSeleccionado === f.id ? null : f.id
                      )
                    }
                    className={`w-full p-3.5 text-left hover:bg-cream-200/40 transition-all duration-200 ${
                      facilitadorSeleccionado === f.id ? "bg-cream-200/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                        style={{ backgroundColor: `${color}08` }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-warmblack text-[13px] truncate">
                          {f.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {f.actividades.map((a) => (
                            <span
                              key={a.id}
                              className="px-1.5 py-0.5 bg-cream-200/60 text-warmblack/40 text-[10px] rounded"
                            >
                              {a.nombre}
                            </span>
                          ))}
                        </div>
                        {f.direccion && (
                          <p className="text-[11px] text-warmblack/25 mt-1 flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {f.direccion}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-warmblack/10 shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setPanelAbierto(!panelAbierto)}
        className="hidden md:block absolute top-[88px] z-[1000] bg-cream-100 border border-cream-200 rounded-r-lg p-1.5 shadow-soft hover:bg-cream-200 transition-all duration-300"
        style={{ left: panelAbierto ? "360px" : "0px" }}
        aria-label={panelAbierto ? "Cerrar panel" : "Abrir panel"}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 text-warmblack/25 transition-transform duration-300 ${
            panelAbierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Map */}
      <div className="flex-1 relative min-h-[50vh] md:min-h-0">
        <MapaInteractivo
          facilitadores={facilitadoresEnMapa}
          seleccionado={facilitadorSeleccionado}
          onSeleccionar={setFacilitadorSeleccionado}
        />
      </div>
    </div>
  );
}
