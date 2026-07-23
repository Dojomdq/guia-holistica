"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryColor, getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";

interface ActividadItem {
  slug: string;
  nombre: string;
  count: number;
}

export default function ActividadesContent() {
  const [actividades, setActividades] = useState<ActividadItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const track = useClickTracker();

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
      const actCategoriaMap: Record<string, string> = {};
      for (const act of acts || []) {
        if (faSet.has(act.id) && act.categoria_id) {
          actCategoriaMap[act.categoria_id] = (actCategoriaMap[act.categoria_id] || 0) + 1;
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
    <div className="container-page py-12">
      <div className="max-w-3xl mb-12">
        <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-2">
          Explorá
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3">
          Actividades
        </h1>
        <p className="text-stone-500 text-lg">
          Encontrá la que necesitás. Cada una tiene facilitadores verificados.
        </p>
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-stone-200 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-stone-100" />
                <div className="h-4 w-8 bg-stone-100 rounded" />
              </div>
              <div className="h-5 bg-stone-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-stone-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actividades.map((a) => {
            const Icon = getCategoryIcon(a.slug);
            const markerColor = CATEGORY_MARKER_COLORS[a.slug] || "#15803d";
            return (
              <Link
                key={a.slug}
                href={`/mapa?q=${a.slug}`}
                className="group"
                onClick={() => track("actividad", a.slug)}
              >
                <div className="bg-white rounded-xl border border-stone-200/60 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/30 hover:-translate-y-0.5 hover:border-stone-300/60">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${markerColor}10` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: markerColor }} />
                    </div>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {a.count}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg text-stone-800 group-hover:text-emerald-700 transition-colors">
                    {a.nombre}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
