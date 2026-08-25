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
    <section ref={ref} className="py-20 sm:py-28 relative overflow-hidden bg-sand-100">
      <div className="absolute inset-0 section-radial-warm pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-terracotta-200/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-sage-200/25 rounded-full blur-[130px] pointer-events-none" />
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
                  className="h-14 rounded-2xl bg-white/70 border border-cream-300/40 animate-pulse"
                />
              ))
            : categorias.map((cat, i) => (
                <CardWithGlow key={cat.slug} className="rounded-2xl">
                  <Link
                    href={`/actividades/${cat.slug}`}
                    className={`group relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-cream-200/60 hover:border-sage-300 hover:bg-sage-50/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: getMarkerColor(cat.slug),
                      transitionDelay: `${Math.min(i * 40, 400)}ms`,
                    }}
                  >
                    <span className="text-xl leading-none" aria-hidden="true">{cat.emoji}</span>
                    <span className="text-sm font-medium text-bark-600 group-hover:text-bark leading-tight transition-colors duration-200">
                      {cat.nombre}
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sage-100/0 via-sage-100/30 to-sage-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Link>
                </CardWithGlow>
              ))}
        </div>
      </div>
    </section>
  );
}
