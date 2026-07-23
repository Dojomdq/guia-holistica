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
    <div className="section-pad">
      <div className="container-page">
        <div
          ref={ref}
          className={`max-w-2xl mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="label">Explorá</span>
          <h1 className="heading-xl mt-4">Actividades</h1>
          <p className="body-lg mt-4 max-w-lg">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actividades.map((a, i) => {
              const Icon = getCategoryIcon(a.slug);
              const markerColor =
                CATEGORY_MARKER_COLORS[a.slug] || "#5d8a6e";
              return (
                <Link
                  key={a.slug}
                  href={`/mapa?q=${a.slug}`}
                  className="group"
                  onClick={() => track("actividad", a.slug)}
                >
                  <div
                    className={`card h-full ${
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
                      <span className="text-[11px] text-warmblack/25 font-mono flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {a.count}
                      </span>
                    </div>
                    <h2 className="text-[15px] font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-200 flex items-center gap-2">
                      {a.nombre}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
