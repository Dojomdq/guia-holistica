"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { ArrowUpRight, MessageCircle, Users } from "lucide-react";

export default function CTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background — warm sage gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cta-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>
      {/* Warm orbs — slightly more visible */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-clay-400/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative py-10 sm:py-14 lg:py-18 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="container-page text-center">
          {/* Social proof badge */}
          <div
            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Users className="h-4 w-4 text-sand-300" />
            <span className="text-sm font-medium text-white/80">
              22 facilitadores ya están en el mapa
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-white mb-5">
            Sumá tu perfil y sumate al mapa
          </h2>
          <p className="text-sage-200/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Sumate al directorio y conectá con personas que buscan tu ayuda.
          </p>
          <a
            href="https://wa.me/5492235742540?text=Hola%2C%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-warmblack rounded-full text-base font-semibold hover:shadow-large hover:-translate-y-1 transition-all duration-300 group"
          >
            <MessageCircle className="h-5 w-5 text-sage-600" />
            Escribinos por WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
