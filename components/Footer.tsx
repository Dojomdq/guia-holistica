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
      <div className="container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <Leaf className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Guía Holística</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              Conectando personas con la sanación holística en Mar del Plata.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-5">Explorar</h3>
            <ul className="space-y-3">
              {footerLinks.explorar.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-500 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-5">Actividades</h3>
            <ul className="space-y-3">
              {footerLinks.actividades.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-500 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <span>© {new Date().getFullYear()} Guía Holística.</span>
          <span>Mar del Plata, Argentina</span>
        </div>
      </div>
    </footer>
  );
}
