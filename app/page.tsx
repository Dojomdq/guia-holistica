import type { Metadata } from "next";
import NewHero from "@/components/home/NewHero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import CategoryGrid from "@/components/home/CategoryGrid";
import MapSection from "@/components/home/MapSection";
import NewCTA from "@/components/home/NewCTA";
import TestimoniosSection from "@/components/TestimoniosSection";
import FAQSection from "@/components/FAQSection";
import PopupFacilitadores from "@/components/PopupFacilitadores";
import { SITE_URL, INSTAGRAM_URL, WHATSAPP_LINK } from "@/lib/constants";

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
  description:
    "Directorio de bienestar. Encontrá terapeutas, facilitadores y guías.",
  areaServed: {
    "@type": "City",
    name: "Mar del Plata",
    containedInPlace: {
      "@type": "Country",
      name: "Argentina",
    },
  },
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
                  text: "Usá el mapa interactivo para ver todos los facilitadores en Mar del Plata. Podés filtrar por actividad y hacer clic en cada punto para ver el perfil completo.",
                },
              },
              {
                "@type": "Question",
                name: "¿Puedo publicar mi práctica holística?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, si sos facilitador o terapeuta holístico, escribinos para sumarte a la guía. Es gratuito y te ayuda a que más personas te encuentren.",
                },
              },
            ],
          }),
        }}
      />
      <NewHero />
      <div className="section-divider" />
      <WhyChooseUs />
      <div className="section-divider" />
      <WhatWeOffer />
      <div className="section-divider" />
      <CategoryGrid />
      <div className="section-divider" />
      <MapSection />
      <div className="section-divider" />
      <NewCTA />
      <div className="section-divider" />
      <TestimoniosSection />
      <div className="section-divider" />
      <FAQSection />
      <PopupFacilitadores />
    </>
  );
}
