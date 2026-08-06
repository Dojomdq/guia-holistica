"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const TAGS = ["Yoga", "Reiki", "Meditación", "Chamanismo", "Tarot"];

export default function SearchSection() {
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(busqueda.trim())}`);
    } else {
      router.push("/mapa");
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-cream-50 relative overflow-hidden">
      <div className="container-wide">
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch gap-3"
          role="search"
        >
          <div className="flex-1 flex items-center bg-white rounded-2xl border border-cream-300/60 shadow-medium px-5 focus-within:border-sage-400 focus-within:ring-2 focus-within:ring-sage-200 transition-all duration-300">
            <Search className="h-5 w-5 text-bark-400 shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscá por actividad (yoga, reiki), ciudad o nombre..."
              aria-label="Buscar por actividad, ciudad o nombre"
              className="flex-1 px-4 py-4 bg-transparent text-bark placeholder:text-bark-500 focus:outline-none text-base"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-sage-600 text-white rounded-2xl text-base font-semibold hover:bg-terracotta-600 hover:shadow-md transition-all duration-200 shrink-0"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-bark-500 mr-1">
            Rápido:
          </span>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)}
              className="px-4 py-1.5 bg-white border border-cream-300/60 rounded-full text-[13px] font-medium text-bark-600 hover:bg-sage-50 hover:border-sage-300 hover:text-bark transition-all duration-300"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
