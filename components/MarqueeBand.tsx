"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

const items = [
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
      className={`py-5 sm:py-6 bg-sand-100/80 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-warmblack/25 text-sm font-sans font-medium tracking-wide uppercase shrink-0"
          >
            {item}
            <span className="inline-block mx-10 text-sage-400/30">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
