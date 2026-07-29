"use client";

import { useRouter } from "next/navigation";
import { useScrollReveal } from "@/lib/useScrollReveal";
import {
  Feather,
  Flower2,
  Hand,
  Flame,
  Eye,
  Star,
  Sparkles,
  Leaf,
  Moon,
  Coffee,
  Bell,
  Droplets,
  Hash,
  Wind,
  Trees,
  Heart,
  Sprout,
  CircleDashed,
  PersonStanding,
} from "lucide-react";

const CATEGORIES = [
  { slug: "yoga", name: "Yoga", icon: Flower2 },
  { slug: "reiki", name: "Reiki", icon: Hand },
  { slug: "meditacion", name: "Meditación", icon: Flame },
  { slug: "chamanismo", name: "Chamanismo", icon: Feather },
  { slug: "tarot", name: "Tarot", icon: Eye },
  { slug: "astrologia", name: "Astrología", icon: Star },
  { slug: "sanacion-energetica", name: "Sanación energética", icon: Sparkles },
  { slug: "terapias-holisticas", name: "Terapias holísticas", icon: Leaf },
  { slug: "biodanza", name: "Biodanza", icon: PersonStanding },
  { slug: "aromaterapia", name: "Aromaterapia", icon: Droplets },
  { slug: "circulos-de-mujeres", name: "Círculos de mujeres", icon: Moon },
  { slug: "cacao-ceremonia", name: "Cacao ceremony", icon: Coffee },
  { slug: "flores-de-bach", name: "Flores de Bach", icon: Sprout },
  { slug: "sonidos-y-vibraciones", name: "Sonidos y vibraciones", icon: Bell },
  { slug: "numerologia", name: "Numerología", icon: Hash },
  { slug: "pranoterapia", name: "Pranoterapia", icon: Wind },
  { slug: "limpieza-energetica", name: "Limpieza energética", icon: CircleDashed },
  { slug: "plantas-medicinales", name: "Plantas medicinales", icon: Trees },
  { slug: "masajes-terapeuticos", name: "Masajes terapéuticos", icon: Heart },
];

export default function CategoryGrid() {
  const { ref, isVisible } = useScrollReveal();
  const router = useRouter();

  return (
    <section ref={ref} className="py-24 sm:py-28 relative overflow-hidden bg-cream-50">
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay noise-overlay pointer-events-none" />

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

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 max-w-6xl mx-auto">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => router.push(`/mapa?q=${cat.slug}`)}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-cream-200/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-sage-300/50 cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${Math.min(i * 30, 400)}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center transition-all duration-300 group-hover:bg-sage-100 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-bark-400 group-hover:text-sage-600 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <span className="text-[12px] font-medium text-bark-600 group-hover:text-bark text-center leading-tight transition-colors duration-300">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
