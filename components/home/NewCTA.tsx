"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function NewCTA() {
  const { ref, isVisible } = useScrollReveal();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <section ref={ref} className="py-16 sm:py-20" aria-labelledby="cta-titulo">
      <div className="container-wide">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-700 via-sage-600 to-terracotta-500 px-6 py-16 sm:px-12 sm:py-20 shadow-xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Background decorations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-terracotta-400/20 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              <h2 id="cta-titulo" className="font-serif text-3xl sm:text-4xl text-white max-w-2xl leading-tight mb-4">
                ¿Sos profesional? Sumá tu perfil y conectá con nuevos pacientes.
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto lg:mx-0">
                Unite a la comunidad de facilitadores más grande de Mar del Plata.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-bark-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/95 backdrop-blur-sm rounded-xl text-bark placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-sage-400/30 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 hover:shadow-lg transition-all duration-300 shrink-0"
                >
                  {submitted ? <Check className="h-5 w-5" /> : "Enviar"}
                </button>
              </form>

              <Link
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hola, quiero sumar mi perfil a la Guía de Bienestar")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-bark rounded-xl font-semibold hover:bg-cream-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                Contactar por WhatsApp
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
