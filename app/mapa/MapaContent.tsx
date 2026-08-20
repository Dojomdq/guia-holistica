import { Suspense } from "react";
import MapaPageInner from "./MapaPageInner";
import { MapPin } from "lucide-react";

export default function MapaContent() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-cream-50">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-stone-300 mx-auto animate-pulse" />
            <p className="text-stone-400 mt-2">Cargando mapa...</p>
          </div>
        </div>
      }
    >
      <MapaPageInner />
    </Suspense>
  );
}
