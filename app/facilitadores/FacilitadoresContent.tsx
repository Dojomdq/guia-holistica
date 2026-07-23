"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import InstagramIcon from "@/components/ui/InstagramIcon";

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
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function FacilitadoresContent() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [facilitadores, setFacilitadores] = useState<FacilitadorItem[]>([]);
  const [categorias, setCategorias] = useState<CategoriaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const track = useClickTracker();

  useEffect(() => {
    async function load() {
      const [fRes, cRes] = await Promise.all([
        supabase
          .from("facilitadores")
          .select("id, nombre, bio, direccion, instagram, facilitador_actividades(actividades(nombre, slug))")
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
              actividades: acts.map((a: any) => a.actividades?.nombre).filter(Boolean),
              actividadSlugs: acts.map((a: any) => a.actividades?.slug).filter(Boolean),
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
    <div className="container-page py-12">
      <div className="max-w-3xl mb-8">
        <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-2">
          Comunidad
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3">
          Facilitadores
        </h1>
        <p className="text-stone-500 text-lg">
          Conocé a los profesionales de nuestra comunidad
        </p>
      </div>

      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o actividad..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-stone-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFiltroCategoria(null)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            filtroCategoria === null
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-200/80"
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
                    setFiltroCategoria(filtroCategoria === cat.slug ? null : cat.slug)
                  }
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    filtroCategoria === cat.slug
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-200/80"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.nombre}
                </button>
              );
            })}
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-stone-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-100 rounded w-2/3" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                  <div className="h-3 bg-stone-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f) => {
              const Icon = getCategoryIcon(f.actividadSlugs[0] || "");
              const slug0 = f.actividadSlugs[0] || "";
              let markerColor = "#15803d";
              for (const [key, c] of Object.entries(CATEGORY_MARKER_COLORS)) {
                if (slug0.includes(key)) { markerColor = c; break; }
              }
              return (
              <Link key={f.id} href={`/facilitadores/${f.id}`} className="group" onClick={() => track("facilitador", f.id)}>
                <div className="bg-white rounded-xl border border-stone-200/60 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/30 hover:-translate-y-0.5 hover:border-stone-300/60">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
                      style={{ backgroundColor: `${markerColor}10` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: markerColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-stone-800 group-hover:text-emerald-700 transition-colors">
                        {f.nombre}
                      </h3>
                      <p className="text-sm text-stone-400 mt-0.5 line-clamp-2">
                        {f.bio}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {f.actividades.map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-md">
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2.5 text-xs text-stone-400">
                        {f.direccion && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {f.direccion}
                          </span>
                        )}
                        {f.instagram && (
                          <span className="flex items-center gap-1">
                            <InstagramIcon className="h-3 w-3" />
                            {f.instagram}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-400">
                No se encontraron facilitadores
                {filtroCategoria && ` para esta categoría`}
                {busqueda && ` para "${busqueda}"`}
              </p>
              <button
                onClick={() => { setBusqueda(""); setFiltroCategoria(null); }}
                className="mt-2 text-primary-600 text-sm font-medium hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
