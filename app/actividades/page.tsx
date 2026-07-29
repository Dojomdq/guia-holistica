import type { Metadata } from "next";
import ActividadesContent from "./ActividadesContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Yoga, Reiki, Meditación y más | Guía de Bienestar",
  description:
    "Explorá todas las actividades disponibles: chamanismo, yoga, reiki, meditación, tarot, astrología, sanación energética y más. Encontrá la que necesitás.",
  openGraph: {
    title: "Actividades | Guía de Bienestar",
    description:
      "Explorá todas las actividades holísticas disponibles en Mar del Plata: chamanismo, yoga, reiki, meditación, tarot y más.",
  },
  alternates: {
    canonical: `${SITE_URL}/actividades`,
  },
};

export default function ActividadesPage() {
  return <ActividadesContent />;
}
