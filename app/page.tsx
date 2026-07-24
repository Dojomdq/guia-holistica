import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MarqueeBand from "@/components/MarqueeBand";
import MapaPreview from "@/components/MapaPreview";
import ParallaxBreak from "@/components/ParallaxBreak";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Directorio de Bienestar en Mar del Plata | Encontrá Terapeutas, Yoga y Reiki",
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
      <MapaPreview />
      <ParallaxBreak />
      <CTASection />
    </>
  );
}
