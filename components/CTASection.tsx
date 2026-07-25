"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { ArrowUpRight, MessageCircle, Users } from "lucide-react";

export default function CTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background — rich terracotta gradient with texture */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, " +
              "#6B3120 0%, " +
              "#843A24 25%, " +
              "#A44626 50%, " +
              "#843A24 75%, " +
              "#6B3120 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay noise-overlay" />
      </div>
      {/* Warm orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-terracotta-300/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative py-12 sm:py-16 lg:py-20 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="container-page text-center">
          {/* Social proof badge */}
          <div
            className={`inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-7 border border-white/10 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Users className="h-4 w-4 text-sand-300" />
            <span className="text-sm font-medium text-white/80">
              22 facilitadores ya están en el mapa
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.025em] text-white mb-5">
            Sumá tu perfil y sumate al mapa
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Sumate al directorio y conectá con personas que buscan tu ayuda.
          </p>
          <a
            href="https://wa.me/5492235742540?text=Hola%2C%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4.5 bg-white text-bark rounded-full text-base font-semibold hover:shadow-large hover:-translate-y-1 transition-all duration-300 group"
          >
            <MessageCircle className="h-5 w-5 text-terracotta-600" />
            Escribinos por WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
