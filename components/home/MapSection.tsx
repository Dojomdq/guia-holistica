"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2 } from "lucide-react";
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
    <section id="mapa" ref={ref} className="py-16 sm:py-24 bg-cream-50 overflow-hidden">
      <div className="relative container-wide">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="section-label">Mapa</span>
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
                    "linear-gradient(rgba(184,166,139,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(184,166,139,0.18) 1px, transparent 1px), linear-gradient(135deg, #F3EDE1 0%, #E6D9C6 55%, #D8C7AE 100%)",
                  backgroundSize: "36px 36px, 36px 36px, cover",
                }}
              >
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-sand-300/40 blur-2xl" aria-hidden="true" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sage-200/40 blur-2xl" aria-hidden="true" />

                <div className="absolute left-[10%] top-[22%] flex flex-col items-center" aria-hidden="true">
                  <span className="text-3xl drop-shadow-md">🧘</span>
                  <span className="w-1 h-1 rounded-full bg-terracotta-500 mt-1" />
                </div>
                <div className="absolute right-[16%] top-[32%] flex flex-col items-center" aria-hidden="true">
                  <span className="text-3xl drop-shadow-md">🔮</span>
                  <span className="w-1 h-1 rounded-full bg-terracotta-500 mt-1" />
                </div>
                <div className="absolute left-[24%] bottom-[20%] flex flex-col items-center" aria-hidden="true">
                  <span className="text-3xl drop-shadow-md">📍</span>
                  <span className="w-1 h-1 rounded-full bg-terracotta-500 mt-1" />
                </div>

                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3.5 py-1.5 shadow-medium border border-cream-300/50" aria-hidden="true">
                  <MapPin className="h-3.5 w-3.5 text-sage-600" />
                  <span className="text-xs font-medium text-bark">Tu ciudad</span>
                </div>

                <div className="relative z-10 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white shadow-xl border border-cream-200/60 flex items-center justify-center mx-auto mb-5">
                    <MapPin className="h-7 w-7 text-sage-600" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-bark">
                    Descubrí a todos los profesionales en el mapa
                  </h3>
                  <button
                    onClick={() => setMapaCargado(true)}
                    className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-terracotta-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Cargar mapa interactivo
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 sm:px-8 py-5 border-t border-cream-200/60">
              <h3 className="font-serif text-lg font-medium text-bark">
                Mapa de facilitadores
              </h3>
              <p className="text-sm text-bark-600 mt-0.5">
                Encontrá al profesional más cercano a vos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
