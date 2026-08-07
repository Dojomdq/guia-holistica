"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowUpRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import {
  getCategoryIcon,
  CATEGORY_MARKER_COLORS,
} from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/constants";

interface ActividadItem {
  slug: string;
  nombre: string;
  count: number;
}

export default function ActividadesContent() {
  const [actividades, setActividades] = useState<ActividadItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const track = useClickTracker();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const { data: cats } = await supabase
        .from("categorias")
        .select("id, nombre, slug, icono");

      if (!cats) {
        setCargando(false);
        return;
      }

      const { data: acts } = await supabase
        .from("actividades")
        .select("id, slug, categoria_id");

      const { data: fas } = await supabase
        .from("facilitador_actividades")
        .select("actividad_id");

      const faSet = new Set((fas || []).map((f) => f.actividad_id));
      const actCategoriaMap: Record<string, number> = {};
      for (const act of acts || []) {
        if (faSet.has(act.id) && act.categoria_id) {
          actCategoriaMap[act.categoria_id] =
            (actCategoriaMap[act.categoria_id] || 0) + 1;
        }
      }

      const result: ActividadItem[] = cats.map((cat) => ({
        slug: cat.slug,
        nombre: cat.nombre,
        count: actCategoriaMap[cat.id] || 0,
      }));

      setActividades(result);
      setCargando(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Actividades" },
            ],
          }),
        }}
      />
      {!cargando && actividades.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Actividades de bienestar disponibles",
              itemListElement: actividades.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.nombre,
                url: `${SITE_URL}/actividades/${a.slug}`,
              })),
            }),
          }}
        />
      )}

      <div className="relative overflow-hidden bg-gradient-to-b from-sage-50 via-white to-cream-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sand-200/30 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="relative container-page py-16 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Actividades" }]} />
          <div
            ref={ref}
            className={`max-w-2xl mb-14 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-600 text-white text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-6">
              <Sparkles className="h-3 w-3" />
              Descubrí
            </span>
            <h1 className="heading-lg text-bark">Explorá actividades</h1>
            <p className="text-lg text-bark-600 mt-4 max-w-lg leading-relaxed">
              Cada categoría tiene profesionales verificados listos para acompañarte.
            </p>
          </div>

          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-cream-200" />
                    <div className="h-4 w-8 bg-cream-200 rounded-full" />
                  </div>
                  <div className="h-4 bg-cream-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-cream-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {actividades.map((a, i) => {
                const Icon = getCategoryIcon(a.slug);
                const markerColor =
                  CATEGORY_MARKER_COLORS[a.slug] || "#5d8a6e";
                return (
                  <Link
                    key={a.slug}
                    href={`/actividades/${a.slug}`}
                    className="group block"
                    onClick={() => track("actividad", a.slug)}
                  >
                    <div
                      className="relative bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full opacity-100 translate-y-0"
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: markerColor,
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                          style={{ backgroundColor: `${markerColor}18` }}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{ color: markerColor }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cream-50 rounded-full text-[11px] font-medium text-bark-500 border border-cream-200/60">
                          <Users className="h-3 w-3" />
                          {a.count}
                        </span>
                      </div>
                      <h2 className="text-[15px] font-semibold text-bark group-hover:text-sage-700 transition-colors duration-200 flex items-center gap-2">
                        {a.nombre}
                        <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
                      </h2>
                      <p className="text-[13px] text-bark-500 mt-1.5">
                        {a.count > 0
                          ? `${a.count} profesional${a.count !== 1 ? "es" : ""} disponible${a.count !== 1 ? "s" : ""}`
                          : "Próximamente"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
