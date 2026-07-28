"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, X, MapPin, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import type { FacilitadorConActividades } from "@/lib/types";

const MapaInteractivo = dynamic(() => import("@/components/MapaInteractivo"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-10 w-10 text-cream-300 mx-auto animate-pulse-subtle" />
        <p className="text-bark/25 mt-3 text-[13px]">Cargando mapa...</p>
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
      results = results.filter((f) =>
        f.actividades.some(
          (a) =>
            normalizeText(a.nombre).includes(q) ||
            normalizeText(a.slug).includes(q)
        )
      );
    }

    return results.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [busqueda, todosFacilitadores]);

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
    router.replace("/mapa", { scroll: false });
  };

  const facilitadoresEnMapa = useMemo(
    () => facilitadoresFiltrados.filter((f) => f.direccion && f.direccion.trim()),
    [facilitadoresFiltrados]
  );

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <div
        className="relative flex flex-col md:flex-row h-[500px] sm:h-[560px] md:h-[620px] lg:h-[660px] rounded-2xl overflow-hidden shadow-2xl border border-cream-200/60 m-6 sm:m-8 lg:m-12"
      >
        {/* Sidebar */}
        <div
          className={`${
            panelAbierto ? "w-full md:w-[360px]" : "w-0"
          } flex-shrink-0 bg-cream-100 border-r border-cream-200 flex flex-col transition-all duration-500 ease-out-expo overflow-hidden`}
        >
        <div className="p-4 border-b border-cream-200/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base font-medium text-bark tracking-tight">
              Actividades
            </h2>
            <span className="text-[11px] text-bark/25 font-mono">
              {cargando ? "..." : `${facilitadoresFiltrados.length}`}
            </span>
          </div>

          {/* Search input */}
          <label className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-bark/30 mb-2 block">
            Actividad
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-bark/20" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Buscá una actividad..."
              className="input-field pl-10 pr-10 py-2.5 text-[13px] w-full"
            />
            {busqueda && (
              <button
                onClick={limpiarBusqueda}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-bark/25" />
              </button>
            )}
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
              <p className="text-bark/25 text-[13px]">
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
                        <div className="flex flex-wrap gap-1 mb-1">
                          {f.actividades.map((a) => (
                            <span
                              key={a.id}
                              className="px-1.5 py-0.5 bg-bark/10 text-bark/60 text-[10px] font-semibold rounded"
                            >
                              {a.nombre}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-medium text-bark text-[13px]">
                          {f.nombre}
                        </h3>
                        {f.direccion && (
                          <p className="text-[11px] text-bark/25 mt-0.5 flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {f.direccion}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-bark/10 shrink-0 mt-1" />
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
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-[1000] bg-cream-100 border border-cream-200 rounded-r-lg p-1.5 shadow-soft hover:bg-cream-200 transition-all duration-300 items-center"
        style={{ left: panelAbierto ? "360px" : "0px" }}
        aria-label={panelAbierto ? "Cerrar panel" : "Abrir panel"}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 text-bark/25 transition-transform duration-300 ${
            panelAbierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapaInteractivo
          facilitadores={facilitadoresEnMapa}
          seleccionado={facilitadorSeleccionado}
          onSeleccionar={setFacilitadorSeleccionado}
        />
      </div>
    </div>
    </div>
  );
}
