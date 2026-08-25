"use client";

import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const testimonios = [
  {
    nombre: "María",
    actividad: "Reiki",
    iniciales: "M",
    texto: "Gracias a la guía encontré a una profesional increíble que me ayudó en mi proceso de sanación. El mapa facilitó mucho la búsqueda.",
    destacado: true,
  },
  {
    nombre: "Lucas",
    actividad: "Yoga",
    iniciales: "L",
    texto: "Increíble poder ver todas las opciones de actividades en un solo lugar. Muy intuitivo y fácil de usar.",
    destacado: false,
  },
  {
    nombre: "Camila",
    actividad: "Meditación",
    iniciales: "C",
    texto: "La mejor plataforma para conectar con facilitadores en la zona. Profesional, moderna y muy completa.",
    destacado: false,
  },
];

export default function TestimoniosSection() {
  const { ref, isVisible } = useScrollReveal();
  const testimonioDestacado = testimonios.find(t => t.destacado);
  const otrosTestimonios = testimonios.filter(t => !t.destacado);

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-sand-100 dark:bg-bark-900/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] noise-overlay pointer-events-none" />
      <div className="absolute inset-0 section-radial-sage pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sage-100/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-terracotta-100/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="container-page relative z-10">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="section-label mb-4 block">Qué dicen</span>
          <h2 className="heading-lg text-bark dark:text-cream-100">
            Nuestra comunidad
          </h2>
        </div>

        {/* Testimonio destacado estilo review */}
        {testimonioDestacado && (
          <div
            className={`max-w-4xl mx-auto mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="relative bg-white dark:bg-bark-900 rounded-3xl border border-cream-200/60 dark:border-bark-700/80 p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Quote icon decorativo */}
              <div className="absolute -top-4 left-8 w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center shadow-lg">
                <Quote className="h-5 w-5 text-white" fill="currentColor" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-5 mt-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 text-amber-400 fill-amber-400" aria-hidden="true" />
                ))}
                <span className="ml-2 text-sm text-bark-500 dark:text-cream-400">5.0</span>
              </div>

              {/* Texto */}
              <p className="text-lg sm:text-xl text-bark-700 dark:text-cream-200 leading-relaxed mb-8 max-w-3xl italic">
                &ldquo;{testimonioDestacado.texto}&rdquo;
              </p>

              {/* Autor */}
              <div className="flex items-center gap-4 pt-6 border-t border-cream-200/60 dark:border-bark-700/60">
                <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center">
                  <span className="font-serif text-base font-semibold text-sage-700 dark:text-sage-300">{testimonioDestacado.iniciales}</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-bark dark:text-cream-100">{testimonioDestacado.nombre}</p>
                  <p className="text-sm text-bark-500 dark:text-cream-400">{testimonioDestacado.actividad}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Otros testimonios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {otrosTestimonios.map((t, i) => (
            <div
              key={t.nombre}
              className={`bg-white/80 backdrop-blur-sm dark:bg-bark-900 rounded-2xl border border-cream-200/50 dark:border-bark-700/80 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-cream-300/60 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm text-bark-600 dark:text-cream-300 leading-relaxed mb-5 italic">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-cream-200/40">
                <div className="w-9 h-9 rounded-full bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center">
                  <span className="font-serif text-xs font-semibold text-sage-700 dark:text-sage-300">{t.iniciales}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bark dark:text-cream-100">{t.nombre}</p>
                  <p className="text-xs text-bark-500 dark:text-cream-400">{t.actividad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
