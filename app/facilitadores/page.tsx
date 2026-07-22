import type { Metadata } from "next";
import FacilitadoresContent from "./FacilitadoresContent";

export const metadata: Metadata = {
  title: "Facilitadores Holísticos",
  description:
    "Conocé a los facilitadores, terapeutas y guías holísticos de Mar del Plata. Filtrá por actividad, buscá por nombre y descubrí sus servicios.",
  openGraph: {
    title: "Facilitadores Holísticos | Guía Holística Mar del Plata",
    description:
      "Conocé a los facilitadores, terapeutas y guías holísticos de Mar del Plata. Filtrá por actividad y descubrí sus servicios.",
  },
  alternates: {
    canonical: "https://www.agenciakoi.com/facilitadores",
  },
};

export default function FacilitadoresPage() {
  return <FacilitadoresContent />;
}
