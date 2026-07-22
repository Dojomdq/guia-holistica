"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, getCategoryColor } from "@/lib/categories";
import type { LucideIcon } from "lucide-react";

interface CatCount {
  id: string;
  slug: string;
  nombre: string;
  icono: string | null;
  count: number;
}

export default function CategoriasPopulares() {
  const [cats, setCats] = useState<CatCount[]>([]);

  useEffect(() => {
    async function load() {
      const { data: dbCats } = await supabase
        .from("categorias")
        .select("id, slug, nombre, icono")
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
          icono: c.icono,
          count: countsByCategoria[c.id] || 0,
        }))
      );
    }
    load();
  }, []);

  if (cats.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Explorá por Categoría
          </h2>
          <p className="text-gray-500">Encontrá lo que buscás</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {cats.map((cat) => {
            const Icon: LucideIcon = getCategoryIcon(cat.slug);
            const colorClass = getCategoryColor(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/mapa?q=${cat.slug}`}
                className="group"
              >
                <div
                  className={`${colorClass} border rounded-xl p-5 text-center transition-all hover:shadow-sm hover:-translate-y-0.5`}
                >
                  <Icon className="h-7 w-7 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm group-hover:opacity-80 transition-opacity">
                    {cat.nombre}
                  </h3>
                  <p className="text-xs opacity-60 mt-1">
                    {cat.count > 0
                      ? `${cat.count} facilitador${cat.count !== 1 ? "es" : ""}`
                      : "Próximamente"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
