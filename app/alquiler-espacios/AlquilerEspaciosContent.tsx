"use client";

import { useState, useEffect } from "react";
import { Home, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { WHATSAPP_LINK } from "@/lib/constants";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";

interface EspacioTipo {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
}

const ICONOS: Record<string, string> = {
  salones: "🏛️",
  quintas: "🌳",
  estudios: "📸",
  consultorios: "🩺",
  "espacios-para-talleres": "🪑",
};

export default function AlquilerEspaciosContent() {
  const [espacios, setEspacios] = useState<EspacioTipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const { data: cat } = await supabase
        .from("categorias")
        .select("id")
        .eq("slug", "alquiler-espacios")
        .single();

      if (!cat) {
        setCargando(false);
        return;
      }

      const { data: acts } = await supabase
        .from("actividades")
        .select("id, nombre, slug, descripcion")
        .eq("categoria_id", cat.id)
        .order("nombre");

      setEspacios(acts || []);
      setCargando(false);
    }
    load();
  }, []);

  const contactar = (nombre: string) =>
    `${WHATSAPP_LINK}?text=${encodeURIComponent(
      `Hola, quiero consultar por el alquiler de un espacio (${nombre}). Vengo de la Guía de Bienestar.`
    )}`;

  return (
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <Breadcrumbs items={[{ label: "Alquiler de espacios" }]} />

        <div
          ref={ref}
          className={`max-w-2xl mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full">
            <Home className="h-3 w-3" /> Espacios
          </span>
          <h1 className="heading-lg text-bark mt-4">Alquiler de espacios</h1>
          <p className="text-lg text-bark-700 mt-4 max-w-lg leading-relaxed">
            Salones, quintas, estudios, consultorios y espacios para talleres
            listos para tu actividad, evento o práctica.
          </p>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse h-40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {espacios.map((e, i) => (
              <div
                key={e.id}
                className={`bg-white rounded-2xl border border-cream-200/70 p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="text-3xl mb-3" aria-hidden="true">
                  {ICONOS[e.slug] || "🏠"}
                </div>
                <h2 className="font-serif text-lg font-medium text-bark">
                  {e.nombre}
                </h2>
                {e.descripcion && (
                  <p className="text-sm text-bark-600 leading-relaxed mt-1.5 line-clamp-2">
                    {e.descripcion}
                  </p>
                )}
                <a
                  href={contactar(e.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 w-full btn text-[13px] px-4 py-2.5 bg-amber-600 text-white hover:bg-amber-700 transition-colors rounded-xl"
                >
                  <MessageCircle className="h-4 w-4" />
                  Consultar disponibilidad
                </a>
              </div>
            ))}
          </div>
        )}

        <div
          className={`mt-14 bg-amber-50/60 dark:bg-bark-900/40 border border-amber-200/60 dark:border-bark-700 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex-1">
            <h2 className="font-serif text-xl font-medium text-bark flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              ¿Tenés un espacio para alquilar?
            </h2>
            <p className="text-bark-600 mt-2 leading-relaxed">
              Publicá tu salón, quinta o estudio en la Guía de Bienestar y
              llegá a más personas que buscan un espacio como el tuyo.
            </p>
          </div>
          <a
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
              "Hola, quiero publicar mi espacio en alquiler en la Guía de Bienestar."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 shrink-0 btn bg-bark text-white hover:bg-bark/85 dark:bg-cream-100 dark:text-bark text-[13px] px-5 py-2.5"
          >
            Publicar mi espacio
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
