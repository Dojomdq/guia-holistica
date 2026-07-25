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
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Map */}
          <div className="lg:col-span-8 relative">
            <div className="rounded-2xl overflow-hidden border border-cream-300/40 shadow-warm transition-shadow duration-500 hover:shadow-large">
              <div className="h-[280px] sm:h-[340px] lg:h-[400px] relative">
                <MiniMap />
                {/* Facilitador count badge */}
                <div
                  ref={countRef}
                  className="absolute top-4 left-4 z-[1000] flex items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-warm border border-cream-200/80"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-500" />
                  </span>
                  <span className="text-sm font-semibold text-bark">
                    {count} facilitadores
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="label">Explorá</span>
            <h2 className="heading-md mt-3 mb-3">
              El mapa
            </h2>
            <p className="text-base text-bark/50 leading-relaxed mb-6">
              Mirá en el mapa dónde están los facilitadores y encontrá el más cercano a vos.
            </p>
            <Link
              href="/mapa"
              className="btn-dark group"
            >
              <MapPin className="h-4 w-4" />
              Explorá el mapa completo
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
