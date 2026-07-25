import type { Metadata } from "next";
import NewHero from "@/components/home/NewHero";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import CategoryGrid from "@/components/home/CategoryGrid";
import MapSection from "@/components/home/MapSection";
import NewCTA from "@/components/home/NewCTA";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bienestar en Mar del Plata | Encontrá Terapeutas, Yoga y Reiki",
  description:
    "Encontrá terapeutas, facilitadores y guías holísticos cerca tuyo en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  openGraph: {
    title: "Bienestar en Mar del Plata | Encontrá Terapeutas, Yoga y Reiki",
    description:
      "Encontrá terapeutas, facilitadores y guías holísticos cerca tuyo en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bienestar en Mar del Plata",
  url: SITE_URL,
  description:
    "Directorio de bienestar en Mar del Plata. Encontrá terapeutas, facilitadores y guías holísticos.",
  areaServed: {
    "@type": "City",
    name: "Mar del Plata",
    containedInPlace: {
      "@type": "Country",
      name: "Argentina",
    },
  },
  sameAs: [],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bienestar en Mar del Plata",
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
      <NewHero />
      <div className="section-divider" />
      <WhatWeOffer />
      <div className="section-divider" />
      <CategoryGrid />
      <div className="section-divider" />
      <MapSection />
      <div className="section-divider" />
      <NewCTA />
    </>
  );
}
