"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

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
    <section ref={ref} className="py-14 sm:py-20">
      <div className="container-page">
        {/* Header — minimal */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="section-label">Testimonios</span>
        </div>

        {/* Large editorial quote — first testimonio */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-3xl">
            <span className="font-serif text-6xl sm:text-7xl text-sage-300/40 leading-none select-none">
              &ldquo;
            </span>
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-warmblack/80 leading-snug -mt-8 sm:-mt-10 ml-2">
              {testimonios[0].texto}
            </p>
            <div className="mt-8 ml-2">
              <p className="font-medium text-warmblack text-sm">
                {testimonios[0].nombre}
              </p>
              <p className="text-xs text-warmblack/35 mt-0.5">
                {testimonios[0].actividad}
              </p>
            </div>
          </div>
        </div>

        {/* Two smaller quotes — side by side */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 pt-10 border-t border-cream-300/40 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {testimonios.slice(1).map((t) => (
            <div key={t.nombre}>
              <p className="text-warmblack/50 text-sm leading-relaxed italic">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="mt-4">
                <p className="font-medium text-warmblack text-sm">
                  {t.nombre}
                </p>
                <p className="text-xs text-warmblack/35 mt-0.5">
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
