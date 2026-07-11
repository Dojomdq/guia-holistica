"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface CatCount {
  slug: string;
  nombre: string;
  icono: string;
  count: number;
}

const BASE_CATS = [
  { slug: "chamanismo", nombre: "Chamanismo", icono: "🪶" },
  { slug: "yoga", nombre: "Yoga", icono: "🧘" },
  { slug: "reiki", nombre: "Reiki", icono: "✋" },
  { slug: "meditacion", nombre: "Meditación", icono: "🕯️" },
  { slug: "tarot", nombre: "Tarot", icono: "🔮" },
  { slug: "astrologia", nombre: "Astrología", icono: "⭐" },
  { slug: "sanacion-energetica", nombre: "Sanación Energética", icono: "💫" },
  { slug: "terapias-holisticas", nombre: "Terapias Holísticas", icono: "🌿" },
  { slug: "circulos-de-mujeres", nombre: "Círculos de Mujeres", icono: "🌙" },
  { slug: "cacao-ceremonia", nombre: "Cacao Ceremonia", icono: "🍫" },
];

export default function CategoriasPopulares() {
  const [cats, setCats] = useState(BASE_CATS.map(c => ({ ...c, count: 0 })));

  useEffect(() => {
    async function load() {
      const { data: acts } = await supabase
        .from("actividades")
        .select("slug, categoria_id");
      const { data: fas } = await supabase
        .from("facilitador_actividades")
        .select("actividad_id");

      if (acts && fas) {
        const actIds = new Set(fas.map(f => f.actividad_id));
        const counts: Record<string, number> = {};
        for (const act of acts) {
          if (actIds.has(act.id)) {
            const key = act.slug.split("-")[0];
            counts[key] = (counts[key] || 0) + 1;
          }
        }
        setCats(BASE_CATS.map((c) => ({
          ...c,
          count: counts[c.slug.split("-")[0]] || 0,
        })));
      }
    }
    load();
  }, []);

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
          {cats.map((cat) => (
            <Link key={cat.slug} href={`/mapa?q=${cat.slug}`} className="group">
              <div className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all">
                <div className="text-3xl mb-2">{cat.icono}</div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-gray-900">
                  {cat.nombre}
                </h3>
                {cat.count > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {cat.count} facilitador{cat.count !== 1 ? "es" : ""}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
