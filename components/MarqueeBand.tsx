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
  Sprout,
  Droplets,
  Wind,
  Trees,
  Heart,
  CircleDashed,
  PersonStanding,
  Hash,
  type LucideIcon,
} from "lucide-react";

const CATEGORIES = [
  { slug: "yoga", name: "Yoga", icon: Flower2 },
  { slug: "reiki", name: "Reiki", icon: Hand },
  { slug: "meditacion", name: "Meditación", icon: Flame },
  { slug: "chamanismo", name: "Chamanismo", icon: Feather },
  { slug: "tarot", name: "Tarot", icon: Eye },
  { slug: "astrologia", name: "Astrología", icon: Star },
  { slug: "sanacion-energetica", name: "Sanación Energética", icon: Sparkles },
  { slug: "aromaterapia", name: "Aromaterapia", icon: Droplets },
  { slug: "terapias-holisticas", name: "Terapias Holísticas", icon: Leaf },
  { slug: "circulos-de-mujeres", name: "Círculos de Mujeres", icon: Moon },
  { slug: "cacao-ceremonia", name: "Cacao Ceremonia", icon: Coffee },
  { slug: "flores-de-bach", name: "Flores de Bach", icon: Sprout },
  { slug: "sonidos-y-vibraciones", name: "Sonidos y Vibraciones", icon: Bell },
  { slug: "numerologia", name: "Numerología", icon: Hash },
  { slug: "pranoterapia", name: "Pranoterapia", icon: Wind },
  { slug: "limpieza-energetica", name: "Limpieza Energética", icon: CircleDashed },
  { slug: "plantas-medicinales", name: "Plantas Medicinales", icon: Trees },
  { slug: "masajes-terapeuticos", name: "Masajes Terapéuticos", icon: Heart },
  { slug: "biodanza", name: "Biodanza", icon: PersonStanding },
];

export default function MarqueeBand() {
  const { ref, isVisible } = useScrollReveal();
  const router = useRouter();

  return (
    <section ref={ref} className="py-10 sm:py-14 lg:py-16 bg-cream-50">
      <div className="container-wide">
        {/* Heading */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="label justify-center inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-sage-300" />
            Actividades
            <span className="w-8 h-px bg-sage-300" />
          </span>
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-warmblack">
            Explorá por actividad
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => router.push(`/mapa?q=${cat.slug}`)}
                className={`group flex flex-col items-center gap-2.5 p-4 sm:p-5 bg-white rounded-xl border border-cream-200/80 transition-all duration-300 ease-out-expo hover:border-sage-300 hover:shadow-medium hover:-translate-y-0.5 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${Math.min(i * 40, 400)}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center transition-all duration-300 group-hover:bg-sage-50 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-warmblack/50 transition-colors duration-300 group-hover:text-sage-600" />
                </div>
                <span className="text-[13px] font-medium text-warmblack/70 transition-colors duration-300 group-hover:text-warmblack text-center leading-tight">
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
