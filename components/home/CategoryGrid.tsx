"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { getMarkerColor } from "@/lib/categories";
import CardWithGlow from "@/components/CardWithGlow";

const DEFAULT_EMOJIS: Record<string, string> = {
  yoga: "🧘", reiki: "🖐️", meditacion: "🧠", chamanismo: "🪶",
  tarot: "🔮", astrologia: "⭐", "sanacion-energetica": "✨",
  "terapias-holisticas": "🌿", biodanza: "💃", aromaterapia: "🌸",
  "circulos-de-mujeres": "🌙", "cacao-ceremonia": "🍫",
  "flores-de-bach": "🌼", "sonidos-y-vibraciones": "🔔",
  numerologia: "🔢", pranoterapia: "🌀", "limpieza-energetica": "💫",
  "plantas-medicinales": "🌱", "masajes-terapeuticos": "💆",
  solidarios: "🤝", "artes-marciales-no-competitivas": "🥋",
  "terapias-holisticas-alternativas": "🌿",
};

interface CategoriaItem {
  slug: string;
  nombre: string;
  emoji: string;
}

export default function CategoryGrid() {
  const { ref, isVisible } = useScrollReveal();
  const [categorias, setCategorias] = useState<CategoriaItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("categorias")
        .select("slug, nombre, icono")
        .order("nombre");

      if (data) {
        const items: CategoriaItem[] = data
          .filter((c) => c.slug)
          .map((c) => ({
            slug: c.slug,
            nombre: c.nombre,
            emoji: c.icono || DEFAULT_EMOJIS[c.slug] || "🌿",
          }));
        setCategorias(items);
      }
      setCargando(false);
    }
    load();
  }, []);

  return (
    <section ref={ref} className="py-16 sm:py-20 relative overflow-hidden bg-sand-100 section-gradient-warm">
      <div className="relative container-wide">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <span className="section-label justify-center">Categorías</span>
          <h2 className="heading-lg text-bark mt-4">Explorá por categoría</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {cargando
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-full bg-white/70 border border-cream-300/40 animate-pulse"
                />
              ))
            : categorias.map((cat, i) => (
                <CardWithGlow key={cat.slug} className="rounded-full">
                  <Link
                    href={`/actividades/${cat.slug}`}
                    className={`group flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-cream-300/50 hover:border-sage-300 hover:bg-sage-50 hover:shadow-md transition-interactive ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: getMarkerColor(cat.slug),
                      transitionDelay: `${Math.min(i * 40, 400)}ms`,
                    }}
                  >
                    <span className="text-base leading-none" aria-hidden="true">{cat.emoji}</span>
                    <span className="text-[13px] font-medium text-bark-600 group-hover:text-bark leading-tight transition-colors duration-200">
                      {cat.nombre}
                    </span>
                  </Link>
                </CardWithGlow>
              ))}
        </div>
      </div>
    </section>
  );
}
