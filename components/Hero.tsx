"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const rotatingWords = [
  "Bienestar",
  "Transformación",
  "Conexión",
  "Conciencia",
  "Armonía",
];

export default function Hero() {
  const [search, setSearch] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords.length);
        setFading(false);
      }, 350);
    }, 3000);
    return () => clearInterval(id);
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
    <section className="relative min-h-[100svh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1693218960371-fe6fcad32838?w=1920&h=1080&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient — starts darkening from the very top, smooth ramp */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, " +
              "rgba(26,21,16,0.25) 0%, " +
              "rgba(26,21,16,0.30) 10%, " +
              "rgba(26,21,16,0.40) 20%, " +
              "rgba(26,21,16,0.52) 35%, " +
              "rgba(26,21,16,0.65) 50%, " +
              "rgba(26,21,16,0.78) 65%, " +
              "rgba(26,21,16,0.88) 80%, " +
              "rgba(26,21,16,0.95) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full pb-10 md:pb-14 lg:pb-16">
        <div className="container-page">
          {/* Overline */}
          <div
            className={`mb-3 md:mb-4 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="label-light">Mar del Plata · Argentina</span>
          </div>

          {/* Main heading */}
          <div className="max-w-[900px]">
            <h1
              className={`font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[1.02] tracking-[-0.03em] text-white mb-4 md:mb-5 transition-all duration-[1200ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Encontrá tu
              <br />
              <span className="relative inline-block h-[1.1em] align-bottom">
                <span className="invisible" aria-hidden="true">
                  Transformación
                </span>
                <span
                  className={`absolute left-0 bottom-0 whitespace-nowrap transition-opacity duration-300 ${
                    fading ? "opacity-0" : "opacity-100"
                  }`}
                  aria-live="polite"
                >
                  {rotatingWords[wordIndex]}
                </span>
              </span>
            </h1>

            <p
              className={`text-white/55 text-base sm:text-lg max-w-md leading-relaxed mb-5 md:mb-6 transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Facilitadores, terapeutas y guías de sanación
              en un solo lugar.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className={`max-w-lg transition-all duration-700 delay-300 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center bg-white/[0.12] backdrop-blur-md rounded-xl border border-white/[0.1] p-1.5">
                <Search className="ml-4 h-4 w-4 text-white/40 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="chamanismo, yoga, reiki..."
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/90 text-warmblack rounded-lg hover:bg-white transition-all duration-300 text-sm font-medium shrink-0 group/btn"
                >
                  Buscar
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div
              className={`flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 transition-all duration-700 delay-[500ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {["Yoga", "Reiki", "Meditación", "Chamanismo"].map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    router.push(`/mapa?q=${encodeURIComponent(tag.toLowerCase())}`)
                  }
                  className="text-white/40 text-[13px] font-medium hover:text-white/75 transition-colors duration-300 flex items-center gap-1"
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
