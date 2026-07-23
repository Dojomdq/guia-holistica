"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

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
    setScrolled(window.scrollY > 60);
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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream-100/85 backdrop-blur-xl border-b border-cream-200/60"
            : "bg-transparent"
        }`}
      >
        <div className="container-wide">
          <div className="flex h-16 lg:h-[72px] items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Guía Holística - Inicio"
            >
              <span
                className={`font-serif text-lg tracking-tight transition-colors duration-500 ${
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
                    className={`relative px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                      active
                        ? scrolled
                          ? "text-warmblack"
                          : "text-white"
                        : scrolled
                          ? "text-warmblack/45 hover:text-warmblack/75"
                          : "text-white/50 hover:text-white/85"
                    }`}
                  >
                    {active && (
                      <span
                        className={`absolute inset-x-2 -inset-y-0.5 rounded-full -z-10 transition-colors duration-300 ${
                          scrolled ? "bg-cream-200/70" : "bg-white/10"
                        }`}
                      />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/mapa"
                className={`hidden sm:inline-flex btn text-[13px] px-5 py-2 ${
                  scrolled
                    ? "bg-warmblack text-white hover:bg-warmblack/85"
                    : "bg-white/15 text-white backdrop-blur-sm border border-white/15 hover:bg-white/25"
                }`}
              >
                Explorar mapa
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                  mobileOpen
                    ? "bg-warmblack text-white"
                    : scrolled
                      ? "text-warmblack hover:bg-cream-200/60"
                      : "text-white hover:bg-white/10"
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
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`absolute top-0 left-0 right-0 bg-cream-100 border-b border-cream-200 transition-all duration-500 ease-out-expo ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          aria-label="Navegación principal"
        >
          <div className="container-wide pt-20 pb-6">
            <div className="space-y-0.5">
              {navLinks.map((link, i) => {
                const active = isActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-300 ${
                      active
                        ? "bg-warmblack text-white"
                        : "text-warmblack/60 hover:text-warmblack hover:bg-cream-200/50"
                    }`}
                    style={{
                      transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms",
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 opacity-30" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 px-4">
              <Link
                href="/mapa"
                onClick={() => setMobileOpen(false)}
                className="btn-sage w-full text-center"
              >
                Explorar mapa
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div className="h-16 lg:h-[72px]" />
    </>
  );
}
