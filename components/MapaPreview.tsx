"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowUpRight } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/lib/useScrollReveal";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-200 flex items-center justify-center min-h-[300px]">
      <MapPin className="h-8 w-8 text-cream-400 animate-pulse-subtle" />
    </div>
  ),
});

export default function MapaPreview() {
  const { ref, isVisible } = useScrollReveal();
  const { ref: countRef, count } = useCountUp(22, 1500);

  return (
    <section ref={ref} className="py-10 sm:py-14 lg:py-16 bg-cream-100/50">
      <div className="container-wide">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Map card */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-cream-200/60 overflow-hidden">
            {/* Badge */}
            <div
              ref={countRef}
              className="absolute top-5 left-5 z-[1000] flex items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-medium border border-cream-200/80"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-500" />
              </span>
              <span className="text-sm font-semibold text-bark">
                {count} facilitadores
              </span>
            </div>

            {/* Map — full width inside card */}
            <div className="h-[300px] sm:h-[380px] lg:h-[440px]">
              <MiniMap />
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-cream-200/60">
              <div>
                <h3 className="font-serif text-lg font-medium text-bark">
                  Mapa de facilitadores
                </h3>
                <p className="text-sm text-bark-600 mt-0.5">
                  Encontrá al profesional más cercano a vos en Mar del Plata
                </p>
              </div>
              <Link
                href="/mapa"
                className="btn-dark group shrink-0"
              >
                <MapPin className="h-4 w-4" />
                Explorá el mapa completo
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
