import type { Metadata } from "next";
import { Suspense } from "react";
import FacilitadoresContent from "./FacilitadoresContent";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Profesionales y facilitadores de bienestar en Argentina | Guía de Bienestar",
  description:
    "Conocé a los profesionales y facilitadores de bienestar en toda la Argentina. Filtrá por ciudad, actividad, buscá por nombre y descubrí sus servicios.",
  openGraph: {
    title: "Profesionales y facilitadores de bienestar en Argentina | Guía de Bienestar",
    description:
      "Conocé a los profesionales y facilitadores de bienestar en toda la Argentina. Filtrá por ciudad, actividad y descubrí sus servicios.",
  },
  alternates: {
    canonical: `${SITE_URL}/facilitadores`,
  },
};

export default function FacilitadoresPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50 dark:bg-bark-950" />}>
      <FacilitadoresContent />
    </Suspense>
  );
}
