"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";
import { useScrollReveal } from "@/lib/useScrollReveal";

interface FacilitadorDestacado {
  id: string;
  nombre: string;
  actividad: string;
  bio: string | null;
  direccion: string | null;
  slug: string;
}

export default function FacilitadoresDestacados() {
  const [destacados, setDestacados] = useState<FacilitadorDestacado[]>([]);
  const track = useClickTracker();
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select(
          "id, nombre, bio, direccion, facilitador_actividades(actividades(nombre, slug))"
        )
        .eq("activo", true)
        .limit(3);

      if (data) {
        setDestacados(
          data.map((f: any) => {
            const act = f.facilitador_actividades?.[0]?.actividades;
            return {
              id: f.id,
              nombre: f.nombre,
              actividad: act?.nombre || "Holística",
              bio: f.bio,
              direccion: f.direccion,
              slug: act?.slug || "",
            };
          })
        );
      }
    }
    load();
  }, []);

  if (destacados.length === 0) return null;

  const [first, ...rest] = destacados;

  return (
    <section ref={ref} className="py-5 sm:py-7 lg:py-9">
      <div className="container-page">
        {/* Header */}
        <div
          className={`flex items-end justify-between mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div>
            <span className="label">Comunidad</span>
            <h2 className="heading-lg mt-3">
              Facilitadores
            </h2>
          </div>
          <Link
            href="/facilitadores"
            className="btn-ghost text-[13px] hidden sm:inline-flex group"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Asymmetric grid: 3-col big + 2-col stacked */}
        <div
          className={`grid grid-cols-1 md:grid-cols-5 gap-3 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Large card */}
          <Link
            href={`/facilitadores/${first.id}`}
            className="md:col-span-3 group"
            onClick={() => track("facilitador", first.id)}
          >
            <div className="h-full bg-white rounded-2xl border border-cream-200 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-large hover:border-cream-300 hover:-translate-y-0.5">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  {(() => {
                    const Icon = getCategoryIcon(first.slug);
                    const c = CATEGORY_MARKER_COLORS[first.slug] || "#5d8a6e";
                    return (
                      <>
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${c}10` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: c }} strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-medium font-mono uppercase tracking-wider" style={{ color: c }}>
                          {first.actividad}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-300 mb-3">
                  {first.nombre}
                </h3>
                {first.bio && (
                  <p className="text-[15px] text-warmblack/50 leading-relaxed line-clamp-3 max-w-md">
                    {first.bio}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-cream-200">
                {first.direccion && (
                  <span className="flex items-center gap-1.5 text-[13px] text-warmblack/35">
                    <MapPin className="h-3.5 w-3.5" />
                    {first.direccion}
                  </span>
                )}
                <span className="text-[13px] text-sage-600 font-medium group-hover:text-sage-700 transition-colors flex items-center gap-1">
                  Ver perfil
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Stacked cards */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {rest.map((f) => {
              const color = CATEGORY_MARKER_COLORS[f.slug] || "#5d8a6e";
              const Icon = getCategoryIcon(f.slug);
              return (
                <Link
                  key={f.id}
                  href={`/facilitadores/${f.id}`}
                  className="group flex-1"
                  onClick={() => track("facilitador", f.id)}
                >
                  <div className="h-full bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-large hover:border-cream-300 hover:-translate-y-0.5">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}10` }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-medium font-mono uppercase tracking-wider" style={{ color }}>
                          {f.actividad}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-300">
                        {f.nombre}
                      </h3>
                    </div>
                    {f.direccion && (
                      <span className="flex items-center gap-1 text-[12px] text-warmblack/35 mt-3">
                        <MapPin className="h-3 w-3" />
                        {f.direccion}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile link */}
        <Link
          href="/facilitadores"
          className="btn-ghost text-[13px] sm:hidden mt-6 group"
        >
          Ver todos los facilitadores
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
