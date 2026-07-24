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

  const marqueeContent = (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className="text-warmblack/25 text-sm font-sans font-medium tracking-wide uppercase shrink-0"
        >
          {item}
          <span className="inline-block mx-10 text-sage-400/30">·</span>
        </span>
      ))}
    </>
  );

  return (
    <section
      ref={ref}
      className={`py-4 bg-sand-100/80 overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-display text-warmblack text-center mb-4">Explorá por actividad</h2>
      <div className="flex animate-marquee w-max">
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0" aria-hidden="true">{marqueeContent}</div>
      </div>
    </section>
  );
}
