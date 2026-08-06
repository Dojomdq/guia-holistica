import type { Metadata } from "next";
import FacilitadoresContent from "./FacilitadoresContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terapeutas y Facilitadores de Bienestar | Directorio con Mapa",
  description:
    "Conocé a los facilitadores, terapeutas y guías de bienestar. Filtrá por actividad, buscá por nombre y descubrí sus servicios.",
  openGraph: {
    title: "Facilitadores | Guía de Bienestar",
    description:
      "Conocé a los facilitadores, terapeutas y guías de bienestar. Filtrá por actividad y descubrí sus servicios.",
  },
  alternates: {
    canonical: `${SITE_URL}/facilitadores`,
  },
};

export default function FacilitadoresPage() {
  return (
    <>
      <FacilitadoresContent />
    </>
  );
}
