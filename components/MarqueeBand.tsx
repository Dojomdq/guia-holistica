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
} from "lucide-react";

const CATEGORIES = [
  { slug: "yoga", name: "Yoga", icon: Flower2, bg: "bg-sage-100", border: "border-sage-200/60", iconColor: "text-sage-700", hoverBorder: "hover:border-sage-400/60" },
  { slug: "reiki", name: "Reiki", icon: Hand, bg: "bg-sky-50", border: "border-sky-200/60", iconColor: "text-sky-700", hoverBorder: "hover:border-sky-400/60" },
  { slug: "meditacion", name: "Meditación", icon: Flame, bg: "bg-amber-50", border: "border-amber-200/60", iconColor: "text-amber-700", hoverBorder: "hover:border-amber-400/60" },
  { slug: "chamanismo", name: "Chamanismo", icon: Feather, bg: "bg-stone-100", border: "border-stone-200/60", iconColor: "text-stone-700", hoverBorder: "hover:border-stone-400/60" },
  { slug: "tarot", name: "Tarot", icon: Eye, bg: "bg-violet-50", border: "border-violet-200/60", iconColor: "text-violet-700", hoverBorder: "hover:border-violet-400/60" },
  { slug: "astrologia", name: "Astrología", icon: Star, bg: "bg-yellow-50", border: "border-yellow-200/60", iconColor: "text-yellow-700", hoverBorder: "hover:border-yellow-400/60" },
  { slug: "sanacion-energetica", name: "Sanación Energética", icon: Sparkles, bg: "bg-pink-50", border: "border-pink-200/60", iconColor: "text-pink-700", hoverBorder: "hover:border-pink-400/60" },
  { slug: "aromaterapia", name: "Aromaterapia", icon: Droplets, bg: "bg-emerald-50", border: "border-emerald-200/60", iconColor: "text-emerald-700", hoverBorder: "hover:border-emerald-400/60" },
  { slug: "terapias-holisticas", name: "Terapias Holísticas", icon: Leaf, bg: "bg-green-50", border: "border-green-200/60", iconColor: "text-green-700", hoverBorder: "hover:border-green-400/60" },
  { slug: "circulos-de-mujeres", name: "Círculos de Mujeres", icon: Moon, bg: "bg-rose-50", border: "border-rose-200/60", iconColor: "text-rose-700", hoverBorder: "hover:border-rose-400/60" },
  { slug: "cacao-ceremonia", name: "Cacao Ceremonia", icon: Coffee, bg: "bg-orange-50", border: "border-orange-200/60", iconColor: "text-orange-700", hoverBorder: "hover:border-orange-400/60" },
  { slug: "flores-de-bach", name: "Flores de Bach", icon: Sprout, bg: "bg-lime-50", border: "border-lime-200/60", iconColor: "text-lime-700", hoverBorder: "hover:border-lime-400/60" },
  { slug: "sonidos-y-vibraciones", name: "Sonidos y Vibraciones", icon: Bell, bg: "bg-cyan-50", border: "border-cyan-200/60", iconColor: "text-cyan-700", hoverBorder: "hover:border-cyan-400/60" },
  { slug: "numerologia", name: "Numerología", icon: Hash, bg: "bg-indigo-50", border: "border-indigo-200/60", iconColor: "text-indigo-700", hoverBorder: "hover:border-indigo-400/60" },
  { slug: "pranoterapia", name: "Pranoterapia", icon: Wind, bg: "bg-teal-50", border: "border-teal-200/60", iconColor: "text-teal-700", hoverBorder: "hover:border-teal-400/60" },
  { slug: "limpieza-energetica", name: "Limpieza Energética", icon: CircleDashed, bg: "bg-purple-50", border: "border-purple-200/60", iconColor: "text-purple-700", hoverBorder: "hover:border-purple-400/60" },
  { slug: "plantas-medicinales", name: "Plantas Medicinales", icon: Trees, bg: "bg-green-50", border: "border-green-200/60", iconColor: "text-green-700", hoverBorder: "hover:border-green-400/60" },
  { slug: "masajes-terapeuticos", name: "Masajes Terapéuticos", icon: Heart, bg: "bg-red-50", border: "border-red-200/60", iconColor: "text-red-700", hoverBorder: "hover:border-red-400/60" },
  { slug: "biodanza", name: "Biodanza", icon: PersonStanding, bg: "bg-fuchsia-50", border: "border-fuchsia-200/60", iconColor: "text-fuchsia-700", hoverBorder: "hover:border-fuchsia-400/60" },
];

export default function MarqueeBand() {
  const { ref, isVisible } = useScrollReveal();
  const router = useRouter();

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="container-wide">
        {/* Heading */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="label justify-center inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-sage-300" />
            Actividades
            <span className="w-8 h-px bg-sage-300" />
          </span>
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.12] tracking-[-0.02em] text-bark">
            Explorá por actividad
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => router.push(`/mapa?q=${cat.slug}`)}
                className={`group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-xl border shadow-soft transition-all duration-300 ease-out-expo ${cat.bg} ${cat.border} ${cat.hoverBorder} hover:shadow-medium hover:-translate-y-0.5 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${Math.min(i * 40, 400)}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${cat.bg}`}>
                  <Icon className={`h-5 w-5 ${cat.iconColor} transition-colors duration-300`} strokeWidth={1.5} />
                </div>
                <span className="text-[13px] font-medium text-bark-800 transition-colors duration-300 group-hover:text-bark text-center leading-tight">
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
