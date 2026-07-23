"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { Star } from "lucide-react";

const testimonios = [
  {
    nombre: "María",
    actividad: "Reiki",
    texto:
      "Gracias a la guía encontré a una profesional increíble que me ayudó en mi proceso de sanación. El mapa facilitó mucho la búsqueda.",
  },
  {
    nombre: "Lucas",
    actividad: "Yoga",
    texto:
      "Increíble poder ver todas las opciones de actividades holísticas en un solo lugar. Muy intuitivo y fácil de usar.",
  },
  {
    nombre: "Camila",
    actividad: "Meditación",
    texto:
      "La mejor plataforma para conectar con facilitadores en Mar del Plata. Profesional, moderna y muy completa.",
  },
];

export default function TestimoniosSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding bg-cream-200/40">
      <div className="container-page">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="section-label justify-center">Testimonios</span>
          <h2 className="heading-section mt-4">Lo que dicen</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonios.map((t, i) => (
            <div
              key={t.nombre}
              className={`card-base ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-sand-400 text-sand-400"
                  />
                ))}
              </div>
              <p className="text-body text-sm italic leading-relaxed">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="mt-6 pt-5 divider-subtle">
                <p className="font-serif text-base font-medium text-warmblack">
                  {t.nombre}
                </p>
                <p className="text-xs text-warmblack/40 mt-0.5">
                  {t.actividad}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
