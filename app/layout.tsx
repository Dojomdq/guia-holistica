import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

const SITE_URL = "https://www.agenciakoi.com";

export const metadata: Metadata = {
  title: {
    default: "Guía Holística Mar del Plata | Facilitadores, Yoga, Reiki y Más",
    template: "%s | Guía Holística Mar del Plata",
  },
  description:
    "Encontrá facilitadores, terapeutas y guías holísticos en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación, tarot y más. Conectá con tu sanación.",
  keywords: [
    "holístico Mar del Plata",
    "chamanismo Mar del Plata",
    "yoga Mar del Plata",
    "reiki Mar del Plata",
    "meditación Mar del Plata",
    "terapias holísticas",
    "sanación energética",
    "facilitadores holísticos",
    "tarot Mar del Plata",
    "aromaterapia",
    "masajes terapéuticos",
  ],
  authors: [{ name: "Guía Holística" }],
  creator: "Guía Holística",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Guía Holística Mar del Plata",
    title: "Guía Holística Mar del Plata | Facilitadores, Yoga, Reiki y Más",
    description:
      "Encontrá facilitadores, terapeutas y guías holísticos en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Guía Holística Mar del Plata",
    description:
      "Encontrá facilitadores, terapeutas y guías holísticos en Mar del Plata. Mapa interactivo con chamanismo, yoga, reiki y más.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
