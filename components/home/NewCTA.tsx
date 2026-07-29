"use client";

import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function NewCTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785019465/IMG_20240709_175009590_zycrnh.jpg"
          alt="Personas en la costa de Mar del Plata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bark/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/40 via-bark/55 to-bark/75" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay noise-overlay pointer-events-none" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-sand-400/[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-sand-400/[0.06] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-sand-400/[0.08] pointer-events-none" />

      {/* Floating dots */}
      <div className="absolute top-24 left-[15%] w-2 h-2 rounded-full bg-sand-300/10 pointer-events-none" style={{ animation: "blob 15s ease-in-out infinite" }} />
      <div className="absolute bottom-32 right-[20%] w-3 h-3 rounded-full bg-sand-300/10 pointer-events-none" style={{ animation: "blob 20s ease-in-out infinite reverse" }} />

      <div className="relative py-24 sm:py-28 lg:py-32">
        <div className="container-wide text-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Heart className="h-8 w-8 text-sand-400 mx-auto mb-6" />
            <h2 className="heading-lg text-white max-w-3xl mx-auto">
              Sumá tu perfil y conectá con quienes te buscan
            </h2>
            <p className="text-cream-100 text-lg mt-5 max-w-xl mx-auto leading-relaxed">
              Unite a la comunidad de bienestar más grande de Mar del Plata.
            </p>
          </div>

          <div
            className={`mt-10 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-3 px-10 py-5 bg-white text-bark rounded-full text-base font-semibold hover:bg-cream-100 hover:scale-102 hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cream-200/40 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out pointer-events-none" style={{ backgroundSize: "200% 100%" }} />
              <span className="relative z-10">Sumarme ahora</span>
              <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
