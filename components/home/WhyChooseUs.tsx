"use client";

import { MapPin, Users, Heart, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const REASONS = [
  {
    icon: MapPin,
    title: "Encontrá lo que buscás",
    description: "Buscá por actividad, ciudad o palabra clave. Encontrá al profesional ideal para vos.",
  },
  {
    icon: Users,
    title: "Conectá directo",
    description: "WhatsApp, Instagram o teléfono. Sin intermediarios, sin vueltas.",
  },
  {
    icon: Heart,
    title: "Confianza y calidad",
    description: "Perfiles verificados. Sabés quién está del otro lado.",
  },
  {
    icon: Sparkles,
    title: "Crecemos juntos",
    description: "Sumá tu actividad si no está. La guía se construye con la comunidad.",
  },
];

export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 sm:py-28 bg-cream-50">
      <div className="container-wide">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="inline-flex items-center gap-3 px-5 py-2 bg-sage-600 text-white text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-6 shadow-glow">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            ¿Por qué?
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </span>
          <h2 className="heading-lg text-bark">
            ¿Por qué Guía de Bienestar?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className={`bg-white rounded-2xl border border-cream-200/60 p-7 transition-all duration-500 hover:shadow-lg hover:border-sage-300/50 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-sage-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-sage-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-bark mb-1">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-bark-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
