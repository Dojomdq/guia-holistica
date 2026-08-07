"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";

interface SubActividad {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  count: number;
}

interface FacilitadorItem {
  id: string;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  ciudad: string | null;
  actividades: string[];
}

export default function ActividadPageInner({ slug }: { slug: string }) {
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [subActividades, setSubActividades] = useState<SubActividad[]>([]);
  const [facilitadores, setFacilitadores] = useState<FacilitadorItem[]>([]);
  const [totalFacilitadores, setTotalFacilitadores] = useState(0);
  const [esActividad, setEsActividad] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [cargando, setCargando] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Same query as production - works for categorias
      const { data: cat } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("slug", slug)
        .single();

      if (!cancelled && cat) {
        setCategoriaNombre(cat.nombre);
        setDisplayName(cat.nombre);
        setEsActividad(false);

        const { data: acts } = await supabase
          .from("actividades")
          .select("id, nombre, slug, descripcion")
          .eq("categoria_id", cat.id)
          .order("nombre");

        if (!cancelled && acts && acts.length > 0) {
          const actIds = acts.map((a) => a.id);
          const { data: fas } = await supabase
            .from("facilitador_actividades")
            .select("actividad_id, facilitador_id")
            .in("actividad_id", actIds);

          if (!cancelled) {
            const facilitatorIds = new Set<string>();
            const countMap: Record<string, number> = {};
            (fas || []).forEach((f: any) => {
              facilitatorIds.add(f.facilitador_id);
              countMap[f.actividad_id] = (countMap[f.actividad_id] || 0) + 1;
            });

            setSubActividades(acts.map((a) => ({
              id: a.id, nombre: a.nombre, slug: a.slug,
              descripcion: a.descripcion, count: countMap[a.id] || 0,
            })));
            setTotalFacilitadores(facilitatorIds.size);
          }
        }
        if (!cancelled) setCargando(false);
        return;
      }

      // Fallback: try as actividad (e.g. /actividades/aikido)
      const { data: act } = await supabase
        .from("actividades")
        .select("id, nombre")
        .eq("slug", slug)
        .single();

      if (!cancelled && act) {
        setDisplayName(act.nombre);
        setEsActividad(true);

        const { data: fas } = await supabase
          .from("facilitador_actividades")
          .select("facilitador_id")
          .eq("actividad_id", act.id);

        if (!cancelled) {
          const facIds = (fas || []).map((f: any) => f.facilitador_id);
          setTotalFacilitadores(facIds.length);

          if (facIds.length > 0) {
            const { data: facs } = await supabase
              .from("facilitadores")
              .select("id, nombre, bio, direccion, ciudad")
              .in("id", facIds)
              .eq("activo", true)
              .order("nombre");

            if (!cancelled && facs) {
              const { data: allFas } = await supabase
                .from("facilitador_actividades")
                .select("facilitador_id, actividades(nombre)")
                .in("facilitador_id", facIds);

              const actsMap: Record<string, string[]> = {};
              (allFas || []).forEach((fa: any) => {
                if (!actsMap[fa.facilitador_id]) actsMap[fa.facilitador_id] = [];
                if (fa.actividades?.nombre) actsMap[fa.facilitador_id].push(fa.actividades.nombre);
              });

              setFacilitadores(facs.map((f) => ({
                id: f.id, nombre: f.nombre, bio: f.bio,
                direccion: f.direccion, ciudad: f.ciudad,
                actividades: actsMap[f.id] || [],
              })));
            }
          }
        }
        if (!cancelled) setCargando(false);
        return;
      }

      if (!cancelled) {
        setDisplayName(slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
        setCargando(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  const labelText = esActividad ? "Actividad" : "Categoría";

  if (cargando) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-bark-950">
        <div className="container-page py-16 sm:py-20">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-bark-900 rounded-2xl p-6 border border-cream-200 dark:border-bark-700 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cream-200 dark:bg-bark-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-cream-200 dark:bg-bark-700 rounded w-1/3" />
                    <div className="h-3 bg-cream-200 dark:bg-bark-700 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-bark-950">
      <div className="container-page py-16 sm:py-20">
        <Breadcrumbs items={[
          { label: "Actividades", href: "/actividades" },
          { label: displayName },
        ]} />

        <div ref={ref} className={`max-w-2xl mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <span className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sage-600 dark:text-sage-400">
            {labelText}
          </span>
          <h1 className="heading-lg text-bark dark:text-cream-100 mt-2">{displayName}</h1>
          <p className="text-lg text-bark-600 dark:text-cream-300 mt-3 max-w-lg leading-relaxed">
            {esActividad
              ? `${totalFacilitadores} facilitador${totalFacilitadores !== 1 ? "es" : ""}`
              : `${subActividades.length} ${subActividades.length === 1 ? "especialidad" : "especialidades"} · ${totalFacilitadores} facilitador${totalFacilitadores !== 1 ? "es" : ""}`
            }
          </p>
        </div>

        {esActividad ? (
          facilitadores.length === 0 ? (
            <div className="bg-white dark:bg-bark-900 rounded-2xl p-8 text-center border border-cream-200 dark:border-bark-700">
              <p className="text-bark-600 dark:text-cream-300">Todavía no hay facilitadores en {displayName.toLowerCase()}.</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Link href="/actividades" className="inline-flex items-center gap-1 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Volver
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {facilitadores.map((f) => {
                const Icon = getCategoryIcon(f.actividades[0]?.toLowerCase() || "");
                const color = CATEGORY_MARKER_COLORS[f.actividades[0]?.toLowerCase() || ""] || "#5d8a6e";
                return (
                  <Link key={f.id} href={`/facilitadores/${f.id}`}
                    className="group block bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 p-5 transition-all duration-200 hover:shadow-lg hover:border-cream-300 dark:hover:border-bark-600"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}10` }}>
                        <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-bark dark:text-cream-100 group-hover:text-sage-700 transition-colors flex items-center gap-1.5">
                          {f.nombre} <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </h3>
                        {f.bio && <p className="text-sm text-bark-600 dark:text-cream-300 mt-0.5 line-clamp-2">{f.bio}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {f.actividades.map((a) => (
                            <span key={a} className="text-[10px] px-1.5 py-0.5 bg-cream-100 dark:bg-bark-800 text-bark-600 dark:text-cream-300 rounded font-medium">{a}</span>
                          ))}
                        </div>
                        {f.ciudad && (
                          <span className="flex items-center gap-1 text-[12px] text-bark-500 dark:text-cream-400 mt-2">
                            <MapPin className="h-3 w-3" /> {f.ciudad}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        ) : subActividades.length === 0 ? (
          <div className="bg-white dark:bg-bark-900 rounded-2xl p-8 text-center border border-cream-200 dark:border-bark-700">
            <p className="text-bark-600 dark:text-cream-300">
              Todavía no hay especialidades en {displayName.toLowerCase()}.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link href="/actividades" className="inline-flex items-center gap-1 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Volver
              </Link>
              <Link href={`/mapa?q=${slug}`} className="inline-flex items-center gap-1 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors">
                <MapPin className="h-4 w-4" /> Ver en el mapa
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subActividades.map((a, i) => (
              <Link key={a.id} href={`/mapa?q=${a.slug}`}
                className={`group bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/60 dark:border-bark-700/60 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-lg font-medium text-bark dark:text-cream-100 group-hover:text-sage-700 transition-colors">{a.nombre}</h3>
                  {a.count > 0 && (
                    <span className="flex items-center gap-1 text-[12px] text-sage-600 font-medium shrink-0">
                      <Users className="h-3.5 w-3.5" /> {a.count}
                    </span>
                  )}
                </div>
                {a.descripcion && <p className="text-sm text-bark-600 dark:text-cream-300 leading-relaxed line-clamp-2">{a.descripcion}</p>}
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-sage-600 mt-3">
                  {a.count > 0 ? "Ver facilitadores" : "Sin facilitadores aún"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
