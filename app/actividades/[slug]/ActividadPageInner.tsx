"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";

interface SubActividad {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  count: number;
}

export default function ActividadPageInner({ slug }: { slug: string }) {
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [subActividades, setSubActividades] = useState<SubActividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const { data: cat } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("slug", slug)
        .single();

      if (!cat) {
        setCargando(false);
        return;
      }

      setCategoriaNombre(cat.nombre);

      const { data: acts } = await supabase
        .from("actividades")
        .select("id, nombre, slug, descripcion")
        .eq("categoria_id", cat.id)
        .order("nombre");

      if (acts && acts.length > 0) {
        const actIds = acts.map((a) => a.id);

        const { data: fas } = await supabase
          .from("facilitador_actividades")
          .select("actividad_id")
          .in("actividad_id", actIds);

        const countMap: Record<string, number> = {};
        (fas || []).forEach((f) => {
          countMap[f.actividad_id] = (countMap[f.actividad_id] || 0) + 1;
        });

        const items: SubActividad[] = acts.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          slug: a.slug,
          descripcion: a.descripcion,
          count: countMap[a.id] || 0,
        }));

        setSubActividades(items);
      }

      setCargando(false);
    }
    load();
  }, [slug]);

  const displayName = categoriaNombre || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <div className="container-page py-16 sm:py-20">
        <Breadcrumbs items={[
          { label: "Actividades", href: "/actividades" },
          { label: displayName },
        ]} />

        <div ref={ref} className={`max-w-2xl mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <span className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sage-600">
            Categoría
          </span>
          <h1 className="heading-lg text-bark mt-2">
            {displayName}
          </h1>
          <p className="text-lg text-bark-600 mt-3 max-w-lg leading-relaxed">
            {subActividades.length} {subActividades.length === 1 ? "especialidad" : "especialidades"} · {subActividades.reduce((sum, a) => sum + a.count, 0)} facilitadores
          </p>
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
        ) : subActividades.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-cream-200">
            <p className="text-bark-600">
              Todavía no hay especialidades en {displayName.toLowerCase()}.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link
                href="/actividades"
                className="inline-flex items-center gap-1 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
              <Link
                href={`/mapa?q=${slug}`}
                className="inline-flex items-center gap-1 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Ver en el mapa
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subActividades.map((a, i) => (
              <Link
                key={a.id}
                href={`/facilitadores?q=${a.slug}`}
                className={`group bg-white rounded-2xl border border-cream-200/60 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-lg font-medium text-bark group-hover:text-sage-700 transition-colors">
                    {a.nombre}
                  </h3>
                  {a.count > 0 && (
                    <span className="flex items-center gap-1 text-[12px] text-sage-600 font-medium shrink-0">
                      <Users className="h-3.5 w-3.5" />
                      {a.count}
                    </span>
                  )}
                </div>
                {a.descripcion && (
                  <p className="text-sm text-bark-600 leading-relaxed line-clamp-2">
                    {a.descripcion}
                  </p>
                )}
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
