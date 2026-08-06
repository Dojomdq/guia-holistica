import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Accesibilidad | Guía de Bienestar",
  description:
    "Declaración de accesibilidad del sitio Guía de Bienestar: compromiso con WCAG 2.1 Nivel AA, estado de cumplimiento y contacto para reportar problemas.",
  alternates: {
    canonical: `${SITE_URL}/accesibilidad`,
  },
};

const cumplimientos = [
  "Estructura semántica HTML5 con landmarks (header, nav, main, footer) para navegación por teclado.",
  "Enlaces de salto al contenido principal (skip links) en todas las páginas.",
  "Foco visible de alto contraste al navegar con el teclado.",
  "Textos alternativos descriptivos en todas las imágenes.",
  "Etiquetas y nombres accesibles en formularios, botones e iconos.",
  "Navegación completa con teclado, incluyendo cierre de ventanas con ESC.",
  "Respeto de la preferencia del sistema de reducir animaciones (prefers-reduced-motion).",
  "Relación de contraste de color suficiente para texto normal (4.5:1).",
  "Jerarquía única de encabezados (un solo H1 por página).",
  "Idioma declarado (es) para una correcta lectura por lectores de pantalla.",
];

const limitaciones = [
  "El mapa interactivo requiere el uso de un puntero para desplazarse. Para acceder sin el mapa, usá las secciones de Actividades y Facilitadores.",
  "Algunos videos de eventos se reproducen automáticamente, pero siempre cuentan con controles para pausarlos.",
];

export default function AccesibilidadPage() {
  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <Breadcrumbs items={[{ label: "Accesibilidad" }]} />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-bark-600 hover:text-bark text-[13px] mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        <span className="label">Accesibilidad</span>
        <h1 className="heading-lg text-bark mt-4">
          Compromiso con la accesibilidad
        </h1>
        <p className="text-lg text-bark-700 mt-4 max-w-xl leading-relaxed">
          En Guía de Bienestar trabajamos para que todas las personas, incluyendo
          quienes tienen discapacidades visuales, motoras, auditivas o cognitivas,
          puedan usar nuestro sitio de forma autónoma.
        </p>

        <div className="mt-10 space-y-8">
          <section aria-labelledby="estado">
            <h2 id="estado" className="heading-sm text-bark">
              Estado de cumplimiento
            </h2>
            <p className="text-bark-700 mt-2 leading-relaxed">
              Buscamos cumplir con las Pautas de Accesibilidad para el Contenido
              Web (WCAG 2.1) del W3C, nivel <strong>AA</strong>. La última
              auditoría se realizó en agosto de 2026 mediante revisiones
              automáticas (Lighthouse) y manuales.
            </p>
          </section>

          <section aria-labelledby="lo-que-cumplimos">
            <h2 id="lo-que-cumplimos" className="heading-sm text-bark">
              Lo que cumplimos
            </h2>
            <ul className="mt-3 space-y-2.5">
              {cumplimientos.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-bark-700 leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 text-sage-600 shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="limitaciones">
            <h2 id="limitaciones" className="heading-sm text-bark">
              Limitaciones conocidas
            </h2>
            <ul className="mt-3 space-y-2.5">
              {limitaciones.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-bark-700 leading-relaxed">
                  <AlertCircle className="h-5 w-5 text-terracotta-600 shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="reportar">
            <h2 id="reportar" className="heading-sm text-bark">
              ¿Encontraste un problema?
            </h2>
            <p className="text-bark-700 mt-2 leading-relaxed">
              Si algo no te funciona o no podés acceder a un contenido, escribinos
              y lo corregiremos. Respondemos a la brevedad.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Problema%20de%20accesibilidad`}
              className="inline-flex items-center gap-2 mt-4 text-sage-700 hover:text-sage-800 font-medium text-sm"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
