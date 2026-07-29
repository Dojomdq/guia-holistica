import type { Metadata } from "next";
import ActividadPageInner from "./ActividadPageInner";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, " ");
  return {
    title: `${name} | Guía de Bienestar`,
    description: `Encontrá facilitadores de ${name.toLowerCase()} cerca tuyo. Buscá por ubicación y contactá directo.`,
    openGraph: {
      title: `${name} | Guía de Bienestar`,
      description: `Encontrá facilitadores de ${name.toLowerCase()} cerca tuyo.`,
    },
    alternates: {
      canonical: `${SITE_URL}/actividades/${params.slug}`,
    },
  };
}

export default function ActividadPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ActividadPageInner slug={params.slug} />;
}
