import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoriasPopulares from "@/components/CategoriasPopulares";
import MapaPreview from "@/components/MapaPreview";
import FacilitadoresDestacados from "@/components/FacilitadoresDestacados";

export const metadata: Metadata = {
  title: "Guía Holística Mar del Plata | Encontrá tu Camino Holístico",
  description:
    "Encontrá facilitadores, terapeutas y guías holísticos en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación, tarot y más. Conectá con tu sanación.",
  openGraph: {
    title: "Guía Holística Mar del Plata | Facilitadores, Yoga, Reiki y Más",
    description:
      "Encontrá facilitadores, terapeutas y guías holísticos en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  },
  alternates: {
    canonical: "https://www.agenciakoi.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriasPopulares />
      <MapaPreview />
      <FacilitadoresDestacados />

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-900" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative container-page text-center">
          <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase mb-4">
            Sumate
          </p>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            ¿Sos facilitador?
          </h2>
          <p className="text-stone-400 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Que miles de personas te encuentren.
          </p>
          <a
            href="mailto:contacto@guiaholistica.com.ar"
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-2xl font-semibold hover:bg-stone-100 transition-all text-sm"
          >
            Escribinos
          </a>
        </div>
      </section>
    </>
  );
}
