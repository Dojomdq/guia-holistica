import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
      <div className="text-center px-6">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-sage-600">
          Error 404
        </span>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-medium text-bark mt-4 leading-[1.1] tracking-[-0.02em]">
          Página no encontrada
        </h1>
        <p className="text-bark-600 mt-4 max-w-md mx-auto leading-relaxed">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-bark text-white rounded-full text-sm font-medium hover:bg-bark/85 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
