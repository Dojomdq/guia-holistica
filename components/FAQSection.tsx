"use client";

import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pregunta: "¿Qué es la Guía Holística?",
    respuesta:
      "Es una plataforma interactiva que reúne facilitadores, terapeutas y guías holísticos en Mar del Plata. Podés buscar por actividad, ubicación y explorar el mapa interactivo.",
  },
  {
    pregunta: "¿Cómo encuentro un facilitador cerca mío?",
    respuesta:
      "Usá el mapa interactivo para ver todos los facilitadores en Mar del Plata. Podés filtrar por actividad y hacer clic en cada punto para ver el perfil completo con dirección, contacto y biografía.",
  },
  {
    pregunta: "¿Los facilitadores están verificados?",
    respuesta:
      "Sí, cada facilitador pasa por un proceso de verificación antes de ser publicado en la guía. Trabajamos para mantener la calidad y confiabilidad de la información.",
  },
  {
    pregunta: "¿Puedo publicar mi práctica holística?",
    respuesta:
      "¡Por supuesto! Si sos facilitador o terapeuta holístico, escribinos para sumarte a la guía. Es gratuito y te ayuda a que más personas te encuentren.",
  },
  {
    pregunta: "¿Qué actividades puedo encontrar?",
    respuesta:
      "Tenemos 18 categorías incluyendo yoga, reiki, meditación, chamanismo, tarot, astrología, aromaterapia, masajes terapéuticos, sanación energética y muchas más.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="container-page">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="section-label justify-center">Preguntas</span>
          <h2 className="heading-section mt-4">FAQ</h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 80 + 200}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between text-left px-6 py-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-cream-300/50 hover:border-cream-400/60 hover:bg-white/80 transition-all duration-300 group"
                aria-expanded={openIndex === i}
              >
                <span className="font-serif text-lg text-warmblack pr-4">
                  {faq.pregunta}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-warmblack/30 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  openIndex === i
                    ? "max-h-40 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-body text-sm leading-relaxed">
                    {faq.respuesta}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
