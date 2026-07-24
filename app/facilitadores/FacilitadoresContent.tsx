"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, X, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import { useScrollReveal } from "@/lib/useScrollReveal";
import PopupFacilitadores from "@/components/PopupFacilitadores";

interface FacilitadorItem {
  id: string;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  instagram: string | null;
  actividades: string[];
  actividadSlugs: string[];
}

interface CategoriaItem {
  slug: string;
  nombre: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function FacilitadoresContent() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [facilitadores, setFacilitadores] = useState<FacilitadorItem[]>([]);
  const [categorias, setCategorias] = useState<CategoriaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const track = useClickTracker();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const [fRes, cRes] = await Promise.all([
        supabase
          .from("facilitadores")
          .select(
            "id, nombre, bio, direccion, instagram, facilitador_actividades(actividades(nombre, slug))"
          )
          .eq("activo", true)
          .order("nombre"),
        supabase
          .from("categorias")
          .select("slug, nombre, icono")
          .order("nombre"),
      ]);

      if (fRes.data) {
        setFacilitadores(
          fRes.data.map((f: any) => {
            const acts = f.facilitador_actividades || [];
            return {
              id: f.id,
              nombre: f.nombre,
              bio: f.bio,
              direccion: f.direccion,
              instagram: f.instagram,
              actividades: acts
                .map((a: any) => a.actividades?.nombre)
                .filter(Boolean),
              actividadSlugs: acts
                .map((a: any) => a.actividades?.slug)
                .filter(Boolean),
            };
          })
        );
      }

      if (cRes.data) {
        setCategorias(
          cRes.data.map((c: any) => ({
            slug: c.slug,
            nombre: c.nombre,
          }))
        );
      }

      setCargando(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = facilitadores;

    if (filtroCategoria) {
      result = result.filter((f) =>
        f.actividadSlugs.some((slug) => slug.includes(filtroCategoria))
      );
    }

    if (busqueda.trim()) {
      const q = normalizeText(busqueda);
      result = result.filter(
        (f) =>
          normalizeText(f.nombre).includes(q) ||
          f.actividades.some((a) => normalizeText(a).includes(q)) ||
          (f.bio && normalizeText(f.bio).includes(q))
      );
    }

    return result;
  }, [busqueda, filtroCategoria, facilitadores]);

  return (
    <div className="section-pad">
      <div className="container-page">
        <div
          ref={ref}
          className={`max-w-2xl mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="label">Comunidad</span>
          <h1 className="heading-xl mt-4">Facilitadores</h1>
          <p className="body-lg mt-4 max-w-lg">
            Conocé a los profesionales de nuestra comunidad
          </p>
        </div>

        {/* Search + filters */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative max-w-md mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-warmblack/25" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o actividad..."
              className="input-field pl-11 pr-10"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <X className="h-4 w-4 text-warmblack/25" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroCategoria(null)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                filtroCategoria === null
                  ? "bg-warmblack text-white"
                  : "bg-cream-200/50 text-warmblack/50 hover:text-warmblack/70 border border-cream-200 hover:border-cream-300"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() =>
                    setFiltroCategoria(
                      filtroCategoria === cat.slug ? null : cat.slug
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    filtroCategoria === cat.slug
                      ? "bg-warmblack text-white"
                      : "bg-cream-200/50 text-warmblack/50 hover:text-warmblack/70 border border-cream-200 hover:border-cream-300"
                  }`}
                >
                  <Icon className="h-3 w-3" strokeWidth={1.5} />
                  {cat.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-cream-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-cream-200 rounded w-2/3" />
                    <div className="h-3 bg-cream-200 rounded w-1/2" />
                    <div className="h-3 bg-cream-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((f, i) => {
                const Icon = getCategoryIcon(f.actividadSlugs[0] || "");
                const slug0 = f.actividadSlugs[0] || "";
                let markerColor = "#5d8a6e";
                for (const [key, c] of Object.entries(
                  CATEGORY_MARKER_COLORS
                )) {
                  if (slug0.includes(key)) {
                    markerColor = c;
                    break;
                  }
                }
                return (
                  <Link
                    key={f.id}
                    href={`/facilitadores/${f.id}`}
                    className="group"
                    onClick={() => track("facilitador", f.id)}
                  >
                    <div
                      className={`card h-full ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundColor: `${markerColor}10` }}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{ color: markerColor }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-200 flex items-center gap-1.5">
                            {f.nombre}
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                          </h3>
                          <p className="text-[13px] text-warmblack/40 mt-1 line-clamp-2 leading-relaxed">
                            {f.bio}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {f.actividades.map((a) => (
                              <span key={a} className="badge">
                                {a}
                              </span>
                            ))}
                          </div>
                          {f.direccion && (
                            <span className="flex items-center gap-1 text-[12px] text-warmblack/30 mt-2.5">
                              <MapPin className="h-3 w-3" />
                              {f.direccion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-warmblack/35 text-body-lg">
                  No se encontraron facilitadores
                  {filtroCategoria && ` para esta categoría`}
                  {busqueda && ` para "${busqueda}"`}
                </p>
                <button
                  onClick={() => {
                    setBusqueda("");
                    setFiltroCategoria(null);
                  }}
                  className="mt-4 text-sage-600 text-[13px] font-medium hover:text-sage-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <PopupFacilitadores />
    </div>
  );
}
