import type { Metadata } from "next";
import NewHero from "@/components/home/NewHero";
import SearchSection from "@/components/home/SearchSection";
import MapSection from "@/components/home/MapSection";
import TestimoniosSection from "@/components/TestimoniosSection";
import NewCTA from "@/components/home/NewCTA";
import FAQSection from "@/components/FAQSection";
import PopupManager from "@/components/PopupManager";
import { SITE_URL, INSTAGRAM_URL, WHATSAPP_LINK, CITY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Guía de Bienestar | Encontrá Terapeutas, Yoga y Reiki",
  description:
    "Encontrá terapeutas, facilitadores y guías cerca tuyo. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  openGraph: {
    title: "Guía de Bienestar | Encontrá Terapeutas, Yoga y Reiki",
    description:
      "Encontrá terapeutas, facilitadores y guías cerca tuyo. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Guía de Bienestar",
  url: SITE_URL,
  logo: "https://res.cloudinary.com/kmxmqr0t/image/upload/v1785381413/logo_principa_web_250x100_pc91et.png",
  description:
    "Directorio de bienestar. Encontrá terapeutas, facilitadores y guías.",
  areaServed: {
    "@type": "City",
    name: CITY_NAME,
    containedInPlace: {
      "@type": "Country",
      name: "Argentina",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: CITY_NAME,
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  knowsAbout: [
    "Terapias de bienestar",
    "Yoga",
    "Meditación",
    "Reiki",
    "Chamanismo",
    "Tarot",
    "Bienestar",
    `Facilitadores en ${CITY_NAME}`,
  ],
  sameAs: [INSTAGRAM_URL, WHATSAPP_LINK].filter(Boolean),
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Guía de Bienestar",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/mapa?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Qué es la Guía de Bienestar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Es una plataforma interactiva que reúne facilitadores, terapeutas y guías. Podés buscar por actividad, ubicación y explorar el mapa interactivo.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cómo encuentro un facilitador cerca mío?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Usá el mapa interactivo para ver todos los facilitadores en ${CITY_NAME}. Podés filtrar por actividad y hacer clic en cada punto para ver el perfil completo.`,
                },
              },
              {
                "@type": "Question",
                name: "¿Puedo publicar mi práctica holística?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, si sos profesional de bienestar, escribinos para sumarte a la guía. Te ayuda a que más personas te encuentren.",
                },
              },
            ],
          }),
        }}
      />
      <NewHero />
      <SearchSection />
      <div className="section-divider" />
      <MapSection />
      <div className="section-divider" />
      <TestimoniosSection />
      <div className="section-divider" />
      <NewCTA />
      <div className="section-divider" />
      <FAQSection />
      <PopupManager />
    </>
  );
}
