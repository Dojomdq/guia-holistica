"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useScrollReveal } from "@/lib/useScrollReveal";
import type { LucideIcon } from "lucide-react";

interface CatCount {
  id: string;
  slug: string;
  nombre: string;
  count: number;
}

export default function CategoriasPopulares() {
  const [cats, setCats] = useState<CatCount[]>([]);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const { data: dbCats } = await supabase
        .from("categorias")
        .select("id, slug, nombre")
        .order("nombre");

      if (!dbCats) return;

      const { data: acts } = await supabase
        .from("actividades")
        .select("id, categoria_id");
      const { data: fas } = await supabase
        .from("facilitador_actividades")
        .select("actividad_id");

      const actIdsWithFacilitador = new Set(
        (fas || []).map((f) => f.actividad_id)
      );

      const countsByCategoria: Record<string, number> = {};
      for (const act of acts || []) {
        if (actIdsWithFacilitador.has(act.id) && act.categoria_id) {
          countsByCategoria[act.categoria_id] =
            (countsByCategoria[act.categoria_id] || 0) + 1;
        }
      }

      setCats(
        dbCats.map((c) => ({
          id: c.id,
          slug: c.slug,
          nombre: c.nombre,
          count: countsByCategoria[c.id] || 0,
        }))
      );
    }
    load();
  }, []);

  if (cats.length === 0) return null;

  return (
    <section ref={ref} className="section-padding">
      <div className="container-page">
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="section-label">Explorá</span>
          <h2 className="heading-section mt-4">
            ¿Qué buscás?
          </h2>
          <p className="text-body mt-4 max-w-md">
            18 caminos de sanación, cada uno con facilitadores verificados en
            Mar del Plata.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cats.map((cat, i) => {
            const Icon: LucideIcon = getCategoryIcon(cat.slug);
            const markerColor =
              CATEGORY_MARKER_COLORS[cat.slug] || "#5d8a6e";
            const hasFacilitadores = cat.count > 0;
            return (
              <Link
                key={cat.slug}
                href={`/mapa?q=${cat.slug}`}
                className="group relative"
              >
                <div
                  className={`relative bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-300/50 p-5 text-center transition-all duration-500 ease-out hover:shadow-medium hover:-translate-y-1 hover:border-cream-400/60 hover:bg-white/80 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-soft"
                    style={{ backgroundColor: `${markerColor}10` }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: markerColor }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-medium text-xs text-warmblack/70 leading-tight">
                    {cat.nombre}
                  </h3>
                  {hasFacilitadores ? (
                    <p className="text-[11px] text-sage-500 mt-1.5 font-medium">
                      {cat.count} {cat.count === 1 ? "guía" : "guías"}
                    </p>
                  ) : (
                    <p className="text-[11px] text-warmblack/25 mt-1.5 italic">
                      próximamente
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
