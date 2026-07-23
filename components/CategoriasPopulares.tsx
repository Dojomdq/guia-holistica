"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { ArrowRight } from "lucide-react";
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
    <section ref={ref} className="section-pad-tight">
      <div className="container-wide">
        {/* Header */}
        <div
          className={`flex items-end justify-between mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div>
            <span className="label">Explorá</span>
            <h2 className="heading-lg mt-3">
              Caminos
            </h2>
          </div>
          <Link
            href="/mapa"
            className="btn-ghost text-[13px] hidden sm:inline-flex group"
          >
            Ver mapa
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {cats.map((cat, i) => {
            const Icon: LucideIcon = getCategoryIcon(cat.slug);
            const markerColor = CATEGORY_MARKER_COLORS[cat.slug] || "#5d8a6e";
            const hasFacilitadores = cat.count > 0;
            return (
              <Link
                key={cat.slug}
                href={`/mapa?q=${cat.slug}`}
                className="group"
              >
                <div
                  className={`card h-full ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <div className="mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${markerColor}12` }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: markerColor }}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-200">
                    {cat.nombre}
                  </h3>
                  {!hasFacilitadores && (
                    <p className="text-[11px] text-warmblack/25 mt-1 italic">
                      Próximamente
                    </p>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Ver mapa card */}
          <Link
            href="/mapa"
            className="group"
          >
            <div className="h-full bg-warmblack rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-warmblack/85 hover:-translate-y-px hover:shadow-large min-h-[140px]">
              <ArrowRight className="h-4 w-4 text-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white/60" />
              <div>
                <h3 className="text-sm font-medium text-white/80">
                  Ver mapa
                </h3>
                <p className="text-[11px] text-white/30 mt-1">
                  Todas las ubicaciones
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
