"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";
import { CITY_NAME } from "@/lib/constants";

const BENEFICIOS = [
  { emoji: "🔍", texto: "Búsqueda rápida" },
  { emoji: "🤝", texto: "Contacto directo" },
  { emoji: "✅", texto: "Calidad y confianza" },
  { emoji: "📍", texto: "Cerca tuyo" },
];

export default function NewHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785019465/AF49F0FF-4A15-4EA3-AE9F-AC8F83C11FC0_hkigqu.jpg"
          alt=""
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/60 via-bark/55 to-bark/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-sage-950/20 via-transparent to-terracotta-950/20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`mb-7 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sand-300 border border-white/10">
              <MapPin className="h-3 w-3" />
              {CITY_NAME} · Argentina
              <Sparkles className="h-3 w-3" />
            </span>
          </div>

          <h1 className={`heading-xl text-white mb-5 text-balance transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Encontrá terapeutas y guías de{" "}
            <span className="text-sage-100">bienestar</span>{" "}
            en Mar del Plata
          </h1>

          <p className={`text-cream-100/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Conectá con profesionales verificados de Mar del Plata de forma rápida, directa y confiable.
          </p>

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {BENEFICIOS.map((b) => (
              <div
                key={b.texto}
                className="flex items-center justify-center gap-2 px-3 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/10"
              >
                <span className="text-lg leading-none" aria-hidden="true">{b.emoji}</span>
                <span className="text-[13px] font-medium text-cream-100">{b.texto}</span>
              </div>
            ))}
          </div>

          <div className={`transition-all duration-700 delay-[700ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link
              href="/mapa"
              className="group inline-flex items-center gap-3 px-9 py-4 bg-sage-500 text-white rounded-full text-base font-semibold hover:bg-terracotta-600 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
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
