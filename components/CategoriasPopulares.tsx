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
    <section className="py-20">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
            Explorá
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
            Por Categoría
          </h2>
          <p className="text-stone-500 text-lg max-w-md mx-auto">
            Encontrá exactamente lo que buscás
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {cats.map((cat) => {
            const Icon: LucideIcon = getCategoryIcon(cat.slug);
            const markerColor = CATEGORY_MARKER_COLORS[cat.slug] || "#15803d";
            return (
              <Link
                key={cat.slug}
                href={`/mapa?q=${cat.slug}`}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-6 text-center border border-stone-200/80 card-hover overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${markerColor}, transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <div
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${markerColor}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: markerColor }} />
                    </div>
                    <h3 className="font-semibold text-sm text-stone-800 mb-1">
                      {cat.nombre}
                    </h3>
                    <p className="text-xs text-stone-400">
                      {cat.count > 0
                        ? `${cat.count} facilitador${cat.count !== 1 ? "es" : ""}`
                        : "Próximamente"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
