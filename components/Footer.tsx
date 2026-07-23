"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Categoria {
  nombre: string;
  slug: string;
}

export default function Footer() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    supabase
      .from("categorias")
      .select("nombre, slug")
      .order("nombre")
      .then(({ data }) => {
        if (data) setCategorias(data);
      });
  }, []);

  return (
    <footer className="bg-warmblack">
      <div className="container-wide py-16 sm:py-20">
        {/* Logo */}
        <div className="mb-14">
          <Link href="/" className="group inline-block">
            <h2 className="font-serif text-[clamp(2.25rem,5vw,4rem)] text-white/90 leading-[1.05] tracking-[-0.03em] group-hover:text-white transition-colors duration-300">
              Guía
              <br />
              <span className="text-sand-400/60">Holística</span>
            </h2>
          </Link>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12">
          <div>
            <h3 className="label-light mb-5">
              Navegación
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/mapa", label: "Mapa" },
                { href: "/actividades", label: "Actividades" },
                { href: "/facilitadores", label: "Facilitadores" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-light mb-5">
              Actividades
            </h3>
            <ul className="space-y-3">
              {categorias.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/mapa?q=${cat.slug}`}
                    className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-300"
                  >
                    {cat.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="label-light mb-5">
              Contacto
            </h3>
            <a
              href="mailto:contacto@guiaholistica.com.ar"
              className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-300"
            >
              contacto@guiaholistica.com.ar
            </a>
            <p className="text-[12px] text-white/25 mt-5">
              Mar del Plata, Argentina
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-white/20 font-mono">
            &copy; {new Date().getFullYear()} Guía Holística
          </span>
          <span className="text-[11px] text-white/20 font-mono">
            Bienestar corporal en Mar del Plata
          </span>
        </div>
      </div>
    </footer>
  );
}
