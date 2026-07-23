"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sage-900 via-sage-800 to-warmblack" />
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sand-400/10 rounded-full blur-3xl" />

      <div
        className={`relative container-page text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <span className="section-label justify-center text-sage-300 before:bg-sage-300">
          Sumate
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mt-6 mb-6 tracking-tight">
          ¿Sos facilitador?
        </h2>
        <p className="text-sage-200/60 text-lg sm:text-xl mb-12 max-w-lg mx-auto leading-relaxed font-light">
          Que miles de personas te encuentren. Unite a la comunidad de
          facilitadores más grande de Mar del Plata.
        </p>
        <a
          href="mailto:contacto@guiaholistica.com.ar"
          className="inline-flex items-center gap-3 bg-white text-sage-900 px-8 py-4 rounded-full font-medium hover:bg-cream-100 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 text-sm group"
        >
          Escribinos
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
