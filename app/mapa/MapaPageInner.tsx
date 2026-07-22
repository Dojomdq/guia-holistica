"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, X, MapPin, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon } from "@/lib/categories";
import type { FacilitadorConActividades } from "@/lib/types";

const MapaInteractivo = dynamic(() => import("@/components/MapaInteractivo"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-stone-300 mx-auto animate-pulse" />
        <p className="text-gray-400 mt-2">Cargando mapa...</p>
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
  const [categorias, setCategorias] = useState<{ slug: string; nombre: string }[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [fRes, cRes] = await Promise.all([
        supabase
          .from("facilitadores")
          .select("*, facilitador_actividades(actividades(id, nombre, slug))")
          .eq("activo", true)
          .order("nombre"),
        supabase
          .from("categorias")
          .select("slug, nombre, icono")
          .order("nombre"),
      ]);

      if (fRes.data) {
        setTodosFacilitadores(fRes.data.map(mapToFacilitador));
      }
      if (cRes.data) {
        setCategorias(cRes.data.map((c) => ({
          slug: c.slug,
          nombre: c.nombre,
        })));
      }
      setCargando(false);
    }
    cargar();
  }, []);

  const facilitadoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return todosFacilitadores;

    const q = normalizeText(busqueda.trim());
    return todosFacilitadores.filter((f) => {
      const matchActividad = f.actividades.some(
        (a) =>
          normalizeText(a.nombre).includes(q) ||
          normalizeText(a.slug).includes(q)
      );
      const matchCategoria = categorias.some(
        (c) =>
          normalizeText(c.nombre).includes(q) &&
          f.actividades.some((a) => {
            const catSlug = c.slug;
            return normalizeText(a.slug).includes(catSlug) || normalizeText(a.nombre).includes(q);
          })
      );
      const matchNombre = normalizeText(f.nombre).includes(q);
      const matchBio = f.bio ? normalizeText(f.bio).includes(q) : false;

      return matchActividad || matchCategoria || matchNombre || matchBio;
    });
  }, [busqueda, todosFacilitadores, categorias]);

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
    <div className="h-[calc(100vh-64px)] flex">
      {/* Panel lateral */}
      <div
        className={`${panelAbierto ? "w-[380px]" : "w-0"} flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-lg">
              Facilitadores
            </h2>
            <span className="text-sm text-gray-400">
              {cargando ? "..." : `${facilitadoresFiltrados.length} resultados`}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="Buscar: chamanismo, yoga, reiki..."
              className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {busqueda && (
              <button
                onClick={limpiarBusqueda}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {categorias.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const isActive = normalizeText(busqueda) === normalizeText(cat.nombre);
              return (
                <button
                  key={cat.slug}
                  onClick={() =>
                    handleBusqueda(busqueda === cat.nombre ? "" : cat.nombre)
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.nombre}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cargando ? (
            <div className="p-8 text-center">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : facilitadoresFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">
                No se encontraron facilitadores para &quot;{busqueda}&quot;
              </p>
              <button
                onClick={limpiarBusqueda}
                className="mt-2 text-primary-600 text-sm font-medium hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {facilitadoresFiltrados.map((f) => (
                <button
                  key={f.id}
                  onClick={() =>
                    setFacilitadorSeleccionado(
                      facilitadorSeleccionado === f.id ? null : f.id
                    )
                  }
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    facilitadorSeleccionado === f.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
                      {(() => {
                        const Icon = getCategoryIcon(
                          f.actividades.length > 0 ? f.actividades[0].slug : ""
                        );
                        return <Icon className="h-5 w-5 text-gray-500" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">
                        {f.nombre}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {f.actividades.map((a) => (
                          <span
                            key={a.id}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {a.nombre}
                          </span>
                        ))}
                      </div>
                      {f.direccion && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {f.direccion}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setPanelAbierto(!panelAbierto)}
        className="absolute top-20 z-[1000] bg-white border border-gray-200 rounded-r-lg p-1.5 shadow-sm hover:bg-gray-50 transition-all"
        style={{ left: panelAbierto ? "380px" : "0px" }}
      >
        <ChevronRight
          className={`h-4 w-4 text-gray-400 transition-transform ${
            panelAbierto ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className="flex-1 relative">
        <MapaInteractivo
          facilitadores={facilitadoresEnMapa}
          seleccionado={facilitadorSeleccionado}
          onSeleccionar={setFacilitadorSeleccionado}
        />
      </div>
    </div>
  );
}
