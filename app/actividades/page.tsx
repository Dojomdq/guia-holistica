import type { Metadata } from "next";
import ActividadesContent from "./ActividadesContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Yoga, Reiki y más en Mar del Plata | Guía de Bienestar",
  description:
    "Explorá todas las actividades holísticas en Mar del Plata: yoga, reiki, meditación, chamanismo, tarot, astrología, sanación energética y más.",
  openGraph: {
    title: "Yoga, Reiki y más en Mar del Plata | Guía de Bienestar",
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
