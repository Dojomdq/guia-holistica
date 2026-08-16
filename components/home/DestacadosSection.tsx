"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";

interface Destacado {
  id: string;
  facilitador_id: string;
  facilitadores: {
    id: string;
    nombre: string;
    bio: string | null;
    foto_url: string | null;
    slug: string | null;
    facilitador_actividades: { actividades: { nombre: string; slug: string } | null }[] | null;
  } | null;
}

export default function DestacadosSection() {
  const [destacados, setDestacados] = useState<Destacado[]>([]);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const [manualRes, premiumRes] = await Promise.all([
        supabase
          .from("destacados")
          .select("id, facilitador_id, facilitadores(id, nombre, bio, foto_url, slug, facilitador_actividades(actividades(nombre, slug)))")
          .eq("tipo", "sitio")
          .eq("activo", true),
        supabase
          .from("facilitador_planes")
          .select("facilitador_id, planes(perfil_destacado), facilitadores(id, nombre, bio, foto_url, slug, activo, facilitador_actividades(actividades(nombre, slug)))")
          .eq("estado", "activo"),
      ]);

      const manuales = (manualRes.data || []) as Destacado[];
      const idsManuales = new Set(manuales.map((d) => d.facilitador_id));

      // Premium (perfil destacado) auto-incluidos
      const premium: Destacado[] = (premiumRes.data || [])
        .filter((p: any) => p.planes?.perfil_destacado && p.facilitadores?.activo)
        .filter((p: any) => !idsManuales.has(p.facilitador_id))
        .map((p: any) => ({
          id: p.facilitador_id,
          facilitador_id: p.facilitador_id,
          facilitadores: p.facilitadores,
        }));

      setDestacados([...manuales, ...premium]);
    }
    load();
  }, []);

  if (destacados.length === 0) return null;

  return (
    <section ref={ref} className="py-12 sm:py-16 bg-cream-50 dark:bg-bark-950">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-semibold tracking-[0.14em] uppercase rounded-full mb-4">
            <Star className="h-3 w-3" /> Del mes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-bark dark:text-cream-100">Destacados del mes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {destacados.map((d, i) => {
            const f = d.facilitadores;
            if (!f) return null;
            const act = f.facilitador_actividades?.[0]?.actividades;
            const Icon = getCategoryIcon(act?.slug || "");
            const color = CATEGORY_MARKER_COLORS[act?.slug || ""] || "#5d8a6e";
            return (
              <Link
                key={d.id}
                href={`/facilitadores/${f.slug || f.id}`}
                className={`group bg-white dark:bg-bark-900 rounded-2xl border border-cream-200/80 dark:border-bark-700/80 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}12` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-medium text-bark dark:text-cream-100 truncate">{f.nombre}</h3>
                    {act && <p className="text-xs text-bark-500 truncate">{act.nombre}</p>}
                  </div>
                </div>
                {f.bio && <p className="text-sm text-bark-600 dark:text-cream-300 line-clamp-2 leading-relaxed">{f.bio}</p>}
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-sage-600 mt-3">
                  Ver perfil
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
