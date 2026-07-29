import { Suspense } from "react";
import MapaPageInner from "./MapaPageInner";
import { MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/constants";

export default function MapaContent() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Mapa" },
            ],
          }),
        }}
      />
      <div className="container-page pt-16 sm:pt-20 lg:pt-24">
        <Breadcrumbs items={[{ label: "Mapa" }]} />
      </div>
      <Suspense
      fallback={
        <div className="h-[500px] sm:h-[560px] md:h-[620px] lg:h-[660px] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-stone-300 mx-auto animate-pulse" />
            <p className="text-stone-400 mt-2">Cargando mapa...</p>
          </div>
        </div>
      }
    >
      <MapaPageInner />
    </Suspense>
    </div>
  );
}
