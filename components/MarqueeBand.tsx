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
      className={`py-8 sm:py-10 bg-warmblack overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative flex">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="text-cream-400/70 text-sm sm:text-base font-serif italic tracking-wide"
            >
              {item}
              <span className="inline-block mx-8 text-sage-500/50">•</span>
            </span>
          ))}
        </div>
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap absolute top-0 left-full">
          {[...items, ...items].map((item, i) => (
            <span
              key={`dup-${i}`}
              className="text-cream-400/70 text-sm sm:text-base font-serif italic tracking-wide"
            >
              {item}
              <span className="inline-block mx-8 text-sage-500/50">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
