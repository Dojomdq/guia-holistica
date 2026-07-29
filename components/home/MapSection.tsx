"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-200 flex items-center justify-center min-h-[300px]">
      <MapPin className="h-8 w-8 text-cream-400 animate-pulse-subtle" />
    </div>
  ),
});

export default function MapSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative py-24 sm:py-28 bg-sand-100 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay noise-overlay pointer-events-none" />

      <div className="relative container-wide">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-600 mb-4">
            <span className="w-8 h-px bg-sand-400/60" />
            Ubicación
            <span className="w-8 h-px bg-sand-400/60" />
          </span>
          <h2 className="heading-lg text-bark">Encontrá tu espacio</h2>
          <p className="text-bark-600 mt-3 max-w-lg mx-auto">
            Explorá el mapa interactivo y encontrá facilitadores cerca tuyo.
          </p>
        </div>

        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl border border-cream-200/60 overflow-hidden">
            <div className="absolute top-5 left-5 z-[1000] flex items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-medium border border-cream-200/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-500" />
              </span>
              <span className="text-sm font-semibold text-bark">
                Conectá con la comunidad
              </span>
            </div>

            <div className="h-[300px] sm:h-[380px] lg:h-[440px]">
              <MiniMap />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-cream-200/60">
              <div>
                <h3 className="font-serif text-lg font-medium text-bark">
                  Mapa de facilitadores
                </h3>
                <p className="text-sm text-bark-600 mt-0.5">
                  Encontrá al profesional más cercano a vos
                </p>
              </div>
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-terracotta-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 shrink-0 group"
              >
                <MapPin className="h-4 w-4" />
                Mirá el mapa interactivo
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
