"use client";

import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function NewCTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, #6B3120 0%, #843A24 25%, #A44626 50%, #843A24 75%, #6B3120 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay noise-overlay" />
      </div>
      {/* Warm orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-terracotta-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative py-24 sm:py-28 lg:py-32">
        <div className="container-wide text-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Heart className="h-8 w-8 text-sand-300/50 mx-auto mb-6" />
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-white max-w-3xl mx-auto">
              Sumá tu perfil y conectá con quienes te buscan
            </h2>
            <p className="text-white/50 text-lg mt-5 max-w-xl mx-auto leading-relaxed">
              Unite a la comunidad de bienestar más grande de Mar del Plata.
            </p>
          </div>

          <div
            className={`mt-10 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href="https://wa.me/5492235742540"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-bark rounded-full text-base font-semibold hover:bg-white/90 hover:-translate-y-1 hover:shadow-large transition-all duration-300 group"
            >
              Sumarme ahora
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
