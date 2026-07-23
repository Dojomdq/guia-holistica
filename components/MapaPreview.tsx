"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowRight } from "lucide-react";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-72 bg-stone-100 rounded-2xl flex items-center justify-center">
      <MapPin className="h-8 w-8 text-stone-300 animate-pulse" />
    </div>
  ),
});

export default function MapaPreview() {
  return (
    <section className="py-20 bg-stone-100/50">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
              Explorá
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Mapa Interactivo
            </h2>
            <p className="text-stone-500 text-lg mb-8 leading-relaxed">
              Descubrí facilitadores cerca tuyo en Mar del Plata.
            </p>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-stone-800 transition-all shadow-sm text-sm"
            >
              <MapPin className="h-4 w-4" />
              Abrir Mapa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-stone-200/50 border border-stone-200/50">
              <MiniMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
