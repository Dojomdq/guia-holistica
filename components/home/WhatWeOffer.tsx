"use client";

import Link from "next/link";
import { Map, MessageCircle, HelpCircle, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const FEATURES = [
  {
    icon: Map,
    title: "Buscá en el mapa",
    description: "Encontrá facilitadores cerca tuyo en un mapa interactivo de Mar del Plata. Filtrá por actividad y conocé su ubicación exacta.",
    href: "/mapa",
    color: "bg-sage-100 text-sage-700",
    border: "hover:border-sage-400",
  },
  {
    icon: MessageCircle,
    title: "Contacto directo",
    description: "Cada perfil tiene sus redes sociales y número de WhatsApp. Comunicate directamente con el profesional que elegiste.",
    href: "/facilitadores",
    color: "bg-sand-100 text-sand-700",
    border: "hover:border-sand-400",
  },
  {
    icon: HelpCircle,
    title: "¿No encontrás tu actividad?",
    description: "Si tu práctica no está en la lista, escribinos y la agregamos. Queremos que el directorio crezca con la comunidad.",
    href: "https://wa.me/5492235742540",
    color: "bg-terracotta-100 text-terracotta-700",
    border: "hover:border-terracotta-400",
  },
];

export default function WhatWeOffer() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 sm:py-24 lg:py-28 bg-cream-50">
      <div className="container-wide">
        {/* Section header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sage-600 mb-4">
            <span className="w-8 h-px bg-sage-300" />
            Cómo funciona
            <span className="w-8 h-px bg-sage-300" />
          </span>
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.12] tracking-[-0.02em] text-bark">
            Qué ofrecemos
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const isExternal = feature.href.startsWith("http");
            const LinkComponent = isExternal ? "a" : Link;
            const externalProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <LinkComponent
                key={feature.title}
                href={feature.href}
                {...externalProps}
                className={`group bg-white rounded-2xl border border-cream-200/80 p-8 transition-all duration-300 hover:shadow-medium ${feature.border} ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-medium text-bark mb-2 flex items-center gap-1.5">
                  {feature.title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                </h3>
                <p className="text-[15px] text-bark/50 leading-relaxed">
                  {feature.description}
                </p>
              </LinkComponent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
