"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { INSTAGRAM_URL } from "@/lib/constants";

const testimonios = [
  {
    nombre: "María",
    actividad: "Reiki",
    texto:
      "Gracias a la guía encontré a una profesional increíble que me ayudó en mi proceso de sanación. El mapa facilitó mucho la búsqueda.",
  },
];

export default function TestimoniosSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-cream-50">
      <div className="container-page">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="label">Testimonios</span>

          <div className="max-w-3xl mt-6">
            <span className="font-serif text-6xl sm:text-7xl text-sage-200 leading-none select-none">
              &ldquo;
            </span>
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-bark-900 leading-snug -mt-8 sm:-mt-10 ml-2">
              {testimonios[0].texto}
            </p>
            <div className="mt-8 ml-2">
              <p className="font-medium text-bark text-sm">
                {testimonios[0].nombre}
              </p>
              <p className="text-xs text-bark-500 mt-0.5">
                {testimonios[0].actividad}
              </p>
            </div>
          </div>

          <div className="mt-8 ml-2">
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
