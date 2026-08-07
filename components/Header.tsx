"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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

  const isHome = pathname === "/";
  const showDark = true;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] bg-cream-50/95 dark:bg-bark-950/95 backdrop-blur-xl border-b border-cream-200/50 dark:border-bark-800/50 shadow-soft transition-all duration-500"
      >
        <div className="container-wide">
          <div className="flex h-16 lg:h-[72px] items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Guía de Bienestar - Inicio"
            >
              <Image
                src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785381413/logo_principa_web_250x100_pc91et.png"
                alt="Guía de Bienestar"
                width={200}
                height={48}
                className="h-9 lg:h-12 w-auto"
                priority
              />
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
                    className={`relative px-4 py-2 text-[13px] font-medium transition-all duration-300 text-bark-600 hover:text-bark-800 dark:text-cream-300 dark:hover:text-cream-100 ${
                      active ? "text-bark dark:text-cream-100" : ""
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-x-2 -inset-y-0.5 rounded-full -z-10 bg-sage-100/60 dark:bg-sage-900/40 transition-colors duration-300" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/mapa"
                className="hidden sm:inline-flex btn text-[13px] px-5 py-2 bg-bark text-white hover:bg-bark/85 dark:bg-cream-100 dark:text-bark dark:hover:bg-cream-200"
              >
                Explorá el mapa
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>

              <ThemeToggle />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                  mobileOpen
                    ? "bg-bark text-white"
                    : "text-bark hover:bg-cream-200/60 dark:text-cream-100 dark:hover:bg-bark-800"
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
        className={`fixed inset-0 z-40 lg:hidden transition-[opacity,visibility] duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-bark/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`absolute top-0 left-0 right-0 bg-cream-50 dark:bg-bark-950 border-b border-cream-200 dark:border-bark-800 transition-all duration-500 ease-out-expo ${
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
                        ? "bg-bark text-white"
                        : "text-bark-700 hover:text-bark hover:bg-cream-200/40 dark:text-cream-200 dark:hover:text-cream-100 dark:hover:bg-bark-800/60"
                    }`}
                    style={{
                      transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms",
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 opacity-30" aria-hidden="true" />
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
                Explorá el mapa
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div className="h-16 lg:h-[72px]" />
    </>
  );
}
