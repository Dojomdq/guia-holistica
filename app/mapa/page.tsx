import type { Metadata } from "next";
import MapaContent from "./MapaContent";

export const metadata: Metadata = {
  title: "Mapa de Facilitadores",
  description:
    "Explorá el mapa interactivo de facilitadores holísticos en Mar del Plata. Encontrá chamanismo, yoga, reiki, meditación y más cerca tuyo.",
  openGraph: {
    title: "Mapa de Facilitadores | Guía Holística Mar del Plata",
    description:
      "Explorá el mapa interactivo de facilitadores holísticos en Mar del Plata. Encontrá lo que necesitás cerca tuyo.",
  },
  alternates: {
    canonical: "https://www.agenciakoi.com/mapa",
  },
};

export default function MapaPage() {
  return <MapaContent />;
}
