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
  { slug: "yoga", name: "Yoga", icon: Flower2, bg: "bg-purple-50", iconColor: "text-purple-600", hoverBg: "hover:bg-purple-100", badge: "" },
  { slug: "reiki", name: "Reiki", icon: Hand, bg: "bg-sky-50", iconColor: "text-sky-600", hoverBg: "hover:bg-sky-100", badge: "" },
  { slug: "meditacion", name: "Meditación", icon: Flame, bg: "bg-amber-50", iconColor: "text-amber-600", hoverBg: "hover:bg-amber-100", badge: "" },
  { slug: "chamanismo", name: "Chamanismo", icon: Feather, bg: "bg-orange-50", iconColor: "text-orange-600", hoverBg: "hover:bg-orange-100", badge: "Destacado" },
  { slug: "tarot", name: "Tarot", icon: Eye, bg: "bg-violet-50", iconColor: "text-violet-600", hoverBg: "hover:bg-violet-100", badge: "" },
  { slug: "astrologia", name: "Astrología", icon: Star, bg: "bg-yellow-50", iconColor: "text-yellow-600", hoverBg: "hover:bg-yellow-100", badge: "" },
  { slug: "sanacion-energetica", name: "Sanación energética", icon: Sparkles, bg: "bg-pink-50", iconColor: "text-pink-600", hoverBg: "hover:bg-pink-100", badge: "" },
  { slug: "terapias-holisticas", name: "Terapias holísticas", icon: Leaf, bg: "bg-emerald-50", iconColor: "text-emerald-600", hoverBg: "hover:bg-emerald-100", badge: "Nuevo" },
  { slug: "biodanza", name: "Biodanza", icon: PersonStanding, bg: "bg-rose-50", iconColor: "text-rose-600", hoverBg: "hover:bg-rose-100", badge: "" },
  { slug: "aromaterapia", name: "Aromaterapia", icon: Droplets, bg: "bg-teal-50", iconColor: "text-teal-600", hoverBg: "hover:bg-teal-100", badge: "" },
  { slug: "circulos-de-mujeres", name: "Círculos de mujeres", icon: Moon, bg: "bg-fuchsia-50", iconColor: "text-fuchsia-600", hoverBg: "hover:bg-fuchsia-100", badge: "" },
  { slug: "cacao-ceremonia", name: "Cacao ceremony", icon: Coffee, bg: "bg-red-50", iconColor: "text-red-600", hoverBg: "hover:bg-red-100", badge: "Nuevo" },
  { slug: "flores-de-bach", name: "Flores de Bach", icon: Sprout, bg: "bg-lime-50", iconColor: "text-lime-600", hoverBg: "hover:bg-lime-100", badge: "" },
  { slug: "sonidos-y-vibraciones", name: "Sonidos y vibraciones", icon: Bell, bg: "bg-cyan-50", iconColor: "text-cyan-600", hoverBg: "hover:bg-cyan-100", badge: "" },
  { slug: "numerologia", name: "Numerología", icon: Hash, bg: "bg-indigo-50", iconColor: "text-indigo-600", hoverBg: "hover:bg-indigo-100", badge: "" },
  { slug: "pranoterapia", name: "Pranoterapia", icon: Wind, bg: "bg-sky-50", iconColor: "text-sky-600", hoverBg: "hover:bg-sky-100", badge: "" },
  { slug: "limpieza-energetica", name: "Limpieza energética", icon: CircleDashed, bg: "bg-violet-50", iconColor: "text-violet-600", hoverBg: "hover:bg-violet-100", badge: "" },
  { slug: "plantas-medicinales", name: "Plantas medicinales", icon: Trees, bg: "bg-green-50", iconColor: "text-green-600", hoverBg: "hover:bg-green-100", badge: "" },
  { slug: "masajes-terapeuticos", name: "Masajes terapéuticos", icon: Heart, bg: "bg-rose-50", iconColor: "text-rose-600", hoverBg: "hover:bg-rose-100", badge: "Destacado" },
];

export default function CategoryGrid() {
  const { ref, isVisible } = useScrollReveal();
  const router = useRouter();

  return (
    <section ref={ref} className="py-20 sm:py-24 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545243424-0ce743321e11?w=1920&h=800&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cream-50/97" />
      </div>
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay noise-overlay pointer-events-none" />

      <div className="relative container-wide">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-bark/40 mb-4">
            <span className="w-8 h-px bg-bark/20" />
            Explorá
            <span className="w-8 h-px bg-bark/20" />
          </span>
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.12] tracking-[-0.02em] text-bark">
            Explorá las actividades disponibles
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 max-w-6xl mx-auto">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => router.push(`/mapa?q=${cat.slug}`)}
                className={`group relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border border-cream-200/60 transition-all duration-200 ease-out-expo hover:scale-105 hover:shadow-lg cursor-pointer ${cat.bg} ${cat.hoverBg} ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${Math.min(i * 30, 400)}ms` }}
              >
                {cat.badge && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-sage-600 text-white text-[9px] font-semibold rounded-full leading-none tracking-wide">
                    {cat.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Icon className={`h-6 w-6 ${cat.iconColor}`} strokeWidth={1.5} />
                </div>
                <span className="text-[12px] font-medium text-bark/65 group-hover:text-bark transition-colors duration-300 text-center leading-tight">
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
