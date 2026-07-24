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

export default function MapaPreview() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-3 sm:py-5 lg:py-6 bg-sand-50/60">
      <div className="container-wide">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Map */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl overflow-hidden border border-cream-300/50 shadow-medium">
              <div className="h-[260px] sm:h-[320px] lg:h-[360px]">
                <MiniMap />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-4 lg:pb-4">
            <span className="label">Explorá</span>
            <h2 className="heading-md mt-3 mb-3">
              El mapa
            </h2>
            <p className="text-[15px] text-warmblack/45 leading-relaxed mb-6">
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
