"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { INSTAGRAM_URL } from "@/lib/constants";

const testimonio = {
  nombre: "María",
  actividad: "Reiki",
  iniciales: "M",
  texto:
    "Gracias a la guía encontré a una profesional increíble que me ayudó en mi proceso de sanación. El mapa facilitó mucho la búsqueda.",
};

export default function TestimoniosSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-sand-100">
      <div className="container-page">
        <div
          className={`max-w-2xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="label">Qué dicen</span>

          <div className="mt-8 relative bg-white rounded-3xl border border-cream-200/60 shadow-lg p-8 sm:p-10 text-center">
            <div className="flex justify-center mb-5 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-amber-400 fill-amber-400"
                  aria-hidden="true"
                />
              ))}
              <span className="sr-only">5 estrellas</span>
            </div>

            <p className="font-serif text-xl sm:text-2xl text-bark-800 leading-relaxed italic">
              &ldquo;{testimonio.texto}&rdquo;
            </p>

            <div className="mt-7 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-sage-100 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="font-serif text-base font-medium text-sage-700">
                  {testimonio.iniciales}
                </span>
              </div>
              <div>
                <p className="font-medium text-bark text-sm">
                  {testimonio.nombre}
                </p>
                <p className="text-xs text-bark-500">{testimonio.actividad}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-sage-700 hover:text-terracotta-600 hover:gap-3 transition-all duration-300"
            >
              📖 Ver más opiniones de usuarios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
