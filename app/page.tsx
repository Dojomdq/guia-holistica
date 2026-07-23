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

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-stone-900 to-stone-900" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative container-page text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            ¿Sos Facilitador?
          </h2>
          <p className="text-stone-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Sumá tu espacio y que miles de personas te encuentren en Mar del Plata.
          </p>
          <a
            href="mailto:contacto@guiaholistica.com.ar"
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-xl font-bold hover:bg-stone-100 transition-all shadow-lg shadow-black/20 text-sm"
          >
            Contactanos
          </a>
        </div>
      </section>
    </>
  );
}
