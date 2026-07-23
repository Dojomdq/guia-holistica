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

  return (
    <section ref={ref} className="section-padding">
      <div className="container-page">
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <span className="section-label">Comunidad</span>
            <h2 className="heading-section mt-4">Facilitadores</h2>
            <p className="text-body mt-4 max-w-md">
              Profesionales verificados que guían tu proceso de sanación.
            </p>
          </div>
          <Link
            href="/facilitadores"
            className="hidden sm:inline-flex btn-ghost group/link"
          >
            Ver todos
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {destacados.map((f, i) => {
            const color = CATEGORY_MARKER_COLORS[f.slug] || "#5d8a6e";
            const Icon = getCategoryIcon(f.slug);
            return (
              <Link
                key={f.id}
                href={`/facilitadores/${f.id}`}
                className="group"
                onClick={() => track("facilitador", f.id)}
              >
                <div
                  className={`card-base h-full ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100 + 200}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                      style={{ backgroundColor: `${color}08` }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="heading-card group-hover:text-sage-700 transition-colors duration-300">
                        {f.nombre}
                      </h3>
                      <p
                        className="text-sm font-medium mt-1"
                        style={{ color }}
                      >
                        {f.actividad}
                      </p>
                    </div>
                  </div>

                  {f.bio && (
                    <p className="text-small mt-5 line-clamp-2">{f.bio}</p>
                  )}

                  {f.direccion && (
                    <div className="flex items-center gap-1.5 mt-5 text-xs text-warmblack/40">
                      <MapPin className="h-3.5 w-3.5" />
                      {f.direccion}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="sm:hidden mt-10 text-center">
          <Link href="/facilitadores" className="btn-ghost group/link">
            Ver todos
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
