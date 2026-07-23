"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
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
    <section ref={ref} className="section-padding">
      <div className="container-page">
        {/* Header */}
        <div
          className={`flex items-end justify-between mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="section-label">Comunidad</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-warmblack mt-3 tracking-tight">
              Facilitadores
            </h2>
          </div>
          <Link
            href="/facilitadores"
            className="text-xs text-warmblack/55 hover:text-warmblack/80 transition-colors flex items-center gap-1"
          >
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Asymmetric layout: big card left + 2 stacked right */}
        <div
          className={`grid grid-cols-1 md:grid-cols-5 gap-4 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Large card — 3 cols */}
          <Link
            href={`/facilitadores/${first.id}`}
            className="md:col-span-3 group"
            onClick={() => track("facilitador", first.id)}
          >
            <div className="relative h-full bg-white/70 backdrop-blur-sm rounded-3xl border border-cream-300/50 p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-medium hover:border-cream-400/60">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `${CATEGORY_MARKER_COLORS[first.slug] || "#5d8a6e"}10`,
                    }}
                  >
                    {(() => {
                      const Icon = getCategoryIcon(first.slug);
                      return (
                        <Icon
                          className="h-6 w-6"
                          style={{
                            color: CATEGORY_MARKER_COLORS[first.slug] || "#5d8a6e",
                          }}
                          strokeWidth={1.5}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: CATEGORY_MARKER_COLORS[first.slug] || "#5d8a6e",
                      }}
                    >
                      {first.actividad}
                    </p>
                  </div>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-300">
                  {first.nombre}
                </h3>
                {first.bio && (
                  <p className="text-sm text-warmblack/60 mt-3 leading-relaxed line-clamp-3 max-w-md">
                    {first.bio}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-cream-300/40">
                {first.direccion && (
                  <span className="flex items-center gap-1.5 text-xs text-warmblack/45">
                    <MapPin className="h-3 w-3" />
                    {first.direccion}
                  </span>
                )}
                <span className="text-xs text-sage-600 font-medium group-hover:text-sage-700 transition-colors">
                  Ver perfil →
                </span>
              </div>
            </div>
          </Link>

          {/* Two smaller cards — 2 cols, stacked */}
          <div className="md:col-span-2 flex flex-col gap-4">
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
                  <div className="h-full bg-white/70 backdrop-blur-sm rounded-3xl border border-cream-300/50 p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-medium hover:border-cream-400/60">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}10` }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <p className="text-xs font-medium" style={{ color }}>
                          {f.actividad}
                        </p>
                      </div>
                      <h3 className="font-serif text-lg font-medium text-warmblack group-hover:text-sage-700 transition-colors duration-300">
                        {f.nombre}
                      </h3>
                    </div>
                    {f.direccion && (
                      <span className="flex items-center gap-1 text-[11px] text-warmblack/40 mt-3">
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
      </div>
    </section>
  );
}
