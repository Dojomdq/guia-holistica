"use client";

import { Star } from "lucide-react";
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
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sage-100/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-terracotta-100/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="container-page relative z-10">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="section-label mb-4 block">Qué dicen</span>
          <h2 className="heading-lg text-bark dark:text-cream-100">
            Nuestra comunidad
          </h2>
        </div>

        {/* Testimonio destacado */}
        {testimonioDestacado && (
          <div
            className={`max-w-4xl mx-auto mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="relative bg-white dark:bg-bark-900 rounded-3xl border border-cream-200/80 dark:border-bark-700/80 p-8 sm:p-10 shadow-lg">
              <div className="absolute top-6 right-8 text-6xl text-sage-100 dark:text-sage-900/40 font-serif leading-none">&ldquo;</div>
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 text-amber-400 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-lg sm:text-xl text-bark-700 dark:text-cream-200 leading-relaxed mb-6 max-w-3xl">
                &ldquo;{testimonioDestacado.texto}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sage-100 dark:bg-sage-900/40 border-2 border-white dark:border-bark-800 flex items-center justify-center">
                  <span className="font-serif text-base font-medium text-sage-700 dark:text-sage-300">{testimonioDestacado.iniciales}</span>
                </div>
                <div>
                  <p className="text-base font-medium text-bark dark:text-cream-100">{testimonioDestacado.nombre}</p>
                  <p className="text-sm text-bark-500 dark:text-cream-400">{testimonioDestacado.actividad}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Otros testimonios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {otrosTestimonios.map((t, i) => (
            <div
              key={t.nombre}
              className={`bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
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
      </div>
    </section>
  );
}
