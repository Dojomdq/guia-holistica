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
    <footer className="bg-stone-900 text-stone-400">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white">Guía Holística</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Conectando personas con la sanación holística en Mar del Plata.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-4">Explorar</h3>
            <ul className="space-y-2">
              {footerLinks.explorar.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-4">Actividades</h3>
            <ul className="space-y-2">
              {footerLinks.actividades.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Guía Holística. Todos los derechos reservados.</span>
          <span className="text-stone-600">Mar del Plata, Argentina</span>
        </div>
      </div>
    </footer>
  );
}
