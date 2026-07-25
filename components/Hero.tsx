"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/mapa");
    }
  };

  return (
    <section className="relative min-h-[92svh] flex items-end overflow-hidden">
      {/* Background — gradient from cream to sage */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50 to-sage-50/20" />

      {/* Content */}
      <div className="relative w-full pb-16 md:pb-20 lg:pb-24">
        <div className="container-page">
          {/* Overline */}
          <div
            className={`mb-4 md:mb-5 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="label !text-sage-600">Mar del Plata · Argentina</span>
          </div>

          {/* Main heading */}
          <div className="max-w-[1000px]">
            <h1
              className={`font-serif text-[clamp(3.25rem,9vw,8rem)] leading-[0.97] tracking-[-0.035em] text-bark mb-6 md:mb-7 transition-all duration-[1200ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Encontrá tu
              <br />
              <span className="text-sage-600">camino al bienestar</span>
            </h1>

            <p
              className={`text-bark/60 text-lg sm:text-xl max-w-2xl leading-relaxed mb-8 md:mb-9 transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Directorio de terapeutas, coaches y facilitadores de bienestar en Mar del Plata.
              Buscá, filtrá y contactá al profesional ideal para vos.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className={`max-w-xl transition-all duration-700 delay-300 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center bg-white/70 backdrop-blur-xl rounded-2xl border border-cream-300 p-2">
                <Search className="ml-4 h-5 w-5 text-bark/30 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="chamanismo, yoga, reiki..."
                  className="flex-1 px-4 py-3.5 bg-transparent text-bark placeholder:text-bark/35 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-7 py-3.5 bg-sand-400 text-bark rounded-xl hover:bg-sand-300 hover:shadow-warm hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold shrink-0 group/btn"
                >
                  Buscar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div
              className={`flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 transition-all duration-700 delay-[500ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {["Yoga", "Reiki", "Meditación", "Chamanismo"].map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)
                  }
                  className="text-bark/40 text-[13px] font-medium hover:text-sage-600 transition-colors duration-300 flex items-center gap-1"
                >
                  {tag}
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
