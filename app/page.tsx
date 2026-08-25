import type { Metadata } from "next";
import NewHero from "@/components/home/NewHero";
import SearchSection from "@/components/home/SearchSection";
import MapSection from "@/components/home/MapSection";
import EventosSection from "@/components/home/EventosSection";
import DestacadosSection from "@/components/home/DestacadosSection";
import TestimoniosSection from "@/components/TestimoniosSection";
import NewCTA from "@/components/home/NewCTA";
import FAQSection from "@/components/FAQSection";
import StatsSection from "@/components/StatsSection";
import PopupManager from "@/components/PopupManager";
import { SITE_URL, INSTAGRAM_URL, WHATSAPP_LINK, CITY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Guía de Bienestar en Mar del Plata | Facilitadores holísticos",
  description:
    "Encontrá terapeutas, facilitadores y guías holísticos en Mar del Plata. Mapa interactivo con yoga, reiki, meditación, chamanismo y más.",
  robots: { index: true, follow: true },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Guía de Bienestar en Mar del Plata | Facilitadores holísticos",
    description:
      "Encontrá terapeutas, facilitadores y guías holísticos en Mar del Plata. Mapa interactivo con yoga, reiki, meditación, chamanismo y más.",
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
      <StatsSection />
      <SearchSection />
      <div className="relative">
        <div className="section-divider" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-sage-300" />
      </div>
      <MapSection />
      <div className="relative">
        <div className="section-divider" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-terracotta-300" />
      </div>
      <EventosSection />
      <div className="relative">
        <div className="section-divider" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-sage-300" />
      </div>
      <DestacadosSection />
      <div className="relative">
        <div className="section-divider" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-terracotta-300" />
      </div>
      <TestimoniosSection />
      <div className="relative">
        <div className="section-divider" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-sage-300" />
      </div>
      <NewCTA />
      <div className="relative">
        <div className="section-divider" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-terracotta-300" />
      </div>
      <FAQSection />
      <PopupManager />
    </>
  );
}
