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
        <MapPin className="h-12 w-12 text-cream-300 mx-auto animate-pulse" />
        <p className="text-warmblack/30 mt-3 text-sm">Cargando mapa...</p>
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
  const [facilitadorSeleccionado, setFacilitadorSeleccionado] = useState<
    string | null
  >(null);
  const [panelAbierto, setPanelAbierto] = useState(true);
  const [todosFacilitadores, setTodosFacilitadores] = useState<Facilitador[]>(
    []
  );
  const [categorias, setCategorias] = useState<
    { slug: string; nombre: string }[]
  >([]);
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
        setCategorias(
          cRes.data.map((c) => ({
            slug: c.slug,
            nombre: c.nombre,
          }))
        );
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
            return (
              normalizeText(a.slug).includes(catSlug) ||
              normalizeText(a.nombre).includes(q)
            );
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
    () =>
      facilitadoresFiltrados.filter((f) => f.direccion && f.direccion.trim()),
    [facilitadoresFiltrados]
  );

  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - 72px)" }}
    >
      <div
        className={`${
          panelAbierto ? "w-[380px]" : "w-0"
        } flex-shrink-0 bg-cream-100 border-r border-cream-300/60 flex flex-col transition-all duration-500 ease-out overflow-hidden`}
      >
        <div className="p-5 border-b border-cream-300/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-medium text-warmblack">
              Facilitadores
            </h2>
            <span className="text-xs text-warmblack/30">
              {cargando
                ? "..."
                : `${facilitadoresFiltrados.length} resultados`}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-warmblack/20" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              placeholder="chamanismo, yoga, reiki..."
              className="input-premium pl-11 pr-10 py-3 text-sm"
            />
            {busqueda && (
              <button
                onClick={limpiarBusqueda}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-cream-200 transition-colors"
              >
                <X className="h-4 w-4 text-warmblack/30" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {categorias.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const isActive =
                normalizeText(busqueda) === normalizeText(cat.nombre);
              return (
                <button
                  key={cat.slug}
                  onClick={() =>
                    handleBusqueda(busqueda === cat.nombre ? "" : cat.nombre)
                  }
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-warmblack text-white"
                      : "bg-white/60 text-warmblack/50 hover:text-warmblack/70 border border-cream-300/50 hover:border-cream-400/60"
                  }`}
                >
                  <Icon className="h-3 w-3" strokeWidth={1.5} />
                  {cat.nombre}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cargando ? (
            <div className="p-6 text-center">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3"
                  >
                    <div className="h-10 w-10 rounded-xl bg-cream-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-cream-200 rounded w-2/3" />
                      <div className="h-2 bg-cream-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : facilitadoresFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-warmblack/30 text-sm">
                No se encontraron facilitadores para &quot;{busqueda}&quot;
              </p>
              <button
                onClick={limpiarBusqueda}
                className="mt-3 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="divide-y divide-cream-300/40">
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
                    className={`w-full p-4 text-left hover:bg-cream-200/50 transition-all duration-300 ${
                      facilitadorSeleccionado === f.id
                        ? "bg-cream-200/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ backgroundColor: `${color}08` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-warmblack text-sm truncate">
                          {f.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {f.actividades.map((a) => (
                            <span
                              key={a.id}
                              className="px-2 py-0.5 bg-cream-200/60 text-warmblack/50 text-[11px] rounded-full"
                            >
                              {a.nombre}
                            </span>
                          ))}
                        </div>
                        {f.direccion && (
                          <p className="text-[11px] text-warmblack/30 mt-1.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {f.direccion}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-warmblack/15 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setPanelAbierto(!panelAbierto)}
        className="absolute top-24 z-[1000] bg-cream-100 border border-cream-300/60 rounded-r-xl p-2 shadow-soft hover:bg-cream-200 transition-all duration-300"
        style={{ left: panelAbierto ? "380px" : "0px" }}
        aria-label={panelAbierto ? "Cerrar panel" : "Abrir panel"}
      >
        <ChevronRight
          className={`h-4 w-4 text-warmblack/30 transition-transform duration-300 ${
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
