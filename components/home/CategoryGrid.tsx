"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useScrollReveal } from "@/lib/useScrollReveal";

const DEFAULT_EMOJIS: Record<string, string> = {
  yoga: "🧘", reiki: "🖐️", meditacion: "🧠", chamanismo: "🪶",
  tarot: "🔮", astrologia: "⭐", "sanacion-energetica": "✨",
  "terapias-holisticas": "🌿", biodanza: "💃", aromaterapia: "🌸",
  "circulos-de-mujeres": "🌙", "cacao-ceremonia": "🍫",
  "flores-de-bach": "🌼", "sonidos-y-vibraciones": "🔔",
  numerologia: "🔢", pranoterapia: "🌀", "limpieza-energetica": "💫",
  "plantas-medicinales": "🌱", "masajes-terapeuticos": "💆",
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
    <section ref={ref} className="py-24 sm:py-28 relative overflow-hidden bg-sage-50">
      <div className="relative container-wide">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="inline-flex items-center gap-3 px-5 py-2 bg-sage-600 text-white text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-6 shadow-glow">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            Actividades
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </span>
          <h2 className="heading-lg text-bark max-w-2xl mx-auto">
            Explorá actividades
          </h2>
          <p className="text-bark-600 mt-4 max-w-md mx-auto">
            Hacé clic en lo que necesitás para ver los facilitadores disponibles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {cargando
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-cream-200/40 animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cream-200 shrink-0" />
                  <div className="h-4 bg-cream-200 rounded w-2/3" />
                </div>
              ))
            : categorias.map((cat, i) => (
                <Link
                  key={cat.slug}
                  href={`/actividades/${cat.slug}`}
                  className={`group relative flex items-center gap-4 p-5 rounded-2xl bg-white border border-cream-200/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-sage-300/60 cursor-pointer ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${Math.min(i * 50, 400)}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center transition-all duration-300 group-hover:bg-sage-100 group-hover:scale-110 text-xl shrink-0">
                    {cat.emoji}
                  </div>
                  <span className="text-[14px] font-medium text-bark-600 group-hover:text-bark text-left leading-tight transition-colors duration-300">
                    {cat.nombre}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
