"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import InstagramIcon from "@/components/ui/InstagramIcon";

interface FacilitadorItem {
  id: string;
  nombre: string;
  bio: string | null;
  direccion: string | null;
  instagram: string | null;
  actividades: string[];
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

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getIcon(slug: string): string {
  for (const [key, icon] of Object.entries(CAT_ICOS)) {
    if (slug.includes(key)) return icon;
  }
  return "🌿";
}

export default function FacilitadoresPage() {
  const [busqueda, setBusqueda] = useState("");
  const [facilitadores, setFacilitadores] = useState<FacilitadorItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("facilitadores")
        .select("id, nombre, bio, direccion, instagram, facilitador_actividades(actividades(nombre, slug))")
        .eq("activo", true)
        .order("nombre");

      if (data) {
        setFacilitadores(
          data.map((f: any) => {
            const acts = f.facilitador_actividades || [];
            const firstSlug = acts[0]?.actividades?.slug || "";
            return {
              id: f.id,
              nombre: f.nombre,
              bio: f.bio,
              direccion: f.direccion,
              instagram: f.instagram,
              actividades: acts.map((a: any) => a.actividades?.nombre).filter(Boolean),
              icono: getIcon(firstSlug),
            };
          })
        );
      }
      setCargando(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!busqueda.trim()) return facilitadores;
    const q = normalizeText(busqueda);
    return facilitadores.filter(
      (f) =>
        normalizeText(f.nombre).includes(q) ||
        f.actividades.some((a) => normalizeText(a).includes(q)) ||
        (f.bio && normalizeText(f.bio).includes(q))
    );
  }, [busqueda, facilitadores]);

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
          Facilitadores
        </h1>
        <p className="text-stone-500 text-lg">
          Conocé a los profesionales de nuestra comunidad
        </p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o actividad..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-stone-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-100 rounded w-2/3" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                  <div className="h-3 bg-stone-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f) => (
              <Link key={f.id} href={`/facilitadores/${f.id}`} className="group">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md hover:border-primary-200 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-2xl flex-shrink-0">
                      {f.icono}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-800 group-hover:text-primary-600 transition-colors">
                        {f.nombre}
                      </h3>
                      <p className="text-sm text-stone-500 mt-0.5 line-clamp-2">
                        {f.bio}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {f.actividades.map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                        {f.direccion && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {f.direccion}
                          </span>
                        )}
                        {f.instagram && (
                          <span className="flex items-center gap-1">
                            <InstagramIcon className="h-3 w-3" />
                            {f.instagram}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-400">
                No se encontraron facilitadores para &quot;{busqueda}&quot;
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
