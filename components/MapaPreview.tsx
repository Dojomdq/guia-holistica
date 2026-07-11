"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
      <MapPin className="h-8 w-8 text-gray-300 animate-pulse" />
    </div>
  ),
});

export default function MapaPreview() {
  return (
    <section className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Mapa Interactivo
            </h2>
            <p className="text-gray-500 text-lg mb-6">
              Explorá nuestro mapa y descubrí facilitadores cerca tuyo.
            </p>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              <MapPin className="h-4 w-4" />
              Abrir Mapa
            </Link>
          </div>
          <div className="flex-1 w-full">
            <MiniMap />
          </div>
        </div>
      </div>
    </section>
  );
}
