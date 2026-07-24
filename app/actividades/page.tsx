import type { Metadata } from "next";
import ActividadesContent from "./ActividadesContent";

export const metadata: Metadata = {
  title: "Yoga, Reiki, Meditación y más | Actividades de Bienestar en Mar del Plata",
  description:
    "Explorá todas las actividades holísticas disponibles en Mar del Plata: chamanismo, yoga, reiki, meditación, tarot, astrología, sanación energética y más. Encontrá la que necesitás.",
  openGraph: {
    title: "Actividades Holísticas | Guía Holística Mar del Plata",
    description:
      "Explorá todas las actividades holísticas disponibles en Mar del Plata: chamanismo, yoga, reiki, meditación, tarot y más.",
  },
  alternates: {
    canonical: "https://www.agenciakoi.com/actividades",
  },
};

export default function ActividadesPage() {
  return <ActividadesContent />;
}
