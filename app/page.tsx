import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MarqueeBand from "@/components/MarqueeBand";
import CategoriasPopulares from "@/components/CategoriasPopulares";
import MapaPreview from "@/components/MapaPreview";
import FacilitadoresDestacados from "@/components/FacilitadoresDestacados";
import ParallaxBreak from "@/components/ParallaxBreak";
import CTASection from "@/components/CTASection";

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
      <MarqueeBand />
      <CategoriasPopulares />
      <MapaPreview />
      <FacilitadoresDestacados />
      <ParallaxBreak />
      <CTASection />
    </>
  );
}
