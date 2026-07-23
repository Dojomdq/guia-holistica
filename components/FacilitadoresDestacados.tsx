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
    <section className="py-20">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
              Comunidad
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Facilitadores
            </h2>
            <p className="text-stone-500 mt-1">Profesionales de nuestra comunidad</p>
          </div>
          <Link
            href="/facilitadores"
            className="hidden md:inline-flex items-center gap-1.5 text-stone-600 hover:text-emerald-700 font-medium text-sm transition-colors"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden card-hover">
                  <div
                    className="h-2"
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                  />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${color}12` }}
                      >
                        <Icon className="h-7 w-7" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                          {f.nombre}
                        </h3>
                        <p className="text-sm font-medium" style={{ color }}>
                          {f.actividad}
                        </p>
                        {f.bio && (
                          <p className="text-sm text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                            {f.bio}
                          </p>
                        )}
                        {f.direccion && (
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-400">
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

        <div className="md:hidden mt-6 text-center">
          <Link
            href="/facilitadores"
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-emerald-700 font-medium text-sm"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
