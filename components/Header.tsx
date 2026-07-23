"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-cream-100/80 backdrop-blur-2xl border-b border-cream-300/40 shadow-soft"
            : "bg-transparent"
        }`}
      >
        <div className="container-wide">
          <div className="flex h-18 lg:h-20 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Guía Holística - Inicio"
            >
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
              <span
                className={`text-lg font-serif font-semibold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-warmblack" : "text-white"
                }`}
              >
                Guía Holística
              </span>
            </Link>

            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Navegación principal"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                      active
                        ? "text-sage-700"
                        : "text-warmblack/50 hover:text-warmblack/80"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 bg-sage-50 rounded-full -z-10" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "bg-warmblack text-white"
                  : "bg-cream-200/80 text-warmblack hover:bg-cream-300"
              }`}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-warmblack/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`absolute top-0 left-0 right-0 bg-cream-100/95 backdrop-blur-2xl border-b border-cream-300/40 transition-all duration-500 ease-out ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          aria-label="Navegación principal"
        >
          <div className="container-wide pt-24 pb-8 space-y-1">
            {navLinks.map((link, i) => {
              const active = isActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block px-4 py-3.5 text-lg font-medium rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-sage-50 text-sage-700"
                      : "text-warmblack/50 hover:text-warmblack hover:bg-cream-200"
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="h-18 lg:h-20" />
    </>
  );
}
