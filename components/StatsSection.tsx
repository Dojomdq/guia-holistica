"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-pad-tight">
      <div className="container-page">
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-start transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Number 1 */}
          <div className="md:col-span-4">
            <span className="font-serif text-[clamp(3rem,8vw,5.5rem)] font-medium text-warmblack leading-none tracking-[-0.04em]">
              22
            </span>
            <span className="block text-[13px] text-warmblack/40 font-medium mt-2">
              facilitadores activos
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block md:col-span-1">
            <div className="w-px h-16 bg-cream-300 mx-auto" />
          </div>

          {/* Number 2 */}
          <div className="md:col-span-4">
            <span className="font-serif text-[clamp(3rem,8vw,5.5rem)] font-medium text-warmblack leading-none tracking-[-0.04em]">
              18
            </span>
            <span className="block text-[13px] text-warmblack/40 font-medium mt-2">
              caminos de sanación
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block md:col-span-1">
            <div className="w-px h-16 bg-cream-300 mx-auto" />
          </div>

          {/* Description */}
          <div className="md:col-span-2 flex items-start md:justify-end">
            <p className="text-[13px] text-warmblack/40 leading-relaxed max-w-[180px]">
              Sanación holística en Mar del Plata.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
