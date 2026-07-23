import Link from "next/link";
import { ArrowRight } from "lucide-react";

const footerLinks = {
  explorar: [
    { href: "/", label: "Inicio" },
    { href: "/mapa", label: "Mapa" },
    { href: "/actividades", label: "Actividades" },
    { href: "/facilitadores", label: "Facilitadores" },
  ],
  actividades: [
    { href: "/mapa?q=chamanismo", label: "Chamanismo" },
    { href: "/mapa?q=yoga", label: "Yoga" },
    { href: "/mapa?q=reiki", label: "Reiki" },
    { href: "/mapa?q=meditacion", label: "Meditación" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-warmblack text-cream-400">
      <div className="container-wide py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.5 5.5-6 7" />
                  <path d="M11.7 10.9c.9-1 1.8-1.7 3.3-2.4" />
                  <path d="M11 20v-8" />
                </svg>
              </div>
              <span className="text-lg font-serif font-semibold text-cream-100 tracking-tight">
                Guía Holística
              </span>
            </Link>
            <p className="text-sm text-cream-500/50 max-w-xs leading-relaxed">
              Sanación holística en Mar del Plata. Conectá con facilitadores,
              terapeutas y guías de sanación.
            </p>

            <a
              href="mailto:contacto@guiaholistica.com.ar"
              className="inline-flex items-center gap-2 mt-8 text-sm text-cream-300 hover:text-white transition-colors duration-300 group"
            >
              Escribinos
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-medium text-cream-500/40 uppercase tracking-[0.2em] mb-5">
              Explorar
            </h3>
            <ul className="space-y-3">
              {footerLinks.explorar.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-500/60 hover:text-cream-200 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-medium text-cream-500/40 uppercase tracking-[0.2em] mb-5">
              Actividades
            </h3>
            <ul className="space-y-3">
              {footerLinks.actividades.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-500/60 hover:text-cream-200 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1" />
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-500/30">
          <span>&copy; {new Date().getFullYear()} Guía Holística</span>
          <span>Mar del Plata, Argentina</span>
        </div>
      </div>
    </footer>
  );
}
