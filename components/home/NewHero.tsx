"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";
import { CITY_NAME } from "@/lib/constants";
import HeroParticles from "@/components/HeroParticles";
import { useRipple } from "@/lib/useRipple";

export default function NewHero() {
  const [loaded, setLoaded] = useState(false);
  const createRipple = useRipple("rgba(209, 214, 209, 0.4)");

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
      <HeroParticles />

      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`mb-7 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-100 border border-white/15">
              <MapPin className="h-3 w-3" />
              {CITY_NAME} · Argentina
              <Sparkles className="h-3 w-3" />
            </span>
          </div>

          <h1 className={`heading-xl text-white mb-5 text-balance transition-all duration-1000 ease-out drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Encontrá terapeutas y guías de{" "}
            <span className="text-sage-100">bienestar</span>{" "}
            en tu ciudad
          </h1>

          <p className={`text-cream-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Conectá con profesionales verificados de forma rápida, directa y confiable.
          </p>

          <div className={`transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link
              href="/mapa"
              onClick={createRipple}
              className="group ripple-container inline-flex items-center gap-3 px-9 py-4 bg-sage-500 text-white rounded-full text-base font-semibold hover:bg-terracotta-600 hover:shadow-xl hover:scale-[1.02] transition-interactive"
            >
              Explorá el mapa
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
