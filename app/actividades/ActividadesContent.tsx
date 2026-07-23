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
      <div className="max-w-3xl mb-10">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
          Explorá
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
          Actividades Holísticas
        </h1>
        <p className="text-stone-500 text-lg">
          Explorá todas las actividades disponibles y encontrá la que
          necesitás. Cada una tiene facilitadores verificados en el mapa.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actividades.map((a) => {
            const colorClass = getCategoryColor(a.slug);
            const Icon = getCategoryIcon(a.slug);
            const markerColor = CATEGORY_MARKER_COLORS[a.slug] || "#15803d";
            return (
              <Link
                key={a.slug}
                href={`/mapa?q=${a.slug}`}
                className="group"
                onClick={() => track("actividad", a.slug)}
              >
                <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden card-hover">
                  <div
                    className="h-1.5"
                    style={{ background: `linear-gradient(90deg, ${markerColor}, ${markerColor}66)` }}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${markerColor}12` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: markerColor }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400 text-sm bg-stone-50 px-2.5 py-1 rounded-lg">
                        <Users className="h-3.5 w-3.5" />
                        {a.count}
                      </div>
                    </div>
                    <h2 className="font-bold text-lg text-stone-800 group-hover:text-emerald-700 transition-colors mb-2">
                      {a.nombre}
                    </h2>
                    <div className="flex items-center gap-1.5 text-sm text-stone-400">
                      <MapPin className="h-3.5 w-3.5" />
                      Ver en el mapa
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
