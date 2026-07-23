"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-5 sm:py-6">
      <div className="container-page">
        <div
          className={`flex items-center justify-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="w-12 h-px bg-cream-300/70" />
          <p className="text-[13px] text-warmblack/35 font-medium tracking-wide px-6">
            Sanación holística en Mar del Plata
          </p>
          <span className="w-12 h-px bg-cream-300/70" />
        </div>
      </div>
    </section>
  );
}
