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
    <section className="relative min-h-[88svh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1693218960371-fe6fcad32838?w=1920&h=1080&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient — stronger for better contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, " +
              "rgba(26,21,16,0.30) 0%, " +
              "rgba(26,21,16,0.38) 10%, " +
              "rgba(26,21,16,0.48) 20%, " +
              "rgba(26,21,16,0.58) 35%, " +
              "rgba(26,21,16,0.70) 50%, " +
              "rgba(26,21,16,0.82) 65%, " +
              "rgba(26,21,16,0.92) 80%, " +
              "rgba(26,21,16,0.97) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full pb-14 md:pb-18 lg:pb-20">
        <div className="container-page">
          {/* Overline */}
          <div
            className={`mb-4 md:mb-5 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="label-light !text-white/70">Mar del Plata · Argentina</span>
          </div>

          {/* Main heading — bigger, stronger */}
          <div className="max-w-[1000px]">
            <h1
              className={`font-serif text-[clamp(3rem,8.5vw,7.5rem)] leading-[1.0] tracking-[-0.03em] text-white mb-5 md:mb-6 transition-all duration-[1200ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Encontrá tu
              <br />
              <span>camino al bienestar</span>
            </h1>

            <p
              className={`text-white/75 text-lg sm:text-xl max-w-2xl leading-relaxed mb-7 md:mb-8 transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Directorio de terapeutas, coaches y facilitadores de bienestar en Mar del Plata.
              Buscá, filtrá y contactá al profesional ideal para vos.
            </p>

            {/* Search — bigger, more breathing room */}
            <form
              onSubmit={handleSearch}
              className={`max-w-xl transition-all duration-700 delay-300 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center bg-white/[0.12] backdrop-blur-md rounded-2xl border border-white/[0.12] p-2">
                <Search className="ml-4 h-5 w-5 text-white/40 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="chamanismo, yoga, reiki..."
                  className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold shrink-0 group/btn"
                >
                  Buscar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </form>

            {/* Quick links — brighter hover */}
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
                  className="text-white/50 text-[13px] font-medium hover:text-white transition-colors duration-300 flex items-center gap-1"
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
