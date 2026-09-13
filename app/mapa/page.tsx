import type { Metadata } from "next";
import MapaContent from "./MapaContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mapa de bienestar en Argentina | Encontrá profesionales cerca",
  description:
    "Explorá el mapa interactivo de profesionales y facilitadores de bienestar en toda la Argentina, Buenos Aires y Mar del Plata. Encontrá yoga, reiki, meditación, chamanismo y más cerca tuyo.",
  keywords: [
    "mapa de bienestar argentina",
    "mapa de profesionales holísticos buenos aires",
    "yoga cerca de mi buenos aires",
    "reiki caba",
    "terapias holísticas argentina",
  ],
  openGraph: {
    title: "Mapa de bienestar en Argentina | Encontrá profesionales cerca",
    description:
      "Explorá el mapa interactivo de profesionales y facilitadores de bienestar en toda la Argentina. Encontrá lo que necesitás cerca tuyo.",
  },
  alternates: {
    canonical: `${SITE_URL}/mapa`,
  },
};

export default function MapaPage() {
  return <MapaContent />;
}
