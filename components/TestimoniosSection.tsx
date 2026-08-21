"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { INSTAGRAM_URL } from "@/lib/constants";

const testimonios = [
  {
    nombre: "María",
    actividad: "Reiki",
    iniciales: "M",
    texto: "Gracias a la guía encontré a una profesional increíble que me ayudó en mi proceso de sanación. El mapa facilitó mucho la búsqueda.",
  },
  {
    nombre: "Lucas",
    actividad: "Yoga",
    iniciales: "L",
    texto: "Increíble poder ver todas las opciones de actividades en un solo lugar. Muy intuitivo y fácil de usar.",
  },
  {
    nombre: "Camila",
    actividad: "Meditación",
    iniciales: "C",
    texto: "La mejor plataforma para conectar con facilitadores en la zona. Profesional, moderna y muy completa.",
  },
];

export default function TestimoniosSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-12 sm:py-16 bg-sand-100 dark:bg-bark-900/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] noise-overlay pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="container-page relative z-10">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="label mb-4 block">Qué dicen</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-bark dark:text-cream-100">
            Nuestra comunidad
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {testimonios.map((t, i) => (
            <div
              key={t.nombre}
              className={`bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 p-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm text-bark-600 dark:text-cream-300 leading-relaxed mb-5">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sage-100 dark:bg-sage-900/40 border-2 border-white dark:border-bark-800 flex items-center justify-center">
                  <span className="font-serif text-xs font-medium text-sage-700 dark:text-sage-300">{t.iniciales}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-bark dark:text-cream-100">{t.nombre}</p>
                  <p className="text-xs text-bark-500 dark:text-cream-400">{t.actividad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-sage-700 dark:text-sage-400 hover:text-terracotta-600 transition-colors"
          >
            📖 <span aria-hidden="true" /> Ver más opiniones en Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
