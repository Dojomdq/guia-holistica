"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin, ArrowUpRight, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-cream-200 flex items-center justify-center min-h-[320px]">
      <Loader2 className="h-8 w-8 text-cream-400 animate-spin" />
    </div>
  ),
});

export default function MapSection() {
  const { ref, isVisible } = useScrollReveal();
  const [mapaCargado, setMapaCargado] = useState(false);

  return (
    <section id="mapa" ref={ref} className="py-16 sm:py-24 bg-sand-100 overflow-hidden">
      <div className="relative container-wide">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="section-label justify-center">Mapa</span>
          <h2 className="heading-lg text-bark mt-4">Encontrá profesionales cerca tuyo</h2>
          <p className="text-bark-600 mt-3 max-w-lg mx-auto">
            Explorá el mapa interactivo y descubrí todos los facilitadores de la zona.
          </p>
        </div>

        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl border border-cream-200/60 overflow-hidden">
            {mapaCargado ? (
              <div className="h-[320px] sm:h-[400px]">
                <MiniMap />
              </div>
            ) : (
              <div
                className="relative h-[320px] sm:h-[400px] flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "linear-gradient(rgba(232,222,208,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(232,222,208,0.35) 1px, transparent 1px), linear-gradient(135deg, #FAF6EE 0%, #E8DED0 100%)",
                  backgroundSize: "32px 32px, 32px 32px, cover",
                }}
              >
                <div className="absolute left-[8%] top-[20%] text-3xl opacity-60" aria-hidden="true">📍</div>
                <div className="absolute right-[14%] top-[30%] text-2xl opacity-50" aria-hidden="true">🧘</div>
                <div className="absolute left-[22%] bottom-[18%] text-2xl opacity-50" aria-hidden="true">🔮</div>

                <div className="relative z-10 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white shadow-xl border border-cream-200/60 flex items-center justify-center mx-auto mb-5">
                    <MapPin className="h-7 w-7 text-sage-600" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-bark">
                    El mapa interactivo se carga bajo demanda
                  </h3>
                  <p className="text-bark-600 text-sm sm:text-base mt-2 max-w-sm mx-auto">
                    Esto hace que la página cargue mucho más rápido. Hacé clic para explorarlo.
                  </p>
                  <button
                    onClick={() => setMapaCargado(true)}
                    className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-terracotta-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Cargar mapa interactivo
                  </button>
                </div>
              </div>
            )}

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
                Mirá el mapa completo
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
