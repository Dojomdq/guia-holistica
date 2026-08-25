"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { WHATSAPP_LINK, CONTACT_EMAIL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/mapa") return null;

  return (
    <footer className="bg-cream-50/95 dark:bg-bark-950/95 backdrop-blur-xl">
      <div className="relative container-wide py-12">
        <div className="border-t border-cream-200/50 dark:border-bark-800 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:-ml-6">
          {/* Column 1 */}
          <div className="-ml-2">
            <Link href="/" className="group inline-block">
              <Image
                src="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785381413/logo_principa_web_250x100_pc91et.png"
                alt="Guía de Bienestar"
                width={320}
                height={64}
                className="w-64 sm:w-80 h-auto dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="text-sm text-bark-600 dark:text-cream-300 mt-5 max-w-[300px] leading-relaxed">
              Directorio de bienestar. Conectá con terapeutas, guías y facilitadores de tu zona.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-cream-200/60 dark:bg-bark-800 hover:bg-sage-100 dark:hover:bg-sage-900/40 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 text-bark-600 dark:text-cream-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-cream-200/60 dark:bg-bark-800 hover:bg-sage-100 dark:hover:bg-sage-900/40 hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4 text-bark-600 dark:text-cream-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-xs font-mono font-medium tracking-[0.12em] uppercase text-bark-500 dark:text-cream-400 mb-5">
              Enlaces
            </h3>
            <nav aria-label="Enlaces rápidos" className="flex flex-col gap-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/actividades", label: "Actividades" },
                { href: "/alquiler-espacios", label: "Alquiler de espacios" },
                { href: "/eventos", label: "Próximos eventos" },
                { href: "/mapa", label: "Mapa" },
                { href: "/acerca", label: "Sobre nosotros" },
                { href: "/accesibilidad", label: "Accesibilidad" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-bark-600 dark:text-cream-300 hover:text-bark dark:hover:text-cream-100 hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-xs font-mono font-medium tracking-[0.12em] uppercase text-bark-500 dark:text-cream-400 mb-5">
              Contacto
            </h3>
            <div className="flex flex-col gap-3.5">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-bark-600 dark:text-cream-300 hover:text-bark dark:hover:text-cream-100 hover:translate-x-1 transition-all duration-200 w-fit"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2.5 text-sm text-bark-600 dark:text-cream-300 hover:text-bark dark:hover:text-cream-100 hover:translate-x-1 transition-all duration-200 w-fit"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-bark-600 dark:text-cream-300 hover:text-bark dark:hover:text-cream-100 hover:translate-x-1 transition-all duration-200 w-fit"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-300/50 dark:border-bark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-bark-500 dark:text-cream-400">
            &copy; {new Date().getFullYear()} Guía de Bienestar
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sage-400 dark:bg-sage-500 animate-pulse" />
            <span className="text-xs text-bark-500 dark:text-cream-400">Hecho con amor en Mar del Plata</span>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
