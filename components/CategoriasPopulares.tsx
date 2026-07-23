"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import type { LucideIcon } from "lucide-react";

interface CatCount {
  id: string;
  slug: string;
  nombre: string;
  count: number;
}

export default function CategoriasPopulares() {
  const [cats, setCats] = useState<CatCount[]>([]);

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
    <section className="py-24">
      <div className="container-page">
        <div className="mb-12">
          <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-2">
            Explorá
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900">
            ¿Qué buscás?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cats.map((cat) => {
            const Icon: LucideIcon = getCategoryIcon(cat.slug);
            const markerColor = CATEGORY_MARKER_COLORS[cat.slug] || "#15803d";
            const hasFacilitadores = cat.count > 0;
            return (
              <Link
                key={cat.slug}
                href={`/mapa?q=${cat.slug}`}
                className="group relative"
              >
                <div className="relative bg-white rounded-xl border border-stone-200/60 p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/40 hover:-translate-y-0.5 hover:border-stone-300/60">
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-2.5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${markerColor}10` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: markerColor }} />
                  </div>
                  <h3 className="font-medium text-xs text-stone-700 leading-tight">
                    {cat.nombre}
                  </h3>
                  {hasFacilitadores ? (
                    <p className="text-[11px] text-stone-400 mt-1">
                      {cat.count}
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-300 mt-1 italic">
                      pronto
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
