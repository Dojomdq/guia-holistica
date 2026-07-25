"use client";

import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-warmblack">
      <div className="container-wide py-12 sm:py-14">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-block">
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] text-white/90 leading-[1.05] tracking-[-0.03em] group-hover:text-white transition-colors duration-300">
                Guía
                <br />
                <span className="text-sand-400/60">de Bienestar</span>
              </h2>
            </Link>
            <p className="text-[13px] text-white/30 mt-4 max-w-[240px] leading-relaxed">
              Directorio de bienestar en Mar del Plata. Conectá con terapeutas, guías y facilitadores.
            </p>
          </div>

          {/* Column 2 — Enlaces */}
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-white/30 mb-4">
              Enlaces
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Inicio" },
                { href: "/actividades", label: "Actividades" },
                { href: "/facilitadores", label: "Facilitadores" },
                { href: "/mapa", label: "Mapa" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-white/45 hover:text-white transition-colors duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Contacto */}
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-white/30 mb-4">
              Contacto
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5492235742540"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[14px] text-white/45 hover:text-white transition-colors duration-300 w-fit"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp
              </a>
              <a
                href="mailto:contacto@guiaholistica.com.ar"
                className="flex items-center gap-2.5 text-[14px] text-white/45 hover:text-white transition-colors duration-300 w-fit"
              >
                <Mail className="h-4 w-4 shrink-0" />
                contacto@guiaholistica.com.ar
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[14px] text-white/45 hover:text-white transition-colors duration-300 w-fit"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <span className="text-[11px] text-white/20 font-mono">
            &copy; {new Date().getFullYear()} Guía de Bienestar · Mar del Plata
          </span>
        </div>
      </div>
    </footer>
  );
}
