import type { Metadata } from "next";
import EventosContent from "./EventosContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Próximos Eventos | Guía de Bienestar",
  description: "Descubrí eventos, talleres y encuentros de bienestar. Filtrá por ciudad y encontrá el más cercano.",
  openGraph: {
    title: "Eventos | Guía de Bienestar",
    description: "Descubrí eventos, talleres y encuentros de bienestar.",
  },
  alternates: { canonical: `${SITE_URL}/eventos` },
};

export default function EventosPage() {
  return <EventosContent />;
}
