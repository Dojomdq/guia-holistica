"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { useRipple } from "@/lib/useRipple";
import { supabase } from "@/lib/supabase/client";

const TAGS = ["Yoga", "Reiki", "Meditación", "Chamanismo", "Tarot"];

export default function SearchSection() {
  const [busqueda, setBusqueda] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const router = useRouter();
  const createRipple = useRipple("rgba(90, 143, 143, 0.35)");

  useEffect(() => {
    async function cargarCiudades() {
      const { data } = await supabase
        .from("facilitadores")
        .select("ubicaciones(ciudad)")
        .eq("activo", true);
      if (data) {
        const set = new Set<string>();
        (data as any[]).forEach((f) => {
          const ubi = f.ubicaciones || [];
          ubi.forEach((u: any) => {
            if (u?.ciudad) set.add(u.ciudad);
          });
        });
        setCiudades(Array.from(set).sort((a, b) => a.localeCompare(b)));
      }
    }
    cargarCiudades();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (busqueda.trim()) params.set("q", busqueda.trim());
    if (ciudad) params.set("ciudad", ciudad);
    const qs = params.toString();
    router.push(`/mapa${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="py-16 sm:py-20 bg-cream-50 dark:bg-bark-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] noise-overlay pointer-events-none" />
      <div className="absolute inset-0 section-radial-sage pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sage-200/25 rounded-full blur-[120px] pointer-events-none animate-drift" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-terracotta-200/15 rounded-full blur-[100px] pointer-events-none animate-floaty" />
      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <span className="label mb-4 block">Búsqueda inteligente</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-bark dark:text-cream-100 text-balance">
            ¿Qué estás buscando?
          </h2>
          <p className="text-bark-600 dark:text-cream-300 mt-3">
            Buscá por actividad o profesional y elegí tu ciudad.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto"
          role="search"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1 flex items-center bg-white dark:bg-bark-900 rounded-2xl border border-cream-300/60 dark:border-bark-700 shadow-medium px-5 focus-within:border-sage-400 dark:focus-within:border-sage-600 focus-within:ring-2 focus-within:ring-sage-200 dark:focus-within:ring-sage-800 transition-all duration-300">
              <Search className="h-5 w-5 text-bark-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Actividad, práctica o profesional (yoga, reiki...)"
                aria-label="Buscar por actividad o profesional"
                className="flex-1 px-4 py-4 bg-transparent text-bark placeholder:text-bark-500 focus:outline-none text-base"
              />
            </div>

            <div className="flex items-center bg-white dark:bg-bark-900 rounded-2xl border border-cream-300/60 dark:border-bark-700 shadow-medium px-4 focus-within:border-sage-400 dark:focus-within:border-sage-600 focus-within:ring-2 focus-within:ring-sage-200 dark:focus-within:ring-sage-800 transition-all duration-300 min-w-[200px]">
              <MapPin className="h-5 w-5 text-bark-400 shrink-0" aria-hidden="true" />
              <select
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                aria-label="Elegir ciudad"
                className="flex-1 px-3 py-4 bg-transparent text-bark focus:outline-none text-base cursor-pointer appearance-none"
              >
                <option value="">Todas las ciudades</option>
                {ciudades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              onClick={createRipple}
              className="ripple-container flex items-center justify-center gap-2 px-8 py-4 bg-sage-600 text-white rounded-2xl text-base font-semibold hover:bg-sage-700 hover:-translate-y-0.5 transition-all duration-300 shrink-0"
              style={{ boxShadow: "0 4px 14px rgba(90, 143, 143, 0.35)" }}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Buscar
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-bark-500 mr-1">
            Búsquedas frecuentes:
          </span>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                router.push(
                  `/mapa?q=${encodeURIComponent(tag.toLowerCase())}${
                    ciudad ? `&ciudad=${encodeURIComponent(ciudad)}` : ""
                  }`
                )
              }
              className="px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-cream-300/50 rounded-full text-[13px] font-medium text-bark-600 hover:bg-sage-50 hover:border-sage-300 hover:text-bark hover:-translate-y-0.5 transition-all duration-300"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}