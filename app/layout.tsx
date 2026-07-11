import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guía Holística | Conectá con la Sanación",
  description:
    "Encontrá facilitadores, terapeutas y guías holísticos en tu ciudad. Mapa interactivo con chamanismo, yoga, reiki, meditación y más.",
  keywords: [
    "holístico",
    "chamanismo",
    "yoga",
    "reiki",
    "meditación",
    "terapias holísticas",
    "sanación energética",
    "facilitadores",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
