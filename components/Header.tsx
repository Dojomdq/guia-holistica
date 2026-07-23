"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/mapa", label: "Mapa" },
  { href: "/actividades", label: "Actividades" },
  { href: "/facilitadores", label: "Facilitadores" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-200/60">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-sm shadow-emerald-600/20">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold text-stone-900 tracking-tight">
              Guía Holística
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href, pathname) ? "page" : undefined}
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(link.href, pathname)
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-stone-500 hover:bg-stone-100 rounded-xl"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-1" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(link.href, pathname) ? "page" : undefined}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActive(link.href, pathname)
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
