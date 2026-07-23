"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

const items = [
  "Sanación Holística",
  "Bienestar Integral",
  "Transformación Personal",
  "Conexión Espiritual",
  "Conciencia Plena",
  "Naturaleza y Equilibrio",
  "Camino Interior",
  "Armonía Corporal",
];

export default function MarqueeBand() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`py-6 sm:py-8 bg-warmblack overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative flex">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="text-white/20 text-sm font-sans font-medium tracking-wide uppercase"
            >
              {item}
              <span className="inline-block ml-12 text-sage-500/20">·</span>
            </span>
          ))}
        </div>
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap absolute top-0 left-full">
          {[...items, ...items].map((item, i) => (
            <span
              key={`dup-${i}`}
              className="text-white/20 text-sm font-sans font-medium tracking-wide uppercase"
            >
              {item}
              <span className="inline-block ml-12 text-sage-500/20">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
