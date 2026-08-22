"use client";

import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pregunta: "¿Qué es la Guía de Bienestar?",
    respuesta:
      "Es una plataforma interactiva que reúne facilitadores, terapeutas y guías. Podés buscar por actividad, ubicación y explorar el mapa interactivo.",
  },
  {
    pregunta: "¿Cómo encuentro un facilitador cerca mío?",
    respuesta:
      "Usá el mapa interactivo para ver todos los facilitadores. Podés filtrar por actividad y hacer clic en cada punto para ver el perfil completo con dirección, contacto y biografía.",
  },
  {
    pregunta: "¿Los facilitadores están verificados?",
    respuesta:
      "Sí, cada facilitador pasa por un proceso de verificación antes de ser publicado en la guía. Trabajamos para mantener la calidad y confiabilidad de la información.",
  },
  {
    pregunta: "¿Puedo publicar mi práctica de bienestar?",
    respuesta:
      "¡Por supuesto! Si sos profesional de bienestar, escribinos para sumarte a la guía. Te ayuda a que más personas te encuentren.",
  },
  {
    pregunta: "¿Qué actividades puedo encontrar?",
    respuesta:
      "Tenemos múltiples categorías incluyendo yoga, reiki, meditación, chamanismo, tarot, astrología, aromaterapia, masajes terapéuticos, sanación energética y muchas más.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-72 h-72 bg-sage-100/30 rounded-full blur-3xl pointer-events-none animate-blob" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-terracotta-100/20 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-4000" />
      <div className="container-page relative z-10">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="section-label justify-center">Preguntas</span>
          <h2 className="heading-lg mt-4">Preguntas frecuentes</h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${i * 80 + 200}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full flex items-center justify-between text-left px-6 py-5 rounded-2xl border transition-interactive group ${
                  openIndex === i
                    ? "bg-white/80 backdrop-blur-sm border-sage-300/50 shadow-medium"
                    : "bg-white/60 backdrop-blur-sm border-cream-300/50 hover:border-cream-400/60 hover:bg-white/80"
                }`}
                aria-expanded={openIndex === i}
              >
                <span className="font-serif text-lg text-bark pr-4">
                  {faq.pregunta}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                    openIndex === i
                      ? "rotate-180 text-sage-600"
                      : "text-bark-500 group-hover:text-bark-600"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  openIndex === i
                    ? "max-h-96 opacity-100 mt-2"
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
