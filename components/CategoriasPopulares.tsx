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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section ref={ref} className="pt-10 pb-14 sm:pt-14 sm:pb-20">
      <div className="container-wide">
        {/* Header — left aligned, tight */}
        <div
          className={`flex items-end justify-between mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="section-label">Explorá</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-warmblack mt-3 tracking-tight">
              18 caminos
            </h2>
          </div>
          <span className="text-xs text-warmblack/30 hidden sm:block">
            scroll →
          </span>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 px-5 sm:px-8 lg:px-12 snap-x snap-mandatory custom-scrollbar -mx-5 sm:-mx-8 lg:-mx-12"
      >
        {cats.map((cat, i) => {
          const Icon: LucideIcon = getCategoryIcon(cat.slug);
          const markerColor = CATEGORY_MARKER_COLORS[cat.slug] || "#5d8a6e";
          const hasFacilitadores = cat.count > 0;
          return (
            <Link
              key={cat.slug}
              href={`/mapa?q=${cat.slug}`}
              className="group snap-start flex-shrink-0"
            >
              <div
                className={`relative w-36 sm:w-44 h-40 sm:h-48 rounded-2xl border border-cream-300/40 p-5 flex flex-col justify-between transition-all duration-500 ease-out hover:border-cream-400/60 hover:shadow-medium ${
                  hasFacilitadores
                    ? "bg-white/70 hover:bg-white/90"
                    : "bg-cream-50/50 hover:bg-cream-100/80"
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${markerColor}10` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: markerColor }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Bottom */}
                <div>
                  <h3 className="font-medium text-sm text-warmblack/80 leading-snug">
                    {cat.nombre}
                  </h3>
                  {hasFacilitadores ? (
                    <p className="text-[11px] text-sage-600 mt-1 font-medium">
                      {cat.count} {cat.count === 1 ? "guía" : "guías"}
                    </p>
                  ) : (
                    <p className="text-[11px] text-warmblack/20 mt-1 italic">
                      próximamente
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* "Ver mapa" card at the end */}
        <Link
          href="/mapa"
          className="group snap-start flex-shrink-0"
        >
          <div className="w-36 sm:w-44 h-40 sm:h-48 rounded-2xl bg-warmblack p-5 flex flex-col justify-between transition-all duration-300 hover:bg-warmblack/90">
            <ArrowRight className="h-5 w-5 text-white/45 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/70" />
            <div>
              <h3 className="font-medium text-sm text-white/80">
                Ver mapa
              </h3>
              <p className="text-[11px] text-white/35 mt-1">
                Todas las ubicaciones
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
