"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useRipple } from "@/lib/useRipple";

type SearchMode = "actividad" | "ciudad" | "nombre";

const MODOS: { id: SearchMode; label: string; placeholder: string }[] = [
  {
    id: "actividad",
    label: "Actividad",
    placeholder: "Buscá por actividad (yoga, reiki)...",
  },
  {
    id: "ciudad",
    label: "Ciudad",
    placeholder: "Buscá por ciudad...",
  },
  {
    id: "nombre",
    label: "Nombre",
    placeholder: "Buscá por nombre del profesional...",
  },
];

const TAGS = ["Yoga", "Reiki", "Meditación", "Chamanismo", "Tarot"];

export default function SearchSection() {
  const [busqueda, setBusqueda] = useState("");
  const [modo, setModo] = useState<SearchMode>("actividad");
  const router = useRouter();
  const createRipple = useRipple("rgba(90, 143, 143, 0.35)");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(busqueda.trim())}`);
    } else {
      router.push("/mapa");
    }
  };

  const modoActual = MODOS.find((m) => m.id === modo) ?? MODOS[0];

  return (
    <section className="py-20 sm:py-28 bg-cream-50 dark:bg-bark-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] noise-overlay pointer-events-none" />
      <div className="absolute inset-0 section-radial-sage pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-sage-200/30 rounded-full blur-[150px] pointer-events-none animate-drift" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-terracotta-200/20 rounded-full blur-[130px] pointer-events-none animate-floaty" />
      <div className="container-wide relative z-10">
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto"
          role="search"
        >
          <div className="flex flex-wrap justify-center gap-0 mb-5 border-b border-cream-200 dark:border-bark-700">
            {MODOS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModo(m.id);
                  setBusqueda("");
                }}
                className={`px-5 py-2.5 text-[14px] font-medium transition-all duration-200 relative -mb-px ${
                  modo === m.id
                    ? "text-bark dark:text-cream-100 border-b-2 border-sage-600 dark:border-sage-400"
                    : "text-bark-500 dark:text-cream-400 hover:text-bark-600 dark:hover:text-cream-300 border-b-2 border-transparent"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1 flex items-center bg-white dark:bg-bark-900 rounded-2xl border border-cream-300/60 dark:border-bark-700 shadow-medium px-5 focus-within:border-sage-400 dark:focus-within:border-sage-600 focus-within:ring-2 focus-within:ring-sage-200 dark:focus-within:ring-sage-800 transition-all duration-300">
              <Search className="h-5 w-5 text-bark-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={modoActual.placeholder}
                aria-label={`Buscar por ${modoActual.label.toLowerCase()}`}
                className="flex-1 px-4 py-4 bg-transparent text-bark placeholder:text-bark-500 focus:outline-none text-base"
              />
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
              onClick={() => router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)}
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
