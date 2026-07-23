"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getCategoryIcon, CATEGORY_MARKER_COLORS } from "@/lib/categories";
import { useClickTracker } from "@/lib/useClickTracker";

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

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select("id, nombre, bio, direccion, facilitador_actividades(actividades(nombre, slug))")
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
    <section className="py-24">
      <div className="container-page">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-emerald-600 text-sm font-medium tracking-wide uppercase mb-2">
              Comunidad
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">
              Facilitadores
            </h2>
          </div>
          <Link
            href="/facilitadores"
            className="hidden md:inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destacados.map((f) => {
            const color = CATEGORY_MARKER_COLORS[f.slug] || "#15803d";
            const Icon = getCategoryIcon(f.slug);
            return (
              <Link
                key={f.id}
                href={`/facilitadores/${f.id}`}
                className="group"
                onClick={() => track("facilitador", f.id)}
              >
                <div className="relative bg-white rounded-2xl border border-stone-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/30 hover:-translate-y-1">
                  <div className="p-7">
                    <div className="flex items-start gap-5">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${color}10` }}
                      >
                        <Icon className="h-8 w-8" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xl text-stone-900 group-hover:text-emerald-700 transition-colors">
                          {f.nombre}
                        </h3>
                        <p className="text-sm font-medium mt-0.5" style={{ color }}>
                          {f.actividad}
                        </p>
                        {f.bio && (
                          <p className="text-sm text-stone-400 mt-3 line-clamp-2 leading-relaxed">
                            {f.bio}
                          </p>
                        )}
                        {f.direccion && (
                          <div className="flex items-center gap-1.5 mt-4 text-xs text-stone-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {f.direccion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link
            href="/facilitadores"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
