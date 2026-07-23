"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-200 rounded-3xl flex items-center justify-center min-h-[300px]">
      <MapPin className="h-8 w-8 text-cream-400 animate-pulse" />
    </div>
  ),
});

export default function MapaPreview() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding bg-cream-200/40">
      <div className="container-wide">
        <div className="relative">
          {/* Map — full width, behind */}
          <div
            className={`rounded-3xl overflow-hidden shadow-large border border-cream-300/40 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="h-[350px] sm:h-[420px]">
              <MiniMap />
            </div>
          </div>

          {/* Text card — overlapping, bottom-left */}
          <div
            className={`absolute -bottom-6 sm:-bottom-8 left-4 sm:left-8 right-4 sm:right-auto sm:max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-7 shadow-medium border border-cream-300/40 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <span className="section-label">Explorá</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-warmblack mt-3 tracking-tight">
              El mapa
            </h2>
            <p className="text-sm text-warmblack/65 mt-2 leading-relaxed">
              Descubrí quién está cerca tuyo.
            </p>
            <Link
              href="/mapa"
              className="btn-primary mt-5 text-sm inline-flex group"
            >
              <MapPin className="h-3.5 w-3.5" />
              Abrir mapa
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
