import Link from "next/link";
import { Leaf } from "lucide-react";

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
    <footer className="bg-stone-900 text-stone-500">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-serif font-bold text-white">Guía Holística</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
              Sanación holística en Mar del Plata.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-widest mb-4">Explorar</h3>
            <ul className="space-y-2.5">
              {footerLinks.explorar.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-widest mb-4">Actividades</h3>
            <ul className="space-y-2.5">
              {footerLinks.actividades.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <span>© {new Date().getFullYear()} Guía Holística</span>
          <span>Mar del Plata</span>
        </div>
      </div>
    </footer>
  );
}
