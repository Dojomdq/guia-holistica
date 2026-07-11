"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface FacilitadorDestacado {
  id: string;
  nombre: string;
  actividad: string;
  bio: string | null;
  direccion: string | null;
  icono: string;
}

const CAT_ICOS: Record<string, string> = {
  chamanismo: "🪶", yoga: "🧘", reiki: "✋", meditacion: "🕯️",
  tarot: "🔮", astrologia: "⭐", "sanacion-energetica": "💫",
  "terapias-holisticas": "🌿", "circulos-de-mujeres": "🌙",
  "cacao-ceremonia": "🍫", "flores-de-bach": "🌸",
  "sonidos-y-vibraciones": "🔔", aromaterapia: "🫧",
  numerologia: "🔢", pranoterapia: "🌬️",
  "limpieza-energetica": "✨", "plantas-medicinales": "🍃",
  "masajes-terapeuticos": "💆",
};

function getIcon(slug: string): string {
  for (const [key, icon] of Object.entries(CAT_ICOS)) {
    if (slug.includes(key)) return icon;
  }
  return "🌿";
}

export default function FacilitadoresDestacados() {
  const [destacados, setDestacados] = useState<FacilitadorDestacado[]>([]);

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
              icono: getIcon(act?.slug || ""),
            };
          })
        );
      }
    }
    load();
  }, []);

  if (destacados.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Facilitadores</h2>
            <p className="text-gray-500">Profesionales de nuestra comunidad</p>
          </div>
          <Link href="/facilitadores" className="hidden md:inline-flex text-gray-600 hover:text-gray-900 font-medium text-sm">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {destacados.map((f) => (
            <Link key={f.id} href={`/facilitadores/${f.id}`} className="group">
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xl flex-shrink-0">
                    {f.icono}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {f.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{f.actividad}</p>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{f.bio}</p>
                    {f.direccion && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {f.direccion}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden mt-4 text-center">
          <Link href="/facilitadores" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Ver todos →</Link>
        </div>
      </div>
    </section>
  );
}
