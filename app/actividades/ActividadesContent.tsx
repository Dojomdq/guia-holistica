"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";
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

  const featured = actividades.find((a) => a.slug === "alquiler-espacios");
  const rest = actividades.filter((a) => a.slug !== "alquiler-espacios");
  const featuredMarker =
    CATEGORY_MARKER_COLORS["alquiler-espacios"] || "#b45309";

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
    <div className="bg-gradient-to-b from-cream-50 via-sage-50/20 to-cream-50 min-h-screen">
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
      <div className="container-page py-16 sm:py-20 lg:py-24">
        <Breadcrumbs items={[{ label: "Actividades" }]} />
        <div
          ref={ref}
          className={`max-w-2xl mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="label">Explorá</span>
          <h1 className="heading-lg text-bark mt-4">
            Actividades
          </h1>
          <p className="text-lg text-bark-700 mt-4 max-w-lg">
            Encontrá la que necesitás. Cada una tiene facilitadores verificados.
          </p>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cream-200" />
                  <div className="h-3 w-6 bg-cream-200 rounded" />
                </div>
                <div className="h-4 bg-cream-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-cream-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {featured && (
              <section
                aria-labelledby="alquiler-espacios-heading"
                className="mb-14"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="label">¿Buscás un espacio?</span>
                </div>
                <Link
                  href="/actividades/alquiler-espacios"
                  onClick={() => track("actividad", "alquiler-espacios")}
                  className="group block"
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      backgroundColor: `${featuredMarker}0d`,
                      borderColor: `${featuredMarker}2e`,
                    }}
                  >
                    <div
                      className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10"
                      style={{ backgroundColor: featuredMarker }}
                    />
                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${featuredMarker}1a` }}
                      >
                        <Home className="h-7 w-7" style={{ color: featuredMarker }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h2
                            id="alquiler-espacios-heading"
                            className="font-serif text-2xl sm:text-3xl font-medium text-bark"
                          >
                            {featured.nombre}
                          </h2>
                          <ArrowUpRight className="h-5 w-5 text-bark-400 transition-all duration-300 group-hover:text-bark group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <p className="text-[15px] text-bark-600 mt-1.5 max-w-md leading-relaxed">
                          Salones, quintas, estudios, consultorios y espacios
                          para talleres listos para tu actividad.
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 text-[12px] font-mono text-bark-500 shrink-0 rounded-full px-3.5 py-1.5"
                        style={{ backgroundColor: `${featuredMarker}14` }}
                      >
                        <Users className="h-3.5 w-3.5" />
                        {featured.count}{" "}
                        {featured.count === 1 ? "facilitador" : "facilitadores"}
                      </span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            <section aria-label="Actividades por categoría">
              <div className="flex items-center gap-3 mb-6">
                <span className="label">Categorías</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rest.map((a, i) => {
                  const Icon = getCategoryIcon(a.slug);
                  const markerColor =
                    CATEGORY_MARKER_COLORS[a.slug] || "#5d8a6e";
                  return (
                    <Link
                      key={a.slug}
                      href={`/actividades/${a.slug}`}
                      className="group"
                      onClick={() => track("actividad", a.slug)}
                    >
                      <div
                        className={`bg-white rounded-2xl border border-cream-200/80 p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg h-full ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: `${i * 30}ms` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${markerColor}12` }}
                          >
                            <Icon
                              className="h-5 w-5"
                              style={{ color: markerColor }}
                              strokeWidth={1.5}
                            />
                          </div>
                          <span className="text-[11px] text-bark-400 font-mono flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {a.count}
                          </span>
                        </div>
                        <h2 className="text-[15px] font-medium text-bark group-hover:text-sage-700 transition-colors duration-200 flex items-center gap-2">
                          {a.nombre}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
                        </h2>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
