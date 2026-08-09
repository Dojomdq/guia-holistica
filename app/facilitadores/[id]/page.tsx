import type { Metadata } from "next";
import FacilitadorContent from "./FacilitadorContent";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data } = await supabase
    .from("facilitadores")
    .select("nombre, bio, direccion, instagram, ciudad")
    .eq("id", params.id)
    .single();

  if (!data) {
    return { title: "Facilitador no encontrado" };
  }

  const desc = data.bio
    ? `${data.nombre}: ${data.bio}`
    : `${data.nombre} - Profesional de bienestar${data.ciudad ? " en " + data.ciudad : ""}. ${data.direccion ? "Ubicado en " + data.direccion + "." : ""} Descubrí sus servicios y actividades.`;

  return {
    title: data.nombre,
    description: desc.substring(0, 160),
    openGraph: {
      title: `${data.nombre} | Guía de Bienestar`,
      description: desc.substring(0, 160),
      url: `${SITE_URL}/facilitadores/${params.id}`,
    },
    alternates: {
      canonical: `${SITE_URL}/facilitadores/${params.id}`,
    },
  };
}

export default function FacilitadorPage({
  params,
}: {
  params: { id: string };
}) {
  return <FacilitadorContent params={params} />;
}
