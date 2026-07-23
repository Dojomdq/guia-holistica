"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-10 sm:py-14">
      <div className="container-page">
        <div
          className={`flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12 lg:gap-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-medium text-warmblack tracking-tight leading-none">
              22
            </span>
            <span className="text-sm text-warmblack/60 font-medium">
              facilitadores
            </span>
          </div>

          <div className="hidden md:block w-px h-8 bg-cream-400/60 self-center" />

          <div className="flex items-baseline gap-3">
            <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-medium text-warmblack tracking-tight leading-none">
              18
            </span>
            <span className="text-sm text-warmblack/60 font-medium">
              caminos
            </span>
          </div>

          <div className="hidden md:block w-px h-8 bg-cream-400/60 self-center" />

          <p className="text-warmblack/60 text-sm max-w-[200px] leading-relaxed">
            Sanación holística en Mar del Plata.
          </p>
        </div>
      </div>
    </section>
  );
}
