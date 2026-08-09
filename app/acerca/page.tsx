import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, HeartHandshake, MessageCircle } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL, CITY_NAME, WHATSAPP_LINK, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre Guía de Bienestar | Quiénes Somos",
  description:
    "Guía de Bienestar es un directorio que conecta a personas con terapeutas, guías y facilitadores de bienestar. Conocé cómo funciona y cómo sumarte.",
  openGraph: {
    title: "Sobre Guía de Bienestar | Quiénes Somos",
    description:
      "Guía de Bienestar es un directorio que conecta a personas con terapeutas, guías y facilitadores de bienestar.",
  },
  alternates: {
    canonical: `${SITE_URL}/acerca`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Guía de Bienestar",
  url: SITE_URL,
  logo: "https://res.cloudinary.com/kmxmqr0t/image/upload/v1785381413/logo_principa_web_250x100_pc91et.png",
  description:
    "Directorio de facilitadores, terapeutas y guías de bienestar.",
  areaServed: { "@type": "City", name: CITY_NAME },
  knowsAbout: [
    "Terapias de bienestar",
    "Yoga",
    "Meditación",
    "Reiki",
    "Chamanismo",
    "Tarot",
    "Biodanza",
    "Flores de Bach",
    `Bienestar en ${CITY_NAME}`,
  ],
  sameAs: [INSTAGRAM_URL, WHATSAPP_LINK],
};

export default function AcercaPage() {
  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Breadcrumbs items={[{ label: "Sobre nosotros" }]} />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-bark-600 hover:text-bark text-[13px] mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al inicio
        </Link>

        <span className="label">Sobre nosotros</span>
        <h1 className="heading-lg text-bark mt-4">
          Quiénes somos
        </h1>
        <p className="text-lg text-bark-700 mt-4 max-w-xl leading-relaxed">
          Somos una guía local que acerca a las personas con quienes pueden
          acompañarlas en su bienestar, en {CITY_NAME} y alrededores.
        </p>

        <div className="mt-10 space-y-8">
          <section aria-labelledby="que-es">
            <h2 id="que-es" className="heading-sm text-bark">
              ¿Qué es Guía de Bienestar?
            </h2>
            <p className="text-bark-700 mt-2 leading-relaxed">
              Es un directorio de acceso abierto que reúne a
              facilitadores, terapeutas y guías de prácticas de bienestar. Cada
              perfil muestra sus actividades, su ubicación en el mapa y su
              contacto directo, para que quienes buscan puedan conectar sin
              intermediarios.
            </p>
          </section>

          <section aria-labelledby="como-funciona">
            <h2 id="como-funciona" className="heading-sm text-bark">
              ¿Cómo funciona?
            </h2>
            <ul className="mt-3 space-y-2.5">
              {[
                "Explorás el mapa o el listado de actividades.",
                "Elegís el perfil que te interesa y ves su bio, dirección y redes.",
                "Contactás directo por WhatsApp o Instagram.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-bark-700 leading-relaxed">
                  <MapPin className="h-5 w-5 text-sage-600 shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sumarte">
            <h2 id="sumarte" className="heading-sm text-bark">
              ¿Sos facilitador o terapeuta?
            </h2>
            <p className="text-bark-700 mt-2 leading-relaxed">
              Sumar tu perfil es simple. Escribinos por WhatsApp con tu
              nombre, actividades, dirección y redes, y lo publicamos en la
              guía.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={`${WHATSAPP_LINK}?text=Hola%20quiero%20sumar%20mi%20perfil%20a%20la%20Gu%C3%ADa%20de%20Bienestar`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-sage"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Sumarme por WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-outline"
              >
                <InstagramIcon className="h-4 w-4" aria-hidden="true" />
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </section>

          <section aria-labelledby="valores">
            <h2 id="valores" className="heading-sm text-bark">
              Nuestro compromiso
            </h2>
            <div className="flex items-start gap-2.5 text-sm text-bark-700 leading-relaxed mt-2">
              <HeartHandshake className="h-5 w-5 text-terracotta-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Promovemos el acceso libre a prácticas de bienestar, la
                visibilidad de los profesionales locales y el respeto por cada
                enfoque terapéutico.
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
