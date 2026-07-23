"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowRight } from "lucide-react";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-stone-100 rounded-2xl flex items-center justify-center">
      <MapPin className="h-8 w-8 text-stone-300 animate-pulse" />
    </div>
  ),
});

export default function MapaPreview() {
  return (
    <section className="py-24 bg-stone-100/40">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-2">
              Explorá
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
              El mapa
            </h2>
            <p className="text-stone-500 text-lg mb-8 leading-relaxed max-w-md">
              Descubrí quién está cerca tuyo. Cada punto es un facilitador verificado.
            </p>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3.5 rounded-2xl font-semibold hover:bg-stone-800 transition-all text-sm"
            >
              <MapPin className="h-4 w-4" />
              Abrir mapa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-300/30 border border-stone-200/40">
            <MiniMap />
          </div>
        </div>
      </div>
    </section>
  );
}
