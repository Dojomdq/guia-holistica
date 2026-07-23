"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-cream-200 rounded-3xl flex items-center justify-center">
      <MapPin className="h-8 w-8 text-cream-400 animate-pulse" />
    </div>
  ),
});

export default function MapaPreview() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding bg-cream-200/40">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="section-label">Explorá</span>
            <h2 className="heading-section mt-4">El mapa</h2>
            <p className="text-body mt-6 max-w-md">
              Descubrí quién está cerca tuyo. Cada punto es un facilitador
              verificado listo para acompañarte.
            </p>
            <Link
              href="/mapa"
              className="btn-primary mt-8 group"
            >
              <MapPin className="h-4 w-4" />
              Abrir mapa
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="rounded-3xl overflow-hidden shadow-large border border-cream-300/40">
              <MiniMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
