"use client";

import Link from "next/link";
import { Map, MessageCircle, HelpCircle, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { WHATSAPP_LINK } from "@/lib/constants";

const FEATURES = [
  {
    icon: Map,
    title: "Buscá en el mapa",
    description: "Encontrá facilitadores cerca tuyo en un mapa interactivo. Filtrá por actividad y conocé su ubicación exacta.",
    href: "/mapa",
    gradient: "from-sage-50 to-sage-100",
    iconBg: "bg-sage-600",
    border: "hover:border-sage-300",
  },
  {
    icon: MessageCircle,
    title: "Contacto directo",
    description: "Cada perfil tiene redes y WhatsApp. Comunicate directamente con el profesional que elegiste.",
    href: "/facilitadores",
    gradient: "from-sand-50 to-sand-100",
    iconBg: "bg-sand-500",
    border: "hover:border-sand-300",
  },
  {
    icon: HelpCircle,
    title: "¿No encontrás tu actividad?",
    description: "Si tu práctica no está en la lista, escribinos y la agregamos. El directorio crece con la comunidad.",
    href: WHATSAPP_LINK,
    gradient: "from-terracotta-50 to-terracotta-100",
    iconBg: "bg-terracotta-500",
    border: "hover:border-terracotta-300",
  },
];

export default function WhatWeOffer() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 sm:py-28 bg-cream-50 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-sage-600" style={{ animation: "blob 20s ease-in-out infinite" }} />
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.02] pointer-events-none">
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full bg-terracotta-500" style={{ animation: "blob 25s ease-in-out infinite reverse" }} />
      </div>

      <div className="container-wide">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-sage-600 mb-4">
            <span className="w-8 h-px bg-sage-300" />
            Descubrí
            <span className="w-8 h-px bg-sage-300" />
          </span>
          <h2 className="heading-lg text-bark">
            Cómo funciona
          </h2>
        </div>

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
                className={`group bg-white rounded-2xl border border-cream-200/80 p-8 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl ${feature.border} relative overflow-hidden ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-5 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-bark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-bark-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-sage-600 mt-5 group-hover:gap-2 transition-all duration-300">
                    {isExternal ? "Contactar" : "Explorar"}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </LinkComponent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
