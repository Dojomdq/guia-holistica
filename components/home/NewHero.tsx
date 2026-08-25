"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";
import { CITY_NAME } from "@/lib/constants";
import { useRipple } from "@/lib/useRipple";

export default function NewHero() {
  const [loaded, setLoaded] = useState(false);
  const createRipple = useRipple("rgba(209, 214, 209, 0.4)");

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785019465/AF49F0FF-4A15-4EA3-AE9F-AC8F83C11FC0_hkigqu.jpg"
          alt="Guía de Bienestar - Terapeutas y facilitadores holísticos en Mar del Plata"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 hero-animated-gradient opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-bark/35" />
      </div>

      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-sage-400/25 blur-[120px] animate-drift pointer-events-none" />
      <div className="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-terracotta-400/20 blur-[120px] animate-floaty pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cream-100/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`mb-7 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-100 border border-white/20 shadow-lg shadow-black/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-400"></span>
              </span>
              {CITY_NAME} · Argentina
              <Sparkles className="h-3 w-3" />
            </span>
          </div>

          <h1 className={`heading-xl text-white mb-6 text-balance transition-all duration-1000 ease-out drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Encontrá terapeutas y guías de{" "}
            <span className="text-sage-200 drop-shadow-[0_2px_8px_rgba(90,143,143,0.4)]">bienestar</span>{" "}
            en tu ciudad
          </h1>

          <p className={`text-cream-100/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-700 delay-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Conectá con profesionales verificados de forma rápida, directa y confiable.
          </p>

          <div className={`transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link
              href="/mapa"
              onClick={createRipple}
              className="group ripple-container inline-flex items-center gap-3 px-10 py-4.5 bg-white text-bark rounded-full text-base font-semibold shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.3)] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300"
            >
              Explorá el mapa
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
