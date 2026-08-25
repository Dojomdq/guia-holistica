"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CITY_NAME } from "@/lib/constants";
import { useRipple } from "@/lib/useRipple";

export default function NewHero() {
  const [loaded, setLoaded] = useState(false);
  const createRipple = useRipple("rgba(255, 255, 255, 0.4)");

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785019465/AF49F0FF-4A15-4EA3-AE9F-AC8F83C11FC0_hkigqu.jpg"
          alt="Guía de Bienestar - Terapeutas y facilitadores holísticos en Mar del Plata"
          fill
          className="object-cover scale-[1.08]"
          priority
        />
        <div className="absolute inset-0 hero-animated-gradient opacity-50 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/40 via-bark/25 to-bark/60" />
      </div>

      {/* Massive floating orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-sage-400/30 blur-[150px] animate-drift pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-terracotta-400/25 blur-[150px] animate-floaty pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cream-200/15 blur-[120px] animate-drift pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] grid-pattern pointer-events-none" />

      <div className="relative z-10 w-full px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className={`mb-8 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-[11px] font-mono font-medium tracking-[0.18em] uppercase text-white/90 border border-white/20 shadow-2xl shadow-black/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-400"></span>
              </span>
              {CITY_NAME} · Argentina
            </span>
          </div>

          {/* Massive headline */}
          <h1 className={`text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.04em] font-semibold text-white mb-8 text-balance transition-all duration-1000 ease-out drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            Encontrá tu{" "}
            <span className="relative inline-block">
              <span className="text-sage-200">guía</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-sage-400/60" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            de bienestar
          </h1>

          {/* Subtitle */}
          <p className={`text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-14 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Conectá con profesionales verificados de forma rápida, directa y confiable.
          </p>

          {/* CTA */}
          <div className={`transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <Link
              href="/mapa"
              onClick={createRipple}
              className="group ripple-container inline-flex items-center gap-3 px-12 py-5 bg-white text-bark rounded-full text-lg font-semibold shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:shadow-[0_16px_60px_rgba(255,255,255,0.35)] hover:scale-[1.04] hover:-translate-y-1 transition-all duration-300"
            >
              Explorá el mapa
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/50" />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent pointer-events-none" />
    </section>
  );
}
