"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function NewCTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-12 sm:py-16" aria-labelledby="cta-titulo">
      <div className="container-wide">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-700 via-sage-600 to-terracotta-500 px-6 py-14 sm:px-12 sm:py-16 shadow-xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto text-center sm:text-left">
            <h2 id="cta-titulo" className="font-serif text-2xl sm:text-3xl text-white max-w-2xl leading-snug">
              ¿Sos profesional? Sumá tu perfil y conectá con nuevos pacientes.
            </h2>
            <Link
              href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hola, quiero sumar mi perfil a la Guía de Bienestar")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-bark rounded-full text-base font-semibold hover:bg-cream-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shrink-0 group"
            >
              Quiero sumarme
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
