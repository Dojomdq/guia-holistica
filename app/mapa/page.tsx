import type { Metadata } from "next";
import MapaContent from "./MapaContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mapa de bienestar en Mar del Plata | Encontrá facilitadores cerca",
  description:
    "Explorá el mapa interactivo de facilitadores y profesionales de bienestar en Mar del Plata. Encontrá yoga, reiki, meditación, chamanismo y más cerca tuyo.",
  openGraph: {
    title: "Mapa de bienestar en Mar del Plata | Encontrá facilitadores cerca",
    description:
      "Explorá el mapa interactivo de facilitadores y profesionales de bienestar en Mar del Plata. Encontrá lo que necesitás cerca tuyo.",
  },
  alternates: {
    canonical: `${SITE_URL}/mapa`,
  },
};

export default function MapaPage() {
  return <MapaContent />;
}
