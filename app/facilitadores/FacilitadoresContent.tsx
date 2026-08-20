"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Search, X, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/constants";

interface FacilitadorItem {
  id: string;
  slug: string | null;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  instagram: string | null;
  ciudad: string | null;
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
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("q") || "");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroCiudad, setFiltroCiudad] = useState<string | null>(null);
  const [facilitadores, setFacilitadores] = useState<FacilitadorItem[]>([]);
  const [categorias, setCategoriaItems] = useState<CategoriaItem[]>([]);
  const [actividadCategoriaMap, setActividadCategoriaMap] = useState<Record<string, string>>({});
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const track = useClickTracker();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const [fRes, cRes, aRes] = await Promise.all([
        supabase
          .from("facilitadores")
          .select(
            "id, slug, nombre, bio, direccion, instagram, ubicaciones(ciudad), facilitador_actividades(actividades(nombre, slug))"
          )
          .eq("activo", true)
          .order("nombre"),
        supabase
          .from("categorias")
          .select("id, slug, nombre")
          .order("nombre"),
        supabase
          .from("actividades")
          .select("slug, categoria_id"),
      ]);

      if (fRes.data) {
        const ciudadesSet = new Set<string>();
        setFacilitadores(
          fRes.data.map((f: any) => {
            const ubi = f.ubicaciones || [];
            const ciudad = ubi.length > 0 ? ubi[0].ciudad : null;
            if (ciudad) ciudadesSet.add(ciudad);
            const acts = f.facilitador_actividades || [];
            return {
              id: f.id,
              slug: f.slug || null,
              nombre: f.nombre,
              bio: f.bio,
              direccion: f.direccion,
              instagram: f.instagram,
              ciudad,
              actividades: acts
                .map((a: any) => a.actividades?.nombre)
                .filter(Boolean),
              actividadSlugs: acts
                .map((a: any) => a.actividades?.slug)
                .filter(Boolean),
            };
          })
        );
        setCiudades(Array.from(ciudadesSet).sort((a, b) => a.localeCompare(b)));
      }

      if (cRes.data) {
        const catIdToSlug: Record<string, string> = {};
        cRes.data.forEach((c: any) => { catIdToSlug[c.id] = c.slug; });
        setCategoriaItems(
          cRes.data.map((c: any) => ({
            slug: c.slug,
            nombre: c.nombre,
          }))
        );
        if (aRes.data) {
          const map: Record<string, string> = {};
          aRes.data.forEach((a: any) => {
            if (catIdToSlug[a.categoria_id]) map[a.slug] = catIdToSlug[a.categoria_id];
          });
          setActividadCategoriaMap(map);
        }
      }

      setCargando(false);
    }
    load();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && Object.keys(actividadCategoriaMap).length > 0 && actividadCategoriaMap[q]) {
      setFiltroCategoria(actividadCategoriaMap[q]);
    } else if (!q) {
      setFiltroCategoria(null);
    }
    setBusqueda(q || "");
  }, [searchParams, actividadCategoriaMap]);

  const filtered = useMemo(() => {
    let result = facilitadores;

    if (filtroCategoria) {
      result = result.filter((f) =>
        f.actividadSlugs.some((slug) => actividadCategoriaMap[slug] === filtroCategoria || slug.includes(filtroCategoria))
      );
    }

    if (filtroCiudad) {
      result = result.filter((f) => f.ciudad === filtroCiudad);
    }

    if (busqueda.trim()) {
      const q = normalizeText(busqueda);
      result = result.filter(
        (f) =>
          normalizeText(f.nombre).includes(q) ||
          f.actividades.some((a) => normalizeText(a).includes(q)) ||
          (f.bio && normalizeText(f.bio).includes(q)) ||
          f.actividadSlugs.some((slug) => {
            const catSlug = actividadCategoriaMap[slug];
            return catSlug && normalizeText(catSlug.replace(/-/g, " ")).includes(q);
          })
      );
    }

    return result;
  }, [busqueda, filtroCategoria, filtroCiudad, facilitadores, actividadCategoriaMap]);

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Facilitadores" },
            ],
          }),
        }}
      />
      {!cargando && facilitadores.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Facilitadores de bienestar",
              itemListElement: facilitadores.map((f, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: f.nombre,
                url: `${SITE_URL}/facilitadores/${f.id}`,
              })),
            }),
          }}
        />
      )}
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <Breadcrumbs items={[{ label: "Facilitadores" }]} />
        <div
          ref={ref}
          className={`max-w-2xl mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="label mb-5 block">Comunidad</span>
          <h1 className="heading-lg text-bark">
            Facilitadores
          </h1>
          <p className="text-lg text-bark-700 mt-5 max-w-lg">
            Conocé a los profesionales de nuestra comunidad
          </p>
        </div>

        {/* Search + filters */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {ciudades.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-sage-600 shrink-0">
                Ciudad
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroCiudad(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filtroCiudad === null
                      ? "bg-bark text-white shadow-medium"
                      : "bg-cream-200/50 text-bark-600 hover:text-bark-800 hover:bg-cream-200 border border-cream-300"
                  }`}
                >
                  Todas
                </button>
                {ciudades.map((ciudad) => (
                  <button
                    key={ciudad}
                    onClick={() => setFiltroCiudad(filtroCiudad === ciudad ? null : ciudad)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filtroCiudad === ciudad
                        ? "bg-bark text-white shadow-medium"
                        : "bg-cream-200/50 text-bark-600 hover:text-bark-800 hover:bg-cream-200 border border-cream-300"
                    }`}
                  >
                    {ciudad}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative max-w-md mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-bark-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o actividad..."
              aria-label="Buscar por nombre o actividad"
              className="input-field pl-11 pr-10"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <X className="h-4 w-4 text-bark-400" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroCategoria(null)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                filtroCategoria === null
                  ? "bg-bark text-white"
                  : "bg-cream-200/50 text-bark-600 hover:text-bark-800 border border-cream-200 hover:border-cream-300"
              }`}
            >
              Todas
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
                      ? "bg-bark text-white"
                      : "bg-cream-200/50 text-bark-600 hover:text-bark-800 border border-cream-200 hover:border-cream-300"
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
                    href={`/facilitadores/${f.slug || f.id}`}
                    className="group"
                    onClick={() => track("facilitador", f.id)}
                  >
                    <div
                      className={`bg-white rounded-2xl border border-cream-200/80 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-cream-300 h-full ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{ backgroundColor: `${markerColor}10` }}
                        >
                          <img
                            src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1787258150/Nagi_dojo_sin_fondo_qlpjeh.png"
                            alt=""
                            width={20}
                            height={20}
                            className="shrink-0"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-medium text-bark group-hover:text-sage-700 transition-colors duration-200 flex items-center gap-1.5">
                            {f.nombre}
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                          </h3>
                          <p className="text-[13px] text-bark-600 mt-1 line-clamp-2 leading-relaxed">
                            {f.bio}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {f.actividades.map((a) => (
                              <span key={a} className="badge">
                                {a}
                              </span>
                            ))}
                          </div>
                          {f.ciudad && (
                            <span className="flex items-center gap-1 text-[12px] text-bark-500 mt-2.5">
                              <MapPin className="h-3 w-3" />
                              {f.ciudad}
                            </span>
                          )}
                          {!f.ciudad && f.direccion && (
                            <span className="flex items-center gap-1 text-[12px] text-bark-500 mt-2.5">
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
                <p className="text-bark-500 text-lg">
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
    </div>
  );
}
