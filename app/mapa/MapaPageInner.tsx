"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, X, MapPin, ChevronRight, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
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
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(null);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);
  const [facilitadorSeleccionado, setFacilitadorSeleccionado] = useState<string | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [todosFacilitadores, setTodosFacilitadores] = useState<FacilitadorConUbi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setPanelAbierto(true);
    if (busqueda.trim()) setPanelAbierto(true);
  }, [isMobile, busqueda]);

  useEffect(() => {
    if (isMobile && ciudadSeleccionada) {
      setPanelAbierto(false);
    }
  }, [ciudadSeleccionada, isMobile]);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("facilitadores")
        .select("*, facilitador_actividades(actividades(id, nombre, slug)), ubicaciones(*)")
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

        const ciudades = new Set<string>(["Mar del Plata", "Bahía Blanca"]);
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

  const facilitadoresFiltrados = useMemo(() => {
    let results = todosFacilitadores;

    if (ciudadSeleccionada) {
      results = results.filter((f) =>
        f.ubicaciones.some(
          (u) => normalizeText(u.ciudad) === normalizeText(ciudadSeleccionada)
        )
      );
    }

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
  }, [busqueda, ciudadSeleccionada, todosFacilitadores]);

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

  const handleBusqueda = useCallback(
    (value: string) => {
      setBusqueda(value);
      setFacilitadorSeleccionado(null);
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.replace(`/mapa?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const limpiarBusqueda = () => {
    setBusqueda("");
    setCiudadSeleccionada(null);
    setFacilitadorSeleccionado(null);
    router.replace("/mapa", { scroll: false });
  };

  const mostrarSelectorCiudad = ciudadesDisponibles.length > 1;

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <div
        className="relative flex flex-col md:flex-row h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] rounded-2xl shadow-2xl border border-cream-200/60 mx-4 sm:mx-6 lg:mx-8 my-4"
      >
        {/* Sidebar */}
        <div
          className={`${
            panelAbierto ? "w-full md:w-[300px]" : "w-0"
          } flex-shrink-0 bg-cream-100 border-r border-cream-200 flex flex-col transition-all duration-500 ease-out-expo overflow-hidden`}
        >
        <div className="p-4 border-b border-cream-200/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base font-medium text-bark tracking-tight">
              Actividades
            </h2>
            {ciudadSeleccionada && (
              <span className="text-[11px] text-bark-400 font-mono">
                {cargando ? "..." : `${facilitadoresFiltrados.length}`}
              </span>
            )}
          </div>

          {/* City selector */}
          {mostrarSelectorCiudad && (
            <div className="mb-3">
              <label className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-bark-500 mb-1.5 block">
                Ciudad
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ciudadesDisponibles.map((ciudad) => {
                  const isActive = ciudadSeleccionada === ciudad;
                  return (
                    <button
                      key={ciudad}
                      onClick={() => {
                        setCiudadSeleccionada(isActive ? null : ciudad);
                        setFacilitadorSeleccionado(null);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-bark text-white shadow-sm"
                          : "bg-cream-200/60 text-bark-600 hover:text-bark-800 border border-cream-200 hover:border-cream-300"
                      }`}
                    >
                      {ciudad}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search input */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-bark-500 sr-only">
              Actividad
            </label>
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-bark-300" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
                placeholder="Buscá una actividad..."
                className="input-field pl-10 pr-10 py-2.5 text-[13px] w-full"
                disabled={!ciudadSeleccionada && mostrarSelectorCiudad}
              />
              {busqueda && (
                <button
                  onClick={limpiarBusqueda}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-cream-200/80 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4 text-bark-400" />
                </button>
              )}
            </div>
            {(busqueda || ciudadSeleccionada) && (
              <button
                onClick={limpiarBusqueda}
                className="shrink-0 px-3 py-2 text-[11px] font-medium text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
              >
                Volver
              </button>
            )}
          </div>
          {!ciudadSeleccionada && mostrarSelectorCiudad && (
            <p className="text-[11px] text-bark-400 mt-2 text-center">
              Seleccioná una ciudad para explorar actividades
            </p>
          )}
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
          ) : !busqueda.trim() ? (
            <div className="p-8 text-center">
              <MapPin className="h-8 w-8 text-bark-300 mx-auto mb-3" />
              <p className="text-bark-400 text-[13px] leading-relaxed">
                {ciudadSeleccionada
                  ? `${facilitadoresFiltrados.length} facilitadores en ${ciudadSeleccionada}`
                  : "Buscá una actividad para ver resultados"}
              </p>
            </div>
          ) : facilitadoresFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-bark-400 text-[13px] mb-3">
                No se encontraron resultados
              </p>
              <button
                onClick={limpiarBusqueda}
                className="text-sage-600 text-[13px] font-medium hover:text-sage-700 transition-colors"
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
                const tieneMultiplesUbi = f.ubicaciones.filter(
                  (u) => u.latitud && u.longitud
                ).length > 1;
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
                              className="px-1.5 py-0.5 bg-bark/10 text-bark-700 text-[10px] font-semibold rounded"
                            >
                              {a.nombre}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-medium text-bark text-[13px]">
                          {f.nombre}
                        </h3>
                        {f.ubicaciones.map((u, i) => (
                          <p
                            key={u.id}
                            className="text-[11px] text-bark-400 mt-0.5 flex items-center gap-1"
                          >
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            {tieneMultiplesUbi && (
                              <span className="text-bark-300 font-mono text-[10px] mr-0.5">
                                {i + 1}.
                              </span>
                            )}
                            <span className="truncate">{u.direccion}</span>
                          </p>
                        ))}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-bark-300 shrink-0 mt-1" />
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
        className="flex absolute top-1/2 -translate-y-1/2 z-[1000] bg-cream-100 border border-cream-200 rounded-r-lg p-1.5 shadow-soft hover:bg-cream-200 transition-all duration-300 items-center"
        style={{ left: panelAbierto ? "300px" : "0px" }}
        aria-label={panelAbierto ? "Cerrar panel" : "Abrir panel"}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 text-bark-400 transition-transform duration-300 ${
            panelAbierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapaInteractivo
          markers={markers}
          seleccionado={facilitadorSeleccionado}
          onSeleccionar={setFacilitadorSeleccionado}
          ciudadSeleccionada={ciudadSeleccionada}
        />
      </div>
    </div>
    </div>
  );
}
