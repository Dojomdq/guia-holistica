import type { Metadata } from "next";
import NewHero from "@/components/home/NewHero";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import CategoryGrid from "@/components/home/CategoryGrid";
import MapSection from "@/components/home/MapSection";
import StatsSection from "@/components/home/StatsSection";
import NewCTA from "@/components/home/NewCTA";

export const metadata: Metadata = {
  title: "Bienestar en Mar del Plata | Encontrá Terapeutas, Yoga y Reiki",
  description:
    "Encontrá terapeutas, facilitadores y guías holísticos cerca tuyo en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  openGraph: {
    title: "Bienestar en Mar del Plata | Guía Holística",
    description:
      "Encontrá terapeutas, facilitadores y guías holísticos cerca tuyo en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  },
  alternates: {
    canonical: "https://www.agenciakoi.com",
  },
};

export default function Home() {
  return (
    <>
      <NewHero />
      <WhatWeOffer />
      <CategoryGrid />
      <MapSection />
      <StatsSection />
      <NewCTA />
    </>
  );
}
