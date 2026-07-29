import type { Metadata } from "next";
import MapaContent from "./MapaContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mapa de Terapeutas y Facilitadores en Mar del Plata | Encontrá el más cercano",
  description:
    "Explorá el mapa interactivo de facilitadores holísticos en Mar del Plata. Encontrá chamanismo, yoga, reiki, meditación y más cerca tuyo.",
  openGraph: {
    title: "Mapa de Facilitadores | Guía de Bienestar",
    description:
      "Explorá el mapa interactivo de facilitadores holísticos en Mar del Plata. Encontrá lo que necesitás cerca tuyo.",
  },
  alternates: {
    canonical: `${SITE_URL}/mapa`,
  },
};

export default function MapaPage() {
  return <MapaContent />;
}
