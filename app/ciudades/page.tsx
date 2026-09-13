import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/constants";
import { todosLasLandingCiudades } from "@/lib/cities-landing";
import { supabasePublic } from "@/lib/supabase/public-server";

export const metadata: Metadata = {
  title: "Ciudades de bienestar en Argentina | Guía de Bienestar",
  description:
    "Explorá los profesionales y facilitadores de bienestar por ciudad en toda la Argentina. Buenos Aires, Mar del Plata, Córdoba, Mendoza y más.",
  alternates: {
    canonical: `${SITE_URL}/ciudades`,
  },
};

export default async function CiudadesPage() {
  const ciudades = await todosLasLandingCiudades();

  let conProfesionales = new Set<string>();
  try {
    const { data } = await supabasePublic
      .from("facilitadores")
      .select("ubicaciones(ciudad)")
      .eq("activo", true);
    if (data) {
      (data as any[]).forEach((f) => {
        (f.ubicaciones || []).forEach((u: any) => {
          if (u?.ciudad) conProfesionales.add(u.ciudad);
        });
      });
    }
  } catch {
    // fallback: todas sin marca
  }

  const numeros = Array.from(conProfesionales).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ciudades de bienestar en Argentina",
    itemListElement: ciudades.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/ciudades/${c.slug}`,
      name: `Bienestar en ${c.nombre}`,
    })),
  };

  return (
    <main className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Breadcrumbs items={[{ label: "Ciudades" }]} />

      <div className="max-w-2xl mb-10">
        <span className="label mb-4 block">Argentina</span>
        <h1 className="heading-xl">Bienestar por ciudad</h1>
        <p className="text-bark-600 mt-4 leading-relaxed">
          Encontrá profesionales, actividades y espacios de bienestar en
          toda la Argentina. {numeros > 0 ? `${numeros} ciudades con profesionales verificados hasta ahora.` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ciudades.map((c) => {
          const tiene = conProfesionales.has(c.nombre);
          return (
            <Link
              key={c.slug}
              href={`/ciudades/${c.slug}`}
              className="group bg-white rounded-2xl border border-cream-200 p-6 transition-all duration-300 hover:border-sage-300 hover:shadow-large hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-sage-50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-sage-700" />
                </div>
                <ArrowRight className="h-4 w-4 text-bark-300 group-hover:text-sage-600 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <h2 className="font-serif text-lg font-medium text-bark group-hover:text-sage-700 transition-colors">
                {c.nombre}
              </h2>
              <p className="text-[13px] text-bark-500 mt-1">
                {tiene ? "Profesionales verificados disponibles" : "Explorá profesionales"}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}