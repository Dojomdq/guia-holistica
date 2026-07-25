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
      {/* Background — real Mar del Plata coast photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, " +
              "rgba(42,31,20,0.90) 0%, " +
              "rgba(42,31,20,0.78) 15%, " +
              "rgba(42,31,20,0.55) 35%, " +
              "rgba(42,31,20,0.25) 55%, " +
              "rgba(42,31,20,0.10) 75%, " +
              "rgba(42,31,20,0.0) 100%)",
          }}
        />
        {/* Warm tint */}
        <div className="absolute inset-0 bg-terracotta-900/15 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative w-full pb-16 md:pb-20 lg:pb-24">
        <div className="container-page">
          {/* Overline */}
          <div
            className={`mb-4 md:mb-5 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="label-light !text-sand-300/80">Mar del Plata · Argentina</span>
          </div>

          {/* Main heading */}
          <div className="max-w-[1000px]">
            <h1
              className={`font-serif text-[clamp(3.25rem,9vw,8rem)] leading-[0.97] tracking-[-0.035em] text-white mb-6 md:mb-7 transition-all duration-[1200ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Encontrá tu
              <br />
              <span className="text-sand-300/90">camino al bienestar</span>
            </h1>

            <p
              className={`text-white/70 text-lg sm:text-xl max-w-2xl leading-relaxed mb-8 md:mb-9 transition-all duration-700 delay-200 ${
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
              <div className="flex items-center bg-white/[0.10] backdrop-blur-xl rounded-2xl border border-white/[0.12] p-2">
                <Search className="ml-4 h-5 w-5 text-white/35 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="chamanismo, yoga, reiki..."
                  className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-base"
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
                  className="text-white/45 text-[13px] font-medium hover:text-sand-300 transition-colors duration-300 flex items-center gap-1"
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
