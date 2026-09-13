import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowUpRight, ExternalLink } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/constants";
import { todosLasLandingCiudades, ciudadFromSlug } from "@/lib/cities-landing";
import { supabasePublic } from "@/lib/supabase/public-server";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";

interface Params {
  slug: string;
}

interface Profesional {
  id: string;
  slug: string | null;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  instagram: string | null;
  actividades: { nombre: string; slug: string }[];
}

export async function generateStaticParams(): Promise<Params[]> {
  const ciudades = await todosLasLandingCiudades();
  return ciudades.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const ciudad = await ciudadFromSlug(params.slug);
  if (!ciudad) return {};

  const title = `Profesionales de bienestar en ${ciudad.nombre}`;
  const description = `Encontrá profesionales y facilitadores de bienestar en ${ciudad.nombre}: yoga, reiki, meditación, chamanismo y más. Conocé sus servicios y consultá precios.`;

  return {
    title,
    description,
    keywords: [
      `bienestar ${ciudad.nombre.toLowerCase()}`,
      `profesionales de bienestar en ${ciudad.nombre.toLowerCase()}`,
      `yoga ${ciudad.nombre.toLowerCase()}`,
      `reiki ${ciudad.nombre.toLowerCase()}`,
      "terapias holísticas",
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ciudades/${ciudad.slug}`,
      siteName: "Guía de Bienestar",
      locale: "es_AR",
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/ciudades/${ciudad.slug}`,
    },
  };
}

export default async function CiudadPage({ params }: { params: Params }) {
  const ciudad = await ciudadFromSlug(params.slug);
  if (!ciudad) notFound();

  let profesionales: Profesional[] = [];
  try {
    const { data } = await supabasePublic
      .from("facilitadores")
      .select(
        "id, slug, nombre, bio, direccion, instagram, ubicaciones(ciudad), facilitador_actividades(actividades(nombre, slug))"
      )
      .eq("activo", true)
      .order("nombre");

    if (data) {
      profesionales = (data as any[])
        .filter((f) =>
          (f.ubicaciones || []).some(
            (u: any) =>
              u?.ciudad &&
              u.ciudad.toLowerCase().trim() === ciudad.nombre.toLowerCase().trim()
          )
        )
        .map((f) => ({
          id: f.id,
          slug: f.slug || null,
          nombre: f.nombre,
          bio: f.bio,
          direccion: f.direccion,
          instagram: f.instagram,
          actividades: (f.facilitador_actividades || []).flatMap((a: any) =>
            a.actividades ? [a.actividades] : []
          ),
        }));
    }
  } catch {
    profesionales = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Profesionales de bienestar en ${ciudad.nombre}`,
    description: `Directorio de profesionales y facilitadores de bienestar en ${ciudad.nombre}, Argentina.`,
    areaServed: {
      "@type": "Place",
      name: `${ciudad.nombre}, Argentina`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: ciudad.nombre,
      addressCountry: "AR",
    },
  };

  return (
    <main className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Breadcrumbs items={[{ label: "Ciudades", href: "/ciudades" }, { label: ciudad.nombre }]} />

      <div className="max-w-2xl mb-10">
        <span className="label mb-4 block">Bienestar en Argentina</span>
        <h1 className="heading-xl">
          Profesionales de bienestar en {ciudad.nombre}
        </h1>
        <p className="text-bark-600 mt-4 leading-relaxed">
          Encontrá {profesionales.length > 0 ? `${profesionales.length} ` : ""}
          profesionales y facilitadores verificados de {ciudad.nombre}: yoga,
          reiki, meditación, chamanismo, tarot y más.
        </p>
        <Link
          href={`/mapa?ciudad=${encodeURIComponent(ciudad.nombre)}`}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-sage-600 text-white rounded-xl text-sm font-semibold hover:bg-sage-700 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          Ver en el mapa
        </Link>
      </div>

      {profesionales.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-10 text-center">
          <p className="text-bark-600 font-medium">
            Todavía no hay profesionales listados en {ciudad.nombre}.
          </p>
          <p className="text-sm text-bark-500 mt-2">
            ¿Sos profesional? Sumate a la guía y aparecé acá.
          </p>
          <Link
            href="/facilitadores"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-sage-600 text-white rounded-xl text-sm font-semibold hover:bg-sage-700 transition-colors"
          >
            Ver profesionales de toda la Argentina
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profesionales.map((p) => {
            const mainAct = p.actividades[0];
            const Icon = mainAct ? getCategoryIcon(mainAct.slug) : MapPin;
            const color = mainAct
              ? CATEGORY_MARKER_COLORS[mainAct.slug] || "#5d8a6e"
              : "#5d8a6e";
            return (
              <Link
                key={p.id}
                href={`/facilitadores/${p.slug || p.id}`}
                className="group bg-white rounded-2xl border border-cream-200 p-6 transition-all duration-300 hover:border-sage-300 hover:shadow-large hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-medium font-mono uppercase tracking-wider" style={{ color }}>
                    {mainAct?.nombre || "Profesional"}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-medium text-bark group-hover:text-sage-700 transition-colors">
                  {p.nombre}
                </h2>
                {p.bio && (
                  <p className="text-sm text-bark-600 mt-2 leading-relaxed line-clamp-3">
                    {p.bio}
                  </p>
                )}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-cream-200">
                  <span className="flex items-center gap-1.5 text-[13px] text-bark-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {ciudad.nombre}
                  </span>
                  <span className="text-[13px] text-sage-600 font-medium group-hover:text-sage-700 transition-colors flex items-center gap-1">
                    Ver perfil
                    <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}