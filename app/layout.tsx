import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { SITE_URL } from "@/lib/constants";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: "500",
});

export const metadata: Metadata = {
  title: {
    default: "Guía de Bienestar | Encontrá Terapeutas, Yoga y Reiki",
    template: "%s | Guía de Bienestar",
  },
  description:
    "Encontrá facilitadores, terapeutas y guías cerca tuyo. Mapa interactivo con chamanismo, yoga, reiki, meditación, tarot y más.",
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
  authors: [{ name: "Guía de Bienestar" }],
  creator: "Guía de Bienestar",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Guía de Bienestar",
    title: "Guía de Bienestar | Facilitadores, Yoga, Reiki y Más",
    description:
      "Encontrá facilitadores, terapeutas y guías cerca tuyo. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
    url: SITE_URL,
    images: [
      {
        url: "https://res.cloudinary.com/kmxmqr0t/image/upload/w_1200,h_630,c_fill/v1785019465/AF49F0FF-4A15-4EA3-AE9F-AC8F83C11FC0_hkigqu.jpg",
        width: 1200,
        height: 630,
        alt: "Guía de Bienestar - Costa de Mar del Plata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guía de Bienestar",
    description:
      "Encontrá facilitadores, terapeutas y guías cerca tuyo. Mapa interactivo con chamanismo, yoga, reiki y más.",
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
    <html lang="es" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/kmxmqr0t/image/upload/v1785381416/favicon_web_wiy37z.png" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700&display=swap" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
