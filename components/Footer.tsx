import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-warmblack">
      <div className="container-wide py-16 sm:py-20">
        {/* Top — big typographic statement */}
        <div className="mb-14">
          <Link href="/" className="group inline-block">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white/90 leading-[1.05] tracking-tight group-hover:text-white transition-colors duration-300">
              Guía
              <br />
              <span className="text-sage-400/80">Holística</span>
            </h2>
          </Link>
        </div>

        {/* Middle — links + contact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em] mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Inicio" },
                { href: "/mapa", label: "Mapa" },
                { href: "/actividades", label: "Actividades" },
                { href: "/facilitadores", label: "Facilitadores" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em] mb-4">
              Actividades
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/mapa?q=yoga", label: "Yoga" },
                { href: "/mapa?q=reiki", label: "Reiki" },
                { href: "/mapa?q=meditacion", label: "Meditación" },
                { href: "/mapa?q=chamanismo", label: "Chamanismo" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em] mb-4">
              Contacto
            </h3>
            <a
              href="mailto:contacto@guiaholistica.com.ar"
              className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
            >
              contacto@guiaholistica.com.ar
            </a>
            <p className="text-xs text-white/35 mt-6">
              Mar del Plata, Argentina
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Guía Holística
          </span>
          <span className="text-[11px] text-white/30">
            Sanación holística en Mar del Plata
          </span>
        </div>
      </div>
    </footer>
  );
}
