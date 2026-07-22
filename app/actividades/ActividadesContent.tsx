"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryColor, getCategoryIcon } from "@/lib/categories";
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
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actividades.map((a) => {
            const colorClass = getCategoryColor(a.slug);
            const Icon = getCategoryIcon(a.slug);
            return (
              <Link
                key={a.slug}
                href={`/mapa?q=${a.slug}`}
                className="group"
                onClick={() => track("actividad", a.slug)}
              >
                <div
                  className={`${colorClass} border rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="h-8 w-8" />
                    <div className="flex items-center gap-1 text-stone-400 text-sm">
                      <Users className="h-4 w-4" />
                      {a.count}
                    </div>
                  </div>
                  <h2 className="font-bold text-stone-800 group-hover:text-primary-600 transition-colors mb-1">
                    {a.nombre}
                  </h2>
                  <div className="flex items-center gap-1 text-sm text-stone-500">
                    <MapPin className="h-3.5 w-3.5" />
                    Ver en el mapa
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
