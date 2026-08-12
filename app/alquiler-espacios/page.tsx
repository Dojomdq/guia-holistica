import type { Metadata } from "next";
import AlquilerEspaciosContent from "./AlquilerEspaciosContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Alquiler de Espacios | Guía de Bienestar",
  description:
    "Salones disponibles para alquilar en tu ciudad. Consultá disponibilidad directo con el responsable.",
  openGraph: {
    title: "Alquiler de Espacios | Guía de Bienestar",
    description:
      "Encontrá el espacio ideal para tu actividad, taller o evento.",
  },
  alternates: { canonical: `${SITE_URL}/alquiler-espacios` },
};

export default function AlquilerEspaciosPage() {
  return <AlquilerEspaciosContent />;
}
