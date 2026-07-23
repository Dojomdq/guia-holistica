"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { ArrowUpRight } from "lucide-react";

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
      {/* Warm orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-clay-400/8 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative section-pad transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="container-page text-center">
          <span className="label-light justify-center inline-flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-sand-300/30" />
            Sumate
            <span className="w-6 h-px bg-sand-300/30" />
          </span>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-white mb-6">
            ¿Sos facilitador?
          </h2>
          <p className="text-sage-200/60 text-body-lg mb-10 max-w-md mx-auto leading-relaxed">
            Que miles de personas te encuentren. Unite a la comunidad de
            facilitadores más grande de Mar del Plata.
          </p>
          <a
            href="mailto:contacto@guiaholistica.com.ar"
            className="btn-white group"
          >
            Escribinos
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
