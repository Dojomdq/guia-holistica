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
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-page py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-900">
                <Leaf className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold text-white">Guía Holística</span>
            </Link>
            <p className="text-sm">
              Conectando personas con la sanación holística.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Explorar</h3>
            <ul className="space-y-1.5">
              {footerLinks.explorar.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Actividades</h3>
            <ul className="space-y-1.5">
              {footerLinks.actividades.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Guía Holística. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
