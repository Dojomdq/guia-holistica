"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Facilitador {
  id: string;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  ciudad: string | null;
  actividades: string[];
}

interface ActividadData {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoria_nombre: string;
}

export default function ActividadPageInner({ slug }: { slug: string }) {
  const [actividad, setActividad] = useState<ActividadData | null>(null);
  const [facilitadores, setFacilitadores] = useState<Facilitador[]>([]);
  const [cargando, setCargando] = useState(true);
  const track = useClickTracker();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const { data: cat } = await supabase
        .from("categorias")
        .select("id, nombre, slug")
        .eq("slug", slug)
        .single();

      if (cat) {
        const { data: acts } = await supabase
          .from("actividades")
          .select("id, nombre, slug, descripcion")
          .eq("categoria_id", cat.id);

        const actIds = (acts || []).map((a) => a.id);
        const firstAct = acts?.[0];

        setActividad({
          id: cat.id,
          nombre: cat.nombre,
          slug: cat.slug,
          descripcion: firstAct?.descripcion || null,
          categoria_nombre: cat.nombre,
        });

        if (actIds.length > 0) {
          const { data: fas } = await supabase
            .from("facilitador_actividades")
            .select("facilitador_id, facilitadores!inner(id, nombre, bio)")
            .in("actividad_id", actIds);

          if (fas) {
            const unique = new Map<string, Facilitador>();
            for (const f of fas) {
              const fac = (f as any).facilitadores;
              if (fac && !unique.has(fac.id)) {
                const { data: ubis } = await supabase
                  .from("ubicaciones")
                  .select("id, direccion, ciudad, latitud, longitud")
                  .eq("facilitador_id", fac.id)
                  .limit(1);

                unique.set(fac.id, {
                  id: fac.id,
                  nombre: fac.nombre,
                  bio: fac.bio,
                  direccion: ubis?.[0]?.direccion || null,
                  ciudad: ubis?.[0]?.ciudad || null,
                  actividades: [cat.nombre],
                });
              }
            }
            setFacilitadores(Array.from(unique.values()));
          }
        }
      }

      setCargando(false);
    }
    load();
  }, [slug]);

  const Icon = getCategoryIcon(slug);
  const color = CATEGORY_MARKER_COLORS[slug] || "#5d8a6e";
  const displayName = actividad?.nombre || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <div className="container-page py-16 sm:py-20">
        <Breadcrumbs items={[
          { label: "Actividades", href: "/actividades" },
          { label: displayName },
        ]} />

        <div ref={ref} className={`max-w-2xl mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              {Icon && <Icon className="h-7 w-7" style={{ color }} strokeWidth={1.5} />}
            </div>
            <span className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sage-600">
              Actividad
            </span>
          </div>
          <h1 className="heading-lg text-bark">
            {displayName}
          </h1>
          {actividad?.descripcion && (
            <p className="text-lg text-bark-600 mt-4 max-w-lg leading-relaxed">
              {actividad.descripcion}
            </p>
          )}
        </div>

        {cargando ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cream-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-cream-200 rounded w-1/3" />
                    <div className="h-3 bg-cream-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-medium text-bark">
                {facilitadores.length} {facilitadores.length === 1 ? "facilitador" : "facilitadores"}
              </h2>
              <Link
                href={`/mapa?q=${slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-bark text-white rounded-full text-sm font-medium hover:bg-bark/85 transition-all"
              >
                <MapPin className="h-4 w-4" />
                Ver en el mapa
              </Link>
            </div>

            {facilitadores.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-cream-200">
                <p className="text-bark-600">
                  Todavía no hay facilitadores de {displayName.toLowerCase()}.
                </p>
                <Link
                  href="/actividades"
                  className="inline-flex items-center gap-1 mt-4 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a actividades
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {facilitadores.map((f, i) => (
                  <Link
                    key={f.id}
                    href={`/facilitadores/${f.id}`}
                    className={`block group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                    onClick={() => track("facilitador", f.id)}
                  >
                    <div className="bg-white rounded-2xl border border-cream-200/80 p-5 transition-all duration-200 hover:shadow-lg hover:scale-[1.01]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}12` }}
                          >
                            {Icon && <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />}
                          </div>
                          <div>
                            <h3 className="font-medium text-bark flex items-center gap-1.5">
                              {f.nombre}
                              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                            </h3>
                            <p className="text-[13px] text-bark-500 line-clamp-1">
                              {f.ciudad || ""}
                              {f.ciudad && f.direccion && " · "}
                              {f.direccion || ""}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-wrap gap-1">
                          {f.actividades.map((a) => (
                            <span key={a} className="badge">{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
